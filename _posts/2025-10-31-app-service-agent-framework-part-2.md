---
title: "Part 2: Build Long-Running AI Agents on Azure App Service with Microsoft Agent Framework"
author_name: "Jordan Selig"
toc: true
toc_sticky: true
---

Last week, I shared how to [build long-running AI agents on Azure App Service with Microsoft Agent Framework](https://techcommunity.microsoft.com/blog/appsonazureblog/build-long-running-ai-agents-on-azure-app-service-with-microsoft-agent-framework/4463159). If you haven't seen that post yet, I would recommend starting there as this post builds on the foundations introduced there including getting started with [Microsoft Agent Framework](https://learn.microsoft.com/agent-framework/overview/agent-framework-overview). The response so far was great, and one comment in particular stood out:

> "Thanks for the example. Nice job! Just curious (I still have to investigate the ins and outs of MAF) but why didn't you use the workflow pattern/classes of MAF? I thought that was meant to be the way to connect agents and let them cooperate (even in long running job situations)."
>
> — [Michel_Schep](https://techcommunity.microsoft.com/users/michel_schep/340533)

Great question! You're absolutely right in questioning this—the initial sample I created was designed to demonstrate the async request-reply architecture for handling long-running operations on App Service with a single agent. Today, we're taking the next step: a multi-agent workflow sample that addresses exactly what you asked about and is the next leap in building agentic apps in the cloud.

In this post, we'll explore:

- ✅ Building multi-agent systems with specialized, collaborating AI agents
- ✅ When to create agents in code vs. using Azure AI Foundry portal
- ✅ Orchestrating complex workflows with parallel and sequential execution
- ✅ Real-world patterns for production multi-agent applications

🔗 **Full Sample Code**: [https://github.com/Azure-Samples/app-service-maf-workflow-travel-agent-dotnet](https://github.com/Azure-Samples/app-service-maf-workflow-travel-agent-dotnet)

## Why Multi-Agent Systems?

The single-agent pattern I showed last week works great for straightforward tasks. But real-world AI applications often need specialized expertise across different domains. That's where multi-agent systems shine.

### The Travel Planning Challenge

Imagine planning a trip to Tokyo. You need:

- Currency expertise for budget conversion and exchange rates
- Weather knowledge for packing recommendations and seasonal planning
- Local insights about customs, culture, and etiquette
- Itinerary skills to create day-by-day schedules
- Budget optimization to allocate funds across categories
- Coordination to assemble everything into a cohesive plan

With a single agent handling all of this, you get a "jack of all trades, master of none" situation. The prompts become complex, the agent loses focus, and results can be inconsistent.

### Enter Multi-Agent Workflows

Instead of one generalist agent, we can create 6 or more specialized agents, each with a focused responsibility:

1. **Currency Converter Agent** - Real-time exchange rates (Frankfurter API integration)
2. **Weather Advisor Agent** - Forecasts and packing tips (National Weather Service API)
3. **Local Knowledge Agent** - Cultural insights and customs
4. **Itinerary Planner Agent** - Day-by-day activity scheduling
5. **Budget Optimizer Agent** - Cost allocation and optimization
6. **Coordinator Agent** - Final assembly and formatting

Each agent has:

- 🎯 **Clear, focused instructions** specific to its domain
- 🛠️ **Specialized tools** (weather API, currency API)
- 📊 **Defined inputs and outputs** for predictable collaboration
- ✅ **Testable behavior** that's easy to validate

Additionally, if you wanted to extend this even further, you could create even more agents and give some of your specialist agents even more knowledge by connecting additional tools and MCP servers. The possibilities are endless, and I hope this post inspires you to start thinking about what you can build and achieve.

## What Makes This Possible? Microsoft Agent Framework

All of this is powered by [Microsoft Agent Framework](https://learn.microsoft.com/agent-framework/overview/agent-framework-overview)—a comprehensive platform for building, deploying, and managing AI agents that goes far beyond simple chat completions.

### Understanding Agent Framework vs. Other Approaches

Before diving into the details, it's important to understand what Agent Framework is. Unlike frameworks like Semantic Kernel where you orchestrate AI behavior entirely in your application code with direct API calls, Agent Framework provides a unified abstraction for working with AI agents across multiple backend types.

Agent Framework supports several agent types ([see documentation](https://learn.microsoft.com/agent-framework/user-guide/agents/agent-types/?pivots=programming-language-csharp)):

1. **Simple agents based on inference services** - Agents built on any IChatClient implementation, including:
   - Azure OpenAI ChatCompletion
   - Azure AI Foundry Models ChatCompletion
   - OpenAI ChatCompletion and Responses
   - Any other Microsoft.Extensions.AI.IChatClient implementation

2. **Server-side managed agents** - Agents that live as Azure resources:
   - Azure AI Foundry Agent (used in this sample)
   - OpenAI Assistants

3. **Custom agents** - Fully custom implementations of the AIAgent base class

4. **Proxy agents** - Connections to remote agents via protocols like A2A

In this sample, we use **Azure AI Foundry Agents**—the server-side managed agent type. When you use these Foundry agents:

- **Agents are Azure resources** - They exist on the server-side in Azure AI Foundry, not just as code patterns
- **Execution happens on Foundry** - Agent runs execute on Azure's infrastructure with built-in state management
- **You get structured primitives** - Agents, Threads, and Runs are first-class concepts with their own lifecycles
- **Server-side persistence** - Conversation history and context are managed by the platform

This server-side approach is convenient because the platform manages state and execution for you. However, other agent types (like ChatCompletion-based agents) give you more control over orchestration while still benefiting from the unified Agent Framework programming model.

In my next blog post, I'll demonstrate an alternative approach using a different agent type—likely the Azure OpenAI ChatCompletion agent type—which doesn't create server-side Foundry resources. Instead, you orchestrate the agent behavior yourself while still benefiting from the Agent Framework's unified programming model.

If you're new to Agent Framework, here's what makes it special:

- 🔄 **Persistent Agents**: Server-side agents that maintain context across multiple interactions, not just one-off API calls
- 💬 **Conversation Threads**: Organized conversation history and state management that persists across agent runs
- 🎯 **Agent Runs**: Structured execution with progress tracking and lifecycle management—you can monitor exactly what your agents are doing
- 🔁 **Multi-Turn Interactions**: Complex workflows with iterative AI processing, where agents can refine and improve their outputs
- 🛠️ **Tool Integration**: Extensible function calling and integration capabilities—agents can call external APIs, execute code, and interact with real-world systems

In our sample, Agent Framework handles:

- Creating and managing 6 specialized agents programmatically
- Maintaining conversation context as agents collaborate
- Tracking execution progress across workflow phases
- Managing agent lifecycle (creation, execution, cleanup)
- Integrating external APIs (weather, currency) seamlessly

The beauty of Agent Framework is that it makes complex multi-agent orchestration feel natural. You focus on defining what your agents should do, and the framework handles the infrastructure, state management, and execution—all running on Azure AI Foundry with enterprise-grade reliability.

## The Multi-Agent Workflow

Here's how these agents collaborate to create a comprehensive travel plan in the sample I put together:

![Multi-agent workflow diagram]({{site.baseurl}}/media/2025/11/workflow.png)

### Execution Phases

**Phase 1: Parallel Information Gathering (10-40%)**

- Currency, Weather, and Local Knowledge agents execute simultaneously
- No dependencies = maximum performance
- Results stored in workflow state for downstream agents

**Phase 2: Itinerary Planning (40-70%)**

- Itinerary Planner uses context from all Phase 1 agents
- Weather data influences activity recommendations
- Local knowledge shapes cultural experiences
- Currency conversion informs budget-conscious choices

**Phase 3: Budget Optimization (70-90%)**

- Budget Optimizer analyzes the proposed itinerary
- Allocates funds across categories (lodging, food, activities, transport)
- Provides cost-saving tips without compromising the experience

**Phase 4: Final Assembly (90-100%)**

- Coordinator compiles all agent outputs
- Formats comprehensive travel plan with tips
- Returns structured, user-friendly itinerary

### Benefits of This Architecture

- ✅ **Faster Execution**: Parallel agents complete in ~30% less time
- ✅ **Better Quality**: Specialized agents produce more focused, accurate results
- ✅ **Easy Debugging**: Each agent's contribution is isolated and traceable
- ✅ **Maintainable**: Update one agent without affecting others
- ✅ **Scalable**: Add new agents (flight booking, hotel search) without refactoring
- ✅ **Testable**: Validate each agent independently with unit tests

## The Complete Architecture

Here's how everything fits together on Azure App Service:

![Complete architecture diagram]({{site.baseurl}}/media/2025/11/architecture.png)

This architecture builds on the async request-reply pattern from our previous post, adding:

- ✅ Multi-agent orchestration in the background worker
- ✅ Parallel execution of independent agents for performance
- ✅ Code-generated agents for production-ready DevOps
- ✅ External API integration (weather, currency) for real-world data
- ✅ Progress tracking across workflow phases (10% → 40% → 70% → 100%)

## Get Started Today

Ready to build your own multi-agent workflows on Azure App Service? Try out the sample today!

🔗 **GitHub Repository**: [https://github.com/Azure-Samples/app-service-maf-workflow-travel-agent-dotnet](https://github.com/Azure-Samples/app-service-maf-workflow-travel-agent-dotnet)

The repository includes:

- ✅ Complete .NET 9 source code with 6 specialized agents
- ✅ Infrastructure as Code (Bicep) for one-command deployment
- ✅ Complete web UI with real-time progress tracking
- ✅ Comprehensive README with architecture documentation
- ✅ External API integrations (weather, currency)

### Deploy in Minutes

```bash
git clone https://github.com/Azure-Samples/app-service-maf-workflow-travel-agent-dotnet.git
cd app-service-maf-workflow-travel-agent-dotnet
azd auth login
azd up
```

The `azd up` command provisions:

- Azure App Service (P0v4 Premium)
- Azure Service Bus (message queue for async processing)
- Azure Cosmos DB (state storage with 24-hour TTL)
- Azure AI Foundry (AI Services + Project for Agent Framework)
- GPT-4o model deployment (GlobalStandard 50K TPM)

Then manually deploy the WebJob following the [README instructions](https://github.com/Azure-Samples/app-service-maf-workflow-travel-agent-dotnet#deploy-the-webjob).

## What's Next? Extend This Pattern

This sample demonstrates production-ready patterns you can extend:

### 🛠️ Add More Specialized Agents

- **Flight Expert Agent** - Search and compare flight prices
- **Hotel Specialist Agent** - Find accommodations based on preferences
- **Activity Planner Agent** - Book tours, restaurants, events
- **Transportation Agent** - Plan routes, transit passes, car rentals

### 🤝 Implement Agent-to-Agent Communication

- Agents negotiate conflicting recommendations
- Hierarchical structures with supervisor agents
- Voting mechanisms for decision-making

### 🧠 Add Advanced Capabilities

- **RAG (Retrieval Augmented Generation)** for destination-specific knowledge bases
- **Memory** to remember user preferences across trips
- **Vision models** to analyze travel photos and recommend similar destinations
- **Multi-language support** for international travelers

### 📊 Production Enhancements

- **Authentication** - Microsoft Entra AD for user identity
- **Application Insights** - Distributed tracing and custom metrics
- **VNet Integration** - Private endpoints for security
- **Auto-Scaling** - Scale workers based on queue depth
- **Webhooks** - Notify users when their travel plan is ready

## Key Takeaways

- ✅ Multi-agent systems provide specialized expertise and better results than single generalist agents
- ✅ Azure App Service provides a simple, reliable platform for long-running multi-agent workflows
- ✅ Async request-reply pattern with Service Bus + Cosmos DB ensures scalability and resilience
- ✅ External API integration makes agents more useful with real-world data
- ✅ Parallel execution of independent agents dramatically improves performance

Whether you're building travel planners, document processors, research assistants, or other AI-powered applications, multi-agent workflows on Azure App Service give you the flexibility and sophistication you need.

## Learn More

- [Microsoft Agent Framework Documentation](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview) - Complete guide to Agent Framework
- [Original Blog Post](https://techcommunity.microsoft.com/blog/appsonazureblog/build-long-running-ai-agents-on-azure-app-service-with-microsoft-agent-framework/4463159) - Single-agent async patterns on App Service
- [Azure App Service Best Practices](https://learn.microsoft.com/azure/app-service/app-service-best-practices) - Production deployment patterns
- [Async Request-Reply Pattern](https://learn.microsoft.com/azure/architecture/patterns/async-request-reply) - Architecture guidance
- [Azure App Service WebJobs](https://learn.microsoft.com/azure/app-service/overview-webjobs) - Background processing documentation

## We Want to Hear From You!

Thanks again to [Michel_Schep](https://techcommunity.microsoft.com/users/michel_schep/340533) for the great question that inspired this follow-up sample!

Have you built multi-agent systems with Agent Framework? Are you using Azure App Service to host your AI and intelligent apps? We'd love to hear about your experience in the comments below.

Questions about multi-agent workflows on App Service? Drop a comment and our team will help you get started.

Happy building! 🚀
