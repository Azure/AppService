---
name: azure-powershell-app-service-blog
description: Generate and stage Azure App Service Team Blog posts from Azure PowerShell (Az) releases. Use when asked to audit an Az or Az.Websites version or month, identify App Service cmdlet changes, check existing PowerShell blog coverage, enrich release content from the product-planning board, or draft an App Service Azure PowerShell release post.
---

# Azure PowerShell App Service Blog

Generate a factual, customer-focused App Service Team Blog post for one or more Azure PowerShell (Az) releases. Research the exact release boundary, classify `Az.Websites` changes using the module ChangeLog, check existing blog coverage, enrich customer framing from product planning, verify every shipped claim, write the post, and stage it for review.

Read these references before starting:

- [Release research](references/release-research.md)
- [Article contract](references/article-contract.md)

## Required inputs and defaults

- Accept an Az version such as `16.5`, `16.5.0`, or `v16.5.0-November2026`; an `Az.Websites` version such as `4.3.0`; a month such as `2026/11`; or a range such as "the last three months".
- Normalize Az versions to `X.Y.Z` and resolve the matching `vX.Y.Z-MonthYYYY` release tag.
- If given a month, resolve every Az release published for that month from the official release notes. A month can contain more than one Az release, such as a minor release and a major breaking-change release.
- If given an `Az.Websites` version, resolve the first Az release whose tag ships that module version.
- Default to Az rollup releases. Cover standalone or preview module releases only when the user requests them.
- Use `Byron Tardif` as `author_name` unless the user specifies another author.
- Work only in the current App Service Blog repository and preserve unrelated staged or unstaged changes.

## Non-negotiable publication rules

1. **Keep the article App Service-only.**
   - Include customer behavior for App Service cmdlets in `Az.Websites`, such as `*-AzWebApp*`, `*-AzWebAppSlot*`, `*-AzAppServicePlan*`, `*-AzAppServiceEnvironment*`, and App Service certificate, binding, backup, and access-restriction cmdlets.
   - Exclude Static Web Apps (`*-AzStaticWebApp*`), `Az.Functions` and Function Apps, Flex Consumption, and `Az.LogicApp` and Logic Apps from both the article and examples.
   - A change in `src/Websites` is not sufficient if its customer surface belongs to another service.

2. **Require a customer-facing ChangeLog entry.**
   - Azure PowerShell PR titles do not use a reliable service marker. The `Az.Websites` `ChangeLog.md` entry under the version shipped by the target tag is the customer-facing signal.
   - Exclude changes with no ChangeLog entry, and entries that describe only build, test, code-scanning, generation, or refactoring work with no customer behavior. Keep them in the internal ledger.
   - The entry is necessary, not sufficient. Verification can still block a customer-facing change.

3. **Prove release inclusion.**
   - The PR's merged commit must be present in the target Az release tag and absent from the previous release tag.
   - Confirm the `Az.Websites` module version in the target tag's `Az.Websites.psd1`, and confirm the change in that version's ChangeLog section and the official Az release notes.
   - An Az release with no `Az.Websites` section ships no App Service cmdlet changes.
   - Never use merge date, PR state, the ChangeLog `Upcoming Release` section, or release-note wording alone as proof.

4. **Treat pinned public implementation as the shipping authority.**
   - Verify cmdlet parameters, parameter sets, help, implementation, and tests at the target tag.
   - Treat PR descriptions and planning-board statements as intent, not proof.
   - Withhold a claim when tagged source, tests, SDK models, platform documentation, or public availability disagree.
   - State preview status, operating-system scope, SKU and regional limits, platform dependencies, and breaking changes explicitly.

5. **Avoid duplicate coverage.**
   - Search `_posts` for existing Azure PowerShell posts and recaps before drafting.
   - Do not republish changes already covered unless the user asks for an update. Reference the earlier post instead.

6. **Use private planning context safely.**
   - Search `coreai-microsoft/azure-app-service` by cmdlet, parameter, property, and customer outcome.
   - Use problem statements and “why it matters” material to strengthen customer framing.
   - Treat “We need to” statements and timeline comments as desired or tentative behavior until public evidence confirms shipment.
   - Never put private issue links, internal system links, private quotations, or unshipped roadmap details in the public post.
   - Keep PM, workstream, SME, and reviewer discoveries in the private evidence ledger.

7. **Use canonical terminology.**
   - Always write `SCM (Kudu)`.
   - Never write `KuduLite`, `Kudu+`, or standalone `Kudu` in prose.
   - Do not alter literal cmdlet names, parameter names, API paths, settings, or quoted output that legitimately contain another form.

## Workflow

1. Resolve the target and previous Az release tags, immutable commit SHAs, `Az.Websites` versions, and release dates.
2. Check existing blog coverage for those releases.
3. Build a bounded candidate inventory from the tagged `Az.Websites` ChangeLog, the release notes, and PR metadata.
4. Apply the ChangeLog and App Service cmdlet-scope filters.
5. Search the planning board only for surviving customer-facing candidates.
6. Verify every candidate against tag-pinned source, help, tests, and contemporaneous public documentation.
7. Record include, exclude, and blocked decisions in a private evidence ledger.
8. If no verified, uncovered App Service changes survive, do not create a post. Report that the release produced no article.
9. Group related changes by customer outcome and draft the article using the article contract.
10. Open the repository Markdown for review when an editor surface is available.
11. Re-read the file from disk after review because user edits may have changed it.
12. Validate and stage only the generated post. Do not commit, push, or create a pull request unless explicitly requested.

## Research stopping rule

Do not perform open-ended PR archaeology. Stop when all of these are true:

- Every `Az.Websites` ChangeLog entry in scope maps to a merged PR.
- Every mapped PR has an include, exclude, or blocked decision.
- Every included claim has tag-pinned implementation, help, or test evidence.
- Existing blog coverage has been checked.
- Relevant planning matches have been classified as exact, partial, weak, or none.
- Known documentation or rollout conflicts are recorded.

## Expected handoff

Provide:

1. The staged post path, or a clear no-post decision.
2. A compact ledger of included, excluded, blocked, and already-covered changes.
3. Material rollout, preview, breaking-change, or evidence caveats.

Keep the public article free of research notes and private planning references.
