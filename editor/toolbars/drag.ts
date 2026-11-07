// SPDX-License-Identifier: GPL-3.0-only
import { shallowRef } from 'vue'

export const toolbarDrag = shallowRef<{ id: string; dock: string; index: number } | null>(null)
