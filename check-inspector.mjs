import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`http://127.0.0.1:${port}/?url=http://scores.test/test.mscz`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  const header = page.locator('.insp-section-header').first()
  await header.waitFor()
  await page.waitForTimeout(10000)
  await header.click()
  assert.equal(await header.getAttribute('aria-expanded'), 'false')
  await page.getByRole('tab', { name: 'Palettes' }).click()
  await page.getByRole('tab', { name: 'Properties' }).click()
  assert.equal(await page.locator('.insp-section-header').first().getAttribute('aria-expanded'), 'false')
  await page.locator('.insp-section-header').first().click()
  console.log(name, 'collapse persistence passed; Invisible enabled:', await page.getByRole('checkbox', { name: 'Invisible', exact: true }).isEnabled())
  await page.close()
}
await browser.close()
