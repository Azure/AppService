---
title: "Routine Planned Maintenance Notifications Improvements for App Service"
author_name: "James Mulvey"
category: diagnostics
---

As of April 2025, we are happy to announce major improvements to App Service routine maintenance notifications. 

## Recent Improvements
In our ongoing efforts to enhance the experience for App Service customers, we have made significant improvements to our maintenance notification system. These updates extend the March 2022 announcement about scheduled maintenance notifications [Maintenance Notifications for Azure App Service](https://azure.github.io/AppService/2022/02/01/App-Service-Planned-Notification-Feature.html)

## Impacted Resources Blade
One of the key improvements is the introduction of the Impacted Resources blade in Azure Service Health. This new feature allows customers to see the exact App Service Plan resources that are affected by maintenance activities. By providing precise status timestamps for when maintenance starts and finishes, the Impacted Resources blade offers a clear and detailed view of the maintenance progress. This self-service capability empowers customers to track the status of their resources independently.

From the Azure portal, go to **Home** > **Monitor** > **Service Health** > **Planned maintenance** > **Select an Issue Name** > **Impacted Resources** > **More Info**.
![Impacted Resources]({{ site.baseurl }}/media/2025/04/MoreInfo1.png)

 Here you can see the exact resources being upgraded within your App Service Plan. You can also see the current status. This can be pending, started, or completed. (with timestamps for ease of investigation)
![Impacted Resources More Info]({{ site.baseurl }}/media/2025/04/MoreInfo2.png)

## Automated Release Notes
We have also implemented automated release notes. Customers will now receive automated links within maintenance notifications to App Service Release Notes, which provide only the most critical information. This addresses the high demand for basic release notes and ensures that customers have access to essential updates. [App Service Release Notes](https://github.com/Azure/AppService/releases)

## Pausing Upgrades During Business Hours
Another important enhancement is the pausing of upgrades for App Service Plan resources during business hours. Maintenance operations are optimized to start outside the standard business hours of 9 AM to 5 PM. If resources are still upgrading by 9 AM in a given region, the upgrade will continue until reaching a safe stopping point, pausing before the next critical step and until the end of business hours. This approach ensures minimal disruption to customer workloads during peak business hours and provides a more predictable maintenance schedule.

