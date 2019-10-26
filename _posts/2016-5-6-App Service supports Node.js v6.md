---
title: "App Service supports Node.js v6"
author_name: Chris Anderson 
layout: post
hide_excerpt: true
---

We're happy to announce that Azure App Service supports [Node.js v6.0.0.](https://github.com/nodejs/node/blob/master/CHANGELOG.md#2016-04-26-version-600-current-jasnell) Node.js v6.0.0 is a major step forward for the Node.js community thanks to the efforts of so many to increase the ES6 compatibility coverage, as well as many performance and security improvements. We'll follow the developments of v6 closely (including v6.1.0 which came out last night) as it moves towards a new v6 LTS version, at which point we'll plan on recommending developers creating new apps on App Service use that version, as we currently do for the v4 LTS version. Get started with Node.js on Azure App Service [here](https://azure.microsoft.com/en-us/documentation/articles/app-service-web-nodejs-get-started/). Using Node.js v6.0.0 on Azure App Service

To use Node.js v6.0.0, you can specify your version in your package.json file, as detailed on our [Node.js documentation page](https://azure.microsoft.com/en-us/documentation/articles/app-service-web-nodejs-get-started/#use-a-specific-nodejs-engine). It's as simple as adding the following JSON to the file:  `"engines": { "node": "6.0.0" }`,  Once you've done that and you redeploy your code via git/CI, our deployment process will select the v6.0.0 Node.js version. We default to using npm version v3.8.6 for Node.js v6.0.0. Getting started with Node.js on Azure App Service

If you haven't yet tried using Node.js on Azure App Service, it is one of the easiest ways of hosting a Node.js application in the cloud. Azure App Service makes it easy to create a Node.js website hosting whichever framework you like, using the developer tools you prefer, and all with little to no management overhead. [This awesome doc written by Cephas Lin](https://azure.microsoft.com/en-us/documentation/articles/app-service-web-nodejs-get-started/) walks you through creating a Node MVC site via Yeoman, creating an Azure Web App via the x-plat cli (npm i -g azure-cli), modifying the port setting to use the environment variable provided by the App Service runtime, creating a git commit with all those changes, and then pushing it to Azure via git. If you have an existing Node.js website that you'd like to try moving to Azure, just try following the steps starting from #4. If you don't have an Azure subscription, you can get a [free trial](https://azure.microsoft.com/en-us/pricing/free-trial/) or get a temporary one for an hour via ["Try App Service"](https://tryappservice.azure.com/).

![Next steps](http://i.imgur.com/BLvm30E.png) Next steps

- [Learn about Node.js on Azure App Service](https://azure.microsoft.com/en-us/documentation/articles/app-service-web-nodejs-get-started/)
- [Try App Service](https://tryappservice.azure.com/)
- [Get an Azure Subscription](https://azure.microsoft.com/en-us/pricing/free-trial/)
