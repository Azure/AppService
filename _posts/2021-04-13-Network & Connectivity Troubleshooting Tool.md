---
title: "Diagnose & Solve Networking/Connectivity issues with the new Troubleshooter"
author_name: "Khaled Zayed"
category: diagnostics
tags:                                                           
    - Network
    - Virtual Network
    - VNET
    - Connectivity
---

Troubleshooting networking & connectivity issues when running on App Services just became easier. We are happy to announce the release of our new diagnostic tool 'Network/Connectivity Troubleshooter' available now in the Diagnose & Solve blade. 

You can access to the tool by going to the Diagnose & Solve blade and either use the search bar to search for it or use the quick link available under popular troubleshooting tools section:
![Find the tool]({{site.baseurl}}/media/2021/04/NT-homepage.png)

This guided troubleshooter takes you step by step to understand your issue and provide catered solutions based on your inputs:
![Guided experience]({{site.baseurl}}/media/2021/04/NT-flows.png)

### Unable to connect to a resource, such as SQL or Redis or on-prem, in my Virtual Network 

Networking [service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview) define the set of IP CIDR ranges used for a given Azure service. As these ranges change, the tags will be automatically updated to reflect the change with no change needed from the customer side.

The tags cover different scopes such as data plane and management plane, and different directions like inbound, outbound and both. Service tags can be global or regional. For example, AzureCloud covers all ranges used in Azure public cloud and AzureCloud.WestEurope covers the subset of these ranges used in the West Europe region.

[Service tag-based rules](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions#set-a-service-tag-based-rule) can be used to allow or deny **inbound** traffic to App Service. Common use cases include:

* Azure Traffic Manager health probes, which are covered by the AzureTrafficManager service tag
* Logic Apps, where an API call hosted in an App Service is part of the flow. These can also be regional like LogicApps.SouthEastAsia
* Azure Front Door backend traffic. Used to isolate traffic between the Front Door infrastructure and your App Service. Tag name is AzureFrontDoor.Backend
* Application Insight availability probes using ApplicationInsightsAvailability

Azure portal supports the most common scenarios and for advanced configuration, you can use Azure PowerShell.

### Tried to configure VNet integration via Azure Portal or ARM template, but it failed

[Multi-source rules](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions#multi-source-rules) allow you to define multiple IP address ranges as part of a rule. Each rule can support up to 8 ranges. Use cases for multi-source rules include:

* You need to specify more than 512 ranges for an App Service
* You want to logically group ranges in a rule. For example, both the IPv4 and IPv6 ranges of an internal service
* You want to combine a logical group of ranges with a http header filter

Multi-source rules are currently supported through PowerShell.

### Learn more about VNet integration

In addition to specifying an IP range or service tag, you can also define specific values of http headers that must also be evaluated. Common cases are:

* [Restrict traffic to specific Azure Front Door instance](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions#restrict-access-to-a-specific-azure-front-door-instance) using X-Azure-FDID header
* Isolate traffic from forward proxy to specific client IPs or host names using X-Forwarded-For or X-Forwarded-Host header

Http header filters can be added from Azure portal or through PowerShell.

### What's next?

Within the next few months, we will be adding new flows to allow you to diagnose & solve more networking related issues with this troubleshooter. If you have any questions or feedback, please reach out to our team at diagnostics@microsoft.com
