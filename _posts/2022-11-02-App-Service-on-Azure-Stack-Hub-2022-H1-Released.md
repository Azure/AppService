---
title: "Azure App Service and Azure Functions on Azure Stack Hub 2022 H1 Released"
tags: 
  - Azure Stack
author_name: "Andrew Westgarth"
---

# Azure App Service and Azure Functions on Azure Stack Hub 2022 H1 Released

The 2022 H1 update to Azure App Service on Azure Stack Hub is now available. This release is a major update in terms of underlying infrastructure and topology.  We highly recommend operators read through the **[release notes]**(https://learn.microsoft.com/azure-stack/operator/app-service-release-notes-2022-h1) for further details and review the operational documentation in order to be aware of all changes.

## What's New?

- All roles are now powered by **Windows Server 2022 Datacenter**.
- Administrators can isolate the platform image for use by App Service on Azure Stack Hub, by setting the SKU to AppService.
- Networking design update for all worker virtual machine scale sets, addressing customers faced with SNAT port exhaustion issues.
- Increase number of outbound address for all applications.
- Administrators can set a three character deployment prefix for the individual instances in each Virtual Machine Scale Set that are deployed as part of the App Service on Azure Stack Hub Resource provider.
- Deployment Center is enabled for tenants, replacing the Deployment Options experience - **IMPORTANT** - Operators will need to reconfigure their deployment sources as the redirect urls have changed with this update.

- Updates to **App Service Tenant, Admin, Functions portals and Kudu tools**. Consistent with Azure Stack Portal SDK version.
- Updates to core service to improve reliability and error messaging enabling easier diagnosis of common issues.

**Updates to the following application frameworks and tools**:
 - Azure Functions runtime to v1.0.13154
 - ASP.NET Core
    - 3.1.18
    - 3.1.23
    - 6.0.2
    - 6.0.3
 - Eclipse Temurin OpenJDK 8
    - 8u302
    - 8u312
    - 8u322
 - Microsoft OpenJDK 11
    - 11.0.12.7.1
    - 11.0.13.8
    - 11.0.14.1
    - 17.0.1.12
    - 17.0.2.8
 - MSBuild
    - 16.7.0
    - 17.1.0
 - NodeJS
    - 14.18.1
    - 16.9.1
    - 16.13.0
 - NPM
    - 6.14.15
    - 7.21.1
    - 8.1.0
 - Tomcat
    - 8.5.69
    - 8.5.72
    - 8.5.78
    - 9.0.52
    - 9.0.54
    - 9.0.62
    - 10.0.12
    - 10.0.20
 - Updated Kudu to 97.40427.5713
 - Updates to underlying operating system of all roles:
    - 2022-09 Cumulative Update for Windows Server 2022 for x64-based Systems (KB5017316)
    - Defender Definition 1.373,353.0
    Cumulative Updates for Windows Server are now applied to Controller roles as part of deployment and upgrade

All other fixes and updates are detailed in the App Service on [Azure Stack Hub 2022 H2 Release Notes](https://learn.microsoft.com/azure-stack/operator/app-service-release-notes-2022-h1)
The App Service on Azure Stack Hub 2022.H! build number is **98.0.1.699** and requires **Azure Stack Hub** to be updated with **1.2108.2.127** or **1.2206.2.52** prior to deployment/upgrade.

Please review the [**release notes and all known issues**](https://learn.microsoft.com/azure-stack/operator/app-service-release-notes-2022-h1) prior to updating your installation of Azure App Service on Azure Stack Hub.

You can download the new installer and helper scripts:

You can download the new installer and helper scripts:

- [Installer](https://aka.ms/appsvcupdate22h1installer)
- [Helper Scripts](https://aka.ms/appsvconmashelpers)

Please read the updated documentation prior to getting started with deployment:

- [2022 H1 Update Release Notes](https://learn.microsoft.com/azure-stack/operator/app-service-release-notes-2022-H1)
- [Prerequisites for deploying App Service on Azure Stack Hub](https://learn.microsoft.com/azure-stack/operator/azure-stack-app-service-before-you-get-started)
- [Deploy the App Service Resource Provider](https://learn.microsoft.com/azure-stack/operator/azure-stack-app-service-deploy) for new deployments
- [Update the App Service Resource Provider](https://learn.microsoft.com/azure-stack/operator/azure-stack-app-service-update) for updating existing deployments
- [Configure deployment sources for App Service on Azure Stack Hub](https://learn.microsoft.com/azure-stack/operator/azure-stack-app-service-configure-deployment-sources)
