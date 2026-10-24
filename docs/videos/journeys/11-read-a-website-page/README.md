# Journey 11 · Read a website page

> **Runtime:** about 1 min 46 s · **Audience:** members, applicants and visitors; no account needed · **Prerequisites:** none

**Video:** [11-read-a-website-page.mp4](11-read-a-website-page.mp4) · [Slides](slides.html) · **Audio:** [11-read-a-website-page.mp3](11-read-a-website-page.mp3) · [Transcript](script.md)

## Why this video exists

The office builds pages such as How to apply from a banner and short blocks, and chooses which
pages are listed in the website menu. This video shows a visitor how to open one, read it, get back
home, and what the notes mean when a page is missing or cannot load.

## Learning objectives

By the end, the viewer can:

- Open the menu on a phone and close it again.
- Open a page, see its banner, and see it marked in the menu.
- Scroll to read the blocks, and tap Home to go back.
- Know what “We can't find that page” and “Something went wrong” mean.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-landing-360.png` | The top of the home page on a phone, with Menu |
| `images/public-landing-menu-360.png` | The menu open on a phone |
| `images/public-page-360.png` | The How to apply page and its banner on a phone |
| `images/public-page-steps-1280.png` | Who can apply, What happens next, Need a hand |
| `images/public-page-not-found-1280.png` | We can't find that page |
| `images/public-page-error-1280.png` | Something went wrong, with Try again |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:11 | Welcome | Title |
| 00:11-01:10 | Open a page | Menu, Close, How to apply, the banner, the blocks, Home |
| 01:10-01:34 | If a page is missing | Taken down or not yet published; Something went wrong |
| 01:34-01:46 | In short | Summary, thank you |

## Demo commands

From the repository root:

```sh
python tools/video-build/capture-mocks.py docs/videos/journeys/11-read-a-website-page
node tools/video-audio/generate-audio.mjs docs/videos/journeys/11-read-a-website-page --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/11-read-a-website-page
node tools/video-build/build-video.mjs docs/videos/journeys/11-read-a-website-page --check
node tools/video-build/build-video.mjs docs/videos/journeys/11-read-a-website-page
```

The audio uses the default edge-tts narrator voice; set `PYTHON` to the
interpreter that has `edge-tts` installed, and `EDGE_PATH` to Chrome or Edge if
the builder cannot find one.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- An unpublished page shows the not-found note to visitors; only the office's preview shows it.
