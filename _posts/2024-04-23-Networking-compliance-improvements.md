---
title: "Improvements to controlling networking configurations"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

Networking as part of an application architecture continues to grow and we have seen and heard a need to invest in more control and insights. Networking involves joining a network and controlling routing of networking. You may already have seen some of the improvements we have made to the [user experience in Azure portal](), but we have also been making changes to the backend to help help control and ensure compliance of networking configurations. In this blog post I'll go through some changes you will see light up in the next 3-6 months.

## Policy compliance

Azure policy is a popular way to audit desired configurations and even modify or deny specific configurations. In App Service you have configurations in site properties, site config properties and app settings. App settings does not allow for policy auditing or control and site config properties only allow for auditing and reactive modification. Only site properties allow the full suite of Azure policy control. To allow full Policy compliance configuration we have been introducing site property equivalents to some important networking app settings such as `WEBSITE_VNET_ROUTE_ALL`, `WEBSITE_CONTENTOVERVNET`, `WEBSITE_PULL_IMAGE_OVER_VNET`, `WEBSITE_DNS_SERVER` and [other DNS related settings](https://learn.microsoft.com/azure/app-service/overview-name-resolution#configuring-dns-servers).

All these properties have been introduced as site properties, including a new property for controlling backup/restore. The [app settings](https://learn.microsoft.com/azure/app-service/overview-vnet-integration#routing-app-settings) continue to work, but the site properties will take precedence. Here is the overview of the settings:

```javascript
{
    "properties":
    {
        "vnetRouteAllEnabled": true/false,
        "vnetImagePullEnabled": true/false,
        "vnetContentShareEnabled": true/false,
        "vnetBackupRestoreEnabled": true/false,
        "dnsConfiguration":
        {
            "dnsServers": [],
            "dnsAltServer": "",
            "dnsRetryAttemptCount": 3,
            "dnsRetryAttemptTimeout" 30,
            "dnsMaxCacheTimeout": 1
        }
    }
}
```

Historically, we have also had two of the networking settings in site config properties, namely `vnetRouteAllEnabled` and `publicNetworkAccess`. Again, because of the limitations to control via policy, we have been introducing these properties as site properties. For a while they have been modifiable in both places, but we will start enforcing that you can only modify the setting using the site property and you may see an error message like this: "SiteConfig.PublicNetworkAccess cannot be modified. Please modify the Site.PublicNetworkAccess property". If you see this error you will need to update your scripts or templates to use the site property equivalent.

## Simplify configuration

It can be difficult to maintain an overview of the `vnetXxxEnabled` properties or controlling routing and as new features are added to App Service, we will be introducing new properties. To help simplify the configuration, we will also be introducing a new property called `outboundVnetRouting` which will capture all of the above settings and introduce a new "all traffic" setting if you just want both existing and new traffic to travel over the virtual network. When introducing new properties, we will be announcing them and will be giving you a few months to adapt your configurations before enabling it under "all traffic". If all traffic is enabled, individual routing configurations will be ignored. Initially, the schema will look like this:

```javascript
{
    "properties":
    {
        "outboundVnetRouting":
        {
            "allTraffic": true/false,
            "applicationTraffic": true/false,
            "contentShareTraffic": true/false,
            "imagePullTraffic" true/false,
            "backupRestoreTraffic": true/false
        }
    }
}
```

## Permissions needed

When modifying certain networking configurations, you need permissions on the linked resource. Examples of this is when joining a virtual network by setting the `virtualNetworkSubnetId` property you need _subnet/join/action_ permission on the subnet you are joining, or adding access restrictions rules with service endpoints enabled you need _subnet/joinViaServiceEndpoint/action_ permission on the subnet in addition to the permission to change the site itself. Whenever these configurations exist, they are currently revalidated on every update of the site, even if you are modifying something different. This is also something we have been working on improving and will slowly be changing the behavior to only validate the permission if the property changes.

## Roadmap

We hope all of these improvements makes your work with networking in App Service easier. We are always looking for ways to improve. Feel free to give feedback through comments here or through the docs/portal feedback channels.
