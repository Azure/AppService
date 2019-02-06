---
layout: post
title:  "The Zend Z-Ray debugging feature will be discontinued in Azure App Service on June 7, 2019"
categories: update
---

# The Zend Z-Ray debugging feature will be discontinued in Azure App Service on June 7, 2019

The **Z-Ray PHP debugging** feature will soon be discontinued in App Service. This shouldn’t affect the App Service service-level agreement (SLA) or the runtime behavior of your applications.

Beginning March 9, 2019, Z-Ray will no longer be available for purchase in the Azure portal. If you already have applications configured with Z-Ray, you may continue to use it until June 7, 2019. After that date, the Z-Ray feature will be removed from all applications and you’ll no longer be charged for it.

## Have you configured Zend Z-Ray for your app?

Even though no action is required for customers that have configured Zend Z-Ray for the app, you can look for instances of Zend Z-Ray using the [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/) and one of the following sample scripts:

**Azure Powershell**
```poweshell
Get-AzResource -ResourceType Microsoft.Web/sites/premieraddons `
   | Where-Object {$_.name -like '*/zray*'} `
   | Select-Object Name,ResourceGroupName,ResourceType
```

**Azure CLI**
```bash
az resource  list --query "[?contains(name, 'zray') && type=='Microsoft.Web/sites/premieraddons'].{Name:name, RG:resourceGroup, Type:type}" --output table
```

## Manually Removing Zend Z-Ray debugging

Once you have identified Zend Z-Ray instances in your subscription you can manually delete them using the portal.

1. Browse to the **Resource Group** containing the Zend Z-Ray instance.
1. Enable the **Show Hidden Types** option.
1. Select the Zend Z-Ray instance using the checkbox associated with this item.
1. Click on **Delete** in the Resource Group **command bar**
1. Confirm the action.

Once the Zend Z-Ray resource has been manually deleted any monthly charges associated with it will also stop.

[![Delete Z-Ray]({{ site.baseurl }}/media/2019/02/delete-z-ray.png "Delete Z-Ray")]({{ site.baseurl }}/media/2019/02/delete-z-ray.png)