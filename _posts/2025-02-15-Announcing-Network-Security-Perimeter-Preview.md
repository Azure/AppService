---
title: "Announcing Network Security Perimeter support in public preview"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

In App Service we are starting to roll out support for [Network Security Perimeter](https://learn.microsoft.com/azure/private-link/network-security-perimeter-concepts) (NSP). We are early in the process but wanted to give you a chance to evaluate with a public preview. This blog will give you details of what to expect when you enroll your App Service apps in NSP and understand the limitations and some of the current implications in Azure portal.

## Introduction

Network Security Perimeter is mainly an identity based security enforcement using Managed Identity (MI). When an Azure service is part of a security perimeter and are calling other PaaS services, it will generate a managed identity token and augment it with the associated NSP profile. The target service will then inspect the incoming token and use the NSP profile to determine, based on the rules configured, if access is allowed.

## Securing inbound traffic

Because App Service is hosting your code, we are not able to ensure that the additional claim is added to every interaction with other PaaS services and NSP inbound rules relying on the MI token (currently subscription-based rules) is therefore not supported on App Service. We do support IP-based inbound rules since this is based on good old network isolation. Because of the limitations there may be some situations where you still want to continue to use the native App Service access restriction rules. In NSP terminology know as Resource rules.

when you associate an App Service app with an NSP profile and secures it to the perimeter, we will block incoming traffic and allow only what is allowed through the IP-based inbound rules or through private endpoints. Resource rules will not be evaluated when NSP is enforced.

Comparing NSP inbound rules and App Service native access restrictions

| Feature | Network Security Perimeter | App Service native |
| ------- | -------------------------- | ------------------ |
| IP-based rules                 | Yes | Yes |
| Service tag-based rules        | No  | Yes |
| Service endpoint-based rules   | No  | Yes |
| Http header filters            | No  | Yes |
| Unique scm site rules          | No* | Yes |
| Unique deployment slot rules   | No* | Yes |

\* Support for scm site rules and deployment slot rules is in development and will be added post-GA.

## Securing outbound traffic

App Service is running your code, and as a result we also cannot enforce all aspects of outbound traffic and cannot guarantee that we can block calls to a specific FQDN address (e.g. `www.contoso.com`). NSP outbound FQDN rules are therefore not in effect when associated with an App Service app. Outbound, your secure connectivity will still need to be through network isolation and private endpoints on the dependent resources.

What we do instead when you associate an App Service app with an NSP profile and secures it to the perimeter is to force all outbound traffic through the virtual network and therefore a virtual network integration is mandatory when using NSP.

## Control plane

Our NSP implementation introduces some changes to our ARM API surface, also known as our control plane. Like all other services in Azure, the `PublicNetworkAccess` property will introduce a new value called `SecuredByPerimeter` in addition to `Enabled` and `Disabled`.

We are also revising our network routing flags. Network routing was previously controlled with individual vnetXxxEnabled properties like `vnetImagePullEnabled` and `vnetBackupRestoreEnabled`. Going forward we will have a property called `outboundVnetRouting` that will contain individual "flags" for the different routing options and we are introducing a new `allTraffic` flag that lets you rest asured that all traffic is being routed through the virtual network. The mappings should be logical, but for completeness, the mappings are added as comments.

The new property schema looks like this:

```javascript
{
    "publicNetworkAccess": "Enabled"/"Disabled"/"SecuredByPerimeter",
    "outboundVnetRouting": {
        "allTraffic": true/false
        "applicationTraffic": true/false // vnetRouteAllEnabled
        "imagePullTraffic": true/false // vnetImagePullEnabled
        "contentStorageTraffic": true/false // vnetContentStorageEnabled
        "backupRestoreTraffic": true/false // vnetBackupRestoreEnabled
        "managedIdentityTraffic": true/false // new option
    }
}
```

As mentioned earlier, App Service apps cannot adopt the outbound FQDN rule option in NSP. When an app is secured by perimeter, all traffic will be routed through the virtual network integration and the `allTraffic` routing flag will be forced to true.

## Enabling Network Security Perimeter

The effect of Network Security Perimeter depends on the association access mode and the public network access mode. An app can be "secured by perimeter" by either setting public network access to `SecuredByPerimeter` or by setting the association access mode to `Enforced`. In VNet only mode outbound, the `allTraffic` flag and thereby all other traffic flags are forced to true.

| Association access mode  | Not associated | Learning mode | Enforced mode |
| ------------------------ | -------------- | ------------- | ------------- |
| **Public network access**|                |               |               |
| **Enabled**               | **Inbound**: Native rules <br/> **Outbound**: Allowed | **Inbound**: Native rules and NSP rules <br/> **Outbound**: Allowed | **Inbound**: NSP rules <br/> **Outbound**: VNet only |
| **Disabled**              | **Inbound**: Denied <br/> **Outbound**: Allowed | **Inbound**: NSP rules <br/> **Outbound**: Allowed | **Inbound**: NSP rules <br/> **Outbound**: VNet only |
| **SecuredByPerimeter**    | **Inbound**: Denied <br/> **Outbound**: VNet only | **Inbound**: NSP rules <br/> **Outbound**: VNet only | **Inbound**: NSP rules <br/> **Outbound**: VNet only |

If you want to try it out, start by creating a network security perimeter instance and a profile. You can follow [this tutorial](https://learn.microsoft.com/azure/private-link/create-network-security-perimeter-portal) from the NSP team, but of course create an App Service app instead of a Key Vault.

To apply the inbound rules and forced outbound virtual network routing, either set the association access mode to `Enforced` or the public network access mode of the app to `SecuredByPerimeter`.

## Limitations

1. Network security perimeter is not supported on Free and Shared App Service SKU and Consumption Functions SKU.
1. Diagnostics logging is currently not supported.