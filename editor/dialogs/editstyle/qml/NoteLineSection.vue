<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { qtrc, useLanguage } from '../../../i18n'
import LineStyleNative from './LineStyleNative.vue'
import type { NotationStyleLike } from './controls.vue'
defineProps<{style:NotationStyleLike; goToTextStylePage?: (code:string)=>void}>()
useLanguage()
</script>
<template><div class="sd-column" style="gap:12px"><LineStyleNative :style="style" prefix="noteLine"/><div><button type="button" class="sd-flat-button" @click="goToTextStylePage?.('note-line')">{{ qtrc('notation','Edit note-anchored line text style') }}</button></div></div></template>
