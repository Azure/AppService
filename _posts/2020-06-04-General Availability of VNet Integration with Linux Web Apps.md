---
title: "General availability of VNet Integration with Linux Web Apps"
category: networking
author_name: "Christina Compy"
---

Regional VNet Integration is now Generally Available for both Linux and Windows apps. The feature behaves the same for apps on either operating system. This means that your Linux apps can make calls into Resource Manager VNets in the same region. You can filter outbound calls with [Network Security Groups](https://docs.microsoft.com/archive/blogs/igorpag/azure-network-security-groups-nsg-best-practices-and-lessons-learned) (NSGs). You can route traffic with Route Tables (UDRs). You can also access resources that are secured with [Service Endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview) or [Private Endpoints](https://docs.microsoft.com/azure/private-link/private-endpoint-overview). Regional VNet Integration supports hub-and-spoke configurations and reaching across ExpressRoute.

> [Try the new Regional VNet Integration today!](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet)

The public preview for Regional VNet Integration on Linux had a problem with port conflicts and custom containers. That problem has been solved in the GA release. You no longer need to worry about port conflicts with custom containers. 

If you integrate your app with your VNet, the default behavior remains as it was. You would only be able to reach RFC1918 addresses (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) and service endpoints. Just like with Windows, the feature now supports outbound calls into the VNet on **non**-RFC1918 addresses as well. To reach all addresses you need to set the app setting `WEBSITE_VNET_ROUTE_ALL` to `1`, your app will then enable all of the outbound traffic from your app to be subject to NSGs and UDRs. This is the same behavior as seen with Windows web apps.

These new changes enable you to:

- Access non-RFC1918 endpoints through your VNet
- Secure all outbound traffic leaving your web app
- Force tunnel all outbound traffic to a network appliance of your own choosing

![Regional VNet Integration architecture]({{site.baseurl}}/media/2020/02/vnetint-regionalworks.png)

Regional VNet integration is available in all public regions now for for Windows Webapps and Linux Webapps. To use Regional VNet Integration, your Webapp must be in a Standard, Premium, PremiumV2 or Elastic Premium App Service plan. Regional VNet Integration only applies to outbound calls made by your Webapps, it does not enable private access to your apps. The older, gateway-required VNet Integration is not supported for Linux apps. This does mean that there isn't a solution to integrate your Linux apps directly with VNets in other regions or with Classic VNets

- For more information about regional VNet Integration, see [App Service VNet Integration](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet).
- For more information about App Service networking features in general, see [App Service networking features](https://docs.microsoft.com/azure/app-service/networking-features).
