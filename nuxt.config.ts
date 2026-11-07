/*
 * SPDX-License-Identifier: GPL-3.0-only
 * Optional Full Nuxt 3/4 Configuration (`npx nuxi dev` / `npx nuxi generate`)
 * allowing both the Editor (`/`) and Viewer (`/viewer`) to run inside a unified Nuxt 3/4 app.
 */
import { join } from 'node:path'
import { musescoreLocales } from './editor/vite-plugin-locales'
import { musescoreSound } from './shared/vite-plugin-sound'
import { basicPitchModel } from './shared/notedetection/basicpitch/vite-plugin-basicpitch'

export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxt/ui'],
  devtools: { enabled: false },
  dir: {
    public: 'fonts',
  },
  vite: {
    plugins: [
      musescoreLocales(join(__dirname, 'MuseScore/share/locale')),
      musescoreSound(join(__dirname, 'MuseScore/share/sound')),
      basicPitchModel(),
    ],
    worker: {
      format: 'es',
    },
  },
  compatibilityDate: '2026-01-01',
})
