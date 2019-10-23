---
title: Updating Migrated Azure Mobile Services Sites for Facebook Auth
author_name: Adrian Hall (MSFT)
layout: post
hide_excerpt: true
---
      [Adrian Hall (MSFT)](https://social.msdn.microsoft.com/profile/Adrian Hall (MSFT))  3/30/2017 11:30:35 AM  If you use a combination of Azure Mobile Services and Facebook authentication, then you will have noticed that the Facebook authentication stopped working yesterday. This was due to the deprecation of an underlying Facebook OAuth protocol that the service relied on. If your Azure Mobile Services site has not been migrated yet, we have made changes in the backend to fix the protocol, so no action is required on your part. We apologize for the downtime that this caused. If your Azure Mobile Services site has been migrated, then you are in charge of the code that runs your site. If your site is a .NET site, we have updated the Katana middleware that runs authentication within the site extension. You need to update an App Setting within your site:  - Log on to the [Azure portal](https://portal.azure.com).
 - Find your Azure App Service site and click it. The easiest way to do this is to click **All Resources** then use the **Filter by name...** box to find your site.
 - Click **Application settings** (under Settings) in the left-hand menu.
 - Scroll down until you find **App settings**.
 - Update the **MOBILESERVICESDOTNET\_EXTENSION\_VERSION** value from 1.0.478 to **1.0.481**.
 - Click **Save** at the top of the Application settings blade.
  If you are running a Node site, then you will need to update the Azure Mobile Services package that is an integral part of the site code to pick up the changes. To do this:  - Log on to the [Azure portal](https://portal.azure.com).
 - Find your Azure App Service site and click it. The easiest way to do this is to click **All Resources** then use the **Filter by name...** box to find your site.
 - Click **Console** (under Development Tools) in the left-hand menu.
 - Run the command npm install azure-mobile-services@1.0.1 to update the package. Let this process complete.
 - Click **Overview** in the left-hand menu.
 - Click **Restart** to restart your site.
  After the changes, please test the Facebook authentication to ensure it is working. You can reach out to us on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-mobile-services) or [Azure Forums](https://social.msdn.microsoft.com/forums/en-US/home?forum=azuremobile&filter=alltypes&sort=lastpostdesc) to get additional help. We would like to also take this opportunity to encourage you to update your site to Azure Mobile Apps. This is the v2 edition of the same service, but contains a different client SDK and server SDK. If you are a .NET developer, lots of information about developing the service is available in the Azure Mobile Apps Documentation (for [Client](https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-dotnet-how-to-use-client-library) and [Server](https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk)) and my book. For Node developers, you can use the [Compatibility package](https://www.npmjs.com/package/azure-mobile-apps-compatibility) to convert your Mobile Services server to a Mobile Apps server. Again, please reach out to us if you run into trouble. As a reminder, the Azure Mobile Services [reaches its end of life in May, 2017](https://azure.microsoft.com/en-us/blog/transition-of-azure-mobile-services/).     