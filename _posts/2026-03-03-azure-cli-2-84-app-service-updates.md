---
title: "What's new for Azure App Service in Azure CLI 2.84.0"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

[Azure CLI 2.84.0](https://learn.microsoft.com/cli/azure/release-notes-azure-cli#march-03-2026) improves VNet routing compatibility, normalizes access-restriction output, discovers Java runtimes dynamically, and adds transport-security controls during web app creation. These changes make App Service automation more predictable as Microsoft.Web APIs and supported runtimes evolve.

## Keep outbound VNet routing working with newer APIs

App Service now uses the site-level `outboundVnetRouting` property when web apps are created or connected to a virtual network. This replaces the older site-configuration property that is no longer honored by Microsoft.Web API version `2024-11-01`.

Existing command syntax remains the same. For example, route application traffic through a regional VNet integration with:

```bash
az webapp config set \
  --resource-group <resource-group> \
  --name <web-app> \
  --vnet-route-all-enabled true
```

`az webapp create` with `--vnet` and `--subnet`, and `az webapp vnet-integration add`, now update the site-level property as well. The change preserves the intended route-all behavior when these commands use the newer API.

## Get consistent access-restriction output

`az webapp config access-restriction show` now returns property names consistently in camel case instead of mixing camel case and snake case:

```bash
az webapp config access-restriction show \
  --resource-group <resource-group> \
  --name <web-app>
```

Review scripts that query specific output keys. Automation that relied on snake-case variants should move to the camel-case property names returned by this release.

## Discover Java runtimes without hardcoded version lists

`az webapp list-runtimes` now derives Java versions from App Service runtime metadata instead of a hardcoded list:

```bash
az webapp list-runtimes
```

This allows newly available Java versions, including Java 25 when returned by the platform, to appear without a corresponding CLI code update. The command also deduplicates repeated runtime entries.

## Configure transport security when creating a web app

`az webapp create` adds options for enabling encryption between the App Service front ends and workers and for setting the minimum inbound TLS version:

```bash
az webapp create \
  --resource-group <resource-group> \
  --plan <app-service-plan> \
  --name <web-app> \
  --runtime "PYTHON:3.13" \
  --end-to-end-encryption-enabled true \
  --min-tls-version 1.2
```

Use `--min-tls-cipher-suite` when you also need to set the minimum accepted TLS cipher suite. You can change end-to-end encryption later with `az webapp update --end-to-end-encryption-enabled`.

## Get the release

Run `az upgrade` to install the latest available Azure CLI release, then verify the installed version:

```bash
az upgrade
az version
```
