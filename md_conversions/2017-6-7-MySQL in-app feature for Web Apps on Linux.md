---
title: MySQL in-app feature for Web Apps on Linux
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  6/7/2017 11:10:51 AM  MySQL in-app for Linux Web App is not the same as [MySQL in-app feature for Windows Azure Web App ](https://blogs.msdn.microsoft.com/appserviceteam/2016/08/18/announcing-mysql-in-app-preview-for-web-apps/). This applies to WordPress , Drupal , Joomla and Mediawiki Templates on Linux Web App . For Linux web apps , we leverage the docker container to build MySQL as part of the image used to deploy in the Azure portal, for example [WordPress on Linux](https://blogs.msdn.microsoft.com/appserviceteam/2017/03/21/create-wordpress-using-web-apps-on-linux/).

 These custom images are available on [github](https://github.com/Azure-App-Service/apps/tree/master/Wordpress). The image uses MariaDB 10.0+ server with the default port 3306 and is installed , configured when the docker image runs on the Linux web app.

 Get Database connection
-----------------------

 You can get the database information from the Azure portal. Select your web app , then select **Application Settings -> App settings. **This will list out the database information needed for your web application. [![]({{ site.baseurl }}/media/2017/06/appsettingslinux-1024x326.png)]({{ site.baseurl }}/media/2017/06/appsettingslinux.png) Manage your Local database
--------------------------

 You can access and manage the database using PHPmyadmin that is enabled and configured as part of deployment of the docker image. To view PHPmyadmin tool ,use the URL in this format [http://hostname/phpmyadmin](http://hostname[:port%5D/phpmyadmin) and enter the credentials to connect.

 You can find the credentials for PHPmyadmin in the Azure portal . Select your web app , then select **Application Settings -> App settings**[![]({{ site.baseurl }}/media/2017/06/phmyadmincredentials-1024x176.png)]({{ site.baseurl }}/media/2017/06/phmyadmincredentials.png)

     