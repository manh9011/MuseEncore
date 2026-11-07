// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for (const viewport of [{width:1280,height:800}]) for (const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'MuseScore/share/templates/05-Jazz/03-Jazz_Combo/03-Jazz_Combo.mscx',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>{localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})); delete window.showOpenFilePicker})
 await page.goto(`http://${host}/?url=http://scores.test/test.mscx`);await page.waitForSelector('.page canvas');await page.waitForTimeout(10000)
 await page.mouse.click(750,613,{button:'right'});await page.getByRole('menuitem',{name:/Customize kit/}).click();await page.waitForTimeout(1000);const d=page.locator('dialog.customize-kit');const voice=d.getByLabel('Default voice:');const line=d.getByLabel('Staff line:');const stem=d.getByLabel('Stem direction:');await voice.selectOption('2');console.log(name,'voice immediately',await voice.inputValue());await line.fill('3');await line.press('Tab');console.log(name,'voice after line',await voice.inputValue());await stem.selectOption({label:'Down'});await d.getByRole('button',{name:'OK',exact:true}).click();await d.waitFor({state:'hidden'});await page.mouse.click(750,613,{button:'right'});await page.getByRole('menuitem',{name:/Customize kit/}).click();await d.waitFor();console.log(name,'settings',await voice.inputValue(),await line.inputValue(),await stem.locator('option:checked').innerText());if(await voice.inputValue()!=='1'||await line.inputValue()!=='3'||await stem.locator('option:checked').innerText()!=='Down')throw Error('settings not persisted');await d.getByRole('button',{name:'Cancel',exact:true}).click();
 await page.close()
} } finally {await browser.close()}
