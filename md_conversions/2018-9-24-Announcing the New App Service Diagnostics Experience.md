---
title: "Announcing the New App Service Diagnostics Experience"
author_name: Jennifer Lee 
layout: post
hide_excerpt: true
---
      [Jennifer Lee (MSFT)](https://social.msdn.microsoft.com/profile/Jennifer Lee (MSFT))  9/24/2018 2:00:51 AM  Today, we’re excited to announce our new user experience for **App Service Diagnostics**. App Service Diagnostics is our intelligent and interactive experience to help you diagnose and troubleshoot issues with your app. You can use Genie to guide you through the different ways to troubleshoot a variety of potential issues, since sometimes bad things happen to good apps. You can learn more about App Service Diagnostics in these [other blog posts](https://blogs.msdn.microsoft.com/appserviceteam/tag/app-service-diagnostics/). Since we’ve first started with helping you with availability and performance issues, the coverage of issues that App Service Diagnostics has grown. To accommodate for a variety of problem categories and to more closely integrate with other troubleshooting content, we have **revamped the user experience for App Service Diagnostics**. [![]({{ site.baseurl }}/media/2018/09/2018-09-23_22h06_44-1024x553.png)]({{ site.baseurl }}/media/2018/09/2018-09-23_22h06_44.png) How to Get Started
------------------

 As always, without any additional configuration, you can access App Service Diagonstics by:  2. Go to the Azure Portal.
 4. Select your app (Windows, Linux, or Functions) or App Service Environment.
 6. Click on “Diagnose and solve problems."
  You can still access the old experience by selecting the blue bar at the top. Problem Categories
------------------

 In the new App Service Diagnostics homepage, the guided diagnostics experience is now separated into different problem categories to help you be more focused on the specific issue that you’re facing. Each problem category will have a **description and keywords** to help describe what types of problems would fall underneath that category. [![]({{ site.baseurl }}/media/2018/09/2018-09-23_22h17_02-1024x582.png)]({{ site.baseurl }}/media/2018/09/2018-09-23_22h17_02.png) If you’re new to diagnosing issues with your app or new to App Service, it’s a good idea to click around these tiles to investigate your issue. The health checkup from our old experience will be under **Availability and Performance**. [![]({{ site.baseurl }}/media/2018/09/2018-09-23_22h07_31-1024x644.png)]({{ site.baseurl }}/media/2018/09/2018-09-23_22h07_31.png) Genie and Tiles for Each Problem Category
-----------------------------------------

 Once you have selected a problem category, you are introduced to Genie, who will guide you through the troubleshooting experience for that category. In this new iteration, **Genie is specific to the problem category** that you’ve selected. [![]({{ site.baseurl }}/media/2018/09/2018-09-23_22h18_58-1024x239.png)]({{ site.baseurl }}/media/2018/09/2018-09-23_22h18_58.png) **The blue buttons that show up are tiles**; you should select those that best match your issue. These tiles run analyses on our end and output insights that show up within Genie. You should **click on these insights to get more data**, the full report, and actual suggestions on what to do next. [![]({{ site.baseurl }}/media/2018/09/2018-09-23_22h08_31-1024x413.png)]({{ site.baseurl }}/media/2018/09/2018-09-23_22h08_31.png) Insights are arranged in terms of severity:  - Red: critical
 - Orange: warning
 - Green: success
 - Blue: informational
  Once you click on the insight, there may be more insights and next steps to follow. Make sure you select each insight to expand to show more details. Also, there is a **new time picker** on the top right to help to navigate between different time periods of interest. [![]({{ site.baseurl }}/media/2018/09/2018-09-23_22h10_13-1024x465.png)]({{ site.baseurl }}/media/2018/09/2018-09-23_22h10_13.png) At any time, select **Show Tile Menu** to show all the tiles for that problem category. Search Documentation
--------------------

 Also new to Genie’s flow is our **Search Documentation. **If the tiles weren’t of help, you can enter in your issue in the inline search bar that appears after you select **Search Documentation. **This will do a web search of the issue you’ve written about to find relevant content that might help you with your “how do I…?” questions. It brings up the most relevant results if you include “App Service” or “web app” in your search terms. [![]({{ site.baseurl }}/media/2018/09/2018-09-23_22h08_56-1024x469.png)]({{ site.baseurl }}/media/2018/09/2018-09-23_22h08_56.png) Search App Service Diagnostics
------------------------------

 Now, in the new App Service Diagnostics home page, we have a search bar in the top left-hand corner. This search bar allows you to **search within App Service Diagnostics** to find the relevant tiles or tools that fit the search term. Therefore, the search bar is great when you are more experienced with App Service Diagnostics and know specifically what problem category, tile, or diagnostic tool you’re looking for. You can just type in the search term and quickly get to the tile that you’re interested in, which is great when showing your troubleshooting methods to other members on your team. [![]({{ site.baseurl }}/media/2018/09/2018-09-23_22h07_11-1024x532.png)]({{ site.baseurl }}/media/2018/09/2018-09-23_22h07_11.png) Diagnostic Tools
----------------

 The Diagnostic Tools problem category is where our advanced tools are now. These include all the **Support Tools that were on the right-hand side of the page** as well our new Auto Healing feature. This is a great option for our advanced users who want to collect a profiler trace, memory dump, network trace, and more. [![]({{ site.baseurl }}/media/2018/09/2018-09-23_22h09_55-1024x538.png)]({{ site.baseurl }}/media/2018/09/2018-09-23_22h09_55.png) Best Practices
--------------

 The Best Practices problem category is where our suggestions for running production apps in the cloud are. These suggestions are app-specific recommendations for optimizing your app configurations for production. [![]({{ site.baseurl }}/media/2018/09/2018-09-23_22h10_37-1024x499.png)]({{ site.baseurl }}/media/2018/09/2018-09-23_22h10_37.png) As before, App Service Diagnostics is a great first step in guiding you through the troubleshooting experience on App Service, App Service Environment, or Azure Functions. Please try out the new experience and let us know about your feedback!      