import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { writeFileSync, readFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', route => route.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.waitForSelector('.palette-header', { timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.locator('.palette-header').first().click()
  await page.waitForTimeout(1000)
  console.log(name, await page.locator('.palette-grid').first().evaluate(e => ({ rect: e.getBoundingClientRect().toJSON(), columns: getComputedStyle(e).gridTemplateColumns, cell: e.querySelector('.palette-cell')?.getBoundingClientRect().toJSON() })))
  await page.screenshot({ path: `palette-expanded-mobile-${name}.png` });await page.locator('.palette-header').first().hover();await page.locator('.palette-header').first().getByRole('button',{name:/Clefs: Menu/}).click();console.log(name,'header menu bounds',await page.locator('.menu-popup').boundingBox(),'items',await page.locator('.menu-popup').innerText());await page.screenshot({path:`palette-header-menu-mobile-${name}.png`})
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('palette-expanded-mobile-react.png')), b = PNG.sync.read(readFileSync('palette-expanded-mobile-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels', pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 }))
writeFileSync('palette-expanded-mobile-diff.png', PNG.sync.write(diff))
