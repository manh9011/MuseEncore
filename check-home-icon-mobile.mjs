import {chromium} from 'playwright-core'
import {PNG} from 'pngjs'
import pixelmatch from 'pixelmatch'
import {readFileSync,writeFileSync} from 'node:fs'
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}), a=[]
for(const [n,h] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]){const p=await b.newPage({viewport:{width:390,height:844}});await p.goto('http://'+h+'/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:`home-icon-${n}.png`});console.log(n,await p.locator('.segmented button').evaluateAll(es=>es.map(e=>({text:e.textContent,check:document.fonts.check('16px MusescoreIcon'),color:getComputedStyle(e).color,rect:e.getBoundingClientRect().toJSON()}))));a.push(PNG.sync.read(readFileSync(`home-icon-${n}.png`)));await p.close()}
const d=new PNG({width:390,height:844});console.log('pixels',pixelmatch(a[0].data,a[1].data,d.data,390,844,{threshold:.1}));writeFileSync('home-icon-diff.png',PNG.sync.write(d));await b.close()
