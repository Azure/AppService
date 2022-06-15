---
title: "Announcing Resiliency Score Report for Azure Web Apps"
author_name: "Cristhian Uribe"                                  
category: 'Diagnostics'
toc: true
toc_sticky: true
---

Resiliency Score report is a downloadable report that checks whether your Azure Web App is implementing the best practices to make it less susceptible to availability issues.
{: .text-justify}

The report doesn't review your Web App's code, instead it focuses on the recommended settings and the features available to make your App Service more resilient to failures.
{: .text-justify}

Currently, it's only available for Web App (Windows) running on Standard plans or higher. More products will be included in the future.
{: .text-justify}

## Accessing the report

You can access the report through the Diagnose and solve problems blade of your Azure App Service:

1. In the [**Azure Portal**](https://portal.azure.com/), click on **App Services**
2. Click on any Web App (Windows) running in a Standard app service plan or higher
3. Click on **Diagnose and solve problems**
4. Click on any of the **Troubleshooting categories**. For these instructions we'll use **Availability and Performance**
5. In **Availability and Performance** look for the command bar in the center and towards the top of the blade. Then, click on the ![Get the Resiliency Score]({{site.baseurl}}/media/2022/06/ResiliencyScoreReport-Button.png "Get the Resiliency Score") button. This will generate the report and download it after a few seconds.

## Report structure

The report is structured in 3 main sections:

### Resiliency Score

The score is a number between 0 and 100, where less than 59, means the Web App is rated as poor and more than 80 is rated as excellent. Each feature has different weights, so each will have a different impact on your score.
A score of 100% doesn't mean that the Web App will never be down, but rather that it has implemented 100% of our resiliency best practices.
{: .text-justify}

![Resiliency Score]({{site.baseurl}}/media/2022/06/ResiliencyScoreReport-Score.png){: .align-center}

### Contributing factors table

This is a general overview of all the features and how well they have been implemented. If the feature is implemented but there are improvements that can be done, it will be marked as "Partially implemented".
This table also works as a Table of contents of sorts, as it has links to jump to the details on each feature.
{: .text-justify}

![Resiliency Score]({{site.baseurl}}/media/2022/06/ResiliencyScoreReport-ContributingFactors.png){: .align-center}

### Detailed scores and instructions

This section intends to explain why this feature is important for you, the current state and provide details on how to implement it.
Each feature is divided in the following 4 sections:

#### Description

This is an explanation of why this feature is necessary.

![Resiliency Score]({{site.baseurl}}/media/2022/06/ResiliencyScoreReport-Details-and-instructions-Description.png){: .align-center}

#### Status of verified Web Apps

This table includes the Grade (Fail, N/A (Not Applicable) or Pass) and Comments specific to the implementation of this feature.

![Resiliency Score]({{site.baseurl}}/media/2022/06/ResiliencyScoreReport-Details-and-instructions-Status.png){: .align-center}

#### Solution

In here you can find steps to implement the solution through the Azure Portal and when available, through PowerShell and/or Azure CLI.
We include the steps even if the solution is implemented already, just in case you need them to implement it on other Web Apps.

![Resiliency Score]({{site.baseurl}}/media/2022/06/ResiliencyScoreReport-Details-and-instructions-Solution.png){: .full}

#### More information

These are links to documents with more information about this feature.

![Resiliency Score]({{site.baseurl}}/media/2022/06/ResiliencyScoreReport-Details-and-instructions-More_information.png){: .align-center}

### Comments/Recommendations

Let us know if you find it useful by leaving a comment below.
If you have any recommendations, please add them under the [Web Apps forum in feedback.azure.com](https://feedback.azure.com/d365community/forum/b09330d1-c625-ec11-b6e6-000d3a4f0f1c "Web Apps forum in feedback.azure.com"), using the #ResiliencyScoreReport hashtag.

### Learn More

* [The Ultimate Guide to Running Healthy Apps in the Cloud](https://azure.github.io/AppService/2020/05/15/Robust-Apps-for-the-cloud.html#use-multiple-instances "The Ultimate Guide to Running Healthy Apps in the Cloud")
