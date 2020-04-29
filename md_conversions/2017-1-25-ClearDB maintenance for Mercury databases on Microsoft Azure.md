---
title: "ClearDB maintenance for Mercury databases on Microsoft Azure"
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  1/25/2017 9:01:25 AM  We are conducting an assessment on ClearDB MySQL databases associated with Azure customers. We have found several instances where subscriptions are deployed in ClearDB but have no corresponding Azure account associated with them. To synchronize the ClearDB and Azure services, any MySQL database that does not have a valid Azure account will be frozen on January 25. This may impact some Azure users. If your account is frozen and you wish to sustain the ClearDB MySQL database services from Azure, please take the following steps:  - Provision a new, empty ClearDB database in Azure to restore your data into.
 - Once created, please open a Support ticket with [Azure Support ](https://azure.microsoft.com/en-us/support/options/)or [ClearDB support](https://www.cleardb.com/developers/help/support) with the following infromation: 
	 - The database name that was newly created with Azure subscription ID
	 - Old database name , ClearDB database hostname and the associated Azure subscription ID
	 - Our support teams will work will provide you a back up of your database. Please import the database content using [MySQL workbench](https://dev.mysql.com/doc/workbench/en/wb-admin-export-import.html) into the newly created database .
	  
  The reason behind these steps being taken is due to inconsistency in purchase order records for these databases and their subscriptions. The steps above will help resolve this. We apologize for any inconvenience you have incurred.     