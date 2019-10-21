---
author_name: Donna Malayeri
layout: post
hide_excerpt: true
---
      [Donna Malayeri](https://social.msdn.microsoft.com/profile/Donna Malayeri)  6/1/2017 9:00:28 AM  With the new [Visual Studio 2017 support for Azure Functions](https://blogs.msdn.microsoft.com/webdev/2017/05/10/azure-function-tools-for-visual-studio-2017/), you can now author functions using C# class libraries. With the new project type, triggers and bindings are defined using attributes, which are then converted to function.json as a build task. To build the project on the server with continuous integration, you have two options: 1) the [Continuous Integration](https://docs.microsoft.com/en-us/azure/azure-functions/functions-continuous-deployment) feature of Functions, or 2) [Visual Studio Team Services](https://www.visualstudio.com/en-us/docs/build/get-started/ci-cd-part-1) (VSTS). The code can be hosted on VSTS or an external service such as GitHub or Bitbucket. The process is quite easy, thanks to a new build template: ASP.NET Core on .NET Framework. If you’re not familiar with VSTS build definitions, read [CI/CD for newbies](https://www.visualstudio.com/en-us/docs/build/get-started/ci-cd-part-1). To create a build definition, do the following:  2. From the Build Definitions view in VSTS, select **+New**.
 4. Choose the template **NET Core (.NET Framework)**. Even though we’re not deploying an ASP.NET Core app, this template has the correctly configured tasks for a Functions project.
 6. Add a build task for **Azure App Service Deploy**. 
	 2. Ensure you use a VS2017 build agent
	  
 8. Choose an Azure subscription and select your Function App under **App Service name**.
 10. Modify the **Package or folder** setting to use $(build.artifactstagingdirectory)/**/*.zip
 12. Save and queue the build.
  Here’s an animated GIF that walks through the VSTS configuration steps: [![]({{ site.baseurl }}/media/2017/06/vsts.gif)]({{ site.baseurl }}/media/2017/06/vsts.gif)      