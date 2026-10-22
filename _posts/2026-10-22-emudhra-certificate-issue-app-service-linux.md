---
title: "eMudhra / emSign Certificate Security Updates on Azure App Service for Linux"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **Update (22 October 2026):** The rollout of patched built-in Linux images for the **eMudhra / emSign CA certificate security incident** is **complete on the Latest Platform Release Channel** for the runtimes listed below. **Move to Latest if you need the fixes now for an included runtime.** The **Standard** channel receives the updates through our **Safe Deployment Practices (SDP)** rollout.

The eMudhra / emSign incident affects certificate trust used by TLS clients. The [Ubuntu Security Team's incident and patch guidance](https://ubuntu.com/blog/emudhra-ca-compromise-fixes-available) explains the CA trust-store changes needed to mitigate the risk of man-in-the-middle attacks.

This is not limited to a single language runtime. Applications can use operating-system certificates, runtime-managed trust stores, or certificate bundles supplied by dependencies. **Updating the platform image does not replace certificate bundles managed by your application.**

## What we are doing

Patched built-in Linux images are available on **Latest** for **all non-EOL runtimes**, with the [PHP 8.2 exception](#php-82-exception) described below.

The following runtime versions are listed by `az webapp list-runtimes -o table --os linux` as of **22 October 2026** and are included in the completed rollout to **Latest**. For Java, the table summarizes Java SE versions rather than listing individual application-server combinations.

| Runtime | Versions included in the image updates |
|---|---|
| .NET | 8, 9, 10, 11 |
| Node.js | 22, 24 |
| Python | 3.10, 3.11, 3.12, 3.13, 3.14 |
| PHP | 8.3, 8.4, 8.5 |
| Java SE | 8, 11, 17, 21, 25 |

Runtimes approaching EOL are included while they remain supported. **EOL runtimes do not receive these image updates.**

**WordPress on App Service is also updated.** The supported images for apps deployed using the official [WordPress on App Service offering in Microsoft Marketplace](https://marketplace.microsoft.com/product/WordPress.WordPress?tab=Overview) include the certificate security updates.

### PHP 8.2 exception

**The built-in PHP 8.2 image is not included in this initial patch payload.** Although PHP 8.2 itself has not yet reached EOL, its underlying **Debian 11 (Bullseye)** operating system is beyond Debian's standard/LTS support period and is not providing the patch for this image.

**We are investigating options to provide a patch for PHP 8.2.** No availability date is confirmed.

If your app uses PHP 8.2, **update and test your app on PHP 8.3 or a later supported version**, then configure your app to use that runtime. Moving a PHP 8.2 app to Latest alone does not address this exception.

### Rollout by Platform Release Channel

| Channel | Availability of the updates |
|---|---|
| **Latest** | Rollout **complete**. Move to this channel if you need the fixes now. |
| **Standard** (default) | Receives the updates through the **Safe Deployment Practices (SDP)** rollout. |

Rollout completion on Latest does **not** mean that rollout to Standard is complete.

Changing your Platform Release Channel does not upgrade your app to a different runtime version or make an EOL runtime supported.

## What you should do

1. **Move to Latest if you need the fixes now.** For apps using an eligible built-in Linux runtime, select the Latest Platform Release Channel using the instructions below.
2. **Upgrade PHP 8.2 and EOL runtimes.** PHP 8.2 is excluded from this certificate patch because of its OS base. EOL runtimes are also excluded. Update and test your app on a supported runtime included in the patching scope.
3. **Update application-managed certificate bundles and dependencies.** Review the official guidance for your runtime and libraries. An updated platform trust store does not necessarily update a library's bundled certificates or an existing virtual environment.
4. **Update custom containers and bring-your-own runtimes yourself.** App Service does not patch the contents of your custom images or runtimes. Update their OS packages, runtimes, and affected dependencies, then rebuild, test, and redeploy.
5. **Test outbound TLS connections.** Check the services your app calls after updating. Do not work around certificate errors by disabling TLS certificate validation.
6. **Check the running image's certificate package.** Use the instructions below to inspect the OS certificate package. This check does not verify application-managed trust stores.

### Change your Platform Release Channel

**Azure portal**

1. In the Azure portal, go to your App Service app.
2. In the left menu, select **Stack settings**.
3. Under **Platform Release Channel**, select **Latest**.
4. Select **Save**.

**Azure CLI**

Use [az webapp update](https://learn.microsoft.com/cli/azure/webapp#az-webapp-update) to move your app to Latest:

```bash
az webapp update \
  --resource-group <resource-group> \
  --name <app-name> \
  --platform-release-channel Latest
```

Replace the placeholders with your app's resource group and name. For a deployment slot, add `--slot <slot-name>`.

If your app remains on **Standard**, it receives the eligible image updates as the SDP rollout progresses.

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

- [Time zone updates on App Service for Linux]({{ site.baseurl }}{% post_url 2026-10-22-time-zone-updates-app-service-linux %}) covers the separate time-zone data rollout, whose PHP 8.2 and 8.3 exclusions differ from the certificate update exclusion described here.
- [Critical PHP security release guidance for App Service]({{ site.baseurl }}{% post_url 2026-10-21-php-critical-security-release-app-service-linux %}) covers the separate PHP runtime vulnerabilities and rollout.
- [Node.js and Python emergency runtime updates on App Service for Linux]({{ site.baseurl }}{% post_url 2026-10-22-node-python-emergency-release-app-service-linux %}) covers the runtime releases and their rollout. Review that guidance alongside the certificate updates here; runtime patches do not replace application-managed CA bundles.

## Stay informed

We share updates here as the rollout to Standard progresses.

Thank you for helping us keep your apps on Azure App Service secure.
