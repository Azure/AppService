---
title: ".NET 5 NuGet package restore Incident: App Service Response"
author_name: "Jason Freeberg"
---

## Incident Summary

Last week an incident occurred that caused .NET 5 NuGet package operations to fail on some Debian-family distributions. Specifically, Debian and Ubuntu maintainers published an update (for at least some distro versions) that distrusted the Symantec certificate entirely. This change was later rolled back, but patched packages were not available on the package repositories prior to the Microsoft NuGet author signing certificate expiring. Please see [this NuGet announcement for more information](https://github.com/NuGet/Announcements/issues/49).

## Impact to App Service users

This incident affected any users running a .NET 5 application on App Service **and** using App Service's built-in build service, known as Oryx. If you are building your .NET 5 applications locally or on a CI system, this incident will not affect your .NET 5 applications.

For more information, please see [this GitHub thread](https://github.com/NuGet/Home/issues/10491#issuecomment-772867958).

## Resolution for App Service

We have updated the root certificates used in the .NET 5 runtime and build image (also known as the Oryx image) and will begin rolling out the updated image as soon as possible. We will update this article as new information becomes available.

## Workaround

To work around this limitation, please build your .NET 5 applications locally or on a build system (such as GitHub Actions or AzureDevops) and deploy the built application to App Service. You can set up a GitHub Actions workflow from the **Deployment Center** in the App Service blade in the Portal. If you would rather build locally, you can use the [`az webapp deployment source config-zip`](https://docs.microsoft.com/azure/app-service/deploy-zip#deploy-zip-file-with-azure-cli) command to deploy your app from a .zip file.

Once the root certifactes have been updated on your site, you can return to using the Oryx build service. We will update this article as new information becomes available.
