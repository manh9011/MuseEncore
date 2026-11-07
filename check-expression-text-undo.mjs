import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'MuseScore/src/engraving/tests/expression_data/expression-1-ref.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.mouse.click(680, 235)
  await page.waitForTimeout(1000)
  console.log(name,'panel',await page.locator('.insp-section').allTextContents());console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  const input=page.getByRole('textbox',{name:'Size',exact:true});const before=await input.inputValue();await input.fill('20');await input.press('Enter');await page.waitForTimeout(400);console.log(name,'size',before,await input.inputValue());await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(400);console.log(name,'undo',await input.inputValue());await page.screenshot({ path: `expression-text-edit-${name}.png` })
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('expression-text-edit-react.png')), b = PNG.sync.read(readFileSync('expression-text-edit-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}))
writeFileSync('expression-text-edit-diff.png',PNG.sync.write(diff))
