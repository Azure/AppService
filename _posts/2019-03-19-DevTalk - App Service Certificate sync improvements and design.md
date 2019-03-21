---
layout: post
title:  "//DevTalk - App Service Certificate - New Sync and Export experiences"
categories: "appservicecertificate"
author: "Chibi Vikramathithan"
---

App Service Certificate is being used a lot by App Service customers. **One of the feedback we get is around the sync scenarios between App Service Certificate and Linked Private certificates in App Service Apps namely during the Manual Renew, Manual Rekey and the Auto Renew scenarios. The blog aims to showcase recent improvements to give you control over the sync scenarios.** We will also talk about the internals of the automatic sync tasks running in the background to keep your certificates and SSL bindings synced up automatically. With a hard blog to follow to export an App Service Certificate there was a need for a UX solution, **we will talk about the new export experience that makes use of the existing KeyVault secret UI to allow you to export the certificate out of Azure of use it anywhere you please in a few clicks**

## App Service Certificate Overview experience

When you open the App Service Certificate UX you will see the list of Linked Private certificates that are referenced in your App Service Apps. 

[![App Service Certificate Overview]({{ site.baseurl }}/media/2019/03/overview-ux.png "App Service Certificate Overview")]({{ site.baseurl }}/media/2019/03/overview-ux.png)

Note the sync button top, it will be disabled if all Linked Private certificates are in sync state. But if any of the Linked Private certificate are not synced the sync button will be enabled as shown on the above case. 

The Sync operation does the following tasks.

1. **Update** the Linked Private certificate with the current active App Service Certificate.
2. **Updates all SSL Bindings in all apps used by the Linked Private certificate** to use the new certificate.

You can sync all Linked Private certificates from the main sync experience in one shot.

[![Sync UX]({{ site.baseurl }}/media/2019/03/sync-ux.png "Sync UX")]({{ site.baseurl }}/media/2019/03/sync-ux.png)

## Manual Rekey and Renew experience

Previously during rekey and renew scenarios we show the certificates references, now we show the status of the Linked Private certificate and the difference between the thumbprints between them to give a clear view of the certificate state. We also allow you to sync the certificate with the sync command directly. 

The model allows you to perform a rekey or a renew and leave the UI and continue with your work in the portal. When you come back to the App Service Certificate we will show you the out of sync state which you can either let the automatic sync tasks to sync or sync it manually at your convenience using the sync command. 

**Manual Renew Scenario**

[![Renew UX]({{ site.baseurl }}/media/2019/03/renew-ux.png "Renew UX")]({{ site.baseurl }}/media/2019/03/renew-ux.png)

**Manual Rekey Scenario**

[![Rekey UX]({{ site.baseurl }}/media/2019/03/rekey-ux.png "Rekey UX")]({{ site.baseurl }}/media/2019/03/rekey-ux.png)

## Auto Renew and Sync internals 

People have been confused (rightly so) by how the auto renew on App Service Certificate works and how it affects the Linked Private certificates in the App Service Web apps. Firstly we apologize for not being upfront with the details as what we learnt from our customer support cases show that our customers wanted more clarity into the internal workings of the two tasks. In an attempt to demystify the process let me explain how our renew and syncs happen. 

As we know by now, App Service Certificate uses GoDaddy APIs to get your SSL certificates issued. Once a certificate is issued we store the certificates in the KeyVault you configured during the KeyVault configuration step. **We have a AutoRenew background task that runs every 8 hours in the App Service Certificate backend** to look at all the certificates that are up for renewal and renew them if you have turned on Auto Renew. Once renewed the background task updates the KeyVault with the new certificate. 

**Meanwhile, in the App Service backend we have another background task that runs every 48 hours** to sync all certificates that have a KeyVault reference (you can import a certificate from KeyVault secret into a App Service Web App following this blog). The background tasks has to run through a lot of private certificates which have KeyVault references and check if they have changed and update the certificate if needed, during this sync we also need to update the SSL Bindings on all the apps that are using this private certificate to maintain a working configuration. 

We have put in a lot of work to make these background task run at maximum efficiency and fall back properly on error cases. So when an Auto Renew happens the new certificate will automatically be synced when the App Service background task that runs every 48 hours picks up the certificate to sync. We agree that the 48 hours is too long and we are working on improving the timings, until then you have the liberty of doing a manual sync with the experience provided above if you are concerned about syncing it before the automated tasks pick it up. **You can rest assured that the certificate used in your app at any point of the scenario will be valid during the auto renew process as we give a buffer of 60 days when both the newly renewed certificate and the old are valid.** 

Looking forward to hearing more on whether the internal details shed some light on how the auto renew and sync works and if you need more details feel free to drop a comment with your ask.

## Export Scenario

When you go to the export experience on App Service Certificate. You will see a new link to open the KeyVault Secret directly. Inorder to open the KeyVault secret you need to have GET permissions on the KeyVault Access Policy. **Once you open the secret UI you can navigate to the current version and download the certificate directly from the portal. The certificate will be in pfx format and may need further processing to add a password or get it ready for linux/mac usage. But for now you do not need to any PowerShell magic to get the pfx out of the system. Note that KeyVault secret UI does not add a password for the downloaded pfx.** Once you download the pfx we advice you to install it on your windows and export it with the password and delete the other occurrences to keep the pfx save (or as save as it can be now that it is out in the wild file system frontier). If you using mac or linux you will need to use openssl to secure it with a key.

*Use it only when you want to take the pfx out of Azure and use it somewhere else. You can also use KeyVault APIs (which can run in any platform) to directly pull the secret when you need it in your code which is much more safer than keeping a file around.*

**Export experience - Click the "Open KeyVault Secret"**

[![Export experience]({{ site.baseurl }}/media/2019/03/export-ux.png "Export experience")]({{ site.baseurl }}/media/2019/03/export-ux.png)

**KeyVault Secret UI - Click the Current version**

[![KeyVault Secret UI]({{ site.baseurl }}/media/2019/03/currentversion-ux.png "KeyVault Secret UI")]({{ site.baseurl }}/media/2019/03/currentversion-ux.png)

**Download Pfx - Click "Download as a certificate" button**

[![Download Pfx]({{ site.baseurl }}/media/2019/03/download-cert-ux.png "Download Pfx")]({{ site.baseurl }}/media/2019/03/download-cert-ux.png)

## Epilogue

Looking forward to hearing more from you, we like to keep our //DevTalk series a quick informal blog series that bring you direct updates from us on improvements across App Service that we keep tinkering out in the service. We drive these changes based on customer feedback, support cases, user voice, internal DLs and posts like these. We look forward to feedback, asks and comments on the new improvements and old to help us develop the service you love to use 💖.

