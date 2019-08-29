---
title: "Azure App Service on Azure Stack Update 7 Released"
tags: 
    - Azure Stack
author_name: "Andrew Westgarth"
---

This afternoon we released the seventh update to Azure App Service on Azure Stack.  This release updates the resource provider and brings the following key capabilities and fixes:

- Updates to **App Service Tenant, Admin, Functions portals and Kudu tools**. Consistent with Azure Stack Portal SDK version.
- Updates to core service to improve reliability and error messaging enabling easier diagnosis of common issues.
- Access Restrictions now enabled in User Portal
  As of this release Users can configure Access Restrictions for their Web/Api/Functions applications according to the documentation published - Azure App Service Access Restrictions, NOTE: Azure App Service on Azure Stack does not support Service Endpoints.
- All other fixes and updates are detailed in the [App Service on Azure Stack Update Seven Release Notes](https://docs.microsoft.com/en-us/azure-stack/operator/azure-stack-app-service-release-notes-update-seven)

The App Service on Azure Stack Update 7 build number is **82.0.2.10**

You can download the new installer and helper scripts:

- [Installer](https://aka.ms/appsvcupdate7installer)
- [Helper Scripts](https://aka.ms/appsvconmashelpers)

Please read the updated documentation prior to getting started with deployment:

- [Update 7 Release Notes](https://docs.microsoft.com/en-us/azure-stack/operator/azure-stack-app-service-release-notes-update-seven)
- [Before you get started with App Service on Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-before-you-get-started)
- [Deploy the App Service Resource Provider](https://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-deploy) for new deployments
- [Update the App Service Resource Provider](https://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-update) for updating existing deployments
