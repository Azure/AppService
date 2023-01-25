---
title: "Announcing Larger SKUs for App Service Environment v3"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

Our engineering teams have been hard at work to deliver the new larger SKUs on App Service Environment v3. While it seems simple, as it is multiples of the existing SKU sizes, we took the opportunity to make some major adjustments, and build a more flexible backend to allow us to introduce more compute options in the future.

All the bits are in progress of rolling out, but we wanted to grant you early access to the first complete regions to give it a test run. With the addition of these new Isolated V2 SKUs, this will be the SKUs available for App Service Environment v3.

|  **SKU Name** | **vCPUs** | **Memory** |
|---|---|---|
| I1v2 | 2 vCPUs | 8 GB |
| I2v2 | 4 vCPUs | 16 GB |
| I3v2 | 8 vCPUs | 32 GB |
| I4v2 | 16 vCPUs | 64 GB |
| I5v2 | 32 vCPUs | 128 GB |
| I6v2 | 64 vCPUs | 256 GB |

For now, the new SKUs are available in the following regions:

* West Central US
* North Central US
* East US
* East US 2
* West US
* West US 2
* Canada East
* Brazil South
* Australia Central 2
* Australia Southeast
* Southeast Asia
* Japan West
* Korea Central
* Korea South
* Central India
* West India
* South India
* North Europe
* Germany North
* Germany West Central
* France Central
* Sweden South
* UK South
* UAE North

More regions will follow in the next few weeks.

You can create new plans and scale in the Azure portal with the new SKUs. The new SKUs are not available if you create both App Service Environment and plan as part of creating a new app. Prices may also not be visible in all regions, but are 2x increments as shown in this screenshot.

![Larger SKUs on App Service Environment in Azure portal]({{site.baseurl}}/media/2022/12/ase-larger-skus-portal.png){: .align-center}

Download the latest Azure CLI (2.43.0) to have support for the new SKUs using `az appservice create/update`. Note that the command will take about 40 minutes for Windows and 15 minutes for Linux to complete the create/update operation:

```bash
az appservice plan create/update --name <plan name> --sku I5v2 -g <resource-group-name> -e <ase-name or resource-id>
```

To deploy a new plan or update an existing plan using ARM, you can simply just specify the new SKU names. If you use the template below, just replace the values prefixed with REPLACE. For the `reserved` property, true = Linux, false = Windows.

```javascript
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {
        "appServicePlanName": "REPLACE-PLAN-NAME",
        "appServicePlanSize": "I4v2",
        "appServicePlanInstanceCount": 1,
        "location": "[resourceGroup().location]",
        "appServiceEnvironmentResourceId": "/subscriptions/REPLACE-SUB-ID/resourceGroups/REPLACE-RG-NAME/providers/Microsoft.Web/hostingEnvironments/REPLACE-ASE-NAME"
    },
    "resources": [
        {
            "name": "[variables('appServicePlanName')]",
            "type": "Microsoft.Web/serverfarms",
            "apiVersion": "2021-03-01",
            "location": "[variables('location')]",
            "properties": {
                "reserved": true,
                "hostingEnvironmentProfile" :{
                    "id": "[variables('appServiceEnvironmentResourceId')]"
                }
            },
            "sku": {
                "name": "[variables('appServicePlanSize')]",
                "capacity": "[variables('appServicePlanInstanceCount')]"
            }
        }
     ]
}
```

We will update this blog post as regions become available. Looking forward to see what you will do with all that power!

### Questions/Feedback

If you have any questions or feedback, please reach out to our team at [AppServiceEnvPM@microsoft.com](mailto:appserviceenvpm@microsoft.com)
