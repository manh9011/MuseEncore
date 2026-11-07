import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', '[::1]:5180'], ['vue', '127.0.0.1:5174']]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', route => route.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`http://${port}/?url=http://scores.test/test.mscz`)
  await page.waitForSelector('.zoom-select', { timeout: 30000 })
  await page.waitForTimeout(10000)
  await page.screenshot({ path: `view-toolbar-mobile-${name}.png` });console.log(name,'buttons',await page.locator('.dock-bottom [data-action]').evaluateAll(es=>es.map(e=>({a:e.dataset.action,disabled:e.disabled,rect:e.getBoundingClientRect().toJSON()}))))
  const bar = page.locator('.dock-bottom')
  console.log(name, 'zoom', await page.locator('.zoom-select').inputValue(), 'bar', await bar.boundingBox())
  await bar.locator('[data-action="page-next"]').click()
  await page.waitForTimeout(500)
  assert.match(await bar.locator('.page-info').innerText(), /2\s*\/\s*5/)
  await page.locator('.zoom-select').selectOption('100')
  assert.equal(await page.locator('.zoom-select').inputValue(), '100')
  await page.locator('.dock-bottom [data-action="view-center-page"]').click();await page.locator('.dock-bottom [data-action="print"]').click();console.log(name,'print dialogs',await page.locator('dialog[open]').count());await page.keyboard.press('Escape');await page.locator('.dock-bottom [data-action="view-shortcuts-help"]').click();console.log(name,'shortcuts dialogs',await page.locator('dialog[open]').count());await page.keyboard.press('Escape');console.log(name, 'remaining controls exercised')
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('view-toolbar-mobile-react.png')), b = PNG.sync.read(readFileSync('view-toolbar-mobile-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels', pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 }))
writeFileSync('view-toolbar-mobile-diff.png', PNG.sync.write(diff))
