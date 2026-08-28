---
title: "What's new for Azure App Service in Azure CLI 2.85.0"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

[Azure CLI 2.85.0](https://learn.microsoft.com/cli/azure/release-notes-azure-cli#april-07-2026) adds control over Linux runtime patch adoption, default hostname generation, and automatic scaling configuration for Azure App Service. It also gives automation owners advance warning of an upcoming breaking change to `az webapp list-runtimes`.

## Control when Linux runtime patches reach your app

The new `--platform-release-channel` option for `az webapp update` lets you choose how quickly an App Service for Linux app adopts runtime patches:

- `Latest` receives patches first and is intended for early validation.
- `Standard` is the default and follows the normal rollout cadence.
- `Extended` stays further behind to provide more validation time.

For example, move an app to the Extended channel:

```bash
az webapp update \
  --resource-group <resource-group> \
  --name <web-app> \
  --platform-release-channel Extended
```

The option also supports deployment slots. Release channels control when an app adopts platform runtime patches; they do not change the runtime family configured for the app.

## Choose the scope for a generated default hostname

`az webapp up` now supports `--domain-name-scope`, which controls the scope used to generate a unique default hostname during resource creation.

```bash
az webapp up \
  --resource-group <resource-group> \
  --plan <app-service-plan> \
  --name <web-app> \
  --domain-name-scope TenantReuse
```

The generated hostname can include the app name, a unique string, and the Azure region instead of relying only on `<app-name>.azurewebsites.net`. Supported scopes include tenant, subscription, resource group, and no-reuse behavior.

## Use automatic scaling options without preview warnings

Azure CLI no longer marks the App Service automatic scaling options as preview. Enable automatic scaling and set the plan's maximum burst capacity with:

```bash
az appservice plan update \
  --resource-group <resource-group> \
  --name <app-service-plan> \
  --elastic-scale true \
  --max-elastic-worker-count <maximum-instances>
```

You can also configure the minimum and prewarmed instance counts for a web app:

```bash
az webapp update \
  --resource-group <resource-group> \
  --name <web-app> \
  --minimum-elastic-instance-count <minimum-instances> \
  --prewarmed-instance-count <prewarmed-instances>
```

The App Service plan must support automatic scaling. The CLI accepts Premium V2 and Premium V3 plans for this configuration.

## Prepare for changes to az webapp list-runtimes

Azure CLI 2.85.0 begins warning about a future breaking change to `az webapp list-runtimes`. The command still returns its existing flat list in this release, but a later breaking-change release will return structured objects with these fields:

- `os`
- `runtime`
- `version`
- `config`
- `support`
- `end_of_life`

The `--linux` option will be replaced by `--os-type`, and `--show-runtime-details` will be removed because the structured output includes those details. Update scripts that parse the current string list before adopting the breaking-change release.

## Get the release

Run `az upgrade` to install the latest available Azure CLI release, then verify the installed version:

```bash
az upgrade
az version
```
