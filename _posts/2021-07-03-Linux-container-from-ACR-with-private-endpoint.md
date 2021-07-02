---
title: "Linux custom container from Azure Container Registry with private endpoint"
author_name: "Mads Damgård"
category: networking
toc: true
toc_sticky: true
---

Securing access to your site is one thing, but securing access to the source of your site is equally important.

In this article I will walk you through setting up a Linux Web App with secure, network-isolated access to the container registry.

The scenario is intentionally kept simple to focus on the architecture and configuration; but with a practical purpose I find it more easy to relate to. The backend services can be extended with the many other services supporting Private Endpoint like Azure SQL, Cosmos DB, App Configuration, and even another App Service Web Apps or Functions by following the same pattern.

![ACR pull over private endpoint]({{site.baseurl}}/media/2021/07/linux-container-acr-pe.png){: .align-center}

This guide is organized into four steps:

1. Create network infrastructure
2. Set up ACR
3. Create network integrated Web App
4. Pull from private registry

In closing, there are sections on alternative approaches, advanced scenarios, and FAQ.

## Getting Started

This is the third article in a series focusing on network security. If you missed the first two, you can find them here:

- [Deploying a secure, resilient site with a custom domain](https://azure.github.io/AppService/2021/03/26/Secure-resilient-site-with-custom-domain.html)
- [Deploying a site with secure backend communication](https://azure.github.io/AppService/2021/03/26/Secure-resilient-site-with-custom-domain.html)

This article will also use Azure CLI executed in bash shell on WSL to set up the environment. It could be done using Azure portal, Resource Manager templates or Azure PowerShell. CLI was chosen as I find it easier to follow and explain the individual steps and configurations needed.

**Remember** in the scripts to replace all the resource names that need to be unique. This would be the name of the Web App and Azure Container Registry. You may also change location if you want something closer to home. All other changes are optional.

## 1. Create Network Infrastructure

First set up a Resource Group with a Virtual Network. The VNet should have at least two subnets. One for the VNet Integration and one for the private endpoints. The address-prefix size must be at least /28 for both subnets; small subnets can affect scaling limits and the number of private endpoints. Go with /24 for both subnets if you are not under constraints.

```bash
az group create --name secureacrsetup --location westeurope
az network vnet create --resource-group secureacrsetup --location westeurope --name secureacr-vnet --address-prefixes 10.0.0.0/16
```

For the subnets, there are two settings that we need to pay attention to. This is often set by the portal or scripts, but here it is called out directly. [Delegation](https://docs.microsoft.com/azure/virtual-network/subnet-delegation-overview) "Microsoft.Web/serverfarms" informs the subnet that it is reserved for VNet Integration. For private endpoint subnets you need to [disable private endpoint network policies](https://docs.microsoft.com/azure/private-link/disable-private-endpoint-network-policy):

```bash
az network vnet subnet create --resource-group secureacrsetup --vnet-name secureacr-vnet --name vnet-integration-subnet --address-prefixes 10.0.0.0/24 --delegations Microsoft.Web/serverfarms
az network vnet subnet create --resource-group secureacrsetup --vnet-name secureacr-vnet --name private-endpoint-subnet --address-prefixes 10.0.1.0/24 --disable-private-endpoint-network-policies
```

The last part of the network infrastructure is the Private DNS Zone. The zone is used to host the DNS records for private endpoint allowing the Web App to find the container registry by name. Go [here for a primer on Azure Private Endpoints](https://docs.microsoft.com/azure/private-link/private-endpoint-overview) and [go here for how DNS Zones fits into private endpoints](https://docs.microsoft.com/azure/private-link/private-endpoint-dns).

Create the Private DNS Zone:

```bash
az network private-dns zone create --resource-group secureacrsetup --name privatelink.azurecr.io
```

Link the zone to the VNet:

```bash
az network private-dns link vnet create --resource-group secureacrsetup --name acr-zonelink --zone-name privatelink.azurecr.io --virtual-network secureacr-vnet --registration-enabled false
```

... and now the core network setup is done.

## 2. Set Up Azure Container Registry

In this section, we will set up the Azure Container Registry account. We will also create the private endpoint and configure the service to block public traffic. First create the service. We need Premium SKU to enable private endpoint:

```bash
az acr create --resource-group secureacrsetup --name secureacr2021 --location westeurope --sku Premium --public-network-enabled false
```

Next, let's create the private endpoints to connect the backend services to the VNet. Get the Resource ID of the registry and store it in a variable:

```bash
acr_resource_id=$(az acr show --name secureacr2021 --query id --output tsv)
```

Create the private endpoint:

```bash
az network private-endpoint create --resource-group secureacrsetup --name secureacr-pe --location westeurope --connection-name secureacr-pc --private-connection-resource-id $acr_resource_id --group-id registry --vnet-name secureacr-vnet --subnet private-endpoint-subnet
```

... and create a DNS Zone Group. This will create the DNS record for the private endpoint in the DNS Zone (and remove it if the private endpoint is deleted):

```bash
az network private-endpoint dns-zone-group create --resource-group secureacrsetup --endpoint-name secureacr-pe --name secureacr-zg --private-dns-zone privatelink.azurecr.io --zone-name privatelink.azurecr.io
```

Everything is locked down now and you cannot even get to the ACR repositories through the Azure portal. In the ACR Networking blade you can add the public IP of your client if you need to view the registries (images) and other IPs needed to to push an image from remote clients.

## 3. Create Network Integrated Web App

Now we get to creating the actual Web App. To use VNet Integration we need at least the Standard SKU, and then there are a few commands to configure the integration and ensure correct application routing for the scenario:

```bash
az appservice plan create --resource-group secureacrsetup --name secureacrplan --sku P1V3 --is-linux
az webapp create --resource-group secureacrsetup --plan secureacrplan --name secureacrweb2021
az webapp update --resource-group secureacrsetup --name secureacrweb2021 --https-only
az webapp vnet-integration add --resource-group secureacrsetup --name secureacrweb2021 --vnet secureacr-vnet --subnet vnet-integration-subnet
az webapp config set --resource-group secureacrsetup --name secureacrweb2021 --generic-configurations '{"vnetRouteAllEnabled": true}'
```

As a last step in this section we need to generate a Managed Identity, grant this identity pull permissions on the ACR. We will reuse the Resource ID variable from a previous step. Go back up if you missed that. The identity command can directly assign permissions as part of the command, so we will grant the Web App "AcrPull" permissions:

```bash
az webapp identity assign --resource-group secureacrsetup --name secureacrweb2021 --scope $acr_resource_id --role  'AcrPull'
```

You can now browse to the Web App and all **outbound** traffic from the Web App will be routed through the VNet.

## 4. Pull from private registry

All the infrastructure is now in place and we just need a custom container to glue it all together. You might get in conflict with the ACR firewall again. If you are using docker locally, you will need to allow your local IP. If you are running the build from somewhere else, this location will also need access to the registry. 

I will create a simple static html site, add it to an nginx container and use ACR Tasks to build the container:

```bash
mkdir source
cd source
echo '<h1>Hello pull from secure Azure Container Registry</h1>' > index.html
echo -e 'FROM nginx\nCOPY index.html /usr/share/nginx/html' > Dockerfile

# Using ACR Tasks
az acr build --registry secureacr2021 --image privateweb/site:v1 --file .

# Using docker daemon on local machine
az acr login --name secureacr2021
docker build -t privateweb/site:v1 .
docker tag privateweb:v1 secureacr2021.azurecr.io/privateweb/site:v1
docker push secureacr2021.azurecr.io/privateweb/site:v1
```

Finally update the Web App to use the private image:

```bash
az webapp config appsettings set --resource-group secureacrsetup --name secureacrweb2021 --settings 'WEBSITE_PULL_IMAGE_OVER_VNET=true'
az webapp config set --resource-group secureacrsetup --name secureacrweb2021 --linux-fx-version 'DOCKER|secureacr2021.azurecr.io/privateweb/site:v1'
```

## Azure portal

Notes on configuring in portal...

## FAQ

**Q: Can I apply the same steps to a Function App?**

You will need a Premium Elastic plan to use VNet Integration with Function Apps.
