<script lang="ts">
import { registerAction } from '../actions/actions'
import { PANELS, setPanelOpen } from './panels'
import { expandCollapseAll, palettesState, setSingleClickToOpen, setSinglePalette } from './palettes/palettestate'
import { currentScore } from '../scoreview'
import { scoreOrders, layoutPanelScoreOrder } from '../../src/index'

export function registerPanelActions(): void {
  for (const panel of PANELS) {
    registerAction(`dock-close:${panel.id}`, { run: () => setPanelOpen(panel.id, false) }, { title: ['appshell/dock', 'Close'] })
  }
  registerAction('toggle-single-click-to-open-palette', { run: () => setSingleClickToOpen(!palettesState().singleClickToOpen), checked: () => palettesState().singleClickToOpen }, { title: ['palette', 'Single-click to open a palette'], checkable: true })
  registerAction('toggle-single-palette', { run: () => setSinglePalette(!palettesState().singlePalette), checked: () => palettesState().singlePalette }, { title: ['palette', 'Open only one palette at a time'], checkable: true })
  registerAction('collapse-all-palettes', { run: () => expandCollapseAll(false) }, { title: ['palette', 'Collapse all palettes'] })
  registerAction('expand-all-palettes', { run: () => expandCollapseAll(true) }, { title: ['palette', 'Expand all palettes'] })
}
</script>
<!--
  SPDX-License-Identifier: GPL-3.0-only
  Left Sidebar Dock (Palettes, Instruments/Layout, Properties/Inspector) with resizable splitter
  migrated from `editor/panels/PanelDock.tsx` to Vue 3 + Nuxt UI.
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { qtrc, trString, useLanguage } from '../i18n'
import { ICON_CODES } from '../actions/uiactiondata'
import MenuPopup from '../components/MenuPopup.vue'
import type { MenuItem } from '../menus/appmenu'
import { useActions } from '../actions/actions'
import './panels.css'
import InspectorForm from './inspector/InspectorForm.vue'
import LayoutPanel from './layout/LayoutPanel.vue'
import PalettesPanel from './palettes/PalettesPanel.vue'
import {
  PANEL_MAX_WIDTH,
  PANEL_MIN_WIDTH,
  expandPanel,
  setCurrentPanel,
  setPanelWidth,
  setPanelsCollapsed,
  usePanels,
} from './panels'

useLanguage()
useActions()
function tabMenu(id: string): MenuItem[] {
  const own: MenuItem[] = id === 'palettesPanel' ? [
    { kind: 'action', code: 'toggle-single-click-to-open-palette' }, { kind: 'action', code: 'toggle-single-palette' },
    { kind: 'separator' }, { kind: 'action', code: 'collapse-all-palettes' }, { kind: 'action', code: 'expand-all-palettes' },
  ] : id === 'instrumentsPanel' ? [
    ...(currentScore()?.isMaster() ? [{ kind: 'menu' as const, id: 'layout-instrument-order', title: ['layoutpanel', 'Instrument ordering'] as const, items: [...scoreOrders(), ...(scoreOrders().some(o => o.id === 'custom') ? [] : [{ id: 'custom', name: 'Custom' }])].map(o => ({ kind: 'action' as const, code: `layout-set-order:${o.id}` })) }, { kind: 'separator' as const }] : []),
    { kind: 'action', code: 'layout-collapse-all-instruments' }, { kind: 'action', code: 'layout-expand-all-instruments' },
  ] : []
  return [...own, ...(own.length ? [{ kind: 'separator' } as MenuItem] : []), { kind: 'action', code: `dock-close:${id}` }]
}
const panels = usePanels()
const resizing = ref(false)
const menu = ref<{ id: string; anchor: DOMRect; button: HTMLButtonElement } | null>(null)
function toggleMenu(id: string, event: MouseEvent) {
  const button = event.currentTarget as HTMLButtonElement
  menu.value = menu.value?.id === id ? null : { id, anchor: button.getBoundingClientRect(), button }
}
function closeMenu(focus: boolean) {
  const button = menu.value?.button
  menu.value = null
  if (focus) button?.focus()
}

const openPanels = computed(() => PANELS.filter((p) => panels.open.includes(p.id)))

const tabItems = computed(() =>
  openPanels.value.map((p) => ({
    label: trString(p.title),
    value: p.id,
  })),
)

function onTabKeydown(event: KeyboardEvent, index: number) {
  const rtl = document.documentElement.dir === 'rtl'
  let next = -1
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    next = (index + ((event.key === 'ArrowRight') !== rtl ? 1 : openPanels.value.length - 1)) % openPanels.value.length
  } else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = openPanels.value.length - 1
  if (next < 0 || !openPanels.value.length) return
  event.preventDefault()
  const panel = openPanels.value[next]
  const tab = (event.currentTarget as HTMLElement).closest('[role="tablist"]')?.querySelectorAll<HTMLElement>('[role="tab"]')[next]
  tab?.focus()
  setCurrentPanel(panel.id)
}
function onSplitterKeydown(e: KeyboardEvent) {
  const direction = document.documentElement.dir === 'rtl' ? -1 : 1
  const step = e.shiftKey ? 50 : 10
  const width = e.key === 'ArrowLeft' ? panels.width - step * direction : e.key === 'ArrowRight' ? panels.width + step * direction : e.key === 'Home' ? PANEL_MIN_WIDTH : e.key === 'End' ? PANEL_MAX_WIDTH : null
  if (width !== null) { e.preventDefault(); setPanelWidth(width) }
}
function onSplitterMouseDown(e: MouseEvent) {
  e.preventDefault()
  resizing.value = true
  const startX = e.clientX
  const startWidth = panels.width

  const onMouseMove = (moveEvent: MouseEvent) => {
    const nextWidth = Math.max(
      PANEL_MIN_WIDTH,
      Math.min(PANEL_MAX_WIDTH, startWidth + (moveEvent.clientX - startX) * (document.documentElement.dir === 'rtl' ? -1 : 1)),
    )
    setPanelWidth(nextWidth)
  }

  const onMouseUp = () => {
    resizing.value = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}
</script>

<template>
  <template v-if="openPanels.length > 0 && !panels.collapsed">
  <aside
    class="panel-dock"
    :style="{ width: `${panels.width}px` }"
  >
    <div class="panel-tabs-row">
      <div class="panel-tabs" role="tablist" :aria-label="trString(['appshell/dock', 'Panels'])">
        <div v-for="tab in tabItems" :key="tab.value" class="panel-tab" :class="{ current: panels.current === tab.value }">
          <button :id="`panel-tab-${tab.value}`" role="tab" :aria-selected="panels.current === tab.value"
            :aria-controls="`panel-${tab.value}`" :tabindex="panels.current === tab.value ? 0 : -1"
            @keydown="onTabKeydown($event, openPanels.findIndex(p => p.id === tab.value))"
            @click="setCurrentPanel(tab.value)">{{ tab.label }}</button>
          <button v-if="panels.current === tab.value" class="panel-tab-menu" :aria-label="`${tab.label}: ${qtrc('global', 'Menu')}`" :title="qtrc('global', 'Menu')" aria-haspopup="menu" :aria-expanded="menu?.id === tab.value" @click="toggleMenu(tab.value, $event)">{{ String.fromCodePoint(ICON_CODES.MENU_THREE_DOTS) }}</button>
          <MenuPopup v-if="menu?.id === tab.value" :items="tabMenu(tab.value)" :anchor="menu.anchor" placement="below" :label="tab.label" @close="closeMenu" />
        </div>
      </div>
      <button class="panel-collapse" :aria-label="qtrc('global', 'Collapse')" :title="qtrc('global', 'Collapse')"
        aria-expanded="true" @click="setPanelsCollapsed(true)">{{ String.fromCodePoint(ICON_CODES.CHEVRON_LEFT) }}</button>
    </div>
    <div class="panel-content" role="tabpanel" :id="`panel-${panels.current}`" :aria-labelledby="`panel-tab-${panels.current}`">
        <PalettesPanel v-if="panels.current === 'palettesPanel'" />
        <LayoutPanel v-else-if="panels.current === 'instrumentsPanel'" />
        <InspectorForm v-show="panels.current === 'inspectorPanel'" />
    </div>

  </aside>
  <div class="panel-splitter" :class="{ dragging: resizing }" role="separator" aria-orientation="vertical"
    tabindex="0" aria-label="Panel width" :aria-valuenow="panels.width" :aria-valuemin="PANEL_MIN_WIDTH" :aria-valuemax="PANEL_MAX_WIDTH"
    @mousedown="onSplitterMouseDown"
    @keydown="onSplitterKeydown" />
  </template>

  <!-- Collapsed Dock Rail -->
  <aside
    v-else-if="openPanels.length > 0 && panels.collapsed"
    class="panel-dock collapsed"
  >
    <button class="panel-collapse" :aria-label="qtrc('global', 'Expand')" :title="qtrc('global', 'Expand')" aria-expanded="false" @click="setPanelsCollapsed(false)">{{ String.fromCodePoint(ICON_CODES.CHEVRON_RIGHT) }}</button>
    <button v-for="tab in tabItems" :key="tab.value" class="panel-strip-tab" :class="{ current: panels.current === tab.value }" @click="expandPanel(tab.value)">{{ tab.label }}</button>
  </aside>
</template>
