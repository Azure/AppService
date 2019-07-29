---
layout: post
title:  "//DevTalk - App Service Certificate - New Sync and Export experiences"
categories: "appservicecertificate"
permalink: "/appservicecertificate/2019/03/19/DevTalk-App-Service-Certificate-sync-improvements-and-design.html"
author: "Chibi Vikramathithan"
---

App Service Certificates have been a very popular feature among App Service customers. However, our customers often get confused about the sync scenarios between App Service Certificates and Linked Private certificates. Specifically during the Manual Renew, Manual Rekey, and Auto Renew operations. This blog will showcase recent UX improvements to give you control over the sync scenarios. We will also talk about the internals of the automatic sync tasks running in the background to keep your certificates and SSL bindings synced up automatically.

## App Service Certificate Overview experience

When you open the App Service Certificate UX you will see the list of Linked Private certificates that are referenced in your App Service Apps. 

[![App Service Certificate Overview]({{ site.baseurl }}/media/2019/03/overview-ux.png "App Service Certificate Overview")]({{ site.baseurl }}/media/2019/03/overview-ux.png)

Note the sync button top, it will be disabled if all Linked Private certificates are in-sync. If any Linked Private certificates are not synced, the sync button will be enabled as shown above.

The Sync operation performs the following tasks:

1. **Updates** the Linked Private certificate with the current active App Service Certificate.
2. **Updates all SSL Bindings in all apps used by the Linked Private certificate** to use the new certificate.

You can sync all Linked Private certificates from the main sync experience in one click.

[![Sync UX]({{ site.baseurl }}/media/2019/03/sync-ux.png "Sync UX")]({{ site.baseurl }}/media/2019/03/sync-ux.png)

## Manual Rekey and Renew experience

Previously, during rekey and renew scenarios we would show the certificates references. Now we show the status of the Linked Private certificate and the difference between the thumbprints between them to give a clear view of the certificate state. We also allow you to sync the certificate with the sync command directly.

This model allows you to perform a rekey or a renew and leave the UI and continue with your work in the portal. When you return to the App Service Certificate blade, you will see the out-of-sync certificates. At this point, you can either let the automatic sync task take care of it, or sync it manually using the button.

### Manual Renew Scenario

[![Renew UX]({{ site.baseurl }}/media/2019/03/renew-ux.png "Renew UX")]({{ site.baseurl }}/media/2019/03/renew-ux.png)

### Manual Rekey Scenario

[![Rekey UX]({{ site.baseurl }}/media/2019/03/rekey-ux.png "Rekey UX")]({{ site.baseurl }}/media/2019/03/rekey-ux.png)

## Auto Renew and Sync internals

Our customers are sometimes confused by how the auto renew operation works and how it affects the Linked Private certificates. In an attempt to demystify the process, let me explain how our renew and syncs happen.

As we know by now, App Service Certificate uses GoDaddy APIs to issue your SSL certificates. Once a certificate is issued, we store the certificates in the KeyVault you configured during the KeyVault configuration step. **We have a AutoRenew background task that runs every 8 hours in the App Service Certificate backend** to look at all the certificates that are up for renewal and renew them if you have turned on Auto Renew. Once renewed the background task updates the KeyVault with the new certificate. 

**Meanwhile, in the App Service backend we have another task that runs every 48 hours** to sync all certificates that have a KeyVault reference (you can import a certificate from KeyVault secret into a App Service Web App following this blog). The background tasks has to run through a lot of private certificates which have KeyVault references and check if they have changed and update the certificate if needed, during this sync we also need to update the SSL Bindings on all the apps that are using this private certificate to maintain a working configuration. 

We have put in a lot of work to make these background task run at maximum efficiency and fall back properly on error cases. So when an Auto Renew happens, the new certificate will automatically be synced when 48-hour background task picks up the certificate to sync. We are aware that 48 hours is too long for some customers and we are working on improving the timings. Until then, you can do a manual sync with the experience provided above. **You can rest assured that the certificate used in your app at any point of the scenario will be valid during the auto renew process as we give a buffer of 60 days when both the newly renewed certificate and the old are valid.** 

Looking forward to hearing more on whether the internal details shed some light on how the auto renew and sync works and if you need more details feel free to drop a comment with your ask.

## Export Scenario

When you go to the export experience on App Service Certificate, you will see a new link to open the KeyVault Secret directly. In order to open the KeyVault secret you need to have GET permissions on the KeyVault Access Policy. Once you open the secret UI, you can navigate to the current version and download the certificate directly from the portal. The certificate will be in pfx format and may need further processing to add a password or prepare it for Linux/Mac usage. But for now, you do not need any PowerShell magic to get the pfx. Note that KeyVault secret UI does not add a password for the downloaded pfx. Once you downloaded the pfx, we advise you to install it on your Windows machine and export it with the password and delete the other occurrences to keep the pfx save (or as save as it can be now that it is out in the wild file system frontier). If you using mac or linux you will need to use openssl to secure it with a key.

*Use it only when you want to take the pfx out of Azure and use it somewhere else. You can also use KeyVault APIs (which can run in any platform) to directly pull the secret when you need it in your code which is much more safer than keeping a file around.*

**Export experience - Click the "Open KeyVault Secret"**

[![Export experience]({{ site.baseurl }}/media/2019/03/export-ux.png "Export experience")]({{ site.baseurl }}/media/2019/03/export-ux.png)

**KeyVault Secret UI - Click the Current version**

[![KeyVault Secret UI]({{ site.baseurl }}/media/2019/03/currentversion-ux.png "KeyVault Secret UI")]({{ site.baseurl }}/media/2019/03/currentversion-ux.png)

**Download Pfx - Click "Download as a certificate" button**

[![Download Pfx]({{ site.baseurl }}/media/2019/03/download-cert-ux.png "Download Pfx")]({{ site.baseurl }}/media/2019/03/download-cert-ux.png)

## Epilogue

Looking forward to hearing more from you, we like to keep our //DevTalk series a quick informal blog series that bring you direct updates from us on improvements across App Service that we keep tinkering out in the service. We drive these changes based on customer feedback, support cases, user voice, internal DLs and posts like these. We look forward to feedback, asks and comments on the new improvements and old to help us develop the service you love to use 💖.
