---
title: "PHP Security Updates on Azure App Service for Linux"
author_name: "Igor Titanov"
category: security
toc: true
toc_sticky: true
---

> **Update (19 November 2026):** The rollout of updated built-in PHP images for Azure App Service on Linux has started. We expect it to complete by **noon on 20 November 2026 (PT)**.

The PHP project published security releases on **19 November 2026** for supported PHP release lines. The Azure App Service platform itself is **not affected** by these PHP vulnerabilities. Applications running PHP may need the updated runtime.

## What the updates address

The PHP security releases address vulnerabilities in PHP. The PHP security team noted that the highest-severity issues require non-default configurations or uncommon setups. Review the PHP release announcements and change logs for details relevant to your PHP version and application.

## Patched PHP versions

The PHP project recommends upgrading to the following security releases:

| PHP release line | Patched version | Official release notes |
|---|---|---|
| PHP 8.5 | **8.5.13** | [PHP 8.5.13](https://www.php.net/releases/8_5_13.php) |
| PHP 8.4 | **8.4.28** | [PHP 8.4.28](https://www.php.net/releases/8_4_28.php) |
| PHP 8.3 | **8.3.37** | [PHP 8.3.37](https://www.php.net/releases/8_3_37.php) |
| PHP 8.2 | **8.2.36** | [PHP 8.2.36](https://www.php.net/releases/8_2_36.php) |

## What we are doing

Azure App Service has started rolling out updated built-in PHP images for Linux. The rollout is expected to complete by noon on **20 November 2026 (PT)**.

## What you should do

1. **If you use a built-in PHP runtime on App Service for Linux, keep your app on a supported Platform Release Channel** to receive the updated image as it rolls out.
2. **Verify the PHP version used by your running application after the rollout.** If it reports the patched version for your release line, no further action is needed for this update.
3. **Update custom containers and bring-your-own PHP runtimes yourself.** Rebuild or update them with a patched PHP release, then test and redeploy.
4. **Review the PHP release notes** for the release line you use and assess any application-specific guidance.

PHP on Azure App Service for Windows uses a custom runtime rather than a platform-managed built-in PHP runtime. If you bring your own PHP runtime on Windows, you are responsible for applying vendor security updates.

Thank you for helping us keep PHP applications on Azure App Service secure.
