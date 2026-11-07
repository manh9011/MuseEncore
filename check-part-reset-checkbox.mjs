import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`http://localhost:${port}/?url=http://scores.test/test.mscz`)
  await page.waitForSelector('#viewport');await page.waitForTimeout(12000);await page.locator('[data-action=parts]').click();const d=page.locator('dialog[open]').last();await d.getByRole('option').filter({hasText:'Piano'}).click();await d.getByRole('button',{name:'Open selected'}).click();console.log(name,'tabs',await page.locator('.notation-tab').allTextContents());await page.locator('.notation-tab').last().click();await page.getByRole('tab',{name:'Layout'}).click();console.log(name,'tree',await page.locator('[role=treeitem]').allTextContents());await page.getByRole('treeitem',{name:'Piano'}).getByRole('button',{name:'Settings'}).click();const popup=page.getByRole('dialog',{name:'Settings'});console.log(name,'settings',await popup.innerText());const checkbox=popup.getByRole('checkbox');console.log(name,'initial checkbox',await checkbox.isChecked());await checkbox.click();console.log(name,'changed checkbox',await checkbox.isChecked());await popup.getByRole('button',{name:'Reset all formatting'}).click();const msg=page.locator('dialog[open]').last();console.log(name,'confirm',await msg.innerText());await page.screenshot({path:`part-reset-${name}.png`});await msg.getByRole('button',{name:'Yes',exact:true}).click();await page.waitForTimeout(2000);await page.getByRole('treeitem',{name:'Piano'}).getByRole('button',{name:'Settings'}).click();console.log(name,'reset checkbox',await page.getByRole('dialog',{name:'Settings'}).getByRole('checkbox').isChecked());console.log(name,'reset closed',await msg.count(),'tabs',await page.locator('.notation-tab').allTextContents(),'tree',await page.locator('[role=treeitem]').allTextContents());
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('part-reset-react.png')), b = PNG.sync.read(readFileSync('part-reset-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}))
writeFileSync('part-reset-diff.png',PNG.sync.write(diff))
