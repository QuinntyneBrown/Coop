# Journey 24 · Manage website pages

> **Runtime:** about 2 min 17 s · **Audience:** co-op office staff · **Prerequisites:** an office account

**Video:** [24-manage-website-pages.mp4](24-manage-website-pages.mp4) · [Slides](slides.html) · **Audio:** [24-manage-website-pages.mp3](24-manage-website-pages.mp3) · [Transcript](script.md)

## Why this video exists

Pages such as About us and How to apply answer visitors' questions. This
video shows staff how to add a page from a banner and body blocks, keep it
out of the menu while they write, remove it, and publish.


## Learning objectives

By the end, the viewer can:

- Find the pages in the Website site tree and start one with Add a page.
- Set the page banner and untick "Show this page in the website menu" to keep a page hidden.
- Add headings, paragraphs, bullet lists, photos and link buttons, and select Save page.
- Remove a page after confirming, and publish the draft.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-website-1280.png` | The Website site tree with its pages |
| `images/admin-page-new-1280.png` | The Add a page editor with the page banner |
| `images/admin-page-unpublished-1280.png` | A page not in the website menu yet |
| `images/admin-page-block-1280.png` | A page body with Add to the page |
| `images/admin-page-remove-1280.png` | The Remove page confirmation |
| `images/admin-publish-confirm-1280.png` | The Publish your changes? box |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:20 | Welcome | Title; a banner and body blocks |
| 00:20-00:37 | Your pages | Site tree; Add a page |
| 00:37-01:13 | Add a page | Title, photo, Show this page in the website menu, Create page |
| 01:13-01:36 | Build the body | Add to the page, order, Save page |
| 01:36-01:48 | Remove a page | Remove page, confirm |
| 01:48-02:01 | Publish | Publish the draft |
| 02:01-02:17 | In short | Recap, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/24-manage-website-pages
node tools/video-audio/generate-audio.mjs docs/videos/journeys/24-manage-website-pages --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/24-manage-website-pages
node tools/video-build/build-video.mjs docs/videos/journeys/24-manage-website-pages --check
node tools/video-build/build-video.mjs docs/videos/journeys/24-manage-website-pages
```

The audio uses the default free edge-tts narrator voice; setup is in the
header of `tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.

