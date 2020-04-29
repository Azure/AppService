---
title: "Use ARM templates to swap deployment slots"
author_name: Ruslan Yakushev
excerpt: "You can now use ARM templates to swap deployment slots."
tags:
    - "deployment slots"
---

*A version of this article appeared on [ruslany.net](https://ruslany.net/2019/10/using-arm-template-to-swap-app-service-deployment-slots/)*

Azure Resource Manager (ARM) templates are used to automate deployment and configuration of Azure resources. With the templates you can define the infrastructure to be deployed via a JSON file and then use that file to repeatedly deploy new resources or update existing ones. ARM templates are widely used to release new versions of the Azure web apps and function apps. During a release the new version of an app is deployed to a staging slot and then it is swapped into production. This blog post explains how to automate the App Service deployment slot swap operation with an ARM template.

Let’s assume you have a web app with production and staging deployment slots. When you release a new version of that web app you first would deploy it to the staging slot and then swap it into production slot. To define the swap operation via ARM template you’ll need to use two properties on the “Microsoft.Web/sites” and “Microsoft.Web/sites/slots” resources:

- `buildVersion` – this is a string property which can be set to any arbitrary value that would represent the current version of the app deployed in the slot. For example: “v1“, “1.0.0.1“, “2019-09-20T11:53:25.2887393-07:00“.
- `targetBuildVersion` – this is a string property that is used to specify what version of the app the current slot should have. If the targetBuildVersion is different from the buildVersion then this will trigger the swap operation by finding a slot that has the expected build version and then swapping the site from that slot into the current slot.

With that the process of deploying a new version of an app can be done as follows:

1. Deploy a new version of an app into a staging slot
1. Execute ARM template to update the buildVersion of the app in staging slot
1. Execute ARM template to set the targetBuildVersion on the production slot
1. Here is an example ARM template that demonstrates how to perform steps #2 and #3:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "sites_SwapAPIDemo_name": {
            "defaultValue": "SwapAPIDemo",
            "type": "String"
        },
        "sites_buildVersion": {
            "defaultValue": "v1",
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Web/sites/slots",
            "apiVersion": "2018-02-01",
            "name": "[concat(parameters('sites_SwapAPIDemo_name'), '/staging')]",
            "location": "East US",
            "kind": "app",
            "properties": {
                "buildVersion": "[parameters('sites_buildVersion')]"
            }
        },
        {
            "type": "Microsoft.Web/sites",
            "apiVersion": "2018-02-01",
            "name": "[parameters('sites_SwapAPIDemo_name')]",
            "location": "East US",
            "kind": "app",
            "dependsOn": [
                "[resourceId('Microsoft.Web/sites/slots', parameters('sites_SwapAPIDemo_name'), 'staging')]"
            ],
            "properties": {
                "targetBuildVersion": "[parameters('sites_buildVersion')]"
            }
        }
    ]
}
```

This ARM template is idempotent, meaning that it can be executed repeatedly and produce the same state of the slots. In other words if you re-run the same template with the same parameters after the swap has been performed and targetBuildVersion on production slot matches the buildVersion then it will not trigger another swap.

## Helpful links

- [Documentation for swapping slots with ARM templates](https://docs.microsoft.com/en-us/azure/app-service/deploy-staging-slots#automate-with-arm-templates)
- [App Service quickstarts](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-dotnet)
- [How to get started with slots](https://docs.microsoft.com/en-us/azure/app-service/deploy-staging-slots#add-a-slot)
