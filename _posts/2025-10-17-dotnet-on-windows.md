---
title: "Platform updates for .NET on App Service Windows"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

App Service team is working closely with the .NET team to address a set of issues that have impacted our ability to deliver updates to the .NET runtime versions provided by the platform on Windows.

We are currently deploying a patch to our Front End infrastructure to mitigate [CVE-2025-55315](https://github.com/dotnet/aspnetcore/issues/64033), this will protect applications from the impact of this CVE even if the underlying .NET runtime remains on an affected version.

## What is impacted

- App hosted on Windows instances targeting .NET 8 and .NET 9 on windows will be delayed in receiving runtime updates through the platform we will resume the regular updates once we have resolved the blocking issue.
- Linux instances are not impacted and will continue to receive updates on our regular cadence.
