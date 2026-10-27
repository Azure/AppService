---
title: "Azure Functions on Linux: Java Runtime and Certificate Security Updates"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
published: false
---

<!--
Editorial checklist before publication:
- Confirm applicable Linux hosting plans.
- Confirm rollout start, current status, and completion expectations.
- Confirm Linux final-image runtime qualification is complete.
- Verify the target OpenJDK builds against vendor release notes and add links.
- Confirm which Java release lines are supported and included on each plan.
- Replace the draft status notice and pending table entries with verified guidance.
-->

> **Draft (26 October 2026):** This post describes planned Java runtime and certificate trust updates for **Azure Functions on Linux only**. **Hosting-plan applicability, rollout status, and completion timing are pending confirmation.** This draft is not a rollout completion notice.

The updates extend Java certificate distrust protections and refresh the Microsoft OpenJDK builds identified below. For Linux function apps, the patching process depends on the **hosting plan and deployment model**.

**Windows function apps receive the applicable OS certificate updates through the App Service Windows patching process.** The [Azure Functions update post]({% post_url 2026-10-23-time-zone-runtime-certificate-updates-azure-functions %}) confirms completion for Windows Consumption, App Service plans, and Elastic Premium. See the [App Service Windows certificate update]({% post_url 2026-10-22-emudhra-certificate-issue-app-service-windows %}) for details and the separate review required for runtime-specific and application-managed trust stores. These posts confirm OS certificate update completion, not deployment of the OpenJDK builds listed below.

This post covers the separate Linux Functions update and does not change Windows guidance. Azure Static Web Apps managed functions are outside the scope of this post.

## Rollout by Linux hosting plan

| Linux hosting plan | Rollout status |
|---|---|
| Consumption | Applicability and rollout status pending confirmation. |
| App Service plan (Dedicated) | Applicability and rollout status pending confirmation. |
| Elastic Premium | Applicability and rollout status pending confirmation. |
| Flex Consumption | Applicability and rollout status pending confirmation. |

**Do not assume that any app or instance has received these updates based on this draft.** Linux final-image runtime qualification remains a release requirement; its completion has not been confirmed for this post.

The [earlier Azure Functions certificate update]({% post_url 2026-10-23-time-zone-runtime-certificate-updates-azure-functions %}) and the [separate .NET Brotli update]({% post_url 2026-10-26-dotnet-brotli-security-update-azure-functions %}) have their own scope and rollout status. Neither establishes completion of the Java updates described here.

## What the updates address

### Java certificate distrust protections

The planned update adds **32 alternative certificate encodings** to the Java 8 and Java 11 manual blocklist, completing the identified set of **48 certificate fingerprints**. It preserves the original three-root removal and existing blocklist entries.

Read-only checks across the managed Linux Java images are also being extended to cover the full fingerprint set.

For the Microsoft OpenJDK 17, 21, and 25 builds listed below, the vendor archives already include the required certificate distrust protections. The image update therefore removes manual certificate patching for these builds while retaining read-only root and blocklist checks. Java 8 and Java 11 continue to use manual certificate patching, with the expanded blocklist.

**An updated platform Java trust store does not prove that every TLS client in your function app uses updated trust data.** Application-managed trust stores, bundled CA data, and custom TLS configuration require separate review.

## Target OpenJDK builds and Functions support

The update plan identifies the following Microsoft OpenJDK builds:

| Java release line | Target Microsoft OpenJDK build |
|---|---|
| Java 17 | **17.0.21.0.2** |
| Java 21 | **21.0.13.0.2** |
| Java 25 | **25.0.5.0.2** |

**This is a target-build reference table, not an Azure Functions support or availability matrix.** These builds have not yet been independently verified against vendor release notes for this draft. Inclusion in the update plan does not establish support or deployment to your function app.

Use a [Java version supported by Azure Functions](https://learn.microsoft.com/azure/azure-functions/functions-reference-java#supported-versions) for your Linux hosting plan. This update does not imply a change to your configured Java release line or add support for a previously unsupported version.

## What you should do

1. **Identify your Linux hosting plan and deployment model.** Distinguish platform-managed Java from a runtime or container image you maintain yourself. Rollout guidance for this update is pending confirmation.
2. **Verify the runtime in your running Java worker.** Do not rely only on configured settings, build-tool output, or an App Service rollout announcement.
3. **Review application-managed trust stores.** Check custom trust stores, bundled CA data, and TLS clients that do not use the platform Java defaults.
4. **Update custom containers and bundled runtimes yourself.** Platform patching does not replace a runtime bundled with your app or patch the contents of your custom image. Obtain applicable updates through your trusted sources, rebuild, test, and redeploy.
5. **Test outbound TLS connections.** Exercise the endpoints and certificate chains your functions actually use. Work with endpoint owners to resolve trust failures rather than disabling certificate validation.

### Verify your running Java runtime

Use existing application logging or diagnostics to record the Java version and vendor from your executing function code. With an existing Azure Functions `ExecutionContext` instance named `context`, for example:

```java
context.getLogger().info(
    "Java runtime: " + System.getProperty("java.runtime.version")
        + "; vendor: " + System.getProperty("java.vendor"));
```

Verify the **Java worker process**, not just the Functions host or a shell session. Inspect logs across active instances; avoid exposing runtime diagnostics through an unauthenticated public endpoint.

A version string alone does not prove that certificate protections are present, especially for Java 8 and Java 11, where the image applies manual certificate patching. Review the trust configuration your application actually uses and test its TLS behavior separately.

## Related updates

- [Azure Functions time-zone, Node.js, Python, and certificate updates]({% post_url 2026-10-23-time-zone-runtime-certificate-updates-azure-functions %}) covers the earlier, separate platform updates.
- [Azure Functions .NET Brotli security updates]({% post_url 2026-10-26-dotnet-brotli-security-update-azure-functions %}) covers the separate .NET runtime update.

Thank you for helping us keep your Java function apps on Linux secure.
