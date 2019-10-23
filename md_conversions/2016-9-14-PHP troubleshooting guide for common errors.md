---
title: "PHP troubleshooting guide for common errors"
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  9/14/2016 12:37:03 PM  Here is a troubleshooting guide for PHP errors on Azure app service. ### 5xx Errors

  -  **Multiple loaded extension**: You might notice an error in php\_errors.log when a extension is not loading. It could be that there is another extension already pre-configured on the platform. Install PHP manager ( extension as shown in the image) from the portal to check which extension are available and/or enable before bringing in [your custom php extension](https://blogs.msdn.microsoft.com/silverlining/2012/09/17/using-custom-php-extensions-in-windows-azure-web-sites/). ![](http://sunithamk.files.wordpress.com/2016/09/091416_2030_azureappser1.png)
 - **MySQL gone away: **This error can occurs due to various reasons as listed below:   **• **A query was executed after closing the connection to the server. This is a logic error in your application. Review your code and make changes.

 • The connection may have timed-out. You can use mysqli\_options() to increase the timeout.

 • Long running query especially using INSERT or REPLACE commands can cause this issue.

 • Since ClearDB is different service, there could have been a networking blip connecting to ClearDB database. To work around this, you can add a retry logic to connect to your database.

 • If you are using ClearDB shared hosting, note that it is shared hosted service and if another user is using up all the resources you might get this error. To work around this, you can add a retry logic to connect to your database.

 • MySQL server may have crashed due to an incorrect query. Review your code to identify the query.

 
 - **Redis gone away**: This can happen due to network blips or if the server is down. As best practice include a retry logic to connect to your Redis server. For further troubleshooting, check this [article](https://azure.microsoft.com/en-us/documentation/articles/cache-how-to-troubleshoot/).
 -  **Database deadlock error:** Deadlocks occur when are there are multiple requests to write to the same table/ same record (based on the lock configuration on your database) at the same time. To avoid this, you need to include some logic in your app to manage deadlock scenario.
 - **Error connecting to database: ** Check if your database is accessible. You can use MySQL workbench or mysql command line ** **
 - **Deprecated warning:** It is recommended to notices and deprecated errors to reduce the stress on PHP process when writing to the logs especially if you app does generate too many notices and warning. These should b enabled on your staging or dev sites but on your production site it should be disabled. Read [this article](https://blogs.msdn.microsoft.com/azureossds/2015/04/15/info-about-php-fatal-error-and-error-log-on-azure-website/) on how to change the way error is logged in PHP.
  Checkout additional [articles on PHP troubleshooting](https://blogs.msdn.microsoft.com/azureossds/tag/php-troubleshooting/). ### Performance Issues

 Best way to identify your application performance issues, is to profile your application. Use [Xdebug profiler](https://sunithamk.wordpress.com/2016/09/14/enable-xdebug-to-profile-your-php-app-on-app-service/) to profile your application. The most common reasons that could impact performance are:  - PHP error reporting is turned on. If your application is returning too many warnings that is causing PHP process to write to php\_errors.log. This can impact performance.
 - Your app is making too many I/O operations. Note that the file storage is Azure Storage linked to your web app like a network drive. Too many calls to read or write can impact performance. You can reduce the read operations by using [Wincache filecache](http://php.net/manual/en/wincache.configuration.php) and [Wincache reroute](http://php.net/manual/en/wincache.configuration.php) settings.
 - App may be causing an overhead on the database by making too many calls to the database. Use [Wincache](http://php.net/manual/en/book.wincache.php) or [Redis cache](https://azure.microsoft.com/en-us/services/cache/) to reduce the stress on your database.
  ### Security Issues

  - **Using mysql extension:** MySQL extension has been [officially deprecated](http://php.net/manual/en/migration55.deprecated.php) . It does not support SSL and does not support for many MySQL features. Using this is a security risk and users can look for the php warning "The mysql extension is deprecated and will be removed in the future" and identify if a site is using mysql extension. Upgrade your mysql driver to use mysqli instead of mysql extension.
  <?php $mysqli = new mysqli("localhost", "user", "password", "database"); if ($mysqli->connect\_errno) { echo "Failed to connect to MySQL: (" . $mysqli->connect\_errno . ") " . $mysqli->connect\_error; } echo $mysqli->host\_info . "\n"; ?>  -  **Disable development configurations: **Disabling all your development environment configuration such as debug configuration. This opens your application to security risk allowing access to malicious users to information on your web app.
 -  **Using "admin" username for your web app administration dashboard : **All CMSs like WordPress, Drupal etc. provide you're with an administration dashboard. **admin** is the most common username used for a super administrator user and can be easily hacked by malicious users. Hence NEVER use **admin** as a username for your super administrator for your web application. It is recommended to enforce a strong username and password for a super administrator users.
       