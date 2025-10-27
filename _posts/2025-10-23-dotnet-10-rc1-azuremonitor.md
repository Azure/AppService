---
title: ".NET 10 RC1 is now available on Azure App Service for Linux"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

**.NET 10 RC1** is now available on **Azure App Service for Linux**. We’re actively preparing **RC2**, which should roll out over the next couple of weeks.

## What’s new

### 1) Ubuntu-based images for .NET 10 and beyond

Starting with **.NET 10**, our Linux runtime images for code-based apps are moving from **Debian** to **Ubuntu**. This brings a faster security/patch cadence and a broader package ecosystem. Details and migration notes here:
🔗 **[Why Ubuntu for App Service? What to expect and how to prepare](https://azure.github.io/AppService/2025/10/14/Ubuntu-images.html)**

### 2) Azure Monitor integration is now opt-in

Azure App Service for Linux integrates with [Azure Monitor](https://learn.microsoft.com/azure/app-service/monitor-app-service) to collect runtime diagnostics (for example, process-level information from your .NET app, logs, and other operational data) so you can troubleshoot, analyze behavior, and set up alerting.

With .NET 10 on Azure App Service for Linux, there’s an important change:

* **dotnet-monitor is not enabled by default** for newly created apps.

Instead, you explicitly turn on Azure Monitor–based runtime diagnostics. This gives you greater control over diagnostic data collection for your application. You can do that in either of two ways:

1. Add the new app setting
   `WEBSITE_ENABLE_DOTNET_MONITOR = true`

2. Enable the diagnostic setting that sends application logs to Azure Monitor 

![Add Azure Monitor]({{site.baseurl}}/media/2025/10/azure-monitor-diag.jpg)

If either of these is configured, Azure monitor will be enabled for your app and start collecting runtime diagnostics.

You don’t have to set both — turning on application log collection to Azure Monitor is enough on its own.

## How to try .NET 10 RC1

**Portal:**

1. Create or open a **Linux** Web App.
2. Under **Runtime stack**, choose **.NET 10 (Preview)**.
3. Deploy your code (Local Git, GitHub Actions, Azure DevOps, etc.).
4. Verify at runtime (e.g., `dotnet --info` via SSH/Kudu) that you’re on **.NET 10 RC1**.


Give RC1 a spin, validate your Ubuntu dependencies and telemetry choice, and you’ll be set for GA.
