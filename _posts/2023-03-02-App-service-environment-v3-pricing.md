---
title: "Estimate your cost savings by migrating to App Service Environment v3"
author_name: "Jordan Selig"
toc: true
toc_sticky: true
---

If you weren't already aware, App Service Environment v1 and v2 is [retiring on 31 August, 2024](https://azure.microsoft.com/updates/app-service-environment-version-1-and-version-2-will-be-retired-on-31-august-2024/). There are many reasons to [migrate to App Service Environment v3](https://aka.ms/asemigration) including better performance, faster scaling, and reduced overhead since networking dependency management has been greatly simplified. One benefit that stands out that we understand might need some additional explanation is that App Service Environment v3 is often cheaper than previous versions. With the removal of the stamp fee and larger instance sizes per respective SKU with previous versions, App Service Environment v3 can help you do more with less and reduce your monthly spend if you're familiar with the updates.

In this post, we'll go over a couple common scenarios that will help you better understand App Service Environment v3 pricing and how it compares to your pricing model on App Service Environment v1 or v2. We know there are many scenarios out there, so hopefully one of the ones shared here can be used as an example for you to better understand your situation. [The Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) is a great resource and will be referenced throughout this post for each scenario. Note that estimates here are based on the prices applicable on the day the estimate was created. Actual total estimates may vary. For the most up-to-date estimate, click the link for each scenario. Refer to the [App Service pricing page](https://azure.microsoft.com/pricing/details/app-service/windows/) for more information.

> NOTE: Unless otherwise indicated, all scenarios are calculated using costs based on Linux $USD pricing in East US. The payment option is set to monthly to simplify cost comparisons.

## Basic scenarios

### Scenario 1: Scale down your App Service plans with pay-as-you-go pricing

The App Service plan SKUs available for App Service Environment v3 run on the Isolated v2 tier. This is not to be confused with the tier used by App Service Environment v1 and v2, which is the Isolated tier. Below are the corresponding service plans for each available tier. Notice that for the Isolated v2 tier, the number of cores and amount of RAM is effectively doubled. We'll use this information in this scenario. Additionally, there are [new larger SKUs available with the Isolated v2 tier](https://azure.github.io/AppService/2022/12/01/Announcing-Larger-Isolatedv2-SKUs.html) that were not previously available on the older version.

|Isolated |Cores    |RAM (GB) |         |Isolated v2|Cores    |RAM (GB) |
|:-------:|:-------:|:-------:|:-------:|:---------:|:-------:|:-------:|
|I1       |1        |3.5      |&rarr;   |I1v2       |2        |8        |
|I2       |2        |7        |&rarr;   |I2v2       |4        |16       |
|I3       |4        |14       |&rarr;   |I3v2       |8        |32       |
|         |         |         |         |I4v2       |16       |64       |
|         |         |         |         |I5v2       |32       |128      |
|         |         |         |         |I6v2       |64       |256      |

In this scenario, you are using an App Service Environment v2 with 1 I2 plan. You require 2 cores and 7 GB RAM. You are using pay-as-you-go pricing.

On App Service Environment v2, your monthly cost is:

[Stamp fee + 1(I2) = $991.34 + $416.10 = **$1,407.44**](https://azure.com/e/45f5b42a6f144e448fd78e93afa77e6f)

If you were to migrate this exact workload to App Service Environment v3, you would be able to scale down from I2 to I1v2 since the Isolated v2 equivalent tier has double the cores and RAM. Your monthly cost on App Service Environment v3 would be:

[1(I1v2) = **$281.78**](https://azure.com/e/b739976aec9a4fec9294500019bef81d)

As you can see, this is a significant cost savings since you were able to use a smaller tier and the stamp fee is no longer applicable. If you don't scale down after migrating to v3, you will be over-provisioned and incur unnecessary charges, some of which may make your App Service Environment v3 more expensive than your old environment.

### Scenario 2: 3 year reserved instance pricing and savings plan

[Reservations or reserved instance pricing](https://azure.microsoft.com/reservations/) is a discount you can receive if you know what your usage will look like for the next 1 to 3 years. On App Service Environment v2, reservations are supported for the stamp fee. On App Service Environment v3, there is no stamp fee and reservations are supported on the instances themselves.

The following scenario will use the same requirements as Scenario 1, but instead of using pay-as-you-go pricing, you will now use 3 year reserved instance pricing since you know your requirements will stay relatively flat over the next 3 years. With reservations, you can pay upfront or monthly. For ease of comparison between the scenarios, monthly payments will be used.

[Stamp fee + 1(I2) = $594.77 + $416.10 = **$1,010.87**](https://azure.com/e/062d229d8ccb4f48a6d5415d0a25d3b3)

Notice the 40% reduction in the stamp fee by using reservations. On App Service Environment v3, your monthly cost would be:

[1(I1v2) = **$127.00**](https://azure.com/e/a5e5c3e3c6b24952b38ad5c0f73317a5)

There's a 55% reduction in the monthly cost as a result of using reserved instance pricing.

[Azure savings plan for compute](https://azure.microsoft.com/pricing/offers/savings-plan-compute/) is another option that is only available on App Service Environment v3. Azure savings plan for compute is a flexible pricing model that provides savings up to 65 percent off pay-as-you-go pricing when you commit to spend a fixed hourly amount on compute services for one or three years.

For this scenario, your cost on App Service Environment v3 with a 3 year savings plan would be:

[1(I1v2) = **$154.98**](https://azure.com/e/5b2d0d5044854f768191ed502afe8362)

![]({{ site.baseurl }}/media/2023/03/scale-down-asp.png)

### Scenario 3: Break even point

So far we've demonstrated the ways migrating to App Service Environment v3 can save you money. However, there are some cases where this may not be the case. Let's take for example you have an App Service Environment v2 with a single I1 instance and you're using pay-as-you-go pricing. Your monthly cost would be:

[Stamp fee + 1(I1) = $991.34 + $208.05 = **$1,199.39**](https://azure.com/e/ac89a70062a240e1b990304052d49fad)

If you migrate this environment to v3, your monthly cost would be:

[1(I1v2) = **$281.78**](https://azure.com/e/4c247282128746898ef4cfe1ef0f1070)

This is a significant cost reduction, just know that you're now over-provisioned since you now have double the cores and RAM, which you may not need. This is not an issue since the new environment is so much cheaper. However, when you start to have many I1 instances in a single App Service Environment, for example because you use this environment for dev or test workloads across multiple different apps and teams, you need to consider the break even point if you migrate to App Service Environment v3.

For this scenario, your App Service Environment v2 has 14 I1 instances. Because of how your environment is being used by your team, you can not reduce the number of instances or use a larger instance that has the same effective capacity. Your monthly cost is:

[Stamp fee + 14(I1) = $991.34 + $2,912.70 = **$3,904.04**](https://azure.com/e/bd1dce4b5c8f4d6d807ed3c4ae78fcae)

A migration of this environment to v3 would lead to the following monthly cost:

[14(I1v2) = **$3,944.92**](https://azure.com/e/750b78d9e34a43dc9c8c8c400d4628bf)

As you can see, your App Service Environment v3 is slightly more expensive than your v2. As you start adding more I1 instances, and therefore need more I1v2 instances when you migrate, the difference in price becomes even more significant and your v3 will get more and more expensive than your v2. Unfortunately, if you're in this situation, you may have to plan for a higher monthly cost.

> NOTE: This calculation was done with Linux $USD prices in East US. Break even points will vary due to prices variances in the various regions. For an estimate that reflects your situation, see [the Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

The following chart visually depicts the break even point where App Service Environment v3 becomes more expensive than v2. If you need more than 13 of our smallest instance offering, you fall into this scenario. There may be other scenarios where this is also the case.

![]({{ site.baseurl }}/media/2023/03/scale-down-asp.png)

## Advanced scenarios

The first three scenarios were basic and were intended to give you a quick sense of how pricing works on App Service Environment v3. Realistically, you'll have many more instances and probably be using a combination of the SKUs. The following scenarios will give you a better sense of the cost saving opportunities for these use cases.

### Scenario 4: SKU mix

To accommodate various app types in your App Service Environment v2, you use a combination of the tiers in various quantities. The first estimate will be using pay-as-you-go pricing, and the second will use a 3 year reservation on the stamp fee.

[Stamp fee + 20(I1) + 10(I2) + 5(I3) = $991.34 + $12,483.00 = **$13,474.34**](https://azure.com/e/6139e2a572ab4d82a263278e08f61eaa)

With a 3 year reservation, this becomes:

[Stamp fee + 20(I1) + 10(I2) + 5(I3) = $594.77 + $12,483.00 = **$13,077.77**](https://azure.com/e/087b3549856945a1b620ad58ccced0c6)

You can start to see here that as you consume more resources, the reservations available on App Service Environment v2 don't significantly reduce monthly costs since they only apply to the stamp fee.

On App Service Environment v3, you require the same respective core and RAM capacity. There are various paths you can take here depending on your specific requirements - you can keep the same number of instances and just scale them down, or you can reduce the total number instance you are using. For this scenario, we'll do the following:

- 20 I1 &rarr; 10 I1v2
- 10 I2 &rarr; 10 I1v2
- 5 I3 &rarr; 5 I2v2

With pay-as-you-go pricing, this would be:

[20(I1v2) + 5(I2v2) = **$8,453.40**](https://azure.com/e/5ee52694f6e041f2aebfc34d2f14416f)

And with a 3 year reservation:

[20(I1v2) + 5(I2v2) = **$3,809.98**](https://azure.com/e/61f8c3d76fef4352a59164204bef3a19)

At this point, you're reducing your costs by over 70%. This is where the cost saving benefits of App Service Environment v3 really start to become significant. Even if you were to use pay-as-you-go pricing, you still see cost savings in the form of thousands of dollars per month.

![]({{ site.baseurl }}/media/2023/03/sku-mix.png)

### Scenario 5: Migration to App Service Environment v3 using the migration feature

The [migration feature](https://aka.ms/asemigration) was developed to automate the migration of App Service Environments to v3. It's an in-place migration, meaning it uses the same subnet your current environment is in. During the migration, your current environment is deleted and an App Service Environment v3 is spun up. All of your Isolated instances are automatically converted to their Isolated v2 counterparts (for example I2 is converted to I2v2). Since the Isolated v2 instances are larger, you'll be over-provisioned if you're still expecting the same traffic volume. This is a direct scenario where you have the opportunity to scale your instances down similar to what was done in [Scenario 4](#scenario-4-sku-mix).

To keep things consistent, we'll keep the requirements for this scenario the same as [Scenario 4](#scenario-4-sku-mix). Your capacity requirements will not change after migration. Prior to migrating, your monthly pay-as-you-go cost is:

[Stamp fee + 20(I1) + 10(I2) + 5(I3) = $991.34 + $12,483.00 = **$13,474.34**](https://azure.com/e/6139e2a572ab4d82a263278e08f61eaa)

Immediately after migrating using the migration feature, your instances have been converted and you have the following leading to a higher monthly cost than what you had on App Service Environment v2.

- 20 I1 &rarr; 20 I1v2
- 10 I2 &rarr; 10 I2v2
- 5 I3 &rarr; 5 I3v2

[20(I1v2) + 10(I2v2) + 5(I3v2) = **$16,906.80**](https://azure.com/e/6d6230900cba4e5d9c0e117b75ed5b91)

You're significantly over-provisioned, so you scale down and immediately reduce your monthly cost by over 50%.

- 20 I1v2 &rarr; 10 I1v2
- 10 I2v2 &rarr; 10 I1v2
- 5 I3v2 &rarr; 5 I2v2

[20(I1v2) + 5(I2v2) = **$8,453.40**](https://azure.com/e/5ee52694f6e041f2aebfc34d2f14416f)

You should plan how you will scale down prior to migrating to ensure you don't get hit with unexpected costs due to being over-provisioned. You'll be able to scale down immediately after the migration finishes.

![]({{ site.baseurl }}/media/2023/03/migration-feature.png)

### Scenario 6: reduce total number of App Service Environments

App Service Environments are a great choice for customers that need to scale beyond the limits of the App Service public multi-tenant offering of 30 App Service plan instances. But even the 200 instance limit with App Service Environments may not be enough for some customers. In that case, they need to create multiple App Service Environments.

For this scenario, you have 3 App Service Environment v2s all at max capacity with 200 I3 instances in each. Your monthly cost with pay-as-you-go pricing is:

[3(Stamp fee + 200(I3)) = **$505,268.04**](https://azure.com/e/7d160cd7d861450bad0c999f7ba19b5b)

With App Service Environment v3, you have a couple options for how to proceed. You can continue using 3 App Service Environment v3s and just scale down to a smaller SKU, or you can reduce the number of environments by taking advantage of the new larger SKUs.

Keeping the same number of environments would lead to a monthly cost with pay-as-you-go pricing of:

[3(200(I2v2)) = **$338,136.00**](https://azure.com/e/be4cb53de4ba4f3c8c64795cba0f1d34)

This would be further reduced if you were to use a reservation or savings plan.

If you wanted to reduce the total number of App Service Environments, this would be possible by using the larger SKUs that are only offered on App Service Environment v3. In addition to the potential cost savings you would see by reducing your instance counts and number of environments, you would also realize additional cost savings in the form of overhead since management would be over fewer resources. At the time of writing this blog post, the larger SKUs are not available for estimates in the Azure pricing calculator, so samples will be given instead.

For this scenario, the requirement is to have the equivalent of 600 I3 instances, or 2400 cores and 8,400 GB RAM. With App Service Environment v3, this can be accomplished with a single App Service Environment with 38 I6v2 instances. The pay-as-you-go monthly cost would be:

38(I6v2) = 38($9,016.96) = **$342,644.48**

This is just over the cost of the maintaining 3 App Service Environment v3s, but this doesn't take into account the extra overhead involved in managing multiple resources. With 3 year reserved instance pricing, this monthly cost would be reduced significantly.

38(I6v2) = 38($3,831.055) = **$145,580.09**

![]({{ site.baseurl }}/media/2023/03/reduce-number-ase.png)

## Zone redundant App Service Environment v3 pricing

[Zone redundant App Service Environment](https://learn.microsoft.com/azure/reliability/migrate-app-service-environment) deployments are only supported on App Service Environment v3. There is no additional charge for enabling zone redundancy if you have more than 9 instances. These 9 instances can be made up of any combination of the available SKUs. For example, you can have 9 I1v2s or 3 I1v2s, 3 I2v2s, and 3 I3v2s. You will only be charged for those 9 instances.

If you enable zone redundancy, and if your environment has fewer than 9 total instances, you'll be charged the difference if the form of a minimum instance fee which uses the Windows I1v2 instance price. For example, if you have a zone redundant App Service Environment v3 with 3 Linux I3v2 instances, you will be charged for those 3 I3v2 instances at the standard Linux rate, plus 6 Windows I1v2 instances.
