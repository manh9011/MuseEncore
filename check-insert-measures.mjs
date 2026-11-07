// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:{width:1280,height:800}})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 const count=()=>page.locator('.page').count();const before=await count()
 await page.getByRole('menuitem',{name:'Add',exact:true}).click();await page.getByRole('menuitem',{name:'Measures',exact:true}).hover();await page.getByRole('menuitem',{name:'Insert at end of score…'}).click();await page.locator('dialog[open] input').fill('30');await page.locator('dialog[open]').getByRole('button',{name:'OK',exact:true}).click();await page.waitForTimeout(2000);assert.ok(await count()>before)
 await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(2000);assert.equal(await count(),before)
 console.log(`${name}: insert measures and undo page count pass`);await page.close()
} } finally {await browser.close()}
