---
title: "What's new for Azure App Service in Azure CLI 2.90.0"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

Azure CLI 2.90.0 is now available and includes new capabilities and reliability improvements for Azure App Service. This release makes it easier to troubleshoot Linux web apps, work directly with running containers, identify deployments, and create App Service plans using the latest Isolated tier.

## Connect directly to Linux web app containers

The existing `az webapp ssh` experience was designed primarily for interactive, human-operated sessions and could behave differently across client operating systems. On Windows, for example, it could open a browser-based WebSSH session instead of using the local terminal. This made cross-platform documentation, automation, and operational tooling difficult to standardize.

The new `az webapp exec` command, currently in preview, provides a consistent CLI surface for interactive shell access and detached command execution against running Linux web apps.

Open an interactive shell in the main app:

```bash
az webapp exec \
  --resource-group <resource-group> \
  --name <web-app>
```

Shell mode uses the local terminal on Windows, macOS, and Linux. By default, it connects to one app instance using `/bin/bash`. Use `--instance` to select a specific instance or `--shell` to use another shell, such as `/bin/sh`.

You can also connect to SCM(aka Kudu):

```bash
az webapp exec \
  --resource-group <resource-group> \
  --name <web-app> \
  --target kudu
```

Execute mode starts a command without opening an interactive session. This is useful for triggering setup tasks, migrations, diagnostics, and long-running work from automation or agent-driven workflows. You can target one instance, a comma-separated list of instances, or every instance. Requests for multiple instances run in parallel.

For example, run a shell command on every instance and redirect its output to a file:

```bash
az webapp exec \
  --resource-group <resource-group> \
  --name <web-app> \
  --mode execute \
  --instance all \
  --shell-command "echo hello > /home/LogFiles/output.txt 2>&1"
```

Execute mode is fire-and-forget. An `accepted` result confirms that the platform accepted the request, not that the command completed successfully. The command runs detached, and the CLI does not return its standard output, standard error, or exit code. Use `--command` to invoke a program directly, `--shell-command` when you need shell operators such as `|`, `&&`, or `>`, and `--working-directory` to choose an absolute working directory.

The command also supports deployment slots. This first preview focuses on interactive shell access and detached command execution; file transfer and port forwarding are not included.

### A safer path for custom Linux containers

The legacy WebSSH model for custom Linux containers can require adding an OpenSSH server to the container image, embedding a root password, and listening on port 2222. Security-conscious teams may be unable to use that model because it conflicts with policies that prohibit plaintext secrets, SSH daemons, or multiple processes in production images. Reusing the same image outside App Service can also expose those image changes in environments that do not have App Service protections in front of the SSH port.

A related App Service platform improvement, planned to roll out separately later in September, uses Kudu as an authenticated proxy to attach directly to the running container. Once available for an app, this path removes the need to modify the image, embed an SSH credential, or run an SSH daemon. Availability may vary by App Service region while the platform rollout completes.

### Control SSH access

Treat container shell access as a privileged operations capability and disable it on apps that do not need it. The `sshEnabled` property controls access at the app level. For example, disable SSH with:

```bash
az webapp config set \
  --resource-group <resource-group> \
  --name <web-app> \
  --generic-configurations '{"sshEnabled": false}'
```

Set `sshEnabled` to `true` to enable access again. Add `--slot <slot-name>` to configure a deployment slot.

For governance across many apps, assign the built-in **App Service apps should disable SSH** and **App Service app slots should disable SSH** policies at the subscription or management-group scope. Assigning them at the tenant root management group applies the control across the tenant. Both policies default to `Audit` and can use `Deny` to prevent noncompliant app configurations. For policy IDs and assignment links, see the [Azure App Service built-in policy reference](https://learn.microsoft.com/azure/app-service/policy-reference).

## Collect network captures from Linux web apps

A new preview troubleshooting command can collect a bounded packet capture from a Linux App Service worker:

```bash
az webapp troubleshoot collect network-capture \
  --resource-group <resource-group> \
  --name <web-app> \
  --duration 30
```

The command uses Kudu to finalize and analyze the capture, then returns authenticated links to the packet capture and analysis report. Use `--collect-only` when you only need the raw capture.

## Give deployments a friendly name

`az webapp deploy` now supports `--tag`, allowing Linux web app deployments to carry a recognizable name:

```bash
az webapp deploy \
  --resource-group <resource-group> \
  --name <web-app> \
  --src-path app.zip \
  --tag september-production-release
```

This makes individual deployments easier to identify in deployment history and operational workflows.

## Get more useful web app creation errors

For Linux web apps, `az webapp create` adds the opt-in `--enriched-errors` parameter. When enabled, the CLI returns more detailed diagnostic information when creation fails:

```bash
az webapp create \
  --resource-group <resource-group> \
  --plan <app-service-plan> \
  --name <web-app> \
  --runtime "PYTHON:3.13" \
  --enriched-errors true
```

This can help identify invalid runtime, container, and site configuration values without requiring additional troubleshooting steps.

## Create Isolated v4 App Service plans

Azure CLI now recognizes the Isolated v4 SKUs for App Service Environment plans:

- `I1V4` through `I6V4`
- `I1MV4` through `I5MV4`

For example:

```bash
az appservice plan create \
  --resource-group <resource-group> \
  --name <app-service-plan> \
  --app-service-environment <ase-resource-id> \
  --sku I1V4
```

These SKUs are mapped to the `IsolatedV4` ARM tier. An App Service Environment is required, and zone-redundant plans are supported.

## App Service configuration and plan fixes

This release also addresses two important usability issues:

- `az webapp config set --generic-configurations` now preserves camelCase properties such as `webJobsEnabled`, whether supplied as `key=value` input or JSON.
- Windows examples for `az appservice plan create` now include `--is-linux false`. Because the command defaults to Linux when the option is omitted, this avoids accidentally creating a Linux plan when following a Windows example.

## Get the release

Upgrade to Azure CLI 2.90.0 or later, then verify the installed version:

```bash
az version
```

## Summary

Azure CLI 2.90.0 gives App Service users better container access, stronger troubleshooting tools, support for the latest isolated compute tier, and more predictable configuration behavior.
