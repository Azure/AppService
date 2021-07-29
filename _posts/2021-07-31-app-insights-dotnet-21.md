---
title: 'Retiring App Insights codeless atttach for .NET Core 2.1'
author: 'Jason Freeberg'
---

App Insights support for .NET Core 2.1 on App Service will be retired on August 31st, 2021. To continue using Application Insights for your .NET Core apps, update to .NET Core 3.1, or .NET 5. .NET Core 2.1 will reach End-of-Support [on August 21, 2021](https://devblogs.microsoft.com/dotnet/net-core-2-1-will-reach-end-of-support-on-august-21-2021/). 

## Upgrade to a newer version of .NET Core

You can update your .NET Core 2.1 applications to a newer version of .NET Core by updating the `<TargetFramework>` of your project file. For detailed instructions, please see [this article](https://devblogs.microsoft.com/dotnet/net-core-2-1-will-reach-end-of-support-on-august-21-2021/#update-your-application).

## Mitigations

The following mitigations should only be used as an interim. We suggest that you upgrade to a supported .NET version in the future and do not rely on these in the long-term.

- If you cannot upgrade your .NET Core application to a newer version, you can [include the Application Insights SDK directly in your application](https://docs.microsoft.com/en-us/azure/azure-monitor/app/asp-net-core). Once you have updated your application to include the SDK, re-deploy your application to App Service.
- Set the app setting, ApplicationInsightsAgent_EXTENSION_VERSION to a value of `??????`. This will trigger App Service to use the old Application Insights extension.

> [.NET Core and .NET 5 Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)
