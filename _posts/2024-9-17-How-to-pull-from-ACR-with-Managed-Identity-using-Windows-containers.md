---
title: "How to pull from ACR with Managed Identity using Windows containers"
author_name: "Jeff Martinez"
toc: true
toc_sticky: true
tags:
    - dotnet
    - windows containers
---

Managed identities offer a way to secure communications between Azure resources without having to manage any credentials. The following are the steps to enable system-assigned identity when pulling from Azure Container Registry (ACR) with the use of a Windows container application.

### Prerequisites

1. [Azure CLI version](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) ≥ 6.XX to configure your resources. If you don't want to install the Azure CLI locally, you can use the [Azure Cloud Shell](https://learn.microsoft.com/en-us/azure/cloud-shell/get-started/classic?tabs=azurecli)
2. A containerized .NET web app published to Azure Container Registry

### Assign an identity to your app

Using the `az cli` commands below, assign the system-assigned identity to your application. You will need the following information:

1. Resource group name: <groupName>
2. Web app name: <appName>

```powershell
az webapp create --resource-group <groupName> --name <appName> --container-image-name myacr.azurecr.io/myimage:mytag --assign-identity [system] --acr-use-identity --acr-identity [system]
```

This command will return a json output that shows all your configuration settings. You will also notice the identity “type” is set to “SystemAssigned” in the returned output.

Now that the identity is assigned, we can grab the principal and registry Id's to use in creating the role assignment. Run the following commands to query and store the necessary Id's:

1. Principal identity Id

```powershell
Principal_Id=$(az webapp identity show -g <groupName> -p <planName> -n <appName> --query principalId --output tsv)
```

1. Registry resource Id

```powershell
Registry_Id=$(az acr show -g <groupName> -n <registryName> --query id --output tsv)
```

### Create role assignment

Once the Id's are queried and stored, you can create the role assignment to pull from ACR.

Run the following command to create the role assignment:

```powershell
az role assignment create --assignee <principalId> --scope <registry-resource-id> --role "AcrPull"
```

Once ran, the output will include a json of the identity parameters and their values. You can also check your enabled access in the Azure portal by going to the registry resource:

1. Navigate to the Access control (IAM) blade on the left side
2. Click on the Role assignments tab
3. Search for your app name used in the previous cli commands

You should see your app resource with a role of “AcrPull”. Now that this is set, you are ready to pull images from a container registry using System-assigned Managed Identity.
