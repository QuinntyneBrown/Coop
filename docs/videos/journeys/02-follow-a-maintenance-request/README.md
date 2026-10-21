# Journey 02 · Follow a maintenance request

> **Runtime:** about 1 min 45 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a member account with at least one request

**Video:** [02-follow-a-maintenance-request.mp4](02-follow-a-maintenance-request.mp4) · [Slides](slides.html) · **Audio:** [02-follow-a-maintenance-request.mp3](02-follow-a-maintenance-request.mp3) · [Transcript](script.md)

## Why this video exists

After a member reports a repair, she wants to know how it is going. This video shows where to look, how to read the labels, and how to talk with the office about a request.

## Learning objectives

By the end, the viewer can:

- Find her requests and read the New, Received, Started and Completed labels.
- Use the All, New, Received, Started and Completed buttons to show only some requests.
- Open a request, read the comments, reply, and add a photo.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/member-maintenance-360.png` | The Requests page on a phone (admin site, member view) |
| `images/member-maintenance-completed-360.png` | The list showing only Completed requests |
| `images/member-maintenance-detail-1280.png` | An open request beside the list |
| `images/member-maintenance-comments-1280.png` | The request's comments, with Add a comment and Send |
| `images/member-maintenance-detail-photos-1280.png` | The open request with a photo and Add a photo |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.
Members sign in on the admin site and see only the member areas (ADR 0016),
so the screens come from the `admin-member-maintenance` mocks. The mocks have
no filtered state, so `shots.json` selects Completed and hides the other
request with a short script before the screenshot. On a phone the open request
sits below the list, so the open-request shots are taken at computer width.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:15 | Welcome | Title; it is all in one place |
| 00:15-00:51 | Check the status | Labels; filter buttons |
| 00:51-01:18 | Open a request | Open, read comments, reply |
| 01:18-01:29 | Photos | Photos and Add a photo |
| 01:29-01:45 | In short | Three steps, thank you |

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
