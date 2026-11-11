---
title: ".NET 11 and Python 3.15 are generally available, and Node.js 26 LTS is now on Azure App Service"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

**.NET 11 and Python 3.15 are now generally available on Azure App Service for Linux, alongside Node.js 26 Long Term Support (LTS).** You can use these runtimes for production applications, whether you're creating a new app or upgrading an existing workload.

Following the [preview announcement]({{ site.baseurl }}{% post_url 2026-09-11-dotnet11-python315-node26 %}), these releases bring the latest runtime capabilities to App Service's managed hosting experience. This release also makes **Linux the default operating system for new .NET 11 apps created through the Azure portal**.

## .NET 11: generally available, with the latest security fixes

.NET 11 brings improvements across the runtime, ASP.NET Core, libraries, and C# 15. Runtime-native async and JIT improvements target lower overhead and better application performance, while new language capabilities help developers model application data and behavior.

**The [.NET 11 GA release](https://github.com/dotnet/core/blob/main/release-notes/11.0/11.0.0/11.0.0.md) includes the latest batch of security fixes released on Tuesday, November 10, 2026.** For the security advisories, affected components, and remediation guidance, see the [.NET and .NET Framework November 2026 servicing updates](https://devblogs.microsoft.com/dotnet/dotnet-and-dotnet-framework-november-2026-servicing-updates/).

The November 10 servicing release also patched **[.NET 8](https://github.com/dotnet/core/blob/main/release-notes/8.0/8.0.34/8.0.34.md), [.NET 9](https://github.com/dotnet/core/blob/main/release-notes/9.0/9.0.23/9.0.23.md), and [.NET 10](https://github.com/dotnet/core/blob/main/release-notes/10.0/10.0.15/10.0.15.md)** in both the latest and stable channels.

App Service manages updates to its built-in runtime images. If you deploy a self-contained .NET application or a custom container, update and redeploy the runtime you package with your application. Review your application's NuGet dependencies separately as part of your upgrade.

### Linux is the default for new .NET 11 apps

When you select .NET 11 while creating a new app in the Azure portal, **Linux is now the default OS selection**. Windows remains available for applications that need it.

This changes the default for new apps; it does not migrate existing apps or change their operating system. Before moving a Windows-hosted application to Linux, validate Windows-specific dependencies, file-path casing, native libraries, and startup behavior.

[Explore what's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview).

## Python 3.15: generally available

Python 3.15 is now available for production workloads on App Service for Linux. Highlights include:

- **Explicit lazy imports**, which let applications defer loading modules until they're needed and reduce unnecessary startup work.
- **New profiling capabilities**, including the Tachyon statistical sampling profiler, to help investigate application performance.
- **UTF-8 as the default encoding**, making text handling more consistent across environments. Check code that relies on a different implicit encoding before upgrading.

Validate your dependency pins and native wheels against Python 3.15 before moving production traffic. As noted in the preview, the leaner Python image no longer includes the C/C++ compiler toolchain, SWIG, or the Microsoft SQL Server ODBC driver and command-line tools. Use compatible prebuilt wheels or a custom container when your application needs additional native build or system dependencies.

[Explore what's new in Python 3.15](https://docs.python.org/3.15/whatsnew/3.15.html).

## Node.js 26: now in LTS

Node.js 26 has moved into **Long Term Support**, making this release line a production upgrade target on App Service for Linux.

The release brings the **Temporal API enabled by default** for working with dates, times, time zones, and durations, along with the V8 14.6 engine and Undici 8 HTTP client improvements.

The runtime configuration introduced in the preview is unchanged: App Service uses **`NODE|26`** as the `LinuxFxVersion` value. The Azure portal selects this value automatically.

Remember to declare application dependencies explicitly. The Node.js 26 image no longer includes Corepack, a system Python interpreter, or the globally installed Application Insights npm package. Install Corepack explicitly if your package-manager workflow requires it, and include the Application Insights SDK in your application's `package.json` if you use it.

See the [Node.js 26 release highlights](https://nodejs.org/en/blog/release/v26.0.0) and [Node.js 26 LTS release notes](https://nodejs.org/en/blog/release/v26.13.1).

## A shared Ubuntu 26.04 foundation

All three Linux runtime images use **[Ubuntu 26.04 LTS (Resolute Raccoon)](https://documentation.ubuntu.com/release-notes/26.04/summary-for-lts-users/)** and the leaner package baseline introduced in the preview.

If you're upgrading from an older runtime image, test any startup scripts or native dependencies that rely on preinstalled OS packages. Ubuntu 26.04 also uses Rust-based uutils for common commands such as `ls`, `cp`, and `cat`; validate scripts that depend on GNU-specific options or output.

## Get started

Create a new app in the [Azure portal](https://portal.azure.com/) and select .NET 11, Python 3.15, or Node.js 26 on Linux. You can also configure these runtimes through Azure CLI or your existing ARM/Bicep deployment workflow.

For existing applications:

1. Deploy to a staging app or deployment slot configured with the target runtime.
2. Run your application tests, including startup, dependency installation, authentication, and external service connections.
3. Compare request latency, CPU, and memory with your current runtime, then move production traffic after validation.

These runtimes are no longer preview-only on App Service for Linux. Bring your production workloads forward with the latest language capabilities and App Service's managed runtime experience.
