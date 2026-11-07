<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
defineProps<{ label: string; valueLabel: string }>()
const open = ref(false)
const wrap = ref<HTMLElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)
function outside(e: PointerEvent) { if (open.value && !wrap.value?.contains(e.target as Node)) open.value = false }
document.addEventListener('pointerdown', outside)
onUnmounted(() => document.removeEventListener('pointerdown', outside))
function keydown(e: KeyboardEvent) { if (e.key === 'Escape' && open.value) { e.preventDefault(); e.stopPropagation(); open.value = false; button.value?.focus() } }
</script>
<template><div ref="wrap" class="dropdown" @keydown="keydown"><span class="field-label">{{ label }}</span><button ref="button" class="dropdown-button" :aria-expanded="open" :aria-label="`${label}: ${valueLabel}`" @click="open = !open"><span class="dropdown-value"><slot name="value" /></span><span class="chevron" aria-hidden="true"></span></button><div v-if="open" class="dropdown-panel" role="group" :aria-label="label"><slot /></div></div></template>
