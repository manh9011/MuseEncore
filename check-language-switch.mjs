import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'MuseScore/vtest/scores/tuplets-1.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.screenshot({path:`articulation-fixture-${name}.png`});await page.mouse.click(640,372)
  await page.waitForTimeout(1000)
  console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  console.log(name,'before',await page.locator('.concert-pitch').innerText());await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/Preferences/}).click();await page.locator('section[aria-labelledby=pref-language] select').selectOption('de');await page.waitForTimeout(1500);console.log(name,'after',await page.locator('.concert-pitch').innerText(),'panel',await page.locator('[data-section=SECTION_NOTATION]').innerText()); await page.screenshot({path:`language-switch-${name}.png`}); await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync('language-switch-react.png')),b=PNG.sync.read(readFileSync('language-switch-vue.png'));const diff=new PNG({width:a.width,height:a.height});console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}));writeFileSync('language-switch-diff.png',PNG.sync.write(diff))
