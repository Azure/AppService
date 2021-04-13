---
title: "Upgrade Notifications for App Service"
author_name: "Michimune Kohno and Sanghmitra Gite"
toc: true
toc_sticky: true
tags:
    - Upgrade notifications
    - Azure Monitor
    - App Service Environment
    - Logic Apps
---

We are happy to announce that the scheduled or planned maintenance notifications for App Service Environment  (Preview) is available. With that notification you will be able to receive email or SMS text which allows you to take action before a platform upgrade starts if necessary. You can even invoke your Azure Function or Logic App if you want.

The Azure App Service is a PaaS solution offering in Azure which constantly updates the platform. One of the top requests from customers is to receive a notification before an upgrade operation happens. This feature has been rolled out for App Service Environments (ASEs) across regions.

> Support for other App Service SKUs will be coming soon.

## Overview

Our maintenance notification for App Service is essentially an event of Azure Monitor. This means that you can set up your email address and/or SMS phone number when a notification is generated. You can also set up a trigger for your custom Azure Function or Logic App, which allows you to automatically take action to your resources. For example, you can automatically divert all the traffic to your ASE in one region which will be upgraded to ASE in another region in order to avoid any potential impact. Then you can automatically change the traffic back to normal when an upgrade completes. Please refer to [Logic App sample for automatic traffic diversion for Azure App Service](https://github.com/Azure-Samples/azure-logic-app-traffic-update-samples) for more details.

## Viewing upgrade notifications

On the Azure portal, go to **Home** > **Monitor** > **Service Health** > **Planned maintenance**. Here you can see all active (Either upcoming or in-progress) notification for the selected subscriptions. To make it easy to find App Service upgrade events, click **Service** box, check all App Service types and uncheck everything else.

To see past notifications, navigate to **Health history** and filter **Planned maintenance** from the Health Event Type box.

![Health history]({{ site.baseurl }}/media/2021/04/upgrade-notification-health-history.png)

## Setting up alerts

1. Open **Azure portal**, sign in with your credentials.
2. Search an icon named **Monitor** and click it. If you cannot see it, click the big right arrow on the right to show **All services**, then search `Monitor`.
3. In the left menu items, click **Alerts**.
4. Click **Service Health**.
5. Click **Add service health alert** at the top center.
6. In the Condition section, choose the subscription that owns your ASEs.
7. At the Service(s) box, choose all items starting with `App Service`:
   * App Service
   * App Service \ Web Apps
   * App Service (Linux)
   * App Service (Linux) \ Web App for Containers
   * App Service (Linux) \ Web App.
8. At the Region(s) box, make sure to check the regions of the ASEs.
9. At the Event type box, check **Planned maintenance**.
10. In the Actions section, click **Add action groups**.
11. Click **Create alert rule**.
12. Select the subscription that you have created your Logic app during the previous part.
13. Choose a resource group and name an action group. Set Display name to something you can easily identify the action (**IMPORTANT**: The display name will be shown in every email/SMS/post of the notifications.)
14. *If you want to receive text notifications*: In the Notifications section, choose **Email/SMS message/Push/Voice** at the Notification type. Then choose output channels you need (For example, Email and SMS.) Put email addresses or phone number as necessary.
15. *If you want to hook up your custom automation*: In the Actions section, choose **Azure Function** or **Logic App** at the Action type. Put a name into the Name. Select your app.
16. Press **Save changes**. The page will go back to the Rules management page.
17. In the Alert rule details section, set a name.
18. Click **Save**.

## More resources

* [Azure Monitor documentation](https://docs.microsoft.com/azure/azure-monitor/)
* [Common alert schema definitions](https://docs.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-common-schema-definitions#:~:text=Essentials%20%20%20%20Field%20%20%20,the%20alert%20...%20%209%20more%20rows%20)
* [Logic App sample for automatic traffic diversion for Azure App Service](https://github.com/Azure-Samples/azure-logic-app-traffic-update-samples)

## FAQ

### When do you send the upgrade notifications?

The first notifications will be created about 60 to 90 minutes before an actual upgrade operation starts. We don't create notifications anything earlier due to some limitations at this moment.

Once the upgrade starts, we send in-progress notifications every 12 hours until the operation completes. After it's finished we send a notification of completion.

### Is it in preview now?

Yes, it's in preview. There is no GA date planned yet.

### Can we get notifications earlier, like one day before?

No. At this point from 60 minutes to 90 minutes is the earliest timing of notifications.

### Is it only available for ASEs?

Yes, currently it is only available for ASEs. We are actively working on enabling it for other App Service SKUs.

### Can we invoke my Azure Function when a notification comes?

Yes, you can set up action to trigger your Azure Function or Logic App. Please see [Logic App sample for automatic traffic diversion for Azure App Service](https://github.com/Azure-Samples/azure-logic-app-traffic-update-samples) as example.

To see the data format of the notifications, refer to [Common alert schema definitions](https://docs.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-common-schema-definitions#:~:text=Essentials%20%20%20%20Field%20%20%20,the%20alert%20...%20%209%20more%20rows%20).
