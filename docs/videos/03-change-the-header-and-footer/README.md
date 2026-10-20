# 03 · Change the header and footer

> **Runtime:** about 5 min 3 s · **Audience:** co-op office staff · **Prerequisites:** an office account; [video 02](../02-change-the-home-page-photo/README.md) helps

**Video:** [03-change-the-header-and-footer.mp4](03-change-the-header-and-footer.mp4) · [Slides](slides.html) · **Audio:** [03-change-the-header-and-footer.mp3](03-change-the-header-and-footer.mp3) · [Transcript](script.md)

Second of four videos on changing the public website from the office app.

## Why this video exists

The header and footer appear on every public page. This video shows the
office how to change the site name, the menu, the two header buttons, the
contact details, the footer links and the small print, and which addresses
a link accepts.

## Learning objectives

By the end, the viewer can:

- Open the Header and Footer editors from the Website screen.
- Change, reorder, remove and add menu, site and member links.
- Write an address the form accepts: a site path, an `https://` address, a `mailto:` address or a `tel:` number.
- Explain which header button shows only in the phone menu, and what an empty footer box does.

## Key questions

| Question | What a strong answer includes |
| --- | --- |
| Where are the header and footer changed? | Website, On every page, Edit on Header or Footer |
| Which addresses are accepted? | `/…` on this site, `http(s)://…`, `mailto:…`, `tel:…`; anything else shows a red message and does not save |
| Where does the Visit button show? | Only in the phone menu, below the links and the sign-in button |
| What happens to an empty footer box or list? | That line, or that column, does not show |

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-header-1280.png`, `images/public-footer-1280.png` | The header and footer on the public site |
| `images/admin-website-every-page-1280.png` | The Header and Footer cards |
| `images/header-name-1280.png`, `images/header-links-1280.png`, `images/header-add-1280.png` | Site name, menu links, Add menu link |
| `images/header-bad-address-1280.png` | An address without `https://` and its red message |
| `images/header-buttons-1280.png`, `images/phone-menu-360.png` | The sign-in and Visit buttons, and the phone menu |
| `images/footer-contact-1280.png`, `images/footer-links-1280.png`, `images/footer-small-print-1280.png` | The three parts of the footer |
| `images/saved-1280.png` | The saved message |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from `images/shots.json`. The mocks have
no Footer editor, so the footer fields are listed on the slides from
`frontend/projects/admin/src/app/features/website/content-blocks.ts`. The
red address message is added by the shot's `js`.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:29 | Welcome | Title; header and footer on every page |
| 00:29-00:47 | Open the header | Website, On every page, Edit Header |
| 00:47-01:10 | The name | Site name and subtitle |
| 01:10-01:51 | The menu links | Label and address; move, remove, add |
| 01:51-02:33 | Addresses | Four kinds of address; the red message |
| 02:33-03:16 | The buttons | Sign-in and Visit buttons; phone menu; save |
| 03:16-04:39 | The footer | Contact, two link lists, small print, empty boxes |
| 04:39-05:03 | In short | Recap, next video |

## Demo commands

From the repository root:

```sh
python tools/video-build/capture-mocks.py docs/videos/03-change-the-header-and-footer
node tools/video-audio/generate-audio.mjs docs/videos/03-change-the-header-and-footer --engine kokoro
node tools/video-build/build-video.mjs docs/videos/03-change-the-header-and-footer --check
node tools/video-build/build-video.mjs docs/videos/03-change-the-header-and-footer
```

The narration uses the Kokoro-82M voice `af_heart` from Hugging Face at
speed 0.8, as in [video 02](../02-change-the-home-page-photo/README.md).

## Pitfalls

- Mocks show design screens, not the running app. Recapture the screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.

## References

- `frontend/projects/admin/src/app/features/website/content-blocks.ts` and `safe-address.ts`
- `frontend/projects/public/src/app/layout/` (site header and footer)
