---
title: "Azure App Service and Azure Functions on Azure Stack Hub 2021 Q3 Released"
tags: 
  - Azure Stack
author_name: "Andrew Westgarth"
---

The 2021 Q3 update to Azure App Service on Azure Stack Hub is now available. This release updates the resource provider and brings the following key capabilities and fixes:

- Updates to **App Service Tenant, Admin, Functions portals and Kudu tools**. Consistent with Azure Stack Portal SDK version.
- Updates to core service to improve reliability and error messaging enabling easier diagnosis of common issues.
- **Updates to the following application frameworks and tools**:
  - ASP.NET Core
    - 3.1.16
    - 5.0.7
    - 6.0.0
  - Azul OpenJDK
    - 8.52.0.23
    - 11.44.13
  - Git 2.33.1.1
  - NodeJS
    - 10.15.2
    - 10.16.3
    - 10.19.0
    - 12.21.0
    - 14.15.1
    - 14.16.0
  - NPM
    - 6.14.11
  - PHP
    - 7.2.34
    - 7.3.27
    - 7.14.15
  - Tomcat
    - 8.5.58
    - 9.0.38  
  - Updated Kudu to 94.30524.5227
  
- **Updates to underlying operating system of all roles**:
  - [2021-11 Cumulative Update for Windows Server 2016 for x64-based Systems (KB5007192)](https://support.microsoft.com/help/5007192)
  - [2021-09 Servicing Stack Update for Windows Server 2016 for x64-based Systems (KB5005698)](https://support.microsoft.com/help/5005698)
  - Defender Definition 1.353.743.0

- **Cumulative Updates for Windows Server are now applied to Controller roles as part of deployment and upgrade**

- All other fixes and updates are detailed in the [App Service on Azure Stack Hub 2021 Q3 Release Notes](https://docs.microsoft.com/azure-stack/operator/app-service-release-notes-2021-q3?view=azs-2108)

The App Service on Azure Stack Hub 2021.Q3 build number is **95.1.1.539** and requires Azure Stack Hub to be updated with 2108 prior to deployment/upgrade.

Please review the [**release notes and all known issues**](https://docs.microsoft.com/azure-stack/operator/app-service-release-notes-2021-Q3) prior to updating your installation of Azure App Service on Azure Stack Hub.

You can download the new installer and helper scripts:

- [Installer](https://aka.ms/appsvcupdate21q3installer)
- [Helper Scripts](https://aka.ms/appsvconmashelpers)

Please read the updated documentation prior to getting started with deployment:

- [2021 Q3 Update Release Notes](https://docs.microsoft.com/azure-stack/operator/app-service-release-notes-2021-Q3)
- [Prerequisites for deploying App Service on Azure Stack Hub](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-before-you-get-started)
- [Deploy the App Service Resource Provider](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-deploy) for new deployments
- [Update the App Service Resource Provider](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-update) for updating existing deployments