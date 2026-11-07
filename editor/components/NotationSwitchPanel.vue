<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { registerAction } from '../actions/actions'
import { createNotationSwitchListModel } from '../../src/index'
import { qtrc, useLanguage } from '../i18n'
import { currentMasterScore, useScoreView } from '../scoreview'
import { closeScore } from '../session'
import { ICON_CODES } from '../actions/uiactiondata'
import MenuPopup from './MenuPopup.vue'
import type { MenuItem } from '../menus/appmenu'

useLanguage()
const view = useScoreView()
const revision = ref(0)
const tabMenu = ref<{ x: number; y: number; index: number } | null>(null)
const menuAnchor = computed(() => tabMenu.value ? new DOMRect(tabMenu.value.x, tabMenu.value.y, 0, 0) : new DOMRect())
const menuItems = computed(() => {
  if (!tabMenu.value || !model.value) return []
  return model.value.contextMenuItems(tabMenu.value.index).map((item): MenuItem => ({
    kind: 'action', code: `notation-switch-${item.id}`, title: ['notation', item.title], args: [String(tabMenu.value!.index)],
  }))
})
const model = computed(() => {
  void revision.value
  void view.scoreVersion
  const master = currentMasterScore()
  if (!master || !view.hasScore) return null
  const m = createNotationSwitchListModel(master)
  m.load()
  return m
})
registerAction('notation-switch-close-tab', { run: args => close(Number(args?.[0])) }, { title: ['notation', 'Close tab'] })
registerAction('notation-switch-close-other-tabs', { run: args => {
  if (model.value) model.value.closeOtherNotations(Number(args?.[0]))
  revision.value++
} }, { title: ['notation', 'Close other tabs'] })
registerAction('notation-switch-close-all-tabs', { run: () => closeScore() }, { title: ['notation', 'Close all tabs'] })
function tabKeydown(event: KeyboardEvent) {
  const rtl = document.documentElement.dir === 'rtl'
  let next = -1
  const tabs = [...(event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="tab"]')]
  const current = tabs.indexOf(event.target as HTMLElement)
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = (current + ((event.key === 'ArrowRight') !== rtl ? 1 : tabs.length - 1)) % tabs.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = tabs.length - 1
  if (current < 0 || next < 0 || !tabs.length) return
  event.preventDefault()
  tabs[next]?.focus()
  tabs[next]?.click()
}
function select(index: number) {
  model.value?.setCurrentNotation(index)
  revision.value++
}
function close(index: number) {
  if (model.value && !model.value.closeNotation(index)) closeScore()
  revision.value++
}
</script>

<template>
  <div v-if="model" class="notation-tabs" role="tablist" :aria-label="qtrc('notation', 'Scores')" @keydown="tabKeydown">
    <div v-for="(tab, index) in model.notations()" :key="index" class="notation-tab" role="tab" :tabindex="index === model.currentNotationIndex() ? 0 : -1"
      :aria-selected="index === model.currentNotationIndex()" :title="tab.isMaster ? view.tooltip : (tab.title ?? '')"
      @click="select(index)"
      @contextmenu.prevent="tabMenu = { x: $event.clientX, y: $event.clientY, index }">
      <span :id="tab.isMaster ? 'title' : undefined" class="notation-tab-title">{{ tab.isMaster ? (view.modified ? '*' : '') + view.title : tab.title }}</span>
      <button :id="tab.isMaster ? 'clear' : undefined" class="icon" :title="qtrc('global', 'Close')" :aria-label="qtrc('global', 'Close')" @click.stop="close(index)">{{ String.fromCodePoint(ICON_CODES.CLOSE_X_ROUNDED) }}</button>
    </div>
    <MenuPopup v-if="tabMenu" :items="menuItems" :anchor="menuAnchor" placement="below" :label="qtrc('notation', 'Scores')" @close="tabMenu = null" />
  </div>
</template>
