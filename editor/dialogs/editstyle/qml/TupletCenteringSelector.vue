<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { qtrc, useLanguage } from '../../../i18n'
import { ICON_CODES } from '../../../actions/uiactiondata'
import type { NotationStyleLike } from './controls.vue'
defineProps<{style:NotationStyleLike}>()
useLanguage()
const tr=(s:string)=>qtrc('notation/editstyle/tupletCentering',s)
</script>
<template><div class="sd-column" style="gap:8px"><span class="sd-label">{{ tr('Number alignment') }}</span><div class="sd-flat-radio-group" role="radiogroup" :aria-label="tr('Number alignment')" style="gap:8px"><button v-for="option in [{value:false,icon:ICON_CODES.TUPLET_GRAPHICAL_CENTER,label:'Graphical center'},{value:true,icon:ICON_CODES.TUPLET_RYTHMIC_CENTER,label:'Rhythmic center'}]" :key="String(option.value)" type="button" role="radio" class="sd-flat-radio stacked" style="width:140px;height:65px;flex:none" :aria-checked="style.value('tupletNumberRythmicCenter')===option.value" @click="style.setValue('tupletNumberRythmicCenter',option.value)"><span class="sd-icon" style="font-size:32px" aria-hidden="true">{{ String.fromCodePoint(option.icon) }}</span>{{ tr(option.label) }}</button></div></div></template>
