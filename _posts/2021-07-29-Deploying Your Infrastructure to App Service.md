---
title: "Overview of the Various Methods for Deploying Your Infrastructure to App Service"
author_name: "Jordan Selig"
toc: true
toc_sticky: true
tags:
    - Deployment
---

There are a number of ways to deploy infrastructure to Azure, what you pick depends on a number of factors including skill level, experience, job requirement, or perhaps company policy. In the end, they'll essentially get you to the same place - infrastructure deployed to the cloud. This article will cover infrastructure deployment methods including using the [Azure Portal](https://portal.azure.com/), [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli) in Cloud Shell or on your local machine, an [Azure Resource Manager (ARM)](https://docs.microsoft.com/azure/azure-resource-manager/management/overview) template, [Bicep](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/), and [Terraform](https://www.terraform.io/) by HashiCorp. Feel free to follow along with the samples as step-by-step guidance will be provided.

## General Prerequisites

Since there are a number of deployment methods in this article, prerequisites will be given on a case by case basis. However to start, if you would like to follow along and you don't have an [Azure subscription](https://docs.microsoft.com/en-us/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin. Be mindful when creating and deleting resources as some of the samples in this article may incur charges if you choose certain deployment settings or if you keep your app running for an extended period of time. If you are trying to prevent racking up an charges, please be sure to review the documentation and billing pages closely prior to any deployments.

## App Overview

You will be creating a to-do-list app that uses Microsoft Azure Cosmos DB service to store and access data from an ASP.NET Core MVC application hosted on Azure App Service. More details for this app can be found [here](https://github.com/Azure-Samples/cosmos-dotnet-core-todo-app).

We will be creating the following primary resources:

1. [Cosmos DB account](https://docs.microsoft.com/en-us/azure/cosmos-db/create-cosmosdb-resources-portal) to act as the database to store the data from our app
1. [App Service Plan](https://docs.microsoft.com/en-us/azure/app-service/overview-hosting-plans) which defines the set of compute resources for the web app to run
1. [App Service](https://docs.microsoft.com/en-us/azure/app-service/overview) which is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends

[Code deployment](https://docs.microsoft.com/en-us/azure/app-service/deploy-github-actions?tabs=applevel) in App Service is another topic that will not be covered in depth in this article, but feel free to browse the [docs](https://docs.microsoft.com/en-us/azure/app-service/deploy-github-actions?tabs=applevel) to understand the various methods. For the purpose of this article, you will stick to one method (External Git) to keep things as consistent as possible.

## Azure Portal

### Prerequisites
No additional prerequisites for this tutorial.

### Tutorial

In my opinion, the [Azure Portal](https://portal.azure.com/) is the most user friendly method for infrastructure deployment, especially for those who are just starting with Azure or do not have much experience with the cloud or infrastructure-as-code. It provides a user interface where you will get to explore the various available services and see step-by-step what is happening as you move through the infrastructure creation process.

Navigate to the [Azure Portal](https://portal.azure.com/). At this point, you should have already created an [Azure subscription](https://docs.microsoft.com/en-us/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing) and a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). If not, navigate back to the [General Prerequisites](#general-prerequisites) and complete those steps.

1. To start, you will need to create a [resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal) to hold and manage the resources related to this app. From the home page, click "Create a resource" and search for "resource group." Select and fill in the following details:
    1. **Subscription**: the name of the subscription you created (or already had if you were an existing Azure user)
    1. **Resource Group**: give your resource group a name that is unique to your Subscription
    1. **Region**: select your preferred region for where you would like the resource group to be located. (Typically you choose a region that is physically close to you to reduce latency, or sometimes certain features/services are only available in certain regions - for the purposes of this article, it does not matter which region you choose.)
1. Select "Review + create" at the bottom left of your screen and wait for validation to complete. If you get an error, review and address as needed.
1. Select "Create" at the bottom left and your resource group will be created
1. Next, you will need to create a Cosmos DB account. For more details on how to do this, see [this](https://docs.microsoft.com/en-us/azure/cosmos-db/create-cosmosdb-resources-portal) doc. For this article, I will give quick step-by-step guidance. Navigate back to the "Create a resource" page and search for Cosmos DB. Select "Create" under "Azure Cosmos DB" ane then select "Azure Cosmos DB" again.
1. On the following page, select create under "Core (SQL) - Recommended" as the account type
1. Fill in the following details for your Cosmos DB account:
    1. **Subscription**: the name of the subscription you created (or already had if you were an existing Azure user)
    1. **Resource Group**: the resource group you created earlier
    1. **Account Name**: a unique name to identify the account. The name can only contain lowercase letters, numbers, and the hyphen (-) character. It must be between 3-44 characters in length.
    1. **Location**: a geographic location to host your Azure Cosmos DB account. Use the location that is closest to your users to give them the fastest access to the data. You can use the same or different location as you selected for your resource group since this is only a tutorial, however if you were to put this into production, you would want to think more carefully about this location as well as [geo-redundancy](https://docs.microsoft.com/en-us/azure/cosmos-db/distribute-data-globally) options.
    1. To keep things as cheap as possible, for "Capacity mode", select "Provisioned throughput" which gives you the option to "Apply Free Tier Discount." Select "Apply" if this is your intention.
1. Feel free to browse the remaining settings, but this tutorial will leave them as defaults
1. Select "Review + create" at the bottom left of your screen and wait for validation to complete. If you get an error, review and address as needed.
1. Select "Create" at the bottom left and your Cosmos DB account will be created after a couple minutes
1. While the Cosmos DB account is being provisioned, which can take 5-10 minutes, you can move on to creating the App Service. Navigate back to the "Create a resource" page and search for "Web App." Make sure you don't select any of the recommended options and just hit enter to search.
1. Review the results and select "Create" under "Web App." This will take you to the Web App creation page.
1. Fill in the following details for your Web App:
    1. **Subscription**: the name of the subscription you created (or already had if you were an existing Azure user)
    1. **Resource Group**: the resource group you created earlier
    1. **Name**: a unique name to identify the web app. This will become part of the domain for the app.
    1. **Publish**: "Code" - we will cover this in the next step
    1. **Runtime stack**: ".NET Core 3.1"
    1. **Operating System**: "Windows"
    1. **Region**: a geographic location close to your Azure Cosmos DB account.
    1. You will now be selecting the details for the App Service Plan (ASP). Pay close attention here to avoid incurring any unwanted costs.
        1. **Windows Plan**: select "Create new" and give the A**: a name
        1. **Sku and size**: select "Change size" and choose the**:ier that fits your budget. "F1" is the free tier and should be sufficient for this tutorial. I would recommend using "S1" or higher for this however since it gives you more features to experiment with. Select your tier and hit "Apply."
1. Feel free to browse the remaining settings, but this tutorial will leave them as defaults.
1. Select "Review + create" at the bottom left of your screen and wait for validation to complete. If you get an error, review and address as needed.
1. Select "Create" at the bottom left and your web app will be created after a couple minutes
1. While the web app is being provisioned, navigate to your newly created Cosmos DB account. The easiest way to do this is to go to your Resource Group to view all of the resources you have created so far.
1. You will now create the container in the Cosmos DB account that will hold the data for our app
    1. Make sure you are on the "Overview" page and select "Add Container" at the top left
    1. Fill in the following values, leaving the remaining as default:
        1. **Database id**: select "Create new" and call it `Tasks`
        1. **Database throughput**: select "Manual" and change the value to `400` which should be sufficient for this tutorial
        1. **Container id**: `Items`
        1. **Partition key**: = `/id`
    1. Select "OK" to close out the dialog. Your container and empty table will get provisioned after a couple seconds
1. Now it is time to connect your database to your web app. Under "Settings" on the left hand side, select "Keys" to show the various keys and connection strings associated with your database. Copy and paste the following into a text editor:
    1. URI
    1. Primary Key
1. Once you have these values, navigate to your Web App. You can do this by retuning to your Resource Group and selecting the Web App from there. Make sure you select the resource with the type "App Service."
1. Under "Settings" on the left hand side, select "Configuration" to add the connection to your database
1. Under "Application settings" select "New application setting" and create the following (you will need to hit "New application setting" for each one)
    1. Name = CosmosDb:Account, Value = `<database URI>`
    1. Name = CosmosDb:Key, Value = `<database Primary key>`
    1. Name = CosmosDb:DatabaseName, Value = `Tasks`
    1. Name = CosmosDb:ContainerName, Value = `Items`
1. Hit "Save" at the top and then "Continue" for the notification saying your app will be restarted
1. Finally, your app is configured and you can upload your code. Head over to "Deployment Center" under "Deployment" on the left hand side
1. Use the following settings:
    1. **Source**: "External Git"
    1. **Repository**: `https://github.com/Azure-Samples/cosmos-dotnet-core-todo-app.git`
    1. **Branch**: `main`
    1. **Repository Type**: "Public"
1. Hit "Save" at the top and give your app time to build and deploy the code. You can review the status by selecting "Logs" next to the "Settings" tab in the Deployment Center. When Status says "Success (Active)" your app should be up and running!
1. Navigate to the "Overview" tab on the left hand side and find your app's URL. Hit that and it should open your app in a new tab. Feel free to play around with it and see what you've created! If your app doesn't open immediately or you get a generic landing page, wait a couple minutes and try again. If needed, restart your app by hitting "Restart" at the top of the "Overview" tab.
1. When you are done, you can delete your resources. You can do this by [deleting the resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal).

Congratulations! You just deployed a web app connected to a database on Azure. Continue to the next section to learn about another deployment method.

## Azure CLI

### Prerequisites

Azure hosts Azure Cloud Shell, an interactive shell environment that you can use through your browser. You can use either Bash or PowerShell with Cloud Shell to work with Azure services. You can use the Cloud Shell preinstalled commands to run the code in this article without having to install anything on your local environment. If you prefer to use your local environment, follow the steps [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) to install the latest version. 

If you are using the Azure CLI from your local environment, you will need to login first with the [`az login`](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli#sign-in) command. Proceed to the tutorial once logged in. If you would like to use the Azure Cloud Shell either navigate to the [Azure portal](https://portal.azure.com/) and select the **Cloud Shell** button on the menu bar at the upper right, or just navigate to [https://shell.azure.com/](https://shell.azure.com/).

### Tutorial

The [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/what-is-azure-cli) is a cross-platform command-line tool to connect to Azure and execute administrative commands on Azure resources. It allows the execution of commands through a terminal using interactive command-line prompts or a script. It is a great tool for those who have experience working from a command line and are comfortable with either bash or PowerShell. For those with less experience, there is an [interactive mode](https://docs.microsoft.com/en-us/cli/azure/interactive-azure-cli) which can be activated by running the `az interactive` command.

Below is a script which if you copy and paste into your CLI/shell will run all of the commands and deploy the application in one shot. I recommend however that you copy and paste each of the commands one at a time to get a better understanding of what is happening during each step. You can navigate between your CLI and the portal to see the resources in your resource group as they get created.

Comments have provided throughout the script to identify what each of the commands is doing.

```bash
# Variables
resourceGroupName="myResourceGroup"
appName="webappwithcosmosdb$RANDOM"
location="eastus"
appServicePlanName="$appName-ASP"
# Do not change these
databaseName="Tasks"
containerName="Items"

# Create a Resource Group 
az group create --name $resourceGroupName --location $location

# Create an App Service Plan
az appservice plan create --resource-group $resourceGroupName --name $appServicePlanName --sku S1 --location $location

# Create a Web App
az webapp create --name $appName --plan $appServicePlanName --resource-group $resourceGroupName

# Create a Cosmos DB account
az cosmosdb create --name $appName --resource-group $resourceGroupName --kind GlobalDocumentDB

# Get the database connection details and store them as variables. Make sure there is only one Cosmos DB account in your resource group. Otherwise, you will need to further parse the response from the below command to obtain the needed info.
databaseUri=$(az cosmosdb list --resource-group $resourceGroupName --query [0].documentEndpoint --output tsv)
primaryMasterKey=$(az cosmosdb keys list --name $appName --resource-group $resourceGroupName --type keys --query primaryMasterKey --output tsv)

# Assign the database details to App Settings in the Web App
az webapp config appsettings set --name $appName --resource-group $resourceGroupName --settings "CosmosDb:Account=$databaseUri"
az webapp config appsettings set --name $appName --resource-group $resourceGroupName --settings "CosmosDb:Key=$primaryMasterKey"
az webapp config appsettings set --name $appName --resource-group $resourceGroupName --settings "CosmosDb:DatabaseName=$databaseName"
az webapp config appsettings set --name $appName --resource-group $resourceGroupName --settings "CosmosDb:ContainerName=$containerName"

# Upload the code using External Git
az webapp deployment source config --resource-group $resourceGroupName --name $appName --repo-url https://github.com/Azure-Samples/cosmos-dotnet-core-todo-app.git --branch main --manual-integration
```

And that's it! Give your app a couple minutes to deploy, and then navigate to your app's URL (`<https://APP-NAME.azurewebsites.net>`) to validate everything was created as intended.

## Azure Resource Manager (ARM) Template

An [ARM template](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview) is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. This is also known as "Infrasture as Code (IaC)." The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment.

ARM templates are great for companies or people that need reusable templates to manage their infrastructure in a secure and consistent manner. For example, if a development team from a company requires a VM with a database to deploy a certain application, the approved ARM template for this configuration can be used which ensures this team is given approved and secure infrastructure and prevents the team from configuring something that can potentially lead to a hack or unidentified vulnerability. There are numerous linters and scanners that can review templates to ensure they are following certain security and regulatory standards as well which further adds to the sense of security companies can have when they use this deployment method.

### Prerequisites

You will need a text editor or IDE to carry out this tutorial. I would recommend [Visual Studio Code](https://code.visualstudio.com/). You will also need to install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/what-is-azure-cli). You have the option of using the [Azure Cloud Shell](https://shell.azure.com/) which does not require any additional installation. The Azure Cloud Shell has a built in editor which can be opened by clicking the button that looks like "{ }" at the top of the screen.

### Tutorial

Review the below template. You will recognize that all of the resources in the template, including the settings, are what you created previously.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "dev",
      "templateHash": "108437092261803770"
    }
  },
  "parameters": {
    "applicationName": {
      "type": "string",
      "defaultValue": "[format('to-do-app{0}', uniqueString(resourceGroup().id))]",
      "maxLength": 30,
      "metadata": {
        "description": "Application Name"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    },
    "appServicePlanTier": {
      "type": "string",
      "defaultValue": "S1",
      "metadata": {
        "description": "App Service Plan's pricing tier. Details at https://azure.microsoft.com/en-us/pricing/details/app-service/"
      },
      "allowedValues": [
        "F1",
        "D1",
        "B1",
        "B2",
        "B3",
        "S1",
        "S2",
        "S3",
        "P1",
        "P2",
        "P3",
        "P4"
      ]
    },
    "appServicePlanInstances": {
      "type": "int",
      "defaultValue": 1,
      "metadata": {
        "description": "App Service Plan's instance count"
      },
      "maxValue": 3,
      "minValue": 1
    },
    "repositoryUrl": {
      "type": "string",
      "defaultValue": "https://github.com/Azure-Samples/cosmos-dotnet-core-todo-app.git",
      "metadata": {
        "description": "The URL for the GitHub repository that contains the project to deploy."
      }
    },
    "branch": {
      "type": "string",
      "defaultValue": "main",
      "metadata": {
        "description": "The branch of the GitHub repository to use."
      }
    },
    "databaseName": {
      "type": "string",
      "defaultValue": "Tasks",
      "metadata": {
        "description": "The Cosmos DB database name."
      }
    },
    "containerName": {
      "type": "string",
      "defaultValue": "Items",
      "metadata": {
        "description": "The Cosmos DB container name."
      }
    }
  },
  "functions": [],
  "variables": {
    "cosmosAccountName": "[toLower(parameters('applicationName'))]",
    "websiteName": "[parameters('applicationName')]",
    "hostingPlanName": "[parameters('applicationName')]"
  },
  "resources": [
    {
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "apiVersion": "2021-04-15",
      "name": "[variables('cosmosAccountName')]",
      "kind": "GlobalDocumentDB",
      "location": "[parameters('location')]",
      "properties": {
        "consistencyPolicy": {
          "defaultConsistencyLevel": "Session"
        },
        "locations": [
          {
            "locationName": "[parameters('location')]",
            "failoverPriority": 0,
            "isZoneRedundant": false
          }
        ],
        "databaseAccountOfferType": "Standard"
      }
    },
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2020-06-01",
      "name": "[variables('hostingPlanName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('appServicePlanTier')]",
        "capacity": "[parameters('appServicePlanInstances')]"
      }
    },
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2020-06-01",
      "name": "[variables('websiteName')]",
      "location": "[parameters('location')]",
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
        "siteConfig": {
          "appSettings": [
            {
              "name": "CosmosDb:Account",
              "value": "[reference(resourceId('Microsoft.DocumentDB/databaseAccounts', variables('cosmosAccountName'))).documentEndpoint]"
            },
            {
              "name": "CosmosDb:Key",
              "value": "[listKeys(resourceId('Microsoft.DocumentDB/databaseAccounts', variables('cosmosAccountName')), '2021-04-15').primaryMasterKey]"
            },
            {
              "name": "CosmosDb:DatabaseName",
              "value": "[parameters('databaseName')]"
            },
            {
              "name": "CosmosDb:ContainerName",
              "value": "[parameters('containerName')]"
            }
          ]
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.DocumentDB/databaseAccounts', variables('cosmosAccountName'))]",
        "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]"
      ]
    },
    {
      "type": "Microsoft.Web/sites/sourcecontrols",
      "apiVersion": "2020-06-01",
      "name": "[format('{0}/web', variables('websiteName'))]",
      "properties": {
        "repoUrl": "[parameters('repositoryUrl')]",
        "branch": "[parameters('branch')]",
        "isManualIntegration": true
      },
      "dependsOn": [
        "[resourceId('Microsoft.Web/sites', variables('websiteName'))]"
      ]
    }
  ]
}
```

The template starts with the parameters for the infrastructure.

Following the parameters are the resources. I will not repeat what these resources are since they are the same as those created before. Feel free to browse [here](https://docs.microsoft.com/en-us/azure/templates/) to learn more about the various resources.

In order to deploy this template, follow these steps:

1. Copy and paste the template to your preferred editor/IDE/Cloud Shell and save the file to your working directory
1. Open up a terminal where the Azure CLI has been installed and run the code below to create a resource group

    ```bash
    az group create --name myResourceGroup --location "eastus"
    ```

1. Deploy the template using the following:

    ```bash
    az deployment group create --resource-group myResourceGroup --template-file <path-to-template>
    ```

1. And that's it! Wait for a success message and navigate to your web app URL to prove that everything was created as intended.
1. When you are done, [delete the resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-cli) to delete the resources

## Bicep File

Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse. You can use Bicep instead of JSON to develop your Azure Resource Manager templates ([ARM templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview)). The JSON syntax to create an ARM template can be verbose and require complicated expressions. Bicep syntax reduces that complexity and improves the development experience. Bicep is a transparent abstraction over ARM template JSON and doesn't lose any of the JSON template capabilities. During deployment, the Bicep CLI transpiles a Bicep file into ARM template JSON.

I would recommend Bicep to developers who are looking to create reusable templates for their infrastructure. If you have used ARM templates previously, it would be good to take a look at Bicep to see how it simplifies and speeds up template creation. Click [here](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview) if you are interested in learning more about Bicep.

### Prerequisites

The Azure CLI is used here to deploy the template. You can also use the Azure portal, Azure PowerShell, or REST API. To learn about other deployment methods, see [Bicep Deployment Commands](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-cli).

In order to effectively create resources with Bicep, you will need to set up a Bicep [development environment](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/install). Feel free to use the Azure Cloud Shell or your IDE of choice (this requires installing the Azure CLI locally). The Bicep extension for [Visual Studio Code](https://code.visualstudio.com/) provides language support and resource autocompletion. The extension helps you create and validate Bicep files and is recommended for those that will continue to create resources using Bicep upon completing this tutorial.

### Tutorial

I'll start off by giving you the file. You will recognize that all of the resources in the template, including the settings, are what you created previously. Compared to the ARM template, we reduced the number of lines and complexity significantly.

```javascript
param appServicePlanTier string = 'S1'

@minValue(1)
@maxValue(3)
@description('App Service Plan\'s instance count')
param appServicePlanInstances int = 1

@description('The URL for the GitHub repository that contains the project to deploy.')
param repositoryUrl string = 'https://github.com/Azure-Samples/cosmos-dotnet-core-todo-app.git'

@description('The branch of the GitHub repository to use.')
param branch string = 'main'

@description('The Cosmos DB database name.')
param databaseName string = 'Tasks'

@description('The Cosmos DB container name.')
param containerName string = 'Items'

var cosmosAccountName = toLower(applicationName)
var websiteName = applicationName
var appServicePlanName = applicationName

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
  name: cosmosAccountName
  kind: 'GlobalDocumentDB'
  location: location
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2021-01-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanTier
    capacity: appServicePlanInstances
  }
  kind: 'linux'
}

resource appService 'Microsoft.Web/sites@2021-01-01' = {
  name: websiteName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      http20Enabled: true
      
      appSettings: [
        {
          name: 'CosmosDb:Account'
          value: cosmosAccount.properties.documentEndpoint
        }
        {
          name: 'CosmosDb:Key'
          value: listKeys(cosmosAccount.id, cosmosAccount.apiVersion).primaryMasterKey
        }
        {
          name: 'CosmosDb:DatabaseName'
          value: databaseName
        }
        {
          name: 'CosmosDb:ContainerName'
          value: containerName
        }
      ]
    }
  }
}

resource srcControls 'Microsoft.Web/sites/sourcecontrols@2021-01-01' = {
  name: '${appService.name}/web'
  properties: {
    repoUrl: repositoryUrl
    branch: branch
    isManualIntegration: true
  }
}
```

The file starts with the parameters for the infrastructure. They are defined in the template itself, but you are free to leave them as inputs which can be added during deployment.

Following the parameters are the resources. Feel free to browse [here](https://docs.microsoft.com/en-us/azure/templates/) to learn more about the various resources. There are tabs for ARM and Bicep.

In order to deploy this template follow these steps:

1. Copy and paste the template to your preferred editor/IDE/Cloud Shell and save the file to your working directory
1. Open up a terminal where the Azure CLI has been installed and run the code below to create a resource group

    ```bash
    az group create --name myResourceGroup --location "eastus"
    ```

1. Deploy the template using the following:

    ```bash
    az deployment group create --resource-group myResourceGroup --template-file <path-to-template>
    ```

1. And that's it! Wait for a success message and navigate to your web app URL to prove that everything was created as intended.
1. When you are done, [delete the resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-cli) to delete the resources

## Terraform

[Terraform by Hashicorp](https://www.terraform.io/) is an open source tool that codifies APIs into declarative configuration files that can be used to create, manage, and update infrastructure resources such as virtual machines (VMs), networks, and containers. It is becoming the deployment method of choice for many large enterprises since it can provision infrastructure across 300+ public clouds and services using a single workflow and consistent syntax. For this reason, many companies that are choosing multi-cloud leverage Terraform.

### Prerequisites

I would recommend going to the [Terraform documentation](https://learn.hashicorp.com/collections/terraform/azure-get-started) for getting started on Azure to learn more about Terraform and understand how to configure your environment as they will do a much better job than I can here.

Once you have reviewed their materials, the below template is all you need!

### Tutorial

Follow the guidance as provided by [this doc](https://learn.hashicorp.com/tutorials/terraform/azure-build?in=terraform/azure-get-started) to deploy this template. Replace the contents of their "main.tf" with the below.

For a quick summary of what is needed to get this deployed (ignoring many of the great features Terraform has to offer which I do recommend reviewing at some point):

1. Open up your IDE of choice where Terraform has been installed
1. Created a new directory and `cd` into it
1. Create a main.tf file and copy and paste the below template into there
1. Run `terraform init`
1. Run `terraform apply`
1. Once complete, navigate to the web app URL to view your app
1. When you are done, [delete the resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-cli) to delete the resources
    1. You can also run a `terraform destroy` command here as an alternative

```javascript
variable "failover_location" {
  default = "westus"
}

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>2.0"
    }
  }
}
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "myResourceGroup"
  location = "eastus"
}

resource "random_integer" "ri" {
  min = 10000
  max = 99999
}

resource "azurerm_cosmosdb_account" "db" {
  name                = "webapp-cosmos-db-${random_integer.ri.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = var.failover_location
    failover_priority = 1
  }

  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }
}

resource "azurerm_app_service_plan" "appserviceplan" {
  name                = "webapp-cosmos-db-${random_integer.ri.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  sku {
    tier = "Standard"
    size = "S1"
  }
}

resource "azurerm_app_service" "webapp" {
  name                = "webapp-cosmos-db-${random_integer.ri.result}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.appserviceplan.id

  app_settings = {
    "CosmosDb:Account" : azurerm_cosmosdb_account.db.endpoint,
    "CosmosDb:Key" : azurerm_cosmosdb_account.db.primary_key,
    "CosmosDb:DatabaseName" : "Tasks",
    "CosmosDb:ContainerName" : "Items"
  }

  source_control {
    repo_url           = "https://github.com/Azure-Samples/cosmos-dotnet-core-todo-app.git"
    branch             = "main"
    manual_integration = true
    use_mercurial      = false
  }
}
```

## Wrapping Up

Thanks for taking the time to go through this tutorial. **Again, please ensure you have deleted any resources you do not intend to keep.** I hope you learned something about the various ways the App Service team has worked to create a platform that meets as many of your web app needs as possible and reach a variety of customers. If you have any questions, feedback, or requests, feel free to share using the links below. Also note that App Service is constantly updated to improve functionality and usability. If anything from the article no longer applies or if you get stuck, always feel free to reach out!
