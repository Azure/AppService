---
layout: post
title:  "The Data Connections will be removed from Web App menu"
categories: update
author: "Byron Tardif"
---

Data connections provides a guided experience to easily add a connection string to a new or existing **SQL Azure Database** or **Azure Storage Account**.

To simplify the user experience, the data connections feature will be removed from the Web Apps menu on April 15, 2019. The feature has a limited audience, and you can easily create connection strings manually, as we describe below.

## How can I add a connection string manually?

### Use a new or existing data source

First determine whether you’ll create a data store or use an existing one.

If you’re going to create a data store, use one of the following quickstarts:

- [Quickstart: Create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal)
- [Quickstart: Getting started with single databases in Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-single-database-quickstart-guide)

If you are using an existing data source, then your next step is to create the connection string.

### Create the connection string

Depending on what data store you use, the connection string will have a different format:

#### SQL Database Connection String format

```bash
Data Source=tcp:{your_SQLServer},{port};Initial Catalog={your_catalogue};User ID={your_username};Password={your_password}
```

- **{your_SQLServer}** Name of the server, this can be found in the overview page for your database and is usually in the form of *"server_name.database.windows.net"*.
- **{port}** usually 1433.
- **{your_catalogue}** Name of the database.
- **{your_username}** User name to access your database.
- **{your_password}** Password to access your database.

[Learn more about SQL Connection String format](https://docs.microsoft.com/dotnet/framework/data/adonet/connection-string-syntax#sqlclient-connection-strings)

#### Azure Storage Connection String format

```bash
DefaultEndpointsProtocol=https;AccountName={your_storageAccount};AccountKey={your_storageAccountKey}
```

- **{your_storageAccount}** Name of your Azure Storage Account
- **{your_storageAccountKey}** Keys used to access your Azure Storage Account

[Where can I find my Azure Storage Account Access Keys](https://docs.microsoft.com/azure/storage/common/storage-account-manage#access-keys)

___

### Add the connection string to your Web App

In App Service, you can manage connection strings for your application by using the **Configuration** option in the menu.

To add a connection string:

1. Click on the **Application settings** tab.

1. Click on **[+] New connection string**.

1. You will need to provide **Name**, **Value** and **Type** for your connection string.

   - If your are adding a connection string to a SQL Azure database choose **SQLAzure** under **type**.

   - If your are adding a connection to an Azure Storage account, chose **Custom** under **type**.

___

> **NOTE** If you are adding a connection string because you are planning on using the Easy API or Easy Table features, then the connection strings used by this features expect the following specific names:
>
>- **Azure SQL database:** MS_TableConnectionString
>- **Azure Storage account:** MS_AzureStorageAccountConnectionString
