---
title: "How to Use Availability Zones with Public Multi-tenant App Service"
author_name: "Jordan Selig"
category: networking
toc: true
---

App Service is in the process of rolling out support for deploying into Availability Zones (AZ) for public multi-tenant App Service (i.e. **not** App Service Environments (ASE) - AZ is already supported in GA for ASEv3 (preferred solution), and supported in limited form on ASEv2 - see [Availability Zone support for App Service Environments](https://docs.microsoft.com/azure/app-service/environment/zone-redundancy)).

## Availability Zone Overview

...Zone redundant applications will continue to run and serve traffic even if other zones in the same region suffer an outage.

## Requirements

AZ support, otherwise known as zone redundancy, is a property of the App Service Plan. The following are the current requirements/limitations for enabling zone redundancy:

- Both Windows and Linux are supported
- Requires either **Pv2** or **Pv3** SKUs
- Minimum instance count of 3
  - The platform will enforce this minimum count behind the scenes if you specify an instance count fewer than 3. This is due to the platform automatically spreading these VMs across 3 zones when zone redundancy is enabled.
- **Only supported on Virtual Machine Scale Sets (VMSS) based App Service scale units**
- Can be created in any of the following regions:
  - region1
  - region2
- Zone redundancy can only be specified when creating a **new** App Service Plan
  - **Currently can not convert pre-existing App Service Plans**
- Must be created using [ARM templates](https://docs.microsoft.com/azure/azure-resource-manager/templates/)

## How to Deploy a Zone Redundant App Service

Zone redundant App Services must be created using [ARM templates](https://docs.microsoft.com/azure/azure-resource-manager/templates/). Once created via an ARM template, the App Service Plan can be viewed and interacted with via the Azure Portal as well as CLI tooling. Creation via CLI and Portal is expected by September. An ARM template is only needed for the initial creation of the App Service Plan.

The only changes needed in an ARM template to specify a zone redundant App Service are the new ***zoneRedundant*** property and the App Service Plan instance count (i.e. ***capacity***). The ***zoneRedundant*** property should be set to ***true*** and ***capacity*** should be set based on the workload requirement, but no less than 3. Choosing the right capacity varies based on a number of factors as well as high availability/fault tolerance strategies, however a good rule of thumb is to ensure sufficient instances for the application such that losing one Zone of instances leaves sufficient capacity to handle expected load.

> [!Tip]
> This is a sample for how you would decide instance capacity:
>
> Since the platform spreads VMs across 3 zones and you need to account for at least the failure of 1 zone, multiply peak workload instance count by a factor of zones/(zones-1), or 3/2.
>
>> Customer's peak workload requires 4 instances
>>
>> Provision 6 instances: (2/3rd * 6 instances) == 4 instances

In the case of a zone down situation, the App Service platform (VM live-ness checks) will detect lost instances and automatically attempt to find new instances to replace the ones that were lost. Note that if auto-scale is also configured, and if it decides more instances are needed, auto-scale will also issue a request to App Service to add more instances (auto-scale behavior is independent of App Service platform behavior). **It is important to note that there is no guarantee that requests for additional instances in a zone-down scenario will succeed since it's likely you, and every customer in the region, are all competing for VMs to backfill what was lost.** The recommended solution is to over-provision app service plans to account for losing a zone as described previously.

The ARM template snippet below shows the new ***zoneRedundant*** property and ***capacity*** specification.

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2018-02-01",
    "name": “your-appserviceplan-name-here",
    "location": “West US 3",
    "sku": {
        "name": "P1v3",
        "tier": "PremiumV3",
        "size": "P1v3",
        "family": "Pv3",
        "capacity": 3
    },
    "kind": "app",
    "properties": {
        "zoneRedundant": true
    }
  }
]
```

For details on how to deploy ARM templates, see [this doc](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code?tabs=CLI). For App Service ARM quickstarts, visit [this](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web) GitHub repo.

## Important Consideration

AZ support...