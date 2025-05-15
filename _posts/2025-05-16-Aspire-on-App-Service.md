---
title: "Getting Started with .NET Aspire on Azure App Service"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

We’re laying the groundwork to bring .NET Aspire to Azure App Service. While this is just the beginning, we wanted to give you an early preview of how to set up a basic Aspire application on App Service. 

In this first walkthrough, we’ll use the Aspire Starter template, which includes a simple frontend application that calls an API backend. Both of these will be deployed as container-based applications on Azure App Service.

This is an early step, and we’ll be adding more capabilities in the coming weeks—including support for integrating additional services and enabling the Aspire Dashboard experience on Azure. Stay tuned for further updates.

## Prerequisites

Before you get started, make sure you have the following tools installed and ready to use:

* **.NET 9 SDK**
  .NET Aspire requires .NET 9. You can download the latest .NET 9 SDK from the [.NET Download page](https://dotnet.microsoft.com/download/dotnet/9.0).

* **Visual Studio 2022**
  You’ll need the latest version of Visual Studio 2022 with the **ASP.NET and web development** workloads installed. You can get it from the [Visual Studio download page](https://visualstudio.microsoft.com/downloads/).

* **Azure Developer CLI (azd)**
  The Azure Developer CLI makes it easy to provision and deploy Azure resources. Follow the official instructions to install it for your platform:
  [Install Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)

* **Docker Desktop**
  .NET Aspire uses Docker containers to run supporting services. Make sure Docker Desktop is installed and running on your machine. You can download it from the [Docker Desktop download page](https://www.docker.com/products/docker-desktop/).

Make sure these tools are installed and available in your environment before moving on to the next steps.

## Preparing Your Environment

> ⚠️ **Note**
> The steps in this section rely on a temporary NuGet feed for daily builds. This will change once the .NET Aspire packages are published to [NuGet.org](https://www.nuget.org/). We’ll update this guidance when that happens.

### Create a Local `nuget.config` File

We are currently using daily builds of the Aspire packages. To set this up, create a `nuget.config` file in the root of your repository by running:

```bash
dotnet new nugetconfig
```

### Add the Aspire Feed to NuGet Config

Add the feed containing the latest Aspire packages:

```bash
dotnet nuget add source --name dotnet9 https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet9/nuget/v3/index.json
```

Next, add the following **package source mappings** to your `nuget.config` to ensure only relevant packages are resolved from this feed:

```xml
<packageSourceMapping>
  <packageSource key="dotnet9">
    <package pattern="Aspire.*" />
    <package pattern="Microsoft.Extensions.ServiceDiscovery*" />
    <package pattern="Microsoft.Extensions.Http.Resilience" />
  </packageSource>
</packageSourceMapping>
```

### Install the Latest Aspire Project Templates

You’ll need the latest Aspire project templates to scaffold your application. Install them by running:

```bash
dotnet new install Aspire.ProjectTemplates::*-* --force
```

> \[!NOTE]
> The `--force` flag ensures that the new templates override any older versions that may already exist on your system.

### Create a New Aspire Starter Project

You can now scaffold a starter Aspire application using the following command:

```bash
dotnet new aspire-starter
```

This creates a `.slnx` solution file and at least two project folders.

### Build and Run the Application

Make sure the NuGet feed you added is accessible—either globally or through the `nuget.config` in this folder—then build and run the project:

```bash
dotnet restore
dotnet build
```

Ensure that **Docker Desktop** is running, then start the application:

```bash
dotnet run --project "<directoryname>.AppHost"
```

You should now have a basic Aspire application running locally and ready for the next steps in deployment.

## Add Azure App Service Support to Your Project

Now that you have the basic Aspire project running locally, let’s add support to target Azure App Service.

### Add Required NuGet Packages

Open the solution in **Visual Studio** and locate the **AppHost** project. You’ll need to add the following NuGet packages to enable Azure resource integration:

1. Open the **Package Manager Console** in Visual Studio.

2. Navigate to the AppHost project directory by running:

   ```bash
   cd <YourProjectName>.AppHost
   ```

3. Add the required packages:

   ```bash
   dotnet add package Azure.Core
   dotnet add package Azure.ResourceManager.KeyVault
   dotnet add package --prerelease Aspire.Hosting.Azure.AppService
   ```

### Configure the AppHost for Azure App Service

Open `AppHost.cs` and locate the following line:

```csharp
var builder = DistributedApplication.CreateBuilder(args);
```

Right after that, add:

```csharp
builder.AddAzureAppServiceEnvironment("appsvc");
```

Next, locate the API service registration, which looks like this:

```csharp
var apiService = builder.AddProject<Projects.<YourApiProject>>("apiservice")
    .WithHttpHealthCheck("/health");
```

Update it to include external HTTP endpoints:

```csharp
var apiService = builder.AddProject<Projects.<YourApiProject>>("apiservice")
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints();
```

You can now **build** the project to ensure everything compiles correctly.

### Initialize Azure Deployment with azd

Open a terminal or command prompt, navigate to the **AppHost** project directory, and run:

```bash
azd init
```

This will prompt you for a **unique environment name**, which will be used to create an Azure resource group for your deployment.

Once initialization is complete, authenticate with your Azure account:

```bash
azd auth login
```

Follow the prompts to select your **Azure subscription** and **resource location**.

### Provision and Deploy with azd up

Finally, deploy your application and provision Azure resources by running:

```bash
azd up
```

This command will:

* Create the required **Azure Resource Group**.
* Provision an **App Service Plan** to host your API and frontend apps.
* Create an **Azure Container Registry**.
* Deploy both the **frontend** and **API** services to Azure App Service.

Once completed, you’ll have your .NET Aspire application running in Azure.

## Explore Your Deployed Application

Once the deployment completes, you can explore the resources created in your Azure subscription:

1. Go to the [Azure Portal](https://portal.azure.com).
2. Search for and open the **Resource Group** that matches the **environment name** you provided during `azd init`.

You will see multiple Azure resources in this group, including:

* App Service Plan
* Two App Service apps (frontend and API backend)
* Container Registry
* Supporting resources like Managed Identity

### View the Frontend Application

Locate the **App Service** resource that starts with `webfrontend-`. Open it and navigate to the **Browse** option in the App Service blade.

You should see the default **Aspire Starter app** running in Azure App Service.

### Test the API Endpoint

You can also directly call the API backend by navigating to:

```
https://<webfrontend-app-name>.azurewebsites.net/weather
```

This should return a list of dates with the weather forecast.

![Aspire page]({{site.baseurl}}/media/2025/05/aspire-page.jpg)


## What’s Next

This is just the beginning of our journey to enable .NET Aspire on Azure App Service. In this post, we walked through the early steps to deploy a basic Aspire application with a frontend and API backend running as container-based apps on App Service.

We’re actively working on adding more features, including deeper service integrations, improved deployment experiences, and support for the Aspire Dashboard. Stay tuned—there’s a lot more coming soon.


