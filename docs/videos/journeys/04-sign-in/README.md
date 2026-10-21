# Journey 04 · Sign in

> **Runtime:** about 1 min 49 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a member account

**Video:** [04-sign-in.mp4](04-sign-in.mp4) · [Slides](slides.html) · **Audio:** [04-sign-in.mp3](04-sign-in.mp3) · [Transcript](script.md)

## Why this video exists

Signing in is the door to every private page. Members now sign in on the admin site, reached from the Member sign in button on the public website. This video shows a member how to get there, how to sign in, what to do if it does not work, and what she sees once she is in.

## Learning objectives

By the end, the viewer can:

- Find Member sign in on the public website, or inside the Menu on a phone.
- Enter her username and password on the sign in page and tap Sign in.
- Recognise the We couldn't sign you in message and try again, or use Forgot password.
- Know that the menu shows only her own areas, and that old member links bring her to the sign in page.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-landing-1280.png` | The public website with the Member sign in button |
| `images/admin-login-360.png` | The sign in page, Welcome back |
| `images/admin-login-submitting-360.png` | The Sign in button greyed out while it works |
| `images/admin-login-error-360.png` | The We couldn't sign you in message |
| `images/admin-member-dashboard-360.png` | The member home page, Hello, Oren |
| `images/admin-member-dashboard-1280.png` | The member menu: Dashboard, Maintenance, Documents, Messages, My profile |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:15 | Welcome | Title; private, just for you |
| 00:15-01:01 | Sign in | Member sign in, Welcome back, Sign in, error |
| 01:01-01:38 | You are in | Home page; only your areas; old links |
| 01:38-01:51 | In short | Three steps, thank you |

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
