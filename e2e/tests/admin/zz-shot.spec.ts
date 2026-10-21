import { test } from '../../fixtures/admin/api.fixture';
test('shot', async ({ authenticatedPage: p }) => {
  await p.setViewportSize({ width: 1280, height: 800 });
  for (const r of ['/board', '/pages']) {
    await p.goto(r); await p.waitForLoadState('networkidle'); await p.waitForTimeout(800);
    await p.screenshot({ path: 'C:/Users/quinn/AppData/Local/Temp/claude/C--projects-Coop/963ffe28-6d18-48f1-bc05-96c0738757e7/scratchpad/ob/app' + r.replace('/', '-') + '.png' });
  }
});
