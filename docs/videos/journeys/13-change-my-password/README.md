# Journey 13 · Change my password

> **Runtime:** about 1 min 30 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a member account

**Video:** [13-change-my-password.mp4](13-change-my-password.mp4) · [Slides](slides.html) · **Audio:** [13-change-my-password.mp3](13-change-my-password.mp3) · [Transcript](script.md)

## Why this video exists

A member may need a new password and should not have to call the office for it. This video shows
the Change Password form on the Profile page and the two messages she may see.

## Learning objectives

By the end, the viewer can:

- Open Change Password on the Profile page.
- Fill in the three password boxes and tap Update Password.
- Understand the mismatch and wrong-current-password messages.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-profile-360.png` | The Change Password button |
| `images/public-profile-password-360.png` | The three password boxes |
| `images/public-profile-password-invalid-360.png` | “New passwords do not match” |
| `images/public-profile-password-error-360.png` | “Failed to change password. Check your current password.” |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:16 | Welcome | Title; why change it |
| 00:16-00:44 | Change it | Profile, Change Password, three boxes, Update Password |
| 00:44-01:13 | If something is wrong | Mismatch and wrong current password |
| 01:13-01:28 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/13-change-my-password
node tools/video-audio/generate-audio.mjs docs/videos/journeys/13-change-my-password --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/13-change-my-password --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/13-change-my-password --check
node tools/video-build/build-video.mjs docs/videos/journeys/13-change-my-password
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- The mocks have no success state for a password change, so the video does not describe one.
- The profile page scrolls inside its own panel, so the `scroll` value in `shots.json` does not move it in `capture-mocks.py`. The scrolled phone shots were taken by scrolling the `.main-content` panel instead; re-running `capture-mocks.py` resets them to the top of the page.
