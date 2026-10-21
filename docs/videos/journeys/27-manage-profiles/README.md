# Journey 27 · Manage profiles

> **Runtime:** about 1 min 22 s · **Audience:** co-op office staff who look after the admin site · **Prerequisites:** an administrator account

**Video:** [27-manage-profiles.mp4](27-manage-profiles.mp4) · [Slides](slides.html) · **Audio:** [27-manage-profiles.mp3](27-manage-profiles.mp3) · [Transcript](script.md)

## Why this video exists

One person can hold a member profile and a board member profile. This video shows the office
how to select a profile, correct its details, and set a board title.

## Learning objectives

By the end, the viewer can:

- Open Profiles and select a profile.
- Change the name, phone or picture, and save.
- Set a Board title on a board member profile.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-profiles-1280.png` | My Profiles, with the active profile marked |
| `images/admin-profiles-edit-1280.png` | The Edit member profile form |
| `images/admin-profiles-edit-saved-1280.png` | The same form after Save changes, with Your profile is saved. |
| `images/admin-profiles-board-title-1280.png` | The board member profile with Treasurer in Board title |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.
The mocks have no typed Board title or saved note on Profiles, so `shots.json` adds
them with a short script before the screenshot.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:19 | Welcome | Title; one person, more than one profile |
| 00:19-00:57 | Edit a profile | Profiles, select, Save changes or Cancel |
| 00:57-01:08 | Set a board title | The Board title box |
| 01:08-01:22 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/27-manage-profiles
node tools/video-audio/generate-audio.mjs docs/videos/journeys/27-manage-profiles --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/27-manage-profiles --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/27-manage-profiles --check
node tools/video-build/build-video.mjs docs/videos/journeys/27-manage-profiles
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- The Board title box shows only on a board member profile.
