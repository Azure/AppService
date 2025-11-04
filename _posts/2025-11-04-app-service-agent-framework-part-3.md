---
title: "Part 3: Client-Side Multi-Agent Orchestration on Azure App Service with Microsoft Agent Framework"
author_name: "Jordan Selig"
toc: true
toc_sticky: true
---

In [Part 2 of this series](https://techcommunity.microsoft.com/blog/appsonazureblog/part-2-build-long-running-ai-agents-on-azure-app-service-with-microsoft-agent-fr/4465825), I showed you how to build sophisticated multi-agent systems on Azure App Service using Azure AI Foundry Agents—server-side managed agents that run as Azure resources. Now I want to show you another alternative that gives you full control over agent orchestration, chat history management, and provider flexibility: client-side agents using ChatClientAgent. But this alternative raises an important question:

**How do you choose between client-side and server-side agents?**

This is an important question that points to a fundamental choice in Agent Framework: client-side agents vs. server-side agents. I'm not going to go into extreme detail here; my goal for this post is to show you how to build client-side multi-agent systems with ChatClientAgent and Azure App Service, but I will highlight the key differences and trade-offs that are going through my mind when considering this to help you make an informed decision.

In Part 2, I mentioned:

> "In my next blog post, I'll demonstrate an alternative approach using a different agent type—likely the Azure OpenAI ChatCompletion agent type—which doesn't create server-side Foundry resources. Instead, you orchestrate the agent behavior yourself while still benefiting from the Agent Framework's unified programming model."

Today, I'm delivering on that promise! We're going to rebuild the same travel planner sample using ChatClientAgent—a client-side agent type that gives you complete control over orchestration, chat history, and agent lifecycle.

In this post, we'll explore:

- ✅ Client-side agent orchestration with full workflow control
- ✅ ChatClientAgent architecture and implementation patterns
- ✅ When to choose client-side vs. server-side agents
- ✅ How Azure App Service supports both approaches equally well
- ✅ Managing chat history your way (Cosmos DB, Redis, or any storage you choose)

🔗 **Full Sample Code**: [https://github.com/Azure-Samples/app-service-maf-openai-travel-agent-dotnet](https://github.com/Azure-Samples/app-service-maf-openai-travel-agent-dotnet)

## The Key Question: Who's in Charge?

When building multi-agent systems with Agent Framework, you face a fundamental architectural decision. Microsoft Agent Framework supports [multiple agent types](https://learn.microsoft.com/agent-framework/user-guide/agents/agent-types/?pivots=programming-language-csharp), but the choice typically comes down to:

**Server-Side (Foundry Agents - Part 2)**

- Azure AI Foundry manages agent lifecycle, threads, and execution
- Agents exist as Azure resources in your AI Project
- Conversation history stored in Foundry threads
- Built-in orchestration patterns and features

**Client-Side (ChatClientAgent - This Post)**

- Your application code manages agent lifecycle and orchestration
- Agents are C# objects created on-demand
- Conversation history stored wherever you choose (Cosmos DB, Redis, etc.)
- You write the orchestration logic yourself

Both approaches run well on Azure App Service—the platform doesn't care which agent type you use. What matters is which approach fits your requirements better.

## What's Different: ChatClientAgent Architecture

Let's see what changes when you switch from Foundry agents to ChatClientAgent.

### The Same Multi-Agent Workflow

Both samples implement the exact same travel planner with 6 specialized agents:

1. **Currency Converter Agent** - Real-time exchange rates
2. **Weather Advisor Agent** - Forecasts and packing tips
3. **Local Knowledge Agent** - Cultural insights
4. **Itinerary Planner Agent** - Day-by-day schedules
5. **Budget Optimizer Agent** - Cost allocation
6. **Coordinator Agent** - Final assembly

The agents collaborate through the same 4-phase workflow:

- **Phase 1**: Parallel information gathering (Currency + Weather + Local)
- **Phase 2**: Itinerary planning
- **Phase 3**: Budget optimization
- **Phase 4**: Final assembly

Same workflow, different execution model.

### How ChatClientAgent Works

Here's the architecture stack for the client-side approach:

![ChatClientAgent architecture diagram]({{site.baseurl}}/media/2025/11/architecture-2.png)

The architecture shows:

- **Your Application Code**: TravelPlanningWorkflow orchestrating 6 ChatClientAgents with client-side chat history
- **Microsoft.Agents.AI**: ChatClientAgent wrapper adding instructions and tools
- **Microsoft.Extensions.AI**: IChatClient abstraction with Azure OpenAI implementation
- **Azure Services**: Azure OpenAI, Cosmos DB for chat history, and external APIs

Key components:

1. **TravelPlanningWorkflow** - Your orchestration code that coordinates agent execution
2. **ChatClientAgent** - Agent Framework wrapper that adds instructions and tools to IChatClient
3. **IChatClient** - Standard abstraction from Microsoft.Extensions.AI
4. **Client-Side Chat History** - Dictionary storing conversation per agent (you manage this!)
5. **Azure OpenAI** - Direct chat completion API calls (no AI Project endpoint needed)
6. **Cosmos DB** - Your choice for chat history persistence

### Implementation: BaseAgent Pattern

Here's how you create a ChatClientAgent in code:

```csharp
public abstract class BaseAgent : IAgent
{
    protected readonly ChatClientAgent Agent;
    
    protected abstract string AgentName { get; }
    protected abstract string Instructions { get; }
    
    // Constructor for simple agents without tools
    protected BaseAgent(
        ILogger logger,
        IOptions<AgentOptions> options,
        IChatClient chatClient)
    {
        Agent = new ChatClientAgent(chatClient, new ChatClientAgentOptions
        {
            Name = AgentName,
            Instructions = Instructions
        });
    }
    
    // Constructor for agents with tools (weather, currency APIs)
    protected BaseAgent(
        ILogger logger,
        IOptions<AgentOptions> options,
        IChatClient chatClient,
        ChatOptions chatOptions)
    {
        Agent = new ChatClientAgent(chatClient, new ChatClientAgentOptions
        {
            Name = AgentName,
            Instructions = Instructions,
            ChatOptions = chatOptions // Tools via AIFunctionFactory
        });
    }
    
    public async Task<ChatMessage> InvokeAsync(
        IList<ChatMessage> chatHistory, 
        CancellationToken cancellationToken = default)
    {
        var response = await Agent.RunAsync(
            chatHistory, 
            thread: null, 
            options: null, 
            cancellationToken);
            
        return response.Messages.LastOrDefault() 
            ?? new ChatMessage(ChatRole.Assistant, "No response generated.");
    }
}
```

What's happening here?

- You create a `ChatClientAgent` by wrapping an `IChatClient`
- You provide instructions (the agent's system prompt)
- Optionally, you provide tools via `ChatOptions` (using `AIFunctionFactory`)
- When you call `RunAsync`, you pass the chat history yourself
- The agent returns a response, and you decide what to do with the chat history

Compare this to Foundry agents where you create the agent once in Azure AI Foundry, and the platform manages threads and execution for you.

### Client-Side Chat History Management

One of the biggest differences is you control the chat history:

```csharp
public class WorkflowState
{
    // Each agent gets its own conversation history
    public Dictionary<string, List<ChatMessage>> AgentChatHistories { get; set; } = new();
    
    public List<ChatMessage> GetChatHistory(string agentType)
    {
        if (!AgentChatHistories.ContainsKey(agentType))
        {
            AgentChatHistories[agentType] = new List<ChatMessage>();
        }
        return AgentChatHistories[agentType];
    }
}
```

Workflow orchestration:

```csharp
// Phase 1: Currency Converter Agent
var currencyChatHistory = state.GetChatHistory("CurrencyConverter");
currencyChatHistory.Add(new ChatMessage(ChatRole.User, 
    $"Convert {request.Budget} {request.Currency} to local currency for {request.Destination}"));

var currencyResponse = await _currencyAgent.InvokeAsync(currencyChatHistory, cancellationToken);
currencyChatHistory.Add(currencyResponse); // You manage the history!

// Store in workflow state for downstream agents
state.AddToContext("CurrencyInfo", currencyResponse.Text ?? "");
```

Benefits:

- Store chat history in Cosmos DB, Redis, SQL, or any data store
- Query conversation history with your own logic
- Implement custom retention policies
- Export chat logs for analytics or compliance

With Foundry agents, chat history lives in Foundry threads—you don't directly control where or how it's stored. This may be fine for many scenarios, but if you need custom storage or compliance, client-side management is powerful.

### Tool Integration with AIFunctionFactory

External API tools (weather, currency) are registered as C# methods:

```csharp
// Weather Service
public class NWSWeatherService : IWeatherService
{
    [Description("Get weather forecast for a US city")]
    public async Task<WeatherForecast> GetWeatherAsync(
        [Description("City name (e.g., 'San Francisco')")] string city,
        [Description("State code (e.g., 'CA')")] string state,
        CancellationToken cancellationToken = default)
    {
        // Implementation calls NWS API
    }
}

// Register as tools with ChatClientAgent
var weatherTools = AIFunctionFactory.Create(weatherService);
var chatOptions = new ChatOptions { Tools = weatherTools };

var agent = new ChatClientAgent(chatClient, new ChatClientAgentOptions
{
    Name = "WeatherAdvisor",
    Instructions = "Provide weather forecasts and packing recommendations...",
    ChatOptions = chatOptions
});
```

The agent can now call `GetWeatherAsync` via function calling—same capability as Foundry agents, but configured in code instead of the portal.

## Why Choose Client-Side Agents (ChatClientAgent)?

Here's when ChatClientAgent shines:

### ✅ Full Orchestration Control

You write the workflow logic:

```csharp
// Phase 1: Run 3 agents in parallel (your code!)
var currencyTask = GatherCurrencyInfoAsync(request, state, progress, cancellationToken);
var weatherTask = GatherWeatherInfoAsync(request, state, progress, cancellationToken);
var localTask = GatherLocalKnowledgeAsync(request, state, progress, cancellationToken);

await Task.WhenAll(currencyTask, weatherTask, localTask);

// Phase 2: Sequential itinerary planning (your code!)
await PlanItineraryAsync(request, state, progress, cancellationToken);
```

With Foundry agents, orchestration patterns are limited to what the platform provides.

### ✅ Cost-Effective

No separate agent infrastructure:

- **ChatClientAgent**: Pay only for Azure OpenAI API calls
- **Foundry Agents**: Pay for Azure OpenAI + AI Project resources + agent storage

For high-volume scenarios, this can add up to significant savings.

### ✅ DevOps-Friendly

Everything in code:

- Agent definitions tracked in Git
- Testable with unit tests
- CI/CD pipelines deploy everything together
- No manual portal configuration steps
- Infrastructure as Code (Bicep) covers all resources

### ✅ Flexible Chat History

Store conversations your way:

- Cosmos DB for global distribution and rich queries
- Redis for ultra-low latency caching
- SQL Database for complex relational queries
- Blob Storage for long-term archival
- Custom encryption and retention policies

### ✅ Provider Flexibility

Works with any IChatClient:

- Azure OpenAI (this sample)
- OpenAI directly
- Local models via Ollama
- Azure AI Foundry model catalog
- Custom chat implementations

Switching providers is just a configuration change—no agent re-creation needed.

### ✅ Multi-Agent Coordination Patterns

Implement complex workflows:

- Parallel execution (Phase 1 in our sample)
- Sequential dependencies (Phase 2-4)
- Conditional branching based on agent responses
- Agent-to-agent negotiation
- Hierarchical supervisor patterns
- Custom retry logic per agent

You have complete freedom to orchestrate however your scenario requires.

## Why Choose Server-Side Agents (Azure AI Foundry)?

To be fair, Foundry agents from Part 2 have their own advantages and this post isn't about dismissing them. They are a powerful option for many scenarios. Here are some reasons to choose Foundry agents:

### ✅ Managed Lifecycle

Platform handles the heavy lifting:

- Agents persist as Azure resources
- Threads automatically manage conversation state
- Runs track execution progress server-side
- No orchestration code to write or maintain

### ✅ Built-In Features

Rich capabilities out of the box:

- File search for RAG scenarios
- Code interpreter for data analysis
- Automatic conversation threading
- Built-in retry and error handling

### ✅ Portal UI

Configure without code:

- Create agents in Azure AI Foundry portal
- Test agents interactively
- View conversation threads and runs
- Adjust instructions without redeployment

### ✅ Less Code

Simpler for basic scenarios:

```csharp
// Foundry Agent (Part 2 sample)
var agent = await agentsClient.CreateAgentAsync(
    "gpt-4o",
    instructions: "You are a travel planning expert...",
    tools: new List<ToolDefinition> { new FunctionTool(...) });

var thread = await agentsClient.CreateThreadAsync();
var run = await agentsClient.CreateRunAsync(thread.Id, agent.Id);
```

No need to manage chat history, orchestration logic, or tool registration in code.

## When to Choose Which Approach

Here's my take on a decision guide. This isn't exhaustive, but it covers key considerations. Others may disagree based on their priorities, but this is how I think about it:

| **Scenario** | **ChatClientAgent** | **Foundry Agents** |
|---|---|---|
| Complex multi-agent workflows | ✅ Full control | ⚠️ Limited patterns |
| Custom chat history storage | ✅ Any data store | ❌ Foundry threads only |
| Cost optimization | ✅ LLM calls only | ⚠️ + Infrastructure |
| Code-first DevOps | ✅ Everything in Git | ⚠️ Portal config needed |
| Provider flexibility | ✅ Any IChatClient | ⚠️ Azure only |
| Built-in RAG (file search) | ❌ DIY | ✅ Built-in |
| Portal UI for testing | ❌ Code only | ✅ Full UI |
| Quick prototypes | ⚠️ More code | ✅ Fast setup |
| Learning curve | ⚠️ More concepts | ✅ Guided setup |

**Use ChatClientAgent when:**

- You need complex multi-agent coordination
- Cost optimization is important
- You want full control over orchestration
- Code-first DevOps is a priority
- You need custom chat history management

**Use Foundry Agents when:**

- Simple single-agent or basic multi-agent scenarios
- You want built-in RAG and file search
- Portal-based configuration is preferred
- Quick prototyping and experimentation
- Managed infrastructure over custom code

## Azure App Service: Perfect for Both

Here's the great part: Azure App Service supports both approaches equally well.

### The Same Architecture

Both samples use identical infrastructure.

**What's the same:**

- ✅ Async request-reply pattern (202 Accepted → poll status)
- ✅ Service Bus for reliable message delivery
- ✅ Cosmos DB for task state with 24-hour TTL
- ✅ WebJob for background processing
- ✅ Managed Identity for authentication
- ✅ Premium App Service tier for Always On

**What's different:**

- **ChatClientAgent**: Azure OpenAI endpoint directly (`https://ai-xyz.openai.azure.com/`)
- **Foundry Agents**: AI Project endpoint (`https://ai-xyz.services.ai.azure.com/api/projects/proj-xyz`)
- **ChatClientAgent**: Chat history in Cosmos DB (your control)
- **Foundry Agents**: Chat history in Foundry threads (platform managed)

Azure App Service doesn't care which you choose. It just runs your .NET code, processes messages from Service Bus, and stores state in Cosmos DB. The agent execution model is an implementation detail. You can easily switch between approaches without changing your hosting platform, and even use a hybrid approach if desired.

## Get Started Today

Ready to try client-side multi-agent orchestration on Azure App Service?

🔗 **GitHub Repository**: [https://github.com/Azure-Samples/app-service-maf-openai-travel-agent-dotnet](https://github.com/Azure-Samples/app-service-maf-openai-travel-agent-dotnet)

The repository includes:

- ✅ Complete .NET 9 source code with 6 specialized ChatClientAgents
- ✅ Infrastructure as Code (Bicep) for one-command deployment
- ✅ Web UI with real-time progress tracking
- ✅ Comprehensive README and architecture documentation
- ✅ External API integrations (weather, currency)
- ✅ Client-side chat history management with Cosmos DB

### Deploy in Minutes

```bash
# Clone the repository
git clone https://github.com/Azure-Samples/app-service-maf-openai-travel-agent-dotnet.git
cd app-service-maf-openai-travel-agent-dotnet

# Login to Azure
azd auth login

# Provision infrastructure and deploy the API
azd up
```

This provisions:

- Azure App Service (P0v4 Premium Windows)
- Azure Service Bus (message queue)
- Azure Cosmos DB (state + chat history storage)
- Azure AI Services (AI Services resource)
- GPT-4o model deployment (GlobalStandard 50K TPM)

Then manually deploy the WebJob following the [README instructions](https://github.com/Azure-Samples/app-service-maf-openai-travel-agent-dotnet#deploy-the-webjob).

### Compare with Part 2

Want to see the differences firsthand? Deploy both samples:

**Part 2 - Server-Side Foundry Agents:**  
🔗 [https://github.com/Azure-Samples/app-service-maf-workflow-travel-agent-dotnet](https://github.com/Azure-Samples/app-service-maf-workflow-travel-agent-dotnet)

**Part 3 - Client-Side ChatClientAgent (this post):**  
🔗 [https://github.com/Azure-Samples/app-service-maf-openai-travel-agent-dotnet](https://github.com/Azure-Samples/app-service-maf-openai-travel-agent-dotnet)

Same travel planner, same workflow, same results—different execution model. Try both and see which fits your needs!

## Key Takeaways

- ✅ **Microsoft Agent Framework offers choice**: Client-side (ChatClientAgent) vs. Server-side (Foundry Agents)
- ✅ **ChatClientAgent gives you full control**: Orchestration, chat history, agent lifecycle—you manage it all in code
- ✅ **Foundry Agents give you convenience**: Managed infrastructure, built-in features, portal UI—let the platform handle the details
- ✅ **Azure App Service supports both equally**: Same async request-reply pattern, same WebJob architecture, same infrastructure
- ✅ **Pick the right tool for your needs**: Complex coordination and cost control → ChatClientAgent. Simple scenarios and managed infrastructure → Foundry Agents.

Whether you choose client-side or server-side agents, Azure App Service provides the perfect platform for long-running AI workloads—reliable, scalable, and fully managed.

## What's Next?

This completes our three-part series on building AI agents with Microsoft Agent Framework on Azure App Service:

- [Part 1](https://techcommunity.microsoft.com/blog/appsonazureblog/build-long-running-ai-agents-on-azure-app-service-with-microsoft-agent-framework/4463159): Introduction to Agent Framework and async request-reply pattern
- [Part 2](https://techcommunity.microsoft.com/blog/appsonazureblog/part-2-build-long-running-ai-agents-on-azure-app-service-with-microsoft-agent-fr/4465825): Multi-agent systems with server-side Foundry Agents
- **Part 3 (this post)**: Client-side multi-agent orchestration with ChatClientAgent

What would you like to see next? More advanced orchestration patterns? Integration with other Azure services?

Let me know in the comments what you'd like to learn about next and I'll do my best to deliver!
