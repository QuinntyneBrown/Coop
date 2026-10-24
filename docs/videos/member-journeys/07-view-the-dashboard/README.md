# Member journey 07 · View the dashboard

> **Runtime:** about 1 min 59 s (1:59) · **Audience:** members, many of whom barely use the web · **Prerequisites:** signed in on the admin site as a member (ADR 0016)

**Video:** [07-view-the-dashboard.mp4](07-view-the-dashboard.mp4) · [Slides](slides.html) · **Audio:** [07-view-the-dashboard.mp3](07-view-the-dashboard.mp3) · [Transcript](script.md)

## Why this video exists

The dashboard is the first page a member sees after signing in on the admin
site. This video shows what each part of it means, so it feels calm and
familiar.

## Learning objectives

By the end, the viewer can:

- Read the greeting and the three cards: Open requests, Unread messages and Documents.
- Read My recent maintenance requests and its statuses.
- Use View all requests, Quick actions, Recent notices and the menu on the left.
- Know that members see a simpler menu with five areas (ADR 0016, L2-REQ-112).
- Understand that zeros and "No recent requests" mean all is quiet.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/member-dashboard-top-1280.png` | Oren Reed's dashboard with the member menu (Dashboard, Maintenance, Documents, Messages, My profile) and the greeting |
| `images/member-dashboard-1280.png` | The dashboard on a computer: cards, My recent maintenance requests, View all requests, Quick actions, Recent notices |
| `images/member-dashboard-empty-1280.png` | The empty dashboard with the member menu: zeros and No recent requests |

All screens are static design mocks under `docs/mocks/` (`admin-member-dashboard`),
captured by `tools/video-build/capture-mocks.py` from the list in
`images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:28 | Welcome | Title; a calm place to start the day; the five-item member menu |
| 00:28-01:34 | Your overview | Greeting, cards, recent requests, View all requests, Quick actions, Recent notices, menu |
| 01:34-01:47 | When it is quiet | Zeros and No recent requests |
| 01:47-02:03 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/member-journeys/07-view-the-dashboard
node tools/video-audio/generate-audio.mjs docs/videos/member-journeys/07-view-the-dashboard --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/member-journeys/07-view-the-dashboard --engine kokoro
node tools/video-build/build-video.mjs docs/videos/member-journeys/07-view-the-dashboard --check
node tools/video-build/build-video.mjs docs/videos/member-journeys/07-view-the-dashboard
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- The mock lists only New and Completed requests; the narration names all four statuses.
