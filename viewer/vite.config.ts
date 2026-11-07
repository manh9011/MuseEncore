/*
 * SPDX-License-Identifier: GPL-3.0-only
 */
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import { musescoreSound } from '../shared/vite-plugin-sound'

export default defineConfig({
  root: __dirname,
  plugins: [
    vue(),
    ui({
      ui: {
        colors: {
          primary: 'blue',
          neutral: 'slate',
        },
      },
    }),
    musescoreSound(join(__dirname, '../MuseScore/share/sound')),
  ],
  publicDir: '../fonts',
  build: {
    outDir: '../dist/viewer',
    emptyOutDir: true,
  },
})
