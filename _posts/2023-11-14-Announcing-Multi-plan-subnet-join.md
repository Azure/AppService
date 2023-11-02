---
title: "Announcing Multi-plan subnet join"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

Virtual network integration in App Service requires one subnet per App Service plan integration today. If you are working with many App Service plans, managing the subnets can be an unnecessary administrative task. Therefore, I am happy to announce that we are introducing Multi-plan subnet join (MPSJ) in limited public preview at Ignite 2023.

MPSJ reduces subnet sprawl when dealing with many apps across many plans and simplifies management of networking control such as Network Security Groups and Route tables across App Service plans. With MPSJ you can join a virtual network/subnet in a different subscription, but all App Service plan joining a specific subnet must be in the same subscription.

You many still want to use individual subnets if you plan to differentiate on Network Security Group configuration, NAT gateway or other subnet specific configurations.

When using MPSJ you will need to pay extra attention to the subnet size. Each instance from each App Service plan requires one IP address. When scaling up/down, the IP address requirement is still doubled for that specific plan, and when scaling in it may take some time before the IP addresses are released. There is no limit on the number of App Service plans you can join with a single subnet, but you will be limited by the number of available IPs.

MPSJ is initially available in West Central US and France Central. More regions will be added in the coming weeks, and we expect MPSJ to be available in all regions early next year.

We will also be ironing out a few kinks that you currently need to be aware of when testing:

* For GA, the minimum requirement for subnet size will be /26. This is currently not enforced.
* There is currently no validation if the subnet has available IPs, so you might be able to join N+1 plan, but the instances will not get an IP. You can view available IPs in the Virtual network integration page in Azure portal in apps that are already connected to the subnet.
* There is currently no Azure portal support for joining multiple plans. Though when joined, you can configure routing options and disconnect.

You can connect the first plan in Azure portal, but you will currently have to use CLI or ARM to connect apps from subsequent App Service plans. To connect using CLI you need the Azure Resource Id of the subnet:

```bash
az resource update --name <app-name> --resource-type "Microsoft.Web/sites" --resource-group <resource-group-name> --set properties.virtualNetworkSubnetId="/subscriptions/<subcription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>/subnets/<subnet-name>"
```

Azure portal enables virtual network routing of application outbound internet traffic by default, but if you are joining using CLI, you either have to go to the Azure portal afterwards to configure that or you can run this script:

```bash
az resource update --name <app-name> --resource-type "Microsoft.Web/sites" --resource-group <resource-group-name> --set properties.vnetRouteAllEnabled=true
```

### Questions/Feedback

If you have any questions or feedback, please reach out to me - madsd(at)microsoft.com
