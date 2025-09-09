---
title: "App Service builds behind proxies: fixing trust with a public certificate"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

**TL;DR**: If your organization uses a TLS-inspecting proxy (e.g., Zscaler), some of the traffic originating from App Service build infrastructure may be re-signed by the proxy. App Service doesn’t trust that proxy cert by default, so the build fails.
Set the app setting **`WEBSITE_INSTALL_PUBLIC_CERTS_IN_KUDU=true`** and upload the proxy’s public certificate (.cer). App Service will install the certificate and your builds will succeed.

---

## Why this happens

During build, App Service downloads build assets from the its build CDN over HTTPS. When a corporate proxy intercepts and re-signs TLS, App Service sees a certificate chain it doesn’t recognize and refuses the connection, causing the build to fail.

## What’s new

A new app setting, **`WEBSITE_INSTALL_PUBLIC_CERTS_IN_KUDU`**, tells App Service to install any **public key certificates (.cer)** you upload into its trust store used for the build.

---

## Step-by-step

### 1) Upload the proxy’s public certificate

In the portal, navigate to your Web App ➜ **Certificates** ➜ **Public key certificates (.cer)** ➜ **Add certificate**.
Upload the organization’s TLS inspection CA (root or intermediate) **public** certificate. 

![Add Certificate]({{site.baseurl}}/media/2025/09/add-cert.jpg)

> Tip: This is a public certificate only—no private key and no password.

### 2) Turn on the app setting

Portal: **Configuration** ➜ **Application settings** ➜ add (Or **Settings** ➜ **Environment Variables** ➜ **App Settings** ➜ Add)
`WEBSITE_INSTALL_PUBLIC_CERTS_IN_KUDU = true` ➜ **Save**. This will automatically restart the app.

CLI (equivalent):

```bash
az webapp config appsettings set \
  -g <resource-group> -n <app-name> \
  --settings WEBSITE_INSTALL_PUBLIC_CERTS_IN_KUDU=true
```

### 3) Verify the certificate is installed

Open **Advanced Tools (Kudu)** ➜ **Bash** and check:

```bash
ls -l /etc/ssl/certs
# (optional) find the installed cert by name or subject
grep -l "<certificate-name>" /etc/ssl/certs/*.crt 

# compare thumbprint
openssl x509 -in /etc/ssl/certs/<your-cert>.crt -noout -fingerprint -sha1
```

Compare the fingerprint with the thumbprint shown for your uploaded cert in the **Certificates** blade.

### 4) Trigger a build

Deploy again (Deployment Center, GitHub Actions, az webapp deployment, etc.).
When the proxy presents its certificate, App Service now trusts it and the application build completes.

---

## Troubleshooting

* **Still seeing x509/certificate unknown errors?**
  Ensure you uploaded the exact CA that signs your proxy’s certs (often an org-specific intermediate), in **.cer** (DER/BASE64) form.

* **Multiple proxies / chains**
  If your environment uses a chain, upload all relevant public CA certs.

* **Scope**
  This affects App Service build infrastructure's outbound trust for the app. It does not grant trust to private keys or change TLS for your site’s inbound traffic.

---

## Summary

By uploading your organization’s proxy CA **public** certificate and enabling **`WEBSITE_INSTALL_PUBLIC_CERTS_IN_KUDU`**, App Service for Linux installs the certificate into its trust store. App Service can then fetch dependencies through Zscaler (or similar proxies) and your builds proceed normally—no more failed builds due to untrusted certificates.
