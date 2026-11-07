<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { qtrc, useLanguage } from '../../../i18n'
import { ICON_CODES } from '../../../actions/uiactiondata'
import type { NotationStyleLike } from './controls.vue'
const props = defineProps<{ style: NotationStyleLike; goToTextStylePage?: (code: string | number) => void }>()
useLanguage()
const fields = [{id:'measureRepeatNumberPos', min:-99, max:9999, step:0.5, decimals:2}, {id:'mrNumberEveryXMeasures', min:0, max:99, step:1, decimals:0}] as const
const text = ref(fields.map(f => String(props.style.value(f.id) ?? 0)))
watch(() => fields.map(f => props.style.value(f.id)), values => { text.value = values.map(v => String(v ?? 0)) })
function commit(index:number) { const f=fields[index], value=parseFloat(text.value[index].replace(',','.')); if(Number.isFinite(value)) props.style.setValue(f.id,Number(Math.max(f.min,Math.min(f.max,value)).toFixed(f.decimals))); text.value[index]=String(props.style.value(f.id) ?? 0) }
function step(index:number, direction:number) { text.value[index]=String((parseFloat(text.value[index].replace(',','.')) || 0)+direction*fields[index].step); commit(index) }
const checks = [
  ['oneMeasureRepeatShow1','Show ‘1’ on 1-measure repeats'],
  ['fourMeasureRepeatShowExtenders','Show extenders on 4-measure repeats'],
  ['mrNumberSeries','Number consecutive measure repeats'],
] as const
</script>
<template>
<div class="sd-column" style="gap:12px">
  <fieldset class="sd-groupbox"><legend>{{ qtrc('notation','Measure repeats') }}</legend><div class="sd-column" style="gap:12px">
    <div class="sd-row sd-control-row" style="gap:8px"><div class="sd-row-label"><span class="sd-label">{{ qtrc('notation','Number position:') }}</span></div><div class="sd-row-control" style="width:130px"><div class="sd-spinbox" style="width:130px"><input v-model="text[0]" type="text" inputmode="decimal" :aria-label="qtrc('notation','Number position:')" @blur="commit(0)" @keydown.enter.prevent="commit(0)" @keydown.up.prevent="step(0,1)" @keydown.down.prevent="step(0,-1)" @keydown.esc.stop="text[0]=String(style.value(fields[0].id) ?? 0)"><span class="sd-unit">{{ qtrc('global','sp') }}</span><span class="sd-steppers"><button type="button" tabindex="-1" aria-label="+" @mousedown.prevent @click="step(0,1)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_UP) }}</button><button type="button" tabindex="-1" aria-label="-" @mousedown.prevent @click="step(0,-1)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_DOWN) }}</button></span></div></div><button type="button" class="sd-flat-button icon-only" :aria-label="qtrc('global','Reset')" @click="style.resetValue?.(fields[0].id)"><span class="sd-icon">{{ String.fromCodePoint(ICON_CODES.UNDO) }}</span></button></div>
    <label v-for="[id,label] in checks" :key="id" class="sd-checkbox"><input type="checkbox" :checked="style.value(id) === true" @change="style.setValue(id,!style.value(id))"><span>{{ qtrc('notation',label) }}</span></label>
    <fieldset class="sd-groupbox" :class="{disabled: !style.value('mrNumberSeries')}" :disabled="!style.value('mrNumberSeries')"><div class="sd-column" style="gap:12px"><div class="sd-row" style="gap:12px"><span class="sd-label">{{ qtrc('notation','Every') }}</span><div class="sd-spinbox" style="width:100px"><input v-model="text[1]" type="text" inputmode="decimal" :aria-label="qtrc('notation','Every')" @blur="commit(1)" @keydown.enter.prevent="commit(1)" @keydown.up.prevent="step(1,1)" @keydown.down.prevent="step(1,-1)" @keydown.esc.stop="text[1]=String(style.value(fields[1].id) ?? 0)"><span class="sd-steppers"><button type="button" tabindex="-1" aria-label="+" @mousedown.prevent @click="step(1,1)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_UP) }}</button><button type="button" tabindex="-1" aria-label="-" @mousedown.prevent @click="step(1,-1)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_DOWN) }}</button></span></div><span class="sd-label">{{ qtrc('notation','measures') }}</span><button type="button" class="sd-flat-button icon-only" :aria-label="qtrc('global','Reset')" @click="style.resetValue?.(fields[1].id)"><span class="sd-icon">{{ String.fromCodePoint(ICON_CODES.UNDO) }}</span></button></div><label class="sd-checkbox"><input type="checkbox" :checked="style.value('mrNumberSeriesWithParentheses') === true" @change="style.setValue('mrNumberSeriesWithParentheses',!style.value('mrNumberSeriesWithParentheses'))"><span>{{ qtrc('notation','With parentheses') }}</span></label></div></fieldset>
  </div></fieldset>
  <fieldset class="sd-groupbox"><legend>{{ qtrc('notation','Repeat play count text') }}</legend><div class="sd-column" style="gap:12px">
    <label class="sd-toggle"><input type="checkbox" role="switch" :checked="style.value('repeatPlayCountShow') === true" @change="style.setValue('repeatPlayCountShow',!style.value('repeatPlayCountShow'))"><span class="sd-toggle-track" aria-hidden="true"></span><span>{{ qtrc('notation/editstyle/repeatplaycount','Automatically show text at repeat barlines') }}</span></label>
    <label class="sd-checkbox" :class="{disabled:!style.value('repeatPlayCountShow')}"><input type="checkbox" :disabled="!style.value('repeatPlayCountShow')" :checked="style.value('repeatPlayCountShowSingleRepeats') === true" @change="style.setValue('repeatPlayCountShowSingleRepeats',!style.value('repeatPlayCountShowSingleRepeats'))"><span>{{ qtrc('notation/editstyle/repeatplaycount','Show for single repeats (e.g. “x2”)') }}</span></label>
    <div class="sd-column" style="gap:8px"><span class="sd-label" :class="{disabled:!style.value('repeatPlayCountShow')}">{{ qtrc('notation','Preset') }}</span><div class="sd-row" :class="{disabled:!style.value('repeatPlayCountShow')}" style="gap:6px"><select class="sd-dropdown" :aria-label="qtrc('notation','Preset')" :disabled="!style.value('repeatPlayCountShow')" :value="style.value('repeatPlayCountPreset')" @change="style.setValue('repeatPlayCountPreset',Number(($event.target as HTMLSelectElement).value))"><option v-for="(label,index) in ['x3','3x','Play 3 times','3 repeats']" :key="index" :value="index">{{ qtrc('notation/editstyle/repeatplaycount',label) }}</option></select><button type="button" class="sd-flat-button" :disabled="!style.value('repeatPlayCountShow')" @click="goToTextStylePage?.('repeat-play-count')">{{ qtrc('notation','Edit text style') }}</button></div></div>
  </div></fieldset>
</div>
</template>
