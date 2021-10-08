---
title: "Monitoring Key Vault Certificates on Your Web App with Activity Logs"
author_name: "Yutang Lin"
toc: true
toc_sticky: true
tags:
    - certsdomains
---

We are introducing a way for you to monitor your Key Vault Certificates on App Service using Activity Logs. "Key Vault Certificates" refer to two different kinds of certificates that are all managed within Key Vault:

1. [Imported Key Vault certificates](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#import-a-certificate-from-key-vault)
1. [App Service Certificates](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#import-an-app-service-certificate)

Both of these certificates rely on the background sync job of App Service to sync a copy of the new certificate thumbprint to the web app and its associated bindings in the next 24 hours. We understand the need to monitor the activity of the background certificate sync job. In the past, you wouldn't know if the certificate sync job failed and worse, why it failed. Now, with the new Activity Log support, we are providing you more insights to the background job so that you can better monitor your web app.

NOTE: This blog does not cover uploaded certificates because the background job does not support uploaded certificates. Refer to the documentation on [how to renew uploaded certificate](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#renew-an-uploaded-certificate).

## Activity Log Events

There are three Activity Log events to watch out for in regards to KV certificate sync tasks and we'll go through each of them.


| Activity Log Event Name | Description |  
|-------------------------|-------------|
| KeyVaultCertificateRotationStartedWebSite | The background job picked up a new version of a KV certificate. It will begin syncing and updating the certificate in your web app with the new version in KV. |
| KeyVaultCertificateMigrationSucceededWebSite | The background job has successfully completed updating the certificate in your web app with a new version from KV.|
| KeyVaultCertificateMigrationFailedWebSite | The background job failed to update the certificate in your web app with a new version from KV.  |

## Common Errors Failing Certificate Sync Job

When there's an error causing the background job to fail, you will get a `KeyVaultCertificateMigrationFailedWebSite` event. Activity Log will cover common scenarios causing certificate sync to fail. You can check the message section of your Activity Log to find out more information. 

In the event that the background job fails, it will try to sync your certificate again later. You can opt to manually sync your certificates via portal if you needed to sync your certificate immediately.

### The certificate with thumbprint XYZ does not match the hostname '`domain.com`'

``` 
"Message":"Failed to migrate certificate from thumbprint ABC to thumbprint XYZ with error The certificate with thumbprint XYZ does not match the hostname 'domain.com'.."
```

This scenario happens at the web app level where the web app's certificate failed to update with the new version of the certificate in Key Vault because the new version of the certificate's Common Name (CN) or Subject Alternative Name (SAN) does not match at least one domain from the old certificate's CN or SAN. The new version's CN or SAN doesn't necessarily have to be the exact match with the old one, but the background job will be expecting at least one domain to be common between the both of them.

### An existing SSL binding with hostname `www.domain.com` conflicted with a new certificate XYZ

```
{"Message":"An existing SSL binding with hostname www.domain.com conflicted with a new certificate XYZ "} 
```

This scenario happens at the certificate binding level where the binding failed to update with the new thumbprint because the domain used by the binding is not found in the new certificate's CN or SAN. A binding cannot be created if the domain does match the certificate's CN or SAN.


### Failed to update app settings on website to new thumbprint(s)

```
{"Message":"Failed to update app settings on website to new thumbprint(s) {OldABC: NewABC, OldXYZ: NewXYZ}"} 
```

This scenario happens at the App Settings level where the App Settings `WEBSITE_LOAD_CERTIFICATES` failed to update with the new thumbprint values. Refer to the documentation on how to [use a TLS/SSL certificate in your code in Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate-in-code#load-certificate-from-file).

### Cannot modify this site because another operation is in progress.

```
"Message" :"Failed to migrate certificate from thumbprint ABC to thumbprint XYZ with error Cannot modify this site because another operation is in progress."
```

This scenario happens when the background sync job couldn't finish because another operation, such as slot swaps, scaling, or creating new certificate binding, was in progress at the same time. The background job will pick up the sync job again in the next run. 