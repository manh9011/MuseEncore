// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for (const viewport of [{width:1280,height:800}]) for (const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'MuseScore/share/templates/04-Solo/01-Guitar/01-Guitar.mscx',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>{localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})); delete window.showOpenFilePicker})
 await page.goto(`http://${host}/?url=http://scores.test/test.mscx`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 await page.mouse.click(700,258,{button:'right'});await page.getByRole('menuitem',{name:/Staff.Part properties/}).click();await page.waitForTimeout(500);await page.getByRole('button',{name:/Advanced style properties/}).click();await page.waitForTimeout(3000);console.log(name,await page.getByRole('dialog').count(),await page.locator('dialog.edit-staff-type canvas').evaluateAll(es=>es.map(e=>({width:e.width,height:e.height}))));await page.screenshot({path:`staff-type-standard-${name}.png`});
 await page.close()
} } finally {await browser.close()}
