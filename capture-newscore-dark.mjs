import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,port] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});await page.emulateMedia({colorScheme:'dark'})
 page.on('pageerror',e=>console.log(name,'error',e.message))
 await page.goto(`http://${port}/`)
 await page.getByRole('button',{name:'New',exact:true}).click()
 await page.waitForTimeout(1000)
 console.log(name,await page.getByRole('dialog').count(),await page.getByRole('dialog').boundingBox().catch(()=>null))
 await page.screenshot({path:`newscore-choose-dark-${name}.png`})
 await page.getByRole('listbox',{name:'Instruments'}).getByRole('option',{name:'Flute',exact:true}).click()
 await page.getByRole('button',{name:'Add selected instruments to score'}).click()
 assert.equal(await page.getByRole('listbox',{name:'Your score'}).getByRole('option',{name:'Flute'}).count(),1)
 await page.getByRole('button',{name:'Remove selected instruments from score'}).click()
 assert.equal(await page.getByRole('listbox',{name:'Your score'}).getByRole('option').count(),0)
 await page.getByRole('button',{name:'Cancel'}).click()
 assert.equal(await page.getByRole('dialog').count(),0)
 console.log(name,'add/remove/close passed')
 await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync('newscore-choose-dark-react.png')),b=PNG.sync.read(readFileSync('newscore-choose-dark-vue.png')),d=new PNG({width:a.width,height:a.height})
console.log('different pixels',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:0.1}));writeFileSync('newscore-choose-dark-diff.png',PNG.sync.write(d))
