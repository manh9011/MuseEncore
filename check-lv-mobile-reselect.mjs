import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'MuseScore/src/importexport/musicxml/tests/data/importTie1_ref.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.mouse.click(925,263);await page.mouse.move(925,263);await page.keyboard.down('Control');await page.mouse.wheel(0,-500);await page.keyboard.up('Control');await page.waitForTimeout(700);await page.screenshot({path:`lv-wheel-${name}.png`});await page.mouse.click(960,355)
  await page.waitForTimeout(1000);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500)
  console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  const group=page.getByRole('radiogroup',{name:'Laissez vibrer placement'});console.log(name,'before',await group.locator('[aria-checked=true]').allTextContents());await group.getByRole('radio',{name:'Inside'}).click();await page.waitForTimeout(300);console.log(name,'after',await group.locator('[aria-checked=true]').allTextContents());await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(500);await page.setViewportSize({width:1280,height:800});await page.waitForTimeout(500);await page.mouse.move(700,400);await page.keyboard.down('Control');await page.mouse.wheel(0,400);await page.keyboard.up('Control');await page.waitForTimeout(500);await page.mouse.move(690,400);await page.keyboard.down('Control');await page.mouse.wheel(0,-250);await page.keyboard.up('Control');await page.waitForTimeout(500);await page.screenshot({path:`lv-rezoom-${name}.png`});await page.mouse.click(692,394);await page.waitForTimeout(300);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);console.log(name,'undo',await group.locator('[aria-checked=true]').allTextContents()); await page.screenshot({path:`lv-mobile-${name}.png`}); await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync('lv-mobile-react.png')),b=PNG.sync.read(readFileSync('lv-mobile-vue.png'));const diff=new PNG({width:a.width,height:a.height});console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}));writeFileSync('lv-mobile-diff.png',PNG.sync.write(diff))
