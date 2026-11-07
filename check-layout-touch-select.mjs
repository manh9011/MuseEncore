import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,port] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await context.newPage()
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${port}/?url=http://scores.test/test.mscz`);await page.getByRole('tab',{name:'Layout'}).click({timeout:30000});await page.waitForTimeout(10000)
 const piano=page.getByRole('treeitem',{name:'Piano'});await piano.tap();await page.waitForTimeout(120);await piano.tap();assert.equal(await piano.getAttribute('aria-expanded'),'true');await page.keyboard.press('ArrowDown');assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Treble clef');await page.locator('.layout-row').filter({hasText:'Treble clef'}).tap();console.log(name,'selected',await page.getByRole('treeitem',{name:'Treble clef'}).getAttribute('aria-selected'));assert.equal(await page.getByRole('treeitem',{name:'Treble clef'}).getAttribute('aria-selected'),'true');console.log(name,'tree keyboard passed');await page.close()
}
await browser.close()
