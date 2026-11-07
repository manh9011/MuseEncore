<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { ref } from 'vue'
import { actionDefinition, actionDescription, actionTitle, isActionChecked, isActionEnabled, isCheckable, shortcutText, triggerAction, useActions } from '../actions/actions'
import { qtrc, stripMnemonic, useLanguage } from '../i18n'
import MenuPopup from '../components/MenuPopup.vue'
import type { MenuItem } from '../menus/appmenu'
const props=defineProps<{code:string; menu?:MenuItem[]; showTitle?:boolean; bold?:boolean}>()
const actions = useActions();useLanguage()
const button=ref<HTMLButtonElement|null>(null),open=ref(false)
function click(){if(props.menu && !isActionEnabled(props.code))open.value=!open.value;else triggerAction(props.code)}
function close(focus:boolean){open.value=false;if(focus)button.value?.focus()}
</script>
<template><button ref="button" :data-action-version="actions" type="button" :data-action="code" class="tool-button" :class="{'with-title':showTitle || !actionDefinition(code)?.icon,bold}" :title="shortcutText(code) ? `${actionDescription(code)} (${shortcutText(code)})` : actionDescription(code)" :aria-label="actionDescription(code)" :disabled="!isActionEnabled(code) && !menu?.length" :aria-pressed="actionDefinition(code)?.checkable || isCheckable(code) ? isActionChecked(code) : undefined" :aria-haspopup="menu ? 'menu' : undefined" :aria-expanded="menu ? open : undefined" @click="click"><span v-if="actionDefinition(code)?.icon" class="tool-icon" aria-hidden="true">{{String.fromCodePoint(actionDefinition(code)!.icon!)}}</span><span v-if="showTitle || !actionDefinition(code)?.icon" class="tool-title">{{stripMnemonic(actionTitle(code))}}</span></button><button v-if="menu" type="button" class="tool-button menu-arrow-button" :aria-label="`${actionDescription(code)}: ${qtrc('global','Menu')}`" :disabled="!menu.length" @click="open=!open"><span class="tool-icon small" aria-hidden="true"></span></button><MenuPopup v-if="menu && open && button" :items="menu" :anchor="button.getBoundingClientRect()" placement="below" :label="actionDescription(code)" @close="close" /></template>
