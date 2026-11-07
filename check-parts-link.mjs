// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:{width:1280,height:800}})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 await page.locator('[data-action="parts"]').click();let d=page.locator('dialog[open]').last();const first=d.getByRole('option').first(),title=await first.locator('.part-title').innerText();await first.getByRole('button',{name:title,exact:true}).click();await page.getByRole('menuitem',{name:'Duplicate'}).click();const copy=d.getByRole('option').filter({hasText:`${title} (copy)`});await copy.click();await d.getByRole('button',{name:'Open selected'}).click();await page.getByRole('tab',{name:`${title} (copy)`}).click();await page.getByRole('tab',{name:'Properties'}).click();await page.waitForTimeout(2000);await page.mouse.click(706,254);await page.waitForTimeout(1000);console.log(name,'status',await page.locator('#status').innerText(),'parts',await page.locator('[data-section=SECTION_PARTS]').allTextContents());await page.screenshot({path:`parts-link-${name}.png`});await page.close()
} } finally {await browser.close()}
