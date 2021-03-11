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
            <td> 50 GB </td>
            <td> ~$69.35/month </td>
        </tr>
    </tbody>
</table>

<sup> * Prices are based on [App Service pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) with the following configurations as of 03/10/2021: Linux OS, Central US region, USD currency, and displayed by month </sup>

Before moving from Standard to Basic, please refer to [App Service limits page](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits#app-service-limits) and [App Service pricing page](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) for more information on the feature support for the different plans.  If your workload does not need the Standard feature set, moving to Basic will help optimize your costs. 

## Premium V3 App Service Plan 

Customers who are currently running bigger production workloads on App Service should be aware of the [new App Service Premium V3 (Pv3) offering announced in November 2020](https://techcommunity.microsoft.com/t5/apps-on-azure/migrate-modernize-net-applications-with-azure/ba-p/1696499), which is our most performant and cost effective offering yet.  The PV3 tier offers enhanced performance for a competitive price. To give an example, let’s compare the P1v2 to P1v3 for both Linux and Windows: 

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

<sup> * Prices are based on App Service pricing for [Linux](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) and [Windows](https://azure.microsoft.com/en-us/pricing/details/app-service/windows/) with the following configurations as of 03/10/2021: Linux OS and Windows OS, Central US region, USD currency, and displayed by month </sup>

P1v3 provides double the cores and more than double the RAM compared to P1v2. If you look at the table above, for Linux P1v3, you get double the cores and more than double the RAM for an additional ~53% of the cost, while for Windows P1v3, you get double the cores and more than double the RAM for an additional ~65% of the cost.  Also note that the comparative price/performance difference is even larger when [reserved instances](#reserved-instances) or [dev/test pricing](#dev-test-pricing) are used (both are covered later in this article).  For example, with a one year reserved instances price, Linux customers can run a P1v3 instance at roughly the same price as a P1v2 instance.  And with a three year reserved instances price, Linux customers can run a P1v3 instance at a lower price than a P1v2! 

### Scaling Up to PV3 

Note that some customers who are on pre-existing App Service footprints may not be able to scale up to PV3.  This will be the case if you notice the option greyed out on the portal when they try to scale up. You will be guaranteed to get support for PV3 if you create a new app in a new resource group in the region of your choice, and you pick a PV3 SKU when creating the new app service plan. You can subsequently scale down your app to a different SKU with the confidence that you can scale back up to Pv3 in the future. You can read more about the option to [scale up from an unsupported resource group and region combination for PV3](https://docs.microsoft.com/en-us/azure/app-service/app-service-configure-premium-tier#scale-up-from-an-unsupported-resource-group-and-region-combination). 

### Long Term Cost Savings for PV3 

If you are planning to run your PV3 instances in the long term, you should consider purchasing [reserved instances](#reserved-instances) as it can greatly increase your savings. The following section will go through it in more detail. 

## Reserved Instances <a name="reserved-instances"></a>

Customers who are running high scale productions on App Service and are looking for long term cost saving options can consider purchasing [reserved instances for App Service](https://techcommunity.microsoft.com/t5/apps-on-azure/migrate-modernize-net-applications-with-azure/ba-p/1696499). Purchasing reserved instances lets customers save 35% to 55% on costs compared to pay-as-you-go if they buy reserved instances for a one-to-three-year commitment. The reserved instances options for App Service are available for Premium V3 Tiers and Isolated stamp fees for ASE V2. You can learn more about this on:
- [What are Azure Reservations?](https://docs.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Save costs with Azure App Service reserved instances](https://docs.microsoft.com/en-us/azure/cost-management-billing/reservations/prepay-app-service?branch=main)
- [How reservation discounts apply to Azure App Service Premium v3 instances and Isolated Stamps](https://docs.microsoft.com/en-us/azure/cost-management-billing/reservations/reservation-discount-app-service-isolated-stamp)
- [How to buy reserved instances section in this article](#how-to-buy-reserved-instances) 

If you would like to get a quick estimated percentage of your savings for using reserved instances, refer to the [Pricing Calculator section in this article](#pricing-calculator)

### Cost Comparisons 

We will go through a few examples from our pricing page to show you the savings you can get with reserved instances. If you would like more information, our pricing page shows a breakdown of the prices for the different options on both [Linux](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) and [Windows](https://azure.microsoft.com/en-us/pricing/details/app-service/windows/).  

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

<sup> * Prices are based on App Service pricing [Linux](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) and [Windows](https://azure.microsoft.com/en-us/pricing/details/app-service/windows/) with the following configurations as of 03/10/2021: Linux OS and Windows OS, Central US region, USD currency, and displayed by month </sup>

As you can see from the chart above, you can get significant savings from purchasing reserved instances. On Linux, a three-year commitment will save you ~55% compared to if you opt for pay as you go. While on Windows, a three-year commitment will save you ~40% compared if you opt for pay as you go. The longer the term commitment, the more savings you will get with reserved instances. Across both Linux and Windows, reserved instances pricing for Pv3 enables you to run at a lower price than equivalent Pv2 instances!   

### How to Buy Reserved Instances <a name="how-to-buy-reserved-instances"></a>

Purchasing reserved instances is very convenient. You can purchase it through the [Azure portal](https://portal.azure.com). To get started, head to the Azure portal, search for “Reservations” on the search bar, and then select the “Reservations” services. 

![How to buy Reserved Instances 1]({{site.baseurl}}/media/2021/03/ri-how-to-1.png){: .align-center}

You will be redirected to a page similar to a resource view page, but it will say “Reservations” on the top left corner. Click on the “+ Add” button to purchase reserved instances. 

![How to buy Reserved Instances 2]({{site.baseurl}}/media/2021/03/ri-how-to-2.png){: .align-center}

You will see a page that lists a range of products that you can purchase reservations for. Search for and select “App Service” from the list. 

![How to buy Reserved Instances 3]({{site.baseurl}}/media/2021/03/ri-how-to-3.png){: .align-center}

A blade will appear on the right side showing options for App Service reserved instances for PV3 and for Isolated App Service Plan. If you don’t see the region, term, or billing frequency that you are interested in, try adjusting the filters by clicking on the blue bubble. For the term, you can choose between a one-year and three-year option.  Once you select an instance, you can view the price and the savings at the bottom right corner. In the image below, I selected the P1v3 option for Linux in Central US region for a three-year term billed monthly. 

![How to buy Reserved Instances - Select Linux]({{site.baseurl}}/media/2021/03/ri-how-to-select-linux.png){: .align-center}

<sup> * The reserved instance price is based on the following configurations as of 03/10/2021: Linux P1v3, Central US region, and a three-year term that is billed monthly. </sup>

And another example below, I selected the P1v3 option for Windows in Central US region for a three-year term billed monthly.  

![How to buy Reserved Instances - Select Windows]({{site.baseurl}}/media/2021/03/ri-how-to-select-windows.png){: .align-center}

<sup> * The reserved instance price is based on the following configurations as of 03/10/2021: Windows P1v3, Central US region, and a three-year term that is billed monthly. </sup>

Once you’ve decided on your choice, click on “Add to cart”. You may choose several plans in the same page, and when you’re done, click on “Close”. You will see a new page on the “Products” tab that will show you a list of products that you have chosen. In this page, you can set the name of your reservations and the quantities (which corresponds to the number of Pv3 instances being purchased with a reservation) that you would like to purchase for your products. If you are unsure of how many instances to reserve, refer to the [how many Reserved Instances should I buy section of the article](#how-many-reserved-instances-to-buy). You can also delete products and edit your purchases. You can also see the breakdown of the total costs and of your immediate charges at the bottom right corner of the page. 

![How to buy Reserved Instances - View Cart]({{site.baseurl}}/media/2021/03/ri-how-to-view-cart.png){: .align-center}

<sup> * The reserved instance price is based on the following configurations as of 03/10/2021: Linux P1v3, Central US region, and a three-year term that is billed monthly. </sup>

When you are satisfied with your selections, make sure to head to “Review + buy” to finalize your purchase of the reserved instances. 

### How Many Reserved Instances Should I Buy <a name="how-many-reserved-instances-to-buy"></a>

If you are unsure of the quantity to buy, we recommend purchasing enough quantity to cover your steady state baseload. In other words, use the number of App Service Plan instances running for your baseload as a starting point for the quantity specified in the reserved instances purchase.  For many customers, the baseload would be one or two instances. You can still use an auto-scale rule to increase the number of running App Service Plan instances above the baseload. Reserved instances pricing will cover the baseload and any additional compute from auto-scaling will be charged at the regular price. 

## Dev/Test Pricing <a name="dev-test-pricing"></a>

Dev/Test Pricing is a great option for customers who are looking to have discounted rates for the development and testing environments for their web apps. This option is available for Basic, Standard, Premium v2, and Premium v3 App Service Plans. For more information, you can look at the [Azure Dev/Test Pricing page](https://azure.microsoft.com/en-us/pricing/dev-test/) and scroll towards the bottom of the page where “App Service” is listed. If you are interested in getting an estimated price for your dev/test pricing, refer to next section under [pricing calculator](#pricing-calculator). 

## Pricing Calculator <a name="pricing-calculator"></a>

The [pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator/) can be a handy tool to calculate the estimated monthly costs of running your services. In this section we will show you how to use the pricing calculator to calculate the estimated price for your reserved instances and for your dev/test pricing. 

### Getting Started 

In the [pricing calculator page](https://azure.microsoft.com/en-us/pricing/calculator/), select “App Service” from the list of products and you will get a notification on the right side of the page.  

![Pricing Calculator Main Menu]({{site.baseurl}}/media/2021/03/pricing-calculator-main-menu.png){: .align-center}

When you’ve successfully added App Service in the calculator, you will see a section in the UX showing App Service information when you scroll down the page. You can configure values such as region, OS, pricing tier, and etc. to get an estimate for the cost. The next few sections in the article will go over how you can use this tool to calculate an estimate for your reserved instances savings and for your dev/test pricing. 

### Calculating Reserved Instances 

Once you have selected “App Service” from the list of products and properly selected your configurations, look for the “Saving Options” and select from the reserved instances options. On the pricing calculator, it will also show the percentage of your savings for all the reserved instances options. The price will adjust accordingly after you have selected a reserved instances option. 

The example below will show you how the savings options will look like for a P1v3 with a three-year reserved instance on Linux. 

![Pricing Calculator Getting Started 2]({{site.baseurl}}/media/2021/03/pricing-calculator-3-year-ri-linux.png){: .align-center}

<sup> * Price is based on [pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator/) with the following configurations as of 03/10/2021: Central US region, Linux OS, and Premium V3 for one P1v3 instance for three-year reserved instances. Price is in USD and is displayed per month. </sup>

For another example, the image below will show you how the savings options will look like for a P1v3 with a three-year reserved instance on Windows. 

![Pricing Calculator Getting Started 3]({{site.baseurl}}/media/2021/03/pricing-calculator-3-year-ri-windows.png){: .align-center}

<sup> * Price is based on [pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator/) with the following configurations as of 03/10/2021: Central US region, Windows OS, and Premium V3 for one P1v3 instance for three-year reserved instances. Price is in USD and is displayed per month. </sup>

As you can see from the examples above, the pricing calculator makes it convenient for you to calculate your estimated savings percentage with the reserved instances. 

### Calculating Dev/Test Pricing 

Once you have selected “App Service” from the list of products and properly selected your configurations, scroll to the very bottom of the calculator web page and look for the “Show Dev/Test Pricing” slider. When you enable the slider to show dev/test pricing, you will notice that your price estimates will have changed to reflect dev/test pricing if supported for the selected pricing tier. 

![Pricing Calculator Show Dev Test Option]({{site.baseurl}}/media/2021/03/pricing-calculator-show-dev-test-option.png){: .align-center}

The set of examples below show an estimate using the pricing calculator for a P1v3 instance when you apply Dev/Test Pricing on Linux.  The first screenshot shows the regular price for a Linux P1v3 instance.  The second screenshot shows the discounted Dev/Test price. You will notice a $30.66 price difference which is ~24% less for dev/test pricing. 

![Pricing Calculator Dev Test Off (Linux)]({{site.baseurl}}/media/2021/03/pricing-calculator-dev-test-off-linux.png){: .align-center}

<sup> * Price is based on [pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator/) with the following configurations as of 03/10/2021: Central US region, Linux OS, and Premium V3 for one P1v3 instance for pay as you go without dev/test pricing. Price is in USD and is displayed per month.  </sup>

![Pricing Calculator Dev Test On (Linux)]({{site.baseurl}}/media/2021/03/pricing-calculator-dev-test-on-linux.png){: .align-center}

<sup> * Price is based on [pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator/) with the following configurations as of 03/10/2021: Central US region, Linux OS, and Premium V3 for one P1v3 instance for pay as you go with dev/test pricing. Price is in USD and is displayed per month. </sup>

Another set of examples below show an estimate using the pricing calculator for a P1v3 instance when you apply Dev/Test Pricing on Windows. The first screenshot shows the regular price for a Windows P1v3 instance.  The second screenshot shows the discounted Dev/Test price.  There is a $147.46 price difference which is ~61% less for dev/test pricing. 

![Pricing Calculator Dev Test Off (Windows)]({{site.baseurl}}/media/2021/03/pricing-calculator-dev-test-off-windows.png){: .align-center}

<sup> * Price is based on [pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator/) with the following configurations as of 03/10/2021: Central US region, Windows OS, and Premium V3 for one P1v3 instance for pay as you go without dev/test pricing. Price is in USD and is displayed per month. </sup>

![Pricing Calculator Dev Test On (Windows)]({{site.baseurl}}/media/2021/03/pricing-calculator-dev-test-on-windows.png){: .align-center}

<sup> * Price is based on [pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator/) with the following configurations as of 03/10/2021: Central US region, Windows OS, and Premium V3 for one P1v3 instance for pay as you go with dev/test pricing. Price is in USD and is displayed per month.  </sup>

From the two sets of examples above, you can see the savings you can get for using the dev/test pricing for your development and testing environments. This is a great option for hosting your development and testing environments with the same amount of performance and capacity as your production environments, but at a lower cost. 

## Summary 

There are several ways for you to increase savings when running App Service . This article has described several App Service Plan offerings that help you save on prices, including reserved instances, and dev/test pricing options. We hope this article has equipped you with more information and presented you with a guide on how you can increase your savings when running App Service.  

All prices in this article are all estimates during the time noted. Your final price would depend on your configurations for your App Service. 