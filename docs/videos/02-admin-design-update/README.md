# 02 · The admin site, on the Shelfie design

> **Runtime:** 2 min 48 s · **Audience:** board members and office staff · **Prerequisites:** none

**Video:** [02-admin-design-update.mp4](02-admin-design-update.mp4) · [Slides](slides.html) · **Audio:** [02-admin-design-update.mp3](02-admin-design-update.mp3) · [Transcript](script.md)

## Why this video exists

On 20 October 2026 the Angular admin moved onto the Shelfie-derived design system in `docs/design-system` ([ADR 0009](../../adr/0009-admin-loads-the-design-system.md)). This update shows the board what changed and what did not.

## Learning objectives

By the end, the viewer can:

- Recognise the new look: violet accent, rounded type, outline icons, pill buttons.
- Know the admin follows the device's light or dark setting.
- Know that copy and task flows are unchanged, and what is still to come.

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/admin-dashboard-light-1280.png` | Dashboard |
| `images/admin-roles-light-1280.png` | Menu with icons |
| `images/admin-maintenance-light-1280.png` | Status tags |
| `images/admin-users-dark-1280.png` | Dark theme |
| `images/admin-user-dialog-light-1280.png` | Native dialog |
| `images/admin-dashboard-light-360.png`, `images/admin-users-light-360.png` | Phone width |

Screenshots are captured from the admin mocks in `docs/mocks` with `python tools/video-build/capture-mocks.py docs/videos/02-admin-design-update` (see `images/shots.json`).

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:23 | Welcome | Real admin, not a drawing |
| 00:23-01:10 | The new look | Dashboard, menu, buttons and tags |
| 01:10-01:29 | Light or dark | Follows the device |
| 01:29-01:51 | Windows and forms | Native dialog |
| 01:51-02:05 | On a phone | One column |
| 02:05-02:47 | What did not change | Same copy, still to come |
| 02:47-02:52 | Thank you | Close |

## Demo commands

```
node tools/video-audio/generate-audio.mjs docs/videos/02-admin-design-update
node tools/video-build/build-video.mjs docs/videos/02-admin-design-update
```

## Pitfalls

- Audio and MP4 need internet access to Microsoft's read-aloud service, which was blocked when this was written.

## References

- [ADR 0009](../../adr/0009-admin-loads-the-design-system.md)
- [Design system README](../../design-system/README.md)
