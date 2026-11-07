import {chromium} from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]){
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),page=await context.newPage()
 await page.goto(`http://${host}/`);await page.waitForTimeout(1500)
 const file=page.getByRole('menuitem',{name:'File',exact:true});await file.tap()
 const menu=page.getByRole('menu',{name:'File'});await menu.waitFor();console.log(name,'File menu',await menu.boundingBox())
 const editButton=page.getByRole('menubar').getByRole('menuitem',{name:'Edit',exact:true});await editButton.tap();await editButton.tap()
 const edit=page.getByRole('menu',{name:'Edit'});await edit.waitFor();await edit.getByRole('menuitem',{name:/Preferences/}).tap()
 const dialog=page.getByRole('dialog',{name:'Preferences'});await dialog.waitFor();console.log(name,'Preferences',await dialog.boundingBox());await page.keyboard.press('Escape');assert.equal(await dialog.count(),0);await page.close()
}
await browser.close()
