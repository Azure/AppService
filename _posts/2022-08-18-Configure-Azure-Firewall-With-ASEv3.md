---
title: "Configure Azure Firewall with ASEv3"
author_name: "Hugo Girard"                           
category: 'networking'
toc: true
toc_sticky: true
tags:
    - azure app service environment
    - azure firewall                               
---

When deploying App Service Environment, one requirement you will probably want is to monitor and limit your egress traffic from the ASE. 

This blog post walks you through how to achieve this using Azure Firewall, this assumes you have a [hub and spoke network topology](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?tabs=cli) in place in Azure with more than one [landing zone](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/).

A full implementation example is available in [Github](https://github.com/hugogirard/asev3enterpriseDemo).  This GitHub repository will create all the resources discussed in this article. 

This article focus on the configuration of the Azure Firewall and won't go into the step to create all the Azure resources, those are described in the provided Github repository.

## What the architecture look like

![]({{ site.baseurl }}/media/2022/08/asev3_with_firewall_architecture.png)

In the provided implementation you have in place one hub and two spokes deployed in your Azure subscription.  All ingress will come into Application Gateway that is deployed with a [Web Application Firewall](https://docs.microsoft.com/en-us/azure/web-application-firewall/ag/ag-overview).  All egress traffic will be routed to the Azure Firewall.  Keep in mind, by default Azure Firewall blocks all traffic, this give you the possibility to be really granular with which flow you want to allow.

In this scenario, you have two APIs, the Weather API and the Fibonacci API.  The Weather API return fake data, this means it doesn't communicate to the outside world and doesn't need to egress to the Azure Firewall even if a [User-Defined route](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview#custom-routes) is present.

The Fibonnacci API receive a Len in parameters and calculates a Fibonnacci sequence.  Before doing the calculation, the API tries to retrieve the result in Azure Redis Cache - if the result is not found the sequence is calculated, saved in the Redis Cache, and returned to the caller.

The cache reside in another spoke from the ASE, this means the traffic will be routed to the Azure Firewall and filtered at this level.  You will need to allow the traffic coming from the ASE to reach the subnet where the Redis Cache resides.

## User Defined Route on ASE Subnet

To route all the egress traffic from the ASE to the Azure Firewall, a User Defined route was created.  The route is associated to the subnet of the ASE.

![]({{ site.baseurl }}/media/2022/08/ase_udr_subnet.png)

By default, we redirect all traffic to the Azure Firewall private IP address.

![]({{ site.baseurl }}/media/2022/08/asev3_route_fw.png)

## Testing the Weather API

As mentioned before, the Weather API doesn't communicate to any other Azure resources or the Internet.  It receives an HTTP request and sends fake weather data.  

Even with the route in place, calling the Weather API will work without any problems.

![]({{ site.baseurl }}/media/2022/08/weatherapi.png)

We receive a status code 200 and some fake weather data as expected.

## Testing the Fibonacci API

Let's take a look of the JSON schema of the result returned from the Fibonacci API.

![]({{ site.baseurl }}/media/2022/08/fibonacci_schema_result.png)

You have a property called **valueFromCache** indicating if the value is retrieved from Redis Cache.  The first time you call the API the value will be **FALSE**.  If you call the API again with the same parameter the next time, the value should be **TRUE** if the saved value is not expired.

Right now, the value will always be false because the egress traffic to reach the Azure Redis Cache is blocked at the Azure Firewall level.

Here, call the API with the value of 5 for the len parameter.

![]({{ site.baseurl }}/media/2022/08/fibonacci_api_first_call.png)

You can see the property **valueFromCache** return the value **FALSE** like expected.  Now let's try it again and the result should be the same because the traffic is blocked at the firewall level.  In this case the API will always work but won't ever be able to communicate with the cache.

![]({{ site.baseurl }}/media/2022/08/fibonacci_same_result.png)


## Adding network rule in Azure Firewall

Now, before adding the network rule in Azure Firewall let's take a look at the log.  To consult the log go to your Azure Log Analytics associated with your firewall. Execute the following Kusto query in log analytics.

```
AzureDiagnostics
| where ResourceGroup == 'RG-HUB-ASE-DEMO'
| where Category == 'AzureFirewallNetworkRule'
| order by TimeGenerated desc 
```
This should return the cause why the ASE was not able to communicate with the Azure Redis Cache.

![]({{ site.baseurl }}/media/2022/08/ase_azfw_rule_deny.png)

As you can see, the TCP request from 10.1.1.254 to 11.0.1.4 was denied.

The 10.1.1.254 IP corresponds to the IP address of the Fibonacci Web App, you can see here the CIDR of the subnet allocated for the App Service Environment.

![]({{ site.baseurl }}/media/2022/08/asev3_snet.png)

The 11.0.1.4 IP corresponds to the **private endpoint** used for the Azure Redis Cache.

Now, you need to create a Network Rule in the Azure firewall to allow the communication between the ASE subnet and the private endpoint of the Azure Redis Cache.

![]({{ site.baseurl }}/media/2022/08/azfw-network-rule.png)

## Try the Fibonacci API again

Now, you should restart the Fibonacci API, if the connection to Redis cache is not possible the Fibonacci won't try again.

The first time you try with a len of 5 you will have the property **valueFromCache** with a value of **FALSE**.

Now try again with the same parameter, this time you will see the result will come faster and the **valueFromCache** property will be **TRUE**.

![]({{ site.baseurl }}/media/2022/08/ase_cached_value.png)

## Conclusion

As you can see, adding Azure Firewall in Azure App Service Environment is really easy with version 3.  You can control all egress going out from your ASE with the good old hub and spoke pattern.

### Resources

1.	[Reference application](https://github.com/hugogirard/asev3enterpriseDemo)
2.	[Hub and spoke network topology](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?tabs=cli)
3.	[Azure landing zone](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/)
4.	[Azure App Service Environment](https://docs.microsoft.com/en-us/azure/app-service/environment/overview)
5.	[Application Gateway with App Service Environment](https://docs.microsoft.com/en-us/azure/app-service/environment/integrate-with-application-gateway)
6.	[Azure Firewall](https://docs.microsoft.com/en-us/azure/firewall/overview)
