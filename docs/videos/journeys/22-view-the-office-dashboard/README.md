# Journey 22 · View the office dashboard

> **Runtime:** about 1 min 34 s · **Audience:** co-op office staff · **Prerequisites:** an office account

**Video:** [22-view-the-office-dashboard.mp4](22-view-the-office-dashboard.mp4) · [Slides](slides.html) · **Audio:** [22-view-the-office-dashboard.mp3](22-view-the-office-dashboard.mp3) · [Transcript](script.md)

## Why this video exists

The dashboard is the first screen staff see. This video explains what each
part shows, so a glance tells them how the day looks.

## Learning objectives

By the end, the viewer can:

- Read the four metric cards.
- Follow recent maintenance requests and notices, and open View all requests.
- Use a quick action to start a common task.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-dashboard-1280.png` | Greeting and the four metric cards |
| `images/admin-dashboard-lower-1280.png` | Recent requests, Quick Actions and Recent Notices |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:14 | Welcome | Title; the co-op today in one place |
| 00:14-00:32 | At a glance | Greeting and four numbers |
| 00:32-00:57 | Requests and notices | Statuses, View all requests, Recent notices |
| 00:57-01:17 | Quick actions | Four quick actions; the side menu |
| 01:17-01:31 | In short | Recap, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/22-view-the-office-dashboard
node tools/video-audio/generate-audio.mjs docs/videos/journeys/22-view-the-office-dashboard --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/22-view-the-office-dashboard --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/22-view-the-office-dashboard --check
node tools/video-build/build-video.mjs docs/videos/journeys/22-view-the-office-dashboard
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.

