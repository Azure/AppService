---
title: "Secure your Custom Domains at no cost with App Service Managed Certificates (preview)"
author_name: "Yutang Lin"
category: certsdomains
---

Free Transport Layer Security (TLS) for Azure App Service is now in preview! This has been one of the most highly requested features of the service since its inception. The feature is named App Service Managed Certificates and it will let you secure custom domains on your Windows and Linux apps at no additional charge. This provides developers a zero-cost option to work on their dev, test, and production sites. This feature is available for customers on an App Service Plan of Basic and above (free and shared tiers are not supported). The certificate issued will be a standard certificate and not a wildcard certificate. Each certificate will be valid for six months, and about 45 days before the certificate’s expiration date, App Service will renew the certificate.

## App Service Managed Certificates VS App Service Certificates

The offering for App Service Certificates will still be available with the launch of App Service Managed Certificates as these two features have their differences and are better suited for different scenarios. Aside from the main difference of pricing, a major difference between the two is that you will not be able to export your App Service Managed Certificates as they are managed by the platform. If you’re planning to do a live site migration with TXT record, need support for apex domains, or need a wildcard certificate, then use App Service Certificates or bring your own certificate.

## Getting started

To get started, add a CNAME record for the domain to your web app. In the Azure Portal, head to your web app and from the left navigation of your app, select TLS/SSL settings > Private Key Certificates (.pfx) > Create App Service Managed Certificate.

![Create free cert]({{site.baseurl}}/media/2019/11/04/create-free-cert.png)

Once you’ve successfully created your App Service Managed certificate, you’ll see it on the list of Private Key Certificates.

![Finish creating a free cert]({{site.baseurl}}/media/2019/11/04/create-free-cert.png)

For additional reference, see the [documentation](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate).

For any feedback, please reach out by creating an entry on the [developer forums](https://docs.microsoft.com/answers/topics/azure-webapps.html).
