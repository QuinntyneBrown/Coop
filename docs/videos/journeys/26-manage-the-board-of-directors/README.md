# Journey 26 · Manage the board of directors

> **Runtime:** about 2 min 4 s · **Audience:** co-op office staff who look after the admin site · **Prerequisites:** an administrator account

**Video:** [26-manage-the-board-of-directors.mp4](26-manage-the-board-of-directors.mp4) · [Slides](slides.html) · **Audio:** [26-manage-the-board-of-directors.mp3](26-manage-the-board-of-directors.mp3) · [Transcript](script.md)

## Why this video exists

The home page's "Meet the board" list is often the first thing a visitor reads about who runs
the co-op. The board has one source, the Board of directors list in the Website area, and the
home page reads only that list. This video shows the office how to keep it right, in plain words.

## Learning objectives

By the end, the viewer can:

- Open Website, then Board of directors, and know that saves are live without Publish.
- Add a director, choose a portrait with Choose photo, and edit a director.
- Change the order with Move up and Move down, and remove a director.
- Know that the section heading on the home page is edited under Home.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-board-1280.png` | The Board of directors list in the Website area with Move up, Move down, Edit and Remove |
| `images/admin-director-add-1280.png` | The Add director dialog with Name, Role on the board and Choose photo |
| `images/admin-photo-picker-1280.png` | The Choose a photo dialog |
| `images/admin-board-saved-1280.png` | The note “June Okonkwo-Baptiste” is now on the board list. |
| `images/admin-director-edit-1280.png` | The Edit director dialog with Remove photo |
| `images/admin-director-remove-1280.png` | The confirm dialog for removing Dolores Quintero |
| `images/public-landing-board-1280.png` | Meet the board on the public home page |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:23 | Welcome | Title; one list, shown on the home page |
| 00:23-01:21 | Add and edit | Website, Board of directors, Add director, Choose a photo, saved note, Edit |
| 01:21-01:49 | Order and remove | Move up and down; Remove director; heading edited under Home |
| 01:49-02:04 | In short | Summary, thank you |

## Demo commands

From the repository root:

```sh
python tools/video-build/capture-mocks.py docs/videos/journeys/26-manage-the-board-of-directors
node tools/video-audio/generate-audio.mjs docs/videos/journeys/26-manage-the-board-of-directors --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/journeys/26-manage-the-board-of-directors
node tools/video-build/build-video.mjs docs/videos/journeys/26-manage-the-board-of-directors --check
node tools/video-build/build-video.mjs docs/videos/journeys/26-manage-the-board-of-directors
```

The audio uses the default edge-tts narrator voice; set `PYTHON` to the
interpreter that has `edge-tts` installed, and `EDGE_PATH` to Chrome or Edge if
the builder cannot find one.

## Pitfalls

- Mocks show design screens, not the running app. Recapture screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.
- The photo picker mock is drawn over the Home editor; the dialog is the same one the director editor opens.
