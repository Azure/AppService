---
title: "Node.js 24 on Azure App Service for Linux"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

Node.js 24 LTS is live on Azure App Service for Linux. You can create a new Node 24 app through the Azure portal, automate it with the Azure CLI, or roll it out using your favorite ARM/Bicep templates - faster runtime, tighter tooling, same App Service simplicity. 

A quick look at what the new runtime gives you:

**1. Faster, more modern JavaScript**
Node.js 24 ships with the V8 13.6 engine and npm 11. You get newer JavaScript capabilities like `RegExp.escape`, `Float16Array` for tighter numeric data, improved async context handling, global `URLPattern`, and better WebAssembly memory support. All of this means cleaner code and better performance without extra polyfills or libraries. 
This release line is an even-numbered release and has moved into Long Term Support (LTS) in October 2025, which makes it a safe target for production apps. 

**2. Cleaner built-in testing workflows**
The built-in `node:test` runner in Node.js 24 now automatically waits on nested subtests, so you get reliable, predictable test execution without wiring up manual `await` logic or pulling in a third-party test framework. That means fewer flaky “test didn’t finish” errors in CI. 

For full release details, see the official Node.js 24 release notes:
[https://nodejs.org/blog/release/v24.0.0](https://nodejs.org/blog/release/v24.0.0) 

Bring your Node.js 24 app to App Service for Linux, scale it, monitor it, and take advantage of the latest runtime improvements.
