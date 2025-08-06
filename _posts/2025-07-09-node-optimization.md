---
title: "Improved Node.js Deployment Performance on Azure App Service"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

We’ve made significant improvements to how Node.js applications are deployed on Azure App Service — with deployment times now up to **8× faster** in some cases.

Traditionally, the `node_modules` directory was extracted and synced in full during deployment. This process could be slow and resource-intensive, especially for apps with large dependency trees. To address this, we’ve optimized the way `node_modules` is handled.

### What’s Changed?

During the deployment phase, instead of copying the entire `node_modules` folder to the site, we now **compress it into a `node_modules.tar.gz` archive**. This archive is placed under `/home/site/wwwroot` and is accompanied by a manifest file (`oryx-manifest.toml`) that provides instructions for what needs to happen during app startup.

When the application starts, the archive is **extracted into `/node_modules`** inside the runtime container. We then **create a symbolic link** from `/home/site/wwwroot/node_modules` to the extracted directory (`/node_modules`) so that the Node.js runtime can seamlessly locate the modules.

To ensure full compatibility, the `/node_modules` path is also **appended to the environment's PATH variable**, allowing Node.js apps to access their dependencies without any changes to code or configuration.

### Why This Matters

This approach significantly reduces the amount of data that needs to be synced during deployment, speeding up the process and improving reliability. 

This change is part of our ongoing efforts to make Node.js apps faster and easier to run on Azure App Service. More improvements coming soon — stay tuned!

