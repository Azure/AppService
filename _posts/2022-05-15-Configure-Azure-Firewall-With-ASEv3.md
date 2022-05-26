---
title: "Configure Azure Firewall with ASEv3"
author_name: "Hugo Girard"                           
category: 'networking'                                 
---

Azure Firewall help you securize your egress traffic of you App Service Environment. This will provide only authorized flow going out of your ASE.

This blog post walks you throught how to achieve this, this assume you have a [hub and spoke network topology](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?tabs=cli) in place in Azure with more than one [landing zone](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/).

A full implementation example is available in [Github](https://github.com/hugogirard/asev3enterpriseDemo).  This GitHub repository will create all the resources discussed in this article. 

This article focus on the configuration of the Azure Firewall and won't go into the step to create all the Azure resources, those are described in the provided Github repository.

## What the architecture look like

![]({{ site.baseurl }}/media/2022/05/asev3_with_firewall_architecture.png)

You have in place one hub and two spokes deployed in your Azure subscription.  All ingress will come into Application Gateway that is deployed with a Web Application Firewall.  All egress traffic will be filtered by the Azure Firewall.  Keep in mind, by default Azure Firewall blocks all traffic, this give us the possibility to be really granular what flow we will allow.

In our scenario we have two APIs, the Weather API and the Fibonacci API.  The Weather API return fake data, this mean it doesn't communicate to the outside world and doesn't need to egress to the Azure Firewall.

The Fibonnacci API receive a len in parameter and calculate a Fibonnacci sequence.  Before doing the calculation the API tries to retrieve the result in Azure Redis Cache, if the result is not found the sequence is calculated and saved in the Redis Cache.

The cache reside in another spoke from the ASE, this mean the traffic will be routed to the Azure Firewall.

## User Defined Route on ASE Subnet

To route all the egress traffic from the ASE to the Azure Firewall an User Defined route was created.  The route is associated to the subnet of the ASE.

![]({{ site.baseurl }}/media/2022/05/ase_udr_subnet.png)

By default, we redirect all traffic to the Azure Firewall private IP address.

![]({{ site.baseurl }}/media/2022/05/asev3_route_fw.png)

## Testing the Weather Api

Like mentionned before, the Weather API doesn't communicate to any other Azure resources or the Internet.  It receives an HTTP request and send fake weather data.  

Even with the route in place calling the Weather API will work with any problems.

![]({{ site.baseurl }}/media/2022/05/weatherapi.png)

We receive a status code 200 and some fake weather data like expected.

## Testing the Fibonacci Api

Like mentionned before, the Fibonacci API try to retrieve the calculated sequence from the Azure Redis Cache.  The JSON schema of the result returned look like this.

![]({{ site.baseurl }}/media/2022/05/fibonacci_schema_result.png)

You have a property called **valueFromCache** indicate if the value is retrieved from the Redis Cache.  The first time you call this API the value should be **FALSE**.  If you call the API again with the same parameter the next time the value should be **TRUE**.

Right now, the value will always be false because the egress traffic to reach the Azure Redis Cache is blocked at the Azure Firewall level.

Here we call the API with the len parameter with a value of 5.

![]({{ site.baseurl }}/media/2022/05/fibonacci_api_first_call.png)

You can see the property **valueFromCache** return the value **FALSE** like expected.  Now let's try it again and the result should be the same because the traffic is block at the firewall level.

![]({{ site.baseurl }}/media/2022/05/fibonacci_same_result.png)


## Adding network rule in Azure Firewall

Now before adding the network rule in Azure Firewall let's read the log from the firewall.  The log are saved in Azure Log Analytics