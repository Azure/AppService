---
title: "Java4Shell Security Updates on Azure App Service"
author_name: "Igor Titanov"
category: java
toc: true
toc_sticky: true
---
> **Update (20 November 2026, 15:00 PT)**: Rollout for Windows is complete. Customers using auto-update will need to manually restart their application to receive the version upgrade. The restart may cause a brief interruption.

> **Update (18 November 2026, 17:40 PT)**: Rollout for Linux Standard and Latest channels are complete and customers using auto-update will automatically receive the version upgrade outside local business hours. The restart may cause a brief interruption, and timing may vary by region and application instance. Manually restarting the application will also pick up the version upgrade.

Oracle published fixed Java releases on 17 November 2026. Azure App Service is applying the appropriate platform updates for the built-in Java runtime environments.

## Rollout status

| Platform | Availability of the update |
|---|---|
| Azure App Service for Linux | Platform rollout is done. |
| Azure App Service for Windows | Platform rollout is done. |

This status applies to platform-managed Java runtimes. Applications that bundle their own Java runtime or run in a custom container remain responsible for rebuilding and redeploying with a fixed runtime.

## Fixed Java release lines

The following Open JDK Java releases include the fix:

| Java release line | First fixed release |
|---|---|
| Java 17 | **17.0.21.1** |
| Java 21 | **21.0.13.1** |
| Java 25 | **25.0.5.1** |

Use the supported fixed release that is appropriate for your application and deployment model. See [Oracle's November 2026 security alert](https://www.oracle.com/security-alerts/cspunov2026.html) for the complete release information.

## What you should do

1. **Verify the Java runtime used by your running application and determine whether it is affected.** Do not rely only on an installed Java binary or a configured application setting. [Standard Java 8 and Java 11 are not affected](https://phoenix.security/java4shell-cve-2026-114938-openjdk-base64-heap-overflow/) and do not require a major-version upgrade for this CVE; Oracle Java 8 Enterprise Performance Pack is an exception, with **8u513-perf** as its fixed release.
2. **For affected applications that use a built-in Java runtime, restart after the platform rollout completes**, then confirm that your application is using a fixed release.
3. **Update affected custom containers and bundled runtimes yourself.** Rebuild with a fixed Java runtime, test the application, and redeploy the image.
4. **Continue normal application validation and deployment practices.** Test each application in your usual validation environment before production deployment where possible.

## What the updates address

CVE-2026-114938 is a memory-safety issue in the optimized Base64 decoder included with affected OpenJDK releases. Malicious or malformed input can trigger unintended memory writes when the application uses the vulnerable decoder. The update includes fixed Java runtime releases for the affected Java release lines.

For more information about this issue, see Datadog's [Java4Shell security analysis](https://securitylabs.datadoghq.com/articles/java4shell-remote-code-execution-in-openjdk-cve-2026-114938/).
