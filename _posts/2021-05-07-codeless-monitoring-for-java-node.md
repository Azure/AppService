---
title: "Codeless Monitoring for Java and Node.js on App Service (Preview)"
author_name: "Jason Freeberg"
toc: true
toc_sticky: true
---

We are happy to share that Application Insights monitoring is now available for Java and Node.js apps on App Service for both Windows and Linux! To try it out, create a new Web App from the Portal and click the **Monitoring** tab to enable App Insights. If you already have a Java or Node.js app on App Service, then go to **Application Insights** on the web app menu to turn it on.

> This integration is currently in technical preview.

## Codeless Monitoring from Application Insights

Application Insights from Azure Monitor is a cloud native application monitoring service which enables customers to observe failures, bottlenecks, and usage patterns to improve application performance and reduce mean time to resolution (MTTR). With a few clicks, your Node.jsor Java apps can now auto-collect logs, metrics, and distributed traces, eliminating the need for including an SDK in your app.

Enabling Application Insights on your Azure web app will attach a monitoring agent to your Java or Node.js application and begin sending telemetry to App Insights... *no code changes required!* Application Insights help you better understand and monitor your applications with features like...

- [Application Map](https://docs.microsoft.com/azure/azure-monitor/app/app-map)
- [Live Metrics](https://docs.microsoft.com/azure/azure-monitor/app/live-stream)
- [Failure Analysis](https://docs.microsoft.com/azure/azure-monitor/app/proactive-failure-diagnostics)

## Get Started

### New Web App

If you do not have a Java or Node.js web app, create a new one from the Azure Portal.

1. Open the [Web App create page](https://portal.azure.com/#create/Microsoft.WebSite)
1. Select Node.js or Java as your runtime stack (Java SE, Tomcat, and JBoss EAP are all applicable.)
1. Enter your resource group, region, and App Service Plan
1. Select the monitoring tab at the top, and select **Yes** for "Enable Application Insights"

    ![Enable App Insights from the Monitoring blade.]({{ site.baseurl }}/media/2021/05/app-insights-java-node-create.png)

1. Go to **Review + Create**, review your selections, and click **Create**!

The deployment will create the Web App and Application Insights resources. Once the deployment completes, your application telemetry will be visible in the Application Insights resource.

### Existing Web App

If you already have a Node.js or Java web app, navigate to it from the Portal.

1. On the left side, scroll down to the **Application Insights** menu item and click "Turn on Application Insights".

    ![Enable App Insights from the Application Insights menu item]({{ site.baseurl }}/media/2021/05/app-insights-java-node-post-create.png)

1. The blade will default to using a new Application Insights resource of the same name as your Web App. You can choose to use an existing AI resource, or change the name.

    ![Enable App Insights from the Application Insights menu item]({{ site.baseurl }}/media/2021/05/app-insights-java-node-post-create2.png)

1. Click **Apply** at the bottom.

Your application telemetry will be visible in the Application Insights resource.

## Application Insights support on App Service

Codeless monitoring has been supported on App Service for other languages and operating systems. As of May 7th, this is the current support matrix for App Insights on App Service:

| Language | Windows | Linux |
|----------|---------|-------|
| ASP.NET  |   ✔️    |  N/A  |
| .NET 3.1, 5|   ✔️  |  🟠  |
| Java     |     ✔️  |  ✔️  |
| Node.js  |    ✔️   |  ✔️  |
| Python   |    ❌   |  ❌  |
| Ruby     |    ❌   |  ❌  |
| PHP      |    ❌   |  ❌  |

🟠: Application Insights support is planned.
