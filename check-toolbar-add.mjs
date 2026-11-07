// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:{width:1280,height:800}})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 const trigger=page.locator('.dock-top').getByRole('button',{name:'Add',exact:true});await trigger.click();const menu=page.getByRole('menu',{name:'Add',exact:true})
 assert.deepEqual(await menu.getByRole('menuitem').allTextContents(),['Notes','Intervals','Measures','Frames','Text','Lines','Chords and fretboard diagrams'].map(s=>s+''))
 await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowRight');const submenu=page.getByRole('menu',{name:'Measures'});await submenu.waitFor();assert.ok(await submenu.getByRole('menuitem').count()>0)
 await page.keyboard.press('ArrowLeft');assert.equal(await submenu.count(),0);await page.keyboard.press('Escape');assert.equal(await menu.count(),0);assert.equal(await trigger.evaluate(e=>e===document.activeElement),true)
 console.log(`${name}: toolbar Add submenu navigation passes`);await page.close()
} } finally {await browser.close()}
