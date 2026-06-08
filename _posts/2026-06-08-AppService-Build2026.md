---
title: "App Service Build 2026 Updates"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

Build 2026 is here, and Azure App Service is showing up with a packed lineup of updates. This post is your one-stop rollup of what's new: a brand-new [Easy AI experience](#app-service-easy-ai) that turns your web apps into agent-ready endpoints, the general availability of [Isolated v4 on ASEv3](#isolated-v4), continued progress on [App Service Managed Instance](#managed-instance-on-azure-app-service), and a wave of [platform](#platform-improvements) and [CLI improvements](#improvements-to-az-cli-investing-in-the-azure-cli-for-the-agent-era) built for the agent era.

It's a clear signal of [our continued investment](https://azure.github.io/AppService/2026/03/31/continued-investment.html) in App Service: the same managed platform you rely on, evolving to meet you where modern apps (and the agents that build and consume them) are headed. Read on for the highlights, with links to deeper dives on each announcement.

## App Service Easy AI

We're introducing Easy AI, a new umbrella of capabilities that make it simple to turn your existing App Service web apps into AI-ready, agent-native applications, with no rearchitecting required. The centerpiece of this first release is a brand-new AI (preview) blade in the Azure Portal, giving you a single place to enable AI capabilities directly on your web app.

The first feature available under Easy AI is [Built-in MCP on App Service](https://aka.ms/Build26/AppService-BuiltInMCP). With Built-in MCP, you can turn your web app into a Model Context Protocol server with no code changes. Just provide an OpenAPI specification, and App Service automatically generates the tools and a ready-to-use endpoint that AI agents can call. From the MCP servers tab in the AI (preview) blade, you can create and manage your MCP server in a few clicks, and optionally register it in your [Azure API Center](https://learn.microsoft.com/azure/api-center/register-discover-mcp-server) to catalog and govern it alongside the rest of your APIs and MCP servers. It's the fastest way to give agents secure, structured access to the functionality your app already exposes.

The AI (preview) blade also includes a new [Agents tab](https://aka.ms/Build26/AppService-Agents), giving you visibility into the AI agents hosted in your App Service. It surfaces key metrics (total agents, calls, tokens consumed, and error rate) drawn from your app's telemetry in Application Insights, instrumented using OpenTelemetry with Generative AI semantic conventions. From here you can drill into the data in Application Insights to monitor agent behavior, performance, and cost over time.

This is just the beginning. Built-in MCP and the Agents experience are the first in a series of Easy AI features we're rolling out to make adding AI to your App Service web apps simple and easy, so you can spend less time on plumbing and more time building intelligent, agent-ready applications. To get started, open the AI (preview) blade on your App Service web app today. Stay tuned, there's much more to come.

## Isolated V4

We're also excited to announce the general availability of [Isolated v4 (Iv4) on App Service Environment v3 (ASEv3)](https://aka.ms/AppService/Iv4docs). Iv4 brings the latest v4 hardware generation (the same next-generation compute that powers [Premium v4](https://learn.microsoft.com/azure/app-service/app-service-configure-premium-v4-tier)) to customers running dedicated, single-tenant workloads on ASEv3, delivering significantly better performance than Isolated v2 without compromising the isolation, compliance, and data residency guarantees that mission-critical apps depend on. Iv4 is now generally available across a limited set of Azure regions, with additional regions rolling out over time based on customer demand and capacity. See the docs for the [full list](https://aka.ms/AppService/Iv4regions). To get started, create a new ASEv3 with an Iv4 plan or scale an existing one; see the [App Service pricing page](https://azure.microsoft.com/pricing/details/app-service/windows/) for full SKU and pricing details. Due to significant demand, available capacity may be limited even in supported regions at this time. If you encounter issues, please open a support ticket.

Additionally, Iv4 on ASEv3 also lays the foundation for [App Service Managed Instance](#managed-instance-on-azure-app-service) on dedicated infrastructure, unlocking advanced isolation scenarios for compliance and data-residency-sensitive workloads.

## Managed Instance on Azure App Service

Managed Instance on App Service (Preview) continues to evolve with key improvements, including faster restarts (~30s), no restarts for registry and storage adapter changes, and integrated diagnostics tooling. The service is expanding to new regions (e.g., Central and South India) with broader rollout underway, alongside deeper integration with the GitHub Copilot App Mod tool, driving continued customer and partner engagement as we drive towards general availability.

[Managed Instance on Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/overview-managed-instance) will soon be extended to App Service Environments (ASE) using the new Iv4 SKU, providing a more modern, scalable, and optimized foundation. This enables customers to simplify and accelerate deployment of Windows workloads, especially web applications requiring custom dependencies or deeper OS-level control, while benefiting from ASE's single-tenant isolation, enhanced security and compliance boundaries, fine-grained network control, and predictable performance at scale. Overall, this offers a seamless path to modernize existing applications with minimal changes while aligning with Azure App Service capabilities and best practices.

Recent updates to the [Azure App Service migration PowerShell](https://github.com/Azure/App-Service-Migration-Assistant/wiki/PowerShell-Scripts) scripts extend support for Managed Instance on App Service, enabling a more seamless lift & improve experience for applications with OS-level dependencies. By adding the `-UseManagedInstance` switch during invocation, customers can now automatically generate migration settings tailored for Managed Instance, including configuration for the App Service plan, adapters, and install scripts. This simplifies onboarding by capturing all required parameters in the result settings file, reducing manual setup for complex workloads that rely on registry, COM components, or custom dependencies.

Check out this [Agentic IIS Migration to Managed Instance on Azure App Service](https://techcommunity.microsoft.com/blog/AppsonAzureBlog/agentic-iis-migration-to-managed-instance-on-azure-app-service/4508969), which showcases an AI-guided approach to migrating legacy IIS applications using a multi-agent workflow powered by MCP. It simplifies discovery, assessment, and deployment for complex Windows workloads with OS-level dependencies. This is an early pilot, and customers should adapt and extend the approach based on their specific application requirements and environments.

## Platform Release Channel

Keeping runtimes evergreen is one of the core promises of a managed platform, but it cuts both ways: the same patch that fixes a CVE can occasionally surface a behavior change in a framework, an incompatibility with a third-party module, or break an assumption hardcoded somewhere in your app. Until now, the answer was "trust the rollout," and for the apps that couldn't, the fallback was to move to containers and take on managing the base image yourself.

[Platform Release Channel](https://azure.github.io/AppService/2026/05/06/platform-release-channel.html) for App Service on Linux changes that. It introduces a simple per-app setting that lets you choose how quickly a new runtime patch reaches your workload. Point your dev and test apps at **Latest** to pick up new patches as soon as they ship and validate early; leave production on the default **Standard** channel for the balance most apps want; or move sensitive workloads to **Extended** to stay one release behind and buy extra validation time. Same managed runtimes, same automatic patching, now with a control plane that fits how real teams ship.

## Improvements to AZ CLI: Investing in the Azure CLI for the agent era

AI agents are increasingly using the Azure CLI as a primary entry point for managing Azure resources and orchestrating cloud workflows. To make sure agents (and the developers building them) get what they need, we've been investing heavily in the App Service CLI experience across both `az webapp` and `az appservice`. The goal: clearer signals, richer data, and more actionable output so both humans and agents can succeed on the first try.

The first few waves of those improvements has already shipped. [Enriched deployment errors](https://azure.github.io/AppService/2026/06/01/azcli-enrichederrors.html) are a new opt-in switch (`--enriched-errors true`) on `az webapp deploy` for App Service on Linux that turn opaque deployment failures into structured, actionable diagnostics (including an error code, deployment context, the raw error, suggested fixes, and even a ready-to-paste GitHub Copilot prompt) directly in your CLI output. We've also revamped `az webapp list-runtimes`, replacing the old flat list with a structured table that includes OS, runtime, version, support lifecycle status, and end-of-life dates, plus new `--runtime` and `--support` filters so you (or your agent) can quickly answer questions like "which of my runtimes are nearing EOL?" or "what supported Python versions can I deploy on Linux today?"

Alongside these features, we've also burned through a significant chunk of our CLI backlog over the past few releases, so there are plenty of fixes and quality-of-life improvements waiting for you in the latest version. Make sure you, your scripts, and CI pipelines are on the latest CLI version to see all of these updates. This is just the start; more agent-focused CLI investments are on the way.

## Platform Improvements

The same "make the platform easier to live with" thread runs through this other set of recently shipped features. None of them are headline features on their own, but together they take real friction out of the everyday App Service experience:

**A faster Python deployment pipeline.** We profiled the remote build path end-to-end and rebuilt the slow parts: Zstandard now replaces gzip for build artifacts (compression ~6x faster, decompression ~2.6x faster, which also speeds up cold starts), [uv](https://github.com/astral-sh/uv) replaces `pip` as the primary installer when compatible (with automatic fallback to `pip`), and a redundant staging copy was removed entirely. Net result: roughly **30% faster Python deployments** on App Service for Linux, with the biggest wins on AI/ML apps that pull in large dependency trees. See [Platform Improvements for Python AI Apps on Azure App Service](https://azure.github.io/AppService/2026/05/18/platform-improvements-for-python-ai-apps-on-azure-app-service.html) for the full breakdown.

**FastAPI just works.** Deploying a FastAPI app no longer requires a custom startup command. App Service now scans common entry-point files (`main.py`, `app.py`, `api.py`, etc.), detects the FastAPI import, and starts the app with the right Gunicorn/Uvicorn worker automatically. Enabled today for Python 3.14+, with more versions on the way. Details in [Simplifying FastAPI Deployments on Azure App Service for Linux](https://azure.github.io/AppService/2026/05/14/fastapi-improvements.html).

**Deployments that survive a config change.** With [Deferred Kudu Recycle](https://azure.github.io/AppService/2026/05/07/kudu-deferred-recycle.html), updating a non-critical app setting or connection string while an async deployment is in flight no longer interrupts it. Kudu defers the recycle for up to 40 minutes so the in-progress deployment can finish, while deployment-critical settings (Kudu/Oryx/SCM prefixes, `WEBSITE_RUN_FROM_PACKAGE`, and friends) still recycle immediately. You can also mark your own settings as deployment-critical with `WEBSITE_DEPLOYMENT_CRITICAL_APPSETTINGS`.

**Better SSH ergonomics for Python apps.** A set of [new SSH helper aliases for Python apps on Linux](https://techcommunity.microsoft.com/blog/appsonazureblog/new-ssh-helper-aliases-for-python-apps-on-azure-app-service-for-linux/4520111) makes the in-container experience friendlier for diagnostics: shortcuts for activating the virtual environment, jumping to common app paths, and inspecting the running process, so you spend less time remembering paths and more time debugging.

**Site Status: know what your app is actually doing.** When a site won't start or is behaving oddly, the new [Site Status](https://techcommunity.microsoft.com/blog/appsonazureblog/understand-what%E2%80%99s-happening-with-your-app-service-for-linux-website-using-site-s/4524676) experience in the portal surfaces the platform-level lifecycle state (Starting / Started / Stopping / Stopped / Updating / Blocked) along with the last known error and per-instance detail. From the same view you can take repair actions like restarting the site or replacing the underlying instance, without leaving the blade.

### More details

For deeper dives on each of the above, see:

- Performance and reliability improvements for Python deployment pipeline
  - [Platform Improvements for Python AI Apps on Azure App Service - Azure App Service](https://azure.github.io/AppService/2026/05/18/platform-improvements-for-python-ai-apps-on-azure-app-service.html)
- Simplifying FastAPI Deployments on Azure App Service for Linux
  - [Simplifying FastAPI Deployments on Azure App Service for Linux - Azure App Service](https://azure.github.io/AppService/2026/05/14/fastapi-improvements.html)
- Deferred Kudu Recycle
  - [Improving Deployment Resiliency on Azure App Service for Linux with Deferred Kudu Recycle - Azure App Service](https://azure.github.io/AppService/2026/05/07/kudu-deferred-recycle.html)
- New SSH Helper aliases
  - [New SSH helper aliases for Python apps on Azure App Service for Linux | Microsoft Community Hub](https://techcommunity.microsoft.com/blog/appsonazureblog/new-ssh-helper-aliases-for-python-apps-on-azure-app-service-for-linux/4520111)
- Site Status Indicator
  - [Understand What's Happening with Your App Service for Linux Website Using Site Status | Microsoft Community Hub](https://techcommunity.microsoft.com/blog/appsonazureblog/understand-what%E2%80%99s-happening-with-your-app-service-for-linux-website-using-site-s/4524676)

## Wrapping up

Build 2026 is a big moment for App Service, but the through-line is the same one we've been pulling on all year: take a managed platform you already trust, and keep making it faster, more flexible, and easier to live with as the way you build apps changes. Easy AI brings agents into the picture without forcing a rewrite, Isolated v4 and Managed Instance push the boundaries of what fully-managed isolation can look like, and the platform and CLI work make the everyday parts of running an app on App Service a little less painful.

As always, we want to hear from you. Try out the new features, give us feedback, and let us know what you want to see next. We're committed to making Azure App Service the best place to run your web apps in the agent era and beyond, and your input is critical to making that happen. Thanks for being part of the journey!
