---
title: Announcing Azure Functions support for Serverless Framework
author_name: Chris Anderson (Azure)
layout: post
hide_excerpt: true
---
      [Chris Anderson (Azure)](https://social.msdn.microsoft.com/profile/Chris Anderson (Azure))  2/23/2017 8:00:44 AM  Today we’ve officially announced preview support for the Azure Functions Serverless Framework plugin. The Serverless Framework is an open source tool which allows you to deploy auto-scaling, pay-per-execution, event-driven functions to any cloud. It helps abstract away the details of your Serverless resources and lets you focus on the important part – your application. With the release of our new plugin, it’s one of the fastest ways to deploy a serverless application, ever. You can learn more about the plugin in the [Azure Functions Serverless Framework documentation](https://www.serverless.com/framework/docs/providers/azure/). You can also check out our npm package [serverless-azure-functions](https://www.npmjs.com/package/serverless-azure-functions). Getting started
---------------

 Now let’s see a quick hello world example ### 1. Set up boilerplate

 To setup the boilerplate, follow these instructions:  2. Recommend using Node v6.5.0
 4. Install the serverless tooling - npm i -g serverless
 6. Create boilerplate (change my-app to whatever you'd prefer) -serverless install --url https://github.com/azure/boilerplate-azurefunctions --name my-app
 8. cd my-app
 10. npm install
  ### 2. Set up credentials

 We'll set up an Azure Subscription and our service principal. You can learn more in the [credentials doc](https://www.serverless.com/framework/docs/providers/azure/guide/credentials).  2. Set up an Azure SubscriptionSign up for a free account @ [https://azure.com](https://azure.microsoft.com/en-us/services/functions/). Azure comes with a [free trial](https://azure.microsoft.com/en-us/free/) that includes $200 of free credit.
   2. . Get the Azure CLI  npm i -g azure-cli  
 4. Login to Azure  azure login  This will give you a code and prompt you to visit [aka.ms/devicelogin](https://aka.ms/devicelogin). Provide the code and then login with your Azure identity (this may happen automatically if you're already logged in). You'll then be able to access your account via the CLI.
 6. Get your subcription and tenant id  azure account show  Save the subcription and tenant id for later
 8. Create a service principal for a given <name> and <password> and add contributor role.  azure ad sp create -n <name> -p <password>  This should return an object which has the servicePrincipalNames property on it and an ObjectId. Save the Object Id and one of the names in the array and the password you provided for later. If you need to look up your service principal later, you can use azure ad sp -c <name> where <name> is the name provided originally. Note that the <name> you provided is not the name you'll provide later, it is a name in the servicePrincipalNames array. Then grant the SP contributor access with the ObjectId  azure role assignment create --objectId <objectIDFromCreateStep> -o Contributor  
 10. Set up environment variablesYou need to set up environment variables for your subscription id, tenant id, service principal name, and password.  # bash export azureSubId='<subscriptionId>' export azureServicePrincipalTenantId='<tenantId>' export azureServicePrincipalClientId='<servicePrincipalName>' export azureServicePrincipalPassword='<password>'   # PowerShell $env:azureSubId='<subscriptionId>' $env:azureServicePrincipalTenantId='<tenantId>' $env:azureServicePrincipalClientId='<servicePrincipalName>' $env:azureServicePrincipalPassword='<password>'  
  ### 3. Deploy to Azure

 Run the [deploy command](https://www.serverless.com/framework/docs/providers/azure/cli-reference/deploy) serverless deploy  ### 4. Test

 Run the [invoke command](https://www.serverless.com/framework/docs/providers/azure/cli-reference/invoke) serverless invoke function -f httpjs      