<!--
  SPDX-License-Identifier: GPL-3.0-only
  Application MenuBar & Popup Menu migrated from `editor/components/Menu.tsx` to Nuxt UI `<UDropdownMenu>`.
-->
<script lang="ts">
import {
  actionTitle,
  isActionChecked,
  isActionEnabled,
  isCheckable,
  shortcutText,
  triggerAction,
} from '../actions/actions'
import { stripMnemonic, trString } from '../i18n'
import type { MenuItem } from '../menus/appmenu'

export interface DropdownEntry {
  label?: string
  type?: 'separator' | 'checkbox'
  checked?: boolean
  disabled?: boolean
  kbds?: string[]
  children?: DropdownEntry[][]
  onSelect?: () => void
}

export function menuItems(m: Extract<MenuItem, { kind: 'menu' }>): MenuItem[] {
  return typeof m.items === 'function' ? m.items() : m.items
}

export function toNuxtDropdownItems(items: MenuItem[]): DropdownEntry[][] {
  const groups: DropdownEntry[][] = [[]]
  for (const it of items) {
    if (it.kind === 'separator') {
      if (groups[groups.length - 1].length > 0) {
        groups.push([])
      }
      continue
    }
    if (it.kind === 'action') {
      const label = stripMnemonic(actionTitle(it.code, it.title))
      const shortcut = shortcutText(it.code)
      const checkable = isCheckable(it.code)
      groups[groups.length - 1].push({
        label,
        type: checkable ? 'checkbox' : undefined,
        checked: checkable ? isActionChecked(it.code) : undefined,
        disabled: !isActionEnabled(it.code),
        kbds: shortcut ? [shortcut] : undefined,
        onSelect: () => triggerAction(it.code, it.args),
      })
    } else if (it.kind === 'menu') {
      const subItems = menuItems(it)
      groups[groups.length - 1].push({
        label: stripMnemonic(trString(it.title)),
        children: toNuxtDropdownItems(subItems),
      })
    }
  }
  return groups.filter((g) => g.length > 0)
}
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import MenuPopup from './MenuPopup.vue'
import { useActions } from '../actions/actions'
import { useLanguage } from '../i18n'

const props = defineProps<{
  items: MenuItem[]
}>()

useLanguage()
useActions()

const topMenus = computed(() => props.items.filter((it): it is Extract<MenuItem, { kind: 'menu' }> => it.kind === 'menu'))
const buttons = ref<HTMLButtonElement[]>([])
const focused = ref(0)
const open = ref<{index:number;focus:'first'|'last'|'none'}|null>(null)
function openMenu(index:number, focus:'first'|'last'|'none') { const n=(index+topMenus.value.length)%topMenus.value.length; focused.value=n; open.value={index:n,focus} }
function close(focus:boolean) { const i=open.value?.index ?? focused.value; open.value=null; if(focus) void nextTick(()=>buttons.value[i]?.focus()) }
function keydown(e:KeyboardEvent,i:number) { let handled=true; if(e.key==='ArrowRight') buttons.value[(i+1)%topMenus.value.length]?.focus(); else if(e.key==='ArrowLeft') buttons.value[(i-1+topMenus.value.length)%topMenus.value.length]?.focus(); else if(['ArrowDown','Enter',' '].includes(e.key)) openMenu(i,'first'); else if(e.key==='ArrowUp') openMenu(i,'last'); else if(e.key==='Escape') document.getElementById('viewport')?.focus(); else handled=false; if(handled)e.preventDefault() }
let altAlone=false
function down(e:KeyboardEvent) { altAlone=e.key==='Alt'; if(e.key==='F10'&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!document.querySelector('dialog[open]')) {e.preventDefault();buttons.value[0]?.focus()} }
function up(e:KeyboardEvent) { if(e.key==='Alt'&&altAlone&&!document.querySelector('dialog[open]')) { e.preventDefault(); if(document.activeElement?.closest('.menubar')) document.getElementById('viewport')?.focus(); else {focused.value=0;buttons.value[0]?.focus()} } altAlone=false }
onMounted(()=>{window.addEventListener('keydown',down);window.addEventListener('keyup',up)})
onUnmounted(()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)})
</script>

<template>
  <div class="menubar" role="menubar" aria-label="Main menu">
    <button v-for="(menu,i) in topMenus" :key="i" :ref="el=>{if(el) buttons[i]=el as HTMLButtonElement}" role="menuitem" aria-haspopup="menu" :aria-expanded="open?.index===i" :tabindex="focused===i?0:-1" :class="{open:open?.index===i}" @click="open?.index===i ? open=null : openMenu(i,'none')" @pointerenter="open && open.index!==i && openMenu(i,'none')" @focus="focused=i" @keydown="keydown($event,i)">{{ stripMnemonic(trString(menu.title)) }}</button>
    <MenuPopup v-if="open && topMenus[open.index] && buttons[open.index]" :key="open.index" :items="menuItems(topMenus[open.index])" :anchor="buttons[open.index].getBoundingClientRect()" placement="below" :label="stripMnemonic(trString(topMenus[open.index].title))" :initial-focus="open.focus" @close="close" @left="openMenu(open!.index-1,'first')" @right="openMenu(open!.index+1,'first')" />
  </div>
</template>
