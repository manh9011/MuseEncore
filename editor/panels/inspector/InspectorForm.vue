<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
const collapsedSections = new Set<string>()
</script>
<script setup lang="ts">
import { computed, ref } from 'vue'
import './inspector.css'
import { inspectorSections } from '../../../src/index'
import { canChangeProperties } from '../editbridge'
import { ICON_CODES } from '../../actions/uiactiondata'
import { currentScore, useScoreView } from '../../scoreview'
import InspectorModel from './InspectorModel.vue'
import MeasuresSection from './MeasuresSection.vue'
import ScoreSections from './ScoreSections.vue'
import NotationSection from './NotationSection.vue'
import TextSection from './TextSection.vue'
const view = useScoreView()
const collapsed = ref(new Set(collapsedSections))
function toggle(section: string) {
  const next = new Set(collapsed.value)
  next.has(section) ? next.delete(section) : next.add(section)
  collapsed.value = next
  collapsedSections.clear()
  next.forEach(sectionType => collapsedSections.add(sectionType))
}
const sections = computed(() => {
  void view.selectionVersion
  void view.scoreVersion
  return inspectorSections(view.hasScore ? currentScore() : null)
})
</script>
<template>
  <div :class="['inspector-form inspector', { readonly: !canChangeProperties(view.hasScore ? currentScore() : null) }]">
    <section v-for="item in sections" :key="item.sectionType" class="insp-section" :data-section="item.sectionType" :aria-label="item.title">
      <button type="button" class="insp-section-header" :aria-expanded="!collapsed.has(item.sectionType)" :aria-controls="`inspector-${item.sectionType}`" @click="toggle(item.sectionType)">
        <span class="insp-arrow" :class="{ collapsed: collapsed.has(item.sectionType) }" aria-hidden="true">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_DOWN) }}</span>
        <span class="insp-section-title">{{ item.title }}</span>
      </button>
      <div v-if="!collapsed.has(item.sectionType)" :id="`inspector-${item.sectionType}`" class="insp-section-content">
        <NotationSection v-if="item.sectionType === 'SECTION_NOTATION'" :model="item" />
        <TextSection v-else-if="item.sectionType === 'SECTION_TEXT'" :model="item" />
        <MeasuresSection v-else-if="item.sectionType === 'SECTION_MEASURES'" :model="item" />
        <ScoreSections v-else-if="item.sectionType === 'SECTION_SCORE_DISPLAY'" mode="score-display" />
        <ScoreSections v-else-if="item.sectionType === 'SECTION_SCORE_APPEARANCE'" mode="score-appearance" />
        <InspectorModel v-else :model="item" :section="item.sectionType" :path="[]" />
      </div>
    </section>
  </div>
</template>
