import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'image-fixture.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.mouse.move(345,500);await page.keyboard.down('Control');await page.mouse.wheel(0,-200);await page.keyboard.up('Control');await page.waitForTimeout(500);for(let i=0;i<2;i++){await page.mouse.move(315,550);await page.mouse.down();await page.mouse.move(385,550,{steps:8});await page.mouse.up();}await page.waitForTimeout(500);for(let i=0;i<1;i++){await page.mouse.move(350,600);await page.mouse.down();await page.mouse.move(350,500,{steps:8});await page.mouse.up()}await page.screenshot({path:`image-direct-start-${name}.png`});await page.touchscreen.tap(350,600);await page.waitForTimeout(500);console.log(name,await page.locator('#status').innerText());const cb=page.getByRole('checkbox',{name:'Lock'});console.log(name,'before',await cb.isChecked());await cb.tap();await page.waitForTimeout(400);console.log(name,'after',await cb.isChecked());await page.getByRole('menuitem',{name:'Edit',exact:true}).tap();await page.getByRole('menuitem',{name:/^Undo/}).tap();await page.waitForTimeout(500);for(let i=0;i<1;i++){await page.mouse.move(350,600);await page.mouse.down();await page.mouse.move(350,500,{steps:8});await page.mouse.up()}await page.screenshot({path:`image-direct-start-${name}.png`});await page.touchscreen.tap(350,600);await page.waitForTimeout(500);console.log(name,'undo',await cb.isChecked());await page.screenshot({path:`image-direct-${name}.png`}); await page.close()
}
await browser.close()

const a=PNG.sync.read(readFileSync('image-direct-react.png')),b=PNG.sync.read(readFileSync('image-direct-vue.png'));const diff=new PNG({width:a.width,height:a.height});console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}));writeFileSync('image-direct-diff.png',PNG.sync.write(diff))
