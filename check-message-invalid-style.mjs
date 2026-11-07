// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for (const viewport of [{width:1280,height:800},{width:390,height:844}]) for (const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>{localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})); delete window.showOpenFilePicker})
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 await page.getByRole('menuitem',{name:'Format',exact:true}).click()
 const chooser=page.waitForEvent('filechooser');await page.getByRole('menuitem',{name:/Load style/}).click();await (await chooser).setFiles({name:'invalid.mss',mimeType:'application/xml',buffer:Buffer.from('invalid')})
 const dialog=page.locator('dialog.message-box[open]');await dialog.waitFor();console.log(name,viewport,await dialog.boundingBox(),await dialog.innerText())
 await page.screenshot({path:`message-invalid-${viewport.width}-${name}.png`});await dialog.getByRole('button',{name:'OK',exact:true}).click();await dialog.waitFor({state:'hidden'});assert.equal(await dialog.count(),0);await page.close()
} } finally {await browser.close()}
