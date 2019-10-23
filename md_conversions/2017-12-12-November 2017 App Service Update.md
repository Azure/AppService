---
title: November 2017 App Service Update
author_name: Byron Tardif
layout: post
hide_excerpt: true
---
      [Byron Tardif](https://social.msdn.microsoft.com/profile/Byron Tardif)  12/12/2017 12:20:36 PM   New create function experience
------------------------------

 We have a brand new function creation experience that includes among other improvements the ability to search templates by keywords as well as filtering templates by language and scenario. [![clip_image001]({{ site.baseurl }}/media/2017/12/clip_image001_thumb1.png "clip_image001")]({{ site.baseurl }}/media/2017/12/clip_image0012.png) Functions on Linux App Service Plans
------------------------------------

 You can now select **Linux** App Service plans to host your Function apps. You can read more about this scenario here: [The Azure Functions on Linux Preview](https://blogs.msdn.microsoft.com/appserviceteam/2017/11/15/functions-on-linux-preview/) [![clip_image002]({{ site.baseurl }}/media/2017/12/clip_image002_thumb4.png "clip_image002")]({{ site.baseurl }}/media/2017/12/clip_image0025.png) #### 

 Support for HTTPS Only
----------------------

 This was one of the most requested features in our [Uservoice](https://feedback.azure.com/forums/169385-web-apps) forum and it is now available in production. This feature can be found under **Custom Domain** in the left menu and works for apps hosted on **Windows** as well as **Linux** App Service Plans. When this feature is enabled all traffic reaching an **HTTP **hostname in your app will be redirected to it’s **HTTPS** equivalent. Make sure all custom hostnames have a valid SSL binding to avoid browser validation errors. This feature also includes the ability to **add bindings** to existing hostnames directly from this blade. [![clip_image003]({{ site.baseurl }}/media/2017/12/clip_image003_thumb2.png "clip_image003")]({{ site.baseurl }}/media/2017/12/clip_image0032.png) #### 

 Quick Start refresh
-------------------

 We have updated the **App Service Quickstart** for **Windows** and **Linux** based apps, scenario cards now link to existing scenario documentation on <https://docs.microsoft.com/azure/app-service/> where they are frequently updated and provide a lot more content and more advanced scenarios. [![clip_image004]({{ site.baseurl }}/media/2017/12/clip_image004_thumb3.png "clip_image004")]({{ site.baseurl }}/media/2017/12/clip_image0045.png) If you have any questions about any of this features or App Service in general be sure to check our forums in [MSDN](https://social.msdn.microsoft.com/Forums/en-US/home?forum=windowsazurewebsitespreview) and [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-web-sites). For any feature requests or ideas check out our [User Voice](https://feedback.azure.com/forums/169385-web-apps-formerly-websites)     