---
title: "Azure App Service and Azure Functions on Azure Stack Hub 2020 Q2 Released"
tags: 
    - Azure Stack
author_name: "Andrew Westgarth"
---

We have released the 2020 Q2 update to Azure App Service on Azure Stack Hub. This release updates the resource provider and brings the following key capabilities and fixes:

- Updates to **App Service Tenant, Admin, Functions portals and Kudu tools**. Consistent with Azure Stack Portal SDK version.
- Updates **Azure Functions** runtime to **v1.0.13021**.
- Updates to core service to improve reliability and error messaging enabling easier diagnosis of common issues.
- **Updates to the following application frameworks and tools**:
  - ASP.NET Framework 4.7.2
  - ASP.NET Core 3.1.3
  - ASP.NET Core Module v2 13.1.19331.0
  - PHP 7.4.2
  - Updated Kudu to 86.20224.4450
  - NodeJS 
    - 8.17.0
    - 10.19.0
    - 12.13.0
    - 12.15.0
  - NPM
    - 5.6.0
    - 6.1.0
    - 6.12.0
    - 6.13.4
  
- **Updates to underlying operating system of all roles**:
  - [2020-04 Cumulative Update for Windows Server 2016 for x64-based Systems (KB4550929)](https://support.microsoft.com/help/4550929)
  - [2020-04 Servicing Stack Update for Windows Server 2016 for x64-based Systems (KB4550994)](https://support.microsoft.com/help/4550994)

- **Cumulative Updates for Windows Server are now applied to Controller roles as part of deployment and upgrade**

- **Updated default Virtual Machine and Scale set skus for new deployments**:
To maintain consistency with our public cloud service, new deployments of Azure App Service on Azure Stack Hub will use the following SKUs for the underlying machines and scale sets used to operate the resource provider
  
  | Role | Minimum SKU |
  | --- | --- |
  | Controller | Standard_A4_v2 - (4 cores, 8192 MB) |
  | Management | Standard_D3_v2 - (4 cores, 14336 MB) |
  | Publisher | Standard_A2_v2 - (2 cores, 4096 MB) |
  | FrontEnd | Standard_A4_v2 - (4 cores, 8192 MB) |
  | Shared Worker | Standard_A4_v2 - (4 cores, 8192 MB) |
  | Small dedicated worker | Standard_A1_v2 - (1 core, 2048 MB) |
  | Medium dedicated worker | Standard_A2_v2 - (2 cores, 4096 MB) |
  | Large dedicated worker | Standard_A4_v2 - (4 cores, 8192 MB) |

For ASDK deployments, you can scale the instances down to lower SKUs to reduce the core and memory commit but you will experience a performance degradation.

- All other fixes and updates are detailed in the App Service on Azure Stack Hub 2020 Q2 Release Notes

The App Service on Azure Stack Hub Update 8 build number is **87.0.2.10**

Please review the release notes and all [**Known issues**](https://docs.microsoft.com/azure-stack/operator/app-service-release-notes-2020-q2) prior to updating your installation of Azure App Service on Azure Stack Hub.

## Documentation Updates

All of the documentation for Azure App Service and Azure Functions on Azure Stack Hub has been reviewed and edited to support this release, to address feedback from customers and to improve the quality of the documentation to support cloud operators.  In addition the articles covering Azure App Service and Azure Functions on Azure Stack Hub have been reclassified under the table of contents to better classify the documentation and to maintain consistency with other resource providers on Azure Stack Hub:

    ![New documentation TOC structure for App Service on Azure Stack Hub]({{ site.baseurl }}/media/2020/05/appservice_on_azure_stack_new_doc_toc.png)

You can download the new installer and helper scripts:
- [Installer](https://aka.ms/appsvcupdateq2installer)
- [Helper Scripts](https://aka.ms/appsvconmashelpers)

Please read the updated documentation prior to getting started with deployment:

- [2020 Q2 Update Release Notes](https://docs.microsoft.com/azure-stack/operator/app-service-release-notes-2020-q2)
- [Prerequisites for deploying App Service on Azure Stack Hub](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-before-you-get-started)
- [Deploy the App Service Resource Provider](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-deploy) for new deployments
- [Update the App Service Resource Provider](https://docs.microsoft.com/azure-stack/operator/azure-stack-app-service-update) for updating existing deployments