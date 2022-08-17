---
title: "A Heavy Lift: Bringing Kestrel + YARP to Azure App Services"
author_name: "David Fowler, Suwat Bodin, Chris Rosenblatt, Jenny Lawrance, Stephen Kou, Chris Ross, Miha Zupan, Aditya Mandaleeka, Bilal Alam"
---

## Summary

In this post, we get a small behind-the-scenes look at the engineering work required to change a critical platform component with code paths that are exercised billions of times a day while minimizing service disruptions and maintaining SLA for our customers. We provide a brief introduction to help cover the basics, go over motivations for doing this work as well as some of the more interesting challenges, issues, and bugs encountered along the way, and finally close with results, and new customers scenarios enabled. 


## Introduction

In 2021, a group of engineers across multiple teams, including .NET and Azure, got together to transition the **App Service Frontend** fleet to **Kestrel + [YARP](https://github.com/microsoft/reverse-proxy)**. As we celebrate the completion of this major lift and collaboration, we decided to write down the journey and describe some of the challenges of completing such a change to a live service, the wins we achieved, and the future work enabled by this transition. We hope you enjoy it.

### Azure App Service in a nutshell

Azure App Service recently celebrated its 10 year anniversary (we launched it on June 7th, 2012).  We are grateful and humbled by our customers who have helped us grow into a big service (affectionately called an XXL service in Azure internally, a designation only shared with 3 other services):

- 160B+ daily HTTP requests served by applications
- 14M+ host names
- 1.5K+ multi-tenant scale units and an additional 10K+ dedicated scale units (App Service Environments aka App Service Isolated SKU)

One of the key architectural pieces of this system is our **FrontEndRole**. The **FrontEndRole** main purposes are:

- Receiving traffic on HTTP/HTTPS from public virtual IP addresses associated with scale unit
- Terminating SSL if required
- Determining which set of VMs are the origin-servers for application (called Workers) and then routing to them

![FrontEndRole diagram]({{site.baseurl}}/media/2022/08/FE_Diagram.jpg)

App Service was originally built as a Cloud Service and this role is just called FrontEndRole; now with our transition to VM Scale Sets, the FrontEndRole is a separate scale set which is part of each scale unit
The original App Service FrontEndRole, which runs on Windows Server, previously consisted of:

- IIS running on HTTP.sys, both operating system components of Windows Server
- [Application Request Routing (ARR)](https://www.iis.net/downloads/microsoft/application-request-routing), which does request forwarding using WinHTTP

### Kestrel and YARP in a nutshell

The first release of .NET Core introduced the **Kestrel webserver**: an open-source, cross-platform, and fast webserver implementation built using modern .NET. Performance is a key focus for the .NET team, and with each .NET release, **Kestrel** has gotten ever faster and more full-featured. As an example, recent changes made to **Kestrel** include:

- Significant scalability improvements on many-core machines
- Significant HTTP/2 performance enhancements when running with many concurrent streams
- Support for new standards like HTTP/3. 


**YARP (“Yet Another Reverse Proxy”)** is a reverse proxy toolkit that enables building fast proxy servers using infrastructure from ASP.NET and .NET, focusing on easy customization. It is developed in the open at [https://github.com/microsoft/reverse-proxy](https://github.com/microsoft/reverse-proxy). YARP’s toolkit/extensibility model made it easy for us to incorporate our routing and TLS handling with its request forwarding capabilities. **YARP includes support for modern protocols like HTTP/2 & HTTP/3, which App Service customers can now expose.
In addition, being based on the fast-evolving .NET platform means that every release, **Kestrel** and **YARP** benefit from improvements up and down the .NET stack, including everything from networking libraries all the way down to JIT compiler improvements that improve the quality of generated code. For a sampling of the types of improvements that went into just the .NET 6 release in 2021, see [Performance Improvements in .NET 6](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-6/#gc)

## Betting on Kestrel + YARP for App Service: Why?

The previous **FrontEndRole** architecture of App Service built on IIS/HTTP.SYS has served us well, but the promise of a modern HTTP stack in **Kestrel + YARP** could deliver new benefits to all App Service customers.  Specifically:

- Performance improvements, including significantly decreased per-request CPU cost and per-connection memory cost.  
- More flexible extensibility points into SSL termination path allowing for easier dynamic SNI host selection.
- Enable new customer scenarios like support for gRPC, per-host cipher suite configuration, custom error pages and more.

With all that context and motivation, the goal of the V-Team was clear: 
>**“Transition the 200K+ dedicated cores running FrontEndRole to use Kestrel + YARP (and thus move away from IIS/HTTP.SYS/ARR)”**


## Challenge: Server Framework Diversity

App Service is not the first Microsoft service to transition to Kestrel/YARP. Microsoft has already documented the journeys of Bing, Azure Active Directory (AAD), and Dynamics 365 to .NET; these efforts have proven out the stability and performance of .NET for critical service workloads. 

- [Bing.com runs on .NET Core 2.1!](https://devblogs.microsoft.com/dotnet/bing-com-runs-on-net-core-2-1/)
- [Azure Active Directory's gateway is on .NET 6.0!](https://devblogs.microsoft.com/dotnet/azure-active-directorys-gateway-is-on-net-6-0/)
- [Dynamics 365 using YARP](https://youtu.be/67tCWKnweso?t=1803)

The unique challenge that App Service adds to the mix is the diversity of server implementations.  The previously mentioned Microsoft services are written by server engineers working for … Microsoft.  This is definitely not the case for App Service, which enables customers to *bring their own server frameworks* and *write their own applications with varying levels of standards compliance*.  Hosting customer applications brings a unique set of challenges described below. 

## Challenge: Platform versus Organic Health

Because App Service enables customers to write their own applications, the concept of *“service health”* is a nuanced discussion.  App Service measures the health of the platform; we ensure that customers have a running VM which can connect to storage and can execute a simple canary request.  But App Service cannot easily measure the organic health (HTTP request success rate) since we do not control the application. As a result, we primarily focused on platform health as our main metric.  

For our transition to **Kestrel + YARP**, we needed to broaden our measurement to include organic health.  Rather than looking for an absolute bar (say >99.99% success), we needed to compare *“before Kestrel + YARP”* and *“after Kestrel + YARP”* organic success and look for anomalies which would point out potential problems.     

## Challenge: Quick Rollback in Production

With a broadened approach to assessing organic health anomalies caused by a diverse set of applications/frameworks on our platform, we required fast mechanisms to undo our **Kestrel + YARP** transition on a per scale-unit basis; in other words, we needed to be able to *“break glass”* quickly when we encountered problems and return to using IIS/HTTP.SYS.

## The Journey: 100% FrontEndRoles using Kestrel/YARP

With all the context and challenges described, here is how the journey looked like in a picture.  

>**TODO:** Add FE Migration image

![FrontEndRole Migration]({{site.baseurl}}/media/2022/08/FE_Migration.jpg)

As you can see this journey took a lot of time. 6 months passed between the first Kestrel/YARP deployment and 100%.

## The Bugs Encountered

We encountered multiple bugs on our journey to **Kestrel + YARP**. Apart from bugs in our business logic, one of the interesting classes of issue we encountered was the treatment of edge-cases in the HTTP specification. A diversity of clients hit our **FrontEndRole**. We need to be generous in accepting behavior that may not be exactly the HTTP spec's letter and intent.

A simple example of one of these cases is when a request has leading newline characters (CR and/or LF). Strictly speaking, this isn’t allowed, but it turns out that there are some clients that send requests that start like:

```aspx-csharp
\rGET / HTTP/1.1\r\n
...
```

This is a case that IIS (and some other servers) allow, but because **Kestrel** historically has taken a fairly strict stance, we saw its parser rejecting requests like this with a `BadHttpRequestException`. Working closely with the ASP.NET Core team, we were able to make **Kestrel** a bit more generous in what it accepts (the example above now works in **Kestrel** in .NET 6.0.5 and newer releases).

Some other *interesting* issues uncovered can be found [here](https://github.com/dotnet/aspnetcore/pull/40833), [here](https://github.com/dotnet/aspnetcore/pull/40633) and [here](https://github.com/microsoft/reverse-proxy/pull/1773).

As a result of investigating and addressing this class of issues, not only have we succeeded in a smooth migration, but we’ve also helped make **Kestrel** a more robust server that can deal with more kinds of *“unusual”* traffic.

## The Payoff: Performance and New Features, Now and in the Future

Now that we have moved our **FrontEndRoles** to **Kestrel + YARP** we have realized multiple benefits in production.

Performance tests designed to isolate the benefits of our **FrontEndRole** change showed an **almost 80% improvement in throughput** (tested using a simple 1K *helloworld* response from a single dedicated worker in a test environment).  App Service over-provisions **FrontEndRole** instances, so the realized benefit across our aggregate fleet is a large decrease in CPU% which provides more CPU headroom for the fleet. We are still in the early days of monitoring the fleet post-move; we may eventually be able to decrease our cores assigned to this role to reduce operating costs and data center energy usage. More investigation to follow.

With our move to **Kestrel + YARP**  on our **FrontEndRoles**, we were also able to move our **Linux worker VMs** to use **Kestrel+YARP**. This change allows us to replace nginx, commonize the codebase, and [light up gRPC for our App Service Linux SKUs](https://azure.github.io/AppService/2022/05/23/gRPC-support-on-App-Service.html). gRPC support has been a popular feature request from Azure App Services users and we're excited to add this capability.

With this platform work complete we are now working on enabling two of the most frequently requested features in App Service; more news coming soon as we complete these improvements:    
- Ability to configure custom error pages for requests that terminate on the front end (Specifically: HTTP 503, HTTP 502 and HTTP 403).  
- Ability to specify TLS cipher suite allowed per given application.  Today customers can only configure allowed cipher suites on our Isolated SKUs.  


## A Great Partnership

Once you have a live multi-tenant service running with millions of VMs globally, you learn to be very careful with how and when you advance it. That said, the innovations with **Kestrel + YARP** being developed by the .NET core team were just too valuable to pass up. At the same time, the .NET team would tell you the experience of supporting this migration was a whole new challenge for that team as they experienced the breadth and diversity of App Service scenarios. This was a great journey for both teams and we landed it. Now that we have this new platform in place, we look forward to continued innovation between our teams. 
