import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'parts-mixed-text-fixture.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  let moduleUrl;page.on('response',r=>{if(r.url().includes('/scoreview.ts'))moduleUrl=r.url()});await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.locator('[data-action="parts"]').click();const d=page.locator('dialog[open]').last();await d.getByRole('button',{name:'Create new part'}).click();await d.locator('.part-title-edit input').fill('Test part');await d.locator('.part-title-edit input').press('Enter');await d.getByRole('option').filter({hasText:'Test part'}).click();await d.getByRole('button',{name:'Open selected'}).click();await page.getByRole('tab',{name:'Test part'}).click();await page.getByRole('tab',{name:'Layout'}).click();await page.getByRole('button',{name:/Piano, Hidden/}).click();await page.waitForTimeout(2000);await page.getByRole('tab',{name:'Properties'}).click();await page.screenshot({path:`parts-mixed-fixture-${name}.png`});await page.mouse.click(700, 242)
  await page.waitForTimeout(1000)
  console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  const sw=page.getByRole('switch',{name:'Position'});await sw.uncheck();await page.waitForTimeout(500);await page.keyboard.down('Control');await page.mouse.click(830,242);await page.keyboard.up('Control');await page.waitForTimeout(500);console.log(name,'objects',await page.evaluate(async(url)=>{const s=(await import(url)).currentScore();return s.selection().elements().map(e=>({type:e.type(),linked:e.isPositionLinkedToMaster()}))},moduleUrl));console.log(name,'status',await page.locator('#status').innerText(),'switch',await sw.isChecked());await sw.check();await page.waitForTimeout(500);console.log(name,'after',await page.evaluate(async(url)=>(await import(url)).currentScore().selection().elements().map(e=>e.isPositionLinkedToMaster()),moduleUrl));await page.screenshot({path:`parts-mixed-${name}.png`});await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(500);await page.mouse.click(700,242);await page.keyboard.down('Control');await page.mouse.click(830,242);await page.keyboard.up('Control');await page.waitForTimeout(500);console.log(name,'undo',await page.evaluate(async(url)=>(await import(url)).currentScore().selection().elements().map(e=>e.isPositionLinkedToMaster()),moduleUrl));
  await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync('parts-mixed-react.png')),b=PNG.sync.read(readFileSync('parts-mixed-vue.png')),d=new PNG({width:a.width,height:a.height});console.log('diff',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:.1}));writeFileSync('parts-mixed-diff.png',PNG.sync.write(d));
