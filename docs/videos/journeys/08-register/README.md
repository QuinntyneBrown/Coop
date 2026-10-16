# Journey 08 · Register

> **Runtime:** about 1 min 35 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** an invitation token from the office

**Video:** [08-register.mp4](08-register.mp4) · [Slides](slides.html) · **Audio:** [08-register.mp3](08-register.mp3) · [Transcript](script.md)

## Why this video exists

A new member needs an account before anything else. This video walks through the Create account page, box by box, and what the red notes mean.

## Learning objectives

By the end, the viewer can:

- Have the invitation token ready.
- Fill in Invitation Token, Username, Password and Confirm Password, and accept the terms.
- Tap Create Account and recognise the Creating account state.
- Fix a box when a red note appears, and call the office if the token is wrong.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-register-360.png` | The empty Create account page on a phone |
| `images/public-register-submitting-360.png` | The filled-in form, its button showing Creating account... |
| `images/public-register-mismatch-360.png` | Red notes, including Passwords do not match |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:16 | Welcome | Title; the invitation token |
| 00:16-00:52 | Create your account | The four boxes, terms, Create Account |
| 00:52-01:18 | If something is missing | Red notes; wrong token, call the office |
| 01:18-01:35 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/08-register
node tools/video-audio/generate-audio.mjs docs/videos/journeys/08-register --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/08-register --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/08-register --check
node tools/video-build/build-video.mjs docs/videos/journeys/08-register
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
