---
title: Retirement of the PHP 5.5 runtime from App Service
author_name: Jennifer Lee (MSFT)
layout: post
hide_excerpt: true
---
      [Jennifer Lee (MSFT)](https://social.msdn.microsoft.com/profile/Jennifer Lee (MSFT))  10/11/2017 7:58:58 AM  Strongly Recommended to Upgrade to PHP 5.6, 7.0, or 7.1
-------------------------------------------------------

 Because the PHP Group stated that [PHP 5.5 is no longer supported](http://php.net/supported-versions.php), there won’t be any more updates to that version, including security fixes. To avoid the potential for security issues on App Service, **we plan to retire our support of PHP 5.5 in January 2018**. Currently, we support PHP 5.6, 7.0 and 7.1. This retirement will impact all customers who are running their Web App on the PHP 5.5 runtime (unless you are using a custom PHP runtime). **We strongly recommend that you upgrade to a supported version of PHP** because your Web App will be auto-moved to PHP 5.6. For more information on how to migrate from PHP 5.5 to another version of PHP, please review the documentation on the [Appendices](http://php.net/manual/en/appendices.php) webpage on PHP.net.   Although we’re removing the PHP 5.5 runtime from the platform, we’re aware that some applications are complex and may be tied to a specific PHP runtime version. In order to continue to support your PHP 5.5 applications, it’s possible to remain on PHP 5.5 runtime. For more information, please visit the "How to: Use a custom PHP runtime" section of the [Configure PHP in Azure App Service Web Apps](https://docs.microsoft.com/en-us/azure/app-service/web-sites-php-configure) documentation webpage.       