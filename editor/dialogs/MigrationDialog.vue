<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { MigrationType } from '../../src/index'
import { arg, qtrc, useLanguage } from '../i18n'
import type { MigrationQuestion } from '../session'
import type { StoredMigrationOptions } from '../settings'
import migrationImage from '../../MuseScore/src/project/qml/MuseScore/Project/internal/Migration/migration.png'
const props = defineProps<{ question: MigrationQuestion }>()
const emit = defineEmits<{ close: [answer: StoredMigrationOptions | null] }>()
useLanguage()
const dialog = ref<HTMLDialogElement | null>(null)
const ok = ref<HTMLButtonElement | null>(null)
const pre362 = props.question.migrationType === MigrationType.Pre_3_6
const options = ref<StoredMigrationOptions>({ ...props.question.options, ...(pre362 ? {} : { isApplyLeland:false, isApplyEdwin:false }) })
onMounted(() => { dialog.value?.showModal(); ok.value?.focus() })
function finish() { emit('close', dialog.value?.returnValue === 'ok' ? { ...options.value, appVersion:470, isApplyMigration:true } : null) }
function video() { window.open('https://youtu.be/U7dagae87eM', '_blank', 'noopener') }
function percussionText(text: string) { return arg(qtrc('project/migration', text), 'https://musescore.org/node/367337').split(/<a href="[^"]*">(.*?)<\/a>/) }
</script>
<template>
  <dialog ref="dialog" :class="['migration', { pre362 }]" aria-labelledby="migration-title" @close="finish">
    <div v-if="pre362" class="migration-content">
      <div><h2 id="migration-title">{{ arg(qtrc('project/migration','This file was last saved in MuseScore %1'), question.appVersion) }}</h2><p>{{ qtrc('project/migration','Select the engraving improvements you would like to apply to your score') }}</p></div>
      <div class="migration-image"><img :src="migrationImage" alt="" /></div>
      <div class="migration-options"><label class="check"><input v-model="options.isApplyLeland" type="checkbox" />{{ qtrc('project/migration','Our new notation font, Leland') }}</label><label class="check"><input v-model="options.isApplyEdwin" type="checkbox" />{{ qtrc('project/migration','Our new text font, Edwin') }}</label><label class="check"><input v-model="options.isRemapPercussion" type="checkbox" /><span><template v-for="(part, i) in percussionText('Our new notation and sound mapping for <a href=&quot;%1&quot;>MDL percussion</a>')" :key="i"><a v-if="i % 2" href="https://musescore.org/node/367337" target="_blank" rel="noopener" @click.stop>{{ part }}</a><template v-else>{{ part }}</template></template></span></label></div>
      <div class="migration-info"><p>{{ qtrc('project/migration','Please note: score layouts will be affected by improvements to MuseScore Studio') }}</p><button type="button" class="secondary" @click="video">{{ qtrc('project/migration','Watch video') }}</button></div>
    </div>
    <div v-else class="migration-content"><h2 id="migration-title">{{ arg(qtrc('project/migration','This file was last saved in MuseScore %1'), question.appVersion) }}</h2><p>{{ qtrc('project/migration','Please note that the appearance of your score will change due to improvements we have made to default settings for beaming, ties, slurs, system objects and horizontal spacing.') }}</p><label class="check"><input v-model="options.isRemapPercussion" type="checkbox" /><span><template v-for="(part, i) in percussionText('Use our new notation and sound mapping for <a href=&quot;%1&quot;>MDL percussion</a>')" :key="i"><a v-if="i % 2" href="https://musescore.org/node/367337" target="_blank" rel="noopener" @click.stop>{{ part }}</a><template v-else>{{ part }}</template></template></span></label><div><button type="button" class="secondary" @click="video">{{ qtrc('project/migration','Watch video about changes') }}</button></div></div>
    <form method="dialog" class="migration-footer"><label class="check"><input type="checkbox" :checked="!options.isAskAgain" @change="options.isAskAgain = !($event.target as HTMLInputElement).checked" />{{ qtrc('global','Don’t ask again') }}</label><button ref="ok" class="primary" value="ok">{{ qtrc('global','OK') }}</button></form>
  </dialog>
</template>
