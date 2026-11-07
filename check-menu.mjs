import {chromium} from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,port] of [['react',5180],['vue',5174]]) {
 const page=await browser.newPage({viewport:{width:1280,height:800}}); await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/`); await page.waitForTimeout(1000)
 await page.keyboard.press('F10'); assert.equal(await page.evaluate(()=>document.activeElement?.textContent?.trim()),'File')
 await page.keyboard.press('ArrowDown'); assert.equal(await page.getByRole('menu',{name:'File'}).count(),1)
 await page.keyboard.press('ArrowDown'); assert.match(await page.evaluate(()=>document.activeElement?.textContent??''),/Open/)
 await page.keyboard.press('Escape'); assert.equal(await page.getByRole('menu',{name:'File'}).count(),0)
 assert.equal(await page.evaluate(()=>document.activeElement?.textContent?.trim()),'File')
 await page.getByRole('menuitem',{name:'Edit',exact:true}).click(); await page.getByRole('menuitem',{name:/Preferences/}).click(); await page.getByRole('dialog',{name:'Preferences'}).waitFor(); await page.keyboard.press('Escape')
 console.log(name,'keyboard navigation, focus and action passed'); await page.close()
}
await browser.close()
