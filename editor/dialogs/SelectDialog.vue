<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { shallowRef } from 'vue'
import { createSelectDialog, type SelectDialog as SelectModel, type SelectNoteDialog as SelectNoteModel } from '../../src/index'
import { currentScore } from '../scoreview'
const pending=shallowRef<SelectModel|SelectNoteModel|null>(null)
export function openSelectDialog(){const score=currentScore();const model=score?createSelectDialog(score):null;if(model?.isValid())pending.value=model}
</script>
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { SelectNoteDialog as SelectNoteDialogModel, type SelectDialogAction } from '../../src/index'
import { qtrc, useLanguage } from '../i18n'
import { scoreChanged } from '../scoreview'
useLanguage()
const model=pending
const dialog=ref<HTMLDialogElement|null>(null)
watch(pending,async value=>{if(value){await nextTick();dialog.value?.showModal()}})
const note=computed(()=>model.value instanceof SelectNoteDialogModel)
const context=computed(()=>note.value?'SelectNoteDialog':'SelectDialog')
const revision=ref(0)
const values=computed(()=>{void revision.value;return model.value?.values as unknown as Record<string,boolean|SelectDialogAction>|undefined})
const tr=(s:string)=>qtrc(context.value,s)
function set(key:string,value:boolean|SelectDialogAction){if(!model.value)return;(model.value.values as unknown as Record<string,boolean|SelectDialogAction>)[key]=value;revision.value++}
function apply(){model.value?.apply();scoreChanged();dialog.value?.close()}
function close(){dialog.value?.close()}
</script>
<template>
 <dialog v-if="model && values" ref="dialog" class="select-dialog" aria-labelledby="select-dialog-title" @close.self="pending=null"><h2 id="select-dialog-title">{{tr(note?'Select notes':'Select')}}</h2><form @submit.prevent="apply"><fieldset class="groupbox"><legend>{{tr('Select')}}</legend><div class="select-grid">
  <template v-if="note"><template v-for="[key,label,value] in [['sameNotehead','Same notehead:',(model as SelectNoteModel).notehead],['samePitch','Same pitch:',(model as SelectNoteModel).pitch],['sameString','Same string:',(model as SelectNoteModel).string],['sameType','Same type:',(model as SelectNoteModel).type],['sameDurationType','Same note type:',(model as SelectNoteModel).durationType],['sameDurationTicks','Same duration:',(model as SelectNoteModel).durationTicks],['sameName','Same note name:',(model as SelectNoteModel).name]] as const" :key="key"><div><label class="check"><input type="checkbox" :checked="values[key] as boolean" :aria-label="tr(label)+value" @change="set(key,($event.target as HTMLInputElement).checked)" />{{tr(label)}}</label></div><div><span class="value">{{value}}</span></div></template></template>
  <template v-else><div><span class="label">{{tr('Element type:')}}</span></div><div><span class="value">{{(model as SelectModel).type}}</span></div><div style="grid-column:1 / span 2"><hr /></div><div><label class="check"><input type="checkbox" :checked="values.sameSubtype as boolean" :disabled="!(model as SelectModel).sameSubtypeEnabled" @change="set('sameSubtype',($event.target as HTMLInputElement).checked)" />{{tr('Same subtype:')}}</label></div><div><span class="value" :class="{disabled:!(model as SelectModel).subtypeEnabled}">{{(model as SelectModel).subtype}}</span></div></template>
  <div v-for="entry in (note ? [['sameStaff','Same staff',8,1],['inSelection','In selection',8,2],['sameVoice','Same voice',9,1],['sameSystem','Same system',9,2],['sameBeat','Same beat',10,1],['sameMeasure','Same measure',10,2]] : [['sameStaff','Same staff',4,1],['sameVoice','Same voice',5,1],['inSelection','In selection',5,2],['sameDuration','Same duration',6,1],['sameSystem','Same system',6,2],['sameBeat','Same beat',7,1],['sameMeasure','Same measure',7,2]])" :key="entry[0]" :style="{gridRow:String(entry[2]),gridColumn:String(entry[3])}"><label class="check"><input type="checkbox" :checked="values[entry[0] as string] as boolean" :disabled="entry[0]==='inSelection'&&!model.inSelectionEnabled || entry[0]==='sameDuration'&&!note&&!(model as SelectModel).sameDurationEnabled" @change="set(entry[0] as string,($event.target as HTMLInputElement).checked)" />{{tr(entry[1] as string)}}</label></div>
  </div></fieldset><fieldset class="groupbox"><legend>{{tr('Action')}}</legend><div class="select-grid"><div v-for="[action,label,row,col] in [['replace','Replace selection',1,1],['add','Add to selection',1,2],['subtract','Subtract from selection',2,2]] as const" :key="action" :style="{gridRow:String(row),gridColumn:String(col)}"><label class="check"><input type="radio" name="select-action" :checked="values.action===action" @change="set('action',action)" />{{tr(label)}}</label></div></div></fieldset><div class="dialog-buttons"><span class="spacer" /><button type="button" class="secondary" @click="close">{{qtrc('global','Cancel')}}</button><button type="submit" class="primary">{{qtrc('global','OK')}}</button></div></form></dialog>
</template>
