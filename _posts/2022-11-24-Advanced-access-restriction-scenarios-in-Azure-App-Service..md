---
title: "Advanced access restriction scenarios in Azure App Service"
author_name: "Błażej Miśkiewicz"
category: networking
toc: true
toc_sticky: true
excerpt: "Currently, you can use two options when configuring Azure App Service access restrictions. The preview feature provides some new scenarios that you should know."
---

## Introduction

Currently, you can use two options when configuring Azure App Service access restrictions. The preview feature provides some new scenarios that you should know.

This article will walk you through building a demo environment where you will test advanced access restriction scenarios in Azure App Service.

![Access restriction]({{site.baseurl}}/media/2022/11/access_restriction.png){: .align-center}

## Access restriction advanced scenarios:

1. Filter by http header
2. Multi-source rules
3. Block a single IP address
4. Restrict access to an SCM site

For more information about *App Service access restrictions*, visit [this page](https://learn.microsoft.com/azure/app-service/app-service-ip-restrictions)

**Requirements:**

Access to Azure Subscription

**Decide where you will execute commands**

The best option to walk through this guide and execute commands would be using Azure Cloud Shell with Bash environment. Azure Cloud Shell is an interactive, authenticated, browser-accessible shell for managing Azure resources. It provides the flexibility of choosing the shell experience that best suits the way you work, either Bash or PowerShell. For information on how to use Azure Cloud Shell, please visit this page [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview). You can also install Azure CLI on your machine. The Azure CLI is available to install in Windows, macOS and Linux environments. It can also be run in a Docker container and Azure Cloud Shell. For information on how to install
the Azure CLI, please visit this page [Azure Cli](https://docs.microsoft.com/cli/azure/install-azure-cli)

If you decide to use [Azure Cloud Shell](https://shell.azure.com), please use Bash environment.

## Getting Started

**Create folder for you data**

You can use the name below for your folder. You just need to replace *aredemo* with your environment name.

```bash
mkdir aredemo
cd aredemo
```

**Choosing the right subscription**

If you have many subscriptions you must select the subscription to which you want to deploy the resources.

Using this command you can find and copy the *SubscriptionId* on which you want to create resources for this scenario.

```bash
az account list -o table
```

Using this command you can set a subscription to be the current active subscription.

```bash
az account set -s YourSubscriptionID
```

You can find more information about *az account* command on this site [az account](https://docs.microsoft.com/cli/azure/account?view=azure-cli-latest).

**Prepare parameters**

When you construct your naming convention, identify the key pieces of information that you want to reflect in the resource names. Different information is relevant for different resource types. The following sites are useful when you construct resource names [Define your naming convention](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming) and [Recommended abbreviations for Azure resource types](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations)

You can use the names below. You just need to replace *ardemo* with your environment name and change *LocationRegion* parameter.

Please copy and paste your parameters to your shell.

```bash
LocationRegion=westeurope
ResourceGroupName=rg-ardemo
WebAppName=app-ardemo-prod-01
AppServicePlanName=asp-ardemo-linux-prod-01
VirtualNetworkName=vnet-ardemo-prod-westeurope-01
SubnetNameVnet=snet-ardemo-prod-westeurope-01
VnetPrefix=192.168.10.0/24
SubnetVnetPrefix=192.168.10.0/25
PrivateEndpointName=pep-ardemo-prod-01
PrivateEndpointConnectionName=con-pep-ardemo-prod-01
FDName=fd-ardemo-01
OriginGroup=origin-group-ardemo
OriginNamePrimary=primary
LogAnalyticsName=log-ardemo-01
ApplicationInsightsName=appi-ardemo-01
ApplicationInsightsWebTestName=WebsiteTest-$WebAppName
```

## Create basic infrastructure

**Create Resource Groups**

The demo environment will be organized using one resource group.

```bash
az group create -l $LocationRegion -n $ResourceGroupName
```

**Create virtual network with subnet for App Service Private Endpoint**

A virtual network will be required for *Azure App Service Private Endpoint*. This command will create a virtual network with a subnet.

```bash
az network vnet create -g $ResourceGroupName -n $VirtualNetworkName --address-prefix $VnetPrefix --subnet-name $SubnetNameVnet --subnet-prefix $SubnetVnetPrefix
```

**Create an App Service Plan**

An App Service plan defines a set of compute resources for a web app to run. 

For more information about *Azure App Service plan*, visit [this page](https://learn.microsoft.com/azure/app-service/overview-hosting-plans)

```bash
az appservice plan create -n $AppServicePlanName -g $ResourceGroupName --location $LocationRegion --sku P1V2 --is-linux --number-of-workers 1
```

**Create a Web App**

To create a PHP app in your *App Service plan* please use this command.

```bash
az webapp create -n $WebAppName -g $ResourceGroupName --plan $AppServicePlanName --runtime "PHP:8.0"
```

Create a variable with the URL of your website. You will use this variable later with *curl* command to check if your webapp is working correctly.

```bash
URLofYourWebsite=$(az webapp show --name $WebAppName --resource-group $ResourceGroupName --query defaultHostName -o tsv)
```

**Create index.php file for your website**

Sample code for your secondary website:

```bash
echo '<?php
 echo "Azure App Service access restrictions demo";
?>' > index.php
```

**Create zip file for primary website**

In the next step you will use *ZIP Deploy* to deploy the application. You need a ZIP utility for this. Fortunately, ZIP utility is pre-installed in Azure Cloud Shell.

```bash
zip YourWebSite.zip index.php
```

**Deploy sample app**

To deploy a sample application using *ZIP Deploy*, use this command:

```bash
az webapp deployment source config-zip --resource-group $ResourceGroupName  --name $WebAppName --src ./YourWebSite.zip
```

**Check if your app is running**

Use your browser or use *curl* command to check if your app is working correctly.

```bash
curl https://$URLofYourWebsite
```

**Create the Private Endpoint**

A private endpoint is a network interface that uses a private IP address from your virtual network. This network interface connects you privately and securely to a service that's powered by Azure Private Link. By enabling a private endpoint, you're bringing the service into your virtual network.

For more information about *private endpoint*, visit [this page](https://learn.microsoft.com/azure/private-link/private-endpoint-overview)

```bash
id=$(az webapp show --name $WebAppName --resource-group $ResourceGroupName --query '[id]' --output tsv)
az network private-endpoint create -n $PrivateEndpointName -g $ResourceGroupName --vnet-name $VirtualNetworkName --subnet $SubnetNameVnet --connection-name $PrivateEndpointConnectionName --private-connection-resource-id $id --group-id sites
```

Configure the private DNS zone

```bash
az network private-dns zone create --name privatelink.azurewebsites.net --resource-group $ResourceGroupName
az network private-dns link vnet create --name myDNSLink --resource-group $ResourceGroupName --registration-enabled false --virtual-network $VirtualNetworkName --zone-name privatelink.azurewebsites.net
az network private-endpoint dns-zone-group create --name myZoneGroup --resource-group $ResourceGroupName --endpoint-name $PrivateEndpointName --private-dns-zone privatelink.azurewebsites.net --zone-name privatelink.azurewebsites.net
```

**Check if your website is unavailable.**

After enabling private endpoint, the webapp should be unavailable from the Internet.

Use your browser or use *curl* command to check if your app is not available.

```bash
curl https://$URLofYourWebsite
```

The result should look similar to this.

![Forbidden]({{site.baseurl}}/media/2022/11/curl_site_403.png){: .align-center}

**Optional test**

You can create a VM in the same virtual network as the private endpoint for Azure App Service and run a network connection test using private IP address. The name of the Azure App Service, should resolve to a private IP address, you can check it using the *ping* or *nslookup* command. To check if the website is working properly by using the private IP address, please use *curl* command or a browser on a VM that you will deploy.

>**Remember** to use the standard App Service URL. Thanks to the integration with private DNS zone, the name will be translated into a private IP address.
> For more information about *Azure App Service private endpoint DNS*, visit [this page](https://learn.microsoft.com/azure/app-service/networking/private-endpoint#dns)

## First advanced scenario - Filter by http header

Currently, you can run Azure App Service with a private endpoint as well as allow traffic from the Internet to Azure App Service. Thanks to this, you can use, for example, Azure Front Door Standard SKU to make Azure App Service available from the Internet. Previously, when using a private endpoint for Azure App Service, it was required to use the Azure Front Door Premium SKU.

For more information about *Secure Origin with Private Link in Azure Front Door Premium*, visit [this page](https://learn.microsoft.com/azure/frontdoor/private-link)

In this guide you will add *rule* that will allow access from Azure Front Door Standard instance to your Azure App Service using *X-Azure-FDID*. 

>**Tip** In Access restriction you can use the following headers:
>1. X-Forwarded-Host - You can specify hostnames of the originating request to limit traffic if a load balancer or HTTP proxy supports hostname forwarding. Enter up to 8 hostnames separated by a comma.
>2. X-Forwarded-For - You can specify IP addresses of the originating client if a load balancer or HTTP proxy supports IP forwarding when the traffic is passing >through. Enter up to 8 CIDR addresses separated by a comma.
>3. X-Azure-FDID - You can specify a unique instance id of Azure Front Door or reverse proxies supporting unique header identification. Enter up to 8 ids >separated by a comma.
>4. X-FD-HealthProbe - You can specify health probe identification to allow probe traffic. Enter up to 8 health probe ids separated by a comma.


**Enable public access**

To allow traffic from the Internet please use this command.

```bash
az resource update --resource-group $ResourceGroupName --name $WebAppName --resource-type "Microsoft.Web/sites" --set properties.publicNetworkAccess=Enabled
```

You can also enable *Allow public access* from the GUI.

![Allow public access]({{site.baseurl}}/media/2022/11/access_restrictions_allow_public_access.png){: .align-center}

**Check if your website is available.**

After enabling public access, the webapp should be available from the Internet and from the private endpoint.

Use your browser or *curl* command to check if your app is working correctly.

```bash
curl https://$URLofYourWebsite
```

**Secure Access using Front Door Standard SKU**

Azure Front Door is Microsoft’s modern cloud Content Delivery Network (CDN) that provides fast, reliable, and secure access between your users and your applications’ static and dynamic web content across the globe. Azure Front Door delivers your content using the Microsoft’s global edge network with hundreds of global and local POPs distributed around the world close to both your enterprise and consumer end users.

For more information about *Azure Front Door*, visit [this page](https://learn.microsoft.com/azure/frontdoor/front-door-overview)

**Create Azure Front Door profile**

Run `az afd profile create` to create an Azure Front Door profile.

```bash
az afd profile create \
    --profile-name $FDName \
    --resource-group $ResourceGroupName \
    --sku Standard_AzureFrontDoor
```

**Add an endpoint**

Run `az afd endpoint create` to create an endpoint in your profile.

```bash
az afd endpoint create \
    --resource-group $ResourceGroupName \
    --endpoint-name endpoint-$FDName \
    --profile-name $FDName \
    --enabled-state Enabled
```

Create a variable with the URL of your Azure Front Door endpoint. You will use this variable later with the *curl* command to check if your Azure Front Door endpoint is working correctly.

```bash
URLofYourFrontDoorEndpoint=$(az afd endpoint show \
    --resource-group $ResourceGroupName \
    --profile-name $FDName \
    --endpoint-name endpoint-$FDName \
    --query hostName -o tsv)
```

You can also write down the URL of your Azure Front Door endpoint.

![URL of your site]({{site.baseurl}}/media/2022/10/url-front-door.png){: .align-center}

**Create an origin group**

Run `az afd origin-group create` to create an origin group that contains your web apps.

```bash
az afd origin-group create \
    --resource-group $ResourceGroupName \
    --origin-group-name $OriginGroup \
    --profile-name $FDName \
    --probe-request-type GET \
    --probe-protocol Https \
    --probe-interval-in-seconds 60 \
    --probe-path / \
    --sample-size 4 \
    --successful-samples-required 3 \
    --additional-latency-in-milliseconds 50
```

**Add an origin to the group - primary website**

Run `az afd origin create` to add an origin to your origin group.

```bash
az afd origin create \
    --resource-group $ResourceGroupName \
    --host-name $URLofYourWebsite \
    --profile-name $FDName \
    --origin-group-name $OriginGroup \
    --origin-name $OriginNamePrimary \
    --origin-host-header $URLofYourWebsite \
    --priority 1 \
    --weight 1000 \
    --enabled-state Enabled \
    --http-port 80 \
    --https-port 443
```

**Add a route**

Run `az afd route create` to map your endpoint to the origin group. This route forwards requests from the endpoint to your origin group.

```bash
az afd route create \
    --resource-group $ResourceGroupName  \
    --profile-name $FDName \
    --endpoint-name endpoint-$FDName \
    --forwarding-protocol MatchRequest \
    --route-name route \
    --https-redirect Enabled \
    --origin-group $OriginGroup \
    --supported-protocols Http Https \
    --link-to-default-domain Enabled
```

For more information about Azure CLI for Azure Front Door, visit [Front Door CLI](https://learn.microsoft.com/azure/frontdoor/create-front-door-cli).

In a production environment you will probably need to implement a WAF policy for you application. For more information about Azure CLI for Azure Front Door WAF Policy, visit [Front Door WAF Policy](https://learn.microsoft.com/azure/frontdoor/create-front-door-cli#create-a-new-security-policy).

**Check if your Azure Front Door Endpoint is running - this process may take a while** 

Use your browser or *curl* command to check if your app is working correctly.

```bash
curl https://$URLofYourFrontDoorEndpoint
```

**Add X-Azure-FDID rule**

Create a variable with the ID of your Azure Front Door profile.

```bash
YourFrontDoorID=$(az afd profile show \
    --resource-group $ResourceGroupName \
    --profile-name $FDName \
    --query frontDoorId -o tsv)
```

Add a rule that only allows communication from the specific Azure Front Door profile.

```bash
az webapp config access-restriction add --resource-group $ResourceGroupName --name $WebAppName --rule-name FrontDoor --action Allow --priority 100 --service-tag AzureFrontDoor.Backend --http-header x-azure-fdid=$YourFrontDoorID
```

**Check if your app allow connections using Azure Front Door url**

Use your browser or *curl* command to check if your app is working correctly using Azure Front Door url.

```bash
curl https://$URLofYourFrontDoorEndpoint
```

**Check if your app is blocked by network restriction**

Use your browser or *curl* command to check if your app is not available via direct url access.

```bash
curl https://$URLofYourWebsite
```

## Second advanced scenario - Multi-source rules

Multi-source rules allow you to combine up to eight IP ranges or eight Service Tags in a single rule. You might use this if you have more than 512 IP ranges or you want to create logical rules where multiple IP ranges are combined with a single http header filter.

**First example - add multiple ip ranges to rule**

In example 1, you will add several ip ranges to one rule.

**Prepare to run the first scenario**

To remove the policy from the previous scenario, please run the command below.

```bash
az webapp config access-restriction remove --resource-group $ResourceGroupName --name $WebAppName --rule-name FrontDoor
```

To change the default behavior *Unmatched rule action* to *Deny*, please run the command below.

```bash
az resource update --resource-group $ResourceGroupName --name $WebAppName --resource-type "Microsoft.Web/sites" --set properties.siteConfig.ipSecurityRestrictionsDefaultAction=Deny
```

**Check if your app is blocked by network restriction**

Use your browser or *curl* command to check if your app is blocked by network restriction

```bash
curl https://$URLofYourWebsite
```

**Check your public IP addresses and create variable**

>**Remember** If you are using Azure Cloud Shell, please remember that you will have a different public IP address every time you will restart your console.

```bash
YourPublicIPaddress=$(curl icanhazip.com)
```

>**TIP** You can also use Powershell command to check your public IP address.
>
>```bash
>(Invoke-WebRequest -uri "http://ifconfig.me/ip").Content
>```
>
>or you can use curl command
>
>```bash
>(curl icanhazip.com).Content
>```

**Add IP addresses to multi-source rule**

To add a rule that will block traffic from several IP ranges, please run the command below.

```bash
az webapp config access-restriction add --resource-group $ResourceGroupName --name $WebAppName --rule-name AllowBranchWarsawIPaddresses --action Allow --priority 200 --ip-address 192.168.1.0/24,192.168.10.0/24,192.168.100.0/24,$YourPublicIPaddress
```

**Check if your app allow connections**

Use your browser or *curl* command to check if your app is working correctly.

```bash
curl https://$URLofYourWebsite
```

**Second example - add multiple service tags to network restriction rule**

This example show you how you can add multiple service tags to network restriction rule. In this example we will allow connection from Logic Apps, Application Insight and Api Management from West europe. You can test this rule in multiple ways in this example you will test this rule using Application Insight availability test.

**Prepare to run the second example**

The following command will create *Application Insight* and *Log Analytics Workspace* for you.

```bash
az monitor log-analytics workspace create --resource-group $ResourceGroupName --workspace-name $LogAnalyticsName
LogAnalyticsId=$(az monitor log-analytics workspace show --resource-group $ResourceGroupName --workspace-name $LogAnalyticsName --query id -o tsv)
LogAnalyticsWorkspaceId=$(az monitor log-analytics workspace show --resource-group $ResourceGroupName --workspace-name $LogAnalyticsName --query customerId -o tsv)
az monitor app-insights component create --app $ApplicationInsightsName --location $LocationRegion --kind web -g $ResourceGroupName --application-type web --workspace $LogAnalyticsId
ApplicationInsightId=$(az monitor app-insights component show --app $ApplicationInsightsName -g $ResourceGroupName --query id -o tsv)
az monitor app-insights web-test create --web-test-kind "standard" --enabled true --location $LocationRegion --resource-group $ResourceGroupName --name $ApplicationInsightsWebTestName --defined-web-test-name $ApplicationInsightsWebTestName --tags "hidden-link:$ApplicationInsightId=Resource" --http-verb "GET" --request-url "https://$URLofYourWebsite" --timeout 30 --frequency 300 --retry-enabled true --locations Id="emea-nl-ams-azr" --locations Id="us-fl-mia-edge"
```

**Show Application Insight availability test result**

After running the command below, you should get a result from *Application Insight* that the tests failed.

```bash
az monitor log-analytics query -w $LogAnalyticsWorkspaceId --analytics-query "AppAvailabilityResults | project TimeGenerated, Message, Location | order by TimeGenerated desc" -t P0DT1H -o table
```
>**Tip** If you will have multiple availability tests in one *Application Insight*, you can use *Name* field for filtering.

The result should look similar to this.

![403-ip-forbidden]({{site.baseurl}}/media/2022/11/403-ip-forbidden.png){: .align-center}

**Add service tags to multi-source rule**

To add a rule that will allow traffic from several service tags, please run the command below.

```bash
az webapp config access-restriction add --resource-group $ResourceGroupName --name $WebAppName --rule-name AllowMultipleServiceTags --action Allow --priority 300 --service-tag LogicApps,ApiManagement.WestEurope,ApplicationInsightsAvailability
```

**Show Application Insight availability test result**

After running the command below, you should get a result from *Application Insight* that the tests passed.

>**Tip** Please wait 5-10 minutes before you will run this command. Availability tests are run every 5 minutes.

```bash
az monitor log-analytics query -w $LogAnalyticsWorkspaceId --analytics-query "AppAvailabilityResults | project TimeGenerated, Message, Location | order by TimeGenerated desc" -t P0DT1H -o table
```

The result should look similar to this.

![Passed]({{site.baseurl}}/media/2022/11/passed.png){: .align-center}

## Third advanced scenario - Block a single IP address

**Remove previous rules**

To remove the rules from the previous scenario, please run the command below.

```bash
az webapp config access-restriction remove --resource-group $ResourceGroupName --name $WebAppName --rule-name AllowBranchWarsawIPaddresses
az webapp config access-restriction remove --resource-group $ResourceGroupName --name $WebAppName --rule-name AllowMultipleServiceTags
```

**Change default behavior for *Unmatched rule action* to *Allow***

To change the default behavior to *Allow*, please run the command below.

```bash
az resource update --resource-group $ResourceGroupName --name $WebAppName --resource-type "Microsoft.Web/sites" --set properties.siteConfig.ipSecurityRestrictionsDefaultAction=Allow
```

**Check if your app allow connections**

Use your browser or *curl* command to check if your app allow connections.

```bash
curl https://$URLofYourWebsite
```

**Block your public ip address**

To add a rule that will block traffic from your ip address, please run the command below.

```bash
az webapp config access-restriction add --resource-group $ResourceGroupName --name $WebAppName --rule-name BlockSingleIpAddress --action Deny --priority 200 --ip-address $YourPublicIPaddress
```

**Check if your app is blocked by network restriction**

Use your browser or *curl* command to check if your app is blocked by network restriction

```bash
curl https://$URLofYourWebsite
```

## Fourth advanced scenario - Restrict access to an SCM site

You can use the same access restriction rules from the *Main site* or create your own rule for SCM site - *Advanced tool site*. SCM site is responsible for *Web Deploy* and *Kudu console*.

**Verify that you can deploy your sample app**

To verify that you can deploy your sample app via *Web Deploy*, please run the command below.

```bash
az webapp deployment source config-zip --resource-group $ResourceGroupName  --name $WebAppName --src ./YourWebSite.zip
```

**Use the same access restrictions rules from *Main site* in *Advanced tool site***

To use the same rules from the *Main site* in the *Advanced tool site*, please run this command.

```bash
az webapp config access-restriction set --resource-group $ResourceGroupName  --name $WebAppName --use-same-restrictions-for-scm-site true
```

**Verify that you can't deploy your sample app**

To verify that you can't deploy your sample app via *Web Deploy*, please run the command below.

```bash
az webapp deployment source config-zip --resource-group $ResourceGroupName  --name $WebAppName --src ./YourWebSite.zip
```

**Configure different rules for *Advanced tool site**

To configure other rules for *Advanced tool site*, please run below command.

```bash
az webapp config access-restriction set --resource-group $ResourceGroupName  --name $WebAppName --use-same-restrictions-for-scm-site false
```

To add a rule for an *SCM* site, please run bellow command.

```bash
az webapp config access-restriction add --resource-group $ResourceGroupName --name $WebAppName --rule-name BlockSingleIpAddress --action Deny --scm-site true --priority 200 --ip-address $YourPublicIPaddress
```

You successfully completed the article.
