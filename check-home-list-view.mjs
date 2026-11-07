import {chromium} from 'playwright-core'
import {PNG} from 'pngjs'
import pixelmatch from 'pixelmatch'
import {readFileSync,writeFileSync} from 'node:fs'
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),shots=[]
for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]){const c=await b.newContext({viewport:{width:1280,height:800},hasTouch:true,isMobile:true}),p=await c.newPage();await p.goto(`http://${host}/`);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.getByRole('radio',{name:'List view'}).tap();await p.waitForTimeout(300);console.log(name,'grid',await p.locator('.score-grid').count(),'list',await p.locator('.score-list').count(),'buttons',await p.locator('.segmented button').evaluateAll(es=>es.map(e=>e.getAttribute('aria-checked'))));await p.screenshot({path:`home-list-${name}.png`});shots.push(PNG.sync.read(readFileSync(`home-list-${name}.png`)));await p.getByRole('radio',{name:'Grid view'}).tap();await p.waitForTimeout(200);console.log(name,'back grid',await p.locator('.score-grid').count());await p.close()}
const d=new PNG({width:1280,height:800});console.log('diff',pixelmatch(shots[0].data,shots[1].data,d.data,1280,800,{threshold:.1}));writeFileSync('home-list-diff.png',PNG.sync.write(d));await b.close()
