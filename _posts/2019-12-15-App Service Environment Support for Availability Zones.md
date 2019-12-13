---
title: "App Service Environment Support for Availability Zones"
author_name: "Stefan Schackow"
tags:
    - "App Service Environment"
    - "Availability Zones"
---

App Service has GA'd App Service Environment (ASE) support for deploying into Availability Zones (AZ).  Customers can choose to optionally deploy internal load balancer (ILB) ASEs into a specific AZ (Zone 1, 2 or 3) within an Azure region, and the resources used by that ILB ASE will either be pinned to the specified AZ, or deployed in a zone redundant manner.  

An ILB ASE that is explicitly deployed into an AZ is considered a zonal resource because the ILB ASE is pinned to a specific zone. The following ILB ASE dependencies will be located (pinned) in the specified zone:

- the internal load balancer IP address of the ASE
- the compute resources used by the ASE to manage and run web applications

The remote file storage for web applications deployed on a zonal ILB ASE uses Zone Redundant Storage (ZRS), though this is an internal implementation detail of zonal ILB ASEs.

Note that unless the steps described in this article are followed, ILB ASEs are not automatically deployed in a zonal manner.  Furthermore only ILB ASEs support availability zones - external facing ASEs (i.e. ASEs that have a public IP address for accepting website traffic) currently do not support zone pinning.

Zonal ILB ASEs can be created in any of the following regions:

- Central US
- East US
- East US 2
- East US 2 (EUAP)
- France Central 
- Japan East
- North Europe
- Southeast Asia
- UK South
- West US 2

Applications deployed on a zonal ILB ASE will continue to run and serve traffic on that ASE even if other zones in the same region suffer an outage.  However it is possible that non-runtime behaviors, including application service plan scaling, as well as application creation, configuration and publishing may still be impacted in the event of an outage in other availability zones.  The zone-pinned deployment of a zonal ILB ASE only ensures continued uptime for already deployed applications and the underlying network infrastructure and virtual machines running those applications.

Zonal ILB ASEs must be created using ARM templates.  Once a zonal ILB ASE is created via an ARM template, it can be viewed and interacted with via the Azure Portal as well as CLI tooling.  An ARM template is only needed for the initial creation of a zonal ILB ASE.

The only change needed in an ARM template to specify a zonal ILB ASE is the new ***zones*** property.  The ***zones*** property should be set to a value of 1, 2 or 3 depending on the logical availability zone that the ILB ASE should be pinned to.

The ARM template snippet below shows the new ***zones*** property specifying that the ILB ASE should be pinned to zone 2.

```json
"resources": [
  {
     "type": "Microsoft.Web/hostingEnvironments",
     "kind": "ASEV2",
     "name": "yourASENameHere",
     "apiVersion": "2015-08-01",
     "location": "your location here",
     "zones": [
        "2"
     ],
     "properties": {
        "name": "yourASENameHere",
        "location": "your location here",
        "ipSslAddressCount": 0,
        "internalLoadBalancingMode": "3",
        "dnsSuffix": "contoso-internal.com",
        "virtualNetwork": {
           "Id": "/subscriptions/your-subscription-id-here/resourceGroups/your-resource-group-here/providers/Microsoft.Network/virtualNetworks/your-vnet-name-here",
           "Subnet": "yourSubnetNameHere"
        }
     }
  }
]
```

In order to attain end-to-end zone resiliency for apps created on a zonal ILB ASE, customers need to deploy at least two zonal ILB ASEs - with each ILB ASE being pinned to a different zone.  Customers must then create and publish copies of their application onto each of the zonal ILB ASEs.

Customers will also  need to deploy a load balancing solution upstream of the zonal ILB ASEs so that traffic bound for an application is load-balanced and distributed across all of the zonal ILB ASEs.  The recommended solution is to deploy a zone redundant Application Gateway upstream of the zonal ILB ASEs.  More details on Application Gateway v2 and its zone redundant configuration is available [here](https://docs.microsoft.com/en-us/azure/application-gateway/application-gateway-autoscaling-zone-redundant).
