---
title: "A/B Testing with App Service, Part 1: Client-side configuration"
author_name: "Jason Freeberg, Shubham Dhond"
toc: true
toc_sticky: true
---

A/B testing is the process of comparing two versions of a webpage or application to determine which one performs better for a given goal. A couple reasons why you should be doing A/B testing...

- A frontend developer can test if a code refactor improves page load time
- A backend developer can deploy two versions of their APIs to determine performance gains
- A designer can check if a new UI layout improves usability metrics
- A product manager can test different product landing pages to see how changes affect click-through and average time-on-page

A/B testing is a powerful technique for software professionals of all types, but it is not without its complexities. For example, how does one deploy two versions of the application? How should traffic be split between the versions? And most importantly... how is the data tracked, tagged, and analyzed? This new blog series guide will show how to accomplish all these tasks.

## Overview

App Service's deployment slots allow developers to deploy their new application builds to independent staging environments. Once a new build is deployed to a slot, you can route a percentage of your production traffic to the slot. Once the traffic is split, Application Insights will capture usage and performance metrics, tagged with the slot information. The Application Insights Portal blade allows you to filter, visualize, and compare data from the different versions.  

## Prerequisites

You will need to have an Azure Subscription and an App Service before starting this guide. You should also have CI/CD (Continuous Integration and Delivery) set up for the App Service. All these steps are covered in parts one, two, and three of Zero to Hero with App Service. Please refer to those articles to create an App Service and set up CI/CD.

## Create an Application Insights Resource

[Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview) is a Application Performance Management (APM) service for client-side and backend apps. App Insights (AI) has SDKs for JavaScript, .NET, Java, Python, Node, and more. You will use AI to capture metrics, tag the data, and analyze the results.

Create an App Insights resource in the Portal by [following these instructions](https://docs.microsoft.com/azure/azure-monitor/app/create-new-resource). If you prefer using the Azure CLI, you can run the following command instead. Replace `<name>` and `<group>` with your desired name for the AI resource, and name for the resource group.

```bash
az extension add -n application-insights
```

```bash
az monitor app-insights component create --app <name> -resource-group <group> --location westus2
```

Once the AI resource is created, **copy the instrumentation key**. You will need this key in the next section.

> You may need to [update your Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli-windows?view=azure-cli-latest&tabs=azure-cli) to install the `application-insights` module.

## Install Application Insights

### React

App Insights has purpose-built plugins for [React](https://github.com/microsoft/ApplicationInsights-JS/blob/17ef50442f73fd02a758fbd74134933d92607ecf/extensions/applicationinsights-react-js/README.md) and [React Native](https://github.com/microsoft/ApplicationInsights-JS/blob/17ef50442f73fd02a758fbd74134933d92607ecf/extensions/applicationinsights-react-native/README.md). Follow the linked instructions to add the plugins to your React project.

### Vue.js

The Vue.js community

### Other JS Frameworks

If you are using a different JavaScript framework, you can install the Application Insights SDK using NPM, as shown below.

```bash
npm i --save @microsoft/applicationinsights-web
```

Once the package is installed, declare the App Insights object as shown below and provide your instrumentation key from the previous section.

```js
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE';
  /* ...Other Configuration Options... */
} });
appInsights.loadAppInsights();
appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
```

You will need to register this object depending on your chosen framework. Most frameworks provide an initialization hook where you can register objects with the root object or module.

- [Full configuration guide for Angular](https://devblogs.microsoft.com/premier-developer/angular-how-to-add-application-insights-to-an-angular-spa/)
- For Ember.js, you can register the `appInsights` object in the [Application Instance Initializer](https://guides.emberjs.com/release/applications/initializers/)

### HTML Templates

If you are using an HTML template engine (like Django, Thymeleaf, or Jekyll) add the following `<script>` snippet to the `<head>` of your base template. This will add AI to each of your app's web pages.

```html
<script type="text/javascript">
!function(T,l,y){var S=T.location,u="script",k="instrumentationKey",D="ingestionendpoint",C="disableExceptionTracking",E="ai.device.",I="toLowerCase",b="crossOrigin",w="POST",e="appInsightsSDK",t=y.name||"appInsights";(y.name||T[e])&&(T[e]=t);var n=T[t]||function(d){var g=!1,f=!1,m={initialize:!0,queue:[],sv:"4",version:2,config:d};function v(e,t){var n={},a="Browser";return n[E+"id"]=a[I](),n[E+"type"]=a,n["ai.operation.name"]=S&&S.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(m.sv||m.version),{time:function(){var e=new Date;function t(e){var t=""+e;return 1===t.length&&(t="0"+t),t}return e.getUTCFullYear()+"-"+t(1+e.getUTCMonth())+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"."+((e.getUTCMilliseconds()/1e3).toFixed(3)+"").slice(2,5)+"Z"}(),iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}}}}var h=d.url||y.src;if(h){function a(e){var t,n,a,i,r,o,s,c,p,l,u;g=!0,m.queue=[],f||(f=!0,t=h,s=function(){var e={},t=d.connectionString;if(t)for(var n=t.split(";"),a=0;a<n.length;a++){var i=n[a].split("=");2===i.length&&(e[i[0][I]()]=i[1])}if(!e[D]){var r=e.endpointsuffix,o=r?e.location:null;e[D]="https://"+(o?o+".":"")+"dc."+(r||"services.visualstudio.com")}return e}(),c=s[k]||d[k]||"",p=s[D],l=p?p+"/v2/track":config.endpointUrl,(u=[]).push((n="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",a=t,i=l,(o=(r=v(c,"Exception")).data).baseType="ExceptionData",o.baseData.exceptions=[{typeName:"SDKLoadFailed",message:n.replace(/\./g,"-"),hasFullStack:!1,stack:n+"\nSnippet failed to load ["+a+"] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: "+(S&&S.pathname||"_unknown_")+"\nEndpoint: "+i,parsedStack:[]}],r)),u.push(function(e,t,n,a){var i=v(c,"Message"),r=i.data;r.baseType="MessageData";var o=r.baseData;return o.message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+n+")").replace(/\"/g,"")+'"',o.properties={endpoint:a},i}(0,0,t,l)),function(e,t){if(JSON){var n=T.fetch;if(n&&!y.useXhr)n(t,{method:w,body:JSON.stringify(e),mode:"cors"});else if(XMLHttpRequest){var a=new XMLHttpRequest;a.open(w,t),a.setRequestHeader("Content-type","application/json"),a.send(JSON.stringify(e))}}}(u,l))}function i(e,t){f||setTimeout(function(){!t&&m.core||a()},500)}var e=function(){var n=l.createElement(u);n.src=h;var e=y[b];return!e&&""!==e||"undefined"==n[b]||(n[b]=e),n.onload=i,n.onerror=a,n.onreadystatechange=function(e,t){"loaded"!==n.readyState&&"complete"!==n.readyState||i(0,t)},n}();y.ld<0?l.getElementsByTagName("head")[0].appendChild(e):setTimeout(function(){l.getElementsByTagName(u)[0].parentNode.appendChild(e)},y.ld||0)}try{m.cookie=l.cookie}catch(p){}function t(e){for(;e.length;)!function(t){m[t]=function(){var e=arguments;g||m.queue.push(function(){m[t].apply(m,e)})}}(e.pop())}var n="track",r="TrackPage",o="TrackEvent";t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+r,"stop"+r,"start"+o,"stop"+o,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),m.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4};var s=(d.extensionConfig||{}).ApplicationInsightsAnalytics||{};if(!0!==d[C]&&!0!==s[C]){method="onerror",t(["_"+method]);var c=T[method];T[method]=function(e,t,n,a,i){var r=c&&c(e,t,n,a,i);return!0!==r&&m["_"+method]({message:e,url:t,lineNumber:n,columnNumber:a,error:i}),r},d.autoExceptionInstrumented=!0}return m}(y.cfg);(T[t]=n).queue&&0===n.queue.length&&n.trackPageView({})}(window,document,{
src: "https://az416426.vo.msecnd.net/scripts/b/ai.2.min.js", // The SDK URL Source
//name: "appInsights", // Global SDK Instance name defaults to "appInsights" when not supplied
//ld: 0, // Defines the load delay (in ms) before attempting to load the sdk. -1 = block page load and add to head. (default) = 0ms load after timeout,
//useXhr: 1, // Use XHR instead of fetch to report failures (if available),
//crossOrigin: "anonymous", // When supplied this will add the provided value as the cross origin attribute on the script tag 
cfg: { // Application Insights Configuration
    instrumentationKey: "YOUR_INSTRUMENTATION_KEY_GOES_HERE"
    /* ...Other Configuration Options... */
}});
</script>
```

> More information on the snippet-based setup can be found [here](https://docs.microsoft.com/azure/azure-monitor/app/javascript#snippet-based-setup).

## Tag the telemetry

You now have app insights installed, and if you deployed the app now you will will be able to see the data in the App Insights blade of the Portal. However, tag the outgoing data needs to be tagged with the slot name so you can correctly filter and analyze the data in the Portal. To do this, add the [TelemetryInitializer](https://docs.microsoft.com/azure/azure-monitor/app/api-filtering-sampling#javascript-web-applications) to your project, and register it with the AI object.

```javascript
var telemetryInitializer = (envelope) => {
  const environment = getCookieValue('x-ms-routing-name') || 'local';

  if (environment == 'local') {
    return false; // Do not send telemetry for local development.
  } else {
    envelope.tags["ai.cloud.role"] = "app-service-slot";
    envelope.data['slot'] = environment;
  }
}

// Register the initializer with the app insights object
appInsights.addTelemetryInitializer(telemetryInitializer);
```

And here is the implementation for `getCookieValue(...)`.

```javascript
/**
 * Returns the value of the specified cookie. If the cookie cannot be found, returns null;
 * @param {string} key The key of the cookie
 */
export function getCookieValue(key) {
  const cookie = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith(key));
  
  return cookie ? cookie.split('=')[1] : null;
}
```

## Deploy and split traffic

### (Optional) Deploy PR's to staging slots

## Summary
