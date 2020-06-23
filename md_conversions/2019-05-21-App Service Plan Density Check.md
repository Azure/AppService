---
layout: single
title: "App Service Plan Density Check"
author: "Khaled Zayed"
tags: app service, azure app service, app service plan, high cpu, web app, high memory, self-help, troubleshooting
---

App Service Plans define the compute resource assigned to run your App Service. The pricing tier of your App Service Plan determines the compute power and features you get... the higher the tier, the more features and compute power are available. To find out which features are supported in each pricing tier, see [App Service Plan details](https://azure.microsoft.com/en-us/pricing/details/app-service/plans/).

When you deploy multiple App Services in the same App Service Plan, they all share the underlying compute resources. If your App Service Plan has more than the recommended number of apps, the apps will compete for the same set of resources. This will cause high CPU and memory that could result in availability and performance issues.

## How to verify the App Service Plan density

In order to verify if your apps are possibly competing for resources, run the App Service Plan Density check detector by following these steps:

1. From the Azure Portal, go to one of your Apps
2. Go to the "Diagnose and solve problems" blade
3. In the search bar, you can search for "Best Practices for Availability & Performance" to run multiple checks on your app or search for "App Service Plan density check" to run this check only

You will see one of the following notifications.

- Your plan is within the recommended value

    ![green]({{site.baseurl}}/media/2019/05/Green.JPG)

- Your plan is nearing exhaustion

    ![red]({{site.baseurl}}/media/2019/05/red.png)

## Recommended Solutions

1. Stop apps to decrease load

    In the description, the detector will recommend stopping a number of apps to be within the recommended number of apps on the respective pricing tier. The number may actually be lower depending on how resource intensive the hosted applications are, however as a general guidance, you may refer to the table below.

    Worker Size | Max sites
    ----------- | ---
    Small       | 8
    Medium      | 16
    Large       | 32

    > Note: An **active slot** is also classified as an **active app** as it too is competing for resources on the same App Service Plan.

1. Scale up your App Service Plan

    If your App Service Plan is on a Small/Medium tier, scaling up the plan will move the apps to a higher compute power with better CPU and memory. If you are not running on a Pv2 plan, Pv2 features Dv2-series VMs with faster processors, SSD storage, and double memory-to-core ratio compared to Standard.

    ![scale]({{site.baseurl}}/media/2019/05/scale.png)

1. Split Apps in multiple App Service Plans

    If you have other App Service Plans that have been created in the same Resource Group and Region, you can move your app to one of those plans and decrease the load.

    ![change]({{site.baseurl}}/media/2019/05/change.png)

1. Alternatively, you can migrate your app to a new App Service Plan by following the instructions below
    1. Create a new App Service Plan in the same resource group and location.
    1. Select a pricing tier that fits the performance and feature needs for your application.
    1. Navigate to the application in the Azure Portal whose app service plan you want to change.
    1. Select the "Change App Service Plan" tab from the left sidebar menu.
    1. Choose the newly created App Service Plan (created in Step 2).

Feel free to post any questions about App Service Plan Density Checks on the [MSDN Forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=windowsazurewebsitespreview).