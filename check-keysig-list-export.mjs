import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180], ['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, acceptDownloads: true })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => {Object.defineProperty(window,'showSaveFilePicker',{value:undefined});localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } }))})
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  for(let i=0;i<3;i++) await page.getByRole('button',{name:'Zoom in'}).click();await page.waitForTimeout(500);await page.mouse.click(461,313)
  await page.waitForTimeout(1000)
  console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  const cb=page.getByRole('checkbox',{name:'Show courtesy key signature'});console.log(name,'before',await cb.isChecked());await cb.click();await page.waitForTimeout(400);console.log(name,'after',await cb.isChecked());await page.getByRole('menuitem',{name:'File',exact:true}).click();await page.getByRole('menuitem',{name:/Export/}).click();await page.locator('#export-format').selectOption({label:'MuseScore file'});const [download]=await Promise.all([page.waitForEvent('download'),page.locator('dialog[open]').getByRole('button',{name:/Export/}).click()]);const {unzipSync,strFromU8}=await import('fflate');const files=unzipSync(new Uint8Array(await (await import('node:fs/promises')).readFile(await download.path())));const xml=strFromU8(files[Object.keys(files).find(k=>k.endsWith('.mscx'))]);writeFileSync(`keysig-list-${name}.mscx`,xml);console.log(name,'courtesy-zero',xml.match(/<showCourtesySig>0<\/showCourtesySig>/g)?.length??0)
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('inspector-keysig-react.png')), b = PNG.sync.read(readFileSync('inspector-keysig-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}))
writeFileSync('inspector-keysig-diff.png',PNG.sync.write(diff))
