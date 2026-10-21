# Journey 25 · Manage roles and privileges

> **Runtime:** about 1 min 29 s · **Audience:** co-op office staff · **Prerequisites:** an office account

**Video:** [25-manage-roles-and-privileges.mp4](25-manage-roles-and-privileges.mp4) · [Slides](slides.html) · **Audio:** [25-manage-roles-and-privileges.mp3](25-manage-roles-and-privileges.mp3) · [Transcript](script.md)

## Why this video exists

Roles decide who can see and change what. This video shows staff how to
select a role and tick or untick its privileges.

## Learning objectives

By the end, the viewer can:

- Open Roles and Privileges and select a role.
- Read the privileges table: Read, Write, Create and Delete per record.
- Toggle a privilege and know the change is kept.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-roles-1280.png` | SystemAdministrator and its privileges |
| `images/admin-roles-member-1280.png` | The Member role, one row |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:18 | Welcome | Title; what a role is |
| 00:18-00:37 | Choose a role | Five roles; select one |
| 00:37-01:12 | Turn privileges on or off | Rows, four boxes, toggle, Member example |
| 01:12-01:27 | In short | Recap, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/25-manage-roles-and-privileges
node tools/video-audio/generate-audio.mjs docs/videos/journeys/25-manage-roles-and-privileges --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/25-manage-roles-and-privileges --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/25-manage-roles-and-privileges --check
node tools/video-build/build-video.mjs docs/videos/journeys/25-manage-roles-and-privileges
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- The Add Privilege button is shown but not narrated; describe it only once its behaviour is specified.
