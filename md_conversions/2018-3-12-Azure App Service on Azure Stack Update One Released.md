---
title: "Azure App Service on Azure Stack Update One Released"
author_name: Andrew Westgarth
layout: post
hide_excerpt: true
---
      [Andrew Westgarth](https://social.msdn.microsoft.com/profile/Andrew Westgarth)  3/12/2018 3:52:20 PM     This morning we released the first update to Azure App Service on Azure Stack. This release updates the resource provider and brings the following key capabilities:  - Support for Highly Available deployments of Azure App Service on Azure Stack 
	 - The Azure Stack 1802 update enabled workloads to be deployed across fault domains. Therefore App Service infrastructure is able to be fault tolerant as it will be deployed across fault domains. By default all new deployments of Azure App Service will have this capability however for deployments completed prior to Azure Stack 1802 update being applied refer to the App Service Fault Domain documentation
	  
 - Deploy in existing virtual network 
	 - As a result of customer feedback post release we have now added this capability enabling customers to deploy Azure App Service and communicate with their SQL and File Server resources over a private network.
	  
 - Update the App Service Tenant, App Service Admin and Azure Functions portals.
 - Updates to add .Net Core 2.0 support, additional versions of NodeJS, NPM, PHP, new versions of Git and Mercurial
 - All other fixes and updates detailed in the [App Service on Azure Stack Update One Release Notes](http://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-release-notes-update-one)
  You can download the new installer and helper scripts:  - Installer – [https://aka.ms/appsvcupdate1installer](https://aka.ms/appsvcupdate1installer "https://aka.ms/appsvcupdate1installer")
 - Helper Scripts - [https://aka.ms/appsvconmashelpers](https://aka.ms/appsvconmashelpers "https://aka.ms/appsvconmashelpers")
  Please read the updated documentation prior to getting started with deployment:  - [Before you get started with App Service on Azure Stack](https://docs.microsoft.com/en-gb/azure/azure-stack/azure-stack-app-service-before-you-get-started)
 - [Deploy the App Service Resource Provider](https://docs.microsoft.com/en-gb/azure/azure-stack/azure-stack-app-service-deploy) for new deployments
 - [Update the App Service Resource Provider](https://docs.microsoft.com/en-gb/azure/azure-stack/azure-stack-app-service-update) for updating existing deployments
         