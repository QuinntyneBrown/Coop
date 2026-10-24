# Journey 12 · Manage my profile

> **Runtime:** about 2 min 4 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a member account

**Video:** [12-manage-my-profile.mp4](12-manage-my-profile.mp4) · [Slides](slides.html) · **Audio:** [12-manage-my-profile.mp3](12-manage-my-profile.mp3) · [Transcript](script.md)

## Why this video exists

Members keep their own name, contact details, notice choice and picture up to date. This video shows
where each one lives on My profile, on the members' site, in plain words.

## Learning objectives

By the end, the viewer can:

- Open Profile (My profile on a computer) and change her details with Edit profile and Save changes.
- Add, save or remove a profile picture.
- Find her other profiles under My profiles, when she has more than one.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-member-profile-360.png`, `-1280.png` | My profile on a phone and on a computer |
| `images/admin-member-profile-edit-360.png` | The edit form with the notice choice |
| `images/admin-member-profile-saved-360.png` | “Your profile is saved.” |
| `images/admin-member-profile-photo-preview-360.png` | A photo preview with Save photo and Cancel |
| `images/admin-member-profile-photo-saved-360.png` | “Your photo is saved.” with Remove photo |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:18 | Welcome | Title; what the profile holds |
| 00:18-01:03 | Your details | Profile, Edit profile, notices, Save changes |
| 01:03-01:33 | Your picture | Preview, Save photo, Remove photo |
| 01:33-01:43 | Switch profile | My profiles |
| 01:43-02:04 | In short | Three steps, thank you |

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
