<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import { paletteProperties, setPaletteProperties, type PaletteConfig } from '../../../src/index'
import { qtrc } from '../../i18n'
import InspectorSpin from '../inspector/InspectorSpin.vue'
const props=defineProps<{id:string}>()
const emit=defineEmits<{close:[]}>()
const dialog=ref<HTMLDialogElement|null>(null)
const origin=paletteProperties(props.id)
const config=shallowRef<PaletteConfig|null>(origin ? structuredClone(origin) : null)
function set(c:PaletteConfig) {config.value=c;setPaletteProperties(props.id,c)}
function reject() {if(origin)setPaletteProperties(props.id,origin);emit('close')}
onMounted(()=>dialog.value?.showModal())
</script>
<template><dialog v-if="config" ref="dialog" class="palette-properties" aria-labelledby="palette-properties-title" @cancel.prevent="reject"><h2 id="palette-properties-title">{{ qtrc('palette','Palette properties') }}</h2><div class="palette-properties-section"><label class="palette-properties-heading" for="palette-name">{{ qtrc('palette','Name') }}</label><input id="palette-name" type="text" autofocus :value="config.name" @input="set({...config,name:($event.target as HTMLInputElement).value})" /></div><hr /><div class="palette-properties-heading">{{ qtrc('palette','Cell size') }}</div><div class="palette-properties-grid"><label v-for="entry in [{key:'width',title:'Width',step:1,min:1,max:500,decimals:0},{key:'height',title:'Height',step:1,min:1,max:500,decimals:0},{key:'elementOffset',title:'Element offset',step:0.1,min:-10,max:10,decimals:2},{key:'scale',title:'Scale',step:0.1,min:0.1,max:15,decimals:2}] as const" :key="entry.key" class="palette-property"><span>{{ qtrc('palette',entry.title) }}</span><InspectorSpin :label="qtrc('palette',entry.title)" :value="entry.key==='width' || entry.key==='height' ? config.size[entry.key] : config[entry.key]" :step="entry.step" :min="entry.min" :max="entry.max" :decimals="entry.decimals" :unit="entry.key==='elementOffset' ? qtrc('global','sp') : ''" @commit="v=>set(entry.key==='width' || entry.key==='height' ? {...config!,size:{...config!.size,[entry.key]:Math.round(v)}} : {...config!,[entry.key]:v})" /></label></div><label class="palette-properties-check"><input type="checkbox" :checked="config.showGrid" @change="set({...config,showGrid:($event.target as HTMLInputElement).checked})" />{{ qtrc('palette','Show grid') }}</label><div class="dialog-buttons"><button type="button" class="secondary" @click="reject">{{ qtrc('global','Cancel') }}</button><button type="button" class="primary" @click="emit('close')">{{ qtrc('global','OK') }}</button></div></dialog></template>
