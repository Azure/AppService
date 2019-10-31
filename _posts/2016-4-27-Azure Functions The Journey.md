---
title: "Azure Functions The Journey"
author_name: Mathew Charles
layout: single
hide_excerpt: true
---

Our team was excited to recently release a preview of the new [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) service at **//build**. We’ve done some blogging about the service already (e.g. [Introducing Azure Functions](https://azure.microsoft.com/en-us/blog/introducing-azure-functions/)), but in this post we’d like to delve a bit *behind the scenes* and discuss how the project started and the journey we’ve taken to arrive at where we are today. We’ll discuss the Functions Runtime, the Dynamic Compute layer ("Serverless") as well as the Functions Portal, and see at a high level how all those pieces evolved and came together into a cohesive product. It’s been a fun ride for the team, and it’s only just begun :)

 The evolution of this project is a great example of identifying synergies across a bunch of existing platform pieces, and connecting them together into a new product offering. In Azure App Service we already had many of the building blocks in place to enable us to rather quickly execute on the Azure Functions vision. By leveraging these existing assets and bringing in new innovations and functionality we were able to pull the project together pretty quickly.

### WebJobs SDK

In Chris’s **//build** talk [Introducing Azure Functions](https://channel9.msdn.com/events/Build/2016/B858) he explained how Azure Functions is built on the [Azure WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk). The WebJobs SDK has existed for a couple years now, and we have many customers happily using it to build backend processing jobs that trigger on a wide variety of event sources. The WebJobs SDK has a simple declarative programming model that makes it very easy to write sophisticated job functions with a minimal amount of code. Here’s an example:

```csharp
public static void ProcessOrder(  
[QueueTrigger("orders")] Order order,  
[Blob("processed/{Id}")] out string receipt,  
TraceWriter log)  
{  
    log.Verbose(string.Format("Processing Order {0}", order.Id));
    // business logic
    receipt = "<some value>";  
}
```

When hosted by the WebJobs SDK **JobHost** in a vanilla .NET Console application, this function will be automatically triggered whenever a new queue message is added to Azure Queue "orders" and the queue payload will be deserialized into an instance of the Order POCO. The function also automatically binds to an output Blob using the "Id" property from the incoming message as part of the blob path. With this programming model, your job function just focuses on its business logic and doesn’t have to take care of any of the storage operations. Awesome!

 The hosting model for such functions using the WebJobs SDK is to deploy them as [Azure WebJobs](https://azure.microsoft.com/en-us/documentation/articles/web-sites-create-web-jobs/). This works great and offers a lot of flexibility, and continues to be a very popular feature of Azure App Service.

### Functions Runtime

Around the middle of last year, we started discussing what it would take to bring this simple programming model to other languages – we’d had customers ask us for this as well. Not everyone is a .NET C# programmer, yet many would like to use these WebJobs SDK patterns. So we started some prototyping efforts on this and came up with a model that allowed us to leverage the existing tried and true .NET WebJobs SDK runtime, layering on a new JSON description model for the metadata. The result is that you can write the same function as above in Node.js (or other languages):

```javascript
module.exports = function (context, order) {  
    context.log('Processing order', order.id);
    // business logic
    context.bindings.receipt = "<some value";  
    context.done();  
}
```

You’ll notice that this function is structurally the same as the C# function above. That’s because it maps to the same runtime implementation. Declarative code attributes are just one way of specifying metadata. We realized that we could capture the same information in a simple JSON description file. Here’s the corresponding metadata file describing the bindings for this function (i.e. all the bits that are in the declarative attributes in the C# example):

```json
{
    "bindings": [{
        "type": "queueTrigger",
        "name": "order",
        "direction": "in",
        "queueName": "orders"
    }, {
        "type": "blob",
        "name": "receipt",
        "direction": "out",
        "path": "processed/{id}"
    }]
}
```

The basic idea is that we can use this metadata to generate an in memory adaptor between various languages and the .NET WebJobs SDK runtime. We effectively generate the C# function you see above, and the method body of that function simply delegates to the actual user function (i.e. the Node.js function you wrote). An Azure Function can then just be a simple **function.json** metadata file describing the function bindings, along with a collection of one or more script files implementing the function. Here’s the same example as above, using the same metadata file, with the function written as a Windows BAT file:

```shell
SET /p order=<%order%>
echo Processing order '%order%'  
echo '<some value>' > %receipt%
```

That same metadata file can be used to describe a function in any of our 7 supported languages. Of course each language has its own quirks and capabilities, and some are more suited than others for various tasks. The main point here is that we can have the same triggering/binding runtime for all of these languages, allowing each language to map to that model in its own way. BAT files are somewhat limited, but through environment variables and file streams, they can both receive inputs and write outputs, which the Functions runtime automatically maps to the underlying Azure Storage artifacts.

Having Azure Functions build on the core WebJobs SDK means we don’t have to write and maintain different versions of the WebJobs SDK per language, which is a huge engineering win. We have a single core runtime that handles all our binding/triggering logic, and investments we make in that core benefit functions as well as all our WebJobs SDK customers. It also means that all the trigger/binding Extensions that people write for the core SDK can also be used in Functions. We’ll continue investing heavily in the core WebJobs SDK and Extensions both for our traditional customers as well as for Azure Functions.

#### WebHook Support

Another important area we started focusing on was our **WebHooks** story. The ability for functions to be triggered on Azure Storage events is great, but we’ve had WebJobs customers asking us for the ability to trigger their job functions via WebHook requests as well. We had already experimented with this last year by writing a [WebHooks Extension](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.WebHooks/1.0.0-beta4) which worked well, but had a big drawback stemming from the fact that WebJobs run under the Kudu SCM site, which means that basic auth credentials are required to make requests. That’s a deal breaker for most WebHook integration scenarios, since you want the ability to hand out a URL with a simple auth code that is restricted to allowing only that endpoint to be reached.

To address this, we decided to package the Functions Runtime as a [site extension](https://github.com/projectkudu/kudu/wiki/Azure-Site-Extensions) that runs in root of a WebApp. This means that it is NOT behind the SCM endpoint, allowing us to achieve the auth patterns required. This enabled us to expose a simple set of authenticated endpoints for WebHook functions. We also integrated the [ASP.NET WebHooks](https://github.com/aspnet/WebHooks) library into this, allowing us to leverage the large number of WebHook providers that library supports, giving us first class support for providers like GitHub, Slack, DropBox, Instagram, etc.

So at this point we had a flexible Functions Runtime that supported the full WebJobs SDK triggering/binding model for 7 languages (Node.js, C#, F#, Bash, BAT, Python, PHP), that also had an HTTP head supporting a wide array of WebHook integration scenarios.

### Dynamic Compute

In parallel with the above runtime work, we were also having discussions about **Serverless Computing** and what we wanted to do in that space. We realized that this work we were doing for WebJobs was highly synergistic. We were developing a flexible, multi-language function runtime that could run user code in a sandboxed environment at high scale. However, the traditional WebJobs model requires users to create and manage the WebApp host that those WebJobs run on. What if we were able to abstract that portion of things away so users only had to write the functions themselves, and we’d handle all the deployment and scale concerns? Basically we’d have the **WebJobs SDK as a Service**. Eureka! 

We spun up a team to go off and investigate that portion of the plan – "**Dynamic Compute**". This was the point in the project where we grew quickly from a small handful of people into a much larger team – our scrum meetings were growing daily by 2-3 people it seemed :) Our Dynamic Compute layer is responsible for automatically scaling functions out as load increases, and scaling back when it decreases. The result for the end user is that they don’t have to worry about this at all, and they only get billed for the compute time they actually use. The Dynamic Compute area of the project is large and also includes other service aspects like monitoring and diagnostics, telemetry, etc. This area deserves its own blog post in the future.

### Functions Portal

The next thing we started focusing on was a **portal experience** to make it really easy to author and manage these functions. In the traditional WebJobs SDK model, you compile and deploy a .NET Console application (**JobHost**) that contains all your precompiled job functions. For Azure Functions the deployment model is much simpler. The Functions Runtime was designed to have a very simple file system layout. That facilitates a straight forward Portal UI that operates on those files via the [Kudu](https://github.com/projectkudu/kudu) APIs. We could have a simple portal editor that allowed you to create/edit these files and push them into the function container (the WebApp running the functions). The simple file system model also makes it possible to deploy Azure Functions via [ARM templates](https://azure.microsoft.com/en-us/documentation/articles/resource-group-authoring-templates/). That is actually possible today, but not documented well yet.

The team was able to get a Portal up and running pretty quickly and we were all very excited to be able to start using it to play with the nascent product. With the Portal in place things really started feeling like they were coming together! We were able to start having the wider team play with the product which drove lots of usability discussions/improvements and also helped us start working the bugs out. When the Portal work started, as with the Functions Runtime we had one or two people working on it, but as that early work gained traction and our scope/plans increased, we on-boarded more people. Scrum meetings got larger still :)

[![Capture]({{ site.baseurl }}/media/2016/04/Capture_thumb3.jpg "Capture")]({{ site.baseurl }}/media/2016/04/Capture11.jpg)

#### Templates

The simple file system model for functions also allowed us to develop the awesome **template model** you see today in the Functions Portal. We started churning out simple metadata/script templates for common scenarios across the various languages: "QueueTrigger – Node", "GitHub WebHook C#", etc. The idea is to have simple "recipes" or starting points for your functions that run immediately out of the box, that you can then customize and extend to your needs. In the future we hope to allow the community to also author such templates to drive an ecosystem.

[![Capture2]({{ site.baseurl }}/media/2016/04/Capture2_thumb.png "Capture2")]({{ site.baseurl }}/media/2016/04/Capture21.png)

### Extensibility

Another area we focused a lot on leading up to our **//build** announcement of Azure Functions was a new set of WebJobs SDK Extensions that we made available in Functions. We released the [WebJobs SDK Extensibility](https://azure.microsoft.com/en-us/blog/extensible-triggers-and-binders-with-azure-webjobs-sdk-1-1-0-alpha1/) model last fall, which opened the programming model up to new trigger/binding sources. Our team had already seeded the community with some new useful extensions (e.g. TimerTrigger, FileTrigger, SendGrid binding, etc.) in the [WebJobs SDK Exensions](https://github.com/Azure/azure-webjobs-sdk-extensions) repo. We’ve also had community members start authoring their own extensions. Since Functions is built on the SDK, all these extensions can be made available to Azure Functions as well. There were many extensions we knew we wanted to write but didn’t have the time, and with our new larger team we had the resources to start cranking some of those out. In the last couple months we’ve added the following additional extensions and made them first class in Functions: **EventHub**, **DocumentDb**, **NotificationHub**, **MobileApps**, and **ApiHub**. This is only the beginning – there are many more extensions planned, and we expect the community to author more as well. We’re also working on an easy model for allowing 3rd parties to onboard their extensions into Functions. Stay tuned for that.

Another cool thing is that we decided early that we wanted to do all our work open source, just as we have with the core [WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk) and [WebJobs SDK Extensions](https://github.com/Azure/azure-webjobs-sdk-extensions) repos. So we created the [WebJobs SDK Script](https://github.com/Azure/azure-webjobs-sdk-script) containing the Functions Runtime. Similarly, the Functions Portal is also open source: [AzureFunctionsPortal](https://github.com/projectkudu/AzureFunctionsPortal).

In closing, all of the above has been a pretty high level overview of the various pieces of the project and how they came together: the Functions Runtime, Functions Portal, and Dynamic Compute. In future posts, we’ll delve more into the details of these various areas :)
