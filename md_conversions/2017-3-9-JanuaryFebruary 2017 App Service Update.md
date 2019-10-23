---
title: "JanuaryFebruary 2017 App Service Update"
author_name: Byron Tardif
layout: post
hide_excerpt: true
---
      [Byron Tardif](https://social.msdn.microsoft.com/profile/Byron Tardif)  3/9/2017 4:00:58 PM  Diagnose and solve problems
===========================

 App Service has a new experience for **Diagnose and solve problems.** With this new UI we make it easier to distinguish between application issues (your code) and platform issues (App Service). We also provide quick solutions (Fix it!) tailored to the problems you might be experiencing. The UI provides a view of the health of your application, health of the platform as well as traffic over the last 24 hours. If any availability issues are detected in that time window, they are listed below the graphs. You can drill down into more detail from there. If the issue is currently ongoing we try to provide a custom solution specific to the issue we detected. This should point you in the right direction to fix your problem and help get your application back into a healthy state. You can reach the new experience by clicking on the **Diagnose and solve problems** item in the general section of any Web, Mobile or API app. 
> [![image]({{ site.baseurl }}/media/2017/03/image_thumb160.png "image")]({{ site.baseurl }}/media/2017/03/image167.png) GA for MySQL in App
===================

 The MySQL in-app feature enables running MySQL natively on the Azure App Service platform. While this feature is ideal for small applications running on a single instance, or for development scenarios, you will need a full fledged MySQL resource that you can manage and scale independently for any production scenario. To ease the migration from your MySQL in App to an external MySQL database we have added Export functionality in the portal to make this a turnkey experience. You can read more about MySQL in App in the [MySql-in-app general availability announcement](https://blogs.msdn.microsoft.com/appserviceteam/2017/03/06/announcing-general-availability-for-mysql-in-app/), and learn how to [Migrate development database on MySQL in-app to production MySQL database](https://blogs.msdn.microsoft.com/appserviceteam/2017/03/06/migrate-development-database-on-mysql-in-app-to-production-mysql-database/) using the export experience. 
> [![image]({{ site.baseurl }}/media/2017/03/image_thumb161.png "image")]({{ site.baseurl }}/media/2017/03/image168.png) Improved integration with PowerApps and PowerFlows
==================================================

 Under the **API definition** feature for any Web, API or Mobile app you will find the new **Export to PowerApps + Micosoft Flow **button: 
> [![image]({{ site.baseurl }}/media/2017/03/image_thumb162.png "image")]({{ site.baseurl }}/media/2017/03/image169.png) Clicking on it will provide the necessary instructions based on your API metadata to allow your PowerApps + Microsoft Flow apps to consume it: 
> [![clip_image002]({{ site.baseurl }}/media/2017/03/clip_image002_thumb7.png "clip_image002")]({{ site.baseurl }}/media/2017/03/clip_image0029.png) Export App Service certificates to use with other Azure Resources
=================================================================

 Certificates purchased through App Service certificates can now be exported to use with other Azure Resources: 
> [![clip_image002[6]]({{ site.baseurl }}/media/2017/03/clip_image0026_thumb.png "clip_image002[6]")]({{ site.baseurl }}/media/2017/03/clip_image00261.png) App Service on Linux
====================

 We released a few new built-in containers including support for Node 6.9.3 as well as Ruby 2.3: 
> [![clip_image002[8]]({{ site.baseurl }}/media/2017/03/clip_image0028_thumb.png "clip_image002[8]")]({{ site.baseurl }}/media/2017/03/clip_image00281.png) **Bitbucket **has also been added as a supported Deployment source under **Deployment options:** 
> [![clip_image004]({{ site.baseurl }}/media/2017/03/clip_image004_thumb1.png "clip_image004")]({{ site.baseurl }}/media/2017/03/clip_image0043.png) App service Companion
=====================

 We have a new [App Service Companion for iOS update](https://blogs.msdn.microsoft.com/appserviceteam/2017/02/22/app_service_companion_for_ios_update/) that includes new functionality such as support for **Push Notifications** and ability to **Favorite** apps for quick access. If you have any questions about any of this features or App Service in general be sure to check our forums in [MSDN](https://social.msdn.microsoft.com/Forums/en-US/home?forum=windowsazurewebsitespreview) and [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-web-sites). For any feature requests or ideas check out our [User Voice](https://feedback.azure.com/forums/169385-web-apps-formerly-websites)     