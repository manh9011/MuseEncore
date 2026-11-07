import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  for(let x=550;x<1100;x+=5){await page.mouse.click(x,320);let t=await page.locator('#status').innerText();if(t.toLowerCase().includes('barline')){console.log('FOUND',x,t);break}}
  await page.waitForTimeout(1000)
  console.log(name,'panel',await page.locator('.insp-section').allTextContents());console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  await page.locator('.insp-dropdown').last().selectOption({label:'Right (end) repeat barline'});await page.waitForTimeout(500);const group=page.getByRole('radiogroup',{name:'Repeat style'});console.log(name,'repeat radios',await group.locator('button').evaluateAll(es=>es.map(e=>[e.disabled,e.getAttribute('aria-checked')])));await group.locator('button').nth(1).click();await page.waitForTimeout(400);console.log(name,'winged',await group.locator('button').nth(1).getAttribute('aria-checked'));await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(400);console.log(name,'undo',await group.locator('button').nth(1).getAttribute('aria-checked'));await page.screenshot({ path: `inspector-barline-repeat-${name}.png` })
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('inspector-barline-repeat-react.png')), b = PNG.sync.read(readFileSync('inspector-barline-repeat-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}))
writeFileSync('inspector-barline-repeat-diff.png',PNG.sync.write(diff))
