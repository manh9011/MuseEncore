import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`http://127.0.0.1:${port}/?url=http://scores.test/test.mscz`)
  const trigger = page.locator('.add-palettes')
  await trigger.waitFor({ timeout: 30000 })
  await page.waitForTimeout(10000)
  await trigger.click()
  const popup = page.locator('.add-palettes-popup')
  await popup.waitFor()
  console.log(name, await popup.boundingBox(), 'extra', await popup.locator('li').count())
  await page.screenshot({ path: `add-palettes-${name}.png` })
  const first = popup.locator('li').first()
  const title = await first.locator('.add-palettes-name').innerText()
  await first.locator('button').click()
  await popup.getByText(`${title} added`, { exact: true }).waitFor()
  await page.keyboard.press('Escape')
  assert.equal(await popup.count(), 0)
  assert.equal(await trigger.evaluate(e => document.activeElement === e), true)
  console.log(name, 'add and Escape/focus passed')
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('add-palettes-react.png')), b = PNG.sync.read(readFileSync('add-palettes-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels', pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 }))
writeFileSync('add-palettes-diff.png', PNG.sync.write(diff))
