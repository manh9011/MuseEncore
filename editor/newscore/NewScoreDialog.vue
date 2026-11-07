<!--
  SPDX-License-Identifier: GPL-3.0-only
  2-step New Score Wizard Modal migrated from `editor/newscore/NewScoreDialog.tsx` to Vue 3 + Nuxt UI.
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { qtrc, useLanguage } from '../i18n'
import { createNewScore, showNewScoreDialog } from '../session'
import { useSettings, updateSettings } from '../settings'
import { defaultNewScoreOptions, type NewScoreOptions } from '../../src/index'
import { loadTemplate } from '../templates'
import ChooseInstrumentsPage from './ChooseInstrumentsPage.vue'
import CreateFromTemplatePage from './CreateFromTemplatePage.vue'
import {
  orderList,
  type OrderChoice,
  type ScoreInfo,
  type ScoreInstrument,
} from './instrumentmodels'
import ScoreInfoPage from './ScoreInfoPage.vue'
import type { TemplateInfo } from '../templates'

useLanguage()
const settings = useSettings()

const dialog = ref<HTMLDialogElement | null>(null)
onMounted(() => dialog.value?.showModal())
const mode = ref<'instruments' | 'template'>(settings.newScore?.mode ?? 'instruments')
const step = ref<'choose' | 'info'>('choose')
const instruments = ref<ScoreInstrument[]>([])
const order = ref<OrderChoice>({ id: orderList()[0]?.id ?? 'custom', customized: false })
const template = ref<TemplateInfo | null>(null)
const { instruments: _instruments, order: _order, orderCustomized: _customized, templateMscx: _mscx, templateStyle: _style, ...defaults } = defaultNewScoreOptions()
const info = ref<ScoreInfo>(defaults)
const creating = ref(false)

function dialogKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && event.target instanceof HTMLInputElement && event.target.type === 'text') {
    event.preventDefault()
    void handleDone()
  }
}
function modeTabKeydown(event: KeyboardEvent) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
  event.preventDefault()
  const next = event.key === 'ArrowRight' ? (mode.value === 'instruments' ? 'template' : 'instruments') : (mode.value === 'template' ? 'instruments' : 'template')
  setMode(next)
  document.getElementById(`new-score-tab-${next}`)?.focus()
}
function setMode(next: 'instruments' | 'template') {
  mode.value = next
  updateSettings('newScore', { mode: next })
}

async function handleDone() {
  if (creating.value || (mode.value === 'instruments' ? !instruments.value.length : !template.value)) return
  creating.value = true
  try {
    const scoreInfo = { ...info.value, timesig: { ...info.value.timesig }, pickup: info.value.pickup ? { ...info.value.pickup } : info.value.pickup, tempo: info.value.tempo ? { ...info.value.tempo } : info.value.tempo }
    const options: NewScoreOptions = mode.value === 'instruments'
      ? { ...scoreInfo, instruments: instruments.value.map(i => ({ id: i.id, soloist: i.soloist })), order: order.value.id, orderCustomized: order.value.customized }
      : await loadTemplate(template.value!.path).then(t => ({ ...scoreInfo, instruments: [], templateMscx: t.mscx, templateStyle: t.style ?? undefined }))
    await createNewScore(options)
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <dialog ref="dialog" class="new-score" aria-labelledby="new-score-title" @close="showNewScoreDialog(false)" @keydown="dialogKeydown">
    <header class="dialog-header"><h2 id="new-score-title">{{ qtrc('project', 'New score') }}</h2><button class="icon" :aria-label="qtrc('global', 'Close')" :title="qtrc('global', 'Close')" @click="dialog?.close()"></button></header>
    <div v-if="step === 'choose'" class="dialog-tabs" role="tablist" :aria-label="qtrc('project', 'New score')" @keydown="modeTabKeydown">
      <button id="new-score-tab-instruments" role="tab" aria-controls="new-score-page-choose" :aria-selected="mode === 'instruments'" :tabindex="mode === 'instruments' ? 0 : -1" @click="setMode('instruments')">{{ qtrc('project/newscore', 'Choose instruments') }}</button>
      <button id="new-score-tab-template" role="tab" aria-controls="new-score-page-choose" :aria-selected="mode === 'template'" :tabindex="mode === 'template' ? 0 : -1" @click="setMode('template')">{{ qtrc('project/newscore', 'Create from template') }}</button>
    </div>
        <div id="new-score-page-choose" class="dialog-page" :role="step === 'choose' ? 'tabpanel' : undefined" :aria-labelledby="step === 'choose' ? `new-score-tab-${mode}` : undefined">
          <ChooseInstrumentsPage
            v-if="step === 'choose' && mode === 'instruments'"
            :instruments="instruments"
            :order="order"
            @update:instruments="(v) => (instruments = v)"
            @update:order="(v) => (order = v)"
          />
          <CreateFromTemplatePage
            v-else-if="step === 'choose' && mode === 'template'"
            :template="template"
            @update:template="(t) => (template = t)"
          />
          <ScoreInfoPage
            v-else
            :info="info"
            @update:info="(i) => (info = i)"
          />
        </div>
    <footer class="dialog-buttons"><button class="secondary" @click="dialog?.close()">{{ qtrc('global', 'Cancel') }}</button><button v-if="step === 'info'" class="secondary" @click="step = 'choose'">{{ qtrc('global', 'Back') }}</button><button v-else class="secondary" :disabled="mode === 'instruments' ? !instruments.length : !template" @click="step = 'info'">{{ qtrc('global', 'Next') }}</button><button class="primary" :disabled="creating || (mode === 'instruments' ? !instruments.length : !template)" @click="handleDone">{{ qtrc('global', 'Done') }}</button></footer>
  </dialog>
</template>
