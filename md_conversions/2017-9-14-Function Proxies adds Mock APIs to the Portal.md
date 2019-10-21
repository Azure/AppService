---
author_name: Alex Karcher
layout: post
hide_excerpt: true
---
      [Alex Karcher](https://social.msdn.microsoft.com/profile/Alex Karcher)  9/14/2017 8:20:46 AM  I’m very happy to announce mock API and HTTP request/response overrides in the Azure functions portal. This feature allows a function proxy to return sample data through a mock API, enabling development against a functions API endpoint without writing any code. Request/response overrides allows API data to be transformed in flight, enabling new API schemas to be supported without modifying a backend API. This functionality mirrors the existing request/response overrides and mocks [previ](https://docs.microsoft.com/en-us/azure/azure-functions/functions-proxies#modify-requests-responses)[ously only accessible through proxies.json ](https://docs.microsoft.com/en-us/azure/azure-functions/functions-proxies#modify-requests-responses) Examples
--------

 The following example shows a mock API that mimics the "hello serverless" example. The example returns a static response while also inserting text from a request parameter. [![]({{ site.baseurl }}/media/2017/09/Mock-API.png)]({{ site.baseurl }}/media/2017/09/Mock-API.png) The next example performs a transform on requests as they're sent to jsonplaceholder.typicode.com. It changes all HTTP verbs to HTTP GET, and appends the request's verb to the response header. [![]({{ site.baseurl }}/media/2017/09/Request-Overide2.png)]({{ site.baseurl }}/media/2017/09/Request-Overide2.png) Learn more
----------

 We’ve seen a great response to the proxies preview and we're excited to continue releasing updates  - For more product news, follow [@AzureFunctions](https://twitter.com/AzureFunctions).
 - To report bugs or file feature requests, please open an issue on the [Azure-Functions](https://github.com/Azure/Azure-Functions) GitHub repo. Please include “Proxies” in the issue title.
 - For technical questions, please post on the [MSDN forums](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=azurefunctions) or [StackOverflow](https://stackoverflow.com/questions/tagged/azure-functions). The entire Functions engineering team monitors these questions, so you’re sure to get an expert answer.
      