---
title: "What's new for Azure App Service in Azure CLI 2.93.0"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

[Azure CLI 2.93.0](https://learn.microsoft.com/cli/azure/release-notes-azure-cli#november-17-2026) adds preview commands for managing geo-redundant web apps and improves runtime selection, Linux troubleshooting reports, and Managed Instance plan creation.

**Breaking changes:** `az webapp up` now exits with an error instead of creating or deploying an app. Also, the `config` values returned by `az webapp list-runtimes` use colons instead of pipes. Update deployment scripts and output parsers before upgrading.

## Replace `az webapp up` in deployment scripts

`az webapp up` is deprecated and no longer supported for both Linux and Windows web apps. It exits with an error without creating or deploying resources. Replace the combined workflow with `az webapp create` to create the app and `az webapp deploy` to deploy your package. These are separate steps; review your existing script's resource and deployment settings when migrating.

## Use runtime values directly in scripts

The `config` field in `az webapp list-runtimes` now uses `Framework:Version` for both Linux and Windows, across JSON, table, and TSV output. Scripts that parse the old pipe-separated output must accept the new colon-separated values. Existing pipe-separated runtime **input** remains accepted.

List Linux .NET runtime values that can be passed to `--runtime`:

```bash
az webapp list-runtimes --os-type linux --runtime dotnet \
  --query "[].config" --output tsv
```

The `--runtime` filter selects a runtime family, not a complete version. For .NET 11 and later, the CLI also recognizes legacy `DOTNETCORE` identifiers when matching the runtime catalog. If a Linux runtime is unsupported during app creation or configuration, the error now suggests a relevant runtime-listing command.

## Manage geo-redundant apps from the CLI

The new **preview** command groups `az webapp silo`, `az appservice plan silo`, `az webapp managed-traffic`, and `az webapp last-known-good` let you manage regional silos, traffic configuration, and the last-known-good revision. For an existing geo-redundant app, inspect its silos and managed traffic configuration:

```bash
az webapp silo list --resource-group <resource-group> --name <web-app>
az webapp managed-traffic show --resource-group <resource-group> --name <web-app>
```

Geo-redundancy is in public preview for Windows code apps on Pv3, PMv3, Pv4, and PMv4 plans. The preview regions are East Asia, West Central US, North Europe, and West US 2; Linux, containers, and deployment slots aren't supported. Check the [preview limitations](https://learn.microsoft.com/azure/app-service/overview-geo-redundancy#preview-scope-and-current-limitations) before using it.

Regional silos don't replicate backing-service data. Traffic routing depends on health probes and DNS caching, and doesn't move existing connections. Marking a revision last known good selects the latest **ready** revision, which may lag behind the latest deployment; validate the revision and check that regional endpoints and dependencies are healthy. If the primary app uses virtual network integration, each silo also needs an eligible regional integration subnet. See [configure geo-redundancy](https://learn.microsoft.com/azure/app-service/configure-geo-redundancy) for details.

## Read Linux troubleshooting reports from Windows terminals

The preview `az webapp troubleshoot status` and `az webapp troubleshoot config` reports now render correctly in Windows terminals using legacy encodings. The target app must still be a Linux web app. Use `--report` for the human-readable view:

```bash
az webapp troubleshoot status --resource-group <resource-group> \
  --name <web-app> --report
```

The status report combines per-instance runtime status with recent startup information. The config report checks common Linux settings and surfaces a recent runtime error.

## Create Managed Instance plans with Windows defaults

When `az appservice plan create` uses `--is-managed-instance` and `--is-linux` is omitted, the CLI now selects Windows rather than Linux. It rejects conflicting Linux and Windows container options instead of submitting an incompatible plan.

You still need to specify a supported Pv4 or PMv4 SKU: the CLI's general Windows SKU default isn't a Managed Instance SKU. Managed Instance supports Windows web apps in [select regions](https://learn.microsoft.com/azure/app-service/overview-managed-instance#current-limitations), not Linux or containers.

## Get the release

Run `az upgrade` to install the latest available Azure CLI release, then verify the installed version:

```bash
az upgrade
az version
```
