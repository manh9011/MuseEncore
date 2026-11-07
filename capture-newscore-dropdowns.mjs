import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const mobile=process.argv.includes('--mobile'), suffix=mobile?'-mobile':''
const cases=[['key','Key signature'],['time','Time signature'],['tempo','Tempo'],['measures','Measures']]
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,port] of [['react',5180],['vue',5174]]) {
 const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1280,height:800},deviceScaleFactor:1})
 await page.goto(`http://127.0.0.1:${port}/`); await page.getByRole('button',{name:'New',exact:true}).click(); await page.getByRole('tab',{name:'Create from template'}).click(); await page.getByRole('button',{name:'Next',exact:true}).click()
 for(const [id,label] of cases) { const button=page.getByRole('button',{name:new RegExp(`^${label}:`)}); await button.click(); console.log(name,id,await page.locator('.dropdown-panel').boundingBox()); await page.screenshot({path:`newscore-${id}-${name}${suffix}.png`}); await button.click() }
 await page.close()
}
await browser.close()
for(const [id] of cases) { const a=PNG.sync.read(readFileSync(`newscore-${id}-react${suffix}.png`)),b=PNG.sync.read(readFileSync(`newscore-${id}-vue${suffix}.png`)),d=new PNG({width:a.width,height:a.height}); console.log(id,'different pixels',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:0.1}));writeFileSync(`newscore-${id}-diff${suffix}.png`,PNG.sync.write(d)) }
