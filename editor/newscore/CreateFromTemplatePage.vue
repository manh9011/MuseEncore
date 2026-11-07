<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { drawPage, layoutScore, loadTemplate as loadTemplateScore, pageCount, pageSize, type MasterScore } from '../../src/index'
import { qtrc, useLanguage } from '../i18n'
import { fontsReady } from '../scoreview'
import { loadTemplate, templateCategories, type TemplateInfo } from '../templates'

const props = defineProps<{ template: TemplateInfo | null }>()
const emit = defineEmits<{ (e: 'update:template', t: TemplateInfo): void }>()
useLanguage()
const category = ref(props.template?.category ?? templateCategories[0]?.title ?? '')
const templates = computed(() => templateCategories.find(c => c.title === category.value)?.templates ?? [])
const box = ref<HTMLDivElement | null>(null)
const score = shallowRef<MasterScore | null>(null)
const error = ref<string | null>(null)
const width = ref(0)
const canvases = ref<HTMLCanvasElement[]>([])
const previews = new Map<string, Promise<MasterScore>>()
let observer: ResizeObserver | undefined
let generation = 0
function selectCategory(title: string) {
  category.value = title
  const first = templates.value[0]
  if (first) emit('update:template', first)
}
watch(templates, items => { if (!props.template && items.length) emit('update:template', items[0]) }, { immediate: true })
watch(() => props.template?.path, async path => {
  const current = ++generation
  score.value = null
  error.value = null
  if (!path) return
  try {
    let pending = previews.get(path)
    if (!pending) {
      pending = Promise.all([loadTemplate(path), fontsReady]).then(([t]) => { const s = loadTemplateScore(t.mscx, t.style); layoutScore(s); return s })
      previews.set(path, pending)
    }
    const loaded = await pending
    if (current === generation) score.value = loaded
  } catch (e) { if (current === generation) error.value = e instanceof Error ? e.message : String(e) }
}, { immediate: true })
function draw() {
  if (!score.value || width.value <= 0) return
  canvases.value.forEach((canvas, i) => {
    const size = pageSize(score.value!, i), dpi = Math.max(1, width.value - 32) / size.width
    canvas.style.width = `${size.width * dpi}px`
    canvas.style.height = `${size.height * dpi}px`
    canvas.width = Math.round(size.width * dpi * window.devicePixelRatio)
    canvas.height = Math.round(size.height * dpi * window.devicePixelRatio)
    drawPage(score.value!, i, canvas.getContext('2d')!, { dpi: dpi * window.devicePixelRatio })
  })
}
watch([score, width], async () => { await nextTick(); draw() })
watch(box, el => { observer?.disconnect(); if (el) { observer = new ResizeObserver(() => { width.value = el.clientWidth }); observer.observe(el) } })
onMounted(() => { if (box.value) { observer = new ResizeObserver(() => { width.value = box.value?.clientWidth ?? 0 }); observer.observe(box.value) } })
onUnmounted(() => { generation++; observer?.disconnect() })
</script>
<template>
  <div class="choose-template">
    <section class="column" aria-labelledby="category-title"><h3 id="category-title">{{ qtrc('project/newscore', 'Category') }}</h3><ul class="list" role="listbox" :aria-label="qtrc('project/newscore', 'Category')"><li v-for="c in templateCategories" :key="c.title" role="option" :aria-selected="c.title === category" tabindex="0" @click="selectCategory(c.title)" @keydown.enter.prevent="selectCategory(c.title)" @keydown.space.prevent="selectCategory(c.title)">{{ qtrc('project/templatecategory', c.title) }}</li></ul></section>
    <section class="column" aria-labelledby="template-title"><h3 id="template-title">{{ qtrc('project/newscore', 'Template') }}</h3><ul class="list" role="listbox" :aria-label="qtrc('project/newscore', 'Template')"><li v-for="t in templates" :key="t.path" role="option" :aria-selected="t.path === props.template?.path" tabindex="0" @click="emit('update:template', t)" @keydown.enter.prevent="emit('update:template', t)" @keydown.space.prevent="emit('update:template', t)">{{ qtrc('project/template', t.title) }}</li></ul></section>
    <section class="column preview-column" :aria-label="qtrc('project/newscore', 'Preview')"><div v-if="props.template" ref="box" class="template-preview" role="img" :aria-label="qtrc('project/template', props.template.title)"><p v-if="error" class="muted">Could not show the template: {{ error }}</p><template v-else-if="score && width > 0"><canvas v-for="i in pageCount(score)" :key="i" :ref="el => { if (el) canvases[i - 1] = el as HTMLCanvasElement }" class="preview-page" /></template><div v-else-if="!score" class="spinner small" aria-hidden="true" /></div></section>
  </div>
</template>
