import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]){
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.getByRole('tab',{name:'Properties'}).click();await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 console.log(name,'page',await page.locator('.page').first().boundingBox());await page.touchscreen.tap(326,507);await page.waitForTimeout(1000)
 console.log(name,'status',await page.locator('#status').innerText(),'inspector',(await page.locator('.inspector').innerText()).slice(0,500));const cue=page.getByRole('checkbox',{name:/Cue size/});if(await cue.count()){const before=await cue.isChecked();await cue.tap();console.log(name,'cue size',before,'to',await cue.isChecked());await page.screenshot({path:`inspector-note-cue-${name}.png`});await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/Undo/}).click();console.log(name,'cue undo',await cue.isChecked())}await page.screenshot({path:`inspector-note-cue-touch-${name}.png`});await page.close()
}
await browser.close();const a=PNG.sync.read(readFileSync('inspector-note-cue-touch-react.png')),b=PNG.sync.read(readFileSync('inspector-note-cue-touch-vue.png')),d=new PNG({width:a.width,height:a.height});console.log('diff',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:.1}));writeFileSync('inspector-note-cue-touch-diff.png',PNG.sync.write(d))
