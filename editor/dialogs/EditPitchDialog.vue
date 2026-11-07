<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { qtrc as translatePitch } from '../i18n'
const NOTE_NAMES=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B','C']
export function pitchToString(pitch:number):string { if(pitch<0||pitch>127)return ''; return translatePitch('global/pitchName',`${NOTE_NAMES[pitch%12]}${Math.trunc(pitch/12)-1}`) }
</script>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { qtrc, useLanguage } from '../i18n'
useLanguage()
const props=withDefaults(defineProps<{open?:boolean;midiCode?:number}>(),{open:true,midiCode:60})
const emit=defineEmits<{(e:'close',pitch:number|null):void}>()
const rows=11, cols=13
const initialPitch = Math.max(0, Math.min(127, Math.trunc(props.midiCode)))
const current=ref({row:rows-1-Math.trunc(initialPitch/12),col:initialPitch%12})
const result=ref<number|null>(null)
const cells=ref<(HTMLElement|null)[]>([]), dialog=ref<HTMLDialogElement|null>(null)
onMounted(()=>{if(props.open){dialog.value?.showModal();focusCurrent()}})
function focusCurrent(){cells.value[current.value.row*cols+current.value.col]?.focus()}
function focusCell(el:unknown,index:number){cells.value[index]=el as HTMLElement|null}
watch(()=>props.open,async open=>{if(open){result.value=null;await nextTick();dialog.value?.showModal();focusCurrent()}else if(dialog.value?.open)dialog.value.close()})
function exists(row:number,col:number){return !(row===0&&col>7)}
function choose(row:number,col:number){result.value=Math.max(0,Math.min((rows-1-row)*12+col,127));dialog.value?.close()}
function closeDialog(){if(result.value===null)emit('close',null);else emit('close',result.value)}
function move(row:number,col:number){if(row<0||row>=rows||col<0||col>=cols||!exists(row,col))return;current.value={row,col};cells.value[row*cols+col]?.focus()}
const tr=(s:string)=>qtrc('EditPitchBase',s)
</script>
<template>
 <dialog ref="dialog" class="edit-pitch" aria-labelledby="edit-pitch-title" @close="closeDialog"><h2 id="edit-pitch-title">{{tr('Note selection')}}</h2>
  <p>{{ tr('Select note:') }}</p><table class="pitch-table" role="grid"><thead><tr><th /> <th v-for="(n,i) in NOTE_NAMES" :key="i" scope="col">{{ tr(n) }}</th></tr></thead><tbody><tr v-for="row in rows" :key="row"><th scope="row">{{ tr(`Octave ${10-row}`) }}</th><template v-for="col in cols" :key="col"><td v-if="exists(row-1,col-1)" :ref="el=>focusCell(el,(row-1)*cols+col-1)" role="gridcell" :aria-selected="current.row===row-1&&current.col===col-1" :tabindex="current.row===row-1&&current.col===col-1?0:-1" @click="current={row:row-1,col:col-1};focusCurrent()" @dblclick="choose(row-1,col-1)" @keydown="e=>{const d:Record<string,[number,number]>={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]};if(d[e.key]){e.preventDefault();move(row-1+d[e.key][0],col-1+d[e.key][1])}else if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(row-1,col-1)}}">{{ qtrc('global/pitchName',`${NOTE_NAMES[col-1]}${col===cols?11-row:10-row}`) }}</td><td v-else /> </template></tr></tbody></table>
  <div class="dialog-buttons"><button type="button" class="secondary" @click="dialog?.close()">{{ qtrc('global','Cancel') }}</button><button type="button" class="primary" @click="choose(current.row,current.col)">{{ qtrc('global','OK') }}</button></div>
 </dialog>
</template>
