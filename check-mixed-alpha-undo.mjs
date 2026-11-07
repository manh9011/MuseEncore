import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mixed-text-alpha-fixture.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  let moduleUrl;page.on('response',r=>{if(r.url().includes('/scoreview.ts'))moduleUrl=r.url()});await page.goto(`http://localhost:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.mouse.click(690,210);await page.keyboard.down('Control');await page.mouse.click(760,210);await page.keyboard.up('Control');await page.waitForTimeout(700);console.log(name,'status',await page.locator('#status').innerText());await page.locator('[data-section=SECTION_TEXT]').getByRole('button',{name:'Show more'}).click();console.log(name,'selected',await page.evaluate(async url=>{const s=(await import(url)).currentScore();return s.selection().elements().map(e=>({type:e.constructor.name,bg:e.bgColor()}))},moduleUrl));console.log(name,'colors',await page.locator('[data-section=SECTION_TEXT] input[type=color]').evaluateAll(es=>es.map(e=>e.value)));await page.locator('[data-section=SECTION_TEXT] input[type=color]').nth(1).fill('#ff0000');await page.locator('[data-section=SECTION_TEXT] input[type=color]').nth(1).dispatchEvent('change');await page.waitForTimeout(500);console.log(name,'after',await page.evaluate(async url=>(await import(url)).currentScore().selection().elements().map(e=>e.bgColor()),moduleUrl));await page.screenshot({path:`mixed-alpha-${name}.png`});await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(500);await page.mouse.click(690,210);await page.keyboard.down('Control');await page.mouse.click(760,210);await page.keyboard.up('Control');await page.waitForTimeout(500);console.log(name,'undo',await page.evaluate(async url=>(await import(url)).currentScore().selection().elements().map(e=>e.bgColor()),moduleUrl));
  await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync('mixed-alpha-react.png')),b=PNG.sync.read(readFileSync('mixed-alpha-vue.png')),d=new PNG({width:a.width,height:a.height});console.log('diff',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:.1}));writeFileSync('mixed-alpha-diff.png',PNG.sync.write(d));
