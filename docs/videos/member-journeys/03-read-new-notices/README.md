# Member journey 03 · Read new notices

> **Runtime:** 2 min 12 s · **Audience:** members, many of whom barely use the web · **Prerequisites:** signed in on the admin site as a member (ADR 0016)

**Video:** [03-read-new-notices.mp4](03-read-new-notices.mp4) · [Slides](slides.html) · **Audio:** [03-read-new-notices.mp3](03-read-new-notices.mp3) · [Transcript](script.md)

## Why this video exists

The office sends notices to everyone. This video shows a member, signed in on
the admin site, how to choose how notices reach them, where to find them, and
how to read one. Every screen is the member view, with the simpler five-item
menu: Dashboard, Maintenance, Documents, Messages and My profile (ADR 0016,
L2-REQ-112).

## Learning objectives

By the end, the viewer can:

- Recognise the member menu: Dashboard, Maintenance, Documents, Messages and My profile.
- Choose By email or By text message under Send me new notices on My profile.
- Find recent notices on the dashboard, and all notices under Documents, Notices.
- Open a notice, download a copy, and close it.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/member-profile-1280.png` | My profile for Oren Reed, unit 102, with Edit profile and the member menu |
| `images/member-profile-edit-1280.png` | Send me new notices: By email ticked |
| `images/member-profile-saved-1280.png` | Your profile is saved; New notices: By email |
| `images/member-dashboard-1280.png` | The five-item member menu; recent notices on the dashboard |
| `images/member-documents-1280.png` | Documents with All documents, Notices, Bylaws and Reports |
| `images/member-documents-notices-1280.png` | Only notices shown (Notices chosen with a `js` tweak) |
| `images/member-document-viewer-360.png`, `-1280.png` | The Autumn courtyard gathering notice open, with Download (the viewer is drawn over the member documents page with a `js` tweak) |

All screens are static design mocks under `docs/mocks/` (`admin-member-*`),
captured by `tools/video-build/capture-mocks.py` from the list in
`images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:33 | Welcome | Title; what a notice might be about; the simpler member menu |
| 00:33-01:18 | Choose how notices reach you | My profile, Edit profile, Send me new notices, Save changes |
| 01:18-01:39 | Find the notices | Recent notices on the dashboard; Documents, then Notices |
| 01:39-01:57 | Read a notice | Open, Download, Close |
| 01:57-02:12 | In short | Three steps, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/member-journeys/03-read-new-notices
node tools/video-audio/generate-audio.mjs docs/videos/member-journeys/03-read-new-notices --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/member-journeys/03-read-new-notices --engine kokoro
node tools/video-build/build-video.mjs docs/videos/member-journeys/03-read-new-notices --check
node tools/video-build/build-video.mjs docs/videos/member-journeys/03-read-new-notices
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- The member document viewer and the Notices filter are not separate mocks; `shots.json` draws them with `js` tweaks over `admin-member-documents/default.html`.
- Use only member mocks (`admin-member-*`); office mocks show the full menu.
- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
