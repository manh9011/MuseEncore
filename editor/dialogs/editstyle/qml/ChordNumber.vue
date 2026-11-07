<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { ICON_CODES } from '../../../actions/uiactiondata'
import { qtrc } from '../../../i18n'
import type { NotationStyleLike } from './controls.vue'
const props=defineProps<{styleModel:NotationStyleLike; id:string; label:string; percent?:boolean; min?:number; max?:number; step?:number; decimals?:number; disabled?:boolean; unit?:string}>()
function shown(){const n=Number(props.styleModel.value(props.id));return String(props.percent?Math.round(n*100):n)}
const text=ref(shown())
watch(()=>props.styleModel.value(props.id),()=>{text.value=shown()})
function commit(){const n=parseFloat(text.value.replace(',','.'));if(Number.isFinite(n)){const v=Math.max(props.min??0,Math.min(props.max ?? (props.percent?999:99),n));props.styleModel.setValue(props.id,props.percent?Math.round(v)/100:Number(v.toFixed(props.decimals ?? 2)))}text.value=shown()}
function step(d:number){text.value=String((parseFloat(text.value.replace(',','.'))||0)+d*(props.step??(props.percent?1:0.01)));commit()}
</script>
<template><div class="sd-spinbox" :class="{disabled}" style="width:80px"><input v-model="text" type="text" inputmode="decimal" :aria-label="label" :disabled="disabled" @blur="commit" @keydown.enter.prevent="commit" @keydown.up.prevent="step(1)" @keydown.down.prevent="step(-1)" @keydown.esc.stop="text=shown()"><span v-if="unit !== ''" class="sd-unit">{{ unit ?? (percent?'%':qtrc('global','sp')) }}</span><span class="sd-steppers"><button type="button" tabindex="-1" aria-label="+" :disabled="disabled" @mousedown.prevent @click="step(1)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_UP) }}</button><button type="button" tabindex="-1" aria-label="-" :disabled="disabled" @mousedown.prevent @click="step(-1)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_DOWN) }}</button></span></div></template>
