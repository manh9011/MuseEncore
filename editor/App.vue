<!--
  SPDX-License-Identifier: GPL-3.0-only
  Main Editor Layout Root migrated from `editor/App.tsx` to Vue 3 + Nuxt UI v3.
-->
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { actionsChanged, registerAction, useActions } from './actions/actions'
import { clearRecentScores } from './actions/appactions'
import ConcertPitchControl from './components/ConcertPitchControl.vue'
import MenuBar from './components/Menu.vue'
import MessageBoxHost from './components/MessageBox.vue'
import NotationSwitchPanel from './components/NotationSwitchPanel.vue'
import ScoreContextMenuHost from './components/ScoreContextMenu.vue'
import SearchPopup from './components/SearchPopup.vue'
import ViewModeControl from './components/ViewModeControl.vue'
import { autosaveIds, useScores } from './db'
import { baseName } from './files'
import AboutDialog from './dialogs/AboutDialog.vue'
import BreaksDialogHost from './dialogs/BreaksDialog.vue'
import CustomizeKitDialogHost from './dialogs/CustomizeKitDialog.vue'
import EditStaffHost from './dialogs/EditStaffDialog.vue'
import EditStyleDialogHost from './dialogs/EditStyleDialog.vue'
import ExportDialogHost from './dialogs/ExportDialog.vue'
import MigrationDialog from './dialogs/MigrationDialog.vue'
import PageSettingsDialogHost from './dialogs/PageSettingsDialog.vue'
import PartsDialogHost from './dialogs/PartsDialog.vue'
import PreferencesDialog from './dialogs/PreferencesDialog.vue'
import ProjectPropertiesDialogHost from './dialogs/ProjectPropertiesDialog.vue'
import RealizeChordSymbolsDialogHost from './dialogs/RealizeChordSymbolsDialog.vue'
import SaveScoreDialog from './dialogs/SaveScoreDialog.vue'
import SelectDialogHost from './dialogs/SelectDialog.vue'
import SelectInstrumentHost from './dialogs/SelectInstrumentDialog.vue'
import SelectMeasuresCountDialogHost from './dialogs/SelectMeasuresCountDialog.vue'
import TransposeDialog from './dialogs/TransposeDialog.vue'
import TupletDialogHost from './dialogs/TupletDialog.vue'
import ScoresPage from './home/ScoresPage.vue'
import { qtrc, useLanguage } from './i18n'
import { appMenu, setRecentScoresProvider, type MenuItem } from './menus/appmenu'
import NewScoreDialog from './newscore/NewScoreDialog.vue'
import PanelDock from './panels/PanelDock.vue'
import { resetPalettesState } from './panels/palettes/palettestate'
import CalibrationBox from './playalong/CalibrationBox.vue'
import { heardNotesText, usePlayalongState } from './playalong/playalongcontroller'
import { setChrome, useScoreView, viewport, viewShown } from './scoreview'
import { answerDialog, openStored, saveChangesTitle, setView, showDialog, useSession } from './session'
import { resetSettings } from './settings'
import { restoreDefaultLayout, useToolBarLayout } from './toolbars/layout'
import { ToolBarDock, ToolBarRows, toolbarMenuItems } from './toolbars/ToolBars.vue'

useLanguage()
useActions()
const session = useSession()
watch(() => session.view, view => { document.body.dataset.view = view }, { immediate: true })
const scoreView = useScoreView()
const selectionText = computed(() => new DOMParser().parseFromString(scoreView.selection, 'text/html').body.textContent ?? scoreView.selection)
const playalong = usePlayalongState()
const layout = useToolBarLayout()
const scoresRef = useScores()

const saveChangesDialog = ref<HTMLDialogElement | null>(null)
const restoreSessionDialog = ref<HTMLDialogElement | null>(null)
const restoreNames = ref<string[]>([])
watch(() => session.dialog, async dialog => {
  if (dialog === 'restoreSession') {
    const ids = await autosaveIds()
    restoreNames.value = (scoresRef.value ?? []).filter(score => ids.includes(score.id)).map(score => baseName(score.name))
  }
  if (dialog === 'saveChanges' || dialog === 'restoreSession') {
    await nextTick()
    if (dialog === 'saveChanges') saveChangesDialog.value?.showModal()
    else restoreSessionDialog.value?.showModal()
  }
})
const chromeRef = ref<HTMLDivElement | null>(null)
const bottomRef = ref<HTMLDivElement | null>(null)
const sideRef = ref<HTMLDivElement | null>(null)
const viewportHost = ref<HTMLDivElement | null>(null)

const question = computed(() => session.question)
const answer = computed(() => {
  const currentQuestion = session.question
  return (value: unknown): void => answerDialog(value, currentQuestion)
})

// Synchronize Recent Scores menu provider with IndexedDB scores
watch(
  scoresRef,
  (scores) => {
    for (const entry of (scores ?? []).slice(0, 10)) {
      registerAction(`recent-${entry.id}`, { run: () => { void openStored(entry.id) } })
    }
    registerAction('clear-recent', { run: () => { void clearRecentScores() } })
    setRecentScoresProvider((): MenuItem[] => {
      if (!scores || scores.length === 0) {
        return []
      }
      const items: MenuItem[] = scores.slice(0, 10).map((entry) => ({
        kind: 'action',
        code: `recent-${entry.id}`,
        title: [null, entry.name],
      }))
      items.push(
        { kind: 'separator' },
        {
          kind: 'action',
          code: 'clear-recent',
          title: ['project', 'Clear recent files'],
        },
      )
      return items
    })
    actionsChanged()
  },
  { immediate: true },
)

// Mount the imperative Canvas2D `viewport` and chrome containers from `scoreview.ts`
onMounted(() => {
  if (chromeRef.value && bottomRef.value && sideRef.value) {
    setChrome(chromeRef.value)
    setChrome(bottomRef.value, 'bottom')
    setChrome(sideRef.value, 'side')
  }
  if (viewportHost.value && !viewportHost.value.contains(viewport)) {
    viewportHost.value.appendChild(viewport)
  }
  registerAction('restore-default-layout', { run: () => {
    restoreDefaultLayout()
    resetPalettesState()
    resetSettings()
  } })
})

watch(
  () => [session.view, session.current],
  async ([view]) => {
    await nextTick()
    if (viewportHost.value && !viewportHost.value.contains(viewport)) {
      viewportHost.value.appendChild(viewport)
    }
    if (view === 'score') {
      viewShown()
    }
  },
  { immediate: true },
)
</script>

<template>
  <UApp>
    <div class="app-root flex flex-col h-screen w-screen overflow-hidden bg-default text-default">
      <!-- Top Application Bar: Home/Score switcher + MenuBar -->
      <div id="chrome" ref="chromeRef" class="chrome">
        <MenuBar :items="appMenu(toolbarMenuItems)" />
        <div class="tabs-row">
          <nav class="app-tabs" :aria-label="qtrc('appshell', 'Main toolbar')">
            <div role="tablist">
              <button role="tab" :aria-selected="session.view === 'home'" @click="setView('home')">{{ qtrc('appshell', 'Home') }}</button>
              <button role="tab" :aria-selected="session.view === 'score'" :disabled="!session.current" :title="session.current?.name" @click="setView('score')">{{ qtrc('appshell', 'Score') }}</button>
            </div>
          </nav>
          <ToolBarDock v-if="session.view === 'score'" side="left" :layout="layout" />
        </div>
        <ToolBarRows v-if="session.view === 'score'" :layout="layout" />

      </div>

      <!-- Main Content Area -->
      <main class="flex-1 flex min-h-0 relative">
        <!-- Home View (Recent & New Scores) -->
        <ScoresPage v-if="session.view === 'home'" />

        <!-- Score Workspace (Left PanelDock + Side ToolBarDock + Score Canvas Viewport) -->
        <div
          v-show="session.view === 'score'"
          class="score-workspace flex-1 flex min-h-0 min-w-0 relative"
        >
          <div ref="sideRef" class="side-chrome flex shrink-0 h-full">
            <PanelDock />
          </div>

          <div class="score-area flex-1 flex flex-col min-w-0 min-h-0 relative">
            <NotationSwitchPanel v-if="session.current" />
            <div
              ref="viewportHost"
              class="score-viewport-host flex-1 min-w-0 min-h-0 relative overflow-hidden"
            />
            <SearchPopup />
            <CalibrationBox />
          </div>

        </div>

      </main>

      <!-- Bottom Status Bar -->
      <footer
        v-show="session.view === 'score'"
        ref="bottomRef"
        class="bottom-chrome flex flex-col shrink-0"
      >
        <ToolBarDock v-if="session.view === 'score'" side="right" :layout="layout" />
        <div v-if="layout.statusBar" class="statusbar" :class="{ error: scoreView.statusError }">
          <span id="status" aria-live="polite">{{ scoreView.selection ? selectionText : scoreView.status }}</span>
          <template v-if="heardNotesText(playalong)"><span class="statusbar-separator" aria-hidden="true" /><span class="status-heard" aria-live="off" :title="`${heardNotesText(playalong)} (${playalong.latency.toFixed(1)} s)`">{{ heardNotesText(playalong) }}</span></template>
          <span class="statusbar-separator" aria-hidden="true" />
          <ConcertPitchControl />
          <span class="statusbar-separator" aria-hidden="true" />
          <ViewModeControl />
        </div>
      </footer>

      <!-- Context Menu & Global Dialog Hosts -->
      <ScoreContextMenuHost />
      <MessageBoxHost />

      <!-- Unsaved Changes / Question Confirmation Dialog -->
      <dialog v-if="session.dialog === 'saveChanges'" :key="question" ref="saveChangesDialog" class="confirm" aria-labelledby="save-changes-title" @close="answer(saveChangesDialog?.returnValue || 'cancel')">
        <h2 id="save-changes-title">{{ saveChangesTitle() }}</h2>
        <p>{{ qtrc('project', 'Your changes will be lost if you don’t save them.') }}</p>
        <form method="dialog" class="dialog-buttons">
          <button class="secondary" value="dontSave">{{ qtrc('global', 'Don’t save') }}</button>
          <button class="secondary" value="cancel">{{ qtrc('global', 'Cancel') }}</button>
          <button class="primary" value="save" autofocus>{{ qtrc('global', 'Save') }}</button>
        </form>
      </dialog>
      <dialog v-if="session.dialog === 'restoreSession'" :key="question" ref="restoreSessionDialog" class="confirm restore-session" aria-labelledby="restore-session-title" @close="answer(restoreSessionDialog?.returnValue === 'yes')">
        <h2 id="restore-session-title">{{ qtrc('appshell', 'The previous session quit unexpectedly.') }}</h2>
        <p v-for="name in restoreNames" :key="name"><strong class="restore-session-name">{{ name }}</strong></p>
        <p>{{ qtrc('appshell', 'Do you want to restore the session?') }}</p>
        <form method="dialog" class="dialog-buttons"><button class="secondary" value="no" autofocus>{{ qtrc('global', 'No') }}</button><button class="primary" value="yes">{{ qtrc('global', 'Yes') }}</button></form>
      </dialog>

      <!-- Modal Dialog Hosts bound to `session.dialog` or dedicated host state -->
      <NewScoreDialog v-if="session.newScoreDialog" />
      <SaveScoreDialog v-if="session.dialog === 'saveAs'" :key="question" :name="session.saveAsName" @close="answer" />
      <MigrationDialog v-if="session.dialog === 'migration' && session.migration" :key="question" :question="session.migration" @close="answer" />
      <AboutDialog v-if="session.dialog === 'about'" />
      <PreferencesDialog v-if="session.dialog === 'preferences'" />
      <TransposeDialog v-if="session.dialog === 'transpose'" />

      <ExportDialogHost />
      <PageSettingsDialogHost />
      <EditStyleDialogHost />
      <PartsDialogHost />
      <ProjectPropertiesDialogHost />
      <SelectInstrumentHost />
      <EditStaffHost />


      <CustomizeKitDialogHost />
      <BreaksDialogHost />
      <SelectDialogHost />
      <SelectMeasuresCountDialogHost />
      <TupletDialogHost />
      <RealizeChordSymbolsDialogHost />
    </div>
  </UApp>
</template>
