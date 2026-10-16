# Journey 25 · Manage website pages

> **Runtime:** about 1 min 35 s · **Audience:** co-op office staff · **Prerequisites:** an office account

**Video:** [25-manage-website-pages.mp4](25-manage-website-pages.mp4) · [Slides](slides.html) · **Audio:** [25-manage-website-pages.mp3](25-manage-website-pages.mp3) · [Transcript](script.md)

## Why this video exists

Pages such as About us and How to apply answer visitors' questions. This
video shows staff how to add, change and remove them.

## Learning objectives

By the end, the viewer can:

- Find the Pages list and open a page on the website.
- Add a new page with a title, optional photo and text.
- Edit a page, and remove one after confirming.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-pages-1280.png` | The Pages list |
| `images/admin-page-editor-1280.png` | The New page form |
| `images/admin-page-editor-edit-1280.png` | The Edit page form, filled in |
| `images/admin-page-remove-1280.png` | The Remove page confirmation |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:16 | Welcome | Title; pages are live straight away |
| 00:16-00:31 | Your pages | The list; Open on the website |
| 00:31-00:57 | Add a page | New page, title, photo, text, Save page |
| 00:57-01:20 | Change or remove a page | Edit, Save page; Remove, confirm |
| 01:20-01:35 | In short | Recap, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/25-manage-website-pages
node tools/video-audio/generate-audio.mjs docs/videos/journeys/25-manage-website-pages --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/25-manage-website-pages --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/25-manage-website-pages --check
node tools/video-build/build-video.mjs docs/videos/journeys/25-manage-website-pages
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.

