---
title: "Platform updates for .NET on App Service Windows"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **UPDATE:**
>
> - **Patch deployment has completed on all instances of our HTTP load balancer infrastructure (aka Front Ends)**.
> - Clarified impact to Function Apps.
> - Clarified mechanism for mitigation.
>

The App Service team is working closely with the .NET team to address a set of issues that has impacted our ability to deliver updates to the .NET runtime versions provided by the platform on Windows.

We have deployed a patch to our HTTP load balancer infrastructure (aka Front Ends) to mitigate [CVE-2025-55315](https://github.com/dotnet/aspnetcore/issues/64033). This patch protects **Web apps, Function apps and Logic apps (standard)** on both Windows and Linux instances from the impact of this CVE, even if the underlying .NET runtime remains on an affected version.

## What is the mitigation?

App Service Front Ends are built using [Kestrel and YARP](https://devblogs.microsoft.com/dotnet/bringing-kestrel-and-yarp-to-azure-app-services/). The patch we rolled out moves the infrastructure to the [latest available version](https://github.com/dotnet/core/blob/main/release-notes/8.0/8.0.21/8.0.21.md) of the framework. Since every HTTP request must first be routed through this layer of the service, any malicious content is effectively filtered out and will not reach the individual instances where customers' apps are hosted.

## When will my app be updated?

- **Apps hosted on Windows instances targeting .NET 8 and .NET 9** will be delayed in receiving runtime updates through the platform. We will resume regular updates once we have resolved the blocking issue.
- **Apps hosted on Windows instances targeting .NET 10** will continue to receive updates on our regular cadence.
- **Linux instances** are not impacted and will continue to receive updates on our regular cadence.
