---
title: "Azure App Service on Azure Stack Update Two Released"
author_name: Andrew Westgarth
layout: post
hide_excerpt: true
---
      [Andrew Westgarth](https://social.msdn.microsoft.com/profile/Andrew Westgarth)  5/18/2018 10:00:43 AM  This morning we released the second update to Azure App Service on Azure Stack. This release updates the resource provider and brings the following key capabilities:  - **Auto Swap** of deployment slots feature is now enabled - [Configuring Auto Swap](https://docs.microsoft.com/azure/app-service/web-sites-staged-publishing#configure-auto-swap)
 - **Testing in Production** feature enabled - [Introduction to Testing in Production](https://azure.microsoft.com/resources/videos/introduction-to-azure-websites-testing-in-production-with-galin-iliev/)
 - **Azure Functions Proxies** enabled - [Work with Azure Functions Proxies](https://docs.microsoft.com/en-us/azure/azure-functions/functions-proxies)
 - **App Service Admin** extensions UX support added to enable: 
	 - Secret rotation
	 - Certificate rotation
	 - System credential rotation
	 - Connection string rotation
	  
 - Updates to **App Service Tenant, Admin, Functions portal and Kudu tools**.
 - Updates to .Net Core support, additional versions of NodeJS and NPM
 - All other fixes and updates detailed in the [App Service on Azure Stack Update Two Release Notes](http://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-release-notes-update-two)
 - 
  You can download the new installer and helper scripts:  - Installer – [https://aka.ms/appsvcupdate2installer](https://aka.ms/appsvcupdate2installer "https://aka.ms/appsvcupdate1installer")
 - Helper Scripts – [https://aka.ms/appsvconmashelpers](https://aka.ms/appsvconmashelpers "https://aka.ms/appsvconmashelpers")
  Please read the updated documentation prior to getting started with deployment:  - [Before you get started with App Service on Azure Stack](https://docs.microsoft.com/en-gb/azure/azure-stack/azure-stack-app-service-before-you-get-started)
 - [Deploy the App Service Resource Provider](https://docs.microsoft.com/en-gb/azure/azure-stack/azure-stack-app-service-deploy) for new deployments
 - [Update the App Service Resource Provider](https://docs.microsoft.com/en-gb/azure/azure-stack/azure-stack-app-service-update) for updating existing deployments
      