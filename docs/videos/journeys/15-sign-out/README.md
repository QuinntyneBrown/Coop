# Journey 15 · Sign out

> **Runtime:** about 56 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a member account

**Video:** [15-sign-out.mp4](15-sign-out.mp4) · [Slides](slides.html) · **Audio:** [15-sign-out.mp3](15-sign-out.mp3) · [Transcript](script.md)

## Why this video exists

Signing out keeps a member's details private on a shared computer. This video shows where Log Out is
and what she sees afterwards.

## Learning objectives

By the end, the viewer can:

- Find Log Out at the bottom of the Profile page.
- Recognise the Welcome back sign-in page afterwards.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-profile-360.png` | The Profile page scrolled to Log Out |
| `images/public-login-360.png` | The sign-in page, “Welcome back” |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:19 | Welcome | Title; why sign out |
| 00:19-00:32 | Sign out | Profile, Log Out |
| 00:32-00:45 | What happens next | The sign-in page |
| 00:45-00:56 | In short | Two steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/15-sign-out
node tools/video-audio/generate-audio.mjs docs/videos/journeys/15-sign-out --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/15-sign-out --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/15-sign-out --check
node tools/video-build/build-video.mjs docs/videos/journeys/15-sign-out
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- The video is shorter than a minute because the journey is two taps; padding it would not help.
- The profile page scrolls inside its own panel, so the `scroll` value in `shots.json` does not move it in `capture-mocks.py`. The scrolled phone shots were taken by scrolling the `.main-content` panel instead; re-running `capture-mocks.py` resets them to the top of the page.
