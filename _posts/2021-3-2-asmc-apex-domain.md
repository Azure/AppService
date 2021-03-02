---
title: "App Service Managed Certificate (Preview) Now Supports Apex Domains"
author_name: "Yutang Lin"
toc: true
toc_sticky: true
tags: certsdomains
---

App Service Managed Certificate (preview) now lets you secure your apex domains on your web apps at no additional charge. This feature is similar to the current App Service Managed Certificate sub-domain support where you can create a standard certificate valid for six months and will automatically renew a month prior expiration.

## Getting started

### Prior creating an App Service Managed Certificate
Before you can create an App Service Managed Certificate, you need to [add an apex domain to your web app by mapping an A record and TXT record to your web app](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain#map-an-a-record). 

### Requirements to successfully create an App Service Managed Certificate <a name="success-requirements"></a>
The validation used by the apex domain support is HTTP token validation, so you want to make sure that you have the following set up, otherwise your certificate validation will fail:
1. You have the correct A record set in your DNS record
1. Your web app is accessible by public internet 
    - DigiCert cannot validate your certificate if your web app is not accessible by public internet.

### Creating an App Service Managed Certificate
In the Azure Portal, head to your web app and from the left navigation of your app, select **TLS/SSL settings > Private Key Certificates (.pfx) > Create App Service Managed Certificate**.

![Create-Managed-Cert-Portal]({{site.baseurl}}/media/2021/01/create-managed-cert.png){: .align-center}

Select your apex domain from the drop down menu and click "Create". It may take up to a few minutes to issue a managed certificate for your apex domain.

![Create-Managed-Cert-Apex-Domain-Portal]({{site.baseurl}}/media/2021/01/create-managed-cert-apex-domain.png){: .align-center}

Once you get a notification of successfully creating a managed certificate, you will see the certificate in the list of "Private Key Certificates". Try to refresh the page if you don't see it on the list despite getting a successful notification.

## FAQ
1. I'm getting "Web app is not accessible by public network" error. What does this mean?

    In order to pass the HTTP token validation, DigiCert will need to be able to access your web app. If your web app has network restrictions, DigiCert will not be able to access your web app and to validate the certificate.

1. Does this have CLI or Powershell support?

    Currently, there is no first class support for apex domain in CLI and Powershell, however, if you need to automate the process, you can try using [ARM template](#arm-template).

1. Can I automate the create process?

    You can automate the create process using ARM template. First class support for CLI and Powershell is still not available.

1. Does this work with Traffic Manager?

    Since this uses HTTP token validation, the validation might not work with Traffic Manager, especially if you have several endpoints enabled. If you create a certificate and then enable other endpoints, you might encounter issues during your certificate renewal.

1. Is it expected that the managed certificate for apex domain to take a bit longer to issue than for sub-domain?

    Yes, your App Service Managed Certificate for apex domain will take a bit longer to issue than for sub-domain because it uses a different validation method.


## ARM Template <a name="arm-template"></a>
You can create an App Service Managed Certificate for your apex domain using ARM Template. Refer to the sample ARM template below:

```

```