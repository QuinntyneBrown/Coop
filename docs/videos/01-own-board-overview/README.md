# 01 · A website and a helping hand for OWN

> **Runtime:** about 5 min 2 s · **Audience:** the OWN board and members who barely use the web · **Prerequisites:** none

**Video:** [01-own-board-overview.mp4](01-own-board-overview.mp4) · [Slides](slides.html) · **Audio:** [01-own-board-overview.mp3](01-own-board-overview.mp3) · [Transcript](script.md)

## Why this video exists

The Coop platform is being built first for OWN. This video is shown at the board
meeting to pitch it. It uses big pictures and very few words, and every item says
plainly whether it works today or comes next.

## Learning objectives

By the end, the viewer can:

- Name the six things the platform is for.
- Tell which of them work today and which come next.
- Describe how the office edits the website in one Website area: change the draft, preview it, then publish.
- State the three small things the board is asked to do.

## Key questions

| Question | What a strong answer includes |
| --- | --- |
| What does the platform do for us? | A readable website, office-edited content, notices by email or text, repair requests, bigger text, profile photos |
| What works today? | All six: the home page and its sections (reorder, hide), pages built from a banner and blocks, the draft with Preview site, Publish and Discard changes, the board of directors list, notices (members choose email or text, the office ticks one box to send), repair requests (send with photos, receive, start and finish), 400% text, profile pictures |
| What comes next? | Connecting a real email and text message service; until then the API writes each message to its log and nothing leaves the system |
| What do you need from us? | Two members to try it, first three pages, a named admin |

## Code / assets on screen

| File | What to show |
| --- | --- |
| `images/public-landing-1280.png`, `-360.png` | The OWN home page, computer and phone (implemented in the public app) |
| `images/public-landing-tags-1280.png` | The same page with "Edited in admin" tags |
| `images/admin-website-1280.png` | The Website area: Home, Pages, Menu and footer, Board of directors, Photos, Look |
| `images/admin-page-editor-hidden-1280.png` | The Home editor's sections, with "A look around" marked Hidden |
| `images/admin-page-editor-page-1280.png`, `admin-page-editor-page-new-1280.png` | A page built from a banner and blocks; Add a page with "Show this page in the website menu" |
| `images/public-landing-preview-1280.png`, `admin-publish-confirm-1280.png` | The preview banner on the draft, and the "Publish your changes?" dialog |
| `images/admin-board-1280.png` | Board of directors: one list, add, edit, reorder and remove directors |
| `images/admin-documents-notices-1280.png`, `public-documents-notices-360.png` | Notices |
| `images/admin-member-profile-edit-360.png`, `admin-document-create-send-1280.png` | Notices by email or text: the member's "Send me new notices" choice, and the office's "Also send to members by email and text" box |
| `images/admin-member-maintenance-create-360.png`, `admin-maintenance-detail-started-1280.png`, `admin-member-maintenance-detail-photos-360.png` | Repair requests, with photos |
| `images/admin-member-profile-photo-preview-360.png`, `admin-maintenance-detail-submitter-photo-1280.png` | Profile photos: the member chooses and saves one on the admin site's member view, and the office sees it beside "Submitted by" |

All screens are static design mocks under `docs/mocks/`, captured by
`tools/video-build/capture-mocks.py` from the list in `images/shots.json`. The
home page is the OWN mock that the public app now implements; its sample facts (for
example the founding year and number of homes) are default copy to confirm with OWN
before the real site.

## Run sheet

| Time | Segment | Content |
| --- | --- | --- |
| 00:00-00:19 | Welcome | Title, "a website and a helping hand", for everyone |
| 00:19-00:31 | Six things | The six items and the two status chips |
| 00:31-00:49 | 1 Beautiful and easy to read | OWN home page, working today |
| 00:49-01:12 | 2 OWN runs it | Edited-in-admin tags |
| 01:12-01:27 | 2 Website | One area listing everything visitors see |
| 01:27-01:41 | 2 Home sections | Edit, move or hide a section; the Hidden badge |
| 01:41-02:00 | 2 Add a page | Banner, then blocks; "Show this page in the website menu" |
| 02:00-02:15 | 2 Draft and publish | Preview site, Publish, Discard changes |
| 02:15-02:29 | 2 Board of directors | One list, live after each election |
| 02:29-03:03 | 3 Notices | Working today, including the email or text choice and one-tick sending; a real email and text message service is the step left |
| 03:03-03:38 | 4 Repair requests | Send with photos, receive, start, finish and follow, working today |
| 03:38-03:57 | 5 Bigger words | Up to 400%, working today on every screen |
| 03:57-04:11 | 6 Your own photo | Add, change or remove; the office sees it beside her requests |
| 04:11-04:38 | In short | All six working today; a real email and text message service coming next |
| 04:38-05:02 | Our ask | Three small things, thank you |

## Demo commands

From the repository root, in PowerShell:

```powershell
python tools/video-build/capture-mocks.py docs/videos/01-own-board-overview
node tools/video-audio/generate-audio.mjs docs/videos/01-own-board-overview --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/01-own-board-overview
node tools/video-build/build-video.mjs docs/videos/01-own-board-overview --check
node tools/video-build/build-video.mjs docs/videos/01-own-board-overview
```

The committed audio uses the default edge-tts voice (set `PYTHON` to a Python with `edge-tts`). Earlier versions used the Kokoro voice `af_heart` (Kokoro-82M, Apache-2.0, from
`onnx-community/Kokoro-82M-v1.0-ONNX` on Hugging Face), read at speed 0.8 so it is calm
and unhurried at about 160 words a minute. It runs offline with no API key. One-time
setup is in the header of `tools/video-audio/generate-audio.mjs`. Other engines: Piper
(`--engine piper`, the earlier voice, which sounded more synthetic), the free edge-tts
neural voices (`--engine edge`, which answered 403 from the machine that built this
video), and the offline Windows voices (`--engine sapi`). `KOKORO_VOICE` and
`KOKORO_SPEED` change the voice and pace.

## Pitfalls

- Mocks show design screens, not the running app. Keep the "Working today" and
  "Coming next" chips honest as features land, and recapture screenshots when a mock
  changes.
- Slides leave the bottom of the frame free for burned-in captions.
- Cues must be copied exactly from `script.md`. Edit the script and the slide cue together.

## References

- [edge-tts](https://github.com/rany2/edge-tts)
- The `creating-videos` project skill in `.claude/skills/creating-videos/`
