---
title: 'FAQ on Certificate Authority revocation due to non-compliance of your certificates potentially impacting your App Service'
author_name: "Yutang Lin"
tags: 
    - certificate revocation
toc: true
toc_sticky: true
---

***Azure has reached out to customers who may have been potentially impacted by this issue. If you have been notified with the similar information below, following these steps to [avoid application interruption](#avoiding-application-interruption):***

Certificate Authority (CA) Browser members recently published reports detailing multiple certificates issued by CA vendors that are used by our customers, Microsoft, and the greater technology community that were out of compliance with industry standards for publicly trusted CAs. The reports regarding the non-compliant CAs can be found here:  
1. [Bug 1649951](https://bugzilla.mozilla.org/show_bug.cgi?id=1649951)
1. [Bug 1650910](https://bugzilla.mozilla.org/show_bug.cgi?id=1650910) 


As per the industry’s compliance requirements, CA vendors began revoking non-compliant CAs and issuing compliant CAs which requires customers to have their certificates re-issued. Microsoft is partnering closely with these vendors to minimize the potential impact to Azure Services, **however your self-issued certificates or certificates used in “Bring Your Own Certificate” (BYOC) scenarios are still at risk of being unexpectedly revoked.** 


 If you have been notified about using a self-acquired certificate or using the BYOC feature on App Service that is potentially impacted by this issue, check if certificates utilized by your application have been revoked by referencing [DigiCert’s Announcement](https://knowledge.digicert.com/alerts/DigiCert-ICA-Replacement) and the [Certificate Revocation Tracker](https://misissued.com/#revoked). New certificates need to be requested from the CA vendor utilized in your applications. 

## Avoiding Application Interruptions <a name="avoiding-application-interruption"></a>
To avoid your application’s availability being interrupted due to certificates being unexpectedly revoked, or to update a certificates which has been revoked, follow the steps below:

1. Acquire a new certificate.
1. Once your new certificate has been reissued, [add the new certificate to your web app](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate) by either uploading a new certificate to your web app or by updating the new certificate in your Key Vault 
1. Once you have added your certificate to your web app, you will need to update your bindings [refer to the next section](#safely-updating-bindings). 

## How to safely update your bindings <a name="safely-updating-bindings"></a>

### Certificate Imported from Key Vault to App Service 
_If you are importing your certificate from Key Vault, App Service has a background job that will automatically update your bindings with the new version of your certificate within 48 hours._

If you’re using Key Vault and you would like to immediately update your bindings and not wait for the background job following these steps below: 

***NOTE: If you are using IP SSL bindings – do not \*delete\* your bindings as your inbound IP can change. It is recommended to wait for the platform’s background job to update the bindings with the new version of your certificate to avoid losing your IP address.***

1. Upload the new certificate in Key Vault using a new certificate name 
1. Import the new certificate to your web app 
1. [**Update your binding**](#updating-bindings)
1. Delete the old certificate from App Service 

### Certificate Uploaded to App Service 

If you are uploading a certificate to your app web, you will need to update the bindings with your new certificate following the steps below: 

***Note: If you are using IP SSL bindings – do not \*delete\* your bindings as your IP inbound IP can change.  Instead you must only *update* the IP SSL bindings.***

1. Upload the new certificate to your web app 
1. [**Update your binding**](#updating-bindings)
1. Delete the old certificate from App Service 

## Updating bindings <a name="updating-bindings"></a>

### Through Azure Portal
On Azure portal, go to **“TLS/SSL settings”** under **“Settings”** on the left navigation of your resource, select the binding you would like to update, and look for the new certificate from the dropdown. 

![Updating bindings]({{site.baseurl}}/media/2020/07/updating-bindings.png)

### Through Scripts 
- Refer to the documentation on [sample scripts for Azure CLI and Powershell](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#automate-with-scripts)
    - Note: You can run “New-AzWebAppSSLBinding” to add the new certificate to the existing hostname 
- Refer to the blog [to rotate you certificates with Key Vault using ARM](https://azure.github.io/AppService/2016/05/24/Deploying-Azure-Web-App-Certificate-through-Key-Vault.html#rotating-certificate)