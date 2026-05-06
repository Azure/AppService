---
title: "Control runtime patch updates with Platform Release Channel on Azure App Service for Linux"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

Azure App Service for Linux is introducing **Platform Release Channel**, a new setting that gives you more control over when runtime patch updates are applied to your app.

With this feature, you can choose how quickly your app moves to newly rolled-out runtime patches. This helps teams balance two common needs: staying current with the latest security and platform updates, while also having enough time to validate changes before adopting them.

## Why this matters

Runtime patch updates are important because they include fixes, security updates, and platform improvements. However, some production applications need time to validate these updates before moving to the newest available patch.

Platform Release Channel gives you that flexibility.

You can choose to stay close to the latest patch updates, use the default balanced option, or stay on an extended channel that gives you more time before adopting newer patches.

## How it works

You can configure the **Platform release setting** from the **Stack settings** section in the Azure portal.

The setting supports three values:

| Channel      | Behavior                                                                   | Recommended for                                                                   |
| ------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Latest**   | Uses the latest patch versions rolled out on App Service                   | Apps where staying current with security and platform updates is the top priority |
| **Standard** | Default setting. Runs one App Service patch rollout behind Latest          | Most production apps that want a balance of stability and currency                |
| **Extended** | Runs further behind Latest, giving more time before adopting newer patches | Apps that need additional validation time before moving to newer patches          |

By default, apps are set to **Standard**. This gives you additional time to test the latest patch before your app moves to it.

Choose **Latest** when security and immediate access to the newest runtime patches are your priority. Choose **Extended** when your application needs more validation time before adopting newer patch versions.

## How channels move forward

The release channels move forward with each runtime patch rollout.

When a new patch is rolled out to **Latest**, the **Standard** channel moves to the patch version that was previously on **Latest**. **Extended** stays further behind to provide more validation time.

For example, with the current .NET 10 rollout, the channels look like this:

| Stack      | Runtime version | Latest | Standard | Extended |
| ---------- | --------------: | -----: | -------: | -------: |
| DOTNETCORE |              10 | 10.0.7 |   10.0.4 |   10.0.2 |

When the next .NET 10 patch rollout happens, **Standard** will move to **10.0.7**, while **Latest** will move to the newly rolled-out patch version.

For some stacks, you may currently see the same patch version for both **Standard** and **Extended**. We are working through another rollout for these stacks, and the channel versions will be updated as that rollout progresses.

## Configure Platform Release Channel

You can configure it on the Azure portal

![PRC]({{site.baseurl}}/media/2026/05/prc.jpg)

You can also configure the release channel using Azure CLI.

To move to the latest available patch channel:

```bash
az webapp update \
  --resource-group <resource-group> \
  --name <site-name> \
  --platform-release-channel Latest
```

To use the default channel:

```bash
az webapp update \
  --resource-group <resource-group> \
  --name <site-name> \
  --platform-release-channel Standard
```

To give your app more time before adopting newer patches:

```bash
az webapp update \
  --resource-group <resource-group> \
  --name <site-name> \
  --platform-release-channel Extended
```

## Summary

Platform Release Channel gives you a simple way to control the pace at which runtime patch updates are applied to your Linux apps on Azure App Service.

Use **Latest** when you want the newest available patches as soon as they are rolled out. Use **Standard** for the default balance between currency and stability. Use **Extended** when your app needs more validation time before moving to newer runtime patches.
