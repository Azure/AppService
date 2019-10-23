---
title: Learn how to orchestrate serverless functions by scraping APIs in 8 minutes
author_name: 
layout: post
hide_excerpt: true
---
<html><head>
<meta charset="utf-8"/>
</head>
<body>
<div id="page">

<a class="url fn n profile-usercard-hover" href="https://social.msdn.microsoft.com/profile/Maxime Rouiller" target="_blank">Maxime Rouiller</a>
<time>    8/6/2018 9:00:33 AM</time>
<hr/>
<div id="content"><h1 class="code-line" id="our-scenario">Our scenario</h1>
<p class="code-line">The project I'm working on requires me to retrieve information from multiple sources like the NuGet and GitHub API. Let's bring into focus how I'm downloading data from the GitHub API. If you follow me <a href="https://twitter.com/MaximRouiller/status/1019597611341402112" title="https://twitter.com/MaximRouiller/status/1019597611341402112">on Twitter</a>, you've probably already heard me talk about it.</p>
<p class="code-line">Ever ended up on a sample that should be covering the problem you're having, but it just doesn't work? Then, you check the last commit date only to realize that it's been 2 years since the last commit. The way the cloud is evolving, that sample is almost no good to you.</p>
<p class="code-line">Well, some of the repositories on the <code>Azure-Samples</code> organization have those exact issues, and it's one of the many problems that I'm trying to solve.</p>
<p class="code-line">There are tons of samples on the <a href="https://github.com/Azure-Samples/" title="https://github.com/Azure-Samples/">Azure-Samples</a> organization on GitHub, and I want to be able to check them out to see which ones are "too old." What does a user consider a valid sample? For me, a valid sample is an up to date sample.</p>
<p class="code-line">We need a way to retrieve those over 900 samples and validate their last commit date.</p>
<p class="code-line">However, we first need to be able to retrieve all that information.</p>
<h1 class="code-line" id="file---new-project---
console-application">File -> New Project -> Console Application