---
title: "Upcoming Critical PHP Security Release: What It Means for Azure App Service on Linux"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

The PHP security team has given advance notice of an **upcoming security release** that addresses **two critical vulnerabilities, both rated CVSS v4.0 9.2 (Critical)**.

**The release is scheduled for Wednesday, 21 October 2026 at 14:00 UTC.** Full details, affected versions, and fixed versions will be published with the release.

- Official announcement: [php.net news, 20 Oct 2026](https://www.php.net/archive/2026.php#2026-10-20-1)
- Mailing list: [php.announce #509: Upcoming Critical PHP Security Release](https://news-web.php.net/php.announce/509)

## What we are doing

The Azure App Service team is **actively working on updating the built-in PHP images for App Service on Linux** and will pick up the fixed PHP versions as soon as they are released.

Updated images will roll out through the [Platform Release Channels](https://learn.microsoft.com/en-us/azure/app-service/overview-patch-os-runtime#control-runtime-patch-update-timing-with-platform-release-channel) as follows:

| Channel | Availability of the fix |
|---|---|
| **Latest** | Available **at priority**, as soon as the updated images are ready. |
| **Standard** (default) | Available on an **accelerated Safe Deployment Practices (SDP)** rollout. |
| **Extended** | Follows Standard. This is the **last** channel to receive the fix. |

## What you should do

We encourage all PHP customers on App Service for Linux to **prepare now** so they can pick up the fix as soon as it is available.

1. **Move away from the Extended channel.** Extended typically stays one release behind Standard, which means it will receive this fix last. To avoid prolonged exposure, switch to **Standard** or **Latest** now.
2. **Choose Latest if you need the fix fastest.** Internet-facing or high-risk PHP apps should consider the Latest channel to get the updated images at priority.
3. **Update your custom containers yourself.** If you run PHP in a custom container, or bring your own PHP runtime, App Service does not patch it. Rebuild your images on the fixed PHP versions once they are published.
4. **Verify your PHP version.** After the rollout, open an SSH session to your app (`https://<appname>.scm.azurewebsites.net/webssh/host`) and run `php --version`.

### Change your Platform Release Channel

1. In the Azure portal, go to your App Service app.
2. In the left menu, select **Stack settings**.
3. Under **Platform Release Channel**, select **Latest** or **Standard**.
4. Select **Save**.

For more information, see [OS and runtime patching in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/overview-patch-os-runtime#control-runtime-patch-update-timing-with-platform-release-channel).

## Stay informed

We will update this post when the fixed PHP versions are published and the updated images are available.

Thank you for helping us keep your PHP apps on Azure App Service secure.
