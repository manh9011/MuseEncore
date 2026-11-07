<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { qtrc, useLanguage } from '../i18n'
import { pitchToString } from './EditPitchDialog.vue'
import EditPitchDialog from './EditPitchDialog.vue'
export interface StringDataValue { strings: { pitch: number; open: boolean }[]; frets: number }
const props=defineProps<{value:StringDataValue}>()
const emit=defineEmits<{(e:'close',value:StringDataValue|null):void}>()
useLanguage()
const strings=ref([...props.value.strings].reverse()), frets=ref(props.value.frets), current=ref(props.value.strings.length?0:-1)
const pitchEdit=ref<{index:number|null;pitch?:number}|null>(null)
const tip=qtrc('notation/editstringdata','<b>Always open</b><br>On tablature staves, fret positions other than ‘0’ cannot be entered on strings marked ‘always open’. Useful for instruments with strings that are not on the fretboard, such as the theorbo.').replace(/<br\s*\/?>/g,'\n').replace(/<[^>]+>/g,'')
const tr=(s:string)=>qtrc('EditStringDataBase',s)
const dialog=ref<HTMLDialogElement|null>(null), result=ref<StringDataValue|null>(null)
onMounted(()=>dialog.value?.showModal())
function save(){result.value={strings:[...strings.value].reverse(),frets:frets.value};dialog.value?.close()}
function changePitch(p:number|null){const edit=pitchEdit.value;pitchEdit.value=null;if(p===null||!edit)return;if(edit.index===null){const i=current.value+1<=0?strings.value.length:current.value+1;strings.value.splice(i,0,{pitch:p,open:false});current.value=i}else strings.value[edit.index]={...strings.value[edit.index],pitch:p}}
</script>
<template>
 <dialog ref="dialog" class="edit-string-data" aria-labelledby="edit-string-data-title" @close.self="emit('close',result)">
  <h2 id="edit-string-data-title">{{tr('String data')}}</h2><div class="string-data-body"><div class="string-data-list"><p>{{tr('Default strings tuning:')}}</p><table class="string-table"><thead><tr><th :title="tip">{{qtrc('notation/editstringdata','Always open')}}</th><th>{{qtrc('notation/editstringdata','Pitch')}}</th></tr></thead><tbody><tr v-for="(item,i) in strings" :key="i" :aria-selected="i===current" @click="current=i" @dblclick="pitchEdit={index:i,pitch:item.pitch}"><td><input type="checkbox" :checked="item.open" :aria-label="qtrc('notation/editstringdata','Always open')" :title="tip" @change="strings[i]={...item,open:($event.target as HTMLInputElement).checked}" /></td><td>{{pitchToString(item.pitch)}}</td></tr></tbody></table><label class="frets"><span>{{tr('Number of frets:')}}</span><input type="number" min="0" max="99" :value="frets" @input="frets=Number(($event.target as HTMLInputElement).value)||0" /></label></div><div class="string-data-buttons"><button type="button" class="secondary" @click="pitchEdit={index:null}">{{tr('New string…')}}</button><button type="button" class="secondary" :disabled="current<0" @click="pitchEdit={index:current,pitch:strings[current]?.pitch}">{{tr('Edit string…')}}</button><button type="button" class="secondary" :disabled="current<0" @click="strings.splice(current,1);current=Math.min(current,strings.length-1)">{{tr('Delete string')}}</button></div></div>
  <div class="dialog-buttons"><button type="button" class="secondary" @click="dialog?.close()">{{qtrc('global','Cancel')}}</button><button type="button" class="primary" @click="save">{{qtrc('global','OK')}}</button></div><EditPitchDialog v-if="pitchEdit" :midi-code="pitchEdit.pitch" @close="changePitch" />
 </dialog>
</template>
