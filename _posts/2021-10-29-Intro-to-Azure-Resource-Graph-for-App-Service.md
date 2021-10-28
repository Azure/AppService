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

For more details on how to use Azure Resource Graph, see the [documentation](https://docs.microsoft.com/azure/governance/resource-graph/).

## Benefits of Azure Resource Graph

Prior to Azure Resource Graph, you had access to services like [Azure Resource Manager (ARM)](https://docs.microsoft.com/azure/azure-resource-manager/management/overview) to query your resources. Resource Manager only supports queries over basic resource fields and provides the ability for calling individual resource providers for detailed properties one resource at a time. With Azure Resource Graph, you can access these properties the resource providers return without needing to make individual calls to each resource provider. This increases investigation efficiency and simplifies escalation paths for monitoring, incident response, and investigation teams.

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

Azure Resource Graph is currently receiving notifications for all resources tracked by ARM. If a resource or resource property changes outside of ARM (i.e. for resources not tracked by ARM), the team is currently working on onboarding these resources to enable users to have access to them using ARG. This is an ongoing process the ARG team is working through. Refer to the [table and resource type reference](https://docs.microsoft.com/azure/governance/resource-graph/reference/supported-tables-resources) for updates as additional resources gain support.

### Querying resources

There are a number of [quickstarts](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal) provided by the ARG team to help you get started with running queries. The Portal is a good place to start as it gives you a GUI based experience and formatted results that link to the queried resources for easy navigation. The query structure is based on [Kusto Query Language (KQL)](https://docs.microsoft.com/azure/data-explorer/kusto/query/index).

To get you started with ARG for App Service, below are basic queries to give you an idea of what you can query as well as what these queries can be used for.

To see all sites across all subscriptions and resources groups:

```kusto
resources
| where type == "microsoft.web/sites"
```

Below is a sample of the output. If you have more sites in your account, they will all be listed.

![basic query]({{ site.baseurl }}/media/2021/10/basicquery.png)

You can select "See details" at the end of the row to view additional information about your resources.

You can query on any of the available fields for the specific resource. For example, if you want to see all your sites that are located in Central US:

```kusto
resources
| where type == "microsoft.web/sites"
| where location == "centralus"
```

Or if you want to see all of your running sites, you can drill into the "properties" object:

```kusto
resources
| where type == "microsoft.web/sites"
| where properties.state == "Running"
```

Many of the fields, specifically in the "properties" object, at this time will be showing as "null." For example, if you are looking for details about the "siteConfig" object, the resource provider does not expose them at this time. This is due to these properties not being tracked by ARM and not being onboarded to ARG yet. Review the [limitations](#limitations) to understand what properties are currently available.

Additionally, you can use ARG to do analytics and create [dashboards](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal#pin-the-query-visualization-to-a-dashboard) to monitor your resources.

To get a sites count by region:

```kusto
resources
| where type == "microsoft.web/sites"
| summarize count() by location
```

And to create a visual, you can select "Charts" under the query box and choose from the given visualization options. Below is a map of the distributions of sites in a demo account.

![basic query]({{ site.baseurl }}/media/2021/10/regionquery.png)

### Change detection (preview)

Change detection is now in public preview for all resources that support [complete mode deletion](https://docs.microsoft.com/azure/azure-resource-manager/templates/deployment-complete-mode-deletion). For App Service, as of writing this article, the relevant resources that are supported include `Microsoft.web/sites`, `Microsoft.web/sites/slots`, `Microsoft.Web/serverFarms` as well as a couple additional resources that can be found [here](https://docs.microsoft.com/azure/azure-resource-manager/templates/deployment-complete-mode-deletion#microsoftweb). 

With change detection, the last 14 days of change history (properties that are added, removed, or altered) for the supported resources are available and can be accessed from the [APIs directly](https://docs.microsoft.com/azure/governance/resource-graph/how-to/get-resource-changes) or from the Portal which provides a *visual diff* for each change. Change history can assist in determining causes of non-compliance and help you determine when a change was made and by who so further investigation can be conducted.

For example, if you want to see when an app setting was modified: