---
title: "Announcing Larger SKUs for App Service Environment v3"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

Our engineering teams have been hard at work to deliver the new larger SKUs on App Service Environment v3. While it seems simple, as it is multiples of the existing SKU sizes, we took the opportunity to make some major adjustments, and build a more flexible backend to allow us to introduce more compute options in the future.

All the bits are in progress of rolling out, but we wanted to grant you early access to give it a test run. With the addition of these new Isolated V2 SKUs, this will be the SKUs available for App Service Environment v3.

|  **SKU Name** | **vCPUs** | **Memory** |
|---|---|---|
| I1v2 | 2 vCPUs | 8 GB |
| I2v2 | 4 vCPUs | 16 GB |
| I3v2 | 8 vCPUs | 32 GB |
| I4v2 | 16 vCPUs | 64 GB |
| I5v2 | 32 vCPUs | 128 GB |
| I6v2 | 64 vCPUs | 256 GB |

For now, the new SKUs are available in West Central US. More regions will follow early in the new year.

You will be able to create new plans and scale in the Azure portal starting 10. December, and in addition you can get a sneak peak of the new SKU picker by using this link: [Azure Portal](https://aka.ms/previewlargeskus)

Official Azure CLI support using `az appservice create/update` will be available with the next CLI release (2.43.0) on 6. December. Until the official CLI is released, you can use this command to scale existing App Service plans up to the new SKUs. Note that the command will take about 40 minutes for Windows and 15 minutes for Linux to complete the scale operation:

```bash
az resource update --name <plan name> --set sku.name="I5v2" -g <resource-group-name> --resource-type "Microsoft.Web/serverFarms"
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
