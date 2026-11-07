<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { shallowRef } from 'vue'
import { prepareBreaksDialog, type Score } from '../../src/index'
import { currentScore, scoreChanged } from '../scoreview'
const pending = shallowRef<{ score: Score; allSelected: boolean } | null>(null)
export function openBreaksDialog(): void {
  const score = currentScore()
  if (score) {
    pending.value = { score, allSelected: prepareBreaksDialog(score).allSelected }
    scoreChanged(false)
  }
}
</script>
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { AddRemoveSystemLockType, addRemoveSystemLocks } from '../../src/index'
import { qtrc, useLanguage } from '../i18n'
useLanguage()
const choice = ref<'interval' | 'lock' | 'remove'>('interval')
const interval = ref(4)
const dialog = ref<HTMLDialogElement|null>(null)
const pieces = computed(() => qtrc('notation/add-remove-system-breaks', 'Lock layout with %1 measure(s) per system').split('%1').map(s=>s.trim()))
watch(pending, async value => { if (value) { choice.value = 'interval'; interval.value = 4; await nextTick(); dialog.value?.showModal() } })
function accept(): void {
  if (!pending.value || !Number.isInteger(interval.value) || interval.value < 1 || interval.value > 99) return
  const type = choice.value === 'remove' ? AddRemoveSystemLockType.None : choice.value === 'lock' ? AddRemoveSystemLockType.AfterEachSystem : AddRemoveSystemLockType.MeasuresInterval
  addRemoveSystemLocks(pending.value.score, type, choice.value === 'interval' ? interval.value : 0, pending.value.allSelected)
  scoreChanged(false)
  dialog.value?.close()
}
function setIntervalValue(event: Event) { const value=(event.target as HTMLInputElement).value, n=Math.round(Number(value)); if(value!=='' && Number.isFinite(n)) interval.value=Math.max(1,Math.min(99,n)) }
</script>
<template>
  <dialog v-if="pending" ref="dialog" class="breaks-dialog" aria-labelledby="breaks-dialog-title" @close.self="pending=null">
    <h2 id="breaks-dialog-title">{{ qtrc('BreaksDialog','Measures per system') }}</h2>
    <form @submit.prevent="accept"><div class="radio-rows"><div class="breaks-interval"><label class="check"><input v-model="choice" type="radio" name="breaks" value="interval" :aria-label="qtrc('BreaksDialog','Lock layout with X measures per system')" />{{ pieces[0] }}</label><input type="number" min="1" max="99" step="1" :value="interval" :aria-label="qtrc('BreaksDialog','Number of measures')" @focus="choice='interval'" @input="setIntervalValue" /><span>{{ pieces[1] }}</span></div><label class="check"><input v-model="choice" type="radio" name="breaks" value="lock" />{{qtrc('BreaksDialog','Add system locks to each system')}}</label><label class="check"><input v-model="choice" type="radio" name="breaks" value="remove" />{{qtrc('BreaksDialog','Remove current system locks')}}</label></div><div class="dialog-buttons"><span class="spacer" /><button type="button" class="secondary" @click="dialog?.close()">{{qtrc('global','Cancel')}}</button><button type="submit" class="primary">{{qtrc('global','OK')}}</button></div></form>
  </dialog>
</template>
