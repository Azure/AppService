---
title: "Improvements to configuring networking in Azure portal"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

We have gradually been making improvements to the Azure portal experience for managing network configuration in App Service. In this blogpost I'll go through some highlights that you may or may not have noticed.

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

## Access restrictions

## DNS configuration

## Roadmap

App Service plan

Hybrid connections
