# 01 · A website and a helping hand for OWN

> **Runtime:** about 3 min 33 s · **Audience:** the OWN board and members who barely use the web · **Prerequisites:** none

**Video:** [01-own-board-overview.mp4](01-own-board-overview.mp4) · [Slides](slides.html) · **Audio:** [01-own-board-overview.mp3](01-own-board-overview.mp3) · [Transcript](script.md)

## Why this video exists

The Coop platform is being built first for OWN. This video is shown at the board
meeting to pitch it. It uses big pictures and very few words, and every item says
plainly whether it works today or comes next.

## Learning objectives

By the end, the viewer can:

- Name the six things the platform is for.
- Tell which of them work today and which come next.
- State the three small things the board is asked to do.

## Key questions

| Question | What a strong answer includes |
| --- | --- |
| What does the platform do for us? | A readable website, office-edited content, notices, repair requests, bigger text, profile photos |
| What works today? | Notices, repair requests (send with photos, receive, start and finish), colours, photo library, website pages the office adds and removes, the board list |
| What comes next? | New website design, 400% text, profile pictures |
| What do you need from us? | Two members to try it, first three pages, a named admin |

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-landing-1280.png`, `-360.png` | The OWN home page, computer and phone (implemented in the public app) |
| `images/public-landing-tags-1280.png` | The same page with "Edited in admin" tags |
| `images/admin-settings-1280.png`, `admin-assets-1280.png` | Colours and photo library (working today) |
| `images/admin-pages-1280.png` | The admin Pages screen: add, edit and remove website pages (working today) |
| `images/admin-board-1280.png` | The admin Board screen: add, edit, reorder and remove directors (working today) |
| `images/admin-documents-notices-1280.png`, `public-documents-notices-360.png` | Notices |
| `images/public-maintenance-create-360.png`, `admin-maintenance-detail-received-1280.png`, `admin-maintenance-detail-started-1280.png`, `public-maintenance-detail-photos-360.png` | Repair requests, with photos |
| `images/public-profile-edit-1280.png`, `-360.png` | Profile photo screen |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`. The
home page is the OWN mock that the public app now implements; its sample facts (for
example the founding year and number of homes) are default copy to confirm with OWN
before the real site.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:17 | Welcome | Title, "a website and a helping hand", for everyone |
| 00:17-00:30 | Six things | The six items and the two status chips |
| 00:30-00:48 | 1 Beautiful and easy to read | OWN home page, working today (the narration still says "not live yet"; re-synthesize the audio when the script is updated) |
| 00:48-01:26 | 2 OWN runs it | Edited-in-admin tags; colours, photos, pages and the board list today (the narration still says pages and the board list are coming next; re-synthesize the audio when the script is updated) |
| 01:26-01:44 | 3 Notices | Working today |
| 01:44-02:12 | 4 Repair requests | Send with photos, receive, start, finish and follow (the narration still says started, finished and photos come next; re-synthesize the audio when the script is updated) |
| 02:12-02:36 | 5 Bigger words | Up to 400%, coming next |
| 02:36-02:52 | 6 Your own photo | Coming next |
| 02:52-03:10 | In short | Working today (now including pages and the board list) and coming next |
| 03:10-03:33 | Our ask | Three small things, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/01-own-board-overview
node tools/video-audio/generate-audio.mjs docs/videos/01-own-board-overview --dry-run
$env:PIPER_PYTHON = ".cache/piper-venv/Scripts/python.exe"
node tools/video-audio/generate-audio.mjs docs/videos/01-own-board-overview --engine piper
node tools/video-build/build-video.mjs docs/videos/01-own-board-overview --check
node tools/video-build/build-video.mjs docs/videos/01-own-board-overview
```

The committed audio uses the Piper voice `en_US-lessac-high` from Hugging Face
(`rhasspy/piper-voices`), slowed with `PIPER_LENGTH_SCALE` 1.3. The free edge-tts
service answered 403 from the machine that built it. One-time Piper setup is in the
header of `tools/video-audio/generate-audio.mjs`. Other engines: drop `--engine piper`
for the edge-tts neural voices, or use `--engine sapi` for the offline Windows voices.

## Pitfalls

- Mocks show design screens, not the running app. Keep the "Coming next" chips honest
  as features land, and recapture screenshots when a mock changes.
- Slides leave the bottom of the frame free for burned-in captions.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.

## References

- [edge-tts](https://github.com/rany2/edge-tts)
- The `creating-videos` project skill in `.claude/skills/creating-videos/`
