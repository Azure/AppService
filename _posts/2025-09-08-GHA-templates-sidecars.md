---
title: "GitHub Actions samples: add sidecars to Azure App Service for Linux"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

Sidecars on Azure App Service let you bolt on capabilities like monitoring, caching, or AI—without changing your main app. The Azure team has added two **GitHub Actions** sample workflows that make it easy to roll this out on **App Service for Linux**. ([Sidecars on Azure App Service](https://learn.microsoft.com/azure/app-service/overview-sidecar))

## What’s in the repo

* **For code-based apps** (bring-your-own-code):
  [`blessed-sitecontainers-webapp-on-azure.yml`](https://github.com/Azure/actions-workflow-samples/blob/master/AppService/blessed-sitecontainers-webapp-on-azure.yml) — attaches one or more  sidecar containers to a code-based web app. Use this when your main app runs on a built-in Linux stack (Python/Node/.NET/Java/PHP, etc.). 
* **For container-based apps** (Web App for Containers):
  [`sitecontainers-webapp-on-azure.yml`](https://github.com/Azure/actions-workflow-samples/blob/master/AppService/sitecontainers-webapp-on-azure.yml) — deploys your primary container **plus** sidecars in the same app. Use this when your main app is already packaged as a container image.

> Both samples target **App Service for Linux** and use the App Service sidecar model.

## How the workflows work (at a glance)

1. **Authenticate to Azure** using `azure/login` (OpenID Connect recommended), so you don’t store long-lived secrets. ([Microsoft Learn][5])
2. **Build (if needed)** and **deploy** your app with App Service actions/CLI steps. For containerized flows, you’ll typically push/pull from ACR or another registry. ([Microsoft Learn][6])
3. **Attach sidecars** by applying the App Service *sitecontainers* configuration alongside your main app/container. (Sidecars scale and lifecycle with your app.) ([Microsoft Learn][1])

## Quick start

1. **Copy** the relevant YAML into `.github/workflows/` in your repo. ([GitHub][2])
2. **Set auth**: use OIDC with `azure/login` (or a service principal/publish profile if you must). ([Microsoft Learn][5])
3. **Fill in inputs**: app name, resource group, and sidecar details (image or extension parameters, env vars/ports).
4. **Commit & run**: trigger on `push` or via **Run workflow**.
5. **Verify**: in the Portal, you’ll see your main app plus the sidecar(s); you can also follow the Linux sidecar tutorial if you’re new to the concept. ([Microsoft Learn][4])

## When to use which sample?

* Choose **`blessed-sitecontainers-…`** if your app runs on a built-in Linux runtime and you want to *add* sidecars (e.g., telemetry collectors, caches, or AI helpers). ([GitHub][2], [Microsoft Learn][1])
* Choose **`sitecontainers-…`** if your main app is a **custom container** and you want sidecars next to it (same plan, shared lifecycle). ([GitHub][3], [Microsoft Learn][7])

## Customize to fit

These samples are designed to be adapted: tweak triggers, add build/test jobs, point at your container registry, configure environment variables/secrets, or target deployment slots. The underlying docs on App Service + GitHub Actions and custom containers cover advanced options. ([Microsoft Learn][5])

## Learn more

* **Sidecars overview (why & how):** benefits, patterns, and limits. ([Microsoft Learn][1])
* **Tutorials:** add a sidecar to a Linux app (code-based) or to a custom-container app. ([Microsoft Learn][4])


[1]: https://learn.microsoft.com/azure/app-service/overview-sidecar "Sidecars overview - Azure App Service"
[2]: https://github.com/Azure/actions-workflow-samples/blob/master/AppService/blessed-sitecontainers-webapp-on-azure.yml "actions-workflow-samples/AppService/blessed-sitecontainers-webapp-on-azure.yml at master · Azure/actions-workflow-samples · GitHub"
[3]: https://github.com/Azure/actions-workflow-samples/blob/master/AppService/sitecontainers-webapp-on-azure.yml "actions-workflow-samples/AppService/sitecontainers-webapp-on-azure.yml at master · Azure/actions-workflow-samples · GitHub"
[4]: https://learn.microsoft.com/azure/app-service/tutorial-sidecar "Tutorial: Configure a sidecar container - Azure App Service"
[5]: https://learn.microsoft.com/azure/app-service/deploy-github-actions "Deploy to Azure App Service by using GitHub Actions"
[6]: https://learn.microsoft.com/azure/app-service/deploy-container-github-action "Custom Container CI/CD from GitHub Actions - Azure App ..."
[7]: https://learn.microsoft.com/azure/app-service/tutorial-custom-container-sidecar "Tutorial: Configure a sidecar for a custom container app"
