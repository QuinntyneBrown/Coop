# Member journey 01 · Submit a maintenance request

> **Runtime:** about 1 min 59 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** a member account

**Video:** [01-submit-maintenance-request.mp4](01-submit-maintenance-request.mp4) · [Slides](slides.html) · **Audio:** [01-submit-maintenance-request.mp3](01-submit-maintenance-request.mp3) · [Transcript](script.md)

## Why this video exists

Reporting a repair is the member journey with the most value. This video walks a
member through it, step by step, in plain words, on the admin site as a member
sees it: a simpler menu with only Dashboard, Maintenance, Documents, Messages
and My profile (ADR 0016, L2-REQ-112).

## Learning objectives

By the end, the viewer can:

- Recognise her five-item menu after signing in.
- Choose Maintenance (Requests on a phone) and tap New request.
- Fill in a request and, if she likes, add photos.
- Tell that her request was sent and that the office sees it.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/member-dashboard-1280.png` | The member dashboard with the five-item menu |
| `images/member-maintenance-1280.png` | The member's Maintenance requests page on a computer |
| `images/member-maintenance-360.png` | The same page on a phone |
| `images/member-maintenance-create-1280.png` | The empty New maintenance request form |
| `images/member-maintenance-create-filled-1280.png` | The form filled in, before any photo |
| `images/member-maintenance-create-photos-1280.png` | The form with a photo chosen |
| `images/member-maintenance-create-sending-1280.png` | The button showing "Sending…" |
| `images/member-maintenance-new-1280.png` | Water under the kitchen sink on the list, marked New |

All screens are member-view design mocks (`pages/admin-member-*`,
`dialogs/admin-member-*`) under `docs/mocks/`, captured at 1280 wide so the
member menu shows, by `tools/video-build/capture-mocks.py` from
`images/shots.json`. No office mock is used. The mocks have no state for a
request the member has just sent, so `shots.json` fills in the form, renames
the chosen photo and adds Water under the kitchen sink to the list.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:33 | Welcome | Title; telling the office should be easy; the simpler member menu |
| 00:33-01:25 | Send a request | Maintenance, New request, fill in, photos, Send request |
| 01:25-01:44 | What happens next | Marked New; the office sees it and receives it |
| 01:44-01:59 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/member-journeys/01-submit-maintenance-request
node tools/video-audio/generate-audio.mjs docs/videos/member-journeys/01-submit-maintenance-request --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/member-journeys/01-submit-maintenance-request --engine kokoro
node tools/video-build/build-video.mjs docs/videos/member-journeys/01-submit-maintenance-request --check
node tools/video-build/build-video.mjs docs/videos/member-journeys/01-submit-maintenance-request
```

The audio uses the Kokoro voice, as the earlier journey videos do; setup is in
the header of `tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Use only member-view mocks; office mocks show the full menu.
- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
