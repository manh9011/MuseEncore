import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', route => route.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`http://localhost:${port}/?url=http://scores.test/test.mscz`)
  await page.waitForSelector('.panel-tab-menu', { timeout: 30000 })
  await page.waitForTimeout(10000)
  await page.getByRole('button',{name:'Add palettes'}).click();await page.getByRole('button',{name:'Create custom palette'}).click();await page.locator('#custom-palette-name').fill('My palette');await page.locator('#custom-palette-name').press('Escape');await page.waitForTimeout(300);console.log(name,'escape popup',await page.locator('#custom-palette-name').count(),'created',await page.getByText('My palette',{exact:true}).count());await page.getByRole('button',{name:'Create custom palette'}).click();await page.locator('#custom-palette-name').fill('My palette');await page.locator('#custom-palette-name').press('Enter');await page.waitForTimeout(500);console.log(name,'enter created',await page.getByText('My palette',{exact:true}).count());assert.equal(await page.getByText('My palette',{exact:true}).count(),1);
  await page.close()
}
await browser.close()
