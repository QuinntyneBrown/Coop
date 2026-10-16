# Journey 05 · Message the office

> **Runtime:** about 1 min 14 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a member account with a conversation

**Video:** [05-message-the-office.mp4](05-message-the-office.mp4) · [Slides](slides.html) · **Audio:** [05-message-the-office.mp3](05-message-the-office.mp3) · [Transcript](script.md)

## Why this video exists

Messages let a member reach the office and her neighbours without a phone call. This video shows how to read a conversation and send a reply.

## Learning objectives

By the end, the viewer can:

- Open Messages and spot unread conversations by the green number.
- Open a conversation and see who sent each message.
- Type a message and send it.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-messaging-360.png`, `-1280.png` | Conversation list with an unread count |
| `images/public-messaging-chat-360.png`, `-1280.png` | The open conversation with Type a message and send |
| `images/public-messaging-read-360.png` | The list with nothing unread |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:15 | Welcome | Title; a simple way to talk |
| 00:15-00:33 | Your conversations | Messages list; green number |
| 00:33-01:02 | Read and reply | Open, type, send, caught up |
| 01:02-01:14 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/05-message-the-office
node tools/video-audio/generate-audio.mjs docs/videos/journeys/05-message-the-office --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/05-message-the-office --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/05-message-the-office --check
node tools/video-build/build-video.mjs docs/videos/journeys/05-message-the-office
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
