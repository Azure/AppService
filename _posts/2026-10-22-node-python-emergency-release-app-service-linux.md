---
title: "Emergency Node.js and Python Runtime Updates on Azure App Service for Linux"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **Update (22 October 2026):** Rollout of the updated built-in Node.js and Python images is **complete on both the Latest and Standard Platform Release Channels** for Azure App Service on Linux.

Following the emergency Node.js and Python releases on **21 October 2026**, the Azure App Service team has updated the built-in Linux images with the newly released runtime versions.

## Patched versions and official release notes

The following versions were published by the Node.js and Python projects on **21 October 2026**. These are upstream release versions; verify the runtime version in your running App Service app using the instructions below.

### Node.js

For the **22.x and 24.x** release lines covered in this article, the [official Node.js security announcement](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) lists fixes with a highest severity of **High**, including fixes for a Brotli decoder out-of-bounds write that permits remote code execution, DNS name handling, and TLS certificate hostname validation. The release also includes dependency updates and a CA-certificate update related to the eMudhra intermediate CA compromise.

| Node.js release line | Patched version | Official release notes |
|---|---|---|
| 22.x | **22.23.4** | [Node.js 22.23.4](https://nodejs.org/en/blog/release/v22.23.4/) |
| 24.x | **24.22.1** | [Node.js 24.22.1](https://nodejs.org/en/blog/release/v24.22.1/) |

See the official security announcement for the complete vulnerability list and affected release lines. End-of-life Node.js versions do not receive these fixes; move to a supported release line if your app is using an EOL version.

### Python

The [official Python release announcement](https://blog.python.org/2026/10/python-3151-3149-31317/) describes an expedited security release for **3.14** and a special security release for **3.13**. Both update bundled **pip to 26.2.2**, including **certifi 2026.10.19**, to address the **eMudhra / emSign CA certificate security incident**.

| Python release line | Updated version | Official release notes |
|---|---|---|
| 3.13 | **3.13.17** | [Python 3.13.17](https://www.python.org/downloads/release/python-31317/) |
| 3.14 | **3.14.9** | [Python 3.14.9](https://www.python.org/downloads/release/python-3149/) |

**Updating the platform runtime does not update packages in your app's existing virtual environments.** The Python team also recommends updating pip and uv in existing virtual environments. Review the [official incident guidance](https://discuss.python.org/t/information-for-python-users-regarding-emudhra-emsign-ca-certificate-security-incident/109576), update affected app-managed dependencies through your trusted package source, and rebuild and redeploy your app as needed.

## What we are doing

The updated images roll out through the [Platform Release Channels](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime#control-runtime-patch-update-timing-with-platform-release-channel) as follows:

| Channel | Availability of the updates |
|---|---|
| **Latest** | Rollout **complete**. |
| **Standard** (default) | Rollout **complete** through **Safe Deployment Practices (SDP)**. |

The updated images are available on both Latest and Standard for the release lines covered here.

Changing your Platform Release Channel does not change your app's configured Node.js or Python release line. If your app needs a different supported release line, update and test the app and change its runtime configuration separately.

## What you should do

1. **Use Standard or Latest to receive these updates.** Apps already on either channel do not need a channel change. If you use another channel, follow the instructions below to select Standard.
2. **Verify your runtime version.** After your app picks up the updated image, use `az webapp exec` to open an interactive shell in the app and check its running runtime version.
3. **Update custom containers and bring-your-own runtimes yourself.** App Service does not patch Node.js or Python runtimes that you supply. Update your runtime or rebuild your container image with the applicable fixed version, test your app, and redeploy.

### Change your Platform Release Channel

**Azure portal**

1. In the Azure portal, go to your App Service app.
2. In the left menu, select **Stack settings**.
3. Under **Platform Release Channel**, select **Standard**.
4. Select **Save**.

**Azure CLI**

Use [az webapp update](https://learn.microsoft.com/cli/azure/webapp#az-webapp-update) to move your app to Standard:

```bash
az webapp update \
  --resource-group <resource-group> \
  --name <app-name> \
  --platform-release-channel Standard
```

Replace the placeholders with your app's resource group and name. For a deployment slot, add `--slot <slot-name>`.

If your app is already on **Standard** or **Latest**, no channel change is needed for these updates.

For more information, see [OS and runtime patching in Azure App Service](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime#control-runtime-patch-update-timing-with-platform-release-channel).

### Verify your runtime version

Use [az webapp exec](https://learn.microsoft.com/cli/azure/webapp#az-webapp-exec) (currently in preview) with Azure CLI **2.90.0 or later** to open an interactive shell in your running app:

```bash
az webapp exec --resource-group <resource-group> --name <app-name>
```

Replace the placeholders with your app's resource group and name. For a deployment slot, add `--slot <slot-name>`.

In the interactive shell, run the command for your runtime.

For Node.js:

```bash
node --version
```

For Python:

```bash
python --version
```

Verify the version in your running app rather than relying only on the selected Platform Release Channel.

Use the interactive shell for these checks rather than detached execute mode, which does not return command output or an exit code.

## Related updates

- [Emergency Node.js runtime updates on App Service for Windows]({{ site.baseurl }}{% post_url 2026-10-22-node-emergency-release-app-service-windows %}) covers the separate Windows Node.js rollout. Linux Platform Release Channel settings do not apply to Windows.
- [Time zone updates on App Service for Linux]({{ site.baseurl }}{% post_url 2026-10-22-time-zone-updates-app-service-linux %}) covers the updated time-zone rules and checks for OS and application-managed time-zone data.
- [eMudhra / emSign certificate security updates on App Service for Linux]({{ site.baseurl }}{% post_url 2026-10-22-emudhra-certificate-issue-app-service-linux %}) provides additional guidance on OS trust stores and application-managed CA bundles. Updating the runtime does not replace certificate bundles managed by your app.
- [Critical PHP security release guidance for App Service]({{ site.baseurl }}{% post_url 2026-10-21-php-critical-security-release-app-service-linux %}) covers the separate PHP security release and actions for PHP workloads.

## Stay informed

We will share further updates here as needed.

Thank you for helping us keep your Node.js and Python apps on Azure App Service secure.
