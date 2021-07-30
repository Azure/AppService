---
title: "Quickstart: Intro to Bicep with Web App and DB"
author_name: "Jordan Selig"
toc: true
toc_sticky: true
tags:
    - Deployment
    - Bicep
---

Get started with [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/) by deploying an app to the cloud using a [Bicep](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/) file and [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli) in Cloud Shell. Because you use a free App Service tier, you incur no costs to complete this quickstart.

Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse. You can use Bicep instead of JSON to develop your Azure Resource Manager templates ([ARM templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview)). The JSON syntax to create an ARM template can be verbose and require complicated expressions. Bicep syntax reduces that complexity and improves the development experience. Bicep is a transparent abstraction over ARM template JSON and doesn't lose any of the JSON template capabilities. During deployment, the Bicep CLI transpiles a Bicep file into ARM template JSON.

## Prerequisites

If you don't have an [Azure subscription](https://docs.microsoft.com/en-us/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

In order to effectively create resources with Bicep, you will need to [install Bicep](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/install). The Bicep extension for [Visual Studio Code](https://code.visualstudio.com/) provides language support and resource autocompletion. The extension helps you create and validate Bicep files and is recommended for those that will continue to create resources using Bicep upon completing this quickstart.

## Review the template

The template used in this quickstart is shown below. It deploys an App Service plan, an App Service app on Linux, and a sample Node.js "Hello World" app from the [Azure Samples](https://github.com/Azure-Samples) repo.

```javascript
param webAppName string = uniqueString(resourceGroup().id) // Generate unique String for web app name
param sku string = 'P1V2' // The SKU of App Service Plan
param linuxFxVersion string = 'node|14-lts' // The runtime stack of web app
param location string = resourceGroup().location // Location for all resources
param repositoryUrl string = 'https://github.com/Azure-Samples/nodejs-docs-hello-world'
param branch string = 'master'

var appServicePlanName = toLower('AppServicePlan-${webAppName}')
var webSiteName = toLower('wapp-${webAppName}')

resource appServicePlan 'Microsoft.Web/serverfarms@2020-06-01' = {
  name: appServicePlanName
  location: location
  properties: {
    reserved: true
  }
  sku: {
    name: sku
  }
  kind: 'linux'
}

resource appService 'Microsoft.Web/sites@2020-06-01' = {
  name: webSiteName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: linuxFxVersion
    }
  }
}

resource srcControls 'Microsoft.Web/sites/sourcecontrols@2021-01-01' = {
  name: '${appService.name}/web'
  properties: {
    repoUrl: repositoryUrl
    branch: branch
    isManualIntegration: true
  }
}
```

Three Azure resources are defined in the template:

* [**Microsoft.Web/serverfarms**](https://docs.microsoft.com/en-us/azure/templates/microsoft.web/2020-06-01/serverfarms?tabs=bicep): create an App Service plan.
* [**Microsoft.Web/sites**](https://docs.microsoft.com/en-us/azure/templates/microsoft.web/sites?tabs=bicep): create an App Service app.
* [**Microsoft.Web/sites/sourcecontrols**](https://docs.microsoft.com/en-us/azure/templates/microsoft.web/sourcecontrols?tabs=bicep): create an external git deployment configuration.

This template contains several parameters that are predefined for your convenience. See the table below for parameter defaults and their descriptions:

| Parameters | Type    | Default value                | Description |
|------------|---------|------------------------------|-------------|
| webAppName | string  | "webApp-**`<uniqueString>`**" | App name |
| location   | string  | "resourceGroup().location" | App region |
| sku        | string  | "P1V2"                         | Instance size  |
| linuxFxVersion   | string  | "NODE&#124;14-LTS"       | A two-part string defining the runtime and version: "language&#124;Version" |
| repositoryUrl    | string  | "https://github.com/Azure-Samples/nodejs-docs-hello-world"    | External Git repo (optional) |
| branch    | string  | "master"    | Default branch for code sample |

---

## Deploy the template

Copy and paste the template to your preferred editor/IDE and save the file to your local working directory.

Azure CLI is used here to deploy the template. You can also use the Azure portal, Azure PowerShell, or REST API. To learn other deployment methods, see [Bicep Deployment Commands](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-cli).

The following code creates a resource group, an App Service plan, and a web app. A default resource group, App Service plan, and location have been set for you. Replace `<app-name>` with a globally unique app name (valid characters are `a-z`, `0-9`, and `-`).

Open up a terminal where the Azure CLI has been installed and run the code below to create a Node.js app on Linux.

```bash
az group create --name myResourceGroup --location "southcentralus" &&
az deployment group create --resource-group myResourceGroup --template-file <path-to-template>
```

To deploy a different language stack, update `linuxFxVersion` with appropriate values. Samples are shown below. To show current versions, run the following command in the Cloud Shell: `az webapp config show --resource-group myResourceGroup --name <app-name> --query linuxFxVersion`

| Language    | Example                                              |
|-------------|------------------------------------------------------|
| **.NET**    | linuxFxVersion="DOTNETCORE&#124;3.0"                 |
| **PHP**     | linuxFxVersion="PHP&#124;7.4"                        |
| **Node.js** | linuxFxVersion="NODE&#124;10.15"                     |
| **Java**    | linuxFxVersion="JAVA&#124;1.8&#124;TOMCAT&#124;9.0"  |
| **Python**  | linuxFxVersion="PYTHON&#124;3.7"                     |
| **Ruby**    | linuxFxVersion="RUBY&#124;2.6"                       |

---

## Validate the deployment

Browse to `http://<app_name>.azurewebsites.net/` and verify it's been created.

## Clean up resources

When no longer needed, [delete the resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-cli).

## Optional additional sample apps

If you would like to continue learning about Bicep and App Service, below are additional samples you can review and deploy following the same process described above. Note that if you did not already delete the previously created resources, updating your existing template and redeploying will update the current app. Optionally, you can start from scratch and create new resources for the next part of this quickstart.

### Webapp with CosmosDB

```javascript
@description('Application Name')
@maxLength(30)
param applicationName string = 'to-do-app${uniqueString(resourceGroup().id)}'

@description('Location for all resources.')
param location string = resourceGroup().location

@description('App Service Plan\'s pricing tier. Details at https://azure.microsoft.com/en-us/pricing/details/app-service/')
param appServicePlanTier string = 'P1V2'

@minValue(1)
@maxValue(3)
@description('App Service Plan\'s instance count')
param appServicePlanInstances int = 1

@description('The URL for the GitHub repository that contains the project to deploy.')
param repositoryUrl string = 'https://github.com/Azure-Samples/cosmos-dotnet-core-todo-app.git'

@description('The branch of the GitHub repository to use.')
param branch string = 'main'

@description('The Cosmos DB database name.')
param databaseName string = 'Tasks'

@description('The Cosmos DB container name.')
param containerName string = 'Items'

var cosmosAccountName = toLower(applicationName)
var websiteName = applicationName
var appServicePlanName = applicationName

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
  name: cosmosAccountName
  kind: 'GlobalDocumentDB'
  location: location
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2021-01-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanTier
    capacity: appServicePlanInstances
  }
  kind: 'linux'
}

resource appService 'Microsoft.Web/sites@2021-01-01' = {
  name: websiteName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      http20Enabled: true

      appSettings: [
        {
          name: 'CosmosDb:Account'
          value: cosmosAccount.properties.documentEndpoint
        }
        {
          name: 'CosmosDb:Key'
          value: listKeys(cosmosAccount.id, cosmosAccount.apiVersion).primaryMasterKey
        }
        {
          name: 'CosmosDb:DatabaseName'
          value: databaseName
        }
        {
          name: 'CosmosDb:ContainerName'
          value: containerName
        }
      ]
    }
  }
}

resource srcControls 'Microsoft.Web/sites/sourcecontrols@2021-01-01' = {
  name: '${appService.name}/web'
  properties: {
    repoUrl: repositoryUrl
    branch: branch
    isManualIntegration: true
  }
}
```

This app uses Microsoft Azure Cosmos DB service to store and access data from an ASP.NET Core MVC application hosted on Azure App Service. More details for this app can be found [here](https://github.com/Azure-Samples/cosmos-dotnet-core-todo-app). Most of the parameters and resources are the same, but you now additionally have resources for the Cosmos DB account and you set the app settings as part of the "sites" (web app) resource.

### Webapp with custom DNS name with a TLS/SSL binding

If you would like to continue with this app by adding a SSL binding and a custom domain, the sample bicep files will be given below. Please note that you will need to purchase a custom domain and input the relevant info into the dnsZone parameter of the template. For more information about custom domains and SSL bindings, please see [Secure a custom DNS name with a TLS/SSL binding in Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-bindings).

In order to complete this sample, you will need to modify the above file or create a new Bicep file as well as create an additional Bicep file in the same directory for sni enablement. This is due to an ARM limitation that forbids using resources with this same type-name combination twice in one deployment.

Create another bicep file named `sni-enable.bicep` in the same directory with the contents below.

```javascript
param webAppName string
param webAppHostname string
param certificateThumbprint string

resource webAppCustomHostEnable 'Microsoft.Web/sites/hostNameBindings@2020-06-01' = {
  name: '${webAppName}/${webAppHostname}'
  properties: {
    sslState: 'SniEnabled'
    thumbprint: certificateThumbprint
  }
}
```

The following highlight the changes to the `webapp-cosmosdb` file for reference. Making these updates to your existing file will update your existing deployment if you did not already delete your app.

1. Add a parameter for dnsZone where you input your custom domain (i.e. "customdomain.com")
1. Add a [**Microsoft.Network/dnsZones/TXT**](https://docs.microsoft.com/en-us/azure/templates/microsoft.network/dnszones/txt?tabs=bicep) resource
1. Add a [**Microsoft.Network/dnsZones/CNAME**](https://docs.microsoft.com/en-us/azure/templates/microsoft.network/dnszones/cname?tabs=bicep) resource
1. Add a [**Microsoft.Web/sites/hostNameBindings**](https://docs.microsoft.com/en-us/azure/templates/microsoft.web/2019-08-01/sites/hostnamebindings?tabs=bicep) resource
1. Add a [**Microsoft.Web/certificates**](https://docs.microsoft.com/en-us/azure/templates/microsoft.web/2020-12-01/certificates?tabs=bicep) resource
1. Chain the sni-enable module you created earlier

The file should end up like the below.

```javascript
@description('Application Name')
@maxLength(30)
param applicationName string = 'to-do-app${uniqueString(resourceGroup().id)}'

@description('Location for all resources.')
param location string = resourceGroup().location

@description('App Service Plan\'s pricing tier. Details at https://azure.microsoft.com/en-us/pricing/details/app-service/')
param appServicePlanTier string = 'P1V2'

@minValue(1)
@maxValue(3)
@description('App Service Plan\'s instance count')
param appServicePlanInstances int = 1

@description('The URL for the GitHub repository that contains the project to deploy.')
param repositoryUrl string = 'https://github.com/Azure-Samples/cosmos-dotnet-core-todo-app.git'

@description('The branch of the GitHub repository to use.')
param branch string = 'main'

@description('Existing Azure DNS zone in target resource group')
param dnsZone string = '<YOUR CUSTOM DOMAIN i.e. "customdomain.com">'

@description('The Cosmos DB database name.')
param databaseName string = 'Tasks'

@description('The Cosmos DB container name.')
param containerName string = 'Items'

var cosmosAccountName = toLower(applicationName)
var websiteName = applicationName
var appServicePlanName = applicationName

resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
  name: cosmosAccountName
  kind: 'GlobalDocumentDB'
  location: location
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2021-01-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanTier
    capacity: appServicePlanInstances
  }
  kind: 'linux'
}

resource appService 'Microsoft.Web/sites@2021-01-01' = {
  name: websiteName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      http20Enabled: true
      
      appSettings: [
        {
          name: 'CosmosDb:Account'
          value: cosmosAccount.properties.documentEndpoint
        }
        {
          name: 'CosmosDb:Key'
          value: listKeys(cosmosAccount.id, cosmosAccount.apiVersion).primaryMasterKey
        }
        {
          name: 'CosmosDb:DatabaseName'
          value: databaseName
        }
        {
          name: 'CosmosDb:ContainerName'
          value: containerName
        }
      ]
    }
  }
}

resource srcControls 'Microsoft.Web/sites/sourcecontrols@2021-01-01' = {
  name: '${appService.name}/web'
  properties: {
    repoUrl: repositoryUrl
    branch: branch
    isManualIntegration: true
  }
}

resource dnsTxt 'Microsoft.Network/dnsZones/TXT@2018-05-01' = {
  name: '${dnsZone}/asuid.${applicationName}'
  properties: {
    TTL: 3600
    TXTRecords: [
      {
        value: [
          '${appService.properties.customDomainVerificationId}'
        ]
      }
    ]
  }
}

resource dnsCname 'Microsoft.Network/dnsZones/CNAME@2018-05-01' = {
  name: '${dnsZone}/${applicationName}'
  properties: {
    TTL: 3600
    CNAMERecord: {
      cname: '${appService.name}.azurewebsites.net'
    }
  }
}

// Enabling Managed certificate for a webapp requires 3 steps
// 1. Add custom domain to webapp with SSL in disabled state
// 2. Generate certificate for the domain
// 3. enable SSL

// The last step requires deploying again Microsoft.Web/sites/hostNameBindings - and ARM template forbids this in one deplyment, therefore we need to use modules to chain this.

resource webAppCustomHost 'Microsoft.Web/sites/hostNameBindings@2020-06-01' = {
  name: '${appService.name}/${applicationName}.${dnsZone}'
  dependsOn: [
    dnsTxt
    dnsCname
  ]
  properties: {
    hostNameType: 'Verified'
    sslState: 'Disabled'
    customHostNameDnsRecordType: 'CName'
    siteName: appService.name
  }
}

resource webAppCustomHostCertificate 'Microsoft.Web/certificates@2020-06-01' = {
  name: '${applicationName}.${dnsZone}'
  // name: dnsZone
  location: location
  dependsOn: [
    webAppCustomHost
  ]
  properties: any({
    serverFarmId: appServicePlan.id
    canonicalName: '${applicationName}.${dnsZone}'
  })
}

// we need to use a module to enable sni, as ARM forbids using resource with this same type-name combination twice in one deployment.
module webAppCustomHostEnable './sni-enable.bicep' = {
  name: '${deployment().name}-${applicationName}-sni-enable'
  params: {
    webAppName: appService.name
    webAppHostname: '${webAppCustomHostCertificate.name}'
    certificateThumbprint: webAppCustomHostCertificate.properties.thumbprint
  }
}
```

## Clean up resources

As before, when no longer needed, [delete the resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-cli) to prevent incurring any additional costs.
