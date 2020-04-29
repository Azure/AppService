---
layout: post
title: "App Service plan Density Check"
author: "Khaled Zayed"
tags: app service, azure app service, app service plan, high cpu, web app, high memory, self-help, troubleshooting
---

App Service plan defines the compute resource assigned to run your App Service. The pricing tier of your App Service plan determines the compute power and features you get, the higher the tier, the more features and compute power are available. To find out which features are supported in each pricing tier, see [App Service plan details](https://azure.microsoft.com/en-us/pricing/details/app-service/plans/).

When you deploy multiple App Services in the same App Service plan, they all share the underlying compute resources. If your App Service plan has more than the recommended number of apps, the apps will compete for the same set of resources. This will cause high CPU & memory that could result in availability and performance issues.

## How to verify the App Service plan density

In order to verify if your apps are possibly competing for resources, run the App Service plan Density check detector by following these steps:
<br>1) From the Azure Portal, go to on of your Apps
<br>2) Go to the "Diagnose and solve problems" blade
<br>3) In the search bar, you can search for "Best Practices for Availbility & Performance" to run multiple checks on your app or search for "App Service plan Density check" to run this check only

You will see one of the following:
<br>1) Your plan is within the recommended value
![green]({{site.baseurl}}/media/2019/05/green.JPG)
<br>2) Your plan is nearing exhaustion
![red]({{site.baseurl}}/media/2019/05/red.png)

## Recommended Solutions
<b>1) Stop apps to decrease load</b><br>
In the description, the detector will recommend stopping a number of apps to be within the recommended number of apps on the respective pricing tier. The number may actually be lower depending on how resource intensive the hosted applications are, however as a general guidance, you may refer to the table below.

Worker Size | Max sites
---|---
Small | 8
Medium | 16
Large | 32

<i><strong>Note :</strong> An <u>active slot</u> is also classified as an <u>active app</u> as it too is competing for resources on the same App Service Plan.</i><br>
<br>
<b>2) Scale up your App Service plan</b><br>
If your App Service plan is on a Small/Medium tier, scaling up the plan will move the apps to a higher compute power with better CPU and memory. If you are not running on a Pv2 plan, Pv2 features Dv2-series VMs with faster processors, SSD storage, and double memory-to-core ratio compared to Standard.
![scale]({{site.baseurl}}/media/2019/05/scale.png)
<br><br>
<b>3) Split Apps in multiple App Service plans</b><br>
If you have other App Service plans that have been created in the same Resource Group and Region, you can move your app to one of those plans and decrease the load. <br>
![change]({{site.baseurl}}/media/2019/05/change.png)

Alternatively, you can follow these steps to create an App Service plan that will be able to move your app to:
<br>a) Create a new App Service Plan in the same resource group and location
<br>b) Select a pricing tier that fits the performance and feature needs for your application.
<br>c) Navigate to the application in the Azure Portal whose app service plan you want to change.
<br>d) Select the "Change App Service Plan" tab from the left sidebar menu.
<br>e) Choose the newly created App Service Plan (created in Step 2).

Feel free to post any questions about App Service plan density check on the [MSDN Forum](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=windowsazurewebsitespreview).


