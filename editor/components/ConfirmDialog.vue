<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { qtrc } from '../i18n'

defineProps<{ title: string; message: string; confirmLabel?: string }>()
const emit = defineEmits<{ close: [confirmed: boolean] }>()
const dialog = ref<HTMLDialogElement | null>(null)
onMounted(() => dialog.value?.showModal())
</script>
<template>
  <dialog ref="dialog" class="confirm" aria-labelledby="confirm-title" @close="emit('close', dialog?.returnValue === 'ok')">
    <h2 id="confirm-title">{{ title }}</h2>
    <p>{{ message }}</p>
    <form method="dialog" class="dialog-buttons">
      <button class="secondary" value="cancel" autofocus>{{ qtrc('global', 'Cancel') }}</button>
      <button class="primary danger" value="ok">{{ confirmLabel || qtrc('global', 'OK') }}</button>
    </form>
  </dialog>
</template>
