<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import { paletteCellProperties, setPaletteCellProperties, type PaletteCellConfig } from '../../../src/index'
import { qtrc } from '../../i18n'
import InspectorSpin from '../inspector/InspectorSpin.vue'
const props = defineProps<{ id: string }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const origin = paletteCellProperties(props.id)
const config = shallowRef<PaletteCellConfig | null>(origin ? structuredClone(origin) : null)
function set(value: PaletteCellConfig) { config.value = value; setPaletteCellProperties(props.id, value) }
function reject() { if (origin) setPaletteCellProperties(props.id, origin); emit('close') }
onMounted(() => dialog.value?.showModal())
</script>
<template>
  <dialog v-if="config" ref="dialog" class="palette-properties" aria-labelledby="palette-cell-properties-title" @cancel.prevent="reject">
    <h2 id="palette-cell-properties-title">{{ qtrc('palette', 'Palette cell properties') }}</h2>
    <div class="palette-properties-section"><label class="palette-properties-heading" for="palette-cell-name">{{ qtrc('palette', 'Name') }}</label><input id="palette-cell-name" type="text" autofocus :value="config.name" @input="set({ ...config, name: ($event.target as HTMLInputElement).value })" /></div>
    <hr /><div class="palette-properties-heading">{{ qtrc('palette', 'Content offset') }}</div>
    <div class="palette-properties-grid"><label v-for="entry in [{ key:'xOffset', title:'X', step:1, min:-10, max:10 }, { key:'yOffset', title:'Y', step:1, min:-10, max:10 }, { key:'scale', title:'Content scale', step:0.1, min:0.1, max:10 }] as const" :key="entry.key" class="palette-property"><span>{{ qtrc('palette', entry.title) }}</span><InspectorSpin :label="qtrc('palette', entry.title)" :value="config[entry.key]" :step="entry.step" :min="entry.min" :max="entry.max" :unit="entry.key === 'scale' ? '' : qtrc('global', 'sp')" @commit="v => set({ ...config!, [entry.key]: v })" /></label></div>
    <label class="palette-properties-check"><input type="checkbox" :checked="config.drawStaff" @change="set({ ...config, drawStaff: ($event.target as HTMLInputElement).checked })" />{{ qtrc('palette', 'Draw staff') }}</label>
    <div class="dialog-buttons"><button type="button" class="secondary" @click="reject">{{ qtrc('global', 'Cancel') }}</button><button type="button" class="primary" @click="emit('close')">{{ qtrc('global', 'OK') }}</button></div>
  </dialog>
</template>
