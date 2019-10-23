---
title: "Exciting New Features in App Service Diagnostics"
author_name: Jennifer Lee 
layout: post
hide_excerpt: true
---
      [Jennifer Lee (MSFT)](https://social.msdn.microsoft.com/profile/Jennifer Lee (MSFT))  1/18/2018 10:10:47 AM  Have you checked out App Service diagnostics yet? In November 2017, we announced the general availability of App Service diagnostics, our new self-service diagnostic and troubleshooting experiencing to help you resolve issues with your web app. Since then, based on your feedback, we’ve enabled several exciting features in the past few months. TCP Connections
---------------

 [![]({{ site.baseurl }}/media/2018/01/2018-01-16_16h02_35-1024x383.png)]({{ site.baseurl }}/media/2018/01/2018-01-16_16h02_35.png) We added a new tile shortcut! The “TCP Connections” tile shortcut allows you to investigate:  - Outbound TCP Connections: Graphed over time per instance
 - Connection Rejections: Detects issues with port rejections
 - Open Socket Handles: Open socket count when outbound TCP connections crosses 95% of the machine-wide TCP connection limit.
  [![]({{ site.baseurl }}/media/2018/01/2018-01-16_16h03_07-1024x723.png)]({{ site.baseurl }}/media/2018/01/2018-01-16_16h03_07.png) App Service Diagnostics for Linux
---------------------------------

 For all our App Service on Linux users, you can now also use App Service diagnostics to run a health checkup and use the tile shortcuts to analyze issues in performance and availability, such as “Web App Down,” Web App Slow,” and “Container Initialization.” [![]({{ site.baseurl }}/media/2018/01/2018-01-16_16h04_27-1024x380.png)]({{ site.baseurl }}/media/2018/01/2018-01-16_16h04_27.png) Integration with Application Insights
-------------------------------------

 For .NET applications, we have added integration with Application Insights to help you look for relevant exceptions correlating to downtime occurring on your web app. These features are:  - Application Insights Enabled: Easily check if you have Application Insights enabled (and if you don’t, you can enable it right there).
 - Inside the “Web App Down” tile, if there are exceptions available, you will be able to see the exceptions thrown from Application Insights, sorted by count so you know which ones are most important.
  [![]({{ site.baseurl }}/media/2018/01/2018-01-16_16h03_31-1024x641.png)]({{ site.baseurl }}/media/2018/01/2018-01-16_16h03_31.png) Open App Service Diagnostics
----------------------------

 To access App Service diagnostics, navigate to your App Service web app in the Azure portal. In the left navigation, click on Diagnose and solve problems. [![]({{ site.baseurl }}/media/2018/01/2018-01-16_15h54_17-300x298.png)]({{ site.baseurl }}/media/2018/01/2018-01-16_15h54_17.png) To learn more, check out these links:  - **[Connect() Video](https://channel9.msdn.com/events/Connect/2017/T115?term=what%27s%20new%20with%20azure%20app%20service)**: Want to see a demo of App Service diagnostics? Check out this video to learn more about "What's New with App Service" (where I demo App Service diagnostics starting at 1:50).
 - [**Azure Friday Video**](https://channel9.msdn.com/Shows/Azure-Friday/Azure-App-Service-Diagnostic-and-Troubleshooting-Experience)[:](https://channel9.msdn.com/Shows/Azure-Friday/Azure-App-Service-Diagnostic-and-Troubleshooting-Experience) One of our App Service diagnostics engineers, Steve Ernst, joins Scott Hanselman to diagnose and troubleshoot a real case of a web app having issues.
 - **[Azure.com Blog Announcement](https://azure.microsoft.com/en-us/blog/announcing-the-general-availability-of-azure-app-service-diagnostics/)**
 - **[Documentation](https://aka.ms/diagnostics)**
       