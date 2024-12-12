---
title: "A Step-by-Step Guide to Datadog Integration with Linux App Service via Sidecars"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

In this blog post, we dive into the realms of observability and monitoring, taking advantage of the latest advancements in Azure's Linux App Service. If you've been following App Service updates, you might have caught wind of the [Public Preview for the Sidecar Pattern for Linux App Service](https://azure.github.io/AppService/2024/04/04/Public-Preview-Sidecars-Webjobs.html) announced recently. Leveraging this development, we're here to guide you through integrating Datadog, an Azure Native ISV service partner that provides a powerful observability platform, with your .NET custom container application hosted on Linux App Service. Whether you're eager to streamline log management, track application traces, or enhance request monitoring, we've got you covered.

## Setting up your .NET application

To get started, you'll need to containerize your .NET application. This [tutorial](https://learn.microsoft.com/en-us/dotnet/core/docker/build-container?tabs=windows&pivots=dotnet-8-0) walks you through the process step by step.

Once your application is containerized, you can integrate the Datadog tracer. To do that, you will need to add the following lines to the Dockerfile for your main application.

```dockerfile
# Datadog specific
RUN mkdir -p /datadog/tracer
RUN mkdir -p /home/LogFiles/dotnet

ADD https://github.com/DataDog/dd-trace-dotnet/releases/download/v2.49.0/datadog-dotnet-apm-2.49.0.tar.gz /datadog/tracer
RUN cd /datadog/tracer && tar -zxf datadog-dotnet-apm-2.49.0.tar.gz
```

This ensures that the Datadog tracer is properly installed and configured within your application container.

Below is a sample Dockerfile incorporating Datadog integration:

```dockerfile
# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the project file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the remaining source code
COPY . .

# Build the application
RUN dotnet publish -c Release -o out

# Stage 2: Create a runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy the build output from stage 1
COPY --from=build /app/out ./

# Datadog specific
RUN mkdir -p /datadog/tracer
RUN mkdir -p /home/LogFiles/dotnet

ADD https://github.com/DataDog/dd-trace-dotnet/releases/download/v2.49.0/datadog-dotnet-apm-2.49.0.tar.gz /datadog/tracer
RUN cd /datadog/tracer && tar -zxf datadog-dotnet-apm-2.49.0.tar.gz

# Set the entry point for the application
ENTRYPOINT ["dotnet", "<your dotnet app>.dll"]
```

You're now ready to build the image and push it to your preferred container registry, be it Azure Container Registry, Docker Hub, or a private registry.

## Create your Linux Web App

Create a new Linux Web App from the portal and choose the options for Container and Linux.

![Create web app]({{site.baseurl}}/media/2024/07/CreateWebApp.jpg)

On the Container tab, make sure that Sidecar support is Enabled.

Specify the details of your application image.

![Add Container]({{site.baseurl}}/media/2024/07/AddContainer.jpg)

Note: Typically, .NET uses port 8080 but you can change it in your project.

## Setup your Datadog

If you don’t have a Datadog account, you can create an instance of Datadog on the Azure portal by following this QuickStart.

[Create Datadog - Azure Native ISV Services](https://learn.microsoft.com/en-us/azure/partner-solutions/datadog/create)

Alternatively, you can also create a service account on Datadog by following the steps in this tutorial.

[Service Accounts (datadoghq.com)](https://docs.datadoghq.com/account_management/org_settings/service_accounts/)

Datadog offers a 14 days Free Trial if you would like to try out the service.

## AppSettings for the Datadog Integration

You need to set the following [AppSettings](https://learn.microsoft.com/en-us/azure/app-service/configure-common?tabs=portal).

- **DD_API_KEY** – If you have created the Datadog resource on the Azure portal, you can manage your API keys [like this](https://learn.microsoft.com/en-us/azure/partner-solutions/datadog/manage#api-keys).

    Alternatively, you can create your API Key by following the steps here [API and Application Keys](https://docs.datadoghq.com/account_management/api-app-keys/).

    We would encourage you to add sensitive information like API keys to Azure Key vault [Use Key Vault references - Azure App Service | Microsoft Learn](https://learn.microsoft.com).

- **DD_SITE** – Datadog offers you different sites for your data. You can use `us3.datadoghq.com` as this site is hosted in Azure. Therefore, the Observability data for your application stays in Azure. You can find more information about Datadog sites [here](https://docs.datadoghq.com/getting_started/site/).

- **DD_SERVICE**: The name of the service that would be displayed in your Datadog Service Catalog.
- **DD_ENV**: This is used to set the global environment, which allows you to differentiate data coming from various environments like staging or production.
- **DD_SERVERLESS_LOG_PATH**: This is the path where you write your application logs. Typically, this will be `/home/Logfile/*.log`, If you have changed the location for your application logs, you can specify that in this setting.
- **DD_DOTNET_TRACER_HOME**: `/datadog/tracer`
- **DD_TRACE_LOG_DIRECTORY**: `/home/Logfiles/dotnet`
- **CORECLR_ENABLE_PROFILING**: `1`
- **CORECLR_PROFILER**: `{846F5F1C-F9AE-4B07-969E-05C26BC060D8}`
- **CORECLR_PROFILER_PATH**: `/datadog/tracer/Datadog.Trace.ClrProfiler.Native.so`

To know more about these Datadog settings, you can refer to the [documentation](https://docs.datadoghq.com/serverless/azure_app_services/azure_app_services_container/?code-lang=dotnet).

## Add the Datadog Sidecar

Go to the Deployment Center for your application and add a sidecar container

![Sidecar-datadog]({{site.baseurl}}/media/2024/07/Sidecar-datadog.jpg)

```docker
Image Source: Docker Hub and other registries
Image type: Public
Registry server URL: svlsddagent.azurecr.io    
Image and tag: serverless-sidecar:latest
Port: 8126
```

### Disclaimer: Datadog Image Usage

It's important to note that the Datadog image used here is sourced directly from Datadog and is provided 'as-is.' Microsoft does not own or maintain this image. Therefore, its usage is subject to the terms of use outlined by Datadog, which can be found [here](https://www.datadoghq.com/legal/terms/).

## Visualizing Your Observability Data in Datadog

You are all set! You can now see your Observability data flow to Datadog backend. Take a look at the Azure serverless page for a complete view of your App Services.

![datadog-serverless]({{site.baseurl}}/media/2024/07/datadog-serverless.jpg)

The Service Catalog gives you an overview of each service, such as the number of requests, latency, and more.

![Service Catalog]({{site.baseurl}}/media/2024/07/datadog-servicecatalog.png)

You can see your application logs by going to `Logs -> Explorer`

![Logs Explorer]({{site.baseurl}}/media/2024/07/datadog-logexplorer.png)

Your application traces will be under `APM->Traces->Explorer`

![Traces Explorer]({{site.baseurl}}/media/2024/07/datadog-traceexplorer.png)

To learn more about Datadog dashboards, you can refer to the [documentation](https://docs.datadoghq.com/dashboards/).

## Next steps

In this guide, we've explored the seamless integration of Datadog with your .NET custom container application hosted on Linux App Service. By leveraging the Sidecar Pattern and Datadog's powerful observability platform, you can now unlock actionable insights and enhance the monitoring capabilities of your applications.

It's important to note that Datadog, as an [Azure Native ISV Services](https://learn.microsoft.com/en-us/azure/partner-solutions/datadog/) partner, offers robust support for Azure services and environments. Our collaboration with Datadog is aimed at providing you with even closer and simplified integration experiences in the future.

Stay tuned for upcoming guides where we'll delve into integrating Datadog with code-based web applications and other language stacks like NodeJS and Python.
