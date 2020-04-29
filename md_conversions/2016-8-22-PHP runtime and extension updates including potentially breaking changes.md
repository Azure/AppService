---
title: "PHP runtime and extension updates including potentially breaking changes"
author_name: Cory Fowler 
layout: post
hide_excerpt: true
---
      [Cory Fowler (MSFT)](https://social.msdn.microsoft.com/profile/Cory Fowler (MSFT))  8/22/2016 10:04:49 AM  In an upcoming release, we are making some changes to the available runtimes and PHP extensions on the Azure App Service workers. We suggest that you review your sites to ensure that these changes do not cause any downtime of your applications or tooling. PHP Runtime Updates
-------------------

 Due to some recent high priority security updates, we are adjusting the runtimes that are available on Azure App Service workers. For more details on the changes, please review the links to the specific version changelogs available in the After Update column of the table below. 
> **Note: **PHP 5.4 will soon be retired on Azure App Service as it is no longer receiving security updates. See [more details](https://azure.microsoft.com/en-us/blog/announcing-support-for-php-7-0-in-azure-app-service-and-notice-of-php-5-4-retirement/) about the retirement on the Azure Blog.    Runtime Version Currently Supported After Update     5.4 5.4.45 5.4.45   5.5 5.5.36 [5.5.38](http://php.net/ChangeLog-5.php#5.5.38)   5.6 5.6.22 [5.6.24](http://php.net/ChangeLog-5.php#5.6.24)   7.0 7.0.7 [7.0.9](http://php.net/ChangeLog-7.php#7.0.9)    PHP Extension Updates
---------------------

 ### SQL Server Driver for PHP 7

 Recently the SQL Server team released the [Microsoft drivers 4.0 for PHP](https://blogs.technet.microsoft.com/dataplatforminsider/2016/07/20/microsoft-drivers-4-0-for-php-for-sql-server-with-php-7-0-support-released/),which includes support for PHP 7. Now that this driver is no longer in preview, we are including the driver on the workers by default. If you have been loading your own version of this driver, you will need to remove the statements which are loading the driver as having a duplicate reference will cause errors. ### XDebug

 We are updating the version of XDebug which is available on the workers by default. Currently, we have version 2.2.4 available in d:\devtools\xdebug which is being replaced by version 2.4.0. If you are referencing XDebug for profiling or remote debugging purposes, the extension will no longer be available on the workers and the references will need to be updated to point to 2.4.0. The good news is that XDebug version 2.4.0 supports PHP 5.5, 5.6 & 7.0, which means all supported runtimes now have the ability to take advantage of XDebug for debugging and profiling purposes.     