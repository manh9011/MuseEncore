<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
defineProps<{text:string;buttons:{value:string;label:string;primary?:boolean}[]}>()
const emit=defineEmits<{answer:[value:string]}>()
const dialog=ref<HTMLDialogElement|null>(null)
onMounted(()=>dialog.value?.showModal())
</script>
<template><dialog ref="dialog" class="confirm palette-question" aria-describedby="palette-question-text" @cancel.prevent="emit('answer','')"><p id="palette-question-text">{{ text }}</p><div class="dialog-buttons"><button v-for="button in buttons" :key="button.value" type="button" :class="button.primary?'primary':'secondary'" :autofocus="button.primary" :data-value="button.value" @click="emit('answer',button.value)">{{ button.label }}</button></div></dialog></template>
