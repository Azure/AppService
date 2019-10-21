---
author_name: Nick B. King
layout: post
hide_excerpt: true
---
      [Nick B. King](https://social.msdn.microsoft.com/profile/Nick B. King)  5/7/2018 10:54:00 AM  Azure App Service Snapshots now in public preview
=================================================

 Today we are announcing the public preview release of Azure App Service Snapshots. Snapshots are automatic periodic backups available for Premium SKU web apps. Snapshots are managed internally by Azure App Service and provide reliable, hassle-free backups of your web apps. Snapshots contain both the contents of a web app and the web app configuration. At least 1 snapshot will be available every 6 hours for the past 30 days. Within the past 7 days, usually 1 snapshot will be available per hour. Accessing snapshots in the Azure Portal
---------------------------------------

 Snapshots can be listed and restored in the Azure Portal from the Backups settings of the web app. [![]({{ site.baseurl }}/media/2018/05/snapshots-blade-portal-1024x691.png)]({{ site.baseurl }}/media/2018/05/snapshots-blade-portal.png) How to list snapshots
---------------------

 ### Azure CLI

 az webapp config snapshot list -g <resource group> -n <app name> ### Azure Powershell

 $snapshotRgName = <resource group> $snapshotAppName = <app name> $snapshotAppSlot = <slot name> Get-AzureRmWebAppSnapshot -ResourceGroupName $snapshotRgName -Name $snapshotAppName How to restore a snapshot
-------------------------

 Snapshots can be restored to the original web app, a slot of the web app, or any other web app in the same App Service Plan. While the restore operation is in progress, the web app will be stopped. **It is strongly recommended to restore snapshots to a new slot instead of overwriting an existing slot in order to prevent data loss if the restore operation is unsuccessful.** Snapshots contain both web app files and web app settings. You can choose to restore files only, or to restore the settings as well. All settings contained in regular backups are also contained in snapshots. However, some settings, like hostnames, certificates, and backup schedules, will not be restored with a snapshot. ### Azure CLI

 Snapshot commands for Azure CLI are currently available as extensions. To install the extension, run az extension add -n webapp If the extension is already installed, update it with az extension update -n webapp *Restore a snapshot from the production slot to a new slot named SnapshotSlot* az webapp deployment slot create -g <resource group> -n <name> -s SnapshotSlot az webapp config snapshot list -g <resource group> -n <app name> az webapp config snapshot restore -g <resource group> -n <name> -t <snapshot timestamp> -s SnapshotSlot --restore-config --source-resource-group <resource group> --source-webapp-name <name> ### Azure Powershell

 Snapshot cmdlets were added in Azure Powershell 6.0. Follow these instructions to update Azure Powershell if the snapshot cmdlets are not found. <https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps?view=azurermps-6.0.0> *Restore a snapshot from the production slot to a new slot named SnapshotSlot* $snapshotRgName = <resource group> $snapshotAppName = <app name> $snapshotAppSlot = <slot name> $snapshots = Get-AzureRmWebAppSnapshot -ResourceGroupName $snapshotRgName -Name $snapshotAppName -Slot $snapshotAppSlot # Create a new slot for the restore operation - highly recommended to prevent data loss! $targetSlotName = "SnapshotSlot" New-AzureRmWebAppSlot -ResourceGroupName $snapshotRgName -Name $snapshotAppName -Slot $targetSlotName # Restore the first snapshot in the list to the new slot. Restore both the configuration and files. $snapshots[0] | Restore-AzureRmWebAppSnapshot -ResourceGroupName $snapshotRgName -Name $snapshotAppName -Slot $targetSlotName -RecoverConfiguration -Force Learn More
----------

 <https://docs.microsoft.com/en-us/Azure/app-service/app-service-web-restore-snapshots>     