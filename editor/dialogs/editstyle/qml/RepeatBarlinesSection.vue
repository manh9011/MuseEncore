<!--
  SPDX-License-Identifier: GPL-3.0-only
  RepeatBarlinesSection (Repeat Barlines) migrated from `editor/dialogs/editstyle/qml/RepeatBarlinesSection.tsx`
  to Vue 3 + Nuxt UI.
-->
<script setup lang="ts">
import { qtrc, useLanguage } from '../../../i18n'
import {
  GroupBox,
  LineStyleSection,
  RadioButtonSelectorWithReset,
  StyleSpinboxWithReset,
  StyleToggle,
  TextFieldWithReset,
  type NotationStyleLike,
} from './controls.vue'

defineProps<{
  score?: any
  style: NotationStyleLike
  goToTextStylePage?: (codeOrIndex: string | number) => void
}>()

useLanguage()
</script>

<template>
  <div class="qml-style-page space-y-3">
    <GroupBox :title="qtrc('editstyle', 'Barlines before signature changes')">
      <StyleToggle :style-model="style" sid="barlineBeforeSigChange" :label="qtrc('notation/editstyle/barlines', 'Show barline before key and time signature changes')" />
      <fieldset :disabled="!style.value('barlineBeforeSigChange')">
        <StyleToggle :style-model="style" sid="doubleBarlineBeforeKeySig" :label="qtrc('notation/editstyle/barlines', 'Use double barline before key signatures')" />
        <StyleToggle :style-model="style" sid="doubleBarlineBeforeTimeSig" :label="qtrc('notation/editstyle/barlines', 'Use double barline before time signatures')" />
      </fieldset>
    </GroupBox>
  </div>
</template>
