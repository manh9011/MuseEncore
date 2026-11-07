import {chromium} from 'playwright-core'
import {PNG} from 'pngjs'
import pixelmatch from 'pixelmatch'
import {readFileSync,writeFileSync} from 'node:fs'
const dark=process.argv.includes('--dark'),mobile=process.argv.includes('--mobile'),suffix=mobile?'-mobile':'', names=['File','Edit','View','Add','Format','Tools','Help']
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,port] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1280,height:800},deviceScaleFactor:1});if(dark)await page.emulateMedia({colorScheme:'dark'})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${port}/?url=http://scores.test/test.mscz`); await page.waitForSelector('.page canvas',{timeout:30000}); await page.waitForTimeout(12000)
 for(const menu of names) { const b=page.getByRole('menubar').getByRole('menuitem',{name:menu,exact:true}); await b.click(); console.log(name,menu,await page.getByRole('menu',{name:menu,exact:true}).boundingBox()); const box=await page.getByRole('menu',{name:menu,exact:true}).boundingBox();await page.screenshot({path:`menu-${menu.toLowerCase()}-${dark?'dark-':''}score-${name}${suffix}.png`});await page.screenshot({path:`menu-${menu.toLowerCase()}-${dark?'dark-':''}crop-${name}${suffix}.png`,clip:box}); await b.click() }
 await page.close()
}
await browser.close()
for(const menu of names){const id=menu.toLowerCase(),a=PNG.sync.read(readFileSync(`menu-${id}-${dark?'dark-':''}crop-react${suffix}.png`)),b=PNG.sync.read(readFileSync(`menu-${id}-${dark?'dark-':''}crop-vue${suffix}.png`)),d=new PNG({width:a.width,height:a.height});console.log(menu,'crop',a.width,a.height,b.width,b.height,pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:0.1}));writeFileSync(`menu-${id}-${dark?'dark-':''}crop-diff${suffix}.png`,PNG.sync.write(d))}
