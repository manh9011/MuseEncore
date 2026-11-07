import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  await page.goto(`http://${name === 'react' ? '[::1]' : '127.0.0.1'}:${port}/`)
  await page.waitForSelector('.home')
  await page.waitForTimeout(2000)
  await page.screenshot({ path: `home-current-mobile-${name}.png` })
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('home-current-mobile-react.png')), b = PNG.sync.read(readFileSync('home-current-mobile-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels', pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 }))
writeFileSync('home-current-mobile-diff.png', PNG.sync.write(diff))
