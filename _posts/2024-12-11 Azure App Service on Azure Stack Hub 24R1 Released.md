---
title: "Azure App Service on Azure Stack Hub 24R1 Released"
tags: 
  - Azure Stack
author_name: "Andrew Westgarth"
---

Azure App Service on Azure Stack Hub 24R1 is now available for customers to download and update their Azure Stack Hub deployments.  This release contains a number of new capabilities, updates to application stacks and improvements to Azure App Service on Azure Stack Hub and we encourage customers to review the full [release notes](https://learn.microsoft.com/azure-stack/operator/app-service-release-notes-2024r1), follow the [update documentation](https://learn.microsoft.com/azure-stack/operator/azure-stack-app-service-update) to deploy to their systems and take advantage of this new update.

## What's New?

- Kestrel and YARP (Yet Another Reverse Proxy) now power App Service on Azure Stack Hub front ends in alignment with investments made in public cloud. For more information on what this means and how it impacted the public cloud service, read the detailed information on the [App Service Team Blog - "A Heavy Lift: Bringing Kestrel + YARP to Azure App Services"](https://azure.github.io/AppService/2022/08/16/A-Heavy-Lift.html)
- Updates to many application stacks, bringing latest Long Term Support (LTS) releases of .NET, Java, Tomcat, and more.
- Tenants can make use of the Health check feature for monitoring of instance health

- Updates to the following application frameworks and tools:

- .NET Framework 4.8.1
- ASP.NET Core
    - 8.0.7
    - 8.0.8
    - 6.0.29
- Eclipse Temurin OpenJDK 8
    - 8u302
    - 8u312
    - 8u322
    - 8u332
    - 8u345
    - 8u362
    - 8u392
    - 8u412
    - 8u422
- Microsoft OpenJDK 11
    - 11.0.12.7.1
    - 11.0.13.8
    - 11.0.14.1
    - 11.0.15.10
    - 11.0.16.1
    - 11.0.18.10
    - 11.0.21.9
    - 11.0.23.9
    - 11.0.24.8
- Microsoft OpenJDK 17
    - 17.0.11.9
    - 17.0.1.12
    - 17.0.2.8
    - 17.0.3.7
    - 17.0.4.1
    - 17.0.6.1
    - 17.0.9.8
    - 17.0.12.7
- Microsoft OpenJDK 21
    - 21.0.1.12
    - 21.0.3.9
    - 21.0.4.7
- MSBuild
    - 15.9.21.664
    - 16.4.0
    - 16.7.0
    - 16.11.2
    - 17.11.2
- MSDeploy
    - 3.5.120530.385
    - 2.5.1270717.34
- NodeJS
    - 10.24.1
    - 12.22.12
    - 14.20.0
    - 16.16.0
    - 18.12.1
    - 18.19.1
    - 20.9.0
- npm
    - 6.4.1
    - 6.13.4
    - 6.14.11
    - 6.14.12
    - 6.14.15
    - 6.14.16
    - 6.14.17
    - 7.21.1
    - 8.1.0
    - 8.19.2
    - 10.1.0
    - 10.2.4
- Tomcat
    - 8.5.20
    - 8.5.57
    - 8.5.58
    - 8.5.79
    - 8.5.82
    - 8.5.85
    - 8.5.96
    - 8.5.100
    - 9.0.0
    - 9.0.27
    - 9.0.31
    - 9.0.37
    - 9.0.63
    - 9.0.65
    - 9.0.71
    - 9.0.83
    - 9.0.91
    - 9.0.96
    - 10.0.21
    - 10.0.23
    - 10.0.27
    - 10.1.5
    - 10.1.16
    - 10.1.25
    - 10.1.31
    - 11.0.0
- Git 2.43.0

- Updated Kudu to 102.10502.001.

- Continual accessibility and usability updates

All other fixes and updates are detailed in the App Service on [Azure Stack Hub 24R1Release Notes](https://learn.microsoft.com/azure-stack/operator/app-service-release-notes-2024r1)
The App Service on Azure Stack Hub 24R1 build number is **102.0.2.5** and requires **Azure Stack Hub** to be updated with **2311** or later prior to deployment/upgrade.

You can download the new installer and helper scripts:

- [Installer](https://aka.ms/appsvcupdate24R1installer)
- [Helper Scripts](https://aka.ms/appsvconmashelpers)

Please read the updated documentation prior to getting started with deployment:

- [Update the App Service Resource Provider](https://learn.microsoft.com/azure-stack/operator/azure-stack-app-service-update) for updating existing deployments