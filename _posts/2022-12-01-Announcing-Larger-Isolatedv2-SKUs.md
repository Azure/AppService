---
title: "Announcing Larger SKUs for App Service Environment v3"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

Our engineering teams have been hard at work to deliver the new larger SKUs on App Service Environment v3. While it seems simple, as it is multiples of the existing SKU sizes, we took the opportunity to make some major adjustments, and build a more flexible backend to allow us to introduce more compute options in the future.

All the bits are in progress of rolling out, but we wanted to grant you early access to give it a test run. With the addition of these new Isolated V2 SKUs, this will be the SKUs available for App Service Environment v3.

|  **SKU** | **vCPU** | **Memory** |
|---|---|---|
| I1v2 | 2 | 8 |
| I2v2 | 4 | 16 |
| I3v2 | 8 | 32 |
| I4v2 | 16 | 64 |
| I5v2 | 32 | 128 |
| I6v2 | 64 | 256 |

For now, the new SKUs are available in West Central US. More regions will follow early in the new year.

You will be able to create new plans and scale in the Azure portal starting 10. December, and in addition you can get a sneak peak of the new SKU picker by using this link: [**Azure Portal**](https://aka.ms/previewlargeskus)

Official Azure CLI support using `az appservice create/update` will be available with the next CLI release (2.43.0) on 6. December. Until the official CLI is released, you can use this command to scale existing App Service plans up to the new SKUs. Note that the command will take about 40 minutes for Windows and 15 minutes for Linux to complete the scale operation:

```bash
az resource update --name <plan name> --set sku.name="I5v2" -g <resource-group-name> --resource-type "Microsoft.Web/serverFarms"
```

We will update this blog post as regions become available. Looking forward to see what you will do with all that power!

### Questions/Feedback

If you have any questions or feedback, please reach out to our team at [AppServiceEnvPM@microsoft.com](mailto:appserviceenvpm@microsoft.com)
