// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:{width:1280,height:800}})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 const image=()=>page.locator('.page canvas').first().evaluate(e=>e.toDataURL());const deselect=async()=>{await page.locator('#viewport').focus();await page.keyboard.press('Escape');await page.waitForTimeout(500)};await deselect();const before=await image()
 await page.mouse.click(685,263);await page.getByRole('menuitem',{name:'Add',exact:true}).click();await page.getByRole('menuitem',{name:'Tuplets',exact:true}).hover();await page.getByRole('menuitem',{name:'Other…'}).click();await page.getByLabel('Ratio:',{exact:true}).fill('5');await page.getByRole('button',{name:'OK',exact:true}).click();await page.waitForTimeout(2000);assert.notEqual(await image(),before)
 await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(2000);await deselect();assert.ok((await image())===before, 'canvas differs after undo; selection or layout state may differ')
 console.log(`${name}: tuplet apply/undo passes`);await page.close()
} } finally {await browser.close()}
