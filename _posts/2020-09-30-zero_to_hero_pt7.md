---
title: 'Zero to Hero with App Service, Part 7: Multi-tier web applications'
author_name: "Christina Compy"
date: "2020-09-30"
tags: 
    - zero to hero
toc: true
toc_sticky: true
---

# Multi-tier web applications

The Azure App Service is offered as two deployment types: the multi-tenant service and the App Service Environment. In the multi-tenant service there are thousands of customers on the same infrastructure. Your apps are always secured but the network, the address space and some other components are shared.  In an App Service Environment you have a single tenant version of App Service that runs in your Azure Virtual Network. In this article, you will learn how to build network secured multi-tier web applications in the multi-tenant App Service.  

## Multi-tier web applications

The obvious question to start with is, what is a multi-tier web application?  A multi-tier web application is an application with a web application front end that makes calls to one or more API applications behind it. By itself this is not a complex concept but when a user wants to secure the API applications so they are not internet accessible, the problem becomes more complex. 

There are multiple ways to secure your API applications so that they can only be reached from your front end applications. They all involve securing your API application inbound traffic. 

An API application uses one of the inbound networking features to secure inbound traffic to the front end app. There are multiple features that could be used for this purpose including:

- [Service endpoints](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions#service-endpoints) -  With service endpoints you secure the listening service. With Service Endpoints, the source address must be in an Azure Virtual Network subnet 
- [Private endpoints](https://docs.microsoft.com/azure/app-service/networking/private-endpoint) - Private endpoints you prevent data exfiltration and secure the listening service. With private endpoints, you can reach the web app from anywhere that has network access to the private endpoint address
- [Access restrictions](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions#service-endpoints) -  With access restrictions you can lock down your inbound traffic to a set of address blocks. 

Each of those features satisfies a specific situation and there are trade offs.  Access restrictions are useful if you have public address access points like NAT devices or perhaps a virtual network device with a dedicated public address.  If you use service endpoints, you do not add any new resources to your subscription and are able to use one subnet.  If you use private endpoints, you will add a new top level resource, add Azure DNS private zones to your VNet and will require two subnets.  

### Service endpoints

To configure a multi-tier application using service endpoints to secure your API application, you need to use VNet Integration with your front end app and service endpoints with your API app. You set service endpoints on the integration subnet used by your Front End application. This solution is fast to set up and easy as well.   


![simple service endpoints]({{ site.baseurl }}/media/2020/09/one-fe-one-service-endpoint.png)


If you have multiple front end apps, the configuration is the same if all of the front end apps are in the same App Service plan.  With VNet Integration, the apps in the same App Service plan can use the same integration subnet.   If you have additional front end applications in separate App Service plans, you will need to use multiple integration subnets. In this situation, service endpoints must be configured against each of the integration subnets. With VNet Integration, you cannot have more than one App Service plan configured with a subnet. 


![multiple front end apps with one api app]({{ site.baseurl }}/media/2020/09/two-fe-one-service-endpoint.png)

If you have multiple API apps and multiple front end apps from separate App Service plans, you need to configure VNet Integration from each front end app and then service endpoints on each API app against the integration subnets. 


![multiple front end apps with multiple api apps]({{ site.baseurl }}/media/2020/09/two-fe-two-service-endpoint.png)

As you add front end applications, you need to configure service endpoints with each dependent API application. Using service endpoints is great at smaller scale. It can quickly get out of hand if you have many, or an ever increasing number of, front end applications with multiple API applications. It can become confusing on how to manage the configuration.

### Private endpoints

With private endpoints, the configuration is both easier and harder. It is easier in that when you place a private endpoint in your VNet for an app, you are done managing the inbound traffic to your API app. Unlike with service endpoints, there is no additional configuration to your API app as you add new front end consumers.  It is harder because setting up private endpoints creates a new top level resource and Azure DNS private zones. 

If you have one front end app or more than that, the configuration is the same.  You set up VNet Integration with the same VNet that your API app has a private endpoint in. You also have private endpoints configured on your API application.

![private endpoints with api app]({{ site.baseurl }}/media/2020/09/one-fe-one-private-endpoint.png)

If you have more than one front end app, the only difference is that this second front end app needs VNet Integration to be  configured with it. If this additional front end application is in a different App Service plan, it will use a separate subnet.  Each time you use VNet Integration from another App Service plan, you will need another subnet for integration.

![private endpoint api app with multiple front ends]({{ site.baseurl }}/media/2020/09/two-fe-one-private-endpoint.png)

If you have multiple API applications, you need multiple private endpoints. Those private endpoints can be in the same subnet, or not.  Private endpoints are more flexible in this regard than VNet Integration. Once your API application has exposed itself with a private endpoint, any front end app that integrates with that VNet should be able to reach it. 

![multiple private endpoint api apps with multiple front ends]({{ site.baseurl }}/media/2020/09/two-fe-two-private-endpoint.png)

At a small scale, private endpoints incurs more overhead. You have more to manage and maintain than with service endpoints. On the other hand, private endpoints are a solution for data exfiltration concerns. They also do better at scale as it is easy to add more front end applications.  

### Access restrictions

With access restrictions you can secure inbound traffic to a set of IP address blocks.  This is useful when you want to lock your traffic to a set of egress devices.  You can also use it with other edge protection services such as Azure Front Door. With respect to using it directly with multi-tier applications, you can secure your API applications to the egress addresses used by your front end applications. The problem with this approach is that the outbound addresses are shared with all of the other customers in the same scale unit. From a security review perspective it doesn't look as secure as service endpoint or private endpoint based solutions.  So while it is possible and worth noting, it is not recommended to use access restrictions to create multi-tier web applications. 




