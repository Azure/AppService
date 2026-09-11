# .NET 11, Python 3.15, and Node.js 26 on Azure App Service for Linux

The next generation of application runtimes is arriving on Azure App Service.

**.NET 11, Python 3.15, and Node.js 26 are now available in preview on App Service on Linux**, giving you an early opportunity to test application compatibility and experiment with new runtime and language capabilities.

Here are a few things you can try.

## .NET 11

.NET 11 brings updates across the runtime, ASP.NET Core, libraries, and C# 15.

**Try C# 15 language features**
Experiment with new capabilities such as union types and closed hierarchies, which can make it easier to model API results, application states, and other scenarios with a defined set of possible outcomes.

**Test the latest web and runtime improvements**
Try your ASP.NET Core applications with the latest runtime and framework improvements, and identify package or framework compatibility issues ahead of upgrading production applications.

[Explore what's new in .NET 11](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/overview)

## Python 3.15

Python 3.15 introduces new capabilities around startup performance, profiling, and developer productivity.

**Experiment with lazy imports**
Python 3.15 adds explicit lazy imports, allowing modules to be loaded only when they’re needed. Applications with larger dependency trees can experiment with this to reduce work during startup.

**Explore new profiling capabilities**
Try the new profiling tools in Python 3.15, including Tachyon, to investigate CPU usage and application performance with real web workloads.

[Explore what's new in Python 3.15](https://docs.python.org/3.15/whatsnew/3.15.html)

## Node.js 26

Node.js 26 brings the latest V8 runtime and JavaScript platform capabilities to App Service.

**Try the Temporal API**
Temporal provides a modern approach to working with dates, times, time zones, and durations—and is enabled by default in Node.js 26.

**Explore the latest JavaScript and HTTP improvements**
Node.js 26 includes V8 14.6 and Undici 8, along with new JavaScript APIs. Try your existing application to validate package compatibility and explore the latest runtime capabilities.

[Explore what's new in Node.js 26](https://nodejs.org/en/blog/release/v26.0.0)

## Get started

You can select these new runtime versions from **Stack settings** for your Linux App Service application, either from the Azure portal or CLI.

Because support is currently in **preview**, we recommend using these versions for development, experimentation, and compatibility testing.

Give them a try and let us know what you think.
