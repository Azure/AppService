---
title: "App Service Environment v3 march to GA"
category: networking
author_name: "Christina Compy"
---

The App Service Environment v3 (ASEv3) has been in preview since November 2020. During this time it was made available across most regions, received numerous small improvements and was generally very well received.  Before GA we will be releasing the GA version into preview.  After that update completes, you will be able to make new preview ASEv3's that replace the private endpoint with an address in the ASE subnet. Also before GA, the preview versions that already exist will be upgraded.  

## Upcoming changes

The GA version of ASEv3 has a few enhancements that were not available earlier in preview. Some of the highlights include:

- You will be able to deploy an external VIP ASE. This would be an ASE with a public address for inbound traffic.
- Maximum ASE instance count is 200. This is similar to ASEv2 where the maximum App Service plan instance count will be 100 and that the total number of instances across all App Service plans is 200
- You will be able to deploy a zone redundant ASEv3.
- Scaling times are improved from earlier in the preview
- Your ASE will only require use of one subnet

## Upgrade of preview ASEv3 instances 

If you have a preview version of ASEv3 before the upgrade to the GA version, you need to know that the upgrade to the final GA version will:

- Cause downtime to your ASEv3
- Change the inbound address to your ASEv3

The downtime to your ASEv3 happens as we remove the private endpoint used by your ASEv3 and redeploy the ASEv3 with an internal load balancer instead.  The use of the load balancer is completely internal to the ASE.  This is a one time event and there are no other expected system downtime events.

With the removal of the private endpoint to your ASEv3, your inbound address will change from the current private endpoint address to an address in your ASE subnet.  You will need to update DNS to reflect this.  Even if you are using Azure DNS private zones, it will not automatically pick this change up and it must be done manually.  After your ASEv3 is upgraded to the load balancer version:

- Go into your ASE portal page and select the IP addresses UI
- Change your DNS records that pointed to the private endpoint address to instead point to the new inbound address shown in the portal. 

To tell if your preview ASEv3 was upgraded to the GA release candidate, go into the ASE portal and look at the IP addresses UI. You will no longer see private endpoint listed for the inbound address. You will see the Virtual IP is set to internal.  

## GA limitations

While there are numerous improvements with ASEv3 over earlier versions, there are a few things that are not available at GA.  Those items that are not available include:

- IP based SSL
- Remote debug
- FTP
- SMTP
- Network Watcher and NSG Flow

## Upgrade from ASEv2

Upgrade from ASEv2 will come after GA.  In the first version of the upgrade you will be able to upgrade an ASEv2 that is either an external VIP ASEv2 or an internal VIP ASEv2 that has a domain suffix of .appserviceenvironment.net.  Initially it will not support internal ASEs with custom domain suffixes nor will it offer the ability initially to upgrade your ASEv2 to being a zone redundant ASEv3.  

