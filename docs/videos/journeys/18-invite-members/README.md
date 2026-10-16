# Journey 18 · Invite members

> **Runtime:** about 1 min 32 s · **Audience:** co-op office staff · **Prerequisites:** an office (admin) account

**Video:** [18-invite-members.mp4](18-invite-members.mp4) · [Slides](slides.html) · **Audio:** [18-invite-members.mp3](18-invite-members.mp3) · [Transcript](script.md)

## Why this video exists

New members, board members and staff join through an invitation. This video shows staff
how to create one, pass on its token, and follow its status.

## Learning objectives

By the end, the viewer can:

- Open Create Invitation from the Invitations page.
- Choose a type and expiry date, create the invitation and copy its token.
- Read the Active, Used and Expired statuses.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-invitations-1280.png` | The Invitations list |
| `images/admin-invitation-create-1280.png` | The Create Invitation form |
| `images/admin-invitation-created-1280.png` | The Invitation Created box with Copy and Close |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:17 | Welcome | Title; who needs an invitation |
| 00:17-00:59 | Create an invitation | Invitations, Create Invitation, type, date, Copy |
| 00:59-01:17 | Track the status | Active, Used, Expired |
| 01:17-01:32 | In short | Three steps, thank you |

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
