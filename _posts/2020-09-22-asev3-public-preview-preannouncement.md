---
title: 'App Service Environment v3 (ASEv3) public preview pre-announcement'
author_name: "Christina Compy"
date: "2020-09-22"
tags: 
    - ase
category: networking
toc: true
toc_sticky: true
---

The App Service Environment (ASEv3) project is a realization of several years of infrastructure development to enable a best in class network isolated application hosting PaaS service. Today we are happy to pre-announce the upcoming public preview of ASEv3. The ASEv3 platform is expected to land in public preview in early November in a limited set of regions.  

## ASEv3 Overview

The App Service Environment (ASE) is a single tenant instance of the Azure App Service that runs in a customers Azure Virtual Network (VNet). To date, the ASE has been based on the older Azure Cloud Services technology. This has limited the feature set in a number of ways. The ASE also has many networking dependencies that must be allowed in the customer VNet in order for the ASE to operate properly. 

![ASEv2 system architecture diagram]({{ site.baseurl }}/media/2020/08/asev3-asev2-dependencies.png)

In ASEv3, the underlying technology is based on Virtual Machine Scale Sets (VMSS) instead of Cloud Services. This opens the door to a number of improvements including better load balancers, zone redundancy and multiple other things. Also in ASEv3, we have eliminated the challenge of managing the ASE dependency traffic. With ASEv3, you no longer have any inbound or outbound management traffic in the customer VNet. This vastly simplifies ASE deployment and management.

![ASEv3 system architecture diagram]({{ site.baseurl }}/media/2020/08/asev3-dependencies.png)
 
The end result is a single tenant system that has no internet hosted dependencies being called from the customer network. Customers can secure their workloads to their heart's content and Microsoft can better secure the infrastructure without any impact on customer workloads.

There are pricing changes coming with ASEv3 as well. The primary pricing change is the elimination of the ASE stamp fee. You will only be charged for the App Service Isolated v2 plans hosted in your ASEv3. If your ASEv3 was completely empty, you will be charged as if you had one App Service plan with one instance of the smallest size worker in it. 
