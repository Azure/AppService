---
title: "Azure Functions: .NET Brotli Security Updates"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **Update (26 October 2026):** The .NET security update rollout for **Linux Azure Functions is in progress**. The applicable update for **Azure Static Web Apps managed functions is also in progress** and depends on the Functions Linux rollout. Windows function apps on Consumption, App Service plans, and Elastic Premium depend on the **App Service Windows runtime rollout**, which is active through Safe Deployment Practices (SDP) and is **not yet complete**.

The out-of-band .NET releases published on **25 October 2026** address a Brotli decoder vulnerability and additional security issues. The patching process for function apps depends on their **operating system, hosting plan, and deployment model**.

## Rollout by hosting plan and operating system

| Hosting plan or offering | Windows | Linux |
|---|---|---|
| Consumption | Follows App Service Windows runtime rollout; in progress. | Azure Functions rollout in progress. |
| App Service plan (Dedicated) | Follows App Service Windows runtime rollout; in progress. | Azure Functions rollout in progress. |
| Elastic Premium | Follows App Service Windows runtime rollout; in progress. | Azure Functions rollout in progress. |
| Flex Consumption | Not available on Windows. | Azure Functions rollout in progress. |
| Static Web Apps managed functions | Not applicable. | Applicable update in progress; depends on the Azure Functions Linux rollout. |

These statuses describe platform-managed updates. **Do not assume that every app or instance has received the patched runtime while rollout is ongoing.** Application-managed packages, self-contained deployments, and custom containers require separate review.

### Linux: Consumption, App Service plans, Elastic Premium, and Flex Consumption

The Azure Functions team is rolling out the applicable .NET updates for Linux function apps on the hosting plans listed above.

The [App Service Linux .NET post]({{ site.baseurl }}{% post_url 2026-10-26-dotnet-brotli-security-update-app-service-linux %}) provides background on the upstream releases. **Its Latest completion status, Standard rollout status, runtime-version table, and Platform Release Channel instructions are not Azure Functions rollout or support guidance**, including for Linux functions hosted on App Service plans.

#### Azure Static Web Apps managed functions

The applicable .NET update for **Azure Static Web Apps managed functions is in progress** and depends on the **Azure Functions Linux rollout**. It is not yet complete.

This status applies to **managed functions**, not a separately linked Azure Functions app. For a linked function app, use its hosting plan and OS to identify the rollout that applies. This update does not add support for a new language or runtime version in Static Web Apps managed functions.

### Windows: Consumption, App Service plans, and Elastic Premium

Windows function apps on Consumption, App Service plans, and Elastic Premium receive the applicable platform runtime updates through the **App Service Windows patching process**.

Follow the [App Service Windows .NET post]({{ site.baseurl }}{% post_url 2026-10-26-dotnet-brotli-security-update-app-service-windows %}) for the corresponding rollout status. Deployment is active through SDP, but it is not yet complete.

## What the updates address

### Brotli decoder vulnerability

The primary fix addresses [CVE-2026-111497, a Brotli decoder out-of-bounds write](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-111497) in the Brotli library used by .NET and ASP.NET Core. Processing maliciously crafted compressed data could result in **denial of service, information disclosure, or elevation of privilege**.

Affected code paths include ASP.NET Core request decompression, `HttpClient` automatic response decompression, and the `System.IO.Compression` Brotli APIs. Automatic request and response decompression are **not enabled by default**. Review the decompression paths your functions and dependencies actually use; this does not imply that every HTTP-triggered function enables Brotli request decompression.

**.NET Framework is not affected** by this issue.

These releases include additional security fixes. See the official release notes below for applicability and any separate application-package updates.

## Upstream patched versions and Functions support

The following upstream releases were published on **25 October 2026**:

| .NET release line | Upstream patched runtime | Official release notes |
|---|---|---|
| .NET 8 | **8.0.33** | [.NET 8.0.33](https://github.com/dotnet/core/blob/main/release-notes/8.0/8.0.33/8.0.33.md) |
| .NET 9 | **9.0.22** | [.NET 9.0.22](https://github.com/dotnet/core/blob/main/release-notes/9.0/9.0.22/9.0.22.md) |
| .NET 10 | **10.0.14** | [.NET 10.0.14](https://github.com/dotnet/core/blob/main/release-notes/10.0/10.0.14/10.0.14.md) |
| .NET 11 RC3 (prerelease) | **11.0.0-rc.3.26522.148** | [.NET 11.0.0-rc.3](https://github.com/dotnet/core/blob/main/release-notes/11.0/preview/rc3/11.0.0-rc.3.md) |

**This is an upstream reference table, not an Azure Functions support or availability matrix.** An upstream release or its availability in App Service does not establish support for your Functions hosting plan or execution model.

Use a .NET version supported by Azure Functions for your OS, plan, and execution model. Review the [isolated worker supported versions](https://learn.microsoft.com/azure/azure-functions/dotnet-isolated-process-guide#supported-versions) and [in-process supported versions](https://learn.microsoft.com/azure/azure-functions/functions-dotnet-class-library#supported-versions). This update does not change your configured release line, migrate your execution model, or add support for .NET 11 RC3.

## What you should do

1. **Identify your OS, hosting plan, and execution model.** Use the rollout table above to determine which platform update applies. For Static Web Apps, distinguish managed functions from a separately linked function app.
2. **Verify the runtime in your running function process.** Do not rely only on configured settings, an installed SDK, or an App Service rollout announcement.
3. **Review application-managed packages.** Follow the official release notes and update affected dependencies through your trusted package source. Rebuild, test, and redeploy as needed.
4. **Update self-contained deployments and custom containers yourself.** Platform patching does not replace runtimes bundled with your app or patch the contents of your custom image. Rebuild with the applicable patched runtime and dependencies, test, and redeploy.
5. **Test affected code paths.** Exercise the decompression and networking behavior your functions actually use after updating.

### Verify your running .NET runtime

Use existing application logging or diagnostics to record `System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription` from your executing function code. With an existing `ILogger` instance named `logger`, for example:

```csharp
logger.LogInformation(
    "Function runtime: {Runtime}",
    System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription);
```

For isolated worker apps, verify the **.NET worker process**, not just the Functions host. For in-process apps, function code runs within the host process. Inspect logs across active instances while rollout progresses; avoid exposing runtime diagnostics through an unauthenticated public endpoint.

`dotnet --version` reports the SDK version, and a shared-runtime list only identifies installed runtimes. Neither proves which runtime your function process uses. Self-contained deployments must be verified and updated separately.

## Related updates

- [.NET Brotli security updates on App Service for Linux]({{ site.baseurl }}{% post_url 2026-10-26-dotnet-brotli-security-update-app-service-linux %}) covers the separate App Service Linux image rollout.
- [.NET Brotli security updates on App Service for Windows]({{ site.baseurl }}{% post_url 2026-10-26-dotnet-brotli-security-update-app-service-windows %}) covers the Windows runtime rollout on which Windows function apps depend.
- [Azure Functions time-zone, Node.js, Python, and certificate updates]({{ site.baseurl }}{% post_url 2026-10-23-time-zone-runtime-certificate-updates-azure-functions %}) covers the earlier, separate updates. Completion of those Linux updates does not establish completion of this .NET rollout.

Thank you for helping us keep your .NET function apps secure.
