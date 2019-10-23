---
title: Alpha Preview for Durable Functions
author_name: Chris Anderson (Azure)
layout: post
hide_excerpt: true
---
      [Chris Anderson (Azure)](https://social.msdn.microsoft.com/profile/Chris Anderson (Azure))  7/6/2017 9:13:39 AM  Last week, we open sourced an early preview version of our new [Durable Task Framework extension](https://github.com/Azure/azure-functions-durable-extension/) for Azure Functions (also referred to as Durable Functions) and we now have instructions on how to set it up to test both locally and on Azure. We’re really excited about this binding and expect it to make a difference a lot of scenarios including complex chaining scenarios, fan in/fan out patterns, stateful actors, and scenarios with long callbacks. Introducing Durable Functions
=============================

 Durable Functions is actually just us doing the work of setting up the [Durable Task Framework](https://github.com/Azure/durabletask) and managing it for you, at scale. Durable Task Framework was designed to allow you to write code based orchestrations based on async/await in C#. This enabled the following:  - Definition of code in simple C# code
 - Automatic persistence and check-pointing of program state
 - Versioning of orchestrations and activities
 - Async timers, orchestration composition,
  With Durable Functions, we let you write orchestrators and activities as Functions. Orchestrators can call Activity Functions and wait for an external event. Activity Functions can be written in any language and don’t have any restrictions on them that normal functions don’t have. Combined, this functionality allows a lot of complex patterns to be expressed via code. For instance, the code below will fan out and call various Activity Functions, wait for them all to complete, and then allow you to sum the results (fan in). This pattern was possible before, but involved a lot more code that was unrelated to the business logic. [code lang="csharp" highlight="18,23"]#r "Microsoft.Azure.WebJobs.Extensions.DurableTask" public static async Task<long> Run(DurableOrchestrationContext backupContext) { string rootDirectory = backupContext.GetInput<string>(); if (string.IsNullOrEmpty(rootDirectory)) { rootDirectory = Environment.CurrentDirectory; } string[] files = await backupContext.CallFunctionAsync<string[]>( "E2\_GetFileList", rootDirectory); var tasks = new Task<long>[files.Length]; for (int i = 0; i < files.Length; i++) { tasks[i] = backupContext.CallFunctionAsync<long>( "E2\_CopyFileToBlob", files[i]); } await Task.WhenAll(tasks); long totalBytes = tasks.Sum(t => t.Result); return totalBytes; } [/code] In the above code, you can see the highlighted lines fanning out and calling many Functions (18), and then waiting for them all to complete on the second highlighted line (23). Getting started
===============

 This is not a feature for everyone to try. It involves quite a lot of set up and is not very user-friendly yet. We recommend using VS and the local tooling to get started as it is the easiest way, but it requires installing the latest update from VS and the newest Functions tooling, which can take some time to set up. You can find the full instructions on how to get started on the [documentation page](https://azure.github.io/azure-functions-durable-extension). Note that the documentation is currently on GitHub but will move to docs.microsoft.com very soon. If you encounter any issues or have any feedback, please submit it on the [github repo](https://github.com/Azure/azure-functions-durable-extension/). Roadmap
=======

 There are a few things we’re still working on before it will be available for a beta quality preview. We’ll blog again once it’s available for a wider preview. Mainly, we are already planning on adding:  - Templates for all the primary scenarios
 - Scaling support in Consumption Plan (will not scale properly today)
 - Automatic installation (no dragging/dropping zip files)
  We hope to make progress on this during the rest of the summer. What’s next?
============

 For the brave, please try it out. Your feedback will shape the future of this feature. We think having built in support for Functions to call other Functions and orchestrate a set of Functions is a very big step forward for Azure Functions and serverless in general, but want to take our time to make sure we get the model right and the experience of managing it nice and polished.     