// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for (const viewport of [{width:1280,height:800}]) for (const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'MuseScore/share/templates/05-Jazz/03-Jazz_Combo/03-Jazz_Combo.mscx',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>{localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})); delete window.showOpenFilePicker})
 await page.goto(`http://${host}/?url=http://scores.test/test.mscx`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 await page.mouse.click(750,613,{button:'right'});await page.getByRole('menuitem',{name:/Staff.Part properties/}).click();await page.waitForTimeout(500);await page.getByRole('button',{name:/Advanced style properties/}).click();await page.waitForTimeout(500);const parent=page.locator('dialog.edit-staff');const d=page.locator('dialog.edit-staff-type');const lines=d.getByLabel('Lines:',{exact:true});await lines.fill('4');await d.getByRole('button',{name:'Cancel',exact:true}).click();await d.waitFor({state:'hidden'});if(await parent.getByLabel('Lines:',{exact:true}).first().inputValue()!=='5')throw Error('nested cancel failed');await parent.getByRole('button',{name:/Advanced style properties/}).click();await d.waitFor();await lines.fill('4');await d.getByRole('button',{name:'OK',exact:true}).click();await d.waitFor({state:'hidden'});await parent.getByLabel('Lines:',{exact:true}).first().waitFor();await page.waitForTimeout(300);console.log(name,'parent lines',await parent.getByLabel('Lines:',{exact:true}).first().inputValue());if(await parent.getByLabel('Lines:',{exact:true}).first().inputValue()!=='4')throw Error('nested OK failed');await parent.getByRole('button',{name:'OK',exact:true}).click();await parent.waitFor({state:'hidden'});
 await page.close()
} } finally {await browser.close()}
