---
title: "Deploying Azure Web App Certificate through Key Vault"
author_name: "akurmi"
layout: single
excerpt: "How to deploy an App Service Certificate through Azure Key Vault"
---

As part of [App Service Certificate (ASC)](https://azure.microsoft.com/en-us/blog/internals-of-app-service-certificate/) offering, we now support certificate deployment through Azure Key Vault (AKV). ASC stores the private certificate into a user provided Key Vault Secret (KVS). When an ASC is deployed into a Web App, Web App Resource Provider (RP) actually deploys it from the KVS associated with ASC. Essentially, ASC and Web App are loosely connected through Azure Key Vault. If you manually upload a private certificate into a KVS then you can use the same feature for deploying your own certificate into Web App through AKV.

## Prerequisites

In order to use this feature, first you need an Azure Key Vault. This Key Vault needs to be in the same subscription as your web app but it need not be in the same region as your Web App. Web App doesn’t have a runtime dependency on Key Vault. When you deploy a certificate, Web App RP reads it from the KV and caches it in its management database. It need not even be in the same resource group. If you don’t have a KV then you can use the following PowerShell command to create a new one:

```powershell
New-AzureRmKeyVault -VaultName akurmitestvault -ResourceGroupName keyvaulttestrg -Location "eastus2" -Sku standard
```

By default, the Web App RP doesn’t have access to customer KV. In order to use a KV for certificate deployment, you need to authorize the RP by executing the following PowerShell command:

```powershell
Set-AzureRmKeyVaultAccessPolicy -VaultName akurmitestvault -ServicePrincipalName abfa0a7c-a6b6-4736-8310-5855508787cd -PermissionsToSecrets get
```

The RP requires read access to KV. `abfa0a7c-a6b6-4736-8310-5855508787cd` is the RP service principal name and it remains same for all Azure subscriptions. Note for Azure Gov cloud environment you will need to use `6a02c803-dafd-4136-b4c3-5a6f318b4714` as the RP service principal name in the above command instead of ‘abfa0a7c-a6b6-4736-8310-5855508787cd’. Last thing you need is a KVS that contains the PFX certificate you would like to deploy. Before deploying a certificate, the RP performs the following checks on KVS:

- It actually contains a PFX certificate that’s not password protected
- Content type of the secret should be ‘application/x-pkcs12’

You can use the following PowerShell snippet to upload a PFX certificate from your machine into a Key Vault secret:

```powershell
$pfxFilePath = "F:\KeyVault\PrivateCertificate.pfx"
$pwd = "[2+)t^BgfYZ2C0WAu__gw["
$flag = [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable
$collection = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection  
$collection.Import($pfxFilePath, $pwd, $flag)
$pkcs12ContentType = [System.Security.Cryptography.X509Certificates.X509ContentType]::Pkcs12
$clearBytes = $collection.Export($pkcs12ContentType)
$fileContentEncoded = [System.Convert]::ToBase64String($clearBytes)
$secret = ConvertTo-SecureString -String $fileContentEncoded -AsPlainText –Force
$secretContentType = 'application/x-pkcs12'
Set-AzureKeyVaultSecret -VaultName akurmitestvault -Name <strong>keyVaultCert</strong> -SecretValue $Secret -ContentType $secretContentType # Change the Key Vault name and secret name
```

## Deploying Key Vault Certificate into Web App

After completing all prerequisites, now we are ready to deploy the certificate into a Web App. Currently, Azure portal doesn’t support deploying external certificate from Key Vault, you need to call Web App ARM APIs directly using [ArmClient](https://github.com/projectkudu/ARMClient), [Resource Explorer](https://resources.azure.com/), or [Template Deployment Engine](https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-deploy/). I will be using ARMClient for the rest of this blogpost. You can also use Resource Explorer to do everything described below.

We need to find the resource group for certificate resource before calling the ARM APIs as it ideally we should use App Service Plan’s resource group, you can find this from ‘serverFarmId’ property of the site resource:

```txt
ARMClient GET /subscriptions/fb2c25dc-6bab-45c4-8cc9-cece7c42a95a/resourceGroups/Default-Web-EastAsia/providers/Microsoft.Web/sites/appservicecertificatedemo?api-version=2016-03-01`
```

And here is the response:

```json
{
  "id": "/subscriptions/fb2c25dc-6bab-45c4-8cc9-cece7c42a95a/resourceGroups/Default-Web-EastAsia/providers/Microsoft.Web/sites/appservicecertificatedemo",
  "name": "appservicecertificatedemo",
  "type": "Microsoft.Web/sites",
  "location": "<strong>East Asia</strong>",
  ...
    "serverFarmId": "<strong>/subscriptions/fb2c25dc-6bab-45c4-8cc9-cece7c42a95a/resourceGroups/Default-Web-EastAsia/providers/Microsoft.Web/serverfarms/appservicecertificatedemoplan</strong>",
    ...
  }
}
```

Also note the following properties from this response:

- Location since certificate resource needs be created in the same location as server farm.
- ServerFarmId as it would be required to create certificate resource. We would also use the resource group name specified in this resource id.

We also need Key Vault resource URI to deploy the certificate. You can get this value by executing the following PowerShell command:

```powershell
Get-AzureRmKeyVault -VaultName akurmitestvault
Vault Name                       : akurmitestvault
Resource Group Name              : keyvaulttestrg
Location                         : eastus2
Resource ID                      : <strong>/subscriptions/fb2c25dc-6bab-45c4-8cc9-cece7c42a95a/resourceGroups/keyvaulttestrg/providers/Microsoft.KeyVault/vaults/akurmitestvault</strong>
Vault URI                        : https://akurmitestvault.vault.azure.net/
...
```

Once you have these values, you can use the following ARMClient command to upload the certificate into your Web App. Note that in order to call this API, the caller needs to have write access to the Key Vault account specified in the request body.

```txt
ARMClient.exe PUT /subscriptions/<Subscription Id>/resourceGroups/<Server Farm Resource Group>/providers/Microsoft.Web/certificates/<User Friendly Resource Name>?api-version=2016-03-01 "{'Location':'&lt;Web App Location&gt;','Properties':{'KeyVaultId':'<Key Vault Resource Id>', 'KeyVaultSecretName':'<Secret Name>', 'serverFarmId':'<Server Farm (App Service Plan) resource Id>'}}"
```

Here is an example wil my values, yours will be different.

```txt
ARMClient.exe PUT /subscriptions/fb2c25dc-6bab-45c4-8cc9-cece7c42a95a/resourceGroups/Default-Web-EastAsia/providers/Microsoft.Web/certificates/keyvaultcertificate?api-version=2016-03-01 "{'Location':'East Asia','Properties':{'KeyVaultId':'/subscriptions/fb2c25dc-6bab-45c4-8cc9-cece7c42a95a/resourceGroups/keyvaulttestrg/providers/Microsoft.KeyVault/vaults/akurmitestvault', 'KeyVaultSecretName':'keyVaultCert', 'serverFarmId': '/subscriptions/fb2c25dc-6bab-45c4-8cc9-cece7c42a95a/resourceGroups/Default-Web-EastAsia/providers/Microsoft.Web/serverfarms/appservicecertificatedemoplan'}}"
```

And here is the response:

```txt
---------- Request -----------------------
PUT /subscriptions/fb2c25dc-6bab-45c4-8cc9-cece7c42a95a/resourceGroups/Default-Web-EastAsia/providers/Microsoft.Web/certificates/keyvaultcertificate?api-version=2016-03-01 HTTP/1.1
Host: management.azure.com
---------- Response (2997 ms) ------------
{ 
  "id":"/subscriptions/fb2c25dc-6bab-45c4-8cc9-cece7c42a95a/resourceGroups/Default-Web-EastAsia/providers/Microsoft.Web/certificates/keyvaultcertificate",
  "name":"keyvaultcertificate",
  "type":"Microsoft.Web/certificates",
  "location":"East Asia",
  "tags":null,
  "properties":{ 
    "friendlyName":"",
    "subjectName":"appservicecertificatedemo.com",
    "hostNames":[ 
        "appservicecertificatedemo.com"
    ],
    "pfxBlob":null,
    "siteName":null,
    "selfLink":null,
    "issuer":"appservicecertificatedemo.com",
    "issueDate":"2016-05-02T21:09:24-07:00",
    "expirationDate":"2017-05-02T00:00:00-07:00",
    "password":null,
    "thumbprint":"**F454D4277D449D8CD2384B63D7AA2F2F7F3766E4**",
    "valid":null,
    "toDelete":null,
    "cerBlob":null,
    "publicKeyHash":null,
    "hostingEnvironment":null,
    "hostingEnvironmentProfile":null,
    "keyVaultId":"/subscriptions/fb2c25dc-6bab-45c4-8cc9-cece7c42a95a/resourcegroups/keyvaulttestrg/providers/microsoft.keyvault/vaults/akurmitestvault",
    "keyVaultSecretName":"keyvaultcert",
    "webSpace":"eastasiawebspace",
    "tags":null
  }
}
```
