import {chromium} from 'playwright-core'
import assert from 'node:assert/strict'
import {PNG} from 'pngjs'
import pixelmatch from 'pixelmatch'
import {readFileSync,writeFileSync} from 'node:fs'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]){
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),page=await context.newPage()
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.palette-header');await page.waitForTimeout(6000)
 const h=page.locator('.palette-header').first();await h.tap();await h.getByRole('button',{name:'Clefs: Menu'}).tap();const menu=page.getByRole('menu',{name:'Clefs'});await menu.waitFor();console.log(name,'menu',await menu.boundingBox(),await menu.innerText());await page.screenshot({path:`palette-header-touch-${name}.png`})
 await page.close()
}
await browser.close();const a=PNG.sync.read(readFileSync('palette-header-touch-react.png')),b=PNG.sync.read(readFileSync('palette-header-touch-vue.png')),d=new PNG({width:a.width,height:a.height});console.log('diff',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:.1}));writeFileSync('palette-header-touch-diff.png',PNG.sync.write(d))
