# Journey 12 · Manage my profile

> **Runtime:** about 1 min 55 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a member account

**Video:** [12-manage-my-profile.mp4](12-manage-my-profile.mp4) · [Slides](slides.html) · **Audio:** [12-manage-my-profile.mp3](12-manage-my-profile.mp3) · [Transcript](script.md)

## Why this video exists

Members keep their own name, contact details, notice choice and picture up to date. This video shows
where each one lives on the Profile page, in plain words.

## Learning objectives

By the end, the viewer can:

- Open Profile and change her details with Edit and Save Changes.
- Add, save or remove a profile picture.
- Switch to another profile, when she has more than one.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-profile-360.png` | The Profile page on a phone |
| `images/public-profile-edit-360.png` | The edit form |
| `images/public-profile-saved-360.png` | “Profile updated successfully!” |
| `images/public-profile-photo-preview-360.png` | A photo preview with Save photo and Cancel |
| `images/public-profile-photo-360.png` | “Your photo is saved.” with Remove photo |
| `images/public-profile-switcher-360.png` | The Switch Profile list open |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:17 | Welcome | Title; what the profile holds |
| 00:17-00:57 | Your details | Profile, Edit, notices, Save Changes |
| 00:57-01:26 | Your picture | Preview, Save photo, Remove photo |
| 01:26-01:37 | Switch profile | Choose another profile |
| 01:37-01:54 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/12-manage-my-profile
node tools/video-audio/generate-audio.mjs docs/videos/journeys/12-manage-my-profile --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/12-manage-my-profile --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/12-manage-my-profile --check
node tools/video-build/build-video.mjs docs/videos/journeys/12-manage-my-profile
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- The profile page scrolls inside its own panel, so the `scroll` value in `shots.json` does not move it in `capture-mocks.py`. The scrolled phone shots were taken by scrolling the `.main-content` panel instead; re-running `capture-mocks.py` resets them to the top of the page.
