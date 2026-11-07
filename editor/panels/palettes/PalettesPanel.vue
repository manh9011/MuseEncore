<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { addExtraPalette, createCustomPalette, extraPalettes } from '../../../src/index'
import { ICON_CODES } from '../../actions/uiactiondata'
import { actionDescription } from '../../actions/actions'
import { fontsReady } from '../../scoreview'
import { arg, qtrc, useLanguage } from '../../i18n'
import './palettes.css'
import { endSearch, searchPalettes, setSearchText, shownPalettes, startSearch, usePalettesState } from './palettestate'
import PaletteTree from './PaletteTree.vue'
useLanguage()
const state = usePalettesState()
const filter = computed({ get: () => state.searchText, set: setSearchText })
const searching = computed(() => state.searchOpened)
const adding = ref(false)
const creating = ref(false)
const customName = ref('')
const customInput = ref<HTMLInputElement | null>(null)
function startCreating() { creating.value = true; customName.value = ''; void nextTick(() => customInput.value?.focus()) }
function createPalette() { if (customName.value.trim()) { createCustomPalette(customName.value.trim(), 0); closeAdd() } }
const searchInput = ref<HTMLInputElement | null>(null)
const addButton = ref<HTMLButtonElement | null>(null)
const addPopup = ref<HTMLElement | null>(null)
const added = ref<{ key: string; name: string }[]>([])
const extras = computed(() => { void state.treeVersion; return extraPalettes() })
function closeAdd(restoreFocus = false) {
  adding.value = false
  creating.value = false
  if (restoreFocus) void nextTick(() => addButton.value?.focus())
}
function outsideAdd(event: PointerEvent) {
  if (!addPopup.value?.contains(event.target as Node) && !addButton.value?.contains(event.target as Node)) closeAdd()
}
watch(adding, open => {
  if (open) {
    added.value = []
    document.addEventListener('pointerdown', outsideAdd)
    void nextTick(() => addPopup.value?.querySelector<HTMLButtonElement>('button')?.focus())
  } else document.removeEventListener('pointerdown', outsideAdd)
})
onUnmounted(() => document.removeEventListener('pointerdown', outsideAdd))
function addPalette(key: string, name: string) {
  if (addExtraPalette(key)) {
    added.value.push({ key, name })
    void nextTick(() => addPopup.value?.querySelector<HTMLButtonElement>('button')?.focus())
  }
}
function addKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') { event.stopPropagation(); closeAdd(true); return }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  const buttons = [...(addPopup.value?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])]
  const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
  buttons[Math.max(0, Math.min(buttons.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)))]?.focus()
  event.preventDefault()
  event.stopPropagation()
}
function openSearch() { startSearch(); adding.value = false; void nextTick(() => searchInput.value?.focus()) }
function closeSearch() { endSearch(); void nextTick(() => addButton.value?.focus()) }
function searchKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'Enter') {
    const cell = document.querySelector<HTMLButtonElement>('.palette-tree .palette-cell')
    if (cell) { event.preventDefault(); if (event.key === 'Enter') cell.click(); else cell.focus() }
  }
}
const ready = ref(false)
onMounted(() => { void fontsReady.then(() => { ready.value = true }).catch(console.error) })
const palettes = computed(() => {
  void state.treeVersion
  if (!ready.value) return []
  return searching.value ? searchPalettes(filter.value, cell => cell.action ? actionDescription(cell.action) : cell.name) : shownPalettes()
})
</script>
<template>
  <div class="palettes-panel">
    <div class="palettes-header">
      <template v-if="searching">
        <div class="search palette-search">
          <span class="icon-glyph" aria-hidden="true">{{ String.fromCodePoint(ICON_CODES.SEARCH) }}</span>
          <input ref="searchInput" v-model="filter" type="search" :placeholder="qtrc('ui', 'Search')" :aria-label="qtrc('palette', 'Search palettes')" @keydown.esc.stop.prevent="closeSearch" @keydown="searchKeydown" />
          <button type="button" class="icon" :aria-label="qtrc('global', 'Clear')" @click="closeSearch">{{ String.fromCodePoint(ICON_CODES.CLOSE_X_ROUNDED) }}</button>
        </div>
      </template>
      <template v-else>
        <button ref="addButton" type="button" class="secondary add-palettes" aria-haspopup="dialog" :aria-expanded="adding" @click="adding = !adding">{{ qtrc('palette', 'Add palettes') }}</button>
        <button type="button" class="icon palette-search-button" :aria-label="qtrc('palette', 'Search palettes')" @click="openSearch">{{ String.fromCodePoint(ICON_CODES.SEARCH) }}</button>
        <div v-if="adding" ref="addPopup" class="add-palettes-popup" role="dialog" :aria-label="qtrc('palette', creating ? 'Create custom palette' : 'More palettes')" @keydown="!creating && addKeydown($event)">
          <div v-if="creating" class="create-custom-palette"><label class="add-palettes-title" for="custom-palette-name">{{ qtrc('palette', 'Name your custom palette') }}</label><input id="custom-palette-name" ref="customInput" v-model="customName" type="text" @keydown.enter.prevent="createPalette" @keydown.esc.stop.prevent="creating = false" /><div class="dialog-buttons"><button type="button" class="secondary" @click="creating = false">{{ qtrc('global', 'Cancel') }}</button><button type="button" class="primary" :disabled="!customName.trim()" @click="createPalette">{{ qtrc('palette', 'Create') }}</button></div></div>
          <template v-else><div class="add-palettes-title">{{ qtrc('palette', 'More palettes') }}</div>
          <button type="button" class="secondary" @click="startCreating">{{ qtrc('palette', 'Create custom palette') }}</button>
          <div v-if="!extras.length && !added.length" class="add-palettes-empty">{{ qtrc('palette', 'All palettes were added') }}</div>
          <ul>
            <li v-for="extra in extras" :key="extra.key"><span class="add-palettes-name">{{ extra.name }}</span><button type="button" class="icon" :aria-label="arg(qtrc('palette', 'Add %1 palette'), extra.name)" :title="arg(qtrc('palette', 'Add %1 palette'), extra.name)" @click="addPalette(extra.key, extra.name)">{{ String.fromCodePoint(ICON_CODES.PLUS) }}</button></li>
            <li v-for="extra in added" :key="`${extra.key}:added`"><span class="add-palettes-added">{{ arg(qtrc('palette', '%1 added'), extra.name) }}</span></li>
          </ul></template>
        </div>
      </template>
    </div>
    <div v-if="searching && !filter.trim()" class="palettes-hint">{{ qtrc('palette', 'Start typing to search all palettes') }}</div>
    <div v-else-if="searching && !palettes.length" class="palettes-hint">{{ qtrc('global', 'No results found') }}</div>
    <div class="palettes-scroll"><PaletteTree :palettes="palettes" :searching="searching" /></div>
  </div>
</template>
