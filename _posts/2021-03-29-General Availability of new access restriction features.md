---
title: "General Availability of new Access Restriction Features"
author_name: "Mads Damgård"
category: networking
---

We are happy to announce the General Availability of a number of improvements to the access restriction feature in App Service.

### Service tag-based rules

Networking [service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview) define the set of IP CIDR ranges used for a given Azure service. As these ranges change, the tags will be automatically updated to reflect the change with no change needed from the customer side.

The tags cover different scopes such as data plane and management plane, and different directions like inbound, outbound and both. Service tags can be global or regional. For example, AzureCloud covers all ranges used in Azure public cloud and AzureCloud.WestEurope covers the subset of these ranges used in the West Europe region.

[Service tag-based rules](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions#set-a-service-tag-based-rule) can be used to allow or deny **inbound** traffic to App Service. Common use cases include:

* Azure Traffic Manager health probes, which are covered by the AzureTrafficManager service tag
* Logic Apps, where an API call hosted in an App Service is part of the flow. These can also be regional like LogicApps.SouthEastAsia
* Azure Front Door backend traffic. Used to isolate traffic between the Front Door infrastructure and your App Service. Tag name is AzureFrontDoor.Backend
* Application Insight availability probes using ApplicationInsightsAvailability

Azure portal supports the most common scenarios and for advanced configuration, you can use Azure PowerShell.

### Multi-source rules

[Multi-source rules](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions#multi-source-rules) allow you to define multiple IP address ranges as part of a rule. Each rule can support up to 8 ranges. Use cases for multi-source rules include:

* You need to specify more than 512 ranges for an App Service
* You want to logically group ranges in a rule. For example, both the IPv4 and IPv6 ranges of an internal service
* You want to combine a logical group of ranges with a http header filter

Multi-source rules are currently supported through PowerShell.

### Http header filters

In addition to specifying an IP range or service tag, you can also define specific values of http headers that must also be evaluated. Common cases are:

* [Restrict traffic to specific Azure Front Door instance](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions#restrict-access-to-a-specific-azure-front-door-instance) using X-Azure-FDID header
* Isolate traffic from forward proxy to specific client IPs or host names using X-Forwarded-For or X-Forwarded-Host header

Http header filters can be added from Azure portal or through PowerShell.

### Putting it all together

To see a good example of using some of these capabilities, you can follow this [step-by-step guide](https://azure.github.io/AppService/2021/03/26/Secure-resilient-site-with-custom-domain) setting up a secure resilient site.
