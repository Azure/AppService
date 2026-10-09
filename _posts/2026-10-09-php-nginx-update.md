---
title: "Nginx package update for PHP apps on Azure App Service"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

We're updating the Nginx packages used in Azure App Service PHP images, moving from the deprecated `deb.sury.org` repository to the official `nginx.org` repository. This follows the [upstream repository changes](https://codeberg.org/oerdnj/deb.sury.org/issues/67).

**We expect most PHP apps to continue working without any changes, particularly those using the default Nginx configuration.** However, if you've customized your Nginx configuration or startup command, we recommend validating your app against the updated images.

## What should you check?

If your app uses a custom Nginx configuration, review the following potentially affected customizations:

- Loading optional Nginx modules using `load_module`
- Using module directives such as `echo`, `geoip2`, `image_filter`, or XSLT
- Hardcoded Nginx paths, such as `/var/lib/nginx/`
- Custom startup commands that replace or start Nginx

These are examples, not an exhaustive list. **Having a customized configuration does not necessarily mean your app will be affected.**

## How to prepare

The updated PHP images are already available on the **Latest channel**, so you can test compatibility ahead of the rollout to Standard.

We recommend using an [App Service deployment slot](https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots) to validate your app without affecting production. Configure the staging slot to use the Latest channel, test your application and Nginx customizations, and keep your production slot on Standard.

We're beginning the rollout to the **Standard (default) channel**. If you encounter any issues, you can temporarily switch to the **Extended channel** to return to an earlier image while you investigate and update your configuration.

Once your app is compatible, we recommend using Standard (or Latest, if appropriate) to continue receiving platform and security updates.

For instructions on viewing or changing your channel, see [Control runtime patch updates with Platform Release Channel](https://learn.microsoft.com/en-us/azure/app-service/overview-patch-os-runtime#control-runtime-patch-update-timing-with-platform-release-channel).