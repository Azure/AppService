---
author_name: Adrian Hall (MSFT)
layout: post
hide_excerpt: true
---
      [Adrian Hall (MSFT)](https://social.msdn.microsoft.com/profile/Adrian Hall (MSFT))  4/24/2017 8:57:35 AM  We recently made a change to the way that we manage the Azure Mobile Apps quickstarts. In the past, when you created a Mobile App, you could go to the Quickstart blade and download a client. This mechanism is still available to you. However, we have also made these quickstart projects available as GitHub repositories. This allows you to fork the repository and start developing without going to the Quickstart blade first. The project that you download from the Quickstart blade is almost the same as the project you can retrieve from the GitHub repository. In the case of the GitHub repository version, you will need to set the URI of your Azure Mobile App backend. The repositories are:  - [Android](https://github.com/Azure-Samples/azure-mobile-apps-android-quickstart)
 - [Apache Cordova](https://github.com/Azure-Samples/azure-mobile-apps-cordova-quickstart)
 - [iOS (Swift)](https://github.com/Azure-Samples/azure-mobile-apps-ios-swift-quickstart)
 - [iOS (Objective-C)](https://github.com/Azure-Samples/azure-mobile-apps-ios-objc-quickstart)
 - [Universal Windows (UWP)](https://github.com/Azure-Samples/azure-mobile-apps-uwp-quickstart)
 - [Xamarin Android](https://github.com/Azure-Samples/azure-mobile-apps-xamarin-android-quickstart)
 - [Xamarin Forms](https://github.com/Azure-Samples/azure-mobile-apps-xamarin-forms-quickstart)
 - [Xamarin iOS](https://github.com/Azure-Samples/azure-mobile-apps-xamarin-ios-quickstart)
  In each case, look for the ZUMOAPPURL string in the code and replace it with the name of your Mobile App backend. For the C# projects, this has been placed in a file called `Locations.cs`. In the other projects, it is embedded in the service handler file, so search for the string. There will be one match. There are [other great samples](https://github.com/Azure-Samples?utf8=%E2%9C%93&q=azure-mobile-apps&type=&language=) using Azure Mobile Apps for you to check out as well:  - [FieldEngineer](https://github.com/Azure-Samples/app-service-mobile-dotnet-fieldengineer) is a project for handling field-workers logistics.
 - [MyDriving](https://github.com/Azure-Samples/MyDriving) brings together IoT and Mobile to analyze car telemetry.
 - [ContosoInsurance](https://github.com/Azure-Samples/ContosoInsurance) demonstrates an example customer-side insurance car claim service.
  We are always expanding the samples we offer, so check back often!      