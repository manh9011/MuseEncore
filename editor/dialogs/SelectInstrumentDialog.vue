<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { qtrc } from '../i18n'
import { ICON_CODES } from '../actions/uiactiondata'
import ChooseInstrumentsPage from '../newscore/ChooseInstrumentsPage.vue'
import { orderList, type OrderChoice, type ScoreInstrument } from '../newscore/instrumentmodels'
import { finishAskInstrument, selectInstrumentOpen } from './selectinstrumentstate'
const dialog=ref<HTMLDialogElement|null>(null), selected=ref<string|null>(null), result=ref<string|null>(null)
const instruments=ref<ScoreInstrument[]>([]), order=ref<OrderChoice>({id:orderList()[0].id,customized:false})
watch(selectInstrumentOpen,async open=>{if(open){selected.value=null;result.value=null;instruments.value=[];order.value={id:orderList()[0].id,customized:false};await nextTick();dialog.value?.showModal()}})
function accept(id:string|null){if(id){result.value=id;dialog.value?.close()}}
</script>
<template>
 <dialog v-if="selectInstrumentOpen" ref="dialog" class="new-score instruments-dialog select-instrument" aria-labelledby="select-instrument-title" @close.self="finishAskInstrument(result)">
  <header class="dialog-header"><h2 id="select-instrument-title">{{qtrc('instruments','Select instrument')}}</h2><button class="icon" :aria-label="qtrc('global','Close')" :title="qtrc('global','Close')" @click="dialog?.close()">{{String.fromCodePoint(ICON_CODES.CLOSE_X_ROUNDED)}}</button></header>
  <div class="dialog-page"><ChooseInstrumentsPage v-model:instruments="instruments" v-model:order="order" single @select="selected=$event" @accept="accept" /></div>
  <footer class="dialog-buttons"><button class="secondary" @click="dialog?.close()">{{qtrc('global','Cancel')}}</button><button class="primary" :disabled="!selected" @click="accept(selected)">{{qtrc('global','OK')}}</button></footer>
 </dialog>
</template>
