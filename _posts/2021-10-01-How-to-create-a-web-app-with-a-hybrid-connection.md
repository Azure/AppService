---
title: "How to Create a Web App with a Hybrid Connection"
author_name: "Jordan Selig"
toc: true
toc_sticky: true
category: networking
---

[Hybrid Connections](https://docs.microsoft.com/azure/app-service/app-service-hybrid-connections) is a feature in App Service that provides access from your app to a TCP endpoint allowing your app to access application resources in any network that can make outbound calls to Azure over port 443. For those that want their apps in App Service to securely access other resources (typically outside of Azure - within Azure you would use [Private Endpoints](https://docs.microsoft.com/azure/private-link/private-endpoint-overview) for example) but don't want to set up an [Azure ExpressRoute](https://docs.microsoft.com/azure/expressroute/) or connection via the public internet, Hybrid Connections can be an efficient and simple solution.

If you have decided to go down the route of using an App Service Hybrid Connection to connect your web app in App Service to a resource in another network, this tutorial will walk you through setting up the connection and demonstrate how you would connect to a database on your local machine. If you are unfamiliar with Hybrid Connections, take a look at the documentation for [Azure Relay Hybrid Connections](https://docs.microsoft.com/azure/service-bus-relay/relay-hybrid-connections-protocol/) and [App Service Hybrid Connections](https://docs.microsoft.com/azure/app-service/app-service-hybrid-connections).

## Prerequisites

If you don't have an [Azure subscription](https://docs.microsoft.com/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

For this tutorial, a [Node.js app](https://github.com/achowba/node-mysql-crud-app) with a MySQL database will be used. It is important to review the How-To guides specifically for [configuring an app](https://docs.microsoft.com/en-us/azure/app-service/configure-language-nodejs?pivots=platform-windows) on the [App Service Docs](https://docs.microsoft.com/en-us/azure/app-service/) site to ensure you are configuring your app appropriately based on your app's runtime. For more information on how to build apps with a database, see the [tutorials](https://docs.microsoft.com/azure/app-service/tutorial-nodejs-mongodb-app?pivots=platform-windows) posted on the App Service Docs site. The Node.js and MySQL app used for this tutorial was created by Atauba Prince. Check out his [post](https://dev.to/achowba/build-a-simple-app-using-node-js-and-mysql-19me) to learn more about how it works and how to build it from scratch.

## Prepare local MySQL

In this step, you create a database in your local MySQL server. If you don't have a local MySQL server, [install and start MySQL](https://dev.mysql.com/doc/refman/5.7/en/installing.html).

For this tutorial on Hybrid Connections, you will be connecting to your database as root. This is only being done for simplicity due to this being a Hybrid Connections focused tutorial. Connecting as root is not best practice and it's recommended to use fine grained access control and to follow [security best practices](https://docs.microsoft.com/azure/app-service/security-recommendations) when accessing resources.

### Connect to local MySQL server

In a terminal window, connect to your local MySQL server.

```bash
mysql -u root -p
```

If you're prompted for a password, enter the password for the `root` account. If you don't remember your root account password, see [MySQL: How to Reset the Root Password](https://dev.mysql.com/doc/refman/5.7/en/resetting-permissions.html).

If your command runs successfully, then your MySQL server is running. If not, make sure that your local MySQL server is started by following the [MySQL post-installation steps](https://dev.mysql.com/doc/refman/5.7/en/postinstallation.html).

### Create a database locally

1. At the `mysql` prompt, create a database.

    ```sql
    CREATE DATABASE socka;
    CREATE TABLE IF NOT EXISTS `players` (
        `id` int(5) NOT NULL AUTO_INCREMENT,
        `first_name` varchar(255) NOT NULL,
        `last_name` varchar(255) NOT NULL,
        `position` varchar(255) NOT NULL,
        `number` int(11) NOT NULL,
        `image` varchar(255) NOT NULL,
        `user_name` varchar(20) NOT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;
    ```

1. Exit your server connection by typing `quit`.

    ```sql
    quit
    ```

At this point, your database is fully configured and you can move on to configuring the app.

## Create a Node.js app locally

In this step, you will create a local Node.js app to connect to your database to ensure the app and database function as intended. It is good practice to ensure your app functions locally prior to deploying to App Service.

### Clone the sample

In a terminal window, `cd` to a working directory.

1. Clone the sample repository and change to the repository root.

    ```bash
    git clone https://github.com/achowba/node-mysql-crud-app
    cd node-mysql-crud-app
    ```

1. Install the required packages.

    ```bash
    npm install
    ```

### Configure MySQL connection

In the repository root, open up the *app.js* file. If you are following along with the tutorial, you should not need to change anything. If you created a user to access your database, you will need to update the *mysql.createConnection* function with the appropriate parameters.

### Run the application

Ensure that your MySQL server is up and running and go ahead and start the application.

```bash
node app.js
```

Check your terminal to ensure your code has no errors, then head over to your browser and open http://localhost:2000. Feel free to play around with the app by adding, editing, and deleting players. All updates that you make will be stored in the local database. Later on, when you create the app in App Service, since you will be connecting to this same database, you will see the same values.

## Configure the app for App Service

Depending on the runtime of your app, you may need to make minor changes to ensure your App will run on App Service. For Node.js applications, review [this guidance](https://docs.microsoft.com/azure/app-service/configure-language-nodejs?pivots=platform-windows). For this tutorial, you will be modifying the database connection parameters to use app settings rather than hard-coded values. This is more secure and allows you to make updates without having to modify the source code and then wait for the app to re-build and re-deploy.

Go back to the *app.js* file and find the *mysql.createConnection* function. Replace the values for the parameters with environment variables. The function should look like the below. The names for the values of the settings are arbitrary, but note what they are as you will need them a little later on.

```javascript
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
```

## Deploy app to Azure

### Create a web app

At this point, you are ready to deploy the app to App Service. Ensure you are in the root directory of your app and deploy your code using the `az webapp up` command. Pick a unique name for your app. You will be prompted if the name you choose is already in use.

```bash
az webapp up --sku B1 --name <app-name>
```

The command may take a few minutes to complete. When finished, navigate to your App Service in the [Azure portal](https://portal.azure.com). At this point, you will have an App Service with deployed code, however your app will not function until you connect the database.

### Configure database settings

In App Service, you set environment variables as app settings by using the [az webapp config appsettings set](https://docs.microsoft.com/cli/azure/webapp/config/appsettings#az_webapp_config_appsettings_set) command (you can also do this directly in the portal).

Execute the following command. Note the values for the app settings are what were previously used in the *mysql.createConnection* function. If you had different values, be sure to substitute them accordingly. Also be sure to fill in the placeholders for app name and resource group. These values can be found by navigating to your app in the portal or by executing the `az webapp show` command.

```bash
az webapp config appsettings set --name <app-name> --resource-group <resource-group> --settings DB_HOST="localhost" DB_DATABASE="socka" DB_USERNAME="root" DB_PASSWORD="" DB_PORT="3306"
```

### Create Hybrid Connection

The final step is to create the Hybrid Connection from your App Service to your local database. Be sure to review the [system requirements](https://docs.microsoft.com/azure/app-service/app-service-hybrid-connections#things-you-cannot-do-with-hybrid-connections) for the Hybrid Connection Manager to ensure your scenario is eligible for this feature.

To create a Hybrid Connection, go to the [Azure portal](https://portal.azure.com) and select your app. Select **Networking** from the left-hand side then **Hybrid connections** under **Outbound Traffic**.

Towards the top of the screen, you should see a button to "Download connection manager." Download and install the Hybrid Connection Manager (HCM) on your local machine. You will need that after configuring the connection in the portal.

To add a new Hybrid Connection, select **[+] Add hybrid connection**.

You'll see a list of the Hybrid Connections that you already created if you have used Hybrid Connections before. To add one or more of them to your app, select the ones you want, and then select **Add selected Hybrid Connection**. If you are new to Hybrid Connections, you will need to create a one that connects to the MySQL database on your local machine. To do this, select **Create new hybrid connection** and input the required values. For this tutorial, the values are as follows:

|Setting                |Value                                                                                 |
|-----------------------|--------------------------------------------------------------------------------------|
|Hybrid connection Name |(create a name)                                                                       |
|Endpoint Host          |localhost                                                                             |
|Endpoint Port          |3306                                                                                  |
|Servicebus namespace   |*Create new* (or use an existing one if you have one already)                         |
|Location               |(pick a location close to you, I recommend using the same one as your resource group) |
|Name                   |(create a name)                                                                       |

Select **Ok** and your Hybrid Connection will get created and you will get re-directed to the **Hybrid connections** blade. You should see the Hybrid Connection you just created in the list with a status of "Not connected."

The Hybrid Connections feature requires a relay agent in the network that hosts your Hybrid Connection endpoint. That relay agent is called the Hybrid Connection Manager (what you downloaded earlier). After installing the Hybrid Connection Manager, you can run HybridConnectionManagerUi.exe to use the UI for the tool. This file is in the Hybrid Connection Manager installation directory. In Windows 10, you can also just search for Hybrid Connection Manager UI in your search box.

To add one or more Hybrid Connections:

1. Select **Add a new Hybrid Connection**.
1. Sign in with your Azure account to get your Hybrid Connections available with your subscriptions. The Hybrid Connection Manager does not continue to use your Azure account beyond that.
1. Choose a subscription.
1. Select the Hybrid Connections that you want to relay.
1. Select **Save**.
1. You can now see the Hybrid Connections you added. You can also select the configured Hybrid Connection to see details.
1. Under **Azure Status**, ensure that you are "Connected". If you are not, open up Task Manager on your Windows machine, go to the "Services" tab, and find the *HybridConnectionManager* service. Right click it and select **Restart**. Head back over to the Hybrid Connection Manager and select **Refresh** to update the Azure connection status. You should now see a "Connected" status. If not, have a look at the [troubleshooting info](https://docs.microsoft.com/en-us/azure/app-service/app-service-hybrid-connections#troubleshooting) for App Service Hybrid Connections.

### Browse to the Azure app

Browse to `http://<app-name>.azurewebsites.net` and see your app exactly how it was running locally, but this time with the app in Azure connected to your local database!

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. The resource group has a name like "appsvc_rg_Linux_CentralUS" depending on your location. If you keep the web app running, you will incur some ongoing costs (see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/)).

If you don't expect to need these resources in the future, delete the resource group by running the following command:

```azurecli
az group delete --no-wait
```