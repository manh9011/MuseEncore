<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { qtrc, useLanguage } from '../../../i18n'
import { ICON_CODES } from '../../../actions/uiactiondata'
import type { NotationStyleLike } from './controls.vue'
defineProps<{style:NotationStyleLike}>()
useLanguage()
</script>
<template><div class="sd-flat-radio-group" role="radiogroup" style="gap:12px"><button v-for="option in [{value:false,icon:ICON_CODES.NOTEFLAGS_TRADITIONAL,label:'Traditional'},{value:true,icon:ICON_CODES.NOTEFLAGS_STRAIGHT,label:'Straight'}]" :key="String(option.value)" type="button" role="radio" class="sd-flat-radio stacked" style="width:106px;height:70px;flex:none" :aria-checked="style.value('useStraightNoteFlags')===option.value" @click="style.setValue('useStraightNoteFlags',option.value)"><span class="sd-icon" style="font-size:32px" aria-hidden="true">{{ String.fromCodePoint(option.icon) }}</span>{{ qtrc('notation',option.label) }}</button></div></template>
