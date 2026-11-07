import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'MuseScore/vtest/scores/mmrest-5.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.screenshot({path:`clef-candidate-${name}.png`});await page.mouse.click(750, 340)
  await page.waitForTimeout(1000)
  console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);const cb=page.getByRole('checkbox',{name:'Exclude from parts'});console.log(name,'before',await cb.isChecked());await cb.check();await page.waitForTimeout(500);console.log(name,'after',await cb.isChecked());await page.screenshot({path:`parts-exclude-mobile-${name}.png`});await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(500);await page.setViewportSize({width:1280,height:800});await page.waitForTimeout(500);await page.mouse.click(750,340);await page.waitForTimeout(500);console.log(name,'undo',await cb.isChecked());
  await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync('parts-exclude-mobile-react.png')),b=PNG.sync.read(readFileSync('parts-exclude-mobile-vue.png')),d=new PNG({width:a.width,height:a.height});console.log('diff',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:.1}));writeFileSync('parts-exclude-mobile-diff.png',PNG.sync.write(d));
