import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});const page=await context.newPage()
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.getByRole('tab', {name:'Properties'}).click({timeout:30000})
  await page.waitForTimeout(12000)
  await page.touchscreen.tap(326,507)
  console.log(name, 'selection', await page.locator('#status').innerText(), 'inspector', (await page.locator('.inspector').innerText()).slice(0,400))
  const trigger = page.getByRole('button',{name:'Appearance',exact:true})
  await trigger.tap()
  const popup = page.locator('.insp-popup')
  await popup.waitFor()
  console.log(name, await popup.boundingBox(), (await popup.innerText()).slice(0,250))
  await page.screenshot({path:`inspector-appearance-touch-${name}.png`})
  const leading = popup.getByRole('textbox', { name: 'Leading space' })
  await leading.tap();await leading.fill('1,5')
  await leading.press('Enter')
  await page.waitForTimeout(500)
  assert.equal(await leading.inputValue(), '1.5')
  await leading.press('ArrowUp')
  await page.waitForTimeout(500)
  assert.equal(await leading.inputValue(), '2')
  await page.keyboard.press('Escape')
  assert.equal(await popup.count(),0)
  assert.equal(await trigger.evaluate(e=>document.activeElement===e),true)
  console.log(name,'Escape/focus passed')
  await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync('inspector-appearance-touch-react.png')),b=PNG.sync.read(readFileSync('inspector-appearance-touch-vue.png')),d=new PNG({width:a.width,height:a.height})
console.log('different pixels',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:0.1}))
writeFileSync('inspector-appearance-touch-diff.png',PNG.sync.write(d))
