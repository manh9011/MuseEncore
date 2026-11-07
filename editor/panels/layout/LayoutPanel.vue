<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef } from 'vue'
import { registerAction } from '../../actions/actions'
import MenuPopup from '../../components/MenuPopup.vue'
import { showMessage } from '../../components/MessageBox.vue'
import type { MenuItem } from '../../menus/appmenu'
import { createLayoutPanelModel, InsertMode, layoutPanelItemKey, LayoutPanelItemType, scoreOrders, setScoreOrder, type AbstractLayoutPanelTreeItem, type LayoutPanelNotationParts, type Score } from '../../../src/index'
import { qtrc, useLanguage } from '../../i18n'
import { ICON_CODES } from '../../actions/uiactiondata'
import './layoutpanel.css'
import { currentMasterScore, currentScore, useScoreView } from '../../scoreview'
import { addInstruments, addStaff, addSystemObjects, canEditParts, insertPart, moveParts, moveStaves, moveSystemObjectLayerBottomStaff, moveSystemObjects, removeParts, removeStaves, removeSystemObjects, replacePart, scoreChanged, setPartVisible, setStaffVisible } from '../editbridge'
import InstrumentsDialog from './InstrumentsDialog.vue'
import LayoutSettings from './LayoutSettings.vue'

useLanguage()
const view = useScoreView()
let selectedKeys: string[] = []
let keepSelection = false
let previousScore: Score | null = null
let previousSelectionVersion = -1
const expanded = ref(new Set<string>())
const focusedKey = ref<string | null>(null)
function expand(item: AbstractLayoutPanelTreeItem, value: boolean) { const next = new Set(expanded.value), key = layoutPanelItemKey(item); if (value) next.add(key); else next.delete(key); expanded.value = next }
let suppressClick = false
function select(item: AbstractLayoutPanelTreeItem, event?: MouseEvent | KeyboardEvent) { if (suppressClick) { suppressClick = false; return } if (!item.isSelectable()) return; model.value?.selectRow(item, {shift: event?.shiftKey, ctrl: event?.ctrlKey || event?.metaKey}) }
function treeKey(event: KeyboardEvent, index: number) {
  const row = visibleRows.value[index]; if (!row) return
  let next = index
  const directionKey = document.documentElement.dir === 'rtl' ? event.key === 'ArrowLeft' ? 'ArrowRight' : event.key === 'ArrowRight' ? 'ArrowLeft' : event.key : event.key
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    next = event.key === 'ArrowDown' ? Math.min(index + 1, visibleRows.value.length - 1) : Math.max(index - 1, 0)
    const target = visibleRows.value[next].item
    if (event.shiftKey && target.isSelectable()) model.value?.selectRow(target, { shift: true })
  }
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = visibleRows.value.length - 1
  else if (directionKey === 'ArrowRight' && row.item.isExpandable()) { if (!row.expanded) expand(row.item, true); else next = Math.min(index + 1, visibleRows.value.length - 1) }
  else if (directionKey === 'ArrowLeft') { if (row.expanded) expand(row.item, false); else if (row.depth > 0) { for (let i = index - 1; i >= 0; i--) if (visibleRows.value[i].depth < row.depth) { next = i; break } } }
  else if (event.key === 'Enter' || event.key === ' ') { if (row.item.type() === LayoutPanelItemType.CONTROL_ADD_STAFF) row.item.appendNewItem(); else select(row.item, event) }
  else if (event.key === 'Delete' || event.key === 'Backspace') { if (canEditParts(currentScore())) void remove() }
  else if (event.key === 'Escape' && model.value?.selectedItems().length) model.value.clearSelection()
  else return
  event.preventDefault(); const key = layoutPanelItemKey(visibleRows.value[next].item); focusedKey.value = key; void nextTick(() => document.querySelector<HTMLElement>(`.layout-row[data-key="${CSS.escape(key)}"]`)?.focus())
}
const showAddDialog = ref(false)
const settings = shallowRef<{item: AbstractLayoutPanelTreeItem; anchor: DOMRect} | null>(null)
const addButton = ref<HTMLButtonElement | null>(null)
const addMenu = ref<DOMRect | null>(null)
const addItems: MenuItem[] = [{kind:'action',code:'instruments',title:['layoutpanel','New instrument']},{kind:'separator'},{kind:'action',code:'layoutpanel-add-system-markings',title:['layoutpanel','System markings (tempo, rehearsal marks, etc.)']}]
onMounted(() => {
  const expandCollapseAll = (open: boolean) => {
    const next = new Set(expanded.value)
    for (const item of rows.value) if (item.isExpandable()) open ? next.add(layoutPanelItemKey(item)) : next.delete(layoutPanelItemKey(item))
    expanded.value = next
  }
  registerAction('layout-collapse-all-instruments', { run: () => expandCollapseAll(false) }, { title: ['layoutpanel', 'Collapse all instruments'] })
  registerAction('layout-expand-all-instruments', { run: () => expandCollapseAll(true) }, { title: ['layoutpanel', 'Expand all instruments'] })
  for (const order of [...scoreOrders(), ...(scoreOrders().some(o => o.id === 'custom') ? [] : [{ id: 'custom', name: 'Custom' }])]) {
    registerAction(`layout-set-order:${order.id}`, { run: () => { const score = currentMasterScore(); if (score && setScoreOrder(score, order.id)) scoreChanged() }, enabled: () => canEditParts(currentScore()), checked: () => { const score = currentScore(); const current = score?.isMaster() ? score.scoreOrder() : null; return !!current && !current.customized && current.id === order.id } }, { title: ['engraving/scoreorder', order.name], checkable: true })
  }
  registerAction('instruments', {run: () => { showAddDialog.value = true }, enabled: () => canEditParts(currentScore())})
  registerAction('layoutpanel-add-system-markings', {run: () => { const m = model.value; if (m) { activeDragModel.value = m; m.addSystemMarkings(); activeDragModel.value = null } }, enabled: () => canEditParts(currentScore()) && !!model.value?.isAddingSystemMarkingsAvailable()}, {title:['layoutpanel','System markings (tempo, rehearsal marks, etc.)']})
})
function closeAddMenu(focus: boolean) { addMenu.value = null; if (focus) void nextTick(() => addButton.value?.focus()) }
function notationParts(score: Score): LayoutPanelNotationParts {
  const run = (changed: boolean) => { if (changed) { keepSelection = true; scoreChanged() } }
  return {
    setPartVisible: (id, visible) => run(setPartVisible(score,id,visible)), setStaffVisible: (id, visible) => run(setStaffVisible(score,id,visible)),
    removeParts: ids => run(ids.length > 0 && removeParts(score,ids)), removeStaves: ids => run(ids.length > 0 && removeStaves(score,ids)),
    moveParts: (ids,dest,mode) => run(moveParts(score,ids,dest,mode === InsertMode.After)), moveStaves: (ids,dest,mode) => run(moveStaves(score,ids,dest,mode === InsertMode.After)),
    appendStaff: id => run(addStaff(score,id)), insertPart: (part,index) => run(insertPart(score,part,index)), replacePart: (id,part) => run(replacePart(score,id,part)),
    addSystemObjects: ids => run(addSystemObjects(score,ids)), removeSystemObjects: ids => run(ids.length > 0 && removeSystemObjects(score,ids)),
    moveSystemObjects: (src,dst) => run(moveSystemObjects(score,src,dst)), moveSystemObjectLayerBelowBottomStaff: () => run(moveSystemObjectLayerBottomStaff(score,true)), moveSystemObjectLayerAboveBottomStaff: () => run(moveSystemObjectLayerBottomStaff(score,false)),
  }
}
const activeDragModel = shallowRef<ReturnType<typeof createLayoutPanelModel> | null>(null)
const model = computed(() => {
  void view.scoreVersion
  void view.selectionVersion
  if (activeDragModel.value) return activeDragModel.value
  const score = currentScore()
  if (!score) return null
  const m = createLayoutPanelModel(score, notationParts(score), notationParts(score.masterScore()))
  if (previousScore === score && (keepSelection || previousSelectionVersion === view.selectionVersion)) {
    const items: AbstractLayoutPanelTreeItem[] = []
    const visit = (item: AbstractLayoutPanelTreeItem) => { if (selectedKeys.includes(layoutPanelItemKey(item))) items.push(item); item.childItems().forEach(visit) }
    m.rootItem()?.childItems().forEach(visit)
    m.selectItems(items)
  } else m.updateSelectedRows()
  keepSelection = false
  previousScore = score
  previousSelectionVersion = view.selectionVersion
  m.onChanged = () => { selectedKeys = m.selectedItems().map(layoutPanelItemKey); dragRevision.value++ }
  return m
})
const dragRevision = ref(0)
function startRowDrag(event: PointerEvent, item: AbstractLayoutPanelTreeItem, isExpanded: boolean) {
  const activeModel = model.value
  if (!activeModel || event.button !== 0 || !item.isSelectable() || (event.target as HTMLElement).closest('button')) return
  const startY = event.clientY
  let dragging = false
  const move = (ev: PointerEvent) => {
    if (!dragging) {
      if (Math.abs(ev.clientY - startY) < 5) return
      dragging = true
      activeDragModel.value = activeModel
      activeModel.startActiveDrag()
      if (isExpanded) expand(item, false)
      document.body.classList.add('layout-row-dragging')
    }
    const key = document.elementFromPoint(ev.clientX, ev.clientY)?.closest<HTMLElement>('.layout-tree [data-key]')?.dataset.key
    const target = visibleRows.value.find(row => layoutPanelItemKey(row.item) === key)?.item
    if (!target || target === item || !target.canAcceptDrop(item) || item.row() < 0 || target.row() < 0) return
    activeModel.moveRows(item.parentItem(), item.row(), 1, target.parentItem(), target.row())
    dragRevision.value++
  }
  const up = () => {
    window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up)
    if (dragging) { document.body.classList.remove('layout-row-dragging'); activeModel.endActiveDrag(); activeDragModel.value = null; suppressClick = true; setTimeout(() => { suppressClick = false }, 0) }
  }
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up)
}
const rows = computed(() => { void dragRevision.value; return [...(model.value?.rootItem()?.childItems() ?? [])] })
const visibleRows = computed(() => { const result: {item: AbstractLayoutPanelTreeItem; depth: number; expanded: boolean}[] = []; const visit = (item: AbstractLayoutPanelTreeItem, depth: number) => { const isOpen = expanded.value.has(layoutPanelItemKey(item)); result.push({item,depth,expanded:isOpen}); if (isOpen) item.childItems().forEach(child => visit(child, depth + 1)) }; rows.value.forEach(item => visit(item, 0)); return result })
function add(ids: string[] | null) {
  showAddDialog.value = false
  const score = currentScore()
  if (score && ids?.length && addInstruments(score, ids)) scoreChanged()
}
async function remove() {
  const m = model.value
  if (!m) return
  const warning = m.removeWarning()
  if (!warning || await showMessage(warning.text, warning.detail, ['no', 'yes']) === 'yes') m.removeSelectedRows()
}
function move(direction: number) {
  if (direction < 0) model.value?.moveSelectedRowsUp()
  else model.value?.moveSelectedRowsDown()
}
</script>
<template>
  <div class="layout-panel">
    <div class="layout-controls">
      <button ref="addButton" class="layout-add-button" :disabled="!canEditParts(currentScore())" :aria-label="qtrc('layoutpanel', 'Add instruments or system markings')" aria-haspopup="menu" :aria-expanded="!!addMenu" @click="addMenu = addMenu ? null : addButton!.getBoundingClientRect()">{{ qtrc('layoutpanel', 'Add') }}</button>
      <MenuPopup v-if="addMenu" :items="addItems" :anchor="addMenu" placement="below" :label="qtrc('layoutpanel', 'Add')" @close="closeAddMenu" />
      <button v-for="control in [{ icon: 'ARROW_UP', label: 'Move up', id: 'up', run: () => move(-1) }, { icon: 'ARROW_DOWN', label: 'Move down', id: 'down', run: () => move(1) }, { icon: 'DELETE_TANK', label: 'Remove', id: 'remove', run: remove }]" :key="control.icon" class="tool-button layout-control" :data-control="control.id" :disabled="control.id === 'up' ? !model?.isMovingUpAvailable() : control.id === 'down' ? !model?.isMovingDownAvailable() : !model?.isRemovingAvailable()" :aria-label="qtrc('global', control.label)" @click="control.run"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(ICON_CODES[control.icon]) }}</span></button>
    </div>
    <div class="layout-tree" role="tree" :aria-label="qtrc('appshell', 'Layout')">
      <div v-for="(row,index) in visibleRows" :key="layoutPanelItemKey(row.item)" class="layout-row" :class="{ control: row.item.type() === LayoutPanelItemType.CONTROL_ADD_STAFF, selected: row.item.isSelected(), expanded: row.item.type() === LayoutPanelItemType.PART && row.expanded, child: row.depth > 0 && row.item.type() !== LayoutPanelItemType.CONTROL_ADD_STAFF, 'hidden-item': !row.item.isVisible() }" role="treeitem" :aria-level="row.depth + 1" :aria-selected="row.item.isSelected()" :aria-expanded="row.item.isExpandable() ? row.expanded : undefined" :aria-label="row.item.type() === LayoutPanelItemType.CONTROL_ADD_STAFF ? undefined : row.item.title()" :data-key="layoutPanelItemKey(row.item)" :data-type="row.item.type() === LayoutPanelItemType.PART ? 'part' : row.item.type() === LayoutPanelItemType.STAFF ? 'staff' : row.item.type() === LayoutPanelItemType.CONTROL_ADD_STAFF ? 'control' : 'system-objects'" :tabindex="(focusedKey ?? (visibleRows[0] && layoutPanelItemKey(visibleRows[0].item))) === layoutPanelItemKey(row.item) ? 0 : -1" :style="{'--depth':row.depth}" @focus="focusedKey=layoutPanelItemKey(row.item)" @pointerdown="startRowDrag($event,row.item,row.expanded)" @click.stop="select(row.item,$event)" @dblclick="row.item.isExpandable() && expand(row.item,!row.expanded)" @keydown="treeKey($event,index)">
        <template v-if="row.item.type() === LayoutPanelItemType.CONTROL_ADD_STAFF"><button class="layout-row-button add-staff" tabindex="-1" :disabled="!canEditParts(currentScore())" aria-hidden="true" @click.stop="row.item.appendNewItem()">{{ String.fromCodePoint(ICON_CODES.PLUS) }}</button><span class="layout-row-title">{{ row.item.title() }}</span></template>
        <template v-else><span v-if="row.item.type() === LayoutPanelItemType.SYSTEM_OBJECTS_LAYER" class="layout-row-button dash" aria-hidden="true">{{ String.fromCodePoint(ICON_CODES.MINUS) }}</span><button v-else class="layout-row-button visibility" tabindex="-1" :disabled="!canEditParts(currentScore())" :title="`${row.item.title()}, ${qtrc('ui',row.item.isVisible() ? 'Visible' : 'Hidden')}`" :aria-label="`${row.item.title()}, ${qtrc('ui',row.item.isVisible() ? 'Visible' : 'Hidden')}`" :aria-pressed="row.item.isVisible()" @click.stop="row.item.isSelected() ? model?.changeVisibilityOfSelectedRows(!row.item.isVisible()) : model?.changeVisibility(row.item,!row.item.isVisible())">{{ String.fromCodePoint(ICON_CODES[row.item.isVisible() ? 'EYE_OPEN' : 'EYE_CLOSED']) }}</button><span class="layout-row-indent" /><button v-if="row.item.isExpandable() || row.depth > 0" class="layout-row-button expand" tabindex="-1" :hidden="!row.item.isExpandable()" :aria-label="qtrc('global',row.expanded ? 'Collapse' : 'Expand')" @click.stop="expand(row.item,!row.expanded)">{{ String.fromCodePoint(ICON_CODES[row.expanded ? 'SMALL_ARROW_DOWN' : 'SMALL_ARROW_RIGHT']) }}</button><span class="layout-row-title" :class="{bold:row.item.type() === LayoutPanelItemType.PART && row.item.isVisible()}">{{ row.item.title() }}</span><button v-if="row.item.settingsAvailable()" class="layout-row-button settings" tabindex="-1" :disabled="!row.item.settingsEnabled()" :title="qtrc('layoutpanel','Settings')" :aria-label="qtrc('layoutpanel','Settings')" @click.stop="settings={item:row.item,anchor:($event.currentTarget as HTMLElement).getBoundingClientRect()}">{{ String.fromCodePoint(ICON_CODES.SETTINGS_COG) }}</button></template>
      </div>
    </div>
    <LayoutSettings v-if="settings" :item="settings.item" :anchor="settings.anchor" @close="settings=null" />
    <InstrumentsDialog v-if="showAddDialog" @close="add" />
  </div>
</template>
