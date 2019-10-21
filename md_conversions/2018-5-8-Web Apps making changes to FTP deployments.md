---
author_name: Thad Kittelson
layout: post
hide_excerpt: true
---
      [Thad Kittelson](https://social.msdn.microsoft.com/profile/Thad Kittelson)  5/8/2018 10:19:42 AM  We are continuously taking steps to improve Azure Platform security. As part of this ongoing effort an upgrade of App Service is planned for all regions during the first part of May. Changes to deployment options
-----------------------------

 When this upgrade is complete Web Apps will provide the following configurations with the option to change your default setting. Today your apps can be accessed through the legacy FTP protocol (using credentials over plain text) as well as the more secure [FTPS protocol](https://wikipedia.org/wiki/FTPS) (not to be confused with [SFTP](https://wikipedia.org/wiki/SSH_File_Transfer_Protocol)). Once the upgrade is complete you will be able to configure your apps to continue to use FTP and FTPS, limit access only over FTPS or completely disable FTP access. [![]({{ site.baseurl }}/media/2018/05/FTP-changes-300x182.jpg)]({{ site.baseurl }}/media/2018/05/FTP-changes.jpg) You can find these options in the Azure Portal under your app's menu: **Application Settings > FTP Access** Whats next
----------

 In early July all new apps will default to **FTPS only** access. Users will continue to have the option to configure this as needed. Any previously created apps will retain their existing FTP/FTPS configuration with the option to change as needed. Best practice
-------------

 As a best practice we recommend using FTPS for deployments. Doing so will ensure that your data transmissions are encrypted which helps address regulatory guidelines for security. If you have any questions about this feature or App Service in general be sure to check our forums in [MSDN](https://social.msdn.microsoft.com/Forums/en-US/home?forum=windowsazurewebsitespreview) and [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-web-sites). For any feature requests or ideas check out our [User Voice](https://feedback.azure.com/forums/169385-web-apps-formerly-websites)     