---
title: "Azure App Service and Azure Functions on Azure Stack Hub 2020 Q3 Released"
tags: 
  - Azure Stack
author_name: "Andrew Westgarth"
---

The 2020 Q3 update to Azure App Service on Azure Stack Hub is now available. This release updates the resource provider and brings the following key capabilities and fixes:

- Updates to **App Service Tenant, Admin, Functions portals and Kudu tools**. Consistent with Azure Stack Portal SDK version.
- Updates **Azure Functions** runtime to **v1.0.13154**.
- Updates to core service to improve reliability and error messaging enabling easier diagnosis of common issues.
- **Updates to the following application frameworks and tools**:
  - ASP.NET Core 2.1.22
  - ASP.NET Core 2.2.14
  - ASP.NET Core 3.1.8
  - ASP.NET Core Module v2 13.1.19331.0
  - Azul OpenJDK
    - 8.42.0.23
    - 8.44.0.11
    - 11.35.15
    - 11.37.17
  - Curl 7.55.1
  - Git for Windows 2.28.0.1
  - MSDeploy 3.5.90702.36
  - NodeJS
    - 14.10.1
  - NPM
    - 6.14.8
  - PHP 7.4.5
  - Tomcat
    - 8.5.47
    - 8.5.51
    - 9.0.273
    - 9.0.31
  - Updated Kudu to 90.21005.4823
  
- **Updates to underlying operating system of all roles**:
  - [2020-10 Cumulative Update for Windows Server 2016 for x64-based Systems (KB4580346)](https://support.microsoft.com/help/4580346)
  - [2020-09 Servicing Stack Update for Windows Server 2016 for x64-based Systems (KB4576750)](https://support.microsoft.com/help/4576750)
  - Defender Definition 1.325.755.0

- **Cumulative Updates for Windows Server are now applied to Controller roles as part of deployment and upgrade**

- All other fixes and updates are detailed in the App Service on Azure Stack Hub 2020 Q3 Release Notes

The App Service on Azure Stack Hub Update 8 build number is **89.0.2.15**

Please review the release notes and all [**Known issues**](https://docs.microsoft.com/azure-stack/operator/app-service-release-notes-2020-q3) prior to updating your installation of Azure App Service on Azure Stack Hub.

You can download the new installer and helper scripts:

- [Installer](https://aka.ms/appsvcupdateq3installer)
- [Helper Scripts](https://aka.ms/appsvconmashelpers)

Please read the updated documentation prior to getting started with deployment:

- [2020 Q3 Update Release Notes](https://docs.microsoft.com/azure-stack/operator/app-service-release-notes-2020-q3)
- [Prerequisites for deploying App Service on Azure Stack Hub](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-before-you-get-started)
- [Deploy the App Service Resource Provider](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-deploy) for new deployments
- [Update the App Service Resource Provider](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-update) for updating existing deployments
