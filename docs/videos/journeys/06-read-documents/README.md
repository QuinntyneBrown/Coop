# Journey 06 · Read documents

> **Runtime:** about 1 min 13 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** none (published documents are open to all)

**Video:** [06-read-documents.mp4](06-read-documents.mp4) · [Slides](slides.html) · **Audio:** [06-read-documents.mp3](06-read-documents.mp3) · [Transcript](script.md)

## Why this video exists

By-Laws, reports and notices are kept together on the Documents page. This video shows a member how to find the kind she wants and read it.

## Learning objectives

By the end, the viewer can:

- Open the Documents page from Docs.
- Use the All, Notices, By-Laws and Reports buttons.
- Open a document, download a copy, and close it.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-documents-360.png` | The Documents page with three documents |
| `images/public-documents-bylaws-360.png` | Only by-laws shown |
| `images/public-documents-reports-360.png` | Only reports shown |
| `images/public-document-viewer-360.png`, `-1280.png` | A document open with Download |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:16 | Welcome | Title; all kept together |
| 00:16-00:45 | Find a document | Docs; choose a kind |
| 00:45-01:01 | Read it | Open, Download, close |
| 01:01-01:13 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/06-read-documents
node tools/video-audio/generate-audio.mjs docs/videos/journeys/06-read-documents --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/06-read-documents --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/06-read-documents --check
node tools/video-build/build-video.mjs docs/videos/journeys/06-read-documents
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
