<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { isActionChecked, isActionEnabled, shortcutText, triggerAction, useActions } from '../../actions/actions'
import { qtrc } from '../../i18n'
import { ICON_CODES } from '../../actions/uiactiondata'
import type { InspectorModelInfo } from '../../../src/index'

const props = defineProps<{ model: InspectorModelInfo }>()
const popupOpen = ref(false)
const popup = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
function outside(event: PointerEvent) {
  if (popupOpen.value && !popup.value?.contains(event.target as Node)) popupOpen.value = false
}
onMounted(() => document.addEventListener('pointerdown', outside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', outside))
function closePopup(event: KeyboardEvent) {
  if (event.key === 'Escape' && popupOpen.value) {
    event.stopPropagation()
    popupOpen.value = false
    trigger.value?.focus()
  }
}
useActions()
const pageView = computed(() => props.model.flags.scoreIsInPageView !== false)
const locked = computed(() => isActionChecked('toggle-system-lock') || props.model.flags.allSystemsAreLocked === true)
const many = computed(() => Number(props.model.flags.systemCount ?? 0) > 1)
const insertActions = [
  { code: 'insert-measures-after-selection', title: 'Insert after selection…' }, { code: 'insert-measures', title: 'Insert before selection…' },
  { code: 'insert-measures-at-start-of-score', title: 'Insert at start of score…' }, { code: 'append-measures', title: 'Insert at end of score…' },
]
const insertTargets = new Map(insertActions.map((item, index) => [item.code, index]))
const canInsert = computed(() => insertActions.some(({ code }) => isActionEnabled(code)))
function tip(text: string, code: string) {
  const shortcut = shortcutText(code)
  return shortcut ? `${text} (${shortcut})` : text
}
</script>
<template>
  <div class="insp-column">
    <div class="insp-row">
      <div ref="popup" class="insp-popup-button" @keydown="closePopup">
        <button ref="trigger" class="insp-flat-button" :disabled="!canInsert" :aria-expanded="popupOpen" aria-haspopup="dialog" @click="popupOpen = !popupOpen"><span class="insp-button-icon">{{ String.fromCodePoint(ICON_CODES.PLUS) }}</span>{{ qtrc('inspector', 'Insert measures') }}</button>
        <div v-if="popupOpen" class="insp-popup" role="dialog" :aria-label="qtrc('inspector', 'Insert measures')">
          <div class="insp-column"><button v-for="item in insertActions" :key="item.code" class="insp-flat-button" :disabled="!isActionEnabled(item.code)" @click="popupOpen = false; triggerAction(item.code, [String(insertTargets.get(item.code))])">{{ qtrc('action', item.title) }}</button></div>
        </div>
      </div>
      <button class="insp-flat-button" :aria-label="tip(qtrc('inspector', 'Delete selected measures'), 'time-delete')" :disabled="!isActionEnabled('time-delete')" @click="triggerAction('time-delete')"><span class="insp-button-icon">{{ String.fromCodePoint(ICON_CODES.DELETE_TANK) }}</span></button>
    </div>
    <template v-if="pageView">
      <div class="insp-property">
        <div class="insp-property-title"><span>{{ qtrc('inspector', 'Move to system') }}</span></div>
        <div class="insp-grid2">
          <button class="insp-flat-button" :title="tip(qtrc('inspector', 'Move measure(s) to previous system'), 'move-measure-to-prev-system')" :disabled="!isActionEnabled('move-measure-to-prev-system')" @click="triggerAction('move-measure-to-prev-system')"><span class="insp-button-icon">{{ String.fromCodePoint(ICON_CODES.ARROW_UP) }}</span>{{ qtrc('inspector', 'Previous') }}</button>
          <button class="insp-flat-button" :title="tip(qtrc('inspector', 'Move measure(s) to next system'), 'move-measure-to-next-system')" :disabled="!isActionEnabled('move-measure-to-next-system')" @click="triggerAction('move-measure-to-next-system')"><span class="insp-button-icon">{{ String.fromCodePoint(ICON_CODES.ARROW_DOWN) }}</span>{{ qtrc('inspector', 'Next') }}</button>
        </div>
      </div>
      <button class="insp-flat-button" :class="{ accent: locked }" :aria-pressed="locked" :title="tip(qtrc('inspector', 'Lock/unlock selected system(s)'), 'toggle-system-lock')" :disabled="!isActionEnabled('toggle-system-lock')" @click="triggerAction('toggle-system-lock')"><span class="insp-button-icon">{{ String.fromCodePoint(ICON_CODES[locked ? 'LOCK_CLOSED' : 'LOCK_OPEN']) }}</span>{{ locked ? (many ? qtrc('inspector', 'Unlock selected systems') : qtrc('inspector', 'Unlock selected system')) : (many ? qtrc('inspector', 'Lock selected systems') : qtrc('inspector', 'Lock selected system')) }}</button>
      <button class="insp-flat-button" :title="tip(qtrc('inspector', 'Create system from selection'), 'make-into-system')" :disabled="model.flags.isMakeIntoSystemAvailable !== true || !isActionEnabled('make-into-system')" @click="triggerAction('make-into-system')">{{ qtrc('inspector', 'Create system from selection') }}</button>
    </template>
  </div>
</template>
