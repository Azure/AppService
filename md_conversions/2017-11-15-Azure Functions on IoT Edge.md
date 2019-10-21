---
author_name: Colby Tresness
layout: post
hide_excerpt: true
---
      [Colby Tresness](https://social.msdn.microsoft.com/profile/Colby Tresness)  11/15/2017 12:30:42 AM  Running Azure Functions on IoT Edge
===================================

 Today, we’re very excited to have released the public preview of [Azure IoT Edge](https://aka.ms/iot-connect-blog) at our yearly developer conference, Connect();. This adds to the Azure IoT Suite the ability to write code which executes directly on IoT devices, allowing devices to react more quickly to events and spend less time sending messages to the cloud. The simplicity of Azure Functions fits extremely well as a programming model for these scenarios, and from day one users of IoT Edge will be able to write a Function to implement business logic right on their IoT devices. IoT devices are a great addition to the already robust list of places you can run a Function. When Would IoT Edge be Useful?
------------------------------

 To best answer this question, let’s consider a simple example. Imagine you’re a factory administrator who oversees thousands of machines. With *Azure IoT Hub*, you can track the status of all your devices, send messages to those devices, receive messages from those devices, and more. Let’s assume you have a system in place receiving telemetry data about the temperature of your machines. To prevent damage due to overheating, you’re running a Function which is listening on all device to cloud messages (through the underlying EventHub.) The result of this is that you get a notification any time a device gets too hot, so you can mitigate and avoid disaster. Since you have thousands of machines sending temperature readings constantly, this is getting expensive and is taking up all your bandwidth. Here’s where IoT Edge comes in – by running your business logic directly on the devices, you only have to send messages to the cloud when an anomaly is detected. So, you augment your current system by adding the IoT Edge Runtime to your devices, writing a Function module deciding whether a message is necessary, and deploying this module to all your devices. You now have the same end system without the massive amount of message passing, and you can sit back and relax knowing your machines will tell you if they are overheating. How do I Run Functions on a Device?
-----------------------------------

 *Azure IoT Edge *is made up of three main components: IoT Edge modules, the IoT Edge runtime, and the cloud based interface. Modules are the units of execution that are pushed to your devices and run your custom code. The runtime is deployed to each device and manages these modules, which are implemented as Docker containers. [![IoT Edge Architecture Diagram]({{ site.baseurl }}/media/2017/11/iotedge.png)]({{ site.baseurl }}/media/2017/11/iotedge.png)

 *Figure 1: IoT Edge Experience Illustrated*

 When a user writes a Function they’d like to run on the Edge, we package it up as one of these modules and deploy to your devices for you. We’ve released a Visual Studio Code extension to help you with this – no advanced knowledge of containers is needed, even though it’s a container under the hood. Follow the more detailed instruction set [here](https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-deploy-function) in order to set up an edge enabled device, write a sample function, get it up and running on said device, and monitor the results.  Looking Forward
---------------

 The ability to write code which executes on IoT devices is an exciting addition for Azure users. For public preview, only C# Functions are supported, but we’re looking to add the ability to write Functions in more languages as we move towards GA. Also note that for public preview Functions won’t run on devices with ARM distributions of Linux. Be sure to visit the more detailed IoT Edge preview [documentation](https://docs.microsoft.com/en-us/azure/iot-edge/), and try running a Function on the Edge! Also, please feel free to engage either me or the overall Functions team on Twitter with any questions: @ColbyTresness

 @AzureFunctions

 Reference Code
--------------

 The below code is an example of a Function reacting to IoT Edge events – parsing a message to find a machine’s temperature, checking if its over a threshold, and appending an alert if it is. [![]({{ site.baseurl }}/media/2017/11/iotedgecode1.png)]({{ site.baseurl }}/media/2017/11/iotedgecode1.png)

 *Code Sample 1: The Run Method of a Function Reacting to IoT Edge Events*

     