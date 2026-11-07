<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { addCellsToPalette, createCustomPalette, loadPaletteFile, morePaletteCells, movePalette, RemoveAction, removePalette, removePaletteCells, resetPalette, RESET_PALETTE_QUESTION, savePaletteFile, setPaletteEditable, type RemoveQuestion } from '../../../src/index'
import { registerAction } from '../../actions/actions'
import PaletteProperties from './PaletteProperties.vue'
import PaletteQuestion from './PaletteQuestion.vue'
import MenuPopup from '../../components/MenuPopup.vue'
import type { MenuItem } from '../../menus/appmenu'
import { arg, qtrc } from '../../i18n'
import { ICON_CODES } from '../../actions/uiactiondata'
import { allUserPalettes, setPaletteExpanded, usePalettesState } from './palettestate'
import { setDragData } from '../../dragcontroller'
import type { PaletteInfo } from '../../../src/index'
import PaletteGridView from './PaletteGridView.vue'
const props = defineProps<{ palettes: PaletteInfo[]; searching?: boolean }>()
const items = computed(() => props.palettes.map(p => ({ label: p.name, value: p.id, palette: p })))
const expanded = ref(new Set(props.palettes.filter(p => p.expanded).map(p => p.id)))
const state = usePalettesState()
const moreId = ref<string | null>(null)
const dropOver = ref<{id:string;where:'before'|'after'}|null>(null)
const paletteDragFormat = 'application/musescore/palette'
function dragStart(event:DragEvent,id:string) {if(props.searching || !event.dataTransfer)return;event.dataTransfer.setData(paletteDragFormat,id);event.dataTransfer.effectAllowed='move';setDragData(null)}
function dragOver(event:DragEvent,id:string) {if(props.searching || !event.dataTransfer?.types.includes(paletteDragFormat))return;event.preventDefault();const r=(event.currentTarget as HTMLElement).getBoundingClientRect();dropOver.value={id,where:event.clientY<r.top+r.height/2?'before':'after'}}
function dropPalette(event:DragEvent,id:string) {const source=event.dataTransfer?.getData(paletteDragFormat),where=dropOver.value?.where;dropOver.value=null;if(!source || source===id || !event.dataTransfer?.types.includes(paletteDragFormat))return;event.preventDefault();const list=allUserPalettes(),from=list.findIndex(p=>p.id===source),row=list.findIndex(p=>p.id===id),target=row+(where==='after'?1:0);if(from>=0 && row>=0 && target!==from && target!==from+1)movePalette(source,target>from?target-1:target)}
const menu = ref<{id:string;anchor:DOMRect;items:MenuItem[]}|null>(null)
const propertiesId = ref<string|null>(null)
const question = ref<{text:string;buttons:{value:string;label:string;primary?:boolean}[];resolve:(value:string)=>void}|null>(null)
function askQuestion(text:string,buttons:{value:string;label:string;primary?:boolean}[]):Promise<string> {return new Promise(resolve=>{question.value={text,buttons,resolve}})}
function answer(value:string) {const current=question.value;question.value=null;current?.resolve(value)}
async function askRemove(q: RemoveQuestion): Promise<RemoveAction> {
  if (q.buttons === 'hideOrDelete') {const value=await askQuestion(qtrc('palette',q.question),[{value:'hide',label:qtrc('palette','Hide')},{value:'delete',label:qtrc('palette','Delete permanently')},{value:'cancel',label:qtrc('global','Cancel'),primary:true}]);return value==='hide'?RemoveAction.Hide:value==='delete'?RemoveAction.DeletePermanently:RemoveAction.NoAction}
  return await askQuestion(qtrc('palette',q.question),[{value:'yes',label:qtrc('global','Yes')},{value:'no',label:qtrc('global','No'),primary:true}]) === 'yes' ? RemoveAction.DeletePermanently : RemoveAction.NoAction
}
function menuItems(p: PaletteInfo, row: number): MenuItem[] {
  const id=p.id
  registerAction(`palette-hide:${id}`,{run:()=>void removePalette(id,askRemove)},{title:p.custom?['palette','Hide/Delete palette']:['palette','Hide palette']})
  registerAction(`palette-new:${id}`,{run:()=>void createCustomPalette('Untitled palette',row)},{title:['palette','Insert new palette']})
  registerAction(`palette-edit:${id}`,{run:()=>setPaletteEditable(id,!p.editable),checked:()=>p.editable},{title:['palette','Enable editing'],checkable:true})
  registerAction(`palette-reset:${id}`,{run:()=>void askQuestion(qtrc('palette',RESET_PALETTE_QUESTION),[{value:'no',label:qtrc('global','No')},{value:'yes',label:qtrc('global','Yes'),primary:true}]).then(v=>{if(v==='yes')resetPalette(id)})},{title:['palette','Reset palette']})
  registerAction(`palette-save:${id}`,{run:()=>{const file=savePaletteFile(id);if(!file)return;const url=URL.createObjectURL(new Blob([file.data as BlobPart],{type:'application/octet-stream'}));const a=document.createElement('a');a.href=url;a.download=`${file.name.replace(/[\\/:*?"<>|]/g,'_') || 'palette'}.mpal`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}},{title:['palette','Save palette…']})
  registerAction(`palette-load:${id}`,{run:()=>{const input=document.createElement('input');input.type='file';input.accept='.mpal';input.onchange=()=>{const f=input.files?.[0];if(f)void f.arrayBuffer().then(buf=>{if(!loadPaletteFile(id,new Uint8Array(buf)))void askQuestion(`${qtrc('palette','Load palette')}: ${f.name}`,[{value:'ok',label:qtrc('global','OK'),primary:true}])})};input.click()}},{title:['palette','Load palette…']})
  registerAction(`palette-properties:${id}`,{run:()=>{propertiesId.value=id},enabled:()=>p.editable},{title:['palette','Palette properties…']})
  return [`palette-hide:${id}`,`palette-new:${id}`,null,`palette-edit:${id}`,null,`palette-reset:${id}`,`palette-save:${id}`,`palette-load:${id}`,null,`palette-properties:${id}`].map(code=>code?{kind:'action',code}:{kind:'separator'})
}
function openMenu(p: PaletteInfo,_row:number,anchor:DOMRect) {menu.value={id:p.id,anchor,items:menuItems(p,allUserPalettes().findIndex(item=>item.id===p.id))}}
function contextMenu(event: MouseEvent,p: PaletteInfo,row:number) { if (!props.searching) { event.preventDefault(); openMenu(p,row,new DOMRect(event.clientX,event.clientY,0,0)) } }
function focusHeader(id:string) { document.querySelector<HTMLElement>(`.palette-tree-item[data-palette="${CSS.escape(id)}"] .palette-header`)?.focus() }
function closeMenu(focus:boolean) {const id=menu.value?.id;menu.value=null;if(focus&&id)void nextTick(()=>document.querySelector<HTMLElement>(`.palette-tree-item[data-palette="${CSS.escape(id)}"] .palette-header`)?.focus())}
const selected = ref<string[]>([])
const customSelected = ref<string[]>([])
const more = computed(() => { void state.treeVersion; return moreId.value ? morePaletteCells(moreId.value) : null })
function toggleMore(id: string) {
  moreId.value = moreId.value === id ? null : id
  selected.value = []
  customSelected.value = []
  if (moreId.value) void nextTick(() => document.querySelector<HTMLButtonElement>('.palette-more-popup .palette-cell')?.focus())
}
function selectCell(id: string, multi: boolean) {
  selected.value = multi ? selected.value.includes(id) ? selected.value.filter(x => x !== id) : [...selected.value, id] : [id]
}
function selectCustom(id: string, multi: boolean) {
  customSelected.value = multi ? customSelected.value.includes(id) ? customSelected.value.filter(x => x !== id) : [...customSelected.value, id] : [id]
}
function closeMore(restore = false) {
  const id = moreId.value
  moreId.value = null
  if (restore && id) void nextTick(() => document.querySelector<HTMLButtonElement>(`.palette-tree-item[data-palette="${CSS.escape(id)}"] .palette-more`)?.focus())
}
function outsideMore(event: PointerEvent) {
  if (moreId.value && !(event.target as Element).closest('.palette-more-popup, .palette-more, dialog, .menu-popup')) closeMore()
}
document.addEventListener('pointerdown', outsideMore)
onUnmounted(() => document.removeEventListener('pointerdown', outsideMore))
watch(() => props.palettes, palettes => { expanded.value = new Set(palettes.filter(p => p.expanded).map(p => p.id)) })
function headerKey(event: KeyboardEvent,index:number,id:string) {
  if (event.target !== event.currentTarget) return
  const headers = [...document.querySelectorAll<HTMLElement>('.palette-tree .palette-header')]
  let target = -1
  if (event.key === 'ArrowDown') target = Math.min(index+1,headers.length-1)
  else if (event.key === 'ArrowUp') target = Math.max(index-1,0)
  else if (event.key === 'Home') target = 0
  else if (event.key === 'End') target = headers.length-1
  else if (event.key === 'Enter' || event.key === ' ') toggle(id)
  else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    const open = (event.key === 'ArrowRight') !== (document.documentElement.dir === 'rtl')
    const isOpen = !!props.searching || expanded.value.has(id)
    if (!props.searching && open !== isOpen) setPaletteExpanded(id,open)
    else if (open && isOpen) (event.currentTarget as HTMLElement).parentElement?.querySelector<HTMLElement>('.palette-cell')?.focus()
  } else return
  if (target >= 0) headers[target]?.focus()
  event.preventDefault();event.stopPropagation()
}
function toggle(id: string) {
  if (props.searching) return
  const next = !expanded.value.has(id)
  expanded.value = new Set(expanded.value)
  if (next) expanded.value.add(id)
  else expanded.value.delete(id)
  setPaletteExpanded(id, next)
}
</script>
<template>
  <div class="palette-tree" role="group" aria-label="Palettes">
    <div v-for="(item,index) in items" :key="item.value" class="palette-tree-item" :data-palette="item.value" :data-palette-type="item.palette.type" :class="{ expanded: searching || expanded.has(item.value), 'drop-before':dropOver?.id===item.value && dropOver.where==='before', 'drop-after':dropOver?.id===item.value && dropOver.where==='after' }">
      <div class="palette-header" role="button" tabindex="0" :aria-expanded="searching || expanded.has(item.value)" :aria-label="searching ? arg(qtrc('palette','%1, contains %Ln matching element(s)','',item.palette.cells.length),item.label) : expanded.has(item.value) ? arg(qtrc('palette','%1 expanded','tree item not collapsed'),item.label) : item.label" @click="state.singleClickToOpen && toggle(item.value)" @dblclick="!state.singleClickToOpen && toggle(item.value)" :draggable="!searching" @dragstart="dragStart($event,item.value)" @dragover="dragOver($event,item.value)" @dragleave="dropOver=null" @drop="dropPalette($event,item.value)" @keydown="headerKey($event,index,item.value)" @contextmenu="contextMenu($event,item.palette,index)">
        <button type="button" class="palette-expand" tabindex="-1" :aria-label="qtrc('global',searching || expanded.has(item.value) ? 'Collapse' : 'Expand')" @click.stop="toggle(item.value)">{{ String.fromCodePoint(searching || expanded.has(item.value) ? ICON_CODES.SMALL_ARROW_DOWN : ICON_CODES.SMALL_ARROW_RIGHT) }}</button>
        <span class="palette-name">{{ item.label }}</span><button v-if="!searching" type="button" class="palette-menu-button" tabindex="-1" :aria-label="`${item.label}: ${qtrc('global','Menu')}`" :title="qtrc('global','Menu')" aria-haspopup="menu" :aria-expanded="menu?.id === item.value" @click.stop="menu?.id === item.value ? menu=null : openMenu(item.palette,index,($event.currentTarget as HTMLElement).getBoundingClientRect())">{{ String.fromCodePoint(ICON_CODES.MENU_THREE_DOTS) }}</button>
      </div>
      <div v-if="searching || expanded.has(item.value)" class="palette-container" role="group">
        <PaletteGridView :palette="item.palette" :editable="!searching && item.palette.editable" :show-more="!searching" :more-expanded="moreId === item.value" @more="toggleMore(item.value)" @escape="focusHeader(item.value)" />
        <div v-if="moreId === item.value && more" class="palette-more-popup" role="dialog" :aria-label="`${item.label}: ${qtrc('palette', 'More')}`" @keydown.esc.stop="closeMore(true)">
          <button type="button" class="secondary palette-add-to" :disabled="!item.palette.editable || (!selected.length && !customSelected.length)" @click="addCellsToPalette(item.value, selected); addCellsToPalette(item.value, customSelected); selected = []; customSelected = []">{{ arg(qtrc('palette', 'Add to %1'), item.label) }}</button>
          <div v-if="item.palette.custom && more.poolName" class="palette-more-label">{{ more.poolName }}</div>
          <PaletteGridView :palette="{ ...item.palette, cells: more.pool }" pool="more" selecting :selected="selected" @select="selectCell" @escape="closeMore(true)" />
          <template v-if="more.custom.length"><div class="palette-more-custom-header"><span class="palette-more-label">{{ qtrc('palette','Custom') }}</span><button type="button" class="icon" :disabled="!customSelected.length" :aria-label="qtrc('palette','Delete')" :title="qtrc('palette','Delete')" @click="removePaletteCells(customSelected,askRemove,'custom'); customSelected=[]">{{ String.fromCodePoint(ICON_CODES.DELETE_TANK) }}</button></div><PaletteGridView :palette="{...item.palette,cells:more.custom,name:qtrc('palette','Custom')}" pool="custom" selecting :selected="customSelected" @select="selectCustom" @escape="closeMore(true)" /></template>
          <div class="palette-more-hint">{{ qtrc('palette', 'Drag items to the palette or directly on your score') }}</div>
        </div>
      </div>
      <MenuPopup v-if="menu?.id === item.value" :items="menu.items" :anchor="menu.anchor" placement="below" :label="item.label" @close="closeMenu" />
    </div>
    <PaletteProperties v-if="propertiesId" :id="propertiesId" @close="propertiesId=null" />
    <PaletteQuestion v-if="question" :text="question.text" :buttons="question.buttons" @answer="answer" />
  </div>
</template>
