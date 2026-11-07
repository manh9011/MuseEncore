<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { shallowRef } from 'vue'
import { type MasterScore } from '../../src/index'
import { currentMasterScore } from '../scoreview'
const pending = shallowRef<MasterScore | null>(null)
export function openPartsDialog(): void { pending.value = currentMasterScore() }
</script>
<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, shallowRef as modelRef, watch } from 'vue'
import './parts.css'
import { ICON_CODES } from '../actions/uiactiondata'
import { createPartListModel, type PartListModel } from '../../src/index'
import { qtrc, useLanguage } from '../i18n'
import { scoreChanged } from '../scoreview'
import { showMessage } from '../components/MessageBox.vue'
useLanguage()
const model = modelRef<PartListModel | null>(null)
const revision = ref(0)
const editing = ref(-1)
const editTitle = ref(''), warning = ref(''), menu = ref(-1), dialog = ref<HTMLDialogElement|null>(null)
watch(pending, async score => { if (score) { const m = createPartListModel(score); m.load(); model.value = m; revision.value++; editing.value=-1; await nextTick(); dialog.value?.showModal() } else model.value = null })
const items = computed(() => { void revision.value; return [...(model.value?.items() ?? [])] })
function outside(e:PointerEvent) { if (!(e.target as Element)?.closest('.part-menu')) menu.value=-1 }
document.addEventListener('pointerdown',outside,true)
onUnmounted(()=>document.removeEventListener('pointerdown',outside,true))
function changed() { revision.value++; scoreChanged(false) }
function close() { dialog.value?.close() }
async function beginEdit(i:number) { editing.value=i; editTitle.value=items.value[i]?.title ?? ''; warning.value=''; await nextTick(); const input=dialog.value?.querySelector<HTMLInputElement>(`[data-index="${i}"] input`);input?.focus();input?.select() }
function finishEdit(i:number) { if(editing.value!==i)return; model.value?.setPartTitle(i,editTitle.value); editing.value=-1; warning.value=''; changed() }
async function operation(i:number, op:string) {
 menu.value=-1; const m=model.value, item=items.value[i]; if(!m||!item)return
 if(op==='duplicate')m.copyPart(i)
 else if(op==='rename')beginEdit(i)
 else if(op==='reset') { if(m.resetPartNeedsQuestion(i)&&await showMessage(qtrc('notation','Are you sure you want to reset this part?'),'',['no','yes'])!=='yes')return; m.doResetPart(i) }
 else if(op==='delete') { if(m.removePartNeedsQuestion(i)&&await showMessage(qtrc('notation','Are you sure you want to delete this part?'),'',['no','yes'])!=='yes')return; m.doRemovePart(i) }
 changed()
}
</script>
<template>
 <dialog v-if="pending && model" ref="dialog" class="parts-dialog" aria-labelledby="parts-dialog-title" @close.self="pending=null">
  <h2 id="parts-dialog-title" class="visually-hidden">{{qtrc('notation','Parts')}}</h2><div class="parts-top-panel" role="toolbar" :aria-label="qtrc('notation','Parts actions')"><span class="parts-title" aria-hidden="true">{{qtrc('notation','Parts')}}</span><span class="spacer" /><button type="button" class="secondary" @click="beginEdit(model.createNewPart());changed()">{{qtrc('notation','Create new part')}}</button></div><div class="parts-header">{{qtrc('notation','Name')}}</div>
  <div class="parts-view" role="listbox" :aria-label="qtrc('notation','Parts view')" aria-multiselectable="true"><div v-for="(item,i) in items" :key="i" class="part-row" role="option" :aria-selected="item.isSelected" :data-index="i" @click="editing!==i && (model.selectPart(i,{shift:$event.shiftKey,ctrl:$event.ctrlKey||$event.metaKey}),changed())" @dblclick="beginEdit(i)"><span class="tool-icon part-icon" aria-hidden="true">{{String.fromCodePoint(ICON_CODES.NEW_FILE)}}</span><span v-if="editing===i" class="part-title-edit"><input v-model="editTitle" type="text" maxlength="40" :aria-label="item.title" @input="warning=model.validatePartTitle(i,editTitle)" @keydown.enter.prevent="finishEdit(i)" @keydown.esc.prevent.stop="editing=-1;warning=''" @blur="finishEdit(i)" /><span class="part-title-warning">{{warning}}</span></span><span v-else class="part-title">{{item.title}}</span><div class="part-menu"><button type="button" class="icon-button" :aria-label="item.title" aria-haspopup="menu" :aria-expanded="menu===i" @click.stop="menu=menu===i?-1:i"><span class="tool-icon" aria-hidden="true">{{String.fromCodePoint(ICON_CODES.MENU_THREE_DOTS)}}</span></button><div v-if="menu===i" class="part-menu-popup" role="menu"><button v-for="op in ['duplicate','rename','reset',...(item.isCustom?['delete']:[])]" :key="op" type="button" role="menuitem" :disabled="op==='reset'&&!item.isInited" @click.stop="operation(i,op)">{{qtrc('notation',op==='duplicate'?'Duplicate':op==='rename'?'Rename':op==='reset'?'Reset':'Delete')}}</button></div></div></div></div>
  <div class="dialog-buttons"><button type="button" class="secondary" @click="close">{{qtrc('global','Close')}}</button><span class="spacer" /><button type="button" class="secondary" @click="model.openAllParts();close()">{{qtrc('global','Open all')}}</button><button type="button" class="primary" :disabled="!model.hasSelection()" @click="model.openSelectedParts();close()">{{qtrc('global','Open selected')}}</button></div>
 </dialog>
</template>
