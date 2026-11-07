<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { ref } from 'vue'
const searchVisible = ref(false)
export function showSearchPopup(): void { searchVisible.value = true }
export function hideSearchPopup(): void {
  searchVisible.value = false
  document.getElementById('viewport')?.focus({ preventScroll: true })
}
</script>
<script setup lang="ts">
import { nextTick, ref as vueRef, watch } from 'vue'
import { qtrc, useLanguage } from '../i18n'
import { ICON_CODES } from '../actions/uiactiondata'
import { searchNotation } from '../../src/index'
import { currentScore, scoreChanged } from '../scoreview'
useLanguage()
const input = vueRef<HTMLInputElement | null>(null)
watch(searchVisible, async open => {
  if (open) { await nextTick(); input.value?.focus(); input.value?.select() }
})
function search(event: Event) {
  const score = currentScore()
  if (score) { searchNotation(score, (event.target as HTMLInputElement).value); scoreChanged(true) }
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); hideSearchPopup() }
}
</script>
<template>
  <div v-if="searchVisible" class="search-popup" role="search">
    <button type="button" class="icon-button" :aria-label="qtrc('notation', 'Close search')" @click="hideSearchPopup"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(ICON_CODES.CLOSE_X_ROUNDED) }}</span></button>
    <label><span>{{ qtrc('notation', 'Find / Go to:') }}</span><input ref="input" type="text" :aria-label="qtrc('notation', 'Find / Go to:')" @input="search" @keydown="keydown" /></label>
  </div>
</template>
