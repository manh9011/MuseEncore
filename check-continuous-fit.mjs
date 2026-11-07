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
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.waitForSelector('.zoom-select', { timeout: 30000 })
  await page.waitForTimeout(10000)
  await page.getByRole('button',{name:'Page view',exact:true}).last().click()
  console.log(name,'menu',await page.getByRole('menu').allTextContents());await page.screenshot({path:`continuous-menu-${name}.png`})
  await page.getByText('Continuous view (fit to window)',{exact:true}).click()
  await page.waitForTimeout(2000)
  console.log(name,'geometry',await page.locator('.page').first().boundingBox());await page.setViewportSize({width:390,height:844});await page.waitForTimeout(1500);console.log(name,'mobile geometry',await page.locator('.page').first().boundingBox());await page.screenshot({path:`continuous-fit-mobile-${name}.png`})
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('continuous-fit-mobile-react.png')), b = PNG.sync.read(readFileSync('continuous-fit-mobile-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels', pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 }))
writeFileSync('continuous-fit-mobile-diff.png', PNG.sync.write(diff))
