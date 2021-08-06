---
title: "Setup GitHub Actions with the Azure CLI"
author_name: "Jason Freeberg"
toc: true
toc_sticky: true
tags:
    - Deployment
---

With GitHub Actions you can set up a workflow to build and deploy your applications whenever there's a commit on your main branch, or a PR is merged, or even on a schedule! If getting started with GitHub Actions sounds daunting, the Deployment Center in the Azure Portal makes it easy. The guided experience will put a curated workflow file in your chosen repository to build and deploy your application.

{% include video id="b2oyxbSbLPA" provider="youtube" %}

If you're more comfortable on the command line, you can now use the Azure CLI to set up GitHub Actions for your web apps. Just like the Deployment Center, this CLI command will put a curated workflow file in your target repository.

## Instructions

1. First, make sure you are using version 2.27.0 or greater.

    ```bash
    az --version
    ```

    The first line in the output will show the CLI version:

    ```text
    azure-cli                         2.27.0

    core                              2.27.0
    telemetry                          1.0.6
    ```

2. Next, run the following CLI command to set up GitHub Actions. Replace `<app-name>`, `<group-name>`, and `<owner>/<repository-name>` with your Web App name, resource group, and repository respectively.

    **Bash**

    ```bash
    az webapp deployment github-actions add
        --name '<app-name>' \
        --resource-group '<group-name>' \ 
        --repo '<owner>/<repository-name>' \
        --login-with-github
    ```

    **PowerShell**

    ```powershell
    az webapp deployment github-actions add `
        --name '<app-name>' `
        --resource-group '<group-name>' ` 
        --repo '<owner>/<repository-name>' `
        --login-with-github
    ```

3. In the command output there will be a login URL and user code. Open the URL in the command output, `https://github.com/login/device`, and enter the user code shown in the output.

    ```text
    Command group 'webapp deployment github-actions' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
    Please navigate to https://github.com/login/device and enter the user code 985C-11BD to activate and retrieve your github personal access token
    Waiting up to '14' minutes for activation
    ```

    ![Login to GitHub using the usercode in the command output]({{ site.baseurl }}/media/2021/08/github-usercode-login.png)

4. Once you log in, the CLI command will continue, committing GitHub Actions workflow file to your repository under `.github/workflows`, setting the deployment credentials in your repository's secrets, and registering the repository with your Web App so you can view deployment logs in the Deployment Center.

