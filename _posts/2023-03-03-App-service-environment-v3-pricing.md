---
title: "Estimate your cost savings by migrating to App Service Environment v3"
author_name: "Jordan Selig"
toc: true
---

If you weren't already aware, App Service Environment v1 and v2 is [retiring on 31 August, 2024](https://azure.microsoft.com/updates/app-service-environment-version-1-and-version-2-will-be-retired-on-31-august-2024/). There are many reasons to migrate to App Service Environment v3 including better performance, faster scaling, and reduced overhead since networking dependency management has been greatly simplified. One benefit that stands out that we understand might need some additional explanation is that App Service Environment v3 can be cheaper than previous versions. With the removal of the stamp fee and larger instance sizes per respective SKU with previous versions, App Service Environment v3 can help you do more with less and reduce your monthly spend if you're familiar with the updates.

In this post, we'll go over a couple common scenarios that will help you better understand App Service Environment v3 pricing and how it compares to your pricing model on App Service Environment v1 or v2. We know there are many scenarios out there, so hopefully one of the ones shared here can be used as an example for you to better understand your situation. [The Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) is a great resource and will be referenced throughout this post. Note that estimates here are based on the prices applicable on the day the estimate was created. Actual total estimates may vary. Refer to the [App Service pricing page](https://azure.microsoft.com/pricing/details/app-service/windows/) for the latest information.

> [NOTE!]
> Unless otherwise indicated, all scenarios are calculated using costs based on Linux pricing in East US.

## Basic scenarios

### Scenario 1: Scale down your App Service plans with pay as you go pricing

The App Service plan SKUs available for App Service Environment v3 run on the Isolated v2 tier. This is not to be confused with the tier used by App Service Environment v1 and v2, which is the Isolated tier. Below are the corresponding service plans for each available tier. Notice that for the Isolated v2 tier, the number of cores and amount of RAM is effectively doubled. We'll use this information in this scenario. Additionally, there are [new larger SKUs available with the Isolated v2 tier](https://azure.github.io/AppService/2022/12/01/Announcing-Larger-Isolatedv2-SKUs.html) that were not previously available on the older version.

|Isolated |Cores    |RAM (GB) |         |Isolated v2|Cores    |RAM (GB) |
|---------|---------|---------|---------|-----------|---------|---------|
|I1       |1        |3.5      |&rarr;   |I1v2       |2        |8        |
|I2       |2        |7        |&rarr;   |I2v2       |4        |16       |
|I3       |4        |14       |&rarr;   |I3v2       |8        |32       |
|         |         |         |         |I4v2       |16       |64       |
|         |         |         |         |I5v2       |32       |128      |
|         |         |         |         |I6v2       |64       |256      |

In this scenario, you are currently using an App Service Environment v2 with one I2 plan. You require 2 cores and 7 GB RAM. You are using pay as you go pricing.

On App Service Environment v2, your monthly cost is:

[Stamp fee + 1*(I2) = $991.34 + 1*($416.10) = **$1,407.44**](https://azure.com/e/45f5b42a6f144e448fd78e93afa77e6f)

If you were to migrate this exact workload to App Service Environment v3, you would be able to scale down from I2 to I1v2 since the Isolated v2 equivalent tier has double the cores and RAM. Your monthly cost on App Service Environment v3 would be:

[1*(I1v2) = 1*($281.78) = **$281.78**](https://azure.com/e/b739976aec9a4fec9294500019bef81d)

As you can see, this is a significant cost savings since you were able to use a cheaper tier and the stamp fee is no longer applicable.

### Scenario 2: 3 year reserved instance pricing and savings plan

[Reservations or reserved instance pricing](https://azure.microsoft.com/reservations/) is a discount you can receive if you know what your usage will look like for the next 1 to 3 years. One App Service Environment v2, reservations are supported for the stamp fee. On App Service Environment v3, there is no stamp fee and reservations are supported on the instances themselves.

The following scenario will use the same requirements as Scenario 1, but instead of using pay as you go pricing, you will now use 3 year reserved instance pricing since you know your requirements will stay relatively flat over the next 3 years. With reservations, you can pay upfront or monthly. For ease of comparison between the scenarios, monthly payments will be used.

[Stamp fee + 1*(I2) = $594.77 + 1*($416.10) = **$1,010.87**](https://azure.com/e/062d229d8ccb4f48a6d5415d0a25d3b3)

Notice the 40% reduction in the stamp fee by using reservations. On App Service Environment v3, your monthly cost would be:

[1*(I1v2) = 1*($127.00) = **$127.00**](https://azure.com/e/a5e5c3e3c6b24952b38ad5c0f73317a5)

There's a 55% reduction in the monthly cost as a result of using reserved instance pricing.

[Azure savings plan for compute](https://azure.microsoft.com/pricing/offers/savings-plan-compute/) is another option that is only available on App Service Environment v3. Azure savings plan for compute is a flexible pricing model that provides savings up to 65 percent off pay-as-you-go pricing when you commit to spend a fixed hourly amount on compute services for one or three years.

For this scenario, your savings on App Service Environment v3 with a 3 year savings plan would be:

[1*(I1v2) = 1*($154.98) = **$154.98**](https://azure.com/e/5b2d0d5044854f768191ed502afe8362)

## Advanced scenarios

The first two scenarios were basic and were intended to give you a quick sense of how pricing works on App Service Environment v3. Realistically, you'll have many more instances and probably a combination of the SKUs

### AZ pricing

### various skus

### mulitple ASEs to large SKUs
