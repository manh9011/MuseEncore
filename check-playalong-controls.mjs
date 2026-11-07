// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:{width:1280,height:800}})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz&playalong-input=test-melody`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000);await page.getByRole('button',{name:/^Playalong: listen/}).click();await page.waitForTimeout(30000);const measure=page.getByRole('status',{name:'Measure'});console.log(name,'measure',await measure.innerText());const practice=page.getByRole('button',{name:/^Playalong practice:/});await practice.click();if(await practice.getAttribute('aria-pressed')!=='true')throw Error('practice toggle failed');await practice.click();await page.getByRole('button',{name:/^Next measure/}).click();await page.waitForTimeout(300);console.log(name,'after next',await measure.innerText());await page.getByRole('button',{name:/^Playalong: listen/}).click();await page.waitForTimeout(500);if(await measure.count())throw Error('stop failed');await page.close()
} } finally {await browser.close()}
