#!/usr/bin/env node
/**
 * SPDX-License-Identifier: GPL-3.0-only
 * Automated codemod script to patch existing TypeScript state modules in `editor/`
 * so they use Vue 3's reactive composables (`useSyncExternalStore` and `useLiveQuery`)
 * instead of `react` and `dexie-react-hooks`.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const EDITOR_DIR = path.join(ROOT, 'editor')

const STATE_FILES = [
  'session.ts',
  'i18n.ts',
  'scoreview.ts',
  'settings.ts',
  'actions/actions.ts',
  'actions/appactions.ts',
  'panels/panels.ts',
  'panels/palettes/palettestate.ts',
  'playalong/playalongcontroller.ts',
  'playback/playbackcontroller.ts',
  'toolbars/layout.ts',
]

function getRelativeImport(fromFile, targetNoExt) {
  const rel = path.relative(path.dirname(fromFile), targetNoExt).replace(/\\/g, '/')
  return rel.startsWith('.') ? rel : `./${rel}`
}

function patchReactExternalStore(filePath) {
  if (!fs.existsSync(filePath)) return false
  let content = fs.readFileSync(filePath, 'utf8')
  const composableTarget = path.join(EDITOR_DIR, 'composables/useSyncExternalStore')
  const relImport = getRelativeImport(filePath, composableTarget)

  const updated = content.replace(
    /import\s*\{\s*useSyncExternalStore\s*\}\s*from\s*['"]react['"]/g,
    `import { useSyncExternalStore } from '${relImport}'`
  )
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8')
    console.log(`[migrated] ${path.relative(ROOT, filePath)} -> Vue useSyncExternalStore`)
    return true
  }
  return false
}

function patchDexieHooks(filePath) {
  if (!fs.existsSync(filePath)) return false
  let content = fs.readFileSync(filePath, 'utf8')
  const composableTarget = path.join(EDITOR_DIR, 'composables/useLiveQuery')
  const relImport = getRelativeImport(filePath, composableTarget)

  const updated = content.replace(
    /import\s*\{\s*useLiveQuery\s*\}\s*from\s*['"]dexie-react-hooks['"]/g,
    `import { useLiveQuery } from '${relImport}'`
  )
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8')
    console.log(`[migrated] ${path.relative(ROOT, filePath)} -> Vue useLiveQuery`)
    return true
  }
  return false
}

console.log('=== MuseEncore: Migrating editor TypeScript stores from React to Vue 3 ===')
for (const rel of STATE_FILES) {
  patchReactExternalStore(path.join(EDITOR_DIR, rel))
}
patchDexieHooks(path.join(EDITOR_DIR, 'db.ts'))
console.log('=== Migration complete! Run `npm run dev:editor` to launch Vue 3 + Nuxt UI ===')
