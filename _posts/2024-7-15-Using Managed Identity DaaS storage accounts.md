---
title: "Managed Identity Support for Storage Account used in Diagnostics under Diagnose and Solve blade"
author_name: "Puneet Gupta"
category: 'Diagnostics'
---

We are pleased to announce **Managed Identity** support for authenticating against storage accounts used for diagnostic tools under Diagnostics and a Service. This feature allows the use of both system-assigned and user-assigned managed identities as authentication mechanisms for connecting to storage accounts where memory dumps and other diagnostic data are stored.

### Key Benefits
- Enhanced Security: Managed Identity enhances security by eliminating the need for Key-based authentication on the storage account.
- Compatibility: Managed Identity for storage accounts can be used with applications hosted on both Windows and Linux App Service plans.

### Usage Details
In the Diagnose and Solve blade for a web app, navigate to the **Diagnostic Tools** category and select the **Collect Memory Dump** option. Here, you will see the **Authentication** setting, under the storage account name, which displays the authentication method used to connect to the storage account. If your application is preconfigured with a storage account, you might encounter a warning indicating the use of **Account Key or SAS** based authentication to connect to the storage account.

> ![]({{site.baseurl}}/media/2024/07/daas-storage-account.png)

When you click **Change**, you can select from the managed identities already configured on the app.

> ![]({{site.baseurl}}/media/2024/07/daas-storage-choose-msi.png)

Upon hitting Save, the chosen user identity will be added to the following access roles on the storage account:
- Storage Blob Data Contributor
- Storage Table Data Contributor
- Storage Queue Data Contributor

> ![]({{site.baseurl}}/media/2024/07/daas-storage-after-msi.png)

From this point forward, the diagnostic service will use this managed identity to connect to the configured storage account. You can then disable Key-based authentication by adjusting the settings of the storage account.


### Automating via PowerShell
Below is a sample script demonstrating how to update the storage account authentication for an Azure Web App to use Managed Service Identity (MSI). The script updates the storage account configuration for the web app and all its slots.

> Disclaimer - This script is provided for illustration purposes only. Please test it on a staging or test app before applying it to a production web app.

```powershell
$SubscriptionId = "<Your_Subscription_Id>"

# Specify Managed Identity Name and resource group
$managedIdentityName = '<ManagedIdentityName>'
$managedIdentityResourceGroup = '<ManagedIdentityResourceGroup>'

# Specify Storage account name and resource group
$storageAccountName = '<StorageAccountName>'
$storageAccountResourceGroup = '<StorageAccountResourceGroup>'

# Specify web app name and resource group
$webAppName = "<WebAppName>"
$webAppResourceGroupName = "<WebAppResourceGroup>"

function addRole {
    param(
        [string] $storageAccountResourceId,
        [string] $managedIdentityPrincipalId,
        [string] $roleId,
        [string] $roleName
    )

    $accountName = $storageAccountResourceId.Split('//')[-1]
    "Adding [$roleName] for principal [$managedIdentityPrincipalId] to account - " + $accountName

    $roleAssignmentId = [guid]::NewGuid()
    $ResourceUri = "https://management.azure.com/" + $storageAccountResourceId 
    $ResourceUri = $ResourceUri + "/providers/Microsoft.Authorization/roleAssignments/$roleAssignmentId"
    $ResourceUri = $ResourceUri + "?api-version=2022-04-01"

    $Body = @{
      properties = @{
        principalId = "$managedIdentityPrincipalId"
        roleDefinitionId = "$storageAccountResourceId/providers/Microsoft.Authorization/roleDefinitions/$roleId"
        }
    } | ConvertTo-Json -Depth 3

    try {
    Invoke-RestMethod -Uri $ResourceUri -Headers $Headers -Body $Body -Method PUT
    }
    catch{
       $responseError = $_.ErrorDetails.Message
       if ($responseError.Contains("The role assignment already exists")){
        Write-Host "The [$managedIdentityPrincipalId] already exists in [$roleName] on [$accountName]"
       } else {
        throw
       }
    }
}

# Login to Azure if not already logged in
if (-not (Get-AzContext)) {
    Connect-AzAccount  
}

Set-AzContext -Subscription $SubscriptionId | Out-Null
$context = Get-AzContext

$managedIdentity = Get-AzUserAssignedIdentity -ResourceGroupName $managedIdentityResourceGroup -Name $managedIdentityName
$Identity = $managedIdentity.Id
"Managed Identity Id is " + $Identity

# Get the access token
$AzureRmProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile  
$ProfileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($AzureRmProfile)  
$Token = $ProfileClient.AcquireAccessToken($context.Subscription.TenantId)

# Prepare the header with the Bearer token  
$Headers = @{  
    'Authorization' = 'Bearer ' + $Token.AccessToken  
    'Content-Type' = 'application/json'  
}

$account = Get-AzStorageAccount -Name $storageAccountName -ResourceGroupName $storageAccountResourceGroup
$storageAccountResourceId = $account.Id

#https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles
addRole -storageAccountResourceId $account.Id -managedIdentityPrincipalId $managedIdentity.PrincipalId -roleId "ba92f5b4-2d11-453d-a403-e96b0029c9fe" -roleName "Storage Blob Data Contributor"
addRole -storageAccountResourceId $account.Id -managedIdentityPrincipalId $managedIdentity.PrincipalId -roleId "0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3" -roleName "Storage Table Data Contributor"
addRole -storageAccountResourceId $account.Id -managedIdentityPrincipalId $managedIdentity.PrincipalId -roleId "974c5e8b-45b9-4653-ba55-5f855dd0fb88" -roleName "Storage Queue Data Contributor"

"Getting WebApp app settings"
$webApp = Get-AzWebApp -ResourceGroupName $webAppResourceGroupName -Name $webAppName
$appSettings=$webApp.SiteConfig.AppSettings

$newAppSettings = @{}
foreach ($item in $appSettings)
{
    $newAppSettings[$item.Name] = $item.Value
}

$connectionString = "DefaultEndpointsProtocol=https;AccountName=$($account.StorageAccountName);ManagedIdentityClientId=$($managedIdentity.ClientId);EndpointSuffix=core.windows.net"
$newAppSettings['WEBSITE_DAAS_STORAGE_CONNECTIONSTRING'] = $connectionString
 
"Updating AppSettings for " + $webApp.Name
Set-AzWebApp -ResourceGroupName $webAppResourceGroupName -Name $webApp.Name -AppSettings $newAppSettings | Out-Null
"App Setting updated"

"Getting slots for " + $webApp.Name
$slots = @()
$slotsWebApp = Get-AzWebAppSlot -ResourceGroupName $webAppResourceGroupName -Name $webApp.Name
if ($slotsWebApp -ne $null -and $slotsWebApp.Name -ne $null) {
    $slotName = $slotsWebApp.Name.Split('/')[1]
    $slots += $slotName
}

foreach ($slotName in $slots) {
    $slotWebApp = Get-AzWebAppSlot -ResourceGroupName $webAppResourceGroupName -Name $webApp.Name -Slot $slotName
    $appSettingsSlot =$slotWebApp.SiteConfig.AppSettings
    $newAppSettingsSlot = @{}

    foreach($item in $appSettingsSlot){
        $newAppSettingsSlot[$item.Name] = $item.Value
    }

    $newAppSettingsSlot['WEBSITE_DAAS_STORAGE_CONNECTIONSTRING'] = $connectionString
    "Updating AppSettings for " + $webApp.Name + "($slotName)"
    Set-AzWebAppSlot -ResourceGroupName $webAppResourceGroupName -Name $webApp.Name -AppSettings $newAppSettingsSlot -Slot $slotName | Out-Null
    "AppSettings updated for " + $webApp.Name + "($slotName)"
}
```