---
title: 'App Service Environment v3 (ASEv3) public preview pre-announcement'
author_name: "Christina Compy"
date: "2020-09-22"
tags: 
    - ASE
category: networking
toc: true
toc_sticky: true
---

The App Service Environment v3 (ASEv3) project is a realization of several years of infrastructure development to enable a best-in-class, network isolated application hosting PaaS service. Today we are happy to pre-announce the upcoming public preview of ASEv3. The ASEv3 platform is expected to land in public preview in early November in a limited set of regions.  

## ASEv3 Overview

The App Service Environment (ASE) is a single tenant instance of the Azure App Service that runs in a customers Azure Virtual Network (VNet). It solves many isolation scenarios for some of our top customers in a way you cannot with the multi-tenant service. While the service is used widely and is well received, there are some areas  we wanted to improve.  

In ASEv3, the underlying technology is based on Virtual Machine Scale Sets (VMSS) instead of Cloud Services. This opens the door to a number of improvements including better load balancers, zone redundancy and multiple other things. Also in ASEv3, we have eliminated the challenge of managing the ASE dependency traffic. With ASEv3, you no longer have any inbound or outbound management traffic in the customer VNet. This vastly simplifies ASE deployment and management.

![ASEv2 to ASEv3 dependencies diagram]({{ site.baseurl }}/media/2020/09/asev2-to-asev3-dependencies.png)
 
The end result is a single tenant system that has no internet hosted dependencies being called from the customer network. Customers can secure their workloads to their heart's content and Microsoft can better secure the infrastructure without any impact on customer workloads.

In addition to operational improvements, we're also making this new ASE more cost-effective for customers As part of our Isolated v2 plan we're reducing the PAYG rates and eliminating the per instance stamp fee for ASE v3, reducing the cost of deployment by up to 80%
