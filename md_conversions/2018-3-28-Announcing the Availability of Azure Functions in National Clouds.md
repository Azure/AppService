---
title: "Announcing the Availability of Azure Functions in National Clouds"
author_name: Asavari Tayal
layout: post
hide_excerpt: true
---
      [Asavari Tayal](https://social.msdn.microsoft.com/profile/Asavari Tayal)  3/28/2018 9:15:53 AM  To further our commitment of providing the latest in cloud innovation for each and every one of our customers, we're excited to announce the availability of Azure Functions in three separate national clouds - [China](https://www.azure.cn/), [Germany](https://azure.microsoft.com/de-de/global-infrastructure/germany/) and [United States Government](https://azure.microsoft.com/en-us/global-infrastructure/government/).  [National or sovereign clouds](https://www.microsoft.com/en-us/trustcenter/cloudservices/nationalcloud) are physically and logically network-isolated instances of Microsoft's cloud service, which are confined within the geographic boundaries of specific countries and operated by local personnel. These clouds offer a unique model for local regulations on service delivery, data residency, access and control.  Functions in the national clouds provides the same functionality and features as global Azure. The rich portal experience allows you to create, manage and monitor your functions. You can develop using [C#](https://docs.microsoft.com/en-us/azure/azure-functions/functions-dotnet-class-library), [F#](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-fsharp) or [JavaScript](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node) and integrate with a wide variety of services using [triggers and bindings](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings).  [![]({{ site.baseurl }}/media/2018/03/Screenshot-2018-03-28-00.26.31-1024x525.png)]({{ site.baseurl }}/media/2018/03/Screenshot-2018-03-28-00.26.31.png) As always, you can pick from a range of tools such as the cross platform [CLI](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function-azure-cli), [Visual Studio IDE](https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-vs) and [VS Code](https://code.visualstudio.com/tutorials/functions-extension/getting-started) to develop, debug and test locally, before deploying your apps to Azure.  **Known ****L****imitations**   - Currently, Functions in the national clouds can only be hosted in an [App Service Plan](https://docs.microsoft.com/en-us/azure/app-service/azure-web-sites-web-hosting-plans-in-depth-overview). Each plan requires you to define a specific region, number of VM instances in that region and size of the VMs that must be dedicated to your apps. If your scenario requires the consumption plan, please let us know by submitting a feature request on [UserVoice](http://aka.ms/functionsUV). 
 - Basic monitoring is available through the functions logs and the monitoring tab in the portal. A richer experience with more analytics options will be available once Azure Application Insights is available in the national cloud regions.  
  **Next Steps**  Here are some resources to help you get up and running with Functions:    - Get started using the docs – [Create your first function in the Azure Portal](https://aka.ms/functions-docs) 
 - For technical questions, please post on [MSDN](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=azurefunctions) or [StackOverflow](https://stackoverflow.com/questions/tagged/azure-functions). We actively monitor these forums and will be happy to help with your query.
      