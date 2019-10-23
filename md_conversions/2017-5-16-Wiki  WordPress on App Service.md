---
title: "Wiki  WordPress on App Service"
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  5/16/2017 9:19:59 AM  The Azure Marketplace provides a wide range of popular web apps developed by open source software communities, for example WordPress. The following table of content below will get started on running WordPress on App Service from creating , managing , configuring , performance and troubleshooting WordPress app. WordPress and Azure App Service
-------------------------------

  - [What is WordPress?](https://wordpress.org/)
 - [Create WordPress on App Service](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-web-create-web-app-from-marketplace)
  Managed MySQL solutions for WordPress
-------------------------------------

  - [How to purchase Azure Database for MySQL service](https://docs.microsoft.com/en-us/azure/mysql/)
 - [MySQL in-app (local mysql) for App Service](https://blogs.msdn.microsoft.com/appserviceteam/2016/08/18/announcing-mysql-in-app-preview-for-web-apps/)
 - [Connecting Existing web app to Azure database for MySQL ](https://blogs.msdn.microsoft.com/appserviceteam/2017/05/16/connecting-existing-web-app-to-azure-database-for-mysql-preview/)
 - [Connect to Azure database for MySQL using SSL ](https://blogs.msdn.microsoft.com/appserviceteam/2017/05/10/connect-azure-app-service-to-azure-database-for-mysql-and-postgresql-via-ssl/)
  MySQL on Virtual machines (IaaS)
--------------------------------

  - [Deploy a WordPress web app backed with MySQL replication cluster](https://docs.microsoft.com/en-us/documentation/templates/wordpress-mysql-replication/)
 - [Build your own Master-Master MySQL Cluster using Percona Cluster](https://docs.microsoft.com/en-us/documentation/templates/mysql-ha-pxc/)and [learn more on how to manage the cluster](https://github.com/fanjeffrey/axiom.articles/tree/master/pxc)
 - [Deploy WordPress backed by MySQL replication cluster with master-slave configuration](https://docs.microsoft.com/en-us/documentation/templates/mysql-replication/)
  Migrating and Configuring WordPress Application
-----------------------------------------------

  - [Migrating WordPress](https://codex.wordpress.org/Moving_WordPress)
 - [Deploy your files to Azure web apps](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-deploy)
 - [Export](https://docs.microsoft.com/en-us/azure/mysql/concepts-migrate-dump-restore) and [Import](https://docs.microsoft.com/en-us/azure/mysql/concepts-migrate-import-export) MySQL Database to Azure database for MySQL (Preview)
 - Use [MySQL Workbench ](https://dev.mysql.com/downloads/workbench/)to export and importdatabase
 - [Export and Import to MySQL in-app database](https://blogs.msdn.microsoft.com/appserviceteam/2016/08/18/exporting-your-database-to-local-mysql/)
 - [Custom domain for WordPress multisite](https://blogs.msdn.microsoft.com/azureossds/tag/multisite/)
 - [Use Azure CDN with WordPress](https://blogs.msdn.microsoft.com/azureossds/2015/04/27/improving-wordpress-performance-use-azure-cdn/)
  Troubleshooting WordPress Application
-------------------------------------

  - [How to troubleshoot your WordPress app](https://sunithamk.wordpress.com/2014/09/04/wordpress-troubleshooting-techniques-on-azure-websites/)
 - [Gather usage telemetry using Azure Application Insights service](https://azure.microsoft.com/blog/usage-analytics-for-wordpress-with-azure-app-insights/)
 - [Run Zend Zray profiler against your web app to diagnose issues and performance](https://sunithamk.wordpress.com/2015/08/04/profiling-php-application-on-azure-web-apps/)
 - [Use Kudu Support portal to diagnose and mitigate issues in real time](https://sunithamk.wordpress.com/2015/11/04/diagnose-and-mitigate-issues-with-azure-web-apps-support-portal/)
 - [How to backup your web app](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-backup)and [How to restore your web app](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-restore)
 - [Secure WordPress ](https://blogs.msdn.microsoft.com/azureossds/2016/12/26/best-practices-for-wordpress-security-on-azure/)
 - [Enable WordPress logs](https://blogs.msdn.microsoft.com/azureossds/2015/10/09/logging-php-errors-in-wordpress-2/)
 - [WordPress tools for App service : WordPress Buddy+](https://blogs.msdn.microsoft.com/azureossds/2016/12/21/wordpress-tools-and-mysql-migration-with-wordpress-buddy/)
  Performance
-----------

  - [How to speed up WordPress web app](https://sunithamk.wordpress.com/2014/08/01/10-ways-to-speed-up-your-wordpress-site-on-azure-websites/)
 - [How to enabled redis cache](https://docs.microsoft.com/en-us/azure/redis-cache/cache-dotnet-how-to-use-azure-redis-cache)using [redis cache plugin](https://wordpress.org/plugins/wp-redis/)
 - [How to enable memcached object cache for WordPress](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-connect-to-redis-using-memcache-protocol)using [memcached plugin](https://wordpress.org/plugins/memcached/)
 - [Enable wincache with W3 total cache plugin](https://wordpress.org/plugins/w3-total-cache/)
 - [How to use supercache plugin to speed up WordPress app](http://ruslany.net/2008/12/speed-up-wordpress-on-iis-70/)
 - [How to server caching using IIS output caching](http://blogs.msdn.com/b/brian_swan/archive/2011/06/08/performance-tuning-php-apps-on-windows-iis-with-output-caching.aspx)
 - [How to enabled browser caching for static content](http://www.iis.net/configreference/system.webserver/staticcontent)
 - [WordPress Cron slowing down the app](https://blogs.msdn.microsoft.com/azureossds/2015/06/11/wordpress-scheduled-jobs-wp-cron-php-and-slowness/)
      