// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await context.newPage()
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 await page.locator('[data-action="parts"]').tap();let d=page.locator('dialog[open]').last();const first=d.getByRole('option').first(),title=await first.locator('.part-title').innerText();await first.getByRole('button',{name:title,exact:true}).tap();await page.getByRole('menuitem',{name:'Duplicate'}).tap();const copy=d.getByRole('option').filter({hasText:`${title} (copy)`});await copy.tap();await d.getByRole('button',{name:'Open selected'}).tap();await page.locator('[data-action="parts"]').tap();d=page.locator('dialog[open]').last();const row=d.getByRole('option').filter({hasText:`${title} (copy)`});await row.getByRole('button',{name:`${title} (copy)`,exact:true}).tap();await page.getByRole('menuitem',{name:'Delete'}).tap();const question=page.locator('dialog[open]').last();console.log(name,'delete state',await question.innerText(),'confirm buttons',await question.getByRole('button').allTextContents());await page.close()
} } finally {await browser.close()}
