---
title: "What's new for Azure App Service in Azure CLI 2.91.0"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

[Azure CLI 2.91.0](https://learn.microsoft.com/cli/azure/release-notes-azure-cli#october-06-2026) adds a preview command for diagnosing Linux web app configuration and runtime errors from the terminal. This release also makes access-restriction updates safer by preserving unrelated site configuration.

## Diagnose Linux app configuration from the terminal

The new `az webapp troubleshoot config` command, currently in preview, evaluates common Linux App Service settings and pairs the results with a recent runtime error when one is available:

```bash
az webapp troubleshoot config \
  --resource-group <resource-group> \
  --name <web-app>
```

The command checks settings such as the runtime stack, port binding, startup command, Always On, and health check path. It combines configuration checks from SCM (Kudu) with App Service runtime status, returning structured output by default so you can use standard Azure CLI output formats.

For a human-readable, color-coded view, add `--report`:

```bash
az webapp troubleshoot config \
  --resource-group <resource-group> \
  --name <web-app> \
  --report
```

Runtime errors are included only when they occurred within the last 15 minutes, which avoids presenting stale failures as current problems. For a 24-hour view of runtime status and startup attempts, continue to use `az webapp troubleshoot status`.

Use `--instance <worker-machine-name>` to run the checks for a specific worker. The command matches the runtime error to that worker and does not fall back to an error from another instance. Add `--slot <slot-name>` to diagnose a deployment slot.

This preview supports Linux web apps. If the configuration-check endpoint is unavailable, the command reports that condition and can still return a recent runtime error when App Service provides one.

## Update access restrictions without changing unrelated settings

Commands under `az webapp config access-restriction` now send only the access-restriction properties being changed instead of resubmitting the complete site configuration. This prevents add, remove, and set operations from unintentionally dropping unrelated settings while updating rules for the app or its SCM (Kudu) site.

For example, you can add an allow rule without risking changes to other site configuration:

```bash
az webapp config access-restriction add \
  --resource-group <resource-group> \
  --name <web-app> \
  --rule-name <rule-name> \
  --action Allow \
  --ip-address <ip-address-or-cidr> \
  --priority <priority>
```

Existing command syntax and access-restriction behavior remain unchanged. For more examples, see [Set up Azure App Service access restrictions](https://learn.microsoft.com/azure/app-service/app-service-ip-restrictions).

## Get the release

Run `az upgrade` to install the latest available Azure CLI release, then verify the installed version:

```bash
az upgrade
az version
```
