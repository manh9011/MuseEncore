<!--
  SPDX-License-Identifier: GPL-3.0-only
  3-column instrument family / available instruments / score order selector
  migrated from `editor/newscore/ChooseInstrumentsPage.tsx` to Vue 3 + Nuxt UI.
-->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { qtrc, useLanguage } from '../i18n'
import {
  ALL_INSTRUMENTS_GENRE_ID, COMMON_GENRE_ID, genreList, groupList, instrumentList, orderList, insertInstrument, sortInstruments, templateById, templateTitle, templateDescription, traitName, trackName, verifyOrder,
  type OrderChoice,
  type ScoreInstrument,
} from './instrumentmodels'

const props = defineProps<{
  instruments: ScoreInstrument[]
  order: OrderChoice
  single?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:instruments', list: ScoreInstrument[]): void
  (e: 'update:order', order: OrderChoice): void
  (e: 'select', id: string | null): void
  (e: 'accept', id: string): void
}>()

useLanguage()
const genres = computed(() => genreList())
const genre = ref(genres.value.some(g => g.id === COMMON_GENRE_ID) ? COMMON_GENRE_ID : genres.value[0]?.id ?? ALL_INSTRUMENTS_GENRE_ID)
const families = computed(() => groupList(genre.value))
const selectedFamily = ref<string>(families.value[0]?.id ?? 'strings')
const search = ref('')
const selectedTemplateId = ref<string | null>(null)
const selectedScoreIdx = ref<number>(-1)
const traits = ref<Record<string, number>>({})
const currentFamily = computed(() => families.value.some(f => f.id === selectedFamily.value) ? selectedFamily.value : families.value[0]?.id ?? null)
const selectedInstrument = computed(() => availableInstruments.value.find(i => i.key === selectedTemplateId.value))
const selectedTemplate = computed(() => { const item = selectedInstrument.value; return item ? templateById(item.templates[Math.min(traits.value[item.key] ?? 0, item.templates.length - 1)].id) : null })
const availableInstruments = computed(() => {
  return instrumentList(genre.value, search.value.trim() ? null : currentFamily.value, search.value.trim())
})
watch(selectedTemplate, value => { if (props.single) emit('select', value?.id ?? null) })

function addSelected() {
  if (!selectedTemplateId.value) return
  const found = availableInstruments.value.find((i) => i.key === selectedTemplateId.value)
  if (!found) return
  if (props.single) { emit('accept', found.templates[Math.min(traits.value[found.key] ?? 0, found.templates.length - 1)].id); return }
  const key = Math.max(0, ...props.instruments.map(i => i.key)) + 1
  const next = insertInstrument(props.order, props.instruments, { key, id: found.templates[Math.min(traits.value[found.key] ?? 0, found.templates.length - 1)].id, soloist: false })
  emit('update:instruments', next)
  emit('update:order', verifyOrder(props.order, next))
  selectedScoreIdx.value = next.findIndex(i => i.key === key)
}

function removeSelected() {
  if (selectedScoreIdx.value < 0) return
  const next = props.instruments.slice()
  next.splice(selectedScoreIdx.value, 1)
  emit('update:instruments', next)
  emit('update:order', verifyOrder(props.order, next))
  selectedScoreIdx.value = next.length ? Math.min(selectedScoreIdx.value, next.length - 1) : -1
}
function move(dir: -1 | 1) {
  const next = props.instruments.slice(), from = selectedScoreIdx.value, to = from + dir
  if (from < 0 || to < 0 || to >= next.length) return
  ;[next[from], next[to]] = [next[to], next[from]]
  emit('update:instruments', next)
  emit('update:order', verifyOrder(props.order, next))
  selectedScoreIdx.value = to
}
function toggleSoloist() {
  const next = props.instruments.map((item, index) => index === selectedScoreIdx.value ? { ...item, soloist: !item.soloist } : item)
  emit('update:instruments', next)
  emit('update:order', verifyOrder(props.order, next))
}
</script>

<template>
  <div class="choose-instruments" :class="{ single: props.single }">
    <section class="column families" aria-labelledby="families-title">
      <h3 id="families-title">{{ qtrc('instruments', 'Family') }}</h3>
      <select :aria-label="qtrc('instruments', 'Family')" :value="search.trim() ? ALL_INSTRUMENTS_GENRE_ID : genre" :disabled="!!search.trim()" @change="genre = ($event.target as HTMLSelectElement).value"><option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option></select>
      <ul class="list" role="listbox" :aria-label="qtrc('instruments', 'Family')"><li v-for="f in families" :key="f.id" role="option" :aria-selected="!search.trim() && f.id === currentFamily" tabindex="0" @click="selectedFamily=f.id; search=''" @keydown.enter.prevent="selectedFamily=f.id; search=''" @keydown.space.prevent="selectedFamily=f.id; search=''">{{ f.name }}</li></ul>
    </section>
    <section class="column instruments" aria-labelledby="instruments-title">
      <h3 id="instruments-title">{{ qtrc('instruments', 'Instruments') }}</h3><label class="search"><span class="icon-glyph" aria-hidden="true"></span><input v-model="search" type="search" :placeholder="qtrc('ui', 'Search')" :aria-label="qtrc('ui', 'Search')" /></label>
      <ul class="list" role="listbox" :aria-label="qtrc('instruments', 'Instruments')"><li v-for="i in availableInstruments" :key="i.key" role="option" :aria-selected="i.key === selectedTemplateId" tabindex="0" @click="selectedTemplateId=i.key" @dblclick="selectedTemplateId=i.key; addSelected()" @keydown.enter.prevent="selectedTemplateId=i.key; addSelected()" @keydown.space.prevent="selectedTemplateId=i.key"><span class="item-name">{{ i.name }}</span><select v-if="i.templates.length > 1" :aria-label="i.name" :value="traits[i.key] ?? 0" @click.stop @dblclick.stop @keydown.stop @change="traits[i.key]=Number(($event.target as HTMLSelectElement).value); selectedTemplateId=i.key"><option v-for="(t,k) in i.templates" :key="t.id" :value="k">{{ traitName(t) || trackName(t) }}</option></select></li><li v-if="!availableInstruments.length" class="muted empty-item">{{ qtrc('global', 'No results found') }}</li></ul>
      <p class="description muted" aria-live="polite">{{ selectedTemplate ? templateDescription(selectedTemplate) : '' }}</p>
    </section>
    <div v-if="!props.single" class="add-column"><button class="icon" :title="qtrc('instruments', 'Add selected instruments to score')" :aria-label="qtrc('instruments', 'Add selected instruments to score')" :disabled="!selectedInstrument" @click="addSelected"></button></div>
    <section v-if="!props.single" class="column on-score" aria-labelledby="on-score-title"><h3 id="on-score-title">{{ qtrc('instruments', 'Your score') }}</h3><select :aria-label="qtrc('instruments', 'Order:')" :value="props.order.id" @change="e => { const order = { id: (e.target as HTMLSelectElement).value, customized: false }; emit('update:order', order); emit('update:instruments', sortInstruments(order, props.instruments)) }"><option v-for="o in orderList()" :key="o.id" :value="o.id">{{ o.name }}</option></select>
      <ul class="list" role="listbox" :aria-label="qtrc('instruments', 'Your score')"><li v-for="(item,idx) in props.instruments" :key="item.key" role="option" :aria-selected="selectedScoreIdx === idx" tabindex="0" @click="selectedScoreIdx=idx" @keydown.space.prevent="selectedScoreIdx=idx" @keydown.delete.prevent="selectedScoreIdx=idx; removeSelected()" @keydown.backspace.prevent="selectedScoreIdx=idx; removeSelected()"><span class="item-name">{{ templateById(item.id) ? templateTitle(templateById(item.id)!) : item.id }}</span><span v-if="item.soloist" class="badge">{{ qtrc('instruments', 'Soloist:').replace(/[:：]\s*$/, '') }}</span></li><li v-if="!props.instruments.length" class="muted empty-item">{{ qtrc('instruments', 'Choose your instruments by adding them to this list') }}</li></ul>
      <div class="list-actions"><button class="icon" :aria-label="qtrc('instruments','Move selected instruments up')" :title="qtrc('instruments','Move selected instruments up')" :disabled="selectedScoreIdx <= 0" @click="move(-1)"></button><button class="icon" :aria-label="qtrc('instruments','Move selected instruments down')" :title="qtrc('instruments','Move selected instruments down')" :disabled="selectedScoreIdx < 0 || selectedScoreIdx >= props.instruments.length - 1" @click="move(1)"></button><button class="icon" :aria-label="qtrc('instruments', props.instruments[selectedScoreIdx]?.soloist ? 'Undo soloist' : 'Make soloist')" :title="qtrc('instruments', props.instruments[selectedScoreIdx]?.soloist ? 'Undo soloist' : 'Make soloist')" :aria-pressed="!!props.instruments[selectedScoreIdx]?.soloist" :disabled="selectedScoreIdx < 0" @click="toggleSoloist"></button><button class="icon" :aria-label="qtrc('instruments','Remove selected instruments from score')" :title="qtrc('instruments','Remove selected instruments from score')" :disabled="selectedScoreIdx < 0" @click="removeSelected"></button></div>
    </section>
  </div>
</template>
