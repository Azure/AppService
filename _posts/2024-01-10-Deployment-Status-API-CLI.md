---
title: "Track the status of your deployment in Azure CLI"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
tags:
    - Deployment
---

We're thrilled to announce an upgraded capability within Azure CLI for App Service, now equipped with seamless integration to a Deployment Status backend API. This integration empowers you to effortlessly track your code deployment progress in real-time.

By leveraging this integration, Azure CLI polls for ongoing deployment updates every 10 seconds. The status returned by the backend API is shown as messages tracking the current state of the deployment.

This functionality eliminates ambiguity during code pushes, providing you with a precise understanding of the deployment process. It offers a transparent view into the progression of deployments, enabling informed decision-making and enhancing overall operational efficiency.

Here are the steps to use it

1. First, make sure you are using Azure CLI version [2.56.0](https://github.com/MicrosoftDocs/azure-docs-cli/blob/main/docs-ref-conceptual/release-notes-azure-cli.md) or greater.

    ```bash
    az --version
    ```

    The first line in the output will show the CLI version:

    ```text
    azure-cli                         2.56.0

    core                              2.56.0
    telemetry                          1.1.0
    ```

    If your version is lower, you can upgrade using this command.

    ```bash
    az upgrade
    ```

2. Now, you can deploy your code and track status using the following command. The option `--track-status` will ensure that the polling API is setup for your deployment. Replace `<app-name>`, `<group-name>`, `<repository-path>`, `<zip/war/jar/script>` and `<true/false>` with your Web App name, resource group, repository path, the repository type and whether you want to run the deployment synchronously or not respectively.

    ```bash
        az webapp deploy 
            --name '<app-name>' \
            --resource-group '<group-name>' \ 
            --src-path '<repository-path>' \
            --type='<zip/war/jar/script>' \
            --async '<true/false>'  \
            --track-status 
    ```

    For more information about [az webapp deploy](https://learn.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-deploy), please refer to the documentation.

These are some snippets of the output for `--track-status`

**Deployment Succeeded:**
![Deployment Successful]({{site.baseurl}}/media/2024/01/deployment-successful.jpg)

**Build Failed:**
Here, the build of my code failed and therefore, deployment failed. The error message also gives you a link to the build logs for more detailed errors about the failure.

![Build Failed]({{site.baseurl}}/media/2024/01/deployment-build-failed.jpg)

**Site startup failed after deployment:**
Once the build is done, the API checks to see if the site is restarted. It keeps polling for 10 mins for the site to startup and gives an error if it does not start in that time. Currently, there is no way to alter the timeout but we are working on a way in which you can configure the timeout for site startup after deployment.

![Runtime Failed]({{site.baseurl}}/media/2024/01/deployment-runtime-failed.jpg)

**Conclusion:**
At present, this feature is available only for Linux App Service code deployments. Nevertheless, our team is actively engaged in expanding its reach to custom containers and beyond. Our roadmap includes extending this functionality to encompass various deployment clients such as GitHub and Visual Studio. Stay tuned for forthcoming updates as we continue our efforts to smoothen your deployment journey on Azure App Service.