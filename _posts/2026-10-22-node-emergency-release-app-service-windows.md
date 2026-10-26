---
title: "Emergency Node.js Runtime Updates on Azure App Service for Windows"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **Update (26 October 2026):** The rollout of updated built-in Node.js runtimes on **Azure App Service for Windows is complete**, following accelerated Safe Deployment Practices (SDP). Verify your app's running version and review pinned runtime settings as described below.

Following the emergency Node.js releases on **21 October 2026**, the Azure App Service team has rolled out updated Node.js runtimes for Windows apps.

## Patched versions and official release notes

For the **22.x and 24.x** release lines covered in this article, the [official Node.js security announcement](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) lists fixes with a highest severity of **High**, including fixes for a Brotli decoder out-of-bounds write that permits remote code execution, DNS name handling, and TLS certificate hostname validation. The release also includes dependency updates and a CA-certificate update related to the eMudhra intermediate CA compromise.

| Node.js release line | Patched version | Official release notes |
|---|---|---|
| 22.x | **22.23.4** | [Node.js 22.23.4](https://nodejs.org/en/blog/release/v22.23.4/) |
| 24.x | **24.22.1** | [Node.js 24.22.1](https://nodejs.org/en/blog/release/v24.22.1/) |

These are the upstream patched versions for the release lines covered here, **not confirmation that your app already runs them**. See the official security announcement for the complete vulnerability list and affected release lines.

## What we are doing

We have completed the rollout of the updated built-in Node.js runtimes across App Service for Windows through accelerated SDP.

**Platform Release Channels do not apply to App Service for Windows.** There is no Latest or Standard channel to select for this rollout. The Linux channel instructions in our related posts do not apply to Windows apps.

For more information about platform-managed runtime updates, see [OS and runtime patching in Azure App Service](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime).

## What you should do

1. **Check your app's running Node.js version.** Verify the version used by the application process against the patched versions listed above.
2. **Use a supported Node.js release line.** End-of-life runtimes do not receive these fixes. Update and test your app on a supported release line if necessary.
3. **Review pinned runtime settings.** If your app is pinned to an older patch version, review its runtime configuration so it can use an updated version. See [Configure a Node.js app for Azure App Service](https://learn.microsoft.com/azure/app-service/configure-language-nodejs?pivots=platform-windows#configure-nodejs-version).
4. **Update bring-your-own runtimes and custom containers yourself.** App Service does not patch Node.js binaries that you supply. Update to the applicable patched version, test, and redeploy.

### Verify your running Node.js version

Use your application's existing startup logging or diagnostics to inspect **`process.version`** in the running Node.js application process. For example, log the version during application startup:

```javascript
console.log(`Node.js runtime: ${process.version}`);
```

Review that output in your application's logs after deployment or the next application startup. Avoid exposing runtime diagnostics through an unauthenticated public endpoint.

The version selected in configuration or reported by a separate console process does not by itself prove which Node.js binary your application process uses. For scaled-out apps, check the application logs across instances.

## Related updates

- [Time zone updates on App Service for Windows]({% post_url 2026-10-23-time-zone-updates-app-service-windows %}) covers the separate Windows OS time-zone update, whose accelerated SDP rollout is complete.
- [eMudhra / emSign certificate security updates on App Service for Windows]({% post_url 2026-10-22-emudhra-certificate-issue-app-service-windows %}) covers the separate Windows OS certificate update. Runtime updates do not replace certificate bundles managed by your app.
- [Node.js and Python emergency runtime updates on App Service for Linux]({% post_url 2026-10-22-node-python-emergency-release-app-service-linux %}) covers the separate Linux rollout. Its Platform Release Channel instructions do not apply to Windows.
- [Critical PHP security release guidance for App Service]({% post_url 2026-10-21-php-critical-security-release-app-service-linux %}) covers the separate PHP security release and Windows PHP guidance.

Thank you for helping us keep your Node.js apps on Azure App Service secure.
