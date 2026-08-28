---
title: "What's new for Azure App Service in Azure CLI 2.89.0"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

[Azure CLI 2.89.0](https://learn.microsoft.com/cli/azure/release-notes-azure-cli#august-04-2026) adds a new way to inspect Linux web app startup health across every running instance, making it easier to identify platform state and recent startup failures before opening individual logs.

## See startup health across every Linux app instance

The new `az webapp troubleshoot status` command, currently in preview, combines App Service runtime status with recent startup results from SCM (Kudu). By default, it returns structured data for every instance seen during the last 24 hours:

```bash
az webapp troubleshoot status \
  --resource-group <resource-group> \
  --name <web-app>
```

The result can include each instance's current state and details, its latest startup error when one is available, and counts of recent successful and failed startup attempts. This gives you an app-wide overview before you inspect an individual startup log.

For a human-readable, color-coded view, add `--report`:

```bash
az webapp troubleshoot status \
  --resource-group <resource-group> \
  --name <web-app> \
  --report
```

Use `--instance` with either an ARM instance ID or a machine name to inspect one worker. Add `--slot <slot-name>` to troubleshoot a deployment slot.

This command supports Linux web apps. If the startup-summary endpoint is not yet available for an app, the command reports that status instead of presenting missing startup data as zero attempts. Runtime status may still be available while the supporting App Service capability rolls out across regions.

## Get the release

Run `az upgrade` to install the latest available Azure CLI release, then verify the installed version:

```bash
az upgrade
az version
```
