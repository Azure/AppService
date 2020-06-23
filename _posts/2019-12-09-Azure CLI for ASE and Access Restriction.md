---
title: "Azure CLI for ASE and Access Restriction"
author_name: "Mads Damgård"
category: networking
tags: devops
---

Based on customer requests we have added support for automating App Service Environment operations using the Azure CLI. With the 2.0.77 release you can create, list, update, and delete ASEs as well as create App Service Plans for an ASE. You can verify your installed version using `az --version`

The `create` command has a number of options to make provisioning easy. In the default configuration, the command will create the necessary NSG and UDR rules and associate them with the designated subnet.

```bash
az appservice ase create --resource-group myResourceGroup --name myAse --vnet-name myVNet --subnet myAseSubnet
```

You can configure the Virtual IP type, Frontend SKU and scale, and much more. The commands also support `--no-wait` if you want to continue scripting while a command is running in the background. Give it a try and let us know through the [Azure CLI git repo](https://github.com/Azure/azure-cli), if you find any issues.

We also added commands for working with access restrictions. Access restrictions can be used to restrict access to specific IP addresses or to subnets using service endpoints. To control these restrictions with Azure CLI, you can now use the commands found in this group:

```bash
az webapp config access-restriction
```

Access restriction commands also allow you to control inheritance of restrictions for the scm site and control individual entries for the scm site. Access restriction commands are available in PowerShell as well:

```powershell
Get-AzWebAppAccessRestrictionConfig
Update-AzWebAppAccessRestrictionConfig
Add-AzWebAppAccessRestrictionRule
Remove-AzWebAppAccessRestrictionRule
```

## Helpful links
* [Azure CLI App Service Environment commands](https://docs.microsoft.com/cli/azure/appservice/ase?view=azure-cli-latest)
* [Azure CLI access restriction commands](https://docs.microsoft.com/cli/azure/webapp/config/access-restriction?view=azure-cli-latest)
* [Azure PowerShell access restriction commands](https://docs.microsoft.com/powershell/module/az.websites/get-azwebappaccessrestrictionconfig?view=azps-3.1.0)
