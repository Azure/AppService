---
title: "Deploy your resources on the new Premium v3 SKU with an ARM template"
author_name: "Jeff Martinez"
toc: true
toc_sticky: true
tags:
    - windows containers
---


The Premium v3 hardware tier, previously [announced at Microsoft Ignite 2020](https://aka.ms/appservice2020), is now available for you to deploy your applications to.  This new hardware tier introduces new CPU and memory options, enabling deployment of more apps per App Service Plan and better support for large enterprise applications and content management systems.  With additional price points for dev/test and production workloads and Reserved Instance Pricing starting November 1st*,  Premium v3 is our most cost-effective and performant offering ever.

Portal updates are rolling out now to enable the new hardware option, but you can still deploy resources via ARM templates, Azure CLI and PowerShell.  This tutorial walks you through creating a new Resource Group, Pv3 App Service Plan and a Windows Container Web App using an Azure Resource Manager (ARM) template.

> Premium v3 is the only hardware option that will be available for Windows container apps as it supports Hyper-V, the chosen security mode for a multi-tenant architecture.

Premium v3 is an option in the regions below. Premium v3 will be available in more regions in the future. 

- West US 2
- South Central US
- UK South
- Southeast Asia
- West Europe
- East US
- East US 2
- Australia East
- North Europe

## Create your JSON template

For those not familiar with ARM Templates, they amount to a JSON file which will define the necessary parameters and resources.  The following template creates a Premium v3 App Service Plan and Windows container Web App.  

1.	Open a New File in Visual Studio Code or your IDE of choice
2.	Create a JSON file named *azuredeploy.json*
3.	Copy the below template in its entirety and replace any existing brackets in your new file

    ```json
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

ARM deployments can be managed through the Azure CLI or Powershell.  In this example, we will be using the Azure CLI.  If you'd rather use Powershell, please see the instructions [here](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-tutorial-create-first-template?tabs=azure-powershell).

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

## References
[Configure Pv3 tier for Azure App Service](https://docs.microsoft.com/azure/app-service/app-service-configure-premium-tier)

* Reserved Instances are offered in 1 and 3 year options.


