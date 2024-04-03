---
title: "Continuous Deployment for Windows Containers with Azure Pipelines"
author_name: "Jeff Martinez"
toc: true
toc_sticky: true
tags:
    - dotnet
    - windows containers
---

Azure DevOps enables you to host, build, plan and test your code with complimentary workflows. Using Azure Pipelines as one of these workflows allows you to deploy your application with CI/CD that works with any platform and cloud.  A pipeline is defined as a YAML file in the root directory of your repository.

In this article, we will use Azure Pipelines to deploy a Windows container application to App Service from a Git repository in Azure DevOps.  It assumes you already have a .NET application with supporting dockerfile in Azure DevOps.

### Pre-requisites

1. An [Azure Container Registry](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-portal?tabs=azure-cli) 
2. App Service Web App (Windows container) resource
3. .NET application with dockerfile in Azure DevOps

### Add a Service Connection

Before you create your pipeline, you should first create your Service Connection since you will be asked to choose and verify your connection when creating your template. A Service Connection will allow you to connect to your registry of choice (ACR or Docker Hub) when using the task templates. When adding a new service connection, choose the **Docker Registry** option. The following form will ask you to choose Docker Hub or Azure Container Registry along with pertaining information.  This tutorial will use Azure Container Registry.  You can create a new Service Connection following the directions [here](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/service-endpoints?view=azure-devops&tabs=yaml#create-new).

### Create the pipeline

Once your repository is created with your .NET application and supporting dockerfile, you can create your pipeline following these steps.

1. Navigate to **Pipelines** on the left menu bar and click on the **Create pipeline** button
2. On the next screen, select **Azure Repos Git** as your repository option and select the repository where you code is
3. Under the Configure tab choose the **Starter Pipeline** option
4. Under the next Review tab, click the **Save** button

### Secure secrets

Since we are using sensitive information that you don’t want others to access, we will use variables to protect our information. Create a variable by following the directions [here](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch).

To add a Variable, you click the **Variables** button next to the *Save* button in the top-right of the editing view for your pipeline. Select the **New Variable** button and enter your information. Add the variables below with your own secrets appropriate from each resource.

- vmImageName: 'windows-latest'
- imageRepository: 'your-image-repo-name’
- dockerfilePath: '$(Build.SourcesDirectory)/path/to/Dockerfile'
- dockerRegistryServiceConnection: 'your-service-connection-number'

### Edit the pipeline

After your pipeline is created and saved, you will need to edit the pipeline to run the steps for building the container, pushing to a registry, and deploying the image to App Service.  To start, navigate to the **Pipelines** menu, choose your pipeline that you just created and click the **Edit** button.

**Build image and push to Azure Container Registry**

First, you need to add the docker task so you can build the image.  Add the following code and replace the Dockerfile: app/Dockerfile with the path to your Dockerfile.

```yaml
trigger:
 - main

 pool:
   vmImage: 'windows-latest' 

 variables:
   vmImageName: 'windows-latest'
   imageRepository: 'your-image-repo-name'
   dockerfilePath: '$(Build.SourcesDirectory)/path/to/Dockerfile'
   dockerRegistryServiceConnection: 'your-service-connection-number'

- stage: Build
  displayName: Build and push stage
  jobs:  
  - job: Build
    displayName: Build job
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

### Deploy to Azure App Service

Next, you’ll need to setup the deploy task.  This will require your subscription name, application name, and container registry.  Add a new stage to the yaml file by pasting the code below.

```yaml
- stage: Deploy
  displayName: Deploy to App Service
  jobs:
  - job: Deploy
    displayName: Deploy
    pool:
      vmImage: $(vmImageName)
    steps:
```

1. Next, navigate to the **Show assistant** tab in the upper right hand corner and find the **Azure App Service deploy** task and fill out the following form
    1. Connection type: Azure Resource Manager
    2. Azure subscription: your-subscription-name
    3. App Service type: Web App for Containers (Windows)
    4. App Service name: your-app-name
    5. Registry or Namespace: your-azure-container-registry-namespace
    6. Image: your-azure-container-registry-image-name

Once you have those filled out, click the **Add** button to add a task like below

```yaml
- task: AzureRmWebAppDeployment@4
  inputs:
    ConnectionType: 'AzureRM'
    azureSubscription: 'my-subscription-name'
    appType: 'webAppHyperVContainer'
    WebAppName: 'my-app-name'
    DockerNamespace: 'myregsitry.azurecr.io'
    DockerRepository: 'dotnetframework:12'
```

After you’ve added the task the pipeline is ready to run.  Click the **Validate and save** button and run the pipeline.  The pipeline will go through the steps to Build and push the Windows container image to Azure Container Registry and deploy the image to App Service.

See the below for the full yaml file:

```yaml
trigger:
 - main

 pool:
   vmImage: 'windows-latest' 

 variables:
   vmImageName: 'windows-latest'
   imageRepository: 'your-image-repo-name'
   dockerfilePath: '$(Build.SourcesDirectory)/path/to/Dockerfile'
   dockerRegistryServiceConnection: 'your-service-connection-number'

- stage: Build
  displayName: Build and push stage
  jobs:  
  - job: Build
    displayName: Build job
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

- stage: Deploy
  displayName: Deploy to App Service
  jobs:
  - job: Deploy
    displayName: Deploy
    pool:
      vmImage: $(vmImageName)
    steps:
    - task: AzureRmWebAppDeployment@4
		  inputs:
		    ConnectionType: 'AzureRM'
		    azureSubscription: 'my-subscription-name'
		    appType: 'webAppHyperVContainer'
		    WebAppName: 'my-app-name'
		    DockerNamespace: 'myregsitry.azurecr.io'
		    DockerRepository: 'dotnetframework:12'
```