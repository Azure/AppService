---
title: "Generally available: Enhanced network security features for App Service Basic SKU"
author_name: "Jordan Selig"
category: networking
---

App Service now supports [VNet integration](https://docs.microsoft.com/azure/app-service/overview-vnet-integration) (outbound) and [private endpoints](https://docs.microsoft.com/azure/app-service/networking/private-endpoint) (inbound) all the way down to the [Basic SKU](https://azure.microsoft.com/pricing/details/app-service/linux/). The App Service VNet integration feature enables your apps to access resources in or through a virtual network but doesn't grant inbound private access to your apps. For inbound access, you need private endpoints, which allow clients located in your private network to securely access your apps over Private Link, which eliminates exposure from the public internet.

With this update, you can use our lower-cost tiers and achieve the same level of security that you could previously only achieve with our high-end SKUs. Note that if you want to downgrade an existing App Service Plan and still use VNet integration, you need to be on the newer App Service footprint to ensure you’re App Service Plan supports VNet integration for Basic SKU. For more details, see the VNet integration [limitations](https://docs.microsoft.com/azure/app-service/overview-vnet-integration#limitations).

Learn how to enable [virtual network integration](https://docs.microsoft.com/azure/app-service/configure-vnet-integration-enable).

Learn how to [connect to a web app using an Azure Private endpoint](https://docs.microsoft.com/azure/private-link/tutorial-private-endpoint-webapp-portal).
