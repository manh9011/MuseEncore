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
      await page.getByRole('option', { name: 'Fretboard diagrams', exact: true }).click()
    }
    await open()
    await page.getByRole('radio', { name: 'Horizontal', exact: true }).click()
    await page.getByRole('radio', { name: 'Top', exact: true }).click()
    await page.getByRole('radio', { name: 'Custom suffix:', exact: true }).click()
    await page.getByRole('textbox', { name: 'Custom suffix:' }).fill('th')
    await page.getByRole('radio', { name: 'Extended', exact: true }).click()
    await page.getByRole('checkbox', { name: 'Show fingerings' }).check()
    const spacing = page.getByRole('textbox', { name: 'String spacing:' })
    await spacing.fill('1.25')
    await spacing.press('Enter')
    await page.getByRole('button', { name: 'OK', exact: true }).click()
    await open()
    assert.equal(await page.getByRole('radio', { name: 'Horizontal', exact: true }).getAttribute('aria-checked'), 'true')
    assert.equal(await page.getByRole('radio', { name: 'Top', exact: true }).isChecked(), true)
    assert.equal(await page.getByRole('textbox', { name: 'Custom suffix:' }).inputValue(), 'th')
    assert.equal(await page.getByRole('radio', { name: 'Extended', exact: true }).getAttribute('aria-checked'), 'true')
    assert.equal(await page.getByRole('checkbox', { name: 'Show fingerings' }).isChecked(), true)
    assert.equal(Number(await spacing.inputValue()), 1.25)
    await page.getByRole('button', { name: 'Cancel', exact: true }).click()
    console.log(`${host}: fretboard controls persist`)
    await page.close()
  }
} finally { await browser.close() }
