---
title: "WordPress on Linux Updated"
author_name: Yi Liao MSFT
layout: post
hide_excerpt: true
---
      [Yi Liao MSFT](https://social.msdn.microsoft.com/profile/Yi Liao MSFT)  11/30/2018 2:30:16 PM  #### Updated image for WordPress on Linux

 We have recently updated the WordPress on Linux offering on Azure Marketplace. In this version we have replaced Apache/mod\_php with Nginx/PHP-FPM, we've seen the improved performance in our internal testing. Customers can use the [WordPress on Linux image](https://aka.ms/linux-wordpress) from the Azure Marketplace to create a new WordPress site and get the latest image automatically. #### Upgrade WordPress on Linux

 If you have an existing WordPress site running on the previous version of the Marketplace template, you may upgrade to the new image following the steps below. Before you begin, we recommend you backup the database and WordPress site (details in Migrate section). Upgrade steps:  2. In the Azure Portal, find your Web App and go to "Container Settings"
 4. Update the "image:tag" setting to 'appsvcorg/wordpress-alpine-php:0.61'
 6. Click Save and wait for the Web App to restart
  #### Migrate your site to WordPress on Linux

 For customers who plan to migrate their WordPress site to Azure App Service, while the Marketplace image comes with a fresh install of WordPress, customers can replace the code on the Web App and bring their own WordPress codebase (for example during migrations from on-premises or other hosting platforms).  2. Connect to the Web App using FTPS and replace the contents of the '/home/site/wwwroot' directory. Alternatively, you can create a zip file for your codebase and deploy it to the Web App using App Service [zipdeploy](https://docs.microsoft.com/en-us/azure/app-service/app-service-deploy-zip).
 4. Verify that 'wp-config.php' contains the correct database connection string, using the [wp-config.php](https://github.com/Azure/app-service-quickstart-docker-images/blob/master/wordpress-alpine-php/0.61/wp-config.php) file from Azure Marketplace for reference.
 6. For WordPress database, you can use tools such as [mysqldump](https://linuxize.com/post/how-to-back-up-and-restore-mysql-databases-with-mysqldump/) or [MySQL Workbench](https://www.mysql.com/products/workbench/) to backup the MySQL database from the original server and restore it to Azure Database for MySQL.
  #### Customization

 For cases in which additional customization is needed for plugins or themes, we recommend customers to modify the Docker image used in the Marketplace ([source on GitHub](https://github.com/Azure/app-service-quickstart-docker-images/tree/master/wordpress-alpine-php/0.61)), and run it on Web App for Containers. Once completed, migrate the site so that you don’t have to start from scratch.     