import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'MuseScore/vtest/scores/mmrest-5.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  let moduleUrl;page.on('response',r=>{if(r.url().includes('/scoreview.ts'))moduleUrl=r.url()});await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.screenshot({path:`clef-candidate-${name}.png`});await page.mouse.click(750, 340)
  await page.waitForTimeout(1000)
  console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  const cb=page.getByRole('checkbox',{name:'Exclude from parts'});await cb.check();await page.waitForTimeout(500);await page.keyboard.down('Control');await page.mouse.click(380,340);await page.keyboard.up('Control');await page.waitForTimeout(500);console.log(name,'objects',await page.evaluate(async(url)=>{const s=(await import(url)).currentScore();return s.selection().elements().map(e=>({type:e.type(),excluded:e.excludeFromOtherParts()}))},moduleUrl));console.log(name,'status',await page.locator('#status').innerText(),'checkbox',await cb.evaluate(e=>({checked:e.checked,indeterminate:e.indeterminate,disabled:e.disabled})));await page.screenshot({path:`parts-mixed-${name}.png`});
  await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync('parts-mixed-react.png')),b=PNG.sync.read(readFileSync('parts-mixed-vue.png')),d=new PNG({width:a.width,height:a.height});console.log('diff',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:.1}));writeFileSync('parts-mixed-diff.png',PNG.sync.write(d));
