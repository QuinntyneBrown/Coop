# Journey 02 · Follow a maintenance request

> **Runtime:** about 1 min 38 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a member account with at least one request

**Video:** [02-follow-a-maintenance-request.mp4](02-follow-a-maintenance-request.mp4) · [Slides](slides.html) · **Audio:** [02-follow-a-maintenance-request.mp3](02-follow-a-maintenance-request.mp3) · [Transcript](script.md)

## Why this video exists

After a member reports a repair, she wants to know how it is going. This video shows where to look, how to read the labels, and how to talk with the office about a request.

## Learning objectives

By the end, the viewer can:

- Find her requests and read the New, Received, Started and Done labels.
- Use the All, New, Started and Done buttons to show only some requests.
- Open a request, read the comments, reply, and add a photo.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-maintenance-360.png` | The Requests page with four labelled requests |
| `images/public-maintenance-started-360.png` | The list showing only Started requests |
| `images/public-maintenance-detail-360.png`, `-1280.png` | An open request with a comment |
| `images/public-maintenance-detail-photos-360.png` | The open request with two photos and Add a photo |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:15 | Welcome | Title; it is all in one place |
| 00:15-00:46 | Check the status | Labels; filter buttons |
| 00:46-01:10 | Open a request | Open, read comments, reply |
| 01:10-01:22 | Photos | Photos and Add a photo |
| 01:22-01:38 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/02-follow-a-maintenance-request
node tools/video-audio/generate-audio.mjs docs/videos/journeys/02-follow-a-maintenance-request --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/02-follow-a-maintenance-request --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/02-follow-a-maintenance-request --check
node tools/video-build/build-video.mjs docs/videos/journeys/02-follow-a-maintenance-request
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
