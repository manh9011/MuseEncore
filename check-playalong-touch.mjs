// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await context.newPage()
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz&playalong-input=test-melody`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000);await page.getByRole('button',{name:/^Playalong: listen/}).tap();await page.waitForTimeout(30000);const measure=page.getByRole('status',{name:'Measure'});console.log(name,'measure',await measure.innerText());const practice=page.getByRole('button',{name:/^Playalong practice:/});await practice.tap();if(await practice.getAttribute('aria-pressed')!=='true')throw Error('practice toggle failed');await practice.tap();await page.getByRole('button',{name:/^Next measure/}).tap();await page.waitForTimeout(300);console.log(name,'after next',await measure.innerText());await page.getByRole('button',{name:/^Playalong: listen/}).tap();await page.waitForTimeout(500);if(await measure.count())throw Error('stop failed');await page.close()
} } finally {await browser.close()}
