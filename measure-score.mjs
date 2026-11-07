import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`http://127.0.0.1:${port}/?url=http://scores.test/test.mscz`)
  await page.waitForSelector('.page canvas', { timeout: 30000 })
  await page.waitForTimeout(12000)
  console.log(name, await page.evaluate(() => Object.fromEntries(['#viewport', '#pages', '.page', '.page canvas'].map(s => { const e = document.querySelector(s); const c = getComputedStyle(e); return [s, { rect: e.getBoundingClientRect().toJSON(), width: e.width, height: e.height, transform: c.transform, zoom: c.zoom, font: c.font, dpr: devicePixelRatio }] }))))
  await page.close()
}
await browser.close()
