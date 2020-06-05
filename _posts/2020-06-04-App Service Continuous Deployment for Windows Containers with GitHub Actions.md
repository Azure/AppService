---
title: "Continuous Deployment for Windows Containers with GitHub Actions"
author_name: "Jeff Martinez"
toc: true
toc_sticky: true
tags:
    - dotnet
    - windows containers
---

Github Actions enables you to easily automate any part of your development workflow. GitHub Actions are defined as YAML files in the `.github/workflows` directory of your repository. The workflows are triggered by an event, such as a push to a specific branch, a comment on a Pull Request, or on a CRON schedule.

In this article, we will use GitHub Actions for Azure to deploy a Windows Container application to App Service. The sample application is already configured to be used in a Windows Container app, pushed to a registry, and deployed to App Service. Of course, you can use this guide to add the correct deployment tasks to work with your own applications.

## Sample Application

> If you would like to get started with your own application, you can skip to the next section.

The sample application is a simple task-tracking app built with .NET Framework using Azure SQL for storage.  The project has a workflow file, *main.yaml*, that is set up for continuous deployment. You have your choice of using Azure Container Registry (ACR) or Docker Hub for your registry needs (the difference in syntax will be explained below).

Find the full repository samples for [.NET Framework](https://aka.ms/dotnetframeworkdeployment) and [.NET Core](https://aka.ms/dotnetcoredeployment) at these highlighted links.

1. Clone the repository
1. Add in the necessary GitHub secrets so actions knows where to connect to your Azure resources and committing your changes to the master branch will trigger the build.  

## Create Resources

Create the following resources. You will need information from each resource that will be used in the file and stored in your secrets. Create your choice of registry (Azure Container Registry or Docker Hub) first since you will need information from there before you can create your App Service.

1. Azure Container Registry or a Docker Hub container registry
1. App Service (Web App for Container)
1. Azure SQL Database (Optional)

## Create a Service Principal

Our workflow will use a Service Principal to authenticate with Azure when deploying the container to App Service. A service principal is an Active Directory Identity created for use with automation scenarios, such as GitHub Actions.

1. Run the following command in Azure CLI in powershell to get the credentials needed to run the login action.  The output of this command will be a collection of key value pairs that you'll need to add to your GitHub secrets.

    ```shell
    az ad sp create-for-rbac --name "<appservice-name>" --role contributor \
                                --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
                                --sdk-auth
    ```

1. Copy the output into your GitHub secrets to use as your `AZURE_CREDENTIALS` secret.

    ```json
      {
        "clientId": "<GUID>",
        "clientSecret": "<GUID>",
        "subscriptionId": "<GUID>",
        "tenantId": "<GUID>" 
      }
    ```

## Secure Secrets

Since we are using sensitive information that you don't want others to access, we will use GitHub secrets to protect our information. Create a secret by following the directions [here](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).  Add the github secrets variables below with your own secrets appropriate from each resource.  If you are not using Docker Hub, ignore the DOCKERHUB prefixed parameters and if you are not using ACR, ignore the REGISTRY prefixed variables. 

- `APP_NAME` = your web apps name
- `AZURE_CREDENTIALS` = your service principal output
- `IMAGE_NAME` = name of your image that will upload to your registry
- `REGISTRY_USERNAME` = your registry username
- `REGISTRY_PASSWORD` = your registry password
- `AZURE_SQL_CONNECTION_STRING` = database connection string
- `DATABASE_SERVER_NAME` = name of your server
- `DOCKERHUB_REGISTRY_NAME` = your docker hub registry name
- `DOCKERHUB_USERNAME` = your docker hub user name
- `DOCKERHUB_PASSWORD` = your docker hub password

## The Dockerfile

Before we can start on our GitHub Action workflow, we also need to make sure our dockerfile is in order.  The sample(s) below are setup to work with the sample app linked above. If you need to adjust your dockerfile or create your own, remember to test building it locally first or it will not work when you run the action. 

### .NET Framework

.NET Framework applications will work best with a multi-stage build.  This example copies over the necessary project files and packages before it creates the publish files for deployment to Azure.

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

### .NET Core

For .NET Core, the nano server base image must be "1809" to be compatible with what Azure currently supports.  Keep in mind this may change in the future.

```dockerfile
# Set the base image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-nanoserver-1809 AS base
WORKDIR /app
EXPOSE 80

# Add the sdk so you can run the dotnet restore and build commands
FROM mcr.microsoft.com/dotnet/core/sdk:3.1-nanoserver-1809 AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore "taskapp.csproj"
COPY . .
WORKDIR "/src"
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

## Create the GitHub Workflow

Now that we have our resources created, secrets secured, and dockerfile in order we can start building our workflow file for continuous deployment.  The workflow file is your yaml file that sits in your repository that contains a collection of actions that run when triggered.  Add the workflow file by going to the *Actions* tab in your repository and *Set up a workflow yourself*.</BR>

![ghactions]({{ site.baseurl }}/media/2020/06/githubactions_1.jpg)

After choosing this option, you'll have starter code that explains how basic GitHub Actions work.  If you are new to this I recommend you read the comments, but we won't be needing any of the starting code so you can remove it.  

### Add the worklfow trigger

The first thing we'll need to do in our file is specify the trigger that starts the workflow. For our example, we are simply triggering the build whenever there is a push into the master branch If you would like to change this behavior, there are [many other triggers](https://help.github.com/en/actions/reference/events-that-trigger-workflows) for Github Actions.  

```yaml
name: Build and Deploy Windows Container App to Azure App Service

# Trigger the build on commits into the master branch
on:
  push:
    branches:
      - master

# Starts jobs and sets the type of runner (Windows) they will run on
jobs:
  build-and-deploy-to-azure:
    runs-on: windows-latest

    steps:

    # Checks out repository so your workflow can access it
    - uses: actions/checkout@v1
```

### Log into your container registry

In order to access our registry we need to add our docker login action first.  We will use the same docker-login action to login to your choice of ACR or Docker Hub.  If logging into docker hub, you can get away with not using the login-server parameter.  If using ACR, you can  grab the server name, username, and password from the *Access Keys* tab in your Azure Container Registry Resource

You'll need the following secrets:

- REGISTRY_USERNAME or DOCKERHUB_USERNAME
- REGISTRY_PASSWORD or DOCKERHUB_PASSWORD

![ghactions]({{ site.baseurl }}/media/2020/06/githubactions_2.jpg)

#### Azure Container Registry

```yaml
# Use docker login to log into ACR 
- name: Docker login to ACR
  uses: azure/docker-login@v1
  with:
    login-server: ${{ secrets.REGISTRY_USERNAME }}.azurecr.io
    username: ${{ secrets.REGISTRY_USERNAME }}
    password: ${{ secrets.REGISTRY_PASSWORD }}
```

#### Docker Hub

```yaml
# Use docker login
- name: Docker Hub login
  uses: azure/docker-login@v1
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_PASSWORD }}
```

### Build and Push Image to Registry

Under the same action, run the following docker build & push commands to publish to your chosen registry.  The "${{ github.sha }}" in the tags place will add in the github commit id so you know where it came from. Remember that your "container-name" is also defined here.

You'll need the following secrets:

- REGISTRY_USERNAME or DOCKERHUB_REGISTRY_NAME
- IMAGE_NAME <br/>

#### Azure Container Registry

```yaml
# Build and push the image to Azure Container Registry
- name: Build and Push container to ACR
  run: |
    docker build --file=taskapp/taskapp/Dockerfile -t ${{ secrets.REGISTRY_USERNAME }}.azurecr.io/${{ secrets.IMAGE_NAME }}:${{ github.sha }} .
    docker push ${{ secrets.REGISTRY_USERNAME }}.azurecr.io/${{ secrets.IMAGE_NAME }}:${{ github.sha }}
```

#### Docker Hub

```yaml
# Build and push the image to Azure Container Registry
- name: Build and Push container to ACR
  run: |
    docker build --file=taskapp/taskapp/Dockerfile -t ${{ secrets.DOCKERHUB_REGISTRY_NAME }}/${{ secrets.IMAGE_NAME }}:${{ github.sha }} .
    docker push ${{ secrets.DOCKERHUB_REGISTRY_NAME }}/${{ secrets.IMAGE_NAME }}:${{ github.sha }} 
```

Now that you have your image pushed to your registry.  You can push the container to App Service.  If you haven't already created your App Service, now is the time to do so before you can proceed.  Just remember that Windows Containers deployment is only available on the Premium SKU App Service Plans.  Be mindful of the SKU capacity levels as you may need to scale up if your container is too large.

## Add Azure Authentication

In order to automate deployment to App Serivce and Azure SQL, you'll need to use the credentials of the output from adding a Service Principal to authenticate your App Service.  

You'll need the following secret:

- AZURE_CREDENTIALS

```yaml
- name: Azure Service Principal Authentication
  uses: azure/login@v1
  with:
      creds: ${{ secrets.AZURE_CREDENTIALS }}
```

## Deploy to Azure App Service

The final step to setting up the continuous deployment is to add the webapps container deploy action.  

You'll need the following secrets:

- APP_NAME
- REGISTRY_USERNAME
- IMAGE_NAME

### Azure Container Registry

```yaml
- name: Deploy Container to Azure App Service
  uses: azure/webapps-container-deploy@v1
  with:
    app-name: ${{ secrets.APP_NAME }}
    images: ${{ secrets.REGISTRY_USERNAME }}.azurecr.io/${{ secrets.IMAGE_NAME }}:${{ github.sha }}
```

### Docker Hub

```yaml
- name: Deploy Container to Azure App Service
  uses: azure/webapps-container-deploy@v1
  with:
    app-name: ${{ secrets.APP_NAME }}
    images: ${{ secrets.DOCKERHUB_REGISTRY_NAME }}/${{ secrets.IMAGE_NAME }}:${{ github.sha }}
```

## Deploy to Azure SQL Database (Optional)

Adding Azure SQL to the workflow is optional of course, as you might have other plans for storage.  To deploy your SQL database to Azure, you'll need to use a dacpac file or sql scripts and a connection string.  The connection string can be found in the overview page of your Azure SQL database and you can create your dacpac by extracting the data using something like SQL Server Object Explorer in Visual Studio.

You'll need the following secrets:

- DATABASE_SERVER_NAME
- AZURE_SQL_CONNECTION_STRING

![ghactions]({{ site.baseurl }}/media/2020/06/githubactions_5.jpg)

Both your server name and connection string are found in the Azure database resource in the portal.  Copy the connection string, make sure you password and User ID are correct, and paste into your GitHub secrets.

### Create a dacpac file in your project

As mentioned before, you'll need to use either a dacpac file or set of SQL scripts to deploy your database schema.  If you are using Visual Studio, it's easy to create and add the needed dacpac file to run the action.  

1. Connect your SQL Azure Database to Visual Studio
1. Right-click the data base and choose *Extract Data-tier application*
1. On the following window, choose the location at the same level of your github workflow file and click create. 

![ghactions]({{ site.baseurl }}/media/2020/06/githubactions_5.jpg)

```yaml
# Deploy a dacpac file to a pre-provisioned Azure SQL Server
- name: Azure SQL Deploy
  uses: Azure/sql-action@v1
  with:
    server-name: ${{ secrets.DATABASE_SERVER_NAME }}.database.windows.net
    connection-string: ${{ secrets.AZURE_SQL_CONNECTION_STRING }}
    dacpac-package: './data.dacpac' 
```

Your dacpac file should have been created and added to your project. The action finds your file under the dacpac-package parameter seen above.  

From here you are setup to continuously build your Windows Container application through github actions. Below you'll see the final result of the workflow yaml file.

-------------------------------------------------------------------------

The full template below:

```yaml
name: Build and Deploy Windows Container App to Azure App Service

# Trigger the build on commits into the master branch
on:
  push:
    branches:
      - master

# Starts jobs and sets the type of runner (Windows) they will run on
jobs:
  build-and-deploy-to-azure:
    runs-on: windows-latest
    
    steps:
      
    # Checks out repository so your workflow can access it
    - uses: actions/checkout@v1
    
    # Authenticate a Service Principal to deploy to your Web App
    - name: Azure Service Principal Authentication
      uses: azure/login@v1
      with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
               
    # Use docker login to log into ACR 
    - name: Docker login to ACR
      uses: azure/docker-login@v1
      with:
        login-server: ${{ secrets.REGISTRY_USERNAME }}.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
        
    # Build and push your image to Azure Container Registry 
    - name: Build and Push container to ACR
      run: |
        docker build --file=taskapp/taskapp/Dockerfile -t ${{ secrets.REGISTRY_USERNAME }}.azurecr.io/${{ secrets.IMAGE_NAME }}:${{ github.sha }} .
        docker push ${{ secrets.REGISTRY_USERNAME }}.azurecr.io/${{ secrets.IMAGE_NAME }}:${{ github.sha }}     
      
    # Deploy your container to App Service 
    - name: Deploy Container to Azure App Service
      uses: azure/webapps-container-deploy@v1
      with:
        app-name: ${{ secrets.APP_NAME }}
        images: ${{ secrets.REGISTRY_USERNAME }}.azurecr.io/${{ secrets.IMAGE_NAME }}:${{ github.sha }}
       
  # **** UNCOMMENT IF USING DOCKER HUB **** 
    # Use docker login
    #- name: Docker login to ACR
    #  uses: azure/docker-login@v1
    #  with:
    #    username: ${{ secrets.DOCKERHUB_USERNAME }}
    #    password: ${{ secrets.DOCKERHUB_PASSWORD }}

    # Build and push your image to Docker Hub
    #- name: Build and Push container to Docker Hub
    #  run: |
    #    docker build --file=taskapp/taskapp/Dockerfile -t ${{ secrets.DOCKERHUB_REGISTRY_NAME }}/${{ secrets.IMAGE_NAME }}:${{ github.sha }} .
    #    docker push ${{ secrets.DOCKERHUB_REGISTRY_NAME }}/${{ secrets.IMAGE_NAME }}:${{ github.sha }}  
  
    # Deploy your container to App Service
    #- name: Deploy Container to Azure App Service
    #  uses: azure/webapps-container-deploy@v1
    #  with:
    #    app-name: ${{ secrets.APP_NAME }}
    #    images: ${{ secrets.DOCKERHUB_REGISTRY_NAME }}/${{ secrets.IMAGE_NAME }}:${{ github.sha }}
  # *************************************** 

    # Deploy a dacpac file to your SQL server
    - name: Azure SQL Deploy
      uses: Azure/sql-action@v1
      with:
        server-name: ${{ secrets.DATABASE_SERVER_NAME }}.database.windows.net
        connection-string: ${{ secrets.AZURE_SQL_CONNECTION_STRING }}
        dacpac-package: './data.dacpac'
```

--------------------------------------------------

## Helpful Resources

- [GitHub Action Checkout](https://github.com/marketplace/actions/checkout)
- [Azure Login](https://github.com/marketplace/actions/azure-login)
- [Docker Login](https://github.com/marketplace/actions/docker-login)
- [Azure SQL Deploy](https://github.com/marketplace/actions/azure-sql-deploy)
- [Azure WebApp Container](https://github.com/marketplace/actions/azure-webapp-container)
