import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'MuseScore/src/engraving/tests/tempomap_data/gradual_tempo_change_rallentando/gradual_tempo_change_rallentando.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.mouse.click(909,243); await page.waitForTimeout(700); const section=page.locator('[data-section=SECTION_NOTATION]'); await section.getByRole('button',{name:'Show more'}).click(); console.log(await section.innerText()); console.log(await section.getByRole('checkbox').evaluateAll(es=>es.map(e=>({outer:e.outerHTML,checked:e.checked})))); await page.screenshot({path:'gradualtempo-advanced-vue.png'});
  await page.close()
}
await browser.close()
