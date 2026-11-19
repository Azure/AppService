---
title: "Java4Shell Security Updates on Azure App Service"
author_name: "Igor Titanov"
category: java
toc: true
toc_sticky: true
---

> **Update (18 November 2026, 17:40 PT)**: Rollout for Linux Standard and Latest channels are complete and customers using auto-update will automatically receive the version upgrade outside local business hours. The restart may cause a brief interruption, and timing may vary by region and application instance. For apps configured for auto-update, manually restarting the application will also pick up the version upgrade. Pinned versions require a runtime configuration change as described below.

Oracle published fixed Java releases on 17 November 2026. Azure App Service is applying the appropriate platform updates for the built-in Java runtime environments.

## Rollout status

| Platform | Availability of the update |
|---|---|
| Azure App Service for Linux | Platform rollout is done. |
| Azure App Service for Windows | Platform rollout in progress. |

The rollout is expected to complete for Windows environments by the end of 19 November 2026.

This status applies to platform-managed Java runtimes. Applications that bundle their own Java runtime or run in a custom container remain responsible for rebuilding and redeploying with a fixed runtime.

## Fixed Java release lines

The following Oracle Java releases include the fix:

| Java release line | First fixed release |
|---|---|
| Java 17 | **17.0.21.1+4** |
| Java 21 | **21.0.13.1+4** |
| Java 25 | **25.0.5.1+4** |

Use the supported fixed release that is appropriate for your application and deployment model. See [Oracle's November 2026 security alert](https://www.oracle.com/security-alerts/cspunov2026.html) for the complete release information.

## What you should do

1. **Verify the Java runtime used by your running application and determine whether it is affected.** Do not rely only on an installed Java binary or a configured application setting. [Standard Java 8 and Java 11 are not affected](https://phoenix.security/java4shell-cve-2026-114938-openjdk-base64-heap-overflow/) and do not require a major-version upgrade for this CVE; Oracle Java 8 Enterprise Performance Pack is an exception, with **8u513-perf** as its fixed release.
2. **For affected applications pinned to a built-in Java runtime version, update the runtime configuration to a fixed version available for your app.** Restarting alone will not move a pinned app to the fixed release. Validate the change in a staging slot or your usual validation environment, then redeploy or restart and confirm that the application is using a fixed release. The Windows rollout is still in progress; confirm availability for your app before changing its configuration.
3. **For affected applications configured for auto-update, restart after the platform rollout completes for your app**, then confirm that your application is using a fixed release.
4. **Update affected custom containers and bundled runtimes yourself.** Rebuild with a fixed Java runtime, test the application, and redeploy the image.
5. **Continue normal application validation and deployment practices.** Test each application in your usual validation environment before production deployment where possible.

### Check your configured and running Java versions

Follow [Show the Java version](https://learn.microsoft.com/azure/app-service/configure-language-java-deploy-run#show-the-java-version) to inspect `linuxFxVersion` on Linux or `javaVersion`, `javaContainer`, and `javaContainerVersion` on Windows with `az webapp config show`, and to list supported runtimes. Check whether your configuration selects a pinned patch version or auto-update. See [Choose a Java runtime version](https://learn.microsoft.com/azure/app-service/configure-language-java-deploy-run#choose-a-java-runtime-version) for version-pinning guidance. For Tomcat on Linux, the JVM patch version is tied to the selected Tomcat version; on Windows, the JVM and Tomcat patch versions can be pinned independently.

For Java 17, 21, and 25, use your application's existing startup logging or diagnostics to log `Runtime.version()` from the running application process. Compare the full runtime version, including the build number, with the fixed releases above. For scaled-out apps, verify across instances. A version returned by `java -version` in a separate console does not by itself prove which JVM your application process uses.

## What the updates address

CVE-2026-114938 is a memory-safety issue in the optimized Base64 decoder included with affected OpenJDK releases. Malicious or malformed input can trigger unintended memory writes when the application uses the vulnerable decoder. The update includes fixed Java runtime releases for the affected Java release lines.

For more information about this issue, see Datadog's [Java4Shell security analysis](https://securitylabs.datadoghq.com/articles/java4shell-remote-code-execution-in-openjdk-cve-2026-114938/).
