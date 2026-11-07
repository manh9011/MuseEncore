<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = withDefaults(defineProps<{ id?: string; label: string; value: number | null; unit?: string; disabled?: boolean; step?: number; min?: number; max?: number; decimals?: number }>(), { step: 0.5, min: -9999, max: 9999, decimals: 2 })
const emit = defineEmits<{ commit: [value: number] }>()
const format = (value: number | null) => value === null ? '' : String(Number(value.toFixed(props.decimals)))
const text = ref(format(props.value))
watch(() => props.value, value => { text.value = format(value) })
function commit() {
  const value = Number.parseFloat(text.value.replace(',', '.'))
  if (Number.isFinite(value)) emit('commit', Math.min(props.max, Math.max(props.min, value)))
  else text.value = format(props.value)
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Enter') commit()
  else if (event.key === 'Escape') text.value = format(props.value)
  else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()
    const value = Number.parseFloat(text.value.replace(',', '.'))
    text.value = format((Number.isFinite(value) ? value : 0) + (event.key === 'ArrowUp' ? props.step : -props.step))
    commit()
  }
}
</script>
<template>
  <div class="insp-spinbox" :class="{ disabled }">
    <input :id="id" v-model="text" type="text" inputmode="decimal" :aria-label="label" :placeholder="value === null ? '--' : ''" :disabled="disabled" @blur="text !== format(value) && commit()" @keydown="keydown" />
    <span v-if="unit" class="insp-unit">{{ unit }}</span>
  </div>
</template>
