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

### 2) Application Insights is **off by default** for new apps

New Linux web apps will have Azure Application Insights disabled by default. You can enable it in either of the following ways:

**Option A - During create (Monitor + secure tab)**

In Create Web App → `Monitor + secure`, set `Enable Application Insights` to Yes.

![Create Web App - Monitor + secure tab showing “Enable Application Insights: Yes”]({{site.baseurl}}/media/2025/10/create-appinsights.png)

**Option B - After the app is created (from the Application Insights blade)**

Open your web app in the portal → `Application Insights` (left nav).

Select `Turn on Application Insights` and choose an Insights resource.

![App blade - Application Insights pane with “Turn on Application Insights”]({{site.baseurl}}/media/2025/10/config-appinsights.png)

This opt-in model gives you explicit control over monitoring at creation time, while keeping the enablement experience one click away.

## How to try .NET 10 RC1

**Portal:**

1. Create or open a **Linux** Web App.
2. Under **Runtime stack**, choose **.NET 10 (Preview)**.
3. Deploy your code (Local Git, GitHub Actions, Azure DevOps, etc.).
4. Verify at runtime (e.g., `dotnet --info` via SSH/Kudu) that you’re on **.NET 10 RC1**.


Give RC1 a spin, validate your Ubuntu dependencies and telemetry choice, and you’ll be set for GA.
