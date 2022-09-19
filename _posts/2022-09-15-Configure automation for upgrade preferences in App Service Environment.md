---
title: "Control and automate planned maintenance for App Service Environment v3"
author_name: "Błażej Miśkiewicz"
category: networking
toc: true
toc_sticky: true
excerpt: "This is part 1 of a 2-part series about controlling and automating planned maintenance in App Service Environment v3."
---

## Introduction

This is part 1 of a 2-part series about automation for planned maintenance in App Service Environment v3. In this 2-part series, I will walk you through building a demo environment, setting up manual upgrade preference option for App Service Environment and configure automation using Logic App. In the first scenario you will deploy a simple environment, in the second scenario the environment will be more complex.

**The first article** uses one Azure App Service Environment, which will be configured with the manual upgrade preference option. When an update is ready, an alert will be triggered that will start your Logic App. The Logic App will send you an email asking you to confirm the upgrade process.

**The second article** uses two Azure App Service Environments in two different regions. The first App Service Environment will be for the production workload, and the second for disaster recovery purposes. The Web App will be published using Azure Front Door Standard service. When an update is ready, an alert will be triggered that will start your Logic App. The Logic App will send you an email asking you to confirm traffic redirection from the primary region to the disaster recovery region, when you accept this workflow, Logic App will redirect the traffic and start the upgrade process of your production Azure App Service Environment. Using this approach you can avoid cold start of the applications. Usually the upgrade process should be invisible for your application but if you have an application that needs more time to start or you want to decide when the upgrade should start then this approach will be perfect for you.

>**Remember** Now you can change Upgrade preference option to Manual and decide for yourself when you want to upgrade App Service Environment v3. After an update is available, you'll have 15 days to start the upgrade process. If you don't start the upgrade within the 15 days, the upgrade will be processed with the remaining automatic upgrades in the region. You can find more information about upgrade preference for App Service Environments v3 on this site [upgrade preference for App Service Environments](https://docs.microsoft.com/azure/app-service/environment/how-to-upgrade-preference?pivots=experience-azp)

**Requirements:**

1. Access to Azure Subscription
2. Access to Office 365 account

**First scenario is organized into four steps:**

1. Deploy App Service Environment using Azure CLI
2. Deploy sample app using Azure CLI
3. Deploy Logic App using ARM template
4. Create Alert in *Monitor*

**Decide where you will execute commands**

The best option to walk through this guide and execute commands would be to use Azure Cloud Shell with Bash environment. Azure Cloud Shell is an interactive, authenticated, browser-accessible shell for managing Azure resources. It provides the flexibility of choosing the shell experience that best suits the way you work, either Bash or PowerShell. For information on how to use Azure Cloud Shell, please visit this page [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview). You can also install Azure CLI on your machine. The Azure CLI is available to install in Windows, macOS and Linux environments. It can also be run in a Docker container and Azure Cloud Shell. For information on how to install
the Azure CLI, please visit this page [Azure Cli](https://docs.microsoft.com/cli/azure/install-azure-cli)

If you decide to use [Azure Cloud Shell](https://shell.azure.com), please use Bash environment.

## Getting Started with the first scenario

**Create folder for you data**

You can use the name below for your folder. You just need to replace *asedemo* with your environment name.

```bash
mkdir asedemo-upgrade-preference-ase
cd asedemo-upgrade-preference-ase
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

You can use the names below. You just need to replace *asedemo* with your environment name, change *SubscriptionId*, *EmailAddress* and change *LocationRegionPROD* parameters.

Please copy and paste your parameters to your shell.

```bash
ASEsubscriptionID=11111111-1111-1111-1111-111111111111
ASENamePROD=ase-asedemo-prod-01
ASEPlanNamePROD=plan-asedemo-linux-prod-01
WEBAPPNamePROD=app-asedemo-prod-01
LocationRegionPROD=northeurope
ResourceGroupNameSHARED=rg-asedemo-shared-01
ASEResourceGroupNamePROD=rg-asedemo-prod-01
VirtualNetworkNamePROD=vnet-asedemo-prod-northeurope-01
SubnetNameVnetPROD=snet-asedemo-prod-northeurope-01
VnetPrefixPROD=192.168.10.0/24
SubnetVnetPrefixPROD=192.168.10.0/24
LogicAppName=logic-asedemo-prod-01
EmailAddress=YourEmailAddress
```

## Create basic infrastructure

**Create Resource Groups**

The demo environment will be organized using two resource groups. The first resource group is for App Service Environment, the second is for Logic App Automation.

```bash
az group create -l $LocationRegionPROD -n $ASEResourceGroupNamePROD
az group create -l $LocationRegionPROD -n $ResourceGroupNameSHARED
```

**Create virtual network with subnet for App Service Environment**

A virtual network is required to create an App Service Environment. This command will create a virtual network with a subnet.

```bash
az network vnet create -g $ASEResourceGroupNamePROD -n $VirtualNetworkNamePROD --address-prefix $VnetPrefixPROD --subnet-name $SubnetNameVnetPROD --subnet-prefix $SubnetVnetPrefixPROD
```

**Create App Service Environment - This process may take a while**

An App Service Environment is a single-tenant deployment of Azure App Service that runs in your virtual network. This command will create an App Service Environment.

```bash
az appservice ase create -n $ASENamePROD -g $ASEResourceGroupNamePROD --vnet-name $VirtualNetworkNamePROD --subnet $SubnetNameVnetPROD --kind asev3 --virtual-ip-type External
```

More information about Azure CLI for App Service Environment, visit [Azure CLI ASE Create](https://docs.microsoft.com/cli/azure/appservice/ase?view=azure-cli-latest#az-appservice-ase-create).

**Create App Service Plan in App Service Environment - This process may take a while**

Applications are hosted in App Service plans, which are created in an App Service Environment. An App Service plan is essentially a provisioning profile for an application host. This command will create an App Service plan.

```bash
az appservice plan create -g $ASEResourceGroupNamePROD -n $ASEPlanNamePROD --app-service-environment $ASENamePROD --is-linux --sku I1v2
```

More information about Azure CLI for App Service Environment Plan, visit [Azure CLI ASE Plan Create](https://docs.microsoft.com/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-create)

## Create and deploy sample application

**Create a web app**

To create a PHP app in your App Service Environment please use this command.

```bash
az webapp create -g $ASEResourceGroupNamePROD -p $ASEPlanNamePROD -n $WEBAPPNamePROD --runtime "PHP:8.0"
```

> **Tip:**  To check the list of available web runtime in format Framework:Version use this command ```bash
az webapp list-runtimes```

Create a variable with the URL of your website. You will use this variable later with *curl* command to check if your webapp is working correctly.

```bash
URLofYourPrimaryWebsite=$(az webapp show --name $WEBAPPNamePROD --resource-group $ASEResourceGroupNamePROD --query defaultHostName -o tsv)
```

You can also write down URL of your website.

![URL of your site]({{site.baseurl}}/media/2022/09/url-upgrade-preferences-in-App-Service-Environment.png){: .align-center}

**Create index.php file for primary website**

Sample code for your primary website

```bash
echo '<?php
 echo "Primary Website";
?>' > index.php
```

**Create zip file for primary website**

In the next step you will use *ZIP Deploy* to deploy the application. You need a ZIP utility for this. Fortunately, ZIP utility is pre-installed in Azure Cloud Shell.

```bash
zip primaryapp.zip index.php
```

**Deploy sample app**

To deploy a sample application using *ZIP Deploy*, use this command:

```bash
az webapp deployment source config-zip --resource-group $ASEResourceGroupNamePROD  --name $WEBAPPNamePROD --src ./primaryapp.zip
```

**Check if your app is running**

Use your browser or use *curl* command to check if your app is working correctly.

```bash
curl https://$URLofYourPrimaryWebsite
```

## Planned maintenance - Change the upgrade preference

To change the *Upgrade preference* setting to Manual on your App Service Environment v3, use this command:

```bash
az resource update --name $ASENamePROD -g $ASEResourceGroupNamePROD --resource-type "Microsoft.Web/hostingEnvironments" --set properties.upgradePreference=Manual
```

## Deploy Logic App

This sample code is intended to show you what the Logic App can do to automate your processes. This sample Logic App shows how to use various connectors and functions that you can use to build you own Logic App in production environment.

**Logic App ARM Template**

You can use the *curl* command in Azure Cloud Shell to download the template_scenario_1.json file from the github repository.

```bash
curl https://raw.githubusercontent.com/bmis/azure-logic-app-upgrade-preference/main/templates/template_scenario_1.json --output template_scenario_1.json
```

You can use the *code* editor in Azure Cloud Shell to check the template_scenario_1.json file.

```bash
code template_scenario_1.json
```

Use ctrl + q to close *code* editor.

**Logic App ARM Parameters file**

The *echo* command will create a parameters_scenario_1.json file for you.

```bash
echo '{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "logicapp_name": {
            "value": "'"$LogicAppName"'"
        },
        "SubscriptionID": {
            "value": "'"$ASEsubscriptionID"'"
        },
        "ResourceGroupName": {
            "value": "'"$ResourceGroupNameSHARED"'"
        },
        "connections_office365_name": {
            "value": "office365"
        },
        "EmailAddress": {
            "value": "'"$EmailAddress"'"
        }
    }
}' > parameters_scenario_1.json
```

You can use the *code* editor in Azure Cloud Shell to check parameters_scenario_1.json file.

```bash
code parameters_scenario_1.json
```

Use ctrl + q to close *code* editor.

### Deploy Logic App template

To start the deployment, execute the command below.

```bash
az deployment group create --name $LogicAppName --resource-group $ResourceGroupNameSHARED  --template-file template_scenario_1.json --parameters parameters_scenario_1.json
```

### Authorize Office 365 connection

Before you can use Office 365 connector in Logic App you must authorize Office365 connection.

1. Open [Azure portal](https://portal.azure.com), sign in with your credentials
2. Go to your Logic App using for example search box at the top
3. Click *API connections* and then select *office365* API Connection
4. Check the status, if status is *Connected* everything is ok, if it's *Unauthorized*, click *Edit API connection* and then click *Authorize* button
5. Sign in to your account
6. Click *Save* button

**Check out the app via Logic App designer:**

1. Open [Azure portal](https://portal.azure.com), sign in with your credentials
2. Go to your Logic App using for example the search box at the top
3. Click *Logic app designer*
4. Familiarize yourself with the individual steps of Logic App workflow

**Steps in Azure Logic App:**

1. The Logic App starts when an alert occurs. You will configure the alert later in this article.
2. The Logic App verifies that the alert applies to the Azure App Service Environment.
3. Using functions such as *split*, *json* and action such as *Filter array*, the Logic App will extract from the text, the information about the name of App Service Environment to which the alert relates and the URL of the App Service Environment.
4. In the next step, the approval email is sent.
5. If the *Approve* option is selected, the Logic App will go further. If the *Reject* option is selected the Logic App will stop working.
6. After selecting *Approve*, the Logic App will check for an upgrade for the App Service Environment.
7. If an upgrade is available, a *http request* will be sent which initiates the upgrade. As well, an e-mail will be sent with the information *The update of ase-asedemo-prod-01 has started*
8. If the update is not available, an e-mail will be sent with the information *App Service Environment ase-asedemo-prod-01 does not currently have an upgrade available.*

![Logic App Designer]({{site.baseurl}}/media/2022/09/logic-app-designer.png){: .align-center}

For more information about Logic Apps, visit [Logic App Overview](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview)

**Steps to assign an Azure role contributor to App Service Environment instance:**

Your Logic App will be deployed with system assigned managed identity. Before you can use your Logic App you must give your Logic App identity permission to your App Service Environment. Permissions are required to check if an update is available and to start the update process. If you want to know more about managed identities please go to this page [Managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview). Information about permissions that you need to configure managed identity you can find on this page [Managed identities for Azure resources frequently asked questions](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/managed-identities-faq#which-azure-rbac-permissions-are-required-to-use-a-managed-identity-on-a-resource).

Step 1: Determine who needs access

```bash
LogicAppIdentity=$(az resource show --name $LogicAppName --resource-group $ResourceGroupNameSHARED --resource-type "Microsoft.Logic/workflows" --query identity.principalId -o tsv)
```

Step 2: Assign contributor role

```bash
az role assignment create --assignee $LogicAppIdentity --role "Contributor" --scope /subscriptions/$ASEsubscriptionID/resourceGroups/$ASEResourceGroupNamePROD/providers/Microsoft.Web/hostingEnvironments/$ASENamePROD
```

If you are at this stage, you have successfully created the demo environment. Now we need to create an alert that will trigger the Logic App.

## Create an Alert

1. Open [Azure portal](https://portal.azure.com), sign in with your credentials
2. Go to *Monitor* using for example the search box at the top
3. From the menu, click *Service Health*
4. Click *Planned maintenance*
5. Click *Add service health alert*
6. In the *Condition* section, select Azure *Subscription* where you deployed your App Service Environment
7. At the *Services* box, select only App Service item
8. At the *Regions* box, select region of your App Service Environment
9. At the *Event types* filed, select only *Planned maintenance*
10. In the *Action* section, click *Select action groups*
11. Click *Create action group*
12. In the Basic section:
    - select *Subscription* where you deployed you App Service Environment
    - select *Resource group* with *shared* in the name (rg-asedemo-shared-01)
    - Select *Global Region*
    - Fill the fields *Action group name* and *Display name* for example using this name *ag-asedemo* - please change *asedemo* to your environment name
13. In the *Actions* section, click *Action type* and select *Logic App*
14. Fill the fields with information about *Subscription* (select Azure Subscription where you deployed your App Service Environment), *Resource group* (select Azure Resource group with *shared* in the name (rg-asedemo-shared-01)) and *Select a logic app* that you deployed in previous steps
15. *Enable the common alert schema*
16. Click "OK"
17. Fill the *Name* filed for example using the name *action-logic-asedemo-prod-01* - please change *asedemo* to your environment name
18. Click *Review + create*
19. Click *Create*
20. Fill *Alert rule details* section, fill *Alert rule name* for example using the name *alert-asedemo-planned-maintenance* - please change *asedemo* to your environment name
21. Make sure that checkbox *Enable alert rule upon creation* is selected
22. Click *Create alert rule*

### Send test notifications

As you build your automation and notification logic, you may want to test it before the actual upgrade is available. The Azure portal and rest api has the ability to send a special test upgrade available notification, which you can use to verify your automation logic. The message will be similar to the real notification, but the title will be prefixed with "[Test]" and the description will be different. You can send test notifications after you've configured your upgrade preference to Manual. The test notifications are sent in batches every 15 minutes.

To send a special test upgrade available notification please use this command:

```bash
ASEidPROD=$(az appservice ase show --name $ASENamePROD --resource-group $ASEResourceGroupNamePROD --query id --output tsv)
az rest --method POST --uri "${ASEidPROD}/testUpgradeAvailableNotification?api-version=2022-03-01"
```

You can also use [Azure portal](https://portal.azure.com) to send test notifications. You can find more information about test notifications on this site [Send test notifications](https://docs.microsoft.com/azure/app-service/environment/how-to-upgrade-preference?pivots=experience-azp#send-test-notifications)

**Check your mailbox and approve the upgrade process**

![Approve or reject email]({{site.baseurl}}/media/2022/09/aprove-or-reject-email.png){: .align-center}

Because this is test notification your Logic app will send you an email with information that *App Service Environment NameOfYourASE does not currently have an upgrade available.* In a real-world scenario when an upgrade will be available your Logic App will send you information that *The update of NameOfYourASE has started.*

### Logic App run history blade

Familiarize yourself with the Logic App run using Run history blade.

1. Open [Azure portal](https://portal.azure.com), sign in with your credentials
2. Go to your Logic App using for example using the search box at the top
3. Click *Overview*
4. Click *Run history*
5. Select last *Succeeded* Logic App run
6. Familiarize yourself with the Logic App run

You successfully completed the first scenario. The second scenario will be published soon.
