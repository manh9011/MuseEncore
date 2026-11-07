<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { actionDefinition, actionTitle } from '../actions/actions'
import { ICON_CODES } from '../actions/uiactiondata'
import MenuPopup from '../components/MenuPopup.vue'
import { qtrc, stripMnemonic, useLanguage } from '../i18n'
import type { MenuItem } from '../menus/appmenu'
import { DEFAULT_NOTE_INPUT_BAR, noteInputBarConfig, setNoteInputBarConfig } from './layout'
import { useSettings } from '../settings'
useLanguage()
const settings = useSettings()
const items = computed(() => { void settings.noteInputBar; return noteInputBarConfig() })
const selected = ref(-1)
const addButton = ref<HTMLButtonElement | null>(null), addOpen = ref(false)
const customiseButton = ref<HTMLButtonElement | null>(null), customisePopup = ref<HTMLElement | null>(null), customiseOpen = ref(false)
const customisePos = ref({left: 0, top: 0})
function closeCustomise(focus = false) { customiseOpen.value = false; if (focus) customiseButton.value?.focus() }
function outsideCustomise(event: PointerEvent) { if (!customisePopup.value?.contains(event.target as Node) && !customiseButton.value?.contains(event.target as Node)) closeCustomise() }
watch(customiseOpen, async open => {
  if (open) {
    await nextTick()
    if (!customiseOpen.value || !customiseButton.value) return
    const rect = customiseButton.value.getBoundingClientRect(), width = customisePopup.value?.offsetWidth ?? 300
    customisePos.value = {left: Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8)), top: rect.bottom + 4}
    customisePopup.value?.focus()
    document.addEventListener('pointerdown', outsideCustomise, true)
  } else document.removeEventListener('pointerdown', outsideCustomise, true)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', outsideCustomise, true))
const actions = (codes: string[]): MenuItem[] => codes.map(code => code ? { kind: 'action', code } : { kind: 'separator' })
const notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b']
const menu: MenuItem[] = [
  { kind: 'menu', id: '', title: ['notation', 'Notes'], items: actions([...notes.map(n => `note-${n}`), '', ...notes.map(n => `chord-${n}`)]) },
  { kind: 'menu', id: '', title: ['notation', 'Intervals'], items: actions([...Array.from({length: 10}, (_, i) => `interval${i + 1}`), '', ...Array.from({length: 9}, (_, i) => `interval-${i + 2}`)]) },
  { kind: 'menu', id: '', title: ['notation', 'Measures'], items: actions(['insert-measure', 'append-measure', '', 'insert-measures', 'insert-measures-after-selection', '', 'insert-measures-at-start-of-score', 'append-measures']) },
  { kind: 'menu', id: '', title: ['notation', 'Frames'], items: actions(['insert-hbox', 'insert-vbox', 'insert-textframe', 'insert-fretframe', '', 'append-hbox', 'append-vbox', 'append-textframe', 'append-fretframe']) },
  { kind: 'menu', id: '', title: ['notation', 'Text'], items: actions(['title-text', 'subtitle-text', 'composer-text', 'poet-text', 'part-text', '', 'system-text', 'staff-text', 'add-dynamic', 'expression-text', 'rehearsalmark-text', 'instrument-change-text', 'fingering-text', '', 'sticking-text', 'chord-text', 'roman-numeral-text', 'nashville-number-text', 'lyrics', 'figured-bass', 'tempo']) },
  { kind: 'menu', id: '', title: ['notation', 'Lines'], items: actions(['add-slur', 'add-hairpin', 'add-hairpin-reverse', 'add-8va', 'add-8vb', 'add-noteline']) },
  { kind: 'menu', id: '', title: ['notation', 'Chords and fretboard diagrams'], items: actions(['chord-text', 'add-fretboard-diagram', '', 'insert-fretframe']) },
]
function move(direction: number) {
  const next = [...items.value], index = selected.value, target = index + direction
  if (index < 0 || target < 0 || target >= next.length) return
  ;[next[index], next[target]] = [next[target], next[index]]
  setNoteInputBarConfig(next)
  selected.value = target
}
function toggle(index: number) { setNoteInputBarConfig(items.value.map((item, i) => i === index ? { ...item, show: !item.show } : item)) }
</script>
<template>
  <span class="tool-separator" role="separator" aria-orientation="vertical" />
  <button ref="addButton" type="button" class="tool-button with-title" aria-haspopup="menu" :aria-expanded="addOpen" :title="qtrc('global', 'Add')" @click="addOpen = !addOpen"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(ICON_CODES.PLUS) }}</span><span class="tool-title">{{ qtrc('global', 'Add') }}</span><span class="tool-icon small" aria-hidden="true">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_DOWN) }}</span></button>
  <MenuPopup v-if="addOpen && addButton" :items="menu" :anchor="addButton.getBoundingClientRect()" placement="below" :label="qtrc('global', 'Add')" @close="focus => { addOpen = false; if (focus) addButton?.focus() }" />
  <button ref="customiseButton" type="button" class="tool-button" :aria-label="qtrc('notation', 'Customize toolbar')" aria-haspopup="dialog" :aria-expanded="customiseOpen" @click="customiseOpen = !customiseOpen"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(ICON_CODES.SETTINGS_COG) }}</span></button>
      <div v-if="customiseOpen" ref="customisePopup" class="customise-popup" role="dialog" tabindex="-1" :style="{left: `${customisePos.left}px`, top: `${customisePos.top}px`}" :aria-label="qtrc('notation', 'Customize toolbar')" @keydown.esc.stop="closeCustomise(true)">
        <div class="customise-header">
          <button class="secondary" :disabled="selected < 0" @click="() => { const next = [...items]; next.splice(selected + 1, 0, { action: '', show: true }); setNoteInputBarConfig(next); selected++ }">{{ qtrc('notation', 'Add separator line') }}</button>
          <span class="spacer" />
          <button class="icon" :aria-label="qtrc('global', 'Move up')" :disabled="selected <= 0" @click="move(-1)">{{ String.fromCodePoint(ICON_CODES.ARROW_UP) }}</button>
          <button class="icon" :aria-label="qtrc('global', 'Move down')" :disabled="selected < 0 || selected >= items.length - 1" @click="move(1)">{{ String.fromCodePoint(ICON_CODES.ARROW_DOWN) }}</button>
          <button class="icon" :aria-label="qtrc('global', 'Delete')" :disabled="selected < 0 || !!items[selected]?.action" @click="setNoteInputBarConfig(items.filter((_, i) => i !== selected)); selected = -1">{{ String.fromCodePoint(ICON_CODES.DELETE_TANK) }}</button>
        </div>
        <ul class="list customise-list" role="listbox" :aria-label="qtrc('notation', 'Customize toolbar')">
          <li v-for="(item, index) in items" :key="index" role="option" :aria-selected="selected === index" tabindex="0" :data-action="item.action || undefined" @click="selected = index" @keydown.space.prevent="item.action && toggle(index)">
            <template v-if="item.action"><input type="checkbox" :checked="item.show" :aria-label="stripMnemonic(actionTitle(item.action))" @click.stop @change="toggle(index)" /><span class="tool-icon" aria-hidden="true">{{ actionDefinition(item.action)?.icon ? String.fromCodePoint(actionDefinition(item.action)!.icon!) : '' }}</span><span class="item-name">{{ stripMnemonic(actionTitle(item.action)) }}</span></template>
            <span v-else class="item-name muted separator-item">------- {{ qtrc('notation', 'Separator line') }} -------</span>
          </li>
        </ul>
        <div class="dialog-buttons"><button class="secondary" @click="setNoteInputBarConfig([...DEFAULT_NOTE_INPUT_BAR]); selected = -1">{{ qtrc('global', 'Reset') }}</button></div>
      </div>
</template>
