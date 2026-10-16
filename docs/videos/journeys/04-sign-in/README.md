# Journey 04 · Sign in

> **Runtime:** about 1 min 22 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a member account

**Video:** [04-sign-in.mp4](04-sign-in.mp4) · [Slides](slides.html) · **Audio:** [04-sign-in.mp3](04-sign-in.mp3) · [Transcript](script.md)

## Why this video exists

Signing in is the door to every private page. This video shows a member how to sign in, what to do if it does not work, and why private pages ask her to sign in first.

## Learning objectives

By the end, the viewer can:

- Enter her username and password and tap Sign In.
- Recognise the Invalid username or password message and try again, or use Forgot password.
- Know that private pages bring her to the sign in page first.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-login-360.png` | The sign in page, Welcome back |
| `images/public-login-submitting-360.png` | The button showing Signing in |
| `images/public-login-error-360.png` | The Invalid username or password message |
| `images/public-dashboard-360.png` | The member home page, Hello, Mira |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:13 | Welcome | Title; private, just for you |
| 00:13-00:46 | Sign in | Username, password, Sign In, error |
| 00:46-01:10 | You are in | Home page; private pages ask to sign in |
| 01:10-01:22 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/04-sign-in
node tools/video-audio/generate-audio.mjs docs/videos/journeys/04-sign-in --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/04-sign-in --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/04-sign-in --check
node tools/video-build/build-video.mjs docs/videos/journeys/04-sign-in
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
