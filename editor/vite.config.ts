/*
 * SPDX-License-Identifier: GPL-3.0-only
 */
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import { musescoreLocales } from './vite-plugin-locales'
import { musescoreSound } from '../shared/vite-plugin-sound'
import { basicPitchModel } from '../shared/notedetection/basicpitch/vite-plugin-basicpitch'

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: { vue: 'vue/dist/vue.esm-bundler.js' },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
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
    musescoreLocales(join(__dirname, '../MuseScore/share/locale')),
    musescoreSound(join(__dirname, '../MuseScore/share/sound')),
    basicPitchModel(),
  ],
  publicDir: '../fonts',
  build: {
    outDir: '../dist-editor',
    emptyOutDir: true,
  },
  worker: {
    format: 'es',
  },
})
