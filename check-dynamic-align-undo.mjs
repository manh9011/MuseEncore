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
  for(let i=0;i<3;i++) await page.getByRole('button',{name:'Zoom in'}).click();await page.waitForTimeout(500);await page.mouse.click(506,584)
  await page.waitForTimeout(1000)
  console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  await page.getByRole('button',{name:'Show more'}).click();await page.waitForTimeout(300);console.log(name,'expanded',await page.locator('[data-section=SECTION_NOTATION]').innerText());const group=page.getByRole('radiogroup',{name:'Alignment with notehead'});console.log(name,'initial',await group.locator('[aria-checked=true]').getAttribute('aria-label'));await group.getByRole('radio',{name:'Use text centering'}).click();await page.waitForTimeout(300);console.log(name,'changed',await group.locator('[aria-checked=true]').getAttribute('aria-label'));await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(300);await page.mouse.click(506,584);await page.waitForTimeout(300);if(!await group.isVisible())await page.getByRole('button',{name:'Show more'}).click();console.log(name,'undo',await group.locator('[aria-checked=true]').getAttribute('aria-label'));await page.screenshot({ path: `inspector-dynamic-more-${name}.png` })
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('inspector-dynamic-more-react.png')), b = PNG.sync.read(readFileSync('inspector-dynamic-more-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}))
writeFileSync('inspector-dynamic-more-diff.png',PNG.sync.write(diff))
