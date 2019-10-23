---
title: WordPress on Web app for Containers
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  4/16/2017 9:23:18 PM  [Web Apps on Linux ](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-linux-intro)allows running web apps natively on Linux. WordPress is popular blogging platform primarily used on Linux distributions. Today we have released [WordPress for App Service on Linux](https://portal.azure.com/?feature.customportal=false#create/WordPress.WordPressonlinux) in the Azure marketplace that helps you quickly create a WordPress application on Web apps (Linux) . This docker image enables you to run a WordPress site on Azure Web App on Linux using either :  2.  
	 2. [**Azure Database for MySQL** ](https://azure.microsoft.com/en-us/services/mysql): It is a Microsoft solution for MySQL service on Azure that provides a managed database service for app development and deployment that allows you to stand up a MySQL database in minutes and scale on the fly .
	 4. **[Local Database ](https://blogs.msdn.microsoft.com/appserviceteam/2017/03/21/create-wordpress-using-web-apps-on-linux#local-db) : **You can manually setup your web app to use Local database. This option is not provided from Azure portal for WordPress on Linux template.
	  
  Before you begin
----------------

 If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. Deploy from Marketplace
-----------------------

 Log in to the [Azure portal](https://portal.azure.com).Click [here](https://portal.azure.com/?feature.customportal=false#create/WordPress.WordPressonlinux) to create the WordPress application.[![wordpress-linux]({{ site.baseurl }}/media/2017/05/wordpress-linux-358x1024.png)]({{ site.baseurl }}/media/2017/05/wordpress-linux.png)    Name Description     App Name   Enter a unique app name for your **Web App Name**. This name is used as part of the default DNS name for your app *<app\_name>.azurewebsites.net*, so it needs to be unique across all apps in Azure. You can later map a custom domain name to your app before you expose it to your users     Subscription Select a **Subscription**. If you have multiple subscriptions, choose the appropriate subscription.   Resource group   Enter a **resource group**. A resource group is a logical container into which Azure resources like web apps, databases that is deployed and managed. You can create a resource group or use an existing one    App Service Plan   App Service plans represent the collection of physical resources used to host your apps. Select the **Location** and the **Pricing tier**. For more information on pricing, see [ App service pricing tier](https://azure.microsoft.com/pricing/details/app-service)     Database Provider Use **Azure Database for MySQL** for database solution    This will deploy a WordPress custom image on to Web Apps on Linux . Note there might be cold start for the first request to the site created. Using GIT repo for WordPress code
---------------------------------

 Version 0.3 pulls wordpress code from our [GIT repo](https://github.com/azureappserviceoss/wordpress-azure) when you create a when app using this Docker image . If you have custom code on Github as well , you can edit GIT\_REPO after the app is created and GIT\_BRANCH values in app settings.  2. Create a Web App for Containers
 4. Add new App Settings
     Name Default Value     GIT\_REPO <https://github.com/azureappserviceoss/wordpress-azure>   GIT\_BRANCH linux\_appservice     2. Browse your site
  ***Note:** GIT directory: /home/site/wwwroot. **When you deploy it first time, Sometimes need to check wp-config.php. RM it and re-config DB information is necessary. **Before restart web app, need to store your changes by "git push", it will be pulled again after restart.* How to configure to use Local Database with web app
---------------------------------------------------

  2. Create a Web App for Containers
 4. Update App Setting WEBSITES\_ENABLE\_APP\_SERVICE\_STORAGE = true (If you like to keep you DB after restart.)
 6. Add new App Settings
     Name Default Value     DATABASE\_TYPE local   DATABASE\_USERNAME wordpress   DATABASE\_PASSWORD some-string    *Note: We create a database "azurelocaldb" when using local mysql . Hence use this name when setting up the app*  2. Browse your site
 4. Complete WordPress install
  *Note: Do not use the app setting DATABASE\_TYPE=local if using Azure database for MySQL* How to update WordPress core , theme or plugins
-----------------------------------------------

 If WEBSITES\_ENABLE\_APP\_SERVICE\_STORAGE= false ( which is the default setting ) , we recommend you ***DO NOT update** the WordPress core version , themes or files from WordPress admin dashboard. *  There is a trade off between file server stability and file persistence . Choose either one option to updated your files :  **OPTION 1 : ** Since we are using local storage for better stability for the web app , you will not get file persistence. In this case , we recommend to follow these steps to update WordPress Core or a theme or a Plugins version :  2. Fork the repo [ https://github.com/azureappserviceoss/wordpress-azure](https://github.com/azureappserviceoss/wordpress-azure) 
 4. Clone your repo locally and make sure to use ONLY linux-appservice branch 
 6. Download the latest version of WordPress , plugin or theme being used locally 
 8. Commit the latest version bits into local folder of your cloned repo 
 10. Push your changes to the your forked repo 
 12. Login to Azure portal and select your web app 
 14. Click on **Application Settings -> App Settings **and change GIT\_REPO to use your repository from step #1. If you have changed the branch name , you can continue to use** linux-apservice** . If you wish to use a different branch , update GIT\_BRANCH setting as well. 
    **OPTION 2 :** You can update WEBSITES\_ENABLE\_APP\_SERVICE\_STORAGE =true to enable app service storage to have file persistence . Note when there are issues with storage due to networking or when app service platform is being updated , your app can be impacted .  How to turn on Xdebug
---------------------

  2. By default Xdebug is turned off as turning it on impacts performance.
 4. Connect by SSH.
 6. Go to /usr/local/php/etc/conf.d, Update xdebug.ini as wish, don't modify the path of below line.zend\_extension=/usr/local/php/lib/php/extensions/no-debug-non-zts-20170718/xdebug.so
 8. Save xdebug.ini, Restart apache by below cmd: apachectl restart
 10. Xdebug is turned on.
  Limitations
-----------

  - Some unexpected issues may happen after you scale out your site to multiple instances, if you deploy a WordPress site on Azure with this docker image and use the MariaDB built in this docker image as the database.
 - The phpMyAdmin built in this docker image is available only when you use the MariaDB built in this docker image as the database.
 - Please Include App Setting WEBSITES\_ENABLE\_APP\_SERVICE\_STORAGE = true when use built in MariaDB since we need files to be persisted.
  Change Log
----------

  - **Version 0.3** 
	 2. Use Git to deploy wordpress.
	 4. Update version of PHP/Apache/Mariadb/Phpmyadmin.
	 6. Add Xdebug extenstion of PHP.
	 8. Use supervisord to keep SSHD and Apache.
	 10. This is NOT compatible with tag 0.2 and tag 0.1 for Docker image [wordpress-alpine-php](https://hub.docker.com/r/appsvcorg/wordpress-alpine-php/)
	  
  Migrating an existing WordPress site
------------------------------------

 This image creates a new WordPress application every time it is deployed. If you are migrating your application to this site , please follow directions to [export](https://codex.wordpress.org/Tools_Export_Screen) and[ import ](https://codex.wordpress.org/Tools_Import_Screen)as mentioned on Wordpress Codex. If you have a complex WordPress application where the above mentioned export and import options are not effective, Web Apps on Linux supports git deployment and you use [FTP](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-deploy-content-sync) or [GIT](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-deploy-local-git) deployment to replace the file system on the site created with this template to bring your own content. You can use PHPmyadmin available with this solution to import your application database content. Troubleshooting
---------------

 The docker image has been updated from this [docker image ](https://github.com/Azure-App-Service/apps/tree/master/Wordpress/0.2) to using a new format where the docker image only contains the server components. The application code for WordPress is deployed via GIT from [github repo](https://github.com/azureappserviceoss/wordpress-azure) . #### Update your application to use the new image appsvc/apps:apache-php-mysql-0.1

  - If you have an existing application created using the WordPress image , check the Application setting to verfiy which image is being used with DOCKER\_CUSTOM\_IMAGE setting .
 - If the setting value is **apache-php-mysql-0.1 **, no changes needed .
 - If the value is **wordpress-0.2** or **wordpress-0.1** or** wordpress** and follow the steps below based on the database being used : 
	 - Azure Database for MySQL 
		 - Create a new web app with WordPress from the Azure marketplace.
		 - Select "Existing resource group" and choose the resource group in which your Azure Database for MySQL  database exists.
		 - Select the same app service plan in which the current site assigned to.
		 - If using Azure Database for MySQL , select your existing database that is being used by your web app. Test the new site to make sure it is working as expected before deleting the older app.
		  
	 - Local database 
		 - Backup your web app and database manually.
		 - Create a new web app with WordPress from the Azure marketplace and choose Azure database for MySQL
		 - Migrate your database to the new database and your files to newly created web app.
		 - **Note :** There is bug with Local database causing the application to break once the app is provisioned which will be fixed in early August 2017 . If you wish to use Local database , wait until Local database is support for WordPress template next month.
		  
	  
  **Using App Service Storage ** If you using a web app that was created from Azure marketplace for Web App on Linux using WordPress , Drupal , Mediawiki and Joomla , please add the following app setting WEBSITES\_ENABLE\_APP\_SERVICE\_STORAGE app setting to true to continue using App service Storage (platform SMB share i.e /home/ folder ) . Use the platform file storage in these two scenarios :  2. When you scale out using the autoscale feature in Web app for Linux. 
 4. If your application modifies the the files system and you need this new changes to the file system to be persistent . For example , with a WordPress app if you install a plugin , Wordpress adds a few files to the files system for the plugin and modifies the database. If you scale up or the instance your app is running on is recycled you will loose the plugin files which can break your production application. Hence in such cases it is recommended to set the app setting to true. 
  *NOTE: If the setting is not set to true the changes to the file system are not persisted. *     