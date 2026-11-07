import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'MuseScore/vtest/scores/accidental-1.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.mouse.move(335,530);await page.keyboard.down('Control');await page.mouse.wheel(0,-200);await page.keyboard.up('Control');await page.waitForTimeout(500);await page.screenshot({path:`accidental-direct-zoom-${name}.png`});await page.mouse.click(350,522)
  await page.waitForTimeout(1000);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500)
  console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  console.log(name, 'notation',await page.locator('[data-section=SECTION_NOTATION]').innerText()); const group=page.getByRole('radiogroup',{name:'Bracket type'}); console.log(name,'initial',await group.locator('[aria-checked=true]').allTextContents());await group.getByRole('radio',{name:'Parentheses'}).click();await page.waitForTimeout(300);console.log(name,'after',await group.locator('[aria-checked=true]').allTextContents());await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(500);await page.mouse.click(350,522);await page.waitForTimeout(500);console.log(name,'undo',await group.locator('[aria-checked=true]').allTextContents()); await page.screenshot({path:`accidental-mobile-${name}.png`}); await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync('accidental-mobile-react.png')),b=PNG.sync.read(readFileSync('accidental-mobile-vue.png'));const diff=new PNG({width:a.width,height:a.height});console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}));writeFileSync('accidental-mobile-diff.png',PNG.sync.write(diff))
