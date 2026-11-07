<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { canEditPaletteCell, RemoveAction, removePaletteCells, canInsertPaletteCell, drawPaletteCell, insertPaletteCell, movePaletteCell, paletteCellCount, paletteCellRow, paletteCellElement, paletteCellMimeData, type PaletteCellInfo, type PaletteInfo } from '../../../src/index'
import { actionDefinition, actionDescription, registerAction } from '../../actions/actions'
import { dragData, ELEMENT_DROP_EVENT, setDragData, type ElementDropDetail } from '../../dragcontroller'
import { withSelectedInstrument } from '../../dialogs/instrumentchoice'
import { currentScore } from '../../scoreview'
import { qtrc } from '../../i18n'
import { applyPaletteElement, canApplyPaletteElement, scoreChanged } from '../editbridge'
import { setCurrentCell, usePalettesState } from './palettestate'
import MenuPopup from '../../components/MenuPopup.vue'
import PaletteCellProperties from './PaletteCellProperties.vue'
import PaletteQuestion from './PaletteQuestion.vue'
import type { MenuItem } from '../../menus/appmenu'
import type { RemoveQuestion } from '../../../src/index'

const props = defineProps<{ palette: PaletteInfo; showMore?: boolean; moreExpanded?: boolean; selecting?: boolean; selected?: string[]; pool?: 'main'|'more'|'custom'; editable?: boolean }>()
const emit = defineEmits<{ more: []; select: [id: string, multi: boolean]; escape: [] }>()
const grid = ref<HTMLElement | null>(null)
const focusIndex = ref(0)
const dropAt = ref<number|null>(null)
const cellMenu = shallowRef<{ anchor: DOMRect; items: MenuItem[] } | null>(null)
const propertiesId = ref<string | null>(null)
const question = ref<{text:string;buttons:{value:string;label:string;primary?:boolean}[];resolve:(value:string)=>void}|null>(null)
function askRemove(q: RemoveQuestion): Promise<RemoveAction> {
  return new Promise(resolve => {
    const hide = q.buttons === 'hideOrDelete'
    question.value = { text:qtrc('palette',q.question), buttons: hide ? [{value:'hide',label:qtrc('palette','Hide')},{value:'delete',label:qtrc('palette','Delete permanently')},{value:'cancel',label:qtrc('global','Cancel'),primary:true}] : [{value:'yes',label:qtrc('global','Yes')},{value:'no',label:qtrc('global','No'),primary:true}], resolve: value => resolve(value === 'hide' ? RemoveAction.Hide : value === 'delete' || value === 'yes' ? RemoveAction.DeletePermanently : RemoveAction.NoAction) }
  })
}
function openCellMenu(event: MouseEvent, cell: PaletteCellInfo) {
  const id = cell.id
  registerAction(`palette-cell-delete:${id}`, { run: () => void removePaletteCells([id], askRemove), enabled: () => canEditPaletteCell(id) }, { title:['palette','Delete'] })
  registerAction(`palette-cell-properties:${id}`, { run: () => { propertiesId.value = id }, enabled: () => canEditPaletteCell(id) }, { title:['palette','Properties…'] })
  cellMenu.value = { anchor:new DOMRect(event.clientX,event.clientY,0,0), items:[{kind:'action',code:`palette-cell-delete:${id}`},{kind:'action',code:`palette-cell-properties:${id}`}] }
}
function dropRow(x:number,y:number) {const cells=[...(grid.value?.querySelectorAll<HTMLElement>('.palette-cell') ?? [])],rtl=document.documentElement.dir==='rtl';for(let i=0;i<cells.length;i++){const r=cells[i].getBoundingClientRect();if(y>=r.top&&y<r.bottom&&x>=r.left&&x<r.right)return i+((rtl?x<r.left+r.width/2:x>=r.left+r.width/2)?1:0)}return cells.length}
function paletteDropRow(x:number,y:number) {const cells=grid.value?.querySelectorAll<HTMLElement>('.palette-cell'),i=dropRow(x,y);return cells && i<cells.length ? paletteCellRow(cells[i].dataset.cell!) : -1}
function dropKind() {const data=dragData();if(!props.editable || (props.pool ?? 'main')!=='main' || !data)return null;if(data.cell && data.source?.paletteId===props.palette.id && data.source.pool==='main')return 'reorder';if(data.cell && canInsertPaletteCell(props.palette.id,{cell:data.cell},'move'))return 'move';if(data.symbol && !data.source && canInsertPaletteCell(props.palette.id,{symbol:data.symbol},'copy'))return 'copy';return null}
function dragOver(event:DragEvent) {const kind=dropKind();if(!kind)return;event.preventDefault();event.stopPropagation();if(event.dataTransfer)event.dataTransfer.dropEffect=kind==='copy'?'copy':'move';dropAt.value=dropRow(event.clientX,event.clientY)}
function drop(event:DragEvent) {const data=dragData(),kind=dropKind();dropAt.value=null;if(!data || !kind)return;event.preventDefault();event.stopPropagation();const row=paletteDropRow(event.clientX,event.clientY);if(kind==='reorder'){const from=paletteCellRow(data.source!.cellId),before=row<0?paletteCellCount(props.palette.id):row;if(from>=0&&before!==from&&before!==from+1)movePaletteCell(data.source!.cellId,before>from?before-1:before)}else if(kind==='move')insertPaletteCell(props.palette.id,row,{cell:data.cell},'move');else insertPaletteCell(props.palette.id,row,{symbol:data.symbol},'copy');setDragData(null)}
function elementDrop(event:Event) {if(!props.editable || (props.pool ?? 'main')!=='main')return;const d=(event as CustomEvent<ElementDropDetail>).detail;insertPaletteCell(props.palette.id,paletteDropRow(d.clientX,d.clientY),{symbol:d.mimeData},'copy')}
const state = usePalettesState()
function keydown(event: KeyboardEvent, index: number) {
  const cells = [...(grid.value?.querySelectorAll<HTMLElement>('.palette-cell') ?? [])]
  const columns = cells.length < 2 ? 1 : Math.max(1, cells.findIndex(cell => cell.offsetTop !== cells[0].offsetTop) < 0 ? cells.length : cells.findIndex(cell => cell.offsetTop !== cells[0].offsetTop))
  const rtl = document.documentElement.dir === 'rtl'
  let next = -1
  if (event.key === 'ArrowRight') next = index + (rtl ? -1 : 1)
  else if (event.key === 'ArrowLeft') next = index + (rtl ? 1 : -1)
  else if (event.key === 'ArrowDown') next = index + columns
  else if (event.key === 'ArrowUp') next = index - columns
  else if (event.key === 'Home') next = event.ctrlKey ? 0 : index - index % columns
  else if (event.key === 'End') next = event.ctrlKey ? props.palette.cells.length - 1 : Math.min(props.palette.cells.length - 1, index - index % columns + columns - 1)
  else if (event.key === 'Escape') { emit('escape'); event.preventDefault(); event.stopPropagation(); return }
  else return
  event.preventDefault(); event.stopPropagation()
  if (next >= 0 && next < props.palette.cells.length) { focusIndex.value = next; grid.value?.querySelectorAll<HTMLElement>('.palette-cell')[next]?.focus() }
}
function draw() {
  grid.value?.querySelectorAll<HTMLCanvasElement>('canvas[data-cell]').forEach(canvas => {
    const ctx = canvas.getContext('2d')
    if (ctx && canvas.dataset.cell) {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(props.palette.gridWidth * dpr)
      canvas.height = Math.round(props.palette.gridHeight * dpr)
      const color = getComputedStyle(canvas).color
      const rgb = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      drawPaletteCell(canvas.dataset.cell, ctx, { width: props.palette.gridWidth, height: props.palette.gridHeight, extraMag: props.palette.mag, dpr, color: rgb ? '#' + rgb.slice(1).map(v => Number(v).toString(16).padStart(2, '0')).join('') : '#000000' })
    }
  })
}
let colorScheme: MediaQueryList | undefined
let mountedGrid: HTMLElement | null = null
onMounted(()=>{draw(); mountedGrid = grid.value; mountedGrid?.addEventListener(ELEMENT_DROP_EVENT,elementDrop); colorScheme = matchMedia('(prefers-color-scheme: dark)'); colorScheme.addEventListener('change',draw)})
onUnmounted(()=>{mountedGrid?.removeEventListener(ELEMENT_DROP_EVENT,elementDrop); colorScheme?.removeEventListener('change',draw)})
watch(() => props.palette, draw, { flush: 'post' })
function apply(cell: PaletteCellInfo, event: MouseEvent | KeyboardEvent) {
  setCurrentCell(cell.id)
  const score = currentScore()
  const element = paletteCellElement(cell.id)
  if (!score || !element || !canApplyPaletteElement(score)) return
  const apply = () => { if (applyPaletteElement(score, element, { shift: event.shiftKey, ctrl: event.ctrlKey || event.metaKey })) scoreChanged() }
  if (element.isInstrumentChange()) void withSelectedInstrument(apply)
  else apply()
}
function drag(event: DragEvent, cell: PaletteCellInfo) {
  const mime = paletteCellMimeData(cell.id)
  if (event.dataTransfer) {
    if (mime.symbol) event.dataTransfer.setData('application/musescore/symbol', mime.symbol)
    if (mime.cell) event.dataTransfer.setData('application/musescore/palette/cell', mime.cell)
    event.dataTransfer.effectAllowed = 'copyMove'
  }
  setDragData({ ...mime, source: { paletteId: props.palette.id, cellId: cell.id, pool: props.pool ?? 'main' } })
}
</script>
<template>
  <div ref="grid" class="palette-grid" :class="{ 'draw-grid': palette.drawGrid, 'drop-active':dropAt !== null }" role="listbox" :aria-label="palette.name" aria-orientation="horizontal" :aria-multiselectable="selecting || undefined"
    :style="{ gridTemplateColumns: `repeat(auto-fill, minmax(${palette.gridWidth}px, 1fr))`, gridAutoRows: `${palette.gridHeight}px` }" @dragover="dragOver" @dragenter="dragOver" @dragleave="!($event.currentTarget as HTMLElement).contains($event.relatedTarget as Node | null) && (dropAt=null)" @drop="drop">
    <div v-if="!palette.cells.length" class="palette-empty">{{ qtrc('palette', palette.editable ? 'Drag and drop any element here' : 'No elements') }}</div>
    <div v-for="(cell,index) in palette.cells" :key="cell.id" role="option" class="palette-cell" draggable="true" :tabindex="index === focusIndex ? 0 : -1" :aria-selected="selecting ? !!selected?.includes(cell.id) : state.currentCell === cell.id" :aria-disabled="!canApplyPaletteElement(currentScore()) || undefined"
      :title="cell.action ? actionDescription(cell.action) : cell.name" :aria-label="cell.action ? actionDescription(cell.action) : cell.name"
      :class="{ selected: selected?.includes(cell.id), current: !selecting && state.currentCell === cell.id, 'drop-before':dropAt===index, 'drop-after':dropAt===index+1 && index===palette.cells.length-1 }" :data-cell="cell.id" :data-element="cell.elementType"
      @contextmenu.prevent.stop="openCellMenu($event, cell)" @focus="focusIndex=index; setCurrentCell(cell.id)" @keydown="keydown($event,index)" @keydown.enter.prevent.stop="apply(cell,$event)" @keydown.space.prevent.stop="apply(cell,$event)" @click="selecting ? emit('select', cell.id, $event.ctrlKey || $event.metaKey || $event.shiftKey) : apply(cell, $event)" @dragstart="drag($event, cell)" @dragend="setDragData(null)">
      <span v-if="cell.action || cell.icon" class="palette-cell-glyph" aria-hidden="true" :style="{ fontSize: `${cell.iconSize * palette.mag}px`, width: `${palette.gridWidth}px`, height: `${palette.gridHeight}px` }">{{ String.fromCodePoint((cell.action ? actionDefinition(cell.action)?.icon : cell.icon) || 0) }}</span>
      <canvas v-else class="palette-cell-canvas" :data-cell="cell.id" :style="{ width: `${palette.gridWidth}px`, height: `${palette.gridHeight}px` }" aria-hidden="true" />
    </div>
    <button v-if="showMore" type="button" class="palette-more" aria-haspopup="dialog" :aria-expanded="moreExpanded" @click="emit('more')">{{ qtrc('palette', 'More') }}</button>
  </div>
  <MenuPopup v-if="cellMenu" :items="cellMenu.items" :anchor="cellMenu.anchor" placement="below" :label="qtrc('palette','Palette cell')" @close="cellMenu = null" />
  <PaletteCellProperties v-if="propertiesId" :id="propertiesId" @close="propertiesId = null" />
  <PaletteQuestion v-if="question" :text="question.text" :buttons="question.buttons" @answer="value => { const current = question; question = null; current?.resolve(value) }" />
</template>
