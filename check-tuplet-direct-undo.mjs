// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','localhost:5180'],['vue','localhost:5174']]) {
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 let moduleUrl;page.on('response',r=>{if(r.url().includes('/scoreview.ts'))moduleUrl=r.url()});await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 const image=()=>page.locator('.page canvas').first().evaluate(e=>e.toDataURL());const deselect=async()=>{await page.locator('#viewport').focus();await page.keyboard.press('Escape');await page.waitForTimeout(500)};await deselect();const before=await image()
 console.log(name,'page bounds',await page.locator('.page').first().boundingBox());await page.screenshot({path:`tuplet-direct-start-${name}.png`});await page.touchscreen.tap(326,507);console.log(name,'status',await page.locator('#status').innerText());await page.getByRole('menuitem',{name:'Add',exact:true}).click();await page.getByRole('menuitem',{name:'Tuplets',exact:true}).hover();await page.getByRole('menuitem',{name:'Other…'}).click();await page.waitForTimeout(500);await page.getByLabel('Ratio:',{exact:true}).fill('5');await page.getByRole('button',{name:'OK',exact:true}).click();await page.waitForTimeout(2000);assert.notEqual(await image(),before);console.log(name,'selection',JSON.stringify(await page.evaluate(async u=>(await import(u)).currentScore().selection().elements().map(e=>({type:e.type(),tuplet:e.tuplet?.()?{ratio:e.tuplet().ratio().toString(),count:e.tuplet().elements().length,types:e.tuplet().elements().map(x=>x.type())}:null})),moduleUrl)))
 await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(2000);await deselect();assert.equal(await image(),before,'mobile canvas differs after Undo')
 console.log(`${name}: mobile tuplet apply/undo passes`);await page.close()
} } finally {await browser.close()}
