<!--
  SPDX-License-Identifier: GPL-3.0-only
  Score Display & Score Appearance inspector sections migrated from `ScoreSections.tsx`.
-->
<script setup lang="ts">
import { isActionChecked, isActionEnabled, triggerAction, useActions } from '../../actions/actions'
import { qtrc, useLanguage } from '../../i18n'
import { openEditStyleDialog } from '../../dialogs/EditStyleDialog.vue'
import { openPageSettingsDialog } from '../../dialogs/PageSettingsDialog.vue'
import { inspectorPropertyChanges, inspectorPropertyResets } from '../../../src/index'
import { currentScore, useScoreView } from '../../scoreview'
import { applyInspectorChanges, scoreChanged } from '../editbridge'
import { Sid } from '../../../src/engraving/style/styledef'

defineProps<{
  mode: 'score-display' | 'score-appearance'
}>()

useLanguage()
useActions()
const view = useScoreView()

function setHideEmptyStaves(value: boolean) {
  const score = currentScore()
  if (!score) return
  const changes = inspectorPropertyChanges(score, { section: 'SECTION_SCORE_APPEARANCE', path: [], property: 'hideEmptyStaves' }, value)
  if (applyInspectorChanges(score, changes)) scoreChanged()
}

function resetHideEmptyStaves() {
  const score = currentScore()
  if (!score) return
  const changes = inspectorPropertyResets(score, { section: 'SECTION_SCORE_APPEARANCE', path: [], property: 'hideEmptyStaves' })
  if (applyInspectorChanges(score, changes)) scoreChanged()
}

const DISPLAY_ACTIONS = [
  'show-invisible',
  'show-unprintable',
  'show-frames',
  'show-pageborders',
  'show-soundflags',
] as const
</script>

<template>
  <div v-if="mode === 'score-display'" class="insp-grid2">
    <label v-for="code in DISPLAY_ACTIONS" :key="code" class="insp-checkbox" :class="{ disabled: !isActionEnabled(code) }" :title="code === 'show-invisible' ? qtrc('inspector', 'Invisible elements') : undefined">
      <input type="checkbox" :checked="isActionChecked(code)" :disabled="!isActionEnabled(code)" @change="triggerAction(code)" />
      <span>{{ code === 'show-invisible' ? qtrc('inspector', 'Invisible') : code === 'show-unprintable' ? qtrc('inspector', 'Formatting') : code === 'show-frames' ? qtrc('inspector', 'Frames') : code === 'show-pageborders' ? qtrc('inspector', 'Page margins') : qtrc('inspector', 'Sound flags') }}</span>
    </label>
  </div>

  <div v-else class="insp-column">
    <div :key="view.scoreVersion" class="insp-row">
      <label class="insp-checkbox" :class="{ disabled: !currentScore() }"><input type="checkbox" :checked="currentScore()?.style().styleB(Sid.hideEmptyStaves) ?? false" :disabled="!currentScore()" @change="setHideEmptyStaves(($event.target as HTMLInputElement).checked)" /><span>{{ qtrc('inspector', 'Automatically hide all empty staves') }}</span></label>
      <button v-if="currentScore() && !currentScore()!.style().isDefault(Sid.hideEmptyStaves)" class="insp-reset" :aria-label="qtrc('inspector', 'Reset property to default value')" @click="resetHideEmptyStaves">↶</button>
    </div>
    <div class="insp-grid2">
      <button class="insp-flat-button" :disabled="!isActionEnabled('page-settings')" @click="openPageSettingsDialog()">{{ qtrc('inspector', 'Page settings') }}</button>
      <button class="insp-flat-button" :disabled="!isActionEnabled('edit-style')" @click="openEditStyleDialog()">{{ qtrc('inspector', 'Style settings') }}</button>
    </div>
  </div>
</template>
