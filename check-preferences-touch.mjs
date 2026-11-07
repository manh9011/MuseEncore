import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
const pages = [['cloud','Save & publish'],['note','Note input'],['import','Import'],['web','Web version']]
const mobile = true
const suffix = mobile ? '-mobile' : ''
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for (const [name, port] of [['react',5180],['vue',5174]]) {
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});const page=await context.newPage()
 await page.goto(`http://${port===5180?'[::1]:5180':'127.0.0.1:5174'}/`)
 await page.getByText('Edit',{exact:true}).first().tap()
 await page.getByRole('menuitem',{name:/Preferences/}).tap()
 for (const [key,title] of pages) {
  await page.getByRole('tab',{name:title,exact:true}).tap()
  await page.waitForTimeout(150)
  console.log(name,key,await page.locator('.preferences-page').boundingBox())
  await page.screenshot({path:`preferences-${key}-${name}${suffix}.png`})
 }
 await page.getByRole('tab',{name:'Save & publish'}).tap()
 const checkbox=page.getByRole('checkbox',{name:'Auto save every'})
 const before=await checkbox.isChecked(); await checkbox.tap(); assert.equal(await checkbox.isChecked(),!before); await checkbox.tap(); assert.equal(await checkbox.isChecked(),before)
 await page.keyboard.press('Escape'); assert.equal(await page.getByRole('dialog').count(),0)
 console.log(name,'toggle and Escape passed')
 await page.close()
}
await browser.close()
for (const [key] of pages) {
 const a=PNG.sync.read(readFileSync(`preferences-${key}-react${suffix}.png`)),b=PNG.sync.read(readFileSync(`preferences-${key}-vue${suffix}.png`)),d=new PNG({width:a.width,height:a.height})
 console.log(key,'different pixels',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:0.1}))
 writeFileSync(`preferences-${key}-diff${suffix}.png`,PNG.sync.write(d))
}
