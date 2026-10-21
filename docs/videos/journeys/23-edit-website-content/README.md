# Journey 23 · Edit website content

> **Runtime:** about 1 min 43 s · **Audience:** co-op office staff · **Prerequisites:** an office account

**Video:** [23-edit-website-content.mp4](23-edit-website-content.mp4) · [Slides](slides.html) · **Audio:** [23-edit-website-content.mp3](23-edit-website-content.mp3) · [Transcript](script.md)

## Why this video exists

The public website is how many future members first meet the co-op. This
video shows staff how to change its words, lists and photos safely.

## Learning objectives

By the end, the viewer can:

- Open Website and find the part to change.
- Edit a block and save it, or cancel.
- Reorder, remove and add list items, and choose or upload a photo with a description.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-website-1280.png` | The Website page with every block |
| `images/admin-content-editor-1280.png` | The Edit Hero form |
| `images/admin-content-editor-list-1280.png` | The Edit Header form with menu links |
| `images/admin-photo-picker-1280.png` | The Choose a photo window |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:14 | Welcome | Title; live as soon as you save |
| 00:14-00:54 | Edit a block | Website list, Edit, Save changes, Cancel |
| 00:54-01:10 | Lists | Move up, Move down, Remove, Add menu link |
| 01:10-01:28 | Photos | Choose photo, upload, describe |
| 01:28-01:43 | In short | Recap, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/23-edit-website-content
node tools/video-audio/generate-audio.mjs docs/videos/journeys/23-edit-website-content --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/23-edit-website-content --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/23-edit-website-content --check
node tools/video-build/build-video.mjs docs/videos/journeys/23-edit-website-content
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.

