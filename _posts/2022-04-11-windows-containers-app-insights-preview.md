---
title: "Public Preview: Codeless Monitoring for Windows Containers"
author_name: "Jason Freeberg"
toc: true
toc_sticky: true
tags:
    - windows containers
---

We are happy to share that [Auto-Instrumentation](https://docs.microsoft.com/azure/azure-monitor/app/codeless-overview) of Application Insights for Windows Container applications is now in public preview! Auto-Instrumentation allows you to monitor your applications with Application Insights **without changing your code**. When enabled, the App Service platform will configure and attach the agent to the application in your container. Once attached, metrics such as requests, dependencies, latency, and stack traces will flow into your Application Insights resource where you can analyze the data and set up alerts.

**Note:** Auto-Instrumentation for Windows Containers on App Service currently supports .NET and Java applications. Node.js support is planned. For other stacks, consider adding the Application Insights SDK to your application.

## Enable Auto-Instrumentation

You can enable Auto-Instrumentation from the **Create** blade, or from the **Application Insights** blade.

### Create Blade

1. Go to the [Create Web App blade](https://portal.azure.com/#create/Microsoft.WebSite)
1. Provide a name for your web app, and select **Docker Container** as the Publish type, and **Windows** as the Operating System
1. Go to the **Monitoring** tab, and select **Yes** to enable Application Insights

    ![Enabling App Insights]({{site.baseurl}}/media/2022/04/windows-containers-create.png)

1. Go to **Review + Create** and click **Create**

That's it! Once your container is deployed, Application Insights will attach automatically and begin sending metrics.

### Application Insights Blade

If you already have a Windows Container web app, open it in the Azure Portal and go to the **Application Insights (preview)** menu item.

1. Select **Turn on Application Insights**
1. Select a **Location** for your Application Insights resource to be created. (It's suggested to create the resource in the same region as the Web App.)

    ![Enabling App Insights]({{site.baseurl}}/media/2022/04/windows-containers-ai-blade.png)

1. (Optional) use the language tabs at the bottom for **.NET**, **.NET Core**, and **Java** to configure the agent
1. Click **Apply** to save your changes

And you're done! Your web app will restart and Application Insights will attach automatically to begin sending metrics.

## Resources

- [Quickstart: Windows Containers on App Service](https://docs.microsoft.com/azure/app-service/quickstart-custom-container?tabs=dotnet&pivots=container-windows)
- [Overview of Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)
