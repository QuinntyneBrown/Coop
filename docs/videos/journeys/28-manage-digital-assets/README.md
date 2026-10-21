# Journey 28 · Manage digital assets

> **Runtime:** about 1 min 27 s · **Audience:** co-op office staff who look after the admin site · **Prerequisites:** an administrator account

**Video:** [28-manage-digital-assets.mp4](28-manage-digital-assets.mp4) · [Slides](slides.html) · **Audio:** [28-manage-digital-assets.mp3](28-manage-digital-assets.mp3) · [Transcript](script.md)

## Why this video exists

Photos for the website and the co-op's files live in one library. This video shows the office
how to upload, find, look at and delete them.

## Learning objectives

By the end, the viewer can:

- Upload a file to Digital Assets.
- Find a file with Search assets.
- Open Asset Details, download a copy, and delete a file.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-assets-1280.png` | The Digital Assets page with search, Upload and file cards |
| `images/admin-assets-search-1280.png` | A search for courtyard, showing only Courtyard plan.pdf |
| `images/admin-asset-upload-1280.png` | The Upload File dialog |
| `images/admin-asset-detail-1280.png` | Asset Details for Courtyard plan.pdf |
| `images/admin-asset-delete-1280.png` | The Confirm Delete dialog |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:17 | Welcome | Title; pictures and files in one place |
| 00:17-00:49 | Upload and find | Assets page, Upload, Search assets |
| 00:49-01:13 | View and delete | Asset Details, Download, Delete and confirm |
| 01:13-01:27 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/28-manage-digital-assets
node tools/video-audio/generate-audio.mjs docs/videos/journeys/28-manage-digital-assets --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/28-manage-digital-assets --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/28-manage-digital-assets --check
node tools/video-build/build-video.mjs docs/videos/journeys/28-manage-digital-assets
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- The search slide reuses the main page shot; no mock shows a filtered list.
