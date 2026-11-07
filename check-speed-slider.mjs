// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:{width:1280,height:800}})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 const trigger=page.locator('.tempo-button');await trigger.click();let popup=page.locator('.speed-popup'),range=popup.locator('input[type=range]');const before=await range.inputValue(),box=await range.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width*.8,box.y+box.height/2,{steps:5});await page.mouse.up();const value=await range.inputValue();assert.notEqual(value,before);await page.keyboard.press('Escape');await trigger.click();popup=page.locator('.speed-popup');assert.equal(await popup.locator('input[type=range]').inputValue(),value);await page.reload();await page.waitForSelector('.page canvas');await page.waitForTimeout(10000);await trigger.click();console.log(name,'slider drag/reopen',value,'after reload',await page.locator('.speed-popup input[type=range]').inputValue());await page.close()
} } finally {await browser.close()}
