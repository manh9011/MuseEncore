import {chromium} from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,port] of [['react',5180],['vue',5174]]) {
 const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>console.log(name,'error',e.message))
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}));await page.addInitScript(()=>localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}})))
 await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`);await page.getByRole('tab',{name:'Layout'}).click({timeout:30000});await page.waitForTimeout(10000)
 const add=page.getByRole('button',{name:'Add instruments or system markings'});await add.click();await page.getByRole('menuitem',{name:'New instrument'}).click();const dialog=page.getByRole('dialog',{name:'Add or remove instruments'});await dialog.waitFor();await dialog.getByRole('listbox',{name:'Instruments'}).getByRole('option',{name:'Flute',exact:true}).click();await dialog.getByRole('button',{name:'Add selected instruments to score'}).click();await dialog.getByRole('button',{name:'OK',exact:true}).click();await dialog.waitFor({state:'hidden'});await page.waitForTimeout(4000)
 console.log(name,'after add',await page.locator('.layout-row').allTextContents());assert.match((await page.locator('.layout-row').allTextContents()).join(' '),/Flute/)
 await add.click();const item=page.getByRole('menuitem',{name:/System markings/});console.log(name,'disabled',await item.getAttribute('aria-disabled'));assert.equal(await item.getAttribute('aria-disabled'),'false');await item.click();await page.waitForTimeout(2500)
 const rows=await page.locator('.layout-row').allTextContents();console.log(name,'after markings',rows);assert.equal(rows.filter(x=>x.includes('System texts')).length,2)
 await page.getByRole('menuitem',{name:'Edit',exact:true}).click();const undo=page.getByRole('menuitem',{name:/^Undo/});console.log(name,'undo disabled',await undo.getAttribute('aria-disabled'));await undo.click();await page.waitForTimeout(1500);assert.equal((await page.locator('.layout-row').allTextContents()).filter(x=>x.includes('System texts')).length,1)
 await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(1500);assert.doesNotMatch((await page.locator('.layout-row').allTextContents()).join(' '),/Flute/)
 console.log(name,'undo markings and instrument passed');await page.close()
}
await browser.close()
