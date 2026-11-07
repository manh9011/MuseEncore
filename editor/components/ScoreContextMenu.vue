<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed } from 'vue'
import MenuPopup from './MenuPopup.vue'
import { contextMenuState } from './scorecontextmenustate'
const anchor = computed(() => new DOMRect(contextMenuState.value?.x ?? 0, contextMenuState.value?.y ?? 0, 0, 0))
function close(focus: boolean) { contextMenuState.value = null; if (focus) document.getElementById('viewport')?.focus({ preventScroll: true }) }
</script>
<template>
  <MenuPopup v-if="contextMenuState" :items="contextMenuState.items" :anchor="anchor" placement="below" label="Context menu" @close="close" />
</template>
