<!--
  SPDX-License-Identifier: GPL-3.0-only
  Concert pitch status bar toggle button migrated from `editor/components/ConcertPitchControl.tsx`.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { actionDefinition, actionDescription, actionTitle, isActionChecked, isActionEnabled, triggerAction, useActions } from '../actions/actions'
import { stripMnemonic, useLanguage } from '../i18n'

useLanguage()
const actions = useActions()

const checked = computed(() => { void actions.value; return isActionChecked('concert-pitch') })
const enabled = computed(() => { void actions.value; return isActionEnabled('concert-pitch') })
</script>

<template>
  <button class="statusbar-button concert-pitch" role="checkbox" :aria-checked="checked" :disabled="!enabled" :title="actionDescription('concert-pitch')" @click="triggerAction('concert-pitch')">
    <span class="statusbar-checkbox" aria-hidden="true" />
    <span v-if="actionDefinition('concert-pitch')?.icon" class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(actionDefinition('concert-pitch')!.icon!) }}</span>
    <span>{{ stripMnemonic(actionTitle('concert-pitch')) }}</span>
  </button>
</template>
