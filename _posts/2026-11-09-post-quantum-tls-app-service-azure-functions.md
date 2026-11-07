---
title: "Preparing Azure App Service and Azure Functions TLS for post-quantum cryptography"
author_name: "Byron Tardif"
---

Azure App Service and Azure Functions are beginning a phased rollout of support
for the TLS 1.3 hybrid key exchange group **`X25519MLKEM768`**.

This update helps prepare applications for a post-quantum future without
requiring you to change your application code or platform configuration.
The rollout will expand progressively across App Service infrastructure in
public Azure later this year.

## Why post-quantum key exchange matters

Today's commonly used public-key algorithms could eventually be vulnerable to
cryptographically relevant quantum computers. Although such systems are not
available today, encrypted traffic collected now could potentially be retained
and decrypted in the future. This is commonly described as a
**harvest-now, decrypt-later** threat.

[Post-quantum cryptography](https://quantum.microsoft.com/vision/quantum-cryptography-overview)
uses algorithms designed to resist attacks from both classical and quantum
computers. Introducing these algorithms into TLS key exchange is an important
step toward protecting the long-term confidentiality of inbound client traffic
and advancing Microsoft's broader
[quantum-safe security strategy](https://www.microsoft.com/security/blog/2025/08/20/quantum-safe-security-progress-towards-next-generation-cryptography/).

## How hybrid key exchange works

`X25519MLKEM768` combines two key-establishment mechanisms:

- **X25519**, a widely deployed classical elliptic-curve algorithm.
- **ML-KEM-768**, a post-quantum key encapsulation mechanism standardized by NIST.

Using a hybrid group provides defense in depth during the transition to
post-quantum cryptography. The TLS connection derives its key material from
both the classical and post-quantum mechanisms rather than depending only on a
new algorithm.

`X25519MLKEM768` is a TLS supported group for key exchange. It is **not a TLS
cipher suite**, and this rollout does not change the App Service minimum TLS
cipher-suite configuration. Microsoft documents this and other post-quantum
hybrid groups in the
[Windows TLS supported-groups reference](https://learn.microsoft.com/windows/win32/secauthn/tls-supported-groups-in-windows-11-24h2-and-later).

## What this means for your applications

When both the client and the App Service front end support TLS 1.3 and
`X25519MLKEM768`, they can automatically negotiate the hybrid key exchange
during the TLS handshake.

Clients that do not support the hybrid group will continue to negotiate an
existing classical key exchange. This fallback helps preserve compatibility
with browsers, application frameworks, SDKs, proxies, and other clients while
post-quantum support becomes more widely available.

## Scope of protection

This initial rollout applies to **inbound TLS connections** for Azure App Service
Web Apps and Azure Functions apps hosted on App Service infrastructure in
public Azure. It covers Windows and Linux apps across all App Service and Azure
Functions hosting plans that use this infrastructure.

Azure Functions on Azure Container Apps are not included in this rollout
because they use Azure Container Apps ingress rather than the App Service
front-end infrastructure.

App Service terminates the client connection at the front end. When end-to-end
TLS encryption is enabled, App Service establishes a separate TLS connection
between the front end and the worker running the application. Each connection
negotiates TLS independently, so negotiation of `X25519MLKEM768` on the client
connection does not mean that the front-end-to-worker connection uses the same
hybrid key exchange.

End-to-end TLS encryption remains available and continues to protect traffic
between the front end and worker. Post-quantum key exchange for that internal
connection is outside the scope of this initial rollout.

## What you need to know

This is a platform-managed update. You do not need to:

- Modify or redeploy your applications.
- Add an App Service application setting.
- Change your minimum TLS version or cipher-suite configuration.
- Obtain a post-quantum certificate.

Hybrid post-quantum key exchange does not change certificate requirements or
bindings.

Client platforms will use the hybrid group automatically when they support it
and it is available on the App Service front end handling the connection.

The initial release uses platform-managed, opportunistic negotiation. There is
no customer setting to enable or require the hybrid group, and minimum TLS or
cipher-suite settings do not control it. Setting the minimum TLS version to
1.3 does not require post-quantum key exchange: TLS 1.3 clients that support only
classical key exchange can still connect.

## Performance and compatibility

Hybrid post-quantum key exchange exchanges more data and requires additional
cryptographic work when establishing a new TLS connection. Microsoft testing
found the expected increase in TLS handshake time.

Applications and clients that reuse established TLS connections do not repeat
the key exchange for every HTTP request.

Microsoft will monitor negotiation, fallback, latency, connection failures, and
rollout coverage, expanding deployment as validation criteria are met.

## Rollout

The capability will roll out progressively to Azure App Service Web Apps and
Azure Functions apps in public Azure later this year. During the rollout,
availability may vary by region and by the front end serving a connection.

No action is required if a compatible client does not immediately negotiate
`X25519MLKEM768`. Classical TLS key exchange will remain available throughout
the rollout.

## See hybrid post-quantum TLS in action

The following example connects to a Linux Web App running a small .NET probe.
First, an HTTPS request identifies the application and its operating system.
Then, an OpenSSL client offers only `X25519MLKEM768` to verify hybrid key
exchange with the App Service front end.

![Linux App Service demo showing the probe response and a verified TLS 1.3 handshake using X25519MLKEM768]({{ site.baseurl }}/media/2026/11/azure-pqc-linux-demo.gif)

To test your own app from PowerShell, use an OpenSSL client on `PATH`
with support for `X25519MLKEM768` and a trusted certificate chain.
Replace `<your-app-hostname>` with your app's hostname, without `https://`
or a path:

```powershell
$appHost = '<your-app-hostname>'
'' | openssl s_client -connect "${appHost}:443" -servername $appHost `
    -tls1_3 -groups X25519MLKEM768 -brief -no_ign_eof `
    -verify_hostname $appHost -verify_return_error
```

A successful handshake includes:

```text
Protocol version: TLSv1.3
Verification: OK
Negotiated TLS1.3 group: X25519MLKEM768
```

This test deliberately offers only the hybrid group. It will fail if the
client or serving front end does not support that group. Unlike normal
client negotiation, this test does not allow classical fallback.

## Learn more

- [Quantum-safe cryptography overview](https://quantum.microsoft.com/vision/quantum-cryptography-overview)
- [TLS supported groups in Windows](https://learn.microsoft.com/windows/win32/secauthn/tls-supported-groups-in-windows-11-24h2-and-later)
- [Microsoft's quantum-safe security strategy](https://www.microsoft.com/security/blog/2025/08/20/quantum-safe-security-progress-towards-next-generation-cryptography/)
- [Transport Layer Security in Azure App Service](https://learn.microsoft.com/azure/app-service/overview-tls)
- [Azure App Service documentation](https://learn.microsoft.com/azure/app-service/)
