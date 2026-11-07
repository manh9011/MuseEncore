/*
 * SPDX-License-Identifier: GPL-3.0-only
 * Drop-in Vue 3 Reactivity replacement for React's `useSyncExternalStore`.
 * Allows all existing MuseEncore `.ts` state stores (`session.ts`, `i18n.ts`, `actions.ts`,
 * `scoreview.ts`, `panels.ts`, `toolbars/layout.ts`, `playalongcontroller.ts`, etc.)
 * to work seamlessly inside Vue `<script setup lang="ts">` components.
 */
import { getCurrentScope, onScopeDispose, shallowRef, type ShallowRef } from 'vue'

export type SubscribeFn = (onStoreChange: () => void) => () => void

/**
 * Returns a reactive `ShallowRef<T>` synchronized with an external store,
 * plus a `Proxy` wrapper so callers expecting direct property access (`const session = useSession()`)
 * or `.value` access both work reactively in Vue templates and computed properties.
 */
export function useSyncExternalStore<T>(
  subscribe: SubscribeFn,
  getSnapshot: () => T,
): T & ShallowRef<T> {
  const state = shallowRef<T>(getSnapshot())

  const unsubscribe = subscribe(() => {
    state.value = getSnapshot()
  })

  if (getCurrentScope()) {
    onScopeDispose(() => {
      unsubscribe()
    })
  }

  // If the snapshot is a primitive (string/number/boolean), return the ref directly
  // (Vue templates auto-unwrap top-level refs, and primitives work in watchers).
  const initial = state.value
  if (initial === null || typeof initial !== 'object') {
    return state as unknown as T & ShallowRef<T>
  }

  // For object snapshots (e.g. SessionState, ScoreViewState, PanelsState),
  // return a reactive Proxy that reads from `state.value` on every property access,
  // preserving full compatibility with `const session = useSession(); session.view`.
  return new Proxy(state as object, {
    get(target, prop, receiver) {
      if (prop === '__v_isRef' || prop === 'value') {
        return Reflect.get(target, prop, target)
      }
      const current = state.value as Record<PropertyKey, unknown>
      return current ? current[prop] : undefined
    },
  }) as T & ShallowRef<T>
}
