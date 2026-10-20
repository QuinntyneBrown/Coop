# Journey 17 · Send a notice to members

> **Runtime:** about 1 min 41 s · **Audience:** co-op office staff · **Prerequisites:** an office (admin) account

**Video:** [17-send-a-notice-to-members.mp4](17-send-a-notice-to-members.mp4) · [Slides](slides.html) · **Audio:** [17-send-a-notice-to-members.mp3](17-send-a-notice-to-members.mp3) · [Transcript](script.md)

## Why this video exists

Notices are how the office reaches every member at once. This video shows staff how to
publish a notice and send it by email and text to members who asked for notices.

## Learning objectives

By the end, the viewer can:

- Open the New document form from the Documents page.
- Write a notice and publish it with "Also send to members by email and text" ticked.
- Recognise the sent message, and press "Save document" again if sending failed.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-documents-1280.png` | The Documents page |
| `images/admin-document-create-1280.png` | The empty New document form |
| `images/admin-document-create-send-1280.png` | A published notice with the send box ticked |
| `images/admin-notice-sent-1280.png` | The published-and-sent message |
| `images/admin-document-create-send-error-1280.png` | The not-sent error, with "Save document" to try again |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:17 | Welcome | Title; a notice keeps everyone in the loop |
| 00:17-00:42 | Write the notice | Documents, New document, title, type, content |
| 00:42-01:26 | Publish and send | Published, send box, Save document, sent message, retry |
| 01:26-01:41 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/17-send-a-notice-to-members
node tools/video-audio/generate-audio.mjs docs/videos/journeys/17-send-a-notice-to-members --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/17-send-a-notice-to-members --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/17-send-a-notice-to-members --check
node tools/video-build/build-video.mjs docs/videos/journeys/17-send-a-notice-to-members
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`, and each must match only one paragraph. Edit the script and the slide cue together.
