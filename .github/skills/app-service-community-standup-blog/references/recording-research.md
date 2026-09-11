# Recording research

Use the YouTube URL as the research boundary. The goal is to understand what happened in the session, not to produce a generic article about the title's keywords.

## 1. Inspect repository conventions

Before researching the recording:

1. Read `CONTRIBUTING.md`.
2. Read the newest relevant Community Standup or recorded-session recap under `_posts`.
3. Note the front matter, voice, section ordering, watch-card placement, resource style, and maximum tag count.
4. If the user identifies an example PR, inspect its changed post from local Git history or the merged file on the default branch.

Do not overwrite unrelated work. Use the existing post only as a structural model, not as reusable factual content.

## 2. Resolve video metadata

From the URL, record:

| Field | Purpose |
|---|---|
| Video ID | Thumbnail and canonical watch links |
| Official title | Article title and opening link |
| Channel | Source attribution |
| Description | Agenda, presenters, and official framing |
| Publication metadata | Context only; the post date defaults to the requested publication date |
| Duration | Transcript completeness |
| Presenters | `author_name` and reviewer suggestions |

Prefer YouTube oEmbed or player metadata over search-result snippets.

Use the canonical links:

```text
https://www.youtube.com/watch?v=<VIDEO_ID>
https://img.youtube.com/vi/<VIDEO_ID>/maxresdefault.jpg
```

## 3. Obtain the session content

Use this order:

1. Public caption track from YouTube player metadata.
2. YouTube transcript endpoint when a caption track exists.
3. Existing local transcription tools against the public audio.

If local transcription is required:

- Keep audio, transcript, screenshots, virtual environments, and model data under the session artifacts directory.
- Prefer already installed tools such as `yt-dlp`, `ffmpeg`, and a local speech-to-text runtime.
- If a dependency is missing, use only the package manager's configured corporate-approved source. Do not access a public package registry directly.
- Do not commit generated media or transcripts.
- Remove temporary artifacts after validation.

The transcript must cover the full substantive session. Ignore pre-show silence, countdowns, and closing music.

## 4. Build the private evidence ledger

Capture the session in a compact table:

| Time | Topic | Presenter | What was shown or claimed | Verification source | Status or caveat | Include |
|---|---|---|---|---|---|---|

Record:

- The opening agenda.
- Major announcements.
- Customer problem and value proposition.
- Demonstrated application, command, configuration, or workflow.
- Exact measurements or comparisons.
- Preview, GA, operating-system, region, SKU, or plan boundaries.
- Security and persistence guidance.
- Future work or rollout statements.
- Resource links displayed or mentioned.

Transcription errors are common in product names, commands, acronyms, and numbers. Verify those details from on-screen frames or public documentation before using them.

## 5. Verify announcements

For each material topic, search first-party sources in this order:

1. Microsoft Learn documentation.
2. Apps on Azure Blog announcement.
3. App Service Team Blog post.
4. Official Microsoft or Azure GitHub repository.
5. Official CLI, SDK, REST, ARM, or Bicep reference.

Verify:

- Feature status: preview or GA.
- Supported platforms and operating systems.
- Regions and pricing tiers.
- Required headers, commands, properties, and API versions.
- Authentication and network behavior.
- Persistence or restart behavior.
- Whether a portal or CLI experience is available now or only planned.

When the recording is older than the publication date, use current public documentation for current-state claims. Preserve the recording's historical context with phrases such as “During the session” or “At the time of the recording.”

## 6. Use demonstrations carefully

Demonstrations make the recap concrete, but do not overstate them:

- Identify the starting constraint.
- Describe the relevant App Service capability.
- State the observed outcome.
- Make clear whether the result was a general product guarantee or one demo's measurement.
- Add “results vary” when the presenters or source material qualify a measurement.

For exact terminal syntax or HTTP headers, inspect the relevant video frame if the transcript omits punctuation.

## 7. Select the narrative

Do not summarize every minute. Group the session into two or three customer outcomes, for example:

- Move constrained Windows applications to managed PaaS.
- Make existing content easier for agents to consume.
- Improve operations with a new CLI capability.

The article should answer:

1. What customer problem does this solve?
2. What did the team demonstrate?
3. What can readers use now?
4. What important limitations apply?
5. Where can readers learn more?
