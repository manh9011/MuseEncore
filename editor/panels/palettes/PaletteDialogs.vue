<!--
  SPDX-License-Identifier: GPL-3.0-only
  Palette properties & custom palette creation dialogs migrated from `PaletteDialogs.tsx`.
-->
<script setup lang="ts">
import { ref } from 'vue'
import { qtrc, useLanguage } from '../../i18n'

const props = defineProps<{
  initialName?: string
  title?: string
}>()

const emit = defineEmits<{
  (e: 'save', name: string): void
  (e: 'close'): void
}>()

useLanguage()
const open = ref(true)
const name = ref(props.initialName ?? '')

function save() {
  open.value = false
  emit('save', name.value)
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="props.title || qtrc('palette', 'Palette properties')"
    @update:open="(v: boolean) => !v && emit('close')"
  >
    <template #body>
      <UFormField :label="qtrc('palette', 'Name')">
        <UInput v-model="name" class="w-full" />
      </UFormField>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="outline" :label="qtrc('global', 'Cancel')" @click="emit('close')" />
        <UButton color="primary" :label="qtrc('global', 'OK')" @click="save" />
      </div>
    </template>
  </UModal>
</template>
