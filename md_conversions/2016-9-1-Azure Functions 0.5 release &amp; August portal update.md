---
author_name: Chris Anderson (Azure)
layout: post
hide_excerpt: true
---
      [Chris Anderson (Azure)](https://social.msdn.microsoft.com/profile/Chris Anderson (Azure))  9/1/2016 11:20:33 AM  We're happy to announce we've officially released Azure Functions host version 0.5 into our Public Preview, as well as some updates to our Portal experience. The host version does include several breaking changes, so please read the release notes before upgrading. We will also be updating our default version in create to ~0.5 as well, so new deployments that don't specify a version will be on the latest.

 F# support now in preview
-------------------------

 Thanks to the excellent work by the F# team including [Don Syme](https://github.com/dsyme) and [Tomas Petricek](https://github.com/tpetricek), we're happy to announce we finally support F# in a first-class fashion in Azure Functions. Previously, we just invoked your F# script via fsi. Today, it now running hot in our runtime, with support for input and output bindings. Note that this new F# experience is incompatible with the previous versions.

 Here's a quick sample that would work off of a Queue trigger.

 let Run (input: string, log: TraceWriter) = log.Info(sprintf "F# script processed queue message '%s'" input)  If you are familiar with the C# experience, you'll remember the TraceWriter. This is because we support all the same types that C# supports. We haven't finished updating the documentation yet, but we'll be soon updating the [C# docs to be the .NET docs](https://azure.microsoft.com/en-us/documentation/articles/functions-reference-csharp/). 

 For those curious in how it was built, feel free to check out [PR #577](https://github.com/Azure/azure-webjobs-sdk-script/pull/577).

 Other breaking changes & improvements
-------------------------------------

 In addition to F# support, we have a few other breaking changes and notable improvements. You can read our full release notes on [0.5 release on GitHub](https://github.com/Azure/azure-webjobs-sdk-script/releases/tag/v1.0.0-beta1-10398).

  - Now using Node v6.4.0 (previously v5.9.1) - next update will be to [Node v6 LTS sometime October](https://github.com/nodejs/LTS).
 - HTTP Trigger now supports [binding to body/querystring properties](https://github.com/Azure/azure-webjobs-sdk-script/blob/dev/sample/HttpTrigger-CSharp-Poco/run.csx).
 - Event Hub trigger can now configure maxBatchSize and prefetchCount for advanced scenarios.
 - C# Package Restore automatic restore improvements
 - Logging improvements for performance and usability
 - File Watcher can now be configured for where to look for changes.
 - context.bindingData property casing is now lower camel cased (previously upper camel cased)
 - Twilio is now supported as a binding by the host.
  Portal updates
--------------

 We also have some large updates to the portal experience rolling out today. Below are some highlights:

  - Localization is now available for many languages
 - Tabs have all been moved to the left nav, rather than left and top. This change happened to improve usability in understanding Functions vs Function Apps.
 - Actions for certain output bindings on Integrate tab. We found it was common to copy+paste settings from an output binding to a new trigger, so we added a button to do it for you.
 - Dropdown pickers for connections - if you have an existing connection to Storage/etc., we'll show you those in a dropdown menu, rather than always having to choose from the picker blade (which can have LOTS of choices for large, shared subscriptions).
 - Documentation is now available in the Integrate tab. This will hopefully make it more obvious how to use the bindings when you add them/modify them, rather than knowing where in the main docs site to look.
 - You can now delete/rename files from the file explorer menu on the Develop Tab.
 - Better whitespace usage on Integrate tab
 - App Settings, Kudu, and Console now available from the Function App Settings menu, rather than having to jump through Advanced Settings.
  What comes next?
----------------

 With this release complete, we'll be starting our next wave of planning. We need and look forward to your feedback. You can submit general feedback on [feedback.azure.com](https://feedback.azure.com/forums/355860-azure-functions) or, if you feel familiar with our host or portal, you can submit issues directly on GitHub ([Host GitHub](https://github.com/Azure/azure-webjobs-sdk-script) & [Portal GitHub](https://github.com/projectkudu/AzureFunctionsPortal)). Most of our planning happens on GitHub, so you can see things coming as they are in progress. 

 Feel free to ask questions below or reach out to us on Twitter via [@AzureFunctions](https://twitter.com/azurefunctions). We hope you have fun with the new changes. We're looking forward to seeing what you do!

      