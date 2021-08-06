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

2. Next, run the following CLI command to set up GitHub Actions. 

    **Bash**

    ```bash
    az webapp deployment github-actions add
        --name '<app-name>' \
        --resource-group '<group-name>' \ 
        --repo '<owner>/<repository-name>'
    ```

    **PowerShell**

    ```powershell
    az webapp deployment github-actions add `
        --name '<app-name>' `
        --resource-group '<group-name>' ` 
        --repo '<owner>/<repository-name>'
    ```



    az webapp deployment github-actions add `
        --name 'freeberg-test-app' `
        --resource-group 'freebergDemo' `
        --repo 'JasonFreeberg/my-spring-app' `
        --login-with-github