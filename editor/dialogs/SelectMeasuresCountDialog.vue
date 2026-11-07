<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { shallowRef } from 'vue'
import { type AddBoxesTarget, type Score } from '../../src/index'
import { currentScore } from '../scoreview'

const pending = shallowRef<{ score: Score; target: AddBoxesTarget } | null>(null)
export function openSelectMeasuresCountDialog(target: AddBoxesTarget): void {
  const score = currentScore()
  if (score) pending.value = { score, target }
}
</script>
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { addMeasures } from '../../src/index'
import { qtrc, useLanguage } from '../i18n'
import { scoreChanged } from '../scoreview'

useLanguage()
const count = ref(1)
const dialog = ref<HTMLDialogElement | null>(null)
watch(pending, async value => { if (value) { count.value = 1; await nextTick(); dialog.value?.showModal() } })
function accept(): void {
  if (pending.value && Number.isInteger(count.value) && count.value >= 1 && count.value <= 999) {
    if (addMeasures(pending.value.score, count.value, pending.value.target)) scoreChanged(true)
    dialog.value?.close()
  }
}
function setCount(event: Event) { const value=(event.target as HTMLInputElement).value, n=Math.round(Number(value)); if (value !== '' && Number.isFinite(n)) count.value=Math.max(1,Math.min(999,n)) }
</script>
<template>
  <dialog v-if="pending" ref="dialog" class="measures-count-dialog" :aria-label="qtrc('notation','Number of measures to insert:')" @close.self="pending=null">
    <form @submit.prevent="accept"><label class="measures-count"><span>{{ qtrc('notation','Number of measures to insert:') }}</span><input type="number" min="1" max="999" step="1" :value="count" autofocus @input="setCount" /></label><div class="dialog-buttons"><span class="spacer" /><button type="button" class="secondary" @click="dialog?.close()">{{ qtrc('global','Cancel') }}</button><button type="submit" class="primary" :disabled="!Number.isInteger(count) || count < 1 || count > 999">{{ qtrc('global','OK') }}</button></div></form>
  </dialog>
</template>
