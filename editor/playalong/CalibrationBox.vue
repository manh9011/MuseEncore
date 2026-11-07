<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { arg, qtrc, useLanguage, webtr } from '../i18n'
import type { CalibrationKind } from '../../shared/notedetection/calibration'
import { finishCalibration, repeatCalibration, skipCalibrationStep, usePlayalongState } from './playalongcontroller'

useLanguage()
const state = usePlayalongState()
function stepText(kind: CalibrationKind): string {
  switch (kind) {
    case 'silence': return webtr('Please be quiet for a few seconds.')
    case 'loud': return webtr('Play the highlighted note loudly and let it sound.')
    case 'octave': return webtr('Play the highlighted octave and let it sound.')
    case 'soft': return webtr('Play the highlighted note softly.')
  }
}
</script>

<template>
  <div v-if="state.active && state.mode === 'calibration' && state.calibration" class="calibration-box" role="dialog" aria-modal="false" :aria-label="webtr('Calibrate the note detection')">
    <h3>{{ webtr('Calibrate the note detection') }}</h3>
    <div aria-live="polite">
      <p v-if="state.status === 'loading'">{{ webtr('Starting the note detection…') }}</p>
      <template v-else-if="state.calibration.result">
        <p>{{ arg(webtr('Done: %1 of %2 steps were recognized.'), String(state.calibration.result.recognized), String(state.calibration.result.steps)) }}</p>
        <p>{{ webtr('Use the measured values for the note detection? The overtone filter is then set to “Calibrated”.') }}</p>
      </template>
      <template v-else>
        <p class="calibration-progress">{{ arg(webtr('Step %1 of %2'), String(state.calibration.step + 1), String(state.calibration.steps)) }}</p>
        <p v-if="state.calibration.kind">{{ stepText(state.calibration.kind) }}</p>
      </template>
    </div>
    <div class="calibration-buttons">
      <button v-if="state.status !== 'loading' && state.calibration.result" class="secondary" @click="repeatCalibration">{{ webtr('Repeat') }}</button>
      <button class="secondary" @click="finishCalibration(false)">{{ qtrc('global', 'Cancel') }}</button>
      <button v-if="state.status !== 'loading' && state.calibration.result" class="primary" autofocus @click="finishCalibration(true)">{{ webtr('Use these values') }}</button>
      <button v-else-if="state.status !== 'loading' && state.calibration.kind !== 'silence'" class="secondary" @click="skipCalibrationStep">{{ qtrc('project/export', 'Skip') }}</button>
    </div>
  </div>
</template>
