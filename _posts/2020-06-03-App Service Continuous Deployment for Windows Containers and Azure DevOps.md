---
title: "App Service Continuous Deployment for Windows Containers and Azure DevOps"
author_name: "Jeff Martinez"
tags:
    - dotnet
    - windows containers
---

Azure DevOps is a service that enables you to host, build, plan and test your code with complimentary workflows. Using Azure Pipelines as one of these workflows allows you to deploy your application with CI/CD that works with any platform and cloud.  

With Azure Pipelines, we can quickly enable container deployments with the built in Azure App Service deployment tasks available in the editing assistant.  You have your choice of deploying to either Windows or Linux, but today we'll be diving into Windows with the steps you need to properly deploy your application.  

We'll be using a sample application available to be used as a containerized Windows app, pushed to a registry, and deployed to App Service.  If you do not wish to use the sample application (linked below) you may use this guide to build and add the correct pipeline tasks to work with your own application.

## Overview
1. Create Resources
1. Add Service Connection
1. The Dockerfile
1. Create Azure DevOps Pipeline
1. Secure Secrets with Variables
1. Build the Pipeline

**The Sample Application** <br/>
The sample application is a simple task tracking app built with .NET Framework using Azure SQL for storage and added docker support.  The project is setup with a *azure-pipelines.yaml* file that is ready to work with your account.  You have your choice of using Azure Container Registry (ACR) or Docker Hub for your registry needs (the difference in syntax will be explained below). 

Find the full repository sample for [.NET Framework](https://github.com/jeffwmartinez/dotnet-framework-wc-actions) and [.NET Core](https://github.com/jeffwmartinez/dotnet-core-wc-actions) at these highlighted links. 

1. Clone the repository
1. Add in the necessary *variables* so the pipeline knows where to connect to your Azure resources and committing your changes to the master branch will trigger the build.  


If you'd like to get started with your own project repo that you already have in DevOps, you can follow the below directions to build your pipeline.  

</br>

## Create Resources
Before you can run your workflow you need to first have the right resources to deploy to.  You should create the below resources before you build since you will need information from each resource that will be used in the file and stored in your secrets.  Create your choice of registry (Azure Container Registry or Docker Hub) first since you will need information from there before you can create your App Service. If you are pushing the image to your registry for the first time, you may choose to create your App Service after you run the pipeline tasks to push to your registry.  

1. Azure Container Registry OR Docker Hub
2. App Service (Web App for Containers)
3. .NET Framework application w/ supporting dockerfile in an Azure DevOps repository
4. Azure SQL Database (Optional)
<br/>

## Add Service Connection
Before you create your pipeline, first create your Service Connection since you will be asked to choose and verify your connection when creating your template. A Service Connection will allow you to connect to your registry of choice (ACR or Docker Hub) when using the task templates. When adding a new service connection, choose the **Docker Registry** option.  The following form will ask you to choose Docker Hub or Azure Container Registry along with pertaining information.  Create a new Service Connection following the directions [here](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/service-endpoints?view=azure-devops&tabs=yaml#create-new).  

## The Dockerfile
You are most likely going to run into issues during the build and push step that are caused by your dockerfile.  Like most things, you should make sure your dockerfile can build locally first, then adjust your *COPY* and *WORKDIR* paths as needed when you push it up.  The sample application includes a dockerfile that builds all the packages for a .NET Framework application and adds them to the container.  


**.NET Framework** </br>
Your .NET Framework application will work best with a multi-stage build.  This example copies over the necessary project files and packages before it creates the publish files for deployment to Azure.  Adjust the SDK version in the base image to match your application.
```dockerfile
# Set the base image 
FROM mcr.microsoft.com/dotnet/framework/sdk:4.8 as build
WORKDIR "/src"

# Copy packages to your image and restore them
COPY taskapp/taskapp.sln .
COPY taskapp/taskapp/taskapp.csproj taskapp/taskapp/taskapp.csproj
COPY taskapp/taskapp/packages.config taskapp/taskapp/packages.config
RUN nuget restore taskapp/taskapp/packages.config -PackagesDirectory taskapp/packages

# Add files from source to the current directory and publish the deployment files to the folder profile
COPY . .
WORKDIR /src/taskapp/taskapp
RUN msbuild taskapp.csproj /p:Configuration=Release /m /p:DeployOnBuild=true /p:PublishProfile=FolderProfile

# Layer the production runtime image
FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8-windowsservercore-ltsc2019 as deploy

# Add the publish files into the right directory
WORKDIR /inetpub/wwwroot
COPY --from=build /src/taskapp/taskapp/bin/Release/Publish .
```

</br>

**.NET Core** </br>
 The nano server base image must be "1809" to be compatible with what Azure currently supports.
```dockerfile
# Set the base image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-nanoserver-1809 AS base
WORKDIR /app
EXPOSE 80

# Add the SDK so you can run the dotnet restore and build commands
FROM mcr.microsoft.com/dotnet/core/sdk:3.1-nanoserver-1809 AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore "taskapp.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "taskapp.csproj" -c Release -o /app/build

# Create the publish files
FROM build AS publish
RUN dotnet publish "taskapp.csproj" -c Release -o /app/publish

# Copy the publish files into the container
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "taskapp.dll"]

```
<br/>

## Create Azure DevOps Pipeline 
Once you have your repository created in Azure DevOps, or imported from GitHub you can create your pipeline.  On the left menu bar go to Pipelines and click on the **Create Pipeline** button.  The next screen will ask you where the code is to create the pipeline from.  We already have our code imported, so we can choose **Azure Repos Git** to select your current repository.

Since we are using Docker containers we can choose the **Docker** template that allows us to build and push an image to Azure Container Registry or Docker Hub.  

![ghactions]({{ site.baseurl }}/media/2020/06/devops_1.jpg)

Choose your *subscription* that you will be pushing your resources to, then pick your *Container registry* on the following screen.  You will notice your Image Name and Dockerfile are pre-populated with a suggested name and path to your Dockerfile.  You can leave those as is, and click on the **Validate and configure** button to generate your azure-pipeline.yaml file.


## Secure Secrets with Variables
The first thing you might notice when looking at your resources is the block of listed variables.  Some of these variables, we don't want to showcase to the world for security reasons so we can add these variables to a more secure location the repo.  

Add a variable by clicking the **Variables** button next to the Save button in the top-right of the editing view for your pipeline.  Select the **New Variable** button and enter your information.  Once your variable is made you can enter your declared variable as the value of the *ConnectionString* parameter.  To learn more about how variables work see [here]( https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch).

Before we move forward in adding the tasks, add in the following variables that will be needed in the coming tasks:

- imageRepository = 'your-image-name'
- containerRegistry = 'your-registry-name.azurecr.io' OR 'your-docker-hub-registry-name'
- applicationName = 'your-apps-name'
- azureSQLConnectionString = 'your-azure-database-connection-string' (Optional)
  

## Build the Pipeline
Once you have the necessary variables, you can start to add in the necessary tasks you need to complete your pipeline. Below is an explanation of the Docker tasks that were added to your pipeline from the Docker template with the addition of using Docker Hub instead of ACR.  The additional tasks to deploy to your App Service and optional Azure SQL follow.  

**Build and push your image to a registry** <br/>
After your pipeline is generated from choosing the Docker configured template, you'll notice a few things in the YAML build.  The first is the *trigger*, which determines what sets off the build.  We are using any push or change to master as a trigger here, but you can change it to trigger on another branch as well.
The resource is anything used by the pipeline that lives outside of it like a repository or container registry. You can leave this as self since we are using our own repository. Your image type is included and the build stages & task follow.  

```yaml
# The branch that triggers the pipeline to start building
trigger:
- master

# The source used by the pipeline
resources:
- repo: self

# Variables used in the Azure Container Registry deployment
variables:
  # Container registry service connection established during pipeline creation
  dockerRegistryServiceConnection: '<your-service-connection-number'
  dockerfilePath: '$(Build.SourcesDirectory)/taskapp/taskapp/Dockerfile'
  tag: '$(Build.BuildId)'
  
  # Agent VM image name
  vmImageName: 'windows-latest'

# Build stage to build your application and push it to a registry
stages:
- stage: Build
  displayName: Build and push stage
  jobs:  
  - job: Build
    displayName: Build
    pool:
      vmImage: $(vmImageName)
    steps:
    - task: Docker@2
      displayName: Build and push an image to container registry
      inputs:
        command: buildAndPush
        repository: $(imageRepository)
        dockerfile: $(dockerfilePath)
        containerRegistry: $(dockerRegistryServiceConnection)
        tags: |
          $(tag)
```

</br></br>

1. Double check that your vmImageName = 'windows-latest' as it might default to 'ubuntu-latest'.

1. Add the *buildContext* parameter below to make sure that necessary application files are being copied over to the image file system.  If you forget this line, you will run into an error noting it can't find the path inside of your dockerfile build.  

**Azure Container Registry**
```yaml
    - task: Docker@2
      displayName: Build and push an image to container registry
      inputs:
        command: buildAndPush
        repository: $(imageRepository)
        dockerfile: $(dockerfilePath)
        containerRegistry: $(dockerRegistryServiceConnection)
        buildContext: '.'
        tags: |
          $(tag)
```

</br>

**Docker Hub** <br/>
If you are using Docker Hub, your parameters will already have the buildContext added.  However, you may want to add the *tags* parameter at the end to keep track of which build was sent
```yaml
      - task: Docker@2
        displayName: Build and Push
        inputs:
          command: 'buildAndPush'
          repository: '$(containerRegistry)/$(imageRepository)'
          dockerfile: '$(Build.SourcesDirectory)/taskapp/taskapp/Dockerfile'
          containerRegistry: '$(dockerRegistryServiceConnection)'
          buildContext: '.'
            tags: |
              $(tag)

```
Now hit **Save** and **Run** to start the pipeline build.  Head over to the Azure portal, where your container registry is, and verify that your image repository name is in the registry repository.   
<br/>

**Setup the Deploy Stage** <br/>
Our first stage was pre-populated by the Docker task assistant as our Build stage.  We can break deployment process in half here by adding our Deploy stage.  This is done by using the first part of our yaml file and repurposing it to include our deployment tasks.  Add in the following code to define a second stage in your pipeline.

```yaml
# Deploy stage to your App Service and Azure SQL Database
- stage: Deploy
  displayName: Deploy to App Service and Azure SQL
  jobs:
  - job: Deploy
    displayName: Deploy
    pool:
      vmImage: $(vmImageName)
    steps:
```

<br/>

**Deploy to Azure App Service** <br/>
Now that you have your image pushed to your registry and your deploy stage setup.  You can push the container to App Service.  If you haven't already created your App Service in the Azure portal, you'll need to do so now before you can proceed.  

Once you have your App Service created in Azure, you can edit your pipeline to include the deployment to your App Service.  Click the assistant in the top right corner of the file and search for **Azure Web App for Containers**.  This task enables you to push a Windows or Linux container to your Azure App Service.  You can learn more about how the task works [here]( https://github.com/Microsoft/azure-pipelines-tasks/blob/master/Tasks/AzureWebAppContainerV1/README.md).

![ghactions]({{ site.baseurl }}/media/2020/06/devops_2.jpg)


Choose your subscription from the drop down menu and click the authorize button (Note: if authorize returns an error, you may need to add a Service Connection as stated before).  Now you can add your *App name*, which should be populated in the drop down, and *Image name*, which is in the format of  "<registryname>.azurecr.io/<imagename>:$(tag)".  Do not fill out the bottom two parameters Configuration File and Startup command.  These are not necessary for what is needed.


| Parameter        | Value           | 
| ------------- |:-------------:| 
| Azure subscription:     | your-subscription-name | 
| App name:      | your-app-name      |   
| Image name: | registryname.azurecr.io/imagename:$(tag)      |    
| Configuration File: | X      |    
| Startup command: | X      |    


The *registry name* information can be found in the Overview tab of you registry resource blade, and the *image name* can be found in the Repositories tab in the registry resource as well.  We are using the DevOps variable $(tag) so it builds with the latest buildId everytime the task is ran.

![ghactions]({{ site.baseurl }}/media/2020/06/devops_3.jpg)


Now you can save your edited pipeline and get the following output below.  You can test that it works by pushing up a change from your code and checking that your App Service will have an updated tag number in the *Container Settings* tab as well as your application changes in your deployed application. 

```yaml
    - task: AzureWebAppContainer@1
      inputs:
        azureSubscription: '<your-subscription-name>'
        appName: '$(applicationName)'
        containers: '$(containerRegistry)/$(imageRepository):$(tag)'
```
If you run into the following error during your build: *"This pipeline needs permissions to access a resource before this run can continue to Build and push stage"*. Click the **View** button on the error and **Permit** button on the following screen to allow the build to continue.
<br/>

## Deploy to an Azure SQL Database (Optional)
If you need to import a SQL database that you'd like to host on Azure, you have the option to add in the **Azure SQL Database deployment** task which can be found in the assistant we used earlier.  This task is used to deploy a SQL database to an existing Azure SQL Server using DACPAC files or SQL Server scripts.  More information on the task can be found [here]( https://github.com/microsoft/azure-pipelines-tasks/blob/master/Tasks/SqlAzureDacpacDeploymentV1/README.md).

**Creating the DACPAC file** <br/>
You'll need to use either a DACPAC or SQL script to deploy your database.  If you are using the provided sample, the data.dacpac file already in the repo so you don't need to create it.  If you are using Visual Studio, it's easy to create and add the dacpac file needed to run the action.  You'll first need to make sure your Azure SQL Database is connected via SQL Server Object Explorer.  Then, find and right-click your database to Extract Data-tier Application.  
This will allow you to choose the location of where your dacpac file is.  Make sure it is at the same level as your azure-pipeline.yaml file, give it a file name and create the file.  Once this is created, you are ready to proceed.

After creating your Dacpac file and choosing the task in the assistant and you will need to fill out all of the following parameters that match your database and deployment package information.


| Parameter        | Value           | 
| ------------- |:-------------:| 
| Azure Service Connection Type: | Azure Resource Manager | 
| Azure Subscription:      | your-subscription-name      |   
| **SQL Database** |       |    
| Authentication Type: | Connection String      |    
| Connection String: | your-connection-string      |   
| **Deployment Package** |       |  
| Deploy Type: | SQL DACPAC File     |  
| Action: |  Publish      |  
| DACPAC File: | $(Build.SourcesDirectory)/your-file-name.dacpac      |  
| Additional SQLPackage.exe Arguments: | X      |   

Once created with the above parameters, the output should show as below.

```yaml
    - task: SqlAzureDacpacDeployment@1
      inputs:
        azureSubscription: '<your-subscription-name>'
        AuthenticationType: 'connectionString'
        ConnectionString: '$(azureSQLConnectionString)'
        deployType: 'DacpacTask'
        DeploymentAction: 'Publish'
        DacpacFile: '$(Build.SourcesDirectory)/data.dacpac'
        IpDetectionMethod: 'AutoDetect'

```

</br>

**Connection String** <br/>
Our sample app has a dummy connection string in the web.config that will need to be changed for local testing or can be added into your application settings from your App Service as a *Connection String* setting in the *Configuration* tab.  All you need to do is make sure the connection string name in the web.config file matches the connection string name in your App Service setting, with the actual connection string added as the value in your settings.  For more information on how to do this see this [link](https://docs.microsoft.com/en-us/azure/app-service/configure-common).

When adding the values for the SQL Database parameters, you'll want to choose *Connection String* as your Authentication Type and add in your connection string.  We'll use Variables in DevOps to hide our connection string in safe keeping.


-----------------------------------------------------
The full template below:

```yaml
trigger:
- master

resources:
- repo: self

variables:
  # Container registry service connection established during pipeline creation
  dockerRegistryServiceConnection: '<your-registry-service-connection-number>'
  dockerfilePath: '$(Build.SourcesDirectory)/taskapp/taskapp/Dockerfile'
  tag: '$(Build.BuildId)'
  
  # Agent VM image name
  vmImageName: 'windows-latest'

# Build stage to build your application and push it to a registry
stages:
- stage: Build
  displayName: Build and push stage
  jobs:  
  - job: Build
    displayName: Build
    pool:
      vmImage: $(vmImageName)
    steps:

# Build and push Docker task to push to ACR
    - task: Docker@2
      displayName: Build and push an image to container registry
      inputs:
        command: buildAndPush
        repository: '$(imageRepository)'
        dockerfile: $(dockerfilePath)
        containerRegistry: '$(dockerRegistryServiceConnection)'
        buildContext: .
        tags: |
          $(tag)

# Deploy stage to your App Service and Azure SQL Database
- stage: Deploy
  displayName: Deploy to App Service and Azure SQL
  jobs:
  - job: Deploy
    displayName: Deploy
    pool:
      vmImage: $(vmImageName)
    steps:

# Deploy to Azure App Service 
    - task: AzureWebAppContainer@1
      inputs:
        azureSubscription: '<your-azure-subscription>'
        appName: '$(applicationName)'
        containers: '$(containerRegistry)/$(imageRepository):$(tag)'

# Deploy to Azure SQL
    - task: SqlAzureDacpacDeployment@1
      inputs:
        azureSubscription: '<your-azure-subscription>'
        AuthenticationType: 'connectionString'
        ConnectionString: '$(azureSQLConnectionString)'
        deployType: 'DacpacTask'
        DeploymentAction: 'Publish'
        DacpacFile: '$(Build.SourcesDirectory)/data.dacpac'
        IpDetectionMethod: 'AutoDetect'

```

</br></br>

## Helpful Resources:
- [GitHub Action Checkout](https://github.com/marketplace/actions/checkout)
- [Azure DevOps Overview](https://azure.microsoft.com/en-us/overview/what-is-devops/)
- [Azure Pipelines Docs](https://docs.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops)
- [Creating a Web App for Container](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-windows-container)
- [Creating an Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal)
