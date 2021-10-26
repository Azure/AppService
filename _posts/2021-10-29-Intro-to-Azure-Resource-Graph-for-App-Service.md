---
title: "Introduction to Azure Resource Graph for App Service"
author_name: "Jordan Selig"
toc: true
---

[Azure Resource Graph (ARG)](https://docs.microsoft.com/azure/governance/resource-graph/overview) is an Azure service that gives you the ability to query and explore your Azure resources across a given set of subscriptions so that you can effectively govern your environments, especially if you manage multiple large scale environments. Azure Resource Graph powers Azure portal's search bar, the new browse 'All resources' experience, and Azure Policy's [Change history](https://docs.microsoft.com/azure/governance/policy/how-to/determine-non-compliance#change-history) visual diff.

With Azure Resource Graph, you can:

- Query resources with complex filtering, grouping, and sorting by resource properties
- Iteratively explore resources based on governance requirements
- Assess the impact of applying policies in a vast cloud environment
- Detail [changes made to resource properties](https://docs.microsoft.com/azure/governance/policy/how-to/determine-non-compliance#change-history) (preview)

For more details on how to use Azure Resource Graph, see the [documentation](https://docs.microsoft.com/en-us/azure/governance/resource-graph/).

## Benefits of Azure Resource Graph

Prior to Azure Resource Graph, you had access to services like [Azure Resource Manager (ARM)](https://docs.microsoft.com/azure/azure-resource-manager/management/overview) to query your resources. Resource Manager only supports queries over basic resource fields and provides the ability for calling individual resource providers for detailed properties one resource at a time. With Azure Resource Graph, you can access these properties the resource providers return without needing to make individual calls to each resource provider thereby increasing investigation efficiency and simplifying escalation paths for monitoring, incident response, and investigation teams.

## Azure Resource Graph and App Service

### Limitations

As of publishing this post, the following `Microsoft.web` resource types are supported by Azure Resource Graph:

- microsoft.web/apimanagementaccounts
- microsoft.web/apimanagementaccounts/apis
- microsoft.web/certificates
- Microsoft.Web/connectionGateways (On-premises Data Gateways)
- Microsoft.Web/connections (API Connections)
- Microsoft.Web/customApis (Logic Apps Custom Connector)
- Microsoft.Web/HostingEnvironments (App Service Environments)
- Microsoft.Web/KubeEnvironments (App Service Kubernetes Environments)
- Microsoft.Web/serverFarms (App Service plans)
- Microsoft.Web/sites (App Services)
- microsoft.web/sites/premieraddons
- Microsoft.Web/sites/slots (App Service (Slots))
- Microsoft.Web/StaticSites (Static Web Apps)
- Microsoft.Web/WorkerApps (Container Apps)

For a full list of supported resource types, review the [table and resource type reference](https://docs.microsoft.com/azure/governance/resource-graph/reference/supported-tables-resources).

Azure Resource Graph is currently receiving notifications for all resources tracked by ARM. If a resource or resource property changes outside of ARM (i.e. for resources not tracked by ARM), the team is currently working on onboarding these resources to enable users to have access to them. This is an ongoing process the ARG team is working through...

### Querying resources

### Change detection (preview)

		○ Blog post
			§ What is it
			§ What can it do
			§ What is available
				□ Queries
				□ Change detection
How to use it

demystifying app settings and connection strings, how to set and set from ARM. You won't see them from a get request, so this is how you see them 