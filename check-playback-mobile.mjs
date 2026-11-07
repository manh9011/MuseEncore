import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true })
  await page.route('http://scores.test/**', route => route.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.waitForSelector('.zoom-select', { timeout: 30000 })
  await page.waitForTimeout(10000)
  await page.locator('[data-toolbar="playbackToolBar"] [data-action="play"]').tap()
  await page.waitForFunction(() => window.__museencorePlayback?.state().tick > 1920,{timeout:20000})
  console.log(name,'cursor',await page.locator('.playback-cursor').boundingBox(),await page.locator('.playback-cursor').evaluate(e=>({color:getComputedStyle(e).backgroundColor,width:getComputedStyle(e).width})))
  await page.screenshot({path:`playback-mobile-${name}.png`})
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('playback-mobile-react.png')), b = PNG.sync.read(readFileSync('playback-mobile-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels', pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 }))
writeFileSync('playback-mobile-diff.png', PNG.sync.write(diff))
