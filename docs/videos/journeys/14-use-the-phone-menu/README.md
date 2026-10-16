# Journey 14 · Use the phone menu

> **Runtime:** about 1 min 15 s · **Audience:** visitors and members on a phone · **Prerequisites:** none

**Video:** [14-use-the-phone-menu.mp4](14-use-the-phone-menu.mp4) · [Slides](slides.html) · **Audio:** [14-use-the-phone-menu.mp3](14-use-the-phone-menu.mp3) · [Transcript](script.md)

## Why this video exists

On a phone the public site hides its links behind one Menu button. This video shows how to open it,
what is inside, and how to close it again.

## Learning objectives

By the end, the viewer can:

- Open the menu with Menu.
- Find the site links, Member sign in and Book a visit.
- Close the menu with Close or the Escape key.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-landing-360.png` | The home page on a phone with the Menu button |
| `images/public-landing-menu-360.png` | The open menu with Close |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:18 | Welcome | Title; why links are tucked away |
| 00:18-00:46 | Open the menu | Menu, the links, two buttons |
| 00:46-01:01 | Close the menu | Close, Escape |
| 01:01-01:14 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/14-use-the-phone-menu
node tools/video-audio/generate-audio.mjs docs/videos/journeys/14-use-the-phone-menu --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/14-use-the-phone-menu --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/14-use-the-phone-menu --check
node tools/video-build/build-video.mjs docs/videos/journeys/14-use-the-phone-menu
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
