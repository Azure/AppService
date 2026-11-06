---
title: "64-bit support is now available for App Service Free sites on Windows"
author_name: "Byron Tardif"
---

Newer runtimes, including Node.js 24 and Node.js 26, no longer provide 32-bit builds. To help you get started with these runtimes without moving to a paid plan just for 64-bit support, Azure App Service now supports **64-bit (x64) applications on Windows sites in the Free (F1) tier**.

## Try your x64 app on the Free tier

This removes the Free tier's 32-bit process restriction as a barrier to trying newer runtimes. It also makes room for applications that depend on 64-bit native libraries and lets you test with the same process architecture you intend to use in a paid Windows App Service plan.

Whether you are learning App Service, building a proof of concept, or checking an application's compatibility, you now have more flexibility to use the Free tier.

## What stays the same

This update adds support for a process architecture; it does not increase the Free tier's memory, CPU, or other resource quotas. Free-tier apps still run on shared compute and remain subject to the [existing App Service limits](https://learn.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-app-service-limits).

The change applies to **Windows Free (F1) sites only**. Linux sites already run exclusively on 64-bit, and Windows sites in the Shared (D1) tier already support both 32-bit and 64-bit processes.

Learn more about [App Service plans](https://learn.microsoft.com/azure/app-service/overview-hosting-plans) to choose the right tier for your application.
