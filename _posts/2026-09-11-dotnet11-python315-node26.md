---
title: ".NET 11, Python 3.15, and Node.js 26 on Azure App Service for Linux"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

# .NET 11, Python 3.15, and Node.js 26 on Azure App Service for Linux

The next generation of application runtimes is arriving on Azure App Service.

**.NET 11, Python 3.15, and Node.js 26 are now available in preview on App Service on Linux**, giving you an early opportunity to test application compatibility and experiment with new runtime and language capabilities.

Here are a few things you can try.

## A new Ubuntu 26.04 foundation

All three runtime images are based on **[Ubuntu 26.04 (Resolute Raccoon)](https://documentation.ubuntu.com/release-notes/26.04/summary-for-lts-users/)**. They also use a leaner package baseline to reduce image size, package maintenance, and security exposure.

If your application or startup scripts depend on operating-system tools or packages supplied by an earlier runtime image, test those dependencies before upgrading. Install application-specific dependencies as part of your deployment, or use a custom container when additional system packages are required.

Ubuntu 26.04 also uses the Rust-based uutils implementation for common commands such as `ls`, `cp`, and `cat`. These commands are largely GNU-compatible, but scripts that rely on GNU-specific options or output should be tested.

## .NET 11

.NET 11 brings updates across the runtime, ASP.NET Core, libraries, and C# 15.

**Try C# 15 language features**
Experiment with new capabilities such as union types and closed hierarchies, which can make it easier to model API results, application states, and other scenarios with a defined set of possible outcomes.

**Test the latest web and runtime improvements**
Try your ASP.NET Core applications with the latest runtime and framework improvements, and identify package or framework compatibility issues ahead of upgrading production applications.

**A leaner runtime image**
The .NET 11 image removes runtime-unnecessary operating-system packages, including development headers and disk, volume, and kernel-management libraries. Common App Service troubleshooting tools such as `curl`, `wget`, `tcpdump`, `tcpping`, `dig`, and `nslookup` remain available.

[Explore what's new in .NET 11](https://learn.microsoft.com/dotnet/core/whats-new/dotnet-11/overview)

## Python 3.15

Python 3.15 introduces new capabilities around startup performance, profiling, and developer productivity.

**Experiment with lazy imports**
Python 3.15 adds explicit lazy imports, allowing modules to be loaded only when they’re needed. Applications with larger dependency trees can experiment with this to reduce work during startup.

**Explore new profiling capabilities**
Try the new profiling tools in Python 3.15, including Tachyon, to investigate CPU usage and application performance with real web workloads.

**Review system and development dependencies**
The Python 3.15 image no longer includes the C/C++ compiler toolchain, SWIG, SQL Server ODBC driver and command-line tools, or preinstalled profiling packages such as VizTracer. Applications with source-only Python packages should use prebuilt wheels or a custom container. Applications connecting to Azure SQL or SQL Server through `pyodbc` must install the Microsoft ODBC driver as part of their deployment.

The image continues to include common application servers and frameworks such as Gunicorn, Uvicorn, and Flask.

[Explore what's new in Python 3.15](https://docs.python.org/3.15/whatsnew/3.15.html)

## Node.js 26

Node.js 26 brings the latest V8 runtime and JavaScript platform capabilities to App Service.

**Try the Temporal API**
Temporal provides a modern approach to working with dates, times, time zones, and durations—and is enabled by default in Node.js 26.

**Explore the latest JavaScript and HTTP improvements**
Node.js 26 includes V8 14.6 and Undici 8, along with new JavaScript APIs. Try your existing application to validate package compatibility and explore the latest runtime capabilities.

**Review globally available tools**
The Node.js 26 image no longer includes a system Python interpreter, Corepack, or the globally installed Application Insights npm package. Applications that require Corepack—for example, to use pnpm or Yarn Berry—should install it explicitly. Applications using the Application Insights SDK should declare it in their own `package.json`. Yarn Classic remains available.

[Explore what's new in Node.js 26](https://nodejs.org/en/blog/release/v26.0.0)

## Get started

You can create an App Service app using these runtime versions through the Azure portal, Azure CLI, or an ARM/Bicep template.

### Node.js 26 LinuxFxVersion standardization

Starting with Node.js 26, App Service uses the standardized `LinuxFxVersion` value **`NODE|26`**.

When you create or configure an app through the Azure portal, the portal automatically selects this standardized value. When using Azure CLI, specify Node.js 26 as the runtime:

```azurecli
az webapp create \
  --resource-group <resource-group-name> \
  --plan <app-service-plan-name> \
  --name <app-name> \
  --runtime "NODE:26"
```

For Bicep-based deployments, set `linuxFxVersion` explicitly to `NODE|26`:

```bicep
resource webApp 'Microsoft.Web/sites@2024-11-01' = {
  name: appName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|26'
    }
  }
}
```

### .NET 11 and Python 3.15

There is no change to the runtime naming or deployment experience for .NET 11 and Python 3.15. You can create apps using these stacks through the Azure portal, Azure CLI, or ARM/Bicep templates as usual.

Because support is currently in **preview**, we recommend using these versions for development, experimentation, and compatibility testing.

Give them a try and let us know what you think.
