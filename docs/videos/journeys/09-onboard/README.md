# Journey 09 · Onboard

> **Runtime:** about 1 min 31 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a newly created member account

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
| `images/admin-onboarding-360.png` | Step 1 of 3: Welcome to OWN Housing Co-op |
| `images/admin-onboarding-profile-1280.png` | Step 2 of 3: the profile form |
| `images/admin-onboarding-profile-buttons-360.png` | Next, Back and Skip for now on a phone |
| `images/admin-onboarding-unit-selected-360.png` | Step 3 of 3: a unit chosen, Go to dashboard |
| `images/admin-member-dashboard-360.png` | The member home page, Hello, Oren |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:15 | Welcome | Title; three steps |
| 00:15-00:57 | Three easy steps | Welcome, profile, Skip for now, unit |
| 00:57-01:07 | You are home | The member home page |
| 01:07-01:22 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/09-onboard
node tools/video-audio/generate-audio.mjs docs/videos/journeys/09-onboard --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/09-onboard --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/09-onboard --check
node tools/video-build/build-video.mjs docs/videos/journeys/09-onboard
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
