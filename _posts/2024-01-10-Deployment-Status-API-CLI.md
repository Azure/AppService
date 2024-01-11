---
title: "Use Azure CLI to track the status of your code deployments"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
tags:
    - Deployment
---

We are adding new capability to `az webapp deploy` allowing you to track the status of your code deployments. You can take advantage of more detailed information about the stages of your deployment using the `--track-status` option.

Here are the steps to use it

1. First, make sure you are using Azure CLI version [2.56.0](https://github.com/MicrosoftDocs/azure-docs-cli/blob/main/docs-ref-conceptual/release-notes-azure-cli.md) or greater.

    ```bash
    az --version
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

To give an example, this is the message you get if you run without the tracking option.

**Without tracking**
![Deployment without tracking]({{site.baseurl}}/media/2024/01/deployment-without-tracking.jpg)

Deployment has various steps to it - copying the code to our servers, building the code and copying the binaries and finally restarting the website so that it runs with the new binaries. From the message above, it was hard to determine which step failed.

Now these are some snippets of the output for `--track-status`

**Deployment Succeeded:**
![Deployment Successful]({{site.baseurl}}/media/2024/01/deployment-successful.jpg)

**Build Failed:**
Here, the build of my code failed and therefore, deployment failed. The error message also gives you a link to the build logs for more detailed errors about the failure.

![Build Failed]({{site.baseurl}}/media/2024/01/deployment-build-failed.jpg)

**Site startup failed after deployment:**
Once the build is done, the API checks to see if the site is restarted. It keeps polling for 10 mins for the site to startup and gives an error if it does not start in that time. Currently, there is no way to alter the timeout but we are working on a way in which you can configure the timeout for site startup after deployment.

![Runtime Failed]({{site.baseurl}}/media/2024/01/deployment-runtime-failed.jpg)

**Conclusion:**
At present, this feature is available only for Linux App Service code deployments. This is a platform improvement and our roadmap includes extending this functionality to other deployment clients such as GitHub and Visual Studio. Stay tuned for forthcoming updates as we continue our efforts to smoothen your deployment journey on Azure App Service.