# Release research

Use authenticated GitHub tools or `gh`. Prefer structured API responses and exact tag boundaries over broad web search.

## 1. Resolve the release

Use these sources:

- Az releases: `Azure/azure-powershell`, tagged `vX.Y.Z-MonthYYYY`
- Module source: `src/Websites` in `Azure/azure-powershell`
- Module ChangeLog: `src/Websites/Websites/ChangeLog.md`
- Module manifest: `src/Websites/Websites/Az.Websites.psd1`
- Az release notes source:
  `MicrosoftDocs/azure-docs-powershell/docs-conceptual/azps-X.Y.Z/release-notes-azureps.md`
- Breaking-change guidance: `migrate-az-X.0.0.md` and `upcoming-breaking-changes.md` in the same docs folder

For the target and previous Az release:

1. Record the official Az version, the release-notes heading (for example, `16.5.0 - November 2026`), and the GitHub release `publishedAt` timestamp.
2. Resolve both tag refs to immutable commit SHAs.
3. Read `ModuleVersion` from `Az.Websites.psd1` at each tag. If the versions match, the target release has no `Az.Websites` changes.
4. Record the exact base-exclusive, target-inclusive boundary.
5. Treat a major release (`X.0.0`) as a breaking-change release, and check its migration guide for `Az.Websites`.

Useful commands:

~~~text
gh release list --repo Azure/azure-powershell --limit 20
gh release view vX.Y.Z-MonthYYYY --repo Azure/azure-powershell --json name,tagName,publishedAt,url,body
# Tag refs may be annotated; if the ref object's type is "tag", dereference it via /git/tags/{sha} to get the commit SHA.
gh api repos/Azure/azure-powershell/git/ref/tags/vX.Y.Z-MonthYYYY
gh api "repos/Azure/azure-powershell/contents/src/Websites/Websites/Az.Websites.psd1?ref=vX.Y.Z-MonthYYYY" -H "Accept: application/vnd.github.raw"
gh api "repos/Azure/azure-powershell/contents/src/Websites/Websites/ChangeLog.md?ref=vX.Y.Z-MonthYYYY" -H "Accept: application/vnd.github.raw"
gh api repos/Azure/azure-powershell/compare/vPREV...vTARGET
~~~

In the GitHub release body, the `#### Az.Websites N.N.N` section lists the module changes. If that section is missing, the release has no App Service cmdlet changes.

Release tags are cut from release branches. When they diverge from `main`:

- Use the target tag's ChangeLog `## Version N.N.N` section as the candidate index.
- Verify each candidate's merged commit, or its cherry-pick, is contained in the target tag.
- Ensure the commit was not already contained in the previous release tag.
- Do not infer inclusion from a three-dot comparison alone.
- Never treat `## Upcoming Release` entries as shipped.

## 2. Check existing coverage

Search the blog before drafting:

```text
_posts/*azure-powershell*
_posts/*.md containing "Az.Websites" or "Azure PowerShell"
```

Record which Az and `Az.Websites` versions earlier posts and roll-ups already cover. Mark covered changes as **Already covered** in the ledger.

## 3. Discover candidates

Search the target ChangeLog section, the release notes, and the bounded comparison for changes under `src/Websites`. Search `Az.Functions`, `Az.LogicApp`, and `StaticWebApp` only to identify and explicitly exclude them.

For each change, collect:

| Field | Purpose |
|---|---|
| ChangeLog entry and module version | Customer-facing classification |
| PR number and exact title | Traceability |
| Merge commit | Tag containment |
| Contributor | Reviewer or acknowledgment context |
| Changed paths | Cmdlet relevance |
| Cmdlets and parameters | Customer-facing surface |
| Help examples | Safe article examples |
| Tests | Shipped behavior and edge cases |

Find PRs for a ChangeLog entry by searching changed paths and entry text:

```text
gh pr list --repo Azure/azure-powershell --state merged --search "Websites in:title" --json number,title,mergedAt
gh pr view PR --repo Azure/azure-powershell --json number,title,body,url,author,mergedAt,mergeCommit,baseRefName,files
```

PR titles vary (`[Websites]`, `[Az.Websites]`, `[PS] Websites`, or no prefix). Use them for discovery, not classification.

## 4. Apply classification

Use this order:

1. Is the merged commit in the target tag and absent from the previous release tag?
2. Does the target `Az.Websites` ChangeLog version section contain a customer-facing entry for it?
3. Is the customer surface an App Service cmdlet, and not Static Web Apps, Function Apps, Flex Consumption, or Logic Apps?
4. Has an earlier blog post already covered it?
5. Does tag-pinned source show the claimed behavior?

Possible decisions:

- **Include**: customer-facing, in scope, tag-contained, uncovered, and verified.
- **Exclude — not customer-facing**: no ChangeLog entry, or an entry for build, test, code-scanning, generation, or refactoring work only.
- **Exclude — scope**: Static Web Apps, Function Apps, Flex Consumption, Logic Apps, or unrelated surface.
- **Exclude — boundary**: not in the target tag, already in the previous tag, or only in `Upcoming Release`.
- **Already covered**: published in an earlier blog post.
- **Blocked**: eligible and in the boundary, but evidence conflicts or the functionality is unsafe to claim.

## 5. Enrich from product planning

Search `coreai-microsoft/azure-app-service` using the exact cmdlet, parameter, property, and customer outcome. Avoid downloading the entire board.

Capture privately:

- Workstream and PM
- Problem statement
- Why the change matters
- Customer gaps
- “We need to” goals
- Dependencies
- Timeline comments
- Potential SMEs or reviewers

Classify each match:

- **Exact**: same cmdlet or property, and same shipped outcome
- **Partial**: same problem, but the release implements only part of the requested outcome
- **Weak**: adjacent context only
- **None**

Only exact or carefully bounded partial matches should shape the article. Never turn a planning goal into a release claim.

## 6. Verify claims

At the target tag, inspect:

1. `src/Websites/Websites/help/<Cmdlet>.md` for syntax, parameter sets, examples, and documented limitations.
2. `src/Websites/Websites/Cmdlets/**` for `[Cmdlet]` and `[Parameter]` attributes, parameter sets, `ValidateSet` values, defaults, `SupportsShouldProcess`, `-AsJob`, and `-PassThru` behavior.
3. Preview and breaking-change attributes, such as `CmdletPreview`, `CmdletParameterBreakingChange`, `CmdletOutputBreakingChange`, and `GenericBreakingChange`.
4. `Utilities`, `Models.WebApp`, `Strategies`, and `Validations` for actual behavior and error handling.
5. `src/Websites/Websites.Autorest/custom` and `docs` for generated cmdlets. Confirm the cmdlet is an App Service cmdlet before including it.
6. `src/Websites/Websites.Test/ScenarioTests` and `SessionRecords` for supported boundaries and rollout behavior.
7. `src/Websites/Websites.Management.Sdk` and `Az.Websites.psd1` for the Microsoft.Web API version, exported cmdlets, and the required `Az.Accounts` version.

Then compare with contemporaneous public Microsoft documentation. A later `learn.microsoft.com/powershell/module/az.websites` page is not immutable evidence for an older release.

Block or narrow claims when:

- Public product documentation disagrees with the module ChangeLog or release notes.
- A platform endpoint or feature is still rolling out.
- The pinned SDK or API version cannot serialize the new property.
- Tests prove only discovery or acceptance, not completion or availability.
- A ChangeLog entry overstates what the cmdlet returns.

Examples in the article must come from tag-pinned help, tests, or implementation. Never invent a plausible PowerShell parameter.

## 7. Build the private ledger

Use a compact table:

| Change | Az / Az.Websites | PR | Scope | Decision | Public evidence | Planning match | Caveat |
|---|---|---|---|---|---|---|---|

Do not write the ledger into `_posts`. Keep it in the response or session artifacts.
