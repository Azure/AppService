---
title: "Troubleshoot your App Service Hybrid Connections with the Hybrid Connection Debug Utility"
author_name: "Jordan Selig"
toc: true
toc_sticky: true
---

The Hybrid Connection Debug utility is provided to perform captures and troubleshooting of issues with the Hybrid Connection Manager.

This utility acts as a mini-Hybrid Connection Manager and must be used *instead of* the existing Hybrid Connection Manager you have installed on your client. If you have production environments that use Hybrid Connections, you should create a new Hybrid Connection that only gets served by this utility and repro your issue with the new Hybrid Connection.

The tool can be downloaded here: [Hybrid Connection Debug Utility](https://hybridconnectiondebugutility.azurewebsites.net/HybridConnectionDebugUtility.zip).

## Usage

```bash
USAGE:
HybridConnectionDebugUtility client [connectionString] [listenPort] [options]
HybridConnectionDebugUtility listener [connectionString] [options]

options:
    /traceLevel:[level] - Specifies the trace-level to use (none, connections, verbose)
    /keepAlive - Enables TCP keep-alive on endpoint connection socket
    /overrideEndpointHost:[host] - Specifies an endpoint host to use instead of the one defined in the Hybrid Connection
    /overrideEndpointPort:[port] - Specifies an endpoint port to use instead of the one defined in the Hybrid Connection
    /log:[file] - Specifies a file to log all activity to.
    /connectionStats - Logs connection statistics (# of connections, bytes written/read)

traceLevel allowed values:
    none
    connections: (default) trace all connections opened and closed.
    verbose: trace all connections and packet data.
```

The debug utility can function in two modes - as a client or listener:

* Client: This mimics the behavior of Hybrid Connections in the app itself in App Service - e.g. this will forward connections *to* Service Bus.
* Listener: This mimics the behavior of the Hybrid Connection Manager - e.g. this will receive connections *from* Service Bus.

Typically, for any troubleshooting of Hybrid Connections issues, **Listener** should be the only mode that is necessary.

## Using the tool

Setup a Hybrid Connection in the Azure Portal as per usual, e.g. under the App -> Networking -> Hybrid Connections -> Add a Hybrid Connection. It's highly recommended that you use a *new* Hybrid Connection with this tool (e.g. a Hybrid Connection that is not being served by *any* Hybrid Connection Managers currently and shows in the Portal as "Not Connected"). To use an existing one instead, the Hybrid Connection must first be removed from *all* Hybrid Connection Managers (and thus show **"Not Connected"** - this will break connectivity).

You'll need to retrieve the connection string from this Hybrid Connection which can be done in the portal:

![Hybrid Connection gateway connection string]({{site.baseurl}}/media/2024/02/GatewayConnectionString.png)

The connection string will be in the following format `Endpoint=sb://**\[ServiceBusNamespace\]**.servicebus.windows.net/;SharedAccessKeyName=defaultListener;SharedAccessKey=**\[KeyValue\]**;EntityPath=**\[RelayName\]**`

To launch the Hybrid Connection Debug Utility in it's most basic configuration:

```bash
    HybridConnectionDebugUtility.exe listener [connectionstring] 
```

By default, this listener will forward traffic to the endpoint that is configured on the Hybrid Connection itself (set when creating it through App Service Hybrid Connections UI). If no endpoint is set or to override this endpoint, use the parameters `/overrideEndpointHost:[host]` and `/overrideEndpointPort:[port]`.

Depending on what you're investigating, it's recommended to include either `/traceLevel:connections` or `/traceLevel:verbose`. Connections will show data about all connections being made and when they are opened and closed:

![Hybrid Connection Debug Utility connections-only tracing mode]({{site.baseurl}}/media/2024/02/ConnectionsOutput.png)

For Verbose traffic, it will include packet captures (though these are difficult to read and incompatible with tools like WireShark and Netmon):

![Hybrid Connection Debug Utility verbose tracing mode]({{site.baseurl}}/media/2024/02/VerboseOutput.png)

If additional support is needed, you can reach out to customer support and share the output from the tool. To write all data to a file, run the command with `/log:[filename]`.
