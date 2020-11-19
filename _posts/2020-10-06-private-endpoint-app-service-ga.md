---
title: "General Availability of Private Endpoint for Web App"
category: networking
author_name: "Eric Grenon"
---

We are happy to announce Private Endpoint for Web App is now Generally Available in all Azure public regions, for both Windows and Linux apps, containerized or not. To use Private Endpoint your app must be hosted on PremiumV2, PremiumV3, or Function Premium plan.

Private Endpoint enables you to consume your app through a specific IP address located in your Azure Virtual Network (VNet), eliminating the exposure of your app to the public Internet.
Private Endpoint provides at the same time a solution to remove the data exfiltration risk. You can secure your VNet with NSG denying any outbound flow and a Private Endpoint will let you go only to the specified app linked to this endpoint.

![Private Link Flow]({{ site.baseurl }}/media/2020/03/privatelink-flow.png)

### Private Endpoint vs Service Endpoints

Service Endpoints are used to secure the app to only being reachable from specific subnets.
Private Endpoint provides a way to expose your app on an IP address in your VNet and removes all other public access. This not only provides security for the app but can also be combined with Network Security Groups (NSG) to secure your network and prevent data leakage.

### Private Endpoint vs App Service Environment

Having your app only accessible on a private address in your VNet is something that was previously only possible by using an ILB App Service Environment or an Application Gateway with an internal inbound address. The difference between using Private Endpoint and an ILB ASE is that with an ILB ASE you have single tenant system that can host many apps behind one IP address in your VNet. With Private Endpoint, your app runs in the public App service and you have only one app behind one IP address. If you want to apply network security external to your application, then you still only get that with an ILB ASE. If you only need a private address in your VNet, then Private Endpoint can give you that.

### Private Endpoint combined with VNet integration

Private Endpoint provides a private IP address for inbound traffic only to your app. It does not enable your app to make outbound calls into your network. If you want to have all inbound and outbound in your VNet, then you need to use both Private Endpoint and Regional VNet Integration in two separate subnets. With Private Endpoint you can secure the inbound and with VNet Integration you can secure the outbound.

To get started, read the documentation [here](https://docs.microsoft.com/azure/app-service/networking/private-endpoint)
