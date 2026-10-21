# Journey 13 · Change my password

> **Runtime:** about 1 min 39 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a member account

**Video:** [13-change-my-password.mp4](13-change-my-password.mp4) · [Slides](slides.html) · **Audio:** [13-change-my-password.mp3](13-change-my-password.mp3) · [Transcript](script.md)

## Why this video exists

A member may need a new password and should not have to call the office for it. This video shows
the Change password page, opened from My profile on the members' site, and the two messages she may see.

## Learning objectives

By the end, the viewer can:

- Open Change password from My profile.
- Fill in the three password boxes and tap Change password.
- Understand the mismatch and wrong-current-password messages.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-member-profile-360.png` | My profile with the Change password button |
| `images/admin-change-password-360.png` | The three password boxes |
| `images/admin-change-password-filled-360.png` | The three boxes filled in |
| `images/admin-password-saved-360.png` | “Your password is changed.” |
| `images/admin-change-password-mismatch-360.png` | “The new passwords don't match” |
| `images/admin-change-password-error-360.png` | “We couldn't change your password.” |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.
The change-password mocks are drawn for an administrator, so `shots.json`
swaps the phone tab bar's More for the member's Profile tab and shows Oren
Reed's initials before each screenshot.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:17 | Welcome | Title; why change it |
| 00:17-00:54 | Change it | Profile, Change password, three boxes, Change password |
| 00:54-01:23 | If something is wrong | Mismatch and wrong current password |
| 01:23-01:39 | In short | Three steps, thank you |

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
