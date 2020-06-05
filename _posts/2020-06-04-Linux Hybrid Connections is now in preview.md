---
title: "Linux Hybrid Connections is in public preview"
author_name: "Christina Compy"
category: networking
tags:
    - Networking
---

We are happy to announce public preview of Hybrid Connections for Linux apps. The Hybrid Connections feature has been available for Windows apps for quite a few years and is now available for Windows. The Hybrid Connections feature enables your apps to access TCP endpoints in any network that can make outbound calls to Azure. 

Hybrid Connections don't enable an alternate capability to access your application. For that you should look at Private Endpoints which is also now in preview with App Service. As used in App Service, each Hybrid Connection matches to a single TCP host and port combination. This means that the Hybrid Connection endpoint can be a TCP endpoint on any operating system and any application. There is no awareness in the feature for any application protocols that are used. It provides network access. You can make calls to SQL, a web service or really any TCP socket.

Other integration technologies rely on VPN solutions to connect on-premises systems to the cloud. With Hybrid Connections you can skip all of that and direct access resources without an inbound firewall hole or gateway. The feature is built on top of Azure Relay. It works by you installing a relay agent on a Windows server 2012 or better host. This relay agent, the Hybrid Connection Manager (HCM), must be able to make outbound calls to Azure over port 443 and be able to reach the desired endpoint. 

The feature depends on DNS name lookups to work. In order to ensure that things work, you should use domain names in your Hybrid Connections rather than IP addresses. The DNS name does not need to be in public DNS. It only needs to resolve from the hosts where the HCM is running. 

Due to the nature of how Hybrid Connections works, it is a great solution when others do not fit directly. It provides the fastest way to do dev/test from on-premises in the cloud. 

The feature is supported in Basic, Standard, Premiumv2 and Isolated App Service plans. For more details around Hybrid Connections, start with [App Service Hybrid Connections](https://docs.microsoft.com/azure/app-service/app-service-hybrid-connections)
