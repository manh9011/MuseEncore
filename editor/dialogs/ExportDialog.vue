<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { shallowRef } from 'vue'
import { type Score } from '../../src/index'
import { currentScore } from '../scoreview'
const pending = shallowRef<Score | null>(null)
export function openExportDialog(): void { pending.value = currentScore() }
</script>
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import './export.css'
import { zipSync } from 'fflate'
import { createExportDialogModel, type ExportDialogModel, type ExportedFile, type UnitType, type MusicXmlLayoutType } from '../../src/index'
import { baseName, saveToComputer, type FilePickerType } from '../files'
import { qtrc, useLanguage } from '../i18n'
import { session } from '../session'
import { settings, updateSettings } from '../settings'

useLanguage()
const model = shallowRef<ExportDialogModel | null>(null)
const revision = ref(0)
const busy = ref(false)
const progress = ref<{ current: number; total: number } | null>(null)
const error = ref('')
const dialog = ref<HTMLDialogElement|null>(null)
watch(pending, async score => {
  if (!score) { model.value?.updateExportInfo(); model.value = null; return }
  const configuration = structuredClone(settings().export)
  const m = createExportDialogModel(score, configuration, baseName(session().current?.name ?? 'Untitled score'), () => updateSettings('export', structuredClone(configuration)))
  m.init()
  model.value = m
  revision.value++
  error.value = ''
  await nextTick(); dialog.value?.showModal()
})
const types = computed(() => { void revision.value; return model.value?.exportTypeList() ?? [] })
const selected = computed(() => { void revision.value; return model.value?.selectedExportType() })
const top = computed(() => { void revision.value; return model.value?.selectedTopLevelType() })
const items = computed(() => { void revision.value; return [...(model.value?.items() ?? [])] })
function selectType(id: string) { model.value?.selectExportTypeById(id); revision.value++ }
function selectItem(index: number, selected: boolean) { model.value?.setSelected(index, selected); revision.value++ }
function selectAll(selected: boolean) { model.value?.setAllSelected(selected); revision.value++ }
const tr=(s:string)=>qtrc('project/export',s)
function update(fn: (model: ExportDialogModel) => void) { if (model.value) { fn(model.value); revision.value++ } }
function resolution(e: Event, kind: 'pdf' | 'png') { const input = e.target as HTMLInputElement; const m = model.value; if (!m) return; const old = kind === 'pdf' ? m.pdfResolution() : m.pngResolution(); const value = input.value === '' ? old : Math.round(input.valueAsNumber); const n = Number.isFinite(value) ? Math.max(kind === 'pdf' ? 72 : 32, Math.min(kind === 'pdf' ? 2400 : 5000, value)) : old; input.value = String(n); update(m => kind === 'pdf' ? m.setPdfResolution(n) : m.setPngResolution(n)) }
function fileType(name: string): FilePickerType {
  const suffix = name.slice(name.lastIndexOf('.') + 1).toLowerCase()
  const mime: Record<string, string> = { pdf: 'application/pdf', png: 'image/png', svg: 'image/svg+xml', mid: 'audio/midi', midi: 'audio/midi', mxl: 'application/vnd.recordare.musicxml', musicxml: 'application/vnd.recordare.musicxml+xml', mscz: 'application/x-musescore', zip: 'application/zip' }
  return { description: suffix.toUpperCase(), accept: { [mime[suffix] ?? 'application/octet-stream']: [`.${suffix}`] } }
}
async function exportFiles() {
  const m = model.value
  if (!m || busy.value || !m.selectionLength()) return
  busy.value = true
  error.value = ''
  try {
    await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve)))
    const files: ExportedFile[] = await m.exportScores((current, total) => { progress.value = { current, total } })
    if (!files.length) return
    const name = files.length === 1 ? files[0].fileName : `${m.defaultFileName().replace(/\.[^.]*$/, '')}.zip`
    const data = files.length === 1 ? files[0].data : zipSync(Object.fromEntries(files.map(f => [f.fileName, [f.data, { level: 0 }]])))
    if (await saveToComputer(data, name, fileType(name))) dialog.value?.close()
  } catch (e) { error.value = (e as Error).message }
  finally { busy.value = false; progress.value = null }
}
</script>
<template>
 <dialog v-if="model && selected && top" ref="dialog" class="export-dialog" aria-labelledby="export-dialog-title" @cancel="busy && $event.preventDefault()" @close.self="pending=null">
  <h2 id="export-dialog-title" class="visually-hidden">{{tr("Export")}}</h2><div class="export-columns"><div class="export-column"><div class="export-heading">{{tr("Select parts to export")}}</div><div class="export-scores" role="list"><label v-for="(item,index) in items" :key="index" class="export-score" :class="{main:item.isMain}" role="listitem"><input type="checkbox" :checked="item.isSelected" :disabled="busy" @change="selectItem(index,($event.target as HTMLInputElement).checked)" /><span>{{item.isMain?tr("Main score"):item.title}}</span></label></div><div class="export-buttons"><button type="button" class="secondary" :disabled="busy" @click="selectAll(true)">{{tr("Select all")}}</button><button type="button" class="secondary" :disabled="busy" @click="selectAll(false)">{{tr("Clear selection")}}</button></div></div>
  <div class="export-column"><div class="export-heading">{{tr("Export settings")}}</div><fieldset class="export-options" :disabled="busy"><div class="export-option"><label for="export-format">{{tr("Format:")}}</label><select id="export-format" :value="top.id" @change="selectType(($event.target as HTMLSelectElement).value)"><option v-for="type in types" :key="type.id" :value="type.id">{{type.name}}</option></select></div><div v-if="top.subtypes.length" class="export-option"><label for="export-subtype">{{tr("File type:")}}</label><select id="export-subtype" :value="selected.id" @change="selectType(($event.target as HTMLSelectElement).value)"><option v-for="type in top.subtypes" :key="type.id" :value="type.id">{{type.name}}</option></select></div>
  <template v-if="selected.settingsPage === 'PdfSettingsPage' || selected.settingsPage === 'PngSettingsPage'"><div class="export-option"><label for="export-resolution">{{tr("Resolution:")}}</label><span class="export-spinbox"><input id="export-resolution" type="number" step="1" :value="selected.settingsPage === 'PdfSettingsPage' ? model.pdfResolution() : model.pngResolution()" :min="selected.settingsPage === 'PdfSettingsPage' ? 72 : 32" :max="selected.settingsPage === 'PdfSettingsPage' ? 2400 : 5000" @blur="resolution($event,selected.settingsPage === 'PdfSettingsPage' ? 'pdf' : 'png')" @keydown.enter.prevent="resolution($event,selected.settingsPage === 'PdfSettingsPage' ? 'pdf' : 'png')" /><span class="unit">{{qtrc("global","dpi")}}</span></span></div><label class="export-check"><input type="checkbox" :checked="selected.settingsPage === 'PdfSettingsPage' ? model.pdfTransparentBackground() : model.pngTransparentBackground()" @change="update(m=>selected?.settingsPage === 'PdfSettingsPage' ? m.setPdfTransparentBackground(($event.target as HTMLInputElement).checked) : m.setPngTransparentBackground(($event.target as HTMLInputElement).checked))" /><span>{{tr("Transparent background")}}</span></label><label class="export-check"><input type="checkbox" :checked="selected.settingsPage === 'PdfSettingsPage' ? model.pdfGrayscale() : model.pngGrayscale()" @change="update(m=>selected?.settingsPage === 'PdfSettingsPage' ? m.setPdfGrayscale(($event.target as HTMLInputElement).checked) : m.setPngGrayscale(($event.target as HTMLInputElement).checked))" /><span>{{tr("Grayscale")}}</span></label><p v-if="selected.settingsPage === 'PngSettingsPage'" class="export-info">{{tr("Each page of the selected parts will be exported as a separate %1 file.").replace("%1","PNG")}}</p></template>
  <template v-if="selected.settingsPage === 'SvgSettingsPage'"><label class="export-check"><input type="checkbox" :checked="model.svgTransparentBackground()" @change="update(m=>m.setSvgTransparentBackground(($event.target as HTMLInputElement).checked))" /><span>{{tr("Transparent background")}}</span></label><label class="export-check"><input type="checkbox" :checked="model.svgIllustratorCompat()" @change="update(m=>m.setSvgIllustratorCompat(($event.target as HTMLInputElement).checked))" /><span>{{tr("Masking compatibility (Adobe Illustrator only)")}}</span></label><p class="export-info">{{tr("Each page of the selected parts will be exported as a separate %1 file.").replace("%1","SVG")}}</p></template>
  <template v-if="selected.settingsPage === 'MidiSettingsPage'"><label class="export-check"><input type="checkbox" :checked="model.midiExpandRepeats()" @change="update(m=>m.setMidiExpandRepeats(($event.target as HTMLInputElement).checked))" /><span>{{tr("Expand repeats")}}</span></label><label class="export-check"><input type="checkbox" :checked="model.midiExportRpns()" @change="update(m=>m.setMidiExportRpns(($event.target as HTMLInputElement).checked))" /><span>{{tr("Export RPNs")}}</span></label><p class="export-info">{{tr("Each selected part will be exported as a separate MIDI file.")}}</p></template>
  <div v-if="selected.settingsPage === 'MusicXmlSettingsPage'" class="export-radios" role="radiogroup"><label v-for="option in model.musicXmlLayoutTypes()" :key="option.value" class="export-check"><input type="radio" name="musicxml-layout" :checked="model.musicXmlLayoutType() === option.value" @change="update(m=>m.setMusicXmlLayoutType(option.value as MusicXmlLayoutType))" /><span>{{option.text}}</span></label></div><div v-if="model.availableUnitTypes().length > 1" class="export-radios" role="radiogroup"><label v-for="unit in model.availableUnitTypes()" :key="unit.value" class="export-check"><input type="radio" name="export-unit-type" :checked="model.selectedUnitType() === unit.value" @change="update(m=>m.setUnitType(unit.value as UnitType))" /><span>{{unit.text}}</span></label></div></fieldset><div v-if="busy" class="export-progress" role="status"><span>{{tr("Exporting…")}}</span><progress :max="progress?.total || 1" :value="progress?.total ? progress.current : undefined" /></div><p v-if="error" class="export-error" role="alert">{{error}}</p><div class="dialog-buttons"><button type="button" class="secondary" :disabled="busy" @click="dialog?.close()">{{qtrc("global","Cancel")}}</button><button type="button" class="primary" :disabled="busy || !items.some(i=>i.isSelected)" @click="exportFiles">{{tr("Export…")}}</button></div></div></div>
 </dialog>
</template>
