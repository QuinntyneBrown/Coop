# Journey 22 · Admin sign in and register

> **Runtime:** about 1 min 46 s · **Audience:** co-op office staff · **Prerequisites:** an invitation token to register; an account to sign in

**Video:** [22-admin-sign-in-and-register.mp4](22-admin-sign-in-and-register.mp4) · [Slides](slides.html) · **Audio:** [22-admin-sign-in-and-register.mp3](22-admin-sign-in-and-register.mp3) · [Transcript](script.md)

## Why this video exists

Every office task starts at the door. This video shows staff how to sign in,
how to create an account with an invitation token, and where the forgot
password page is.

## Learning objectives

By the end, the viewer can:

- Sign in with a username and password, and recover from a wrong entry.
- Create an account with an invitation token.
- Find the Forgot Password page and know that the reset is not working yet.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-login-1280.png` | The sign in page, Welcome back |
| `images/admin-login-error-1280.png` | Invalid username or password |
| `images/admin-register-1280.png` | The Create account page |
| `images/admin-forgot-password-1280.png` | The Forgot Password page |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:16 | Welcome | Title; three ways in |
| 00:16-00:47 | Sign in | Username, password, Remember me, Sign In, error |
| 00:47-01:07 | Create an account | Invitation token, username, password twice, terms |
| 01:07-01:28 | Forgot password | Username field; reset is a stub, ask for help |
| 01:28-01:46 | In short | Recap, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/22-admin-sign-in-and-register
node tools/video-audio/generate-audio.mjs docs/videos/journeys/22-admin-sign-in-and-register --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/22-admin-sign-in-and-register --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/22-admin-sign-in-and-register --check
node tools/video-build/build-video.mjs docs/videos/journeys/22-admin-sign-in-and-register
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- The forgot password submit is a stub in the app; do not narrate a reset e-mail until one is implemented.
