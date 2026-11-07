/*
 * SPDX-License-Identifier: GPL-3.0-only
 * Drop-in Vue 3 replacement for `useLiveQuery` from `dexie-react-hooks`.
 * Wraps Dexie's `liveQuery()` observable into a Vue `ShallowRef`.
 */
import { liveQuery } from 'dexie'
import { getCurrentScope, onScopeDispose, shallowRef, watch, type ShallowRef, type WatchSource } from 'vue'

export function useLiveQuery<T>(
  querier: () => Promise<T> | T,
  deps: WatchSource[] = [],
  defaultValue?: T,
): ShallowRef<T | undefined> {
  const result = shallowRef<T | undefined>(defaultValue)
  let subscription: { unsubscribe: () => void } | null = null

  const startSubscription = () => {
    subscription?.unsubscribe()
    const observable = liveQuery(querier)
    subscription = observable.subscribe({
      next: (val) => {
        result.value = val
      },
      error: (err) => {
        console.error('[useLiveQuery] Dexie query error:', err)
      },
    })
  }

  startSubscription()

  if (deps.length > 0) {
    watch(deps, () => {
      startSubscription()
    })
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      subscription?.unsubscribe()
    })
  }

  return result
}
