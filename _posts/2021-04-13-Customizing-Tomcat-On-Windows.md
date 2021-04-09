---
title: "Customizing Tomcat On App Service Windows"
author_name: "Gregory Goldshteyn"
category: "java"
toc: true
toc_sticky: true
---

By default, App Service uses versions of Tomcat that have configurations updated to use the features of the platform. Under some circumstances, customers may need to provide additional configuration to Tomcat for thier applications. Because the Tomcat installations exist on an App Service Plan, a Tomcat install cannot be modified directly. To circumvent this, a Tomcat install can be placed in the web app's local storage, where modification can take place.

## Process Overview

### The Script

Startup scripts can be used to perform actions before a web app starts. The startup script for customizing Tomcat needs to do the following:

1. Check if Tomcat was already copied and configured locally. If it was, the startup script can end here
2. Copy Tomcat locally
3. Perform required configuration
4. Mark that configuration was done successfully

```powershell
    # Check for marker file indicating that config has already been done
    if(Test-Path "$LOCAL_EXPANDED\tomcat\config_done_marker"){
        return 0
    }

    # Delete previous Tomcat directory if it exists
    # In case previous config could not be completed or a new config should be forcefully installed
    if(Test-Path "$LOCAL_EXPANDED\tomcat"){
        Remove-Item "$LOCAL_EXPANDED\tomcat" --recurse
    }

    # Copy Tomcat to local
    # Using the environment variable $AZURE_TOMCAT90_HOME uses the 'default' version of Tomcat
    Copy-Item -Path "$AZURE_TOMCAT90_HOME\*" -Destination "$LOCAL_EXPANDED\tomcat" -Recurse

    # Perform the required customization of Tomcat
    {... customization ...}

    # Mark that the operation was a success
    New-Item -Path "$LOCAL_EXPANDED\tomcat\config_done_marker" -ItemType File
```

### Transforms

A common use case for customizing a Tomcat version is modifying Tomcat configuration files, namely `server.xml`, `context.xml`, or `web.xml`. App Service already modifies these files to provide platform features. To continue to use these features, it is important to preserve the content of these files while making changes to them. To accomplish this, [xslt transformations](https://www.w3schools.com/xml/xsl_intro.asp) are recommended. They can be used to make changes to the XML files while preserving the original contents of the file.

#### Example XSLT file

This example transform adds a new connector node to `server.xml`. Note the *Identity Transform*, which preserves the original contents of the file

```xml
    <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>
  
    <!-- Identity transform: this ensures that the original contents of the file are included in the new file -->
    <!-- Ensure that your transform files include this block -->
    <xsl:template match="@* | node()" name="Copy">
      <xsl:copy>
        <xsl:apply-templates select="@* | node()"/>
      </xsl:copy>
    </xsl:template>
  
    <xsl:template match="@* | node()" mode="insertConnector">
      <xsl:call-template name="Copy" />
    </xsl:template>
  
    <xsl:template match="comment()[not(../Connector[@scheme = 'https']) and
                                   contains(., '&lt;Connector') and
                                   (contains(., 'scheme=&quot;https&quot;') or
                                    contains(., &quot;scheme='https'&quot;))]">
      <xsl:value-of select="." disable-output-escaping="yes" />
    </xsl:template>
  
    <xsl:template match="Service[not(Connector[@scheme = 'https'] or
                                     comment()[contains(., '&lt;Connector') and
                                               (contains(., 'scheme=&quot;https&quot;') or
                                                contains(., &quot;scheme='https'&quot;))]
                                    )]
                        ">
      <xsl:copy>
        <xsl:apply-templates select="@* | node()" mode="insertConnector" />
      </xsl:copy>
    </xsl:template>
  
    <!-- Add the new connector after the last existing Connnector if there is one -->
    <xsl:template match="Connector[last()]" mode="insertConnector">
      <xsl:call-template name="Copy" />
  
      <xsl:call-template name="AddConnector" />
    </xsl:template>
  
    <!-- ... or before the first Engine if there is no existing Connector -->
    <xsl:template match="Engine[1][not(preceding-sibling::Connector)]"
                  mode="insertConnector">
      <xsl:call-template name="AddConnector" />
  
      <xsl:call-template name="Copy" />
    </xsl:template>
  
    <xsl:template name="AddConnector">
      <!-- Add new line -->
      <xsl:text>&#xa;</xsl:text>
      <!-- This is the new connector -->
      <Connector port="8443" protocol="HTTP/1.1" SSLEnabled="true" 
                 maxThreads="150" scheme="https" secure="true" 
                 keystroreFile="${{user.home}}/.keystore" keystorePass="changeit"
                 clientAuth="false" sslProtocol="TLS" />
    </xsl:template>

</xsl:stylesheet>
```

#### Function for XSLT transform

PowerShell has built in tools for transforming XML files using XSL transforms. This is an example function which can be used in `startup.ps1` to perform the transform.

```powershell
    function TransformXML{
        param ($xml, $xsl, $output)

        if (-not $xml -or -not $xsl -or -not $output)
        {
            return 0
        }

        Try
        {
            $xslt_settings = New-Object System.Xml.Xsl.XsltSettings;
            $XmlUrlResolver = New-Object System.Xml.XmlUrlResolver;
            $xslt_settings.EnableScript = 1;

            $xslt = New-Object System.Xml.Xsl.XslCompiledTransform;
            $xslt.Load($xsl,$xslt_settings,$XmlUrlResolver);
            $xslt.Transform($xml, $output);

        }

        Catch
        {
            $ErrorMessage = $_.Exception.Message
            $FailedItem = $_.Exception.ItemName
            Write-Host  'Error'$ErrorMessage':'$FailedItem':' $_.Exception;
            return 0
        }
        return 1
    }
```

### The App Settings

The platform also needs to know where your custom version of Tomcat is installed. This can be set through the CATALINA_BASE app setting.

This setting can be changed through the Azure CLI:

```powershell
    az webapp config appsettings set -g $MyResourceGroup -n $MyUniqueApp --settings CATALINA_BASE="%LOCAL_EXPANDED%\tomcat"
```

Or manually through the portal:

1. Go to Settings -> Configuration -> Application settings
2. Go to + New Application Setting
3. Name: `CATALINA_BASE` Value: `"%LOCAL_EXPANDED%\tomcat"`

![Configure Application Settings Through Portal]({{site.baseurl}}/media/2021/04/ApplicationSettings.png){: .align-center}

### Example startup.ps1

An example script that copies a custom Tomcat to local, performs an xsl transform, and marks that the transform was successful

```powershell
    # Locations of xml and xsl files
    $target_xml="$LOCAL_EXPANDED\tomcat\conf\server.xml"
    $target_xsl="$HOME\site\server.xsl"

    # Define the transform function
    # Useful if transforming multiple files
    function TransformXML{
        param ($xml, $xsl, $output)

        if (-not $xml -or -not $xsl -or -not $output)
        {
            return 0
        }

        Try
        {
            $xslt_settings = New-Object System.Xml.Xsl.XsltSettings;
            $XmlUrlResolver = New-Object System.Xml.XmlUrlResolver;
            $xslt_settings.EnableScript = 1;

            $xslt = New-Object System.Xml.Xsl.XslCompiledTransform;
            $xslt.Load($xsl,$xslt_settings,$XmlUrlResolver);
            $xslt.Transform($xml, $output);
        }

        Catch
        {
            $ErrorMessage = $_.Exception.Message
            $FailedItem = $_.Exception.ItemName
            Write-Host  'Error'$ErrorMessage':'$FailedItem':' $_.Exception;
            return 0
        }
        return 1
    }

    # Check for marker file indicating that config has already been done
    if(Test-Path "$LOCAL_EXPANDED\tomcat\config_done_marker"){
        return 0
    }

    # Delete previous Tomcat directory if it exists
    # In case previous config could not be completed or a new config should be forcefully installed
    if(Test-Path "$LOCAL_EXPANDED\tomcat"){
        Remove-Item "$LOCAL_EXPANDED\tomcat" --recurse
    }

    # Copy Tomcat to local
    # Using the environment variable $AZURE_TOMCAT90_HOME uses the 'default' version of Tomcat
    Copy-Item -Path "$AZURE_TOMCAT90_HOME\*" -Destination "$LOCAL_EXPANDED\tomcat" -Recurse

    # Perform the required customization of Tomcat
    $success = TransformXML -xml $target_xml -xsl $target_xsl -output $target_xml

    # Mark that the operation was a success if successful
    if($success){
        New-Item -Path "$LOCAL_EXPANDED\tomcat\config_done_marker" -ItemType File
    }
```