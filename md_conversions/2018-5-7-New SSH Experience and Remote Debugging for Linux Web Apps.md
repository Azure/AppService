---
title: "New SSH Experience and Remote Debugging for Linux Web Apps"
author_name: 
layout: post
hide_excerpt: true
---
<html><head>
<meta charset="utf-8"/>
</head>
<body>
<div id="page">

<a class="url fn n profile-usercard-hover" href="https://social.msdn.microsoft.com/profile/Yi Liao MSFT" target="_blank">Yi Liao MSFT</a>
<time>    5/7/2018 8:27:27 AM</time>
<hr/>
<div id="content">The App Service team is happy to announce the Public Preview of a new SSH experience and the remote debugging capability for Linux app developers. In this release, we're also enabling SFTP (Secure File Transfer Protocol) for Linux web app content management.
<h1><strong>What’s new?</strong></h1>
We’re introducing a new TCP tunneling technology for Azure App Service, which enables SSH/SFTP access and remote debugging for Linux Web Apps.

We’re enabling Linux app developers to SSH into an app container using any SSH client at your choice. Previously we only enabled the SSH access through a Kudu web client. Based on Linux customer’s feedbacks, we’re adding support for any SSH clients to connect to app container.

We’re also enabling SFTP for managing web app content and downloading logs, in addition to the already supported FTP and FTPS protocols.

With the new remote debugging capability for Linux Web Apps, developers can now set break points in a code editor and live debug an web app running in App Service on Linux or Web App for Containers. We will publish additional blogs for know-how on remote debugging in the next several weeks.
<h1><strong>How do I configure my dev machine for SSH/SFTP and remote debugging?</strong></h1>
We use TCP tunneling technology to create a network connection between your dev machine and App Service over an authenticated WebSocket connection. We included the TCP tunneling technology in Azure CLI.  First, make sure you have the latest <a href="https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest">Azure CLI</a> installed. To enable the tunneling from your dev machine, you need to install Azure CLI "webapp" extension. If you install the extension for the first time, use this command:
<pre>az extension add --name webapp.</pre>
If you have an existing webapp extension, use this command to upgrade:
<pre>az extension update --name webapp.</pre>
Once the extension is installed, run the following CLI command to create a TCP tunnel to App Service:
<pre>az webapp remote-connection create –g [resource group] -n [app name] -p [local port to open]</pre>
The command line output on a Linux terminal will be something like this:
<pre>Port [number] is open
Tunnel is ready! Creating on port [number]
Starting local server...</pre>
Now, your dev machine is configured for any general purposed remote debugging and SSH/SFTP access for the web app as you specified in the remote-connection create command.

Please note: in the Public Preview, for a given app we only support a single TCP tunnel at any given time. We plan to remove this limitation in future releases after Public Preview.

<strong>How do I SSH into app container from a Linux terminal?</strong>

First, please make sure your web app is enabled for SSH. If you use App Service on Linux (blessed images), the SSH is enabled by default. If you use Web App for Containers (custom images), please follow the instructions <a href="https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-ssh-support">here</a> to enable SSH access in app container.

Tips for SSH to work correctly in your container:
<ul>
<li>Make sure you remember the pre-defined SSH password that is set in your Dockerfile. We recommend that you install SSH server and set the user/password in Dockerfile as follows:</li>
</ul>
<blockquote>
<pre># ------------------------
# SSH Server support
# ------------------------
 RUN apt-get update \ && apt-get install -y --no-install-recommends openssh-server \ && echo "root:Docker!" | chpasswd