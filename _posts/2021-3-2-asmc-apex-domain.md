---
title: "App Service Managed Certificate (Preview) Now Supports Apex Domains"
author_name: "Yutang Lin"
toc: true
toc_sticky: true
tags: certsdomains
---

App Service Managed Certificate (preview) now lets you secure your apex domains on your web apps at no additional charge. This feature is similar to the current App Service Managed Certificate sub-domain support where you can create a standard certificate valid for six months and will automatically renew a month prior expiration. You will need to separately create an App Service Managed Certificate for each domain; wildcard certificate is not supported for this feature.

## Getting started

### Prior creating an App Service Managed Certificate
Before you can create an App Service Managed Certificate, you need to [add an apex domain to your web app by mapping an A record and TXT record to your web app](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain#map-an-a-record). 

### Requirements to successfully create an App Service Managed Certificate <a name="success-requirements"></a>
The validation used by the apex domain support is HTTP token validation, so you want to make sure that you have the following set up, otherwise your certificate validation will fail:
1. You have the correct A record set in your DNS record
1. Your web app is accessible by public internet 
    - You cannot validate your certificate if your web app is not accessible by public internet.

### Creating an App Service Managed Certificate
In the Azure Portal, head to your web app and from the left navigation of your app, select **TLS/SSL settings > Private Key Certificates (.pfx) > Create App Service Managed Certificate**.

![Create-Managed-Cert-Portal]({{site.baseurl}}/media/2021/01/create-managed-cert.png){: .align-center}

Select an apex domain from the drop down menu and click "Create". It may take up to a few minutes to issue a managed certificate for your apex domain.

![Create-Managed-Cert-Apex-Domain-Portal]({{site.baseurl}}/media/2021/01/create-managed-cert-apex-domain.png){: .align-center}

Once you get a notification of successfully creating a managed certificate, you will see the certificate in the list of "Private Key Certificates". Try to refresh the page if you don't see it on the list despite getting a successful notification.

## FAQ
1. I'm getting "Web app is not accessible by public network" error. What does this mean?

    In order to pass the HTTP token validation, your web app needs to be accessible. If your web app has network restrictions, the HTTP token validation will fail.

1. Does this have CLI or Powershell support? How can I automate the create process?

    Currently, there is no first class CLI and Powershell support to create a managed certificate for apex domains. However, if you need to automate the process, you can try using ARM template. Refer to the [automate with scripts](#automate-with-scripts) section of the article.

1. Does this work with Traffic Manager?

    Since this uses HTTP token validation, the validation might not work with Traffic Manager, especially if you have several endpoints enabled. If you create a certificate and then enable other endpoints, you might encounter issues during your certificate renewal.

1. Is it expected that the managed certificate for apex domain to take a bit longer to issue than for sub-domain?

    Yes, your App Service Managed Certificate for apex domain will take a bit longer to issue than for sub-domain because it uses a different validation method.


## Automate with scripts <a name="automate-with-scripts"></a>
You can create an App Service Managed Certificate for your apex domain using ARM Template. Below is a sample of using a Powershell script to run your ARM template. This script will only create an App Service Managed Certificate for a domain that has already been added to your web app. 

### Powershell script to run ARM template
```
#Connect-AzureRmAccount

$subscription = "SUBSCRIPTION-ID"
$resourceGroupName = "RESOURCE-GROUP-NAME"
$appServicePlanName = "APP-SERVICE-PLAN-NAME"
$subjectName = "DOMAIN-NAME"

Set-AzureRmContext -SubscriptionId $subscription

$appServicePlan = Get-AzureRmResource `
    | Where-Object {$_.ResourceGroupName -eq $resourceGroupName } `
    | Where-Object {$_.Name -eq $appServicePlanName}

New-AzureRMResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -SubjectName $subjectName `
    -AppServicePlanName $appServicePlanName `
    -Location $appServicePlan.Location `
    -TemplateFile "CreateHttpFreeCert.json" 

```

### ARM template
```
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "SubjectName": {
            "type": "string",
            "metadata": {
                "description": "Subject name of the certificate."
            }
        },
        "AppServicePlanName": {
            "type": "string",
            "metadata": {
                "description": "App Service Plan Name where certificate will be imported to."
            }
        },
        "Location": {
            "type": "string",
            "metadata": {
                "description": "Location of app service plan."
            }
        }
    },
    "resources": [
        {
            "apiVersion": "2019-08-01",
            "location": "[parameters('Location')]",
            "name": "[concat(parameters('SubjectName'), '-', parameters('AppServicePlanName'), '-', parameters('Location'))]",
            "type": "Microsoft.Web/certificates", 
            "properties": {
                "serverFarmId": "[resourceId('Microsoft.Web/serverfarms/', parameters('AppServicePlanName'))]",
                "canonicalName": "[parameters('SubjectName')]",
                "domainValidationMethod":"http-token"
            }
        }
    ]
}
```