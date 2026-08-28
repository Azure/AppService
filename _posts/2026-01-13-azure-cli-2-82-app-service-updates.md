---
title: "What's new for Azure App Service in Azure CLI 2.82.0"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

[Azure CLI 2.82.0](https://learn.microsoft.com/cli/azure/release-notes-azure-cli#january-13-2026) adds a preview option for discovering which Azure regions report support for Managed Instance on Azure App Service. This helps you narrow deployment planning to locations that support both Managed Instance workers and the requested pricing tier.

## Find regions that support Managed Instance

Use `az appservice list-locations` with `--managed-instance-enabled` and a supported Premium V4 SKU:

```bash
az appservice list-locations \
  --managed-instance-enabled \
  --sku P1V4
```

The command filters the location list to regions that report Managed Instance support for the selected SKU. It also supports memory-optimized Premium V4 SKUs such as `P1MV4`. Unsupported tiers return an empty list.

This preview option is a discovery aid; it does not create an App Service plan or guarantee capacity in a returned region. Confirm current regional and SKU availability before deploying.

## Get the release

Run `az upgrade` to install the latest available Azure CLI release, then verify the installed version:

```bash
az upgrade
az version
```
