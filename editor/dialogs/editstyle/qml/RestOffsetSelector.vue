<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { qtrc, useLanguage } from '../../../i18n'
import type { NotationStyleLike } from './controls.vue'
defineProps<{style:NotationStyleLike}>()
useLanguage()
</script>
<template><div class="sd-column" style="gap:12px"><div class="sd-flat-radio-group" role="radiogroup" style="gap:4px"><button v-for="option in [{value:false,label:'1 space'},{value:true,label:'2 spaces'}]" :key="String(option.value)" type="button" role="radio" class="sd-flat-radio" style="width:106px;height:30px;flex:none" :aria-checked="style.value('multiVoiceRestTwoSpaceOffset')===option.value" @click="style.setValue('multiVoiceRestTwoSpaceOffset',option.value)">{{ qtrc('notation',option.label) }}</button></div><label class="sd-checkbox"><input type="checkbox" :checked="style.value('mergeMatchingRests')" @change="style.setValue('mergeMatchingRests',($event.target as HTMLInputElement).checked)">{{ qtrc('notation','Merge matching rests') }}</label></div></template>
