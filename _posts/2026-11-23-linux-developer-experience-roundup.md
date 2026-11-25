---
title: "Deploy faster, fix faster: six months of developer experience improvements on Azure App Service for Linux"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

Over the last six months, we have shipped a steady stream of developer experience improvements to Azure App Service for Linux. Each was announced on its own, but they share one goal: **you should not need to know how App Service works internally to get your app running, understand what it is doing, and keep it healthy.**

Five simple rules guided what we built:

- **If the platform can infer something, infer it.**
- **If something is taking time, show what is happening.**
- **If something fails, make the failure actionable.**
- **If something can be faster, make it faster.**
- **If a failure can be prevented, prevent it.**

This post brings that work together, following the journey every app goes through: **deploy**, **monitor**, and **maintain**. Each section links to the detailed announcement if you want to go deeper. And because clear, structured output helps people and AI agents alike, these improvements apply whether you work in the Azure portal, at the command line, or through an AI coding agent.

## Deploy easily

The first experience anyone has with App Service is getting code running. We focused on making that path shorter, faster, and harder to get wrong.

### Quick Deploy: from a ZIP file to a running app

If you already have your code and just want to see it running, choosing a deployment method should not be the first hurdle. With **Quick Deploy**, you drag and drop a ZIP file, review its contents, choose whether App Service should build it, and select **Deploy**. A progress view takes you through upload, build, and deployment, with logs at each stage and runtime logs at the end to confirm your app started.

Quick Deploy started in Kudu and is now in the Azure portal: open your Linux web app, go to **Deployment Center** > **Manual Deployment (Push)**, and choose **Publish files (new)**.

![Quick Deploy in the Azure portal Deployment Center]({{site.baseurl}}/media/2026/07/quick-deploy-portal.jpg)

It is the quickest way to get started or test a change. For production releases, we still recommend a CI/CD pipeline such as GitHub Actions or Azure Pipelines.

Learn more: [A simpler way to deploy your code to Azure App Service for Linux](https://azure.github.io/AppService/2026/04/06/quickdeploy.html) and [A simpler way to deploy ZIP packages from the Azure portal](https://azure.github.io/AppService/2026/07/30/quick-deploy-portal.html).

### FastAPI apps work without a custom startup command

Running a FastAPI app used to mean knowing that it needs Gunicorn with a Uvicorn worker and setting that as a custom startup command. That was App Service knowledge leaking into your work.

App Service now detects FastAPI for you. If a common entry-point file such as `main.py`, `app.py`, or `asgi.py` imports FastAPI, the platform starts your app with `gunicorn -k uvicorn_worker.UvicornWorker`. When several frameworks are present, detection follows the priority **Django > FastAPI > Flask**.

At launch, FastAPI detection was enabled for Python 3.14 and later, with more versions to follow.

Learn more: [Simplifying FastAPI deployments on Azure App Service for Linux](https://azure.github.io/AppService/2026/05/14/fastapi-improvements.html).

### Faster deployments

Waiting minutes to see a one-line change go live breaks your flow. When we profiled the Python deployment pipeline, we found that compressing the build output took longer than installing packages. So we:

- **Switched from gzip to Zstandard (zstd) compression**, which also speeds up decompression and cold starts.
- **Made uv the primary package installer** for compatible `requirements.txt` deployments.
- **Removed redundant file copies** and **added a cache of pre-built Python wheels**.

Together, these changes cut Python deployment time by **about 30%**. For dependency-heavy AI apps, the gains are larger: in our 7.5 GB PyTorch benchmark, build time fell from 12.86 minutes to 2.68 minutes, **about 79% faster**.

We also removed unused legacy packages from our platform images, making them **14–57% leaner** depending on the stack.

Learn more: [Platform improvements for Python AI apps on Azure App Service](https://azure.github.io/AppService/2026/05/18/platform-improvements-for-python-ai-apps-on-azure-app-service.html).

### Deployments that are not interrupted by unrelated setting changes

Previously, changing any app setting recycled Kudu immediately, which could fail an in-progress deployment. With **Deferred Kudu Recycle**, settings that do not affect the build, such as an Application Insights connection string, now wait (up to 40 minutes) for the deployment to finish. Settings that do affect the build, such as `KUDU_*`, `ORYX_*`, `SCM_*`, and `WEBSITE_RUN_FROM_PACKAGE`, still recycle immediately.

This works automatically. If your build depends on custom settings, list them in `WEBSITE_DEPLOYMENT_CRITICAL_APPSETTINGS`.

Learn more: [Improving deployment resiliency with Deferred Kudu Recycle](https://azure.github.io/AppService/2026/05/07/kudu-deferred-recycle.html).

### Deployment errors that tell you how to fix them

A failed deployment used to return a single, often truncated, error line. Now `az webapp deploy`, `az webapp up`, and `az webapp create` accept `--enriched-errors true` for Linux apps. For recognized failures, you get an error code, the failing stage, your runtime, the original error, and suggested fixes:

```text
Error Code  : ArtifactStackMismatch
Stage       : Deployment
Runtime     : DOTNETCORE|9.0
Raw Error   : Artifact type = 'War' cannot be deployed to stack = 'DOTNETCORE'.

Suggested Fixes:
- Ensure the artifact type matches the app's runtime stack
- Update the runtime stack if needed
```

The output also includes a prompt you can paste into GitHub Copilot Chat for more specific help.

![Enriched deployment error output in the Azure CLI]({{site.baseurl}}/media/2026/06/cli-enriched-errors-1.png)

The CLI now guides you in everyday tasks too. It suggests next steps after you create an app, warns you when a ZIP deployment needs remote build enabled, and lists your options when you create a Linux app without a runtime. You can also use `az webapp deploy --tag` to give a deployment a friendly name.

Learn more: [Better deployment errors in az webapp deploy](https://azure.github.io/AppService/2026/06/01/azcli-enrichederrors.html), [Azure CLI 2.86.0](https://azure.github.io/AppService/2026/05/05/azure-cli-2-86-app-service-updates.html), and [Azure CLI 2.90.0](https://azure.github.io/AppService/2026/09/01/azure-cli-2-90-app-service-updates.html).

### Deploying with GitHub Copilot

More developers now ask an AI assistant to deploy their app. To give those assistants the right guidance from the start, we published a [GitHub Copilot skill for deploying Python apps to App Service](https://github.com/microsoft/azure-skills/blob/main/skills/python-appservice-deploy/SKILL.md). It works hand in hand with FastAPI detection, faster builds, and enriched errors.

## Monitor clearly

Once your app is deployed, the next question is whether it is actually working, and if not, why. We focused on giving you a clear answer without having to piece it together from several tools.

### Site Status: is my app running, starting, or stuck?

**Site Status**, in your web app's **Properties** in the Azure portal, shows the platform's view of your app's runtime state: **Starting**, **Started**, **Stopping**, **Stopped**, **Updating**, or **Blocked** (startup failed repeatedly). No configuration is needed.

If the platform detects a problem, the status shows **Issues Detected**. Select it to see the last error, when it occurred, and the state of each instance. From there, **Repair** lets you restart the site or replace an unhealthy instance. For configuration problems that a restart will not fix, such as a storage mount failing because of network settings, Site Status points you to the root cause instead.

![Site Status in the Azure portal]({{site.baseurl}}/media/2026/06/sitestatus-1.jpg)

Learn more: [Understand what's happening with your website using Site Status](https://azure.github.io/AppService/2026/06/01/sitestatus.html).

### Startup logs and troubleshooting from the command line

When an app fails to start, you need to see what happened: the image pull, the startup command, your app's output, and the warmup probe. New Azure CLI commands (preview) bring this to your terminal:

```bash
# See each startup attempt, then the most relevant log
az webapp log startup list --name <app-name> --resource-group <resource-group>
az webapp log startup show --name <app-name> --resource-group <resource-group>

# Health across all instances, and a check of common configuration issues
az webapp troubleshoot status --name <app-name> --resource-group <resource-group> --report
az webapp troubleshoot config --name <app-name> --resource-group <resource-group> --report
```

`log startup show` picks the most recent failure log, so one command usually gets you to the problem, such as an app listening on the wrong port. `troubleshoot config` checks settings like the runtime stack, port, startup command, Always On, and health check path, alongside any recent runtime error. The commands return structured output for scripts and AI agents; add `--report` for an easy-to-read summary.

Learn more: [Debug app startup faster with startup logs](https://azure.github.io/AppService/2026/06/10/azcli-startuplogs.html), [Azure CLI 2.89.0](https://azure.github.io/AppService/2026/08/04/azure-cli-2-89-app-service-updates.html), and [Azure CLI 2.91.0](https://azure.github.io/AppService/2026/10/06/azure-cli-2-91-app-service-updates.html).

### All your logs in one place

The new **Log stream** page in Kudu puts application and platform logs side by side. Stream live or browse a time range, filter by instance, container, type, and level, and search by keyword. Platform logs show container lifecycle events, restarts, and warmup probes next to your app's own output. To open it, select **Advanced Tools** > **Go** in the Azure portal, and then open **Logs**.

![The new Log stream page in Kudu]({{site.baseurl}}/media/2026/06/platform-logs.png)

Learn more: [A better way to view logs in Kudu for App Service on Linux](https://azure.github.io/AppService/2026/06/12/kudu-logs.html).

### A more helpful Application Error page

Every failed request used to show the same generic "Application Error" page. The new page shows the actual error, such as **503 Service Unavailable**, with a plain-language explanation and a **timestamp** you can use to find the right logs.

## Maintain confidently

Running an app in production means investigating issues as they happen and keeping the platform up to date without surprises. These improvements bring diagnostics to you and give you more control.

### Shell access to any Linux app, including custom containers

WebSSH for custom containers used to require an SSH server and a root password inside your image, which many security-conscious teams cannot accept. App Service now connects to your running container through Kudu as an authenticated proxy, so **you do not need an SSH daemon or credential in your image.** Use it from the Kudu terminal or with the new `az webapp exec` command (preview):

```bash
# Interactive shell in your app container
az webapp exec --resource-group <resource-group> --name <app-name> --shell /bin/sh

# Run a background command, such as a migration, on every instance
az webapp exec --resource-group <resource-group> --name <app-name> \
  --mode execute --instance all \
  --shell-command "python manage.py migrate > /home/LogFiles/migrate.log 2>&1"
```

Execute mode confirms only that the platform accepted the command, so check its result separately. Shell access is a privileged capability: turn it off with the `sshEnabled` property on apps that do not need it, or enforce that at scale with Azure Policy.

Learn more: [Azure CLI 2.90.0](https://azure.github.io/AppService/2026/09/01/azure-cli-2-90-app-service-updates.html) and the [Community Standup recap](https://azure.github.io/AppService/2026/10/08/platform-release-channels-and-webssh-for-custom-containers.html).

### CPU and memory profiling for Node.js, with built-in analysis

When a Node.js app slows down or its memory keeps growing, go to **Diagnostic Tools** in Kudu and choose **Collect & analyze** to get a report without leaving the browser. Memory reports highlight heap usage, unusually large object counts, and possible leaks. CPU reports show the hottest functions with their source locations, garbage collection time, and operations that block the event loop. Each report ends with recommendations on where to look first. Prefer your own tools? Choose **Collect** to download the raw file.

![CPU profiling analysis report]({{site.baseurl}}/media/2026/09/cpu-report-1.jpg)

Learn more: [Diagnose CPU and memory issues in Node.js apps on App Service for Linux](https://azure.github.io/AppService/2026/09/17/cpu-memory-profiling.html).

### Network capture, with analysis built in

Network troubleshooting used to mean running `tcpdump` over SSH and opening the trace in Wireshark. **Network Capture** (preview) lets you collect a trace from Kudu (**Diagnostic Tools** > **Network Capture**) or the CLI:

```bash
az webapp troubleshoot collect network-capture \
  --resource-group <resource-group> --name <app-name> --duration 30
```

With **Collect & analyze**, you get a report that highlights HTTP 5xx responses, failed TCP handshakes, resets, retransmissions, and slow requests, with charts over time. For example, connections stuck in `SynSent` can point to firewall or SNAT problems. Captures can contain sensitive data, so handle them with care.

![Network capture analysis summary]({{site.baseurl}}/media/2026/09/network-capture-summary.jpg)

Learn more: [Capture and analyze network traces in App Service for Linux](https://azure.github.io/AppService/2026/09/17/network-capture.html).

### Platform Release Channel: choose when runtime patches reach your app

Runtime patches bring security fixes, but production apps often need time to validate them. **Platform Release Channel** lets you choose how quickly your app gets them:

| Channel | Behavior | Recommended for |
|---|---|---|
| Latest | Patches as soon as they are available | Early validation, not production |
| Standard (default) | Standard release cadence | Most production apps |
| Extended | Typically one release behind Standard | Apps that need more validation time |

A good pattern is to keep production on Standard and set a deployment slot to Latest to test upcoming patches first. Set the channel in **Stack settings** in the Azure portal or with the CLI:

```bash
az webapp update --resource-group <resource-group> --name <app-name> \
  --platform-release-channel <Latest|Standard|Extended>
```

Learn more: [Control runtime patch updates with Platform Release Channel](https://azure.github.io/AppService/2026/05/06/platform-release-channel.html).

## What's next

We are not done. Here is some of what we are working on:

- **A Troubleshooting hub in the Azure portal** that brings the issues detected for your app into one guided experience, so you can go from a symptom to a likely cause without knowing which tool to open.
- **Code deployment rollbacks**, so you can return to a previous deployment in one click without uploading the old package again.
- **Secure Builds**, which will show known vulnerabilities in your app's open-source packages for each deployment, matched against GitHub security advisories.

We will keep applying the same rules: infer what we can, show what is happening, make failures actionable, make things faster, and prevent failures where we can. Try these features and tell us what you think. Your feedback shapes what we build next.
