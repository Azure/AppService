---
title: "Public Preview of Private Link on App Service"
category: networking
author_name: "Christina Compy"
---

We are happy to announce the public preview of Private Link for Azure App Service. This preview is available in limited regions for all PremiumV2 Windows and Linux web apps. It is also now available for Elastic Premium Functions plans. [Private Link](https://docs.microsoft.com/en-us/azure/private-link/) enables you to host your apps on an address in your Azure Virtual Network (VNet) rather than on a shared public address. By moving the endpoint for your app into your VNet you can:

* **Isolate your apps from the internet**. Configuring a Private Endpoint with your app, you can securely host line-of-business applications and other intranet applications.
* **Prevent data exfiltration**. Since the Private Endpoint only goes to one app, you don't need to worry about data exfiltration situations. 

![Private Link Flow]({{ site.baseurl }}/media/2020/03/privatelink-flow.png)

The feature is currently available in all public regions.

### Using Private Link or Service Endpoints

There is another networking feature called Service Endpoints which enables you to secure workloads to your VNet. There is a difference between Private Link and Service Endpoints. Service Endpoints enables you to secure your app to select set of subnets. It is used to secure the service to only being reachable from the select subnets. Private Link exposes your app on an address in your VNet and removes it from public access. This not only secures the app but can also be combined with Network Security Groups to secure your network.  

### Private Link vs App Service Environment

Having your app only accessible on a private address in your VNet is something that was previously only possible by using an ILB App Service Environment or an Application Gateway with an internal inbound address. The difference between using Private Link and an ILB ASE is that with an ILB ASE you have single tenant system that can host many apps behind one VNet address. With Private Link, your app runs in the public App service and you have one app behind one address. If you want to apply network security external to your application, then you still only get that with an ILB ASE. If you only need a private address in your VNet, then Private Link can give you that.

### Putting your app in your VNet

Private Link provides a private address for inbound traffic only to your app. It does not enable your app to make outbound calls into your VNet. If you want to have all inbound and outbound in your VNet, then you need to use both Private Link and Regional VNet Integration. With Private Link you can secure the inbound and with VNet Integration you can secure the outbound. 

To get started, read the documentation [here](https://docs.microsoft.com/azure/app-service/networking/private-endpoint) 
    
