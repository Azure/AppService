---
title: "Deploying to Network-secured sites"
author_name: "Jason Freeberg"
toc: true
toc_sticky: true
tags: 
    - Deployment
    - Networking
---

With the recently-announced [Private Endpoints integration](https://azure.github.io/AppService/2020/10/06/private-endpoint-app-service-ga.html) you can block inbound access from the internet to your web app. Before this integration, developers would need to use an App Service Environment (ASE) if they wanted to host their network-secured applications on App Service. With the combination of the Virtual Network (VNet) and Private Endpoint integrations on App Service, you can secure your site's inbound and outbound requests respectively.

This is great for organizations that want the network security without the added cost of an ASE. However, if inbound access to your site is blocked, that can disrupt your existing delivery pipeline if you were not using Private Endpoints before. This article will walk through the process of installing an Azure DevOps agent on a Virtual Machine (VM) to deploy to a site secured with VNet and Private Endpoints. This solution works for [ILB ASEs](https://docs.microsoft.com/azure/app-service/environment/create-ilb-ase) as well.

> This article assumes some familiarity with Virtual Networks. If you are new to Azure Networking, please see this [Microsoft Learning Path](https://docs.microsoft.com/learn/modules/network-fundamentals/).

## Solution Overview

This guide will walk through the process of deploying a Virtual Machine Scale Set (VMSS) and web app into two subnets of the same virtual network. You wil use Azure DevOps to install a build agent on the virtual machines and configure your DevOps Pipeline to run on those agents. Finally, you will enable private endpoints so the site cannot be reached from the public internet.

## Prerequisites

To follow this guide you will need the following:

- A valid Azure subscription
- An Azure DevOps organization and project
- A DevOps repository with a web application we can deploy to App Service

## Part 1: Set up resources

First, let's set up the Azure DevOps project and VM that will host the agent.

1. Create a Virtual Machine Scale Set with Ubuntu Server 18.04 LTS. This process will automatically create a VNet as well.
2. Once the VM Scale Set is created, open Azure DevOps and navigate to **Project settings** > **Pipelines** > **Agent pools**.
3. Click **Add pool** and this will open a context menu. Under **Pool type** select "Azure virtual machine scale set". Choose your subscription and the VM Scale Set you just created. You can configure the max number of machines for the scale set, the number to keep on standby, and more. Read more information [here](https://docs.microsoft.com/azure/devops/pipelines/licensing/concurrent-jobs?view=azure-devops&tabs=self-hosted).
4. Click **Create** to set up the agent pool. You can monitor the process under **Diagnostics**.

## Part 2: Configure networking features

You now have a VM Scale Set with DevOps agents installed, all deployed within a VNet. Now you will create the web app and confirm that the VM's and webapp can communicate over the virtual network.

1. [Create an Azure Webapp](https://portal.azure.com/#create/Microsoft.WebSite) *in the same region* as the VM. Choose whatever runtime and operating system fit your application.
2. Once the web app is created, go to **Networking** > **VNet Integration**. Add the site to the same virtual network as the VM. The VM and webapp cannot be in the same subnet, so you may need to create another subnet.

    With VNet integration enabled, the web app and VM can communicate over the virtual network. To test this, go to the web console for your site at *https://my-linux-site.scm.azurewebsites.net/webssh/host* on Linux apps, or *https://my-windows-site.scm.azurewebsites.net/DebugConsole/?shell=powershell* for Windows. Once the console is open, run the following command to ping the VM's private IP. You can find your VM's private IP from the **Networking** blade on the VM resource. It's shown under "NIC Private IP".

    ```bash
    root@87d2385265ad$ ping 10.0.0.5  # replace with your VM's private IP
    ```

    Now that the resources are in the same Virtual Network and can communicate over that network, let's enable Private Endpoints on the web app. This will block inbound access to the web app from the public internet.

3. In the Portal, go to your web app > **Networking** > **Private Endpoint connections** > **Configure your private endpoint connections** > **+ Add**. This will open a context blade to configure the Private Endpoint. Provide a name, subscription, and Virtual network. Check the box to allow the service to integrate with Azure Private DNS zones. This will create a private DNS zone if one does not already exist, and set up the correct domain entries for your web app. Click **OK** to create the resources.
4. Once the private link and DNS resources are created, open an SSH connection to your VM. Run the command below to ping the web app and confirm that you can reach the site from the VM. If you cannot reach the site from the VM, the DevOps agent won't be able to either!

    ```bash
    curl your-site-name.azurewebsites.net
    ```

    You can also use `nslookup` to see how the private DNS entries ultimately map to the web app.

### Installing build tools on your VMs

The virtual machines in your scale set may not come with the build tools that your pipeline will need (like Maven, NPM, or dotnet). To install these tools, you can add the [**Custom Script for Linux Extension**](https://github.com/Azure/azure-linux-extensions/tree/master/CustomScript). This extension allows you to upload a shell script that is executed whenever a new VM is provisioned in the scale set. So in this case, the shell script could install your necessary build tools.

## Part 3: Create the CI pipeline

At this point the web app cannot be reached from the public internet but our VM can reach the site through the virtual network. Now let's set up a DevOps Pipeline to build and deploy your application from the VM.

1. Head back to Azure DevOps and go to **Pipelines** > **New pipeline**. Then select the location of your project.
2. Once you choose your project, Azure DevOps will show some templates based on your stack. For example, I was given a starter pipeline to build my Java app with Maven and deploy it to App Service Linux. Click **Show more** if you don't immediately see a good starter template.

    If you are not given a good template to deploy your app to App Service, use the generic starter template and add the [Deploy to Azure Web App](https://docs.microsoft.com/azure/devops/pipelines/targets/webapp?view=azure-devops&tabs=yaml) action.

3. Next, specify the VMSS agent pool by adding [the `pool` keyword](https://docs.microsoft.com/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema#pool) on the pipeline. The value should be the name of your VMSS agent pool that you created earlier.

    ```yaml
    trigger:
    - main

    pool: 'VMSS for private endpoints deployment'  # This is the name of your agent pool

    steps:
      - task: AzureWebApp@1
        displayName: 'Azure Web App Deploy: priv-endpoints-webapp'
        inputs:
          azureSubscription: 'aaaaaa-bbbb-cccc-dddd-eeeeeeeeee'
          appType: webAppLinux
          appName: 'priv-endpoints-webapp'
          package: 'app.jar'
    ```

4. Finally, save and run the workflow! See the pipeline's logs to monitor progress and check for any errors.

## Resources

- [Using Private Endpoints for Azure Web App](https://docs.microsoft.com/azure/app-service/networking/private-endpoint)
- [Integrate your app with an Azure virtual network](https://docs.microsoft.com/azure/app-service/web-sites-integrate-with-vnet)
- [Azure Private Link documentation](https://docs.microsoft.com/azure/private-link/)
- [Azure virtual machine scale set DevOps agents](https://docs.microsoft.com/azure/devops/pipelines/agents/scale-set-agents?view=azure-devops)
