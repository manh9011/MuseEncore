<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { qtrc, arg, useLanguage, webtr } from '../i18n'
import { closeDialog } from '../session'
import packageInfo from '../../package.json'
import logoUrl from '../../logo/muse-encore-logo.svg'

defineProps<{ open?: boolean }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
useLanguage()
onMounted(() => dialog.value?.showModal())
function handleClose() { closeDialog(); emit('close') }
</script>
<template>
  <dialog ref="dialog" class="about" aria-labelledby="about-title" @close="handleClose">
    <div class="about-header"><img :src="logoUrl" alt="" width="64" height="64" /><div><h2 id="about-title">MuseEncore</h2><p>{{ qtrc('appshell/about', 'Version:') }} {{ packageInfo.version }}</p></div></div>
    <p>A port of <a href="https://musescore.org" target="_blank" rel="noopener">MuseScore Studio</a> to the web. {{ webtr('Based on:') }} MuseScore Studio 4.7.5 ({{ qtrc('appshell/about', 'Revision:') }} 3654226)</p>
    <p>MuseEncore is neither an official MuseScore project nor an official fork of MuseScore.</p>
    <p>{{ arg(qtrc('appshell/about', 'Visit %1 for new versions and more information.'), 'github.com/manh9011/MuseEncore') }} <a href="https://github.com/manh9011/MuseEncore" target="_blank" rel="noopener">github.com/manh9011/MuseEncore</a></p>
    <p class="muted">Copyright © 2026 Philipp Staender and contributors. Based on MuseScore Studio, copyright © 1999-2026 MuseScore Limited and others. GNU General Public License version 3.</p>
    <form method="dialog" class="dialog-buttons"><button class="primary" value="ok" autofocus>{{ qtrc('global', 'OK') }}</button></form>
  </dialog>
</template>
