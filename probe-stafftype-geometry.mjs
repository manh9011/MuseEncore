import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'MuseScore/src/engraving/tests/all_elements_data/layout_elements.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  let moduleUrl;page.on('response',r=>{if(r.url().includes('/scoreview.ts?'))moduleUrl=r.url()});await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  console.log('staff type objects',await page.evaluate(async url=>{const m=await import(url);const s=m.currentScore();const a=[];s.scanElements(e=>{if(e.constructor.name==='StaffTypeChange')a.push({name:e.constructor.name,bbox:e.pageBoundingRect?.(),pos:e.pagePos?.()})});return a},moduleUrl));const r=await page.locator('.page').first().boundingBox();const size=await page.evaluate(async url=>(await import(url)).pageInches(0),moduleUrl);console.log('page',r,size);await page.close();}
await browser.close();
