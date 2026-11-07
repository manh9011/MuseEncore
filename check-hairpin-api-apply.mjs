import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['react', 5180]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  page.on('console', msg=>console.log('browser',msg.text()));await page.route('http://scores.test/**', r => r.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscz`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  for(let y=495;y<530;y+=2){for(let x=800;x<940;x+=3){await page.mouse.click(x,y);let t=await page.locator('#status').innerText();if(t.toLowerCase().match(/hairpin|crescendo|decrescendo/)){console.log('FOUND',x,y,t);break}}if((await page.locator('#status').innerText()).toLowerCase().match(/hairpin|crescendo|decrescendo/))break}
  await page.waitForTimeout(1000)
  console.log(name,'panel',await page.locator('.insp-section').allTextContents());console.log(name, 'selection', await page.locator('#status').innerText(), 'sections', await page.locator('.insp-section').evaluateAll(es => es.map(e => e.getAttribute('data-section'))))
  console.log(name,'selection object',await page.evaluate(async()=>{const m=await import('/scoreview.ts');const s=m.currentScore();return s.selection().elements().map(e=>({type:e.type(),placement:e.placement(),system:e.systemFlag(),below:e.isSystemObjectBelowBottomStaff(),spanner:e.spanner?.() ? {placement:e.spanner().placement(),system:e.spanner().systemFlag(),below:e.spanner().isSystemObjectBelowBottomStaff()} : null}))}));console.log(name,'api',JSON.stringify(await page.evaluate(async()=>{const s=(await import('/scoreview.ts')).currentScore(),m=await import('/@fs/K:/Projects/JavaScript/MuseEncore/upstream/muse-encore/src/index.ts');const a=m.inspectorSections(s);const changes=m.inspectorPropertyChanges(s,{section:'SECTION_NOTATION',path:['TYPE_HAIRPIN'],property:'placement'},0);console.log('changes',JSON.stringify(changes.map(c=>({pid:c.pid,value:c.value,type:c.item.type()}))));m.applyInspectorChanges(s,changes);console.log('applied',s.selection().elements().map(e=>e.spanner?.()?.placement()));return a.map(x=>({key:x.key,sub:x.models?.map(y=>({key:y.key,placement:y.properties?.placement}))}))})));const above=page.getByRole('radiogroup',{name:'Position'}).getByRole('radio',{name:'Above'});await above.click();await page.waitForTimeout(400);console.log(name,'after object',await page.evaluate(async()=>{const s=(await import('/scoreview.ts')).currentScore();return s.selection().elements().map(e=>({placement:e.placement(),spanner:e.spanner?.()?.placement()}))}));console.log(name,'above',await above.getAttribute('aria-checked'),'status',await page.locator('#status').innerText(),'radios',await page.getByRole('radiogroup',{name:'Position'}).innerHTML());await page.getByRole('menuitem',{name:'Edit',exact:true}).click();await page.getByRole('menuitem',{name:/^Undo/}).click();await page.waitForTimeout(400);await page.mouse.click(806,501);await page.waitForTimeout(300);console.log(name,'undo above',await above.getAttribute('aria-checked'));await page.screenshot({ path: `inspector-hairpin-${name}.png` })
  await page.close()
}
await browser.close()
const a = PNG.sync.read(readFileSync('inspector-hairpin-react.png')), b = PNG.sync.read(readFileSync('inspector-hairpin-vue.png'))
const diff = new PNG({ width: a.width, height: a.height })
console.log('different pixels',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0.1}))
writeFileSync('inspector-hairpin-diff.png',PNG.sync.write(diff))
