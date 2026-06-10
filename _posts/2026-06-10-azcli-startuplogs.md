---
title: "Debug App Startup Faster on Azure App Service for Linux with Startup Logs"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

When an app fails to start on Azure App Service for Linux, one of the first things you need is visibility into what happened during startup. This can include container initialization, runtime setup, startup command execution, application output, and warmup probe results.

To make this easier, we have added new Azure CLI commands that let you list and view App Service startup logs directly from the command line.

## List available startup logs

You can list startup logs for an app using:

```bash
az webapp log startup list \
  --name <app-name> \
  --resource-group <resource-group>
```

The output shows whether the startup attempt succeeded or failed, along with the instance name and log file size. This helps you quickly identify the right log file, especially when there are multiple startup attempts across different instances.

![startuplog]({{site.baseurl}}/media/2026/06/log-list.jpg)

## Show startup log content

To view the latest startup log, run:

```bash
az webapp log startup show \
  --name <app-name> \
  --resource-group <resource-group>
```

You can also view a specific log file by name:

```bash
az webapp log startup show \
  --name <app-name> \
  --resource-group <resource-group> \
  --log-file-name <log-file-name>
```

The log content includes startup events from the platform and the application. For example, you can see the container image being pulled, the startup script being generated, the app command being run, and the warmup probe result.

In a successful startup, the log shows that the site startup probe succeeded and the site started successfully.

![startuplog]({{site.baseurl}}/media/2026/06/startup-succeeded.jpg)

## Failure logs are prioritized by default

When you run `az webapp log startup show` without specifying a log file name, the command automatically prefers failure logs from the most recent date.

This helps reduce the time spent looking for the right log when debugging startup failures. Instead of manually searching through multiple files, you can run one command and immediately see the most relevant failure details.

For example, if the app fails because the worker process does not start within the allotted time, the log shows the timeout details and the platform actions taken during startup cancellation.

![startuplog]({{site.baseurl}}/media/2026/06/log-failure.jpg)

## Better hints for common startup failures

The command also includes improved handling for common failure scenarios, including runtime startup failures and container startup timeouts.

For example, if the app starts but does not respond on the expected port, the startup log may show application output such as:

```text
listening on 3000 (wrong port)
```

while the platform is expecting the app to respond on a different port. This makes it much easier to understand why the warmup probe failed.

## Slot support

The startup log commands also support deployment slots.

To list startup logs for a slot:

```bash
az webapp log startup list \
  --name <app-name> \
  --resource-group <resource-group> \
  --slot <slot-name>
```

To show startup logs for a slot:

```bash
az webapp log startup show \
  --name <app-name> \
  --resource-group <resource-group> \
  --slot <slot-name>
```

This is useful when debugging slot-specific startup issues before swapping traffic to production.

## Summary

The new `az webapp log startup` commands make it easier to inspect startup behavior for Azure App Service for Linux apps directly from Azure CLI.

These commands are currently in preview. Try them out the next time you need to understand why your App Service Linux app did or did not start successfully.
