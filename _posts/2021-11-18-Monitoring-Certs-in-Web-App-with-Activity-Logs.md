---
title: "Monitoring Certificates on Your Web App with Activity Logs"
author_name: "Yutang Lin"
toc: true
toc_sticky: true
tags:
    - certsdomains
---

We are introducing a way for you to monitor your certificates on App Service using Activity Logs. Currently, there are four ways for you to add a certificate to you web app:

1. [Create an App Service Managed Certificate](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#create-a-free-managed-certificate)
1. [Import an App Service Certificate](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#import-an-app-service-certificate)
1. [Import a Key Vault certificate](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#import-a-certificate-from-key-vault)
1. [Upload a private certificate](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#upload-a-private-certificate)<sup> 1 </sup>

<sup> <sup> 1 </sup> This kind of certificate does not support Activity Logs </sup> 

We understand the need to monitor the activity of the background certificate sync job. In the past, you wouldn't know if the certificate sync job failed and worse, why it failed. Now, with the new Activity Log support, we are providing you more insights to the background job so that you can better monitor your web app.

NOTE: This blog does not cover uploaded private certificates because this scenario requires you to upload a new certificate and to update SSL bindings with the new certificate afterwards. The background sync job does not support uploaded certificates. Refer to the documentation on [how to renew uploaded certificate](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#renew-an-uploaded-certificate).

## Activity Log Operation Name

### Imported Certificates

Both imported App Service Certificate and imported certificate from Key Vault rely on the background sync job of App Service to sync the copy of the new certificate thumbprint to the web app certificate and its associated bindings in the next 24 hours.

When the background job sync happens, it will generate some Activity Logs. There are three Activity Log operation name to watch out for in regards to KV certificate sync tasks and we'll go through each of them.


| Activity Log Operation Name | Description |  
|-----------------------------|-------------|
| KeyVaultCertificateRotationStartedWebSite | The background job picked up a new version of a KV certificate. It will begin syncing and updating the certificate in your web app with the new version in KV. |
| KeyVaultCertificateMigrationSucceededWebSite | The background job has successfully completed updating the certificate in your web app with a new version from KV.|
| KeyVaultCertificateMigrationFailedWebSite | The background job failed to update the certificate in your web app with a new version from KV or the background job failed to updated the SSL binding with the new certificate thumbprint.  |

You can learn more about the different causes for the background job to fail in the [common errors failing certificate sync job](#common-errors-failing-certificate-sync-job) section of this article.

### App Service Managed Certificates

App Service Managed Certificates is a certificate offering from App Service that is free of cost. You don't need to worry about having to renew your certificate on time because this is a managed offering.

We will run a few checks to pre-emptively ensure that your certificates will renew successfully. There are a few Activity Log operation names to watch out for in regards to this pre-emptive checks for the renewal of your App Service Managed Certificates.

| Activity Log Operation Name | Description |  
|-----------------------------|-------------|
| FailedCnamePeriodicCheckWebSite | Your managed certificate for your subdomain is at risk of not successfully renewing before the current certificate expires. |
| AutoRenewHttpManagedCertificateFailedWebSite | Your managed certificate for your root domain is at risk of not successfully renewing before the current certificate expires |

You can lear more about the different causes for you managed certificate to not successfuly renew in the [common errors failing App Service Managed Certificate renewal]() section of this article.


## Common Scenarios Causing Certificate Sync Job to Fail

When there's an error causing the background job to fail, you will get a `KeyVaultCertificateMigrationFailedWebSite` operation. You can check the description section of your Activity Log to find out more information. This next section will go over a couple of the common scenarios that causes your imported App Service Certificate or imported certificate from Key Vault to fail.

In the event that the background job fails, it will try to sync your certificate again later. You can opt to manually sync your certificates via portal if you needed to sync your certificate immediately.

### The certificate with thumbprint \<ThumbprintNew> does not match the hostname '\<domain>'

This scenario happens at the web app level where the web app's certificate failed to update with the new version of the certificate in Key Vault because the new version of the certificate's Common Name (CN) or Subject Alternative Name (SAN) does not match at least one domain from the old certificate's CN or SAN. The new version's CN or SAN doesn't necessarily have to be the exact match with the old one, but the background job will be expecting at least one domain to be common between the both of them.

```  js
"Message": "Failed to migrate certificate from thumbprint <ThumbprintOld> to thumbprint <ThumbprintNew> with error The certificate with thumbprint <ThumbprintNew> does not match the hostname '<domain>'.."
```

### An existing SSL binding with hostname \<domain> conflicted with a new certificate \<ThumbprintNew>

``` js
{"Message": "An existing SSL binding with hostname <domain> conflicted with a new certificate <ThumbprintNew> "} 
```

A binding cannot be created if the domain does match the certificate's CN or SAN. This scenario happens at the certificate binding level where the binding failed to update with the new thumbprint because the domain used by the binding is not found in the new certificate's CN or SAN. 

### Failed to update app settings on website to new thumbprint(s)

This scenario happens at the App Settings level where the App Settings `WEBSITE_LOAD_CERTIFICATES` failed to update with the new thumbprint values. Refer to the documentation on how to [use a TLS/SSL certificate in your code in Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate-in-code#load-certificate-from-file).

``` js
{"Message": "Failed to update app settings on website to new thumbprint(s) {<ThumbprintAOld>: <ThumbprintANew>, <ThumbprintBOld>: <ThumbprintBNew>}"} 
```

### Cannot modify this site because another operation is in progress.

This scenario happens when the background sync job couldn't finish because another operation, such as slot swaps, scaling, creating new certificate binding, or something else, was in progress at the same time. Although background job failed this time, the sync job will still pick up your certificate to sync again in the next run. 

``` js
"Message": "Failed to migrate certificate from thumbprint <ThumbprintOld> to thumbprint <ThumbprintNew> with error Cannot modify this site because another operation is in progress."
```

## Common Scenarios Causing App Service Managed Certificate to Fail Renewal

To ensure a successful renewal of your App Service Managed Certificates, we will be running background jobs to ensure that your managed certificate is not at risk of failing the certificate renewal. If there were any potential issues, we will generate a `FailedCnamePeriodicCheckWebSite` or a `AutoRenewHttpManagedCertificateFailedWebSite` Activity Log operation. You can check the description section of your Activity Log to find out more information. This next section will go over a couple of the common scenarios that causes your Managed Certificate to fail.

### Incorrect DNS Record Found

A correct DNS Record is required for a successful App Service Managed Certificate renewal just as it was required to create a certificate. Depending if the certificate is for a root domain or a subdomain, you will need to ensure that you still have the correct DNS records set up so that your certificate can renew properly. You can refer to the chart below for more information on the expected DNS records for renewal.

| Domain Type | Record Type  | Host         | Value                        |
|-------------|--------------|--------------|------------------------------|
| Root Domain | A Record     | @            | \<IPAddressOfWebApp>         |
| Subdomain   | CNAME Record | \<Subdomain> | \<AppName>.azurewebsites.net |

You can refer to the documentation on [how to create a DNS records](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain?tabs=cname#4-create-the-dns-records) for more information.

If your certificate is at risk of failing its renewal, you will find one of the messages below from your Activity Log.

``` js
"Message": "Unable to auto renew App Service Managed Certificate name <CertName> because its custom domain <domain> does not directly point to ip address <ExpectedIPAddress> of website <AppName> where it was added. Current A record has <CurrentIPAddress>."
```
``` js
"Message": "App Service Managed Certificate named <CertName> with subject name <domain> is at risk of failing to auto renew. Current CNAME record of the certificate's subject name <domain> is empty. It is expceted to directly point to one of App Service's allowed domain names. Please refer to https://go.microsoft.com/fwlink/?linkid=2158627."
```

### Custom domain of managed certificate not used by a web app

An App Service Managed Certificate will not renew if the domain of the certificate is not currently added to one of the web apps. Depending if the certificate is for a root domain or a subdomain, you will find one of the messages below from your Activity Log.

``` js
"Message": "Unable to auto renew App Service Managed Certificate name <CertName> because its custom domain <domain> is not added to any website under this server farm"
```
``` js
"Message": "App Service Managed Certificate named <CertName> is at risk of failing to auto renew. Its subject name <domain> is not added to any app service."
```

### Managed certificate not used by a web app

An App Service Managed Certificate will not renew if the certificate is not currently used by one of the web apps. Depending if the certificate is for a root domain or a subdomain, you will find one of the messages below from your Activity Log.

``` js
"Message": "App Service Managed Certificate named <CertName> is at risk of failing to auto renew. Its subject name <Domain> is not added to any app service."
```

