---
title: "App Service PremiumV2 support for older scale units"
tags: 
    - app service plan
author_name: "Christina Compy"
---

# App Service PremiumV2 support for older deployments 

The PremiumV2 hardware tier is now available for older deployments of App Service where it was not previously available. A few years ago Azure App Service began to offer the PremiumV2 App Service plan. The benefits of this new tier were tied to the new hardware that was used for it. The same hardware is used for Free to Standard App Service plans. The new hardware required some changes to the system architecture and was not compatible with our older deployments. This unfortunately left many customers unable to upgrade their plans to PremiumV2. To solve this problem we developed a different way to attach the new PremiumV2 compute just for our older App Service deployments. This solution is now slowly rolling out and is adding the PremiumV2 option where it was previously unavailable.

## Changing IP Addresses

When you scale to PremiumV2 while in a newer App Service deployment, your outbound addresses will change. To help customers that are sensitive to that, the app property called **Additional Outbound IP Addresses** contains all of the outbound addresses that your app can have. This field holds the outbound addresses your app can have while in Free through Standard as well as the addresses it would have while in PremiumV2.

With the new ability to offer PremiumV2 to older deployments of the Azure App Service, both your inbound and outbound IP addresses will change when you scale from Standard or lower to PremiumV2 and back. This means that if you have A records for your app, you will need to update them after you scale. Your app will still be accessible for at least five days from the original address as we relay the inbound traffic to the new address. When you go to scale your app from Standard or lower to PremiumV2, you will be told the new addresses for your app. The same will be true if you scale from PremiumV2 to a lower SKU. 

In order to select the PremiumV2, you need to acknowledge that your inbound and outbound addresses will change as you scale up your App Service plan.  

## Features gained and lost

There is a feature lost and another gained when you scale to PremiumV2 in these older App Service deployments. 

- **Remote debugging**: When you scale your app to PremiumV2, you will no longer be able to use remote debug on your apps. If you scale your App Service plan to a lower SKU, you will be able to use remote debug again.
- **Regional VNet Integration**: When your app is in a PremiumV2 App Service plan, you will be able to use regional VNet Integration. When you scale back down to Standard or lower, you will lose the ability to use the feature. This is different from the newer App Service deployments where you can use regional VNet Integration from Standard and PremiumV2.

## How to scale to PremiumV2

To scale up to PremiumV2, or just to see if you can scale up to PremiumV2, navigate to the **Scale up (App Service plan)** page in your app portal. If you can select any of the PremiumV2 options, you are able to scale to PremiumV2. The user experience will show you your new addresses and request your acknowledgement. If you opt out at this point and come back later, the addresses you would see would be the same for the same app.

![PremiumV2 SKU selection experience]({{ site.baseurl }}/media/2020/03/premiumv2-old-scale-units.png)

## Benefits of PremiumV2

It is important to highlight some of the other benefits of using a PremiumV2 App Service plan.  Those benefits include:

* Cores are over twice as powerful 
* Twice the memory per core as Standard or lower 
* Can scale up to 30 instances
* Will be able to use Private Endpoints
* Can use regional VNet Integration
