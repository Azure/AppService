---
title: "Platform updates for .NET on App Service Windows"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

The App Service team is working closely with the .NET team to address a set of issues that have impacted our ability to deliver updates to the .NET runtime versions provided by the platform on Windows.

We are currently deploying a patch to our HTTP load balancer infrastructure (aka Front Ends) to mitigate [CVE-2025-55315](https://github.com/dotnet/aspnetcore/issues/64033). This patch will protect applications on both Windows and Linux instances from the impact of this CVE, even if the underlying .NET runtime remains on an affected version.

## When will my app be updated?

- **Apps hosted on Windows instances targeting .NET 8 and .NET 9** will be delayed in receiving runtime updates through the platform. We will resume regular updates once we have resolved the blocking issue.
- **Apps hosted on Windows instances targeting .NET 10** will continue to receive updates on our regular cadence.
- **Linux instances** are not impacted and will continue to receive updates on our regular cadence.
