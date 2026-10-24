# Member journey 09 · Onboard

> **Runtime:** about 1 min 38 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a newly created member account

**Video:** [09-onboard.mp4](09-onboard.mp4) · [Slides](slides.html) · **Audio:** [09-onboard.mp3](09-onboard.mp3) · [Transcript](script.md)

## Why this video exists

After registering on the admin site, a member is guided through three short set-up steps and then lands on her own home page. This video shows each step, and that the profile step can be skipped.

## Learning objectives

By the end, the viewer can:

- Start with Get started.
- Fill in the profile, or tap Skip for now to do it later.
- Choose a unit and tap Go to dashboard.
- Recognise her own home page when it opens.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-member-dashboard-1280.png` | The member's simpler menu: Dashboard, Maintenance, Documents, Messages, My profile (ADR 0016, L2-REQ-112) |
| `images/admin-onboarding-1280.png` | Step 1 of 3: Welcome to OWN Housing Co-op |
| `images/admin-onboarding-profile-1280.png` | Step 2 of 3: the profile form |
| `images/admin-onboarding-profile-buttons-360.png` | Next, Back and Skip for now on a phone |
| `images/admin-onboarding-unit-selected-1280.png` | Step 3 of 3: a unit chosen, Go to dashboard |
| `images/admin-member-dashboard-1280.png` | The member home page, Hello, Oren, with the five-item menu |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:27 | Welcome | Title; three steps; the simpler member menu |
| 00:27-01:10 | Three easy steps | Welcome, profile, Skip for now, unit |
| 01:10-01:25 | You are home | The member home page |
| 01:25-01:40 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/member-journeys/09-onboard
node tools/video-audio/generate-audio.mjs docs/videos/member-journeys/09-onboard --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/member-journeys/09-onboard --engine kokoro
node tools/video-build/build-video.mjs docs/videos/member-journeys/09-onboard --check
node tools/video-build/build-video.mjs docs/videos/member-journeys/09-onboard
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- Use only member-view mocks (`pages/admin-member-*`, `pages/admin-onboarding`); office mocks show the full menu.
