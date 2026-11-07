import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,port] of [['react',5180],['vue',5174]]) {
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});const page=await context.newPage()
 page.on('pageerror',e=>console.log(name,'error',e.message))
 await page.goto(`http://${name==='react'?'[::1]:5180':'127.0.0.1:5174'}/`)
 await page.getByRole('button',{name:'New',exact:true}).tap()
 await page.waitForTimeout(1000)
 console.log(name,await page.getByRole('dialog').count(),await page.getByRole('dialog').boundingBox().catch(()=>null))
 await page.screenshot({path:`newscore-choose-touch-${name}.png`})
 await page.getByRole('listbox',{name:'Instruments'}).getByRole('option',{name:'Flute',exact:true}).tap()
 await page.getByRole('button',{name:'Add selected instruments to score'}).tap()
 assert.equal(await page.getByRole('listbox',{name:'Your score'}).getByRole('option',{name:'Flute'}).count(),1)
 await page.getByRole('button',{name:'Remove selected instruments from score'}).tap()
 assert.equal(await page.getByRole('listbox',{name:'Your score'}).getByRole('option').count(),0)
 await page.getByRole('button',{name:'Cancel'}).tap()
 assert.equal(await page.getByRole('dialog').count(),0)
 console.log(name,'add/remove/close passed')
 await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync('newscore-choose-touch-react.png')),b=PNG.sync.read(readFileSync('newscore-choose-touch-vue.png')),d=new PNG({width:a.width,height:a.height})
console.log('different pixels',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:0.1}));writeFileSync('newscore-choose-touch-diff.png',PNG.sync.write(d))
