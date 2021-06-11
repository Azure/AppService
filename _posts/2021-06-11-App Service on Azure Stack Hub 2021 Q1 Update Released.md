---
title: "Azure App Service and Azure Functions on Azure Stack Hub 2021 Q1 Released"
tags: 
  - Azure Stack
author_name: "Andrew Westgarth"
---

The 2021 Q1 update to Azure App Service on Azure Stack Hub is now available. This release updates the resource provider and brings the following key capabilities and fixes:

- Updates to **App Service Tenant, Admin, Functions portals and Kudu tools**. Consistent with Azure Stack Portal SDK version.
- Updates **Azure Functions** runtime to **v1.0.13154**.
- Updates to core service to improve reliability and error messaging enabling easier diagnosis of common issues.
- **Updates to the following application frameworks and tools**:
  - ASP.NET Core 5.0.4
  - .NET Framework 4.8
  - NodeJS
    - 14.10.1
  - Updated Kudu to 90.21106.4900
  
- **Updates to underlying operating system of all roles**:
  - [2021-06 Cumulative Update for Windows Server 2016 for x64-based Systems (KB5003638)](https://support.microsoft.com/help/5003638)
  - [2021-04 Servicing Stack Update for Windows Server 2016 for x64-based Systems (KB5001402)](https://support.microsoft.com/help/5001402)
  - Defender Definition 1.341.322.0

- **Cumulative Updates for Windows Server are now applied to Controller roles as part of deployment and upgrade**

- All other fixes and updates are detailed in the App Service on Azure Stack Hub 2021 Q1 Release Notes

The App Service on Azure Stack Hub 2021.Q1 build number is **91.0.2.20**

Please review the [**release notes and all known issues**](https://docs.microsoft.com/azure-stack/operator/app-service-release-notes-2021-Q1) prior to updating your installation of Azure App Service on Azure Stack Hub.

You can download the new installer and helper scripts:

- [Installer](https://aka.ms/appsvcupdate21q1installer)
- [Helper Scripts](https://aka.ms/appsvconmashelpers)

Please read the updated documentation prior to getting started with deployment:

- [2020 Q3 Update Release Notes](https://docs.microsoft.com/azure-stack/operator/app-service-release-notes-2021-Q1)
- [Prerequisites for deploying App Service on Azure Stack Hub](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-before-you-get-started)
- [Deploy the App Service Resource Provider](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-deploy) for new deployments
- [Update the App Service Resource Provider](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-update) for updating existing deployments