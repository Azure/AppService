---
title: "Notification Hubs Java SDK Improvements - Direct Send, Cancel Scheduled Pushes, Get Telemetry"
author_name: Mimi Xu 
layout: post
hide_excerpt: true
---
      [Mimi Xu (Azure)](https://social.msdn.microsoft.com/profile/Mimi Xu (Azure))  1/18/2017 10:11:01 AM  We are excited to share some of the recent updates the Notification Hubs team has made to its [Java Server SDK](https://github.com/Azure/azure-notificationhubs-java-backend).  2. We have added a *cancelScheduledNotification* API that lets you delete scheduled notifications provided the scheduled notification ID.
 4. We have added *sendDirectNotification* that can directly push any type of notifications (APNS, GCM, WNS, etc) to a list of device tokens without any device registrations needed with Notification Hubs service.
 6. Lastly, *getNotificationTelemetry* is enabled for customers to easily see [telemetry details](https://msdn.microsoft.com/en-us/library/azure/mt608135.aspx) around each send request.
  You will need the following dependencies with the correct versions:  - [Apache HttpClient Mime 4.5.2](https://mvnrepository.com/artifact/org.apache.httpcomponents/httpmime/4.5.2)
 - [Apache HttpCore 4.4.5](https://mvnrepository.com/artifact/org.apache.httpcomponents/httpcore/4.4.5)
  Give them a try and let us know what you think!      