---
title: "A Practical Path to Building AI-Ready Applications on Azure App Service"
author_name: "Andrew Westgarth and Gaurav Seth"
tags:
  - ai-integration
  - managed-instance
  - mcp
---

Migrating an existing Windows application to the cloud can be challenging when it depends on server roles, local storage, registry access, or third-party libraries. If technologies such as `System.Drawing`, Crystal Reports, MSMQ, Windows services, or drive-letter-based storage are blocking your migration, this recorded session is for you.

Perhaps rewriting the application would take months, or you no longer have access to all the original source code. Even after migrating, you may be wondering how to bring AI capabilities to the business logic you already have.

In **[A Practical Path to Building AI-Ready Applications on Azure App Service](https://www.youtube.com/watch?v=TleupQT2ZOM)**, the team demonstrates how three Azure App Service capabilities can create a practical, incremental modernization path:

- **[Managed Instance on Azure App Service](https://techcommunity.microsoft.com/blog/AppsonAzureBlog/announcing-general-availability-of-managed-instance-on-azure-app-service/4541283)** helps move Windows applications to a managed platform while preserving important operating system and application dependencies.
- **[GitHub Copilot app modernization](https://learn.microsoft.com/azure/developer/github-copilot-app-modernization/)** can assess applications and accelerate modernization when source code is available.
- **[Built-in MCP on Azure App Service](https://learn.microsoft.com/azure/app-service/configure-mcp-built-in)** can expose existing APIs as Model Context Protocol (MCP) tools, making them available to agents without requiring you to build and host a separate MCP server.

The session also includes an end-to-end demonstration showing how these capabilities work together.

Instead of starting with a large, risky rewrite, you can **lift, extend, and modernize**: move the application first, take advantage of the managed Azure App Service platform, and then add modern and AI-powered experiences incrementally.

If you are facing a migration project that could take 6, 12, or even 18 months, watch the recording to see how this approach can help shorten and simplify the journey.

## Watch the Session

[![Watch A Practical Path to Building AI-Ready Applications on Azure App Service](https://img.youtube.com/vi/TleupQT2ZOM/maxresdefault.jpg)](https://www.youtube.com/watch?v=TleupQT2ZOM)

[Watch on Microsoft Reactor](https://developer.microsoft.com/en-us/reactor/events/27396/) | [Watch on YouTube](https://www.youtube.com/watch?v=TleupQT2ZOM)

## Resources

- [Announcing General Availability of Managed Instance on Azure App Service](https://techcommunity.microsoft.com/blog/AppsonAzureBlog/announcing-general-availability-of-managed-instance-on-azure-app-service/4541283)
- [Managed Instance on App Service overview](https://learn.microsoft.com/azure/app-service/overview-managed-instance)
- [Deploy Managed Instance on Azure App Service](https://learn.microsoft.com/azure/app-service/quickstart-managed-instance)
- [Configure Managed Instance on Azure App Service](https://learn.microsoft.com/azure/app-service/configure-managed-instance)
- [Managed Instance on Azure App Service GitHub repository](https://github.com/Azure/Managed-Instance-on-Azure-App-Service)
- [Managed Instance quickstart repository](https://github.com/Azure-Samples/managed-instance-azure-app-service-quickstart)
- [DevShop sample on GitHub](https://github.com/gsethdev/devShop/tree/devshopASMIwithSQL)
- [Configure App Service built-in MCP](https://learn.microsoft.com/azure/app-service/configure-mcp-built-in)
- [Configure MCP server authorization](https://learn.microsoft.com/azure/app-service/configure-authentication-mcp)
- [GitHub Copilot App Modernization documentation](https://learn.microsoft.com/azure/developer/github-copilot-app-modernization/)
- [Introduction to GitHub Copilot App Modernization](https://learn.microsoft.com/training/modules/intro-github-copilot-app-modernization/)
- [Agentic IIS Migration to Managed Instance on Azure App Service](https://azure.github.io/AppService/2026/04/09/Agentic_IIS_Migration_to_Managed_Instance_On_AppService.html)
- [IIS Migration MCP Server repository](https://github.com/gsethdev/agenticmigration)
- [Managed Instance storage-mount CLI reference](https://learn.microsoft.com/cli/azure/appservice/plan/managed-instance/storage-mount?view=azure-cli-latest)
- [Managed Instance install-script CLI reference](https://learn.microsoft.com/cli/azure/appservice/plan/managed-instance/install-script?view=azure-cli-latest)
- [Managed Instance instance CLI reference](https://learn.microsoft.com/cli/azure/appservice/plan/managed-instance/instance?view=azure-cli-latest)
