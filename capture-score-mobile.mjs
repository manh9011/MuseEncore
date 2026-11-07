import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`http://${name==='react'?'[::1]':'127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.waitForSelector('.page canvas', { timeout: 30000 })
  await page.waitForTimeout(12000)
  console.log(name, await page.evaluate(() => Object.fromEntries(['.chrome','.panel-dock','#viewport','.bottom-chrome'].map(s => [s,document.querySelector(s)?.getBoundingClientRect().toJSON()]))))
  await page.screenshot({ path: `score-mobile-${name}.png` })
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('score-mobile-react.png')), b = PNG.sync.read(readFileSync('score-mobile-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels', pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}))
writeFileSync('score-mobile-diff.png',PNG.sync.write(diff))
