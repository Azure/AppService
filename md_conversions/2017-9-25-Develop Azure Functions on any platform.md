---
title: Develop Azure Functions on any platform
author_name: Donna Malayeri
layout: post
hide_excerpt: true
---
      [Donna Malayeri](https://social.msdn.microsoft.com/profile/Donna Malayeri)  9/25/2017 6:00:20 AM  I’m excited to announce that we have ported Azure Functions to .NET Core 2.0! Both the runtime and the Azure Functions Core Tools are now cross-platform. Now, you can debug C# and JavaScript functions on a Mac or Linux using the Core Tools and Visual Studio Code. Both the runtime and the Core Tools are still in preview and we welcome your feedback! As this is a preview release, there are still a number of feature gaps. For more information, see [Azure Functions runtime 2.0 known issues](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Azure-Functions-runtime-2.0-known-issues). Running on your local machine
-----------------------------

 To get the new version of the core tools, pull down the **@core** tag on npm: npm i -g azure-functions-core-tools@core If you’re using Ubuntu, prefix the command above with "sudo." If you have problems with the npm install on Mac, use the following: sudo npm i -g azure-functions-core-tools@core --unsafe-perm To learn how to use the tools, see [Code and test Azure functions locally](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local). ### JavaScript (Node 8.5 or higher)

 For the easiest installation, you must be running **Node version 8.5 or higher**. See instructions below for how to target a lower version. To create a new JavaScript HTTP-triggered function, do the following: mkdir JavaScriptHttp cd JavaScriptHttp func init . func new --language JavaScript --template HttpTrigger --name HttpTriggerJavaScript Run the host. This automatically enables debugging with the Node port 5858: func host start [![]({{ site.baseurl }}/media/2017/09/Screen-Shot-2017-09-22-at-2.48.45-PM-1024x765.png)]({{ site.baseurl }}/media/2017/09/Screen-Shot-2017-09-22-at-2.48.45-PM.png) Open the folder in Visual Studio Code: code . In VSCode, set a breakpoint at the first line of the function, and attach the debugger (via F5 or the debug toolbar). Then, in a browser, navigate to the URL http://localhost:7071/api/HttpTriggerJavaScript?name=Functions%20Everywhere! You’ll then see the breakpoint being hit in VSCode! [![]({{ site.baseurl }}/media/2017/09/Screen-Shot-2017-09-22-at-2.55.17-PM-1024x544.png)]({{ site.baseurl }}/media/2017/09/Screen-Shot-2017-09-22-at-2.55.17-PM.png) [![]({{ site.baseurl }}/media/2017/09/Screen-Shot-2017-09-24-at-6.30.12-PM-500x307.png)]({{ site.baseurl }}/media/2017/09/Screen-Shot-2017-09-24-at-6.30.12-PM.png) ### JavaScript (Node versions prior to 8)

 After installing azure-functions-core-tools, run the following commands: npm i -g node-pre-gyp cd %userprofile%/.azurefunctions/bin/workers/node/grpc node-pre-gyp install  Once these tools are installed, you can use the instructions in the previous section to run and debug JavaScript functions. ### C# .NET Standard 2.0 class library

 You can now run and debug C# functions on a Mac or Linux. The [Microsoft.NET.Sdk.Functions](https://www.nuget.org/packages/Microsoft.NET.Sdk.Functions) is the package that identifies a project as Functions project to Visual Studio and generates function.json from attributes during build. Templates for C# class libraries aren’t yet available in the Core Tools, but you can get a [sample from GitHub](https://github.com/lindydonna/CSharpHttpCore). #### Dotnet command line

 git clone https://github.com/lindydonna/CSharpHttpCore.git cd CSharpHttpCore dotnet build dotnet publish cd HttpTriggerCore/bin/Debug/netstandard2.0 func host start  #### VS Code debugging

 To debug your C# functions, open the folder containing your .csproj in VS Code. Make sure you have installed the C# extension.  - In the debug toolbar next to the play button, select Add Configuration
 - Select **.NET Core** as the environment, then **.NET: Attach to local .NET Core Console App**.
  This will generate a launch.json configuration for your project. Then, press F5 and select **.NET Core Attach**. Select the **dotnet** process with the command line **Azure.Functions.Cli.dll host start**. Browse to the URL http://localhost:7071/api/HttpTriggerCSharp?name=CSharpEverywhere!. You’ll then see your breakpoint hit in VSCode. [![]({{ site.baseurl }}/media/2017/09/Screen-Shot-2017-09-24-at-11.08.42-PM1-1024x482.png)]({{ site.baseurl }}/media/2017/09/Screen-Shot-2017-09-24-at-11.08.42-PM1.png) #### Visual Studio

 First, ensure you have downloaded the @core version of azure-functions-core-tools: npm i -g azure-functions-core-tools@core Then, add a new launch configuration for the 2.0 version of the Core Tools:  - In project properties -> Debug, change **Launch** to **Executable**
 - For Executable, use **%APPDATA%\npm\func.cmd**
 - For Application Arguments, use **host start**
 - For working directory, use **$(TargetDir)**
  F5 will now launch the new version of the Azure Functions Core Tools. [![]({{ site.baseurl }}/media/2017/09/vs-1024x630.png)]({{ site.baseurl }}/media/2017/09/vs.png) Running Functions 2.0 in Azure
------------------------------

 You can also use the .NET Core 2.0 port in Azure by targeting the new Functions 2.0 preview runtime. To use it, select "beta" in **Function app settings -> Runtime version**. Alternatively, you can the app setting FUNCTIONS\_EXTENSION\_VERSION to the value beta. You will then see a different set of templates available in the Add New Function page. [![]({{ site.baseurl }}/media/2017/09/Screen-Shot-2017-10-05-at-9.39.28-PM-500x211.png)]({{ site.baseurl }}/media/2017/09/Screen-Shot-2017-10-05-at-9.39.28-PM.png) Since the 2.0 runtime is in preview, there may be breaking changes even in minor releases. So, the 2.0 runtime should **not** be used for production workloads. If you navigate to the root of you function app, you’ll see that you’re running the new version: [![]({{ site.baseurl }}/media/2017/09/functions2.0-300x210.png)]({{ site.baseurl }}/media/2017/09/functions2.0.png) Connect with us
---------------

 We've seen a lot of excitement and interest, so we're looking forward to getting your feedback as we finalize the Functions 2.0 runtime.  - To report bugs or file feature requests, please open an issue on the [Azure-Functions](https://github.com/Azure/Azure-Functions) GitHub repo.
 - For technical questions, please post on the [MSDN forums](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=azurefunctions) or [StackOverflow](https://stackoverflow.com/questions/tagged/azure-functions). The entire Functions engineering team monitors these questions, so you’re sure to get an expert answer.
 - For product news, follow [@AzureFunctions](https://twitter.com/AzureFunctions).
      