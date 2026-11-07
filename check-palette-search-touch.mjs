import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});const page=await context.newPage()
  await page.route('http://scores.test/**', route => route.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.waitForSelector('.palette-search-button', { timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.locator('.palette-search-button').tap()
  await page.locator('.palette-search input').fill('treble')
  await page.waitForTimeout(700)
  assert.equal(await page.locator('.palette-cell').count(), 7)
  assert.equal(await page.locator('.palette-search input').evaluate(e => document.activeElement === e), true)
  console.log(name, 'seven results; search focused')
  await page.screenshot({ path: `palette-search-touch-${name}.png` })
  await page.locator('.palette-search input').press('Escape')
  assert.equal(await page.locator('.add-palettes').evaluate(e => document.activeElement === e), true)
  console.log(name, 'Escape restores Add palettes focus')
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('palette-search-touch-react.png')), b = PNG.sync.read(readFileSync('palette-search-touch-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels', pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 }))
writeFileSync('palette-search-touch-diff.png', PNG.sync.write(diff))
