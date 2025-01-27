---
title: "Implement App Service Best Practices into your Azure ARM/Bicep Templates with GitHub Copilot"
author_name: "Jordan Selig"
toc: true
toc_sticky: true
---

Before we get started, I want to give a shout-out to [GitHub Copilot](https://code.visualstudio.com/docs/copilot/overview), which if you're using VS code and your not using GitHub Copilot yet, you should definitely check it out. [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) is your AI pair programmer tool in Visual Studio Code. Get code suggestions as you type or use Inline Chat in the editor to write code faster. Add new functionality or resolve bugs across your project with Copilot Edits, or use natural language in chat to explore your codebase. Also calling out that you can definitely do what we'll be doing in this blog post without GitHub Copilot and instead use a different Copilot implementation or other AI tool altogether, but using GitHub Copilot directly where you're writing your code and building your ARM/Bicep templates is a great way to make your process quicker and more efficient.

In this blog post, we'll be discussing how to implement best practices, when it comes your Azure App Service resource, into your Azure ARM/Bicep templates with GitHub Copilot. There's two entry points to this blog post. The first is that you're new to ARM/Bicep templates or App Service and you're looking to learn App Service best practices as you start writing your templates. The second is that you're already writing ARM/Bicep templates and you're looking to improve your templates by implementing best practices that the product group recommends. If either of these entry points apply to you, then this blog post is for you.

For those of you who are looking for a sample Bicep template that includes what the Azure App Service product group recommends as best practices, you can find that [here](https://github.com/Azure-Samples/app-service-web-app-best-practice). This is a recently released [Azure Developer CLI (azd)](https://learn.microsoft.com/azure/developer/azure-developer-cli/azd-templates) template that you can quickly deploy into your own subscription to get started with an implementation of App Service that is secure, scalable, and performant. The template not only includes a sample web app and the suggested configurations for it, but also includes resources such as a slot, logging and monitoring, and more. We won't be going through the template in this blog post, but I highly recommend checking it out if you're looking to learn more about what a best practice implementation of App Service looks like.

## Getting Started

To get started, we'll be using GitHub Copilot to help us write and review our ARM/Bicep templates. If you're not already using GitHub Copilot in VS Code, you can install it from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot). Once you have GitHub Copilot installed, you can start writing your ARM/Bicep templates and GitHub Copilot will provide you with suggestions as you type. If you're new to ARM/Bicep templates, you can find more information on the [Azure documentation](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview) site.

## Implementing App Service Best Practices using GitHub Copilot

To implement App Service best practices into your ARM/Bicep templates, you can use GitHub Copilot to help you write and edit the code. GitHub Copilot will provide you with suggestions as you type, and you can use these suggestions to implement the best practices that the product group recommends. For example, if you're creating an App Service resource, you can use GitHub Copilot to help you configure the resource with the recommended settings. You can also use GitHub Copilot to help you create other resources that are required for the App Service, such as a storage account or a database.

GitHub Copilot chat is the feature we will use here. Just like how you would prompt ChatGPT or ask questions to a colleague, you can do the same with GitHub Copilot.

Here's an example of how you can use GitHub Copilot chat to implement App Service best practices into your ARM/Bicep templates:

In order to set some context, I would recommend setting the stage with a statement like:

```md
Act as a cloud solutions architect and use the sample.bicep template from https://github.com/Azure-Samples/app-service-web-app-best-practice/blob/main/sample.bicep as your reference for best practices and Azure App Service product group recommendations for a secure, performant, and reliable web app. I'm going to ask you a series of questions to help transform my current bicep template into a template that follows best practices.
```

In that statement, we asked GitHub Copliot to be a Cloud Solutions Architect (CSA) and use our new sample Bicep template as its reference for best practices and Azure App Service product group recommendations. Telling it to act as a CSA is a way to set the stage for the conversation and let GitHub Copilot know how to shape its responses.

![Prompt GitHub Copilot]({{site.baseurl}}/media/2025/01/ghcopilotprompt.png)

In the screenshot, you can see on the left-hand side that I have a basic Bicep template that creates an App Service Plan and an App Service. It definitely needs some work to follow best practices, and hopefully GitHub Copilot can help us with that. On the right-hand side, you can see the chat window where I've prompted GitHub Copilot.

Some follow-up questions you can ask GitHub Copilot include:

```md
1. Can you help me configure the App Service Plan with the recommended settings?
1. Can you help me configure the App Service with the recommended settings?
1. What properties should I set on the App Service to make it secure?
1. What other resources so I include in my template to make the App Service reliable and performant?
```

If you ask GitHub Copilot these questions, it will provide you with suggestions as well as code snippets that you can directly implement into your templates. If you're used to Git or are just a visual learner and want to see how exactly your template differs from the sample template, you can ask GitHub Copilot to create an HTML diff. For example, I asked GitHub Copilot the following after making some initial changes to my template based on its suggestions:

```md
Output a diff between my template and the sample.bicep template. The diff file should be an HTML file, it should be color coded, and it should show the differences between the two files side by side.
```

It may take some additional prompting and follow-up on your side to get to this same state. But eventually, you should be able to get something as clear as the following:

![Side by side diff]({{site.baseurl}}/media/2025/01/diff.png)

Continuing to build out your template should now be just as easy as working with a real-world CSA or product group expert. You can even ask GitHub Copilot questions about why it's suggesting certain things, or ask it to explain the reasoning behind a certain best practice. This can help you learn more about the best practices and why they are important, so you can apply them to your own templates in the future. For example, you can ask GitHub Copilot:

```md
1. Why is it important to enable zoneRedundant property? What does it do?
```

If you ask about zone redundancy, it will tell you what it is, why it's important, and how to enable it in your template.

![Ask GitHub Copilot why zone redundancy should be enabled]({{site.baseurl}}/media/2025/01/zrsuggestion.png)

If you're unfamiliar with a property or feature, you can also just ask GitHub Copilot to explain it to you or take you to the product documentation.

![Ask GitHub Copilot App Service features]({{site.baseurl}}/media/2025/01/docsample.png)

## Conclusion

In this blog post, we discussed how to implement best practices for Azure App Service into your ARM/Bicep templates using GitHub Copilot, without ever needing to leave VS Code. No more fumbling between browser tabs and product documentation - everything is in one place, right where you need it.

If you're new to ARM/Bicep templates or App Service, or if you're looking to improve your templates by implementing best practices, I hope this blog post has been helpful to you. We'll be continuing to release new blogs and documentation as our AI tools and services continue to improve, expand, and make all of our lives easier. Be on the lookout and thanks for reading!
