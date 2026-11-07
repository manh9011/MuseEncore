import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', '[::1]:5180'], ['vue', '127.0.0.1:5174']]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`http://${port}/?url=http://scores.test/test.mscz`)
  await page.waitForSelector('#viewport');await page.waitForTimeout(12000);await page.locator('[data-action=parts]').click();const d=page.locator('dialog[open]').last();await d.getByRole('option').filter({hasText:'Piano'}).click();await d.getByRole('button',{name:'Open selected'}).click();console.log(name,'tabs',await page.locator('.notation-tab').allTextContents());await page.locator('.notation-tab').last().click();await page.getByRole('tab',{name:'Layout'}).click();console.log(name,'tree',await page.locator('[role=treeitem]').allTextContents());await page.getByRole('treeitem',{name:'Piano'}).getByRole('button',{name:'Settings'}).click();const popup=page.getByRole('dialog',{name:'Settings'});console.log(name,'settings',await popup.innerText());await popup.getByRole('textbox',{name:'Name on part score'}).fill('Changed piano');await popup.getByRole('textbox',{name:'Name on part score'}).press('Enter');await popup.getByRole('button',{name:'Reset all formatting'}).tap();const msg=page.locator('dialog[open]').last();console.log(name,'confirm',await msg.innerText());await page.screenshot({path:`part-reset-yes-mobile-${name}.png`});await msg.getByRole('button',{name:'Yes',exact:true}).tap();await page.waitForTimeout(2000);await page.getByRole('treeitem',{name:'Piano'}).getByRole('button',{name:'Settings'}).click();console.log(name,'reset name',await page.getByRole('dialog',{name:'Settings'}).getByRole('textbox',{name:'Name on part score'}).inputValue());console.log(name,'reset closed',await msg.count(),'tabs',await page.locator('.notation-tab').allTextContents(),'tree',await page.locator('[role=treeitem]').allTextContents());
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('part-reset-yes-mobile-react.png')), b = PNG.sync.read(readFileSync('part-reset-yes-mobile-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}))
writeFileSync('part-reset-yes-mobile-diff.png',PNG.sync.write(diff))
