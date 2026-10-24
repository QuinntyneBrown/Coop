# Journey 23 · Edit website content

> **Runtime:** about 2 min 37 s · **Audience:** co-op office staff · **Prerequisites:** an office account

**Video:** [23-edit-website-content.mp4](23-edit-website-content.mp4) · [Slides](slides.html) · **Audio:** [23-edit-website-content.mp3](23-edit-website-content.mp3) · [Transcript](script.md)

## Why this video exists

The public website is how many future members first meet the co-op. This
video shows staff how to change its words, sections, menu and photos in a
draft, preview it, and publish it when they are ready.


## Learning objectives

By the end, the viewer can:

- Open Website and find a part in the site tree.
- Edit a home page section and select Save to draft, or Undo changes.
- Hide, show and reorder sections, and change the board through Manage directors.
- Change the menu links in Menu and footer.
- Preview the draft, then Publish it or Discard changes.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-website-1280.png` | The Website site tree with unpublished changes |
| `images/admin-home-saved-1280.png` | The Home editor after Save to draft |
| `images/admin-home-hidden-1280.png` | A section with the Hidden badge |
| `images/admin-home-board-1280.png` | The Board of directors section and Manage directors |
| `images/admin-menu-footer-1280.png` | The Menu and footer editor with menu links |
| `images/public-preview-1280.png` | The public site with the preview banner |
| `images/admin-publish-confirm-1280.png` | The Publish your changes? box |
| `images/admin-discard-confirm-1280.png` | The Discard your unpublished changes? box |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:18 | Welcome | Title; draft first, then publish |
| 00:18-00:40 | The Website area | Site tree and the publish bar |
| 00:40-01:31 | Edit the home page | Sections, Save to draft, Hide section, Board of directors |
| 01:31-01:47 | Menu and footer | Move up, Move down, Remove, Add menu link |
| 01:47-02:22 | Preview and publish | Preview site, Publish, Discard changes |
| 02:22-02:37 | In short | Recap, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/23-edit-website-content
node tools/video-audio/generate-audio.mjs docs/videos/journeys/23-edit-website-content --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/23-edit-website-content
node tools/video-build/build-video.mjs docs/videos/journeys/23-edit-website-content --check
node tools/video-build/build-video.mjs docs/videos/journeys/23-edit-website-content
```

The audio uses the default free edge-tts narrator voice; setup is in the
header of `tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.

