---
title: Speed up your Joomla Web App on Azure Web Apps
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  5/9/2016 2:06:05 PM  Every website for a company or personal wants to engage their customers , but if your website takes too long to load then you lose your users. For different types of applications, there are different options to prevent this from happening . In the blog post below we are going to discuss how we can improve Joomla web app fast and respond to users quickly by just making some or all the tweaks mentioned below. Enable Joomla Caching
---------------------

 Caching is not enabled by default when you set up Joomla web app. Joomla does the following when displaying a page:  - get the content from its database
 - loads all the plugins, components and/or modules
 - loads your template file
 - finally brings this all together in a single page rendered in visitor's browser
  This workflow of tasks can take time. Joomla has built-in caching mechanism that can help to load the page faster. Joomla supports two types of caching well explained [here](http://stackoverflow.com/questions/12739297/what-is-difference-between-conservative-caching-and-progressive-caching-in-jooml) **Conservative caching** is the standard type of caching. The caching process work as described below: *When a page is requested by a user, Joomla checks if there is a version of that page requested that is in its cache directory. If the page exists and hasn't expired , Joomla will serve it to the visitor. Otherwise, a cached version of the page is created, and that cached version will be served to the visitor, and to every other consequent visitor, as long as the page is not expired.* **Progressive caching** process is different from conservation caching .The caching process works as described below: *When a page is requested by a user , Joomla checks if a cached version of that page exists for that visitor . If its exists and hasn't expired then it’ll be served to the visitor, otherwise, Joomla will create the cached page for that specific visitor and then will serve it to the user. If another visitor who had visited that same page previously and visits that page the second time, then Joomla will not serve the cached page of the previous visitor, instead, it will create a cached version of that page specifically for that user, and then serves it to him.* To enable the Joomla caching, go to **System -> Global Configuration**.Next, you need to click on the **System** tab and find the **Cache Settings**. Select **ON - Conservative caching** option with cache handle being **Windows Cache** ( Wincache) and Click on **Save** [![cache-on](https://sunithamk.files.wordpress.com/2016/05/cache-on.png?w=300)](https://sunithamk.files.wordpress.com/2016/05/cache-on.png) Go to **Extensions -> Plugin Manager** and Enable the **System - Page Cache** core plugin. Note if this plugin is not enabled, caching will not work even though Global configuration settings is set to use Conservative caching [![system-cache](https://sunithamk.files.wordpress.com/2016/05/system-cache.png)](https://sunithamk.files.wordpress.com/2016/05/system-cache.png) You can use additional caching extensions to improve the caching capability of Joomla such as [JotCache](http://extensions.joomla.org/extensions/core-enhancements/performance/cache/13155) and [Cache Cleaner](http://www.nonumber.nl/extensions/cachecleaner). Use Joomla Memcache caching
---------------------------

 You can opt for using Joomla Memcache caching mechanism instead of built-in caching feature. Azure web app supports Memcache protocol with Azure Redis cache. To lean more , read this [article](https://azure.microsoft.com/en-us/documentation/articles/web-sites-connect-to-redis-using-memcache-protocol/). Enable Joomla Compression
-------------------------

 Gzip Compression is enabled by default on web app at the server level. But for the application to use the GZip compression , you need to enable it within Joomla configuration. Login to the Joomla web app admin dashboard and go to **System -> Global Configuration**. Click on the **Server** tab and enable GZip page compression. Click on Save to save your changes. [![gzip-enable](https://sunithamk.files.wordpress.com/2016/05/gzip-enable.png)](https://sunithamk.files.wordpress.com/2016/05/gzip-enable.png) Use IIS output caching
----------------------

 The IIS Output Caching feature targets semi-dynamic content. It allows you to cache static responses for dynamic requests and to gain tremendous scalability. Update your *web.config* and add the following section to cache your content. <?xml version="1.0" encoding="UTF-8"?> <configuration> <system.webServer> <caching> <profiles> <add extension=".php" policy="CacheUntilChange" /> </profiles> </caching> </system.webServer> </configuration> To learn more , check out this [article](https://blogs.msdn.microsoft.com/brian_swan/2011/06/08/performance-tuning-php-apps-on-windowsiis-with-output-caching/). Remove extensions not in use
----------------------------

 Since Joomla would need to identify which extensions to use it has to scan through all the extensions. This can cause your page to take longer to load. If you have any extensions not in use , please remove them from your production app.Note You can have those extensions in your development or testing environment sites to identify the best extension that fits your needs. Minify CSS and JS
-----------------

 Use extensions like [JCH Optimize](http://extensions.joomla.org/extensions/core-enhancements/performance/site-performance/12088) which minifies , compresses Javascript to improve page response time. Use CDN
-------

 Enable Azure CDN with your Azure web app to improve performance. For details , check out this [video](https://channel9.msdn.com/Shows/Azure-Friday/Azure-Websites-CDN-Content-Distribution-Network-Support-with-Yochay-Kiriaty). Stay up-to-date
---------------

 Joomla and its extensions may have updates that can impact the performance of your web application. Make sure you have the latest bits of Joomla CMS , Latest PHP version and the Joomla extensions you have installed within your Joomla app. Optimize your tables
--------------------

 Optimize your Joomla app database using phpMyAdmin . If you have never used PHPMyadmin with Azure web apps , check out this [article ](https://sunithamk.wordpress.com/2016/01/04/how-to-use-phpmyadmin-for-your-azure-web-app/)first. Select all or some of the tables and Select **Optimize Table** operation to execute. [![optimize](https://sunithamk.files.wordpress.com/2016/05/optimize.png)](https://sunithamk.files.wordpress.com/2016/05/optimize.png) *This post also appears on [Sunitha Muthukrishna Blog.](https://sunithamk.wordpress.com/2016/05/09/how-to-speed-up-joomla-web-app-on-azure-app-services/ "Sunitha's Blog")*     