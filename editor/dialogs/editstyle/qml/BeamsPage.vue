<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { qtrc, useLanguage } from '../../../i18n'
import { ICON_CODES } from '../../../actions/uiactiondata'
import { styleDialogImage } from './images'
import type { NotationStyleLike } from './controls.vue'
const props = defineProps<{ style: NotationStyleLike }>()
useLanguage()
const fields = [
  { id: 'beamWidth', label: 'Beam thickness', step: 0.01 },
  { id: 'beamMinLen', label: 'Broken beam minimum length', step: 0.05 },
] as const
const text = ref(fields.map(f => String(props.style.value(f.id) ?? 0)))
watch(() => fields.map(f => props.style.value(f.id)), values => { text.value = values.map(v => String(v ?? 0)) })
function commit(index: number) {
  const value = parseFloat(text.value[index].replace(',', '.'))
  if (Number.isFinite(value)) props.style.setValue(fields[index].id, Number(Math.max(0, Math.min(99, value)).toFixed(2)))
  text.value[index] = String(props.style.value(fields[index].id) ?? 0)
}
function step(index: number, direction: number) {
  text.value[index] = String((parseFloat(text.value[index].replace(',', '.')) || 0) + direction * fields[index].step)
  commit(index)
}
</script>
<template>
  <div class="sd-page" style="gap:18px">
    <div class="sd-column" style="gap:8px"><span class="sd-label">{{ qtrc('notation','Beam distance') }}</span><div class="sd-flat-radio-group" role="radiogroup" style="gap:12px"><button v-for="option in [{ value:false, icon:ICON_CODES.USE_WIDE_BEAMS_REGULAR, label:'Regular' }, { value:true, icon:ICON_CODES.USE_WIDE_BEAMS_WIDE, label:'Wide' }]" :key="String(option.value)" type="button" role="radio" class="sd-flat-radio stacked" style="width:106px;height:70px;flex:0 0 auto" :aria-checked="style.value('useWideBeams') === option.value" @click="style.setValue('useWideBeams',option.value)"><span class="sd-icon" aria-hidden="true" style="font-size:28px">{{ String.fromCodePoint(option.icon) }}</span>{{ qtrc('notation',option.label) }}</button></div></div>
    <div v-for="(field,index) in fields" :key="field.id" class="sd-column" style="gap:8px"><span class="sd-label">{{ qtrc('notation',field.label) }}</span><div class="sd-spinbox" style="width:106px"><input v-model="text[index]" type="text" inputmode="decimal" :aria-label="qtrc('notation',field.label)" @blur="commit(index)" @keydown.enter.prevent="commit(index)" @keydown.up.prevent="step(index,1)" @keydown.down.prevent="step(index,-1)" @keydown.esc.stop="text[index]=String(style.value(field.id) ?? 0)"><span class="sd-unit">{{ qtrc('global','sp') }}</span><span class="sd-steppers"><button type="button" tabindex="-1" aria-label="+" @mousedown.prevent @click="step(index,1)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_UP) }}</button><button type="button" tabindex="-1" aria-label="-" @mousedown.prevent @click="step(index,-1)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_DOWN) }}</button></span></div></div>
    <label class="sd-checkbox"><input type="checkbox" :checked="style.value('beamNoSlope') === true" @change="style.setValue('beamNoSlope',!style.value('beamNoSlope'))"><span>{{ qtrc('notation','Flatten all beams') }}</span></label>
    <fieldset class="sd-groupbox"><legend>{{ qtrc('notation','Beam style') }}</legend><div class="sd-column" style="gap:12px"><div class="sd-row" style="gap:12px"><div style="flex:1"><div class="sd-column" role="radiogroup" style="gap:8px"><label v-for="option in [{value:false,label:'Draw inner stems through beams'},{value:true,label:'Draw inner stems to nearest beam (“French” style)'}]" :key="String(option.value)" class="sd-radio"><input type="radio" name="beam-style" :checked="style.value('frenchStyleBeams') === option.value" @change="style.setValue('frenchStyleBeams',option.value)"><span>{{ qtrc('notation',option.label) }}</span></label></div></div><div class="sd-image" style="padding:12px 8px"><img :src="styleDialogImage(style.value('frenchStyleBeams') ? 'beamImages/beam_style_french.svg' : 'beamImages/beam_style_regular.svg')" alt="" style="width:140px;height:52px"></div></div></div></fieldset>
  </div>
</template>
