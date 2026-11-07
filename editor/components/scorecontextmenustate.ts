/* SPDX-License-Identifier: GPL-3.0-only */
import { shallowRef } from 'vue'
import { contextMenuItems, type ContextMenuItem, type Score } from '../../src/index'
import type { MenuItem } from '../menus/appmenu'

export interface ScoreContextMenuState {
    x: number
    y: number
    items: MenuItem[]
}

export const contextMenuState = shallowRef<ScoreContextMenuState | null>(null)

function toMenuItems(items: readonly ContextMenuItem[]): MenuItem[] {
    return items.map((item): MenuItem => {
        switch (item.kind) {
        case 'action': return { kind: 'action', code: item.code, title: item.title, args: item.args }
        case 'menu': return { kind: 'menu', id: item.title[1], title: item.title, items: toMenuItems(item.items) }
        default: return { kind: 'separator' }
        }
    })
}

export function showScoreContextMenu(score: Score, x: number, y: number): void {
    contextMenuState.value = { x, y, items: toMenuItems(contextMenuItems(score)) }
}
