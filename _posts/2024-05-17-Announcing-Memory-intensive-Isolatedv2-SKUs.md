---
title: "Announcing Memory intensive SKUs for App Service Environment v3"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

You may have seen memory intensive SKUs added to our Premium V3 offering. We have been working on bringing this SKU type to App Service Environment v3 as well and I am happy to announce that the wait is over. The rollout will be in waves of regions and App Service plan types. We start with Windows in a selected set of regions. Over the coming months we will add support for Linux and Windows Containers as well, and add more regions to the list.

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
| **I5mv2** | 32 vCPUs | 1256 GB |
| I6v2 | 64 vCPUs | 256 GB |

At launch, you'll need to use CLI or ARM to create and scale App Service plans. Portal support will be added early June.

## Create or update using CLI

Download the latest Azure CLI to have support for the new SKUs using `az appservice create/update`. Note that the command will take about 40 minutes for Windows and 15 minutes for Linux to complete the create/update operation (use the `--no-wait` parameter to avoid having to wait for the command to finish in the console):

```bash
az appservice plan create/update --name <plan name> --sku I5v2 -g <resource-group-name> -e <ase-name or resource-id> --no-wait
```

## Create or update using Azure Resource Manager templates

To deploy a new plan or update an existing plan using ARM, you can simply just specify the new SKU names. If you use the template below, just replace the values prefixed with REPLACE. For the `reserved` property, true = Linux, false = Windows.

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



| Region               | Windows                      | Linux                       | Windows Container         |
| -------------------- | :--------------------------: | :-------------------------: | :-------------------------: |
| Australia Central    |                            |                             |                            |
| Australia Central 2  |                            |                             |                            |
| Australia East       |                            |                           |                            |
| Australia Southeast  |                            |                             |                            |
| Brazil South         |                            |                           |                            |
| Brazil Southeast     |                            |                             |                            |
| Canada Central       |                            |                           |                            |
| Canada East          |                            |                             |                            |
| Central India        |                            |                           |                            |
| Central US           |                            |                           |                            |
| East Asia            | ✅                           |                           |                            |
| East US              | ✅                           |                           |                            |
| East US 2            |                            |                           |                            |
| France Central       |                            |                           |                            |
| France South         |                            |                             |                            |
| Germany North        |                            |                             |                            |
| Germany West Central |                            |                           |                            |
| Italy North          |                            |                           |                              |
| Japan East           |                            |                           |                            |
| Japan West           |                            |                             |                            |
| Jio India West       |                              |                             |                            |
| Korea Central        |                            |                           |                            |
| Korea South          |                            |                             |                            |
| North Central US     | ✅                           |                             |                            |
| North Europe         | ✅                           |                           |                            |
| Norway East          |                            |                           |                            |
| Norway West          |                            |                             |                            |
| Poland Central       |                            |                           |                               |
| Qatar Central        |                            |                           |                              |
| South Africa North   |                            |                           |                            |
| South Africa West    |                            |                             |                            |
| South Central US     |                           |                           |                            |
| South India          |                            |                             |                            |
| Southeast Asia       |                            |                           |                            |
| Sweden Central       |                            |                           |                              |
| Switzerland North    |                            |                           |                            |
| Switzerland West     |                            |                             |                            |
| UAE Central          |                            |                             |                            |
| UAE North            |                            |                          |                            |
| UK South             |                            |                           |                            |
| UK West              |                            |                             |                            |
| West Central US      |                            |                             |                            |
| West Europe          |                            |                           |                            |
| West India           |                           |                             |                            |
| West US              |                            |                             |                            |
| West US 2            | ✅                           |                           |                            |
| West US 3            |                            |                           |                            |

Looking forward to see what you will do with all that power!

### Questions/Feedback

If you have any questions or feedback, please reach out to our team at [AppServiceEnvPM@microsoft.com](mailto:appserviceenvpm@microsoft.com)
