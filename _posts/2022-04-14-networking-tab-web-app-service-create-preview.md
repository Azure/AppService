---
title: "Public preview: Networking configuration options during Web App creation in the Azure Portal"
author_name: "Jordan Selig"
category: networking
---

We are happy to announce that you can now enable [Virtual Network integration](https://docs.microsoft.com/azure/app-service/overview-vnet-integration) as well as [private endpoints](https://docs.microsoft.com/azure/app-service/networking/private-endpoint) for inbound access when creating Web Apps using the Azure Portal. Previously, you had to use the Azure CLI/PowerShell or ARM to configure these features when creating your apps.

Web Apps can be provisioned with an inbound address that is public to the internet or isolated to an Azure virtual network. Web Apps can also be provisioned with outbound traffic that is able to reach endpoints in a virtual network, be governed by network security groups, or be restricted by virtual network routes. Use the new Networking tab to configure these features when creating your apps so you can ensure a secure configuration from the start!

![Web App creation Networking tab sample]({{site.baseurl}}/media/2022/04/web-app-networking-tab.png)
