# Sidecars for Azure App Service for Linux

The **sidecar pattern** is an architectural approach that allows you to deploy components of an application in separate processes or containers, providing both isolation and encapsulation. This pattern is particularly useful for applications needing to be composed of diverse components and technologies, including new capabilities and integrations. [Learn more about how you can use sidecar extensibility to modernize your applications](https://techcommunity.microsoft.com/blog/appsonazureblog/announcing-the-general-availability-of-sidecar-extensibility-in-azure-app-servic/4267985)

## Benefits of Using the sidecar extensibility on Azure App Service for Linux

The sidecar pattern enables applications to expand functionality seamlessly. By adding sidecars, you can introduce a variety of capabilities to enhance your application, including:

- **Observability**: Integrate monitoring and observability tools to gain insights into application performance without modifying your core application code.
- **Caching**: Improve response times and performance by adding caching services as a sidecar component.
- **AI Features**: Add artificial intelligence capabilities, such as language models or machine learning models, in a sidecar to process or augment application data.

## Availability

Sidecars for Azure App Service for Linux is now **generally available** across all public regions. This feature supports both **code-based applications** and **container-based applications**.

- **For code-based apps**: You can configure sidecars using Azure Resource Manager (ARM) templates. Here is a sample [ARM template](https://github.com/Azure-Samples/sidecar-samples/tree/main/sidecar-arm-template) that you can use. [Learn more about using ARM templates to create App Service App](https://learn.microsoft.com/en-us/azure/app-service/quickstart-arm-template?pivots=platform-linux)
> *Note*: Portal support for this feature is being gradually rolled out. This documentation will be updated once the rollout is complete. We expect the rollout to be completed by Januray, 2025.
- **For container-based apps**: Get started by following this [custom container tutorial](https://learn.microsoft.com/en-us/azure/app-service/tutorial-custom-container-sidecar) on deploying a sidecar for your containerized application.

## Learn More

To explore scenarios where sidecars can add value, including observability, caching, and AI-based enhancements, please refer to the following resources:

- Enhancing Observability with [Datadog](https://azure.github.io/AppService/2024/07/26/Using-Datadog-with-Sidecar.html) and [Dynatrace](https://azure.github.io/AppService/2024/07/26/Using-Dynatrace-with-Sidecar.html)
- [Improving application performance with Redis sidecar](https://azure.github.io/AppService/2024/07/19/Using-Redis-with-Sidecar.html)
- [Integrating AI Capabilities Using Sidecars](https://azure.github.io/AppService/2024/09/03/Phi3-vector.html)

With sidecars for Linux App Service, you can effectively modernize applications and build new ones that leverage distributed, heterogeneous components, enhancing both flexibility and scalability.
