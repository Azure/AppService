---
title: "Deploying to Network-secured sites"
author_name: "Jason Freeberg"
toc: true
toc_sticky: true
tags: Deployment
---

- Opening
  - Set scenario with Vnet and private endpoints, link to announcement post for priv endpoints
  - Point out that Vnet integration allows your site to call into the Vnet, and Priv Endpoints blockes inbound access from the internet
  - But this makes it hard to deploy

## Solution Overview

## Prerequisites
  
- Valid Azure subscription
- An Azure DevOps org and project
- DevOps repo to build a pipeline for

## Part 1: Set up resources
  
1. Create a PAT token with the permissions shown below. When you create the PAT token, save the value for later!

   - **Agent Pools** (read, manage)
   - **deployment groups** (read, manage)

2. Create a Deployment Group by going to **Pipelines** > **Deployment groups** and click **+ New**. Provide a memorable name and description, and click **Create**.
3. Next, [create a Virtual Machine](https://portal.azure.com/#create/Microsoft.VirtualMachine) of your choice, there are DevOps build agents for Linux and Windows. (I used Ubuntu Server 18.04 LTS.)
4. Once the VM is deployed, open it in the Portal and click **Extensions** on the left, then click **+ Add**. This will open the list of VM Extensions. Click the item for **Azure Pipelines Agent For Linux/Windows**, then click **Create** after reading the description.
5. The next blade is where you will provide the PAT token and information about your DevOps project. You can hover over the info icon for more information about each input. Here is an example of the values for my project:  

   ![DevOps Agent VM Extension]({{ site.baseurl }}/media/2020/12/priv-endpoints-deploy-vm-extensions.png)

6. Once the extension is installed, you can open the DevOps deployment groups and you should see that there is now one online agent in the group. You can click into the group for more information.

    ![Deployment group shows an online agent]({{ site.baseurl }}/media/2020/12/priv-endpoints-deploy-deployment-group.png)

## Part 2: Configure networking features

TODo: Opening

1. Create an Azure Webapp with your desired runtime and OS *in the same region* as the VM.
2. Once the VM is created, go to **Networking** > **VNet Integration**. Add the site to the same virtual network as the VM. The VM and webapp cannot be in the same VNet, so you may need to create another subnet.

    With VNet integration enabled, the web app and VM should be able to communicate over the virtual network. To test this, go to the web console for your site at *https://my-linux-site.scm.azurewebsites.net/webssh/host* on Linux apps, or *https://my-windows-site.scm.azurewebsites.net/DebugConsole/?shell=powershell* for Windows. Once the console is open, run the following command to ping the VM's private IP. You can find your VM's private IP from the **Networking** blade on the VM resource. It's shown under "NIC Private IP".

    ```bash
    root@87d2385265ad:/\# ping 10.0.0.5  # replace with your VM's private IP
    ```

    Now that the resources are in the same Virtual Network and can communicate over that network, let's enable Private Endpoints on the web app. This will block inbound access to the web app from the public internet.

3. In the Portal, go to your web app > **Networking** > **Private Endpoint connections** > **Configure your private endpoint connections** > **+ Add**. This will open a context blade to configure the Private Endpoint. Provide a name, subscription, and Virtual network. Make sure you allow the service to integrate with private DNS zones. This will create a private DNS zone if one does not already exist, and set up the domain entries for your web app. Click **OK** to create the resources.
4. Once the private link and DNS resources are created, open an SSH connection to your VM. Run the command below to ping the web app and confirm that you can reach the site from the VM. If you cannot reach the site from the VM, the DevOps agent won't be able to either!

    ```bash
    curl your-site-name.azurewebsites.net
    ```

    You can also use `nslookup` to see how the private DNS entries ultimately map to the web app.

## Part 3: Create the CI pipeline

The site cannot be reached from the internet, and our VM can reach the site through the virtual network. Now let's set up a DevOps Pipeline to deploy your application from the VM.

1. 
