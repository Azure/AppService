---
title: "What's new for Azure App Service in Azure CLI 2.92.0"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

[Azure CLI 2.92.0](https://learn.microsoft.com/cli/azure/release-notes-azure-cli#november-03-2026) restores the established `appServicePlanId` field in `az webapp show` and `az webapp list` output. This fixes a regression that affected scripts and queries that use the field to identify a web app's App Service plan.

**Compatibility note:** These commands no longer return `serverFarmId`. If you adapted your automation to use that field, change your queries back to `appServicePlanId` when upgrading.

## Find your web app's App Service plan again

The affected releases returned `serverFarmId` instead of `appServicePlanId`, so queries written against the established output could return no plan ID. Version 2.92.0 restores `appServicePlanId` and removes `serverFarmId` from the web app output.

Get the plan resource ID for an existing web app:

```bash
az webapp show \
  --resource-group <resource-group> \
  --name <web-app> \
  --query appServicePlanId \
  --output tsv
```

To see the plan associated with each web app in a resource group:

```bash
az webapp list \
  --resource-group <resource-group> \
  --query "[].{name:name,appServicePlanId:appServicePlanId}"
```

Use the full `appServicePlanId` value when passing the plan resource ID to other automation. The standard `--output table` view continues to display the plan name rather than its full resource ID.

This is a CLI output compatibility fix, not a change to your web app's plan assignment. The existing command syntax is unchanged. See the [web app command reference](https://learn.microsoft.com/cli/azure/webapp) for additional options.

## Get the release

Run `az upgrade` to install the latest available Azure CLI release, then verify the installed version:

```bash
az upgrade
az version
```
