# 02 · Change the home page photo

> **Runtime:** about 5 min 39 s · **Audience:** co-op office staff · **Prerequisites:** an office account

**Video:** [02-change-the-home-page-photo.mp4](02-change-the-home-page-photo.mp4) · [Slides](slides.html) · **Audio:** [02-change-the-home-page-photo.mp3](02-change-the-home-page-photo.mp3) · [Transcript](script.md)

First of four videos on changing the public website from the office app:
02 (this one), [03 · Change the header and footer](../03-change-the-header-and-footer/README.md),
[04 · Change the home page, block by block](../04-change-the-home-page-block-by-block/README.md) and
[05 · Add pages and update the board](../05-add-pages-and-update-the-board/README.md).

## Why this video exists

The big photo at the top of the home page is the first thing visitors see.
This video shows, one step at a time, how to swap it for a photo from the
Assets library or a newly uploaded one, and the same steps change every
other photo on the home page.

## Learning objectives

By the end, the viewer can:

- Find the Hero on the Website screen and open its editor.
- Pick a photo from the Assets library, or upload a new JPEG, PNG or WebP photo up to 10 MB.
- Write the new photo description the form asks for, save, and check the public home page.
- Change the photos in A look around, Our building and community, and A word from a member the same way.

## Key questions

| Question | What a strong answer includes |
| --- | --- |
| Where is the home page photo changed? | Website, Edit on the Hero card, Choose photo |
| Why is the description empty after picking a photo? | A new photo needs its own description; the form will not save without one |
| What can be uploaded? | JPEG, PNG or WebP, up to 10 MB; the upload is kept in the Assets library |
| When does the website change? | As soon as Save changes succeeds |

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-hero-1280.png`, `images/public-hero-after-1280.png` | The home page before and after |
| `images/admin-website-1280.png`, `images/admin-website-hero-1280.png` | The Website screen and the Hero card |
| `images/editor-hero-1280.png`, `images/editor-photo-1280.png` | The Edit Hero form and its Photo part |
| `images/picker-1280.png`, `images/picker-garden-1280.png` | The Choose a photo window |
| `images/editor-picked-1280.png`, `images/editor-described-1280.png` | The new photo with an empty, then a written description |
| `images/picker-upload-1280.png`, `images/picker-uploading-1280.png`, `images/picker-failed-1280.png` | Uploading a new photo, and a failed upload |
| `images/editor-invalid-1280.png`, `images/saved-1280.png` | The error summary, and the saved message |
| `images/admin-website-photos-1280.png` | The other blocks with photos |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`.
Where a mock has no matching state (the garden photo picked, the description
written, the after view of the home page), the shot's `js` sets it, and the
terracotta outlines point at the control to select.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:34 | Welcome | Title; five steps; the photo to change |
| 00:34-01:31 | Find the photo | Website, Hero card, Edit Hero, Choose photo |
| 01:31-02:09 | Pick a photo | Choose a photo window, pick, empty description |
| 02:09-03:16 | Upload a new photo | Upload, file types, Uploading, failed upload |
| 03:16-04:21 | Describe and save | Why describe, Save changes, error summary, saved |
| 04:21-04:42 | Check the website | Before and after; changing it back |
| 04:42-05:16 | Other photos | Gallery, building and community, member quote |
| 05:16-05:39 | In short | Recap, next video |

## Demo commands

From the repository root:

```sh
python tools/video-build/capture-mocks.py docs/videos/02-change-the-home-page-photo
node tools/video-audio/generate-audio.mjs docs/videos/02-change-the-home-page-photo --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/02-change-the-home-page-photo --engine kokoro
node tools/video-build/build-video.mjs docs/videos/02-change-the-home-page-photo --check
node tools/video-build/build-video.mjs docs/videos/02-change-the-home-page-photo
```

The narration uses the Kokoro-82M voice `af_heart` from Hugging Face
(Apache-2.0) at speed 0.8, the same voice as the other videos; setup is in
the header of `tools/video-audio/generate-audio.mjs`.

## Pitfalls

- Mocks show design screens, not the running app. Recapture the screenshots when a mock changes.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.

## References

- `frontend/projects/admin/src/app/features/website/` (Website screen, editor and photo picker)
- `docs/specs/L2.md` (L2-REQ-095 to L2-REQ-099)
