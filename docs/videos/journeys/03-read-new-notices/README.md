# Journey 03 · Read new notices

> **Runtime:** about 1 min 12 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** none (published notices are open to all)

**Video:** [03-read-new-notices.mp4](03-read-new-notices.mp4) · [Slides](slides.html) · **Audio:** [03-read-new-notices.mp3](03-read-new-notices.mp3) · [Transcript](script.md)

## Why this video exists

The office sends notices to everyone. This video shows a member where to find them and how to read one.

## Learning objectives

By the end, the viewer can:

- Open the Documents page from Docs.
- Tap Notices to show only notices.
- Open a notice, download a copy, and close it.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-documents-360.png` | The Documents page with a notice, a bylaw and a report |
| `images/public-documents-notices-360.png` | Only notices shown |
| `images/public-document-viewer-360.png`, `-1280.png` | The Autumn courtyard gathering notice open, with Download |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:18 | Welcome | Title; what a notice might be about |
| 00:18-00:41 | Find the notices | Docs, then Notices |
| 00:41-01:01 | Read a notice | Open, Download, close |
| 01:01-01:12 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/03-read-new-notices
node tools/video-audio/generate-audio.mjs docs/videos/journeys/03-read-new-notices --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/03-read-new-notices --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/03-read-new-notices --check
node tools/video-build/build-video.mjs docs/videos/journeys/03-read-new-notices
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
