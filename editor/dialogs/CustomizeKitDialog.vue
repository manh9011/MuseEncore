<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { shallowRef } from 'vue'
import { canCustomizeKit as canCustomizeScoreKit, createCustomizeKitDialog, type Score } from '../../src/index'
import { currentScore } from '../scoreview'
const pending=shallowRef<ReturnType<typeof createCustomizeKitDialog>>(null)
export function canCustomizeKit(score:Score|null){return !!score&&canCustomizeScoreKit(score)}
export function openCustomizeKitDialog(){const score=currentScore();pending.value=score?createCustomizeKitDialog(score):null}
</script>
<script setup lang="ts">
import { computed, nextTick, ref, shallowRef as modelRef, watch } from 'vue'
import './customizekit.css'
import { customizeKitNoteheadSymbols, DirectionV, drawCustomizeKitExample, CustomizeKitDialog as KitModel, NOTE_HEAD_NAMES, NoteHeadGroup, NoteHeadType } from '../../src/index'
import { allShortcuts, formatShortcut } from '../actions/actions'
import { showMessage } from '../components/MessageBox.vue'
import { pickFile, saveToComputer, type FilePickerType } from '../files'
import { arg, qtrc, useLanguage } from '../i18n'
import { scoreChanged } from '../scoreview'
useLanguage()
const model=modelRef<KitModel|null>(null), version=ref(0), sort=ref<{column:'pitch'|'note'|'shortcut'|'name';descending:boolean}>({column:'name',descending:true}), shortcutOpen=ref(false)
const dialog = ref<HTMLDialogElement|null>(null), list = ref<HTMLDivElement|null>(null)
watch(pending, async m=>{model.value=m;version.value++;if(m){await nextTick();dialog.value?.showModal();list.value?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({block:'center'})}})
const rows=computed(()=>{void version.value;return model.value?.rows()??[]}), current=computed(()=>{void version.value;return model.value?.currentPitch()??-1}), enabled=computed(()=>model.value?.pitchControlsEnabled()??false), custom=computed(()=>model.value?.customGroup()??false)
const tr=(s:string)=>qtrc('CustomizeKitDialog',s), symbols=customizeKitNoteheadSymbols()
function changed(f:()=>void){f();version.value++;scoreChanged(false)}
function selectPitch(p:number){model.value?.setCurrentPitch(p);version.value++}
function header(column:'pitch'|'note'|'shortcut'|'name'){const descending=sort.value.column===column?!sort.value.descending:false;sort.value={column,descending};model.value?.sortRows(column,descending);version.value++}
function example(ctx:CanvasRenderingContext2D|null){if(!ctx||!model.value)return;drawCustomizeKitExample(model.value,ctx,{width:70,height:80,dpr:window.devicePixelRatio||1,color:getComputedStyle(ctx.canvas).color})}
const canvas=ref<HTMLCanvasElement|null>(null)
watch([version, canvas],()=>{const c=canvas.value;if(c){const d=window.devicePixelRatio||1;c.width=70*d;c.height=80*d;example(c.getContext('2d'))}})

function finish(cancel=false){if(cancel)model.value?.cancel();pending.value=null;if(cancel)scoreChanged(false)}
const drmType:FilePickerType={description:qtrc('palette','MuseScore drumset file'),accept:{'application/x-musescore-drumset+xml':['.drm']}}
async function load(){const file=await pickFile(drmType);if(!file)return;const xml=await file.text();let result=model.value?.load(xml);if(result==='tooOld'){const answer=await showMessage(qtrc('palette','Drumset file too old'),qtrc('palette','MuseScore Studio may not be able to load this drumset file.'),['cancel','ignore']);if(answer!=='ignore')return;result=model.value?.load(xml,true)}if(result==='ok')version.value++}
async function save(){try{await saveToComputer(new TextEncoder().encode(model.value?.save()??''),'drumset.drm',drmType)}catch(e){await showMessage(qtrc('palette','Write drumset'),arg(qtrc('palette','Writing file failed: %1'),String(e)))}}
function apply(){model.value?.apply();scoreChanged(false);version.value++}
const shortcut=ref<string|null>(null), cleared=ref(false), shortcutDialog=ref<HTMLDialogElement|null>(null)
const conflictDrum=computed(()=>shortcut.value ? model.value?.drumsWithShortcut().find(d=>d.shortcut===shortcut.value) : undefined)
const conflictApp=computed(()=>shortcut.value && !conflictDrum.value ? allShortcuts().find(s=>s.shortcut===shortcut.value) : undefined)
const conflictTitle=computed(()=>conflictDrum.value?.title ?? conflictApp.value?.title ?? '')
async function beginShortcut(){shortcut.value=null;cleared.value=false;shortcutOpen.value=true;await nextTick();shortcutDialog.value?.showModal()}
function setShortcut(e:KeyboardEvent){if(['Enter','Delete','Backspace','ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Insert','Home','PageUp','PageDown','End','Tab','Escape','Shift','Control','Alt','Meta','CapsLock'].includes(e.key)||/^\d$/.test(e.key))return;if(e.key.length===1)shortcut.value=e.key.toUpperCase();else if(/^F\d+$/.test(e.key))shortcut.value=e.key;else return;cleared.value=false}
async function saveShortcut(){const origin=model.value?.shortcut()??'', value=shortcut.value??'';if((!origin&&cleared.value)||origin===value||(shortcut.value===null&&!cleared.value)){shortcutOpen.value=false;return}if(conflictTitle.value){const text=conflictApp.value?arg(qtrc('shortcuts','When this instrument is selected, <b>%1</b> will no longer run <b>%2</b>.'),conflictApp.value.shortcut,conflictApp.value.title):`${arg(qtrc('shortcuts','This shortcut is already assigned to: <b>%1</b>'),conflictTitle.value)}\n\n${arg(qtrc('shortcuts','Are you sure you want to assign it to <b>%1</b> instead?'),model.value?.name()??'')}`;const title=arg(qtrc('shortcuts','Reassign shortcut for <b>%1</b>'),model.value?.name()??'').replace(/<\/?b>/g,'');if(await showMessage(title,text.replace(/<\/?b>/g,''),['cancel','ok'])!=='ok')return}changed(()=>model.value?.setShortcut(value,conflictDrum.value?.pitch??-1));shortcutOpen.value=false}
</script>
<template>
 <dialog v-if="pending && model" ref="dialog" class="customize-kit" aria-labelledby="customize-kit-title" @close.self="finish(true)">
  <h2 id="customize-kit-title">{{tr('Customize kit')}}</h2>
  <div class="customize-kit-content">
   <div class="customize-kit-list" role="grid" :aria-label="tr('Customize kit')">
    <div class="customize-kit-header" role="row"><button v-for="[key,label] in [['pitch','Pitch'],['note','Note'],['shortcut','Shortcut'],['name','Name']] as const" :key="key" type="button" role="columnheader" :class="`col-${key}`" :aria-sort="sort.column===key?(sort.descending?'descending':'ascending'):undefined" @click="header(key)">{{key==='pitch'?'':tr(label)}}</button></div>
    <div ref="list" class="customize-kit-rows" tabindex="0" @keydown="(e:KeyboardEvent)=>{const i=rows.findIndex(r=>r.pitch===current);const n=e.key==='ArrowDown'?i+1:e.key==='ArrowUp'?i-1:-1;if(n>=0&&n<rows.length){e.preventDefault();selectPitch(rows[n].pitch);list?.children[n]?.scrollIntoView({block:'nearest'})}}"><div v-for="r in rows" :key="r.pitch" role="row" :aria-selected="r.pitch===current" class="customize-kit-row" @click="selectPitch(r.pitch)"><span class="col-pitch">{{r.pitch}}</span><span class="col-note">{{r.note}}</span><span class="col-shortcut">{{r.shortcut}}</span><span class="col-name">{{r.name}}</span></div></div>
   </div>
   <div class="customize-kit-settings">
    <label class="field-row"><span>{{tr('Name:')}}</span><input type="text" :value="model.name()" :placeholder="tr('Enter a name to enable pitch editing')" @change="model.setName(($event.target as HTMLInputElement).value);version++;scoreChanged(false)" /></label>
    <label class="field-row"><span>{{tr('Notehead group:')}}</span><select :value="model.noteHead()" :disabled="!enabled||custom" @change="changed(()=>model?.setNoteHead(Number(($event.target as HTMLSelectElement).value) as NoteHeadGroup))"><option v-if="!NOTE_HEAD_NAMES.includes(model.noteHead())" :value="model.noteHead()"/><option v-for="g in NOTE_HEAD_NAMES" :key="g" :value="g">{{KitModel.noteHeadName(g)}}</option></select></label>
    <fieldset class="groupbox" :disabled="!enabled"><legend><label class="check"><input type="checkbox" :checked="custom" @change="changed(()=>model?.setCustomGroup(($event.target as HTMLInputElement).checked))" />{{tr('Edit noteheads')}}</label></legend><label v-for="[title,type,index] in [['Quarter note',NoteHeadType.HEAD_QUARTER,2],['Half note',NoteHeadType.HEAD_HALF,1],['Whole note',NoteHeadType.HEAD_WHOLE,0],['Double whole note',NoteHeadType.HEAD_BREVIS,3]] as const" :key="type" class="field-row"><span>{{tr(title)}}</span><select :value="model.customNoteheads()[index]" :disabled="!enabled||!custom" @change="model.setCustomNotehead(type,Number(($event.target as HTMLSelectElement).value));version++"><option v-for="symbol in symbols" :key="symbol" :value="symbol">{{KitModel.symbolName(symbol)}}</option></select></label></fieldset>
    <div class="customize-kit-bottom"><canvas ref="canvas" class="customize-kit-example" style="width:70px;height:80px" aria-hidden="true"/><div class="customize-kit-form" :class="{disabled:!enabled}">
     <label class="field-row"><span>{{tr('Default voice:')}}</span><select :value="model.voice()" :disabled="!enabled" @change="changed(()=>model?.setVoice(Number(($event.target as HTMLSelectElement).value)))"><option v-for="v in [0,1,2,3]" :key="v" :value="v">{{v+1}}</option></select></label>
     <label class="field-row"><span>{{tr('Staff line:')}}</span><input type="number" min="-12" max="99" :value="model.staffLine()" :disabled="!enabled" @input="($event.target as HTMLInputElement).value!=='' && changed(()=>model?.setStaffLine(Number(($event.target as HTMLInputElement).value)))" /></label>
     <div class="field-row"><span>{{tr('Shortcut:')}}</span><button type="button" class="secondary shortcut" :disabled="!enabled" @click="beginShortcut">{{model.shortcut()?formatShortcut(model.shortcut()):qtrc('shortcuts','None')}}</button></div>
     <label class="field-row"><span>{{tr('Stem direction:')}}</span><select :value="model.stemDirection()" :disabled="!enabled" @change="changed(()=>model?.setStemDirection(Number(($event.target as HTMLSelectElement).value) as DirectionV))"><option :value="DirectionV.AUTO">{{tr('Auto')}}</option><option :value="DirectionV.UP">{{tr('Up')}}</option><option :value="DirectionV.DOWN">{{tr('Down')}}</option></select></label>
    </div></div>
   </div>
  </div>
  <div class="dialog-buttons"><button type="button" class="secondary" @click="load">{{tr('Load…')}}</button><button type="button" class="secondary" @click="save">{{tr('Save as…')}}</button><span class="spacer"/><button type="button" class="secondary" @click="dialog?.close()">{{qtrc('global','Cancel')}}</button><button type="button" class="secondary" @click="apply">{{qtrc('global','Apply')}}</button><button type="button" class="primary" @click="apply();finish()">{{qtrc('global','OK')}}</button></div>
  <dialog v-if="shortcutOpen" ref="shortcutDialog" class="percussion-shortcut" aria-labelledby="percussion-shortcut-title" @cancel.prevent="shortcutOpen=false">
   <h2 id="percussion-shortcut-title">{{qtrc('shortcuts','Enter shortcut')}}</h2><p>{{qtrc('shortcuts','Define percussion keyboard shortcut')}}</p>
   <div class="shortcut-input" tabindex="0" autofocus role="textbox" :aria-label="qtrc('shortcuts','Enter shortcut')" @keydown="(e:KeyboardEvent)=>{if(!['Enter','Delete','Backspace','ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Insert','Home','PageUp','PageDown','End','Tab','Escape','Shift','Control','Alt','Meta','CapsLock'].includes(e.key)&&!/^\d$/.test(e.key)&&(e.key.length===1||/^F\d+$/.test(e.key))){e.preventDefault();e.stopPropagation();setShortcut(e)}}">{{shortcut ?? (cleared ? '' : model.shortcut())}}</div>
   <p v-if="conflictTitle" class="info">{{arg(qtrc('shortcuts','This shortcut is already assigned to: <b>%1</b>'),conflictTitle).replace(/<\/?b>/g,'')}}</p>
   <div class="dialog-buttons"><button type="button" class="secondary" @click="shortcut=null;cleared=true">{{qtrc('global','Clear')}}</button><span class="spacer"/><button type="button" class="secondary" @click="shortcutOpen=false">{{qtrc('global','Cancel')}}</button><button type="button" class="primary" @click="saveShortcut">{{qtrc('global','Save')}}</button></div>
  </dialog>
 </dialog>
</template>
