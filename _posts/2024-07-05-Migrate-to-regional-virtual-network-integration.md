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
| Co-connect to virtual network with Express Route | Yes | No   |
| Connect directly to virtual network in different region | Only through global peerings | Yes |

## How does it work

