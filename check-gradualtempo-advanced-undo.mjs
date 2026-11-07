import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
for (const [name, port] of [['vue', 5174]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  await page.route('http://scores.test/**', r => r.fulfill({ path: 'MuseScore/src/engraving/tests/tempomap_data/gradual_tempo_change_rallentando/gradual_tempo_change_rallentando.mscx', headers: { 'access-control-allow-origin': '*' } }))
  await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
  await page.goto(`${port===5180?'http://[::1]':'http://127.0.0.1'}:${port}/?url=http://scores.test/test.mscx`)
  await page.getByRole('tab', { name: 'Properties' }).click({ timeout: 30000 })
  await page.waitForTimeout(12000)
  await page.mouse.click(909,243); await page.waitForTimeout(700); const section=page.locator('[data-section=SECTION_NOTATION]'); await section.getByRole('button',{name:'Show more'}).click(); const input=section.getByRole('textbox',{name:'change Factor'}); console.log('before',await input.inputValue()); await input.fill('0.5'); await input.press('Tab'); await page.waitForTimeout(500); console.log('after',await input.inputValue()); if(await input.inputValue() !== '0.5') throw Error('edit'); await page.getByRole('menuitem',{name:'Edit',exact:true}).click(); await page.getByRole('menuitem',{name:/^Undo/}).click(); await page.waitForTimeout(500); await page.mouse.click(909,243); await page.waitForTimeout(500); await section.getByRole('button',{name:'Show more'}).click(); console.log('undo',await input.inputValue()); if(await input.inputValue() !== '0.75') throw Error('undo'); await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(500); console.log('mobile visible',await input.isVisible()); await page.screenshot({path:'gradualtempo-advanced-mobile-vue.png'});
  await page.close()
}
await browser.close()
