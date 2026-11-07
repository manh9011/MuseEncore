/*
 * SPDX-License-Identifier: GPL-3.0-only
 * MuseEncore Editor (Vue 3 + Nuxt UI port).
 * The home screen, toolbars, panels, and dialogs are Vue 3 + Nuxt UI components;
 * the score view (scoreview.ts) is plain DOM/Canvas2D code shared with the web viewer.
 */
import { createApp } from 'vue'
import '../node_modules/@nuxt/ui/dist/runtime/index.css'
import ui from '@nuxt/ui/vue-plugin'
import { createMemoryHistory, createRouter } from 'vue-router'
import { registerAppActions } from './actions/appactions'
import App from './App.vue'
import { initAutoSaver } from './autosave'
import { applyLanguageSetting } from './i18n'
import { startup } from './session'
import './style.css'

registerAppActions()
const languageReady = applyLanguageSetting()

const app = createApp(App)
app.use(createRouter({ history: createMemoryHistory(), routes: [{ path: '/:pathMatch(.*)*', component: { render: () => null } }] }))
app.use(ui)
app.mount('#app-root')

initAutoSaver()
void languageReady.then(() => startup())
