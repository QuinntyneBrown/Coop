# Journey 16 · Handle maintenance requests

> **Runtime:** about 1 min 50 s · **Audience:** co-op office staff · **Prerequisites:** an admin account

**Video:** [16-handle-maintenance-requests.mp4](16-handle-maintenance-requests.mp4) · [Slides](slides.html) · **Audio:** [16-handle-maintenance-requests.mp3](16-handle-maintenance-requests.mp3) · [Transcript](script.md)

## Why this video exists

The office moves each repair request from New to Completed so the member can follow it. This video
shows the filter tabs, the request detail and photos, the three action buttons and comments.

## Learning objectives

By the end, the viewer can:

- Filter requests by step and open one.
- Move a request along with Receive request, Start work and Finish work.
- Leave a comment on a request.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-maintenance-1280.png` | All requests |
| `images/admin-maintenance-new-1280.png` | Filtered by New |
| `images/admin-maintenance-detail-received-1280.png` | A request's details |
| `images/admin-maintenance-detail-photos-1280.png` | Attached photos |
| `images/admin-maintenance-detail-received-now-1280.png` | Kitchen tap leak after Receive request: Received, with Start work |
| `images/admin-maintenance-detail-started-1280.png` | Started, with Finish work |
| `images/admin-maintenance-detail-completed-1280.png` | Completed, no next step |
| `images/admin-maintenance-comments-1280.png` | The Comments tab |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:23 | Welcome | Title; the four steps |
| 00:23-01:01 | Find a request | Maintenance, tabs, details, photos |
| 01:01-01:25 | Move it along | Receive request, Start work, Finish work |
| 01:25-01:36 | Comments | Comments tab, Send |
| 01:36-01:50 | In short | Recap, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/16-handle-maintenance-requests
node tools/video-audio/generate-audio.mjs docs/videos/journeys/16-handle-maintenance-requests --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/16-handle-maintenance-requests --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/16-handle-maintenance-requests --check
node tools/video-build/build-video.mjs docs/videos/journeys/16-handle-maintenance-requests
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
