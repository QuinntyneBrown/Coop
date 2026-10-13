// Builds own-board-pitch.pptx from the same pictures and words as the video.
//
//   npm install pptxgenjs          (in any scratch folder, not in this repo)
//   NODE_PATH=<that folder>/node_modules node docs/pitch/build-pptx.cjs
//   PowerShell: $env:NODE_PATH = "<that folder>\node_modules"; node docs/pitch/build-pptx.cjs
//
// Needs the PNGs in docs/pitch/images (python docs/pitch/render-art.py) and in
// docs/videos/01-own-board-overview/images (python tools/video-build/capture-mocks.py ...).
// Slide notes carry the narration from docs/videos/01-own-board-overview/script.md.
const fs = require('node:fs');
const path = require('node:path');
const pptxgen = require('pptxgenjs');

// apply_theme.js ships with the Claude pptx skill and writes the theme colours.
const THEME_SCRIPT = process.env.PPTX_APPLY_THEME;
const ROOT = path.resolve(__dirname, '..', '..');
const SHOTS = path.join(ROOT, 'docs', 'videos', '01-own-board-overview', 'images');
const ART = path.join(__dirname, 'images');
const OUT = path.join(__dirname, 'own-board-pitch.pptx');

const THEME = {
  name: 'OWN Co-op',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '26211D', lt1: 'FFFFFF', dk2: '5E554D', lt2: 'FBF7F0',
    accent1: '9E4322', accent2: '3F6B4F', accent3: 'B27A00',
    accent4: '6B3F60', accent5: 'F3E7D3', accent6: 'E3EBE0',
    hlink: '9E4322', folHlink: '6B3F60',
  },
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 in
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = 'A website and a helping hand for OWN';
pres.author = 'Coop project';
const C = pres.SchemeColor;

// ---- narration for the speaker notes ----
const scriptText = fs.readFileSync(path.join(ROOT, 'docs', 'videos', '01-own-board-overview', 'script.md'), 'utf8');
const paragraphs = scriptText
  .split(/\r?\n\r?\n/)
  .map((p) => p.replace(/\r?\n/g, ' ').trim())
  .filter((p) => p && !p.startsWith('#') && !p.startsWith('[pause'));
const noteFor = (cue) => (cue ? paragraphs.find((p) => p.includes(cue)) || '' : paragraphs[0]);

// ---- layouts ----
pres.defineSlideMaster({
  title: 'Title',
  background: { color: C.background2 },
  objects: [],
});
pres.defineSlideMaster({
  title: 'Content',
  background: { color: C.background2 },
  slideNumber: { x: 9.1, y: 5.2, w: 0.5, h: 0.3, fontSize: 12, color: C.text2 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: C.text1, valign: 'middle', margin: 0 }, text: '' } },
  ],
});

// ---- helpers ----
const shot = (name) => path.join(SHOTS, name);
const art = (name) => path.join(ART, name);

const sections = new Set();
function ensureSection(title) {
  if (!sections.has(title)) {
    sections.add(title);
    pres.addSection({ title });
  }
}

function content(title, cue, section) {
  ensureSection(section);
  const slide = pres.addSlide({ masterName: 'Content', sectionTitle: section });
  slide.addText(title, { placeholder: 'title' });
  slide.addNotes(noteFor(cue));
  return slide;
}

function chip(slide, kind, text, x, y, w) {
  const now = kind === 'now';
  slide.addText(`${now ? '●' : '○'}  ${text}`, {
    x, y, w, h: 0.4, isTextBox: true, shape: pres.ShapeType.roundRect, rectRadius: 0.2,
    fontSize: 16, bold: true, align: 'center', valign: 'middle', margin: 0,
    color: now ? C.accent2 : C.text1,
    fill: { color: now ? C.accent6 : C.accent5 },
    line: { color: now ? C.accent2 : C.accent3, width: 2 },
    objectName: `Status: ${text}`,
  });
}

function picture(slide, file, x, y, h, aspect, alt) {
  slide.addImage({ path: file, x, y, w: h * aspect, h, altText: alt, objectName: alt, line: { color: C.accent5, width: 1 } });
}

function caption(slide, text, x, w, y = 4.8) {
  slide.addText(text, { x, y, w, h: 0.35, isTextBox: true, fontSize: 16, color: C.text2, align: 'center', margin: 0 });
}

function arrow(slide, x, y = 2.9) {
  slide.addText('→', { x, y, w: 0.5, h: 0.6, isTextBox: true, fontSize: 36, bold: true, color: C.accent1, align: 'center', margin: 0 });
}

// A computer screenshot (1280x800) and an optional phone screenshot (360x800) side by side.
function pair(slide, deskFile, deskAlt, deskCaption, phoneFile, phoneAlt, phoneCaption, withArrow) {
  const H = 3.0;
  const deskW = H * 1.6;
  const phoneW = H * 0.45;
  const gap = withArrow ? 0.9 : 0.6;
  const x0 = (10 - (deskW + gap + phoneW)) / 2;
  picture(slide, shot(deskFile), x0, 1.75, H, 1.6, deskAlt);
  caption(slide, deskCaption, x0, deskW);
  if (withArrow) arrow(slide, x0 + deskW + (gap - 0.5) / 2);
  const px = x0 + deskW + gap;
  picture(slide, shot(phoneFile), px, 1.75, H, 0.45, phoneAlt);
  caption(slide, phoneCaption, px - 0.5, phoneW + 1);
}

// ---- 1 title ----
{
  ensureSection('Welcome');
  const s = pres.addSlide({ masterName: 'Title', sectionTitle: 'Welcome' });
  s.addNotes(noteFor(null));
  s.addText('BOARD MEETING · CO-OP PLATFORM', { x: 0.6, y: 1.2, w: 4.6, h: 0.4, isTextBox: true, fontSize: 16, bold: true, color: C.accent1, margin: 0, charSpacing: 2 });
  s.addText('A website and a helping hand for OWN', { x: 0.6, y: 1.65, w: 4.6, h: 1.8, isTextBox: true, fontSize: 38, bold: true, color: C.text1, valign: 'top', margin: 0 });
  s.addText('Six things that matter to you', { x: 0.6, y: 3.6, w: 4.6, h: 0.6, isTextBox: true, fontSize: 22, color: C.text2, margin: 0 });
  s.addImage({ path: art('hero.png'), x: 5.5, y: 1.2, w: 4.0, h: 3.0, altText: 'A friendly apartment building with a garden and neighbours on a bench' });
}

// ---- 2 everyone ----
{
  const s = content('A website. And a helping hand', 'Some of us love the internet.', 'Welcome');
  s.addImage({ path: art('tea.png'), x: 1.0, y: 1.3, w: 3.6, h: 2.7, altText: 'Neighbours having tea together' });
  s.addImage({ path: art('choir.png'), x: 5.7, y: 1.3, w: 2.16, h: 2.7, altText: 'A choir singing together' });
  s.addText('Some of us love the internet.', { x: 0.7, y: 4.1, w: 4.2, h: 0.4, isTextBox: true, fontSize: 18, color: C.text2, align: 'center', margin: 0 });
  s.addText('Some of us are not so sure. That is fine.', { x: 5.0, y: 4.1, w: 3.6, h: 0.7, isTextBox: true, fontSize: 18, color: C.text2, align: 'center', margin: 0 });
  s.addText('This is for everyone.', { x: 0.5, y: 4.8, w: 9, h: 0.5, isTextBox: true, fontSize: 24, bold: true, color: C.text1, align: 'center', margin: 0 });
}

// ---- 3 six things ----
{
  const s = content('Six things that matter', 'Today we will show you six things.', 'Six things that matter');
  const items = [
    ['site', 'A beautiful, easy website'], ['pen', 'OWN runs it'], ['bell', 'Notices nobody misses'],
    ['wrench', 'Easy repair requests'], ['text', 'Bigger words'], ['face', 'Your own photo'],
  ];
  items.forEach(([icon, label], i) => {
    const x = 0.5 + (i % 3) * 3.05;
    const y = 1.35 + Math.floor(i / 3) * 1.45;
    s.addShape(pres.ShapeType.roundRect, { x, y, w: 2.85, h: 1.25, rectRadius: 0.12, fill: { color: C.background1 }, line: { color: C.accent5, width: 2 }, objectName: `Card: ${label}` });
    if (icon === 'text') {
      s.addText('Aa', { x: x + 0.15, y: y + 0.25, w: 0.8, h: 0.75, isTextBox: true, fontSize: 30, bold: true, color: C.accent1, margin: 0, align: 'center', valign: 'middle' });
    } else {
      s.addImage({ path: art(`icon-${icon}.png`), x: x + 0.15, y: y + 0.28, w: 0.7, h: 0.7, altText: `${label} icon` });
    }
    s.addText(label, { x: x + 1.0, y: y + 0.1, w: 1.75, h: 1.05, isTextBox: true, fontSize: 18, bold: true, color: C.text1, valign: 'middle', margin: 0 });
  });
  chip(s, 'now', 'Working today', 2.3, 4.5, 2.6);
  chip(s, 'next', 'Coming next', 5.1, 4.5, 2.6);
}

// ---- 4 care 1 ----
{
  const s = content('1 · Beautiful and easy to read', 'First, a website that is beautiful and easy to read.', 'Six things that matter');
  chip(s, 'next', 'Coming next · design drawn', 0.5, 1.2, 3.6);
  pair(s, 'public-landing-1280.png', 'The proposed OWN home page on a computer', 'On a computer', 'public-landing-360.png', 'The proposed OWN home page on a phone', 'On a phone', false);
}

// ---- 5 care 2 ----
{
  const s = content('2 · OWN runs it', 'Second, OWN runs it.', 'Six things that matter');
  const H = 3.0;
  picture(s, shot('public-landing-tags-1280.png'), (10 - H * 1.6) / 2, 1.5, H, 1.6, 'The home page with purple tags marking the parts the office can change');
  caption(s, 'Purple tags mark what the office can change', 1, 8, 4.6);
}

// ---- 6 care 2, working today ----
{
  const s = content('2 · OWN runs it', 'Today, the office can already change the colours', 'Six things that matter');
  chip(s, 'now', 'Working today', 0.5, 1.2, 2.6);
  const H = 2.6;
  picture(s, shot('admin-settings-1280.png'), 0.6, 1.85, H, 1.6, 'The colour settings screen');
  picture(s, shot('admin-assets-1280.png'), 5.1, 1.85, H, 1.6, 'The photo library screen');
  caption(s, 'Change the colours', 0.6, H * 1.6, 4.55);
  caption(s, 'Keep a library of photos', 5.1, H * 1.6, 4.55);
}

// ---- 7 care 2, coming next ----
{
  const s = content('2 · OWN runs it', 'Coming next is adding and removing whole pages', 'Six things that matter');
  chip(s, 'next', 'Coming next', 0.5, 1.2, 2.6);
  [['page-plus', 'Add and remove pages'], ['people', 'Edit the board of directors list'], ['ballot', 'New directors after each election']].forEach(([icon, label], i) => {
    const x = 0.5 + i * 3.05;
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.85, w: 2.85, h: 2.9, rectRadius: 0.12, fill: { color: C.background1 }, line: { color: C.accent5, width: 2 }, objectName: `Card: ${label}` });
    s.addImage({ path: art(`icon-${icon}.png`), x: x + 0.9, y: 2.1, w: 1.05, h: 1.05, altText: `${label} icon` });
    s.addText(label, { x: x + 0.15, y: 3.3, w: 2.55, h: 1.2, isTextBox: true, fontSize: 20, bold: true, color: C.text1, align: 'center', valign: 'top', margin: 0 });
  });
}

// ---- 8 care 3 ----
{
  const s = content('3 · Notices nobody misses', 'Third, notices that nobody misses.', 'Six things that matter');
  chip(s, 'now', 'Working today', 0.5, 1.2, 2.6);
  pair(s, 'admin-documents-notices-1280.png', 'The office screen listing notices', 'The office writes it once', 'public-documents-notices-360.png', "The members' notices page on a phone", 'Members see it', true);
}

// ---- 9 care 4, sending ----
{
  const s = content('4 · Easy repair requests', 'Fourth, a leaking tap should be easy to report.', 'Six things that matter');
  chip(s, 'now', 'Working today', 0.5, 1.2, 2.6);
  ['Tap “New request”', 'Type a few words', 'Send'].forEach((label, i) => {
    const y = 2.0 + i * 0.95;
    s.addText(String(i + 1), { x: 0.7, y, w: 0.7, h: 0.7, isTextBox: true, shape: pres.ShapeType.ellipse, fill: { color: C.accent1 }, color: C.background1, fontSize: 26, bold: true, align: 'center', valign: 'middle', margin: 0 });
    s.addText(label, { x: 1.65, y, w: 4.6, h: 0.7, isTextBox: true, fontSize: 26, color: C.text1, valign: 'middle', margin: 0 });
  });
  picture(s, shot('public-maintenance-create-360.png'), 7.0, 1.75, 3.0, 0.45, "The member's new request form on a phone");
  caption(s, "The member's form", 6.5, 2.35);
}

// ---- 10 care 4, new to done ----
{
  const s = content('4 · New to done', 'The office sees it at once,', 'Six things that matter');
  chip(s, 'now', 'Receiving works today', 0.5, 1.2, 3.1);
  chip(s, 'next', 'Started, finished, photos next', 3.8, 1.2, 4.0);
  pair(s, 'admin-maintenance-detail-received-1280.png', 'The office screen showing a received request', 'The office taps “Receive”', 'public-maintenance-360.png', "The member's list of requests on a phone", 'The member follows along', true);
}

// ---- 11 care 5 ----
{
  const s = content('5 · Bigger words, up to 400%', 'Fifth, bigger words.', 'Six things that matter');
  chip(s, 'next', 'Coming next', 0.5, 1.2, 2.6);
  pair(s, 'public-landing-1280.png', 'The home page at normal size', 'Normal size', 'public-landing-360.png', 'The home page in one column, as it looks at 400%', '400%: one easy column', true);
}

// ---- 12 care 6 ----
{
  const s = content('6 · Your own photo', 'Sixth, your own face.', 'Six things that matter');
  chip(s, 'next', 'Coming next', 0.5, 1.2, 2.6);
  pair(s, 'public-profile-edit-1280.png', 'The profile screen with a photo circle and camera button', 'The screen is drawn', 'public-profile-edit-360.png', 'The profile screen on a phone', 'On a phone', false);
}

// ---- 13 summary ----
{
  const s = content('In short', 'So, in short.', 'Today and next');
  [['now', 'Working today', ['Notices', 'Repair requests', 'Your colours', 'A photo library']],
   ['next', 'Coming next', ['The new website design', 'Pages and lists you edit', 'Bigger text', 'Profile pictures']]].forEach(([kind, label, list], i) => {
    const x = 0.5 + i * 4.6;
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.35, w: 4.4, h: 3.6, rectRadius: 0.12, fill: { color: C.background1 }, line: { color: C.accent5, width: 2 }, objectName: `Card: ${label}` });
    chip(s, kind, label, x + 0.25, 1.55, 2.6);
    s.addText(list.map((t, n) => ({ text: t, options: { bullet: true, breakLine: n < list.length - 1 } })), {
      x: x + 0.3, y: 2.2, w: 3.8, h: 2.5, isTextBox: true, fontSize: 22, color: C.text1, valign: 'top', paraSpaceAfter: 8, margin: 0,
    });
  });
}

// ---- 14 ask ----
{
  const s = content('Three small things', 'We ask three small things.', 'Our ask');
  ['Two members try notices and repair requests', 'Tell us the first three pages you want', 'Choose who in the office will be your admin'].forEach((label, i) => {
    const y = 1.6 + i * 1.1;
    s.addText(String(i + 1), { x: 0.8, y, w: 0.8, h: 0.8, isTextBox: true, shape: pres.ShapeType.ellipse, fill: { color: C.accent1 }, color: C.background1, fontSize: 30, bold: true, align: 'center', valign: 'middle', margin: 0 });
    s.addText(label, { x: 1.9, y, w: 7.6, h: 0.8, isTextBox: true, fontSize: 26, color: C.text1, valign: 'middle', margin: 0 });
  });
}

// ---- 15 thanks ----
{
  const s = content('Thank you', 'Thank you. We would be glad', 'Our ask');
  s.addText('Questions, however small, are welcome.', { x: 0.5, y: 2.0, w: 4.4, h: 1.5, isTextBox: true, fontSize: 28, color: C.text2, valign: 'top', margin: 0 });
  s.addImage({ path: art('garden.png'), x: 5.3, y: 1.4, w: 4.2, h: 3.15, altText: 'A rooftop garden' });
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  if (THEME_SCRIPT) {
    const { applyTheme } = require(THEME_SCRIPT);
    await applyTheme(OUT, THEME);
    console.log('theme applied');
  } else {
    console.log('PPTX_APPLY_THEME not set: theme colours are Office defaults until applyTheme runs');
  }
  console.log(`wrote ${path.relative(ROOT, OUT)}`);
})();
