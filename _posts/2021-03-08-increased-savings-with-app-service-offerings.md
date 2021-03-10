---
title: "Increased Savings with App Service Offerings"
author_name: "Yutang Lin"
toc: true
toc_sticky: true
---

In this article, we will review different App Service offerings along with side-to-side comparisons on ways to increase your savings when running App Service. The offerings we will be covering in this article are: 

- Free App Service Plan on Linux and Windows 
- Basic App Service Plan on Linux 
- Premium V3 App Service Plan on Linux and Windows 
- Reserved Instances 
- Dev/Test Pricing 

At the end of the article, we will also go through how you can estimate your cost savings using the Azure Pricing Calculator. 

## Free App Service Plan on Linux and Windows 
App Service provides Free App Service Plans on both Linux and Windows. This is a great option if you are starting out in your journey to host web apps in the cloud. This tier comes with its own [limits on what features it supports](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits#app-service-limits), so if you are expecting to increase the usage of your web app, we would recommend you to scale up.  

## Basic App Service Plan on Linux 
Linux developers who are starting out on App Service and are hosting a smaller web app with lower traffic requirements that don't need auto scale, virtual network integration and deployment slots features should take note of the discounted prices for Linux Basic App Service Plan. The chart below will show you a comparison between a Linux B1 and S1 instance so you can see the significant price difference between the two. 

| OS | Instance | Cores | RAM | Storage | Cost |
| -- | -- | -- | -- | -- | -- |
| Linux | B1 | 1 core | 1.75 GB | 10 GB  | ~$13.14/month |
| Linux | S1 | 1 core | 1.75 GB | 10 GB  | ~69.35/month |

<sup> * Prices are based on [App Service pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) with the following configurations as of 02/02/2021: Linux OS, Central US region, USD currency, and displayed by month </sup>

<table>
    <thead>
        <tr>
            <th> OS </th> 
            <th> Instance </th>
            <th> Cores </th> 
            <th> RAM </th> 
            <th> Storage </th> 
            <th> Cost </th> 
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan = "2"> Linux </td>
            <td> B1 </td>
            <td> 1 core </td>
            <td> 1.75 GB </td>
            <td> 10 GB </td>
            <td> ~$13.14/month </td>
        </tr>
        <tr>
            <td> S1 </td>
            <td> 1 core </td>
            <td> 1.75 GB </td>
            <td> 10 GB </td>
            <td> ~69.35/month </td>
        </tr>
    </tbody>
</table>

<sup> * Prices are based on [App Service pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) with the following configurations as of 02/02/2021: Linux OS, Central US region, USD currency, and displayed by month </sup>

Before moving from Standard to Basic, please refer to [App Service limits page](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits#app-service-limits) and App Service pricing page for [Windows](https://azure.microsoft.com/en-us/pricing/details/app-service/windows/) or [Linux](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) for more information on the feature support for the different plans.  If your workload does not need the Standard feature set, moving to Basic will help optimize your costs. 

## Premium V3 App Service Plan 

Customers who are currently running bigger production workloads on App Service should be aware of the new App Service Premium V3 (Pv3) offering announced in November 2020, which is our most performant and cost effective offering yet.  The PV3 tier offers enhanced performance for a competitive price. To give an example, let’s compare the P1v2 to P1v3 for both Linux and Windows: 

<table>
    <thead>
        <tr>
            <th> OS </th> 
            <th> Instance </th>
            <th> Cores </th> 
            <th> RAM </th> 
            <th> Storage </th> 
            <th> Cost </th> 
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan = "2"> Linux </td>
            <td> P1v2 </td>
            <td> 1 core </td>
            <td> 3.50 GB </td>
            <td> 250 GB </td>
            <td> ~$81.03/month </td>
        </tr>
        <tr>
            <td> P1v3 </td>
            <td> 2 cores </td>
            <td> 8 GB </td>
            <td> 250 GB </td>
            <td> ~$124.10/month </td>
        </tr>
        <tr>
            <td rowspan = "2"> Windows </td>
            <td> P1v2 </td>
            <td> 1 core </td>
            <td> 3.50 GB </td>
            <td> 250 GB </td>
            <td> ~$146.00/month </td>
        </tr>
        <tr>
            <td> P1v3 </td>
            <td> 2 cores </td>
            <td> 8 GB </td>
            <td> 250 GB </td>
            <td> ~$240.90/month </td>
        </tr>
    </tbody>
</table>

<sup> * Prices are based on [App Service pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) with the following configurations as of 02/02/2021: Linux OS, Central US region, USD currency, and displayed by month </sup>

P1v3 provides double the cores and more than double the RAM compared to P1v2. If you look at the table above, for Linux P1v3, you get double the cores and more than double the RAM for an additional ~53%, while for Windows P1v3, you get double the cores and more than double the RAM for an additional ~65%.  Also note that the comparative price/performance difference is even larger when reserved instances or dev/test pricing are used (both are covered later in this article).  For example, with a one year reserved instances price, Linux customers can run a P1v3 instance at roughly the same price as a P1v2 instance.  And with a three year reserved instances price, Linux customers can run a P1v3 instance at a lower price than a P1v2! 

### Scaling Up to PV3 

Note that some customers who are on pre-existing App Service footprints may not be able to scale up to PV3.  This will be the case if you notice the option greyed out on the portal when they try to scale up. You will be guaranteed to get support for PV3 if you create a new app in a new resource group in the region of your choice, and you pick a PV3 SKU when creating the new app service plan. You can subsequently scale down your app to a different SKU with the confidence that you can scale back up to Pv3 in the future. You can read more about the option to [scale up from an unsupported resource group and region combination for PV3](https://docs.microsoft.com/en-us/azure/app-service/app-service-configure-premium-tier#scale-up-from-an-unsupported-resource-group-and-region-combination). 

### Long Term Cost Savings for PV3 

If you are planning to run your PV3 instances in the long term, you should consider purchasing [reserved instances]() as it can greatly increase your savings. The following section will go through it in more detail. 

## Reserved Instances 

Customers who are running high scale productions on App Service and are looking for long term cost saving options can consider purchasing [reserved instances for App Service](https://techcommunity.microsoft.com/t5/apps-on-azure/migrate-modernize-net-applications-with-azure/ba-p/1696499). Purchasing reserved instances lets customers save 35% to 55% on costs compared to pay-as-you-go if they buy reserved instances for a one-to-three-year commitment. The reserved instances options for App Service are available for Premium V3 Tiers and Isolated stamp fees for ASE V2. You can learn more about this on the [Azure reservations page](), [App Service reservations discounts for isolated stamps article](), and the [how to buy reserved instances section in this article](). If you would like to get a quick estimated percentage of your savings for using reserved instances, refer to the [Pricing Calculator section in this article](). 

### Cost Comparisons 

We will go through a few examples from our pricing page to show you the savings you can get with reserved instances. If you would like more information, our pricing page shows a breakdown of the prices for the different options on both [Linux]() and [Windows]().  

The chart below shows the comparison between the prices for P1v3 instance for pay-as-you-go, one-year reserved instance, and three-year reserved instance on both Linux and Windows.

<table>
    <thead>
        <tr>
            <th> OS </th> 
            <th> Instance </th>
            <th> Pay as You Go </th> 
            <th> 1 Year Reserved </th> 
            <th> 3 Year Reserved </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td> Linux </td>
            <td> P1v3 </td>
            <td> ~$124.100/month </td>
            <td> ~$81.001/month (~35% savings) </td>
            <td> ~$56.247/month (~55% savings) </td>
        </tr>
        <tr>
            <td> Windows </td>
            <td> P1v3 </td>
            <td> ~$240.90/month </td>
            <td> ~$180.332/month (~25% savings) </td>
            <td> ~$145.249/month (~40% savings) </td>
        </tr>
    </tbody>
</table>

<sup> * Prices are based on [App Service pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) with the following configurations as of 02/02/2021: Linux OS, Central US region, USD currency, and displayed by month </sup>

As you can see from the chart above, you can get significant savings from purchasing reserved instances. On Linux, a three-year commitment will save you ~55% compared to if you opt for pay as you go. While on Windows, a three-year commitment will save you ~40% compared if you opt for pay as you go. The longer the term commitment, the more savings you will get with reserved instances. Across both Linux and Windows, reserved instances pricing for Pv3 enables you to run at a lower price than equivalent Pv2 instances!   

![Create-Managed-Cert-Apex-Domain-Portal]({{site.baseurl}}/media/2021/01/ri-how-to-1.png){: .align-center}