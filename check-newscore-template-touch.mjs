import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
const mobile=true, suffix='-mobile'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,port] of [['react',5180],['vue',5174]]) {
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});const page=await context.newPage()
 await page.goto(`http://${name==='react'?'[::1]:5180':'127.0.0.1:5174'}/`)
 await page.getByRole('button',{name:'New',exact:true}).tap()
 await page.getByRole('tab',{name:'Create from template'}).tap()
 await page.waitForTimeout(10000)
 console.log(name,await page.getByRole('dialog').boundingBox(),await page.locator('.choose-template').boundingBox().catch(()=>null))
 await page.screenshot({path:`newscore-template-touch-${name}.png`})
 const categories = page.getByRole('listbox',{name:'Category'}).getByRole('option')
 if (await categories.count() > 1) {
   await categories.nth(1).tap()
   assert.equal(await categories.nth(1).getAttribute('aria-selected'),'true')
   assert.equal(await page.getByRole('listbox',{name:'Template'}).getByRole('option',{selected:true}).count(),1)
 }
 await page.getByRole('button',{name:'Next',exact:true}).tap()
 assert.equal(await page.getByRole('button',{name:'Back',exact:true}).count(),1)
 await page.getByRole('button',{name:'Back',exact:true}).tap()
 await page.getByRole('button',{name:'Cancel',exact:true}).tap()
 assert.equal(await page.getByRole('dialog').count(),0)
 console.log(name,'category, Next/Back, Cancel passed')
 await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync(`newscore-template-touch-react.png`)),b=PNG.sync.read(readFileSync(`newscore-template-touch-vue.png`)),d=new PNG({width:a.width,height:a.height})
console.log('different pixels',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:0.1}));writeFileSync(`newscore-template-touch-diff.png`,PNG.sync.write(d))
