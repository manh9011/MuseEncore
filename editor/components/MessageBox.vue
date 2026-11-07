<!--
  SPDX-License-Identifier: GPL-3.0-only
  Global MessageBox host.
-->
<script lang="ts">
import { shallowRef } from 'vue'

export type MessageButton = 'ok' | 'cancel' | 'yes' | 'no' | 'ignore'

export interface MessageState {
  title: string
  message: string
  buttons: MessageButton[]
  resolve: (btn: MessageButton) => void
}

const currentMessage = shallowRef<MessageState | null>(null)

export function showMessage(
  title: string,
  message = '',
  buttons: MessageButton[] = ['ok'],
): Promise<MessageButton> {
  return new Promise<MessageButton>((resolve) => {
    currentMessage.value = { title, message, buttons, resolve }
  })
}

export function useMessageState() {
  return currentMessage
}
</script>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { qtrc, useLanguage } from '../i18n'

useLanguage()
const msg = useMessageState()

const dialog = ref<HTMLDialogElement | null>(null)
watch(msg, async value => {
  if (value) { await nextTick(); dialog.value?.showModal() }
})

function buttonLabel(btn: MessageButton): string {
  switch (btn) {
    case 'ok':
      return qtrc('global', 'OK')
    case 'cancel':
      return qtrc('global', 'Cancel')
    case 'yes':
      return qtrc('global', 'Yes')
    case 'no':
      return qtrc('global', 'No')
    case 'ignore':
      return qtrc('global', 'Ignore')
  }
}

function choose(btn: MessageButton) {
  if (!msg.value) return
  const resolve = msg.value.resolve
  msg.value = null
  resolve(btn)
}
</script>

<template>
  <dialog v-if="msg" ref="dialog" class="confirm message-box" aria-labelledby="message-box-text"
    @close="choose(msg.buttons.includes('no') ? 'no' : 'cancel')">
    <p id="message-box-text"><strong>{{ msg.title }}</strong></p>
    <p v-if="msg.message" class="message-box-detail">{{ msg.message }}</p>
    <form method="dialog" class="dialog-buttons">
      <button v-for="btn in msg.buttons" :key="btn" type="button" :value="btn"
        :class="btn === 'ok' || btn === 'yes' ? 'primary' : 'secondary'"
        :autofocus="btn === 'ok' || (btn === 'no' && msg.buttons.includes('yes'))" @click="choose(btn)">{{ buttonLabel(btn) }}</button>
    </form>
  </dialog>
</template>
