---
title: 'Zero to Hero with App Service, Part 6: Securing your web app'
author_name: "Christina Compy"
tags: 
    - zero to hero
toc: true
toc_sticky: true
---

The Azure App Service is offered as two deployment types: the multi-tenant service and the App Service Environment. In the multi-tenant service there are thousands of customers on the same infrastructure. Your apps are always secured but the network, the address space and some other components are shared.  In an App Service Environment you have a single tenant version of App Service that runs in your Azure Virtual Network.  The next two articles are focused on how to configure network security in the multi-tenant App Service.

In this article, you will learn how to secure your standalone app in the multi-tenant App Service.  In the next article, we will cover how to build a secure multi-tier web application.  

## Networking overview

There are two aspects that need to be secured for a web app, inbound traffic and outbound traffic.  Inbound traffic are visitors going to your web page, or clients sending requests to your API. Outbound traffic is when your web app makes an outbound call to a database, cache, message queue, or other service. The inbound traffic passes through a load balancer to a set of shared front end servers before reaching the workers which your apps run on. The outbound traffic leaves those workers and goes out through one of the outbound load balancers used by the scale unit. In the diagram below, the inbound and outbound load balancers are shown in green.

![App Service architecture]({{ site.baseurl }}/media/2020/08/app-service-architecture.png)

All traffic to and from the components inside App Service is strictly locked down and secured to prevent malicious actions.  This includes preventing any worker-to-worker communication.  This means users just need to secure the networking path to and from their apps--all other traffic is secured for you.

### Features and Services

The following tutorial uses a number of Azure Networking features and services. Here is a quick breakdown of the features used in this article.

* [Web Application Firewall](https://docs.microsoft.com/azure/web-application-firewall/ag/ag-overview):  The Web Application Firewall (or WAF for short) sits between your applications and your end users. It protects your applications against common attacks like cross-site-scripting or SQL injection.
* [Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview): The Azure Virtual Network (VNet) is the building block for creating your network in Azure. A VNet is similar to a physical network that you would have in an on-premises network: you can assign an address space for a VNet and apply subnets to organize the network.
* [Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview): An Application Gateway acts as a load balancer for your application(s) and allows you to route requests based on the requested hostname or URL path. Learn more about [Azure Application Gateway features](https://docs.microsoft.com/azure/application-gateway/features)
* [Service endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview): Some Azure resources are deployed into virtual networks by default. Other resources, such as the multi-tenant App Service, can gain access to the VNet using Service Endpoints. This means you can use Service Endpoints to only allow inbound traffic to your web app from a subnet within a VNet.
* [Private Endpoints](https://docs.microsoft.com/azure/private-link/private-endpoint-overview): Private Endpoints enable exposing the inbound traffic to a service on an address in a selected VNet. 
* [Azure Front Door](https://docs.microsoft.com/azure/frontdoor/front-door-overview): Front Door (AFD) provides many of the same features and benefits of an Application Gateway. It improves application performance by routing users to the nearest Point of Presence (POP).

## Securing your web app

To secure the network access around your web app you will need to secure...

1. [Inbound request traffic to your app](#securing-inbound-traffic)
1. [Inbound publishing traffic to your app](#secure-publishing-inbound-traffic)
1. [Outbound calls made from your app](#secure-outbound-traffic-from-your-web-app)

To secure inbound request traffic to your app, use a WAF enabled Application Gateway with Service Endpoints. To secure inbound publishing traffic to your app, use a build agent with service endpoints on the publishing endpoint. Lastly, to secure outbound traffic from your web app, use VNet Integration and an Azure Firewall.

![App Service architecture]({{ site.baseurl }}/media/2020/08/secure-web-app.png)

### Securing inbound traffic

1. Select or create an Azure Virtual Network (VNet).  To secure your inbound traffic to your app you will need to have a VNet. If you have one already, you do not need to create another.  It should be in the same region as your web app.  If you do not have a VNet, you can create one following these instructions [Creating an Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal).
2. Create an Application Gateway as described here in [Creating an Application Gateway](https://docs.microsoft.com/azure/application-gateway/quick-create-portal).
3. Enable [Service Endpoints](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions#service-endpoints) to your web app.
4. Once you have the VNet, App Gateway, and Service Endpoints set up, you need to add a custom domain name for your app that should point to your Application Gateway.  Your web app needs to be configured with the new domain name.  To add a custom domain name to your web app, follow the guidance here.

The end result is that your web app will have all inbound traffic routed through your Application Gateway to your app.  You can, and should, enable Web Application Firewall (WAF) support on your Application Gateway.

#### Alternate Configuration

There are two alternative services that are in preview that should be noted.  One is using [Private Endpoints](https://docs.microsoft.com/azure/app-service/networking/private-endpoint) rather than Service Endpoints and the other is using Azure Front Door instead of an Application Gateway.  

If you use Private Endpoints instead of Service Endpoints, you would create your Private Endpoint in a subnet other than the GatewaySubnet. This Private Endpoint would be configured against your app. This is a great solution as it also hosts the HTTPS publishing endpoint for your app. When you add Private Endpoints to your app, the app is no longer accessible from the internet.  Traffic to your app must only go through the private endpoints on your app.  

If you use [Azure Front Door](https://docs.microsoft.com/azure/frontdoor/front-door-overview) (AFD) with your app, you would need to set an IP address [access restriction](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions) to secure your app to only being accessible through AFD. There are some additional changes that will soon be available that will enable you to lock you app down to specific AFD profiles. If you use AFD, you can enable a mix of capabilities such as WAF protection just like with an Application Gateway. 

### Secure publishing inbound traffic 

Publishing is the process by which you upload your web app content to your app service instance. Unless you are using FTP, all publishing actions are performed against the scm site for your app. For every app there exists the app url and there also exists the publishing url. The publishing url is *&lt;app name&gt;.scm.azurewebsites.net*. Secure publishing is not too different from secure app access. For secure publishing you need to publish from inside your VNet.  To have a secure publishing story you need to follow one of the following patterns:
* Use Access Restrictions to secure traffic to the publishing endpoint for your app
* Use service endpoints to secure traffic from a jump box being used to publish
* Use a relay agent, such as the Azure Pipeline build agent deployed on a VM in your VNet and then use service endpoints to secure your scm site to the subnet that the build agent is in.

To use the Azure Pipeline relays agent:

1. Create a VM in your VNet. 
2. Install and configure the [Azure pipeline agent](https://docs.microsoft.com/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment)
3. Configure service endpoints for your app scm site against the subnet that your VM is in.

### Secure outbound traffic from your web app

To secure outbound traffic from your web app you need to use the regional VNet Integration feature.  This feature enables you to make calls into your VNet and have all outbound traffic subject to Network Security Groups (NSGs) and Route Tables (UDRs). With NSGs you can restrict outbound traffic to address blocks of your choosing.  With UDRs you can route traffic as you see fit.  If you route the outbound traffic to an Azure Firewall device, you can restrict your outbound internet traffic to only the FQDN's you want it to reach.  

To secure your outbound traffic from your web app, enable [VNet Integration](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet). By default, your app outbound traffic will only be affected by NSGs and UDRs if you are going to a private address (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16). To ensure that all of your outbound traffic is affected by the NSGs and UDRs on your integration subnet, set the application setting WEBSITE_VNET_ROUTE_ALL to 1.  

### Summary

Congratulations! In this article you learned how to secure your inbound and outbound networking traffic. You are now able to assemble App Service and Networking features to create a secure internet facing web application.  

## Helpful Resources

* [App Service networking features](https://docs.microsoft.com/azure/app-service/networking-features)
* [App Service access restrictions](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions)
* [App Service VNet Integration](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet)
* [App Service Private endpoints](https://docs.microsoft.com/azure/app-service/networking/private-endpoint)
* [App Service Hybrid Connections](https://docs.microsoft.com/azure/app-service/app-service-hybrid-connections)
  
