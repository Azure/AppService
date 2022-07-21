---
title: "Deploying to Network-secured sites, Part 2"
author_name: "Jason Freeberg"
toc: true
toc_sticky: true
tags: 
    - Deployment
    - Networking
---

[An earlier article](https://azure.github.io/AppService/2021/01/04/deploying-to-network-secured-sites.html) explained how to use self-hosted Azure DevOps agents to build and deploy your applications to a web app that has Private Endpoints enabled, or an [ILB ASE](https://docs.microsoft.com/azure/app-service/environment/create-ilb-ase). If you didn't read that article, the TL;DR is that [Private Endpoints](https://azure.github.io/AppService/2020/10/06/private-endpoint-app-service-ga.html) blocks inbound access to your web app from the public internet. Private Endpoints is great for securing internal-facing applications without deploying an [App Service Environment](https://docs.microsoft.com/azure/app-service/environment/intro), but it means that you cannot directly publish your code to the web app from your local machine or Continuous Integration pipeline because that traffic is blocked. The [earlier article](https://azure.github.io/AppService/2021/01/04/deploying-to-network-secured-sites.html) shows how to deploy Azure DevOps build agents onto Virtual Machine Scale Sets in your Azure VNet. Those agents can publish to the web app since the deployment is sent from within the virtual network, not over the public internet.

## Solution Overview

This article shows how to deploy to a Private Endpoint-enabled site from a Continuous Integration pipeline (such as GitHub Actions, Circle CI, Jenkins, or Travis CI) without having to self-host the CI service on a VM. Since Private Endpoints disables all **inbound** traffic from the internet, our CI pipeline will publish the files to a storage account and give the web app a SAS URL to files. Once the web app is given this SAS URL, it will pull the files from the storage account.

We will use GitHub Actions as the CI system to demonstrate this solution, but the same pattern can be applied to other CI providers as well. If you are not familiar with GitHub Actions, please [refer to the docs](https://docs.github.com/en/actions). If you are using a different CI system, simply copy the Azure CLI commands at the bottom, and use them in your CI provider.

## GitHub Actions workflow

The workflow has two jobs. The first builds and tests the application and uploads the artifact for the second job. Once the artifact is built, tested and uploaded, the second job pulls the artifact and runs an Azure CLI script to publish the files to an Azure Storage Account. Once the files are uploaded, we generate a SAS URL for the storage container with an expiration of 30-minutes. (This means the URL will be invalid 10 minutes after creation.) The web app then pulls the application from the storage account and deploys it. Behind the scenes, the Azure CLI commands are using [ZIP deploy](https://docs.microsoft.com/azure/app-service/deploy-zip#deploy-zip-file-with-azure-cli) to publish the application. Once your code is deployed to the web app, a final CLI command deletes the storage container that contained the ZIP file.

**Note:** A bug has been identified in the CLI command below and a fix is underway. You can accomplish the same result by using `az rest` to send the deployment request directly to the ARM API. Example:
```bash
az storage blob upload --account-name $STORAGE_ACCOUNT -c $CONTAINER -f ROOT.war
APP_URL=$(az storage blob generate-sas --full-uri --permissions r --expiry $EXPIRY --account-name $STORAGE_ACCOUNT -c $CONTAINER -n ROOT.war | xargs)
az rest --method PUT \
        --uri https://management.azure.com/subscriptions/${SUBSCRIPTION}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Web/sites/${WEBAPP}/extensions/onedeploy?api-version=2020-12-01 \
        --body '{ 
            "properties": { 
                "properties": {
                    "packageUri": "'"${APP_URL}"'"
                }, 
                "type": "zip",
            }
        }'
```
{: .notice--warning}

{% raw %}
```yaml
name: Deploy web app via Storage Account

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

env:
  WEBAPP: your-webapp-name
  GROUP: your-resource-group-name
  ACCOUNT: name-for-storage-acct  # Does not have to exist, this will be created for you
  CONTAINER: name-for-storage-container
  EXPIRY_TIME: 10 minutes

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    
    - name: Set up JDK 1.8
      uses: actions/setup-java@v1
      with:
        java-version: 1.8
        
    - name: Build with Maven
      run: mvn package
      
    - name: Upload artifact for deployment jobs
      uses: actions/upload-artifact@v2
      with:
        name: app
        path: target/app.jar
  
  publish:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
          
      - name: Download artifact
        uses: actions/download-artifact@v2
        with:
          name: app
      
      - name: Zip the app contents
        uses: papeloto/action-zip@v1
        with:
          files: app.jar
          dest: app.zip

      - name: Set SAS token expiration
        run: echo "expiry=`date -u -d "$EXPIRY_TIME" '+%Y-%m-%dT%H:%MZ'`" >> $GITHUB_ENV

      - name: Azure CLI script
        uses: azure/CLI@v1
        with:
          azcliversion: 2.19.1
          inlineScript: |
            az extension add --name webapp

            az storage account create   -n $ACCOUNT   -g $GROUP -l westus
            az storage container create -n $CONTAINER --account-name $ACCOUNT
            az storage blob upload      -f app.zip    --account-name $ACCOUNT -c $CONTAINER -n $ACCOUNT

            ZIP_URL=$(az storage blob generate-sas --full-uri --permissions r --expiry ${{ env.expiry }} --account-name $ACCOUNT -c $CONTAINER -n $ACCOUNT | xargs)

            az webapp deploy --name $WEBAPP --resource-group $GROUP --type zip --src-url  $ZIP_URL --async false

            az storage container delete -n $CONTAINER --account-name $ACCOUNT 
```
{% endraw %}

To use this workflow in your GitHub project, simply [create an Azure Service Principal](https://github.com/azure/login#configure-deployment-credentials) and save it as a secret named `AZURE_CREDENTIALS` in your repository. Finally, update the `WEBAPP`, `CONTAINER`, `GROUP`, and `ACCOUNT` environment variables with your desired resource names. By default, this workflow will run whenever a commit is pushed to the `main` or `master` branch. You can change this by updating the workflow triggers at the top of the yaml file. You can change the SAS token expiration time by changing the value of the `EXPIRY_TIME` variable at the top of the workflow.

> The [`az webapp deploy`](https://docs.microsoft.com/cli/azure/ext/webapp/webapp?view=azure-cli-latest#ext_webapp_az_webapp_deploy) command is in the `webapps` extension as of March 2021, it will be included in the core CLI in future release.

## Notes for other CI services

Not using GitHub Actions? No problem! You can log into the Azure CLI using a Service Principal, just like on GitHub Actions, and use the Azure CLI commands at the bottom of the yaml file. We have compiled some helpful resources for common CI providers below.

- [Azure DevOps](https://docs.microsoft.com/azure/devops/pipelines/tasks/deploy/azure-cli?view=azure-devops)
- [Circle CI](https://circleci.com/developer/orbs/orb/circleci/azure-cli)
- [Jenkins](https://plugins.jenkins.io/azure-cli/)
