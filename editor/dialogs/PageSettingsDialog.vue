<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { shallowRef } from 'vue'
import { createPageSettings, type Score } from '../../src/index'
import { currentScore } from '../scoreview'
const pending=shallowRef<Score|null>(null)
export function openPageSettingsDialog(){pending.value=currentScore()}
</script>
<script setup lang="ts">
import { computed, nextTick, ref, shallowRef as stateRef, watch } from 'vue'
import { PageSettings } from '../../src/index'
import { qtrc, useLanguage } from '../i18n'
import { scoreChanged } from '../scoreview'
import { settings, updateSettings } from '../settings'
import PageSpin from './PageSpin.vue'
useLanguage()
const ps=stateRef<PageSettings|null>(null),revision=ref(0),dialog=ref<HTMLDialogElement|null>(null)
let accepted=false
watch(pending,async score=>{if(score){accepted=false;const page=createPageSettings(score,settings().ui.metricUnit,mm=>updateSettings('ui',{metricUnit:mm}));page.show();ps.value=page;revision.value++;await nextTick();dialog.value?.showModal()}else ps.value=null})
const values=computed(()=>{void revision.value;return ps.value?.values()})
const sizes=PageSettings.pageSizes(), tr=(s:string)=>qtrc('PageSettingsBase',s)
function changed(){revision.value++;scoreChanged(false)}
function finish(accept:boolean){if(!ps.value)return;if(accept){accepted=true;ps.value.accept();scoreChanged(false)};dialog.value?.close()}
function closed(){if(!accepted){ps.value?.reject();scoreChanged(false)}pending.value=null}
</script>
<template>
 <dialog v-if="ps && values" ref="dialog" class="page-settings" aria-labelledby="page-settings-title" @close.self="closed">
  <h2 id="page-settings-title">{{ tr('Page settings') }}</h2>
  <form @submit.prevent="finish(true)"><div class="page-settings-columns"><div class="page-settings-column">
   <fieldset class="groupbox"><legend>{{tr('Page size')}}</legend>
    <select :value="values.pageGroup" :aria-label="tr('Page size')" @change="ps.pageFormatSelected(Number(($event.target as HTMLSelectElement).value));changed()"><option v-for="s in sizes" :key="s.id" :value="s.id">{{s.name}}</option></select>
    <label class="field-row"><span>{{tr('Width:')}}</span><PageSpin name="pageWidth" :ps="ps" :revision="revision" :label="tr('Width:')" @changed="changed" /></label>
    <label class="field-row"><span>{{tr('Height:')}}</span><PageSpin name="pageHeight" :ps="ps" :revision="revision" :label="tr('Height:')" @changed="changed" /></label>
    <div class="radio-row"><label class="check"><input type="radio" name="orientation" :checked="values.portrait" @change="ps.orientationClicked();changed()" />{{tr('Portrait')}}</label><label class="check"><input type="radio" name="orientation" :checked="values.landscape" @change="ps.orientationClicked();changed()" />{{tr('Landscape')}}</label></div>
    <label class="check"><input type="checkbox" :checked="values.twosided" @change="ps.twosidedToggled(($event.target as HTMLInputElement).checked);changed()" />{{tr('Two sided')}}</label>
   </fieldset>
   <fieldset class="groupbox"><legend>{{tr('Scaling')}}</legend><label class="field-row" :title="tr('Distance between two lines on a standard 5-line staff')"><span>{{tr('Staff space (sp):')}}</span><PageSpin name="spatiumEntry" :ps="ps" :revision="revision" :label="tr('Staff space (sp):')" @changed="changed" /></label></fieldset>
   <fieldset class="groupbox"><legend>{{tr('Unit')}}</legend><div class="radio-row"><label class="check"><input type="radio" name="unit" :checked="!values.mmUnit" @change="ps.inchClicked();revision++" />{{tr('Inch (in)')}}</label><label class="check"><input type="radio" name="unit" :checked="values.mmUnit" @change="ps.mmClicked();revision++" />{{tr('Millimeter (mm)')}}</label></div></fieldset>
  </div><div class="page-settings-column">
   <fieldset v-for="prefix in ['odd','even'] as const" :key="prefix" class="groupbox"><legend>{{tr(prefix==='odd'?'Odd page margins':'Even page margins')}}</legend><div class="page-margins"><span v-for="side in ['Top','Left','Right','Bottom'] as const" :key="side" :class="side.toLowerCase()"><PageSpin :name="`${prefix}Page${side}Margin`" :ps="ps" :revision="revision" :label="tr(side)" @changed="changed" /></span></div></fieldset>
   <label class="field-row"><span>{{tr('First page number:')}}</span><input type="number" class="page-offset" min="-999999" max="999999" step="1" :value="values.pageOffsetEntry" @input="($event.target as HTMLInputElement).value!=='' && (ps.pageOffsetChanged(Math.round(Number(($event.target as HTMLInputElement).value))),changed())" /></label>
  </div></div><div class="dialog-buttons"><button type="button" class="secondary" @click="ps.resetPageStyle();changed()">{{tr('Reset all page settings to default')}}</button><span class="spacer" /><button v-if="ps.canApplyToAllParts()" type="button" class="secondary" @click="ps.applyToAllParts();changed()">{{tr('Apply to all parts')}}</button><button type="button" class="secondary" @click="finish(false)">{{qtrc('global','Cancel')}}</button><button type="submit" class="primary">{{qtrc('global','OK')}}</button></div></form>
 </dialog>
</template>
