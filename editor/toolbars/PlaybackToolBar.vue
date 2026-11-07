<!--
  SPDX-License-Identifier: GPL-3.0-only
  Playback toolbar controls (Play/Pause, Rewind, Loop, Metronome, Time/Measure display, Tempo/Volume popover)
  migrated from `editor/toolbars/PlaybackToolBar.tsx` to Vue 3 + Nuxt UI.
-->
<script setup lang="ts">
import {
  actionDescription,
  actionDefinition,
  isActionChecked,
  isActionEnabled,
  triggerAction,
  useActions,
} from '../actions/actions'
import { qtrc, trString, useLanguage, webtr } from '../i18n'
import { usePlayalongState } from '../playalong/playalongcontroller'
import { ICON_CODES } from '../actions/uiactiondata'
import MenuPopup from '../components/MenuPopup.vue'
import type { MenuItem } from '../menus/appmenu'
import { usePlaybackState, setTempoMultiplier, rewindTo, rewindToBeat } from '../playback/playbackcontroller'
import { computed, nextTick, ref, watch } from 'vue'

useLanguage()
const actions = useActions()
const settingsButton = ref<HTMLButtonElement | null>(null)
const settingsMenu = ref<DOMRect | null>(null)
function closeSettings(focus: boolean) { settingsMenu.value = null; if (focus) void nextTick(() => settingsButton.value?.focus()) }
const playback = usePlaybackState()
const playalong = usePlayalongState()
const playbackActions = computed(() => {
  void actions.value
  return ['rewind', 'play', 'loop', 'metronome', 'playback-mute']
})
function actionIcon(code: string): number {
  return code === 'play' && playback.playing ? ICON_CODES.PAUSE : code === 'playback-mute' ? ICON_CODES.AUDIO : actionDefinition(code)?.icon ?? 0
}
const timeEdit = ref<string | null>(null)
const speed = ref(100)
watch(() => playback.tempoMultiplier, value => { speed.value = Math.round(value * 100) }, { immediate: true })
function formatTime(secs: number): string {
  const t = Math.max(0, secs)
  const h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60
  return `${h}:${String(m).padStart(2, '0')}:${s.toFixed(1).padStart(4, '0')}`
}
function parseTime(text: string): number | null {
  const parts = text.trim().split(':').map(Number)
  return parts.length && parts.every(p => Number.isFinite(p) && p >= 0) ? parts.reduce((acc, p) => acc * 60 + p, 0) : null
}
const settingsItems: MenuItem[] = [
  { kind: 'action', code: 'repeat' }, { kind: 'action', code: 'play-chord-symbols' },
  { kind: 'action', code: 'toggle-hear-playback-when-editing' }, { kind: 'action', code: 'pan' },
  { kind: 'action', code: 'smooth-pan' }, { kind: 'action', code: 'countin' }, { kind: 'separator' },
  { kind: 'menu', id: 'overtone-filter', title: [null, 'Overtone filter'], items: [
    { kind: 'action', code: 'playalong-overtone-filter-off' }, { kind: 'action', code: 'playalong-overtone-filter-normal' },
    { kind: 'action', code: 'playalong-overtone-filter-strong' }, { kind: 'action', code: 'playalong-overtone-filter-calibrated' },
    { kind: 'separator' }, { kind: 'action', code: 'playalong-calibrate' },
  ] }, { kind: 'separator' }, { kind: 'action', code: 'loop-in' }, { kind: 'action', code: 'loop-out' },
]
</script>

<template>
  <div class="toolbar playback-toolbar">
    <button v-for="code in playbackActions" :key="code" type="button" class="tool-button" :class="{ 'mute-button': code === 'playback-mute', muted: code === 'playback-mute' && playback.muted }"
      :data-action="code" :title="actionDescription(code)" :aria-label="actionDescription(code)" :aria-pressed="code === 'loop' ? isActionChecked(code) : code === 'playback-mute' ? playback.muted : undefined"
      :disabled="!isActionEnabled(code)" @click="triggerAction(code)"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(actionIcon(code)) }}</span></button>
    <button ref="settingsButton" type="button" class="tool-button" :aria-label="trString(['action', 'Playback settings'])" :title="trString(['action', 'Playback settings'])" aria-haspopup="menu" :aria-expanded="!!settingsMenu" @click="settingsMenu = settingsMenu ? null : settingsButton!.getBoundingClientRect()"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(ICON_CODES.SETTINGS_COG) }}</span></button>
    <MenuPopup v-if="settingsMenu" :items="settingsItems" :anchor="settingsMenu" placement="below" :label="trString(['action', 'Playback settings'])" @close="closeSettings" />
    <span class="tool-separator" role="separator" aria-orientation="vertical" />
    <input class="playback-time" :aria-label="qtrc('global', 'Seconds')" :value="timeEdit ?? formatTime(playback.position)" @focus="e => { timeEdit = formatTime(playback.position); (e.target as HTMLInputElement).select() }" @input="e => timeEdit = (e.target as HTMLInputElement).value" @blur="timeEdit = null" @keydown.enter="e => { const value = parseTime((e.target as HTMLInputElement).value); if (value !== null) rewindTo(value); timeEdit = null; (e.target as HTMLInputElement).blur() }" @keydown.esc="timeEdit = null" />
    <span class="playback-measure-beat"><input type="number" :aria-label="qtrc('playback', 'Measure', 'Measure number')" :min="1" :max="playback.beat.maxMeasureIndex + 1" :value="playback.beat.measureIndex + 1" @change="e => { const v = Number((e.target as HTMLInputElement).value); if (v >= 1 && v <= playback.beat.maxMeasureIndex + 1) rewindToBeat(v - 1, Math.trunc(playback.beat.beat)) }" /><span aria-hidden="true">.</span><input type="number" :aria-label="qtrc('playback', 'Beat', 'Beat number')" :min="1" :max="playback.beat.maxBeatIndex + 1" :value="Math.trunc(playback.beat.beat) + 1" @change="e => { const v = Number((e.target as HTMLInputElement).value); if (v >= 1 && v <= playback.beat.maxBeatIndex + 1) rewindToBeat(playback.beat.measureIndex, v - 1) }" /></span>

    <!-- Tempo & Volume Popover -->
    <UPopover :content="{ side: 'bottom', sideOffset: 4, onOpenAutoFocus: (e: Event) => e.preventDefault() }">
      <button type="button" class="tool-button with-title tempo-button" :title="qtrc('playback', 'Speed')" :aria-label="`${qtrc('playback', 'Speed')}: ${playback.tempo}`" aria-haspopup="dialog"><span class="tempo-note" aria-hidden="true"></span><span class="tempo-value">{{ ` = ${playback.tempo}` }}</span></button>
      <template #content>
        <div class="speed-popup" style="position: static" role="dialog" :aria-label="qtrc('playback', 'Playback speed popup')" tabindex="-1">
          <label class="speed-label" for="playback-speed">{{ qtrc('playback', 'Speed') }}</label>
          <span class="number-with-unit"><input id="playback-speed" v-model.number="speed" type="number" min="10" max="300" step="5" :aria-label="qtrc('playback', 'Speed')" @change="speed >= 10 && speed <= 300 && setTempoMultiplier(speed / 100)" /> %</span>
          <input type="range" min="0.1" max="3" step="0.05" :value="playback.tempoMultiplier" :aria-label="qtrc('playback', 'Speed')" @input="setTempoMultiplier(Number(($event.target as HTMLInputElement).value))" />
        </div>
      </template>
    </UPopover>
    <span class="tool-separator" role="separator" aria-orientation="vertical" />
    <button type="button" class="tool-button" :title="actionDescription('playalong')" :aria-label="actionDescription('playalong')" :aria-pressed="isActionChecked('playalong')" :disabled="!isActionEnabled('playalong')" @click="triggerAction('playalong')"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(actionDefinition('playalong')?.icon ?? 0) }}</span></button>
    <template v-if="playalong.active && playalong.mode === 'playalong'">
      <button type="button" class="tool-button" :title="actionDescription('playalong-prev')" :aria-label="actionDescription('playalong-prev')" :disabled="!isActionEnabled('playalong-prev')" @click="triggerAction('playalong-prev')"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(actionDefinition('playalong-prev')?.icon ?? 0) }}</span></button>
      <span class="playalong-measure-number" role="status" :aria-label="qtrc('playback', 'Measure', 'Measure number')">{{ playalong.number > 0 ? playalong.number : '–' }}</span>
      <button v-for="code in ['playalong-next', 'playalong-practice']" :key="code" type="button" class="tool-button" :title="actionDescription(code)" :aria-label="actionDescription(code)" :aria-pressed="code === 'playalong-practice' ? isActionChecked(code) : undefined" :disabled="!isActionEnabled(code)" @click="triggerAction(code)"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(actionDefinition(code)?.icon ?? 0) }}</span></button>
    </template>
    <span v-if="playalong.active && playalong.mode === 'noteinput' && playalong.status === 'listening'" class="playalong-status" role="status">{{ webtr('Entering the notes you play') }}</span>
    <span v-if="playalong.status === 'loading' || playalong.status === 'error'" class="playalong-status" :class="{ error: playalong.status === 'error' }" role="status">{{ playalong.status === 'loading' ? webtr('Starting the note detection…') : playalong.error }}</span>
  </div>
</template>
