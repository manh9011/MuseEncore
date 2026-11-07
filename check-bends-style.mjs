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
      await page.getByRole('option', { name: 'Bends & dives', exact: true }).click()
    }
    await open()
    const width = page.getByRole('textbox', { name: 'Arrow width:' })
    await width.fill('1.2')
    await width.press('Enter')
    await page.getByRole('radio', { name: 'Above the staff' }).click()
    const label = page.getByRole('textbox', { name: 'Text label:' })
    await label.fill('test')
    await label.blur()
    await page.getByRole('radio', { name: 'Dotted', exact: true }).click()
    await page.getByRole('checkbox', { name: 'Use cue sized fret numbers' }).check()
    await page.getByRole('button', { name: 'OK', exact: true }).click()
    await open()
    assert.equal(Number(await width.inputValue()), 1.2)
    assert.equal(await page.getByRole('radio', { name: 'Above the staff' }).isChecked(), true)
    assert.equal(await label.inputValue(), 'test')
    assert.equal(await page.getByRole('radio', { name: 'Dotted', exact: true }).getAttribute('aria-checked'), 'true')
    assert.equal(await page.getByRole('checkbox', { name: 'Use cue sized fret numbers' }).isChecked(), true)
    await page.getByRole('button', { name: 'Cancel', exact: true }).click()
    console.log(`${host}: bend controls persist`)
    await page.close()
  }
} finally { await browser.close() }
