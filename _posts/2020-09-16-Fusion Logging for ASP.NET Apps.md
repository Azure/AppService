---
title: "Troubleshoot ASP.NET assembly loading failures using Fusion Logging"
author_name: "Puneet Gupta"
category: 'Diagnostics'
comments: true
---

ASP.NET Framework has fusion [Assembly Binding logging](https://docs.microsoft.com/en-us/dotnet/framework/tools/fuslogvw-exe-assembly-binding-log-viewer) (aka Fusion Logging) which allows you to debug assembly load failures in your .NET applications. Fusion logging comes handy when your application is referencing assemblies or external nuget packages and you are encountering assembly binding failures.

We are pleased to announce that you can **enable Fusion logging in Azure App Service on a per-app basis** and troubleshoot assembly failures easily.

> Currently offered in App Service for Windows web apps only and applies to classic ASP.NET Framework apps. This logging **does not** apply to ASP.NET Core apps.

## Enabling Fusion Logging

To enable fusion logging, follow these steps

1. Go to the [Azure Portal](https://portal.azure.com).
2. Click on **Configuration** for your App.
3. Under the **Application Settings** section, add a new application setting with the name **WEBSITE_FUSIONLOGGING_ENABLED** and a value of **1**. 
4. Click the **Save** button.

> Saving the application setting causes a restart of the app on all instances, so perform this step during low-usage hours.

After you save this app setting, fusion logging will be enabled for your app. All processes launched for your app (w3wp.exe, w3wp.exe for the Kudu site, and any child processes of these processes) will have fusion logging enabled. This means you can use this feature to troubleshooting assembly binding issues even in WebJobs. Enabling fusion logging on one app does not enable it for other apps in the App Service Plan.

After fusion logging is enabled, if you browse to the page that was failing to load an assembly, you will now see detailed fusion logs emitted in the actual error message itself. An example is shown below.

![Fusion logging]({{site.baseurl}}/media/2020/09/fusion-logging-error.png)

Using fusion logging you can identify the exact assembly, the version, the location and other information about the whereabouts of the assembly. After you have diagnosed the root cause of the issue, be sure to **remove the app setting**. Fusion logging incurs some performance impact on the runtime of the application and leaving it enabled is not recommended in production.
