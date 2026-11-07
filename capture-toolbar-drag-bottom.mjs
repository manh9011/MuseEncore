// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:{width:1280,height:800}})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 const grip=page.locator('[data-toolbar="playbackToolBar"] .toolbar-grip'),target=page.locator('[data-dock=bottom]');const a=await grip.boundingBox(),b=await target.boundingBox();await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(b.x+5,b.y+b.height/2,{steps:12});await page.waitForTimeout(300);await page.screenshot({path:`toolbar-drag-bottom-${name}.png`});console.log(name,'drag markers',await page.locator('.drop-marker').count());await page.mouse.up();await page.waitForTimeout(300)
 console.log(name,'orders',await page.locator('[data-dock]').evaluateAll(ds=>ds.map(d=>[d.dataset.dock,[...d.querySelectorAll(':scope > [data-toolbar]')].map(e=>e.dataset.toolbar)]))); console.log(name,'pointer drag reorder passed');await page.close()
} } finally {await browser.close()}
