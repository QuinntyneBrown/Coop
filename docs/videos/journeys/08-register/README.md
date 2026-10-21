# Journey 08 · Register

> **Runtime:** about 1 min 48 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** an invitation code from the office

**Video:** [08-register.mp4](08-register.mp4) · [Slides](slides.html) · **Audio:** [08-register.mp3](08-register.mp3) · [Transcript](script.md)

## Why this video exists

A new member needs an account before anything else. Members now register on the admin site, from the Create an account link on the sign in page. This video walks through the Create your account page, box by box, and what the notes mean.

## Learning objectives

By the end, the viewer can:

- Have the invitation code ready, and reach Create an account from Member sign in.
- Fill in Invitation code, Username, Password and Confirm password, and accept the terms.
- Tap Create account and recognise the greyed-out button while it works.
- Fix each item the box at the top lists, and call the office if the code is wrong.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-login-360.png` | The sign in page with the Create an account link |
| `images/admin-register-360.png` | The empty Create your account page on a phone |
| `images/admin-register-submitting-360.png` | The filled-in form, its Create account button greyed out |
| `images/admin-register-mismatch-360.png` | Four things to fix, with a note under each box |
| `images/admin-register-error-360.png` | We couldn't create your account; check your invitation code |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:16 | Welcome | Title; the invitation code |
| 00:16-01:03 | Create your account | Create an account link, the four boxes, terms, Create account |
| 01:03-01:39 | If something is missing | Things to fix; wrong code, call the office |
| 01:39-01:55 | In short | Summary, thank you |

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
