// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try { for(const viewport of [{width:1280,height:800},{width:390,height:844}]) for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport});page.on('pageerror',e=>console.log(name,'error',e.message));page.on('console',m=>{if(m.type()==='error')console.log(name,m.text())});await page.goto(`http://${host}/`);await page.getByRole('button',{name:'New',exact:true}).click()
 await page.getByRole('listbox',{name:'Instruments'}).getByRole('option',{name:'Flute',exact:true}).click();await page.getByRole('button',{name:'Add selected instruments to score'}).click();await page.getByRole('button',{name:'Next',exact:true}).click();await page.getByPlaceholder('Untitled score').fill('Parity new score');await page.getByRole('button',{name:'Done',exact:true}).click();await page.waitForSelector('.page canvas',{timeout:30000}).catch(async e=>{await page.screenshot({path:`newscore-failure-${name}.png`});console.log(name,await page.locator('body').innerText());throw e});await page.waitForTimeout(2000)
 console.log(name,viewport,await page.locator('.notation-tab').allTextContents());assert.match((await page.locator('.notation-tab').allTextContents()).join(''),/Parity new score/);await page.screenshot({path:`newscore-created-${viewport.width}-${name}.png`});await page.close()
} } finally {await browser.close()}
