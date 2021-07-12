---
title: "General Availability of new Azure App Service built-in policies"
author_name: "Vivek Arya"
category: networking
---

One of the tools that Azure provides to enforce governance and controls is [Azure Policies](https://docs.microsoft.com/azure/governance/policy/overview). By employing Azure policies, IT organizations are able to enforce controls around provisioning Azure resources to ensure adherence to security and  compliance standards. Along with the ability to allow users to create custom Azure policies, Azure platform provides built-in policies around the use of each Azure service which can be employed as it is or could be further customized based on the requirements. 

App Service provides many such [built-in policies](https://docs.microsoft.com/azure/app-service/policy-reference) which help secure applications and promote best practices. In recent days, new built-in policies have been released which could be used to improve the security posture of the apps deployed and also help streamline the deployment standards. Some of these policies with [Audit](https://docs.microsoft.com/azure/governance/policy/concepts/effects#audit) or [AuditIfNotExists](https://docs.microsoft.com/azure/governance/policy/concepts/effects#auditifnotexists) effect result in creation of audit records for all applications that do not comply with the controls and others with [DeployIfNotExists](https://docs.microsoft.com/azure/governance/policy/concepts/effects#deployifnotexists) results in execution of remediation tasks that makes changes to the configuration of the application to implement the desired controls. Policies with [Deny](https://docs.microsoft.com/azure/governance/policy/concepts/effects#deny) effect cause a create or update request to fail if that request results in creation or update of an application that does not match the defined standards. 

Following table lists the new built-in policies categorized by the area of control that they address : 

| Area of Concern               | Policy                                                                                         | Effect                               | Application SKU               |
|-------------------------------|------------------------------------------------------------------------------------------------|--------------------------------------|-------------------------------|
|     Network Security          |     App Service should   disable public network access                                         |     AuditIfNotExists,   Disabled     |     All except   IsolatedV1 & IsolatedV2    |
|     Network Security          |     Configure App   Service to disable public network access                                   |     DeployIfNotExists,   Disabled    |     All except   IsolatedV1 & IsolatedV2     |
|     Network Security          |     App Service   Environment apps should not be reachable over public internet                |     AuditIfNotExists,   Disabled     |     IsolatedV1, IsolatedV2                  |
|     Network Routing           |     App Service should   use private link                                                      |     AuditIfNotExists,   Disabled     |     PremiumV2,   PremiumV3, Functions Premium   |
|     Network Routing           |     App Service apps should use a SKU that supports private link                                                      |     AuditIfNotExists, Deny,  Disabled     |     PremiumV2,   PremiumV3, Functions Premium    |
|     Network Routing           |     Configure App   Service to use private DNS zones                                           |     DeployIfNotExists,   Disabled    |     PremiumV2,   PremiumV3, Functions Premium    |
|     Network Routing           |     App Service apps   should enable outbound non-RFC 1918 traffic to Azure Virtual Network    |     AuditIfNotExists,   Disabled     |     All except   IsolatedV1 & IsolatedV2     |
|     Application   Security    |     App Service   Environment should enable internal encryption                                |     Audit, Disabled                  |     IsolatedV1, IsolatedV2                 |
|     Application   Security    |     App Service   Environment should disable TLS 1.0 and 1.1                                   |     Audit, Disabled                  |     IsolatedV1, IsolatedV2                  |
|     Application   Security    |     App Service   Environment should be configured with strongest TLS Cipher Suites            |     Audit, Disabled                  |     IsolatedV1, IsolatedV2                  |
|     Service Governance        |     App Service   Environment should be provisioned with latest versions                       |     Audit, Disabled                  |     IsolatedV1, IsolatedV2                  |

### Network Security

#### App Service should disable public network access

Internal user facing applications should ensure that they are not accessible over public internet. Disabling inbound public network access improves security by ensuring that the app isn't exposed on public internet. For applications deployed in the multi-tenant App Service, use this policy to flag all applications that are accessible over public network. If the organization mandates that applications should not be accessible over public internet, one could use "Configure App Service to disable public network access" policy to automatically disable the inbound public network access following the policy run.

#### App Service Environment apps should not be reachable over public internet

Applications deployed in [App Service Environment](https://docs.microsoft.com/azure/app-service/environment/intro) where the access from public internet is not desired, should be deployed in a private IP address inside the VNET. The internal endpoint is an internal load balancer. This policy could be used to audit applications that violate this control and are accessible over public internet.

### Network Routing

#### App Service should use private link
To ensure that applications deployed in multi-tenant app service are only accessible privately on a non-public route, one should create [private link](https://docs.microsoft.com/azure/private-link/) to provide private access to them. This could be done by creating a private link to the apps deployed in App Service, as described [here](https://docs.microsoft.com/azure/private-link/tutorial-private-endpoint-webapp-portal). Policy "App Service should use private link" creates an audit record for all apps that do not provide private link. These records can then be used to identify such applications to determine if a corrective action is required. 

#### App Service apps should use a SKU that supports private link
To ensure private access to applications deployed in multi-tenant app service, one requires to provision a private link to the application. Not all App Service SKUs support private link. Private Link is supported only on the following App Service Plans : PremiumV2, PremiumV3, Functions Premium (sometimes referred to as the Elastic Premium plan). This policy provides ability to audit or deny deployment of applications on App Service Plans that do not support private link. 

#### Configure App Service to use private DNS zones

On the creation of a private endpoint to a webapp, a DNS entry is required to be created to resolve the name of private endpoint IP address to the fully qualified domain name(FQDN) of the connection string. The network interface associated with the private endpoint contains information to configure DNS, that is FQDN and private IP address to the private link resource i.e. the app. It is recommended to setup a private DNS zone to override the DNS resolution for a private endpoint. A private DNS zone can be linked to the one's virtual network to resolve specific domains. Policy "Configure App Service to use private DNS zones" automatically configures apps accessible over private endpoints to use a private DNS zone. 

#### App Service apps should enable outbound non-RFC 1918 traffic to Azure Virtual Network
App Service provides a feature called Regional [VNet Integration](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet#regional-vnet-integration) to enable apps deployed in multi-tenant service to access resources in or through a VNET. The feature allows application routing to be controlled at the individual app level. When Route All is not enabled, the app only routes RFC1918 traffic into VNet. Enabling Route All allows NSGs and UDRs to be used for all outbound traffic from the App Service app. Steps to set up that setting are described [here](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet). Policy “App Service apps should enable outbound non-RFC 1918 traffic to Azure Virtual Network” creates an audit record and thus helps identify applications that don’t have Route All enabled. 

### Application Security

#### App Service Environment should enable internal encryption
By default, to enable higher throughput, internal components of App Service Environment do not use encryption while communicating among themselves. If one has a compliance requirement that requires complete encryption of the end to end data path, encryption could be enabled by setting a [custom setting](https://docs.microsoft.com/azure/app-service/environment/app-service-app-service-environment-custom-settings#enable-internal-encryption). Policy "App Service Environment should enable internal encryption" creates an audit record for all App Service Environments that do not use internal encryption. 

#### App Service Environment should disable TLS 1.0 and 1.1
TLS 1.0 and 1.1 are out-of-date protocols that do not support modern cryptographic algorithms and thus are deemed vulnerable to attacks. To disable TLS 1.0 and 1.1 for all the apps in an ASE, one could set custom setting on the ASE as described [here](https://docs.microsoft.com/azure/app-service/environment/app-service-app-service-environment-custom-settings#disable-tls-10-and-tls-11). Policy "App Service Environment should disable TLS 1.0 and 1.1" help identify and create a record for all ASEs that have TLS 1.0 and 1.1 enabled. 

#### App Service Environment should be configured with strongest TLS Cipher Suites
By default, ASE supports changing the TLS cipher suite by using custom setting as defined [here](https://docs.microsoft.com/azure/app-service/environment/app-service-app-service-environment-custom-settings#change-tls-cipher-suite-order). Changing the cipher suite affects an entire App Service Environment. For ASE to function, there are two cipher suites required; 
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, and TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256.  Default setting for ASE also has weaker ciphers included in the suite, if you wish to operate your ASE with the strongest and most minimal set of cipher suites, then one should use just the two required ciphers. "App Service Environment should be configured with strongest TLS Cipher Suites" creates an audit record for all those ASEs which do not use these required cipher suites or use cipher suites other than just these two. 

### Service Governance

#### App Service Environment should be provisioned with latest versions
Older version of App Service Environment requires manual management of Azure's resources and have greater scaling limitations. It is recommended that one uses ASEv2 or ASEv3(in preview) while creating new App Service Environment. This policy identifies all App Service Environments that are ASEv1. 
