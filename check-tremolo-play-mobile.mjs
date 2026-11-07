import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'MuseScore/vtest/scores/disabled/tremolo-1.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.mouse.click(701,277);await page.waitForTimeout(700);console.log(name,'status',await page.locator('#status').innerText(),'notation',await page.locator('[data-section=SECTION_NOTATION]').allTextContents());await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);const section=page.locator('[data-section=SECTION_NOTATION]');const box=section.getByRole('checkbox');console.log('before',await box.getAttribute('aria-checked'));await box.tap();await page.waitForTimeout(500);console.log('after',await box.getAttribute('aria-checked'));await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(500);await page.setViewportSize({width:1280,height:800});await page.waitForTimeout(500);await page.mouse.click(701,277);await page.waitForTimeout(500);console.log('undo',await box.getAttribute('aria-checked'));
  await page.close()
}
await browser.close()
