---
title: "Node.js 24 on Azure App Service for Linux"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

Node.js 24 is live on Azure App Service for Linux. Faster runtime, tighter tooling, same App Service simplicity. 

A quick look at what the new runtime gives you:

**1. Faster, more modern JavaScript**
Node.js 24 ships with the V8 13.6 engine and npm 11. You get newer JavaScript capabilities like `RegExp.escape`, `Float16Array` for tighter numeric data, improved async context handling, global `URLPattern`, and better WebAssembly memory support. All of this means cleaner code and better performance without extra polyfills or libraries. 
This release line is an even-numbered release and has moved into Long Term Support (LTS) in October 2025, which makes it a safe target for production apps. 

**2. Cleaner built-in testing workflows**
The built-in `node:test` runner in Node.js 24 now automatically waits on nested subtests, so you get reliable, predictable test execution without wiring up manual `await` logic or pulling in a third-party test framework. That means fewer flaky “test didn’t finish” errors in CI. 

For full release details, see the official Node.js 24 release notes:
[https://nodejs.org/blog/release/v24.0.0](https://nodejs.org/blog/release/v24.0.0) 

### Deploying Node.js 24 on App Service today

Right now, you can already create and deploy Node.js 24 apps on **Azure App Service for Linux** using:

* Azure CLI
* ARM/Bicep templates

You can start from the standard App Service Node.js quickstart and point your app at the Node.js 24 runtime on Linux App Service plans:
[https://learn.microsoft.com/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-vscode](https://learn.microsoft.com/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-vscode)

### Portal support is rolling out

Portal create + configure support for Node.js 24 in App Service for Linux is rolling out now and will light up in the next couple of weeks — you’ll be able to pick Node.js 24 directly in the Azure portal with no extra setup. We will update this blog once the portal rollout is complete.

Bring your Node.js 24 app to App Service for Linux, scale it, monitor it, and take advantage of the latest runtime improvements.
