---
title: "Deploy LangChain applications to Azure App Service"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

[LangChain](https://python.langchain.com/) is a powerful framework that simplifies the development of applications powered by large language models (LLMs). It provides essential building blocks like chains, agents, and memory components that enable developers to create sophisticated AI workflows beyond simple prompt-response interactions. LangChain's importance lies in its ability to orchestrate complex AI operations, integrate multiple data sources, and maintain conversation context—making it the go-to choice for production-ready AI applications.

In this blog post, we'll explore a [sample application](https://github.com/Azure-Samples/appservice-ai-samples/tree/main/langchain-fastapi-chat) that demonstrates how you can easily deploy a LangChain application integrated with Azure OpenAI Foundry models to Azure App Service. We'll walk through this complete example that showcases a conversational AI chat interface with streaming responses and intelligent summarization—all deployed seamlessly using modern cloud-native practices.

## What We're Building

Our sample application is a FastAPI web service that provides:
- **Real-time streaming responses** from Azure OpenAI's GPT-4o model
- **Automatic summarization** of long responses using LangChain's summarize chain
- **Secure authentication** via Azure Managed Identity
- **Modern chat UI** with a responsive design
- **Easy deployment** using Azure Developer CLI (azd)

## Key Technical Highlights

### 1. Secure Connection to Azure OpenAI with Managed Identity

This sample uses **Azure Managed Identity** for authentication. This eliminates the need to store API keys in your code or configuration files:

```python
from azure.identity import DefaultAzureCredential

# Use Managed Identity to get a token for Azure OpenAI
credential = DefaultAzureCredential()
token = credential.get_token("https://cognitiveservices.azure.com/.default")

# Configure LangChain with the token
llm_long = AzureChatOpenAI(
    azure_endpoint=endpoint,
    openai_api_version="2025-01-01-preview",
    deployment_name=deployment,
    temperature=0.5,
    streaming=True,
    max_tokens=600,
    azure_ad_token=token.token  # Secure token-based auth
)
```

This approach provides several benefits:
- **Enhanced security**: No API keys to manage or accidentally expose
- **Simplified operations**: Azure handles token refresh automatically
- **Enterprise-ready**: Integrates with Azure RBAC and compliance policies

### 2. Intelligent Response Chaining with LangChain

The application showcases LangChain's powerful chaining capabilities by creating two distinct AI workflows:

```python
# LLM for detailed responses
llm_long = AzureChatOpenAI(
    # ... configuration for detailed answers
    streaming=True,
    max_tokens=600
)

# LLM for concise summaries
llm_summary = AzureChatOpenAI(
    # ... configuration optimized for summaries
    temperature=0,  # More deterministic for summaries
    max_tokens=200
)

# Create a summarization chain
summarize_chain = load_summarize_chain(llm_summary, chain_type="stuff")
```

This dual-model approach allows users to receive both comprehensive answers and digestible summaries, enhancing the user experience significantly.

### 3. Real-Time Streaming Responses

The application implements streaming responses to provide immediate feedback to users:

```python
async def streamer():
    # 1. Stream the long answer token by token
    long_answer = ""
    for chunk in llm_long.stream(messages):
        long_answer += chunk.content
        yield chunk.content  # Stream to frontend immediately
        await asyncio.sleep(0)  # Yield control to event loop

    # 2. Generate and stream summary after completion
    docs = [Document(page_content=long_answer)]
    summary = await loop.run_in_executor(None, summarize_chain.run, docs)
    yield "__SUMMARY__" + summary

return StreamingResponse(streamer(), media_type="text/plain")
```

This streaming approach creates a responsive user experience where text appears as it's generated, similar to ChatGPT's interface.

### 4. Token Management and Response Tuning for AI Applications

AI applications require careful consideration of token usage to avoid throttling and optimize performance. The code includes some defaults for both token limits and response behavior:

```python
# Restrict max_tokens to avoid hitting rate limits
llm_long = AzureChatOpenAI(
    max_tokens=600,  # Balanced for detailed responses
    temperature=0.5  # Moderate creativity for conversational responses
)

llm_summary = AzureChatOpenAI(
    max_tokens=200,  # Shorter for summaries
    temperature=0    # Lower temperature for more focused, deterministic summaries
)
```

Key considerations for AI applications:
- **Token limits**: Prevent hitting Azure OpenAI rate limits and manage costs
- **Temperature settings**: Lower values (0-0.3) produce more focused, consistent responses, while higher values (0.7-1.0) increase creativity
- **Response optimization**: Different configurations for different use cases (detailed vs. summary responses)

These parameters can be adjusted based on your Azure OpenAI quota and specific use case requirements.

## Deploying Your Own Instance

Getting this sample running in your Azure environment is straightforward with Azure Developer CLI:

### Prerequisites
- [Azure Developer CLI (azd)](https://aka.ms/azd)
- An Azure subscription with Azure OpenAI access
- Python 3.10+

### Deployment Steps

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd langchain-fastapi-chat
   ```

2. **Initialize azd:**
   ```bash
   azd init
   ```

3. **Deploy everything:**
   ```bash
   azd up
   ```

That's it! The `azd up` command will:
- Provision Azure AI Foundry and deploy the GPT-4o model
- Create an App Service with managed identity
- Configure role assignments for secure access
- Deploy your FastAPI application
- Set up all necessary environment variables

## See It In Action

Once deployed, your chat interface will look like this when users interact with it:

![Chat Interface Example]({{site.baseurl}}/media/2025/08/chat-output.jpg)

*The interface shows both the detailed streaming response and the automatically generated summary, demonstrating LangChain's chaining capabilities in action.*

## Customization Options

### Switch Models
To use a different AI model, update the `aiFoundryModelName` parameter in `infra/main.bicep`:

```bicep
@description('AI Foundry Model deployment name')
param aiFoundryModelName string = 'gpt-3.5-turbo'  // or your preferred model
```

### Adjust Token Limits
Modify the `max_tokens` values in `app.py` based on your quota:

```python
llm_long = AzureChatOpenAI(
    max_tokens=1000,  // Increase for longer responses
    # ...
)
```

### Use API Keys Instead of Managed Identity
If you prefer API key authentication, you can modify the LangChain configuration:

```python
llm_long = AzureChatOpenAI(
    azure_endpoint=endpoint,
    openai_api_key=your_api_key,  // Instead of azure_ad_token
    # ...
)
```

## Next Steps

This sample provides a foundation for building more sophisticated AI applications. Consider extending it with:

- **Conversation memory** using LangChain's memory components
- **Document upload and analysis** capabilities
- **Multiple AI model support** for different use cases
- **User authentication and personalization**
- **Advanced prompt engineering** for domain-specific responses

## Conclusion

The complete sample code and deployment templates are available in the [appservice-ai-samples repository](https://github.com/Azure-Samples/appservice-ai-samples), making it easy to get started with your own AI-powered web applications.

Ready to build your own AI chat app? Clone the repo and run `azd up` to get started in minutes!

---

*For more Azure App Service AI samples and best practices, check out the [Azure App Service AI integration documentation](https://learn.microsoft.com/en-us/azure/app-service/overview-ai-integration).*
