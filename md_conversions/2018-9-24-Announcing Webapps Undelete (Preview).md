---
title: "Announcing Webapps Undelete (Preview)"
author_name: Ahmed Elnably
layout: post
hide_excerpt: true
---
      [Ahmed Elnably](https://social.msdn.microsoft.com/profile/Ahmed Elnably)  9/24/2018 10:42:08 AM  Azure App Service Undelete now in public preview
================================================

 Today we are announcing the public preview release of Azure App Service Undelete. Undelete is available for all App Service Plans, from Basic and up. Only sites deleted in the past 30 days can be restored. A user can undelete a deleted web app, and restore the following:  - The content of the deleted app.
 - The configuration of the app (the commands allows to skip the restoration of the app configuration).
 - The undelete commands will also to restore the *.azurewebsites.net host name if still available.
  Currently the undelete commands support the restoration of apps deleted from the multi-tenant using Windows and Linux, other services like App Service Environments and Azure Functions will be supported in later releases. To get started, install the [PowerShell module](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps?view=azurermps-6.9.0#install-the-azure-powershell-module) or install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest). Azure CLI
---------

 ### [List deleted apps](https://docs.microsoft.com/en-us/cli/azure/webapp/deleted?view=azure-cli-latest#az-webapp-deleted-list)

 You can list deleted apps using the following command, you can use the optional parameters to filter the apps with a specific name, belong to a specific resource group or App Service plan. Record the id of the deleted site as that will be used to restore the app. az webapp deleted list --name <name of the deleted app> ### [Restore a deleted app](https://docs.microsoft.com/en-us/cli/azure/webapp/deleted?view=azure-cli-latest#az-webapp-deleted-restore)

 In CLI you need to have an existing app or an app slot to restore your app to az webapp deleted restore --deleted-id <id of the deleted app> --name <name of the app to restore to> --resource-group <resource group of the app to restore to>   Azure PowerShell
----------------

 ### [List deleted apps](https://docs.microsoft.com/en-us/powershell/module/azurerm.websites/get-azurermdeletedwebapp?view=azurermps-6.9.0)

 You can list deleted apps using the following command, you can use the optional parameters to filter the apps with a specific name, belonging to a specific resource group. Get-AzureRmDeletedWebApp -name <name of the deleted app>  ### [Restore a deleted app](https://docs.microsoft.com/en-us/powershell/module/azurerm.websites/restore-azurermdeletedwebapp?view=azurermps-6.9.0)

 In PowerShell, you can specify the name and resource group of the deleted app, and provide the information of the target app. You can specify an App Service plan name to restore to, and the command will try and restore the app with the same *.azurewebsites.net hostname as the deleted app. Restore-AzureRmDeletedWebApp -ResourceGroupName <deleted app rg> -Name <deleted app name> -TargetAppServicePlanName <App Service plan name to create an app to restore to>      