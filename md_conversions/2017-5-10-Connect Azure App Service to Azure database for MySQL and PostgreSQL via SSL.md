---
title: "Connect Azure App Service to Azure database for MySQL and PostgreSQL via SSL"
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  5/10/2017 8:10:26 AM  [Azure Database for MySQL (Preview)](https://azure.microsoft.com/en-us/services/mysql) and [Azure Database for PostgreSQL (Preview)](http://azure.microsoft.com/services/postgresql), both services support Secure Sockets Layer (SSL) encryption. By default if you create a MySQL or PostgreSQL server using this server SSL is required to connect to all databases on that server. With [Web Apps](https://azure.microsoft.com/en-us/services/app-service/) , the application needs to provide the certificate authority (CA) is one that the client trusts for the connection to succeed. This involves a few steps . Follow the steps below to add SSL to an existing application on Azure App Service. Note: These instructions are same whether you are using Windows or Linux based Azure App Service.  2. Follow the steps in this [article](http://docs.microsoft.com/azure/mysql/howto-configure-ssl.md) on configuring SSL on Azure database for MySQL or PostgreSQL.
 4. Create a **bin** folder under **D:/home/site/wwwroot **and place the certificate *(.pem file *generated from step #1*)* in** bin **folder. You can do this directly by accessing the file server for web app using [FTP or Git or Kudu](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-deploy) .
 6. Log in to [Azure portal.](https://portal.azure.com)
 8. Select your existing Web app and click on Application settings. Add the following app setting for your web app: For MYSQL : ![ssl-wordpress]({{ site.baseurl }}/media/2017/05/ssl-wordpress-1024x157.png) For PostgreSQL :[![ssl-postgres]({{ site.baseurl }}/media/2017/05/ssl-postgres-1024x138.png)]({{ site.baseurl }}/media/2017/05/ssl-postgres.png)
 10. Now SSL certificate is added to your web application . Your application code needs to be updated to use this certificate authority when connecting to the database.
  Please refer to the documentation of your application framework on how to consume the certificate authority to connect to the database via SSL. Here are a few examples below. ### Connect to MySQL server with SSL for WordPress app

 Add the following to ***wp-config.php*** to connect to the MySQL database via SSL define('MYSQL\_CLIENT\_FLAGS', MYSQL\_CLIENT\_SSL); define( 'MYSQL\_SSL\_CA', getenv('MYSQL\_SSL\_CA'));  ### Note:

 If you are using PHP 7.X version , you need another flag  MYSQLI\_CLIENT\_SSL\_DONT\_VERIFY\_SERVER\_CERT for any PHP based application. For example with WordPress , you need to update MYSQL\_CLIENT\_FLAGS as shown below  define( 'MYSQL\_CLIENT\_FLAGS', MYSQLI\_CLIENT\_SSL | MYSQLI\_CLIENT\_SSL\_DONT\_VERIFY\_SERVER\_CERT );  ### Connect to PostgreSQL server with SSL for Drupal app

 Add the following to ***site/default/settings.php*** and add PDO options for SSL $databases = array ( 'default' => array ( 'default' = array ( 'database' => 'databasename', 'username' => 'username', 'password' => 'password', 'host' => 'hostname', 'port' => '3306', 'driver' => 'mysql', 'prefix' => '', 'pdo' => array( PDO::PGSQL\_ATTR\_SSL\_CA => getenv('POSTGRESQL\_SSL\_CA'), ), ), ); ### Connect to MySQL server with SSL for Drupal app

 Add the following to ***site/default/settings.php*** and add PDO options for SSL $databases = array ( 'default' => array ( 'default' => array ( 'database' => 'databasename', 'username' => 'username', 'password' => 'password', 'host' => 'hostname', 'port' => '3306', 'driver' => 'mysql', 'prefix' => '', 'pdo' => array( PDO::MYSQL\_ATTR\_SSL\_CA => getenv('MYSQL\_SSL\_CA'), ), ), ); ### Connect to PostgreSQL server with SSL for Django app

 Add the following to ***settings.py*** and the options for SSL  DATABASES = { 'default': { 'ENGINE': 'django.db.backends.postgresql\_psycopg2', 'NAME': 'dbname', 'USER': 'dbuser', 'PASSWORD': 'dbpassword', 'HOST': 'dbhost', 'OPTIONS': { 'sslmode': 'require', 'ca':os.environ.get('POSTGRESQL\_SSL\_CA', '') }, }, }      