---
title: "App Service Environment v3 public preview"
category: networking
author_name: "Christina Compy"
---

We are happy to announce the public preview of the App Service Environment v3 (ASEv3). The ASEv3 project is a realization of several years of infrastructure development to enable a best in class Isolated application hosting PaaS service. This release has been driven directly by customer feedback and satisfies multiple situations that were not covered by ASEv2.   

The App Service Environment (ASE) is a single tenant instance of the Azure App Service that injects into a customers Azure Virtual Network (VNet). Until now, the ASE has required many networking dependencies that must be allowed in the customer VNet in order for the ASE to operate properly. ASEv3 has several major changes in the system architecture that serve to remove all management traffic from the customer VNet. The end result is a single tenant system that has no internet hosted dependencies in the customer network. Customers can secure their workloads to their heart's content without hurting the ASE and Microsoft can secure the infrastructure without hurting customer workloads. This system enables both parties to apply all of the security they want to without affecting each other. 

The pricing for ASEv3 is changed from ASEv2.  With ASEv3 you just pay for the Isolated V2 SKU rates for your App Service plans. There is no stamp fee. If your ASEv3 is totally empty, you are charged as if you had one App Service plan with one instance of I1v2.  The hosts used in ASEv3 are the same type used with Premium V3. The size options in ASEv3 are: 2 core  8 GB RAM, 4 core 16 GB RAM, 8 core 32 GB RAM.  

With respect to networking dependencies it should be reiterated that there are no required Network Security Groups, no required route tables and no required service endpoints.  You can route and filter things with an eye centered on just what your apps need. If you want to configure your apps to force tunnel all outbound traffic on-premises, you can do so.  If you want to send all outbound traffic through an NVA, no problem. And if you want to put a WAF device to monitor all inbound traffic to your ASEv3, you can add that without any limitations. 

![ASEv2 to ASEv3 dependencies diagram]({{ site.baseurl }}/media/2020/09/asev2-to-asev3-dependencies.png)

There are a number of limitations as this preview starts off. Some features that are available in ASEv2 are not available in the current form of ASEv3. Missing features will be added as the preview goes on. To get a more complete overview on ASEv3, read the ASEv3 focused [App Service Environment overview](https://docs.microsoft.com/azure/app-service/environment/overview).  If you want to create a new ASEv3, read [Creating an App Service Environment v3](https://docs.microsoft.com/en-us/azure/app-service/environment/creation). 


