<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useActions } from '../../actions/actions'
import { BeamMode } from '../../../src/engraving/types/types'
import { inspectorPropertyChanges, inspectorPropertyResets, type InspectorModelInfo } from '../../../src/index'
import { ICON_CODES } from '../../actions/uiactiondata'
import { qtrc, useLanguage } from '../../i18n'
useLanguage()
import { currentScore } from '../../scoreview'
import { applyInspectorChanges, scoreChanged } from '../editbridge'
import InspectorModel from './InspectorModel.vue'
import InspectorSpin from './InspectorSpin.vue'

const props = defineProps<{ model: InspectorModelInfo }>()
const openPopup = ref<string | null>(null)
const popupGrid = ref<HTMLElement | null>(null)
function outsidePopup(event: PointerEvent) {
  const open = popupGrid.value?.querySelector('.insp-popup')?.parentElement
  if (open && !open.contains(event.target as Node)) openPopup.value = null
}
document.addEventListener('pointerdown', outsidePopup)
onUnmounted(() => document.removeEventListener('pointerdown', outsidePopup))
function popupKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !openPopup.value) return
  event.stopPropagation()
  openPopup.value = null
  ;(event.currentTarget as HTMLElement).querySelector<HTMLButtonElement>('.insp-flat-button')?.focus()
}
useActions()
function icon(name: string) { const code = ICON_CODES[name]; return code ? String.fromCodePoint(code) : '' }
function beamModeTitle(mode: BeamMode): string {
  return qtrc('inspector', beamModes.find(item => item.mode === mode)?.title ?? String(mode))
}
function radioKeydown(event: KeyboardEvent) {
  const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0
  if (!direction) return
  const buttons = [...(event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('[role="radio"]')]
  const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
  if (current < 0 || !buttons.length) return
  event.preventDefault()
  buttons[(current + direction + buttons.length) % buttons.length]?.focus()
}
function changeRestBeam(mode: BeamMode) {
  const score = currentScore()
  if (!score) return
  const changes = inspectorPropertyChanges(score, { section: props.model.sectionType, path: ['TYPE_REST', 'TYPE_REST_BEAM'], property: 'mode' }, mode)
  if (applyInspectorChanges(score, changes)) scoreChanged()
}
function resetRestBeam() {
  const score = currentScore()
  if (!score) return
  const changes = inspectorPropertyResets(score, { section: props.model.sectionType, path: ['TYPE_REST', 'TYPE_REST_BEAM'], property: 'mode' })
  if (applyInspectorChanges(score, changes)) scoreChanged()
}
function tabKeydown(event: KeyboardEvent) {
  const rtl = document.documentElement.dir === 'rtl'
  const direction = ['ArrowRight', 'ArrowLeft'].includes(event.key) ? ((event.key === 'ArrowRight') !== rtl ? 1 : -1) : 0
  if (!direction) return
  const tabs = [...(event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('[role="tab"]')]
    .filter(tab => !tab.hidden && getComputedStyle(tab).display !== 'none')
  const current = tabs.indexOf(document.activeElement as HTMLButtonElement)
  if (current < 0 || !tabs.length) return
  event.preventDefault()
  const next = tabs[(current + direction + tabs.length) % tabs.length]
  if (next) {
    next.click()
    next.focus()
  }
}
function noteTabTitle(tab: string): string {
  const type = tab === 'head' ? 'TYPE_NOTEHEAD' : tab === 'stem' ? 'TYPE_STEM' : 'TYPE_BEAM'
  return models.value.find(model => model.modelType === 'TYPE_NOTE')?.models.find(part => part.modelType === type)?.title ?? ''
}
function title(type: string): string {
  if (type === 'TYPE_REST') return qtrc('inspector', 'Rest')
  if (type === 'TYPE_REST_BEAM') return qtrc('inspector', 'Beam')
  return qtrc('inspector', 'Notation')
}
function isVibrato(model: InspectorModelInfo) { return model.modelType === 'TYPE_VIBRATO' }
function isMarkerOrJump(model: InspectorModelInfo) { return model.modelType === 'TYPE_MARKER' || model.modelType === 'TYPE_JUMP' }
const models = computed(() => props.model.models.filter(child => !child.isEmpty))
const selected = ref('TYPE_REST_BEAM')
const noteSelected = ref('')
const stemExpanded = ref(false)
const noteDefault = computed(() => {
  const type = models.value.find(child => child.modelType === 'TYPE_NOTE')?.defaultSubModelType
  return type === 'TYPE_STEM' || type === 'TYPE_HOOK' ? 'stem' : type === 'TYPE_BEAM' ? 'beam' : 'head'
})
const currentNoteTab = computed(() => {
  const trill = models.value.find(child => child.modelType === 'TYPE_NOTE')?.flags.isTrillCueNote === true
  return trill && noteDefault.value !== 'head' && !noteSelected.value ? 'head' : noteSelected.value || noteDefault.value
})
const restModels = computed(() => models.value.find(child => child.modelType === 'TYPE_REST')?.models ?? [])
const restBeamMode = computed(() => restModels.value.find(child => child.modelType === 'TYPE_REST_BEAM')?.properties.mode)
const beamModes = [
  { mode: BeamMode.AUTO, title: 'Auto', icon: 'AUTO_TEXT' }, { mode: BeamMode.NONE, title: 'No beam', icon: 'BEAM_NONE' },
  { mode: BeamMode.BEGIN, title: 'Break beam left', icon: 'BEAM_BREAK_LEFT' },
  { mode: BeamMode.BEGIN16, title: 'Break inner beams (8th)', icon: 'BEAM_BREAK_INNER_8TH' },
  { mode: BeamMode.BEGIN32, title: 'Break inner beams (16th)', icon: 'BEAM_BREAK_INNER_16TH' },
  { mode: BeamMode.MID, title: 'Join beams', icon: 'BEAM_JOIN' },
]
const restAlign = computed(() => restModels.value.find(child => child.modelType === 'TYPE_REST_REST')?.properties.alignWithOtherRests)
function changeNote(type: string, property: string, value?: import('../../../src/index').InspectorValue) {
  const score = currentScore()
  if (!score) return
  const ref = { section: props.model.sectionType, path: ['TYPE_NOTE', type], property }
  const changes = value === undefined ? inspectorPropertyResets(score, ref) : inspectorPropertyChanges(score, ref, value)
  if (applyInspectorChanges(score, changes)) scoreChanged()
}
function changeRest(value: boolean) {
  const score = currentScore()
  if (!score) return
  const changes = inspectorPropertyChanges(score, { section: props.model.sectionType, path: ['TYPE_REST', 'TYPE_REST_REST'], property: 'alignWithOtherRests' }, value)
  if (applyInspectorChanges(score, changes)) scoreChanged()
}
</script>
<template>
  <div v-if="models.length === 1 && models[0].modelType === 'TYPE_NOTE'" class="insp-column" data-view="NoteSettings">
    <div class="insp-tabbar" role="tablist" :aria-label="models[0].title" @keydown="tabKeydown">
      <button v-for="tab in ['head', 'stem', 'beam']" :key="tab" v-show="!models[0].flags.isTrillCueNote || tab === 'head'" type="button" role="tab" :aria-selected="currentNoteTab === tab" :tabindex="currentNoteTab === tab ? 0 : -1" @click="noteSelected = tab">{{ noteTabTitle(tab) }}</button>
    </div>
    <div v-if="currentNoteTab === 'stem'" class="insp-column">
      <template v-for="chord in models[0].models.filter(p => p.modelType === 'TYPE_CHORD')" :key="chord.key"><label v-for="entry in [{key:'isStemless', text:'Stemless'}, {key:'showStemSlash', text:'Show stem slash'}]" :key="entry.key" v-show="chord.properties[entry.key]?.isVisible && (entry.key !== 'showStemSlash' || chord.flags.showStemSlashVisible)" class="insp-checkbox"><input type="checkbox" :checked="chord.properties[entry.key]?.value === true" :disabled="!chord.properties[entry.key]?.isEnabled" @change="changeNote('TYPE_CHORD',entry.key,($event.target as HTMLInputElement).checked)" />{{ qtrc('inspector',entry.text) }}</label></template>
      <template v-for="stem in models[0].models.filter(p => p.modelType === 'TYPE_STEM')" :key="stem.key"><div v-if="!stem.isEmpty && stem.properties.stemDirection?.isVisible" class="insp-property"><div class="insp-property-title"><span>{{ qtrc('inspector','Stem direction') }}</span><button class="insp-reset" :disabled="!stem.properties.stemDirection.isModified || !stem.properties.stemDirection.isEnabled" :aria-label="qtrc('inspector','Reset property to default value')" @click="changeNote('TYPE_STEM','stemDirection')">{{ icon('UNDO') }}</button></div><div class="insp-radio-group" role="radiogroup" :aria-label="qtrc('inspector','Stem direction')" @keydown="radioKeydown"><button v-for="item in [{value:0,text:'Auto'},{value:2,icon:'ARROW_DOWN'},{value:1,icon:'ARROW_UP'}]" :key="item.value" class="insp-radio" :class="{'insp-icon':item.icon}" role="radio" :aria-checked="stem.properties.stemDirection.value === item.value" :disabled="!stem.properties.stemDirection.isEnabled" @click="changeNote('TYPE_STEM','stemDirection',item.value)">{{ item.icon ? icon(item.icon) : qtrc('inspector',item.text || '') }}</button></div></div><div class="insp-property disabled"><div class="insp-property-title"><span>{{ qtrc('inspector','Flag style') }}</span></div><div class="insp-radio-group" role="radiogroup" :aria-label="qtrc('inspector','Flag style')"><button v-for="item in [{icon:'NOTEFLAGS_TRADITIONAL',value:false},{icon:'NOTEFLAGS_STRAIGHT',value:true}]" :key="item.icon" class="insp-radio insp-icon" role="radio" :aria-checked="Boolean(stem.flags.useStraightNoteFlags) === item.value" disabled>{{ icon(item.icon) }}</button></div></div><div v-if="!stem.isEmpty" class="insp-showmore"><button type="button" class="insp-expand" :aria-expanded="stemExpanded" @click="stemExpanded = !stemExpanded"><span class="insp-arrow" aria-hidden="true">{{ icon('SMALL_ARROW_DOWN') }}</span>{{ qtrc('inspector', stemExpanded ? 'Show less' : 'Show more') }}</button><div v-if="stemExpanded" class="insp-column"><div class="insp-row"><div v-for="entry in [{key:'thickness', title:'Thickness', step:0.01, min:0.01, max:4}, {key:'length', title:'Length', step:0.5, min:-20, max:20}]" :key="entry.key" class="insp-property"><div class="insp-property-title"><span>{{ qtrc('inspector',entry.title) }}</span><button class="insp-reset" :disabled="!stem.properties[entry.key]?.isModified || !stem.properties[entry.key]?.isEnabled" :aria-label="qtrc('inspector','Reset property to default value')" @click="changeNote('TYPE_STEM',entry.key)">{{ icon('UNDO') }}</button></div><InspectorSpin :label="qtrc('inspector',entry.title)" :value="stem.properties[entry.key]?.value as number | null" :unit="qtrc('global','sp')" :step="entry.step" :min="entry.min" :max="entry.max" :disabled="!stem.properties[entry.key]?.isEnabled" @commit="value => changeNote('TYPE_STEM',entry.key,value)" /></div></div><template v-for="part in models[0].models.filter(p => (p.modelType === 'TYPE_STEM' || p.modelType === 'TYPE_HOOK') && !p.isEmpty)" :key="part.key"><div v-if="part.properties.offset?.value && typeof part.properties.offset.value === 'object' && 'x' in part.properties.offset.value" class="insp-property"><div class="insp-property-title"><span>{{ qtrc('inspector',part.modelType === 'TYPE_STEM' ? 'Stem offset' : 'Flag offset') }}</span><button class="insp-reset" :disabled="!part.properties.offset.isModified || !part.properties.offset.isEnabled" :aria-label="qtrc('inspector','Reset property to default value')" @click="changeNote(part.modelType,'offset')">{{ icon('UNDO') }}</button></div><div class="insp-row"><InspectorSpin v-for="axis in (['x','y'] as const)" :key="axis" :label="`${qtrc('inspector',part.modelType === 'TYPE_STEM' ? 'Stem offset' : 'Flag offset')} ${axis}`" :value="part.properties.offset.value[axis]" :unit="qtrc('global','sp')" :disabled="!part.properties.offset.isEnabled" @commit="value => changeNote(part.modelType,'offset',{ ...part.properties.offset.value as object, [axis]:value } as import('../../../src/index').InspectorValue)" /></div></div></template></div></div></template>
    </div>
    <div v-if="currentNoteTab === 'beam'" class="insp-column"><template v-for="beam in models[0].models.filter(p => p.modelType === 'TYPE_BEAM')" :key="beam.key"><div v-for="entry in [{key:'mode',title:'Beam type',choices:beamModes.map(x=>({value:x.mode,icon:x.icon}))},{key:'stemDirection',title:'Beam direction',choices:[{value:0,text:'Auto'},{value:2,icon:'ARROW_DOWN'},{value:1,icon:'ARROW_UP'}]}]" :key="entry.key" v-show="beam.properties[entry.key]?.isVisible && (entry.key !== 'stemDirection' || (!beam.isEmpty && !beam.flags.isCrossStaffMoveAvailable))" class="insp-property"><div class="insp-property-title"><span>{{ qtrc('inspector',entry.title) }}</span><button class="insp-reset" :disabled="!beam.properties[entry.key]?.isModified || !beam.properties[entry.key]?.isEnabled" :aria-label="qtrc('inspector','Reset property to default value')" @click="changeNote('TYPE_BEAM',entry.key)">{{ icon('UNDO') }}</button></div><div class="insp-radio-group" role="radiogroup" :aria-label="qtrc('inspector',entry.title)" @keydown="radioKeydown"><button v-for="choice in entry.choices" :key="choice.value" class="insp-radio" :class="{'insp-icon':choice.icon}" role="radio" :aria-checked="beam.properties[entry.key]?.value === choice.value" :disabled="!beam.properties[entry.key]?.isEnabled" @click="changeNote('TYPE_BEAM',entry.key,choice.value)">{{ choice.icon ? icon(choice.icon) : qtrc('inspector','text' in choice ? String(choice.text) : '') }}</button></div></div><div v-if="!beam.isEmpty && beam.flags.isFeatheringHeightChangingAllowed" class="insp-row"><div v-for="entry in [{key:'featheringHeightLeft',title:'Feathering left'},{key:'featheringHeightRight',title:'Feathering right'}]" :key="entry.key" class="insp-property"><div class="insp-property-title"><span>{{ qtrc('inspector',entry.title) }}</span><button class="insp-reset" :disabled="!beam.properties[entry.key]?.isModified || !beam.properties[entry.key]?.isEnabled" :aria-label="qtrc('inspector','Reset property to default value')" @click="changeNote('TYPE_BEAM',entry.key)">{{ icon('UNDO') }}</button></div><InspectorSpin :label="qtrc('inspector',entry.title)" :value="beam.properties[entry.key]?.value as number | null" :step="0.1" :min="0" :max="4" :disabled="!beam.properties[entry.key]?.isEnabled" @commit="value => changeNote('TYPE_BEAM',entry.key,value)" /></div></div></template></div>
    <template v-for="partType in (currentNoteTab === 'head' ? ['TYPE_NOTEHEAD'] : [])" :key="partType">
      <InspectorModel v-if="models[0].models.find(part => part.modelType === partType)" :model="models[0].models.find(part => part.modelType === partType)!" :section="model.sectionType" :path="['TYPE_NOTE', partType]" :chord="models[0].models.find(part => part.modelType === 'TYPE_CHORD')" />
    </template>
  </div>
  <div v-else-if="models.length === 1 && models[0].modelType === 'TYPE_REST'" class="insp-column">
    <div class="insp-tabbar" role="tablist" :aria-label="models[0].title" @keydown="tabKeydown">
      <button v-for="child in restModels" :key="child.key" type="button" role="tab" :aria-selected="selected === child.key" :tabindex="selected === child.key ? 0 : -1" @click="selected = child.key">{{ child.title }}</button>
    </div>
    <div v-if="selected === 'TYPE_REST_BEAM' && restBeamMode?.isVisible" class="insp-property" :class="{disabled: !restBeamMode.isEnabled}">
      <div class="insp-property-title"><span>{{ qtrc('inspector', 'Beam type') }}</span><button class="insp-reset" :disabled="!restBeamMode.isModified || !restBeamMode.isEnabled" :aria-label="qtrc('inspector', 'Reset property to default value')" @click="resetRestBeam">{{ icon('UNDO') }}</button></div>
      <div class="insp-radio-group" role="radiogroup" :aria-label="qtrc('inspector', 'Beam type')" @keydown="radioKeydown"><button v-for="item in beamModes" :key="item.mode" class="insp-radio insp-icon" role="radio" :aria-checked="restBeamMode.value === item.mode" :aria-label="beamModeTitle(item.mode)" :title="beamModeTitle(item.mode)" :disabled="!restBeamMode.isEnabled" @click="changeRestBeam(item.mode)">{{ icon(item.icon) }}</button></div>
    </div>
    <label v-if="selected === 'TYPE_REST_REST' && restAlign?.isVisible" class="insp-checkbox" :class="{disabled: !restAlign.isEnabled}"><input type="checkbox" :checked="restAlign.value === true" :indeterminate="restAlign.isEnabled && restAlign.isUndefined" :disabled="!restAlign.isEnabled" @change="changeRest(($event.target as HTMLInputElement).checked)" />{{ qtrc('inspector', 'Align with other rests in the same voice') }}</label>
  </div>
  <p v-else-if="model.models.length === 1 && model.models[0].modelType === 'TYPE_TREMOLO' && model.models[0].isEmpty" class="insp-hint">{{ qtrc('inspector', 'Notation') }}: TODO(port)</p>
  <p v-else-if="models.length === 1 && ['TYPE_LYRICS', 'TYPE_CHORD_SYMBOL', 'TYPE_INSTRUMENT_NAME', 'TYPE_AMBITUS', 'TYPE_BRACKET', 'TYPE_LYRICS_LINE', 'TYPE_VERTICAL_FRAME', 'TYPE_HORIZONTAL_FRAME', 'TYPE_TEXT_FRAME', 'TYPE_EXPRESSION', 'TYPE_SYMBOL', 'TYPE_STAFF_TYPE_CHANGES'].includes(models[0].modelType) && !Object.keys(models[0].properties).length" class="insp-hint">{{ qtrc('inspector', 'Notation') }}: TODO(port)</p>
  <InspectorModel v-else-if="model.models.length === 1 && models.length === 1" :model="models[0]" :section="model.sectionType" :path="[models[0].key]" />
  <InspectorModel v-else-if="models.length === 1 && (isVibrato(models[0]) || isMarkerOrJump(models[0]))" :model="models[0]" :section="model.sectionType" :path="[models[0].key]" />
  <div v-else ref="popupGrid" class="insp-grid2">
    <div v-for="child in models" :key="child.key" class="insp-popup-button" @keydown="popupKeydown">
      <button type="button" class="insp-flat-button" :aria-expanded="openPopup === child.key" aria-haspopup="dialog" @click="openPopup = openPopup === child.key ? null : child.key"><span class="insp-button-icon" aria-hidden="true">{{ icon(child.icon) }}</span>{{ child.title }}</button>
      <div v-if="openPopup === child.key" class="insp-popup" role="dialog" :aria-label="child.title">
        <InspectorModel :model="child" :section="model.sectionType" :path="[child.key]" />
      </div>
    </div>
  </div>
</template>
