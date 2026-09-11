---
name: app-service-community-standup-blog
description: Generate and stage an Azure App Service Team Blog recap from a YouTube Community Standup recording. Use when given an Azure App Service standup YouTube URL and asked to research the session, verify announcements and demos, draft a recap, or prepare a review-ready post.
---

# App Service Community Standup Blog

Turn an Azure App Service Community Standup YouTube recording into a factual, customer-focused recap for the App Service Team Blog. Extract the actual session content, verify product claims against first-party public sources, follow the repository's recap pattern, and stage the post for review.

Read these references before starting:

- [Recording research](references/recording-research.md)
- [Article contract](references/article-contract.md)

## Required input and defaults

- Require one YouTube video URL.
- Use the current date for the post filename unless the user specifies a publication date.
- Derive the article title from the video's official title, removing redundant channel or series wording only when needed for readability.
- Derive `author_name` from the presenters featured in the recording or video description. Preserve the names and ordering used by the official source.
- Work only in the current App Service Blog repository.
- Preserve unrelated staged and unstaged changes.

## Non-negotiable publication rules

1. **Base the recap on the recording.**
   - Do not infer the session from the video title alone.
   - Use captions or a transcript to identify the agenda, demonstrations, limitations, measurements, and closing guidance.
   - If captions are unavailable, create a local transcript from the public recording when the required local tools are available.
   - If the recording cannot be transcribed or inspected, stop and report the evidence gap instead of fabricating a recap.

2. **Verify product claims independently.**
   - Treat the recording as the authority for what the presenters said and demonstrated.
   - Treat current first-party documentation and announcement posts as the authority for availability, preview or GA status, supported operating systems, regions, SKUs, commands, properties, and limitations.
   - Narrow or qualify claims when the recording and current documentation differ.
   - Use “at the time of the recording” for roadmap or rollout statements that are no longer current.

3. **Keep the article App Service-focused.**
   - Include only App Service announcements, demos, and closely related tooling mentioned in the session.
   - Do not turn brief references to unrelated Azure services into standalone sections.
   - Explain integrations such as Azure SQL, Key Vault, Azure Bastion, Azure Monitor, or GitHub Copilot only as they support the App Service story.

4. **Use first-party links.**
   - Prefer Microsoft Learn, the Apps on Azure Blog, the App Service Team Blog, official Microsoft GitHub repositories, and the recording itself.
   - Do not use private planning links, internal documents, or unofficial summaries in the public post.
   - Verify every resource URL before staging.

5. **Separate shipped behavior from future work.**
   - State preview status and material scope explicitly.
   - Describe future portal, CLI, operating-system, region, or GA plans as planned, not available.
   - Do not publish dates or roadmap commitments unless a public source states them.

6. **Use canonical terminology.**
   - Always write `SCM (Kudu)` in prose.
   - Preserve literal command names, headers, API properties, and quoted output exactly.

## Workflow

1. Inspect the current repository conventions and at least one recent session recap.
2. Extract the YouTube video ID, title, channel, description, thumbnail, publication metadata, duration, and named presenters.
3. Obtain captions or create a local transcript. Store temporary media, transcripts, screenshots, and models in the session artifacts directory, never in the repository.
4. Build a compact private evidence ledger of the session's topics, demonstrations, measurements, and caveats.
5. Find first-party public sources for every material announcement and verify its current status.
6. Select the customer-relevant narrative. Prefer two or three major outcomes over a chronological transcript.
7. Draft the post using the article contract.
8. Open the repository Markdown for review when an editor surface is available.
9. Re-read the file from disk after review because user edits may have changed it.
10. Validate the front matter, links, Markdown, claims, and Git diff.
11. Stage only the generated post. Do not commit, push, create a pull request, or request reviewers unless explicitly asked.
12. Delete temporary downloaded media and transcription artifacts after the post is validated.

## Research stopping rule

Stop researching when all of these are true:

- The recording's major segments and demonstrations are represented in the evidence ledger.
- Every published product claim has a first-party public source.
- Preview, GA, operating-system, region, SKU, and rollout boundaries are recorded.
- Demonstration-specific commands, headers, properties, and measurements are verified from the recording or public documentation.
- Every resource link has been checked.
- The recap can explain the session's customer value without reproducing the transcript.

## Expected handoff

Provide:

1. The staged post path.
2. A short list of the included standup topics.
3. Material preview, rollout, or evidence caveats.
4. Suggested reviewers based on the presenters or feature owners, without requesting review unless the user asks.

Keep transcripts, screenshots, evidence notes, and research artifacts out of `_posts`.
