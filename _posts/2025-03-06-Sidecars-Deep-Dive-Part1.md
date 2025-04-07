---
title: "Sidecars in Azure App Service: A Deep Dive"
author_name: "Tulika Chaudharie"
---

In November 2024, we announced the [General Availability (GA) of the Sidecar feature for Azure App Service for Linux](https://techcommunity.microsoft.com/blog/appsonazureblog/announcing-the-general-availability-of-sidecar-extensibility-in-azure-app-servic/4267985). Today, we want to dive deep into this feature to help developers understand its capabilities and configurations. This blog post is the first in a series that will explore various aspects of Sidecars, from specification details to deployment and advanced use cases.

### What is a Sidecar in Azure App Service?
In a typical App Service deployment, a single container runs the application workload. With the new **Sidecar feature**, you can now deploy additional supporting containers that run alongside the main application container within the same site unit. 

This feature applies to **both single-container and multi-container applications**, introducing a new, more intuitive way to configure single-container applications as well. Previously, configuring a single container required setting `LinuxFxVersion=DOCKER|<image details>` and defining multiple app settings for details like port configuration. With **SiteContainers**, configuration is now **unified and streamlined** across:
- **Single-container applications**
- **Multi-container applications**
- **Code-based applications** that want to add a sidecar

This feature is available for **custom container-based deployments** under a new `LinuxFxVersion`:  
```
LinuxFxVersion=sitecontainers
```

For **code-based apps**, customers can also add sidecars that will run alongside the the main code container as part of the site unit.

**Note: The content in this document does not apply to sites using Docker Compose**

## Sidecar Specification Format
A **sidecar-enabled site unit** is defined using a JSON specification. Below is an example of what this spec looks like:

```json
{
  "image": "mcr.microsoft.com/appsvc/staticsite:latest",
  "isMain": true,
  "targetPort": "80",
  "startUpCommand": null,
  "authType": "Anonymous",
  "userName": null,
  "passwordSecret": null,
  "userManagedIdentityClientId": null,
  "inheritAppSettingsAndConnectionStrings": false,
  "volumeMounts": [
    {
      "volumeSubPath": "/host/path",
      "containerMountPath": "/path/in/container",
      "readOnly": false
    }
  ],
  "environmentVariables": [
    {
      "name": "envVarName",
      "value": "APPSETTING_REF"
    }
  ]
}
```

## Sidecar Specification Attributes
The table below outlines the attributes used in the Sidecar specification. These attributes define the properties of each container within the site unit.

| Name  | Type  | Is Required | Default Value | Description  |
|-------|------|------------|--------------|-------------|
| `image` | String | Yes | N/A | The fully qualified container image to be used. |
| `isMain` | Boolean | Yes | false | Indicates whether this container is the main application container. |
| `targetPort` | String | No | null | The port on which the container listens. |
| `startUpCommand` | String | No | null | The startup command to run when the container is starting. |
| `authType` | String | No | null | Authentication type for the container registry. The allowed values are 1. Anonymous 2. UserCredentials 3. SystemIdentity 4. UserAssigned |
| `userName` | String | No | null | Username for the container registry if required. |
| `passwordSecret` | String | No | null | Secret key reference for the container registry password. |
| `userManagedIdentityClientId` | String | No | null | The Managed Identity used for authentication to the container registry. |
| `inheritAppSettingsAndConnectionStrings` | Boolean | No | true | If false, prevents AppSettings from being inherited. |
| `volumeMounts` | Array | No | [] | List of volumes mounted to the container. |
| `environmentVariables` | Array | No | [] | List of environment variables for the container. |


**Attributes for volumeMounts**

| Name  | Type  | Is Required | Default Value | Description  |
|-------|------|------------|--------------|-------------|
| `volumeSubPath` | String | Yes | N/A | Path of the directory relative to the volume on the host. |
| `containerMountPath` | String | Yes | N/A | Target Path on the container. |
| `readOnly` | Boolean | false | N/A | Specify if the mount is read only on container. |


**Attributes for environmentVariables**

| Name  | Type  | Is Required | Default Value | Description  |
|-------|------|------------|--------------|-------------|
| `name` | String | Yes | N/A | Name of the variable on the container. |
| `value` | String | Yes | N/A | The value of this environment variable must be the name of an AppSetting. The actual value of the environment variable in container will be retrieved from the specified AppSetting at runtime. If the AppSetting is not found, the value will be set to an empty string in the container at runtime. |


## Important Considerations
- If you are using custom containers, you would need to set `linuxFxVersion = sitecontainers`. If the `LinuxFxVersion=DOCKER|<>` is set, any sidecars which are added would be ignored.
- App Service **routes traffic only to the container marked as the main container** (`IsMain=true` in the sidecar spec). For Code-based apps, we route traffic to main code container and you should only add other sidecars with IsMain = false.
- All containers **share the same network namespace** and can communicate over `localhost`, so port conflicts must be avoided.
- The default storage volume (`/home`) is **mounted to all containers** unless App Service Storage is disabled using the app setting:
  ```
  WEBSITES_ENABLE_APP_SERVICE_STORAGE=false
  ```
- **All application settings** are passed to all containers as environment variables unless overridden using `inheritAppSettingsAndConnectionStrings=false` in the sidecar spec.
- Each container can also have its **own specific environment variables** defined in the spec based on chosen AppSetting references.
- A **custom local volume** can be optionally mounted and shared across containers.

## Additional Resources
If you'd like to explore the specifications further and see how to use them in an **ARM template**, check out this example: [Sidecar ARM Template](https://github.com/Azure-Samples/sidecar-samples/tree/main/sidecar-arm-template).

For hands-on tutorials, refer to:
- **Using sidecars in code-based apps:** [Tutorial](https://learn.microsoft.com/en-us/azure/app-service/tutorial-sidecar?tabs=portal)
- **Using sidecars in container-based apps:** [Tutorial](https://learn.microsoft.com/en-us/azure/app-service/tutorial-custom-container-sidecar)

To explore **scenarios where sidecars add value**, including observability, caching, and AI-based enhancements, refer to the following:
- Enhancing Observability with [Datadog](https://azure.github.io/AppService/2024/07/26/Using-Datadog-with-Sidecar.html) and [Dynatrace](https://azure.github.io/AppService/2024/07/26/Using-Dynatrace-with-Sidecar.html)
- [Improving application performance with Redis sidecar](https://azure.github.io/AppService/2024/07/19/Using-Redis-with-Sidecar.html)
- [Integrating AI Capabilities Using Sidecars](https://azure.github.io/AppService/2024/09/03/Phi3-vector.html)
- [Try out sidecars in this guided lab](https://mslabs.cloudguides.com/guides/Sidecars%20in%20Azure%20App%20Service)

## Summary
The **Sidecars feature in Azure App Service for Linux** introduces **multi-container support**, allowing customers to build **more complex and modular applications**. By using sidecars, developers can extend the capabilities of their applications while keeping their main app lightweight and focused on core functionality.

In the next part of this series, we’ll explore **how to deploy a sidecar-enabled application** and demonstrate practical use cases. Stay tuned!

