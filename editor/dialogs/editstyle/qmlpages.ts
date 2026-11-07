/*
 * SPDX-License-Identifier: GPL-3.0-only
 * Registry mapping MuseScore Qt/QML widget `objectName`s to Vue 3 + Nuxt UI QML style components.
 * Migrated from `editor/dialogs/editstyle/qmlpages.tsx`.
 */
import type { Component } from 'vue'
import AccidentalsPage from './qml/AccidentalsPage.vue'
import BeamsPage from './qml/BeamsPage.vue'
import BendsPage from './qml/BendsPage.vue'
import ChordSymbolsPage from './qml/ChordSymbolsPage.vue'
import ClefKeyTimeSigPage from './qml/ClefKeyTimeSigPage.vue'
import FretboardsPage from './qml/FretboardsPage.vue'
import GlissandoSection from './qml/GlissandoSection.vue'
import HammerOnPullOffTappingPage from './qml/HammerOnPullOffTappingPage.vue'
import MeasureNumbersPage from './qml/MeasureNumbersPage.vue'
import NoteFlagsTypeSelector from './qml/NoteFlagsTypeSelector.vue'
import NoteLineSection from './qml/NoteLineSection.vue'
import RepeatBarlinesSection from './qml/RepeatBarlinesSection.vue'
import RepeatPage from './qml/RepeatPage.vue'
import RestOffsetSelector from './qml/RestOffsetSelector.vue'
import SlursAndTiesPage from './qml/SlursAndTiesPage.vue'
import TupletCenteringSelector from './qml/TupletCenteringSelector.vue'
import VoltasPage from './qml/VoltasPage.vue'

export const QML_WIDGETS: Record<string, Component> = {
  groupBox_noteFlags: NoteFlagsTypeSelector,
  groupBox_rests: RestOffsetSelector,
  groupBox_beams: BeamsPage,
  PageBend: BendsPage,
  PageSlursTies: SlursAndTiesPage,
  PageAccidentals: AccidentalsPage,
  PageFretboardDiagrams: FretboardsPage,
  hoposPageWidget: HammerOnPullOffTappingPage,
  groupBox_glissando: GlissandoSection,
  groupBox_noteline: NoteLineSection,
  clefTimeKeySigPage: ClefKeyTimeSigPage,
  repeatBarlinesGroupBox: RepeatBarlinesSection,
  chordSymbolsPage: ChordSymbolsPage,
  voltasPageWidget: VoltasPage,
  pageMeasureNumbers: MeasureNumbersPage,
  groupBox_tuplets_properties: TupletCenteringSelector,
  PageRepeats: RepeatPage,
}
