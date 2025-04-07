---
title: "Announcing outbound IPv6 support in public preview"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

## Introduction

We are now ready to invite you to the public preview of IPv6 outbound support in App Service in selected regions. Public preview of outbound IPv6 support for multi-tenant apps is supported on all App Service plan SKUs, Functions Consumption, Functions Elastic Premium, and Logic Apps Standard.

1. Previous announcement: [IPv6 inbound support (multi-tenant)](https://azure.github.io/AppService/2024/11/08/Announcing-Inbound-IPv6-support)
1. This announcement: IPv6 (dual-stack) non-vnet outbound support (multi-tenant)
1. Backlog: IPv6 vnet outbound support (multi-tenant and App Service Environment v3)
1. Backlog: IPv6 vnet inbound support (App Service Environment v3 - both internal and external)

Limitations in this public preview:

* Only a subset of regions are supported - see the list below.

For GA we will work on adding all regions.

## How does it work

IPv6 outbound (dual-stack) allows you to resolve endpoints to IPv6 addresses and call the IPv6 endpoint. There are no changes required in your code to start using IPv6 compatible endpoints.

The first iteration of the implementation does not support virtual network traffic. If your app is integrated with a virtual network and you have application traffic routing aka "Route All" enabled, you will not be able to resolve or reach IPv6 endpoint. If you are using virtual network integration and disable application traffic routing you can resolve and reach public IPv6 endpoints directly. Be cautious with changing the routing though as all your public traffic will not be routed through the virtual network.

## Testing and suppressions

To test the IPv6 connectivity you can use the console. You'll also need an IPv6 capable endpoint. In this case I took advantage of the inbound IPv6 preview and created a web app (named `ipv6`) with inbound IP mode set to IPv6 and then called these commands (`-6` is optional, but can be used if the endpoint supports both IPv4 and IPv6):

```bash
nslookup ipv6.azurewebsites.net

curl -6 https://ipv6.azurewebsites.net
```

> ![]({{site.baseurl}}/media/2024/09/ipv6-outbound-test.png)

Windows and Linux have different default behaviors when dealing with IPv6. Windows will default to IPv4 if the DNS lookup returns both addresses. Linux, however, defaults to IPv6 and sites that were previously working fine might experience issues when IPv6 is enabled outbound. If the DNS of your endpoint resolves to and IPv6 address that does not work, you app will also experience this behavior.

If you have apps on Linux where you have endpoints with bad IPv6 configurations, we have added the option to remove IPv6 DNS results for specific FQDNs. You can add an app setting called `WEBSITE_DNS_SUPPRESS_IPV6_RESULT_FQDNS`. You can add individual FQDNs comma separated or you can simply add `all` in the value to remove all IPv6 results.

## Supported regions

This is the current list of supported regions in preview. Within each of the supported regions, there may be a few deployment units that have not yet had IPv6 outbound configuration added. You can verify if your app is on an IPv6 outbound configuration added by running this command. If it returns more than 2 addresses, IPv6 is enabled.

```bash
az rest --method GET --uri /subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.Web/sites/<app-name>?api-version=2024-04-01 --query properties.outboundIpv6Addresses
```

| Region               | IPv6 inbound          |  IPv6 outbound (Windows) | IPv6 outbound (Linux) |
| :------------------: | :-------------------: | :----------------------: | :-------------------: |
| Australia Central    | :heavy_check_mark:    |                          |                       |
| Australia Central 2  | :heavy_check_mark:    |                          |                       |
| Australia East       | :heavy_check_mark:    |                          |                       |
| Australia Southeast  | :heavy_check_mark:    |                          |                       |
| Brazil South         | :heavy_check_mark:    |                          |                       |
| Brazil Southeast     | :heavy_check_mark:    |                          |                       |
| Canada Central       | :heavy_check_mark:    |                          |                       |
| Canada East          | :heavy_check_mark:    |                          |                       |
| Central India        | :heavy_check_mark:    |                          |                       |
| Central US           | :heavy_check_mark:    |                          |                       |
| East Asia            | :heavy_check_mark:    | :heavy_check_mark:       |                       |
| East US              | :heavy_check_mark:    | :heavy_check_mark:       |                       |
| East US 2            | :heavy_check_mark:    |                          |                       |
| France Central       | :heavy_check_mark:    |                          |                       |
| France South         | :heavy_check_mark:    |                          |                       |
| Germany North        | :heavy_check_mark:    |                          |                       |
| Germany West Central |                       |                          |                       |
| Israel Central       | :heavy_check_mark:    |                          |                       |
| Italy North          | :heavy_check_mark:    |                          |                       |
| Japan East           | :heavy_check_mark:    |                          |                       |
| Japan West           | :heavy_check_mark:    |                          |                       |
| Jio India West       | :heavy_check_mark:    |                          |                       |
| Korea Central        | :heavy_check_mark:    |                          |                       |
| Korea South          | :heavy_check_mark:    |                          |                       |
| Mexico Central       | :heavy_check_mark:    |                          |                       |
| North Central US     | :heavy_check_mark:    | :heavy_check_mark:       |                       |
| North Europe         | :heavy_check_mark:    | :heavy_check_mark:       |                       |
| Norway East          | :heavy_check_mark:    |                          |                       |
| Norway West          | :heavy_check_mark:    |                          |                       |
| Poland Central       | :heavy_check_mark:    |                          |                       |
| Qatar Central        | :heavy_check_mark:    |                          |                       |
| South Africa North   | :heavy_check_mark:    |                          |                       |
| South Africa West    | :heavy_check_mark:    |                          |                       |
| South Central US     | :heavy_check_mark:    |                          |                       |
| South India          | :heavy_check_mark:    |                          |                       |
| Southeast Asia       | :heavy_check_mark:    |                          |                       |
| Sweden Central       | :heavy_check_mark:    |                          |                       |
| Sweden South         | :heavy_check_mark:    |                          |                       |
| Switzerland North    | :heavy_check_mark:    |                          |                       |
| Switzerland West     | :heavy_check_mark:    |                          |                       |
| UAE Central          | :heavy_check_mark:    |                          |                       |
| UAE North            | :heavy_check_mark:    |                          |                       |
| UK South             |                       |                          |                       |
| UK West              | :heavy_check_mark:    |                          |                       |
| West Central US      | :heavy_check_mark:    | :heavy_check_mark:       |                       |
| West Europe          | :heavy_check_mark:    |                          |                       |
| West India           | :heavy_check_mark:    |                          |                       |
| West US              | :heavy_check_mark:    |                          |                       |
| West US 2            | :heavy_check_mark:    | :heavy_check_mark:       |                       |
| West US 3            | :heavy_check_mark:    |                          |                       |
