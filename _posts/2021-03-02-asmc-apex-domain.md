---
title: "App Service Managed Certificate (Preview) Now Supports Apex Domains"
author_name: "Yutang Lin"
toc: true
toc_sticky: true
category: certsdomains
---

App Service Managed Certificate (preview) now lets you secure your apex domains on your web apps at no additional charge. This feature is similar to the current App Service Managed Certificate sub-domain support where you can create a standard certificate valid for six months which will automatically renew around 45 days before expiration. Your TLS/SSL bindings will also be automatically updated. If you have several domains, you will need to separately create an App Service Managed Certificate for each of them; wildcard certificate is not supported for this feature.

## Getting started

### Pre-requisites <a name="pre-reqs"></a>
App Service Managed Certificates for apex domains are validated with HTTP token validation which App Service will set up on your behalf. However, to ensure a successful create and renewal validation, you want to make sure that you have the following set up, otherwise your certificate validation will fail.

1. [Add an apex domain to your web app by mapping an A record and TXT record to your web app](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain#map-an-a-record). 
1. Your web app must be accessible from the public network and does not have any [IP restrictions](https://docs.microsoft.com/en-us/azure/app-service/app-service-ip-restrictions) set up. You cannot validate your certificate if your web app is not accessible from the public network. **Adding IP restrictions after creating a certificate will cause renewal to fail.**

### Creating an App Service Managed Certificate
Before creating a managed certificate, make sure you have met the [pre-requisites](#pre-reqs). In the Azure Portal, head to your web app and from the left navigation menu of your app, select **TLS/SSL settings** > **Private Key Certificates (.pfx)** > **Create App Service Managed Certificate**.

![Create-Managed-Cert-Portal]({{site.baseurl}}/media/2021/03/create-managed-cert.png){: .align-center}

A blade will show up on the right side of the page. In that blade, select an apex domain from the drop down menu and click "Create". It may take up to a few minutes to create a managed certificate for your apex domain.

![Create-Managed-Cert-Apex-Domain-Portal]({{site.baseurl}}/media/2021/03/create-managed-cert-apex-domain.png){: .align-center}

Once you get a notification that the managed certificate was created successfully, you will see the certificate on the list of "Private Key Certificates". If you close the blade before getting a successful notification or if you do not see the newly created managed certificate, refresh the page and you should see the new certificate on the list. 

## FAQ

1. **Q:** I'm getting "Web app is not accessible by public network" error. What does this mean?

    **A:** In order to pass the HTTP token validation, your web app needs to be accessible from public network. If your web app has network restrictions, the HTTP token validation will fail.

1. **Q:** I am getting the following error on portal when validating my domain with a country code top-level domain (ccTLD): `Properties.CanonicalName is invalid. Canonical name XXXXX is not a subdomain. This validation method only supports subdomains`. How can I fix this?

    **A:** If you are encountering this error with your apex domain, try creating a certificate with the [script](#automate-with-scripts) below.

1. **Q:** Does this have CLI or Powershell support? How can I automate the create process?

    **A:** Currently, there is no first class CLI and Powershell support to create a managed certificate for apex domains. However, if you need to automate the process, you can try using ARM template. Refer to the [automate with scripts](#automate-with-scripts) section of the article.

1. **Q:** Is this supported when using alias record for my apex domain referencing Traffic Manager?

    **A:** This scenario is **not** supported. Since managed certificates for apex domain uses HTTP token validation, the validation can fail if the web app itself isn't reached during certificate create/renew validation. Do not create a managed certificate for this scenario.

1. **Q:** Is it expected that the managed certificate for apex domain to take a bit longer to create than for sub-domain?

    **A:** Yes, your App Service Managed Certificate for apex domain will take a bit longer to create than for sub-domain because it uses a different validation method.

## Automate with scripts <a name="automate-with-scripts"></a>

You can create an App Service Managed Certificate for your apex domain using ARM Template. Below is a sample of using a Powershell script to run your ARM template. This script will only create an App Service Managed Certificate for a custom domain that has already been added to your web app. If you run this script before adding a custom domain to the web app, the script will fail.

### Powershell script to run ARM template

```ps
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

```json
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
