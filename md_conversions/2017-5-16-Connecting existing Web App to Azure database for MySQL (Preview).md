---
title: "Connecting existing Web App to Azure database for MySQL (Preview)"
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  5/16/2017 9:11:12 AM  The following steps show how to connect your existing web app on Azure App Service running on MySQL in-app or other MySQL solutions in Azure to [Azure database for MySQL (Preview)](https://azure.microsoft.com/en-us/services/mysql/). Before your begin
-----------------

 Log in to the [Azure portal](https://porta.azure.com) . Create a MySQL database on Azure database for MySQL (Preview) service . For details , refer to [How to create MySQL database from Portal](https://docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal) or [How to create MySQL database using CLI.](https://docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-cli) Firewall configuration
----------------------

 Azure database for MySQL provides tighter security using Firewall to protect your data. When using this service with App Service Web Apps , you need to keep in mind that the outbound IPs are dynamic in nature .  2. To make sure the availability of your web app is not compromised , we recommend to all the rule to allow ALL IPs as shown in the image below. **Note: ***We are working with Azure database for MySQL (Preview) team for a long term solution to avoid allowing all IPs. *![allowallrule]({{ site.baseurl }}/media/2017/05/allowallrule-1024x378.png)
 4. You can explicitly add all the outbound IPs for your web app to MySQL server configuration . To learn more , see [how to get outbound IPs for App Service](https://blogs.msdn.microsoft.com/waws/2017/02/01/how-do-i-determine-the-outbound-ip-addresses-of-my-azure-app-service/).[![outboundip]({{ site.baseurl }}/media/2017/05/outboundip.png)]({{ site.baseurl }}/media/2017/05/outboundip.png)
  App service infrastructure tries to keep the outbound IPs the same as best as we can , but when recycle or scale operation occurs it may change since we add new machines on every region frequently to increase our capacity to server customers. If this changes , the app will experience downtime since it can no longer connect to the database. Keep this mind when choosing one of the option mentioned above. SSL configuration
-----------------

 Azure database for MySQL (Preview) has SSL **Enabled** . If your application is not using SSL to connect to the database , then you need to **Disable** SSL on MySQL server. For details on how to configure SSL , See [using SSL with Azure database for MySQL (Preview)](https://blogs.msdn.microsoft.com/appserviceteam/2017/05/10/connect-azure-app-service-to-azure-database-for-mysql-and-postgresql-via-ssl/). ![ssldisable]({{ site.baseurl }}/media/2017/05/ssldisable-1024x252.png) Note that some applications frameworks may not support SSL , hence check your application framework documentation on whether to disable or enable SSL. Migrating from MySQL in-app database to Azure database for MySQL (Preview)
--------------------------------------------------------------------------

 You can migrate MySQL in-app database to Azure database for MySQL (Preview) using [Export feature](https://blogs.msdn.microsoft.com/appserviceteam/2017/03/06/migrate-development-database-on-mysql-in-app-to-production-mysql-database/). Note in order to use this feature to export the database , you need to :  - Disable SSL since the feature does not work with MySQL database connected via SSL.
 - Allow all IPs is configured on your MySQL server
  App Service Back up and Restore features
----------------------------------------

 Currently backup and restore feature does not work with SSL enabled for Azure database for MySQL (Preview). Disable SSL if you are planning to backup/restore the database using App service backup feature . Azure database for MySQL (Preview) also offers backup feature , for more details see [here](https://docs.microsoft.com/en-us/azure/mysql/howto-restore-server-portal).     