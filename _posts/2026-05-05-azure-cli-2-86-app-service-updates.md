---
title: "What's new for Azure App Service in Azure CLI 2.86.0"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

[Azure CLI 2.86.0](https://learn.microsoft.com/cli/azure/release-notes-azure-cli#may-05-2026) adds clearer App Service creation and deployment guidance, richer Linux deployment errors, Docker Compose conversion for [Site Containers](https://learn.microsoft.com/azure/app-service/migrate-sidecar-multi-container-apps), and more predictable plan creation behavior. Together, these changes reduce guesswork from plan creation through deployment and make important defaults easier to understand in automation.

## Get clearer guidance when creating and deploying Linux web apps

Azure CLI now provides more context around common App Service creation and deployment workflows. After creating a web app, the CLI can show relevant deployment next steps. `az webapp up` also reports inferred values such as the operating system, runtime, and generated App Service plan.

When deploying a ZIP package to a Linux web app, the CLI warns when remote build is not enabled and points to the required app setting:

```bash
az webapp config appsettings set \
  --resource-group <resource-group> \
  --name <web-app> \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

The release also improves `az webapp create` validation. If you target a Linux plan without providing a runtime, container image, or Site Containers configuration, the error now lists the available creation options and directs you to runtime discovery:

```bash
az webapp list-runtimes --os-type linux
```

## Get richer Linux deployment errors

`az webapp deploy` and `az webapp up` add the opt-in `--enriched-errors` parameter for Linux web apps:

```bash
az webapp deploy \
  --resource-group <resource-group> \
  --name <web-app> \
  --src-path <path-to-package> \
  --enriched-errors true
```

For recognized deployment failures, enriched output can include an error code, deployment stage, runtime and plan context, the original error, and suggested fixes. The feature recognizes a curated set of common HTTP 400 and 409 deployment failures; it does not replace startup logs or diagnose every application startup failure.

This option is disabled by default.

## Convert Docker Compose configuration to Site Containers

If an existing web app uses the legacy `COMPOSE|` multi-container configuration, you can convert it to App Service Site Containers:

```bash
az webapp sitecontainers convert \
  --resource-group <resource-group> \
  --name <web-app> \
  --mode sitecontainers \
  --main-container-name <main-container> \
  --yes
```

The conversion maps container images, commands, environment variables, ports, and volumes into Site Container resources. Images must already exist in their registries. Unsupported Docker Compose keys are reported and ignored, and only the first declared port becomes the target port.

Review networking and storage behavior after conversion. Containers communicate through `localhost` with unique ports, `${WEBAPP_STORAGE_HOME}` maps to persistent `/home` storage, and other named volumes remain ephemeral.

## Create Linux plans with a newer default SKU

When `az appservice plan create` targets Linux and you omit `--sku`, Azure CLI now selects `P0V3` instead of `B1`. Windows plan creation continues to default to `B1`.

```bash
az appservice plan create \
  --resource-group <resource-group> \
  --name <app-service-plan> \
  --is-linux
```

`P0V3` is a billable Premium V3 tier and is subject to regional availability. Specify `--sku` explicitly in scripts whenever the pricing tier must remain fixed.

## Get the release

Run `az upgrade` to install the latest available Azure CLI release, then verify the installed version:

```bash
az upgrade
az version
```
