# Journey 18 · Invite members

> **Runtime:** about 1 min 34 s · **Audience:** co-op office staff · **Prerequisites:** an office (admin) account

**Video:** [18-invite-members.mp4](18-invite-members.mp4) · [Slides](slides.html) · **Audio:** [18-invite-members.mp3](18-invite-members.mp3) · [Transcript](script.md)

## Why this video exists

New members, board members and staff join through an invitation. This video shows staff
how to create one, pass on its code, and follow its status.

## Learning objectives

By the end, the viewer can:

- Open Create invitation from the Invitations page.
- Choose who they are joining as and an expiry date, create the invitation and copy its code.
- Read the Active, Used and Expired statuses.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-invitations-1280.png` | The Invitations list: Invitation code, For, Expires and Status |
| `images/admin-invitation-create-1280.png` | The Create invitation dialog: They are joining as, Expires, Cancel and Create invitation |
| `images/admin-invitation-created-1280.png` | The Invitation created dialog with the code, its copy button and Done |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:18 | Welcome | Title; who needs an invitation |
| 00:18-01:04 | Create an invitation | Invitations, Create invitation, joining as, date, copy, Done |
| 01:04-01:22 | Track the status | Active, Used, Expired |
| 01:22-01:39 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/18-invite-members
node tools/video-audio/generate-audio.mjs docs/videos/journeys/18-invite-members --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/18-invite-members --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/18-invite-members --check
node tools/video-build/build-video.mjs docs/videos/journeys/18-invite-members
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`, and each must match only one paragraph. Edit the script and the slide cue together.
