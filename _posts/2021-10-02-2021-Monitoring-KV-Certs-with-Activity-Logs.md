---
title: "Monitoring Key Vault Certificates on Your Web App with Activity Logs"
author_name: "Yutang Lin"
toc: true
toc_sticky: true
tags:
    - certsdomains
---

We are introducing a way for you to monitor your Key Vault Certificates on App Service using Activity Logs. "Key Vault Certificates" refer to three different kinds of certificates that are all managed within Key Vault:

1. [Imported Key Vault certificates](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#import-a-certificate-from-key-vault)
1. [App Service Certificates](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#import-an-app-service-certificate)

Both of these certificates rely on the background sync job of App Service to sync a copy of the newer certificate thumbprint to the web app and its associated bindings in the next 24 hours. We understand the need to be able to monitor the activity of the background certificate sync job. In the past, you wouldn't know if the certificate sync job failed and worse, why it failed. So with the new Activity Log support, we are providing you more insights to the background job so that you better monitor your web app.

NOTE: This blog does not cover uploaded certificates because the background job does not support uploaded certificates. Refer to docs on [how to renew uploaded certificate](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#renew-an-uploaded-certificate).

## Activity Log Events

There are three Activity Log events to watch out for in regards to KV certificate sync tasks and we'll go through each of them.


| Activity Log Event Name | Description |  
|-------------------------|-------------|
| KeyVaultCertificateRotationStartedWebSite | The background job picked up a new version of a KV certificate. It will begin syncing and updating the certificate in your web app with the new version in KV. |
| KeyVaultCertificateMigrationSucceededWebSite | The background job has successfully completed updating the certificate in your web app with a new version from KV.|
| KeyVaultCertificateMigrationFailedWebSite | The background job failed to update the certificate in your web app with a new version from KV.  |

## Common Errors Failing Certificate Sync (KeyVaultCertificateMigrationFailedWebSite)

Activity Log will cover common scenarios as to why certificate sync failed. You can check the message section of your Activity Log to find out more information on the failed certificate sync.

### The certificate with thumbprint XYZ does not match the hostname '`domain.com`'

``` 
"Message":"Failed to migrate certificate from thumbprint ABC to thumbprint XYZ with error The certificate with thumbprint XYZ does not match the hostname 'domain.com'.."
```

### Cannot modify this site because another operation is in progress.

```
"Message" :"Failed to migrate certificate from thumbprint ABC to thumbprint XYZ with error Cannot modify this site because another operation is in progress."
```

### An existing SSL binding with hostname `www.domain.com` conflicted with a new certificate XYZ

```
{"Message":"An existing SSL binding with hostname www.domain.com conflicted with a new certificate XYZ "} 
```

### Failed to update app settings on website to new thumbprint(s)

```
{"Message":"Failed to update app settings on website to new thumbprint(s) {ABC1: ABC2, XYZ1: XYZ2}"} 
```

