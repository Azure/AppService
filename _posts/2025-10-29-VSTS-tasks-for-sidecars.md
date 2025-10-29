---
title: "Azure Pipeline samples: add sidecars to Azure App Service for Linux"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

Sidecars on Azure App Service let you attach extra containers — logging, telemetry, lightweight APIs, caches, AI inference helpers — alongside your main app, in the same App Service. They start and run with your app, but you don’t have to bake that logic into your main code.

We’re publishing two Azure Pipelines (Azure DevOps / VSTS) YAML samples to make this easy. 

## VSTS samples

* **[`vsts-blessed-sitecontainers.yml`](https://github.com/Azure/actions-workflow-samples/blob/master/AppService/vsts-blessed-sitecontainers.yml)** 
  For built-in runtimes on App Service for Linux (for example, Python or Node on the built-in stack).
  * Builds your app, zips it, and deploys it using `AzureWebApp@1`.
  * In the same deploy step, it sends a `sitecontainersConfig` payload that defines one or more sidecar containers by image, port, and config.
  * Your app keeps running on the App Service runtime; the sidecars run next to it.

* **[`vsts-only-sitecontainers.yml`](https://github.com/Azure/actions-workflow-samples/blob/master/AppService/vsts-only-sitecontainers.yml)** 
  For containerized apps (Web App for Containers style).
  * Builds and pushes multiple images (main app container + sidecars) to your container registry.
  * Uses `AzureWebAppContainer@1` to deploy them all together to App Service for Linux.
  * One container is marked `"isMain": true`; the rest are `"isMain": false`.

Both samples assume Azure App Service for Linux and the sidecar model, where containers in the same app can talk to each other over localhost.

## How the pipelines work

1. **Build**
   * `vsts-blessed-sitecontainers.yml`: sets up your language/runtime, installs dependencies, and produces a ZIP artifact of your app.
   * `vsts-only-sitecontainers.yml`: uses Docker tasks to build and tag multiple container images.

2. **Publish artifacts / push images**
   * Code-based flow: publishes the ZIP as a pipeline artifact.
   * Container flow: pushes tagged images to Azure Container Registry.

3. **Deploy to App Service for Linux**
   * Code-based flow: `AzureWebApp@1` deploys the ZIP and also applies a `sitecontainersConfig` block that defines your sidecar containers.
   * Container flow: `AzureWebAppContainer@1` deploys your main container plus any sidecars in one shot, using `sitecontainersConfig`.

That’s it: one pipeline run builds, packages, and deploys your main app plus its helper containers.

## Quick start

1. **Pick a template**
   * Built-in runtime on App Service for Linux? Use `vsts-blessed-sitecontainers.yml`.
   * Already running containers? Use `vsts-only-sitecontainers.yml`.

2. **Add it to your repo**
   Save the YAML as `azure-pipelines.yml` (or add it as a new pipeline in Azure DevOps).

3. **Fill in the placeholders**
   * `azureServiceConnectionId` / `azureSubscription`: your Azure RM service connection.
   * `webAppName` / `appName`: the target App Service for Linux app.
   * `resourceGroup`: where that app lives.
   * `containerRegistry`, image names, and ports for each container in the multi-container case.
   * Each container in `sitecontainersConfig` declares its port and whether it’s the main app or a sidecar.

4. **Run it in Azure DevOps**
   Create a new pipeline from YAML, authorize the service connections, and run.

5. **Check your app**
   In the Azure portal, go to Deployment Center->Containers and your App Service will now show your primary app plus the sidecar containers defined in the pipeline.

## Customize to fit

These YAMLs are starting points. You can:
* Add test/lint stages before deployment so you only ship good builds.
* Swap the agent pool (`ubuntu-latest` vs your own self-hosted pool).
* Deploy to a staging slot first, then swap to production.
* Tune each sidecar in `sitecontainersConfig`: env vars, ports, credentials, etc.

You don’t have to redesign CI/CD every time you want to add observability, a cache container, or a small inference helper next to your app — you just describe the containers and ship.


## Learn more

* **Deploy to Azure App Service using Azure Pipelines**
  Full walkthrough for setting up [Azure Pipelines with App Service](https://learn.microsoft.com/en-us/azure/app-service/deploy-azure-pipelines?tabs=yaml), including service connections and the `AzureWebApp@1` / `AzureWebAppContainer@1` tasks.

* **Sidecars on App Service for Linux**
  [How sidecars work](https://learn.microsoft.com/en-us/azure/app-service/overview-sidecar), how `isMain` is used, networking rules (localhost between containers), and common patterns like telemetry/OTEL agents, API helpers, and lightweight caches.

Drop these templates into your pipeline, point them at your app, and you’ve got repeatable CI/CD for multi-containers in App Service.
