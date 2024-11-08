---
title: "Announcing inbound IPv6 support in public preview"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

Update 2 - November 8, 2024: IPv6 non-vnet outbound support is rolling out soon. We expect public preview to begin in late Q1 2025. Azure portal support to set the `IPMode` property is now available. A screenshot is included below.

Update 1 - August 1, 2024: All but two regions are now supported and we have Azure portal support rolling out soon. We also added a CLI sample for configuration IPv6 support on a deployment slot.

## Introduction

I am happy to announce the first part of our IPv6 implementation in App Service. Public preview of inbound IPv6 support for multi-tenant apps on Premium SKUs, Functions Consumption, Functions Elastic Premium, and Logic Apps Standard. We'll be adding IPv6 support in four stages.

1. This announcement: IPv6 inbound support (multi-tenant)
1. In development: IPv6 non-vnet outbound support (multi-tenant)
1. Backlog: IPv6 vnet outbound support (multi-tenant and App Service Environment v3)
1. Backlog: IPv6 vnet inbound support (App Service Environment v3 - both internal and external)

Limitations in this public preview:

* Only a subset of regions are supported - see the list below.
* Basic and Standard tier currently does not support changing the `IPMode` property.
* Functions Consumption may have multiple IP addresses in the DNS result.
* Functions Consumption and Elastic Premium may not remove the IPv4 address in IPv6 mode.
* The IPv6 address is not visible in the `inboundIpAddress` or `possibleInboundIpAddresses` properties.
* IP-SSL IPv6 bindings are not supported.

For GA we will work on including Basic and Standard tier, adding all regions, include the IPv6 addresses in new properties and stabilize the DNS results to not show extra addresses.

## How does it work

IPv6 inbound requires two things: an IPv6 address that accepts traffic coming in, and a DNS record that returns an IPv6 (AAAA) record. You'll also need a client that can send and receive IPv6 traffic. This means that you may not be able to test it from your local machine since many networks today only support IPv4.

Our stamps (deployment units) will all have IPv6 addresses added. When these are added, you can start sending traffic to both the IPv4 and IPv6 address. To ensure backwards compatibility, the DNS response for the default host name (_app-name_.azurewebsites.net) will return only the IPv4 address. If you want to change that, we have added a site property called `IPMode` that you can configure to `IPv6` or `IPv4AndIPv6`. If you set it to IPv6 only, your client will need to "understand" IPv6 in order to get a response. Setting it to IPv4 and IPv6 will allow you to have existing clients use IPv4, but allow capable clients to use IPv6. If your client does support IPv6, you can test the IPv6 connection using curl:

```bash
curl -6 https://<app-name>.azurewebsites.net
```

If you are using custom domain, you can define your custom DNS records the same way. If you only add an IPv6 (AAAA) record, your clients will need to support IPv6. You can also choose to add both, and finally you can use a CNAME to the default hostname of the site in which case you will use the behavior of `IPMode`.

Do make a note of some of the limitations and especially behavior of Functions plans. We will be working on fixing those issues before General Availability. Do also note that DNS tends to have multiple layers of caching, and sometimes it can take 5-10 minutes for DNS to return the right records.

## Update using CLI

To update an app to return IPv6 DNS records:

```bash
az resource update --name <app-name> --set properties.ipMode="IPv6" -g <resource-group-name> --resource-type "Microsoft.Web/sites"
```

If you are updating a slot, you'll need the resource id of the slot. Here is an example:

```bash
az resource update --ids '/subscriptions/<sub-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/sites/<app-name>/slots/<slot-name>' --set properties.ipMode='IPv6'
```

## Update using Azure portal

To update an app to return IPv6 DNS records, you can use the Azure portal. Go to the app, and under the **Configuration** blade, you'll find the `Inbound IP mode (preview)` property.

![Inbound IP mode portal setting]({{site.baseurl}}/media/2024/11/ipmode.png)

## Create or update using Azure Resource Manager templates

To deploy a new app or update an existing app using ARM, you can just set the IPMode to either IPv6 or IPv4AndIPv6. In this template, you are also creating an App Service plan. If you use the template below, replace the values prefixed with REPLACE. For the `reserved` property, true = Linux, false = Windows.

```javascript
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "appName": "REPLACE-APP-NAME",
        "appIPMode": "IPv6",
        "appServicePlanName": "REPLACE-PLAN-NAME",
        "appServicePlanSize": "P1v3",
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
                "reserved": false
            },
            "sku": {
                "name": "[variables('appServicePlanSize')]",
                "capacity": "[variables('appServicePlanInstanceCount')]"
            }
        },
        {
            "name": "[variables('appName')]",
            "type": "Microsoft.Web/sites",
            "apiVersion": "2021-03-01",
            "location": "[variables('location')]",
            "dependsOn": [
                "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]"
            ],
            "properties": {
              "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]",
              "httpsOnly": true,
              "ipMode": "[variables('appIPMode')]"
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
| Australia Central 2  | :heavy_check_mark:    |
| Australia East       | :heavy_check_mark:                      |
| Australia Southeast  | :heavy_check_mark:    |
| Brazil South         | :heavy_check_mark:    |
| Brazil Southeast     | :heavy_check_mark:    |
| Canada Central       | :heavy_check_mark:    |
| Canada East          | :heavy_check_mark:    |
| Central India        | :heavy_check_mark:    |
| Central US           | :heavy_check_mark:    |
| East Asia            | :heavy_check_mark:                      |
| East US              | :heavy_check_mark:                      |
| East US 2            | :heavy_check_mark:                      |
| France Central       | :heavy_check_mark:                      |
| France South         | :heavy_check_mark:    |
| Germany North        | :heavy_check_mark:    |
| Germany West Central |                       |
| Italy North          | :heavy_check_mark:    |
| Japan East           | :heavy_check_mark:    |
| Japan West           | :heavy_check_mark:    |
| Jio India West       | :heavy_check_mark:                      |
| Korea Central        | :heavy_check_mark:    |
| Korea South          | :heavy_check_mark:    |
| North Central US     | :heavy_check_mark:                      |
| North Europe         | :heavy_check_mark:                      |
| Norway East          | :heavy_check_mark:    |
| Norway West          | :heavy_check_mark:    |
| Poland Central       | :heavy_check_mark:    |
| Qatar Central        | :heavy_check_mark:    |
| South Africa North   | :heavy_check_mark:                      |
| South Africa West    | :heavy_check_mark:    |
| South Central US     | :heavy_check_mark:                      |
| South India          | :heavy_check_mark:                      |
| Southeast Asia       | :heavy_check_mark:                      |
| Sweden Central       | :heavy_check_mark:                      |
| Switzerland North    | :heavy_check_mark:    |
| Switzerland West     | :heavy_check_mark:    |
| UAE Central          | :heavy_check_mark:    |
| UAE North            | :heavy_check_mark:    |
| UK South             |                       |
| UK West              | :heavy_check_mark:    |
| West Central US      | :heavy_check_mark:                      |
| West Europe          | :heavy_check_mark:                      |
| West India           | :heavy_check_mark:                      |
| West US              | :heavy_check_mark:    |
| West US 2            | :heavy_check_mark:                      |
| West US 3            | :heavy_check_mark:                      |
