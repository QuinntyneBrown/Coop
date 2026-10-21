# Journey 21 · Message members

> **Runtime:** about 1 min 30 s · **Audience:** co-op office staff · **Prerequisites:** an office (admin) account

**Video:** [21-message-members.mp4](21-message-members.mp4) · [Slides](slides.html) · **Audio:** [21-message-members.mp3](21-message-members.mp3) · [Transcript](script.md)

## Why this video exists

Messages keep the office and members talking. This video shows staff how to find or start
a conversation and send a message.

## Learning objectives

By the end, the viewer can:

- Find a conversation on the Messages page, or search for one.
- Open the New conversation box and enter the member's username as Recipient.
- Type a message and send it.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-messaging-1280.png` | The Messages page with one conversation |
| `images/admin-new-conversation-1280.png` | The New Conversation box |
| `images/admin-messaging-chat-1280.png` | An open conversation with the message box |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:16 | Welcome | Title; why messages matter |
| 00:16-00:51 | Find or start a conversation | Messages, search, New Conversation |
| 00:51-01:16 | Send a message | Open, type, send |
| 01:16-01:31 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/21-message-members
node tools/video-audio/generate-audio.mjs docs/videos/journeys/21-message-members --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/21-message-members --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/21-message-members --check
node tools/video-build/build-video.mjs docs/videos/journeys/21-message-members
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`, and each must match only one paragraph. Edit the script and the slide cue together.
