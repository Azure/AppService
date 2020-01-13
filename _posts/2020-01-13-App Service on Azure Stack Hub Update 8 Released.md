---
title: "Azure App Service on Azure Stack Hub Update 8 Released"
tags: 
    - Azure Stack
author_name: "Andrew Westgarth"
---

This afternoon we released the eighth update to Azure App Service on Azure Stack Hub. This release updates the resource provider and brings the following key capabilities and fixes:

- Updates to **App Service Tenant, Admin, Functions portals and Kudu tools**. Consistent with Azure Stack Portal SDK version.
- Updates to core service to improve reliability and error messaging enabling easier diagnosis of common issues.
- **Managed disk support** for all **new deployments** – All new deployments of Azure App Service on Azure Stack Hub will make use of managed disks for all Virtual Machines and Virtual Machine Scale Sets.  All existing deployments will continue to use unmanaged disks.
- **TLS 1.2 Enforced by Front End load Balancers**

- All other fixes and updates are detailed in the App Service on Azure Stack Update Seven Release Notes

The App Service on Azure Stack Hub Update 8 build number is **86.0.2.13**

You can download the new installer and helper scripts:
- [Installer](https://aka.ms/appsvcupdate8installer)
- [Helper Scripts](https://aka.ms/appsvconmashelpers)

Please read the updated documentation prior to getting started with deployment:

- [Update 8 Release Notes](https://docs.microsoft.com/en-us/azure-stack/operator/azure-stack-app-service-release-notes-update-eight)
- [Before you get started with App Service on Azure Stack](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-before-you-get-started)
- [Deploy the App Service Resource Provider](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-deploy) for new deployments
- [Update the App Service Resource Provider](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-update) for updating existing deployments