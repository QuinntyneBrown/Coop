# Journey 26 · Manage the board of directors

> **Runtime:** about 1 min 35 s · **Audience:** co-op office staff who look after the admin site · **Prerequisites:** an administrator account

**Video:** [26-manage-the-board-of-directors.mp4](26-manage-the-board-of-directors.mp4) · [Slides](slides.html) · **Audio:** [26-manage-the-board-of-directors.mp3](26-manage-the-board-of-directors.mp3) · [Transcript](script.md)

## Why this video exists

The home page's "Meet the board" list is often the first thing a visitor reads about who runs
the co-op. This video shows the office how to keep it right, in plain words.

## Learning objectives

By the end, the viewer can:

- Open the Board page from the menu.
- Add a director, and edit one.
- Change the order with Move up and Move down, and remove a director.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-board-1280.png` | The Board of Directors list with Move up, Move down, Edit and Remove |
| `images/admin-director-add-1280.png` | The Add director form |
| `images/admin-director-edit-1280.png` | The Edit director form |
| `images/admin-director-remove-1280.png` | The confirm dialog for removing Dolores Quintero |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:19 | Welcome | Title; you choose who is shown and in what order |
| 00:19-01:03 | Add and edit | Board page, Add director, Edit |
| 01:03-01:22 | Order and remove | Move up and down; Remove director |
| 01:22-01:35 | In short | Summary, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/journeys/26-manage-the-board-of-directors
node tools/video-audio/generate-audio.mjs docs/videos/journeys/26-manage-the-board-of-directors --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/26-manage-the-board-of-directors --engine kokoro
node tools/video-build/build-video.mjs docs/videos/journeys/26-manage-the-board-of-directors --check
node tools/video-build/build-video.mjs docs/videos/journeys/26-manage-the-board-of-directors
```

The audio uses the same Kokoro voice (`af_heart`, speed 0.8) as
[video 01](../../01-own-board-overview/README.md); setup is in the header of
`tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- The photo address must come from the Assets library; journey 28 shows that page.
