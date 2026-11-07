// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:{width:1280,height:800}})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>{localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}}));window.showSaveFilePicker=undefined})
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 await page.getByRole('menuitem',{name:'File',exact:true}).click();await page.getByRole('menuitem',{name:'Save as…'}).click()
 const dialog=page.locator('dialog[open]').last();await dialog.locator('input').fill('Parity save');const download=page.waitForEvent('download');await dialog.getByRole('button',{name:'Save to computer'}).click()
 assert.match((await download).suggestedFilename(),/^Parity save\.mscz$/i)
 await page.getByRole('menuitem',{name:'File',exact:true}).click();await page.getByRole('menuitem',{name:'Save as…'}).click()
 const browserDialog=page.locator('dialog[open]').last();await browserDialog.locator('input').fill('Browser parity');await browserDialog.getByRole('button',{name:'Save',exact:true}).click()
 await page.waitForFunction(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('musescoreweb-scores');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});const rows=await new Promise((resolve,reject)=>{const r=db.transaction('scores').objectStore('scores').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});db.close();return rows.some(row=>row.name?.includes('Browser parity'))})
 console.log(`${name}: computer download and browser save pass`);await page.close()
} } finally {await browser.close()}
