<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { shallowRef } from 'vue'
import { type Score } from '../../src/index'
import { currentScore } from '../scoreview'
const pending = shallowRef<Score | null>(null)
export function openTupletDialog(): void { pending.value = currentScore() }
</script>
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { TupletBracketType, TupletNumberType, addCustomTuplet, customTupletDefaults } from '../../src/index'
import { qtrc, useLanguage } from '../i18n'
import { scoreChanged } from '../scoreview'
useLanguage()
const dialog = ref<HTMLDialogElement|null>(null)
const actual = ref(3)
const normal = ref(2)
const numberType = ref(TupletNumberType.SHOW_NUMBER)
const bracketType = ref(TupletBracketType.AUTO_BRACKET)
watch(pending, async score => {
  if (!score) return
  actual.value = 3
  normal.value = 2
  const defaults = customTupletDefaults(score)
  numberType.value = defaults.numberType
  bracketType.value = defaults.bracketType
  await nextTick(); dialog.value?.showModal()
})
function accept() {
  if (!pending.value || !Number.isInteger(actual.value) || !Number.isInteger(normal.value) || actual.value < 1 || normal.value < 1 || actual.value > 9999 || normal.value > 9999) return
  if (addCustomTuplet(pending.value, actual.value, normal.value, numberType.value, bracketType.value)) scoreChanged()
  dialog.value?.close()
}
function spin(event:Event,which:'actual'|'normal'){const v=(event.target as HTMLInputElement).value,n=Math.round(Number(v));if(v!=='' && Number.isFinite(n)){if(which==='actual')actual.value=Math.max(1,Math.min(9999,n));else normal.value=Math.max(1,Math.min(9999,n))}}
const tr=(s:string,disambiguation='')=>qtrc('TupletDialog',s,disambiguation)
</script>
<template>
 <dialog v-if="pending" ref="dialog" class="tuplet-dialog" aria-labelledby="tuplet-dialog-title" @close.self="pending=null"><h2 id="tuplet-dialog-title">{{tr('Create tuplet')}}</h2><form @submit.prevent="accept"><fieldset class="groupbox"><legend>{{tr('Type')}}</legend><div class="ratio"><span>{{tr('Ratio:')}}</span><input type="number" min="1" max="9999" :value="actual" :aria-label="tr('Ratio:')" @input="spin($event,'actual')" /><span>/</span><input type="number" min="1" max="9999" :value="normal" aria-label="/" @input="spin($event,'normal')" /></div></fieldset><fieldset class="groupbox"><legend>{{tr('Format')}}</legend><div class="format"><fieldset class="groupbox" :aria-label="`${tr('Format')} ${tr('Number')}`"><legend>{{tr('Number')}}</legend><label v-for="entry in [[TupletNumberType.SHOW_NUMBER,tr('Number')],[TupletNumberType.SHOW_RELATION,tr('Ratio')],[TupletNumberType.NO_TEXT,tr('None','no tuplet number style')]]" :key="entry[0]" class="check"><input v-model="numberType" type="radio" name="number" :value="entry[0]" />{{entry[1]}}</label></fieldset><fieldset class="groupbox" :aria-label="`${tr('Format')} ${tr('Bracket')}`"><legend>{{tr('Bracket')}}</legend><label v-for="entry in [[TupletBracketType.AUTO_BRACKET,tr('Auto')],[TupletBracketType.SHOW_BRACKET,tr('Bracket')],[TupletBracketType.SHOW_NO_BRACKET,tr('None','no tuplet bracket style')]]" :key="entry[0]" class="check"><input v-model="bracketType" type="radio" name="bracket" :value="entry[0]" />{{entry[1]}}</label></fieldset></div></fieldset><div class="dialog-buttons"><span class="spacer" /><button type="button" class="secondary" @click="dialog?.close()">{{qtrc('global','Cancel')}}</button><button type="submit" class="primary">{{qtrc('global','OK')}}</button></div></form></dialog>
</template>
