---
layout: post
title: "Robust app for running in a cloud environment"
author: "Khaled Zayed"
tags:
    - app service
    - azure
    - resiliency
---

Modern day data centers are extremely complex and have too many moving parts. Restarts, instance changes, upgrades, file server movements and more are expected in a cloud environment. However, you can make your cloud application resilient to these problems by following a few guidelines. We've outlined in this document 10 crucial steps that you can take to ensure that your app is cloud ready. By taking these steps, this will ensure that any changes in the data center will have negligible effects on your app and that your app will be more resilient and future proof.
<br>

We're going to cover the following topics:
<br>1) Have multiple instances running
<br>2) Ensure that your app is on a production sku
<br>3) Enable Health Check 
<br>4) Enable Application Initialization 
<br>5) Enable Local Cache 
<br>6) Enable AutoHeal
<br>7) Avoid overloading your App Service Plan
<br>8) Stay within the safe limits in disk space usage
<br>9) Enable application insights profiler and exception tracking for future downtime investigations
<br>10) Leverage multiple Azure regions

## Multiple Instances 
Ensure that you have multiple instances allocated to your app. It is one of the commonly used health practices. This ensures that the app will not go down if something goes wrong with any particular instance. One thing to keep in mind here would be that the <b>app code should be able to handle multiple instances</b> without synchronization issues with common data read/write sources.You can allocate multiple instances to your app using the "Scale out (App Service Plan)" section on Azure Portal:
<br>
![multiple-instances]({{site.baseurl}}/media/2020/04/multiple-instances.png)
<br>
To learn more about running multiple instances, click [here](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/autoscale-get-started?toc=/azure/app-service/toc.json).


## Production Ready SKUs
In App Services, we offer a variety of different skus to suit all different customers. When creating your new App Service Plan, we show you the different pricing tiers based on the recommended use:
<br>
![pricing]({{site.baseurl}}/media/2020/04/pricing.jpg)
<br>
If your application is in production, please ensure that your App Service Plan is running on one of the recommended "production" pricing tiers. Moreover, if your application is resource intensive, make sure to select the appropriate pricing tier within the recommended ones according to the need of your app. For example, if your application consumes a lot of CPU cycles, running on an S1 pricing tier will not be ideal as it could potentially cause high CPU that would cause downtime or slowness on your app. 
<br>
To learn more about the Scale Up feature, click [here](https://docs.microsoft.com/en-us/azure/app-service/manage-scale-up).

## Health Check Feature 
When we have multiple instances serving in production and one of the instances goes bad, Health Check Feature will come in handy. It will exclude the unhealthy instance(s) from serving requests and improve reliability. You can specify the endpoint of your application that represents the health of your web app. It is advised to use a health-check url which can analyze the overall health of the app quickly. 
Our service will ping the health check path on all instances every 2 mins. If an instance does not respond within 10 minutes (5 pings), the instance is determined to be "unhealthy" and our service will stop routing requests to it. To setup health check feature go to "Development Tools  Resource Explorer" on the web app blade for Azure portal <br>
![health-check-1]({{site.baseurl}}/media/2020/04/health-check-1.jpg)
<br>On the resource explorer page, expand the "config" section and click the "web" tab. Add an element with the name, "healthCheckPath", and whose value is the path of your health-check url that our service will ping. <br>

![health-check-2]({{site.baseurl}}/media/2020/04/health-check-2.png)

<br>

To learn more about the Health Check Feature, click [here](https://github.com/projectkudu/kudu/wiki/Health-Check-(Preview)).


## Application Initialization 
Enable Application Initialization to ensure that site (specific instance) is completely warmed before it is swapped into production and real customer traffic hits it. The warming up is also ensured in site restarts, auto scaling, and manual scaling. This is a critical feature where hitting the site's base url is not sufficient for warming up the application. For this purpose a warm-up path must be created on the app which should be unauthenticated and App Init should be configured to use this url path. Try to make sure that the method implemented by the warm-up url takes care of touching the functions of all important routes and it returns a response only when warm-up is complete. The site will be put into production only when it returns a response (success or failure) and app initialization will assume "everything is fine with the app". App Initialization can be configured for your app within web.config file. 
<br>

To learn more about Application Initialization, click [here](https://ruslany.net/2015/09/how-to-warm-up-azure-web-app-during-deployment-slots-swap/).

<br>

## Local Cache 
When this feature is enabled, the site content is read, written from the local virtual machine instance instead of fetching from Azure storage (where site content is stored). This will improve the performance of site during restarts and also will reduce the number of restarts required for the app. It can be enabled through Azure portal from the "General -> Application settings". On this page under the App settings section add `WEBSITE_LOCAL_CACHE_OPTION` as key and `"Always"` as value. Also add the `WEBSITE_LOCAL_CACHE_SIZEINMB` with a desired local cache size value up to 2000MB (if not provided, it defaults to 300 MB). It helps to provide the cache size specially when the site contents are more than 300 MB. Ensure that site contents are less than 2000MB for this feature to work. Also it is a good practice to keep it as a slot setting so that it does not get removed with a swap. 
>The most important thing to keep in mind here is that app should not be doing local disk writes for state persistence of its data/transactions. 
External storage like storage containers, db or cosmosDB should be used for storage purposes. 


<br>

![multiple-instances]({{site.baseurl}}/media/2020/04/local-cache.png)
<br>

![multiple-instances]({{site.baseurl}}/media/2020/04/local-cache-2.png)
<br>

To learn more about Local Cache, click [here](https://docs.microsoft.com/en-us/azure/app-service/overview-local-cache).
## Auto Heal 
Enable auto heal on the app. I would recommend to create an auto heal mitigation rule by going to "Diagnose and Solve problems" section, selecting the "Diagnostic Tools" tile and then "Auto Healing" under Proactive Tools section. 
<br>

![multiple-instances]({{site.baseurl}}/media/2020/04/autoheal.jpg)
<br>
Below are recommended filter values to set up, however if some other value of error code and frequency suits your application, please modify accordingly:
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
 
<br>
Learn more about Autoheal here: <br>

- [Azure App Service Auto-Healing](https://stack247.wordpress.com/2019/05/20/azure-app-service-auto-healing/)

- [Announcing the New Auto Healing Experience in App Service Diagnostics](https://azure.github.io/AppService/2018/09/10/Announcing-the-New-Auto-Healing-Experience-in-App-Service-Diagnostics.html)
 
## App Service Plan Density 
Ensure not more than 8 apps are running on the app service plan to ensure healthy performance. All the apps running on the app service plan can be seen on "Apps" under "Settings" section in your app service plan on azure portal. 
<br>
Learn more about App Service Plan density check [here](https://azure.github.io/AppService/2019/05/21/App-Service-Plan-Density-Check.html).

## Disk Space 
Ensure that the disk space used by www folder should be less than 1GB. It is a very healthy practice in reducing downtime during app restarts and hence improve the application performance. File system usage can be tracked from "App Service Plan -> Quotas" section in Azure portal. 
<br>

![disk-usage]({{site.baseurl}}/media/2020/04/diskusage.png)
<br>

## Application Insights Profiler 
Enable Application Insights Profiler in your app. Azure Application Insights Profiler provides performance traces for applications that are running in production in Azure. Profiler captures the data automatically at scale without negatively affecting your users. Profiler helps you identify the "hot" code path that takes the longest time when it's handling a particular web request. Profiler works with .NET applications. To enable it, go to your Application Insights in Azure portal. Click on Performance under Investigate . In the Performance pane click on "Configure Profiler" 
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
 

To learn more about Application Insights Profiler, click [here](https://docs.microsoft.com/en-us/azure/azure-monitor/app/profiler-overview).




## Deploy in Multiple Regions
Invest in Azure Frontdoor and App services in multiple regions to achieve uptime even if a datacenter or region has outages.

Feel free to post any questions about App Resiliency on the [MSDN Forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=windowsazurewebsitespreview).
