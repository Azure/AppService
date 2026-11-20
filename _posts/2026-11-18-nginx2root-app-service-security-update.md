---
title: "NGINX2Root Security Updates on Azure App Service"
author_name: "Igor Titanov"
category: security
toc: true
toc_sticky: true
---

> **Update (18 November 2026):** Azure App Service on Linux began an emergency rollout of updated PHP and WordPress images following the disclosure of NGINX2Root. As of approximately 12:00 PM PT on 18 November 2026, rollout validation was underway for the Latest and Standard Platform Release Channels. We currently expect the rollout to complete by the end of 19 November 2026 PT subject to successful validation.
> **Update (19 November 2026):** Azure App Service on Linux has completed the roll out.

## What the update addresses

The NGINX2Root disclosures describe five vulnerabilities across HTTP/2, HTTP/3, DNS resolution, and mail proxy configurations. The most significant is CVE-2026-123007, for which a successful exploit could execute malicious code with the privileges of the NGINX worker process. App Service's front-end load balancers prevent this HTTP/2 RCE from reaching the application worker.

## CVEs and fixed NGINX releases

The disclosures cover the following CVEs:

| CVE | Affected configuration |
|---|---|
| CVE-2026-123007 | HTTP/2 flow-control memory corruption |
| CVE-2026-123633 | HTTP/2 use-after-free with proxied backend connections |
| CVE-2026-123634 | DNS resolver use-after-free |
| CVE-2026-121810 | HTTP/3 use-after-free |
| CVE-2026-113425 | NGINX mail proxy use-after-free |

See the [NGINX security advisories](https://nginx.org/en/security_advisories.html) for affected versions, fixed releases, and configuration-specific details.

## What we are doing

The App Service team initiated the emergency security response on 18 November 2026. The implementation work updates the NGINX components in the PHP-FPM and WordPress Linux image builds.

## What you should do

1. **For Linux applications, keep built-in PHP or WordPress images on a supported and receiving channel.** Latest receives accelerated updates, while Standard advances through validated rollout stages.
2. **Check the running NGINX version after the update becomes available.** If the fixed NGINX version is present, no additional action is required.
3. **Plan for PHP 8.2 follow-up remediation.** Update to a supported implementation when the separate App Service remediation is available, test your application, and redeploy as needed.
4. **Update custom containers yourself.** Rebuild images with a fixed NGINX release or vendor-provided package update, test the image, and redeploy.
5. **Validate once, then consider your application up to date.** Check the NGINX version used by the running application or an instance in a scaled-out app; if it includes the fixed version, you do not need to repeat the check.

For instructions on viewing or changing your Platform Release Channel, see [Control runtime patch updates with Platform Release Channel](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime#control-runtime-patch-update-timing-with-platform-release-channel).

## Authoritative references

- [Xint NGINX2Root technical disclosure](https://xint.io/)
- [Censys vulnerability advisory](https://censys.com/)
- [CIRCL technical report](https://circl.lu/)
- [NGINX security advisories](https://nginx.org/en/security_advisories.html)
- [Azure Front Door HTTP/2 support](https://learn.microsoft.com/azure/frontdoor/front-door-http2)
- [Azure Application Gateway HTTP/2 FAQ](https://learn.microsoft.com/azure/application-gateway/application-gateway-faq#how-does-application-gateway-support-http2)

Thank you for helping us keep PHP and WordPress applications on Azure App Service secure.
