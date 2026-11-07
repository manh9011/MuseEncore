import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name,port] of [['react',5180],['vue',5174]]) {
 const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1})
 page.on('pageerror', error => console.log(name, 'pageerror', error.message))
 await page.goto(`http://127.0.0.1:${port}/`)
 await page.getByText('Edit',{exact:true}).first().click()
 console.log(name, 'item', await page.getByRole('menuitem',{name:/Preferences/}).evaluate(e=>e.outerHTML))
 await page.getByRole('menuitem',{name:/Preferences/}).click()
 await page.waitForTimeout(500)
 if (name === 'vue') console.log('session', await page.evaluate(async () => { const m = await import('/session.ts'); return { state: m.useSession().dialog, dialogs: [...document.querySelectorAll('dialog')].map(d => d.outerHTML.slice(0,300)) } }))
 await page.screenshot({path:`preferences-attempt-${name}.png`})
 console.log(name,await page.getByRole('dialog').boundingBox(),await page.getByRole('dialog').innerText())
 await page.screenshot({path:`preferences-${name}.png`})
 await page.getByRole('tab',{name:'Save & publish'}).click()
 assert.equal(await page.getByRole('tab',{name:'Save & publish'}).getAttribute('aria-selected'),'true')
 await page.getByRole('tab',{name:'General'}).click()
 await page.getByRole('button',{name:'OK',exact:true}).click()
 assert.equal(await page.getByRole('dialog').count(),0)
 console.log(name,'tab and close passed')
 await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync('preferences-react.png')), b=PNG.sync.read(readFileSync('preferences-vue.png')), d=new PNG({width:a.width,height:a.height})
console.log('different pixels',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:0.1}))
writeFileSync('preferences-diff.png',PNG.sync.write(d))
