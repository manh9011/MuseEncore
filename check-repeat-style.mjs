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
      await page.getByRole('option', { name: 'Repeats', exact: true }).click()
    }
    await open()
    const checkbox = page.getByRole('checkbox', { name: 'Number consecutive measure repeats' })
    if (!(await checkbox.isChecked())) await checkbox.click()
    const every = page.getByRole('textbox', { name: 'Every' })
    await every.fill('4')
    await every.press('Enter')
    assert.equal(Number(await every.inputValue()), 4)
    const toggle = page.getByRole('switch', { name: 'Automatically show text at repeat barlines' })
    if (!(await toggle.isChecked())) await page.getByText('Automatically show text at repeat barlines', { exact: true }).click()
    const preset = page.getByRole('combobox', { name: 'Preset' })
    await preset.selectOption({ label: '3x' })
    await page.getByRole('button', { name: 'OK', exact: true }).click()
    await open()
    assert.equal(Number(await every.inputValue()), 4)
    assert.equal(await preset.inputValue(), '1')
    await page.getByRole('button', { name: 'Cancel', exact: true }).click()
    console.log(`${host}: repeat controls persist`)
    await page.close()
  }
} finally {
  await browser.close()
}
