import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
const mobile=process.argv.includes('--mobile'), suffix=mobile?'-mobile':''
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,port] of [['react',5180],['vue',5174]]) {
 const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1280,height:800},deviceScaleFactor:1})
 await page.goto(`http://127.0.0.1:${port}/`); await page.getByRole('button',{name:'New',exact:true}).click(); await page.getByRole('tab',{name:'Create from template'}).click(); await page.getByRole('button',{name:'Next',exact:true}).click(); await page.waitForTimeout(500)
 console.log(name,await page.locator('.dialog-page').boundingBox())
 await page.screenshot({path:`newscore-info-${name}${suffix}.png`})
 const key=page.getByRole('button',{name:/^Key signature:/}); await key.click(); await page.getByRole('radio',{name:'G major',exact:true}).click(); assert.match(await key.getAttribute('aria-label'),/G major/); await page.keyboard.press('Escape'); assert.equal(await key.getAttribute('aria-expanded'),'false')
 const tempo=page.getByRole('button',{name:/^Tempo:/}); await tempo.click(); await page.getByRole('checkbox',{name:'Show tempo marking on my score'}).check(); await page.getByRole('spinbutton',{name:'Beats per minute'}).fill('135'); await page.getByRole('spinbutton',{name:'Beats per minute'}).press('Tab'); assert.match(await tempo.getAttribute('aria-label'),/135/); await page.getByRole('spinbutton',{name:'Beats per minute'}).focus(); await page.keyboard.press('Escape')
 const time=page.getByRole('button',{name:/^Time signature:/}); await time.click(); await page.getByRole('radio',{name:'Common time'}).check(); assert.match(await time.getAttribute('aria-label'),/Common time/); await page.getByRole('radio',{name:'Common time'}).focus(); await page.keyboard.press('Escape')
 const measures=page.getByRole('button',{name:/^Measures:/}); await measures.click(); await page.getByRole('checkbox',{name:'Create pickup measure'}).check(); const pickup=page.getByRole('group',{name:'Pickup measure duration'}); await pickup.getByRole('spinbutton',{name:'Numerator'}).fill('2'); await pickup.getByRole('spinbutton',{name:'Numerator'}).press('Tab'); assert.match(await measures.getAttribute('aria-label'),/2\//); await pickup.getByRole('spinbutton',{name:'Numerator'}).focus(); await page.keyboard.press('Escape')
 const title=page.getByPlaceholder('Untitled score'); await title.fill('Parity test'); await page.getByRole('button',{name:'Back',exact:true}).click(); await page.getByRole('button',{name:'Next',exact:true}).click(); assert.equal(await page.getByPlaceholder('Untitled score').inputValue(),'Parity test'); await page.getByRole('button',{name:'Cancel',exact:true}).click(); console.log(name,'key, tempo, title persistence passed'); await page.close()
}
await browser.close()
const a=PNG.sync.read(readFileSync(`newscore-info-react${suffix}.png`)),b=PNG.sync.read(readFileSync(`newscore-info-vue${suffix}.png`)),d=new PNG({width:a.width,height:a.height})
console.log('different pixels',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:0.1}));writeFileSync(`newscore-info-diff${suffix}.png`,PNG.sync.write(d))
