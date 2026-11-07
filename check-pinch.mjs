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
  const cdp=await page.context().newCDPSession(page)
  const touch=(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(([x,y],id)=>({x,y,id}))})
  console.log(name,'before',await page.locator('.zoom-select').inputValue())
  await touch('touchStart',[[320,500],[370,500]])
  await touch('touchMove',[[305,500],[385,500]])
  await touch('touchEnd',[]);await page.waitForTimeout(1000)
  console.log(name,'after',await page.locator('.zoom-select').inputValue(), 'page',await page.locator('.page').first().boundingBox())
  await touch('touchStart',[[305,500],[385,500]]);await touch('touchMove',[[320,500],[370,500]]);await touch('touchEnd',[]);await page.waitForTimeout(500);console.log(name,'pinch-in',await page.locator('.page').first().boundingBox());await touch('touchStart',[[350,550]]);for(let y=545;y>=500;y-=5){await page.waitForTimeout(80);await touch('touchMove',[[350,y]])}await page.waitForTimeout(200);await touch('touchEnd',[]);await page.waitForTimeout(800);console.log(name,'pan',await page.locator('.page').first().boundingBox());await page.screenshot({path:`pinch-${name}.png`})
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('pinch-react.png')), b = PNG.sync.read(readFileSync('pinch-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels', pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 }))
writeFileSync('pinch-diff.png', PNG.sync.write(diff))
