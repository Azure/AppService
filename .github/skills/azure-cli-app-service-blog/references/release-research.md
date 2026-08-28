# Release research

Use authenticated GitHub tools or `gh`. Prefer structured API responses and exact tag boundaries over broad web search.

## 1. Resolve the release

Use these sources:

- Azure CLI releases: `Azure/azure-cli`
- Azure CLI release notes source:
  `MicrosoftDocs/azure-docs-cli/docs-ref-conceptual/Latest-version/release-notes-azure-cli.md`

For the target and previous monthly release:

1. Record the official version and the date heading from the release notes.
2. Resolve both tag refs to immutable commit SHAs.
3. Record the exact base-exclusive, target-inclusive boundary.
4. Treat servicing releases such as `X.Y.1` separately from the monthly `X.Y.0` release.

Useful commands:

~~~text
gh release view azure-cli-X.Y.Z --repo Azure/azure-cli --json name,tagName,publishedAt,url
# Tag refs may be annotated; if the ref object's type is "tag", dereference it via /git/tags/{sha} to get the commit SHA.
gh api repos/Azure/azure-cli/git/ref/tags/azure-cli-X.Y.Z
gh api repos/Azure/azure-cli/git/tags/<tag-object-sha>
gh api repos/Azure/azure-cli/compare/azure-cli-PREV...azure-cli-TARGET
~~~

Release tags can diverge because of servicing commits. When they do:

- Use the target tag's App Service `HISTORY.rst` section as the candidate index.
- Verify each candidate's merged commit is contained in the target tag.
- Ensure the commit was not already contained in the previous monthly tag.
- Do not infer inclusion from a three-dot comparison alone.

## 2. Discover candidates

Search the target tag's App Service history and the bounded comparison for:

- `App Service`
- `AppService`
- `webapp`
- `appservice`
- `Microsoft.Web`

Search Function and Logic App terms only to identify and explicitly exclude them.

For each PR, collect:

| Field | Purpose |
|---|---|
| PR number and exact title | Title-marker classification |
| Merge commit | Tag containment |
| Contributor | Reviewer or acknowledgment context |
| Changed paths | Command-module relevance |
| HISTORY entries | Public release-note mapping |
| Command and parameters | Customer-facing surface |
| Help examples | Safe article examples |
| Tests | Shipped behavior and edge cases |

Retrieve focused metadata:

```text
gh pr view PR --repo Azure/azure-cli --json number,title,body,url,author,mergedAt,mergeCommit,files
```

Do not trust milestones as release boundaries. A PR can be assigned to one month and ship in another, or remain unmerged.

## 3. Apply classification

Use this order:

1. Is the merged commit in the target tag and absent from the previous monthly tag?
2. Does the title contain an explicit App Service marker?
3. Is the marker square-bracket customer-facing or brace-marked non-customer-facing?
4. Is the customer command actually `az webapp` or `az appservice`?
5. Does tag-pinned source show the claimed behavior?

Possible decisions:

- **Include**: customer-facing, in scope, tag-contained, and verified.
- **Exclude — marker**: brace-marked, unmarked, or another service.
- **Exclude — scope**: Function Apps, Flex Consumption, Logic Apps, or unrelated command surface.
- **Exclude — boundary**: not in the target tag or already in the previous tag.
- **Blocked**: eligible marker and boundary, but evidence conflicts or functionality is unsafe to claim.

## 4. Enrich from product planning

Search `coreai-microsoft/azure-app-service` using the exact command, parameter, property, and customer outcome. Avoid downloading the entire board.

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

- **Exact**: same command/property and shipped outcome
- **Partial**: same problem, but the release implements only part of the requested outcome
- **Weak**: adjacent context only
- **None**

Only exact or carefully bounded partial matches should shape the article. Never turn a planning goal into a release claim.

## 5. Verify claims

At the target tag, inspect:

1. `_help.py` for examples and documented limitations.
2. `_params.py` for exact option names, aliases, enums, preview metadata, and defaults.
3. `commands.py` for registration, preview, and deprecation metadata.
4. Implementation files for actual behavior and error handling.
5. Tests and recordings for supported boundaries and rollout behavior.
6. Dependency pins and SDK models when a parameter relies on newly generated properties.

Then compare with contemporaneous public Microsoft documentation. A later `azure-cli-latest` page is not immutable evidence for an older release.

Block or narrow claims when:

- Public product documentation disagrees with CLI release notes.
- A platform endpoint or feature is still rolling out.
- The pinned SDK cannot serialize the new property.
- Tests prove only discovery or acceptance, not completion or availability.
- A release note overstates what implementation returns.

Examples in the article must come from tag-pinned help, tests, or implementation. Never invent a plausible CLI option.

## 6. Build the private ledger

Use a compact table:

| PR | Marker | Scope | Decision | Public evidence | Planning match | Caveat |
|---|---|---|---|---|---|---|

Do not write the ledger into `_posts`. Keep it in the response or session artifacts.
