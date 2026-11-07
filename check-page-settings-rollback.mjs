import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.waitForSelector('.page canvas', { timeout: 30000 }); await page.waitForTimeout(10000)
  const open = async () => { await page.getByRole('menuitem', { name: 'Format', exact: true }).click(); await page.getByRole('menuitem', { name: /Page settings/ }).click(); await page.locator('dialog[open]').waitFor() }
  await open()
  const width = page.getByLabel('Width:', { exact: true }), initial = await width.inputValue()
  await width.fill('180'); await width.press('Enter'); assert.notEqual(await width.inputValue(), initial)
  await page.getByRole('button', { name: 'Cancel' }).click(); await open()
  assert.equal(await width.inputValue(), initial)
  await width.fill('180');await width.press('Enter');await page.getByRole('button',{name:'OK',exact:true}).click();await open();assert.equal(Number(await width.inputValue()),180)
  await page.getByRole('button',{name:'Cancel'}).click();await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await open();assert.equal(await width.inputValue(),initial)
  await page.getByRole('button', { name: 'Cancel' }).click()
  console.log(name, 'numeric edit, cancel, persistence and undo passed')
  await page.close()
}
await browser.close()
