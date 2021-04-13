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

This flow will start by running the following checks on your app:
* VNet integration health
* Networking configuration checks

If an issue is found, the troubleshooter will display the issue along with recommended next steps to you:
![Issue found]({{site.baseurl}}/media/2021/04/NT-checks.png)


If everything looks healthy or just a warning insights was discovered, the flow will continue to ask for an endpoint to test connectivity to. You can use a hostname:port or IP:port combination to test the connectivity. Please note that this is just a tcpping from your app's instance to the specific endpoint. The connection could succeed on a tcp level, but you might still be facing issues executing http requests for example. The troubleshooter will make that clear to you along with recommendations:
![Endpoint test]({{site.baseurl}}/media/2021/04/NT-connectivity.png)

### Tried to configure VNet integration via Azure Portal or ARM template, but it failed

If you attempted to connect your app to a subnet and it failed and would like to get more information, this flow will help you with this. You can select the VNet/subnet combo that you're attempting to connect to, and the tool will give you an insight if the integration will succeed or not along with a detailed explanation.
![Test VNET]({{site.baseurl}}/media/2021/04/NT-testVNet.png)


### Learn more about VNet integration

In addition to specifying an IP range or service tag, you can also define specific values of http headers that must also be evaluated. Common cases are:

* [Restrict traffic to specific Azure Front Door instance](https://docs.microsoft.com/azure/app-service/app-service-ip-restrictions#restrict-access-to-a-specific-azure-front-door-instance) using X-Azure-FDID header
* Isolate traffic from forward proxy to specific client IPs or host names using X-Forwarded-For or X-Forwarded-Host header

Http header filters can be added from Azure portal or through PowerShell.

### What's next?

Within the next few months, we will be adding new flows to allow you to diagnose & solve more networking related issues with this troubleshooter. If you have any questions or feedback, please reach out to our team at  [diagnostics@microsoft.com](mailto:diagnostics@microsoft.com)
