---
title: "Build Long-Running AI Agents on Azure App Service with Microsoft Agent Framework"
author_name: "Jordan Selig"
toc: true
toc_sticky: true
---

The AI landscape is evolving rapidly, and with the introduction of [Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview), developers now have a powerful platform for building sophisticated AI agents that go far beyond simple chat completions. These agents can execute complex, multi-step workflows with persistent state, conversation threads, and structured execution—capabilities that are essential for production AI applications.

Today, we're excited to share how Azure App Service provides an excellent platform for running Agent Framework workloads, especially those involving long-running operations. Let's explore why App Service is a great choice and walk through a practical example.

## The Challenge: Long-Running Agent Framework Flows

Agent Framework enables AI agents to perform complex tasks that can take significant time to complete:

- **Multi-turn reasoning**: Iterative calls to large language models (LLMs) where each response informs the next prompt
- **Tool integration**: Function calling and external API interactions for real-time data
- **Complex processing**: Budget calculations, content optimization, multi-phase generation
- **Persistent context**: Maintaining conversation state across multiple interactions

These workflows often take 30 seconds to several minutes to complete—far too long for synchronous HTTP request handling. Traditional web applications run into several constraints:

- ⏱️ **Timeout Limitations**: HTTP requests have timeout constraints (typically 30-230 seconds)
- ⚠️ **Connection Issues**: Clients may disconnect due to network interruptions or browser navigation
- 📈 **Scalability Concerns**: Long-running requests block worker threads and don't survive app restarts
- 🎯 **Poor User Experience**: Users see endless loading spinners with no progress feedback

## The Solution: Async Pattern with App Service

Azure App Service provides a robust solution through the asynchronous request-reply pattern combined with background processing:

1. API immediately returns (202 Accepted) with a task ID
2. Background worker processes the Agent Framework workflow
3. Client polls for status with real-time progress updates
4. Durable state storage (Cosmos DB) maintains task status and results

This pattern ensures:

- ✅ **No HTTP timeouts**—API responds in milliseconds
- ✅ **Resilient to restarts**—state survives deployments and scale events
- ✅ **Progress tracking**—users see real-time updates (10%, 45%, 100%)
- ✅ **Better scalability**—background workers process independently

## Rapid Innovation Support

The AI landscape is changing at an unprecedented pace. New models, frameworks, and capabilities are released constantly. Azure App Service's managed platform ensures your applications can adapt quickly without infrastructure rewrites:

- **Framework Updates**: Deploy new Agent Framework SDK versions like any application update
- **Model Upgrades**: Switch between GPT-4, GPT-4o, or future models with configuration changes
- **Scaling Patterns**: Start with combined API+worker, split into separate apps as needs grow
- **New Capabilities**: Integrate emerging AI services without changing hosting infrastructure

App Service handles the platform complexity so you can focus on building great AI experiences.

## Sample Application: AI Travel Planner

To demonstrate this pattern, we've built a Travel Planner application that uses Agent Framework to generate detailed, multi-day travel itineraries. The agent performs complex reasoning including:

- Researching destination attractions and activities
- Optimizing daily schedules based on location proximity
- Calculating detailed budget breakdowns
- Generating personalized travel tips and recommendations

The entire application runs on a single P0v4 App Service with both the API and background worker combined—showcasing App Service's flexibility for hosting diverse workload patterns in one deployment.

### Key Architecture Components

**Azure App Service (P0v4 Premium)**

- Hosts both REST API and background worker in a single app
- "Always On" feature keeps background worker running continuously
- Managed identity for secure, credential-less authentication

**Azure Service Bus**

- Decouples API from long-running Agent Framework processing
- Reliable message delivery with automatic retries
- Dead letter queue for error handling

**Azure Cosmos DB**

- Stores task status with real-time progress updates
- Automatic 24-hour TTL for cleanup
- Rich query capabilities for complex itinerary data

**Azure AI Foundry**

- Hosts persistent agents with conversation threads
- Structured execution with Agent Framework runtime
- GPT-4o model for intelligent travel planning

One of the powerful features of using Azure AI Foundry with Agent Framework is the ability to inspect agents and conversation threads directly in the Azure portal. This provides valuable visibility into what's happening during execution.

### Viewing Agents and Threads in Azure AI Foundry

When you submit a travel plan request, the application creates an agent in Azure AI Foundry. You can navigate to your AI Foundry project in the Azure portal to see:

**Agents**

- The application creates an agent for each request
- **Important**: Agents are **automatically deleted** after the itinerary is generated to keep your project clean
- **Tip**: You'll need to be quick! Navigate to Azure AI Foundry right after submitting a request to see the agent in action
- Once processing completes, the agent is removed as part of the cleanup process

**Conversation Threads**

- Unlike agents, threads persist even after the agent completes
- You can view the complete conversation history at any time
- See the exact prompts sent to the model and the responses generated
- Useful for debugging, understanding agent behavior, and improving prompts

The ephemeral nature of agents (created per request, deleted after completion) keeps your Azure AI Foundry project clean while the persistent threads give you full traceability of every interaction.

## Get Started Today

The complete Travel Planner application is available as a reference implementation so you can quickly get started building your own apps with Agent Framework on App Service.

🔗 **GitHub Repository**: [https://github.com/Azure-Samples/app-service-agent-framework-travel-agent-dotnet](https://github.com/Azure-Samples/app-service-agent-framework-travel-agent-dotnet)

The repo includes:

- Complete .NET 9 source code with Agent Framework integration
- Infrastructure as Code (Bicep) for automated deployment
- Web UI with real-time progress tracking
- Comprehensive README with deployment instructions

Deploy in minutes:

```bash
git clone https://github.com/Azure-Samples/app-service-agent-framework-travel-agent-dotnet.git
cd app-service-agent-framework-travel-agent-dotnet
azd auth login
azd up
```

## Key Takeaways

- ✅ Agent Framework enables sophisticated AI agents beyond simple chat completions
- ✅ Long-running workflows (30s-minutes) require async patterns to avoid timeouts
- ✅ App Service provides a simple, cost-effective platform for these workloads
- ✅ Async request-reply pattern with Service Bus + Cosmos DB ensures reliability
- ✅ Rapid innovation in AI is supported by App Service's adaptable platform

Whether you're building travel planners, document processors, research assistants, or other AI-powered applications, Azure App Service gives you the flexibility and reliability you need—without the complexity of container orchestration or function programming models.

## What's Next? Build on This Foundation

This Travel Planner is just the starting point—a foundation to help you understand the patterns and architecture. Agent Framework is designed to grow with your needs, making it easy to add sophisticated capabilities with minimal effort:

🛠️ **Add Tool Calling**

Connect your agent to real-time APIs for weather, flight prices, hotel availability, and actual booking systems. Agent Framework's built-in tool calling makes this straightforward.

🤝 **Implement Multi-Agent Systems**

Create specialized agents (flight expert, hotel specialist, activity planner) that collaborate to build comprehensive travel plans. Agent Framework handles the orchestration.

🧠 **Enhance with RAG**

Add retrieval-augmented generation to give your agent deep knowledge of destinations, local customs, and insider tips from your own content library.

📊 **Expand Functionality**

- Real-time pricing and availability
- Interactive refinement based on user feedback
- Personalized recommendations from past trips
- Multi-language support for global users

The beauty of Agent Framework is that these advanced features integrate seamlessly into the pattern we've built. Start with this sample, explore the [Agent Framework documentation](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview), and unlock powerful AI capabilities for your applications!

## Learn More

- [Microsoft Agent Framework Documentation](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview)
- [Azure App Service Documentation](https://learn.microsoft.com/azure/app-service/)
- [Async Request-Reply Pattern](https://learn.microsoft.com/azure/architecture/patterns/async-request-reply)
- [Sample Application GitHub Repo](https://github.com/Azure-Samples/app-service-agent-framework-travel-agent-dotnet)