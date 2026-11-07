<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed, ref } from 'vue'
const props=defineProps<{name:string;value:number;min:number;max:number;step:number;decimals:number;disabled:boolean;suffix?:string;title?:string}>()
const emit=defineEmits<{commit:[value:number]}>()
const text=ref<string|null>(null)
const shown=computed(()=>text.value??props.value.toFixed(props.decimals))
function commit(value:string){const n=Number(value.replace(',','.'));if(value.trim()!==''&&Number.isFinite(n))emit('commit',Math.max(props.min,Math.min(props.max,n)));text.value=null}
function input(event:Event){const target=event.target as HTMLInputElement;if(!(event as InputEvent).inputType)commit(target.value);else text.value=target.value}
function key(event:KeyboardEvent){if(event.key==='Enter'){event.preventDefault();if(text.value!==null)commit(text.value)}else if(event.key==='Escape'&&text.value!==null){event.stopPropagation();text.value=null}}
</script>
<template><span class="es-spin"><input type="number" :data-name="name" :value="shown" :min="min" :max="max" :step="step" :disabled="disabled" :title="title" :aria-label="title ?? name" @input="input" @blur="text!==null && commit(text)" @keydown="key" /><span v-if="suffix" class="es-suffix">{{suffix}}</span></span></template>
