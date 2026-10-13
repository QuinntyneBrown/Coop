# OWN board pitch

Picture-first material for pitching the Coop platform to the OWN board. Every item
carries a plain "Working today" or "Coming next" chip, so nothing unbuilt is presented
as live. Screens are design mocks with made-up sample names.

| File | Use |
| --- | --- |
| [own-board-pitch.html](own-board-pitch.html) | Scrollable pitch page for a laptop or projector. Reflows to one column at 400% zoom. Includes the video. |
| [own-board-handout.html](own-board-handout.html) | One letter-size page. Open in Edge and print or save as PDF. |
| [own-board-pitch.pptx](own-board-pitch.pptx) | 15 slides matching the video, with the narration in the speaker notes. |
| [../videos/01-own-board-overview/](../videos/01-own-board-overview/README.md) | The narrated video, transcript and screenshots all three reuse. |

## Regenerate

Screenshots come from the mocks, so rerun them first when a mock changes.

```powershell
python tools/video-build/capture-mocks.py docs/videos/01-own-board-overview
python docs/pitch/render-art.py

# pptx: install pptxgenjs in any scratch folder, then
$env:NODE_PATH = "<scratch>\node_modules"
$env:PPTX_APPLY_THEME = "<path to the pptx skill>\scripts\apply_theme.js"
node docs/pitch/build-pptx.cjs
```

The HTML files are hand-written and need no build step.
