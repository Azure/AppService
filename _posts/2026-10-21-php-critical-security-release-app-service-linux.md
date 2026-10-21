---
title: "Critical PHP Security Release: What It Means for Azure App Service on Linux"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

The PHP security team's announcement covers **two critical vulnerabilities, both rated CVSS v4.0 9.2 (Critical)**.

**The release date is Wednesday, 21 October 2026 at 14:00 UTC.** The PHP security team publishes full details, affected versions, and fixed versions with the release.

- Official announcement: [php.net news, 20 Oct 2026](https://www.php.net/archive/2026.php#2026-10-20-1)
- Mailing list: [php.announce #509: Upcoming Critical PHP Security Release](https://news-web.php.net/php.announce/509)

## What we are doing

The Azure App Service team is **actively updating the built-in PHP images for App Service on Linux** with the fixed PHP versions.

Updated images roll out through the [Platform Release Channels](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime#control-runtime-patch-update-timing-with-platform-release-channel) as follows:

| Channel | Availability of the fix |
|---|---|
| **Latest** | Receives the fix **at priority**. |
| **Standard** (default) | Receives the fix through an **accelerated Safe Deployment Practices (SDP)** rollout. |
| **Extended** | Follows Standard and receives the fix **last**. |

## What you should do

We encourage all PHP customers on App Service for Linux to **act now** to pick up the fix as it becomes available.

1. **Move away from the Extended channel.** Extended typically stays one release behind Standard, so it receives this fix last. To avoid prolonged exposure, switch to **Standard** or **Latest** now.
2. **Choose Latest if you need the fix fastest.** Internet-facing or high-risk PHP apps should consider the Latest channel to get the updated images at priority.
3. **Update your custom containers yourself.** If you run PHP in a custom container, or bring your own PHP runtime, App Service does not patch it. Rebuild your images with the fixed PHP versions published by the PHP team.
4. **Verify your PHP version.** Open an SSH session to your app (`https://<appname>.scm.azurewebsites.net/webssh/host`) and run `php --version`.

### Change your Platform Release Channel

1. In the Azure portal, go to your App Service app.
2. In the left menu, select **Stack settings**.
3. Under **Platform Release Channel**, select **Latest** or **Standard**.
4. Select **Save**.

For more information, see [OS and runtime patching in Azure App Service](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime#control-runtime-patch-update-timing-with-platform-release-channel).

## Stay informed

We share updates here as the PHP team publishes fixed versions and updated images become available.

Thank you for helping us keep your PHP apps on Azure App Service secure.
