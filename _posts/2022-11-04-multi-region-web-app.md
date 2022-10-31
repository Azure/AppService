---
title: "How to deploy a highly available multi-region web app"
author_name: "Jordan Selig"
category: networking
toc: true
---

High availability and fault tolerance are key components of a well-architected solution. It's always best to prepare for the unexpected and having an emergency plan that can shorten downtime and keep your systems up an running automatically when something fails can help you do that.

When you deploy your application to the cloud, you choose a region in that cloud where your application infrastructure is based. Regions are essentially data centers is various parts of the world. In a world where unpredictable severe weather events, natural disasters, or human errors are inevitable, there's the imminent possibility of events that may disturb the functionality of a region or take it down altogether for a period of time. If your application is deployed to a single region, and the region becomes unavailable, your application will also be unavailable. This may be unacceptable under the terms of your application's SLA. If so, deploying your application and its services across multiple regions is a good idea. A multi-region deployment can use an active-active or active-passive configuration. An active-active configuration distributes requests across multiple active regions. An active-passive configuration keeps warm instances in the secondary region, but doesn't send traffic there unless the primary region fails. For multi-region deployments, we recommend deploying to [paired regions](https://learn.microsoft.com/azure/availability-zones/cross-region-replication-azure#azure-cross-region-replication-pairings-for-all-geographies). For more information on this topic, see [Architect Azure applications for resiliency and availability](https://learn.microsoft.com/azure/architecture/reliability/architect).

In this blog post, we'll walk through deploying a highly available multi-region web app. We'll have a look at some of the different offerings Azure provides to enable this architecture as well as go over best practices and recommendations. We'll keep the scenario simple by restricting our application components to just a web app, but the info shared here can definitely be expanded and applied to many other infrastructure patterns. For example, if your application connects to an Azure database offering or storage account, a quick search through the Azure docs will reveal built-in solutions as [active geo-replication for SQL databases](https://learn.microsoft.com/azure/azure-sql/database/active-geo-replication-overview) and [redundancy options for storage accounts](https://learn.microsoft.com/azure/storage/common/storage-redundancy). For a reference architecture for a more detailed scenario, see [Highly available multi-region web application](https://learn.microsoft.com/azure/architecture/reference-architectures/app-service-web-app/multi-region).

## Architecture

![]({{ site.baseurl }}/media/2022/11/multi-region-app-service.png)

*Download a [Visio file]({{ site.baseurl }}/media/2022/11/multi-region-app-service.vsdx) of this architecture.*

### Workflow

The architecture is shown in the diagram above.

- **Primary and secondary regions**. This architecture uses two regions to achieve higher availability. The application is deployed to each region. During normal operations, network traffic is routed to the primary region. If the primary region becomes unavailable, traffic is routed to the secondary region.
- **Front Door**. [Front Door](https://learn.microsoft.com/azure/frontdoor/) routes incoming requests to the primary region. If the application running in that region becomes unavailable, Front Door fails over to the secondary region.

There are several general approaches to achieve high availability across regions. This reference focuses on active/passive with hot standby. It replicates the infrastructure in the secondary region, however traffic only goes to the primary region. If something happens in the primary region, traffic will automatically divert to the secondary region.

## Recommendations and considerations

Your requirements might differ from the architecture described here, however you can sse the recommendations and considerations in this section as a starting point as they apply to almost all multi-region scenarios. The considerations come from the [Microsoft Azure Well-Architected Framework](https://learn.microsoft.com/azure/architecture/framework/), which is a set of guiding tenets that can be used to improve the quality of a workload.

### Regional pairing

Deciding on your primary region is relatively straightforward - pick the region that supports the features your using and is closest to you/your customers to reduce latency. When deciding on your secondary region, consider using the [region Azure paired with your primary](https://learn.microsoft.com/azure/availability-zones/cross-region-replication-azure#azure-cross-region-replication-pairings-for-all-geographies).

### Resource groups

Consider placing the primary region, secondary region, and Front Door into separate [resource groups](https://learn.microsoft.com/azure/azure-resource-manager/management/overview#resource-groups). This lets you manage the resources deployed to each region as a single collection.

### Front Door configuration

- **Routing**. Front Door supports several [routing mechanisms](https://learn.microsoft.com/azure/frontdoor/routing-methods#priority-based-traffic-routing). We will be using *priority* routing in the scenario here as described in the workflow. Other routing mechanisms can direct traffic based on pre-defined weighting or lowest latency. Consider cost when choosing a routing mechanism because for example if you decide to use priority routing, you can scale down your application in your secondary region and only scale up when traffic is directed to it.
- **Tier**. Azure Front Door is offered in a variety of flavors including the Standard and Premium tiers as well as Azure Front Door (classic). For a comparison of the various tiers, see the [Front Door tier overview](https://learn.microsoft.com/azure/frontdoor/standard-premium/tier-comparison). We will be using the *standard* tier in the scenario here.
- **Load balancing options**. Azure provides multiple load balancing options to help direct traffic for your applications. Choosing the most appropriate one for your scenario can be based on a number of factors including traffic type, cost, features, and limitations. To help you decide, see the [Decision tree for load balancing in Azure](https://learn.microsoft.com/azure/architecture/guide/technology-choices/load-balancing-overview#decision-tree-for-load-balancing-in-azure). We will be using Azure Front Door for this scenario because we are deploying an internet facing web application (HTTP/HTTPS) deployed to multiple regions hosted on App Service.
- **Reliability**. Azure Front Door automatically fails over if the primary region becomes unavailable. When Front Door fails over, there is a period of time (usually about 20-60 seconds) when clients cannot reach the application. The duration is affected by the frequency of health probes and sample size configuration. For more information on Front Door reliability, see [Azure Front Door reliability](https://learn.microsoft.com/azure/architecture/reference-architectures/app-service-web-app/multi-region#azure-front-door).

### Deployment

Consider configuring a continuous deployment mechanism to manage your application source code as well as application infrastructure. Since you're deploying resources in different regions, you'll need to independently manage those resources. To ensure the resources are in sync and assuming you want essentially identical applications and infrastructures in each region, infrastructure as code such as [Azure Resource Manager templates](https://azure.microsoft.com/get-started/azure-portal/resource-manager/) or [Terraform](https://learn.microsoft.com/azure/developer/terraform/overview) should be used with deployment pipelines such as [Azure DevOps pipelines](https://learn.microsoft.com/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops) or [GitHub Actions](https://docs.github.com/actions). This way, if configured appropriately, any change to resources or source code would trigger updates across all regions you're deployed to. See [Continuous deployment to Azure App Service](https://learn.microsoft.com/azure/app-service/deploy-continuous-deployment) for recommendations on how to manage your source code.

### Security

For this scenario, you'll want to ensure [the only principal that can access your applications is Front Door](https://learn.microsoft.com/azure/frontdoor/origin-security?tabs=app-service-functions&pivots=front-door-standard-premium). Front Door's features work best when traffic only flows through Front Door. You should configure your origin to block traffic that hasn't been sent through Front Door. Otherwise, traffic might bypass Front Door's web application firewall, DDoS protection, and other security features. We'll configure this as part of the tutorial later on in this post.

Additionally, for scenarios using App Services, consider [locking down the SCM/advanced tools site](https://learn.microsoft.com/azure/app-service/app-service-ip-restrictions#restrict-access-to-an-scm-site) as this site will not likely need to be reached through Front Door.

### Cost optimization

Choose the Azure Front Door tier that meets your data transfer, routing, and security requirements. See the [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/) for more details.

Additionally, if you're using an active/passive multi-region deployment, consider scaling down your App Services in the secondary region and configuring autoscale rules to handle the traffic when traffic is re-directed there. For more details, see the [App Service scaling docs](https://learn.microsoft.com/azure/app-service/manage-scale-up).

## Tutorial

In this tutorial, you'll deploy the scenario shown in the [workflow](#workflow) which includes two web apps behind Azure Front Door with access restrictions that only give Front Door direct access to the apps. We'll use the Azure CLI to create the initial web apps and we'll use the portal to create the Azure Front Door profile.

### Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

### Create two instances of a web app

You'll need two instances of a web app that run in different Azure regions for this tutorial. We'll use the region pair East US/West US as our two regions and create two quick web apps. Feel free to choose you're own regions or use existing web apps if you already have some deployed.

I'm going to use a single resource group for all resources to make management and clean-up simpler, however consider using separate resource groups for each region as this will further isolate your resources.

Run the following command to create your resource group. Replace the placeholder for "resource-group-name".

```bash
az group create --name <resource-group-name> --location eastus
```

Run the following commands to create the App Service plans. Replace the placeholders for App Service plan name and resource group name.

```bash
az appservice plan create --name <app-service-plan-east-us> --resource-group <resource-group-name> --location eastus
az appservice plan create --name <app-service-plan-west-us> --resource-group <resource-group-name> --location westus
```

Once the App Service plans are created, run the following commands to create the web apps. Replace the placeholders and be sure to pay attention to the `--plan` parameter so that you place one app in each plan (and therefore region).

```bash
az webapp create --name <web-app-east-us> --resource-group <resource-group-name> --plan <app-service-plan-east-us>
az webapp create --name <web-app-west-us> --resource-group <resource-group-name> --plan <app-service-plan-west-us>
```

Make note of the default host name of each web app so you can define the backend addresses when you deploy the Front Door in the next step. It should be in the format `<web-app-name>.azurewebsites.net`. This can be found by running the following command or by navigating to the app's "Overview" page in the [Azure portal](https://portal.azure.com).

```bash
az webapp show --name <web-app-name> --resource-group <resource-group-name> --query "hostNames"
```

## Create Azure Front Door

I'm going to use the portal to create the Front Door since it will help us visualize the various components, however the [CLI or templates](https://learn.microsoft.com/azure/frontdoor/create-front-door-cli) can just as easily be used.

Front Door will be configured with priority routing where East US will be our primary region and West US will be the secondary. We'll use the standard tier which gives us the option to use a Web Application Firewall (WAF) policy for enhanced security.

1. From the home page or the Azure menu in the portal, select **+ Create a resource**. Search for Front Door and CDN profiles. Then select **Create**.
1. On the Compare offerings page, select **Custom create**. Then select **Continue** to create a Front Door.

    ![]({{ site.baseurl }}/media/2022/11/afd-create-1.png)

1. On the "Basics" tab, enter the following information:

    |Setting  |Description  |
    |---------|---------|
    |Subscription     |*select your subscription*         |
    |Resource group     |`<resource-group-name>`     |
    |Name     |`<unique-name>`         |
    |Tier     |Standard         |

1. In the "Endpoint" tab, select **Add an endpoint** and give your endpoint a globally unique name.
1. Next, select **+ Add a route** to configure routing to your Web App origin.
1. On the "Add a route" page, enter the following information and select **Add** to add the route to the endpoint configuration.

    ![]({{ site.baseurl }}/media/2022/11/afd-create-1.png)

    | Setting | Description |
    |--|--|
    | Name | Enter a name to identify the mapping between domains and origin group. |
    | Domains | A domain name has been auto-generated for you to use. If you want to add a custom domain, select **Add a new domain**. This example will use the default. |
    | Patterns to match | Set all the URLs this route will accept. This example will use the default, and accept all URL paths. |
    | Accepted protocols | Select the protocol the route will accept. This example will accept both HTTP and HTTPS requests. |
    | Redirect | Enable this setting to redirect all HTTP traffic to the HTTPS endpoint. |
    | Origin group | Select **Add a new origin group**. For the origin group name, enter **myOriginGroup**. Then select **+ Add an origin**. For the first origin (primary region), enter the name of one of the web apps you are using for this tutorial for the *Name* and then for the *Origin Type* select **App services**. In the *Host name*, select the hostname you queried/found in the portal earlier. Leave the rest of the default values the same. Select **Add** to add the origin to the origin group. Repeat the steps to add the second web app as an origin, however when adding the second origin, set the *Priority* to "2". This will direct all traffic to the other origin (primary region). Once both web app origins have been added, select **Add** to save the origin group configuration. |
    | Origin path | Leave blank. |
    | Forwarding protocol | Select the protocol that will be forwarded to the origin group. This example will match the incoming requests to origins. |
    | Caching | Select the check box if you want to cache contents closer to your users globally using Azure Front Door's edge POPs and the Microsoft network. |
    | Rules | Once you've deployed the Azure Front Door profile, you can configure Rules to apply to your route. |

1. Select **+ Add a policy** to apply a Web Application Firewall (WAF) policy to one or more domains in the Azure Front Door profile.
1. On the **Add security policy** page, enter a name to identify this security policy. Then select domains you want to associate the policy with. For *WAF Policy*, you can select a previously created policy or select **Create New** to create a new policy. Select **Save** to add the security policy to the endpoint configuration.
1. Select **Review + Create**, and then **Create** to deploy the Azure Front Door profile. It will take a few minutes for configurations to be propagated to all edge locations.

### Restrict access to web apps to the Azure Front Door instance

Traffic from Azure Front Door to your application originates from a well known set of IP ranges defined in the AzureFrontDoor.Backend service tag. Using a service tag restriction rule, you can [restrict traffic to only originate from Azure Front Door](https://learn.microsoft.com/azure/frontdoor/origin-security).

Before setting up the App Service access restriction, take note of the *Front Door ID* which can be found on the "Overview" page for the Front Door instance in the essentials section. This will be needed to ensure traffic only originates from your specific Front Door instance by further filtering the incoming requests based on the unique http header that Azure Front Door sends.

For your first web app, navigate to the "Access restriction (preview)" page.

![]({{ site.baseurl }}/media/2022/11/web-app-access-restrictions-1.png)

For the *Main site* add the following rule. Insert the Front Door ID which you copied earlier under *X-Azure-FDID*.

![]({{ site.baseurl }}/media/2022/11/web-app-access-restrictions-2.png)

You can optionally [configure access restrictions to the SCM site](https://learn.microsoft.com/azure/app-service/app-service-ip-restrictions#restrict-access-to-an-scm-site) for the app. To do so, navigate to the *Advanced tool site* tab and add any needed rules such as only allowing traffic from your IP range.

Repeat these same steps for the other web app.

### Verify Azure Front Door

At this point, you've configured all the resources for this tutorial. To confirm access to your apps is restricted to Front Door, try navigating to your apps directly using their endpoints. If you are able to access them, review their access restrictions and ensure access is limited to only Front Door.

Now that a couple minutes have passed since the Front Door instance has been created, it should be ready and deployed globally. In a browser, enter the endpoint hostname for the Front Door. This endpoint can be found on the "Overview" page for your Front Door. If everything has been configured correctly, you should be hitting your app in your primary region.

You can test failover by stopping the app in your primary region and then navigating to your Front Door endpoint again. Note that there may be a delay between when the traffic will be directed to the second web app depending on your health check interval. You may need to refresh the page a couple times. Try stopping the second web app as well and you should see an error page. This proves it redirected to the secondary region. Deploy some apps to your web apps to test seeing different versions of an app when simulating fail-overs.

### Clean up resources

After you're done, you can remove all the items you created. Deleting a resource group also deletes its contents. If you don't intend to use this Azure Front Door, you should remove these resources to avoid unnecessary charges.

## Deploy from ARM/Bicep

All of the resources in this post can be deployed using an ARM/Bicep template. A sample template is shown below. To learn how to deploy ARM/Bicep templates, see [How to deploy resources with Bicep and Azure CLI](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-cli).

```yml
@description('The location into which regionally scoped resources should be deployed. Note that Front Door is a global resource.')
param location string = 'eastus'

@description('The location into which regionally scoped resources for the secondary should be deployed.')
param secondaryLocation string = 'westus'

@description('The name of the App Service application to create. This must be globally unique.')
param appName string = 'myapp-${uniqueString(resourceGroup().id)}'

@description('The name of the secondary App Service application to create. This must be globally unique.')
param secondaryAppName string = 'mysecondaryapp-${uniqueString(resourceGroup().id)}'

@description('The name of the SKU to use when creating the App Service plan.')
param appServicePlanSkuName string = 'S1'

@description('The number of worker instances of your App Service plan that should be provisioned.')
param appServicePlanCapacity int = 1

@description('The name of the Front Door endpoint to create. This must be globally unique.')
param frontDoorEndpointName string = 'afd-${uniqueString(resourceGroup().id)}'

@description('The name of the SKU to use when creating the Front Door profile.')
@allowed([
  'Standard_AzureFrontDoor'
  'Premium_AzureFrontDoor'
])
param frontDoorSkuName string = 'Standard_AzureFrontDoor'

@description('The IP range used to restrict access to the SCM/advanced tool site. Be sure to change this to your IP address.')
param ipRange string = '0.0.0.0/0'

var appServicePlanName = 'AppServicePlan'
var secondaryAppServicePlanName = 'SecondaryAppServicePlan'

var frontDoorProfileName = 'MyFrontDoor'
var frontDoorOriginGroupName = 'MyOriginGroup'
var frontDoorOriginName = 'MyAppServiceOrigin'
var secondaryFrontDoorOriginName = 'MySecondaryAppServiceOrigin'
var frontDoorRouteName = 'MyRoute'

resource frontDoorProfile 'Microsoft.Cdn/profiles@2021-06-01' = {
  name: frontDoorProfileName
  location: 'global'
  sku: {
    name: frontDoorSkuName
  }
}

resource appServicePlan 'Microsoft.Web/serverFarms@2020-06-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSkuName
    capacity: appServicePlanCapacity
  }
  kind: 'app'
}

resource secondaryAppServicePlan 'Microsoft.Web/serverFarms@2020-06-01' = {
  name: secondaryAppServicePlanName
  location: secondaryLocation
  sku: {
    name: appServicePlanSkuName
    capacity: appServicePlanCapacity
  }
  kind: 'app'
}

resource app 'Microsoft.Web/sites@2020-06-01' = {
  name: appName
  location: location
  kind: 'app'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      detailedErrorLoggingEnabled: true
      httpLoggingEnabled: true
      requestTracingEnabled: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      ipSecurityRestrictions: [
        {
          tag: 'ServiceTag'
          ipAddress: 'AzureFrontDoor.Backend'
          action: 'Allow'
          priority: 100
          headers: {
            'x-azure-fdid': [
              frontDoorProfile.properties.frontDoorId
            ]
          }
          name: 'Allow traffic from Front Door'
        }
      ]
      scmIpSecurityRestrictions: [
        {
          tag: 'Default'
          ipAddress: ipRange
          action: 'Allow'
          priority: 100
          name: 'myIp'
        }
        {
          ipAddress: 'Any'
          action: 'Deny'
          priority: 2147483647
          name: 'Deny all'
          description: 'Deny all access'
        }
      ]
    }
  }
}

resource secondaryApp 'Microsoft.Web/sites@2020-06-01' = {
  name: secondaryAppName
  location: secondaryLocation
  kind: 'app'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: secondaryAppServicePlan.id
    httpsOnly: true
    siteConfig: {
      detailedErrorLoggingEnabled: true
      httpLoggingEnabled: true
      requestTracingEnabled: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      ipSecurityRestrictions: [
        {
          tag: 'ServiceTag'
          ipAddress: 'AzureFrontDoor.Backend'
          action: 'Allow'
          priority: 100
          headers: {
            'x-azure-fdid': [
              frontDoorProfile.properties.frontDoorId
            ]
          }
          name: 'Allow traffic from Front Door'
        }
      ]
      scmIpSecurityRestrictions: [
        {
          tag: 'Default'
          ipAddress: ipRange
          action: 'Allow'
          priority: 100
          name: 'myIp'
        }
        {
          ipAddress: 'Any'
          action: 'Deny'
          priority: 2147483647
          name: 'Deny all'
          description: 'Deny all access'
        }
      ]
    }
  }
}

resource frontDoorEndpoint 'Microsoft.Cdn/profiles/afdEndpoints@2021-06-01' = {
  name: frontDoorEndpointName
  parent: frontDoorProfile
  location: 'global'
  properties: {
    enabledState: 'Enabled'
  }
}

resource frontDoorOriginGroup 'Microsoft.Cdn/profiles/originGroups@2021-06-01' = {
  name: frontDoorOriginGroupName
  parent: frontDoorProfile
  properties: {
    loadBalancingSettings: {
      sampleSize: 4
      successfulSamplesRequired: 3
    }
    healthProbeSettings: {
      probePath: '/'
      probeRequestType: 'HEAD'
      probeProtocol: 'Http'
      probeIntervalInSeconds: 100
    }
  }
}

resource frontDoorOrigin 'Microsoft.Cdn/profiles/originGroups/origins@2021-06-01' = {
  name: frontDoorOriginName
  parent: frontDoorOriginGroup
  properties: {
    hostName: app.properties.defaultHostName
    httpPort: 80
    httpsPort: 443
    originHostHeader: app.properties.defaultHostName
    priority: 1
    weight: 1000
  }
}

resource secondaryFrontDoorOrigin 'Microsoft.Cdn/profiles/originGroups/origins@2021-06-01' = {
  name: secondaryFrontDoorOriginName
  parent: frontDoorOriginGroup
  properties: {
    hostName: secondaryApp.properties.defaultHostName
    httpPort: 80
    httpsPort: 443
    originHostHeader: app.properties.defaultHostName
    priority: 2
    weight: 1000
  }
}

resource frontDoorRoute 'Microsoft.Cdn/profiles/afdEndpoints/routes@2021-06-01' = {
  name: frontDoorRouteName
  parent: frontDoorEndpoint
  dependsOn: [
    frontDoorOrigin // This explicit dependency is required to ensure that the origin group is not empty when the route is created.
  ]
  properties: {
    originGroup: {
      id: frontDoorOriginGroup.id
    }
    supportedProtocols: [
      'Http'
      'Https'
    ]
    patternsToMatch: [
      '/*'
    ]
    forwardingProtocol: 'HttpsOnly'
    linkToDefaultDomain: 'Enabled'
    httpsRedirect: 'Enabled'
  }
}

output appServiceHostName string = app.properties.defaultHostName
output secondaryAppServiceHostName string = secondaryApp.properties.defaultHostName
output frontDoorEndpointHostName string = frontDoorEndpoint.properties.hostName
```
