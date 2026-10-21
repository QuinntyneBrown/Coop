# Journey 20 · Manage documents

> **Runtime:** about 1 min 30 s · **Audience:** co-op office staff · **Prerequisites:** an office (admin) account

**Video:** [20-manage-documents.mp4](20-manage-documents.mp4) · [Slides](slides.html) · **Audio:** [20-manage-documents.mp3](20-manage-documents.mp3) · [Transcript](script.md)

## Why this video exists

Notices, by-laws and reports all live on the Documents page. This video shows staff how
to find, add and delete documents.

## Learning objectives

By the end, the viewer can:

- Filter documents with the tabs and search them.
- Add a document with New document.
- Delete a document after confirming.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-documents-1280.png` | The Documents page |
| `images/admin-documents-bylaws-1280.png` | The Bylaws tab |
| `images/admin-documents-search-1280.png` | A search for courtyard, showing only Autumn courtyard gathering |
| `images/admin-document-create-1280.png` | The New document dialog |
| `images/admin-document-delete-1280.png` | The box asking Delete “Autumn courtyard gathering”? |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:15 | Welcome | Title; all in one place |
| 00:15-00:49 | Find a document | Documents, tabs, search |
| 00:49-01:13 | Add and delete | New document, delete and confirm |
| 01:13-01:30 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/20-manage-documents
node tools/video-audio/generate-audio.mjs docs/videos/journeys/20-manage-documents --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/20-manage-documents --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/20-manage-documents --check
node tools/video-build/build-video.mjs docs/videos/journeys/20-manage-documents
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`, and each must match only one paragraph. Edit the script and the slide cue together.
