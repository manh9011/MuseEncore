// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for (const viewport of [{width:1280,height:800}]) for (const [name,host] of [['react','[::1]:5180'],['vue','localhost:5174']]) {
 const page=await browser.newPage({viewport})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'MuseScore/share/templates/05-Jazz/03-Jazz_Combo/03-Jazz_Combo.mscx',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>{localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})); delete window.showOpenFilePicker})
 await page.goto(`http://${host}/?url=http://scores.test/test.mscx`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 await page.mouse.click(750,613,{button:'right'});await page.getByRole('menuitem',{name:/Customize kit/}).click();await page.waitForTimeout(1000);const d=page.locator('dialog.customize-kit');await page.evaluate(()=>{delete window.showOpenFilePicker});const chooser=page.waitForEvent('filechooser');await d.getByRole('button',{name:/Load/}).click();await (await chooser).setFiles({name:'old.drm',mimeType:'application/xml',buffer:Buffer.from('<museScore version="1.0"><Drumset/></museScore>')});const msg=page.locator('dialog.message-box[open]');await msg.waitFor();console.log(name,await msg.innerText(),await msg.boundingBox(),'focus',await page.evaluate(()=>document.activeElement?.textContent));await page.screenshot({path:`kit-warning-${name}.png`});await page.keyboard.press('Enter');await msg.waitFor({state:'hidden'});await d.getByRole('button',{name:'Cancel',exact:true}).click();
 await page.close()
} } finally {await browser.close()}
