---
title: "What's new for Azure App Service in Azure PowerShell: September-November 2026"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

[Azure PowerShell Az 16.5.0](https://github.com/Azure/azure-powershell/releases/tag/v16.5.0-November2026) adds App Service plan controls for asynchronous scaling and PowerShell management of Managed Instance on Azure App Service. Together with the September and October releases, these updates bring Isolated v4 plan support and a newer Microsoft.Web management API to your App Service automation.

This recap covers the latest three monthly release batches. The App Service cmdlets are in the `Az.Websites` module:

| Monthly release | Az version | Az.Websites version | App Service updates |
| --- | --- | --- | --- |
| September | [16.3.0](https://github.com/Azure/azure-powershell/releases/tag/v16.3.0-September2026) | 4.1.0 | Isolated v4 and memory-optimized Isolated v4 plans |
| October | [16.4.0](https://github.com/Azure/azure-powershell/releases/tag/v16.4.0-October2026) | 4.2.0 | Microsoft.Web API version 2025-05-01 |
| November | [16.5.0](https://github.com/Azure/azure-powershell/releases/tag/v16.5.0-November2026) | 4.3.0 | Managed Instance management and asynchronous scaling |

## Allow scaling to proceed asynchronously when capacity is constrained

`New-AzAppServicePlan` and `Set-AzAppServicePlan` now accept `-AsyncScalingEnabled`. For dedicated App Service plans, setting it to `$true` allows the service to use an asynchronous scaling operation when there aren't enough workers to scale synchronously.

For example, enable the setting and request two workers for an existing dedicated plan:

```powershell
Set-AzAppServicePlan `
    -ResourceGroupName "<resource-group>" `
    -Name "<app-service-plan>" `
    -AsyncScalingEnabled $true `
    -NumberofWorkers 2
```

Use `-AsyncScalingEnabled $false` to disable the setting. Omitting it from an update preserves the existing value, including when a plan is passed through the pipeline.

**Asynchronous scaling is not background execution.** The setting controls how App Service handles scaling; the cmdlet still waits for the operation to complete. Use the separate `-AsJob` switch when you want PowerShell to run the cmdlet as a background job. Enabling asynchronous scaling doesn't configure autoscale rules or guarantee that capacity is immediately available.

## Manage Windows application dependencies at the plan level

Managed Instance on Azure App Service is generally available for Windows web apps that need operating system customization, such as COM components, MSI installers, or registry configuration. The November release adds PowerShell support for creating and configuring these plans, so you can include their infrastructure dependencies in the same automation as the rest of your App Service deployment.

Create a Managed Instance plan with a system-assigned managed identity:

```powershell
New-AzAppServicePlan `
    -ResourceGroupName "<resource-group>" `
    -Name "<managed-instance-plan>" `
    -Location "<supported-region>" `
    -Tier PremiumV4 `
    -WorkerSize Small `
    -ManagedInstance `
    -AssignIdentity $true `
    -DefaultIdentity "[system]"
```

Managed Instance supports Premium v4 and memory-optimized Premium v4 plans in select regions. It doesn't support Linux, containers, App Service Environments, or per-site scaling. Check the [Managed Instance overview](https://learn.microsoft.com/azure/app-service/overview-managed-instance) for current regional availability and platform requirements.

Both `New-AzAppServicePlan` and `Set-AzAppServicePlan` now expose plan-level managed identities, installation scripts, storage mounts, registry adapters, virtual network integration, and RDP settings. Use installation scripts for customizations that must survive worker restarts and platform maintenance; interactive RDP changes aren't persistent configuration.

When updating an existing plan, omitted settings are preserved. Collection parameters such as `-InstallScript`, `-StorageMount`, and `-RegistryAdapter` replace the entire corresponding collection. Retrieve the current plan and merge the entries you want to retain before passing an updated collection. An empty array clears that collection.

### Diagnose and recycle individual workers

Three new cmdlets support Managed Instance operations:

| Cmdlet | Purpose |
| --- | --- |
| `Get-AzAppServicePlanManagedInstance` | Retrieve worker names, private IP addresses, and statuses; optionally select a worker with `-InstanceName` |
| `Restart-AzAppServicePlanManagedInstance` | Request recycling of one worker, with `-WhatIf` support |
| `Get-AzAppServicePlanRdpCredential` | Retrieve RDP credentials as a `PSCredential` object |

For a plan with RDP enabled and the required virtual network and Azure Bastion configuration, retrieve worker details and store the credentials without displaying the password:

```powershell
Get-AzAppServicePlanManagedInstance `
    -ResourceGroupName "<resource-group>" `
    -Name "<managed-instance-plan>"

$credential = Get-AzAppServicePlanRdpCredential `
    -ResourceGroupName "<resource-group>" `
    -Name "<managed-instance-plan>"
```

The credential cmdlet doesn't create a Bastion tunnel or launch an RDP client. Treat the returned credential as sensitive information. See [Configure Managed Instance](https://learn.microsoft.com/azure/app-service/configure-managed-instance) for identity permissions, script prerequisites, and Bastion networking requirements.

Preview a recycle request using a worker name returned by the discovery cmdlet:

```powershell
Restart-AzAppServicePlanManagedInstance `
    -ResourceGroupName "<resource-group>" `
    -Name "<managed-instance-plan>" `
    -InstanceName "<worker-name>" `
    -WhatIf
```

Remove `-WhatIf` to submit the request. Recycling can interrupt applications on that worker. The cmdlet returns after the service accepts the request, not when the worker is ready again; `-PassThru` reports acceptance rather than recovery. Use the instance-discovery cmdlet to check worker status afterward.

## Create Isolated v4 plans in an App Service Environment

The September release adds `IsolatedV4` and `IsolatedMV4` tier support to `New-AzAppServicePlan` and `Set-AzAppServicePlan`. This lets you select the newer isolated compute options, including memory-optimized sizes, from your PowerShell provisioning scripts.

For example, create an I1V4 plan in an existing App Service Environment v3:

```powershell
New-AzAppServicePlan `
    -ResourceGroupName "<resource-group>" `
    -Name "<app-service-plan>" `
    -Location "<ase-region>" `
    -AseName "<app-service-environment>" `
    -Tier IsolatedV4 `
    -WorkerSize Small
```

The example assumes the environment is in the same resource group; use `-AseResourceGroupName` when it is in another resource group.

For `IsolatedV4`, worker sizes `Small` through `ExtraExtraExtraLarge` map to I1V4 through I6V4. For `IsolatedMV4`, `Small` through `ExtraExtraLarge` map to I1MV4 through I5MV4. Use `Set-AzAppServicePlan` with the tier and worker size to update an existing plan.

The selected SKU must be supported by your region and underlying App Service Environment deployment. Capacity is constrained, and Windows containers have additional size restrictions in some regions. Review [Isolated v4 availability and capacity guidance](https://learn.microsoft.com/azure/app-service/environment/app-service-configure-isolated-v4-tier) before provisioning or scaling.

## Use the updated Microsoft.Web management API

The October release updates `Az.Websites` from Microsoft.Web API version `2021-01-15` to `2025-05-01`. The November plan-management additions build on this newer API surface.

This is an update to the module's management client, not a requirement to change your application's runtime or deployment API version. Microsoft.CertificateRegistration and Microsoft.DomainRegistration remain on API version `2021-01-15`. A newer management API also doesn't mean every service capability has a dedicated PowerShell parameter; use the documented cmdlet options for each operation.

## Get the release

Use Az 16.5.0 / Az.Websites 4.3.0 or later for all the capabilities in this recap. Update using the same installation method you originally used. For a PowerShellGet-based installation:

```powershell
Update-Module -Name Az
```

Start a new PowerShell session after updating, then check the available App Service module versions:

```powershell
Get-Module -ListAvailable Az.Websites |
    Select-Object Name, Version
```
