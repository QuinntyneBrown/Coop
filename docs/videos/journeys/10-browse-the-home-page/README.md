# Journey 10 · Browse the home page

> **Runtime:** about 1 min 41 s · **Audience:** members, applicants and visitors; no account needed · **Prerequisites:** none

**Video:** [10-browse-the-home-page.mp4](10-browse-the-home-page.mp4) · [Slides](slides.html) · **Audio:** [10-browse-the-home-page.mp3](10-browse-the-home-page.mp3) · [Transcript](script.md)

## Why this video exists

The home page is the co-op's front door. This video walks down it, section by section, so a visitor knows what is there and how to reach the office.

## Learning objectives

By the end, the viewer can:

- Find the top links and Member sign in.
- Read the welcome, Book a visit and How to apply.
- Find Who we are, the building and community blocks, What's on and Meet the board.
- Find the phone, email and links at the bottom.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-landing-1280.png` | The top of the home page, with the links |
| `images/public-landing-360.png` | The welcome on a phone |
| `images/public-landing-about-1280.png` | Who we are |
| `images/public-landing-blocks-1280.png` | Our building, our community |
| `images/public-landing-events-1280.png` | What's on |
| `images/public-landing-board-1280.png` | Meet the board |
| `images/public-landing-footer-1280.png` | Visit or write, at the bottom |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:10 | Welcome | Title |
| 00:10-00:31 | At the top | Name, links, Member sign in, the welcome |
| 00:31-01:10 | Down the page | Who we are, blocks, What's on, the board |
| 01:10-01:20 | At the bottom | Phone, email, links |
| 01:20-01:36 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/10-browse-the-home-page
node tools/video-audio/generate-audio.mjs docs/videos/journeys/10-browse-the-home-page --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/10-browse-the-home-page --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/10-browse-the-home-page --check
node tools/video-build/build-video.mjs docs/videos/journeys/10-browse-the-home-page
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- `tools/video-build/capture-mocks.py` scrolls while the landing mocks use `scroll-behavior: smooth`, so its `scroll` shots can land mid-scroll. The scrolled shots here were captured with instant scrolling (`html{scroll-behavior:auto}`); check them after any recapture.
