---
title: "Powering Observability: Dynatrace Integration with Linux App Service via Sidecars"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

Observability has become crucial for modern applications. Integrating [Dynatrace](https://learn.microsoft.com/en-us/azure/partner-solutions/dynatrace/) with Linux App Service allows you to leverage Dynatrace's powerful monitoring capabilities. This guide walks you through the steps to integrate Dynatrace with your .NET custom container application hosted on Linux App Service using the [sidecar pattern](https://azure.github.io/AppService/2024/04/04/Public-Preview-Sidecars-Webjobs.html).

## Setting Up Your .NET Application

To get started, you'll need to containerize your .NET application. You can do the containerization by following this [tutorial](https://learn.microsoft.com/en-us/dotnet/core/docker/build-container?tabs=windows&pivots=dotnet-8-0).

Here's a sample Dockerfile that you can use:

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

# Set the entry point for the application
ENTRYPOINT ["dotnet", "<your dotnet app>.dll"]
```

You're now ready to build the image and push it to your preferred container registry, be it Azure Container Registry, Docker Hub, or a private registry.

## Create Your Linux Web App

Create a new Linux Web App from the Azure portal and choose the options for Container and Linux.

![Create web app]({{site.baseurl}}/media/2024/07/CreateWebApp.jpg)

On the Container tab, enable Sidecar support and specify your application image details.

![Add Container]({{site.baseurl}}/media/2024/07/AddContainer.jpg)

Note: Typically, .Net uses port 8080 but you can change it in your project.

## Setup Your Dynatrace Account

If you don’t have a Dynatrace account, you can create an instance of Dynatrace on the Azure portal by following this Marketplace [link](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/dynatrace.dynatrace_portal_integration?tab=PlansAndPrice).

You can choose the Free Trial plan to get a 30 days subscription.

![Dynatrace account]({{site.baseurl}}/media/2024/07/dynatrace-sub.png)

## AppSettings for Dynatrace Integration

You need to set the following [AppSettings](https://learn.microsoft.com/en-us/azure/app-service/configure-common?tabs=portal).

You can get more details about the Dynatrace related settings [here](https://docs.dynatrace.com/docs/setup-and-configuration/setup-on-cloud-platforms/microsoft-azure-services/azure-integrations/azure-functions/integrate-oneagent-on-azure-functions#prerequisites).

- **DT_TENANT** – The environment ID
- **DT_TENANTTOKEN** – Same as DT_API_TOKEN. This is the PaaS token for your environment.
- **DT_HOME** - /home/dynatrace
- **LD_PRELOAD** - /home/dynatrace/oneagent/agent/lib64/liboneagentproc.so
- **DT_LOGSTREAM** - stdout
- **DT_LOGLEVELCON** – INFO

We would encourage you to add sensitive information like DT_TENANTTOKEN to Azure Key vault [Use Key Vault references - Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references?tabs=azure-cli).

## Add the Dynatrace Sidecar

Go to the Deployment Center for your application and add a sidecar container:

![Sidecar-dynatrace]({{site.baseurl}}/media/2024/07/sidecar-dynatrace1.jpg)

```docker
Image Source: Docker Hub and other registries
Image type: Public
Registry server URL: your-dynatrace-registry-url
Image and tag: oneagent:latest
Port: 8443
```

Once you have added the sidecar, you would need to restart your website to see the data start flowing to the Dynatrace backend.

Please note that this is an experimental container image for Dynatrace. We will be updating this blog with a new image soon.

### Disclaimer: Dynatrace Image Usage

It's important to note that the Dynatrace image used here is sourced directly from Dynatrace and is provided 'as-is.' Microsoft does not own or maintain this image. Therefore, its usage is subject to the [terms of use](https://www.dynatrace.com/company/trust-center/customers/) outlined by Dynatrace.

## Visualizing Your Observability Data in Dynatrace

You are all set! You can now see your Observability data flow to Dynatrace backend.

The Hosts tab gives you metrics about the VM which is hosting the application.

![Hosts]({{site.baseurl}}/media/2024/07/dt1.jpg)

Dynatrace also has a Services view which lets you look at your application specific information like Response Time, Failed Requests and application traces.

![Services]({{site.baseurl}}/media/2024/07/dt2.jpg)

You can learn more about Dynatrace’s Observability capabilities by going through the [documentation](https://docs.dynatrace.com/docs/observe-and-explore).

## Next Steps

As you've seen, the Sidecar Pattern for Linux App Service opens a world of possibilities for integrating powerful tools like Dynatrace into your Linux App Service-hosted applications. With Dynatrace being an [Azure Native ISV Services](https://learn.microsoft.com/en-us/azure/partner-solutions/dynatrace/) partner, this integration marks just the beginning of a journey towards a closer and more simplified experience for Azure users.

This is just the start. We're committed to providing even more guidance and resources to help you seamlessly integrate Dynatrace with your code-based Linux web applications and other language stacks. Stay tuned for upcoming updates and tutorials as we continue to empower you to make the most of your Azure environment.

In the meantime, don't hesitate to explore further, experiment with different configurations, and leverage the full potential of observability with Dynatrace and Azure App Service.
