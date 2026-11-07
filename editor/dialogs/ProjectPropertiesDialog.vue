<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { shallowRef } from 'vue'
import { type MasterScore } from '../../src/index'
import { currentMasterScore } from '../scoreview'
const pending = shallowRef<MasterScore | null>(null)
export function openProjectPropertiesDialog(): void { pending.value = currentMasterScore() }
</script>
<script setup lang="ts">
import { computed, nextTick, ref, shallowRef as modelRef, watch } from 'vue'
import { createProjectPropertiesModel } from '../../src/index'
import { ICON_CODES } from '../actions/uiactiondata'
import { qtrc, useLanguage } from '../i18n'
import { scoreChanged } from '../scoreview'
import { session } from '../session'
useLanguage()
const dialog = ref<HTMLDialogElement | null>(null)
const list = ref<HTMLDivElement | null>(null)
const model = modelRef<ReturnType<typeof createProjectPropertiesModel> | null>(null)
const revision = ref(0)
watch(pending, async score => {
  if (!score) { model.value = null; return }
  const next = createProjectPropertiesModel(score, session().current?.name ?? '')
  next.load(); model.value = next; revision.value++
  await nextTick(); dialog.value?.showModal()
})
const properties = computed(() => { void revision.value; return [...(model.value?.properties() ?? [])] })
const tr = (s:string) => qtrc('project/properties',s)
function update(index: number, field: 'name' | 'value', value: string) {
  if (field === 'name') model.value?.setPropertyName(index, value)
  else model.value?.setPropertyValue(index, value)
  revision.value++
}
async function add() { const row=model.value?.newProperty(); revision.value++; await nextTick(); list.value?.querySelector<HTMLInputElement>(`[data-row="${row}"] input`)?.focus() }
function save() { model.value?.saveProperties(); scoreChanged(false); dialog.value?.close() }
</script>
<template>
  <dialog v-if="pending && model" ref="dialog" class="project-properties" aria-labelledby="project-properties-title" @close.self="pending=null">
    <h2 id="project-properties-title">{{ tr('Project properties') }}</h2>
    <form @submit.prevent="save">
      <div ref="list" class="property-list">
        <div v-for="(property,index) in properties" :key="index" class="property-row" :data-row="index">
          <label v-if="property.isStandardProperty" class="property-name" :for="`project-property-${index}`">{{ property.name }}</label>
          <input v-else type="text" class="property-name" :value="property.name" :placeholder="tr('Property')" :aria-label="tr('Property')" @input="update(index,'name',($event.target as HTMLInputElement).value)" />
          <textarea v-if="property.isMultiLineEdit" :id="`project-property-${index}`" rows="2" :value="property.value" @input="update(index,'value',($event.target as HTMLTextAreaElement).value)" />
          <input v-else :id="`project-property-${index}`" type="text" :value="property.value" :placeholder="property.isStandardProperty ? '' : tr('Value')" :aria-label="property.isStandardProperty ? property.name : tr('Value')" @input="update(index,'value',($event.target as HTMLInputElement).value)" />
          <button type="button" class="icon-button" aria-label="Delete" :disabled="property.isStandardProperty" :style="property.isStandardProperty ? {visibility:'hidden'} : undefined" @click="model.deleteProperty(index); revision++"><span class="tool-icon" aria-hidden="true">{{ String.fromCodePoint(ICON_CODES.DELETE_TANK) }}</span></button>
        </div>
      </div>
      <div class="file-info"><div class="property-info"><span class="property-name">{{ tr('File path:') }}</span><span class="property-value">{{ model.filePath() }}</span></div><div class="file-info-row"><div v-for="entry in [[tr('MuseScore Studio version:'),model.version()],[tr('Revision:'),model.revision()],[tr('API-Level:'),model.apiLevel()]]" :key="entry[0]" class="property-info"><span class="property-name">{{ entry[0] }}</span><span class="property-value">{{ entry[1] }}</span></div></div></div>
      <div class="dialog-buttons"><button type="button" class="secondary" @click="add">{{ qtrc('project','New property') }}</button><span class="spacer" /><button type="button" class="secondary" @click="dialog?.close()">{{ qtrc('global','Cancel') }}</button><button type="submit" class="primary">{{ qtrc('global','OK') }}</button></div>
    </form>
  </dialog>
</template>
