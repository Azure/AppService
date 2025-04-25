---
title: "1-Bit Brilliance: BitNet on Azure App Service with Just a CPU"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

In a world where running large language models typically demands GPUs and hefty cloud bills, Microsoft Research is reshaping the narrative with [BitNet](https://www.msn.com/en-in/money/news/microsoft-research-announces-1-bit-a-small-language-model-that-can-run-on-cpu/ar-AA1DiDZd) — a compact, 1-bit quantized transformer that delivers surprising capabilities even when deployed on modest hardware.

BitNet is part of a new wave of *small language models (SLMs)* designed for real-world applications where performance, latency, and cost are critical. Unlike traditional transformer models, BitNet employs 1-bit weight quantization and structured sparsity, making it remarkably lightweight while still retaining strong reasoning abilities.

In this blog, we’ll show you how you can run BitNet on **Azure App Service for Linux**, leveraging its Sidecar architecture to serve BitNet models alongside your web app — no GPU required. Whether you're building intelligent chat interfaces, processing reviews, or enabling offline summarization, you’ll see how App Service enables you to add AI to your app stack — with simplicity, scalability, and efficiency.

## Getting Started with BitNet on Azure App Service

To make it even easier to get hands-on with the BitNet model, we’ve published a ready-to-use Docker image:  
👉 [**sample-experiment:bitnet-b1.58-2b-4t-gguf**](https://mcr.microsoft.com/appsvc/docs/sidecars/sample-experiment:bitnet-b1.58-2b-4t-gguf)

You can try it in **two simple ways**:

---

### 1. **Spin up a Container-Based App with BitNet (Quickest way)**

The easiest way to get started is by creating a container-based app on Azure App Service and pointing it to the BitNet image.

Here’s how you can do it through the Azure Portal:

1. In the Azure Portal, go to **Create a resource > Web App**.
2. Under **Publish**, select **Container**.
3. Choose **Linux** as the Operating System.

![Create web app]({{site.baseurl}}/media/2024/07/CreateWebApp.jpg)


4. In the **Containers** tab:
   - Set **Image source** to **Other Container registries**.
   - Enter this Image and Tag:  
     `mcr.microsoft.com/appsvc/docs/sidecars/sample-experiment:bitnet-b1.58-2b-4t-gguf`

     Specify the port as 11434
5. Review and **Create** the app.

![Container config tab]({{site.baseurl}}/media/2025/04/container-config-bitnet.jpg)


Once deployed, you can simply browse to your app’s URL.  

Because BitNet is based on [llama.cpp](https://github.com/ggerganov/llama.cpp), it automatically serves a **default chat interface** in the browser — no extra code needed!

![Sample output]({{site.baseurl}}/media/2025/04/output-default.jpg)

---

### 2. **Customize Your Chat UI with a Python Flask App**

If you want to build a more customized experience, we have you covered too!

You can use a simple [Flask](https://flask.palletsprojects.com/) app that talks to our BitNet container running as a sidecar.  
Here’s how it works:

The app calls the BitNet sidecar its local endpoint:

```python
ENDPOINT = "http://localhost:11434/v1/chat/completions"
```

It sends a POST request with the user message and **streams** back the response.

Here’s the core Flask route:

```python
@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get("message", "")
    payload = {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_message}
        ],
        "stream": True,
        "cache_prompt": False,
        "n_predict": 300
    }

    headers = {"Content-Type": "application/json"}

    def stream_response():
        with requests.post(ENDPOINT, headers=headers, json=payload, stream=True) as resp:
            for line in resp.iter_lines():
                if line:
                    text = line.decode("utf-8")
                    if text.startswith("data: "):
                        try:
                            data_str = text[len("data: "):]
                            data_json = json.loads(data_str)
                            for choice in data_json.get("choices", []):
                                content = choice.get("delta", {}).get("content")
                                if content:
                                    yield content
                        except json.JSONDecodeError:
                            pass

    return Response(stream_response(), content_type='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True)
```

---

### Steps to deploy:

1. **Clone the sample Flask app** from our [GitHub repo](https://github.com/Azure-Samples/sidecar-samples/tree/main/bitnet-chat-app).
2. [**Deploy the Flask app**](https://learn.microsoft.com/en-us/azure/app-service/quickstart-python) to Azure App Service as a Python Web App (Linux). 
3. After deployment, **add a BitNet sidecar**:
   - Go to your App Service in the Azure Portal.
   - Go to the **Deployment Center** for your application and add the BitNet image as a sidecar container.
    ![Add BitNet sidecar]({{site.baseurl}}/media/2025/04/bitnet-sidecar.jpg)

4. **Save and Restart** the app.

Once complete, you can browse to your app URL — and you’ll see a simple, clean chat interface powered by BitNet!

![Sample chat output]({{site.baseurl}}/media/2025/04/output-chat.jpg)


## Resources and Further Reading

- [🔗 BitNet GitHub Repository](https://github.com/microsoft/BitNet)  
  Explore the official BitNet project from Microsoft Research, including model details and technical documentation.

- [🔗 Azure App Service Documentation](https://learn.microsoft.com/en-us/azure/app-service/)  
  Learn more about Azure App Service and how to easily host web apps, APIs, and containers.

- [🔗 Azure App Service Sidecars Deep-Dive](https://azure.github.io/AppService/2025/03/06/Sidecars-Deep-Dive-Part1.html)  
  Understand how Sidecars can run supporting services (like BitNet!) alongside your main app in App Service.

- [🔗 llama.cpp GitHub Repository](https://github.com/ggerganov/llama.cpp)  
  Discover the project that inspired BitNet’s server — a lightweight C++ inference engine for LLMs.

- [🔗 Quickstart: Deploy a containerized app to App Service](https://learn.microsoft.com/en-us/azure/app-service/quickstart-custom-container?tabs=portal)  
  Step-by-step guide to deploying your own Docker container on Azure App Service.

- [🔗 BitNet model container image](https://mcr.microsoft.com/appsvc/docs/sidecars/sample-experiment:bitnet-b1.58-2b-4t-gguf)  
  The ready-to-use BitNet container image you can deploy today on App Service.


## Closing Thoughts

We’re entering an exciting new era where small, efficient language models like BitNet are making AI more accessible than ever — no massive infrastructure needed.  
With Azure App Service, you can deploy these models quickly, scale effortlessly, and start adding real intelligence to your applications with just a few clicks.

We can’t wait to see what you build with BitNet and Azure App Service!  
If you create something cool or have feedback, let us know — your experiments help shape the future of lightweight, powerful AI.
