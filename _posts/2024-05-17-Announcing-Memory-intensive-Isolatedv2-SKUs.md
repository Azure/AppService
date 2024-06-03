---
title: "Announcing Memory intensive SKUs for App Service Environment v3"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

## Update 2

We have now resolved the issue with outbound connections and have further progressed with the runtime of many regions so they can be marked with GA runtime.

## Update 1

Public preview is where we give our customers the chance to validate new features and it is also where we uncover edge cases that would not have been found in our initial testing. We found an issue that impacts outbound connections when scaling to a memory optimized SKU. While it would not be all customers that would be affected, we are not taking any chances since this could break your app. We'll keep a few regions open that are not affected while we are getting a fix out to the remaining regions. We should be able to open the other regions again early June.

## Introduction

You may have seen memory intensive SKUs added to our Premium V3 offering. We have been working on bringing this SKU type to App Service Environment v3 as well and I am happy to announce that the wait is over and memory intensive SKUs are now in public preview. The rollout will be in waves of regions and App Service plan types. We start with Windows in a selected set of regions. Over the coming months we will add support for Linux and Windows Containers as well, and add more regions to the list. To help you onboard this faster, we will also gradually mark runtime in regions as GA allowing you to run production workloads.

With the addition of these new Memory Intensive Isolated V2 SKUs, these are the SKUs available for App Service Environment v3.

|  **SKU Name** | **vCPUs** | **Memory** |
|---|---|---|
| I1v2 | 2 vCPUs | 8 GB |
| **I1mv2** | 2 vCPUs | 16 GB |
| I2v2 | 4 vCPUs | 16 GB |
| **I2mv2** | 4 vCPUs | 32 GB |
| I3v2 | 8 vCPUs | 32 GB |
| **I3mv2** | 8 vCPUs | 64 GB |
| I4v2 | 16 vCPUs | 64 GB |
| **I4mv2** | 16 vCPUs | 128 GB |
| I5v2 | 32 vCPUs | 128 GB |
| **I5mv2** | 32 vCPUs | 256 GB |
| I6v2 | 64 vCPUs | 256 GB |

Currently we recommend you to start using the new SKUs in your pre-production environments. You'll need to use CLI or ARM to create and scale App Service plans, but you can use portal to create apps based on the memory intensive plans. The first regions will start to support production workloads shortly after //BUILD and portal support for handling App Service plans will be added in June.

This blog will be regularly updated as we expand to more regions and OS types and complete portal support.

## Create or update using CLI

Download the latest Azure CLI (2.61.0) to have support for the new SKUs using `az appservice create/update`. Note that the command will take about 35 minutes for Windows and 15 minutes for Linux to complete the create/update operation (use the `--no-wait` parameter to avoid having to wait for the command to finish in the console):

```bash
az appservice plan create/update --name <plan name> --sku I2MV2 -g <resource-group-name> -e <ase-name or resource-id> --no-wait
```

If you have an existing App Service Environment v3 (Isolated V2) plan, you can also use this command to scale to the new SKUs without updating the CLI:

```bash
az resource update --name <app-service-plan-name> --set sku.name="I3MV2" -g <resource-group-name> --resource-type "Microsoft.Web/serverFarms"
```

## Create or update using Azure Resource Manager templates

To deploy a new plan or update an existing plan using ARM, you can just use the new SKU names. If you use the template below, replace the values prefixed with REPLACE. For the `reserved` property, true = Linux, false = Windows.

```javascript
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "appServicePlanName": "REPLACE-PLAN-NAME",
        "appServicePlanSize": "I2mv2",
        "appServicePlanInstanceCount": 1,
        "location": "[resourceGroup().location]",
        "appServiceEnvironmentResourceId": "/subscriptions/REPLACE-SUB-ID/resourceGroups/REPLACE-RG-NAME/providers/Microsoft.Web/hostingEnvironments/REPLACE-ASE-NAME"
    },
    "resources": [
        {
            "name": "[variables('appServicePlanName')]",
            "type": "Microsoft.Web/serverfarms",
            "apiVersion": "2021-03-01",
            "location": "[variables('location')]",
            "properties": {
                "reserved": false,
                "hostingEnvironmentProfile" :{
                    "id": "[variables('appServiceEnvironmentResourceId')]"
                }
            },
            "sku": {
                "name": "[variables('appServicePlanSize')]",
                "capacity": "[variables('appServicePlanInstanceCount')]"
            }
        }
     ]
}
```

## Regions and OS support

This is the current list of supported regions. Regions marked with * has runtime in preview and should only be used for dev/test environments. More regions and Linux/Windows Container support will be added in the coming months.

| Region               | Windows                    | Linux                       | Windows Container          |
| -------------------- | :------------------------: | :-------------------------: | :------------------------: |
| Australia Central    |                            |                             |                            |
| Australia Central 2  | :heavy_check_mark:         |                             |                            |
| Australia East       | :heavy_check_mark: *       |                             |                            |
| Australia Southeast  | :heavy_check_mark:         |                             |                            |
| Brazil South         |                            |                             |                            |
| Brazil Southeast     |                            |                             |                            |
| Canada Central       | :heavy_check_mark: *       |                             |                            |
| Canada East          | :heavy_check_mark:         |                             |                            |
| Central India        | :heavy_check_mark:         |                             |                            |
| Central US           |                            |                             |                            |
| East Asia            | :heavy_check_mark:         |                             |                            |
| East US              |          |                             |                            |
| East US 2            | :heavy_check_mark: *       |                             |                            |
| France Central       |                            |                             |                            |
| France South         |                            |                             |                            |
| Germany North        | :heavy_check_mark: *       |                             |                            |
| Germany West Central | :heavy_check_mark:         |                             |                            |
| Italy North          |                            |                             |                            |
| Japan East           | :heavy_check_mark: *       |                             |                            |
| Japan West           | :heavy_check_mark:         |                             |                            |
| Jio India West       |                            |                             |                            |
| Korea Central        |                            |                             |                            |
| Korea South          | :heavy_check_mark: *       |                             |                            |
| North Central US     | :heavy_check_mark:         |                             |                            |
| North Europe         | :heavy_check_mark:         |                             |                            |
| Norway East          | :heavy_check_mark: *       |                             |                            |
| Norway West          |                            |                             |                            |
| Poland Central       |                            |                             |                            |
| Qatar Central        |                            |                             |                            |
| South Africa North   | :heavy_check_mark: *       |                             |                            |
| South Africa West    |                            |                             |                            |
| South Central US     | :heavy_check_mark: *       |                             |                            |
| South India          |                            |                             |                            |
| Southeast Asia       | :heavy_check_mark: *       |                             |                            |
| Sweden Central       | :heavy_check_mark: *       |                             |                            |
| Switzerland North    | :heavy_check_mark: *       |                             |                            |
| Switzerland West     |                            |                             |                            |
| UAE Central          |                            |                             |                            |
| UAE North            | :heavy_check_mark:         |                             |                            |
| UK South             | :heavy_check_mark:         |                             |                            |
| UK West              | :heavy_check_mark: *       |                             |                            |
| West Central US      |                            |                             |                            |
| West Europe          |                            |                             |                            |
| West India           |                            |                             |                            |
| West US              | :heavy_check_mark: *       |                             |                            |
| West US 2            | :heavy_check_mark:         |                             |                            |
| West US 3            |                            |                             |                            |

Looking forward to see what you will do with all that power!

### Questions/Feedback

If you have any questions or feedback, please reach out to our team at [AppServiceEnvPM@microsoft.com](mailto:appserviceenvpm@microsoft.com)
