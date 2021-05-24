---
title: "App Service Managed Certificate now in General Availability"
author_name: "Yutang Lin"
toc: true
toc_sticky: true
category: certsdomains
---

App Service Managed Certificate is now in General Availability for both apex domains and sub-domains. This feature allows customers to secure their custom domains on Linux and on Windows with an SSL certificate at no additional cost. This provides developers a zero-cost option to work on their dev, test, and production sites. This certificate offering is a managed experience that allows customers to just set-and-forget as the automatic certificate renewal and the binding update will be handled by App Service. App Service Managed Certificate is not meant to be used as a client certificate and it is only available for customers on multi-tenant App Service Plan of Basic and above (free, shared, and isolated tiers are not supported).   

## App Service Managed Certificate VS App Service Certificate
|                               | App Service Managed Certificate   | App Service Certificate |
| - | - | - |
| Certificate offering          | Standard certificate              | Standard and wilcard certificate |
| Cost                          | No cost                           | $69.99/year for standard and $299.99/year for wildcard |
| Apex domain support           | Yes                               | Yes |
| Sub-domain support            | Yes                               | Yes |
| Auto-renew                    | Yes; cannot opt out               | Yes; can opt out during create or anytime afterwards |
| Auto-update SSL binding       | Yes                               | Yes |


## What to expect post GA?
- There is an upcoming plan to remove thumbprint information from both portal and API to provide our customers a more managed experience for certificates without having to worry about all the details. Also, App Service Managed Certificate is not meant to be used as a client certificate.