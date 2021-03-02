---
title: "Using Azure Functions with Azure Virtual Network NAT to Avoid SNAT Port Exhaustion"
author_name: "Jeff Martinez"
---


Source Network Address Translation (SNAT) ports are used by App Service to translate outbound connections to public IP addresses.  However, there are limitations to the number of SNAT port connections you can use at once and if your application runs out of SNAT ports it will cause intermittent connectivity issues. To avoid SNAT port exhaustion issues you will need to make sure that no new connections are created repetitively on the same host and port. Follow this [sample](https://github.com/paolosalvatori/azure-function-premium-plan) for further detail on how this can be accomplished using Azure Functions, Regional VNET Integration, Private Endpoints and NAT Gateway.

To learn more about Troubleshooting outbound connection errors, see the [documentation](https://docs.microsoft.com/azure/app-service/troubleshoot-intermittent-outbound-connection-errors).
