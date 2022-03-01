---
title: "Migrating your Windows container apps from the Premium Container SKU (Preview) to Premium V3 SKU"
author_name: "Jeff Martinez"
toc: true
toc_sticky: true
tags:
    - windows containers
    - docker
---

App Service’s Windows container feature on Premium Container SKU will not be moving out of Preview status.  If you want to continue running your Windows container workloads you’ll need to migrate your Windows container applications to Premium V3 which is SLA backed and supports Windows containers GA.  In addition to GA support for Windows containers, Premium V3 provides enhanced performance for production applications, vNet connectivity and new pricing options, including Dev / Test, Pay G, 1-year and 3-year reserved instances.  See additional details [here](https://docs.microsoft.com/azure/app-service/app-service-configure-premium-tier).

If you have an application that is using the Premium Container SKU (Preview) and you would like to move to the new Premium V3 SKU, you'll need to copy and re-deploy your application to a Premium V3 App Service Plan.  The following is an example on how to do this with PowerShell. 

This tutorial uses Az.Accounts and Az.Websites PowerShell modules. Follow the instructions [here](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-7.2.0#installation) before starting to install the modules.


You will need your:
- Subscription ID: "< subscription-id >"
- Resource Group: "my-pc-resource-group"
- Web App Name: "my-pc-web-app"


 1. To get started you will first need to connect your Azure account

```cli
Connect-AzAccount
```
  2.	Then, set your subscription in PowerShell to the context of your Web App

```cli
Set-AzContext -Subscription "<subscription_id>" 
```
 
## Copy your Premium Container site
Next, copy the Premium Container site information into a PowerShell variable. You will use this variable when you clone the app

```cli
$myPCApp = Get-AzWebApp -ResourceGroupName "my-pc-resource-group" --Name "my-pc-web-app"
```

## Create your Premium V3 App Service Plan
Create the new App Service Plan that your site will be cloned to. Be sure to use the ''--hyper-v'' parameter so it will support your Windows container workload. Here you will also define your new resource group and app name.
```cli
az appservice plan create --resource-group "my-pv3-resource-group" --name "my-pv3-app-service-plan" --hyper-v --location "East US" --sku p1v3 --subscription 
<subscription-id>

```
## Clone your Premium Container application to the new Premium V3 App Service Plan
Use the following PowerShell command to clone your existing Premium Container app to your Hyper-V enabled Premium V3 App Service Plan. Here you will use the $myPCApp variable defined earlier as your -SourceWebApp value.
```cli
New-AzWebApp -ResourceGroupName "my-pv3-resource-group" -Name "my-pv3-app" -Location "East US" -AppServicePlan "my-pv3-app-service-plan" -SourceWebApp $myPCApp
```
After running this command you should now have your cloned Premium Container application in a new Premium V3 App Service Plan.

### Resources

1.	[Configure Premium V3 tier for Azure App Service](https://docs.microsoft.com/azure/app-service/app-service-configure-premium-tier)
2.	[Migrate .NET apps to Azure](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/migrate-modernize-net-applications-with-azure/ba-p/1696499)
3.	[Windows Containers on ASEv3](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/what-s-new-in-azure-app-service-fall-ignite-2021-edition/ba-p/2901581)
4.	[Windows Containers GA](https://azure.microsoft.com/updates/app-service-announces-general-availability-of-windows-container-support/)

