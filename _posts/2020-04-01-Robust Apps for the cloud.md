---
layout: post
title: "The Ultimate Guide to Running Healthy Apps in the Cloud"
author: "Khaled Zayed"
tags:
    - app service
    - azure
    - resiliency
---

Modern day data centers are extremely complex and have too many moving parts. Restarts, instance changes, upgrades, file server movements and more are expected in a cloud environment. However, you can make your cloud application resilient to these problems by following a few guidelines. We've outlined in this document 15 crucial steps that you can take to ensure that your app is cloud ready. By taking these steps, you will ensure that any changes in the data center will have negligible effects on your app and that your app will be more resilient and future proof.

As mentioned above, your instances are expected to and will restart. They will be upgraded and will sometimes suffer from file server movements. However you can make your app resilient to all these incidents. In order to guarantee the maximum uptime for your app, <b>please ensure that you follow all practices</b>.
<br>

We're going to cover the following topics:
- [Have multiple instances running](#multiple-instances)
- [Update your default settings](#update-your-default-settings)
- [Ensure that your app is on a production sku](#production-ready-skus)
- [Leverage Deployment Slots](#leverage-deployment-slots)
- [Enable Health Check](#health-check-feature) 
- [Enable Application Initialization](#application-initialization) 
- [Use Run from Package](#run-from-package) 
- [Enable Local Cache](#local-cache) 
- [Enable Auto Heal](#auto-heal) 
- [Avoid overloading your App Service Plan](#app-service-plan-density) 
- [Stay within the safe limits in disk space usage](#disk-space) 
- [Use Application Insights](#application-insights) 
- [Leverage multiple Azure regions](#deploy-in-multiple-regions) 
- [Consider using Web App (Linux) depending on your app stack](#consider-using-web-app-(linux)-depending-on-your-app-stack) 
- [Check the resiliency of your app from App Service Diagnostics](#check-the-resiliency-of-your-app-from-app-service-diagnostics)

### Multiple Instances 
Running your app on one instance causes it to have one single point of failure. By ensuring that you have multiple instances allocated to your app, if something goes wrong with any particular instance, your app will still be able to respond to requests going to the other instances. One thing to keep in mind here would be that the <b> app code should be able to handle multiple instances </b> without synchronization issues with common data read/write sources. 
<br><br>You can allocate multiple instances to your app using the "Scale out (App Service Plan)" blade:
<br>
![multiple-instances]({{site.baseurl}}/media/2020/04/multiple-instances.png)
<br>

If your app has high cold start time (high app init time), then running on more than one instance is a must else your app uptime will be impacted each time we move or upgrade the instance. 

You can also leverage the Autoscale feature to scale out instances based on predefined rules such as:
- Time of day (when the app has the most traffic) 
- Resource utilization
- A combination of both!

We recommend that you run your app with <b> at least 2-3 instances </b> to avoid single point of failures.

Learn more about running multiple instances: <br>

- [Get started with Autoscale in Azure](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/autoscale-get-started?toc=/azure/app-service/toc.json)

- [App Service Warm-Up Demystified](https://michaelcandido.com/app-service-warm-up-demystified/)

### Update your default settings
When you create a new Web App, Always on is off & ARR affinity is on by default. Having Always on set to off will cause your app to idle out after sometime of inactivity that will eventually cause cold starts. Also having ARR affinity set to on can cause unequal distribution of requests between your instances and overload one of them. For production apps that are aiming to be robust, it is recommended to set <b>Always on to On</b> and <b>ARR Affinity to Off</b>


You can change that by going to the configurations section of your app in the Azure Portal and then going to the General settings tab:
<br>
![alwayson]({{site.baseurl}}/media/2020/04/alwayson.jpg)
<br>


Learn more about these settings here: <br>

- [Configure an App Service app in the Azure portal](https://docs.microsoft.com/en-us/azure/app-service/configure-common#configure-general-settings)

- [Disable Session affinity cookie (ARR cookie) for Azure web apps](https://azure.github.io/AppService/2016/05/16/Disable-Session-affinity-cookie-(ARR-cookie)-for-Azure-web-apps.html)


### Production Ready SKUs
In App Services, we offer a variety of different skus to suit all different customers. When creating your new App Service Plan, we show you the different pricing tiers based on the recommended use:
<br>
![pricing]({{site.baseurl}}/media/2020/04/pricing.jpg)
<br>
If your application is in production, please ensure that your App Service Plan is running on one of the recommended "production" pricing tiers. Moreover, if your application is resource intensive, make sure to select the appropriate pricing tier within the recommended ones according to the need of your app. For example, if your application consumes a lot of CPU cycles, running on an S1 pricing tier will not be ideal as it could potentially cause high CPU that would cause downtime or slowness on your app. 
<br>

Learn more about the Scaling here: <br>

- [Scale up an app in Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/manage-scale-up)

### Leverage Deployment Slots
Before deploying your new code to production, you can leverage the Deployment Slots feature in App Services to test your changes. Deployment slots are live apps with their own host names. App content and configurations elements can be swapped between two deployment slots, including the production slot.

Deploying your application to a non-production slot has the following benefits:
- You can validate app changes in a staging deployment slot before swapping it with the production slot.
- Deploying an app to a slot first and swapping it into production makes sure that all instances of the slot are warmed up before being swapped into production. This eliminates downtime when you deploy your app. The traffic redirection is seamless, and no requests are dropped because of swap operations. You can automate this entire workflow by configuring auto swap when pre-swap validation isn't needed.
- After a swap, the slot with previously staged app now has the previous production app. If the changes swapped into the production slot aren't as you expect, you can perform the same swap immediately to get your "last known good site" back.

![slots]({{site.baseurl}}/media/2020/04/slots.jpg)
<br>

>Please note Deployment Slots are only available for Standard, Premium, or Isolated App Service plan tiers


We highly recommend using <b> Swap with Preview </b>. Swap with Preview allows you to test the app in your staging slots against your production settings and also warm up the app. After doing your tests and warming up all the necessary paths, you can then complete the swap and the app will start receiving production traffic <b> without restarting </b>. This has a high impact on your app's availability & performance.

Learn more about deployment slots here: <br>
- [Set up staging environments in Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/deploy-staging-slots)
- [Azure Web App Deployment Slot Swap with Preview](https://ruslany.net/2015/10/azure-web-app-deployment-slot-swap-with-preview/)

### Health Check Feature 
When we have multiple instances serving in production and one of the instances goes bad, Health Check Feature will come in handy. It will exclude the unhealthy instance(s) from serving requests and improve reliability. You can specify the endpoint of your application that represents the health of your web app. It is advised to use a health-check url which can analyze the overall health of the app quickly. 
Our service will ping the health check path on all instances every 2 mins. If an instance does not respond within 10 minutes (5 pings), the instance is determined to be "unhealthy" and our service will stop routing requests to it. To setup health check feature go to "Development Tools -> Resource Explorer" on the web app blade for Azure portal: <br>
![health-check-1]({{site.baseurl}}/media/2020/04/health-check-1.jpg)
<br>On the resource explorer page, expand the "config" section and click the "web" tab. Add an element with the name, "healthCheckPath", and value is the path of your health-check url that our service will ping. <br>

![health-check-2]({{site.baseurl}}/media/2020/04/health-check-2.png)

<br>

> Please note that the Health Check feature works only when you have one or more instances, which is a <b> very </b> strong recommendation. For a single instance web app, the traffic is never blocked even if that single instance is encountering issues.

Learn more about the Health Check Feature here: <br>

- [Health Check (Preview)](https://github.com/projectkudu/kudu/wiki/Health-Check-(Preview))


### Application Initialization 
Enable Application Initialization to ensure that site (specific instance) is completely warmed before it is swapped into production and real customer traffic hits it. The warming up is also ensured in site restarts, auto scaling, and manual scaling. This is a critical feature where hitting the site's base url is not sufficient for warming up the application. For this purpose a warm-up path must be created on the app which should be unauthenticated and App Init should be configured to use this url path. Try to make sure that the method implemented by the warm-up url takes care of touching the functions of all important routes and it returns a response only when warm-up is complete. The site will be put into production only when it returns a response (success or failure) and app initialization will assume "everything is fine with the app". App Initialization can be configured for your app within web.config file. 
<br>

Learn more about Application Initialization here: <br>

- [How to warm up Azure Web App during deployment slots swap](https://ruslany.net/2015/09/how-to-warm-up-azure-web-app-during-deployment-slots-swap/)
<br>

### Run from Package
When you deploy to your App Service in any way other than Run from Package, your files are deployed to D:\home\site\wwwroot in your app (or /home/site/wwwroot for Linux apps). Since the same directory is used by your app at runtime, it's possible for deployment to fail because of file lock conflicts, and for the app to behave unpredictably because some of the files are not yet updated.

In contrast, when you run directly from a package, the files in the package are not copied to the wwwroot directory. Instead, the ZIP package itself gets mounted directly as the read-only wwwroot directory. <b> This removes a hard dependency on File System & Storage access. </b> This has a significant impact on the app's availability and performance as for example your app will be resilient against File System failovers. There are several other benefits to running directly from a package:
- Eliminates file lock conflicts between deployment and runtime.
- Ensures only full-deployed apps are running at any time.
- Can be deployed to a production app (with restart).
- Improves the performance of Azure Resource Manager deployments.
- May reduce cold-start times, particularly for JavaScript functions with large npm package trees.

> Please note that this feature is not compatible with [local cache](#local-cache). Also if you are using a CMS application, we do <b> not </b> recommend the use of this feature.

For improved cold-start performance, use the local Zip option `WEBSITE_RUN_FROM_PACKAGE=1`.

Learn more about Run from Package here: <br>

- [Run your app in Azure App Service directly from a ZIP package](https://docs.microsoft.com/en-us/azure/app-service/deploy-run-package)


### Local Cache 
When this feature is enabled, the site content is read, written from the local virtual machine instance instead of fetching from Azure storage (where site content is stored). This will reduce the number of recycles required for the app. It can be enabled through Azure portal from the "General -> Application settings". On this page under the App settings section add `WEBSITE_LOCAL_CACHE_OPTION` as key and `"Always"` as value. Also add the `WEBSITE_LOCAL_CACHE_SIZEINMB` with a desired local cache size value up to 2000MB (if not provided, it defaults to 300 MB). It helps to provide the cache size specially when the site contents are more than 300 MB. Ensure that site contents are less than 2000MB for this feature to work. Also it is a good practice to keep it as a slot setting so that it does not get removed with a swap. 
<br><b>The most important thing to keep in mind here</b> is that app should not be doing local disk writes for state persistence of its data/transactions. 
External storage like storage containers, db or cosmosDB should be used for storage purposes. 

> Please note that the behavior of Local Cache depends on the language and CMS you are using. For best results, we recommend using it for .net and .netcore apps as long as local writes are not being done by the app.  

<br>

![multiple-instances]({{site.baseurl}}/media/2020/04/local-cache.png)
<br>

![multiple-instances]({{site.baseurl}}/media/2020/04/local-cache-2.png)
<br>

Learn more about Local Cache here: <br>

- [Azure App Service Local Cache overview](https://docs.microsoft.com/en-us/azure/app-service/overview-local-cache)


### Auto Heal 
Enable auto heal on the app. I would recommend to create an auto heal mitigation rule by going to "Diagnose and Solve problems" section, selecting the "Diagnostic Tools" tile and then "Auto Healing" under Proactive Tools section. 
<br>

![multiple-instances]({{site.baseurl}}/media/2020/04/autoheal.jpg)
<br>
Below are example filter values to set up, however if some other value of error code and frequency suits your application, please modify accordingly:
<br>Define Conditions (Status Codes) 
<br>Request Count: 70 
<br>Status Code: 500 
<br>Sub-status code: 0 
<br>Win32-status code: 0 
<br>Frequency in seconds: 60 
<br>Configure Action 
<br>Recycle Process 
<br>Override when Action Executes 
<br>Startup Time for process before auto heal executes: 3600 seconds (1 hour)
<br>Learn more about Auto Heal here: <br>

- [Azure App Service Auto-Healing](https://stack247.wordpress.com/2019/05/20/azure-app-service-auto-healing/)

- [Announcing the New Auto Healing Experience in App Service Diagnostics](https://azure.github.io/AppService/2018/09/10/Announcing-the-New-Auto-Healing-Experience-in-App-Service-Diagnostics.html)
 
### App Service Plan Density 
Ensure not more than 8 apps are running on the app service plan to ensure healthy performance. All the apps running on the app service plan can be seen on "Apps" under "Settings" section in your app service plan on azure portal. 
<br><br>
Learn more about App Service Plan Density Check here: <br>

- [App Service Plan Density Check](https://azure.github.io/AppService/2019/05/21/App-Service-Plan-Density-Check.html)

### Disk Space 
Ensure that the disk space used by www folder should be less than 1GB. It is a very healthy practice in reducing downtime during app restarts and hence improve the application performance. File system usage can be tracked from "App Service Plan -> Quotas" section in Azure portal. 
<br>

![disk-usage]({{site.baseurl}}/media/2020/04/diskusage.png)
<br>

### Application Insights

Application Insights offers a suite of features that empower you to troubleshoot incidents that happen on your app. You can use it to:
- Debug code errors
- Diagnose app slowness caused by dependencies
- and more! 

One of the powerful features of Application Insights is App Insights Profiler. Enabling Application Insights Profiler provides you with performance traces for your applications that are running in production in Azure. Profiler captures the data automatically at scale without negatively affecting your users. Profiler helps you identify the "hot" code path that takes the longest time when it's handling a particular web request. Profiler works with .NET applications. To enable it, go to your Application Insights in Azure portal. Click on Performance under Investigate . In the Performance pane click on "Configure Profiler" 
<br>

![ai-1]({{site.baseurl}}/media/2020/04/aiprofiler-1.jpg)
<br>
In the pane that opens after that, click on "Profile Now" to start profiling. 
<br>

![ai-2]({{site.baseurl}}/media/2020/04/aiprofiler-2.jpg)
<br>
When Profiler is running, it profiles randomly about once per hour and for a duration of two minutes. If your application is handling a steady stream of requests, Profiler uploads traces every hour. 
To view traces, in the Performance pane, select Take Actions, and then select the Profiler Traces button. 
<br>

![ai-3]({{site.baseurl}}/media/2020/04/aiprofiler-3.jpg)
<br>

App Insights also allows you to track dependencies in your application. You can leverage this feature to troubleshoot slow requests. To automatically track dependencies from .NET console apps, install the Nuget package `Microsoft.ApplicationInsights.DependencyCollector`, and initialize `DependencyTrackingTelemetryModule` as follows:
<br><br>
    `DependencyTrackingTelemetryModule depModule = new DependencyTrackingTelemetryModule();
    depModule.Initialize(TelemetryConfiguration.Active);`
<br>
Each request event is associated with the dependency calls, exceptions, and other events that are tracked while your app is processing the request. So if some requests are doing badly, you can find out whether it's because of slow responses from a dependency. You can see a waterfall view of the requests in the performance blade as well under the "Dependencies" tab:

![ai-4]({{site.baseurl}}/media/2020/04/dependency.jpg)
<br>


You can also leverage our newly released <b>App Insights integration feature with App Service Diagnostics</b>, discussed in details here:<br>

- [Announcing Application Insights integration with App Service Diagnostics](https://azure.github.io/AppService/2020/04/21/Announcing-Application-Insights-Integration-with-App-Service-Diagnostics.html)

Learn more about Application Insights here: <br>
- [Profile production applications in Azure with Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/profiler-overview)
- [Diagnose exceptions in your web apps with Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/asp-net-exceptions)
- [Dependency Tracking in Azure Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/asp-net-dependencies#diagnosis)

### Deploy in Multiple Regions
In the event that a catastrophic incident happens in one of the Azure Datacenters, you can still guarantee that your app will run and serve requests by investing in Azure Front Door or Traffic Manager. There are additional benefits to using Front 
Door or Traffic Manager, such as routing incoming requests based the customers' geography to provide the shortest respond time to customers and distribute the load among your instances.

Learn more about Deploying in Multiple Regions here: <br>

- [Controlling Azure App Service traffic with Azure Traffic Manager](https://docs.microsoft.com/en-us/azure/app-service/web-sites-traffic-manager)

- [Quickstart: Create a Front Door for a highly available global web application](https://docs.microsoft.com/en-us/azure/frontdoor/quickstart-create-front-door)






### Consider using Web App (Linux) depending on your app stack
When creating a new Web App, follow the recommended app type in the create flow. For example, if you're going to deploy a Python or Node.js app, use Web App (Liunx):
<br>

![multiple-instances]({{site.baseurl}}/media/2020/04/linux.jpg)
<br>

We recommend using Web App (Windows) for .NET/.NET Core apps, but you should consider Web App (Linux) for other types.

### Check the resiliency of your app from App Service Diagnostics
Finally, you can check the progress you've accomplished in making your app resilient by leverage the "Best Practices" detectors available in App Service Diagnostics here:
<br>
![bestpractices]({{site.baseurl}}/media/2020/04/bestpractices.jpg)
<br>

You'll be presented by 2 options:
- Best Practices for Availability & Performance
- Best Practices for Optimal Configuration

We recommend that you follow <b> all </b> the best practices listed in those detectors and get them all to green!

___

<br>
Finally, we also recommend that you take a look at the [Cloud Design Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/) document to minimize the application start time and follow more resiliency recommendations.





Feel free to post any questions about App Resiliency on the [MSDN Forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=windowsazurewebsitespreview).
