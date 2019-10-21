---
author_name: Cory Fowler (MSFT)
layout: post
hide_excerpt: true
---
      [Cory Fowler (MSFT)](https://social.msdn.microsoft.com/profile/Cory Fowler (MSFT))  3/23/2017 6:27:19 PM  App Service has come a very long way in the nearly 5 years it has been a service in Azure. Along the way, we've added a number of features, changed the pricing model, we've even gone as far as to make App Service available in an isolated capacity with App Service Environment and with the recent addition of Azure Functions a new type of hosting plan.

 With all of these changes it's become clear to us that we need to provide a clear breakdown as to which features are available in which tiers because that enables you, our beloved customers, to be successful on our platform.

 In an attempt to clarify which features are available where, we have created the below matrix. We are posting this to our blog first, as we would like to hear your feedback if this is effective way of relaying this information to you. For Example, should we merge the below matrix with the [App Service Plan limits](https://azure.microsoft.com/en-us/pricing/details/app-service/plans/) page.

 Please leave your feedback in the comments below and we will work on getting a more formal piece of documentation together that will provide you with all of the details you need to get to market in the quickest way possible using Azure App Service.

  

    Features SKU           **App Deployment** Free Shared Basic Standard Premium ASE ILB ASE App Service Linux Consumption Plan (Functions)  Continuous Delivery ✓ ✓ ✓ ✓ ✓ ✓ ✓      Continuous Deployment ✓ ✓ ✓ ✓ ✓ ✓ ✓   ✓  Deployment Slots       ✓ ✓ ✓ ✓      Docker (Containers)               ✓ 1    **Development Tools** Free Shared Basic Standard Premium ASE ILB ASE App Service Linux Consumption Plan (Functions)  Clone App         ✓ ✓ ✓      Kudu ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ 2 ✓  PHP Debugging 3 ✓ ✓ ✓ ✓ ✓ ✓        Site Extensions ✓ ✓ ✓ ✓ ✓ ✓ ✓      Testing in Production       ✓ ✓ ✓ ✓      **Monitoring** Free Shared Basic Standard Premium ASE ILB ASE App Service Linux Consumption Plan (Functions)  Log Stream ✓ ✓ ✓ ✓ ✓ ✓ ✓ 4   ✓  Process Explorer ✓ ✓ ✓ ✓ ✓ ✓ ✓   ✓  **Networking** Free Shared Basic Standard Premium ASE ILB ASE App Service Linux Consumption Plan (Functions)  Hybrid Connections ✓ ✓ ✓ ✓ ✓ ✓ ✓      VNET Integration       ✓ ✓ ✓ ✓      **Programming Languages** Free Shared Basic Standard Premium ASE ILB ASE App Service Linux Consumption Plan (Functions)  .NET ✓ ✓ ✓ ✓ ✓ ✓ ✓   ✓  .NET Core ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓    Java ✓ ✓ ✓ ✓ ✓ ✓ ✓   alpha  Node.js ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓  PHP ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ alpha  Python ✓ ✓ ✓ ✓ ✓ ✓ ✓   alpha  Ruby               ✓    **Scale** Free Shared Basic Standard Premium ASE ILB ASE App Service Linux Consumption Plan (Functions)  Auto-scale       ✓ ✓ ✓ ✓   ✓  Integrated Load Balancer   ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓  [Traffic Manager](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-overview)       ✓ ✓ ✓ ✓      **Settings** Free Shared Basic Standard Premium ASE ILB ASE App Service Linux Consumption Plan (Functions)  64-bit     ✓ ✓ ✓ ✓ ✓ ✓ ✓  Always On     ✓ ✓ ✓ ✓ ✓      Session Affinity ✓ ✓ ✓ ✓ ✓ ✓ ✓      Authentication &Authorization ✓ ✓ ✓ ✓ ✓ ✓ ✓   ✓  Backup/Restore       ✓ ✓ ✓ ✓ ✓    Custom Domains   ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓  FTP/FTPS ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓  Local Cache       ✓ ✓ ✓ ✓      MySQL in App ✓ ✓ ✓ ✓ ✓ ✓ ✓ 4      Remote Debugging (.NET) ✓ ✓ ✓ ✓ ✓ ✓     ✓  Security Scanning ✓ ✓ ✓ ✓ ✓ ✓        SSL (IP/SNI)     ✓ ✓ ✓ ✓ ✓ ✓ SNI SSL  Web Sockets 5 ✓ ✓ ✓ ✓ ✓ ✓ ✓     1 Supports a one-time pull model from Docker Hub, Azure Container Registry or a private Docker Registry.  
  
2 Kudu on Linux doesn’t have the same feature set as Kudu on Windows.  
  
3 PHP Debugging is currently only supported on Windows. PHP Debugging for version 7.x is unavailable.  
  
4 ILB ASE has no public connectivity to the internet. Management actions on ILB ASE must be performed using the Kudu Console.  
  
5 The number of Web Socket ports are limited by the sku, review the [App Service Constraints, Service Limits and Quotas](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits#app-service-limits).  


     