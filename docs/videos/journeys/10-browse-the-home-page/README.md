# Journey 10 · Browse the home page

> **Runtime:** about 2 min 15 s · **Audience:** members, applicants and visitors; no account needed · **Prerequisites:** none

**Video:** [10-browse-the-home-page.mp4](10-browse-the-home-page.mp4) · [Slides](slides.html) · **Audio:** [10-browse-the-home-page.mp3](10-browse-the-home-page.mp3) · [Transcript](script.md)

## Why this video exists

The home page is the co-op's front door. The office chooses which sections it shows and in
what order. This video walks down the default page, section by section, so a visitor knows what
is there and how to reach the office.

## Learning objectives

By the end, the viewer can:

- Find the top links and Member sign in.
- Read the welcome, Book a visit and How to apply, and the numbers at a glance.
- Find Who we are, A look around, the building and community blocks, What's on, Meet the board and a word from a member.
- Find Visit or apply and Visit or write at the bottom.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-landing-1280.png` | The top of the home page, with the links |
| `images/public-landing-360.png` | The welcome on a phone |
| `images/public-landing-glance-1280.png` | 142 homes, 1997, 100% |
| `images/public-landing-about-1280.png` | Who we are |
| `images/public-landing-gallery-1280.png` | A look around |
| `images/public-landing-blocks-1280.png` | Our building, our community |
| `images/public-landing-events-1280.png` | What's on |
| `images/public-landing-board-1280.png` | Meet the board |
| `images/public-landing-quote-1280.png` | A word from a member |
| `images/public-landing-footer-1280.png` | Visit or apply, and Visit or write |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:20 | Welcome | Title; the office chooses the sections and their order |
| 00:20-00:52 | At the top | Name, links, Member sign in, the welcome, at a glance |
| 00:52-01:45 | Down the page | Who we are, A look around, blocks, What's on, the board, a word from a member |
| 01:45-01:59 | At the bottom | Visit or apply, Visit or write |
| 01:59-02:15 | In short | Summary, thank you |

## Demo commands

From the repository root:

```sh
python tools/video-build/capture-mocks.py docs/videos/journeys/10-browse-the-home-page
node tools/video-audio/generate-audio.mjs docs/videos/journeys/10-browse-the-home-page --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/10-browse-the-home-page
node tools/video-build/build-video.mjs docs/videos/journeys/10-browse-the-home-page --check
node tools/video-build/build-video.mjs docs/videos/journeys/10-browse-the-home-page
```

The audio uses the default edge-tts narrator voice; set `PYTHON` to the
interpreter that has `edge-tts` installed, and `EDGE_PATH` to Chrome or Edge if
the builder cannot find one.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- The scrolled shots use fixed `scroll` offsets in `images/shots.json`; check them after any change to the landing mock.
