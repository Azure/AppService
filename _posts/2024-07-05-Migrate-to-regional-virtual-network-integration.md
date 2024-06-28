---
title: "Migrate to regional virtual network integration"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

Many years ago we introduced a new network integration technology called regional virtual network integration. Internally it goes under the code name "swift" and you may also see this various places in the APIs. Since this now accounts for ~99 % of our integrations, this is now just known as [virtual network integration](https://learn.microsoft.com/azure/app-service/overview-vnet-integration).

A small subset of customers are still using gateway-based virtual network integration. As the name suggests, this integration technology requires a gateway in the virtual network and there is a cost associated with running that. Comparing the two technologies, there are multiple advantages to using regional virtual network integration:


|          | Regional| Gateway-based |
| -------- | :------------: | :------------: |
| Gateway required | Yes   |  No   |
| Bandwidth limit | VM limit |  SSTP Point-to-site VPN limit |
| Connect up to  | 2 subnets per plan | 5 virtual networks per plan  |
| Route tables, NSG, NAT gateway support | Yes |  No |
| OS Support | Windows, Linux and Windows Container  | Windows only  |
| Access service endpoints |  Yes | No  |
| Resolve network protected Key Vault app settings |  Yes | No  |
| Co-connect to virtual network with Express Route | Yes | No |
| Connect directly to virtual network in different region | Only through global peerings | Yes |

As you can see from the above list, there are many advantages of using or moving to use regional virtual network integration. If your current scenario is connecting apps from many regions to a central virtual network, the transition might require setting up additional virtual networks and peerings, but if you are connecting to a network in the same region, the migration is straight forward.

## Migration path and planning

Migrating from gateway-based to regional virtual network integration is a simple disconnect/connect operation. Before making the switch, make sure you have a subnet configured for your apps. You can either have one per plan or take advantage of the new multi-plan subnet join feature to connect apps from different plans to the same subnet. You should spend a little time planning your subnet address range. The general recommendation is to have double the IPs as the expected maximum planned instances of your plan(s). You should also delegate the subnet(s) to `Microsoft.Web/serverFarms`.

## Post configurations

After moving to regional virtual network integration you now have some new options you can take advantage of. You can decide if configuration options like backup/restore and image pull for container based workloads should be [routed through the virtual network](https://learn.microsoft.com/azure/app-service/overview-vnet-integration#configuration-routing). You can also define Network Security Groups or User Defined Routes for the individual subnets and you can increase SNAT ports and get a deterministic outbound public source IP by attaching a NAT gateway to the subnet.