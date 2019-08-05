---
layout: post
title: "Bring visibility to your app and its dependencies with Navigator"
author: "Yun Jung Choi"
tags: app service, azure app service, diagnostics, support, web app, troubleshooting, self-help
---

Application downtime can be dreadful, especially when the app is handling mission-critical load. There could be countless causes for your app’s downtime ranging from the app’s code to the misconfiguration of its dependencies. Fast troubleshooting is the key to minimizing the production impact, however the complex nature of today’s application makes narrowing down the cause often a lengthy and difficult process. We understand fixing a problem of an app is not as simple as just looking at the app and sometimes it requires thorough investigation of changes made to each dependent resource.

We are excited to announce Navigator, a new feature offering for Windows app in App Service Diagnostics, an intelligent and guided experience that helps you troubleshoot your App Service web app with little to no configuration. Navigator is a new diagnostic feature that provides a centralized view of a web app and its dependencies as well as the changes made to those dependencies. Navigator can automatically render the dependencies in the same subscription as a dependency map and display the changes made to each resource, leveraging Change Analysis service. With the new experience offered by App Service Diagnostics, you can easily identify the dependencies of your web app and explore the changes as part of your troubleshooting experience.

Paired with information from existing diagnostics information in App Service Diagnostics, Navigator can supplement your troubleshooting experience by providing a timeline of the change groups made by your web app and its dependencies. Correlating this information with other information offered in App Service Diagnostics can help you further understand the changes and narrow down on potential causes for unhealthy behavior.

## Finding Navigator

Navigator can be accessed through App Service Diagnostics' homepage tile called **Navigator** so you can use it concurrently with information from other tiles. For more information on how to navigate to App Service Diagnostics, please visit [Azure App Service diagnostics overview](https://docs.microsoft.com/en-us/azure/app-service/overview-diagnostics).

![Navigator homepage tile]({{site.baseurl}}/media/2019/08/navigator-homepage-tile.png)

## How to enable Change Analysis

Upon opening the tool, you will see a message to enable Change Analysis. You can access the Change Analysis Settings by clicking on the **Enable Now** button.

![Enable Now]({{site.baseurl}}/media/2019/08/enable-now-banner.png)

Turn on **Change Analysis** and click **Save** to get property changes and code changes for your main web app as well as property changes for your dependent resources. [Note: If you are using Change Analysis for the first time, enabling this setting will register Change Analysis Resource Provider on your subscription.] By enabling **Change Analysis**, your app’s Kudu will trigger a snapshot every 4 hours to capture the changes made between those time intervals.

![Change Analysis Settings]({{site.baseurl}}/media/2019/08/change-analysis-settings.png)

To disable Change Analysis on your web app, click on **Go to Change Analysis Settings** in the upper right corner of Navigator in the diagnostic report. [Note: Change Analysis Resource Provider is still registered on the subscription of your web app.] To unregister Change Analysis Resource Provider from your subscription, navigate to your subscription, click **Resource providers** in the left navigation, select **Microsoft.ChangeAnalysis**, and click **Unregister**.

## Navigating through the change group timeline

Once Change Analysis is enabled, you will see a dependency map of your web app and its dependencies in the same subscription. You can check the inner workings of your app using this view. Also, if you click on a resource supported by Change Analysis, you can view the recent changes made to the selected resources. See this document to view the list of dependencies supported by Change Analysis service.

![Navigator Dependency Map]({{site.baseurl}}/media/2019/08/navigator-dependency-map.png)

Once you click on each resource on the map, you will see the **change group timeline**. A change group is a group of changes captured at the same time stamp and is represented by a square box on the timeline. You can click on each change group to view individual changes in the **change chart** below. You can also use the search bar to filter for changes that have your search term.

![Change group timeline and chart]({{site.baseurl}}/media/2019/08/change-analysis-view.png)

You can also expand each row of change to view the difference between the old values and the new values.

![Diff view]({{site.baseurl}}/media/2019/08/firewall-rule-diff-view.png)

Above the timeline group is the **last scanned time stamp** that shows the last time the timeline was updated. If you wish to find out about changes made after the last scanned time, click **Scan changes now**. (This process may take few minutes)

![Last scanned stamp and Scan changes now]({{site.baseurl}}/media/2019/08/last-scanned-timestamp.png)

After scanning is complete, you can update the timeline by clicking on **View changes now.**

![View changes now]({{site.baseurl}}/media/2019/08/view-changes-now.png)

## Navigator in Practice

Now, let’s explore a scenario where Navigator can come in handy. Suppose you have noticed a spike in the database connection errors in your app caused by a firewall rule, but you do not know what has caused the issue. First, click on **Navigator** in App Service Diagnostics. Take a look at the dependency map. Browse through the change group timeline to see if there were any changes made before the app started crashing. If you do not find any changes on the timeline that could be related to the issue, click **Scan changes now** to update the timeline with the most recent changes. After the scanning completes, click **View changes now** to populate the timeline with the new change groups. You notice there is one change group that occurred right before the app started giving you database connection errors. You can click on the change group to look at the change details. Expand the changes to view the differences. You may find that you accidentally changed the firewall rules.  

Used in tandem with other information, Navigator can serve as a powerful tool for diagnosing and solving problems with your web app.

Feel free to share your feedback or questions about Navigator by emailing [diagnostics@microsoft.com](mailto:diagnostics@microsoft.com)
