<!--
  SPDX-License-Identifier: GPL-3.0-only
  Score view mode switcher (Page View / Continuous Horizontal / Continuous Vertical)
  migrated from `editor/components/ViewModeControl.tsx` to Vue 3 + Nuxt UI.
-->
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import MenuPopup from './MenuPopup.vue'
import { VIEW_MODE_ACTIONS } from '../actions/appactions'
import type { MenuItem } from '../menus/appmenu'
import { actionDefinition, actionDescription, actionTitle, isActionChecked, useActions } from '../actions/actions'
import { qtrc, stripMnemonic, useLanguage } from '../i18n'
import { ICON_CODES } from '../actions/uiactiondata'
import { useScoreView } from '../scoreview'

withDefaults(defineProps<{ className?: string; placement?: 'below' | 'right' }>(), { className: 'statusbar-button', placement: 'below' })
useLanguage()
const actions = useActions()
const view = useScoreView()

const button = ref<HTMLButtonElement | null>(null)
const menu = ref<DOMRect | null>(null)
const items: MenuItem[] = [...VIEW_MODE_ACTIONS.map(([code]): MenuItem => ({ kind: 'action', code })), { kind: 'action', code: 'view-mode-fit-width' }]

const activeAction = computed(
  () => { void actions.value; return [...VIEW_MODE_ACTIONS.map(([code]) => code), 'view-mode-fit-width'].find(code => isActionChecked(code)) ?? 'view-mode-page' },
)

const activeLabel = computed(() => view.viewMode === 'continuous-horizontal' || view.viewMode === 'continuous-vertical' ? qtrc('notation', 'Continuous view') : stripMnemonic(actionTitle(activeAction.value)))

function close(focus: boolean) { menu.value = null; if (focus) void nextTick(() => button.value?.focus()) }
</script>

<template>
    <button ref="button" :class="className" aria-haspopup="menu" :aria-expanded="!!menu" :title="actionDescription(activeAction)" @click="menu = menu ? null : button!.getBoundingClientRect()">
      <span v-if="actionDefinition(activeAction)?.icon" class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(actionDefinition(activeAction)!.icon!) }}</span>
      <span>{{ activeLabel }}</span><span class="tool-icon small" aria-hidden="true">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_DOWN) }}</span>
    </button>
  <MenuPopup v-if="menu" :items="items" :anchor="menu" :placement="placement" :label="activeLabel" @close="close" />
</template>
