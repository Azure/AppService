---
title: "Enable PHP error logging in App Service"
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  5/4/2017 11:03:36 AM  By default [PHP error logging](http://php.net/manual/en/errorfunc.configuration.php#ini.log-errors) is turned off. When your application experiences issues , it would be beneficial to turn the logging on to investigate to root cause of the issue and mitigate it. There are different ways to do this based on whether you are using App Service on Windows or Linux. Follow the steps below to turn on PHP error logging:  - App Service on Windows: Create .user.ini or modify an existing .user.ini file under your web app root directory *D:\home\site\wwwroot*.You can do this by updating your root directory via FTP , GIT , or Kudu with this change. In this file add the following line log\_errors = On 
 - App Service on Linux: Create a .htaccess file or modify an existing .htaccess file under web app root directory* /home/site/wwwroot. *You can do this by updating your root directory via FTP or GIT with this change. In this file add the following line log\_errors = On 
   #### Note

 Remember to turn OFF your PHP error logging when you have completed your investigation. By leaving the setting ON can have big impact on your web app performance.      