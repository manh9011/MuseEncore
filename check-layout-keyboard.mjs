import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,port] of [['react',5180],['vue',5174]]) {
 const page=await browser.newPage({viewport:{width:1280,height:800}})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://127.0.0.1:${port}/?url=http://scores.test/test.mscz`);await page.getByRole('tab',{name:'Layout'}).click({timeout:30000});await page.waitForTimeout(10000)
 const piano=page.getByRole('treeitem',{name:'Piano'});await piano.focus();await page.keyboard.press('ArrowRight');assert.equal(await piano.getAttribute('aria-expanded'),'true');await page.keyboard.press('ArrowDown');assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Treble clef');await page.keyboard.press(' ');console.log(name,'selected',await page.getByRole('treeitem',{name:'Treble clef'}).getAttribute('aria-selected'));assert.equal(await page.getByRole('treeitem',{name:'Treble clef'}).getAttribute('aria-selected'),'true');await page.keyboard.press('ArrowLeft');assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'Piano');await page.keyboard.press('ArrowLeft');assert.equal(await piano.getAttribute('aria-expanded'),'false');console.log(name,'tree keyboard passed');await page.close()
}
await browser.close()
