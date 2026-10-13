"""Render the SVG illustrations and pictograms used by the .pptx to PNG files in docs/pitch/images/.

Usage: python docs/pitch/render-art.py
Needs: python -m pip install playwright, python -m playwright install chromium.
"""
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
OUT = HERE / "images"
OWN = (HERE.parent / "mocks" / "assets" / "own").resolve()
TERRA = "#9e4322"

ILLUSTRATIONS = ["hero", "tea", "choir", "garden"]

STROKE = 'fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"'
ICONS = {
    "site": f'<rect x="10" y="16" width="76" height="64" rx="10"/><path d="M10 36h76"/><path d="M24 26h1M36 26h1"/>',
    "pen": '<path d="M20 76l6-20 36-36 14 14-36 36z"/><path d="M54 28l14 14"/>',
    "bell": '<path d="M48 14c-14 0-22 10-22 24v14l-8 12h60l-8-12V38c0-14-8-24-22-24z"/><path d="M40 80a8 8 0 0016 0"/>',
    "wrench": '<path d="M66 16a20 20 0 00-22 26L16 70l10 10 28-28a20 20 0 0026-22L66 42l-10-2-2-10z"/>',
    "face": '<rect x="12" y="12" width="72" height="72" rx="14"/><circle cx="48" cy="40" r="12"/><path d="M26 74c4-16 40-16 44 0"/>',
    "page-plus": '<path d="M24 10h32l16 16v60H24z"/><path d="M56 10v16h16"/><path d="M48 46v24M36 58h24"/>',
    "people": '<circle cx="34" cy="32" r="12"/><circle cx="66" cy="36" r="10"/><path d="M12 80c2-18 36-18 40 0"/><path d="M56 62c12-4 26 2 28 18"/>',
    "ballot": '<rect x="14" y="46" width="68" height="40" rx="8"/><path d="M34 60h28"/><path d="M32 40V12h32v28"/><path d="M40 26l6 6 10-12"/>',
}


def main() -> None:
    OUT.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1400, "height": 1000})
        # A blank page cannot load local files, so go through a temporary HTML file.
        with tempfile.TemporaryDirectory() as tmp:
            for name in ILLUSTRATIONS:
                holder = Path(tmp) / f"{name}.html"
                holder.write_text(
                    f'<body style="margin:0;background:transparent"><img id="a" src="{(OWN / (name + ".svg")).as_uri()}" style="width:1200px;display:block"></body>',
                    encoding="utf-8",
                )
                page.goto(holder.as_uri())
                page.wait_for_function("document.getElementById('a').complete")
                page.locator("#a").screenshot(path=str(OUT / f"{name}.png"), omit_background=True)
                print("wrote", name)
        page.set_viewport_size({"width": 400, "height": 400})
        for name, body in ICONS.items():
            page.set_content(
                f'<body style="margin:0;background:transparent"><svg id="a" width="256" height="256" viewBox="0 0 96 96" style="display:block;color:{TERRA}" {STROKE}>{body}</svg></body>'
            )
            page.locator("#a").screenshot(path=str(OUT / f"icon-{name}.png"), omit_background=True)
            print("wrote icon", name)
        browser.close()


if __name__ == "__main__":
    main()
