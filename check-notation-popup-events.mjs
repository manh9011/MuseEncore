import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'tempo-mixed-types-fixture.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.screenshot({path:`atempo-fixture-${name}.png`});await page.mouse.click(692,207);await page.keyboard.down('Control');await page.mouse.click(760,207);await page.keyboard.up('Control')
  await page.waitForTimeout(1000)
  console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  console.log(name,'buttons',await page.locator('[data-section=SECTION_NOTATION] button').evaluateAll(es=>es.map(e=>({text:e.innerText,expanded:e.getAttribute('aria-expanded')}))));  await page.getByRole('button',{name:'A tempo',exact:true}).click();await page.getByRole('button',{name:'Tempo primo',exact:true}).click();await page.waitForTimeout(500);console.log(name,'expanded',await page.locator('[data-section=SECTION_NOTATION]').innerText());await page.keyboard.press('Escape');console.log(name,'escape',await page.getByRole('button',{name:'Tempo primo',exact:true}).getAttribute('aria-expanded'),await page.evaluate(()=>document.activeElement?.textContent));await page.getByRole('button',{name:'A tempo',exact:true}).click();await page.locator('[data-section=SECTION_GENERAL] .insp-section-header').click();console.log(name,'outside',await page.getByRole('button',{name:'A tempo',exact:true}).getAttribute('aria-expanded'));await page.getByRole('button',{name:'Tempo primo',exact:true}).click();await page.screenshot({path:`tempo-mixed-expanded-${name}.png`}); await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync('tempo-mixed-expanded-react.png')),b=PNG.sync.read(readFileSync('tempo-mixed-expanded-vue.png'));const diff=new PNG({width:a.width,height:a.height});console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}));writeFileSync('tempo-mixed-expanded-diff.png',PNG.sync.write(diff))
