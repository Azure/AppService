---
title: "Running SLMs as Sidecar extensions on App Service for Linux"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

## Introduction:

Natural language processing (NLP) is no longer limited to massive AI models requiring significant computational resources. With the rise of Small Language Models (SLMs), you can now integrate lightweight yet powerful AI capabilities into your applications without the cost and complexity of traditional Large Language Models (LLMs). 

Phi-3 and Phi-4 are two such state-of-the-art SLMs optimized for efficiency and high-quality reasoning. Designed to operate with minimal resource overhead, these models are ideal for scenarios where responsiveness, security and cost-effectiveness are paramount. 

- **Phi-3-Mini-4K-Instruct** is a compact 3.8B parameter model trained on a high-quality dataset, making it an excellent choice for inference tasks with limited infrastructure.
- **Phi-4**, built on a blend of synthetic and public datasets, is a quantized model optimized for enhanced performance in constrained environments.

By deploying these models as **sidecars on App Service for Linux**, you can seamlessly enhance applications with conversational AI, content generation, and advanced NLP features. Lets get started!

## Building a Frontend for Phi-3 and Phi-4

To showcase the capabilities of running Phi-3 and Phi-4 as sidecars, we have a sample application that acts as a frontend for these models: [Fashion Assistant App](https://github.com/Azure-Samples/sidecar-samples/tree/main/dotnet-slm-fashion-assistant-app). This is a .NET Blazor application that implements a chat functionality, allowing users to interact with an AI-powered assistant for on-demand product information and styling suggestions.

1. Open the **dotnet-slm-fashion-assistant-app** project in VS Code.
2. Open **Program.cs**. Here you can see how we have configured the endpoint for the model:
   ```csharp
   builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.Configuration["FashionAssistantAPI:Url"] ?? "http://localhost:11434/v1/chat/completions") });
   builder.Services.AddHttpClient();
   ```
3. Open **SLMService.cs** and navigate to the `StreamChatCompletionsAsync` function:
   This function is calling the SLM endpoint using `HttpRequestMessage`
    ```csharp
    var content = new StringContent(JsonSerializer.Serialize(requestPayload), Encoding.UTF8, "application/json");

    var request = new HttpRequestMessage(HttpMethod.Post, _apiUrl)
    {
        Content = content
    };

    var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);
    response.EnsureSuccessStatusCode();
    ```

    The response that we get from the endpoint is displayed one token at a time.
    ```csharp
    while (!reader.EndOfStream)
    {
        var line = await reader.ReadLineAsync();
        line = line?.Replace("data: ", string.Empty).Trim();
        if (!string.IsNullOrEmpty(line) && line != "[DONE]")
        {
            var jsonObject = JsonNode.Parse(line);
            var responseContent = jsonObject?["choices"]?[0]?["delta"]?["content"]?.ToString();
            if (!string.IsNullOrEmpty(responseContent))
            {
                yield return responseContent;
            }
        }
    }
    ```

4. Open **Home.razor**. 
   Here, we get the user input which includes the product and the question. This then forms the prompt and is passed to the `StreamChatCompletionsAsync` function. 
    ```csharp
    Product selectedItem = new Product().GetProduct(int.Parse(selectedProduct));

    var queryData = new Dictionary<string, string>
    {
        {"user_message", message},
        {"product_name", selectedItem.Name},
        {"product_description", selectedItem.Description }
    };

    var prompt = JsonSerializer.Serialize(queryData);

    await foreach (var token in slmService.StreamChatCompletionsAsync(prompt))
    {
        response += token;
        isLoading = false;

        StateHasChanged();
    }
    ```

## Deploying Your Web Application

Before adding the Phi sidecar extension, you need to deploy your application to Azure App Service. There are two ways to deploy applications: **code-based deployment** and **container-based deployment**.

**Code-Based Deployment**

1. Go to the Azure Portal and create a .NET 8 Linux App Service.

    ![Create web app]({{site.baseurl}}/media/2025/03/create-code-based-app.jpg)

2. Set up CI/CD with GitHub to automate deployments. [Deploy to App Service using GitHub Actions](https://learn.microsoft.com/en-us/azure/app-service/deploy-github-actions?tabs=openid%2Caspnetcore)

    *Note: Sidecars for code-based applications only support GitHub Actions right now. We are rolling out the experience for other deployment methods*

3. Push your application code to your GitHub repository.

The deployment pipeline will automatically build and deploy your web application to Azure App Service.

**Container-Based Deployment**

1. Use the Dockerfile in your repository to build a container image of your application. We have a sample Dockerfile [here](https://github.com/Azure-Samples/sidecar-samples/blob/main/dotnet-slm-fashion-assistant-app/Dockerfile)

2. Build the image and push it to your preferred container registry, such as Azure Container Registry, Docker Hub, or a private registry.

3. Go to the Azure Portal and create a container-based App Service.

    ![Create web app]({{site.baseurl}}/media/2024/07/CreateWebApp.jpg)

    On the Container tab, make sure that Sidecar support is Enabled.

    Specify the details of your application image.

    ![Create web app]({{site.baseurl}}/media/2025/03/add-container.jpg)

    *Note: We strongly recommend enabling [Managed Identity](https://learn.microsoft.com/azure/app-service/overview-managed-identity?tabs=portal%2Chttp) for your Azure resources.*

## Adding the Phi Sidecar Extension

Once your application is deployed, follow these steps to enable the Redis sidecar extension:

1. Navigate to the **Azure Portal** and open your **App Service** resource.
2. Go to **Deployment Center** in the left-hand menu and navigate to the **Containers** tab.

    *Note: You might see a banner which says ***Interested in adding containers to run alongside your app? Click here to give it a try***. Clicking on the banner will enable the new Containers experience for you.*
    
3. Add the Phi sidecar extension like this

    ![Phi Sidecar]({{site.baseurl}}/media/2025/03/add-phi.jpg)

## Testing the application

After adding the sidecar, wait a few minutes for the application to restart.

Once the application is live, navigate to it and try asking questions like `Tell me more about this shirt` or `How do I pair this shirt?`

![Phi app]({{site.baseurl}}/media/2025/03/Exercise-4-answer.jpg)


## Conclusion

The integration of Phi models as sidecars on Azure App Service for Linux demonstrates the power of Small Language Models (SLMs) in delivering efficient, AI-driven experiences without the overhead of large-scale models. We are actively working on more AI scenarios for Azure App Service and would love to hear what you are building. Your feedback and ideas are invaluable as we continue to explore the possibilities of AI and cloud-based deployments.





