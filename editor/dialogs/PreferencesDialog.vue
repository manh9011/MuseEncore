<!--
  SPDX-License-Identifier: GPL-3.0-only
  PreferencesDialog migrated from `editor/dialogs/PreferencesDialog.tsx` to Vue 3 + Nuxt UI `<UModal>`.
-->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ICON_CODES } from '../actions/uiactiondata'
import { pickFile } from '../files'
import { languageList, qtrc, setLanguage, useLanguage, currentLanguage, webtr } from '../i18n'
import { useSettings, updateSettings } from '../settings'
import { actionTitle, formatShortcut, shortcuts } from '../actions/actions'
import { closeDialog } from '../session'

const props = defineProps<{
  open?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

useLanguage()
const dialog = ref<HTMLDialogElement | null>(null)
onMounted(() => dialog.value?.showModal())
const page = ref('general')
const languages = languageList()
const preferences = useSettings()
const language = computed(() => preferences.ui.language)
const project = computed(() => preferences.project)
const web = computed(() => preferences.web)
const playback = computed(() => preferences.playback)
const imp = computed(() => preferences.import)
const useStyleFile = ref(imp.value.styleFile ? 'file' : 'builtin')
const shortestNotes: readonly [string, number][] = [['Quarter',480],['Eighth',240],['16th',120],['32nd',60],['64th',30],['128th',15],['256th',7],['512th',3],['1024th',1]]
async function changeLanguage(value: string) { await setLanguage(value) }
async function chooseStyle() {
  const file = await pickFile({ description: qtrc('preferences','MuseScore style file'), accept: { 'application/octet-stream': ['.mss'] } })
  if (file) updateSettings('import', { styleFile: { name: file.name, content: await file.text() } })
}

function pageTabKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    const button = event.target as HTMLButtonElement
    button.click()
    return
  }
  const direction = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
  if (!direction) return
  const tabs = [...(event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="tab"]')]
  const current = tabs.indexOf(event.target as HTMLElement)
  if (current < 0 || !tabs.length) return
  event.preventDefault()
  const next = tabs[(current + direction + tabs.length) % tabs.length]
  next?.focus()
  next?.click()
}
function handleClose() {
  closeDialog()
  emit('close')
}
</script>

<template>
  <dialog ref="dialog" class="preferences" aria-labelledby="preferences-title" @close="handleClose">
    <header class="dialog-header"><h2 id="preferences-title">{{ qtrc('preferences', 'Preferences') }}</h2><button class="icon" :aria-label="qtrc('global', 'Close')" :title="qtrc('global', 'Close')" @click="dialog?.close()"></button></header>
      <div class="preferences-body">
        <ul class="preferences-pages" role="tablist" aria-orientation="vertical" :aria-label="qtrc('preferences', 'Preferences')" @keydown="pageTabKeydown"><li v-for="item in [{id:'general', title:'General', icon:ICON_CODES.SETTINGS_COG}, {id:'cloud', title:'Save & publish', icon:ICON_CODES.CLOUD_FILE}, {id:'note-input', title:'Note input', icon:ICON_CODES.EDIT}, {id:'import', title:'Import', icon:ICON_CODES.IMPORT}, {id:'web', title:'Web version', icon:ICON_CODES.GLOBE}]" :key="item.id" :id="`preferences-tab-${item.id}`" role="tab" :aria-selected="page===item.id" aria-controls="preferences-page" :tabindex="page===item.id ? 0 : -1" @click="page=item.id"><span class="icon-glyph" aria-hidden="true">{{ String.fromCodePoint(item.icon) }}</span>{{ item.id==='web' ? webtr(item.title) : qtrc('preferences', item.title) }}</li></ul>
        <div id="preferences-page" class="preferences-page" role="tabpanel" :aria-labelledby="`preferences-tab-${page}`">
          <section v-if="page==='general'" class="preferences-section" aria-labelledby="pref-language"><h3 id="pref-language">{{ qtrc('preferences','Language') }}</h3><label class="field"><span class="visually-hidden">{{ qtrc('preferences','Language') }}</span><select :value="language" @change="changeLanguage(($event.target as HTMLSelectElement).value)"><option value="system">{{ qtrc('preferences','System default') }}</option><option v-for="item in languages" :key="item.code" :value="item.code">{{ item.name }}</option></select></label><p class="muted hint">{{ language === 'system' ? `${qtrc('preferences', 'System default')}: ${languages.find(l => l.code === currentLanguage())?.name ?? 'English'}` : '' }}</p></section>
          <section v-else-if="page==='cloud'" class="preferences-section" aria-labelledby="pref-autosave"><h3 id="pref-autosave">{{ qtrc('preferences','Auto save') }}</h3><div class="autosave-row"><label class="check"><input type="checkbox" :checked="project.autoSaveEnabled" @change="updateSettings('project',{autoSaveEnabled:($event.target as HTMLInputElement).checked})" />{{ qtrc('preferences','Auto save every') }}</label><span class="number-with-unit"><input type="number" min="1" max="100" step="1" :disabled="!project.autoSaveEnabled" :aria-label="qtrc('preferences','Auto save every')" :value="Math.max(1, Math.round(project.autoSaveInterval))" @change="e=>{const n=Math.round(Number((e.target as HTMLInputElement).value));if(n>=1&&n<=100)updateSettings('project',{autoSaveInterval:n})}" /> {{ qtrc('global','min','abbreviation of minutes') }}</span></div></section>
          <section v-else-if="page==='note-input'" class="preferences-section" aria-labelledby="pref-note-preview"><h3 id="pref-note-preview">{{ qtrc('preferences','Note preview') }}</h3><label class="check"><input type="checkbox" :checked="playback.playNotesWhenEditing" @change="updateSettings('playback',{playNotesWhenEditing:($event.target as HTMLInputElement).checked})" />{{ qtrc('preferences','Hear playback when adding, editing, and selecting notes') }}</label><div class="autosave-row"><span>{{ qtrc('preferences','Playback duration') }}</span><span class="number-with-unit"><input type="number" min="0" max="10000" step="1" :disabled="!playback.playNotesWhenEditing" :aria-label="qtrc('preferences','Playback duration')" :value="playback.notePlayDuration" @change="e=>{const n=Math.round(Number((e.target as HTMLInputElement).value));if(n>=0&&n<=10000)updateSettings('playback',{notePlayDuration:n})}" /> {{ qtrc('global','ms') }}</span></div><label v-for="[key,label] in [['playChordWhenEditing','Play chord when editing'],['playHarmonyWhenEditing','Play chord symbols and Nashville numbers'],['playPreviewNotesInInputByDuration','Play when setting pitch (input by duration mode only)'],['playPreviewNotesWithScoreDynamics','Play preview notes with score dynamics']] as const" :key="key" class="check"><input type="checkbox" :checked="playback.playNotesWhenEditing && playback[key]" :disabled="!playback.playNotesWhenEditing" @change="updateSettings('playback',{[key]:($event.target as HTMLInputElement).checked})" />{{ qtrc('preferences',label) }}</label></section>
          <template v-else-if="page==='import'"><section class="preferences-section" aria-labelledby="pref-import-style"><h3 id="pref-import-style">{{ qtrc('preferences','Style used for import') }}</h3><label class="check"><input type="radio" name="import-style" :checked="useStyleFile==='builtin'" @change="useStyleFile='builtin'; updateSettings('import',{styleFile:null})" />{{ qtrc('preferences','Built-in style') }}</label><div class="autosave-row import-style-row"><label class="check"><input type="radio" name="import-style" :checked="useStyleFile==='file'" @change="useStyleFile='file'" />{{ qtrc('preferences','Use style file') }}</label><input type="text" readonly class="import-style-path" :disabled="useStyleFile!=='file'" :value="imp.styleFile?.name ?? ''" :aria-label="qtrc('preferences','Use style file')" /><button class="secondary" :disabled="useStyleFile!=='file'" :title="qtrc('preferences','Choose default style for imports')" @click="chooseStyle">{{ qtrc('ui','Browse') }}</button></div></section><section class="preferences-section" aria-labelledby="pref-import-musicxml"><h3 id="pref-import-musicxml">{{ qtrc('preferences','MusicXML') }}</h3><label v-for="key in ['importLayout','importBreaks','needUseDefaultFont','inferTextType'] as const" :key="key" class="check"><input type="checkbox" :checked="imp.musicXml[key]" @change="updateSettings('import',{musicXml:{...imp.musicXml,[key]:($event.target as HTMLInputElement).checked}})" />{{ qtrc('preferences',({importLayout:'Import layout',importBreaks:'Import system and page breaks',needUseDefaultFont:'Apply default typeface (Edwin) to imported scores',inferTextType:'Infer text type based on content where possible'})[key]) }}</label></section><section class="preferences-section" aria-labelledby="pref-import-midi"><h3 id="pref-import-midi">{{ qtrc('preferences','MIDI') }}</h3><div class="autosave-row"><span>{{ qtrc('preferences','Shortest note') }}</span><select class="import-shortest-note" :aria-label="qtrc('preferences','Shortest note')" :value="imp.midi.midiShortestNote" @change="updateSettings('import',{midi:{...imp.midi,midiShortestNote:Number(($event.target as HTMLSelectElement).value)}})"><option v-for="[title,ticks] in shortestNotes" :key="ticks" :value="ticks">{{ qtrc('preferences',title) }}</option></select></div><label class="check"><input type="checkbox" :checked="imp.midi.roundTempo" @change="updateSettings('import',{midi:{...imp.midi,roundTempo:($event.target as HTMLInputElement).checked}})" />{{ qtrc('appshell/preferences','Round tempos to nearest whole number') }}</label></section></template>
          <section v-else class="preferences-section" aria-labelledby="pref-web"><h3 id="pref-web">{{ webtr('Web version') }}</h3><label class="check"><input type="checkbox" :checked="web.spacePan" @change="updateSettings('web',{spacePan:($event.target as HTMLInputElement).checked})" />{{ webtr('Hold Space and drag to move the score') }}</label><p class="muted hint">{{ actionTitle('play-from-selection') }}: {{ formatShortcut(shortcuts('play-from-selection')[0] ?? 'Shift+Space') }}, {{ actionTitle('stop') }}: {{ formatShortcut('Esc') }}. {{ webtr('Otherwise Space starts and stops playback and the middle mouse button moves the score.') }}</p></section>
        </div>
      </div>
    <form method="dialog" class="dialog-buttons"><button class="primary" value="ok">{{ qtrc('global', 'OK') }}</button></form>
  </dialog>
</template>
