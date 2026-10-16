# Journey 31 · Change admin password

> **Runtime:** about 1 min 24 s · **Audience:** co-op office staff who look after the admin site · **Prerequisites:** an administrator account

**Video:** [31-change-admin-password.mp4](31-change-admin-password.mp4) · [Slides](slides.html) · **Audio:** [31-change-admin-password.mp3](31-change-admin-password.mp3) · [Transcript](script.md)

## Why this video exists

The office account can see members' details, so its password matters. This video shows how to change it, and what the page says when something is wrong.

## Learning objectives

By the end, the viewer can:

- Open Change Password from the profile.
- Type the current password and a new one twice, then Update Password.
- Recognise the Passwords do not match message, and use Cancel.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-change-password-1280.png` | The Change Password page with its three boxes |
| `images/admin-change-password-mismatch-1280.png` | The page showing Passwords do not match |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:18 | Welcome | Title; why the password matters |
| 00:18-00:50 | Change the password | Current, new, confirm, Update Password |
| 00:50-01:11 | If something is wrong | Passwords do not match; wrong current password; Cancel |
| 01:11-01:24 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/31-change-admin-password
node tools/video-audio/generate-audio.mjs docs/videos/journeys/31-change-admin-password --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/31-change-admin-password --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/31-change-admin-password --check
node tools/video-build/build-video.mjs docs/videos/journeys/31-change-admin-password
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- No mock shows the wrong-current-password message, so the slide shows the mismatch state only.
