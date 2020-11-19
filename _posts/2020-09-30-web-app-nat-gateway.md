---
title: 'NAT Gateway and app integration'
author_name: "Christina Compy"
date: "2020-11-15"
category: networking
---

The Azure App Service has quite a few networking integration capabilities but, until now, did not support a dedicated outbound address. We are very happy to say that now you can use a [NAT Gateway](https://docs.microsoft.com/azure/virtual-network/quickstart-create-nat-gateway-portal) with your web app in the Azure App Service.  

The NAT Gateway solves another problem beyond providing a dedicated internet address. You can also now have 64k outbound SNAT ports usable by your apps. One of the challenges in the App Service is the limit on the number of connections you can have to the same address and port. There are more details on this problem in the [Troubleshooting intermittent outbound connection errors](https://docs.microsoft.com/azure/app-service/troubleshoot-intermittent-outbound-connection-errors) guide. 

To use a NAT Gateway with your app, you need to

- Configure Regional Vnet Integration with your app as described in [Integrate your app with an Azure virtual network](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet)
- Route all the outbound traffic into your Azure virtual network
- Provision a NAT Gateway in the same virtual network and configure it with the subnet used for VNet Integration 

![nat gateway with web app]({{ site.baseurl }}/media/2020/11/natgw-webapp.png){: .align-center}

After these changes have been made, the calls made by your app to the internet will go out the NAT Gateway. You can alternatively use an Azure Firewall if you want to control egress by FQDN but it won't give you the 64k outbound SNAT ports.  

To use a NAT Gateway you need to use Regional VNet Integration. To use Regional VNet Integration your app needs to be in a Standard, Premium V2 or Premium V3 App Service plan. This feature will work with Function apps as well as web or API apps. There are some Standard App Service plans that can't use Regional VNet Integration as they are in older App Service deployments. 
