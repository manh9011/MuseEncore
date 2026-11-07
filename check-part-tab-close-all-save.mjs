import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`http://localhost:${port}/?url=http://scores.test/test.mscz`)
  await page.waitForSelector('#viewport');await page.waitForTimeout(12000);await page.locator('[data-action=parts]').click();const d=page.locator('dialog[open]').last();await d.getByRole('button',{name:'Create new part'}).click();await d.locator('.part-title-edit input').fill('Test part');await d.locator('.part-title-edit input').press('Enter');await d.getByRole('option').filter({hasText:'Test part'}).click();await d.getByRole('button',{name:'Open selected'}).click();await page.getByRole('tab',{name:'Test part'}).click();await page.getByRole('tab',{name:'Test part'}).click({button:'right'});await page.locator('.menu-popup').waitFor();console.log(name,await page.locator('.menu-popup').boundingBox(),await page.locator('.menu-popup').innerText());
  await page.getByRole('menuitem',{name:'Close all tabs',exact:true}).click();await page.waitForTimeout(500);console.log(name,'after close',await page.locator('.notation-tab').allTextContents(),'dialogs',await page.locator('dialog[open]').allTextContents());
  await page.locator('dialog[open]').getByRole('button',{name:'Save',exact:true}).click();await page.waitForTimeout(2000);console.log(name,'after save dialogs',await page.locator('dialog[open]').allTextContents());console.log(name,'save tabs',await page.locator('.notation-tab').allTextContents());await page.close()
}
await browser.close()
