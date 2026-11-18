---
title: ".NET 11 and Node.js 26 LTS are generally available on Azure App Service for Windows"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

**.NET 11 and Node.js 26 Long Term Support (LTS) are now generally available on Azure App Service for Windows.** You can use these runtimes for production applications, whether you're creating a new app or upgrading an existing workload.

## .NET 11: generally available, with the latest security fixes

.NET 11 brings improvements across the runtime, ASP.NET Core, libraries, and C# 15. Runtime-native async and JIT improvements target lower overhead and better application performance, while new language capabilities help developers model application data and behavior.

**The [.NET 11 GA release](https://github.com/dotnet/core/blob/main/release-notes/11.0/11.0.0/11.0.0.md) includes the latest batch of security fixes released on Tuesday, November 10, 2026.** For the security advisories, affected components, and remediation guidance, see the [.NET and .NET Framework November 2026 servicing updates](https://devblogs.microsoft.com/dotnet/dotnet-and-dotnet-framework-november-2026-servicing-updates/).

App Service manages updates to its built-in runtimes. If you deploy a self-contained .NET application or a custom container, update and redeploy the runtime you package with your application. Review your application's NuGet dependencies separately as part of your upgrade.

## Node.js 26: now in LTS

Node.js 26 has moved into **Long Term Support**, making this release line a production upgrade target on App Service for Windows.

The release brings the **Temporal API enabled by default** for working with dates, times, time zones, and durations, along with the V8 14.6 engine and Undici 8 HTTP client improvements.

On Windows, select Node.js 26 in the Azure portal, or set the `WEBSITE_NODE_DEFAULT_VERSION` app setting to `~26`. See [Configure a Node.js app for Azure App Service](https://learn.microsoft.com/azure/app-service/configure-language-nodejs?pivots=platform-windows#configure-nodejs-version).

### Node.js 26 requires 64-bit

Node.js 26 no longer provides 32-bit builds, so your app must run as a **64-bit (x64)** process. If your app is configured for 32-bit, switch the platform setting to 64-bit before selecting Node.js 26. This is now possible on every tier, including Free: **[64-bit support is available on the Free tier for Windows apps]({{ site.baseurl }}{% post_url 2026-11-09-x64-support-app-service-free-windows %})**.

Remember to declare application dependencies explicitly in your `package.json`, and validate native add-ons against Node.js 26 and the x64 architecture before moving production traffic.

See the [Node.js 26 release highlights](https://nodejs.org/en/blog/release/v26.0.0) and [Node.js 26 LTS release notes](https://nodejs.org/en/blog/release/v26.13.1).

## Get started

Create a new app in the [Azure portal](https://portal.azure.com/), choose Windows as the operating system, and select .NET 11 or Node.js 26. You can also configure these runtimes through Azure CLI or your existing ARM/Bicep deployment workflow.

For existing applications:

1. Deploy to a staging app or deployment slot configured with the target runtime (and 64-bit, for Node.js 26).
2. Run your application tests, including startup, dependency installation, authentication, and external service connections.
3. Compare request latency, CPU, and memory with your current runtime, then move production traffic after validation.

## Related updates

- [.NET 11 and Python 3.15 are generally available, and Node.js 26 LTS is now on Azure App Service]({{ site.baseurl }}{% post_url 2026-11-11-dotnet11-python315-node26-ga %}) covers the same runtimes on App Service for Linux, including Python 3.15 and the Ubuntu 26.04 foundation.
- [App Service Ignite 2026 Updates]({{ site.baseurl }}{% post_url 2026-11-17-app-service-update-rollup %}) rounds up the latest Azure App Service announcements.
