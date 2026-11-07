import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.mouse.click(698, 299)
  await page.waitForTimeout(1000)
  await page.getByText(/Show more/).first().click();await page.waitForTimeout(300);console.log(name,await page.locator('.inspector').evaluate(e=>{let a=[];for(let x=e;x;x=x.parentElement)a.push([x.className,x.clientHeight,x.scrollHeight,getComputedStyle(x).overflowY]);return a}));await page.mouse.move(200,650);await page.mouse.wheel(0,1200);await page.waitForTimeout(500);await page.getByRole('radiogroup',{name:'Override visual duration'}).getByRole('radio').nth(1).click();await page.waitForTimeout(300);console.log(name,'duration',await page.getByRole('radiogroup',{name:'Override visual duration'}).getByRole('radio').nth(1).getAttribute('aria-checked'));await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(300);console.log(name,'undo',await page.getByRole('radiogroup',{name:'Override visual duration'}).getByRole('radio').first().getAttribute('aria-checked'));console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  await page.screenshot({ path: `inspector-head-scroll-${name}.png` })
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('inspector-head-scroll-react.png')), b = PNG.sync.read(readFileSync('inspector-head-scroll-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}))
writeFileSync('inspector-head-scroll-diff.png',PNG.sync.write(diff))
