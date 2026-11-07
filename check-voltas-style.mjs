// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
try {
  for (const host of ['[::1]:5180', '127.0.0.1:5174']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    await page.route('http://scores.test/**', route => route.fulfill({ path: 'mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz', headers: { 'access-control-allow-origin': '*' } }))
    await page.addInitScript(() => localStorage.setItem('musescoreweb:settings', JSON.stringify({ project: { migration: { Pre_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false }, Ver_3_6: { appVersion: 470, isApplyMigration: false, isAskAgain: false } } } })))
    await page.goto(`http://${host}/?url=http://scores.test/test.mscz`)
    await page.waitForSelector('.page canvas')
    await page.waitForTimeout(10000)
    async function open() {
      await page.getByRole('menuitem', { name: 'Format', exact: true }).click()
      await page.getByRole('menuitem', { name: 'Style…', exact: true }).click()
      await page.getByRole('option', { name: 'Voltas', exact: true }).click()
    }
    await open()
    const hook = page.getByRole('textbox', { name: 'Hook height:' })
    await hook.fill('-5')
    await hook.press('Enter')
    assert.equal(Number(await hook.inputValue()), 0)
    await hook.press('ArrowUp')
    assert.equal(Number(await hook.inputValue()), 0.01)
    await page.getByRole('radio', { name: 'Dashed' }).click()
    const dash = page.getByRole('textbox', { name: 'Dash:' })
    await dash.fill('1.5')
    await dash.press('Enter')
    await page.getByRole('radio', { name: 'On key signature' }).click()
    await page.getByRole('button', { name: 'OK', exact: true }).click()
    await open()
    assert.equal(await page.getByRole('radio', { name: 'Dashed' }).getAttribute('aria-checked'), 'true')
    assert.equal(Number(await dash.inputValue()), 1.5)
    assert.equal(await page.getByRole('radio', { name: 'On key signature' }).isChecked(), true)
    await page.getByRole('button', { name: 'Cancel', exact: true }).click()
    console.log(`${host}: volta controls persist`)
    await page.close()
  }
} finally { await browser.close() }
