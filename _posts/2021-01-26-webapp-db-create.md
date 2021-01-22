---
title: "New App Service + Database create blade (preview)"
author_name: "Byron Tardif, Elliott Hamai"
---

We are happy to share a [**new resource create blade**](https://portal.azure.com/?feature.customportal=false#create/Microsoft.AppServiceWebAppDatabaseV3) for App Service and Azure databases. This new experience, currently in preview, deploys a PostgreSQL or Azure SQL database and automatically connects it to your web app.

This new create flow was built with simplicity in mind. You only need to provide a name and runtime stack for the web app, and choose between Azure SQL or PostgreSQL. Once the resources are created the database connection strings are automatically added as app settings on the web app.

[![Screenshot of the new create experience.]({{site.baseurl}}/media/2021/01/webapp-db-create.png)](https://portal.azure.com/?feature.customportal=false#create/Microsoft.AppServiceWebAppDatabaseV3){: .align-center}

You can get to the new blade using [this link](https://portal.azure.com/?feature.customportal=false#create/Microsoft.AppServiceWebAppDatabaseV3), or by searching "web app database" in the Azure Portal.

By default, the  blade will create a new PremiumV2 App Service plan and either a [serverless Azure SQL](https://docs.microsoft.com/azure/azure-sql/database/serverless-tier-overview) server or General Purpose [PostgreSQL flexible server](https://docs.microsoft.com/azure/postgresql/flexible-server/) depending on you choice of database. Once created, you can scale these services up or down depending on your requirements.

> Azure Database for PostgreSQL is currently in preview.

![Screenshot of the connection strings.]({{site.baseurl}}/media/2021/01/webapp-db-connection-strings.png){: .align-center}
