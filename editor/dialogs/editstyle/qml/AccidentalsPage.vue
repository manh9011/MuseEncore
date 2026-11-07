<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { qtrc, useLanguage } from '../../../i18n'
import { ICON_CODES } from '../../../actions/uiactiondata'
import { styleDialogImage } from './images'
import type { NotationStyleLike } from './controls.vue'
const props = defineProps<{ style: NotationStyleLike }>()
useLanguage()
const tr = (text: string) => qtrc('notation/editstyle/accidentals', text)
const padding = ref(String(props.style.value('bracketedAccidentalPadding') ?? 0))
watch(() => props.style.value('bracketedAccidentalPadding'), value => { padding.value = String(value ?? 0) })
function commitPadding() {
  const value = parseFloat(padding.value.replace(',', '.'))
  if (Number.isFinite(value)) props.style.setValue('bracketedAccidentalPadding', Number(Math.max(-10, Math.min(10, value)).toFixed(3)))
  padding.value = String(props.style.value('bracketedAccidentalPadding') ?? 0)
}
function stepPadding(delta: number) {
  padding.value = String((parseFloat(padding.value.replace(',', '.')) || 0) + delta)
  commitPadding()
}
const options = [
  ['accidentalOrderFollowsNoteDisplacement', 'followOffset', 'Keep accidentals close to offset notes'],
  ['keepAccidentalSecondsTogether', 'secondsAdjacent', 'Pair accidentals on seconds'],
  ['alignAccidentalOctavesAcrossSubChords', 'octaveSubchord', 'Align accidentals an octave apart across subchords'],
  ['alignOffsetOctaveAccidentals', 'octaveOffset', 'Align accidentals on offset octaves'],
] as const
</script>
<template>
  <div class="sd-column" style="gap:12px">
    <fieldset class="sd-groupbox"><legend>{{ tr('Accidentals') }}</legend><div class="sd-column" style="gap:12px"><div class="sd-row sd-control-row" style="gap:8px"><div class="sd-row-label"><span class="sd-label">{{ tr('Padding inside parentheses:') }}</span></div><div class="sd-row-control" style="width:80px"><label class="sd-spinbox" style="width:80px"><input v-model="padding" type="text" inputmode="decimal" :aria-label="tr('Padding inside parentheses:')" @blur="commitPadding" @keydown.enter.prevent="commitPadding" @keydown.up.prevent="stepPadding(0.1)" @keydown.down.prevent="stepPadding(-0.1)" @keydown.esc.stop="padding=String(style.value('bracketedAccidentalPadding') ?? 0)"><span class="sd-unit">{{ qtrc('global','sp') }}</span><span class="sd-steppers"><button type="button" tabindex="-1" aria-label="+" @mousedown.prevent @click="stepPadding(0.1)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_UP) }}</button><button type="button" tabindex="-1" aria-label="-" @mousedown.prevent @click="stepPadding(-0.1)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_DOWN) }}</button></span></label></div><button class="sd-flat-button icon-only" type="button" :aria-label="qtrc('global','Reset')" @click="style.resetValue?.('bracketedAccidentalPadding')"><span class="sd-icon">{{ String.fromCodePoint(ICON_CODES.UNDO) }}</span></button></div></div></fieldset>
    <fieldset class="sd-groupbox"><legend>{{ tr('Multiple accidentals in chords') }}</legend><div class="sd-column" style="gap:12px"><div v-for="[id,image,text] in options" :key="id" class="sd-row" style="gap:15px"><div class="sd-image" style="padding:10px 12px"><img :src="styleDialogImage(`accidentalImages/${image}-${style.value(id) ? 'ON' : 'OFF'}.png`)" alt="" style="width:100px;height:80px"></div><label class="sd-toggle"><input type="checkbox" role="switch" :checked="style.value(id) === true" @change="style.setValue(id,!style.value(id))"><span class="sd-toggle-track" aria-hidden="true"></span><span>{{ qtrc('notation',text) }}</span></label></div></div></fieldset>
  </div>
</template>
