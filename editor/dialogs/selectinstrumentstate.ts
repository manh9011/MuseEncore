/* SPDX-License-Identifier: GPL-3.0-only */
import { ref } from 'vue'

export const selectInstrumentOpen = ref(false)
let resolveInstrument: ((id: string | null) => void) | null = null
export function askInstrument(): Promise<string | null> {
    resolveInstrument?.(null)
    selectInstrumentOpen.value = true
    return new Promise(resolve => { resolveInstrument = resolve })
}
export function finishAskInstrument(id: string | null): void {
    selectInstrumentOpen.value = false
    const resolve = resolveInstrument
    resolveInstrument = null
    resolve?.(id)
}
