---
title: "Configure automation for upgrade preferences in App Service Environment"
author_name: "Błażej Miśkiewicz"
category: networking
toc: true
toc_sticky: true
---

## Introduction

This is part 1 of a 2-part series about automation for upgrade preferences in App Service Environment. In this 2-part series, I will walk you through building demo environment, setting up manual upgrade preference option for App Service Environment and configure automation using Logic App. In the first scenario you will deploy simple environment, in second scenario environment will me more complex.

**The first article** assumes deploying one Azure App Service Environment, which will be configured with a manual update preference option. When the update is ready, an alert will be triggered that will start your Logic App. Logic App will send you an email asking you to confirm the update process.

**The second article** assumes deploying two Azure App Service Environments in two different regions. First Azure App Service Environment will be for production workload, second for disaster recovery purposes. The Web App will be published using Azure Front Door Standard service. When the update is ready, an alert will be triggered that will start your Logic App. The Logic App will send you an email asking you to confirm traffic redirection from the primary region to the disaster recovery region, when you accept this workflow Logic App will redirect the traffic and start the upgrade process of your production Azure App Service Environment. Using this approach you can avoid cold start of the applications, usually upgrade process should be invisible for your application but If you have an application that needs more time to start or you want to decide when the upgrade should start then this approach will be perfect for you.

>**Remember** Now you can change Upgrade preference option to Manual and decide for yourself when you want to upgrade App Service Environment. After the upgrade is available, you'll have 15 days to start the upgrade process. If you don't start the upgrade within the 15 days, the upgrade will be processed with the remaining automatic upgrades in the region. More information about upgrade preference for App Service Environments you can find on this site [upgrade preference for App Service Environments](https://docs.microsoft.com/azure/app-service/environment/how-to-upgrade-preference?pivots=experience-azp)

**Requirements:**

1. Access to Azure Subscription
2. Access to Office 365 account

**First scenario is organized into four steps:**

1. Deploy App Service Environment using Azure CLI
2. Deploy sample app using Azure CLI
3. Deploy Logic App using ARM template
4. Create Alert in *Monitor*

**Decide where you will execute commands.**

The best option to walk through this guide and execute commands would be to use Azure Cloud Shell with Bash environment. Azure Cloud Shell is an interactive, authenticated, browser-accessible shell for managing Azure resources. It provides the flexibility of choosing the shell experience that best suits the way you work, either Bash or PowerShell. For information on how to use Azure Cloud Shell, please visit this page [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview). You can also install Azure CLI on your machine. The Azure CLI is available to install in Windows, macOS and Linux environments. It can also be run in a Docker container and Azure Cloud Shell. For information on how to install
the Azure CLI, please visit this page [Azure Cli](https://docs.microsoft.com/cli/azure/install-azure-cli)

If you decided to use Azure Cloud Shell please type in the browser this page [Azure Cloud Shell](https://shell.azure.com) please use Bash environment.

## Getting Started with the first scenario

**Create folder for you data.**

```bash
mkdir YourFolderName
cd YourFolderName
```

**Choosing the right subscription.**

If you have many subscription you must select the subscription to which you want to deploy the resources.

Using this command you can find and copy the *SubscriptionId* on which you want to create resources for this scenario.

```bash
az account list -o table
```

Using this command you can set a subscription to be the current active subscription.

```bash
az account set -s YourSubscriptionID
```

More information about *az account* command you can find on this site [az account](https://docs.microsoft.com/cli/azure/account?view=azure-cli-latest).

**Prepare parameters.**

When you construct your naming convention, identify the key pieces of information that you want to reflect in a resource name. Different information is relevant for different resource types. The following sites are useful when you construct resource names [Define your naming convention](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming) and [Recommended abbreviations for Azure resource types](https://docs.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations)

You can use the names below. You just need to replace *asedemo* with your environment name, change *SubscriptionId* and change *EmailAddress* parameters.

```bash
ASEsubscriptionID=11111111-1111-1111-1111-111111111111
ASENamePROD=ase-asedemo-prod-01
ASEPlanNamePROD=plan-asedemo-linux-prod-01
WEBAPPNamePROD=app-asedemo-prod-01
LocationRegionPROD=northeurope
ASEResourceGroupNamePROD=rg-asedemo-prod-01
VirtualNetworkNamePROD=vnet-asedemo-prod-northeurope-01
SubnetNameVnetPROD=snet-asedemo-prod-northeurope-01
VnetPrefixPROD=192.168.10.0/24
SubnetVnetPrefixPROD=192.168.10.0/24
LogicAppName=logic-asedemo-prod-01
EmailAddress=YourEmailAddress
```

## Create basic infrastructure

**Create Resource Group.**

```bash
az group create -l $LocationRegionPROD -n $ASEResourceGroupNamePROD
```

**Create Virtual Network with subnet for App Service Environment.**

```bash
az network vnet create -g $ASEResourceGroupNamePROD -n $VirtualNetworkNamePROD --address-prefix $VnetPrefixPROD --subnet-name $SubnetNameVnetPROD --subnet-prefix $SubnetVnetPrefixPROD
```

**Create App Service Environment - This process may take a while.**

```bash
az appservice ase create -n $ASENamePROD -g $ASEResourceGroupNamePROD --vnet-name $VirtualNetworkNamePROD --subnet $SubnetNameVnetPROD --kind asev3
```

More information about Azure CLI for App Service Environment you can find on this link [Azure CLI ASE Create](https://docs.microsoft.com/cli/azure/appservice/ase?view=azure-cli-latest#az-appservice-ase-create).

**Create App Service Plan in App Service Environment - This process may take a while.**

```bash
az appservice plan create -g $ASEResourceGroupNamePROD -n $ASEPlanNamePROD --app-service-environment $ASENamePROD --is-linux --sku I1v2
```

More information about Azure CLI for App Service Environment Plan you can find on this link [Azure CLI ASE Plan Create](https://docs.microsoft.com/cli/azure/appservice/plan?view=azure-cli-latest#az-appservice-plan-create)

> **Tip:**  To check the list of available web runtime in format Framework:Version use this command ```bash
az webapp list-runtimes```

## Create and deploy sample application

**Create a web app.**

```bash
az webapp create -g $ASEResourceGroupNamePROD -p $ASEPlanNamePROD -n $WEBAPPNamePROD --runtime "PHP:8.0"
```

Create a variable with the URL of your website. You will use this variable later with *curl* command to check if your webapp is working correctly.

```bash
URLofYourPrimaryWebsite=$(az webapp show --name $WEBAPPNamePROD --resource-group $ASEResourceGroupNamePROD --query defaultHostName -o tsv)
```

You can also write down URL of your website.

![URL of your site]({{site.baseurl}}/media/2022/09/url-upgrade-preferences-in-App-Service-Environment.png){: .align-center}

**Create index.php file for primary website.**

Sample code for your primary website

```bash
<?php
 echo 'Primary Website';
?>
```

Copy code for primary website using ctrl+c and ctrl+v

Save file using ctrl+s command and ctrl+q to close the file

**Create zip file for primary website.**

```bash
zip primaryapp.zip index.php
```

**Delete index.php file for primary website.**

```bash
rm index.php
```

**Deploy sample apps.**

```bash
az webapp deployment source config-zip --resource-group $ASEResourceGroupNamePROD  --name $WEBAPPNamePROD --src ./primaryapp.zip
```

**Check if you webapp is running.**

Use your browser or use *curl* command to check if you webapp is working correctly.

```bash
curl https://$URLofYourPrimaryWebsite
```

## Update the upgrade preference option in your App Service Environment to Manual

```bash
az resource update --name $ASENamePROD -g ASEResourceGroupNamePROD --resource-type "Microsoft.Web/hostingEnvironments" --set properties.upgradePreference=Manual
```

## Deploy Logic App

This sample code is intended to show you what the Logic App can do to automate your processes. This sample Logic App shows how to use various connectors and functions that you can use to build you own Logic App in production environment.

**Logic App ARM Template.**

You can use *Code* editor in Azure Cloud Shell for creating template_scenario1.json file for your deployment.

```bash
code template_scenario1.json
```

Copy below code for template_scenario1.json using ctrl+c and ctrl+v commands

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "logicapp_name": {
            "defaultValue": "MyLogicApp",
            "type": "string",
            "metadata": {
                "comment": "Your Logic app name."
            }
        },
        "logicapp_location": {
            "defaultValue": "[resourceGroup().location]",
            "type": "string"
        },
        "ASEsubscriptionID": {
            "defaultValue": "[subscription().subscriptionId]",
            "type": "string",
            "metadata": {
                "comment": "Subscription ID of your ASE instance. Remove this parameter if you are going to deploy your Logic app to the same subscription as your ASE instance."
            }
        },
        "ASEResourceGroupNamePROD": {
            "defaultValue": "[resourceGroup().name]",
            "type": "string",
            "metadata": {
                "comment": "Resource group name of your ASE instance. Remove this parameter if you are going to deploy your Logic app to the same resource group as your ASE instance."
            }
        },
        "connections_office365_name": {
            "defaultValue": "office365",
            "type": "string",
            "metadata": {
                "comment": "Office365 connection name. Leave it as is."
            }
        },
        "connections_office365_connectionid": {
            "defaultValue": "[resourceId('Microsoft.Web/connections', parameters('connections_office365_name'))]",
            "type": "string",
            "metadata": {
                "comment": "[resourceId(parameters('ASEsubscriptionID'), parameters('ASEResourceGroupNamePROD'), 'Microsoft.Web/connections', parameters('connections_office365_name'))]"
            }
        },
        "connections_office365_id": {
            "defaultValue": "[subscriptionResourceId('Microsoft.Web/locations/managedApis', resourceGroup().location, parameters('connections_office365_name'))]",
            "type": "string"
        },
        "EmailAddress": {
            "defaultValue": "email@test.pl",
            "type": "string"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Web/connections",
            "apiVersion": "2016-06-01",
            "name": "[parameters('connections_office365_name')]",
            "location": "[resourceGroup().location]",
            "kind": "V1",
            "properties": {
                "api": {
                    "id": "[parameters('connections_office365_id')]"
                }
            }
        },
        {
            "type": "Microsoft.Logic/workflows",
            "apiVersion": "2017-07-01",
            "name": "[parameters('logicapp_name')]",
            "location": "[parameters('logicapp_location')]",
            "identity": {
                "type": "SystemAssigned"
            },
            "dependsOn": [
                "[parameters('connections_office365_name')]"
            ],
            "properties": {
                "state": "Enabled",
                "definition": {
                    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
                    "actions": {
                        "Condition_check_approval_email": {
                            "actions": {
                                "Condition_check_ase_upgrade_availability": {
                                    "actions": {
                                        "HTTP_ase_update": {
                                            "inputs": {
                                                "authentication": {
                                                    "type": "ManagedServiceIdentity"
                                                },
                                                "method": "POST",
                                                "uri": "https://management.azure.com/subscriptions/@{variables('subscription_id')}/resourceGroups/@{variables('resource_group_name')}/providers/Microsoft.Web/hostingEnvironments/@{variables('ase_name')}/upgrade?api-version=2022-03-01"
                                            },
                                            "operationOptions": "DisableAsyncPattern",
                                            "runAfter": {},
                                            "type": "Http"
                                        },
                                        "Send_an_email_(V2)": {
                                            "inputs": {
                                                "body": {
                                                    "Body": "<p>The update of @{variables('ase_name')} has started.</p>",
                                                    "Importance": "Normal",
                                                    "Subject": "Upgrade information about @{variables('ase_name')}",
                                                    "To": "@parameters('parm_logicapp_EmailAddress')"
                                                },
                                                "host": {
                                                    "connection": {
                                                        "name": "@parameters('$connections')['office365']['connectionId']"
                                                    }
                                                },
                                                "method": "post",
                                                "path": "/v2/Mail"
                                            },
                                            "runAfter": {
                                                "HTTP_ase_update": [
                                                    "Succeeded"
                                                ]
                                            },
                                            "type": "ApiConnection"
                                        }
                                    },
                                    "else": {
                                        "actions": {
                                            "Send_an_email_(V2)_2": {
                                                "inputs": {
                                                    "body": {
                                                        "Body": "<p>App Service Environment @{variables('ase_name')} does not currently have an upgrade available.</p>",
                                                        "Importance": "Normal",
                                                        "Subject": "Upgrade information about @{variables('ase_name')}",
                                                        "To": "@parameters('parm_logicapp_EmailAddress')"
                                                    },
                                                    "host": {
                                                        "connection": {
                                                            "name": "@parameters('$connections')['office365']['connectionId']"
                                                        }
                                                    },
                                                    "method": "post",
                                                    "path": "/v2/Mail"
                                                },
                                                "runAfter": {},
                                                "type": "ApiConnection"
                                            }
                                        }
                                    },
                                    "expression": {
                                        "and": [
                                            {
                                                "equals": [
                                                    "@body('Parse_JSON_HTTP_chceck_ase_upgrade_availability')?['properties']?['upgradeAvailability']",
                                                    "Ready"
                                                ]
                                            }
                                        ]
                                    },
                                    "runAfter": {
                                        "Parse_JSON_HTTP_chceck_ase_upgrade_availability": [
                                            "Succeeded"
                                        ]
                                    },
                                    "type": "If"
                                },
                                "HTTP_chceck_ase_upgrade_availability": {
                                    "inputs": {
                                        "authentication": {
                                            "type": "ManagedServiceIdentity"
                                        },
                                        "method": "GET",
                                        "uri": "https://management.azure.com/subscriptions/@{variables('subscription_id')}/resourceGroups/@{variables('resource_group_name')}/providers/Microsoft.Web/hostingEnvironments/@{variables('ase_name')}?api-version=2022-03-01"
                                    },
                                    "runAfter": {},
                                    "type": "Http"
                                },
                                "Parse_JSON_HTTP_chceck_ase_upgrade_availability": {
                                    "inputs": {
                                        "content": "@body('HTTP_chceck_ase_upgrade_availability')",
                                        "schema": {
                                            "properties": {
                                                "id": {
                                                    "type": "string"
                                                },
                                                "kind": {
                                                    "type": "string"
                                                },
                                                "location": {
                                                    "type": "string"
                                                },
                                                "name": {
                                                    "type": "string"
                                                },
                                                "properties": {
                                                    "properties": {
                                                        "allowedMultiSizes": {},
                                                        "allowedWorkerSizes": {},
                                                        "apiManagementAccountId": {},
                                                        "clusterSettings": {
                                                            "type": "array"
                                                        },
                                                        "customDnsSuffixConfiguration": {},
                                                        "databaseEdition": {},
                                                        "databaseServiceObjective": {},
                                                        "dedicatedHostCount": {
                                                            "type": "integer"
                                                        },
                                                        "defaultFrontEndScaleFactor": {
                                                            "type": "integer"
                                                        },
                                                        "dnsSuffix": {
                                                            "type": "string"
                                                        },
                                                        "dynamicCacheEnabled": {},
                                                        "environmentCapacities": {},
                                                        "environmentIsHealthy": {
                                                            "type": "boolean"
                                                        },
                                                        "environmentStatus": {},
                                                        "fileServerRoleCount": {},
                                                        "frontEndScaleFactor": {
                                                            "type": "integer"
                                                        },
                                                        "hasLinuxWorkers": {
                                                            "type": "boolean"
                                                        },
                                                        "internalLoadBalancingMode": {
                                                            "type": "string"
                                                        },
                                                        "ipsslAddressCount": {
                                                            "type": "integer"
                                                        },
                                                        "lastAction": {},
                                                        "lastActionResult": {},
                                                        "location": {
                                                            "type": "string"
                                                        },
                                                        "managedIdentityInformation": {},
                                                        "maximumNumberOfMachines": {
                                                            "type": "integer"
                                                        },
                                                        "multiRoleCount": {},
                                                        "multiSize": {
                                                            "type": "string"
                                                        },
                                                        "name": {
                                                            "type": "string"
                                                        },
                                                        "networkAccessControlList": {},
                                                        "networkingConfiguration": {
                                                            "properties": {
                                                                "allowNewPrivateEndpointConnections": {
                                                                    "type": "boolean"
                                                                },
                                                                "externalInboundIpAddresses": {
                                                                    "items": {
                                                                        "type": "string"
                                                                    },
                                                                    "type": "array"
                                                                },
                                                                "ftpEnabled": {
                                                                    "type": "boolean"
                                                                },
                                                                "inboundIpAddressOverride": {},
                                                                "internalInboundIpAddresses": {
                                                                    "type": "array"
                                                                },
                                                                "linuxOutboundIpAddresses": {
                                                                    "items": {
                                                                        "type": "string"
                                                                    },
                                                                    "type": "array"
                                                                },
                                                                "numberOfOutboundIpAddresses": {
                                                                    "type": "integer"
                                                                },
                                                                "remoteDebugEnabled": {
                                                                    "type": "boolean"
                                                                },
                                                                "targetNumberOfOutboundIpAddresses": {
                                                                    "type": "integer"
                                                                },
                                                                "windowsOutboundIpAddresses": {
                                                                    "items": {
                                                                        "type": "string"
                                                                    },
                                                                    "type": "array"
                                                                }
                                                            },
                                                            "type": "object"
                                                        },
                                                        "osPreference": {},
                                                        "privateEndpointConnections": {
                                                            "type": "array"
                                                        },
                                                        "provisioningState": {
                                                            "type": "string"
                                                        },
                                                        "publicHost": {},
                                                        "resourceGroup": {
                                                            "type": "string"
                                                        },
                                                        "sslCertKeyVaultId": {},
                                                        "sslCertKeyVaultSecretName": {},
                                                        "status": {
                                                            "type": "string"
                                                        },
                                                        "subscriptionId": {
                                                            "type": "string"
                                                        },
                                                        "suspended": {
                                                            "type": "boolean"
                                                        },
                                                        "upgradeAvailability": {
                                                            "type": "string"
                                                        },
                                                        "upgradeDomains": {},
                                                        "upgradePreference": {
                                                            "type": "string"
                                                        },
                                                        "userWhitelistedIpRanges": {},
                                                        "vipMappings": {},
                                                        "virtualNetwork": {
                                                            "properties": {
                                                                "id": {
                                                                    "type": "string"
                                                                },
                                                                "name": {
                                                                    "type": "string"
                                                                },
                                                                "subnet": {
                                                                    "type": "string"
                                                                },
                                                                "type": {
                                                                    "type": "string"
                                                                }
                                                            },
                                                            "type": "object"
                                                        },
                                                        "vnetName": {
                                                            "type": "string"
                                                        },
                                                        "vnetResourceGroupName": {
                                                            "type": "string"
                                                        },
                                                        "vnetSubnetName": {
                                                            "type": "string"
                                                        },
                                                        "workerPools": {},
                                                        "zoneRedundant": {
                                                            "type": "boolean"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "tags": {
                                                    "properties": {},
                                                    "type": "object"
                                                },
                                                "type": {
                                                    "type": "string"
                                                }
                                            },
                                            "type": "object"
                                        }
                                    },
                                    "runAfter": {
                                        "HTTP_chceck_ase_upgrade_availability": [
                                            "Succeeded"
                                        ]
                                    },
                                    "type": "ParseJson"
                                }
                            },
                            "else": {
                                "actions": {
                                    "Terminate_2": {
                                        "inputs": {
                                            "runStatus": "Cancelled"
                                        },
                                        "runAfter": {},
                                        "type": "Terminate"
                                    }
                                }
                            },
                            "expression": {
                                "and": [
                                    {
                                        "equals": [
                                            "@body('Send_approval_email')?['SelectedOption']",
                                            "Approve"
                                        ]
                                    }
                                ]
                            },
                            "runAfter": {
                                "Send_approval_email": [
                                    "Succeeded"
                                ]
                            },
                            "type": "If"
                        },
                        "Condition_check_if_notification_contains_App_Service_Environment": {
                            "actions": {},
                            "else": {
                                "actions": {
                                    "Terminate": {
                                        "inputs": {
                                            "runStatus": "Cancelled"
                                        },
                                        "runAfter": {},
                                        "type": "Terminate"
                                    }
                                }
                            },
                            "expression": {
                                "and": [
                                    {
                                        "contains": [
                                            "@triggerBody()?['data']?['alertContext']?['properties']?['communication']",
                                            "App Service Environment"
                                        ]
                                    }
                                ]
                            },
                            "runAfter": {},
                            "type": "If"
                        },
                        "Filter_array_url_link_split_array": {
                            "inputs": {
                                "from": "@variables('url_link_split_array')",
                                "where": "@contains(item(), 'https://portal.azure.com')"
                            },
                            "runAfter": {
                                "var_url_link_split_array": [
                                    "Succeeded"
                                ]
                            },
                            "type": "Query"
                        },
                        "Send_approval_email": {
                            "inputs": {
                                "body": {
                                    "Message": {
                                        "Body": "<h1 style =\"color:blue;\">Please approve or reject the @{variables('ase_name')} update.</h1>\n<p style=\"color:green;\"> URL link to the resource @{variables('link_to_azure_resource')}</p>\n<p style=\"color:blue;\">Complete information about this notification </p>\n@{triggerBody()?['data']?['alertContext']?['properties']?['communication']}",
                                        "HideHTMLMessage": false,
                                        "Importance": "Normal",
                                        "Options": "Approve, Reject",
                                        "ShowHTMLConfirmationDialog": false,
                                        "Subject": "Approval Request for @{triggerBody()?['data']?['alertContext']?['properties']?['title']} @{variables('ase_name')} in @{triggerBody()?['data']?['alertContext']?['properties']?['region']} region.",
                                        "To": "@parameters('parm_logicapp_EmailAddress')",
                                        "UseOnlyHTMLMessage": true
                                    },
                                    "NotificationUrl": "@{listCallbackUrl()}"
                                },
                                "host": {
                                    "connection": {
                                        "name": "@parameters('$connections')['office365']['connectionId']"
                                    }
                                },
                                "path": "/approvalmail/$subscriptions"
                            },
                            "runAfter": {
                                "var_subscription_id": [
                                    "Succeeded"
                                ]
                            },
                            "type": "ApiConnectionWebhook"
                        },
                        "var_ase_name": {
                            "inputs": {
                                "variables": [
                                    {
                                        "name": "ase_name",
                                        "type": "string",
                                        "value": "@{variables('ase_name_split_array')[12]}"
                                    }
                                ]
                            },
                            "runAfter": {
                                "var_ase_name_split_array": [
                                    "Succeeded"
                                ]
                            },
                            "type": "InitializeVariable"
                        },
                        "var_ase_name_split": {
                            "inputs": {
                                "variables": [
                                    {
                                        "name": "ase_name_split",
                                        "type": "string",
                                        "value": "@{split(variables('link_to_azure_resource'),'/')}"
                                    }
                                ]
                            },
                            "runAfter": {
                                "var_link_to_azure_resource": [
                                    "Succeeded"
                                ]
                            },
                            "type": "InitializeVariable"
                        },
                        "var_ase_name_split_array": {
                            "inputs": {
                                "variables": [
                                    {
                                        "name": "ase_name_split_array",
                                        "type": "array",
                                        "value": "@json(variables('ase_name_split'))"
                                    }
                                ]
                            },
                            "runAfter": {
                                "var_ase_name_split": [
                                    "Succeeded"
                                ]
                            },
                            "type": "InitializeVariable"
                        },
                        "var_link_to_azure_resource": {
                            "inputs": {
                                "variables": [
                                    {
                                        "name": "link_to_azure_resource",
                                        "type": "string",
                                        "value": "@{body('Filter_array_url_link_split_array')[0]}"
                                    }
                                ]
                            },
                            "runAfter": {
                                "Filter_array_url_link_split_array": [
                                    "Succeeded"
                                ]
                            },
                            "type": "InitializeVariable"
                        },
                        "var_resource_group_name": {
                            "inputs": {
                                "variables": [
                                    {
                                        "name": "resource_group_name",
                                        "type": "string",
                                        "value": "@{variables('ase_name_split_array')[8]}"
                                    }
                                ]
                            },
                            "runAfter": {
                                "var_ase_name": [
                                    "Succeeded"
                                ]
                            },
                            "type": "InitializeVariable"
                        },
                        "var_subscription_id": {
                            "inputs": {
                                "variables": [
                                    {
                                        "name": "subscription_id",
                                        "type": "string",
                                        "value": "@{variables('ase_name_split_array')[6]}"
                                    }
                                ]
                            },
                            "runAfter": {
                                "var_resource_group_name": [
                                    "Succeeded"
                                ]
                            },
                            "type": "InitializeVariable"
                        },
                        "var_url_link_split": {
                            "inputs": {
                                "variables": [
                                    {
                                        "name": "url_link_split",
                                        "type": "string",
                                        "value": "@{split(triggerBody()?['data']?['alertContext']?['properties']?['communication'],'\"')}"
                                    }
                                ]
                            },
                            "runAfter": {
                                "Condition_check_if_notification_contains_App_Service_Environment": [
                                    "Succeeded"
                                ]
                            },
                            "type": "InitializeVariable"
                        },
                        "var_url_link_split_array": {
                            "inputs": {
                                "variables": [
                                    {
                                        "name": "url_link_split_array",
                                        "type": "array",
                                        "value": "@json(variables('url_link_split'))"
                                    }
                                ]
                            },
                            "runAfter": {
                                "var_url_link_split": [
                                    "Succeeded"
                                ]
                            },
                            "type": "InitializeVariable"
                        }
                    },
                    "contentVersion": "1.0.0.0",
                    "outputs": {},
                    "parameters": {
                        "$connections": {
                            "defaultValue": {},
                            "type": "Object"
                        },
                        "parm_logicapp_EmailAddress": {
                            "defaultValue": {},
                            "type": "String"
                        }
                    },
                    "triggers": {
                        "manual": {
                            "inputs": {
                                "schema": {
                                    "properties": {
                                        "data": {
                                            "properties": {
                                                "alertContext": {
                                                    "properties": {
                                                        "ResourceType": {},
                                                        "authorization": {},
                                                        "caller": {},
                                                        "channels": {
                                                            "type": "integer"
                                                        },
                                                        "claims": {},
                                                        "correlationId": {
                                                            "type": "string"
                                                        },
                                                        "eventDataId": {
                                                            "type": "string"
                                                        },
                                                        "eventSource": {
                                                            "type": "integer"
                                                        },
                                                        "eventTimestamp": {
                                                            "type": "string"
                                                        },
                                                        "httpRequest": {},
                                                        "level": {
                                                            "type": "integer"
                                                        },
                                                        "operationId": {
                                                            "type": "string"
                                                        },
                                                        "operationName": {
                                                            "type": "string"
                                                        },
                                                        "properties": {
                                                            "properties": {
                                                                "IsSynthetic": {
                                                                    "type": "string"
                                                                },
                                                                "communication": {
                                                                    "type": "string"
                                                                },
                                                                "communicationId": {
                                                                    "type": "string"
                                                                },
                                                                "communicationRouteType": {
                                                                    "type": "string"
                                                                },
                                                                "defaultLanguageContent": {
                                                                    "type": "string"
                                                                },
                                                                "defaultLanguageTitle": {
                                                                    "type": "string"
                                                                },
                                                                "emailTemplateFullVersion": {
                                                                    "type": "string"
                                                                },
                                                                "emailTemplateId": {
                                                                    "type": "string"
                                                                },
                                                                "emailTemplateLocale": {
                                                                    "type": "string"
                                                                },
                                                                "impactCategory": {
                                                                    "type": "string"
                                                                },
                                                                "impactMitigationTime": {
                                                                    "type": "string"
                                                                },
                                                                "impactStartTime": {
                                                                    "type": "string"
                                                                },
                                                                "impactType": {
                                                                    "type": "string"
                                                                },
                                                                "impactedServices": {
                                                                    "type": "string"
                                                                },
                                                                "impactedServicesTableRows": {
                                                                    "type": "string"
                                                                },
                                                                "incidentType": {
                                                                    "type": "string"
                                                                },
                                                                "isHIR": {
                                                                    "type": "string"
                                                                },
                                                                "maintenanceId": {
                                                                    "type": "string"
                                                                },
                                                                "region": {
                                                                    "type": "string"
                                                                },
                                                                "service": {
                                                                    "type": "string"
                                                                },
                                                                "smsText": {
                                                                    "type": "string"
                                                                },
                                                                "stage": {
                                                                    "type": "string"
                                                                },
                                                                "title": {
                                                                    "type": "string"
                                                                },
                                                                "trackingId": {
                                                                    "type": "string"
                                                                },
                                                                "version": {
                                                                    "type": "string"
                                                                }
                                                            },
                                                            "type": "object"
                                                        },
                                                        "status": {
                                                            "type": "string"
                                                        },
                                                        "subStatus": {},
                                                        "submissionTimestamp": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                },
                                                "essentials": {
                                                    "properties": {
                                                        "alertContextVersion": {
                                                            "type": "string"
                                                        },
                                                        "alertId": {
                                                            "type": "string"
                                                        },
                                                        "alertRule": {
                                                            "type": "string"
                                                        },
                                                        "alertTargetIDs": {
                                                            "items": {
                                                                "type": "string"
                                                            },
                                                            "type": "array"
                                                        },
                                                        "description": {
                                                            "type": "string"
                                                        },
                                                        "essentialsVersion": {
                                                            "type": "string"
                                                        },
                                                        "firedDateTime": {
                                                            "type": "string"
                                                        },
                                                        "monitorCondition": {
                                                            "type": "string"
                                                        },
                                                        "monitoringService": {
                                                            "type": "string"
                                                        },
                                                        "originAlertId": {
                                                            "type": "string"
                                                        },
                                                        "severity": {
                                                            "type": "string"
                                                        },
                                                        "signalType": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "type": "object"
                                                }
                                            },
                                            "type": "object"
                                        }
                                    },
                                    "type": "object"
                                }
                            },
                            "kind": "Http",
                            "type": "Request"
                        }
                    }
                },
                "parameters": {
                    "$connections": {
                        "value": {
                            "office365": {
                                "connectionId": "[parameters('connections_office365_connectionid')]",
                                "connectionName": "[parameters('connections_office365_name')]",
                                "id": "[parameters('connections_office365_id')]"
                            }
                        }
                    },
                    "parm_logicapp_EmailAddress": {
                        "value": "[parameters('EmailAddress')]"
                    }
                }
            }
        }
    ]
}
```

Save the file using ctrl+s command and ctrl+q to close the file

**Logic App ARM Parameters file.**

This *echo* command will create for you parameters_scenario1.json file.

```bash
echo '{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "logicapp_name": {
            "value": "'"$LogicAppName"'"
        },
        "ASEsubscriptionID": {
            "value": "'"$ASEsubscriptionID"'"
        },
        "ASEResourceGroupNamePROD": {
            "value": "'"$ASEResourceGroupNamePROD"'"
        },
        "connections_office365_name": {
            "value": "office365"
        },
        "EmailAddress": {
            "value": "'"$EmailAddress"'"
        }
    }
}' > parameters_scenario1.json
```

>**Tip** If you deploy your Logic App to the same subscription and resource group as the App Service Environment and you don't want to change Office365 connection name you can remove ASEsubscriptionID, ASEResourceGroupNamePROD and connections_office365_name parameters from the parameters.json file.

The code without subscription, resource group and connections_office365_name parameters.

```bash
echo '{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "logicapp_name": {
            "value": "'"$LogicAppName"'"
        },
        "EmailAddress": {
            "value": "'"$EmailAddress"'"
        }
    }
}' > parameters_scenario1.json
```

You can use *code* editor in Azure Cloud Shell to check parameters_scenario1.json file.

```bash
code parameters_scenario1.json
```

Use ctrl+q to close the file

### Deploy logic app template

```bash
az deployment group create --name MyLogicAppDeployment --resource-group $ASEResourceGroupNamePROD  --template-file template_scenario1.json --parameters parameters_scenario1.json
```

### Authorize Office 365 connection

Before you can use Office 365 connector in Logic App you must authorize Office365 connection.

1. Open Azure portal [Azure Portal](https://portal.azure.com), sign in with your credentials
2. Go to your Logic App using for example search box at the top
3. Click *API connections* and then select *office365* API Connection
4. Check the status, if status is *Connected* everything is ok if is *Unauthorized* click *Edit API connection* and then click *Authorize* button
5. Sign in to your account
6. Click *Save* button

**Check out the logic app via Logic app designer:**

1. Open Azure portal [Azure Portal](https://portal.azure.com), sign in with your credentials
2. Go to your Logic App using for example search box at the top
3. Click *Logic app designer*
4. Familiarize yourself with the individual steps of Logic App workflow

![Logic App Designer]({{site.baseurl}}/media/2022/09/logic-app-designer.png){: .align-center}

More information about Logic App you can find on this site [Logic App Overview](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview)

**Steps to assign an Azure role contributor to App Service Environment instance:**

Your Logic App will be deployed with system assigned managed identity, before you can use your Logic App you must give your Logic App identity permission to your App Service Environment.  If you want to know more about managed identities please go to this page [Managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview). Information about permissions that you need to configure managed identity you can find on this page [Managed identities for Azure resources frequently asked questions](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/managed-identities-faq#which-azure-rbac-permissions-are-required-to-use-a-managed-identity-on-a-resource).

Step1: Determine who needs access

```bash
LogicAppIdentity=$(az resource show --name $LogicAppName --resource-group $ASEResourceGroupNamePROD --resource-type "Microsoft.Logic/workflows" --query identity.principalId -o tsv)
```

Step2: Assign contributor role

```bash
az role assignment create --assignee $LogicAppIdentity --role "Contributor" --scope /subscriptions/$ASEsubscriptionID/resourceGroups/$ASEResourceGroupNamePROD/providers/Microsoft.Web/hostingEnvironments/$ASENamePROD
```

If you are at this stage, you have successfully created the demo environment, now we need to create an alert that will trigger the Logic App.

## Create an Alert

1. Open Azure Portal [Azure Portal](https://portal.azure.com), sign in with your credentials
2. Go to *Monitor* using for example search box at the top
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
    - select *Resource group* where you deployed your App Service Environment
    - Select *Global Region*
    - Fill the filed *Action group name* and *Display name* for example use this name *ag-asedemo* - please change *asedemo* to your environment name
13. In the *Actions* section, click *Action type* and select *Logic App*
14. Fill the fields with information about *Subscription* (select Azure Subscription where you deployed your App Service Environment), *Resource group* (select Azure Resource group where you deployed your App Service Environment) and *Select a logic app* that you deployed in previous steps
15. *Enable the common alert schema*
16. Click "OK"
17. Fill the *Name* filed for example use this name *action-logic-asedemo-prod-01* - please change *asedemo* to your environment name
18. Click *Review + create*
19. Click *Create*
20. Fill *Alert rule details* section, fill *Alert rule name* for example use this name *alert-asedemo-planned-maintenance* - please change *asedemo* to your environment name
21. Make sure that checkbox *Enable alert rule upon creation* is selected
22. Click *Create alert rule*

### Send test notifications

As you build your automation and notification logic, you may want to test it before the actual upgrade is available. The Azure portal and rest api has the ability to send a special test upgrade available notification, which you can use to verify your automation logic. The message will be similar to the real notification, but the title will be prefixed with "[Test]" and the description will be different. You can send test notifications after you've configured your upgrade preference to Manual. The test notifications are sent in batches every 15 minutes.

To send a special test upgrade available notification please use this command

```bash
ASEidPROD=$(az appservice ase show --name $ASENamePROD --resource-group $ASEResourceGroupNamePROD --query id --output tsv)
az rest --method POST --uri "${ASEidPROD}/testUpgradeAvailableNotification?api-version=2022-03-01"
```

**Check your mailbox and approve upgrade process.**

Because this is test notification your Logic app will send you a email with information that *App Service Environment NameOfYourASE does not currently have an upgrade available.* In a real-world scenario when an upgrade will be available your Logic App will send you information that *The update of NameOfYourASE has started.*

### Familiarize yourself with the Logic app run using Run history blade

1. Open Azure Portal [Azure Portal](https://portal.azure.com), sign in with your credentials
2. Go to your Logic App using for example search box at the top
3. Click *Overview*
4. Click *Run history*
5. Select last *Succeeded* Logic app run
6. Familiarize yourself with the Logic app run

You successfully completed the first scenario. The second scenario will be published soon.
