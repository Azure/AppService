# Article contract

## Filename and front matter

Name the post after the newest Az release it covers:

```text
_posts/YYYY-MM-DD-azure-powershell-X-Y-app-service-updates.md
```

- Use the newest covered release's GitHub `publishedAt` date, converted to US Pacific time, unless the user specifies a publication date.
- For an `X.Y.0` release, omit the patch component from the slug. Keep any non-zero patch, for example `azure-powershell-16-5-1`.
- Confirm the filename does not collide with an existing post.

For a single release, start with:

```yaml
---
title: "What's new for Azure App Service in Azure PowerShell Az X.Y.Z"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---
```

For a multi-release recap, use a month range, for example `"What's new for Azure App Service in Azure PowerShell: September-November 2026"`.

Do not repeat the title as an H1 in the body.

## Opening

- Link the first body mention of each Az version to its GitHub release, for example `https://github.com/Azure/azure-powershell/releases/tag/vX.Y.Z-MonthYYYY`.
- Name the `Az.Websites` module version that contains the changes.
- Use one or two information-dense paragraphs that identify the major customer outcomes, breaking changes, and important scope.
- For a recap, add a table with these columns: monthly release, Az version, `Az.Websites` version, and App Service updates.
- Do not add a closing `## Summary`; strengthen the introduction instead.
- Do not link to articles or documentation that did not exist on the post's release date.

Example:

```markdown
[Azure PowerShell Az X.Y.Z](https://github.com/Azure/azure-powershell/releases/tag/vX.Y.Z-MonthYYYY) adds ... The App Service cmdlets are in the `Az.Websites` module, version N.N.N.
```

## Body

- Organize H2 sections by customer outcome, not by PR number, release, or implementation file.
- Use benefit-first, sentence-style headings.
- Group closely related changes into one section.
- Explain what changed, why it matters, how to use it, and material limitations.
- Use short, verified `powershell` examples with backtick line continuations and quoted placeholders such as `"<resource-group>"` and `"<web-app>"`.
- Use a table when introducing several related cmdlets.
- State breaking changes before migration guidance.
- Mark preview cmdlets and parameters explicitly.
- Preserve Linux-only, Windows-only, slot, region, SKU, and rollout boundaries.
- Distinguish “request accepted” from operation completion. Do not confuse service-side asynchronous behavior with PowerShell `-AsJob`.
- Explain update semantics when they matter: omitted parameters preserved, collection parameters replaced, and empty arrays cleared.
- Recommend `-WhatIf` for disruptive operations when the cmdlet supports it.
- Treat returned credentials and secrets as sensitive, and never display them in examples.
- Use `SCM (Kudu)` for every prose reference.
- Exclude Static Web Apps, Function Apps, Flex Consumption, and Logic Apps.
- Do not expose private planning links or internal terminology.

Add first-party Microsoft Learn links when they materially help the reader and were public by the article date. Do not create feature-specific mandatory links from one-off editorial feedback.

## Release section

End the article with:

````markdown
## Get the release

Use Az X.Y.Z / Az.Websites N.N.N or later for the capabilities in this post. Update using the same installation method you originally used. For a PowerShellGet-based installation:

```powershell
Update-Module -Name Az
```

Start a new PowerShell session after updating, then check the available App Service module versions:

```powershell
Get-Module -ListAvailable Az.Websites |
    Select-Object Name, Version
```
````

Do not add a summary after this section.

## Review and staging

Before staging:

1. Re-read the file from disk after editor or canvas review.
2. Confirm the filename date and version match the newest covered release.
3. Confirm the title, release links, and `Az.Websites` versions agree with the tagged manifest and release notes.
4. Confirm every published change has a customer-facing `Az.Websites` ChangeLog entry in a shipped version section.
5. Confirm no change duplicates an earlier post unless the user requested an update.
6. Confirm no Static Web Apps, Function App, Flex Consumption, or Logic Apps content remains.
7. Confirm prose contains only `SCM (Kudu)`, not standalone variants.
8. Confirm there is no `## Summary`.
9. Confirm code examples use tag-verified cmdlets, parameters, and values.
10. Run `git diff --check`.
11. Run the repository's existing Jekyll validation only when its dependencies are already available. Do not install Ruby dependencies from an unapproved source.

Stage only the generated post:

```text
git add -- _posts/YYYY-MM-DD-azure-powershell-X-Y-app-service-updates.md
git diff --cached --check
```

Do not overwrite or unstage unrelated user changes. Do not commit, push, or create a pull request unless requested.
