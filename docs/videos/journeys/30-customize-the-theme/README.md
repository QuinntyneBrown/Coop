# Journey 30 · Customize the theme

> **Runtime:** about 1 min 18 s · **Audience:** co-op office staff who look after the admin site · **Prerequisites:** an administrator account

**Video:** [30-customize-the-theme.mp4](30-customize-the-theme.mp4) · [Slides](slides.html) · **Audio:** [30-customize-the-theme.mp3](30-customize-the-theme.mp3) · [Transcript](script.md)

## Why this video exists

The office can change the app's colours. This video shows how to change them by scope,
check the preview, and save or reset them, keeping the text easy to read.

## Learning objectives

By the end, the viewer can:

- Open the Theme tab in Settings and choose a scope.
- Change a colour and check the Preview.
- Save the theme, or reset it to the default.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-settings-theme-1280.png` | The Theme tab: Scope, four colours, Preview, Reset to Default and Save Theme |
| `images/admin-settings-theme-changed-1280.png` | Primary Color changed to plum, #6B3F60 |
| `images/admin-settings-theme-preview-1280.png` | A close-up of the Preview with the plum header |
| `images/admin-settings-theme-saved-1280.png` | Theme saved successfully |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.
The mocks have no typed passwords, changed colours or saved notes, so
`shots.json` adds them with a short script before the screenshot.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:08 | Welcome | Title |
| 00:08-00:51 | Change the colours | Settings, Scope, four colours, Preview |
| 00:51-01:05 | Save or reset | Save Theme; Reset to Default |
| 01:05-01:18 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/30-customize-the-theme
node tools/video-audio/generate-audio.mjs docs/videos/journeys/30-customize-the-theme --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/30-customize-the-theme --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/30-customize-the-theme --check
node tools/video-build/build-video.mjs docs/videos/journeys/30-customize-the-theme
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- Every slide uses the one Theme tab shot; there is no mock of a changed or saved theme.
