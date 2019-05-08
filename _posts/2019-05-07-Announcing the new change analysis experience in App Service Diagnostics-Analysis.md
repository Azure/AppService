---
layout: post
title: "Announcing the new change analysis experience in App Service Diagnostics"
author: "Yun Jung Choi"
tags: app service, azure app service, diagnostics, support, web app, troubleshooting, self-help
---

In a fast-paced development environment, sometimes it may be difficult to keep track of all the changes made to your app and let alone pinpoint on a change that caused an unhealthy behavior. Change Analysis can help you narrow down on the changes made to your app to facilitate trouble-shooting experience.

## Finding Change Analysis

Change Analysis is embedded in App Service Diagnostics' tiles such as **Application Crashes** so you can use it concurrently with information from other tiles. For more information on how to navigate to App Service Diagnostics, please visit [Azure App Service diagnostics overview](https://docs.microsoft.com/en-us/azure/app-service/overview-diagnostics).

## How to enable Change Analysis

Upon opening a diagnostic report page, you will see a message to enable Change Analysis. You can access the Change Analysis Settings by clicking on the **Enable Now** button.

![Enable Now]({{site.baseurl}}/media/2019/05/enablenow10.png)

Enable Change Analysis for your main web app by toggling on the Change Analysis. This setting will enable you to get property changes. Once Change Analysis is enabled, turn on **Scan code for changes**, which will enable you to get code changes. By enabling **Scan code for changes**, your app’s Kudu will trigger a snapshot every 4 hours to capture the changes made between those time intervals. It’s best practice to enable **Always on** along with **Scan code for changes** to prevent waking up Kudu for snapshots and to minimize the impact on your application. To disable Change Analysis, you can access the **Change Analysis Settings** in the Change Analysis information in the diagnostic report page.

![Change Analysis Settings]({{site.baseurl}}/media/2019/05/changeanalysissettings11.png)

## Navigating through the change group timeline

Once Change Analysis is enabled, you will be able to see a **change group timeline** embedded in diagnostic reports. A change group is a group of changes captured at the same time stamp and is represented by a square box on the timeline. You can click on each change group to view individual changes in the **change chart** below. You can also use the search bar to filter for changes that have your search term.

![Change group timeline and chart]({{site.baseurl}}/media/2019/05/changegrouptimelineandchart12.png)

You can also expand each row of change to view the difference between the old values and the new values.

![Diff view]({{site.baseurl}}/media/2019/05/diffview13.png)

Above the timeline group is the **last scanned time stamp** that shows the last time the timeline was updated. If you wish to find out about changes made after the last scanned time, click **Scan changes now**. (This process may take few minutes)

![Last scanned stamp and Scan changes now]({{site.baseurl}}/media/2019/05/lastscannedstampandscanchangesnow14.png)

After scanning is complete, you can update the timeline by clicking on **View changes now.**

![View changes now]({{site.baseurl}}/media/2019/05/viewchangesnow15.png)

## Change Analysis in Practice

Now, let’s walk you through a scenario where Change Analysis can come in very handy. For example, suppose you have noticed some downtime in your app caused by a change in app setting but you don't know what has caused the issue. First, open a diagnostic report page with Change Analysis like **Application Crashes**. Browse through the change group timeline to see if there were any changes made before the app started crashing. If you don’t find any changes on the timeline that could be related to the issue, click **Scan changes now** to update the timeline with the most recent changes. After the scanning completes, click **View changes now** to populate the timeline with the new change groups. You notice there is one change group that occurred right before the app started crashing. You can click on the change group to look at the change details. Expand the changes to view the differences. You may find that you accidentally deleted the connection string when you last made your code changes.  

Used in tandem with other information, Change Analysis can serve as a powerful tool for diagnosing and solving the problems of your web app.

Feel free to post any questions about Change Analysis on the [MSDN Forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=windowsazurewebsitespreview).