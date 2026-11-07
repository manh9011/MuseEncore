<!--
  SPDX-License-Identifier: GPL-3.0-only
  Modal dialog wrapping `ChooseInstrumentsPage` migrated from `InstrumentsDialog.tsx`.
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ICON_CODES } from '../../actions/uiactiondata'
import { qtrc, useLanguage } from '../../i18n'
import ChooseInstrumentsPage from '../../newscore/ChooseInstrumentsPage.vue'
import { orderList, type OrderChoice, type ScoreInstrument } from '../../newscore/instrumentmodels'

const emit = defineEmits<{
  (e: 'close', instrumentIds: string[] | null): void
}>()

useLanguage()
const dialog = ref<HTMLDialogElement | null>(null)
const result = ref<string[] | null>(null)
onMounted(() => dialog.value?.showModal())
const instruments = ref<ScoreInstrument[]>([])
const order = ref<OrderChoice>({ id: orderList()[0]?.id ?? 'custom', customized: false })

function accept() {
  result.value = instruments.value.map(i => i.id)
  dialog.value?.close()
}

function cancel() {
  dialog.value?.close()
}
</script>

<template>
  <dialog ref="dialog" class="new-score instruments-dialog" aria-labelledby="instruments-dialog-title" @close="emit('close', result)">
    <header class="dialog-header"><h2 id="instruments-dialog-title">{{ qtrc('instruments', 'Add or remove instruments') }}</h2><button class="icon" :aria-label="qtrc('global', 'Close')" :title="qtrc('global', 'Close')" @click="cancel">{{ String.fromCodePoint(ICON_CODES.CLOSE_X_ROUNDED) }}</button></header>
    <div class="dialog-page">
      <ChooseInstrumentsPage
        :instruments="instruments"
        :order="order"
        @update:instruments="(v) => (instruments = v)"
        @update:order="(v) => (order = v)"
      />
    </div>
    <footer class="dialog-buttons"><button class="secondary" @click="cancel">{{ qtrc('global', 'Cancel') }}</button><button class="primary" :disabled="!instruments.length" @click="accept">{{ qtrc('global', 'OK') }}</button></footer>
  </dialog>
</template>
