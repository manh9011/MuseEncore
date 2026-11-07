<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { removeAllScores, removeScore, useScores, type ScoreEntry } from '../db'
import { qtrc, webtr, useLanguage } from '../i18n'
import { chooseFile, dismissError, forgetScore, openStored, showNewScoreDialog, useSession } from '../session'
import { updateSettings, useSettings } from '../settings'
import { ICON_CODES } from '../actions/uiactiondata'
import { baseName } from '../files'

useLanguage()
const session = useSession()
const settings = useSettings()
const scores = useScores()
const thumbnails = ref<Record<string, string>>({})
watch(scores, (entries, _previous, onCleanup) => {
  const urls: Record<string, string> = {}
  for (const entry of entries ?? []) if (entry.thumbnail) urls[entry.id] = URL.createObjectURL(entry.thumbnail)
  thumbnails.value = urls
  onCleanup(() => Object.values(urls).forEach(url => URL.revokeObjectURL(url)))
}, { immediate: true })
const searchQuery = ref('')
const viewMode = computed<'grid' | 'list'>({ get: () => settings.home.layout, set: v => updateSettings('home', { layout: v }) })
const confirmDeleteEntry = ref<ScoreEntry | null>(null)
const confirmClearAll = ref(false)
const filteredScores = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return (scores.value ?? []).filter(s => !q || [s.name, s.title, s.composer].some(x => x.toLowerCase().includes(q)))
})
function displayName(entry: ScoreEntry) { return baseName(entry.name) }
function timeAgo(t: number): string {
  const relativeTime = new Intl.RelativeTimeFormat(document.documentElement.lang || undefined, { numeric: 'auto' })
  let v = (t - Date.now()) / 1000
  for (const [unit, n] of [['second',60],['minute',60],['hour',24],['day',7],['week',4.35],['month',12]] as const) {
    if (Math.abs(v) < n) return unit === 'second' ? relativeTime.format(0, 'second') : relativeTime.format(Math.round(v), unit)
    v /= n
  }
  return relativeTime.format(Math.round(v), 'year')
}
function fileSize(bytes: number) { return !bytes ? '–' : bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB` }
async function open(entry: ScoreEntry) {
  if (!await openStored(entry.id)) { forgetScore(entry.id); await removeScore(entry.id) }
}
async function remove(entry: ScoreEntry) {
  if (entry.source === 'new') confirmDeleteEntry.value = entry
  else { forgetScore(entry.id); await removeScore(entry.id) }
}
function handleConfirmSingleDelete(confirmed: boolean | 'secondary') {
  const entry = confirmDeleteEntry.value
  confirmDeleteEntry.value = null
  if (confirmed === true && entry) void removeScore(entry.id)
}
function handleConfirmClearAll(confirmed: boolean | 'secondary') {
  confirmClearAll.value = false
  if (confirmed === true) void removeAllScores()
}
const ICON = { grid: '', list: '', plus: '', close: '', search: '', score: '' }
</script>
<template>
  <section class="home" aria-labelledby="home-title">
    <div class="home-header">
      <h1 id="home-title">{{ qtrc('project', 'Scores') }}</h1>
      <div class="home-tools">
        <label class="search"><span class="icon-glyph" aria-hidden="true">{{ ICON.search }}</span><input v-model="searchQuery" type="search" :placeholder="qtrc('ui', 'Search')" :aria-label="qtrc('project', 'Search recent scores')" /></label>
        <div class="segmented" role="radiogroup" aria-label="View">
          <button class="icon" role="radio" :aria-checked="viewMode === 'grid'" :title="qtrc('project', 'Grid view')" :aria-label="qtrc('project', 'Grid view')" @click="viewMode='grid'">{{ ICON.grid }}</button>
          <button class="icon" role="radio" :aria-checked="viewMode === 'list'" :title="qtrc('project', 'List view')" :aria-label="qtrc('project', 'List view')" @click="viewMode='list'">{{ ICON.list }}</button>
        </div>
      </div>
    </div>
    <div v-if="session.error" class="home-error" role="alert"><span>{{ session.error }}</span><button class="icon" :aria-label="qtrc('global', 'Close')" :title="qtrc('global', 'Close')" @click="dismissError">{{ ICON.close }}</button></div>
    <div class="home-body">
      <template v-if="scores === undefined"></template>
      <p v-else-if="searchQuery.trim() && !filteredScores.length" class="no-results muted">{{ qtrc('global', 'No results found') }}</p>
      <template v-else-if="viewMode === 'grid'">
      <ul class="score-grid" :aria-label="qtrc('project', 'Recent scores grid')">
        <li v-if="!searchQuery.trim()"><button class="score-card new" @click="showNewScoreDialog(true)"><span class="thumb"><span class="new-plus" aria-hidden="true">{{ ICON.plus }}</span></span><span class="card-name">{{ qtrc('project', 'New score') }}</span></button></li>
        <li v-for="entry in filteredScores" :key="entry.id">
          <button class="score-card" :title="[entry.title, entry.composer].filter(Boolean).join(' – ') || undefined" @click="open(entry)"><span class="thumb" :style="{ aspectRatio: String(entry.aspect || 210/297) }"><img v-if="thumbnails[entry.id]" :src="thumbnails[entry.id]" alt="" draggable="false" /><span v-else class="thumb-placeholder" aria-hidden="true">{{ ICON.score }}</span></span><span class="card-name">{{ displayName(entry) }}</span><span class="card-time muted">{{ timeAgo(entry.opened) }}</span></button>
          <button class="icon remove" :title="webtr('Remove from list')" :aria-label="`${webtr('Remove')} ${displayName(entry)} ${webtr('from the list')}`" @click="remove(entry)">{{ ICON.close }}</button>
        </li>
      </ul>
      </template>
      <table v-else class="score-list" :aria-label="qtrc('project', 'Recent scores list')"><thead><tr><th>{{ qtrc('notation', 'Name') }}</th><th>{{ qtrc('project', 'Modified') }}</th><th>{{ qtrc('global', 'Size', 'file size') }}</th><th><span class="visually-hidden">Actions</span></th></tr></thead><tbody>
        <tr v-if="!searchQuery.trim()"><td colspan="4"><button class="list-item" @click="showNewScoreDialog(true)"><span class="list-thumb new"><span aria-hidden="true">{{ ICON.plus }}</span></span>{{ qtrc('project', 'New score') }}</button></td></tr>
        <tr v-for="entry in filteredScores" :key="entry.id"><td><button class="list-item" @click="open(entry)"><span class="list-thumb"><img v-if="thumbnails[entry.id]" :src="thumbnails[entry.id]" alt="" /><span v-else class="thumb-placeholder">{{ ICON.score }}</span></span><span class="list-name">{{ displayName(entry) }}<span v-if="entry.title && entry.title !== displayName(entry)" class="muted"> · {{ entry.title }}</span></span></button></td><td class="muted">{{ timeAgo(entry.opened) }}</td><td class="muted">{{ entry.source === 'new' && !entry.size ? 'new score' : fileSize(entry.size) }}</td><td><button class="icon" :title="webtr('Remove from list')" :aria-label="`${webtr('Remove')} ${displayName(entry)} ${webtr('from the list')}`" @click="remove(entry)">{{ ICON.close }}</button></td></tr>
      </tbody></table>
      <p v-if="scores !== undefined && !scores.length" class="home-hint muted">Scores you open or create are kept in this browser and appear here. You can also drop a MuseScore, MusicXML, MIDI, Capella or Guitar Pro file anywhere in this window.</p>
    </div>
    <div class="home-footer"><button v-if="scores?.length" class="secondary" @click="confirmClearAll=true">Clear list…</button><span class="spacer"></span><button class="secondary" @click="chooseFile()">{{ qtrc('project', 'Open other…') }}</button><button class="primary" @click="showNewScoreDialog(true)">{{ qtrc('project', 'New') }}</button></div>
    <ConfirmDialog v-if="confirmDeleteEntry" :title="`Remove “${displayName(confirmDeleteEntry)}”?`" message="This score was created here and is not saved anywhere else. It cannot be restored." :confirm-label="qtrc('workspace', 'Remove')" @close="handleConfirmSingleDelete" />
    <ConfirmDialog v-if="confirmClearAll" title="Clear the list of scores?" message="All scores are removed from this browser. Scores created here cannot be restored, they are not saved anywhere else." :confirm-label="qtrc('workspace', 'Remove')" @close="handleConfirmClearAll" />
  </section>
</template>
