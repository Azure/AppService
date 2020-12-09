---
title: 'New App Service Anti-virus Logs on Diagnostic Settings in Public Preview'
author_name: "Yutang Lin"

toc: true
toc_sticky: true
---

App Service has added support for anti-virus scans which can send logs to Storage account, Log Analytics, and Even Hubs for better application monitoring. The new log support, available in [Diagnostic settings]({{site.baseurl}}/2019/11/01/App-Service-Integration-with-Azure-Monitor.html) as **"AppServiceAntiVirusScanLogs"**, helps customers better monitor the site content of their web app. This logging feature is available for both Windows and Linux based web apps using our Premium and Isolated App Service plans. This feature is currently in public preview and has certain [feature limitations](#feature-limitations) and [known issues](#known-issues) which will be covered in this blog and will be updated accordingly.

The anti-virus scan leverages [Microsoft Defender](https://www.microsoft.com/en-us/windows/comprehensive-security) and will run once daily on your website content. There will be a log regardless of if there are any infected files detected. If there are infected files detected, the log will provide a list of infected files. If there are no infected files detected, the log will show an empty list of infected files. 


## Feature limitations

The feature has a few limitations (see list below). Should you meet any of the limitations, the logs will show an error message explaining why it didn’t scan your web app. The following limitations are: 

1. Will scan your files once a day (currently can't control when the scan runs)
1. Will not scan web apps with > 1GB size of site content 
1. Will not scan web apps with > 10,000 files in the site content 

If your web app is > 1GB and has > 10,000 files, the scan will not run and your logs will show an error message with details on the pre-requisite not met.

## Known Issue

For web apps with > 10,000 files in the site content, you will see the following error message in your logs "Internal service error occurred. Please contact support.". In the next release, the logs will reflect the correct error message.

## Sample Logs

### Sample of log without scanned virus:

```json
{
    "time": "2020-10-10T22:54:13.7712259Z",
    "ResourceId": "/SUBSCRIPTIONS/XXXXX-XXXXX-XXXXX-XXXXX-XXXXX/RESOURCEGROUPS/XXXXX/PROVIDERS/MICROSOFT.WEB/SITES/XXXXX",
    "Category": "AppServiceAntivirusScanAuditLogs",
    "OperationName": "AntivirusScan",
    "Properties": {
        "TimeStamp": "2020-10-10T22:54:13.7254874Z",
        "Category": "AppServiceAntivirusScanAuditLogs",
        "ScanStatus": "Succeeded",
        "TotalFilesScanned": 358,
        "NumberOfInfectedFiles": 0,
        "ListOfInfectedFiles": [],
        "ErrorMessage": null
    }
}
```

### Sample of log with scanned virus:

```json
{
    "time": "2020-10-10T22:54:13.7712259Z",
    "ResourceId": "/SUBSCRIPTIONS/XXXXX-XXXXX-XXXXX-XXXXX-XXXXX/RESOURCEGROUPS/XXXXX/PROVIDERS/MICROSOFT.WEB/SITES/XXXXX",
    "Category": "AppServiceAntivirusScanAuditLogs",
    "OperationName": "AntivirusScan",
    "Properties": {
        "TimeStamp": "2020-10-10T22:54:13.7254874Z",
        "Category": "AppServiceAntivirusScanAuditLogs",
        "ScanStatus": "Succeeded",
        "TotalFilesScanned": 358,
        "NumberOfInfectedFiles": 1,
        "ListOfInfectedFiles": [
            "/IAmVirus.txt"
        ],
        "ErrorMessage": null
    }
}

```