---
title: "Platform Improvements for Python AI Apps on Azure App Service"
author_name: "Surender Singh Malik"
toc: true
toc_sticky: true
---

Originally published on [Microsoft Tech Community](https://techcommunity.microsoft.com/blog/AppsonAzureBlog/platform-improvements-for-python-ai-apps-on-azure-app-service/4519620).

Azure App Service on Linux is a fully managed platform for web and API applications across Python, Node.js, .NET, PHP, Java, and other stacks. Developers can deploy source code or a pre-built artifact, and App Service handles dependency installation, containerization, and running the application at cloud scale.

As more customers build intelligent applications with Azure AI Foundry and other AI services, Python has become one of the most important languages for these workloads. The performance and reliability of the Python deployment pipeline directly affect the developer experience on App Service, so we looked across the deployment path for opportunities to reduce latency and improve reliability.

The first set of changes has reduced Python deployment latency on Azure App Service on Linux by approximately 30%. This is the first step in a broader effort to make the platform better suited for AI application development, and the same improvements benefit many other Python apps on the platform.

## Where deployment time was going

Python web application deployments on Azure App Service on Linux rely on [Oryx](https://github.com/microsoft/Oryx), the platform's open-source build system, to produce runnable artifacts during remote builds. Platform telemetry showed that about 70% of Python app deployments use remote builds, and most of those deployments resolve dependencies from `requirements.txt` by using `pip install`.

To understand where time was going, we profiled a stress workload: a 7.5 GB PyTorch application. Most production builds are smaller, but stress testing a dependency-heavy application made the pipeline bottlenecks clear.

When a Python app is deployed through remote build, the Kudu build container runs Oryx to:

1. Extract the uploaded source code.
2. Create a Python virtual environment.
3. Install dependencies with `pip install`; 4.35 minutes, or about 34% of build time.
4. Copy files to a staging directory; 0.98 minutes, or about 8% of build time.
5. Compress the output with `tar` and `gzip` into an archive; 7.53 minutes, or about 58% of build time.
6. Write the archive to `/home`, which is backed by an Azure Storage SMB mount.

The app container then extracts this archive to local disk on every cold start.

## Why the archive-based approach?

The `/home` directory is backed by an Azure Storage SMB mount, where small-file I/O is comparatively expensive. Python dependencies are file-heavy. Virtual environments commonly contain tens of thousands of files, and dependency-heavy machine learning applications can exceed 200,000 files.

Writing those files individually over SMB would be prohibitively slow. Instead, the pipeline builds on the container's local filesystem, writes a single compressed archive over SMB, and lets the app container extract it locally on startup for efficient module loading.

The key insight from profiling was that compression was the single largest phase at 58% of build time, taking longer than installing the packages themselves.

## What changed

### Zstandard compression replacing gzip

Standard `gzip` compression is single-threaded. In our benchmark, compression accounted for 58% of total build time, making it the dominant bottleneck. Because the archive is also decompressed during container startup, decompression time affects runtime startup latency as well.

We evaluated three compression algorithms: `gzip`, LZ4, and Zstandard (`zstd`). These results are averaged across multiple deployments of a 7.5 GB Python application with PyTorch and additional machine learning packages.

| Metric | gzip | LZ4 | zstd |
| --- | ---: | ---: | ---: |
| Compression time | 7.53 min | 1.20 min | 1.18 min |
| Decompression time | 2.80 min | 1.18 min | 1.07 min |
| Archive size | 4.0 GB | 5.0 GB | 4.8 GB |

Both `zstd` and LZ4 were more than 6x faster than `gzip` for compression and more than 2x faster for decompression. We selected `zstd` because it provides speed comparable to LZ4 with a smaller archive size, is based on [RFC 8878](https://datatracker.ietf.org/doc/html/rfc8878), ships with many common Linux distributions, and works natively with `tar -I zstd` without extra packages.

Result: compression time dropped from 7.53 minutes to 1.18 minutes, a 6.4x improvement. Decompression improved from 2.80 minutes to 1.07 minutes, a 2.6x improvement that directly reduces cold-start latency.

### Faster package installation with uv

`pip` is implemented in Python and has historically optimized compatibility over maximum parallelism. In dependency-heavy workloads, package download, resolution, and installation can become a major part of deployment time. In the 7.5 GB PyTorch benchmark, package installation accounted for about 34% of total build time: 4.35 minutes out of 12.86 minutes.

We introduced [uv](https://github.com/astral-sh/uv), a Python package manager written in Rust, as the primary installer for compatible `requirements.txt` deployments. Its `uv pip install` interface works with standard `pip` workflows.

Compatibility remains the priority. When `uv` cannot handle a deployment, the platform retries with `pip`, preserving the behavior customers already depend on.

Package caches remain local to the build container. When the same app is deployed again before the Kudu build container is recycled, both `pip` and `uv` can reuse cached packages and avoid repeated downloads.

Result: package installation time dropped from 4.35 minutes to 1.50 minutes, a 3x improvement.

### Reducing file copy overhead

File copy overhead appeared in two places. First, before compression, the build process copied the entire build directory, including application code and Python packages, to a staging location. This existed historically as a safety measure to create a clean snapshot before `tar` reads the file tree, but the cost was high for the large number of files common in Python dependencies.

The fix was straightforward: create the `tar` archive directly from the build directory and skip the intermediate copy.

Second, for pre-built deployment scenarios, we replaced the legacy Kudu sync path with Linux-native `rsync`. This gives us a better optimized tool for large Linux file trees and reduces the overhead of moving files into the final deployment location. Because this path is used beyond Python, the improvement benefits pre-built apps across the broader App Service on Linux ecosystem.

Result: the 0.98-minute staging copy, or 8% of build time, was eliminated. This also reduced temporary disk usage and improved the remaining file sync path.

### Pre-built Python wheels cache

We added a complementary optimization: a read-only cache of pre-built wheels for commonly used Python packages, selected using platform telemetry. The cache is mounted into the Kudu build container at runtime for Python workloads, allowing the installer to use local wheel artifacts before downloading packages externally.

When a matching wheel is available, the installer uses it directly and avoids a network fetch for that package. Cache misses fall back to the upstream registry, such as PyPI, as usual.

The cache is managed by the platform and kept up to date, so supported Python builds can use it without any app changes.

## Combined results

![Deployment time comparison and deployment performance metrics over time](/media/2026/05/python-ai-app-service-improvements.png)

### Controlled benchmark: PyTorch 7.5 GB on P1mv3

The following benchmark was measured on the P1mv3 App Service tier. Values in the "After" column reflect the optimized pipeline with `zstd` compression, `uv` package installation, direct tar creation, and the pre-built wheels cache enabled together.

| Phase | Before | After | Improvement |
| --- | ---: | ---: | ---: |
| Package installation | 4.35 min | 1.50 min | ~3x faster |
| File copy | 0.98 min | 0 min | Eliminated |
| Compression | 7.53 min | 1.18 min | ~6x faster |
| Total build time | 12.86 min | ~2.68 min | ~79% reduction |

### Production fleet: all Python Linux web apps

Production telemetry across Python deployments shows the impact of these changes: deployment latency decreased by approximately 30% after rollout.

The controlled benchmark shows a larger improvement, about 79%, because it exercises a dependency-heavy workload where package installation, file copy, and compression dominate total build time. Typical production apps are smaller and spend less time proportionally in those phases.

## Beyond faster builds: reliability and runtime performance

Faster builds only help when deployment requests reliably reach a worker that is ready to build. We updated the primary deployment clients, including Azure CLI, GitHub Actions, and Azure DevOps Pipelines, to warm up Kudu before initiating deployments. Clients now issue a lightweight health-check request to the Kudu endpoint, helping ensure the deployment container is running and ready before the deployment begins.

Clients also preserve affinity to the warmed-up worker by using the ARR affinity cookie returned by the first request. This increases the chance that the deployment uses a worker where Kudu is already running and local package caches are already available from recent deployments.

Together, these client-side changes reduced deployment failures from transient infrastructure issues and helped the pipeline optimizations reach the build phase reliably.

Result: deployment failures caused by cold-start errors such as 502, 503, and 499 dropped by approximately 30%.

We also improved the default runtime configuration for Python apps using the platform-provided Gunicorn startup path. Previously, the platform defaulted to a single worker, leaving most CPU cores idle. Now, it follows Gunicorn's recommended worker formula, fully using available cores on multi-core SKUs and delivering higher request throughput out of the box.

```text
workers = (2 * NUM_CORES) + 1
```

## Key takeaways

* Measure before optimizing. Platform telemetry showed that remote builds and `requirements.txt`-based installs were the dominant Python deployment paths, helping us focus on changes that benefit the most customers.
* Compression was the biggest bottleneck. In the dependency-heavy benchmark, archive compression took longer than package installation. Replacing `gzip` with `zstd` reduced build time and cold-start extraction time.
* File count matters. Python virtual environments can contain tens of thousands of files, and AI workloads can contain many more. Reducing unnecessary file copies and using Linux-native file sync helped lower overhead.
* Compatibility needs a fallback path. Introducing `uv` improved the common path, while falling back to `pip` preserved compatibility for apps that depend on existing Python packaging behavior.
* Deployment reliability is part of performance. Faster builds only help if deployment requests consistently reach a ready worker. Warm-up and worker affinity made the optimized path more reliable for customers.
* Runtime defaults matter too. Settings such as Gunicorn worker configuration affect how production apps perform after deployment is complete.

Together, these changes make Python deployments faster and more reliable while preserving compatibility through safe fallbacks. We will continue improving the platform to make Azure App Service faster, more reliable, and better suited for AI application development.
