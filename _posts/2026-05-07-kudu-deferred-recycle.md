---
title: "Improving Deployment Resiliency on Azure App Service for Linux with Deferred Kudu Recycle"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

Azure App Service for Linux now includes **Deferred Kudu Recycle**, a platform improvement designed to make deployments more resilient when app settings or connection strings are updated during an active deployment.

Previously, changing app settings or connection strings could trigger an immediate recycle of the Kudu, or SCM, site. If an asynchronous deployment was already running, this could interrupt the deployment and lead to failures or retries.

With Deferred Kudu Recycle, App Service now reduces unnecessary interruptions while still ensuring deployment-critical changes take effect when they are needed.

## How it works

On Linux App Service, Kudu powers deployment workflows such as ZIP deploy, Git-based deployments, and Oryx-based builds. When app settings or connection strings change, Kudu needs to recycle so the updated environment is available.

With Deferred Kudu Recycle:

* If the setting change is **not deployment-critical**, the Kudu recycle is deferred until the in-progress asynchronous deployment completes.
* If the setting change **is deployment-critical**, Kudu recycles immediately so the deployment pipeline uses the correct configuration.
* New deployments started after the setting change always use the updated environment.
* Synchronous deployments are not affected by this behavior.

The deferral window is up to **40 minutes**. If the deployment does not complete within that window, the recycle proceeds and the deployment may be interrupted.

## What counts as deployment-critical?

Some settings directly affect how App Service builds or deploys your application. Changes to these settings continue to trigger an immediate Kudu recycle.

Examples include settings and prefixes such as:

| Setting or prefix                 | Example                          |
| --------------------------------- | -------------------------------- |
| `KUDU_*`                          | `KUDU_SYNC_CMD`                  |
| `ORYX_*`                          | `ORYX_BUILD_FLAGS`               |
| `ENABLE_ORYX_BUILD`               |                                  |
| `PRE_BUILD_*`                     | `PRE_BUILD_COMMAND`              |
| `POST_BUILD_*`                    | `POST_BUILD_COMMAND`             |
| `SCM_*`                           | `SCM_DO_BUILD_DURING_DEPLOYMENT` |
| `WEBSITE_SCM_*`                   |                                  |
| `WEBSITE_RUN_FROM_PACKAGE`        |                                  |
| `WEBSITE_SWAP_SLOTNAME`           |                                  |
| `WEBSITE_ELASTIC_SCALING_ENABLED` |                                  |
| `MSBUILD_CONFIGURATION`           |                                  |

For these settings, an immediate recycle helps ensure the deployment pipeline runs with the correct configuration.

## Custom deployment-critical settings

Most customers do not need to configure anything. The default list covers common Kudu and Oryx deployment settings.

However, if your build or deployment process depends on custom app settings, you can mark them as deployment-critical by using the following app setting:

```text
WEBSITE_DEPLOYMENT_CRITICAL_APPSETTINGS
```

The value should be a semicolon-separated list of setting names or prefixes.

Example:

```text
WEBSITE_DEPLOYMENT_CRITICAL_APPSETTINGS=NODE_VERSION;MY_BUILD_FLAG
```

After this is configured, changes to `NODE_VERSION` or `MY_BUILD_FLAG` will trigger an immediate Kudu recycle instead of being deferred.

Only add settings that your build or deployment process genuinely depends on. Adding unnecessary entries can increase the chance of interrupting an in-progress asynchronous deployment.

## What this means for you

Deferred Kudu Recycle improves deployment resiliency by reducing interruptions caused by unrelated configuration changes.

For example, changing a non-critical setting such as an Application Insights instrumentation key or a custom runtime setting that does not affect the build process will no longer interrupt an asynchronous deployment that is already in progress.

At the same time, App Service continues to recycle Kudu immediately when deployment-critical settings change, ensuring build and deployment workflows use the right configuration.

## No action required for most apps

This improvement is enabled by the platform. For most applications, no changes are required.

Only use `WEBSITE_DEPLOYMENT_CRITICAL_APPSETTINGS` if you have custom app settings that directly influence your build or deployment process. Otherwise, the default behavior should provide improved deployment resiliency without any additional configuration.
