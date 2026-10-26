---
title: "eMudhra / emSign Certificate Security Updates on Azure App Service for Windows"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **Update (22 October 2026):** The rollout of **Windows operating-system certificate updates** for the **eMudhra / emSign CA certificate security incident has started** on Azure App Service for Windows. **Rollout is in progress, not complete.** We will update this post when the rollout completes.

The eMudhra / emSign incident affects certificate trust used by TLS clients. Compromised certificate authorities can allow an attacker to impersonate TLS endpoints when a client continues to trust the affected certificate chains.

For background on the incident, see the [Ubuntu Security Team's incident explanation](https://ubuntu.com/blog/emudhra-ca-compromise-fixes-available). That article describes the cross-platform certificate issue; its Linux package versions and installation commands do **not** apply to Windows.

## What we are doing

We are rolling out an **OS-level certificate trust update** to App Service for Windows. This is a platform operating-system update, not a language-specific runtime release.

**The rollout has started**, and availability varies while deployment progresses. We will update this post once rollout is complete.

**Platform Release Channels do not apply to App Service for Windows.** There is no Latest or Standard channel to select for this rollout. The Linux channel instructions in our related posts do not apply to Windows apps.

The platform manages this OS update. Customers do not need to install an OS patch manually on App Service workers. For more information, see [OS and runtime patching in Azure App Service](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime).

## What you should do

1. **Watch this post for rollout completion.** Rollout has started, but this does not establish that the update has reached every app or instance.
2. **Review application-managed certificate bundles and trust stores.** The Windows OS patch does not replace certificates bundled with your application, runtime, or dependencies. Follow the relevant maintainers' guidance and update affected components separately.
3. **Test outbound TLS connections.** Check connections to the services your app calls. Removing affected trust can cause connections to endpoints relying on those certificate chains to fail. Work with the endpoint owner to resolve the certificate chain rather than disabling TLS certificate validation.
4. **Update customer-provided container images yourself.** This platform OS rollout does not patch certificate stores or dependencies inside your custom container image. Follow your image's OS and dependency guidance, then rebuild, test, and redeploy.

### Application-managed trust stores and dependencies

An app can use the Windows certificate store, a runtime-specific trust store, or a CA bundle supplied by a library. **An OS certificate update alone is not proof that every TLS client in your application is protected.**

Review custom trust-store configuration, bundled certificates, and dependencies that maintain their own CA data. Update affected components through your trusted sources and test the application after redeployment.

## Related updates

- [Time zone updates on App Service for Windows]({{ site.baseurl }}{% post_url 2026-10-23-time-zone-updates-app-service-windows %}) covers the separate Windows OS time-zone update, whose accelerated SDP rollout is complete.
- [Emergency Node.js runtime updates on App Service for Windows]({{ site.baseurl }}{% post_url 2026-10-22-node-emergency-release-app-service-windows %}) covers the separate Node.js security releases and runtime rollout. The OS certificate update does not replace runtime security patches.
- [eMudhra / emSign certificate security updates on App Service for Linux]({{ site.baseurl }}{% post_url 2026-10-22-emudhra-certificate-issue-app-service-linux %}) covers the separate Linux image rollout. Its release-channel settings and Ubuntu package checks do not apply to Windows.

## Stay informed

We will update this post when the Windows OS certificate update rollout is complete.

Thank you for helping us keep your apps on Azure App Service secure.
