// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await context.newPage()
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 const trigger=page.locator('.dock-top').getByRole('button',{name:'Add',exact:true});await trigger.tap();const menu=page.getByRole('menu',{name:'Add',exact:true})
 assert.ok(await menu.isVisible())
 const measures=menu.getByRole('menuitem',{name:'Measures'});await measures.tap();const submenu=page.getByRole('menu',{name:'Measures'});await submenu.waitFor();assert.ok(await submenu.getByRole('menuitem').count()>0)
 await page.keyboard.press('Escape');await page.waitForTimeout(150);await page.keyboard.press('Escape');await page.waitForTimeout(150);console.log(name,'menus after Esc',await page.getByRole('menu').count())
 console.log(`${name}: toolbar Add submenu navigation passes`);await page.close()
} } finally {await browser.close()}
