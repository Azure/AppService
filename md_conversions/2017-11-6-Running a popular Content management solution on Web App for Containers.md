---
title: "Running a popular Content management solution on Web App for Containers"
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  11/6/2017 1:34:21 PM  There are multiple options to hosting your Content management solutions (CMS) like WordPress , Drupal , Magento etc. with Linux App Service . The blog post below will cover the key decisions and implementation guidelines when using [Web App for Containers](https://azure.microsoft.com/en-us/services/app-service/containers/) for a CMS solution like WordPress or Drupal.

 ### Built images :

 App Service team provides your bare bone docker images for PHP , and other frameworks. These images are very basic and help you quickly get started but as your apps grows , these images may be limited to your needs as you are limited from making any changes to these images .

 ### Custom images :

 Custom docker images provides you with more flexibility to grow as your apps grows. You have more control on the docker image itself and can modify it with new modules or extensions if and when your app needs these changes . This option make lift and shift of your application more easy since you can replicate you current dependencies as close as possible in the cloud. Checkout an example of using a [Python Application with a Custom image](https://docs.microsoft.com/en-us/azure/app-service/containers/tutorial-custom-docker-image).

 The **recommended approach is using custom images** with Web App for Containers when using a CMS solution. File Storage
------------

 App Service come with a shared file storage . You must use this storage if :

  - The application writes to the file system frequently and needs these files to be persisted.
 - You want to use auto-scaling features and you want all the instances to share the same file storage
  In order to use the App Service Storage , explicitly include an app setting

 WEBSITES\_ENABLE\_APP\_SERVICE\_STORAGE = true To better understand this , let me elaborate with an example : If you have a WordPress app , note that WordPress CMS installs minor version updates to make sure your app has any important fixes needed. This means new files being added or existing files being modified to your application. In such cases , the application needs the files to persist so that you have the latest patches/fixes for WordPress hence this scenario requires the use of App Service Storage .

 Most CMS solutions have a variation of this type of application updates . Have a better understating of your application to decide if you want to use App Service storage.

 ### Can I use local storage instead of App Service Storage for CMS solutions

 By using the local storage rather than App Service Storage you do get better stability and there is less impact if the app service storage has issues. To use local storage , set the app setting

 WEBSITES\_ENABLE\_APP\_SERVICE\_STORAGE = false Lets use WordPress as an example here again. You can use local storage for WordPress app , but this requires a few changes in your code and how the application is used. Here are a few things you would need to do :

  - Turn off auto update for WordPress
 - Manually deploy the latest WordPress code updates with your docker image
 - Do not install plugins , themes etc. from production site’s WordPress administration dashboard
  For other CMS solutions like Drupal , Joomla etc ; you need to understand if there are options on turn on auto-update . The steps #2 and #3 mentioned above will still apply to any other application. This is a key decision to make before taking the next step.

 Deployment
----------

 There are many deployment options available for your custom images:

  -  [endif][Continuous Delivery with VSTS](https://blogs.msdn.microsoft.com/devops/2017/05/10/use-azure-portal-to-setup-continuous-delivery-for-web-app-on-linux/)
 - [Continuous Deployment with Azure Container Registry (ACR) or Docker Hub](https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-ci-cd)
  ### Choose a deployment option

 There are two common terms with deployment as seen above :

  - **Continuous Deployment** : Every change made to your docker image is pushed out to production automatically.
 - **Continuous Delivery**: Provides you with a deployment release pipeline. This solution does not mean your code is pushed to production automatically . The goal here is to build a process that can allow code to be deployed any time . Most Continuous Delivery processes include automated tests and criteria that needs to be met before the changes go to production.
  Based on your needs , pick either Continuous Delivery which we provide using VSTS or Continuous Deployment with ACR/DockerHub.

 ### Can I deploy my code via GIT

 You can have your application source code as part of the docker image or you can have the application code on a git based repository and your docker image on ACR or Docker Hub . Continuous Delivery with VSTS supports both these scenarios.

 If you are not using Continuous Delivery with VSTS , the other option you have is Continuous Deployment feature that support GitHub, Bitbucket, Local GIT etc.

 *Note :**You must use App Service Storage for your files if your application code is separate from your docker image and you choose to deploy the source code separately than the docker image. If your application code is large , there may be some issues with Git deployment for such apps. In those cases use [Zip deploy API ](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file)*

 Planning Migration or setting up a new site
-------------------------------------------

 The question listed below should help you make the key decisions before implementing a migration of an existing site or setting up a new site:  2. Should I use a built in image or customer image ? Review your dependencies or requirements to answer this question
 4. Should I use App Service Storage or Local Storage ? Does the app need file persistence ?
 6. Do I need to run the app on multiple instances with auto-scale or Can I run the app on single instance ? When running in single instance , you can include local mysql , local redis etc without having to use a cloud service for MySQL and Redis . Note to use Local mysql you need file persistence
 8. What deployment strategy works best for this application ? Keep in mind to choose an option that helps make deployment even after the site is in production. This will provide a stable , repeatable deployment process.
 10. What external dependencies are needed ? Do I need a cloud based service for my database , twitter/Facebook API etc .
  Migration
---------

 Migration of an application from On-premise or other cloud solution providers can be challenging tasks. Here is migration process that is articulated for Web App for Containers.  2. Identify your application dependencies on premise or local development machine . Such as , webserver , php version , php extensions , web server modules etc . If you are using apache server with say php , you can build a custom image with apache server , php etc to run on Web app for containers. If you are using nginx in your current architecture , you can build a custom image with nginx for web app for containers.
 4. Identify external dependencies like Database , Redis cache , CDN etc. Find appropriate solutions for these external dependencies in Azure
 6. For CMS solutions always build a Custom docker image based on the dependencies you identified from the above step. You can find many [samples here](https://github.com/azure-app-service) to help get started . Enable SSH in your docker image which can help as a tool to debug your app.
 8. Create a Web App For Container from [Azure portal](http://portal.azure.com/?feature.customportal=false#create/Microsoft.AppSvcLinux)
 10. Create your external dependencies with the appropriate solutions available in Azure . For example , if your app needs MySQL you can use [Azure Database for MySQL](https://azure.microsoft.com/en-us/services/mysql/) for better reliability and performance
 12. Make the decision to use Local storage or App Service Storage. To use App Service Storage , edit the app setting WEBSITES\_ENABLE\_APP\_SERVICE\_STORAGE = true
 14. Select a deployment option for your application : Continuous Delivery or Continuous Deployment or Git Deployment. Deploy your code to the application and make sure the application code is updated appropriately to use the new dependencies for database , cdn etc in Azure
 16. Browse your application once deployed
 18. Turn on Diagnostic logs to view your docker logs to investigate any issues if you don’t get the expected results. Troubleshoot your application further using SSH .
 20. Tweak your Docker image as needed to resolve any issues . Reiterate the process from step 7 .
  If you are still unable to resolve any issues for a given step or have questions , reach out via [support forums](https://azure.microsoft.com/en-us/support/forums/) to get help.

 Setting up CMS solution on Web App for Containers
-------------------------------------------------

 In the steps below , using Drupal CMS as an example for the CMS solution to be setup and configured on Web App for Containers : 

  [if !supportLists]ü [endif]Create a Web App using Web App for Containers using [Nginx-fpm and Drush CLI tool](https://github.com/Azure-App-Service/nginx-fpm) or your own custom Drupal Image. This image does not have Drupal source code as part of the image. *Note : When using your custom docker image , make sure it is available in either Docker Hub or Azure Container registry as a private or public repository . Make sure you application has [SSH](https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-ssh-support) enabled which can help in troubleshooting.*

  [if !supportLists]ü [endif]Use App Service Storage since Drupal requires files to persist when you do install a module or update Drupal modules or Drupal core . Go to your app , select Application Settings -> App Settings. Now set WEBSITES\_ENABLE\_APP\_SERVICE\_STORAGE =true 

  [if !supportLists]ü [endif]Design and then implement your deployment strategy for your application . 

  [if !supportLists]ü [endif]Create a MySQL or PostgreSQL database depending on what database driver your application is using with [ Azure database for MySQL ](https://azure.microsoft.com/en-us/services/mysql/).

  [if !supportLists]o [endif]If you are migrating an existing application from on-premise or other cloud service provider , [import your database](https://docs.microsoft.com/en-us/azure/mysql/concepts-migrate-import-export) content in the database.  

  [if !supportLists]ü [endif]Browse your application 

  [if !supportLists]ü [endif]If the application does not load as expected , [turn on diagnostic logs](https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-intro#troubleshooting). 

  [if !supportLists]ü [endif]Fix the docker image based on your investigation and update your Docker image.

 If you are planning to migrate a WordPress or Joomla or Moodle CMS solution , the process is exactly the same except for the custom image you plan to use . Here are some samples you can use :  2. Custom image with [Alpine-PHP-MySQL ](https://github.com/Azure-App-Service/alpine-php-mysql)
 4. Custom image with [Apache-PHP-MySQL](https://github.com/Azure-App-Service/apps/tree/master/apache-php-mysql/0.4)
  Performance
-----------

 There are multiple bake some caching into your docker image , such as using PHP 's caching options such as :  2. Server level caching based on which web server you are using leverage any modules or configuration that can help boost performance.
 4. Framework level caching such as PHP supports various options for caching 
	 - [APC](http://php.net/manual/en/book.apc.php) if using Apache (or [APCu if using Nginx](https://pecl.php.net/package/APCu) )
	 - [Opcache](http://php.net/manual/en/book.opcache.php)
	  
 6.  Using Compression , for example including mod\_deflate apache module helps with boosting performance on your application running on Apache web server by reducing the bandwidth on the file and reduces load on the server . This differs based on your web server
 8. Enable back-end database caching using Azure Redis Cache service. If you are not using auto-scale feature with web app for containers , you can run a local redis baked into your docker image. Note this will only work if your app is running on one instance
 10. [Add a CDN ](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-content-delivery-network?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json) to boost performance of your app.
  Other Configurations
--------------------

 Here are a few other configurations you can add to you application  - [Add a Custom domain](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
 - [Bind an SSL certificate ](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-ssl?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
      
