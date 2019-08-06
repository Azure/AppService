---
title: "Restore App Service domains within 30 days"
author_name: Elle Tojaroon
excerpt: "If the domain was deleted within the past 30 days, you restore it by re-creating the resource under the same subscription and resource group."
tags:
    - App Service Domains
---

If you deleted your [App Service Domain](https://docs.microsoft.com/en-us/azure/app-service/manage-custom-dns-buy-domain#buy-the-domain) resource within the past 30 days, you can easily restore it by purchasing it again with the same Domain Registration Subscription and resource group. Unlike trying to purchase the domain name from other subscriptions or resource groups, the validation will allow you to purchase the same domain name.

## Clarifications

* App Service Domains are domains that were purchased from Azure App Service. Domains added to App Service websites are **custom domains**. These are different resources.

* If your App Service Domain was deleted because you deleted the domain registration subscription, we do not support restoring the domain in any circumstance.
