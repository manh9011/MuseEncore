<!--
  SPDX-License-Identifier: GPL-3.0-only
  Standalone Viewer Root Application using Nuxt UI `<UApp>` and `<MuseEncoreViewer>`.
-->
<script setup lang="ts">
import { computed } from 'vue'
import MuseEncoreViewer from './components/MuseEncoreViewer.vue'

const initialUrl = computed(() => {
  if (typeof window === 'undefined') return undefined
  return new URLSearchParams(window.location.search).get('url') ?? undefined
})
</script>

<template>
  <UApp>
    <div class="h-screen w-screen overflow-hidden">
      <MuseEncoreViewer :url="initialUrl" />
    </div>
  </UApp>
</template>
