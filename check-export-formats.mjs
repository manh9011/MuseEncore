import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { unzipSync, strFromU8 } from 'fflate'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,host] of [['react','[::1]:5180'],['vue','127.0.0.1:5174']]) {
 const page=await browser.newPage({viewport:{width:1280,height:800},acceptDownloads:true})
 await page.route('http://scores.test/**',r=>r.fulfill({path:'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz',headers:{'access-control-allow-origin':'*'}}))
 await page.addInitScript(()=>{localStorage.setItem('musescoreweb:settings',JSON.stringify({project:{migration:{Pre_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false},Ver_3_6:{appVersion:470,isApplyMigration:false,isAskAgain:false}}}}));Object.defineProperty(window,'showSaveFilePicker',{value:undefined})})
 await page.goto(`http://${host}/?url=http://scores.test/test.mscz`);await page.waitForSelector('.page canvas',{timeout:30000});await page.waitForTimeout(10000)
 await page.getByRole('menuitem',{name:'File',exact:true}).click();await page.getByRole('menuitem',{name:'Export…'}).click();await page.locator('dialog[open]').waitFor()
 const format=page.locator('#export-format'); console.log(name,await format.locator('option').allTextContents())
 await format.selectOption({label:'PDF file'});const input=page.locator('#export-resolution');await input.fill('150');await input.press('Enter');assert.equal(await input.inputValue(),'150')
 await page.getByLabel('Grayscale').check();assert.equal(await page.getByLabel('Grayscale').isChecked(),true)
 const [download]=await Promise.all([page.waitForEvent('download',{timeout:60000}),page.getByRole('button',{name:'Export…'}).click()]);assert.match(download.suggestedFilename(),/\.pdf$/i);assert.equal(await download.failure(),null);console.log(name,'PDF settings and download passed',download.suggestedFilename())
 await page.getByRole('menuitem',{name:'File',exact:true}).click();await page.getByRole('menuitem',{name:'Export…'}).click();await page.locator('#export-format').selectOption({label:'SVG images'})
 await page.getByLabel('Masking compatibility (Adobe Illustrator only)').check()
 const [svg]=await Promise.all([page.waitForEvent('download',{timeout:60000}),page.getByRole('button',{name:'Export…'}).click()]);assert.match(svg.suggestedFilename(),/\.(svg|zip)$/i);assert.equal(await svg.failure(),null);const data=new Uint8Array(await readFile(await svg.path()));const files=svg.suggestedFilename().endsWith('.zip') ? Object.values(unzipSync(data)) : [data];assert.ok(files.length>0);assert.ok(files.every(file=>strFromU8(file).includes('<svg')));console.log(name,'SVG download contains',files.length,'SVG pages')
 await page.getByRole('menuitem',{name:'File',exact:true}).click();await page.getByRole('menuitem',{name:'Export…'}).click();await page.locator('#export-format').selectOption({label:'MIDI file'})
 const [midi]=await Promise.all([page.waitForEvent('download',{timeout:60000}),page.getByRole('button',{name:'Export…'}).click()]);assert.match(midi.suggestedFilename(),/\.mid$/i);assert.equal(await midi.failure(),null);assert.equal((await readFile(await midi.path())).subarray(0,4).toString(),'MThd');console.log(name,'MIDI header passes')
 await page.getByRole('menuitem',{name:'File',exact:true}).click();await page.getByRole('menuitem',{name:'Export…'}).click();await page.locator('#export-format').selectOption({label:'MusicXML'})
 const [xml]=await Promise.all([page.waitForEvent('download',{timeout:60000}),page.getByRole('button',{name:'Export…'}).click()]);assert.equal(await xml.failure(),null);const xmlData=new Uint8Array(await readFile(await xml.path()));const xmlFiles=xml.suggestedFilename().endsWith('.mxl') ? Object.values(unzipSync(xmlData)) : [xmlData];assert.ok(xmlFiles.some(file=>strFromU8(file).includes('<score-partwise')));console.log(name,'MusicXML score structure passes')
 await page.getByRole('menuitem',{name:'File',exact:true}).click();await page.getByRole('menuitem',{name:'Export…'}).click();await page.locator('#export-format').selectOption({label:'PNG images'});const resolution=page.locator('#export-resolution');await resolution.fill('32');await resolution.press('Enter')
 const [png]=await Promise.all([page.waitForEvent('download',{timeout:60000}),page.getByRole('button',{name:'Export…'}).click()]);assert.equal(await png.failure(),null);const pngData=new Uint8Array(await readFile(await png.path()));const pages=png.suggestedFilename().endsWith('.zip') ? Object.values(unzipSync(pngData)) : [pngData];assert.equal(pages.length,5);assert.ok(pages.every(file=>Buffer.from(file.subarray(0,8)).equals(Buffer.from([137,80,78,71,13,10,26,10]))));console.log(name,'PNG archive contains five PNG pages')
 await page.getByRole('menuitem',{name:'File',exact:true}).click();await page.getByRole('menuitem',{name:'Export…'}).click();await page.locator('#export-format').selectOption({label:'MuseScore file'})
 const [score]=await Promise.all([page.waitForEvent('download',{timeout:60000}),page.getByRole('button',{name:'Export…'}).click()]);assert.match(score.suggestedFilename(),/\.mscz$/i);assert.equal(await score.failure(),null);const scoreFiles=unzipSync(new Uint8Array(await readFile(await score.path())));assert.ok(Object.keys(scoreFiles).some(key=>key.endsWith('.mscx')));console.log(name,'MuseScore archive contains score');await page.close()
}
await browser.close()
