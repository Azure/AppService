---
title: "Upcoming Node.js Security Updates for Azure App Service and Azure Functions"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **Status (10 November 2026):** The Node.js project plans to publish security releases on or shortly after **Wednesday, 11 November 2026**. Azure App Service and Azure Functions are preparing to patch their applicable platform-managed Node.js runtimes as soon as the updated builds become available. **This is advance notice, not confirmation that patched runtimes are available on Azure.**

The [official Node.js security announcement](https://nodejs.org/en/blog/vulnerability/november-2026-security-releases) covers the **22.x, 24.x, and 26.x** release lines. The highest severity issue to be addressed is **High** in each of these release lines.

## What the updates address

The announcement currently provides the affected release lines, highest severity, and planned release timing. It does **not yet list patched version numbers or detailed vulnerability information**. Refer to the official announcement for updates as the Node.js project publishes them.

These are upcoming November releases, separate from the October Node.js and .NET Brotli updates. Completion of those earlier Azure rollouts does not establish that an app has received these new fixes.

The upstream release lines listed above are **not an Azure App Service or Azure Functions support or availability matrix**. Use a Node.js release line supported by your service, operating system, and hosting plan. This update does not add support for a new major version or change your app's configured release line.

## What we are doing

The Azure App Service and Azure Functions teams plan to begin patching applicable platform-managed Node.js runtimes **as soon as the updated builds become available**, with validation and rollout through Safe Deployment Practices (SDP).

Upstream publication and Azure rollout completion are separate milestones. A November 11 upstream release does not mean every Azure app will receive the update that day. Patched versions and Azure rollout status will be shared here as they are confirmed.

### Azure App Service for Windows

Updated built-in Node.js runtimes will roll out through the App Service Windows patching process.

### Azure App Service for Linux

Updated built-in Node.js images will roll out through the [Platform Release Channels](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime#control-runtime-patch-update-timing-with-platform-release-channel). Availability on Latest and Standard will be reported as the rollout progresses; neither channel is being announced as patched in this advance notice.

Changing your Platform Release Channel does not change your app's configured Node.js release line.

### Azure Functions

The patching process depends on your function app's **operating system and hosting plan**:

- **Windows: Consumption, App Service plans (Dedicated), and Elastic Premium.** Applicable platform-managed Node.js updates follow the App Service Windows patching process.
- **Linux: Consumption, App Service plans (Dedicated), Elastic Premium, and Flex Consumption.** Applicable platform-managed Node.js updates follow the Azure Functions Linux rollout.

**App Service Linux Platform Release Channel instructions and rollout status are not Azure Functions rollout or support guidance**, including for Linux functions hosted on App Service plans.

Use a [Node.js version supported by Azure Functions](https://learn.microsoft.com/azure/azure-functions/functions-reference-node#supported-versions) for your hosting plan. An upstream release or its availability in App Service does not establish availability for your function app.

## What you should do

1. **Identify your service, OS, and hosting plan.** Use the guidance above to determine which platform rollout applies to your app.
2. **Use a supported Node.js release line.** The Node.js project warns that end-of-life versions are also affected by security issues but do not receive these releases. Plan and test a move to a supported release line if necessary.
3. **Review pinned runtime settings.** Ensure your configuration permits an updated patch version within your supported release line. For App Service, see [Configure a Node.js app](https://learn.microsoft.com/azure/app-service/configure-language-nodejs). For Functions, follow the supported-version guidance linked above.
4. **Monitor the upstream announcement and this post.** Once patched versions and the applicable Azure rollout are confirmed, verify the runtime used by your running app. Do not treat an upstream release or an earlier rollout completion notice as proof that your app is patched.
5. **Update custom containers and bring-your-own runtimes yourself.** Platform patching does not replace Node.js binaries that you supply or patch the contents of your custom image. Once the applicable fixed version is available, update your runtime or rebuild your image, test, and redeploy.
6. **Review application-managed dependencies.** Follow the published security release notes for any dependency updates or additional actions required separately from the platform runtime.

### Verify your running Node.js version

Use existing application logging or diagnostics to inspect **`process.version`** from the running Node.js application process or Functions worker. For example, record the version during application or worker startup:

```javascript
console.log(`Node.js runtime: ${process.version}`);
```

After the applicable update is available and your app has picked it up, compare the logged version with the published patched version for your release line. For scaled-out apps, check logs across active instances. Avoid exposing runtime diagnostics through an unauthenticated public endpoint.

The configured release line, a version reported by a separate console process, or the Azure Functions host version does not by itself prove which Node.js runtime your application or function worker uses.

## Related updates

- [Emergency Node.js runtime updates on App Service for Windows]({% post_url 2026-10-22-node-emergency-release-app-service-windows %}) covers the separate October Node.js rollout.
- [Emergency Node.js and Python runtime updates on App Service for Linux]({% post_url 2026-10-22-node-python-emergency-release-app-service-linux %}) covers the separate October Linux runtime updates.
- [Azure Functions time-zone, Node.js, Python, and certificate updates]({% post_url 2026-10-23-time-zone-runtime-certificate-updates-azure-functions %}) covers the earlier Functions updates.
- [.NET Brotli security updates for Azure Functions]({% post_url 2026-10-26-dotnet-brotli-security-update-azure-functions %}) covers the separate .NET updates and links to the App Service .NET posts.

## Stay informed

This post will be updated with patched Node.js versions and Azure rollout progress as they are confirmed. For the latest upstream details, follow the [Node.js security announcement](https://nodejs.org/en/blog/vulnerability/november-2026-security-releases).

Thank you for helping us keep your Node.js apps on Azure App Service and Azure Functions secure.
