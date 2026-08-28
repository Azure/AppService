---
name: azure-cli-app-service-blog
description: Generate and stage Azure App Service Team Blog posts from Azure CLI monthly releases. Use when asked to audit an Azure CLI version or month, identify App Service changes, enrich release content from the product-planning board, or draft an App Service Azure CLI release post.
---

# Azure CLI App Service Blog

Generate a factual, customer-focused App Service Team Blog post for one or more Azure CLI releases. Research the exact release boundary, classify PRs using the Azure CLI title convention, enrich customer framing from product planning, verify every shipped claim, write the post, and stage it for review.

Read these references before starting:

- [Release research](references/release-research.md)
- [Article contract](references/article-contract.md)

## Required inputs and defaults

- Accept a release version such as `2.90`, `2.90.0`, or a month such as `2026/08`.
- Normalize monthly versions to `X.Y.0`.
- If given a month, resolve its monthly release from the official Azure CLI release notes. Do not substitute a later servicing patch unless the user requests it.
- Use `Byron Tardif` as `author_name` unless the user specifies another author.
- Work only in the current App Service Blog repository and preserve unrelated staged or unstaged changes.

## Non-negotiable publication rules

1. **Keep the article App Service-only.**
   - Include customer behavior under `az webapp` and `az appservice`.
   - Exclude `az functionapp`, Function Apps, Flex Consumption, `az logicapp`, and Logic Apps from both the article and examples.
   - A PR touching the App Service command module is not sufficient if its customer surface belongs to another service.

2. **Require the PR title marker.**
   - `[App Service]` or `[AppService]` means customer-facing and eligible for verification.
   - `{App Service}` or `{AppService}` means non-customer-facing. Keep it in the internal ledger and exclude it from the article.
   - Exclude unmarked PRs and PRs marked for another service. Flag them in the ledger instead of silently promoting them.
   - The marker is necessary, not sufficient. Verification can still block a customer-facing PR.

3. **Prove release inclusion.**
   - The PR's merged commit must be present in the target release tag.
   - Confirm the item against the target tag's `src/azure-cli/HISTORY.rst`.
   - Never use milestone assignment, merge date, PR state, or release-note wording alone as proof.

4. **Treat pinned public implementation as the shipping authority.**
   - Verify help, parameters, implementation, and tests at the target tag.
   - Treat PR descriptions and planning-board statements as intent, not proof.
   - Withhold a claim when tagged source, tests, SDK models, platform documentation, or public availability disagree.
   - State preview status, operating-system scope, regional rollout, platform dependencies, and breaking changes explicitly.

5. **Use private planning context safely.**
   - Search `coreai-microsoft/azure-app-service` by command, parameter, property, and customer outcome.
   - Use problem statements and “why it matters” material to strengthen customer framing.
   - Treat “We need to” statements and timeline comments as desired or tentative behavior until public evidence confirms shipment.
   - Never put private issue links, internal system links, private quotations, or unshipped roadmap details in the public post.
   - Keep PM, workstream, SME, and reviewer discoveries in the private evidence ledger.

6. **Use canonical terminology.**
   - Always write `SCM (Kudu)`.
   - Never write `KuduLite`, `Kudu+`, or standalone `Kudu` in prose.
   - Do not alter literal command names, API paths, settings, or quoted output that legitimately contain another form.

## Workflow

1. Resolve the target and previous monthly release tags, immutable commit SHAs, and official release date.
2. Build a bounded candidate inventory from the tag comparison, tagged history, and PR metadata.
3. Apply title-marker and App Service command-scope filters.
4. Search the planning board only for surviving customer-facing candidates.
5. Verify every candidate against tag-pinned source, tests, and contemporaneous public documentation.
6. Record include, exclude, and blocked decisions in a private evidence ledger.
7. If no verified App Service changes survive, do not create a post. Report that the release produced no article.
8. Group related changes by customer outcome and draft the article using the article contract.
9. Open the repository Markdown for review when an editor surface is available.
10. Re-read the file from disk after review because user edits may have changed it.
11. Validate and stage only the generated post. Do not commit, push, or create a pull request unless explicitly requested.

## Research stopping rule

Do not perform open-ended PR archaeology. Stop when all of these are true:

- Every App Service history entry maps to a title-marked PR.
- Every mapped PR has an include, exclude, or blocked decision.
- Every included claim has tag-pinned implementation or test evidence.
- Relevant planning matches have been classified as exact, partial, weak, or none.
- Known documentation or rollout conflicts are recorded.

## Expected handoff

Provide:

1. The staged post path, or a clear no-post decision.
2. A compact ledger of included, excluded, and blocked PRs.
3. Material rollout, preview, breaking-change, or evidence caveats.

Keep the public article free of research notes and private planning references.
