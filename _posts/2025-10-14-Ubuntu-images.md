---
title: "Ubuntu-Powered Runtimes on Azure App Service for Linux: Smaller, Faster, Stronger"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

We’re updating the OS foundation for **new code-based stacks** on Azure App Service for Linux. Every new major version of our supported stacks will target Ubuntu going forward, this includes the new versions for **.NET 10, Python 3.14, Node 24, PHP 8.5** and **Java 25** all expected to rollout in the next couple months. Existing stacks remain on Debian and **nothing changes for your current apps** unless you choose to move.

## Why Ubuntu?

Because we manage the OS for you, this change is about platform gains that quietly benefit your apps without adding work for your teams.

* **Builds on Debian’s ecosystem:** Ubuntu inherits Debian’s rich package universe while moving faster upstream. This lets the platform adopt newer toolchains and libraries more predictably, improving compatibility and unblocking modern dependencies.
* **LTS stability with long runway:** Ubuntu LTS follows a 5 year support lifecycle giving us a stable, well-maintained base to operate at scale.

## What’s changing (and what isn’t)

* **Changing:** New **.NET 10, Python 3.14, Node 24, PHP 8.5** and **Java 25** code-based stacks will run on **Ubuntu** images.
* **Not changing:** Your **existing apps stay on Debian**. No forced migrations.
* **Operational parity:** Deployment flows (Oryx, GitHub Actions, Azure CLI), scaling, diagnostics, and networking continue to work as before.

## What this means for you

* **No action required** for existing apps.
* When creating a **new** app or upgrading to **.NET 10, Python 3.14, Node 24, PHP 8.5** and **Java 25**, you’ll get the Ubuntu-based stack by default.
* When upgrading, verify any native packages your app installs at build/start, since Ubuntu often provides equal or newer versions and names may differ.

## Quick FAQ

**Do I need to move now?**
No. Existing apps stay on Debian. Migrate only if you want the newer runtimes and platform improvements.

**Will my build behavior change?**
Expected to be neutral-to-positive. Leaner images and fresher toolchains can reduce build and cold-start times.

**Any breaking differences?**
None anticipated for supported frameworks. If you pin specific distro package versions, confirm availability on Ubuntu during upgrade.

---

By standardizing new stacks on **Ubuntu LTS**, we preserve Debian’s strengths while unlocking a faster cadence, long-term security coverage, and leaner images that translate to better reliability and performance—delivered transparently by the platform.
