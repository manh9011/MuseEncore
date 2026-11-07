import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, acceptDownloads: true })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'text-alpha-fixture.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => {Object.defineProperty(window,'showSaveFilePicker',{value:undefined});localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } }))})
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.mouse.click(755,190);await page.waitForTimeout(500);await page.locator('[data-section=SECTION_TEXT]').getByRole('button',{name:'Show more'}).click();const input=page.locator('[data-section=SECTION_TEXT] input[type=color]').nth(1);console.log('before',await input.inputValue());await input.fill('#ff0000');await input.dispatchEvent('change');await page.waitForTimeout(500);await page.getByRole('menuitem',{name:'File',exact:true}).click();await page.getByRole('menuitem',{name:/Export/}).click();await page.locator('#export-format').selectOption({label:'MuseScore file'});const [download]=await Promise.all([page.waitForEvent('download'),page.locator('dialog[open]').getByRole('button',{name:/Export/}).click()]);const {unzipSync,strFromU8}=await import('fflate');const files=unzipSync(new Uint8Array(await (await import('node:fs/promises')).readFile(await download.path())));const xml=strFromU8(files[Object.keys(files).find(k=>k.endsWith('.mscx'))]);assert.match(xml, /<frameBgColor r="255" g="0" b="0" a="128"\/>/);console.log('alpha 128 preserved');await page.close();}
await browser.close();
