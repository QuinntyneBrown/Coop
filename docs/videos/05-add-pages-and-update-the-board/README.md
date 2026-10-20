# 05 · Add pages and update the board

> **Runtime:** about 4 min 30 s · **Audience:** co-op office staff · **Prerequisites:** an office account; [video 02](../02-change-the-home-page-photo/README.md) for choosing photos

**Video:** [05-add-pages-and-update-the-board.mp4](05-add-pages-and-update-the-board.mp4) · [Slides](slides.html) · **Audio:** [05-add-pages-and-update-the-board.mp3](05-add-pages-and-update-the-board.mp3) · [Transcript](script.md)

Last of four videos on changing the public website from the office app.

## Why this video exists

Two parts of the public site are kept outside the Website screen: the pages
that join the website menu, and the directors under Meet the board. This
video shows how to add, change and remove both, completing the series.

## Learning objectives

By the end, the viewer can:

- Add a page with a title, an optional hero photo and description, and page text.
- Edit a page, change or remove its photo, and remove a page.
- Add, edit, reorder and remove directors, with or without a portrait.

## Key questions

| Question | What a strong answer includes |
| --- | --- |
| Where do new pages appear? | In the website menu, after the header's menu links, straight away |
| What is a page's web address? | /pages/ followed by a form of its title; two pages cannot share a title |
| What if a director has no portrait? | The website shows their initials |
| How is the board order changed? | Move up and Move down; the first director shows first |

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-page-1280.png` | A page in the public menu |
| `images/admin-pages-1280.png`, `images/page-new-1280.png`, `images/page-new-photo-1280.png`, `images/page-text-1280.png` | Pages and the New page form |
| `images/page-saved-1280.png`, `images/page-edit-1280.png`, `images/page-remove-1280.png` | Saved, Edit page, Remove page |
| `images/public-board-1280.png`, `images/admin-board-1280.png` | Meet the board, and the Board screen |
| `images/director-add-1280.png`, `images/board-saved-1280.png`, `images/board-order-1280.png`, `images/director-edit-1280.png`, `images/director-remove-1280.png` | Adding, ordering, editing and removing directors |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from `images/shots.json`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:17 | Welcome | Title; pages and the board |
| 00:17-00:59 | Your pages | Pages in the menu; the Pages screen |
| 00:59-01:54 | Add a page | Title, hero photo, page text, Save page |
| 01:54-02:28 | Change or remove a page | Edit page, Remove photo, Remove page |
| 02:28-03:22 | The board | Meet the board, Board screen, Add director, no portrait, saved |
| 03:22-03:55 | Order and changes | Move up and down, Edit, Remove director |
| 03:55-04:30 | In short | Recap, thank you |

## Demo commands

From the repository root:

```sh
python tools/video-build/capture-mocks.py docs/videos/05-add-pages-and-update-the-board
node tools/video-audio/generate-audio.mjs docs/videos/05-add-pages-and-update-the-board --engine kokoro
node tools/video-build/build-video.mjs docs/videos/05-add-pages-and-update-the-board --check
node tools/video-build/build-video.mjs docs/videos/05-add-pages-and-update-the-board
```

The narration uses the Kokoro-82M voice `af_heart` from Hugging Face at
speed 0.8, as in [video 02](../02-change-the-home-page-photo/README.md).

## Pitfalls

- Mocks show design screens, not the running app. Recapture the screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.

## References

- `frontend/projects/admin/src/app/features/pages/` and `features/board/`
- [Journey 25 · Manage website pages](../journeys/25-manage-website-pages/README.md) and [Journey 27 · Manage the board of directors](../journeys/27-manage-the-board-of-directors/README.md), the short versions
