# Journey 11 · Read a website page

> **Runtime:** about 1 min 32 s · **Audience:** members, applicants and visitors; no account needed · **Prerequisites:** none

**Video:** [11-read-a-website-page.mp4](11-read-a-website-page.mp4) · [Slides](slides.html) · **Audio:** [11-read-a-website-page.mp3](11-read-a-website-page.mp3) · [Transcript](script.md)

## Why this video exists

The office adds pages such as How to apply. This video shows how to open one from the menu, read it, and get back home.

## Learning objectives

By the end, the viewer can:

- Open the menu on a phone and close it again.
- Open a page and see it marked in the menu.
- Scroll to read, and tap Home to go back.
- Know what the "We can't find that page" note means.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-landing-360.png` | The top of the home page on a phone, with Menu |
| `images/public-landing-menu-360.png` | The menu open on a phone |
| `images/public-page-360.png` | The How to apply page on a phone |
| `images/public-page-steps-1280.png` | Who can apply, What happens next, Need a hand |
| `images/public-page-not-found-1280.png` | We can't find that page |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:12 | Welcome | Title |
| 00:12-00:58 | Open a page | Menu, tap a page, scroll, go back |
| 00:58-01:10 | If a page is missing | Not-found note |
| 01:10-01:22 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/11-read-a-website-page
node tools/video-audio/generate-audio.mjs docs/videos/journeys/11-read-a-website-page --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/11-read-a-website-page --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/11-read-a-website-page --check
node tools/video-build/build-video.mjs docs/videos/journeys/11-read-a-website-page
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- `tools/video-build/capture-mocks.py` scrolls while the landing mocks use `scroll-behavior: smooth`, so its `scroll` shots can land mid-scroll. The scrolled shots here were captured with instant scrolling (`html{scroll-behavior:auto}`); check them after any recapture.
