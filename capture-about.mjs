import {chromium} from 'playwright-core'
import {PNG} from 'pngjs'
import pixelmatch from 'pixelmatch'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [suffix,viewport] of [['',{width:1280,height:800}],['-mobile',{width:390,height:844}]]) {for(const [name,port] of [['react',5180],['vue',5174]]) {const page=await browser.newPage({viewport,deviceScaleFactor:1});await page.goto(`http://127.0.0.1:${port}/`);await page.waitForTimeout(1000);await page.getByRole('menuitem',{name:'Help',exact:true}).click();await page.getByRole('menuitem',{name:/About MuseEncore/}).click();const dialog=page.locator('dialog[open], [role=dialog]').last();await dialog.waitFor();console.log(name,suffix,await dialog.boundingBox());await page.screenshot({path:`about-${name}${suffix}.png`});await page.keyboard.press('Escape');assert.equal(await dialog.count(),0);await page.close()}const a=PNG.sync.read(fs.readFileSync(`about-react${suffix}.png`)),b=PNG.sync.read(fs.readFileSync(`about-vue${suffix}.png`)),diff=new PNG({width:a.width,height:a.height});console.log(suffix,'different',pixelmatch(a.data,b.data,diff.data,a.width,a.height));fs.writeFileSync(`about-diff${suffix}.png`,PNG.sync.write(diff))}
await browser.close()
