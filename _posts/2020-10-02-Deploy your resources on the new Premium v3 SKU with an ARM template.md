---
title: "Deploy your resources on the new Premium v3 SKU with an ARM template"
author_name: "Jeff Martinez"
toc: true
toc_sticky: true
tags:
    - Windows containers
    - Premium v3
    - ARM
---


The Premium v3 SKU, previously [announced at Microsoft Ignite 2020](https://aka.ms/appservice2020), is now available for you to deploy your applications to.  This new SKU introduces new CPU and Memory options, enabling deployment of more apps per App Service Plan and better support for large enterprise applications and content management systems.  With additional price points for dev/test and production workloads and, from 11/1 Reserved Instance Pricing (1 and 3 year options),  Premium v3 is our most cost-effective and performant offering ever.

Portal updates are rolling out to enable the new SKU but as that rolls out, you can deploy resources via ARM templates, Azure CLI and PowerShell.  This tutorial walks you through creating a new Resource Group, Pv3 App Service Plan and a Windows Container Web App using an Azure Resource Manager (ARM) template.

>NOTE: For Windows container workloads, Premium v3 is the only SKU that will be available for these specific container workloads as it supports Hyper-V, the chosen security mode for a multi-tenant architecture.

As Premium v3 continues to roll out, increased coverage will be seen across our regions.  Currently, Premium v3 is an option in the following regions: 
- East Asia
- East US
- North Europe
- West Europe
- West US
- Japan East
- Brazil South
- Southeast Asia
- South Central US
- East US 2
- Central US
- West Central US
- Australia Southeast
- Australia East
- Canada Central
- West US 2
- UK West
- UK South
- Korea Central
- France Central

## Create your JSON template
The ARM template you'll need to make amounts to a JSON file which will define the necessary parameters and resources.  The following template creates a Premium v3 App Service Plan and Windows container Web App resource.  

1.	Open a New File in Visual Studio Code or your IDE of choice
2.	Create a JSON file named *azuredeploy.json*
3.	Copy the below template in its entirety and replace any existing brackets in your new file

```JSON
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "appServiceWebAppName": {
            "type": "String"
        },
        "appServicePlanName": {
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Web/sites",
            "name": "[parameters('appServiceWebAppName')]",
            "apiVersion": "2016-03-01",
            "location": "[resourceGroup().location]",
            "tags": {
                "[concat('hidden-related:', subscription().id, '/resourcegroups/', resourceGroup().name, '/providers/Microsoft.Web/serverfarms/', parameters('appServicePlanName'))]": "empty"
            },
            "properties": {
                "name": "[parameters('appServiceWebAppName')]",
                "siteConfig": {
                    "appSettings": [
                        {
                            "name": "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
                            "value": "false"
                        }
                    ],
                    "appCommandLine": "",
                    "windowsFxVersion": "DOCKER|microsoft/iis"
                },
                "serverFarmId": "[concat(subscription().id, '/resourcegroups/', resourceGroup().name, '/providers/Microsoft.Web/serverfarms/', parameters('appServicePlanName'))]",
                "hostingEnvironment": ""
            },
            "dependsOn": [
                "[concat('Microsoft.Web/serverfarms/', parameters('appServicePlanName'))]"
            ]
        },
        {
            "type": "Microsoft.Web/serverfarms",
            "sku": {
                "Name": "P1v3",
                "Tier": "PremiumV3"                
            },
            //For Windows code apps, set the kind parameter to "app" 
            "kind": "windows",
            "name": "[parameters('appServicePlanName')]",
            "apiVersion": "2016-09-01",
            "location": "[resourceGroup().location]",
            "properties": {
                "name": "[parameters('appServicePlanName')]",
                "workerSizeId": "0",
                "numberOfWorkers": "1",
                // For Windows code apps, set the hyperv parameter to false
                "hyperv": true,                
                "hostingEnvironment": ""
            }
        }
    ]
}

```

## Use Azure CLI to deploy your template
ARM deployments can be managed through the Azure CLI or Powershell.  In this example, we will be using the Azure CLI.  If you'd rather use Powershell, please see the instructions at this doc.

1.	First, open Powershell and run **az login** to login to your Azure account 
2.	Use the **az account set --subscription** *your-subscription-id* to set your desired subscription for your resources
3.	Then, create your resource group using **az group create --name** *my-resources-group-name* **--location** *"West Central US"*
4.	Once you have created the resource group in the correct location, you can then deploy your ARM template 
5.	Enter **az deployment group create --name** *my-template-name* **--resource-group** *my-resource-group-name* **--template-file** *"path\to\azuredeploy.json"*


You will then be prompted to enter string values for the following parameters:
1.	appServiceWebAppName: *web-app-name*
2.	appServicePlanName: *app-service-plan-name*

These two values will be the names of the two artifacts of the ARM template, which is creating both your Pv3 App Service Plan and your Web App.  

## Verify Deployment
Once you have completed the steps above, you can head over to the portal and search for the resource group you just created to verify the resources deployed from the ARM template.  You have now successfully deployed to the new Premium v3 SKU creating the following resources:

1. Resource Group
2. App Service Plan
3. Web App





