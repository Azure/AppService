---
title: "eMudhra / emSign Certificate Security Updates on Azure App Service for Linux"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **Update (4 November 2026):** Patched built-in Linux images for **PHP 8.2** are now available on Latest and Standard. The rollout is complete for all non-EOL runtimes listed below; EOL runtimes remain excluded.

The eMudhra / emSign incident affects certificate trust used by TLS clients. The [Ubuntu Security Team's incident and patch guidance](https://ubuntu.com/blog/emudhra-ca-compromise-fixes-available) explains the CA trust-store changes needed to mitigate the risk of man-in-the-middle attacks.

This is not limited to a single language runtime. Applications can use operating-system certificates, runtime-managed trust stores, or certificate bundles supplied by dependencies. **Updating the platform image does not replace certificate bundles managed by your application.**

## What we are doing

Patched built-in Linux images are available on **Latest and Standard** for **all non-EOL runtimes**.
**Java is available on both Latest and Standard; its rollout is complete.**

The following runtime versions are listed by `az webapp list-runtimes -o table --os linux` as of **22 October 2026** and are included in the completed rollout to **Latest and Standard**. For Java, the table summarizes Java SE versions rather than listing individual application-server combinations.

| Runtime | Versions included in the image updates |
|---|---|
| .NET | 8, 9, 10, 11 |
| Node.js | 22, 24 |
| Python | 3.10, 3.11, 3.12, 3.13, 3.14 |
| PHP | 8.2, 8.3, 8.4, 8.5 |
| Java SE | 8, 11, 17, 21, 25 |

Runtimes approaching EOL are included while they remain supported. **EOL runtimes do not receive these image updates.**

**WordPress on App Service requires a separate WordPress core update.** The supported images for apps deployed using the official [WordPress on App Service offering in Microsoft Marketplace](https://marketplace.microsoft.com/product/WordPress.WordPress?tab=Overview) include the OS certificate security updates, but **WordPress uses its own certificate trust store**.

**Customers must update WordPress core to version 7.1.4 or later on their sites** to receive the updated WordPress trust store. The App Service image update does not upgrade WordPress core or replace its trust store on existing sites.

### Rollout by Platform Release Channel

| Channel | Availability of the updates |
|---|---|
| **Latest** | Rollout **complete**. |
| **Standard** (default) | Rollout **complete** for the included runtimes, including Java. |

The updated images are available on both Latest and Standard for all included runtimes, **including Java**.

Changing your Platform Release Channel does not upgrade your app to a different runtime version or make an EOL runtime supported.

## What you should do

1. **Use Standard or Latest to receive these updates.** For eligible runtimes, including Java, apps on either channel do not need a channel change.
2. **Upgrade EOL runtimes.** EOL runtimes are excluded from these image updates. Update and test your app on a supported runtime included in the patching scope.
3. **Update application-managed certificate bundles and dependencies.** Review the official guidance for your runtime and libraries. An updated platform trust store does not necessarily update a library's bundled certificates or an existing virtual environment.
4. **Update custom containers and bring-your-own runtimes yourself.** App Service does not patch the contents of your custom images or runtimes. Update their OS packages, runtimes, and affected dependencies, then rebuild, test, and redeploy.
5. **Test outbound TLS connections.** Check the services your app calls after updating. Do not work around certificate errors by disabling TLS certificate validation.
6. **Check the running image's certificate package.** Use the instructions below to inspect the OS certificate package. This check does not verify application-managed trust stores.

### Change your Platform Release Channel

**Azure portal**

1. In the Azure portal, go to your App Service app.
2. In the left menu, select **Stack settings**.
3. Under **Platform Release Channel**, select **Standard**.
4. Select **Save**.

**Azure CLI**

Use [az webapp update](https://learn.microsoft.com/cli/azure/webapp#az-webapp-update) to move your app to Standard:

```bash
az webapp update \
  --resource-group <resource-group> \
  --name <app-name> \
  --platform-release-channel Standard
```

Replace the placeholders with your app's resource group and name. For a deployment slot, add `--slot <slot-name>`.

Eligible apps, including Java apps, already on **Standard** or **Latest** do not need a channel change.

### Verify the certificate package

Use [az webapp exec](https://learn.microsoft.com/cli/azure/webapp#az-webapp-exec) (currently in preview) with Azure CLI **2.90.0 or later** to open an interactive shell in your running app:

```bash
az webapp exec --resource-group <resource-group> --name <app-name>
```

Replace the placeholders with your app's resource group and name. For a deployment slot, add `--slot <slot-name>`.

Inside the container, identify the OS and installed certificate-package version:

```bash
cat /etc/os-release
dpkg-query -W -f='${Package} ${Version}\n' ca-certificates
```

For Ubuntu-based images, compare the installed version with the fixed version for the **same Ubuntu release** in the [Ubuntu incident and patch guidance](https://ubuntu.com/blog/emudhra-ca-compromise-fixes-available). For example:

| Ubuntu release | Fixed `ca-certificates` version |
|---|---|
| 24.04 | `20260816ubuntu0.24.04.1` |
| 26.04 | `20260816ubuntu0.26.04.1` |

The listed version or a subsequent version containing the fix is the expected result. Do not compare package versions across different OS releases. For Debian-based images, use the corresponding Debian package guidance rather than the Ubuntu versions.

This check inspects the OS certificate package on **one running instance**, not every trust store used by your app. Use `--instance <instance-id>` to connect to other instances as needed. Application-managed CA bundles and runtime-specific trust stores require separate checks. A successful HTTPS request alone is not proof that the issue is mitigated.

### Application-managed trust stores and dependencies

The platform update covers the built-in images, not certificate bundles or trust stores that your app supplies. Review your app's libraries, dependencies, and custom trust-store configuration, and follow their maintainers' incident guidance. Update affected dependencies through your trusted package source, then rebuild, test, and redeploy as needed.

As the [Ubuntu guidance](https://ubuntu.com/blog/emudhra-ca-compromise-fixes-available) notes, removing affected trust anchors can also cause connections to legitimate endpoints that rely on those anchors to fail. Test outbound TLS connections and work with the endpoint owner to resolve affected certificate chains rather than disabling certificate validation.

## Related updates

- [eMudhra / emSign certificate security updates on App Service for Windows]({% post_url 2026-10-22-emudhra-certificate-issue-app-service-windows %}) covers the separate Windows OS certificate rollout. Linux Platform Release Channel settings do not apply to Windows.
- [Time zone updates on App Service for Linux]({% post_url 2026-10-22-time-zone-updates-app-service-linux %}) covers the separate time-zone data rollout.
- [Critical PHP security release guidance for App Service]({% post_url 2026-10-21-php-critical-security-release-app-service-linux %}) covers the separate PHP runtime vulnerabilities and rollout.
- [Node.js and Python emergency runtime updates on App Service for Linux]({% post_url 2026-10-22-node-python-emergency-release-app-service-linux %}) covers the runtime releases and their rollout. Review that guidance alongside the certificate updates here; runtime patches do not replace application-managed CA bundles.

## Stay informed

We share further updates here as needed.

Thank you for helping us keep your apps on Azure App Service secure.
