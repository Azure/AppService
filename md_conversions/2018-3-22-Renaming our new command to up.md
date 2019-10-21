---
author_name: Ahmed Elnably
layout: post
hide_excerpt: true
---
      [Ahmed Elnably](https://social.msdn.microsoft.com/profile/Ahmed Elnably)  3/22/2018 5:12:33 PM  We listened to feedback, we decided to change our previously released [experimental "new"](https://blogs.msdn.microsoft.com/appserviceteam/2018/02/06/az-webapp-new/) command to be now "up". With version 0.2.0 of the extension, "new" is no longer available, and you will have to use "up" instead. [![]({{ site.baseurl }}/media/2018/03/azwebappup-1024x349.png)]({{ site.baseurl }}/media/2018/03/azwebappup.png) The command (**Which is still in Preview**) enables the user to create and deploy their Node.js, .NET Core, ASP.NET, Java, or Static HTML apps using a single command. For Node.js we check for the existence of a **package.json** file in the code root path to indicate it is a Node.js app. For ASP.NET and .NET Core we check for the existence of a ***.csproj** file with **netcoreapp **as the** TargetFramework**. For static HTML we check the existence of a** *.html** file. The command check for languages in the following order:  2. Node.js
 4. .NET Core and ASP.NET
 6. Static HTML
  In the case of Node.js and Java apps the command does the following:  2. Create a new resource group (in Central US, you can use the --location to change the region)
 4. Create a new Linux single VM small App Service plan in the Standard SKU (in Central US)
 6. Create a Linux webapp
 8. Deploy the content of the current working directory to the webapp using [Zip Deployment](https://blogs.msdn.microsoft.com/appserviceteam/2017/10/16/zip-push-deployment-for-web-apps-functions-and-webjobs/)
  In the case of an ASP.NET, .NET Core, Static HTML app the command does the following:  2. Create a new resource group (in Central US, you can use the --location to change the region)
 4. Create a new free Windows App Service plan (in Central US)
 6. Create a Windows webapp
 8. Deploy the content of the current working directory to the webapp using [Zip Deployment](https://blogs.msdn.microsoft.com/appserviceteam/2017/10/16/zip-push-deployment-for-web-apps-functions-and-webjobs/)
  To Install the Azure CLI tools refer to their [documentation](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest). To Install the extension: az extension add --name webapp To update the extension with the latest fixes and new languages support (Current version is 0.2.0): az extension update --name webapp To know what the command will do without creating anything: az webapp up --name [app name] --location [optional Azure region name] --dryrun To use the new command: az webapp up --name [app name] --location [optional Azure region name] To update your app content - Just rerun the command you used to create the app (including the --location argument): az webapp up --name [app name] --location [optional Azure region name] To submit feedback or submit an issue please open an issue in the [Azure CLI extensions Github Project page](https://aka.ms/webapp-extension-issues). Road Map - also tracked [here](https://aka.ms/webapp-extension-issues):  2. Add ASP.Net support
 4. Add Java support
 6. Add more languages to the supported list
 8. Add support to [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)
        