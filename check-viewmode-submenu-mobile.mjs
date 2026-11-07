import {chromium} from 'playwright-core'
import assert from 'node:assert/strict'
import {PNG} from 'pngjs'
import pixelmatch from 'pixelmatch'
import {readFileSync,writeFileSync} from 'node:fs'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,port] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${port}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas',{timeout:30000});await page.waitForTimeout(12000)
 await page.getByRole('menubar').getByRole('menuitem',{name:'View',exact:true}).click()
 const item=page.getByRole('menu',{name:'View'}).locator('[aria-haspopup="menu"][aria-disabled="false"]').last(); console.log(name,'submenu item',await item.innerText()); await item.hover(); await page.waitForTimeout(300)
 const sub=page.getByRole('menu').last();console.log(name,'submenu',await sub.getAttribute('aria-label'),await sub.boundingBox());await page.screenshot({path:`menu-submenu-viewmode-mobile-${name}.png`})
 await sub.focus(); await page.keyboard.press('ArrowLeft'); assert.equal(await page.getByRole('menu').count(),1);await page.keyboard.press('Escape');assert.equal(await page.getByRole('menu').count(),0)
 console.log(name,'submenu left/Escape passed');await page.close()
}
await browser.close();const a=PNG.sync.read(readFileSync('menu-submenu-viewmode-mobile-react.png')),b=PNG.sync.read(readFileSync('menu-submenu-viewmode-mobile-vue.png')),d=new PNG({width:a.width,height:a.height});console.log('different pixels',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:0.1}));writeFileSync('menu-submenu-viewmode-mobile-diff.png',PNG.sync.write(d))
