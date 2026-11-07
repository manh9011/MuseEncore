<!--
  SPDX-License-Identifier: GPL-3.0-only
  Main Editor ToolBars (Note Input, Undo/Redo, File operations, Playalong, and PlaybackToolBar)
  migrated from `editor/toolbars/ToolBars.tsx` to Vue 3 + Nuxt UI.
-->
<script lang="ts">
import { computed, defineComponent, h } from 'vue'
import UButton from '@nuxt/ui/components/Button.vue'
import {
  actionDescription,
  actionDefinition,
  actionTitle,
  isActionChecked,
  isActionEnabled,
  triggerAction,
  useActions,
} from '../actions/actions'
import { stripMnemonic, useLanguage } from '../i18n'
import { isToolBarVisible, noteInputBarConfig, rowSequence, TOOLBARS, type ToolBarLayout } from './layout'
import { useSettings } from '../settings'
import type { MenuItem } from '../menus/appmenu'

export function toolbarMenuItems(): MenuItem[] {
  return [...TOOLBARS.filter(t => t.toggleAction).map((t): MenuItem => ({ kind: 'action', code: t.toggleAction! })), { kind: 'action', code: 'toggle-statusbar' }]
}
import PlaybackToolBar from './PlaybackToolBar.vue'
import NoteInputExtras from './NoteInputExtras.vue'
import ViewToolBar from './ViewToolBar.vue'
import ActionToolButton from './ActionToolButton.vue'
import ToolBarFrame from './ToolBarFrame.vue'
import { toolbarDrag } from './drag'
import { topRowCount, topRowId } from './layout'

export const ToolBarRows = defineComponent({
  name: 'ToolBarRows',
  props: {
    layout: { type: Object as () => ToolBarLayout, required: true },
  },
  setup(props) {
    useLanguage()
    useActions()
    const layout = computed(() => props.layout)
    return () => h('div', { class: 'toolbar-rows' }, [...rowSequence(layout.value).slice(1), ...(toolbarDrag.value ? [topRowId(topRowCount(layout.value))] : [])].map(dock => h(ToolbarDockView, { dock, layout: layout.value, key: dock })))
  },
})

export const ToolBarDock = defineComponent({
  name: 'ToolBarDock',
  props: {
    side: { type: String as () => 'left' | 'right', required: true },
    layout: { type: Object as () => ToolBarLayout, required: true },
  },
  setup(props) {
    return () => h(ToolbarDockView, { dock: props.side === 'left' ? 'main' : 'bottom', layout: props.layout })
  },
})

const TOOLBAR_ACTIONS: Record<string, string[]> = {
  notationToolBar: ['parts'],
  undoRedoToolBar: ['action://notation/undo', 'action://notation/redo'],
}

const NOTE_INPUT_METHODS = new Set(['note-input-by-note-name', 'note-input-by-duration', 'note-input-rhythm', 'note-input-repitch', 'note-input-realtime-auto', 'note-input-realtime-manual', 'note-input-timewise'])
const SUBMENUS: Record<string,string[]> = { 'cross-staff-beaming':['move-up','move-down'], tuplet:['duplet','triplet','quadruplet','quintuplet','sextuplet','septuplet','octuplet','nonuplet','tuplet-dialog'] }
const menuActions = (codes:string[]):MenuItem[] => codes.map(code=>({kind:'action',code}))

function renderNoteInputActions() {
  const out = []
  let methodsShown = false
  for (const [index, item] of noteInputBarConfig().entries()) {
    if (!item.show) continue
    if (!item.action) {
      if (out.length && noteInputBarConfig().slice(index + 1).some(next => next.show && next.action)) out.push(h('span', { key: `sep-${index}`, class: 'tool-separator', role: 'separator', 'aria-orientation': 'vertical' }))
      continue
    }
    if (NOTE_INPUT_METHODS.has(item.action)) {
      if (!methodsShown) {
        methodsShown = true
        const methods = noteInputBarConfig().filter(x => x.show && NOTE_INPUT_METHODS.has(x.action)).map(x => x.action)
        const current = methods.find(isActionChecked) ?? methods[0]
        if (current) out.push(h(ActionToolButton, { key:`method-${current}`, code:current, menu:methods.length>1 ? menuActions(methods) : undefined }))
      }
      continue
    }
    out.push(h(ActionToolButton, { key:`${item.action}-${index}`, code:item.action, menu:SUBMENUS[item.action] ? menuActions(SUBMENUS[item.action]) : undefined }))
  }
  return out
}

function simpleActionButton(code: string, key: string, showTitle = false) {
  const def = actionDefinition(code)
  const icon = def?.icon ? String.fromCodePoint(def.icon) : ''
  const title = actionDescription(code)
  return h('button', {
    key, type: 'button', 'data-action': code, class: ['tool-button', (showTitle || !icon) && 'with-title', showTitle && 'bold', isActionChecked(code) && 'checked'],
    title, 'aria-label': title, 'aria-pressed': def?.checkable ? isActionChecked(code) : undefined,
    disabled: !isActionEnabled(code), onClick: () => triggerAction(code),
  }, [icon ? h('span', { class: 'tool-icon', 'aria-hidden': 'true' }, icon) : null, (showTitle || !icon) ? h('span', { class: 'tool-title' }, stripMnemonic(actionTitle(code))) : null])
}

const ToolbarDockView = defineComponent({
  name: 'ToolbarDockView',
  props: { dock: { type: String, required: true }, layout: { type: Object as () => ToolBarLayout, required: true } },
  setup(props) {
    const actions = useActions()
    const settings = useSettings()
    return () => {
      void actions.value
      void settings.noteInputBar
      const ids = props.layout.docks[props.dock] ?? []
      const bars = ids.filter(id => isToolBarVisible(id))
      const drag = toolbarDrag.value
      if (!bars.length && !drag) return null
      const others = bars.filter(id => id !== drag?.id)
      const items = bars.flatMap(id => {
        const marker = drag?.dock === props.dock && id !== drag.id && others.indexOf(id) === drag.index ? [h('span', { class: 'drop-marker', 'aria-hidden': 'true', key: `marker-${id}` })] : []
        const content = id === 'playbackToolBar' ? h(PlaybackToolBar)
          : id === 'noteInputBar' ? h('div', { class: 'toolbar' }, [...renderNoteInputActions(), h(NoteInputExtras)])
          : id === 'viewToolBar' ? h(ViewToolBar)
          : h('div', { class: 'toolbar' }, (TOOLBAR_ACTIONS[id] ?? []).map((code, i) => simpleActionButton(code, `${id}-${i}`, id === 'notationToolBar')))
        return [...marker, h(ToolBarFrame, { id, key: id }, { default: () => content })]
      })
      if (drag?.dock === props.dock && drag.index >= others.length) items.push(h('span', { class: 'drop-marker', 'aria-hidden': 'true', key: 'marker-end' }))
      return h('div', { class: ['toolbar-dock', `dock-${props.dock}`, drag && 'drag-active', props.dock.startsWith('top') && 'dock-top'], 'data-dock': props.dock }, items)
    }
  },
})

const NOTE_INPUT_ACTIONS = [
  'note-input',
  'pad-note-1',
  'pad-note-2',
  'pad-note-4',
  'pad-note-8',
  'pad-note-16',
  'pad-note-32',
  'pad-note-64',
  'pad-dot',
  'pad-dot2',
  'pad-rest',
  'flat2',
  'flat',
  'nat',
  'sharp',
  'sharp2',
  'tie',
  'add-slur',
  'flip',
] as const

const VOICE_ACTIONS = ['voice-1', 'voice-2', 'voice-3', 'voice-4'] as const

const ToolBarsMain = defineComponent({
  name: 'ToolBarsMain',
  setup() {
    useLanguage()
    useActions()
    return {
      NOTE_INPUT_ACTIONS,
      VOICE_ACTIONS,
      actionTitle,
      isActionChecked,
      isActionEnabled,
      triggerAction,
      stripMnemonic,
    }
  },
  components: { PlaybackToolBar, UButton },
  template: `
    <div class="toolbars-rows flex flex-wrap items-center justify-between gap-2 px-2 py-1 bg-elevated/60">
      <!-- File & Undo/Redo Quick Actions + Note Input Bar -->
      <div class="flex flex-wrap items-center gap-0.5">
        <UButton
          v-for="code in ['file-open', 'file-save', 'undo', 'redo']"
          :key="code"
          size="xs"
          color="neutral"
          variant="ghost"
          :disabled="!isActionEnabled(code)"
          :title="stripMnemonic(actionTitle(code))"
          :label="stripMnemonic(actionTitle(code))"
          @click="triggerAction(code)"
        />

        <div class="h-4 w-px bg-border mx-1" />

        <UButton
          v-for="code in NOTE_INPUT_ACTIONS"
          :key="code"
          size="xs"
          :color="isActionChecked(code) ? 'primary' : 'neutral'"
          :variant="isActionChecked(code) ? 'solid' : 'ghost'"
          :disabled="!isActionEnabled(code)"
          :title="stripMnemonic(actionTitle(code))"
          :label="stripMnemonic(actionTitle(code))"
          @click="triggerAction(code)"
        />

        <div class="h-4 w-px bg-border mx-1" />

        <UButton
          v-for="(code, idx) in VOICE_ACTIONS"
          :key="code"
          size="xs"
          :color="isActionChecked(code) ? 'primary' : 'neutral'"
          :variant="isActionChecked(code) ? 'subtle' : 'ghost'"
          :disabled="!isActionEnabled(code)"
          :label="String(idx + 1)"
          @click="triggerAction(code)"
        />
      </div>

      <!-- Playback Toolbar -->
      <PlaybackToolBar />
    </div>
  `,
})

export default ToolBarsMain
</script>
