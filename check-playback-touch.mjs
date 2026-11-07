import {chromium} from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]){
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),page=await context.newPage()
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/x.mscz`);await page.waitForSelector('.page canvas',{timeout:30000});await page.waitForTimeout(9000)
 const play=page.locator('[data-toolbar="playbackToolBar"] [data-action="play"]');await play.tap();await page.waitForTimeout(500)
 console.log(name,'cursor after start',await page.locator('.playback-cursor').boundingBox());await play.tap();console.log(name,'play/pause touch passed');await page.close()
}
await browser.close()
