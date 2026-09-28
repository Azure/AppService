---
title: "Azure App Service on Azure Stack Hub 26R1 Released"
tags: 
  - Azure Stack
author_name: "Andrew Westgarth"
---

Azure App Service on Azure Stack Hub 26R1 is now available for customers to download and update their Azure Stack Hub deployments.  This release contains updates to application runtimes, including .NET and Java; and updates the the resource provider itself.

## What's New?

- Updates to core service to improve reliability and error messaging enabling easier diagnosis of common issues.

- Stalled controller start up due to slow role discovery has been resolved.

- Database performance improved with reductions of locking and unnecessary saves.

- Updates to the following application frameworks and tools:

- .NET Framework 3.5 and 4.8.1
- ASP.NET Core
    - 10.0.11
    - 10.0.8
    - 8.0.30
    - 8.0.303
    - 8.0.424
- Microsoft OpenJDK 11
    - 11.0.30.7.
- Microsoft OpenJDK 17
    - 17.0.18
- Microsoft OpenJDK 21
    - 21.0.10
- Microsoft OpenJDK 25
    - 25.0.2
- Node.js
    - 22.23.1
- Npm
    - 8.1.0
    - 10.9.8
    - 11.16.0
- Tomcat
    - 9.0.109
    - 9.0.113
    - 9.0.115
    - 9.0.116
    - 10.1.146
    - 10.1.50
    - 10.1.53
    - 11.0.11
    - 11.0.15
    - 11.0.20

- Updated Kudu to 2026.08.1.2

- Continual accessibility and usability updates

All other fixes and updates are detailed in the App Service on [Azure Stack Hub 26R1 Release Notes](https://learn.microsoft.com/azure-stack/operator/app-service-release-notes-2026r1)
The App Service on Azure Stack Hub 26R1 build number is **102.20.2.2** and requires **Azure Stack Hub** to be updated with **2311** or later prior to deployment/upgrade.

You can download the new installer and offline package:

- [Installer](https://aka.ms/appsvcupdate26R1installer)
- [Offline package](https://aka.ms/appsvcupdate26R1offline)

Please read the updated documentation prior to getting started with deployment:

- [Update the App Service Resource Provider](https://learn.microsoft.com/azure-stack/operator/azure-stack-app-service-update) for updating existing deployments