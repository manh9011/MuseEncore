<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { qtrc, useLanguage } from '../../../i18n'
import { ICON_CODES } from '../../../actions/uiactiondata'
import LineStyleNative from './LineStyleNative.vue'
import type { NotationStyleLike } from './controls.vue'
const props=defineProps<{style:NotationStyleLike; goToTextStylePage?: (code:string)=>void}>()
useLanguage()
const text=ref(String(props.style.value('glissandoText') ?? ''))
watch(()=>props.style.value('glissandoText'),v=>text.value=String(v ?? ''))
function commit(){props.style.setValue('glissandoText',text.value)}
</script>
<template><div class="sd-column" style="gap:12px">
<div class="sd-row sd-control-row" style="gap:8px"><div class="sd-row-label" style="width:120px"><span class="sd-label">{{ qtrc('notation','Line type:') }}</span></div><div class="sd-row-control" style="width:326px"><div class="sd-flat-radio-group" role="radiogroup" :aria-label="qtrc('notation','Line type:')" style="gap:4px"><button v-for="(label,i) in ['Straight','Wavy']" :key="label" type="button" role="radio" class="sd-flat-radio" :aria-checked="style.value('glissandoType')===i" @click="style.setValue('glissandoType',i)">{{ qtrc('notation',label) }}</button></div></div><button type="button" class="sd-flat-button icon-only" :disabled="style.isDefault?.('glissandoType')" :aria-label="qtrc('global','Reset')" @click="style.resetValue?.('glissandoType')"><span class="sd-icon">{{ String.fromCodePoint(ICON_CODES.UNDO) }}</span></button></div>
<LineStyleNative :style="style" prefix="glissando"/>
<div class="sd-row sd-control-row" style="gap:8px"><div class="sd-row-label" style="width:120px"><label class="sd-checkbox"><input type="checkbox" :checked="style.value('glissandoShowText')" @change="style.setValue('glissandoShowText',($event.target as HTMLInputElement).checked)">{{ qtrc('notation','Show text:') }}</label></div><div class="sd-row-control" style="width:326px"><input v-model="text" class="sd-text" style="width:138px" type="text" @blur="commit" @keydown.enter.prevent="commit"></div><button type="button" class="sd-flat-button icon-only" :disabled="style.isDefault?.('glissandoText')" :aria-label="qtrc('global','Reset')" @click="style.resetValue?.('glissandoText')"><span class="sd-icon">{{ String.fromCodePoint(ICON_CODES.UNDO) }}</span></button></div>
<div><button type="button" class="sd-flat-button" @click="goToTextStylePage?.('glissando')">{{ qtrc('notation','Edit glissando text style') }}</button></div>
</div></template>
