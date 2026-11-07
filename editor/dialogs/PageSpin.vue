<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import type { PageSettings, PageSettingsSpinBox } from '../../src/index'
import { qtrc } from '../i18n'
const props=defineProps<{name:PageSettingsSpinBox; ps:PageSettings; label:string; revision:number}>()
const emit=defineEmits<{changed:[]}>()
const sb=computed(()=>{void props.revision;return props.ps.values().spinBoxes[props.name]})
const shown=computed(()=>sb.value.value.toFixed(sb.value.decimals))
const suffix=computed(()=>props.ps.values().unitSuffix==='mm'?qtrc('global','mm'):qtrc('global','in','abbreviation of inch'))
const text=ref(shown.value)
watch(shown,v=>text.value=v)
let timer:ReturnType<typeof setTimeout>|undefined
onUnmounted(()=>clearTimeout(timer))
function commit(value:string){clearTimeout(timer);const n=parseFloat(value.replace(',','.'));if(Number.isFinite(n)){props.ps.spinBoxChanged(props.name,n);emit('changed');text.value=props.ps.values().spinBoxes[props.name].value.toFixed(sb.value.decimals)}else text.value=shown.value}
function input(event:Event){text.value=(event.target as HTMLInputElement).value;clearTimeout(timer);const value=text.value;timer=setTimeout(()=>commit(value),600)}
function key(event:KeyboardEvent){if(event.key==='Enter'){event.preventDefault();commit(text.value)}else if(event.key==='ArrowUp'||event.key==='ArrowDown'){event.preventDefault();commit((sb.value.value+(event.key==='ArrowUp'?1:-1)*sb.value.singleStep).toFixed(sb.value.decimals))}else if(event.key==='Escape')text.value=shown.value}
</script>
<template><span class="page-spin" :class="{disabled:!sb.enabled}"><input type="text" inputmode="decimal" :value="text" :aria-label="label" :disabled="!sb.enabled" :data-name="name" @input="input" @blur="text!==shown && commit(text)" @keydown="key" /><span class="page-spin-suffix">{{ suffix }}</span></span></template>
