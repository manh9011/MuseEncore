// SPDX-License-Identifier: GPL-3.0-only
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/Chrome.exe' })
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
      await page.getByRole('option', { name: 'Slurs & ties', exact: true }).click()
    }
    await open()
    const thickness = page.getByRole('textbox', { name: 'Line thickness at end:' }).first()
    await thickness.fill('0.3')
    await thickness.press('Enter')
    await page.getByRole('radio', { name: 'Angle away from staff' }).click()
    await page.getByRole('button', { name: 'OK', exact: true }).click()
    await open()
    assert.equal(Number(await thickness.inputValue()), 0.3)
    assert.equal(await page.getByRole('radio', { name: 'Angle away from staff' }).isChecked(), true)
    await page.getByRole('button', { name: 'Cancel', exact: true }).click()
    console.log(`${host}: slur controls persist`)
    await page.close()
  }
} finally { await browser.close() }
