---
title: "App Service Web Apps, Functions, and Logic Apps (Standard) *.azurewebsites.net TLS certificate changes and what you need to know"
author_name: "Yutang Lin"
toc: true
toc_sticky: true
tags:
    - certsdomains
---

**This blog contains information about \*.azurewebsites.net TLS certificate changes for web apps, functions, and logic apps (standard). Customers should not be impacted by this change.** The scope of services affected includes web apps, functions, and logic apps (standard); logic apps (consumption) are not impacted. This change is limited to public Azure cloud; government clouds are not affected. 

Every web apps, functions, or logic apps (standard) has its own default hostname that goes by *“\<resource-name>.azurewebsites.net”* where App Service secures it with a wildcard *\*.azurewebsites.net* TLS certificate. The current TLS certificate issued by Baltimore CyberTrust Root CA is set to expire on July 7th, 2022. Starting April 2022, App Service will begin renewing these TLS certificates and instead use certificates issued by DigiCert Global Root G2 CA. Due to the distributed asynchronous nature of the renewal process, there isn’t an exact date when the certificate will be rotated and visible to individual  web apps, functions, and logic apps (standard). 

**We expect that this change will be a non-event and will not impact customers. However, you may be impacted if an application has incorrectly taken a hard dependency on the \*.azurewebsites.net TLS certificate, for example by way of “certificate pinning”.** Certificate pinning is a practice where an application only allows a specific list of acceptable Certificate Authorities (CAs), public keys, thumbprints, etc. **Applications should never pin to the \*.azurewebsites.net TLS certificate.** Applications requiring certificate stability should use custom domains in conjunction with custom TLS certificates for those domains. You can refer to the [Recommended Best Practices](#recommended-best-practices) section of this article for more information. 

## Recommended Best Practices <a name="recommended-best-practices"></a>

Certificate pinning of *.azurewebsites.net TLS certificates is not recommended because the *.azurewebsites.net TLS certificate could be rotated anytime given the nature of App Service as a Platform as a Service (PaaS). In the event that the service rotates the App Service default wildcard TLS certificate, certificate pinned applications will break and disrupt the connectivity for applications that are hardcoded to a specific set of certificate attributes. The periodicity with which the *.azurewebsites.net TLS certificate is rotated is also not guaranteed since the rotation frequency can change at any time. 

If an application needs to rely on certificate pinning behavior, it is recommended to add a custom domain to a web app, function, or logic app (standard) and provide a custom TLS certificate for the domain which can then be relied on for certificate pinning.  

Note that applications which rely on certificate pinning should also not have a hard dependency on an App Service Managed Certificate. App Service Managed Certificates could be rotated anytime, leading to similar problems for applications that rely on stable certificate properties. It is best practice to provide a custom TLS certificate for applications that rely on certificate pinning. 