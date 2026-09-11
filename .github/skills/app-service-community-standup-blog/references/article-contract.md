# Article contract

## Filename and front matter

Use:

```text
_posts/YYYY-MM-DD-<concise-session-slug>.md
```

Default `YYYY-MM-DD` to the current date unless the user specifies a publication date.

Start with:

```yaml
---
title: "<Official or lightly edited session title>"
author_name: "<Presenter names>"
tags:
  - <topic-one>
  - <topic-two>
  - <topic-three>
---
```

Follow these rules:

- Do not repeat the title as an H1 in the body.
- Use no more than three tags, matching `CONTRIBUTING.md`.
- Add `toc` fields only when the post's length and repository precedent justify them.

## Opening

Write one short paragraph that connects the session's major topics into a customer outcome. Link the first mention of the standup title to the YouTube recording.

Follow with a short `The session covered:` list containing the two or three primary topics. Do not list every aside or announcement.

## Watch section

Place the watch section immediately after the opening overview and before the detailed recap:

```markdown
## Watch the Session

[![Watch <SESSION_TITLE>](https://img.youtube.com/vi/<VIDEO_ID>/maxresdefault.jpg)](https://www.youtube.com/watch?v=<VIDEO_ID>)

[Watch on YouTube](https://www.youtube.com/watch?v=<VIDEO_ID>)
```

Use the official video title in the image alt text.

## Body

- Organize H2 sections by customer outcome, not presenter or timestamp.
- Use benefit-first, sentence-style headings.
- Explain the problem, capability, demonstration, and material limitations.
- Keep the recap concise; omit introductions, banter, and repeated explanations.
- Use bullets for capability lists and numbered steps only for an actual sequence.
- Use short code examples only when the recording demonstrates an actionable command, request header, or configuration.
- Verify exact syntax from the recording or public documentation.
- Distinguish a demo-specific measurement from broad product testing.
- State preview, GA, operating-system, region, SKU, plan, and rollout boundaries.
- Use `SCM (Kudu)` in prose.
- Do not add a closing `## Summary`.

An optional synthesis section can connect the topics into a practical path, as long as it adds insight rather than repeating the introduction.

## Time-sensitive wording

Use current public documentation for present-tense availability.

When reporting something shown as upcoming in the recording:

- Say “the team previewed” or “at the time of the recording.”
- Use “planned” for unshipped work.
- Do not preserve a promised date that has passed unless it remains relevant historical context.
- Remove roadmap material that cannot be verified publicly.

## Resources

End with:

```markdown
## Resources
```

Include a compact list of first-party links:

1. Announcement posts for the main topics.
2. Microsoft Learn documentation.
3. Official repositories or samples demonstrated.
4. Closely related App Service Team Blog posts.

Do not duplicate the YouTube link unless it materially helps readers.

## Review and staging

Before staging:

1. Re-read the file from disk after editor or canvas review.
2. Confirm the filename uses the intended publication date.
3. Confirm the title and YouTube URL match the input video.
4. Confirm the watch section appears directly after the opening overview.
5. Confirm `author_name` matches the presenters.
6. Confirm there are no more than three tags.
7. Confirm every current-state claim has first-party evidence.
8. Confirm preview, GA, operating-system, region, SKU, and rollout boundaries are explicit.
9. Confirm commands, headers, properties, numbers, and measurements are exact.
10. Confirm no transcript fragments, internal notes, or private links appear in the post.
11. Check every resource URL.
12. Run `git diff --check`.
13. Run the repository's existing Jekyll validation only when its dependencies are already available. Do not install Ruby dependencies from an unapproved source.

Stage only the generated post:

```text
git add -- _posts/YYYY-MM-DD-<concise-session-slug>.md
git diff --cached --check
```

Do not overwrite or unstage unrelated user changes. Do not commit, push, create a pull request, or request reviewers unless requested.
