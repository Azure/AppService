---
title: "The Ultimate Guide to Running Healthy Apps in the Cloud"
author_name: "Khaled Zayed"
toc: true
toc_sticky: true
tags:
    - resiliency
---

Modern day data centers are extremely complex and have too many moving parts. Restarts, instance changes, upgrades, file server movements and more are expected in a cloud environment. However, you can make your cloud application resilient to these problems by following a few guidelines. We've outlined in this document 15 crucial steps that you can take to ensure that your app is cloud ready. By taking these steps, you will ensure that any changes in the data center will have negligible effects on your app and that your app will be more resilient and future proof.

As mentioned above, your instances are expected to and will restart. They will be upgraded and will sometimes suffer from file server movements. However you can make your app resilient to all these incidents. In order to guarantee the maximum uptime for your app, **please ensure that you follow all practices**.

## Use Multiple Instances

Running your app on one instance causes it to have one single point of failure. By ensuring that you have multiple instances allocated to your app, if something goes wrong with any particular instance, your app will still be able to respond to requests going to the other instances. Keep in mind that your **app code should be able to handle multiple instances** without synchronization issues when reading or writing to data sources. You can allocate multiple instances to your app using the "Scale out (App Service Plan)" blade:

![multiple-instances]({{site.baseurl}}/media/2020/04/multiple-instances.png)

We recommend that you run your app with **at least 2-3 instances** to avoid a single point-of-failures, especially if your app takes considerable time to start (known as cold start). Running more than one instance ensures that your application is available when App Service moves or upgrades the underlying VM instances. You can also configure rules to automatically scale out based on predefined rules such as:

- Time of day (when the app has the most traffic)
- Resource utilization (memory, CPU, etc.)
- A combination of both!

**Learn More**

- [Get started with Autoscale in Azure](https://docs.microsoft.com/azure/azure-monitor/platform/autoscale-get-started?toc=/azure/app-service/toc.json)
- [App Service Warm-Up Demystified](https://michaelcandido.com/app-service-warm-up-demystified/)

## Update your default settings

App Service has many settings for developers to configure the web app to their use case. **Always-On** keeps your application up even when no requests have been received in the past 20 minutes. By default, Always-On is disabled; enabling Always-On will prevent application cold-starts. **ARR Affinity** creates sticky sessions so that clients will connect to the same app instance on subsequent requests. However, ARR Affinity can cause unequal distribution of requests between your instances and possibly overload an instance. For production apps that are aiming to be robust, it is recommended to set **Always on to On** and **ARR Affinity to Off**

You can change that by going to the configurations section of your app in the Azure Portal and then going to the General settings tab:

![alwayson]({{site.baseurl}}/media/2020/04/alwayson.jpg)

**Learn More**

- [Configure an App Service app in the Azure portal](https://docs.microsoft.com/azure/app-service/configure-common#configure-general-settings)
- [Disable Session affinity cookie (ARR cookie) for Azure web apps](https://azure.github.io/AppService/2016/05/16/Disable-Session-affinity-cookie-(ARR-cookie)-for-Azure-web-apps.html)

## Use Production Hardware

App Service offers a variety of hardware tiers (also known as SKUs) to suit different customer needs. When creating a new App Service Plan, you have an option to select a different hardware tier for your plan:

![pricing]({{site.baseurl}}/media/2020/04/pricing.jpg)

If your App Service Plan is used for production, please ensure that your App Service Plan is running on one of the recommended "production" pricing tiers. Moreover, if your application is resource intensive, make sure to select the appropriate pricing tier within the recommended ones according to the need of your app. For example, if your application consumes a lot of CPU cycles, running on an S1 pricing tier will not be ideal as it could potentially cause high CPU that would cause downtime or slowness on your app.

**Learn More**

- [Scale up an app in Azure App Service](https://docs.microsoft.com/azure/app-service/manage-scale-up)

## Leverage Deployment Slots

Before deploying your new code to production, you can leverage the Deployment Slots feature in App Services to test your changes. Deployment slots are live apps with their own host names. App content and configurations elements can be swapped between two deployment slots, including the production slot.

Deploying your application to a non-production slot has the following benefits:

- You can validate app changes in a staging environment before swapping it into the production slot.
- Deploying an app to a slot first and swapping it into production makes sure that all instances of the staging slot are warmed up before swapping into production. This eliminates downtime when you deploy your app. The traffic redirection is seamless, and no requests are dropped because of swap operations. You can automate this entire workflow by configuring auto swap.
- After a swap, the slot with previously staged app now has the previous production app. If the changes swapped into the production slot aren't as you expect, you can perform the same swap immediately to get your "last known good site" back.

![slots]({{site.baseurl}}/media/2020/04/slots.jpg)

> Please note that Deployment Slots are only available for Standard, Premium, or Isolated App Service plan tiers

We highly recommend using **Swap with Preview**. Swap with Preview allows you to test the app in your staging slots against your production settings and also warm up the app. After doing your tests and warming up all the necessary paths, you can then complete the swap and the app will start receiving production traffic **without restarting**. This has a high impact on your app's availability & performance.

**Learn More**

- [Set up staging environments in Azure App Service](https://docs.microsoft.com/azure/app-service/deploy-staging-slots)
- [Azure Web App Deployment Slot Swap with Preview](https://ruslany.net/2015/10/azure-web-app-deployment-slot-swap-with-preview/)
- [Deployment best practices](https://docs.microsoft.com/azure/app-service/deploy-best-practices#use-deployment-slots) 

## Set your Health Check path

App Service allows you to specify a health check path on your apps. The platform pings this path to determine if your application is healthy and responding to requests. When your site is scaled out to multiple instances, App Service will exclude any unhealthy instance(s) from serving requests, improving your overall availability. Your app's health check path should poll the critical components of your application, such as your database, cache, or messaging service. This ensures that the status returned by the health check path is an accurate picture of the overall health of your application.

1. Go to *Development Tools* > *Resource Explorer* on the web app blade for Azure portal:

    ![health-check-1]({{site.baseurl}}/media/2020/04/health-check-1.jpg)

1. On the resource explorer page, expand the "config" section and click the "web" tab. Add an element with the name, "healthCheckPath", and value is the path of your health-check url that our service will ping.

    ![health-check-2]({{site.baseurl}}/media/2020/04/health-check-2.png)

> Please note that the Health Check feature works only when you have one or more instances, which is a **very** strong recommendation. For a single instance web app, the traffic is never blocked even if that single instance is encountering issues.

**Learn More**

- [Health Check (Preview)](https://github.com/projectkudu/kudu/wiki/Health-Check-(Preview))

## Use Application Initialization

Enable Application Initialization to ensure that your app instances are have fully started before they are added to the load balancer. Application Initialization is used during site restarts, auto scaling, and manual scaling. This is a critical feature where hitting the site's root path is not sufficient to start the application. For this purpose a warm-up path must be created on the app which should be unauthenticated and App Init should be configured to use this url path. Try to make sure that the method implemented by the warm-up url takes care of touching the functions of all important routes and it returns a response only when warm-up is complete. The site will be put into production only when it returns a response (success or failure) and app initialization will assume "everything is fine with the app". App Initialization can be configured for your app within web.config file.

**Learn More**

- [How to warm up Azure Web App during deployment slots swap](https://ruslany.net/2015/09/how-to-warm-up-azure-web-app-during-deployment-slots-swap/)

## Run from a package file

When you deploy to your App Service in any way other than Run from Package, your files are deployed to `D:\home\site\wwwroot` (or `/home/site/wwwroot` on Linux apps). Since the same directory is used by your app at runtime, it is possible for a deployment to fail because of file lock conflicts, and for the app to behave unpredictably because some files were not yet updated.

In contrast, when you run directly from a package, the app files are not copied to the `wwwroot/` directory. Instead, the .zip file itself is mounted directly as a read-only directory. **This removes a hard dependency between the app instance and the shared File System**. This has a significantly increases the app's availability and performance. For example, your app will be resilient against File System failovers. There are several other benefits to running directly from a package:

- Eliminates file lock conflicts between deployment and runtime.
- Ensures only full-deployed apps are running at any time.
- Can be deployed to a production app (with restart).
- Improves the performance of Azure Resource Manager deployments.
- May reduce cold-start times, particularly for JavaScript functions with large npm package trees.

> Please note that this feature is not compatible with [local cache](#local-cache). Also if you are using a CMS application, we do **not** recommend the use of this feature.

Refer to the documentation to [get started with Run from Package](https://docs.microsoft.com/azure/app-service/deploy-run-package). Ensure to set the app setting `WEBSITE_DISABLE_STANDBY_VOLUMES = 1`, this prevents the app from getting restarted when the primary storage volume is down and the app starts using standby storage volume. 

> Please note the zip file should not exceed 1 GB.

## Enable Local Cache

When this feature is enabled, the site content is read, written from the local virtual machine instance instead of fetching from Azure storage (where site content is stored). This will reduce the number of recycles required for the app. It can be enabled through Azure portal from the "General -> Application settings". On this page under the App settings section add `WEBSITE_LOCAL_CACHE_OPTION` as key and `"Always"` as value. Also add the `WEBSITE_LOCAL_CACHE_SIZEINMB` with a desired local cache size value up to 2000MB (if not provided, it defaults to 300 MB). It helps to provide the cache size specially when the site contents are more than 300 MB. Ensure that site contents are less than 2000MB for this feature to work. Also it is a good practice to keep it as a slot setting so that it does not get removed with a swap.
**The most important thing to keep in mind here** is that app should not be doing local disk writes for state persistence of its data/transactions.
External storage like storage containers, db or cosmosDB should be used for storage purposes.

> Please note that the behavior of Local Cache depends on the language and CMS you are using. For best results, we recommend using it for .net and .netcore apps as long as local writes are not being done by the app.  

![multiple-instances]({{site.baseurl}}/media/2020/04/local-cache.png)

![multiple-instances]({{site.baseurl}}/media/2020/04/local-cache-2.png)

**Learn More**

- [Azure App Service Local Cache overview](https://docs.microsoft.com/en-us/azure/app-service/overview-local-cache)

## Auto Heal

Enable auto heal on the app. I would recommend to create an auto heal mitigation rule by going to "Diagnose and Solve problems" section, selecting the "Diagnostic Tools" tile and then "Auto Healing" under Proactive Tools section.

![multiple-instances]({{site.baseurl}}/media/2020/04/autoheal.jpg)

Below are example filter values to set up, however if some other value of error code and frequency suits your application, please modify accordingly:

| Condition        |       Value    |
|------------------|----------------|
| Request Count    | 70             |
| Status Code      | 500            |
| Sub-status code  | 0              |
| Win32-status code| 0              |
| Frequency in seconds| 60          |
| Request Count    | 70             |
| Request Count    | 70             |
| Request Count    | 70             |

Configure Action
<br>Recycle Process
<br>Override when Action Executes 
<br>Startup Time for process before auto heal executes: 3600 seconds (1 hour)

**Learn More**

- [Azure App Service Auto-Healing](https://stack247.wordpress.com/2019/05/20/azure-app-service-auto-healing/)
- [Announcing the New Auto Healing Experience in App Service Diagnostics](https://azure.github.io/AppService/2018/09/10/Announcing-the-New-Auto-Healing-Experience-in-App-Service-Diagnostics.html)

## Minimize App Service Plan Density

Ensure not more than 8 apps are running on the app service plan to ensure healthy performance. All the apps running on the app service plan can be seen on "Apps" under "Settings" section in your app service plan on azure portal.

Learn more about App Service Plan Density Check here:

- [App Service Plan Density Check](https://azure.github.io/AppService/2019/05/21/App-Service-Plan-Density-Check.html)

## Monitor Disk Space usage

Ensure that the disk space used by www folder should be less than 1GB. It is a very healthy practice in reducing downtime during app restarts and hence improve the application performance. File system usage can be tracked from "App Service Plan -> Quotas" section in Azure portal.

![disk-usage]({{site.baseurl}}/media/2020/04/diskusage.png)

## Enable Application Insights

Application Insights offers a suite of features that empower you to troubleshoot incidents that happen on your app. You can use it to debug code errors, diagnose performance degradations caused by dependencies and more.

One of the powerful features of Application Insights is the App Insights Profiler. Enabling Application Insights Profiler provides you with performance traces for your applications that are running in production in Azure. Profiler captures the data automatically at scale without negatively affecting your users. Profiler helps you identify the "hot" code paths that take the longest when handling a web request. Profiler works with .NET applications. To enable it, go to your Application Insights in Azure portal. Click on Performance under Investigate. 

1. In the Performance pane click on "Configure Profiler"

    ![ai-1]({{site.baseurl}}/media/2020/04/aiprofiler-1.jpg)

1. In the pane that opens after that, click on "Profile Now" to start profiling.

    ![ai-2]({{site.baseurl}}/media/2020/04/aiprofiler-2.jpg)

1. When Profiler is running, it profiles randomly about once per hour and for a duration of two minutes. If your application is handling a steady stream of requests, Profiler uploads traces every hour. 
To view traces, in the Performance pane, select Take Actions, and then select the Profiler Traces button. 

    ![ai-3]({{site.baseurl}}/media/2020/04/aiprofiler-3.jpg)

1. App Insights also allows you to track dependencies in your application. You can leverage this feature to troubleshoot slow requests. To automatically track dependencies from .NET console apps, install the Nuget package `Microsoft.ApplicationInsights.DependencyCollector`, and initialize `DependencyTrackingTelemetryModule` as follows:

    ```c#
    DependencyTrackingTelemetryModule depModule = new DependencyTrackingTelemetryModule();
    depModule.Initialize(TelemetryConfiguration.Active);
    ```

1. Each request event is associated with the dependency calls, exceptions, and other events that are tracked while your app is processing the request. So if some requests are doing badly, you can find out whether it's because of slow responses from a dependency. You can see a waterfall view of the requests in the performance blade as well under the "Dependencies" tab:

    ![ai-4]({{site.baseurl}}/media/2020/04/dependency.jpg)

You can also leverage our newly released [App Insights integration with App Service Diagnostics](https://azure.github.io/AppService/2020/04/21/Announcing-Application-Insights-Integration-with-App-Service-Diagnostics.html), discussed in details here:

**Learn More**

- [Profile production applications in Azure with Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/profiler-overview)
- [Diagnose exceptions in your web apps with Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-exceptions)
- [Dependency Tracking in Azure Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-dependencies#diagnosis)

## Deploy in Multiple Regions

In the event that a catastrophic incident happens in one of the Azure Datacenters, you can still guarantee that your app will run and serve requests by investing in Azure Front Door or Traffic Manager. There are additional benefits to using Front Door or Traffic Manager, such as routing incoming requests based the customers' geography to provide the shortest respond time to customers and distribute the load among your instances.

**Learn More**

- [Controlling Azure App Service traffic with Azure Traffic Manager](https://docs.microsoft.com/en-us/azure/app-service/web-sites-traffic-manager)
- [Quickstart: Create a Front Door for a highly available global web application](https://docs.microsoft.com/en-us/azure/frontdoor/quickstart-create-front-door)

## Consider using Linux

When creating a new Web App, follow the recommended app type in the create flow. For example, if you're going to deploy a Python or Node.js app, use Linux.

![multiple-instances]({{site.baseurl}}/media/2020/04/linux.jpg)

We recommend using Windows for .NET/.NET Core apps, but you should consider Linux for your Python, Java, and Node apps.

## Check App Service Diagnostics

Finally, you can check the progress you've accomplished in making your app resilient by leverage the "Best Practices" detectors available in App Service Diagnostics here:

![bestpractices]({{site.baseurl}}/media/2020/04/bestpractices.jpg)

You'll be presented by 2 options:

- Best Practices for Availability & Performance
- Best Practices for Optimal Configuration

We recommend that you follow all the best practices listed in those detectors and get them all to green!

___

Finally, we also recommend that you take a look at the [Cloud Design Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/) document to minimize the application start time and follow more resiliency recommendations.

Feel free to post any questions about App Resiliency on the [MSDN Forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=windowsazurewebsitespreview).
