---
title: "Critical PHP Security Release: What It Means for Azure App Service"
author_name: "Tulika Chaudharie, Byron Tardif, Andrew Westgarth"
toc: true
toc_sticky: true
---

> **PHP on App Service Windows:** The built-in PHP runtimes on App Service for Windows are **end-of-life (EOL)**. No security patch for these runtimes is currently planned.
>
> 1. **Move to App Service on Linux if possible.** Update and test your app on a supported PHP version to receive the patched built-in PHP runtime.
> 2. **If you must remain on Windows, bring your own PHP runtime.** Follow [How to use a Custom PHP runtime for App Service Windows](https://azureossd.github.io/2022/05/18/Custom-PHP-runtime-for-App-Service-Windows/index.html) and use a supported PHP version that includes the security fixes. You are responsible for deploying, configuring, and maintaining that runtime, including applying future security patches.
>
> **Azure Stack Hub: This Windows guidance also applies to PHP apps running on Azure App Service on Azure Stack Hub.**  
<hr>

> **PHP on Azure App Service on Azure Stack Hub:** The above guidance re PHP on App Service Windows also applies for App Service on Azure Stack Hub, as the Resource Provider only support Windows Code hosting.

> **WordPress update (21 October 2026):** WordPress apps deployed using the official [WordPress on App Service offering in Microsoft Marketplace](https://marketplace.microsoft.com/product/WordPress.WordPress?tab=Overview) have been updated to patched PHP versions, except for apps still using the older Alpine-based images. **The older Alpine-based images will not receive these security patches.** If your app uses an Alpine-based image, follow [Transition from Alpine Linux to Debian for WordPress on App Service](https://techcommunity.microsoft.com/blog/appsonazureblog/transition-from-alpine-linux-to-debian-for-wordpress-on-app-service/4264858) to migrate to a Debian-based image.

<hr>

> **Update (21 October 2026):** We have completed the rollout of the updated built-in PHP images with the security fixes to both the **Latest** and **Standard** Platform Release Channels for Azure App Service on Linux.
>
> The updated PHP runtime versions are:
>
> | PHP runtime | Updated version |
> |---|---|
> | PHP 8.2 | **8.2.35** |
> | PHP 8.3 | **8.3.36** |
> | PHP 8.4 | **8.4.27** |
> | PHP 8.5 | **8.5.12** |
>
> **End-of-life (EOL) PHP versions will not receive these security patches.** If your app uses an EOL PHP version, update your app to a [supported PHP version](https://www.php.net/supported-versions.php). Changing your Platform Release Channel does not upgrade an EOL runtime to a supported version.
>

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
5. **Upgrade EOL PHP runtimes.** Apps running an end-of-life PHP version will not receive these security patches. Update and test your app on a [supported PHP version](https://www.php.net/supported-versions.php), then configure your app to use that version.

### Change your Platform Release Channel

1. In the Azure portal, go to your App Service app.
2. In the left menu, select **Stack settings**.
3. Under **Platform Release Channel**, select **Latest** or **Standard**.
4. Select **Save**.

For more information, see [OS and runtime patching in Azure App Service](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime#control-runtime-patch-update-timing-with-platform-release-channel).

## Related updates

- [Time zone updates on App Service for Linux]({% post_url 2026-10-22-time-zone-updates-app-service-linux %}) covers the updated time-zone rules and the separate PHP 8.2 and 8.3 exclusions for that rollout.
- [Node.js and Python emergency runtime updates on App Service for Linux]({% post_url 2026-10-22-node-python-emergency-release-app-service-linux %}) covers the separate runtime releases and rollout guidance for Node.js and Python apps.
- [eMudhra / emSign certificate security updates on App Service for Linux]({% post_url 2026-10-22-emudhra-certificate-issue-app-service-linux %}) covers certificate trust-store updates and application-managed CA bundles. A runtime security patch alone does not establish that your app's certificate bundles are updated.

## Stay informed

We share updates here as the PHP team publishes fixed versions and updated images become available.

Thank you for helping us keep your PHP apps on Azure App Service secure.
