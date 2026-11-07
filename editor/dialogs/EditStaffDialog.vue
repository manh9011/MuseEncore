<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { shallowRef } from 'vue'
import { createEditStaff } from '../../src/index'
import { currentScore } from '../scoreview'
const pending=shallowRef<ReturnType<typeof createEditStaff>>(null)
export function canOpenStaffProperties():boolean{return !!currentScore()&&!!createEditStaff(currentScore()!)}
export function openStaffProperties():void{const score=currentScore();pending.value=score?createEditStaff(score):null}
</script>
<script setup lang="ts">
import { computed, nextTick, ref, shallowRef as modelRef, watch } from 'vue'
import { ICON_CODES } from '../actions/uiactiondata'
import { AutoOnOff, PreferSharpFlat, type EditStaff, type EditStaffType } from '../../src/index'
import EditStaffTypeDialog from './EditStaffTypeDialog.vue'
import EditStringDataDialog from './EditStringDataDialog.vue'
import EditPitchDialog, { pitchToString } from './EditPitchDialog.vue'
import { askInstrument } from './selectinstrumentstate'
import { qtrc, useLanguage } from '../i18n'
import { scoreChanged } from '../scoreview'
import { closeDialog } from '../session'
useLanguage()
const model=modelRef<EditStaff|null>(null)
const rev=ref(0), invalid=ref(false), stringEdit=ref(false), strings=ref<{pitch:number;open:boolean}[]>([]), frets=ref(0), pitch=ref<{key:string;value:number}|null>(null), staffType=ref<EditStaffType|null>(null)
const dialog=ref<HTMLDialogElement|null>(null)
watch(pending,async m=>{model.value=m;sync();if(m){await nextTick();dialog.value?.showModal()}})
const values=computed(()=>{void rev.value;return model.value?.values()})
function sync(){if(!model.value)return;rev.value++;strings.value=model.value.strings();frets.value=model.value.frets()}
function set(p:Record<string,unknown>){model.value?.setValues(p);sync()}
function apply(){if(!model.value)return false;const ok=model.value.apply();invalid.value=!ok;scoreChanged();sync();return ok}
function finish(){pending.value=null;closeDialog()}
function openStringEdit(){stringEdit.value=true}
function closeStringEdit(v:{strings:{pitch:number;open:boolean}[];frets:number}|null){stringEdit.value=false;if(v){model.value?.setStringData(v.frets,v.strings);sync()}}
function closePitch(p:number|null){const field=pitch.value;pitch.value=null;if(p!==null&&field)set({[field.key]:p})}
function applyOnly(){apply()}
function accept(){if(apply())dialog.value?.close()}
async function replaceInstrument(){const id=await askInstrument();if(id&&model.value?.replaceInstrument(id))sync()}
function editPitch(key:'minPitchA'|'maxPitchA'|'minPitchP'|'maxPitchP'){if(values.value)pitch.value={key,value:values.value[key]}}
const tr=(s:string)=>qtrc('EditStaffBase',s)
const intervalNames=['0 - Perfect unison','1 - Augmented unison','0 - Diminished second','1 - Minor second','2 - Major second','3 - Augmented second','2 - Diminished third','3 - Minor third','4 - Major third','5 - Augmented third','4 - Diminished fourth','5 - Perfect fourth','6 - Augmented fourth','6 - Diminished fifth','7 - Perfect fifth','8 - Augmented fifth','7 - Diminished sixth','8 - Minor sixth','9 - Major sixth','10 - Augmented sixth','9 - Diminished seventh','10 - Minor seventh','11 - Major seventh','12 - Augmented seventh','11 - Diminished octave','12 - Perfect octave']
</script>
<template>
 <dialog v-if="pending && values && model" ref="dialog" class="edit-staff" aria-labelledby="edit-staff-title" @close.self="finish">
  <h2 id="edit-staff-title">{{tr('Staff/Part properties')}}</h2>
  <form @submit.prevent="accept">
   <fieldset class="groupbox"><legend>{{tr('Staff properties')}}</legend><div class="edit-staff-grid">
    <label v-for="[label,key,min,max,step,suffix] in [['Lines:','lines',1,14,1,''],['Line distance:','lineDistance',0,99,.25,'sp'],['Scale:','mag',10,1000,1,'%'],['Extra distance above staff:','extraDistance',-50,50,.25,'sp']] as const" :key="key" class="field-row"><span>{{tr(label)}}</span><span class="spin"><input type="number" :min="min" :max="max" :step="step" :value="values[key]" @input="set({[key]:Math.max(min,Math.min(max,Number(($event.target as HTMLInputElement).value)))})" /><span v-if="suffix" class="suffix">{{suffix==='sp'?tr(suffix):suffix}}</span></span></label>
    <div class="field-row"><span>{{tr('Style group:')}}</span><span class="staff-group">{{model.staffGroupName()}}</span></div>
    <label class="field-row"><span>{{tr('Merge matching rests:')}}</span><select :value="values.mergeMatchingRests" @change="set({mergeMatchingRests:Number(($event.target as HTMLSelectElement).value)})"><option :value="AutoOnOff.AUTO">{{tr('Auto')}}</option><option :value="AutoOnOff.ON">{{tr('On')}}</option><option :value="AutoOnOff.OFF">{{tr('Off')}}</option></select></label>
    <label class="field-row"><span>{{tr('Staff line color:')}}</span><input type="color" :value="values.color" @input="set({color:($event.target as HTMLInputElement).value})" /></label>
   </div><div class="edit-staff-checks"><label v-for="[label,key] in [['Show clef','showClef'],['Show time signature','showTimesig'],['Show barlines','showBarlines'],['Invisible staff lines','invisible'],['Hide system barline','hideSystemBarLine']] as const" :key="key" class="check"><input type="checkbox" :checked="values[key] as boolean" @change="set({[key]:($event.target as HTMLInputElement).checked})" />{{tr(label)}}</label></div><div><button type="button" class="secondary advanced-style" @click="staffType=model?.createEditStaffType()??null">{{tr('Advanced style properties…')}}</button></div></fieldset>
   <fieldset class="groupbox"><legend>{{tr('Part properties')}}</legend>
    <div class="field-row instrument-row"><span>{{tr('Instrument:')}}</span><span class="instrument-name">{{model.instrumentName()}}</span><button type="button" class="secondary replace-instrument" @click="replaceInstrument">{{tr('Replace instrument…')}}</button></div>
    <label class="field"><span>{{tr('Long instrument name:')}}</span><textarea rows="2" :value="values.longName" @input="set({longName:($event.target as HTMLTextAreaElement).value})" /></label><label class="field"><span>{{tr('Short instrument name:')}}</span><textarea rows="2" :value="values.shortName" @input="set({shortName:($event.target as HTMLTextAreaElement).value})" /></label>
    <p v-if="invalid" class="error" role="alert">{{qtrc('notation/staffpartproperties','Invalid instrument name')}}: {{qtrc('notation/staffpartproperties','The instrument name is invalid.')}}</p>
    <div class="pitch-ranges"><span>{{tr('Usable pitch range:')}}</span><span v-for="[label,low,high] in [['Amateur:','minPitchA','maxPitchA'],['Professional:','minPitchP','maxPitchP']] as const" :key="low" class="pitch-range"><span>{{tr(label)}}</span><template v-for="(key,i) in [low,high]" :key="key"><span v-if="i">-</span><span class="pitch-field"><input type="text" readonly :value="pitchToString(values[key])" :aria-label="key"/><button type="button" class="icon-button" :title="tr('Edit')" :aria-label="tr('Edit')" @click="editPitch(key)">{{String.fromCodePoint(ICON_CODES.EDIT)}}</button></span></template></span></div>
    <div class="transposition" :title="tr('Interval from written to sounding pitch')"><span>{{tr('Transposition:')}}</span><select :aria-label="tr('Interval')" :value="values.intervalIndex" @change="set({intervalIndex:Number(($event.target as HTMLSelectElement).value)})"><option v-for="(label,i) in intervalNames" :key="i" :value="i">{{tr(label)}}</option></select><input type="number" :aria-label="tr('Octave')" min="0" max="10" :value="values.octave" @input="set({octave:Math.max(0,Math.min(10,Number(($event.target as HTMLInputElement).value)||0))})"/><span>{{tr('Octave(s) +')}}</span><label class="check"><input type="radio" name="edit-staff-direction" :checked="values.up" @change="set({up:true})"/>{{tr('Up')}}</label><label class="check"><input type="radio" name="edit-staff-direction" :checked="!values.up" @change="set({up:false})"/>{{tr('Down')}}</label></div>
    <label v-if="model.showPreferSharpFlat()" class="field-row"><span>{{tr('Prefer sharps or flats for transposed key signatures:')}}</span><select :value="values.preferSharpFlat" @change="set({preferSharpFlat:Number(($event.target as HTMLSelectElement).value)})"><option :value="PreferSharpFlat.NONE">{{tr('None')}}</option><option :value="PreferSharpFlat.SHARPS">{{tr('Sharps')}}</option><option :value="PreferSharpFlat.FLATS">{{tr('Flats')}}</option><option :value="PreferSharpFlat.AUTO">{{tr('Auto')}}</option></select></label>
    <div v-if="strings.length" class="string-data-frame"><span>{{tr('Number of strings:')}}</span><span class="num-strings">{{strings.length}}</span><button type="button" class="secondary" @click="openStringEdit">{{tr('Edit string data…')}}</button><label class="check"><input type="checkbox" :checked="values.noReflectTranspositionInLinkedTab" @change="set({noReflectTranspositionInLinkedTab:($event.target as HTMLInputElement).checked})"/>{{tr('Don’t reflect transposition in linked tablature staves')}}</label></div>
   </fieldset>
   <div class="dialog-buttons"><button type="button" class="icon-button" :disabled="!model.hasPreviousStaff()" :title="tr('Apply and go to previous staff')" :aria-label="tr('Apply and go to previous staff')" @click="model.gotoPreviousStaff();sync();scoreChanged()">{{String.fromCodePoint(ICON_CODES.ARROW_UP)}}</button><button type="button" class="icon-button" :disabled="!model.hasNextStaff()" :title="tr('Apply and go to next staff')" :aria-label="tr('Apply and go to next staff')" @click="model.gotoNextStaff();sync();scoreChanged()">{{String.fromCodePoint(ICON_CODES.ARROW_DOWN)}}</button><span class="spacer"/><button type="button" class="secondary" @click="dialog?.close()">{{qtrc('global','Cancel')}}</button><button type="button" class="secondary" @click="applyOnly">{{qtrc('global','Apply')}}</button><button type="submit" class="primary">{{qtrc('global','OK')}}</button></div>
  </form>
  <EditStaffTypeDialog v-if="staffType" :model="staffType as object" @close="accepted=>{const m=staffType;staffType=null;if(accepted&&m){model?.setStaffType(m.getStaffType());sync()}}" />
  <EditStringDataDialog v-if="stringEdit" :value="{strings,frets}" @close="closeStringEdit" />
  <EditPitchDialog v-if="pitch" :midi-code="pitch.value" @close="closePitch" />
 </dialog>
</template>
