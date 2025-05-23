---
title: "Routine Planned Maintenance Notifications for Azure App Service"
author_name: "James Mulvey"
category: diagnostics
---

 #### See April 2025 improvements to App Service Maintenance Notifications  [Improvements](https://azure.github.io/AppService/2025/04/29/Azure-App-Service-Notifications-Improvements.html) 

 Updates include:

- Impacted Resources Blade
- Release Notes
- Business Hours Pausing


-------------------------

Azure App Service is regularly updated to provide new features, new runtime versions, performance improvements, and bug fixes. One of the top feature requests from our customers is the ability to receive notifications before one of the platform updates occurs. We are happy to announce that, starting early March 2022, notifications for scheduled maintenance on Azure App Service will be available for App Service Environments V3 (ASEv3) and multi-tenant applications.

With these notifications, you will be able to receive email or SMS text alerts before a platform upgrade starts, while it is in progress, and when the upgrade completes. For App Service Plan resources, we have also included a more advanced 7-day notification option allowing for more time to prepare for an upgrade. This 7-day notification will alert customers to an upcoming platform upgrade approximately 1 week before the event begins. For advanced notificaitons and precise upgrade timing for App Service Environments, see [Manual Upgrade Preference](https://learn.microsoft.com/en-us/azure/app-service/environment/how-to-upgrade-preference?pivots=experience-azp#manual-upgrade-preference). You can also invoke Azure Functions or Logic Apps based on these notifications. This article shows how to set up email and SMS alerts, as well as Function and Logic Apps, to consume these events. For critical security or livesite updates, we may not be able to send notifications as these updates are time sensitive. You may receive just pre-start, in-progress, and completion notifcations but not 7-day notifications if there is not sufficient lead time. 

## Overview

The maintenance notifications for App Service are surfaced as events in Azure Monitor. This means that you can set up your email address and/or SMS phone number when a notification is generated. You can also set up a trigger for your custom Azure Function or Logic App, which allows you to automatically take action to your resources. For example, you can automatically divert all the traffic from your App Service Environment in one region which will be upgraded to an App Service Environment in another region in order to avoid any potential impact. Then, you can automatically change the traffic back to normal when an upgrade completes. Please refer to the [Logic App sample for automatic traffic diversion for Azure App Service](https://github.com/Azure-Samples/azure-logic-app-traffic-update-samples) for more details.

## Viewing upgrade notifications 

From the Azure portal, go to **Home** > **Monitor** > **Service Health** > **Planned maintenance**. Here you can see all active (including upcoming or in-progress) notifications for the selected subscriptions. To make it easy to find App Service upgrade events, click the **Service** box, check all App Service types and uncheck everything else. To see past notifications, navigate to **Health history** and filter **Planned maintenance** from the Health Event Type box.

![]({{ site.baseurl }}/media/2022/02/upgradenotification.png)

## Setting up alerts

1. Open **Azure portal**, sign in with your credentials.
1. Search for the icon named **Monitor** and click it. If you cannot see it, click the arrow on the right to show **All services**, then search Monitor.
1. In the left menu items, click **Alerts**.
1. Click **Service Health**.
1. Click **Add service health alert** at the top center.
1. In the Condition section, choose the subscription that owns your App Service Environment(s).
1. At the Service(s) box, choose all items starting with App Service:
    1. App Service
    1. App Service \ Web Apps
    1. App Service (Linux)
    1. App Service (Linux) \ Web App for Containers
    1. App Service (Linux) \ Web App
1. At the Region(s) box, make sure to check the regions of the App Service Environment(s).
1. At the Event type box, check **Planned maintenance**.
1. In the Actions section, click **Add action groups**.
1. Click **Create alert rule**.
1. Select a subscription that your App Service Environment belongs to.
1. Choose a resource group and name an action group. Set Display name to something you can easily identify the action for (**IMPORTANT**: The display name will be shown in every email/SMS/post of the notifications).
1. *If you want to receive text notifications*, in the Notifications section, choose **Email/SMS message/Push/Voice** at the Notification type. Then choose output channels you need (For example, Email or SMS.) Put email addresses or phone numbers as necessary.
1. *If you want to hook up your custom automation*, in the Actions section, choose **Azure Function** or **Logic App** at the Action type. Put a name into the Name. Select your app.
1. Press **Save changes**. The page will go back to the Rules management page.
1. In the Alert rule details section, set a name.
1. Click **Save**.

## More resources

- [Azure Monitor documentation](https://docs.microsoft.com/azure/azure-monitor/)
- [Common alert schema definitions](https://docs.microsoft.com/azure/azure-monitor/alerts/alerts-common-schema-definitions)
- [Logic App sample for automatic traffic diversion for Azure App Service](https://github.com/Azure-Samples/azure-logic-app-traffic-update-samples)

## FAQ

**When do you send the upgrade notifications?**  
For App Service Plans, the first notifications will be created about 7 days before an actual upgrade operation starts. A notification is then sent, to both ASEs and App Service Plans, 60-90 minutes before maintenance starts and then again once upgrades are underway.  

Once the upgrade starts, we send in-progress notifications every 12 hours until the operation completes. After it has finished, we send a notification of completion.

**Will the upgrade happen in exactly 7 days?**  
The exact timing of the maintenance may vary depending on several factors, but will not be before 7 days. You will still receive a notification shortly before maintenance begins.

**When will 7-day notifications be available for ASE?**  
While the 7-day notifications will not be applicable for ASEs, ASEv3 Customers will have the option to manually upgrade their resources on-demand via [Manual Upgrade Preference](https://learn.microsoft.com/en-us/azure/app-service/environment/how-to-upgrade-preference?pivots=experience-azp#manual-upgrade-preference).

**How long do App service Upgrades take?**  
Our typical time for completing updates worldwide is about 10 business days, which allows us to deploy during each region’s off hours and also avoid deploying to Paired Regions at the same time (for example, East US and West US).

**Why did I not receive a notification when my App Service was upgraded?**  
There are two main reasons why customers may not receive notification of an upgrade. The first reason is that customers may not have followed the opt-in steps listed above. The second reason for not receiving upgrade notifications is the maintenance performed was part of a security patch or hotfix that may not have had enough lead time to provide notifications. These events should not cause any impact to current resources.

**Why did I not receive a 7-day advance notification before receiving in-progress notifications** 
This upgrade was likely an unplanned maintenance event, either a hotfix or critical security patch. As Microsoft commits to ensuring security of resources, we may not always have 7 days lead time when pushing an update to address these concerns. These notifications will specify unplanned maintenance in the title.

**We received notification for upgrade, but we do not see Application restarts/instance movements on the App service. What did we receive an alert for?** 
Usually, this happens when upgrades are still working their way through a given region and not yet reached your App Service. App Service follows safe deployment practices, requiring segmented deployment of upgrades.

**Why did I not receive a notification when my App Service was upgraded?**  
There are two main reasons why customers may not receive notification of an upgrade. The first reason is that customers may not have followed the opt-in steps listed above. The second reason for not receiving upgrade notifications is the maintenance performed was part of a security patch or hotfix that may not have had enough lead time to provide notifications. These events should not cause any impact to current resources.

**Can I invoke my Azure Function when a notification comes?**  
Yes, you can set up action to trigger your Azure Function or Logic App. It is recommended to not trigger automation based on the 7-day notiifcation as exact times may vary. The 7 day notification is for awareness and using the follow on notifications of before, during, and after completion will be more precise. Please see [Logic App sample for automatic traffic diversion for Azure App Service](https://github.com/Azure-Samples/azure-logic-app-traffic-update-samples) as an example.

To see the data format of the notifications, refer to [Common alert schema definitions](https://docs.microsoft.com/azure/azure-monitor/alerts/alerts-common-schema-definitions).
