# 04 · Change the home page, block by block

> **Runtime:** about 5 min 41 s · **Audience:** co-op office staff · **Prerequisites:** an office account; [video 02](../02-change-the-home-page-photo/README.md) for photos

**Video:** [04-change-the-home-page-block-by-block.mp4](04-change-the-home-page-block-by-block.mp4) · [Slides](slides.html) · **Audio:** [04-change-the-home-page-block-by-block.mp3](04-change-the-home-page-block-by-block.mp3) · [Transcript](script.md)

Third of four videos on changing the public website from the office app.

## Why this video exists

Staff need to know which card on the Website screen changes which part of
the home page. This video walks down the home page from the Hero to Visit or
apply, shows each part as visitors see it, and names the boxes in its form.
It also says which parts come from elsewhere: events from published notices
in Documents, and the people under Meet the board from Board.

## Learning objectives

By the end, the viewer can:

- Match each Home page card on the Website screen to its part of the home page.
- Tell which boxes are optional and which must be filled in.
- Edit figures, value cards, gallery photos and sizes, checklists, the quotation and the visit details.
- Say where the event cards and the board members are changed instead.

## Key questions

| Question | What a strong answer includes |
| --- | --- |
| In what order are the Home page cards? | The order of the home page, Hero first, Visit or apply last |
| What does "(optional)" mean? | It can be left empty, and then nothing shows |
| How is a checklist typed? | One item per line; each line is one tick |
| Where do events and board members come from? | Published notices in Documents; the Board screen |

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-website-home-1280.png` | The Home page cards on the Website screen |
| `images/editor-hero-1280.png` | The Edit Hero form |
| `images/public-hero-1280.png` … `images/public-visit-1280.png` | Each part of the public home page |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from `images/shots.json`. The mocks have
an editor only for the Hero and the Header, so each other block's fields are
listed on its slide from
`frontend/projects/admin/src/app/features/website/content-blocks.ts`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:29 | Welcome | Title; every part works the same way |
| 00:29-01:09 | The Website list | Same order as the page; optional and required boxes; lists |
| 01:09-01:48 | Hero | Headings, badge, two buttons, photo |
| 01:48-02:17 | At a glance | Figures and what they count |
| 02:17-02:42 | Who we are | Introduction and value cards with three pictures |
| 02:42-03:13 | A look around | Photos, captions, Wide, Tall and Small |
| 03:13-03:36 | Our building and community | Rows and one-item-per-line checklists |
| 03:36-04:07 | What's on | Words around the events; events from Documents |
| 04:07-04:27 | Meet the board | Heading and title; people from Board |
| 04:27-04:54 | A word from a member | Quotation, who said it, photo; ask first |
| 04:54-05:14 | Visit or apply | Phone, office hours, button |
| 05:14-05:41 | In short | Recap, next video |

## Demo commands

From the repository root:

```sh
python tools/video-build/capture-mocks.py docs/videos/04-change-the-home-page-block-by-block
node tools/video-audio/generate-audio.mjs docs/videos/04-change-the-home-page-block-by-block --engine kokoro
node tools/video-build/build-video.mjs docs/videos/04-change-the-home-page-block-by-block --check
node tools/video-build/build-video.mjs docs/videos/04-change-the-home-page-block-by-block
```

The narration uses the Kokoro-82M voice `af_heart` from Hugging Face at
speed 0.8, as in [video 02](../02-change-the-home-page-photo/README.md).

## Pitfalls

- Mocks show design screens, not the running app. Recapture the screenshots when a mock changes.
- The landing crops use fixed scroll offsets; recheck them if the home page mock's layout changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.

## References

- `frontend/projects/admin/src/app/features/website/content-blocks.ts`
- `frontend/projects/public/src/app/pages/landing/` (the home page)
