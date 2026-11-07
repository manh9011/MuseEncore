import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]){const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});await page.emulateMedia({colorScheme:'dark'});await page.goto(`http://${host}/`);await page.waitForSelector('.home');await page.waitForTimeout(800);console.log(name,await page.evaluate(()=>({tokens:['--bg','--panel','--fg','--muted','--border','--accent'].map(k=>[k,getComputedStyle(document.documentElement).getPropertyValue(k).trim()]),body:getComputedStyle(document.body).backgroundColor})));await page.screenshot({path:`home-dark-${name}.png`});await page.close()}
await browser.close();const a=PNG.sync.read(readFileSync('home-dark-react.png')),b=PNG.sync.read(readFileSync('home-dark-vue.png')),d=new PNG({width:a.width,height:a.height});console.log('diff',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:.1}));writeFileSync('home-dark-diff.png',PNG.sync.write(d))
