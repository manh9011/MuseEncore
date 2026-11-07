<!--
  SPDX-License-Identifier: GPL-3.0-only
  Vue 3 + Nuxt UI Wrapper Component around `MuseEncoreViewer` (`viewer/src/museencoreviewer.ts`).
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MuseEncoreViewer } from '../src/museencoreviewer'

const props = withDefaults(
  defineProps<{
    url?: string
    scoreData?: ArrayBuffer | Uint8Array
    layoutMode?: 'page' | 'continuous'
    initialZoom?: number
  }>(),
  {
    layoutMode: 'page',
    initialZoom: 100,
  },
)

const containerRef = ref<HTMLDivElement | null>(null)
const isPlaying = ref(false)
const zoom = ref(props.initialZoom)
const mode = ref<'page' | 'continuous'>(props.layoutMode)
const fileTitle = ref('MuseEncore Score Viewer')

let viewerInstance: MuseEncoreViewer | null = null

onMounted(async () => {
  if (!containerRef.value) return
  viewerInstance = new MuseEncoreViewer(containerRef.value)
  viewerInstance.setContinuousView(mode.value === 'continuous' ? 'vertical' : false)
  viewerInstance.setZoom(zoom.value)
  if (props.url) {
    await viewerInstance.load(props.url)
  } else if (props.scoreData) {
    await viewerInstance.load(props.scoreData)
  }
})

onBeforeUnmount(() => {
  viewerInstance?.destroy?.()
  viewerInstance = null
})

watch(
  () => props.url,
  async (nextUrl) => {
    if (nextUrl && viewerInstance) {
      await viewerInstance.load(nextUrl)
    }
  },
)

function togglePlay() {
  if (!viewerInstance) return
  if (isPlaying.value) {
    viewerInstance.pause?.()
    isPlaying.value = false
  } else {
    void viewerInstance.play?.()
    isPlaying.value = true
  }
}

function stopPlayback() {
  viewerInstance?.stop?.()
  isPlaying.value = false
}

function changeZoom(delta: number) {
  zoom.value = Math.max(25, Math.min(400, zoom.value + delta))
  viewerInstance?.setZoom(zoom.value)
}

function toggleLayoutMode() {
  mode.value = mode.value === 'page' ? 'continuous' : 'page'
  viewerInstance?.setContinuousView(mode.value === 'continuous' ? 'vertical' : false)
}

async function onDropFile(e: DragEvent) {
  e.preventDefault()
  const file = e.dataTransfer?.files?.[0]
  if (!file || !viewerInstance) return
  fileTitle.value = file.name
  const buf = await file.arrayBuffer()
  await viewerInstance.load(buf, file.name)
}
</script>

<template>
  <div
    class="muse-encore-viewer-vue flex flex-col h-full w-full bg-default text-default overflow-hidden"
    @dragover.prevent
    @drop="onDropFile"
  >
    <header class="flex items-center justify-between px-3 py-1.5 border-b border-default bg-elevated shrink-0">
      <div class="flex items-center gap-2 min-w-0">
        <UIcon name="i-lucide-music" class="size-4 text-primary shrink-0" />
        <span class="text-sm font-medium truncate">{{ fileTitle }}</span>
      </div>

      <div class="flex items-center gap-1.5">
        <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-square" title="Stop" @click="stopPlayback" />
        <UButton
          size="xs"
          :color="isPlaying ? 'primary' : 'neutral'"
          :variant="isPlaying ? 'solid' : 'outline'"
          :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
          :label="isPlaying ? 'Pause' : 'Play'"
          @click="togglePlay"
        />

        <div class="h-4 w-px bg-border mx-1" />

        <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-zoom-out" @click="changeZoom(-25)" />
        <span class="text-xs font-mono w-12 text-center">{{ zoom }}%</span>
        <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-zoom-in" @click="changeZoom(25)" />

        <UButton
          size="xs"
          color="neutral"
          variant="outline"
          icon="i-lucide-book-open"
          :label="mode === 'page' ? 'Page View' : 'Continuous'"
          @click="toggleLayoutMode"
        />
      </div>
    </header>

    <div ref="containerRef" class="flex-1 min-h-0 overflow-auto relative bg-muted/30" />
  </div>
</template>
