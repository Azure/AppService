---
title: "Modernize more applications with Managed Instance on Azure App Service"
author_name: "Andrew Westgarth"
toc: true
toc_sticky: true
---

# Modernize more Windows applications with Managed Instance on Azure App Service

*What's new since general availability: Azure Migrate support, Premium v3 hosting, and Isolated v4 for App Service Environment.*

**By Andrew Westgarth, Principal Product Manager, Azure App Service**

For many organizations, the hardest part of modernizing a Windows web application isn't moving the code. It's understanding the dependencies that tie the application to its current server: installed components, registry settings, Windows services, network shares, and other operating system configuration.

Since **Managed Instance on Azure App Service became generally available in August 2026**, we've continued investing in ways to make these migrations easier to discover, assess, and execute. At Microsoft Ignite 2026, we're highlighting three updates: **Azure Migrate support**, **Premium v3 availability**, and **Isolated v4 support**.

Together, they make Managed Instance easier to include in portfolio-scale modernization plans and give customers more flexibility in choosing where to host eligible applications.

## Start with discovery: Azure Migrate support for Managed Instance

Modernization begins with understanding which applications you have and which Azure destination fits their requirements. Applications with Windows-specific dependencies may have been ruled out for conventional App Service migrations, leaving teams to choose between extensive rewrites and continuing to manage virtual machines.

**Azure Migrate support for Managed Instance** helps bring this hosting option into migration discovery and assessment workflows. Teams can revisit Windows web applications that were previously considered unsuitable for standard App Service hosting, assess their dependencies, and evaluate whether Managed Instance is an appropriate destination.

This supports a more repeatable modernization approach:

1. **Discover** Windows application workloads across the estate.
2. **Assess** application and infrastructure dependencies, using Azure Migrate and available assessment tooling.
3. **Identify candidates** whose requirements align with Managed Instance capabilities.
4. **Validate** one representative application in a non-production environment.
5. **Expand** from a proven migration pattern to a wider application portfolio.

Azure Migrate assessment informs the decision; it does not guarantee compatibility or eliminate the need to test installation scripts, networking, configuration, and application behavior. Managed Instance also complements GitHub Copilot modernization for .NET, which can help teams assess, remediate, validate, and deploy suitable applications.

## More hosting flexibility: Premium v3 availability

Managed Instance initially emphasized Premium v4 hosting. We're expanding the options with support for **Premium v3 and Premium v3 memory-optimized plans** in enabled regions.

This gives customers an additional path where Premium v4 regional capacity or availability would otherwise constrain a modernization project. It also allows teams to consider a broader set of App Service compute options when balancing workload needs, capacity, and cost.

Premium v3 availability is being enabled across eligible App Service infrastructure over time. **Confirm Managed Instance eligibility for the exact region and plan before committing to a migration schedule.** Availability should not be assumed for every Premium v3 stamp or region at launch.

## Dedicated hosting: Isolated v4 support

We're also expanding Managed Instance to **Isolated v4 App Service plans in App Service Environment v3**.

This brings Managed Instance capabilities to a **single-tenant App Service hosting environment** for organizations whose architecture calls for dedicated hosting and network isolation. It offers another modernization option for eligible Windows web applications with installed components, operating system customization, or other supported dependencies.

Isolated v4 expands the choice of hosting environment; it does not mean arbitrary server administration or that every Windows workload is supported. Customers should validate Managed Instance feature boundaries, region support, networking, and application dependencies before migration.

## Why Managed Instance matters

Managed Instance on Azure App Service is designed for Windows web applications that need more operating system customization than conventional App Service hosting offers, while retaining managed platform benefits such as patching, scaling, diagnostics, and identity integration.

Capabilities include:

- **Configuration scripts** for supported installers, components, Windows features, and services.
- **Registry adapters** for supported application configuration.
- **Storage mounts** for required file-share and drive-letter scenarios.
- **Secure RDP through Azure Bastion** for diagnostics and familiar Windows tools.
- **Managed identity and Azure Key Vault integration** for securely accessing supported resources and secrets.

Managed Instance is intended for eligible **Windows web applications**. It is not a Linux or container hosting option, nor a replacement for a fully customizable Windows virtual machine.

## From one application to a modernization portfolio

These updates connect the key stages of modernization:

- **Discover and assess:** Use Azure Migrate and application assessment tools to identify candidates.
- **Modernize where needed:** Use GitHub Copilot modernization for .NET and targeted changes to address compatibility gaps.
- **Choose the hosting model:** Evaluate Managed Instance on Premium v3, Premium v4, or Isolated v4, subject to region and plan support.
- **Migrate and operate:** Validate dependencies and deploy to App Service with managed operational capabilities.

A practical first step is to revisit one Windows web application previously excluded from App Service because of its dependencies. Assess it, validate its fit, and use the lessons learned to inform a repeatable approach for similar applications.

## Get started

- [Managed Instance quickstart](https://aka.ms/managedinstanceonappservicequickstart)
- [Managed Instance configuration documentation](https://go.microsoft.com/fwlink/?linkid=2347057)
- [Managed Instance samples and configuration scripts](https://aka.ms/managedinstanceonappservicesamples)
- [Managed Instance overview on Microsoft Learn](https://learn.microsoft.com/azure/app-service/overview-managed-instance)

**Revisit applications that previously seemed too complex for App Service. With Azure Migrate support and more hosting choices, Managed Instance can help you move more of your Windows application portfolio to a managed platform with fewer changes.**
