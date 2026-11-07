// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:{width:1280,height:800}})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 const open=async()=>{await page.getByRole('menuitem',{name:'File',exact:true}).click();await page.getByRole('menuitem',{name:/Project properties/}).click()}
 await open();let dialog=page.locator('dialog[open]').last();await dialog.getByRole('button',{name:'New property'}).click()
 await dialog.getByRole('textbox',{name:'Property',exact:true}).last().fill('Parity property');await dialog.getByRole('textbox',{name:'Value',exact:true}).last().fill('Parity value')
 await dialog.getByRole('button',{name:'OK',exact:true}).click();await open();dialog=page.locator('dialog[open]').last()
 assert.equal(await dialog.getByRole('textbox',{name:'Property',exact:true}).last().inputValue(),'Parity property');assert.equal(await dialog.getByRole('textbox',{name:'Value',exact:true}).last().inputValue(),'Parity value')
 await dialog.getByRole('textbox',{name:'Property',exact:true}).last().locator('..').getByRole('button',{name:'Delete'}).click();await dialog.getByRole('button',{name:'OK',exact:true}).click();await open()
 assert.equal(await page.locator('dialog[open]').last().getByRole('textbox',{name:'Property',exact:true}).count(),0)
 await page.locator('dialog[open]').last().getByRole('button',{name:'Cancel',exact:true}).click();await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await open()
 assert.equal(await page.locator('dialog[open]').last().getByRole('textbox',{name:'Property',exact:true}).last().inputValue(),'Parity property')
 console.log(`${name}: project property save/delete/undo pass`);await page.close()
} } finally {await browser.close()}
