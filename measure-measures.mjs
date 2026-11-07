import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'MuseScore/vtest/scores/barline-1.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.mouse.click(700, 227)
  await page.waitForTimeout(1000)
  console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  await page.getByRole('tab',{name:'Rest',exact:true}).click();await page.getByRole('checkbox',{name:'Align with other rests in the same voice'}).uncheck();await page.mouse.click(700,227);await page.keyboard.press('Shift+ArrowRight');await page.waitForTimeout(500);if(!await page.getByRole('checkbox',{name:'Align with other rests in the same voice'}).isVisible()) await page.getByRole('tab',{name:'Rest',exact:true}).click();const cb=page.getByRole('checkbox',{name:'Align with other rests in the same voice'});console.log(name,'multi',await page.locator('#status').innerText(),await cb.evaluate(e=>({checked:e.checked,indeterminate:e.indeterminate})));console.log(name,'measures',JSON.stringify(await page.locator('[data-section=SECTION_MEASURES] button').evaluateAll(es=>es.map(e=>{let r=e.getBoundingClientRect(),s=getComputedStyle(e);return [e.innerText,e.disabled,r.x,r.y,r.width,r.height,s.opacity,s.justifyContent]}))));await page.locator('.panel-dock').screenshot({path:`rest-range-panel-${name}.png`});await page.screenshot({ path: `inspector-rest-multi-${name}.png` })
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('inspector-rest-multi-react.png')), b = PNG.sync.read(readFileSync('inspector-rest-multi-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}))
writeFileSync('inspector-rest-multi-diff.png',PNG.sync.write(diff))
