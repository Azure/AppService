---
title: ".NET Brotli Security Updates on Azure App Service for Windows"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **Update (27 October 2026):** Rollout of the updated built-in .NET runtimes on **Azure App Service for Windows is complete** through Safe Deployment Practices (SDP).

Following the out-of-band .NET security releases on **25 October 2026**, Azure App Service has rolled out updated .NET runtimes for Windows apps. The primary fix addresses a vulnerability in the Brotli decoder used by .NET and ASP.NET Core.

## What the Brotli update addresses

The official .NET release notes describe [CVE-2026-111497, a Brotli decoder out-of-bounds write](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-111497). Processing maliciously crafted compressed data could result in **denial of service, information disclosure, or elevation of privilege**.

Applications can be affected when they use Brotli decompression through:

- ASP.NET Core request decompression.
- `HttpClient` automatic response decompression.
- The `System.IO.Compression` Brotli APIs.

Automatic request and response decompression are **not enabled by default**. **.NET Framework is not affected** by this issue.

## Patched versions and official release notes

The following upstream releases were published on **25 October 2026**:

| .NET release line | Patched runtime version | Official release notes |
|---|---|---|
| .NET 8 | **8.0.33** | [.NET 8.0.33](https://github.com/dotnet/core/blob/main/release-notes/8.0/8.0.33/8.0.33.md) |
| .NET 9 | **9.0.22** | [.NET 9.0.22](https://github.com/dotnet/core/blob/main/release-notes/9.0/9.0.22/9.0.22.md) |
| .NET 10 | **10.0.14** | [.NET 10.0.14](https://github.com/dotnet/core/blob/main/release-notes/10.0/10.0.14/10.0.14.md) |

These releases include additional security fixes. See the official release notes for the complete scope, platform applicability, and any application-package updates required separately from the platform runtime.

The table identifies upstream patched versions, **not confirmation that your app already runs them**. Verify your application's running runtime as described below.

## What we are doing

Rollout of the updated built-in .NET runtimes across App Service for Windows through SDP is complete. Verify the runtime used by your running application as described below, particularly if your app pins a runtime version or bundles its own runtime.

**Platform Release Channels do not apply to App Service for Windows.** There is no Latest or Standard channel to select for this rollout. Linux channel settings and rollout status do not apply to Windows apps.

The platform manages updates to its built-in runtimes. This rollout does not change your app's configured .NET release line.

For more information, see [OS and runtime patching in Azure App Service](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime).

## What you should do

1. **Verify the runtime used by your application.** Check the running application process rather than relying only on platform rollout completion.
2. **Use a supported .NET release line.** End-of-life runtimes do not receive these fixes. Update and test your app on a supported release line if necessary.
3. **Review pinned runtime settings and application-managed dependencies.** Ensure your runtime configuration permits an updated patch version. Follow the official release notes for affected packages that require updates independently of the shared runtime.
4. **Update self-contained deployments and custom containers yourself.** The platform runtime update does not replace a .NET runtime bundled with your application or inside your custom image. Rebuild with the applicable patched runtime, test, and redeploy. The same applies to other bring-your-own runtime deployments.

### Verify your runtime version

Use existing startup logging or diagnostics to inspect `System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription` from the running application. For example, log the runtime during application startup:

```csharp
Console.WriteLine(
    $"Runtime: {System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription}");
```

Review that output in your application's logs after deployment or the next application startup. Compare it with the patched version for your release line. For scaled-out apps, verify across instances. Avoid exposing runtime diagnostics through an unauthenticated public endpoint.

The configured release line or a runtime reported by a separate console process does not by itself prove which runtime your application process uses. `dotnet --version` reports the SDK version, not the running application's runtime.

For self-contained deployments, inspect the application process and rebuild with a patched runtime; a platform shared-runtime update does not replace your bundled runtime.

## Related updates

- [Emergency Node.js runtime updates on App Service for Windows]({% post_url 2026-10-22-node-emergency-release-app-service-windows %}) covers the separate Node.js releases, including the Node.js Brotli fix.
- [Time zone updates on App Service for Windows]({% post_url 2026-10-23-time-zone-updates-app-service-windows %}) covers the separate Windows OS time-zone update.
- [eMudhra / emSign certificate security updates on App Service for Windows]({% post_url 2026-10-22-emudhra-certificate-issue-app-service-windows %}) covers the separate Windows OS certificate trust update. Runtime updates do not replace certificate bundles managed by your app.

Thank you for helping us keep your .NET apps on Azure App Service secure.
