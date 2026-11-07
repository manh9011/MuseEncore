<!--
  SPDX-License-Identifier: GPL-3.0-only
  Reusable Style Dialog QML controls (`StyleSpinboxWithReset`, `StyleToggle`, `RadioButtonSelectorWithReset`,
  `TextFieldWithReset`, `StyledXYControllerWithReset`, `LineStyleSection`, `GroupBox`)
  migrated from `editor/dialogs/editstyle/qml/controls.tsx` to Vue 3 + Nuxt UI.
-->
<script lang="ts">
import { defineComponent, h } from 'vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UButtonGroup from '@nuxt/ui/components/ButtonGroup.vue'
import UCard from '@nuxt/ui/components/Card.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'
import USwitch from '@nuxt/ui/components/Switch.vue'
import { qtrc } from '../../../i18n'
import { ICON_CODES } from '../../../actions/uiactiondata'

export interface NotationStyleLike {
  value: (sid: string | number) => any
  setValue: (sid: string | number, val: any) => void
  resetValue?: (sid: string | number) => void
  isDefault?: (sid: string | number) => boolean
}

export const GroupBox = defineComponent({
  name: 'GroupBox',
  props: { title: { type: String, required: true } },
  setup(props, { slots }) {
    return () => h(UCard, { class: 'mb-3', ui: { header: 'py-2 px-3', body: 'p-3 space-y-2.5' } }, {
      header: () => h('div', { class: 'text-xs font-semibold text-default' }, props.title),
      default: () => slots.default?.(),
    })
  },
})

export const StyleSpinboxWithReset = defineComponent({
  name: 'StyleSpinboxWithReset',
  props: {
    styleModel: { type: Object as () => NotationStyleLike, required: true },
    sid: { type: [String, Number], required: true },
    label: { type: String, required: true },
    min: { type: Number, default: -100 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 0.1 },
    suffix: { type: String, default: 'sp' },
    percentage: { type: Boolean, default: false },
  },
  setup(props) {
    return () => h('div', { class: 'flex items-center justify-between gap-3 text-xs' }, [
      h('span', { class: 'text-default' }, props.label),
      h('div', { class: 'flex items-center gap-1.5' }, [
        h(UInputNumber, {
          size: 'xs', 'aria-label': props.label,
          min: props.min, max: props.percentage ? 999 : props.max,
          step: props.percentage ? 1 : props.step, class: 'w-28',
          modelValue: props.percentage ? Math.round(Number(props.styleModel.value(props.sid) ?? 0) * 100) : Number(props.styleModel.value(props.sid) ?? 0),
          'onUpdate:modelValue': (v: number | null) => {
            if (v !== null) props.styleModel.setValue(props.sid, props.percentage ? v / 100 : v)
          },
        }),
        h('span', { class: 'text-[11px] text-muted w-6' }, props.percentage ? '%' : props.suffix),
        h(UButton, { size: 'xs', color: 'neutral', variant: 'ghost', icon: 'i-lucide-rotate-ccw', title: qtrc('editstyle', 'Reset to default'), onClick: () => props.styleModel.resetValue?.(props.sid) }),
      ]),
    ])
  },
})

export const StyleToggle = defineComponent({
  name: 'StyleToggle',
  props: {
    styleModel: { type: Object as () => NotationStyleLike, required: true },
    sid: { type: [String, Number], required: true },
    label: { type: String, required: true },
  },
  setup(props) {
    return () => h('div', { class: 'flex items-center justify-between gap-3 text-xs' }, [
      h(USwitch, { size: 'xs', label: props.label, modelValue: Boolean(props.styleModel.value(props.sid)), 'onUpdate:modelValue': (v: boolean) => props.styleModel.setValue(props.sid, Boolean(v)) }),
      h(UButton, { size: 'xs', color: 'neutral', variant: 'ghost', icon: 'i-lucide-rotate-ccw', 'aria-label': qtrc('editstyle', 'Reset to default'), title: qtrc('editstyle', 'Reset to default'), onClick: () => props.styleModel.resetValue?.(props.sid) }),
    ])
  },
})

export const RadioButtonSelectorWithReset = defineComponent({
  name: 'RadioButtonSelectorWithReset',
  props: {
    styleModel: { type: Object as () => NotationStyleLike, required: true },
    sid: { type: [String, Number], required: true },
    label: { type: String, required: true },
    options: { type: Array as () => Array<{ label: string; value: any }>, required: true },
  },
  setup(props) {
    return () => {
      const current = props.styleModel.value(props.sid)
      return h('div', { class: 'flex items-center justify-between gap-3 text-xs' }, [
        h('span', { class: 'text-default' }, props.label),
        h('div', { class: 'flex items-center gap-1.5' }, [
          h(UButtonGroup, { size: 'xs' }, { default: () => props.options.map(opt => h(UButton, {
            key: String(opt.value), label: opt.label, 'aria-pressed': current === opt.value,
            color: current === opt.value ? 'primary' : 'neutral',
            variant: current === opt.value ? 'solid' : 'outline',
            onClick: () => props.styleModel.setValue(props.sid, opt.value),
          })) }),
          h(UButton, { size: 'xs', color: 'neutral', variant: 'ghost', icon: 'i-lucide-rotate-ccw', 'aria-label': qtrc('editstyle', 'Reset to default'), title: qtrc('editstyle', 'Reset to default'), onClick: () => props.styleModel.resetValue?.(props.sid) }),
        ]),
      ])
    }
  },
})

export const TextFieldWithReset = defineComponent({
  name: 'TextFieldWithReset',
  props: {
    styleModel: { type: Object as () => NotationStyleLike, required: true },
    sid: { type: [String, Number], required: true },
    label: { type: String, required: true },
  },
  setup(props) {
    return () => h('div', { class: 'flex items-center justify-between gap-3 text-xs' }, [
      h('span', { class: 'text-default' }, props.label),
      h('div', { class: 'flex items-center gap-1.5' }, [
        h('input', { class: 'w-44', 'aria-label': props.label, value: String(props.styleModel.value(props.sid) ?? ''), onInput: (event: Event) => props.styleModel.setValue(props.sid, (event.target as HTMLInputElement).value) }),
        h(UButton, { size: 'xs', color: 'neutral', variant: 'ghost', icon: 'i-lucide-rotate-ccw', 'aria-label': qtrc('editstyle', 'Reset to default'), title: qtrc('editstyle', 'Reset to default'), onClick: () => props.styleModel.resetValue?.(props.sid) }),
      ]),
    ])
  },
})

export const StyledXYControllerWithReset = defineComponent({
  name: 'StyledXYControllerWithReset',
  props: { styleModel: { type: Object as () => NotationStyleLike, required: true }, sid: { type: [String, Number], required: true }, disabled: Boolean },
  setup(props) {
    return () => {
      const point = props.styleModel.value(props.sid)
      const update = (name: 'x' | 'y', value: number) => {
        if (!Number.isFinite(value)) return
        const current = props.styleModel.value(props.sid)
        const next = Math.round(Math.max(-100, Math.min(100, value)) * 100) / 100
        props.styleModel.setValue(props.sid, new (current.constructor as new (x: number, y: number) => object)(name === 'x' ? next : current.x(), name === 'y' ? next : current.y()))
      }
      const axis = (name: 'x' | 'y', icon: string) => h('div', { class: 'sd-spinbox', style: { width: '100px' } }, [
        h('span', { class: 'sd-icon sd-prefix' }, String.fromCodePoint(Number(icon))),
        h('input', {
          type: 'text', inputMode: 'decimal', step: .1, disabled: props.disabled, value: point?.[name]?.() ?? 0,
          'aria-label': name.toUpperCase(),
          onChange: (event: Event) => {
            const input = event.target as HTMLInputElement
            update(name, parseFloat(input.value.replace(',', '.')))
            input.value = String(props.styleModel.value(props.sid)[name]())
          },
          onKeydown: (event: KeyboardEvent) => {
            const input = event.target as HTMLInputElement
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
              event.preventDefault()
              update(name, (parseFloat(input.value.replace(',', '.')) || 0) + (event.key === 'ArrowUp' ? .1 : -.1))
              input.value = String(props.styleModel.value(props.sid)[name]())
            } else if (event.key === 'Enter') input.blur()
            else if (event.key === 'Escape') { event.stopPropagation(); input.value = String(props.styleModel.value(props.sid)[name]()) }
          },
        }), h('span', { class: 'sd-unit' }, 'sp'),
        h('span', { class: 'sd-steppers' }, [1, -1].map(direction => h('button', { type: 'button', tabindex: -1, disabled: props.disabled, 'aria-label': direction === 1 ? '+' : '-', onMousedown: (event: Event) => event.preventDefault(), onClick: () => update(name, props.styleModel.value(props.sid)[name]() + direction * .1) }, String.fromCodePoint(direction === 1 ? ICON_CODES.SMALL_ARROW_UP : ICON_CODES.SMALL_ARROW_DOWN)))), 
      ])
      return h('div', { class: 'sd-xy-controller', style: { display: 'flex', alignItems: 'center', gap: '6px', opacity: props.disabled ? '.5' : '1' } }, [
        axis('x', String(ICON_CODES.HORIZONTAL)), axis('y', String(ICON_CODES.VERTICAL)),
        h('button', { type: 'button', class: 'sd-flat-button icon-only', disabled: props.disabled, 'aria-label': qtrc('global', 'Reset'), onClick: () => props.styleModel.resetValue?.(props.sid) }, [h('span', { class: 'sd-icon' }, String.fromCodePoint(ICON_CODES.UNDO))]),
      ])
    }
  },
})

export const LineStyleSection = defineComponent({
  name: 'LineStyleSection',
  props: {
    styleModel: { type: Object as () => NotationStyleLike, required: true },
    lineStyleSid: { type: [String, Number], required: true },
    lineWidthSid: { type: [String, Number], required: true },
    dashSizeSid: { type: [String, Number], required: true },
    gapSizeSid: { type: [String, Number], required: true },
  },
  setup(props) {
    return () => h('div', { class: 'space-y-2 border-t border-default pt-2' }, [
      h(RadioButtonSelectorWithReset, { styleModel: props.styleModel, sid: props.lineStyleSid, label: qtrc('notation', 'Line style:'), options: [
        { label: qtrc('notation', 'Normal'), value: 0 }, { label: qtrc('notation', 'Dashed'), value: 1 }, { label: qtrc('notation', 'Dotted'), value: 2 },
      ] }),
      h(StyleSpinboxWithReset, { styleModel: props.styleModel, sid: props.lineWidthSid, label: qtrc('notation', 'Line thickness:'), min: 0, step: 0.01 }),
      h(StyleSpinboxWithReset, { styleModel: props.styleModel, sid: props.dashSizeSid, label: qtrc('notation', 'Dash (dashed line):'), min: 0, step: 0.1, suffix: '' }),
      h(StyleSpinboxWithReset, { styleModel: props.styleModel, sid: props.gapSizeSid, label: qtrc('notation', 'Gap (dashed line):'), min: 0, step: 0.1, suffix: '' }),
    ])
  },
})

export default defineComponent({ name: 'StyleControls', setup: (_, { slots }) => () => slots.default?.() })
</script>

<template><slot /></template>
