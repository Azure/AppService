# Article contract

## Filename and front matter

Use the official Azure CLI release-notes date:

```text
_posts/YYYY-MM-DD-azure-cli-X-YY-app-service-updates.md
```

For a monthly `X.Y.0` release, omit the patch component from the slug but keep the full version in the title.

Start with:

```yaml
---
title: "What's new for Azure App Service in Azure CLI X.Y.Z"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---
```

Do not repeat the title as an H1 in the body.

## Opening

- Link the first body mention of `Azure CLI X.Y.Z` to that version's section in the Microsoft Learn Azure CLI release notes.
- Use one or two information-dense paragraphs that identify the major customer outcomes, breaking changes, and important scope.
- Do not add a closing `## Summary`; strengthen the introduction instead.
- Do not link to articles or documentation that did not exist on the post's release date.

Example:

```markdown
[Azure CLI X.Y.Z](https://learn.microsoft.com/cli/azure/release-notes-azure-cli#month-dd-yyyy) adds ...
```

## Body

- Organize H2 sections by customer outcome, not by PR number or implementation file.
- Use benefit-first, sentence-style headings.
- Group closely related fixes into one section.
- Explain what changed, why it matters, how to use it, and material limitations.
- Use short, verified `bash` examples with placeholders such as `<resource-group>` and `<web-app>`.
- State breaking changes before migration guidance.
- Mark preview commands and parameters explicitly.
- Preserve Linux-only, Windows-only, slot, region, SKU, and rollout boundaries.
- Distinguish “request accepted” from operation completion when commands are asynchronous.
- Use `SCM (Kudu)` for every prose reference.
- Exclude Function Apps, Flex Consumption, and Logic Apps.
- Do not expose private planning links or internal terminology.

Add first-party Microsoft Learn links when they materially help the reader and were public by the article date. Do not create feature-specific mandatory links from one-off editorial feedback.

## Release section

End the article with:

````markdown
## Get the release

Run `az upgrade` to install the latest available Azure CLI release, then verify the installed version:

```bash
az upgrade
az version
```
````

Do not add a summary after this section.

## Review and staging

Before staging:

1. Re-read the file from disk after editor or canvas review.
2. Confirm the filename date matches the official release-notes heading.
3. Confirm the title and release-notes link use the same version.
4. Confirm every published PR uses a customer-facing App Service marker.
5. Confirm no Function App, Flex Consumption, or Logic Apps content remains.
6. Confirm prose contains only `SCM (Kudu)`, not standalone variants.
7. Confirm there is no `## Summary`.
8. Confirm code examples use tag-verified options and values.
9. Run `git diff --check`.
10. Run the repository's existing Jekyll validation only when its dependencies are already available. Do not install Ruby dependencies from an unapproved source.

Stage only the generated post:

```text
git add -- _posts/YYYY-MM-DD-azure-cli-X-YY-app-service-updates.md
git diff --cached --check
```

Do not overwrite or unstage unrelated user changes. Do not commit, push, or create a pull request unless requested.
