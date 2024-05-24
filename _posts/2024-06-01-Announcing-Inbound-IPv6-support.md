---
title: "Announcing inbound IPv6 support in public preview"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

## Introduction

I am happy to announce the first part of our IPv6 implementation in App Service. Public preview of inbound IPv6 support for multi-tenant (Premium SKUs. Functions Consumption and Elastic Premium. Logic Apps Standard). We'll be adding IPv6 support in four stages.

1. IPv6 inbound support (multi-tenant)
1. IPv6 non-vnet outbound support (multi-tenant)
1. IPv6 vnet outbound support (multi-tenant and App Service Environment v3)
1. IPv6 vnet inbound support (App Service Environment v3 - both internal and external)

Limitations in public preview:

* Only a subset of regions are supported - see the list below.
* Basic and Standard tier is not supported.
* Functions Consumption may temporarily have extra IP addresses.
* Functions Consumption and Elastic Premium may not remove the IPv4 address in IPv6 mode.
* IP-SSL bindings are not supported.



## Create or update using CLI

If you have an existing App Service Environment v3 (Isolated V2) plan, you can also use this command to scale to the new SKUs without updating the CLI:

```bash
az resource update --name <app-name> --set ipMode="IPv6" -g <resource-group-name> --resource-type "Microsoft.Web/sites"
```

## Create or update using Azure Resource Manager templates

To deploy a new app or update an existing app using ARM, you can just set the IPMode to either IPv6 or IPv4AndIPv6. use the new SKU names. If you use the template below, replace the values prefixed with REPLACE. For the `reserved` property, true = Linux, false = Windows.

```javascript
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "appName": "REPLACE-APP-NAME",
        "appServicePlanName": "REPLACE-PLAN-NAME",
        "appServicePlanSize": "I2mv2",
        "appServicePlanInstanceCount": 1,
        "location": "[resourceGroup().location]"
    },
    "resources": [
        {
            "name": "[variables('appServicePlanName')]",
            "type": "Microsoft.Web/serverfarms",
            "apiVersion": "2021-03-01",
            "location": "[variables('location')]",
            "properties": {
                "reserved": false,
            },
            "sku": {
                "name": "[variables('appServicePlanSize')]",
                "capacity": "[variables('appServicePlanInstanceCount')]"
            }
        }
     ]
}
```

## Supported regions

This is the current list of supported regions in preview.

| Region               | IPv6 supported        |
| -------------------- | :-------------------: |
| Australia Central    | :heavy_check_mark:    |
| Australia Central 2  |                            |
| Australia East       | ✅                           |
| Australia Southeast  |                            |
| Brazil South         |                            |
| Brazil Southeast     |                            |
| Canada Central       | ✅                           |
| Canada East          |                            |
| Central India        |                            |
| Central US           |                            |
| East Asia            |                            |
| East US              |                        |
| East US 2            | ✅                           |
| France Central       |                            |
| France South         |                            |
| Germany North        | ✅                           |
| Germany West Central |                            |
| Italy North          |                            |
| Japan East           | ✅                           |
| Japan West           |                            |
| Jio India West       |                              |
| Korea Central        |                            |
| Korea South          | ✅                           |
| North Central US     |                            |
| North Europe         |                            |
| Norway East          | ✅                           |
| Norway West          |                            |
| Poland Central       |                            |
| Qatar Central        |                            |
| South Africa North   | ✅                           |
| South Africa West    |                            |
| South Central US     | ✅                          |
| South India          |                            |
| Southeast Asia       | ✅                           |
| Sweden Central       | ✅                           |
| Switzerland North    | ✅                           |
| Switzerland West     |                            |
| UAE Central          |                            |
| UAE North            |                            |
| UK South             |                            |
| UK West              | ✅                           |
| West Central US      |                            |
| West Europe          |                            |
| West India           |                           |
| West US              | ✅                           |
| West US 2            |                            |
| West US 3            |                            |

Looking forward to see what you will do with all that power!

### Questions/Feedback

If you have any questions or feedback, please reach out to our team at [AppServiceEnvPM@microsoft.com](mailto:appserviceenvpm@microsoft.com)
