# Journey 09 · Onboard

> **Runtime:** about 1 min 16 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a newly created member account

**Video:** [09-onboard.mp4](09-onboard.mp4) · [Slides](slides.html) · **Audio:** [09-onboard.mp3](09-onboard.mp3) · [Transcript](script.md)

## Why this video exists

After registering, a member is guided through four short set-up steps. This video shows each step, and that the profile step can be skipped.

## Learning objectives

By the end, the viewer can:

- Start with Get Started.
- Fill in the profile, or tap Skip to do it later.
- Choose a unit and tap Next.
- Finish with Go to Dashboard.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-onboarding-360.png` | Step 1 of 4: Welcome to Coop! |
| `images/public-onboarding-profile-1280.png` | Step 2 of 4: the profile form |
| `images/public-onboarding-profile-360.png` | Back, Next and Skip on a phone |
| `images/public-onboarding-unit-selected-360.png` | Step 3 of 4: a unit chosen |
| `images/public-onboarding-success-360.png` | Step 4 of 4: You're all set! |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:15 | Welcome | Title; four steps |
| 00:15-01:02 | Four easy steps | Welcome, profile, Skip, unit, all set |
| 01:02-01:16 | In short | Summary, thank you |

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
