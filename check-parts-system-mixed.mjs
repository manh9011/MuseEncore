import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for (const [name,base] of [['react','http://[::1]:5180'],['vue','http://127.0.0.1:5174']]) {
  const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1})
  await page.route('http://scores.test/**',r=>r.fulfill({path:'parts-mixed-systemtext-fixture.mscx',headers:{'access-control-allow-origin':'*'}}))
  let moduleUrl; page.on('response',r=>{if(r.url().includes('/scoreview.ts'))moduleUrl=r.url()})
  await page.goto(`${base}/?url=http://scores.test/test.mscx`); await page.getByRole('tab',{name:'Properties'}).click({timeout:30000}); await page.waitForTimeout(12000)
  await page.mouse.click(700,210); const cb=page.getByRole('checkbox',{name:'Exclude from parts'}); await cb.check(); await page.keyboard.down('Control'); await page.mouse.click(770,210); await page.keyboard.up('Control'); await page.waitForTimeout(500)
  const values=()=>page.evaluate(async url=>(await import(url)).currentScore().selection().elements().map(e=>({eligible:e.canBeExcludedFromOtherParts(),excluded:e.excludeFromOtherParts()})),moduleUrl)
  console.log(name,'mixed',await values(),'indeterminate',await cb.evaluate(e=>e.indeterminate)); assert.deepEqual((await values()).map(x=>x.excluded),[true,false]); assert.equal(await cb.evaluate(e=>e.indeterminate),true)
  await page.screenshot({path:`parts-system-mixed-${name}.png`}); await cb.check(); await page.waitForTimeout(500); console.log(name,'after',await values()); assert.deepEqual((await values()).map(x=>x.excluded),[true,true])
  await page.getByRole('menuitem',{name:'Edit',exact:true}).click(); await page.getByRole('menuitem',{name:/^Undo/}).click(); await page.waitForTimeout(500); await page.mouse.click(700,210); await page.keyboard.down('Control'); await page.mouse.click(770,210); await page.keyboard.up('Control'); await page.waitForTimeout(500); console.log(name,'undo',await values()); assert.deepEqual((await values()).map(x=>x.excluded),[true,false]); await page.close()
}
await browser.close(); const a=PNG.sync.read(readFileSync('parts-system-mixed-react.png')),b=PNG.sync.read(readFileSync('parts-system-mixed-vue.png')),d=new PNG({width:a.width,height:a.height}); console.log('diff',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:.1}));writeFileSync('parts-system-mixed-diff.png',PNG.sync.write(d))
