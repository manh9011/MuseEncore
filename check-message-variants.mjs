// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
try {
  for (const [name, host, module] of [['react','[::1]:5180','/components/MessageBox.tsx'], ['vue','127.0.0.1:5174','/components/MessageBox.vue']]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    await page.goto(`http://${host}/`)
    await page.waitForSelector('.app-root');await page.waitForTimeout(2000);page.on('console',m=>console.log(name,m.text()));page.on('pageerror',e=>console.log(name,e.message))
    for (const [buttons, expected] of [[['ok'], 'ok'], [['cancel','ignore'], 'ignore']]) {
      await page.evaluate(({ module, buttons }) => { import(module).then(m => { m.showMessage('Warning', 'Detail text', buttons).then(result => { window.messageResult = result }) }) }, { module, buttons })
      const dialog = page.locator('dialog.message-box[open]')
      await dialog.waitFor()
      console.log(name, buttons, await dialog.boundingBox())
      await page.screenshot({ path: `message-${expected}-${name}.png` })
      await dialog.getByRole('button', { name: expected === 'ok' ? 'OK' : 'Ignore', exact: true }).click()
      await page.waitForFunction(expected => window.messageResult === expected, expected)
      assert.equal(await dialog.count(), 0)
    }
    await page.close()
  }
} finally { await browser.close() }
