---
title: "What's new for Azure App Service in Azure CLI 2.87.0"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

[Azure CLI 2.87.0](https://learn.microsoft.com/cli/azure/release-notes-azure-cli#june-02-2026) adds structured runtime discovery and preview commands for Linux startup logs. This release also deprecates `az webapp up` and introduces a breaking change for scripts that consume `az webapp list-runtimes` output.

## Update scripts that use az webapp list-runtimes

`az webapp list-runtimes` now returns structured objects instead of a flat list of strings. Each result can include its operating system, runtime family, version, configuration value, support status, and end-of-life date.

The command also adds `--runtime` and `--support` filters. For example, list Python runtimes on Linux that are approaching end of life:

```bash
az webapp list-runtimes \
  --os-type linux \
  --runtime python \
  --support near \
  --output table
```

This is a breaking change for scripts that parse the previous string output. The `--linux` and `--show-runtime-details` options have been removed. Update automation to consume the new object properties and use `--os-type linux` when you need Linux results.

A runtime with `Near` support status is within 365 days of its end-of-life date. The default supported view excludes end-of-life entries but can still include active, near-end-of-life, and entries without complete lifecycle metadata.

## Inspect Linux startup logs from Azure CLI

The new preview `az webapp log startup` commands let you list and inspect container startup attempts without opening SCM (Kudu) directly.

List failed startup attempts:

```bash
az webapp log startup list \
  --resource-group <resource-group> \
  --name <web-app> \
  --outcome failure
```

Show the latest relevant startup log:

```bash
az webapp log startup show \
  --resource-group <resource-group> \
  --name <web-app>
```

The commands support deployment slots and instance filtering. When no filename is supplied, latest-log selection prefers a failure from the newest date. Filename and instance filters cannot be used together.

These commands support Linux web apps and depend on the authenticated SCM (Kudu) startup-log endpoint. A not-found response can mean the supporting capability has not reached the app's region.

## Move from az webapp up to create and deploy

`az webapp up` is now formally deprecated. It continues to run, but Azure CLI directs new automation toward separate creation and deployment steps.

```bash
az webapp create \
  --resource-group <resource-group> \
  --plan <app-service-plan> \
  --name <web-app> \
  --runtime "PYTHON:3.13"

az webapp deploy \
  --resource-group <resource-group> \
  --name <web-app> \
  --src-path <path-to-package>
```

Separating resource creation from deployment makes each operation explicit and easier to troubleshoot in scripts and CI pipelines.

## Get the release

Run `az upgrade` to install the latest available Azure CLI release, then verify the installed version:

```bash
az upgrade
az version
```
