---
title: ".NET Brotli Security Updates on Azure App Service for Linux"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **Update (26 October 2026):** Rollout of the updated built-in .NET images is **complete on the Latest Platform Release Channel** for Azure App Service on Linux. Rollout to **Standard** is **in progress through Safe Deployment Practices (SDP)**.

Following the out-of-band .NET security releases on **25 October 2026**, Azure App Service is updating the built-in Linux images for **.NET 8, 9, 10, and 11 RC3**. The primary fix addresses a vulnerability in the Brotli decoder used by .NET and ASP.NET Core.

## What the Brotli update addresses

The official .NET release notes describe [CVE-2026-111497, a Brotli decoder out-of-bounds write](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-111497). Processing maliciously crafted compressed data could result in **denial of service, information disclosure, or elevation of privilege**.

Applications can be affected when they use Brotli decompression through:

- ASP.NET Core request decompression.
- `HttpClient` automatic response decompression.
- The `System.IO.Compression` Brotli APIs.

Automatic request and response decompression are **not enabled by default**. **.NET Framework is not affected** by this issue.

## Patched versions and official release notes

The following upstream releases were published on **25 October 2026** and are included in this App Service Linux image update:

| .NET release line | Patched runtime version | Official release notes |
|---|---|---|
| .NET 8 | **8.0.33** | [.NET 8.0.33](https://github.com/dotnet/core/blob/main/release-notes/8.0/8.0.33/8.0.33.md) |
| .NET 9 | **9.0.22** | [.NET 9.0.22](https://github.com/dotnet/core/blob/main/release-notes/9.0/9.0.22/9.0.22.md) |
| .NET 10 | **10.0.14** | [.NET 10.0.14](https://github.com/dotnet/core/blob/main/release-notes/10.0/10.0.14/10.0.14.md) |
| .NET 11 RC3 (prerelease) | **11.0.0-rc.3.26522.148** | [.NET 11.0.0-rc.3](https://github.com/dotnet/core/blob/main/release-notes/11.0/preview/rc3/11.0.0-rc.3.md) |

These releases include additional security fixes. See the official release notes for the complete scope, applicability, and any application-package updates required separately from the platform runtime.

The table identifies the patched versions, **not confirmation that your app already runs them**. Verify your application's running runtime as described below.

## What we are doing

The updated built-in Linux images roll out through the [Platform Release Channels](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime#control-runtime-patch-update-timing-with-platform-release-channel) as follows:

| Channel | Availability of the updates |
|---|---|
| **Latest** | Rollout **complete** for the release lines listed above. |
| **Standard** (default) | Rollout **in progress** through **Safe Deployment Practices (SDP)**. |

Apps on Standard will receive the platform image update as rollout progresses; **a channel change is not required**. If you need the updated image before the Standard rollout reaches your app, you can select Latest and verify your app's runtime version.

Changing your Platform Release Channel does not change your app's configured .NET release line or move an app to .NET 11 RC3. End-of-life runtimes do not receive these updates; move to a supported release line and test your app.

**This post covers App Service for Linux.** Its Platform Release Channel settings and rollout status do not apply to App Service for Windows.

## What you should do

1. **Review your Platform Release Channel.** Latest rollout is complete. Apps on Standard can remain on Standard while SDP rollout continues, or select Latest if the update is needed sooner.
2. **Verify the runtime used by your application.** Check the running application process, not just its configured release line or the installed SDK version.
3. **Review application-managed dependencies.** Follow the official release notes for affected packages that require updates independently of the shared runtime.
4. **Update self-contained deployments and custom containers yourself.** The platform image update does not replace a .NET runtime bundled with your application or inside your custom image. Rebuild with the applicable patched runtime, test, and redeploy. The same applies to other bring-your-own runtime deployments.

### Change your Platform Release Channel

**Azure portal**

1. In the Azure portal, go to your App Service app.
2. In the left menu, select **Stack settings**.
3. Under **Platform Release Channel**, select **Latest**.
4. Select **Save**.

**Azure CLI**

Use [az webapp update](https://learn.microsoft.com/cli/azure/webapp#az-webapp-update) to select Latest:

```bash
az webapp update \
  --resource-group <resource-group> \
  --name <app-name> \
  --platform-release-channel Latest
```

Replace the placeholders with your app's resource group and name. For a deployment slot, add `--slot <slot-name>`.

### Verify your runtime version

Use [az webapp exec](https://learn.microsoft.com/cli/azure/webapp#az-webapp-exec) (currently in preview) with Azure CLI **2.90.0 or later** to open an interactive shell in your running app:

```bash
az webapp exec --resource-group <resource-group> --name <app-name>
```

For a deployment slot, add `--slot <slot-name>`. Use `--instance <instance-id>` to check other instances as needed.

In the interactive shell, list the installed shared runtimes:

```bash
dotnet --list-runtimes
```

For framework-dependent ASP.NET Core apps, check the relevant `Microsoft.NETCore.App` and `Microsoft.AspNetCore.App` entries against the patched version for your release line.

**Installed runtimes do not by themselves prove which runtime your app process uses.** Use existing startup logging or diagnostics to inspect `System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription` from the running application. For scaled-out apps, verify across instances. Avoid exposing runtime diagnostics through an unauthenticated public endpoint.

`dotnet --version` reports the SDK version, not the runtime used by your app. For self-contained deployments, inspect the application process and rebuild the deployment with a patched runtime; the platform's shared-runtime list does not verify your bundled runtime.

## Related updates

- [Emergency Node.js and Python runtime updates on App Service for Linux]({{ site.baseurl }}{% post_url 2026-10-22-node-python-emergency-release-app-service-linux %}) covers the separate Node.js and Python releases, including the Node.js Brotli fix.
- [Time zone updates on App Service for Linux]({{ site.baseurl }}{% post_url 2026-10-22-time-zone-updates-app-service-linux %}) covers the separate time-zone data updates.
- [eMudhra / emSign certificate security updates on App Service for Linux]({{ site.baseurl }}{% post_url 2026-10-22-emudhra-certificate-issue-app-service-linux %}) covers the separate certificate trust-store updates. Runtime updates do not replace certificate bundles managed by your app.

Thank you for helping us keep your .NET apps on Azure App Service secure.
