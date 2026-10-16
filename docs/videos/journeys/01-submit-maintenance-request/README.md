# Journey 01 · Submit a maintenance request

> **Runtime:** about 1 min 45 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a member account

**Video:** [01-submit-maintenance-request.mp4](01-submit-maintenance-request.mp4) · [Slides](slides.html) · **Audio:** [01-submit-maintenance-request.mp3](01-submit-maintenance-request.mp3) · [Transcript](script.md)

## Why this video exists

Reporting a repair is the member journey with the most value. This video walks a
member through it, step by step, in plain words.

## Learning objectives

By the end, the viewer can:

- Find the Requests page and open the Create Request form.
- Fill in a request and, if she likes, add photos.
- Tell that her request was sent and that the office sees it.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-maintenance-360.png` | The member's Requests page on a phone |
| `images/public-maintenance-create-360.png` | The empty Create New Request form |
| `images/public-maintenance-create-filled-360.png` | The form filled in, before any photo |
| `images/public-maintenance-create-photos-1280.png` | The form with a photo chosen |
| `images/public-maintenance-create-sending-1280.png` | The button showing "Sending…" |
| `images/public-maintenance-new-360.png` | Water under the kitchen sink on the list, marked New |
| `images/admin-maintenance-detail-new-1280.png` | The office's view of Water under the kitchen sink, with Receive |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.
The mocks have no state for a request the member has just sent, so
`shots.json` adds Water under the kitchen sink to the list and the office
view with a short script before the screenshot.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:17 | Welcome | Title; telling the office should be easy |
| 00:17-01:10 | Send a request | Requests, Create Request, fill in, photos, Submit |
| 01:10-01:30 | What happens next | Marked New; the office sees it and taps Receive |
| 01:30-01:45 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/01-submit-maintenance-request
node tools/video-audio/generate-audio.mjs docs/videos/journeys/01-submit-maintenance-request --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/01-submit-maintenance-request --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/01-submit-maintenance-request --check
node tools/video-build/build-video.mjs docs/videos/journeys/01-submit-maintenance-request
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
