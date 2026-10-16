# Journey 19 · Manage users

> **Runtime:** about 1 min 45 s · **Audience:** co-op office staff · **Prerequisites:** an office (admin) account

**Video:** [19-manage-users.mp4](19-manage-users.mp4) · [Slides](slides.html) · **Audio:** [19-manage-users.mp3](19-manage-users.mp3) · [Transcript](script.md)

## Why this video exists

Staff keep the list of people who can sign in up to date. This video shows how to find,
add, edit and delete users.

## Learning objectives

By the end, the viewer can:

- Search the Users list and page through it.
- Add a user with Add User.
- Edit a user, and delete one after confirming.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-users-1280.png` | The Users list, page 1 |
| `images/admin-users-page-2-1280.png` | The Users list, page 2 |
| `images/admin-users-no-results-1280.png` | A search with no matches |
| `images/admin-user-create-1280.png` | The Add New User form |
| `images/admin-user-edit-1280.png` | The Edit User form |
| `images/admin-user-delete-1280.png` | The Confirm Delete box |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:17 | Welcome | Title; four everyday tasks |
| 00:17-00:54 | Find a user | Users list, paging, search |
| 00:54-01:28 | Add, edit and delete | Add User, edit, delete and confirm |
| 01:28-01:45 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/19-manage-users
node tools/video-audio/generate-audio.mjs docs/videos/journeys/19-manage-users --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/19-manage-users --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/19-manage-users --check
node tools/video-build/build-video.mjs docs/videos/journeys/19-manage-users
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`, and each must match only one paragraph. Edit the script and the slide cue together.
