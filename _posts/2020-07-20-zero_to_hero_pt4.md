---
title: 'Zero to Hero with App Service, Part 4: Migrate Applications to Azure App Service'
author_name: "Gaurav Seth"
tags: 
    - zero to hero
toc: true
toc_sticky: true
---

In this installment of Zero to Hero with App Service, learn how to migrate your existing applications to App Service. If you followed parts one, two, and three then you already have an application on App Service, and you can continue to the next article.

## Overview

There are multiple ways to migrate a web application to Azure App Service:

- Redeploy code using [CI/CD Pipelines](https://azure.github.io/AppService/2020/06/29/zero_to_hero_pt2.html), Web Deploy, or the REST APIs
- Containerize your web application and [deploy from a container registry](https://docs.microsoft.com/azure/app-service/containers/configure-custom-container)
- Use App Service Migration Assessment Tool to migrate your ASP.NET, PHP web applications and Linux containers

App Service Migration Assessment Tool assesses whether your web site can be moved to Azure App Service. If your web site is public, you can simply [provide your URL on this website](https://appmigration.microsoft.com/assessment/) to run the assessment. You can also [download and run the assistant](https://appmigration.microsoft.com/readiness) if your web site is hosted in a private environment. Post assessment App service Migration Assessment tool allows quick and easy migration of ASP.NET and PHP web applications running on IIS, and containerized web applications running on Linux operating systems to Azure App Service.

## Step by Step Guidance

Please refer to [Test Deployment and Migration Instructions](https://github.com/Azure/App-Service-Migration-Assistant/blob/master/MigrationDocs/Test%20Deployment%20%26%20Migration%20Instructions.docx) for step-by-step instructions on migrating a sample ASP.NET web application to Azure App Service.

You can also refer to the Microsoft [learn module](https://docs.microsoft.com/learn/modules/migrate-app-service-migration-assistant/) for more information on how to migrate an on-premises web application App Service.

## How the Tool Works

- Online assessment of publicly accessible web application using [https://appmigration.microsoft.com/assessment](https://appmigration.microsoft.com/assessment)
- Tool based assessment of internal web applications using the version of tool available for Windows OS and Linux OS. (Download the tool at [https://appmigration.microsoft.com/readiness](https://appmigration.microsoft.com/readiness))
- Based on outcome of assessment (readiness checks) you may proceed further to migrate your web application to Azure App service using App Service Migration Assessment [Tool](https://appmigration.microsoft.com/readiness)

_Please read_ [_How the Assistant Works_](https://github.com/Azure/App-Service-Migration-Assistant/wiki/How-the-Assistant-Works) _for detailed information._

## Readiness Checks

The App Service Migration Assessment Tool runs multiple readiness checks. The results of the readiness checks are used to decide if your app can migrate to Azure App Service. A comprehensive list of the checks is shown below.

### IIS Server Site Checks

- Port Bindings
- Protocol
- Certificates
- Location Tags
- ISAPI Filters
- Application Pools
- Application Pool Identity
- Authentication Type
- Application Settings
- Connection Strings
- Framework
- Virtual Directories

> For detailed information on readiness checks and possible remediation steps, [see this article](https://github.com/Azure/App-Service-Migration-Assistant/wiki/Readiness-Checks#iis-server-site-checks).

### Linux Container Checks

- Linux Platform
- Container Volume
- Exposed Ports
- HTTP Traffic

> Please read [Linux Container Checks](https://github.com/Azure/App-Service-Migration-Assistant/wiki/Readiness-Checks#linux-running-container-checks) for detailed information on readiness checks and possible remediation steps.

## Database Migration and Hybrid Connections

App Service Migration Assistant migrates the web application and associated configurations only, it does not migrate databases. There are multiple ways to migrate databases to Azure. Some options are listed below.

- Use the [SQL Server Migration Guidance](https://azure.microsoft.com/migration/sql-server/)
- Use [Azure Database Migration Service](https://docs.microsoft.com/azure/dms/dms-overview)

Your web application on Azure App service can also connect to an existing, on-premises database using [Hybrid Connections](https://docs.microsoft.com/azure/app-service/app-service-hybrid-connections).

Hybrid Connections allow your web application to securely access resources in other networks – in this case, an on-premises database. The migration tool configures and sets up Hybrid Connections for you, allowing you to migrate your site while keeping your database on-premises. You can then migrate your database later.

Azure Migrate Hub Integration

[Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) provides a centralized hub to assess and migrate on-premises servers, infrastructure, applications, and data. The Migration assessment tool allows you to sync assessment data with Azure Migrate Hub for both successful migrations and migrations with blockers.

![Azure Migration Hub]({{site.baseurl}}/media/2020/07/migration_hub.png){: .align-center}

## Summary

Using these resources, you can easily assess the migration feasibility of your .NET, PHP, and Linux containers. Once your migration assessment is complete, use the assistant&#39;s step-by-step instructions to complete the migration to App Service. For more information, see the links below.

### Helpful Resources

1. App Service Migration Assistant Tool [Website](https://appmigration.microsoft.com/)
1. Migration [checklist](https://azure.microsoft.com/en-us/blog/migration-checklist-when-moving-to-azure-app-service/) when moving to Azure App Service
1. Linux [Notes](https://github.com/Azure/App-Service-Migration-Assistant/wiki/Linux-Notes)
1. Release [Notes](https://github.com/Azure/App-Service-Migration-Assistant/wiki/Release-Notes)
1. Known [Issues](https://github.com/Azure/App-Service-Migration-Assistant/wiki/Known-Issues)
1. Azure [CLI](https://github.com/Azure/App-Service-Migration-Assistant/wiki/Using-Azure-CLI)
