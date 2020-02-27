---
title: "Announcing general availability of VNet Integration with Windows Web Apps"
tags: 
    - Networking
author_name: "Christina Compy"
---

App Service customers often need to access resources in their Azure Virtual Networks. We launched VNet Integration to address this issue in 2014, but our customers wanted to use networking features like [Network Security Groups](https://docs.microsoft.com/archive/blogs/igorpag/azure-network-security-groups-nsg-best-practices-and-lessons-learned) (NSGs), Route Tables (UDRs) and [Service Endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview). Today we are announcing Regional VNet Integration to solve these problems and improve usability.

> [Try the new Regional VNet Integration today!](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet).

Regional VNet Integration has been in preview for some time, but only supported calls to RFC1918 addresses (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) and service endpoints. The feature now supports outbound calls into the VNet on **non**-RFC1918 addresses as well. You can now use features like Network NSGs and UDRs against all of the outbound traffic from your web app. Regional VNet Integration will only work with VNets in the same Azure region as the Webapp.

By default, if you use regional VNet Integration, your app will still only route RFC1918 traffic into your VNet. By setting the app setting `WEBSITE_VNET_ROUTE_ALL` to `1`, your app will then enable all of the outbound traffic from your app to be subject to NSGs and UDRs.

These new changes enable you to:

- Access non-RFC1918 endpoints through your VNet
- Secure all outbound traffic leaving your web app
- Force tunnel all outbound traffic to a network appliance of your own choosing

![Regional VNet Integration architecture]({{site.baseurl}}/media/2020/02/vnetint-regionalworks.png)

Regional VNet integration is available in all public regions for Windows Webapps. Regional VNet Integration for Linux Webapps is currently in public preview. To use Regional VNet Integration, your Webapp must be in a Standard, Premium, PremiumV2 or Elastic Premium App Service plan. Regional VNet Integration only applies to outbound calls made by your Webapps, it does not enable private access to your apps. The older, gateway-required VNet Integration will continue to be supported. It integrates with VNets in other regions and Classic VNets.

For more information about regional VNet Integration, see [App Service VNet Integration](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet).

For more information about App Service networking features in general, see [App Service networking features](https://docs.microsoft.com/azure/app-service/networking-features).
