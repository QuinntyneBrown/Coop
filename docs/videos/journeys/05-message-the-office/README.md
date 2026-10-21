# Journey 05 · Message the office

> **Runtime:** about 1 min 23 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** signed in on the admin site as a member (ADR 0016), with a conversation

**Video:** [05-message-the-office.mp4](05-message-the-office.mp4) · [Slides](slides.html) · **Audio:** [05-message-the-office.mp3](05-message-the-office.mp3) · [Transcript](script.md)

## Why this video exists

Messages let a member reach the office without a phone call. This video shows
a member, signed in on the admin site, how to read a conversation and send a
reply.

## Learning objectives

By the end, the viewer can:

- Open Messages and spot unread conversations by the 1 new label.
- Open a conversation and see who sent each message.
- Write a message and tap Send.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/member-messaging-360.png`, `-1280.png` | Oren Reed's conversation list; Fan repair visit marked 1 new |
| `images/member-messaging-chat-360.png` | Fan repair visit open, with Oren Reed and Dolores Nakamura, Write a message and Send |
| `images/member-messaging-typed-1280.png` | A reply typed in the message box (filled in with a `js` tweak) |
| `images/member-messaging-read-360.png` | The list with nothing new (the label removed with a `js` tweak) |

All screens are static design mocks under `docs/mocks/` (`admin-member-messaging`),
captured by `tools/video-build/capture-mocks.py` from the list in
`images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:16 | Welcome | Title; a simple way to talk |
| 00:16-00:40 | Your conversations | Messages list; 1 new |
| 00:40-01:15 | Read and reply | Open, write, send, caught up |
| 01:15-01:28 | In short | Three steps, thank you |

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
