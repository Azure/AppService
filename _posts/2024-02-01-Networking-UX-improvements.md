---
title: "Improvements to configuring networking in Azure portal"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

We have gradually been making improvements to the Azure portal experience for managing network configuration in App Service. In this blog post I'll go through some highlights that you may or may not have noticed.

## Overview page

On the overview page that you land on when opening an App Service app in the Azure portal, we have added some essential Networking info and provided "deep links". You can click the Networking header to go to the Networking hub and you can see you virtual network integration status and go directly to the configuration. You'll also see the IP configuration of your app.

![Azure portal app overview]({{site.baseurl}}/media/2024/02/app-overview.png)

## Networking hub

The networking hub or networking landing page is where you can get an overview of your network configuration. We gave this page an overhaul to align it with similar pages and include the essential information.

![Azure portal networking hub]({{site.baseurl}}/media/2024/02/networking-hub.png)

These improvements are worth mentioning:

* Public network access/Access restrictions. It will show you the current setting and if you have restrictions configured. We also added visibility of the special configuration of `null` where it uses implicit/default behavior.
* Private endpoint IP shows up in inbound addresses.
* Status of NAT gateway, NSG and UDR configured on integration subnet and links for fast inspection/configuration.

## Domain names

Domain names are now visible in the overview page and you will see both default and custom domain name. We also added a link for easy configuration of custom domain.

![Azure portal domain names]({{site.baseurl}}/media/2024/02/domains.png)

## Virtual network integration

App Service has two types of [virtual network integration](https://learn.microsoft.com/azure/app-service/overview-vnet-integration); Regional and Gateway-based. Gateway-based is only available on Windows and account only for about 2% of our network integrations, so we decided to create a brand new page focusing only on regional integration. It is much faster and we can include all the relevant information that does not apply to gateway-based integrations. Don't worry, you can still access the gateway-based integration page from the link at the top.

![Azure portal virtual network integration]({{site.baseurl}}/media/2024/02/virtual-network-integration.png)

Key improvements to this page:

* Information about subnet IP availability.
* Configure connections to more than one subnet per App Service plan.
* Manage configuration routing.
* Direct configuration of NAT gateway.

## Public network access/Access restrictions

The [access restriction](https://learn.microsoft.com/azure/app-service/overview-access-restrictions) page is also brand new. Public network access (app access) is now front and center and is aligned with the experience from other Azure services. When you allow public network access, the configuration of access restriction rules (site access) is also improved with filtering options, and we included an option to configure the unmatched rule behavior to for example easily lock down the advanced tools site.

![Azure portal access restrictions]({{site.baseurl}}/media/2024/02/access-restrictions.png)

## DNS configuration

We are almost ready with our [DNS](https://learn.microsoft.com/azure/app-service/overview-name-resolution) configuration page. We are making the final changes and you should start seeing this in Azure portal by the end of Q1 2024. I'll give you a sneak peek here of what to expect.

From the networking hub, you will quickly see if you have custom servers or settings configured.

![Azure portal DNS overview]({{site.baseurl}}/media/2024/02/dns-overview.png)

When you open the new DNS configuration page, you can configure custom DNS servers and override the default name resolution behavior.

![Azure portal DNS configuration]({{site.baseurl}}/media/2024/02/dns-configuration.png)

## Roadmap

We hope all of these improvements makes your work with networking in App Service easier. We are always looking for ways to improve and some of the next focus areas are more networking information at the App Service plan level and an overhaul of the Hybrid connections page. Feel free to give feedback through comments here or through the docs/portal feedback channels.
