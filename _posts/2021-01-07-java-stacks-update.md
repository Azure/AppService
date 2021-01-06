---
title: "Java, Tomcat, and JBoss EAP version updates"
author_name: "Jason Freeberg"
tags: 
    - Java
---

The latest App Service release brings the following runtime versions:

## Windows

- New Tomcat versions
  - 9.0.38
  - 8.5.58
- New Java versions
  - 11.0.8
  - 8.0.265
  - 7.0.272

Eclipse Foundation has deprecated Jetty 9.1 and 9.3 ([source](https://www.eclipse.org/jetty/download.php)), so these runtimes are no longer shown on the Portal. You can still [create sites with these versions](TODO). Tomcat 8.0 has [reached End-Of-Life](https://tomcat.apache.org/tomcat-80-eol.html) and will also be hidden in an upcoming Portal update.

## Linux

- JBoss EAP is now available with Java 11
- JBoss EAP now has an "auto-update" option. This currently uses JBoss 7.2 but will automaticall use the latest JBoss versions as they are added.
