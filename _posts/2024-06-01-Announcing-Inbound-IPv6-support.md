---
title: "Announcing inbound IPv6 support in public preview"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

I am happy to announce the first part of our IPv6 implementation in App Service. Public preview of inbound IPv6 support for multi-tenant apps on Premium SKUs, Functions Consumption, Functions Elastic Premium, and Logic Apps Standard). We'll be adding IPv6 support in four stages.

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

## How does it work

IPv6 inbound requires two things. An IPv6 address that accepts traffic coming in, and a DNS record that returns an IPv6 (AAAA) record. Finally you'll also need a client that can send and receive IPv6 traffic. This means that you may not be able to test it from your local machine since many networks today only support IPv4.

Our stamps (deployment units) will all have IPv6 addresses added. When these are added, you can start sending traffic to both the IPv4 and IPv6 address. To ensure backwards compatibility, the DNS response for the default host name (_app-name_.azurewebsites.net) will return only the IPv4 address. If you want to change that, we have added a site property called `IPMode` that you can configure to `IPv6` or `IPv4AndIPv6`. If you set it to IPv6 only, your client will need to "understand" IPv6 in order to get a response. Setting it to IPv4 and IPv6 will allow you to have existing clients use IPv4, but allow capable clients to use IPv6. If your client does support IPv6, you can test the IPv6 connection using curl:

```bash
curl -6 https://<app-name>.azurewebsites.net
```

If you are using custom domain, you can define your custom DNS records the same way. If you only add an IPv6 (AAAA) record, your clients will need to support IPv6. You can also choose to add both, and finally you can use a CNAME to the default hostname of the site in which case you will use the behavior of `IPMode`.

Do make a note of some of the limitations and especially behavior of Functions plans. We will be working on fixing those issues before General Availability. Do also note that DNS tends to have multiple layers of caching, and sometimes it can take 5-10 minutes for DNS to return the right records.

## Update using CLI

To update an app to return IPv6 DNS records:

```bash
az resource update --name <app-name> --set ipMode="IPv6" -g <resource-group-name> --resource-type "Microsoft.Web/sites"
```

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
| Australia East       |                       |
| Australia Southeast  | :heavy_check_mark:    |
| Brazil South         | :heavy_check_mark:    |
| Brazil Southeast     | :heavy_check_mark:    |
| Canada Central       | :heavy_check_mark:    |
| Canada East          | :heavy_check_mark:    |
| Central India        | :heavy_check_mark:    |
| Central US           | :heavy_check_mark:    |
| East Asia            |                       |
| East US              |                       |
| East US 2            |                       |
| France Central       |                       |
| France South         | :heavy_check_mark:    |
| Germany North        | :heavy_check_mark:    |
| Germany West Central |                       |
| Italy North          | :heavy_check_mark:    |
| Japan East           | :heavy_check_mark:    |
| Japan West           | :heavy_check_mark:    |
| Jio India West       |                       |
| Korea Central        | :heavy_check_mark:    |
| Korea South          | :heavy_check_mark:    |
| North Central US     |                       |
| North Europe         |                       |
| Norway East          | :heavy_check_mark:    |
| Norway West          | :heavy_check_mark:    |
| Poland Central       | :heavy_check_mark:    |
| Qatar Central        | :heavy_check_mark:    |
| South Africa North   |                       |
| South Africa West    | :heavy_check_mark:    |
| South Central US     |                       |
| South India          |                       |
| Southeast Asia       |                       |
| Sweden Central       |                       |
| Switzerland North    | :heavy_check_mark:    |
| Switzerland West     | :heavy_check_mark:    |
| UAE Central          | :heavy_check_mark:    |
| UAE North            | :heavy_check_mark:    |
| UK South             |                       |
| UK West              | :heavy_check_mark:    |
| West Central US      |                       |
| West Europe          |                       |
| West India           |                       |
| West US              | :heavy_check_mark:    |
| West US 2            |                       |
| West US 3            |                       |