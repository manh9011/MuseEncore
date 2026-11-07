<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed } from 'vue'
import { actionDefinition, actionDescription, actionTitle, isActionChecked, isActionEnabled, triggerAction, useActions } from '../actions/actions'
import ViewModeControl from '../components/ViewModeControl.vue'
import { qtrc, useLanguage, webtr } from '../i18n'
import { setFitMode, useScoreView, zoomAt, ZOOM_LEVELS, type FitMode } from '../scoreview'
useLanguage()
useActions()
const view = useScoreView()
const fitOptions = computed<[FitMode, string][]>(() => view.viewMode === 'page'
  ? [['page-width', qtrc('notation', 'Page width')], ['whole-page', qtrc('notation', 'Whole page')]]
  : view.viewMode === 'continuous-horizontal' ? [['page-width', webtr('Fit to window height')]]
    : view.viewMode === 'continuous-vertical' ? [['page-width', webtr('Fit to window width')]] : [])
const zoomValue = computed(() => {
  const level = ZOOM_LEVELS.find(l => Math.abs(l - view.zoom) < 0.5)
  return view.fitMode && fitOptions.value.length ? fitOptions.value.find(([mode]) => mode === view.fitMode)?.[0] ?? fitOptions.value[0][0] : level !== undefined ? String(level) : 'custom'
})
function changeZoom(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (value === 'page-width' || value === 'whole-page') setFitMode(value)
  else if (value !== 'custom') zoomAt(Number(value))
  document.getElementById('viewport')?.focus({ preventScroll: true })
}
</script>
<template>
  <div class="toolbar">
    <template v-for="code in ['page-prev']" :key="code"><button class="tool-button" :data-action="code" :title="actionDescription(code)" :aria-label="actionDescription(code)" :disabled="!isActionEnabled(code)" @click="triggerAction(code)"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(actionDefinition(code)?.icon ?? 0) }}</span></button></template>
    <span class="page-info" aria-live="polite" :aria-label="qtrc('notation', 'Page')">{{ view.pageText }}</span>
    <button v-for="code in ['page-next']" :key="code" class="tool-button" :data-action="code" :title="actionDescription(code)" :aria-label="actionDescription(code)" :disabled="!isActionEnabled(code)" @click="triggerAction(code)"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(actionDefinition(code)?.icon ?? 0) }}</span></button>
    <span class="tool-separator" role="separator" aria-orientation="vertical" />
    <button v-for="code in ['view-pages-horizontal', 'view-pages-vertical', 'view-two-pages']" :key="code" class="tool-button" :data-action="code" :title="actionDescription(code)" :aria-label="actionDescription(code)" :aria-pressed="isActionChecked(code)" :disabled="!isActionEnabled(code)" @click="triggerAction(code)"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(actionDefinition(code)?.icon ?? 0) }}</span></button>
    <ViewModeControl class-name="tool-button view-mode-button" />
    <span class="tool-separator" role="separator" aria-orientation="vertical" />
    <button v-for="code in ['zoomout']" :key="code" class="tool-button" :data-action="code" :title="actionDescription(code)" :aria-label="actionDescription(code)" :disabled="!isActionEnabled(code)" @click="triggerAction(code)"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(actionDefinition(code)?.icon ?? 0) }}</span></button>
    <select class="zoom-select" :title="qtrc('notation', 'Zoom')" :aria-label="qtrc('notation', 'Zoom')" :disabled="!view.hasScore" :value="zoomValue" @change="changeZoom">
      <option v-if="zoomValue === 'custom'" value="custom">{{ Math.round(view.zoom) }}%</option>
      <option v-for="[mode, title] in fitOptions" :key="mode" :value="mode">{{ title }}</option>
      <option v-for="level in ZOOM_LEVELS" :key="level" :value="String(level)">{{ level }}%</option>
    </select>
    <button v-for="code in ['zoomin', 'view-center-page']" :key="code" class="tool-button" :data-action="code" :title="actionDescription(code)" :aria-label="actionDescription(code)" :disabled="!isActionEnabled(code)" @click="triggerAction(code)"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(actionDefinition(code)?.icon ?? 0) }}</span></button>
    <span class="tool-separator" role="separator" aria-orientation="vertical" />
    <button v-for="code in ['print', 'fullscreen', 'view-shortcuts-help']" :key="code" class="tool-button" :class="{ 'with-title': code === 'view-shortcuts-help' }" :data-action="code" :title="actionDescription(code)" :aria-label="actionDescription(code)" :disabled="!isActionEnabled(code)" @click="triggerAction(code)"><span v-if="actionDefinition(code)?.icon" class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(actionDefinition(code)!.icon!) }}</span><span v-if="code === 'view-shortcuts-help'">{{ actionTitle(code) }}</span></button>
  </div>
</template>
