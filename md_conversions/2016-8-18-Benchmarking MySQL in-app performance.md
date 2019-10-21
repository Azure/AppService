---
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  8/18/2016 4:26:30 PM  Azure app service just launched a new feature, MySQL in-app to support MySQL natively. MySQL in-app is recommended for development and testing (DEV/TEST) scenarios to quickly spin up PHP+ MYSQL applications on Azure to start developing and understanding the Azure app service platform. You can easily migrate this database when ready for production to  - [ClearDB database](https://azure.microsoft.com/en-us/marketplace/partners/cleardb/databases/)
 - [ClearDB Clusters](https://azure.microsoft.com/en-us/marketplace/partners/cleardb-clusters/cluster/)
 - MySQL on virtual machine on [Linux](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-classic-mysql-on-opensuse/) or [Windows](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-windows-classic-mysql-2008r2/) OS
  We conducted a benchmarking experiment with MySQL in-app to understand its performance compared to other MySQL solutions offered on Azure. We conducted two tests as described below: We conducted a benchmarking experiment with MySQL in-app to understand its performance compared to other MySQL solutions offered on Azure. We conducted two tests as described below : ### Test Configuration

 We used simple testing methodology for both scenarios to understand the performance of the feature. The baseline configuration for both tests mentioned below are:   2. Two test clients (one is the same region as web app and one in a different region)
 4. added application insights to web app to gather telemetry data
 6. using MySQL in-app database
 8. constant user load on the web app
   ### Test Scenario with Vanilla WordPress :

 We deployed a vanilla word press web app on various pricing plans for Azure App service. No caching layer was used with the web app configuration. *Note: Keep in mind that Free and Shared hosting have quota limitations that impacted the result of the tests. * During this test , we set a limit on how many PHP FastCGI processes created on Free and Shared pricing plan. To learn more about limiting PHP FastCGI process , check out this [article](http://www.iis.net/learn/application-frameworks/running-php-applications-on-iis/best-practices-for-php-on-the-microsoft-web-platform#_Configure_PHP_Process).In Azure app service , this can be done by using enabling the app setting WEBSITE\_FASTCGI\_MAXINSTANCES . For this test the value was set to 3. Try out the [demo site](https://wordpress3295.azurewebsites.net)    **Web App SKu** **User Load** **Server Response Time** **CPU Time** **Requests** **HTTP Server Errors** **Average Memory Working Set**   Free 10 248.14 ms 127.69 440 0 524.12 MB   Free 25 245.56 ms 278.01 903 0 597.17 MB   Shared 10 269.19 ms 166.53 445 0 515.6 MB   Shared 20 217.23 ms 255.81 960 0 537.05 MB   Basic Small 15 369.8 ms 675.81 2.24 k 0 421.83 MB   Basic Small 30 531.97 ms 773.88 2.51 k 0 285.67 MB   Basic Medium 25 270.54 ms 1.01 k 3.74 k 0 607.58 MB   Basic Medium 50 453.78 ms 1.59 k 5.47 k 0 444.87 MB    ### Test scenario with customized WordPress application with popularly used plugins

 After modifying the above vanilla WordPress with a few plugins to WordPress app as listed below:  - MotoPress Editor lite
 - Jetpack
 - Yoast SEO
  This configuration is similar to a production web application and we did not include include any caching layer to understand the performance of MySQL server running locally on the azure app service instance. **Demo site:**    **Web App Sku** **User Load** **Server Response Time** **CPU Time** **Requests** **HTTP Server Errors** **Average Memory Working Set** **Memory Working Set**   Standard Small 30 1.87 s 751.76 1.29 k 0 490.03 MB 7.47 GB   Standard Small 50 2.23 s 762.9 1.23 k 0 489.14 MB 7.28 GB    You can make the application load even more faster , by using one or more of the options below :  - Using [Wincache object cache](http://www.iis.net/downloads/microsoft/wincache-extension) or using [Azure Redis cache](https://azure.microsoft.com/en-us/documentation/services/redis-cache/)
 - Caching static content using [browser caching](https://www.iis.net/configreference/system.webserver/caching)
 - Minify JS and CSS files as per your application framework documentation
 - Reducing HTTP requests per page
 - Compress images  as per your application framework documentation
 - Optimize your database and perform regular clean up of your content
  ### Conclusion

 MySQL in-app feature is recommended for development and testing purposes. Based on the data above you can see that this feature improves the performance of your PHP application since both the Web server and MySQL server are co-located on the same instance.     