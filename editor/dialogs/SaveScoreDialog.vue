<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { qtrc, useLanguage, webtr } from '../i18n'
import { canPickFiles } from '../files'
import type { SaveAsAnswer } from '../session'
const props=defineProps<{name:string}>(),emit=defineEmits<{close:[answer:SaveAsAnswer|null]}>()
useLanguage()
const name=ref(props.name),valid=computed(()=>!!name.value.trim()),dialog=ref<HTMLDialogElement|null>(null),input=ref<HTMLInputElement|null>(null)
let answer:SaveAsAnswer|null=null
onMounted(()=>{dialog.value?.showModal();input.value?.select()})
function done(toComputer:boolean){if(valid.value){answer={name:name.value.trim(),toComputer};dialog.value?.close()}}
</script>
<template><dialog ref="dialog" class="save-score" aria-labelledby="save-score-title" @close="emit('close',answer)"><h2 id="save-score-title">{{qtrc('project/save','Save score')}}</h2><form @submit.prevent="done(false)"><label class="field"><span>{{qtrc('project/save','Name')}}</span><input ref="input" v-model="name" type="text" :spellcheck="false" /></label><p class="muted hint">{{canPickFiles() ? webtr('The score is saved in this browser. “Save to computer” also saves it as a file; “Save” then updates that file, too.') : webtr('The score is saved in this browser. “Save to computer” also downloads it as a file.')}}</p><div class="dialog-buttons"><button type="button" class="secondary save-to-computer" :disabled="!valid" @click="done(true)">{{qtrc('project/save','Save to computer')}}</button><span class="spacer" /><button type="button" class="secondary" @click="dialog?.close()">{{qtrc('global','Cancel')}}</button><button type="submit" class="primary" value="save" :disabled="!valid">{{qtrc('project/save','Save')}}</button></div></form></dialog></template>
