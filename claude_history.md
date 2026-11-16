# Work history

## Repository cleanup
- Cleaned up 3,082 transient AI-generated artifacts used during the React-to-Vue port (2,094 comparison PNGs, 940 .mjs measurement/trace scripts, 18 .tmp server logs, 24 test .mscx/.mscz fixtures, 2 .txt logs, 2 .ts throwaway scripts, react-error.html, and visual-parity-checklist.md).
- Updated .gitignore to ignore `*.tmp`, `/test-results/`, `.output/`, and `.nuxt/`.

## Properties panel port follow-up
- Replaced unstyled generic inspector controls with existing inspector-styled native controls; specialized property sections unchanged. Typecheck and editor build pass; inspector tests: 8 passed, 5 skipped. Browser check: ottava generic fields fit a 275px panel and selecting 8vb updates the score.
- Audited 45 existing score/coordinate fixtures in Chrome for overflowing inspector controls; 37 selected a score element, others missed or selected a range. Marker and Vibrato options were clipped in one row; generic text-option groups now use a wrapping two-column grid. Tuplet radio text also clipped at 170px, so narrow-panel text radio groups wrap instead of truncating. Editor e2e tests verify marker labels at normal and 170px panel widths in English, Vietnamese and German and changing Segno to Coda then resetting to Fine, including reset-button clearance at 170px; they check Jump and Dynamic controls, and detect container overflow across 30 score-element fixtures at normal and 170px widths. Marker controls also fit with Arabic selected and the application's RTL direction, and with simulated RTL in Vietnamese and German. After system memory recovered, editor build and typecheck passed. Grid columns now shrink within narrow panels, and checkbox labels wrap even when rendered as text nodes. A further browser test selects score elements by type and covers TimeSig, KeySig, Accidental, Fermata, HairPin, Vibrato, Image, LayoutBreak, BarLine, ChordBracket and Articulation at both widths, with assertions that notation controls actually render. The eight additional coordinate-selected fixtures also check horizontal and vertical clipping of controls and text radios at both widths. The representative 22 fixtures likewise check vertical clipping. Legacy Bend and GuitarBend fixtures expose no notation controls and are not covered; GuitarBend was found via Note.bendFor(), but selecting its segment still rendered no notation controls. Laissez vibrer and partial tie are selected through their owning notes' tie accessors in the lv-ties and partialTieEndAlignment fixtures; the browser test verifies actual notation controls and no horizontal/vertical clipping at both widths. Coverage does not include all element types, states, languages, viewport widths, or interactions.

## Visual parity follow-up
- Clefs mobile middle diff 8,455→220: 30px scale-lock button grew wrapped row 10px; React uses 20px small button. Typecheck/build and scale check pass.
- Glissando desktop diff 633→280: global `input[type="text"]` overrode spinbox border/padding; corrected specificity. Computed styles and bounds now match (`measure-glissando.mjs`); mobile diff remains 220. Glissando, chords and fretboards persistence checks, typecheck and editor build pass.
- Hammer-ons mobile lower-scroll capture: scroll 321 in both, diff 220 (`capture-style-hammer-lower-mobile.mjs`).
- Hammer-ons lower scroll diff 25,468→261 by preventing fixed-width icon buttons from flex growth and matching React disabled-column opacity (`capture-style-hammer-lower.mjs`); typecheck/build pass. Left-hand Both on both staves and slur checkbox persist; Symbol disables slur checkbox in both (`check-hammer-style.mjs`); other tapping interactions unverified.
- Style Hammer-ons page restored React six-group structure and controls; desktop diff 14,847→291, mobile 220 (`capture-style-hammer*.mjs`). Lower-case and consecutive display persist in both (`check-hammer-style.mjs`); lower scrolling, tapping controls and missing illustration assets remain unverified. Typecheck/build pass; Inspector test 3 pass/5 skipped.
- Toolbar pointer drag attempt to left of notation toolbar did not reorder React (`check-toolbar-drag.mjs` fails); valid target/drag setup needed before comparing Vue.
- Playback speed slider drag to 2.5 and popup reopen persistence pass React/Vue; reload resets to 1 in both (`check-speed-slider.mjs`).
- Parts confirmed-delete attempt: duplicated/opened default Piano still deleted without question in React (`check-parts-confirm.mjs` fails waiting for No); nonempty custom part fixture needed.
- Parts Open all check now verifies every listed title appears in React/Vue (`check-parts-actions.mjs`); contents of each part unverified.
- Tuplet ratio 5 apply changes first-page canvas; Edit > Undo/deselect restores it in React/Vue (`check-tuplet-undo.mjs`); exact content unverified.
- Transpose diatonic apply changes first-page canvas, Edit > Undo/deselect restores it in React/Vue (`check-transpose-undo.mjs`); exact pitch changes unverified.
- Insert 30 measures at end increases page count and Edit > Undo restores it in React/Vue (`check-insert-measures.mjs`); exact measure count/content unverified.
- Added React-equivalent Layout tab-menu entries in `editor/panels/PanelDock.vue`: Instrument ordering, Collapse all instruments, Expand all instruments. Registered score-order actions and wired expansion controls in `editor/panels/layout/LayoutPanel.vue`; typecheck, build, and library tests pass. Fresh mobile touch capture matches React at pixel diff 0 (`check-layout-tab-menu-touch.mjs`). Expand/collapse verified (2→5→2 rows); 12 instrument ordering choices confirmed in submenu; actual order selection remains unverified.
- Measures per system 2-measure apply changes canvas; Edit > Undo and deselection restore first-page canvas in React/Vue (`check-breaks-undo.mjs`). Selection caused previous apparent undo mismatch; selected-range behavior remains unverified.
- Page settings width edit Cancel, OK persistence and Edit > Undo pass React/Vue (`check-page-settings-rollback.mjs`, React host corrected).
- Layout mobile Edit > Undo removes added System markings and Flute in React/Vue (`check-layout-system-mobile.mjs`); Ctrl+Z attempt with menu focus did not.
- Layout Add menu mobile capture diff 196 (`capture-layout-add-mobile.mjs`); instruments dialog bounds match, diff 220, add Flute to list/Cancel pass (`check-layout-add-mobile.mjs`); mobile OK adds Flute and System markings adds second row in both (`check-layout-system-mobile.mjs`).
- Layout instrument/staff/system settings mobile bounds match React; diffs 246/100/469, name edit, small staff and Escape pass (`capture-layout-settings-mobile.mjs`); persistence and undo unverified.
- Toolbar Add Measures submenu keyboard navigation, Left and Escape/focus pass in React/Vue (`check-toolbar-add.mjs`); actions remain unverified.
- Toolbar Add used app menu and Nuxt popup, adding wrong entries and geometry. Restored React-specific items/MenuPopup; desktop/mobile bounds match, diffs 235/172, Escape/focus pass (`toolbar-add-{desktop,mobile}-{react,vue,diff}.png`). Typecheck/build and customization check pass; submenu actions unverified.
- Note toolbar customization mobile bounds and 51 items match React; diff 681, toggle/Escape focus pass (`capture-customise-mobile.mjs`). Desktop Move up and Reset restore default order in both (`capture-customise.mjs`); pointer reorder unverified.
- Inspector Appearance mobile after desktop selection/resize: popup bounds match, full-screen diff 1,187; leading-space edit and Escape/focus pass in both (`capture-inspector-appearance-mobile.mjs`).
- Inspector selected key signature mobile after desktop selection/resize shows same sections; full-screen diff 943 (`capture-inspector-selection-mobile.mjs`); direct mobile selection unverified.
- Inspector no-selection mobile panel bounds match React; full-screen diff 666 (`capture-inspector-mobile.mjs`); mobile actions unverified.
- Mobile palette treble search: seven results and Escape focus pass in both; full-screen diff 196 (`capture-palette-search-mobile.mjs`).
- Mobile expanded Clefs grid/cell bounds and columns match React; full-screen diff 196 (`capture-palette-mobile.mjs`); mobile actions unverified.
- Layout expanded Piano mobile capture shows same rows, full-screen diff 341 (`capture-layout-expanded-mobile.mjs`); mobile actions remain unverified.
- Export MuseScore settings desktop/mobile bounds match React; full-screen diffs 228/158 (`capture-export-musescore.mjs`); downloaded archive contains .mscx in both (`check-export-formats.mjs`); roundtrip unverified.
- Export PNG settings desktop/mobile bounds match React; full-screen diffs 224/158 (`capture-export-png.mjs`); 32dpi download contains five PNG pages in both (`check-export-formats.mjs`); rendering unverified.
- Export MusicXML settings desktop/mobile bounds match React; full-screen diffs 258/158 (`capture-export-musicxml.mjs`); download contains score-partwise in both (`check-export-formats.mjs`); roundtrip unverified.
- Export MIDI settings desktop/mobile bounds match React; full-screen diffs 260/158 (`capture-export-midi.mjs`); MIDI download and MThd header pass both (`check-export-formats.mjs`); playback unverified.
- Export SVG settings desktop/mobile dialog bounds match React, full-screen diffs 254/158 (`capture-export-svg.mjs`); Illustrator compatibility toggle and ZIP download pass both; each archive contains five SVG pages (`check-export-formats.mjs`); SVG rendering unverified.
- Mobile score context menu bounds match React (257.766×201), Escape closes both; menu crop diff 0, full-screen diff 943 outside menu (`context-mobile-{react,vue,diff}.png`).
- Score context menu used Nuxt dropdown and overflowed mobile viewport. Reused React-equivalent MenuPopup, restoring viewport positioning and desktop Select More (diff 253); typecheck/build pass. Mobile selection differed after resize, leaving More disabled in Vue; mobile dialog remains unverified.
- Tuplet mobile comparison after desktop selection and resize: dialog bounds match, diff 158; ratio edit and Cancel pass (`capture-tuplet-mobile.mjs`). Direct mobile selection remains unverified.
- Preferences General mobile capture: zero pixel diff, matching dialog bounds and computed font/color/padding (`preferences-general-mobile-{react,vue,diff}.png`); mobile interactions remain unverified.
- Project properties custom name/value save, reopen, delete and Edit > Undo pass in React/Vue (`node check-project-properties.mjs`); Ctrl+Z attempt with dialog focus did not restore deleted property.
- Save score computer-download fallback produces `Parity save.mscz`, and browser save creates IndexedDB entry in React/Vue (`node check-save-score.mjs`); native picker remains open.
- Parts first-row menu captures: bounds match React desktop/mobile (160×100.5625), full-screen diffs 206/158 (`parts-menu-{desktop,mobile}-{react,vue,diff}.png`).
- Parts changed-title Escape comparison revealed React cancels edit; fixed Vue to cancel instead of commit. `node check-parts-actions.mjs` verifies Escape cancellation and Enter rename in both. Typecheck/build pass.
- Parts initialized empty-copy Reset menu action completes in React/Vue (`node check-parts-actions.mjs`); reset effect and nonempty confirmation remain unverified.
- Parts dialog create, title edit, duplicate, empty custom-part delete and Open selected/all pass in React/Vue (`node check-parts-actions.mjs`); reset/confirmed delete remain unverified.
- Clefs scale now clamps to React bounds 1–999 and restores invalid inputs; `node check-clef-scale.mjs` verifies 0.5→1 and lock/unlock/reset. Typecheck/build and measure-offset checks pass.
- Corrected Clefs Above-staves reset to retain reference model behavior: reset also clears centered/noncentered margin settings, while button enabled state still follows React’s displayed controls. Typecheck/build and Clefs check pass; margin reset interaction verified in React/Vue (`node check-clef-scale.mjs`): Inset barline clears after modifying scale and resetting.
- Clefs Style and size reset was disabled whenever numeral style was default, even after scale edits. Adapter now checks all relevant default values; reset enabled and scale restored in React/Vue (`node check-clef-scale.mjs`). Typecheck/build and measure-offset check pass.
- Clefs Above staves mobile radio scrolled into view: bounding box matches React (252,478.203,16×16), full-screen diff 220 (`style-clefs-above-visible-mobile-{react,vue,diff}.png`). Other mobile controls open.
- Clefs above/across mobile initial captures each diff 220; controls lie outside clipped viewport, so mobile interaction parity remains unverified (`style-clefs-{above,across}-mobile-{react,vue,diff}.png`).
- Clefs/time-signature Above and Across staves alignment selections persist after OK/reopen in both apps (`node check-clef-scale.mjs`).
- Clefs/time-signature scale check: locked horizontal 1.5 persists; unlocked vertical 2 remains independent and relock restores both to 1.5 in React/Vue (`node check-clef-scale.mjs`). Other placements remain open.
- Measure-number Every frequency and interval 4 persist after OK/reopen in React and Vue (`node check-measure-offset.mjs`).
- Measure-number disabled state: matched React fieldset opacity; diff 4,223→780 (`style-measure-numbers-disabled-{react,vue,diff}.png`). Disabled frequency radio verified; typecheck/build/offset check pass.
- Measure-number XY controls reuse reference sd-spinbox CSS instead of divergent custom layout; enabled lower diff 1,083→702. Typecheck/build/offset interaction check pass.
- Measure-number range enabled/lower capture diff 1,083; scroll position 431 in React/Vue (`style-measure-numbers-enabled-{react,vue,diff}.png`). Remaining control states unverified.
- Measure-number range bracket and position radios expose reference ARIA; Parentheses/Above persistence passes React/Vue. Typecheck/build and Inspector tests (3 pass, 5 skipped) pass.
- Measure numbers On all staves controls now match reference structure/ARIA; Below persists in both, alternate-state diff 343 with identical Position bounds. Typecheck/build/offset check pass.
- Measure numbers mobile diff 262; lower-scroll 1,903→1,210 after matching reference flat-radio gaps. Typecheck/build and offset interaction check pass; remaining edits still unverified.
- Measure numbers desktop diff 23,522→903 after matching React inter-group spacing, fixed 30px alignment buttons and XY reset icon. Typecheck/build/offset check pass; mobile and lower states remain open.
- Measure numbers: reference switch and Position group gap restore exact four group heights (155.75/99.375/392.875/402.3125px). Desktop diff remains 23,522; control styling and mobile remain open. Typecheck/build/offset check pass.
- Measure-number range controls now actually disable when range display is off, matching React; browser check verifies disabled/enabled states in both. Typecheck/build and Inspector tests (3 pass, 5 skipped) pass.
- Measure-number XY controls now include step buttons, keyboard stepping and clamping; `check-measure-offset.mjs` verifies bounds, ArrowUp and persistence in React/Vue. Desktop diff 24,846. Typecheck/build pass.
- Measure numbers: fixed Position radio-group direction and first fieldset spacing. Diff 24,881; content height 1,081 vs React 1,086; Position 385 vs 393px, range 441 vs 402px. Mobile/visual parity remain open; offset check/typecheck/build pass.
- Chord custom preset now exposes React-equivalent file field/load button instead of immediately opening picker. `node check-chords-style.mjs` verifies custom state and Jazz persistence in both; custom XML file selection updates filename in both via browser file chooser; custom-state desktop diff 663 and load-button bounds match. Rendering custom chords remains unverified. Typecheck/build pass.
- Restored Chord symbols positioning/playback/capo fieldsets; lower-scroll diff 582 (`style-chords-lower-{react,vue,diff}.png`), scroll position 1,081 in both. Typecheck/build and voicing/scale persistence pass; capo input now uses reference spinbox semantics; clamp 15→11 and persistence pass both. Mobile diff 496; remaining interactions open.
- Restored Chord symbols altered-bass and polychord fieldsets, controls and SMuFL checkbox. Restored alignment fieldset and icon radios: middle-scroll diff 7,088→903 (`style-chords-middle-{react,vue,diff}.png`); lower sections remain divergent. Typecheck/build and chord persistence check pass.
- Chord symbol factor controls now show percentages like React; `node check-chords-style.mjs` verifies voicing persistence. Typecheck/build pass; Inspector 3 passed, 5 skipped. Extension scale 125% persists after OK/reopen in React/Vue; other percent edits and visual structure remain unverified.
- Style Chord symbols desktop comparison: 18,943 differing pixels (`style-chords-{react,vue,diff}.png`); React content 1,736px vs Vue 596px, many reference sections absent. Added missing spelling/capitalization, polychord, alignment, positioning, playback and capo controls; Drop two voicing persists React/Vue. Restored visible React group hierarchy: desktop diff 19,646→1,227; lower sections and mobile/interactions open. Typecheck/build and voicing/scale persistence pass.
- Corrected Voltas numeric bounds and steps to React defaults (0–99, 0.01); `node check-voltas-style.mjs` verifies clamp and arrow step in both. Typecheck/build pass; Inspector 3 passed, 5 skipped.
- Style Fretboard diagrams desktop comparison: 24,100 differing pixels (`style-fretboards-{react,vue,diff}.png`); Restored React group hierarchy and intrinsic radio widths: diff 24,100→793. `node check-fretboards-style.mjs` verifies orientation, position and suffix persistence; mobile diff 220; lower diff 8,210→708 after correcting fretboard-style selector order; persistence check also covers extended style, fingerings and spacing. Remaining interactions open.
- Style Bends & dives desktop comparison: 27,201 differing pixels (`style-bends-{react,vue,diff}.png`); Restored nested groups and measured control widths: diff 27,201→2,039. Mobile diff 344; `node check-bends-style.mjs` verifies arrow width and dive placement persistence in React/Vue. Matching measured whammy row widths reduced scrolled lower-page diff 4,983→672; remaining interactions open. Typecheck/build and bend persistence check pass; check now covers whammy text, dotted line and cue-size checkbox.
- Style Voltas desktop comparison: 14,167 differing pixels (`style-voltas-{react,vue,diff}.png`); Restored React fieldsets, line-style icons and alignment: diff 14,167→801. Mobile diff 220; `node check-voltas-style.mjs` verifies dashed, dash length and alignment persistence in React/Vue. Remaining interactions open; image assets absent.
- Style Slurs & ties desktop comparison: 19,718 differing pixels (`style-slurs-{react,vue,diff}.png`); Restored React flex/grid hierarchy and radio controls; diff 19,718→1,135. Numeric edit, slur-angle radio and Cancel pass React/Vue; mobile diff 421 and radio passes. `node check-slurs-style.mjs` verifies numeric/radio persistence; remaining interactions open.
- Style Measure numbers desktop comparison: 20,133 differing pixels (`style-measure-numbers-{react,vue,diff}.png`); React flex hierarchy 1,086px high vs Vue unstyled block 843px. Fixed XY offset style IDs to follow selected text style and alternate below placement, matching MeasureNumbersPageModel; `node check-measure-offset.mjs` verifies alternate above/below values and above-X edit persistence match React; visual restoration and mobile remain open. Typecheck/build pass.
- Style Repeats desktop comparison: 14,839 differing pixels (`style-repeats-{react,vue,diff}.png`); Restored React flex groups, checkboxes and preset dropdown: diff 14,839→959. Number consecutive checkbox and Cancel pass React/Vue; mobile diff 250. `node check-repeat-style.mjs` verifies Every edit and preset persistence in React/Vue. Enabled-state diff 1,201; fieldset bounds match. Remaining interactions unverified.
- Captured Style Beams desktop: 16,945 differing pixels (`style-beams-{react,vue,diff}.png`). Replaced unstyled Vue group/control hierarchy with React `.sd-page` structure; diff 16,945→623. Wide radio and numeric edit/Cancel pass React/Vue. Mobile diff 387; checkbox toggle and thickness/Wide persistence pass React/Vue. Remaining interactions unverified; image asset absent.
- Style Accidentals padding now rejects invalid text and clamps to reference [-10,10] on Enter/blur; React/Vue browser checks pass for 99→10 and invalid restore. Typecheck/build pass; ArrowUp/ArrowDown stepping and reset to 0.175 pass React/Vue browser checks. Matching React's nonshrinking label wrapper reduces mobile Accidentals diff 8,688→679; edited padding persists after OK/reopen in React/Vue.
- Rebuilt Style Accidentals page with React-equivalent fieldsets, image wrappers and native toggles; desktop diff 14,280→933. Pair accidentals toggle and Cancel pass in React/Vue. Image assets absent; numeric validation/reset and mobile remain unverified.
- Inspector key-signature mode options used uppercase enum names instead of React's source strings (None, Major, etc.), breaking visual and translation parity. Corrected model labels; added fixture-independent Inspector test. Fresh appearance capture confirms identical option text and popup bounds; full-screen diff 1,247. Typecheck/build and 3 Inspector tests pass; 5 fixture tests skipped.
- Restored missing time-signature alignment buttons for above/across placements, using reference style IDs and icon codes. Above-staves desktop capture diff 4,045→794; button behavior and across placement still need verification. Typecheck/build pass.
- Restored reference GroupBox column spacing in Clefs Style Time signatures/Style and size; desktop full-screen diff 7,249→883. Corrected horizontal scale edit to update both axes when locked. Typecheck passes; scale interaction and alternate placement states still need browser checks.
- Mobile Clefs Style page: measured React first radio width 474px vs Vue 88px; React sets Clefs GroupBox minWidth=500. Added same minimum to Vue; 390×844 full-screen pixel diff 7,728→1,170. Restored React StyledImage bordered wrapper, reducing mobile diff to 851 and desktop to 7,249. Missing QML assets and remaining page interactions unverified.
- Fixed playback speed popup hiding behind toolbar: Reka teleported popper wrapper had auto z-index, trapping popup below chrome; assigned reference popup z-index to wrapper and prevented automatic number-input focus. `capture-speed.mjs` desktop diff 1,480→410, bounds identical, Escape/focus pass. Mobile and speed edits remain unverified.
- Compared React and Vue score workspace with Chopin fixture at 1280×800. Added toolbar docks and icon buttons based on `noteInputBarConfig`; moved notation tabs into score area and matched desktop viewport position within 1px. Playback measure/beat controls now use native numeric inputs, matching React structure. Pixel diff still 47,107/1,024,000; palette UI, playback/toolbar controls, footer and interactions need work. See `visual-parity-checklist.md` for evidence and remaining coverage.
- `npm run typecheck` and `npm run build:editor` pass; focused Inspector tests 2 pass/5 skip. Browser E2E suite previously skipped 46 tests for missing fixtures; no full parity claim.

## Vue editor startup investigation
- Added `vue-router` dependency for @nuxt/ui's Vite integration. Restart Vite to resolve its optional peer dependency again.
- Added missing `closeDialog` export for Vue dialogs. Editor still cannot start: Vue migration imports missing exports, including `setInspectorProperty`; `npm run build:editor` reported 32 errors. Inspector also expects score state absent from `scoreview.ts`. Migration needs completion before editor can be verified.
- Pinned TypeScript and its override to 5.9.3: vue-tsc cannot load TypeScript 7's `./lib/tsc`. `npm run build` succeeds and `npm run typecheck` now runs, reporting 154 existing errors including missing dialog modules and incompatible Vue state. `npm run build:viewer` succeeds.
- Compared upstream React inspector at commit 3eadb652dd4b660572f75b88473ab46581de2769: it builds section/model/property references via `inspectorSections` and `prop`, then calls `inspectorPropertyChanges` / `inspectorPropertyResets` and `applyInspectorChanges`. Ported General checkboxes to the model-based API and section discovery to `inspectorSections`. Remaining Vue inspector views still call nonexistent global setters and read nonexistent score view fields; appearance, notation, text and parts need a proper port. Inspector and linked-editing tests were skipped because their fixtures are unavailable.
- Corrected Vue home screen score store, file picker, settings, translation and thumbnail URL lifecycle; fixed Vue viewer wrapper to use the actual viewer API. Ported new-score options, template selection and instrument list to existing model APIs; wired score context menu to the real context-menu model and fixed MessageBox imports. Ported calibration, playback display, notation tabs and search to existing APIs; fixed panel actions and app state bindings, and wired insert-measures dialog. Layout and Palettes use library APIs; Inspector uses generic model-driven controls (incomplete vs upstream, including enum, offsets, appearance and specialized controls). `npm run typecheck` and `npm run build:editor` pass; `npx vitest run test/newscore.test.ts` passes 12 tests (2 skipped). Fixed startup module cycles by extracting score-context-menu and instrument-dialog state, restored score view DOM, corrected external-store ref proxy and deferred palettes until fonts load. Ported Save As and migration answer dialogs instead of closing without returning data. Browser smoke test creates a flute score, renders one canvas, stores one IndexedDB entry and saves via Ctrl+S; a dialog accessibility warning remains. `npm run typecheck` and `npm run build:editor` pass. Ported Tuplet, Transpose, Project Properties and Measures per system dialogs to their library commands and score-specific state. Project Properties model tests: 2 passed, 4 skipped; Vue dialog not browser-verified. Preferences dialog has language, autosave, web settings, note preview and import settings; values subscribe to settings changes. EditPitch is mounted only inside its parent dialogs, not unconditionally by App. Style QML hosts use notationStyle via a Sid/Spatium adapter; browser smoke test opened Style and navigated to Beams; toggling Flatten all beams updates the control; browser smoke tests confirm Cancel restores it, OK persists it, and Ctrl+Z undoes it. Beams labels, translation contexts, numeric limits, steps and beam-distance glyphs match upstream; beam-style images are unavailable in the local partial MuseScore submodule. Tuplet number alignment and note flag selectors use upstream labels, translation contexts and glyphs; rest selector labels use upstream translations. Browser smoke test selected Straight flags and Rhythmic center and confirmed pressed state; 2-space rests was clickable. Radio-style controls now expose aria-pressed; persistence of these selectors remains unverified. Glissando and note-line sections link to their text-style pages and use valid type/dash/gap Sids; shared line controls use upstream labels, steps and unitless dash/gap values. A scan of all editstyle/qml Vue pages now finds no invalid literal style IDs; Accidentals and Fretboards use valid IDs, while Clef/Key/Time courtesy controls use valid Sids and fabricated spacing controls were removed. Chord Symbols preset selection sets the associated built-in description file or registers selected custom XML; browser smoke test confirms Jazz selection persists on OK and reverts on Ctrl+Z. Custom XML picker and actual chord rendering remain unverified. Hammer-on replaces fabricated controls with valid core settings; tapping controls and browser verification remain. Browser verification remains. Voltas position now edits PointF rather than replacing it with a number and rejects empty/non-finite input, dash/gap use valid Sids, and alignment controls are present. Browser smoke test changed vertical position and selected alignment; persistence and images remain unverified. Measure numbers replaces nonexistent Sids with showMeasureNumberOne, measureNumberSystem, measureNumberInterval and measureNumberPlacementMode; its remaining upstream controls and browser verification are missing. Repeats page includes consecutive-number and play-count settings plus text-style navigation; browser smoke test toggled numbering, confirmed dependent control enabled, and opened text style. Persistence/undo remain unverified. Repeat barline options now use upstream labels and disable dependent controls when the parent is off; browser verification remains. Bends page adds tablature dive thickness, whammy line controls, grace alignment, interval labels and text-style links; visual parity and browser verification remain. Slurs & Ties adds tie placement, lengths, dotted width and laissez vibrer settings; browser smoke test opened the page and toggled SMuFL symbols. Persistence and visual parity remain unverified. Fretboards adds suffix, nut, dot, barre, fingering, spacing and text-style controls; scale and barre thickness use upstream percentage conversion; browser smoke test displays 100% and 85% defaults. Shared number and text inputs now have accessible labels; browser smoke test changed scale to 125%, committed it and undid back to 100%. Visual parity remains unverified. Accidentals labels, grouping and numeric bounds match upstream; illustrations and browser verification remain. Style renderer rich-text detection fixes escaped regex, page-list toggle updates EditStyle model with an accessible label, and unmount rolls back an open edit; duplicate opens are ignored to avoid overlapping undo transactions; QSpinBox edits now reject empty/non-finite values and clamp to widget range; OffsetSelect inputs validate numbers and expose labels. Remaining widget behavior and Style pages still need parity work. Transpose library tests were skipped (24 skipped); its Vue dialog has not been browser-verified. Export dialog uses ExportDialogModel, score selection, select-all/clear, format/subtype, PDF/PNG/SVG/MIDI/MusicXML settings, unit selection, progress callback and save/ZIP; full settings/progress browser verification remains. Browser smoke test opened Export on a new score, but download was not verified (native file picker blocked automation). Fixed New Score closing a later unsaved-changes question and duplicate confirmation emissions; browser test confirmed cancelling the question retains the existing score. Inspector parity audit against local upstream added Score Display `show-soundflags`, restored Instrument Name/Bracket title-only fallback mappings and exact Noteline model mapping; removed duplicate NOTELINE map key. Score Appearance hide-empty-staves has default reset, undoable style change and score-version refresh; General action controls/button order match upstream. Added fixture-independent Inspector mapping test (1 pass); score-based Inspector tests remain skipped without MuseScore fixtures. Typecheck and editor build pass. Remaining Inspector TODOs (empty staves, PlayCountText, Playback popup, text-edit extras, beam heights) are TODO upstream too. Other dialog placeholders and simplified toolbar/tab/layout/palette/inspector implementations still need parity work; typecheck and editor build pass, New Score tests pass (12 passed, 2 skipped).

## 2026-10-19 — Session 1: project setup & foundations

### Findings about the reference implementation
- Reference is MuseScore v4.7.5 (3654226). `./MuseScore` is checked out on `main`, so sources are read
  from the tag (`git show v4.7.5:...`) / extracted to a scratch dir.
- MuseScore 4.7.5 is installed locally -> reference SVG/PNG exports via `mscore -o`.
- Engraving coordinates are 1200 DPI "pixels". Default spatium 24.8 (1.75mm).
- SMuFL fonts are used at point size `4 * spatium(default) / DPI * 72` -> 1 em = 4 spatium.
  Glyph bboxes come from the vector outline (QPainterPath::boundingRect), advances from font metrics.
- The desktop app measures all text with Qt (`QFontProvider`) on a 1200 DPI virtual device:
  pixel size = pointSize * 1200 / 72. Re-implemented with opentype.js (`fontprovider.ts`).
- 4.x scores keep the full style in `score_style.mss` inside the mscz; < 4.0 scores need
  version-specific legacy defaults (`src/engraving/data/styles/legacy-style-defaults-*.mss`).

### Done
- Project skeleton: package.json (GPL-3.0-only), tsconfig, LICENSE (GPLv3 + font notes), fonts copied
  (Leland, Bravura, Edwin, FreeSerif/FreeSans).
- `framework/draw`: geometry (PointF/LineF/SizeF/RectF/PolygonF with Qt semantics), Bezier, PainterPath
  (incl. arcs, exact curve bboxes), Transform, Color, Pen/Brush, Font, Painter, CanvasPaintProvider,
  FontProvider/FontsDatabase (opentype.js).
- `engraving/types`: types.ts (all enums of types.h + mscore.h constants), Fraction, Spatium,
  SymId/symnames (generated by `tools/gen/gen-symids.ts`), Smufl code points.

### Next
- Style: Sid + defaults generator, MStyle, text styles.
- Infrastructure: Shape, Skyline, EngravingFont, MscReader.
- DOM, reader (read460), layout, drawing.

## 2026-10-19 — Session 1 (continued): style, DOM, reader

### Done
- Style system (`gen-styledef.ts`, MStyle incl. compat rules), text styles, property table (`gen-property.ts`),
  TConv tables (`gen-typesconv.ts`), XmlReader, MscReader (fflate).
- Infrastructure: Shape, Skyline, EngravingFont (lazy SMuFL metrics, anchors, composed glyphs).
- DOM port of the engraving model needed for common scores: Score/MasterScore, Part/Instrument, Staff/StaffType,
  Measure/MeasureBase/Segment, System/Page, ChordRest/Chord/Note/Rest/NoteDot/Stem/Hook/StemSlash/LedgerLine,
  Accidental (+ generated `accidentaldata.ts`), Beam/BeamBase, Tuplet, Clef, KeySig, TimeSig, Groups, BarLine,
  Bracket/BracketItem, LayoutBreak, Spacer, Box/HBox/VBox/TBox, TextBase/Text/InstrumentName/MeasureNumber,
  Lyrics, Articulation, Arpeggio, Symbol/BSymbol, Spanner/SpannerSegment, SlurTie, Tie, Slur, Location,
  ConnectorInfo, Factory (+ compat DummyElement as temporary parents).
  Notehead table generated by `tools/gen/gen-noteheads.ts`.
- Reader: `rw/mscloader.ts` + `rw/read460/*` (ReadContext, ConnectorInfoReader, TRead, MeasureRead, StaffRead,
  Read460). All 568 4.x files of the v4.7.5 vtest set load (5 need fonts registered).

### Known gaps (marked `TODO(port)` in code)
- Readers for 3.x and older (read302/206/114) -> 265 vtest files are rejected.
- Not ported yet: dynamics, tempo/staff/system texts, rehearsal marks, fermatas, breaths, harmony, fingering,
  lines (hairpin, ottava, volta, pedal, text lines, trills), lyrics lines, tremolos, MM rests, measure repeats,
  ornaments, images, drumsets/tablature details, excerpts (parts), links.
- `Measure::fillGap` uses `toDurationList` instead of `toRhythmicDurationList`.

### Next
- Layout (rendering/score): LayoutContext, ScoreLayout/ScorePageViewLayout, MeasureLayout, SystemLayout,
  PageLayout, HorizontalSpacing, SegmentLayout, ChordLayout, StemLayout, BeamLayout, RestLayout,
  AccidentalsLayout, TLayout, TextLayout, Autoplace, BoxLayout, HeaderFooterLayout, ModifyDom, SlurTieLayout,
  TupletLayout, LyricsLayout.
- Painting (Paint/TDraw), public API, demo, node render + compare tools.

## 2026-10-19 — Session 1 (continued): layout, painting, API, tools

### Done
- Layout (rendering/score): LayoutContext, ScoreLayout/ScorePageViewLayout, passes, MeasureLayout, ModifyDom,
  SegmentLayout, ChordLayout, StemLayout, RestLayout, AccidentalsLayout, BeamLayout, BeamTremoloLayout, Autoplace,
  TLayout, TextLayout, MeasureNumberLayout, BoxLayout, TupletLayout, LyricsLayout, HorizontalSpacing,
  SystemLayout, VerticalGapData, PageLayout, HeaderFooterLayout, SlurTieLayout, ScoreRenderer (DOM hooks).
- Drumsets: Drumset + generated standard drumset (`tools/gen/gen-drumset.ts`), `<Drum>` reading,
  percussion note lines/heads, drum beam directions.
- Painting: TDraw (all ported element types), Paint (page iteration, z-order, Page::items without BSP tree),
  Painter masks (QPainter clip path emulated with canvas clip per mask rect).
- Public API `src/index.ts`: initEngravingFonts, loadScore, layoutScore, pageCount, pageSize, drawPage.
- Fonts: `engravingmodule.ts` registers Edwin, FreeSerif/FreeSans, Bravura(+Text), Leland(+Text); other SMuFL fonts
  fall back to Bravura, their text fonts to Leland Text.
- Tools: `npm run render`, `npm run compare` (renders with MuseScore 4.7.5 and the port, writes a diff PNG:
  red = only MuseScore, blue = only port). Demo app (`npm run dev`, supports `?url=<score>`).
- All 573 4.x vtest scores lay out without exceptions. beams-1: element positions equal MuseScore's SVG
  export within 0.05 units (1200 DPI).

### Known differences / missing
- 1.x files (read114) are rejected; 2.x/3.x excerpts (parts) are not read.

## 2026-10-20 — Session 2: 2.x files, load-time compatibility conversions

### Done
- 2.x files (mscVersion 115-207): Read206 port (rw/read206/read206.ts) incl. 2.x text styles (user/excess styles),
  text reading via a sub reader (TextReaderContext206 -> XmlReader.readSubReader), tuplets/beams/slurs by id
  (ReadContext tables like read400), old articulation names (fermatas split off), double articulations, ties fix,
  adjustPlacement, old glissandi/text lines on notes (placeholder spanners), measure/box reading, page format
  (compat/pageformat.ts, also used by MStyle.read for 3.x), bar line spans (setBarLineSpanToStaves + local
  overrides). Old spanners of files < 3.01 are registered by id in the shared readers (read400).
  All 157 2.x vtest files load; mean diff 7.99% (first run) -> see below.
- ReadChordListHook (rw/compat/readchordlisthook.ts): `<ChordList>` in the style of 2.x-4.x files is read and the chord
  list validated/loaded like C++ (3.x chord symbols: harmony-1 14.6% -> 4.6%).
- EngravingCompat (compat/engravingcompat.ts): pre-layout conversions run between the first and second layout like
  NotationProject::load (pre-4.7 text offsets/frame radius, note parentheses migration, marker size, rest offsets,
  vbox distances, pedal end points, dynamics/hairpins below vocal staves) and post-layout ones (lyrics line
  visibility, cross-staff beams). index.layoutScore applies them once per score.
- CompatConversions (rw/compat/compatconversions.ts = CompatUtils::doCompatibilityConversions, called after reading):
  custom dynamic types, expressions from staff text, ornaments from articulations, rest offsets, split combined
  articulations, articulation offsets, two-note tremolo stems, initial key of transposing instruments, header/footer
  style mapping, laissez vibrer articulations -> ties.
- Time tick anchors (dom/anchors.ts, MeasureLayout.layoutTimeTickAnchors): spanners starting/ending at a tick without
  a chord/rest (e.g. at the end of a measure) are anchored to TimeTick segments like C++ (hairpins/trills ending at
  the end of the score were one measure too short).
- Score.scanElements walks measures and systems like C++ (was: pages only).
- Staff STAFF_BARLINE_SPAN property also updates non-generated end bar lines (C++ Staff::setProperty).
- MStyle.styleD returns the value of Spatium styles (C++ toReal()); NaN bar line positions in 2.x files.
- Trill segment and tuplet shapes are refilled on access like C++ (LayoutData::shape hooks; the trill was placed
  against its bbox instead of its symbols): ornament-9 13.9% -> 5.8%.
- Ambitus (dom/ambitus.ts, layout, drawing incl. ledger lines, MM rests, readers): small-1 22% -> 4.6%,
  ambitus-offset 7.2% -> 0.6%.
- Instrument changes (dom/instrchange.ts: text, Part::setInstrument at the tick, so later systems show the new
  instrument names): instrument-1 20.6% -> 4.8% (together with the next item).
- Measure `<stretch>` of files < 4.0 is ignored like read400.
- Custom key signatures (layout incl. naturals after a custom key sig; 3.x `<KeySym>` tag): custom-keysig-1..4
  12-15% -> 3-4.5%.
- Font height metrics use the OS/2 typo values like Qt 6 with QFont::PreferTypoLineMetrics (set by MuseScore's
  Font::toQFont); metrics are taken from QFontProvider in the app, not from the FreeType FontsEngine.
  FreeSerif lyrics verse distance (2.x/3.x): lyrics-5 19% -> 5.2%, lyrics-3/7 15-17% -> 4-6%.
- Not ported: ProjectMigrator (the converter does not apply it; no migration options are stored).
- Headers/footers use placeholder file info macros.
- Demo not yet verified in a real browser (node rendering path verified).

## 2026-10-19 — Session 1 (continued): annotations, MM rests, system locks, lines

### Done
- Annotations: staff/system texts, tempo texts, rehearsal marks, expressions, dynamics, fermatas, breaths
  (reading, layout incl. DynamicsLayout/AlignmentLayout, drawing).
- Multi-measure rests (creation in MeasureLayout, MMRest layout/drawing), generic `clone()` and links.
- System locks (with the EID register), C++ order of the annotation layout in SystemLayout.
- Lines: SLine/LineSegment, TextLineBase (+segments), TextLine, Hairpin (incl. snapping, circled tips), Volta
  (+ alignment of consecutive voltas), Ottava, Pedal, LyricsLine (dashes and melismas, createOrRemoveLyricsLine,
  lyrics lines in the verse skylines). Drawing of all of these (dash patterns as in TDraw).
- Lyrics melisma/dash spacing in HorizontalSpacing; centering of dynamics, expressions, hairpins and MM rest
  numbers between the staves of grand staff instruments (`centerElementsBetweenStaves`).
- Instrument families generated from instruments.xml (`tools/gen/gen-instrumentfamilies.ts`), used by
  `isVocalInstrument` / `isNormallyMultiStaveInstrument`.
- `layoutScore` lays out twice like MuseScore does on load (EngravingProject::loadMscz + NotationProject::doLoad):
  some results depend on the previous pass (chord shapes contain the lyrics bboxes of the previous layout).
  `System.destroy()` emulates ~System (detaches spanner segments, otherwise read segments are not reused).
- Sample results (`npm run compare`, ink diff): lyrics-24 21% -> 3.2%, hairpins-3 9.9% -> 2.2%,
  hairpins-4 14% -> 1.5%, volta-1 9% -> 3.8%, ottava-3 0.3%.

- Let ring, palm mute (ChordTextLineBase); CompatUtils::setTextLineTextPositionFromAlign for files < 4.7.
- Tablature: tab fonts (mscoreTab.ttf, fonts_tablature.xml read at init), StaffType tab metrics/presets,
  fret marks, ChordLayout::layoutTablature, TabDurationSymbol, MaskLayout (string lines masked under frets,
  barlines masked under text). The tab vtest files went from 100% to 0-10% diff (beams-20: 0.00%).
- Markers and jumps (MarkerLayout, layoutJump).
- Chord symbols: ChordList (chord description files in fonts/chords, parser), Harmony (also the 4.0-4.5
  format), HarmonyLayout (render lists, polychords, capo, kerning, system alignment), Parenthesis +
  ParenthesisLayout + ParenPaddingTable, MuseJazz fonts. Most harmony-* files are at 3-5% diff.
- Fret diagrams (incl. old format, alignment with chord symbols).
- Ornaments (notes above/below, accidentals, cue notes) and trill lines (TrillSegment symbol lines, cue notes).
- Arpeggios (ArpeggioLayout: spacing in layoutPitched/layoutTablature across spanned chords, clearAccidentals,
  layoutArpeggio2 after page layout, cross-staff skyline handling; drawing of all types). arpeggio-* vtest
  files are at 1.8-6.4% diff at 50 dpi.
- Tremolos: TremoloSingleChord/TremoloTwoChord (reading incl. the `<Tremolo>` compat tag, connectTremolo),
  TremoloLayout, stem direction/length handling, tremolos inside beams (trem anchors), slur anchoring at
  tremolos, cross-staff tremolos, drawing. The tremolo vtest files went from 4-33% to 0.1-5.8% (tremolo-tab
  from 100%).
- StaffTypeChange (reading, Measure::add -> staff type list; not drawn as it is unprintable). staff-offset-*
  files: 12-26% -> 3-5%.
- Chord::findOrnament also returns the ornament of a starting trill (trill cue notes were not laid out).
- RepeatList (unwind/flatten; uticks only, no tempo map), findFollowingRepeatMeasures/findPreviousRepeatMeasures,
  segmentsAreAdjacent: repeat courtesies incl. parentheses (courtesy-changes-* 10-25% -> 3-13%), lyrics lines over
  jumps, ties over repeats (searchTieNote disableOverRepeats).
- Big time signatures: centerBigTimeSigsAcrossStaves, updateTimeSigAboveStavesXPos (bigTimeSig-* mostly 4-7%).
- Slurs: ornament accidentals/arpeggio rules in the slur collision shape, hasArticulationAbove for ornaments
  (ornament-3 41% -> 5%).
- Laissez vibrer ties (LaissezVib/LaissezVibSegment, SMuFL symbol or tie drawing): lv-1/2 56% -> 3-4%.
- Partial ties (without tie jump points, which are only needed for editing/screen display): partialTieEndAlignment
  17% -> 1.3%.
- Measure repeats (1/2/4 bar symbols, numbers, extenders, Measure::isEmpty for repeat groups): measure-repeat-4/5
  21%/42% -> 3%/5%.
- read400 compat: header clef guess for files < 4.1, clef-to-barline position for files < 4.5 (extra clefs at the
  start of 4.0 scores).
- Note parentheses on chords (NoteParenGroup reading, generated parentheses for ghost notes/tab tie-backs with a
  simplified EditChord, ParenthesisLayout chord values, TAB masks) and parenthesis padding in HorizontalSpacing:
  paren-chords 63% -> 4%.
- Guitar bends and dives: GuitarBend/GuitarBendSegment/GuitarBendHold/GuitarBendText (reading incl. hold lines and
  bend texts), GuitarBendLayout (angular/slight bends on standard staves, TAB bends with arrows, texts and hold lines,
  conflicts between bends), GuitarDiveLayout (dive sequences/levels, on-staff and above-staff dives, dips, scoops),
  bend line attach points, Note::bendFor/bendBack/diveFor/diveBack, continuation of bends (hidden frets and ties on
  TAB), tab grace size exception, slight-bend/scoop note shapes, avoidPreBendsOnTab, drawing. The bend shape is
  refilled on access like C++ LayoutData::shape() (ldataShapeHooks). guitarBend-* 10-43% -> 2.6-6%.
- Whammy bar lines (centered between a notation staff and its linked TAB staff).
- Vibrato lines (symbol lines like trills): vibrato-1/2 21%/27% -> 4%/4.5%, guitarDive-3 5.3% -> 0.5%.
- StringData (fretChords via Chord::cmdUpdateNotes: TAB frets are recomputed from the pitch), Staff::updateOttava /
  pitchOffset (ottava pitch offsets), Note::linkedOttavaPitchOffset.
- Links: `<linkedTo>` is read (EID register; staff numbers for files < 4.6), EngravingObject::isLinked,
  findLinkedInStaff; TAB grace notes are aligned to the linked notation staff (alignTabGraceNotesToMainStave).
  Element links of 4.0-4.5 files (`<linked>`/`<linkedMain>`, read410 ReadContext::addLink/getLink with LinksIndexer).
  guitarDive-2 36% -> 8%.
- PassLayoutIndependentItems is no longer run: in C++ it is only compiled with MUE_ENABLE_ENGRAVING_LD_PASSES
  (OFF in release builds). It laid out accidentals of grace notes before their mag was known (full-size grace
  accidentals). guitarDive-2 8% -> 3.4%.
- Glissandi (straight/wavy, text, dashed lines; TLayout::layoutNoteAnchoredLine, ChordLayout::addLineAttachPoints,
  min glissando length in spacing): tablature-7 11.5% -> 3.9%, gliss-5 11% -> 3.1%.
- Fingering (note- and chord-based layout, LH guitar fingering alignment, cross-beam fingerings, skyline):
  offsets 32% -> 7.5%, fingeringSpacing 11.7% -> 1.9%.
- Chord lines (falls, doits, plops, scoops; straight/curved/wavy, spacing): chordline-2/3 12%/11% -> 5%/3%.
- Gradual tempo changes (rit./accel. lines with snapping to tempo texts and rehearsal marks): mmrest-15 63% -> 2%,
  stacking-order 52% -> 6%, tempoChangeLines-2 15% -> 3.3%.
- Hammer-on/pull-off slurs with H/P letters (regions, alignment of letters): hopo-1..4 10-15% -> 3.8-6.5%.
- read400/read410 compat: `<placement>` of items with voice assignment properties (dynamics, hairpins, ...) is read
  as DIRECTION in files < 4.6 (hairpins/cresc. lines were placed below instead of above).
- read400 compat: key signatures with `<accidental>` (4.0 files; transposing instruments got no key signature):
  gliss-3 11% -> 3.8%.
- 3.x files: Read302 (score tag, legacy default styles legacy-style-defaults-v3/v302.mss shipped in fonts/styles,
  defaultsVersion), MStyle copied in Score::setStyle like C++. 108 3.x vtest files load and lay out.
  read400/read410 compat added for them (also applies to 4.0-4.5 files): obsolete `pos`/`tick`/`selected` item tags,
  staff hide modes (`hideWhenEmpty` integers converted per part), box auto-size off before 3.02, hook height sign of
  lines below the staff (resetHookHeightSign), pre-4.2 pedal texts.
- Chord/rest shapes are refilled on access like C++ LayoutData::shape() (ChordLayout::checkAndFillShape; a chord line
  laid out before the chord shape existed was placed at DBL_MAX and hung the layout).
- Music fonts Emmentaler (MScore), Gonville (Gootville), Petaluma, Finale Maestro, Finale Broadway are shipped.
- Note: files < 4.6 are read with read460 plus selected read400/read410 compat (fretFontName, harmony, fret
  diagrams, marker type from label, header clefs); C++ uses separate readers for them.

### Known differences / missing
- Not ported (not drawn): partial lyrics lines,
  chord brackets, tremolo bars, images, note lines, MMRestRange, excerpts, capos, string tunings,
  play technique annotations, harp diagrams, system dividers, sticking, figured bass, old Bend.
- harmony-15 (3.x, jazz chord symbols with a custom chord list) still differs (~17%).
- gonville-text-2: a staff text is ~1.7% wider than in MuseScore and collides with a segno marker, which is then
  autoplaced higher (29%).
- Full vtest run at 855e6c1: mean 4.42% over 862 pages (4.x, 3.x and 2.x files).
- Fret diagrams: vertical alignment offsets of diagrams and their chord symbols (AlignmentLayout::yOpticalCenter):
  fret-diagram 43% -> 4.8%, harmony-27/28/18 27-32% -> 2.8-4.2%.
- Fret boxes (FBox: reading incl. the diagrams stored in the box, table layout; init()/rebuild from the score's
  chord symbols is only needed when editing and not ported): fret-box 75% -> 2-5.5%, fret-box-scale 84% -> 3.3%.
  harmony/fret vtest files: mean 8.9% -> 4.2%.
- guitarDive-2: measure widths differ slightly (~1.5%) from MuseScore.
- harmony-35: chord symbols at size 20 are placed ~0.45sp lower than in MuseScore (10, 15 and 25 match), so a
  4th system fits on page 1.
- bigTimeSig-8: first measure after an across-staves header time signature is ~1sp wider than in MuseScore.
- Cross-staff spacing (e.g. cross-10) differs.
- 1.x files (read114) are rejected; 2.x/3.x excerpts (parts) are not read.

## 2026-10-20 — Session 2: 2.x files, load-time compatibility conversions

### Done
- 2.x files (mscVersion 115-207): Read206 port (rw/read206/read206.ts) incl. 2.x text styles (user/excess styles),
  text reading via a sub reader (TextReaderContext206 -> XmlReader.readSubReader), tuplets/beams/slurs by id
  (ReadContext tables like read400), old articulation names (fermatas split off), double articulations, ties fix,
  adjustPlacement, old glissandi/text lines on notes (placeholder spanners), measure/box reading, page format
  (compat/pageformat.ts, also used by MStyle.read for 3.x), bar line spans (setBarLineSpanToStaves + local
  overrides). Old spanners of files < 3.01 are registered by id in the shared readers (read400).
  All 157 2.x vtest files load; mean diff 7.99% (first run) -> see below.
- ReadChordListHook (rw/compat/readchordlisthook.ts): `<ChordList>` in the style of 2.x-4.x files is read and the chord
  list validated/loaded like C++ (3.x chord symbols: harmony-1 14.6% -> 4.6%).
- EngravingCompat (compat/engravingcompat.ts): pre-layout conversions run between the first and second layout like
  NotationProject::load (pre-4.7 text offsets/frame radius, note parentheses migration, marker size, rest offsets,
  vbox distances, pedal end points, dynamics/hairpins below vocal staves) and post-layout ones (lyrics line
  visibility, cross-staff beams). index.layoutScore applies them once per score.
- CompatConversions (rw/compat/compatconversions.ts = CompatUtils::doCompatibilityConversions, called after reading):
  custom dynamic types, expressions from staff text, ornaments from articulations, rest offsets, split combined
  articulations, articulation offsets, two-note tremolo stems, initial key of transposing instruments, header/footer
  style mapping, laissez vibrer articulations -> ties.
- Time tick anchors (dom/anchors.ts, MeasureLayout.layoutTimeTickAnchors): spanners starting/ending at a tick without
  a chord/rest (e.g. at the end of a measure) are anchored to TimeTick segments like C++ (hairpins/trills ending at
  the end of the score were one measure too short).
- Score.scanElements walks measures and systems like C++ (was: pages only).
- Staff STAFF_BARLINE_SPAN property also updates non-generated end bar lines (C++ Staff::setProperty).
- MStyle.styleD returns the value of Spatium styles (C++ toReal()); NaN bar line positions in 2.x files.
- Trill segment and tuplet shapes are refilled on access like C++ (LayoutData::shape hooks; the trill was placed
  against its bbox instead of its symbols): ornament-9 13.9% -> 5.8%.
- Ambitus (dom/ambitus.ts, layout, drawing incl. ledger lines, MM rests, readers): small-1 22% -> 4.6%,
  ambitus-offset 7.2% -> 0.6%.
- Instrument changes (dom/instrchange.ts: text, Part::setInstrument at the tick, so later systems show the new
  instrument names): instrument-1 20.6% -> 4.8% (together with the next item).
- Measure `<stretch>` of files < 4.0 is ignored like read400.
- Custom key signatures (layout incl. naturals after a custom key sig; 3.x `<KeySym>` tag): custom-keysig-1..4
  12-15% -> 3-4.5%.
- Font height metrics use the OS/2 typo values like Qt 6 with QFont::PreferTypoLineMetrics (set by MuseScore's
  Font::toQFont); metrics are taken from QFontProvider in the app, not from the FreeType FontsEngine.
  FreeSerif lyrics verse distance (2.x/3.x): lyrics-5 19% -> 5.2%, lyrics-3/7 15-17% -> 4-6%.
- Not ported: ProjectMigrator (the converter does not apply it; no migration options are stored).
- Stored multi-measure rests of 3.x files: the MMRest element in an MM rest measure is read (TRead::read(MMRest*))
  and the read position advances by its own duration like C++; relative locations after it (e.g. the end bar line)
  were placed mid-measure, which made the MM rest too wide and broke the system: bravura-mmrest-1 20% -> 3.3%,
  mmrest-10 17% (2 pages) -> 3.1% (1 page like MuseScore), emmentaler-mmrest-1 9.3% -> 3.4%.

## 2026-10-20 — Web viewer

- `demo/` renamed to `webviewer/`: toolbar with MuseScore's icon font (MusescoreIcon.ttf), light/dark theme,
  pages side by side (default) or vertical, two-page spreads for scores with a two-sided page layout
  (style pageTwosided; page 1 is a right-hand page), zoom (MuseScore zoom steps, page width / whole page, mouse wheel
  and pinch zoom at the pointer), space bar + drag (and middle button) to move the view, MuseScore keyboard shortcuts
  (Ctrl +/-/0, Ctrl+PgDn/PgUp, Home/End, Ctrl+O, Ctrl+P, F11), page indicator, only visible pages are drawn,
  last opened file remembered in IndexedDB (close button clears it), view settings in localStorage, print stylesheet.
- Library API: isTwoSided(score), scoreTitle(score).
- High zoom: pages whose bitmap would exceed 16 Mpx are drawn as tiles (visible part plus half a viewport) instead
  of a downscaled page bitmap, so the view stays sharp at any zoom; drawPage() got a `region` option for this.
- Font fallback: characters missing in the loaded fonts (e.g. CJK text) are measured and drawn with a system font
  like Qt does (FallbackFontEngine; in browsers a canvas, generic serif/sans-serif chosen from the font's PANOSE/name).
  Node has no fallback engine (setFallbackFontEngine), there such characters still show the .notdef glyph.
- SVG output: SvgPaintProvider (paths, polygons, clip, masks as SVG <mask>, fallback text as <text>); glyphs are
  passed as references (IPaintProvider.drawGlyphs) and each outline is defined once (SvgGlyphDefs, shareable between
  pages) and placed with <use>. API drawPageSvg(score, page, {defs}); `npm run render -- file out svg`.
  Rasterized SVG matches the canvas output (only antialiasing differences).
- Web viewer printing: all pages as SVG in a print-only container, @page size = score page size (portrait/landscape),
  margin 0; removed again after printing. Goldberg (119 pages) prints to a 2.4 MB vector PDF.
- Web viewer: the view can be moved beyond the pages (space of almost a viewport around them, 48 px of a page stay
  visible); "Center page" button (icon ALIGN_HORIZONTAL_CENTER) centers the current page/spread in both directions;
  opening a score, changing layout/spread and choosing a fit zoom also center it.
- Web viewer: busy overlay (spinner, file name, step) while a file is downloaded/laid out and while printing is
  prepared; it blocks input (overlay, inert viewport, shortcuts and drops ignored). The spinner is a CSS transform
  animation, so it keeps turning during the synchronous layout. Fades in after 150 ms (no flash for small files).
- Web viewer full screen: the toolbar is collapsed (fixed, slid up) and slides in when the pointer reaches the top
  edge (8 px trigger strip; tap on touch), stays while hovered or keyboard-focused, hides when the pointer is clearly
  below it (not on mouseleave, an open zoom list is outside of it); shown for 1.2 s on entering full screen.
  Fit zoom modes refit and recenter the page when the view is resized.

## 2026-10-20 — Real-world score (Chopin op. 9/2, 2.x), tests, MuseScore submodule

- `MuseScore/` is now a git submodule pinned to v4.7.5 (shallow); tests and tools use its vtest scores and demos.
- Tests: library tests for rendering, SVG output (vs canvas, 1 px tolerance), font fallback, regressions;
  web viewer end-to-end tests in headless Chrome (`npm run test:e2e`, playwright-core); `npm run compare:all`
  compares every page with MuseScore against `test/compare-baseline.csv`. Overview in `test/README.md`.
- Note.clone() shared accidental, dots, attached elements and ties with the original (generic clone): the ornament
  helper notes of a turn changed the main note's natural into a flat. Note.onCloned / Spanner.onCloned follow the
  C++ copy constructors.
- Version checks of read400::TRead were missing because the old-file readers use the read460 functions: slur user
  offsets (o1-o4) and stem lengths of pre-4.0 files ignored, dynamics size/align, articulation anchor/offset and
  old subtype names (mordent -> short trill before 3.6), chord line/TAB parenthesis offsets, grace chord x offset,
  note velocity/ghost, lyrics offset before 3.1, time signature strings 3.0-3.4, 2.x ambitus accidentals.
- Instrument::updateInstrumentId (recognizeId / recognizeMusicXmlId) ported: old files only store the MusicXML id;
  instrument templates generated from instruments.xml (tools/gen/gen-instrumenttemplates.ts, replaces the family
  table), minimal InstrChannel (name/bank/program). With the family known, dynamics and hairpins of 2.x/3.x piano
  scores are centered between the staves like in MuseScore.
- Horizontal spacing: a ledger line exactly 0.1 sp from an accidental is an exact tie in `intersects`; rounding
  decides it, and MuseScore treats it as a collision. Ties within 1e-9 now count as intersecting (deviation).
- Web viewer: closing a file and reloading at once brought it back (IndexedDB delete still pending); the current
  file id is now also kept in localStorage.
- TConv.fromXmlLineType: pre-4.0 line styles are Qt pen styles (2 = dash, 3 = dot); they were read as solid
  (e.g. the dashed ottava lines of 2.x files, from the legacy default style).
- Dynamics: Qt kerns strings of music symbol fonts too (MScore "pp": -29 units), the glyph runs did not; and
  a dynamic's text block shape is the shape of its SMuFL symbol (TextLayout::layoutTextBlock, was a TODO), which
  HCENTER alignment uses. 2.x "pp"/"ppp" now at MuseScore's position to the unit.
- Chopin: 3.1-5.3% -> 1.0-2.2% per page. Left: systems ~1 unit higher further down the page, fp dynamic x, a trill
  line end.
- Measure numbers were one too high after a frame (e.g. every score with a title VBox): the MeasureBase
  constructor marks measure bases irregular (only Measure resets it), so frames are not counted.
- DynamicType -> SymId table had wrong symbols for sf, rf, rfz (single letters instead of the combined glyphs);
  affected the optical-center alignment and, since the symbol shape is used for centering, the position of these
  dynamics. Known difference: "sff" (Bravura) is kerned s-f-f here, MuseScore (HarfBuzz) does not kern f-f after
  a pair that also adjusts its second glyph (GPOS PairPos with ValueFormat2); opentype.js has no such information.


## 2026-10-20 — New scores (from instruments or templates)

- Ported the "New Score" path: `NotationProject::createNew/loadTemplate` (src/project/internal/notationproject.ts),
  `MasterNotation::setupNewScore/applyOptions` incl. createMeasures/clearMeasures (src/notation/internal/masternotation.ts),
  `NotationParts::setParts` (insertNewParts, appendStaves, initStaff, resolveNewInstrumentNumber, ...;
  src/notation/internal/notationparts.ts), `ScoreOrder` (dom/scoreorder.ts: read, setBracketsAndBarlines,
  instrumentSortingIndex, isScoreOrder, ...; also read from 3.x/4.x files), `EditPart::setScoreOrder`.
- editing/edit.ts adds the needed edit.cpp functions to Score/MasterScore/Measure (module augmentation, must be
  imported): insertMeasure/insertBox, MasterScore::insertMeasure (as `insertMeasureInMaster`, appending only),
  restoreInitialKeySigAndTimeSig, cmdAddTimeSig (no rewriteMeasures), undoChangeKeySig, undoAddCR, undoInsertTime,
  undoAddBracket, addText (title frame texts), adjustKeySigs, Measure::adjustToLen (measures with only a rest).
  No undo stack: the commands' redo() is done directly (`TODO(port): undo`); editing/editmeasures.ts has
  InsertMeasures/ChangeMeasureLen/InsertTime. Score got insertPart/insertStaff/insertTime/setUpTempoMap (time
  signature map only)/autoUpdateSpatium/keyList/scoreOrder; Staff init/insertTime/changeBracketColumn, Part
  insertTime/insertStaff, toRhythmicDurationList (durationtype.ts), Interval(int chromatic).
- Instrument templates: gen-instrumenttemplates.ts now generates everything InstrumentTemplate::read reads except
  MIDI actions/articulations (staves, clefs, brackets, barline spans, transposition, staff type presets, custom
  drumsets and string data as xml read at runtime, traits, genres, families, group names, descriptions,
  sequenceOrder); `Instrument::fromTemplate`, `Trait`. Score orders: tools/gen/gen-scoreorders.ts embeds orders.xml.
- Public API (src/index.ts): createScore(NewScoreOptions), defaultNewScoreOptions, KEY_ATONAL, instrumentGroupList,
  instrumentGenres, scoreOrders, instrumentSortingIndex, isScoreOrder. Templates need their score_style.mss
  (`templateStyle`): MuseScore reads the template directory as a container.
- PropertyValue equality of Fractions is `identical` like C++ (4/4 != 2/2); no change of the compare scores.
- Verified against MuseScore: every share/templates file, turned into the equivalent score (title frame only with a
  title, 32 rest measures, default page styles/autoUpdateSpatium spatium, concert-C key signatures) and rendered by
  mscore, matches the createScore() output at 0.03-0.06 (same level as the reader).
- Missing: instrument changes/excerpts/linked staves, inserting measures before others, time signature changes
  that rewrite measures, removing/sorting existing parts, playback data (tempo map, swing, capo, MIDI mapping).
- loadTemplate(mscx, style) loads a template as it is (preview). InstrumentTemplate.staffTypePreset is looked up
  when used (the presets need the tablature fonts, which are not loaded when the UI first reads the instrument
  list); instrumentGroups() assigns its cache only when complete.

## 2026-10-20 — Editor: home screen, New Score dialog, stored scores

- musescoreweb/ is a React app around the score view of the viewer (scoreview.ts, plain DOM): tabs Home / Score,
  home screen "Scores" (grid/list, search, New, Open other…, remove from list, clear list) like MuseScore's
  ScoresPage; New Score dialog (newscore/, after NewScoreDialog/ChooseInstrumentsPage/CreateFromTemplatePage/
  ScoreInfoPage.qml): genres, families, search, instruments combined by name with their traits, order with
  "(Customized)", soloist, up/down/remove; 41 templates of share/templates (bundled with import.meta.glob) with a
  rendered preview; key/time signature/tempo/measures/pickup and title/subtitle/composer/lyricist/copyright.
- Storage: db.ts (Dexie, database "musescoreweb-scores"): every opened file (deduplicated by SHA-256) and every new
  score with its content, a thumbnail of page 1 and the last opened time; at most 100. There is no writer yet,
  so a new score is stored as its NewScoreOptions and created again when opened. The open score's id is in
  localStorage and reopened at startup. The first version's "last file" is taken over once.
- Settings: settings.ts (localStorage "musescoreweb:settings"): view (zoom, orientation, spread), home layout,
  preferred creation mode of the New Score dialog.
- e2e: test/e2e/musescoreweb.e2e.ts; webapps.e2e.ts runs the score view tests for both apps.
- Missing: saving/downloading scores (needs the writer), editing, multiple open scores.

## 2026-10-20 — Selection (first step of editing)

- `Selection` (dom/select.ts: SelState, SelectType, range/list, updateSelectedElements incl. anchored elements, tuplets,
  spanners, extendRangeSelection, activeCR/currentCR, setRangeTicks) and a default `SelectionFilter` (everything
  selectable; TODO: filter types). Score: selection(), select(item|items, SelectType, staffIdx) with
  selectSingle/selectAdd/selectRange (trySelectSimilarInRange, tryExtendSingleSelectionToRange, selectSimilarInRange,
  scanElementsInRange), deselect/deselectAll, cmdSelectAll, pos2measure/searchPage/searchSystem/searchMeasure,
  getTextStyleUserName; System::searchStaff, Measure::searchSegment. No InputState yet (TODO(port) where C++ uses m_is).
- dom/navigate.ts (module augmentation): upAlt/downAlt(+Ctrl), first/lastElement, upStaff/downStaff,
  nextTrack/prevTrack, nextMeasure/prevMeasure, first/lastSegmentMM. editing/cmd.ts: Score::move (next/prev chord,
  measure, track) and Score::selectMove. Missing: Score::nextElement/prevElement (Alt+Left/Right with a selection),
  next/prev system/frame/section, note entry mode.
- Hit testing: EngravingItem hitShape/hitBBox/canvasHitShape/hitShapeContains/Intersects (StaffLines' larger hit
  box), Page::items(rect)/itemsAt(point) as the linear equivalent of the BSP tree (same filter; Paint uses it too).
  notation/internal/notationinteraction.ts: hitElements/hitElement/hitMeasure/elementIsLess/elementAt, select
  (ctrl toggle, key/time signatures of all staves), selectAll, clearSelection, moveSelection, addToSelection,
  expandSelection, moveChordNoteSelection, selectTopOrBottomOfChord, the range part of moveElementSelection (restore
  the previous selection), NotationSelectionRange (boundingArea via notation/utilities/scorerangeutilities.ts,
  containsItem/containsPoint) and drawSelectionRange.
  notationscene/notationviewinputcontroller.ts: a left click (press + release logic of mousePress_considerSelect,
  cycleOverlappingHitElements, select on release inside a range, deselect on empty space) and the selection
  shortcuts of shortcuts.xml.
- Drawing: EngravingItem::curColor with the selected state and engraving/internal/engravingconfiguration.ts (voice
  colors #0065BF/#007F00/#C53F00/#C31989, all voices #6038FC, tint 0.6 for invisible items, invisible #808080,
  frame #A0A0A4). Frames (Box) are drawn dashed when not printing (showFrames, like the notation view); the range
  selection frame is drawn by drawPage/drawPageSvg when not printing. Printing output is unchanged (selected items are
  only painted last, like C++ elementLessThan). Verified: drawPageSvg hashes of all compare-baseline pages identical
  before/after for printing:true; printing:false differs only on the 31 pages with frames.
- The readers now call Score::setUpTempoMap() like C++ (the time signature map was empty for loaded files; needed
  for the measure/beat of the status text). No rendering change.
- Status text: notation/internal/notationaccessibility.ts (single element / range / list) and accessibleInfo of
  EngravingItem (type name, formatBarsAndBeats, barbeat), Note (tpcUserName, noteTypeUserName), Rest/MMRest,
  ChordRest::durationUserName, Clef, KeySig, TimeSig, BarLine, TextBase, Dynamic, SpannerSegment, Measure, Accidental,
  Articulation, Breath, Fermata, Hairpin, Jump, Marker, Volta, Ottava, Trill, LayoutBreak, Symbol, Fingering,
  MeasureRepeat, tremolos, Harmony. Translated through mtrc with MuseScore's contexts:
  framework/global/types/translatablestring.ts; gen-typesconv now keeps the TranslatableStrings (context, n) of the
  tables, gen-symids the symbol user names (SymNames::userNameForSymId). Type names are plural forms ("Note(s)",
  n = 1): without MuseScore's en_US translation they show as "Note(s)".
- Public API: hitTest, selectAt, clearSelection, selectAll, moveSelection, hasSelection, selectionInfo,
  selectionBounds (test/selection.test.ts).
- Missing: Note::mark/drop targets, unlinked colors (excerpts), screenReaderInfo/accessibleExtraInfo, note play
  events in the info, layout break/spacer symbols in the view, lasso, dragging, editing.

## 2026-10-20 — Editor: translations, menu bar, toolbars, selection in the view

- Translations: MuseScore's Qt .ts files (share/locale, musescore_* + instruments_*) are served per language by
  musescoreweb/vite-plugin-locales.ts (converted on request, only finished translations, plural forms in CLDR
  order); i18n.ts sets the library's translator (src/framework/global/translation.ts: mtrc/qtrc/arg, %n/%Ln).
  English uses musescore_en_US.ts (plural type names like "Note(s)"). UI strings are MuseScore's source strings with
  their contexts; instrument names use the template id as disambiguation ("flute trackName"). Language in
  Preferences > General ("System default" = browser languages).
- Actions: tools/gen/gen-uiactions.ts generates musescoreweb/actions/uiactiondata.ts from all *uiactions.cpp (code,
  title, description, icon, checkable; static TranslatableString constants and .arg() resolved), iconcodes.h and
  shortcuts.xml/shortcuts_mac.xml (incl. Qt standard keys). actions.ts: registry, enabled/checked state, shortcut
  dispatch (macOS: Qt Ctrl = Cmd); actions without a handler are disabled.
- Menu bar = AppMenuModel without plugins, playback/sounds/mixer/MIDI, cloud/publishing/imports, updates,
  diagnostics, workspaces; keyboard: F10/Alt, arrows, Home/End, letters, Enter, Escape. Open recent = stored scores.
- Toolbars: Notation toolbar (Parts), Undo/redo, Note input (default ToolConfig, customisation popup with
  show/hide, order, separators, reset; note input methods as one button with a menu, tuplet/cross-staff menus,
  "Add" menu), and the viewer's page view toolbar. Three docks (beside the Home/Score tabs, below, above the status
  bar); toolbars are moved by dragging the handle (or Alt+arrows on it, or its menu), hidden via View > Toolbars;
  "Restore the default layout". Layout and note input configuration in the settings.
- Score view: drawn like MuseScore's view (printing: false: selection colors, range frame, frames dashed, invisible
  items grey). Click selects, Ctrl/Cmd+click adds, Shift+click extends to a range, a click on empty staff selects
  the measure; arrows/Ctrl/Shift/Alt navigation, Escape, Ctrl+A; the status bar shows the selection's
  accessibility info (markup of instrument names removed for display).
- Missing: editing commands (no undo stack), note input, palettes/inspector panels, saving.

## 2026-10-21 — Undo stack and editing

- Undo system (editing/undo.ts: UndoStack, UndoMacro with input state and selection restore, UndoCommand with
  filterChildren/cleanup/unwind, changesInfo), editproperty.ts (ChangeProperty, ChangeBracketProperty,
  ChangeTextLineProperty), editstyle.ts (ChangeStyle, ChangeStyleValues), addremoveelement.ts (AddElement,
  RemoveElement, ChangeElement, ChangeParent, ChangeSegmentParent, Link/Unlink), editnote.ts (ChangePitch,
  ChangeFretting, ChangeVelocity), editspanner.ts, editvoicing.ts (ExchangeVoice), editchord.ts (ChangeChordStaffMove,
  SwapCR), editclef.ts (ChangeClefType). EngravingObject.undoChangeProperty is C++'s (changeProperties with
  linkListForPropertyPropagation/propertyPropagation: linked elements of the same score), undoPushProperty,
  EngravingItem.undoChangeProperty (AUTOPLACE). Score: undoStack/cmdState (MasterScore), undo(cmd), dirty(),
  setLayout/setLayoutAll/setLayoutRange (C++ setLayout overload), doLayout/doLayoutRange (scoreRendererHooks);
  cmd.ts: startCmd/endCmd/undoRedo/update; editing/cmdstate.ts: CmdState; dom/mscore.ts: MsError, MScore.setError,
  UpDownMode, nudge steps. triggerLayout (+ Spanner/Measure/MeasureBase/Beam/TremoloTwoChord/Staff overrides);
  Score.addElement/removeElement trigger the layout like C++. The existing edit.ts/editmeasures functions now
  record their changes (doUndoAddElement/undoAddElement/undoRemoveElement, undoGetSegment). Outside of a command
  (loading, createScore, layout during load) changes are applied directly like in C++.
- Partial layout: ScorePageViewLayout::initLayoutContext for a range (from the system of the changed range until
  the layout is stable). Without a triggered range (undo commands of the port without triggerLayout) endCmd lays out
  the whole score. `Score.partialLayout = false` forces full layouts (test/partiallayout.test.ts compares both).
  Over 70 vtest files x 3 edits, two differ: ornament-7 (trill cue note mag 1.0 instead of 0.7 after a partial
  layout) and tie-9 (a natural on a later note in the measure only after the partial layout). An edit in the
  5-page Chopin score took ~350 ms with full layouts.
- InputState (dom/input.ts, NoteVal, NoteEntryMethod); Score.select sets the input track/segment; Score.move and
  selectMove in note entry mode. Note input: dom/noteentry.ts (noteValForPosition, addPitch, addPitchToChord,
  putNote(PointF|Position), handleOverlappingChordRest, getPosition, padToggle), cmd.ts (setNoteRest, makeGap,
  makeGapVoice, splitGapToMeasureBoundaries, changeCRlen (TDuration|Fraction), createCRSequence, expandVoice,
  addInterval, upDown/upDownDelta, toggleAccidental/applyAccidentalToInputNotes/changeAccidental/
  changeNoteAccidental, resolveNoteInputParams, cmdAddPitch, cmdIncDecDuration (list selections),
  cmdPitchUp/Down(Octave), cmdMoveRest, cmdToggleVisible, cmdSet/UnsetVisible);
  notation/internal/notationnoteinput.ts (start/end note input, addNote, padNote, putNote, setInputNote(s),
  moveInputNotes, setAccidental, setCurrentVoice, cursorRect, ...), notationundostack.ts.
- edit.cpp/score.cpp: addRest/setRest/setRests/addChord/addNote/addNoteToTiedChord/addClone, cmdDeleteSelection,
  deleteRange/deleteRangeAtTrack/deleteSlursFromRange/deleteAnnotationsFromRange/deleteOrShortenOutSpannersFromRange,
  deleteItem (notes, rests, accidentals, barlines, tuplets, layout breaks, clefs, texts, spanners, ...), cmdDeleteTuplet,
  removeChordRest, cmdTieNoteList/cmdAddTie/cmdToggleTie/cmdToggleLaissezVib, cmdFlip, undoChangeVisible,
  undoChangePitch/Fretting/Tpc/ChordRestLen/UserMirror/Element/Parent/SpannerElements/StyleVal(ues),
  undoPropertyChanged, cmdEnterRest/enterRest, nextInputPos, changeSelectedElementsVoice, cmdExchangeVoice,
  canReselectItem. Selection.noteList/uniqueNotes/uniqueElements; Note.noteVal/setNval/tpc1default/tpc2default/
  compoundNotes, Chord.selectedNote/updateArticulations (only adds missing articulations).
- Palette drops: acceptDrop/drop of EngravingItem, ChordRest, Chord, Rest, Note, Measure, MeasureBase, Clef,
  KeySig, TimeSig, BarLine, Dynamic, LayoutBreak, Accidental; undoChangeClef, undoChangeBarLineType, addHairpin,
  cmdInsertClef, toggleArticulation/toggleOrnament, cmdToggleLayoutBreak, cmdAddSpanner; NoteHead (dom/notehead.ts);
  NotationInteraction.applyPaletteElement(+ToList/ToRange); the dropped element is cloned (C++ copies via mime data).
- NotationInteraction editing methods (deleteSelection, movePitch, flipSelection, toggleVisible, addTieToSelection,
  putRest, changeAccidental, increaseDecreaseDuration, changeSelectedElementsVoice, changeProperty/resetProperty
  for an inspector, undo/redo) and notationscene/notationactioncontroller.ts (action codes, enabled conditions,
  NoteInputBarModel's checked states). A click in note input mode enters a note (putNote).
- Public API: executeAction, notationActionCodes, isActionAvailable/Enabled/Checked, isCheckableAction, undo/redo,
  canUndo/canRedo, undoStackInfo, isModified, markSaved, noteInputState, noteInputCursorBounds, selectionProperties,
  changeSelectionProperty, resetSelectionProperty, createPaletteElement, paletteElementName, applyPaletteElement.
  drawPage/drawPageSvg(printing: false) draw the note input cursor.
- Editor: musescoreweb/actions/notationactions.ts registers the notation actions (MuseScore's shortcuts: N, A–G,
  Shift+A–G, 1–9, 0, ., arrows, Ctrl/Cmd+Z, Delete, Escape, X, V, Ctrl+Alt+1–4, ...); scoreview.ts: scoreChanged()
  (rebuild pages if the page count changed, repaint, status bar, scroll), ScoreViewState.modified/noteInput/revision;
  note input toolbar buttons show the checked state.
- SVG output: values rounded to 0 are written without sign ("-0" -> "0").
- Tests: test/undo.test.ts, edit.test.ts, noteinput.test.ts, palette.test.ts, partiallayout.test.ts,
  api-edit.test.ts (undo/redo of each command compared via test/helpers.ts scoreHash), e2e keyboard editing.
- Missing: excerpts/linked staves in the undo functions (Staff.staffList() is the staff itself), repitch/insert/
  real-time note input, tuplets, slurs (doAddSlur), copy/paste (mime data), range duration changes, rewriteMeasures
  (time signatures with another length), regroupNotesAndRests, tie jump points, lyrics editing, text editing,
  playback (setPlayNote), error messages (checkAndShowError), shadow note.

## 2026-10-21 — Editor panels

- Panel area left of the score (musescoreweb/panels): tabs Palettes / Layout / Properties like NotationPage's
  DockPanels (dock names palettesPanel, instrumentsPanel, inspectorPanel), the current tab bold with its context menu
  ("…": the panel's items + "Close"), actions toggle-palettes (F9), toggle-instruments (F7), inspector (checkable,
  View menu), keyboard navigation of the tabs, resizable splitter (MuseScore: fixed 300 px). Open panels, current tab
  and width in the settings; "Restore the default layout" resets them. Panels keep their unmodified keys
  (actions.ts, scoreview.ts ignore them).
- editbridge.ts: every score change of the panels; stubs (return false, controls disabled) until the editing port:
  applyPaletteElement(score, element, {shift, ctrl}), applyInspectorChanges(score, changes),
  changeSelectionProperty/resetSelectionProperty(score, pid[, value]) (unused by the inspector), setPartVisible,
  setStaffVisible(staffId), removeParts, removeStaves(staffIds), moveParts, moveStaves, addStaff, addInstruments,
  addSystemObjects, removeSystemObjects, moveSystemObjects, moveSystemObjectLayerBottomStaff, setScoreOrder.
  scoreview: selectionVersion/scoreVersion in ScoreViewState, scoreContentChanged().
- Palettes (src/palette): PaletteTree/Palette/PaletteCell, palettecreator (all 29 default palettes + master palettes
  with "More" cells), PaletteCellIconEngine/EngravingItemPreviewPainter; rendering/single (SingleLayout, SingleDraw)
  for standalone items on gpaletteScore (dom/palettescore.ts); new dom classes ActionIcon, NoteHead,
  PlayTechAnnotation. API: defaultPalettes, masterPalettes, morePaletteCells, paletteCellElement, drawPaletteCell.
  UI: header with search and "Add palettes" popup, expandable palettes, cell grids (canvas per cell, grid lines,
  translated tooltips), More popup, keyboard (arrows in the grid, Enter applies, Escape back to the header), panel
  menu (single click to open, one palette at a time, collapse/expand all), state in settings.palettes.
  Deviation: ActionIcon cells and layout breaks are drawn by the UI as icon font glyphs.
  Missing: bagpipe embellishments, harp pedal diagrams, capo, string tunings, tapping, chord brackets, handbells
  text articulations, fretboard chord diagrams (only "Blank"), custom palettes, palette files, drag and drop,
  cell/palette properties dialogs.
- Layout panel (src/instrumentsscene): LayoutPanelTreeModel with RootTreeItem/PartTreeItem/StaffTreeItem/
  StaffControlTreeItem/SystemObjectsLayerTreeItem, move/remove availability, selection model; the score selection
  selects the rows of its parts (one way, like 4.7). UI: Add menu (instruments dialog reusing ChooseInstrumentsPage,
  system markings), up/down/remove, eye buttons, expand, settings popup (read-only), WAI-ARIA tree keyboard,
  tab menu (instrument ordering, collapse/expand all). Score::appendPart/appendStaff assign ids like C++.
  Missing: drag and drop, excerpts, staff/system markings settings popups, replace instrument.
- Properties panel (src/inspector): InspectorListModel with General (+ Playback/Appearance popups), Measures,
  Notation (Note with Head/Chord/Stem/Beam tabs, Clef, Key/Time signature, Barline, Dynamics, Articulation,
  Fermata, Tempo, Tuplet, Accidental, Spacer, Section break, Rest, Hairpin, Slur/Tie...), Text, Score display/
  appearance sections; PropertyItem values with undefined (mixed) / styled / modified state. The library computes
  the changes (inspectorPropertyChanges/Resets, inspectorArrangeChanges) which the bridge applies.
  inspectorSelectionProperties(score, pids) reads properties of the selection. Missing: empty staves and parts
  sections, other notation models (ornaments, other lines, frames, frets, bends, lyrics, chord symbols), font list,
  notehead grid, the show-* / page-settings / measure actions the sections link to (no handlers yet).
- Tests: test/palette.test.ts, layoutpanel.test.ts, inspector.test.ts; e2e for the panels (musescoreweb.e2e.ts).

## 2026-10-21 — Writer

- Score writer ported: rw/write (Writer incl. WriteScoreHook, TWrite, MeasureWrite, StaffWrite, ConnectorInfoWriter,
  WriteContext), rw/xmlwriter.ts (XmlWriter, propertyToString), framework/global/serialization/xmlstreamwriter.ts
  (indentation quirk of closing tags, doubles like TextStream: %g with 6 digits, "-0"), rw/mscsaver.ts (MscSaver:
  score_style.mss, main .mscx, Excerpts/<n>_<name>/*.mss|mscx, chordlist.xml), infrastructure/mscwriter.ts (zip via
  fflate, META-INF/container.xml). MStyle.save/write (styledef order with the C++ palmMute/whammyBar swap), ScoreOrder.write,
  Drumset.save, ChordList.write, SynthesizerState (read + write), EID/EIDRegister (EIDs of the file are kept, new ones
  random), LinkedObjects mainElement, EngravingItem.isUserModified (+ Chord, HOPO text/segment overrides).
- API: writeMscx(score) (main .mscx, version 4.70 / 4.7.5 / 3654226) and saveMscz(score, fileName?). Both lay the score
  out first if needed (MuseScore saves laid out scores; multimeasure rests are written from the layout).
  loadScore/createScore mark the score open and add the empty cloud meta tags like NotationProject.
- Excerpts (parts) of 4.x files are read now (MscLoader, Excerpt class, MasterScore.excerpts/initParts, part scores with
  a master score, <linked>/<linkedMain> links of read410 shared between master and parts) and written.
- Instrument MIDI data is kept (channels with program/bank/volume/pan/..., synti, color, MIDI actions, articulations),
  singleNoteDynamics, glissandoStyle; read206 fallback channel and recognizeMidiProgram.
- Reader fixes found by the comparison (render output only improved, compare:all baseline updated for 8 pages):
  read400 BeamMode begin32/begin64 renaming (< 4.10), note parenthesis symbols of < 4.6 files, glissando subtype/text of
  < 4.10 files, PARENTHESES_MODE/PLAYTECH_TYPE property values, html staff names (HtmlParser), CustomDashLine = 6,
  instrument clef list filled with G, Part ids assigned on appendPart, <open>, hammer-on/pull-off texts, percussion
  note order before <NoteParenGroup>, FBox part-linking defaults, Dynamic VELO_CHANGE, Measure.fillGap uses
  toRhythmicDurationList, propertyValueEquals with the C++ hacks (bool/int, Spatium/real, fuzzy reals).
- Tools: `npm run roundtrip` (839 baseline scores: 657 identical, 172 equal within 6-digit rounding, 10 differing — all
  10 verified to render differently in MuseScore too after its own re-save, e.g. a lost unterminated volta,
  2.x VBox gap, glissando text of 2.x files; second round trip always exact), `npm run compare:mscx` (740/839 main files
  textually identical to MuseScore's re-save after EID normalization, 834/839 styles).
- Known gaps: (element types, MIDI mapping, note play events and images: see "Late element types" below)
  audio/thumbnail in the .mscz, project files (audiosettings/viewsettings.json), excerpts of pre-4.0 files, clipboard/selection writing, a parts style difference of
  a 4.0 file (mmrest-15), generated parentheses of tab bend notes, pedal ROSETTE end hook of 4.2 files.

## 2026-10-21 — Integration: panels edit, saving

- The panels' edit bridge (`musescoreweb/panels/editbridge.ts`) uses the editing API: palette cells go through
  `applyPaletteElement`, the Properties panel through the new `applyInspectorChanges(score, changes)` (one undo command
  "Edit %1" / "Reset %1" like AbstractInspectorModel::setPropertyValue / onPropertyValueReset; `changeVisible` through
  Score::undoChangeVisible). TODO(port): the `addParentheses` / `removeParentheses` inspector commands and all Layout
  panel commands (NotationParts: visibility, add/move/remove parts and staves, system markings, score order) — their
  controls stay disabled (`canEditParts` is false).
- ScoreViewState: one counter `scoreVersion` for score changes (commands, undo, redo, new score) and `selectionVersion`;
  the panels and toolbars follow them. The notation tab shows "*" before the title while there are unsaved changes
  (NotationSwitchButton).
- Saving: File > Save (Ctrl+S) writes an .mscz with `saveMscz` and stores it in IndexedDB as the score's content
  (a score that is not stored any more gets a new entry), then `markSaved`. File > Save a copy downloads the .mscz.
  Closing a modified score asks like ProjectActionsController::askAboutSavingScore (Save / Don't save / Cancel);
  leaving the page with unsaved changes triggers the browser's question. Entries of new scores created before the
  writer existed (stored as NewScoreOptions) still open. Not done: Save as / Export dialogs, autosave.
- `npm test` only scans `test/` (the agent worktrees in `.claude/` contain copies of the tests).

## 2026-10-21 — Note parentheses

- EditChord (editchord.ts) is complete for the chord parentheses of notes: addChordParentheses / removeChordParentheses
  (splitting a group when a middle note is removed), linked chords, and the undo commands AddNoteParenthesisInfo,
  RemoveNoteParenthesisInfo, RemoveSingleNoteParentheses; Chord.addNoteToParenthesisInfo / removeNoteFromParenthesisInfo;
  Note::setParenthesesMode removes parentheses too.
- cmd.ts: Score.cmdAddParenthesesToNotes / cmdRemoveParenthesesFromNotes (getNotesByChord: all notes between the
  selected ones of a chord), cmdToggleParenthesesOnNotes, cmdToggleParentheses, cmdAddBracket, cmdAddBraces;
  NotationInteraction.addBracketsToSelection with the actions "add-parentheses", "add-brackets", "add-braces".
- Properties panel: "Notehead parentheses" applies like NoteheadSettingsModel ("Add/Remove notehead parentheses";
  resetting HAS_PARENTHESES of notes resets the chord parentheses).
- Rendering: Accidental::parentNoteHasParentheses (no accidental brackets inside note parentheses) and the parentheses
  around the cue note of trills (Ornament::updateCueNote) are ported.
- Tests: test/parentheses.test.ts (undo/redo restore the SVG of all pages; hashed without selection, because selected
  items are painted last).

## 2026-10-21 — Layout panel editing (NotationParts)

- `src/notation/internal/notationparts.ts` (NotationParts) and `masternotationparts.ts` (MasterNotationParts): setParts,
  setScoreOrder, setPartVisible, setStaffVisible (doSetStaffConfig: ChangeStaff + ChangeStaffType), appendStaff,
  removeParts/doRemoveParts/removeMissingParts, removeStaves, moveParts, moveStaves, add/remove/moveSystemObjects,
  moveSystemObjectLayerBelow/AboveBottomStaff, updateSoloist (SetSoloist), sortParts (SortStaves), going through the
  notation's undo stack (startEdit/apply of the NotationInteraction; without interaction, e.g. createScore, the changes
  are applied directly). MasterNotationParts locks the undo stack for the global edit and applies removeParts,
  removeStaves, setParts and moveSystemObjects to the part scores too (NotationParts of the excerpt scores, recorded in
  the master command); removing the initial part of an excerpt deletes the excerpt (MasterScore::deleteExcerpt,
  RemoveExcerpt; editing/editexcerpt.ts with AddExcerpt). MasterNotation.parts() returns MasterNotationParts.
- editing: `editpart.ts` (InsertPart, RemovePart, SetSoloist, EditPart: setPartVisible, setStaffVisible, removeParts,
  removeStaves, moveParts, moveStaves, add/remove/moveSystemObjects, doAppendStaff/appendStaff, setScoreOrder),
  `editstaff.ts` (InsertStaff, RemoveStaff, Add/RemoveSystemObjectStaff, Insert/RemoveMStaff, Insert/RemoveStaves,
  SortStaves, ChangeStaff, ChangeStaffType, Measure::cmdAddStaves/cmdRemoveStaves), `editbrackets.ts` (AddBracket,
  RemoveBracket: brackets are undoable now, also in ScoreOrder::setBracketsAndBarlines), `editscoreproperties.ts`
  (ChangeScoreOrder). edit.ts: undoInsertPart/undoRemovePart, undoInsertStaff (with measures now)/undoRemoveStaff,
  undoAddBracket/undoRemoveBracket, cmdRemovePart, cmdRemoveStaff, adjustBracketsDel/Ins, updateBracesAndBarlines.
  EngravingObject.undoUnlink is undoable (Unlink command, replaced by addremoveelement.ts).
- dom: Score.removePart, insertStaff (spanner tracks moved down), removeStaff, updateStavesNumberForSystems,
  removeSystemObjectStaff, sortStaves/sortSystemObjects; Measure.insertStaves/removeStaves/insertMStaff/removeMStaff/
  sortStaves; Segment.insertStaff (annotations)/removeStaff/sortStaves; Part.removeStaff; utils
  allowRemoveWhenRemovingStaves, moveDownWhenAddingStaves, collectSystemObjects; BracketItem BRACKET_COLUMN uses
  Staff::changeBracketColumn (so a new score's thin bracket under a thick one is at column 2 like C++);
  Lyrics::remove/removeFromScore and LyricsLine::removeUnmanaged (separators are removed with their lyrics); Ottava
  add/remove update the staff's pitch offsets.
- API (src/index.ts, section "parts and staves"): setPartVisible, setStaffVisible, removeParts, removeStaves,
  moveParts, moveStaves, appendStaff, addSystemObjects, removeSystemObjects, moveSystemObjects,
  moveSystemObjectLayerBottomStaff, setScoreOrder(orderId | 'custom'), setInstruments(score, [{partId} |
  {instrumentId}], orderId?) (INotationParts::setParts), addInstruments(score, templateIds) (inserted where the score
  order sorts them). All return true if an undoable command was recorded.
- Editor: editbridge.ts calls these, canEditParts is true; the Layout panel's model is reloaded after every change of
  the score (scoreVersion) and keeps the expanded rows and, after a change made by the panel, the selected rows.
- Deviations (for exact undo): the SpannerMap keeps spanners of the same tick in the order they were first added (a
  spanner added again by undo gets its old place; C++ appends it); AddBracket::undo restores the replaced bracket
  (C++ sets NO_BRACKET; removing a piano moved its brace to the next staff and undo lost that staff's bracket);
  removing a staff removes its TimeTickAnchors undoably; a spanner segment removed from its system is detached from it
  (C++ keeps it in the system's list, ~System detaches it).
- Like MuseScore, hiding a part also hides its staves (two undo commands, the Layout panel items' isVisibleChanged).
  Some layout results depend on the previous layout pass (cross-staff beams), so after undo a real score can differ
  until the next layout; the tests compare real scores after one more layout.
- Tests: test/notationparts.test.ts (every command with undo/redo on created and real scores, part scores);
  e2e: the Layout panel hides a part, undo, removes and adds instruments.
- Missing (TODO(port)): appendLinkedStaff / "Add linked staff" (Excerpt::cloneStaff), adding staves to part scores
  (appendStaffLinkedToMaster, cloneStaff2), AddPartToExcerpt, insertPart/replacePart/replaceInstrument/replaceDrumset,
  setPartSharpFlat, instrument names, setVoiceVisible, staff type/config other than visibility, reflectTransposition-
  InLinkedTab, EditSystemLocks::removeSystemLocksContainingMMRests, remapBracketsAndBarlines for part scores, the
  notifications (partsChanged etc.), the instruments dialog listing the existing instruments (it only adds), part
  scores are not laid out after a change, rebuildMidiMapping/markInstrumentsAsPrimary (playback).

## 2026-10-21 — Note input methods, tuplets, slurs, lines, shadow note

- Note input methods (all of NoteInputBarModel's NOTE_INPUT_METHOD_ACTIONS are registered: note-input-rhythm,
  -repitch, -realtime-auto, -realtime-manual, -timewise; toggle-insert-mode Ctrl+I): noteentry.ts Score::repitchNote,
  repitchReplaceNote (ties kept forward, chord lines, forced accidentals), insertChordByInsertingTime (insert/timewise:
  undoInsertTime + InsertTime + ChangeMeasureLen + segment ticks, rests filled in all tracks, crossing chords split
  with ties); wired into addPitch/putNote/cmdAddPitch ("insert-c".. Ctrl+Shift+C.., mouse Ctrl+click). Rhythm-only
  input already worked through padToggle. ChangeMeasureLen and InsertTime (editmeasures.ts) are undo commands now
  (callers that are not undoable yet still call redo() directly).
- Real-time input: notation/internal/notationmidiinput.ts (NotationMidiInput::onRealtimeAdvance, the automatic mode's
  timer with the 750 ms default delay, doRealtimeAdvance without the 100 ms metronome delay) and cmd.ts
  Score::realtimeAdvance; "realtime-advance" (Enter). There is no MIDI input: notes are entered with the note name keys,
  which (like in MuseScore, putNote) move the cursor; activeMidiPitches is always empty (rests at the new position).
  API onNotationChanged(score, listener) for the timer's changes; the editor redraws on it.
- Tuplets: edit.ts Score::addTuplet, cmdCreateTuplet; NotationInteraction canAddTupletToSelectedChordRests /
  addTupletToSelectedChordRests (TupletOptions in notationtypes.ts with Tuplet::computeTupletDenominator), NotationNoteInput
  ::addTuplet (note input: changeCRlen to the input duration, then the tuplet); actions duplet..nonuplet (Ctrl+2..9)
  with the style's bracket/number types. Not ported: custom-tuplet (action data), tuplet-dialog (OtherTupletDialog),
  the "Cannot create tuplet" message box.
- Slurs: Score::addSlur (follows tied chains), ChordRest::slur (module augmentation in edit.ts),
  NotationInteraction::addSlurToSelection/doAddSlur (range: per track, single note: to the next chord, list: first to
  last) also for palette slurs; in note input S starts a slur at the last note, addPitch extends it, S ends it
  (resetSlur); "add-slur" is checked while one is open. Not ported: partial slurs over repeat bar lines
  (incoming/outgoing), hammer-on/pull-off templates, startEditGrip after adding (the segment is only selected).
- Lines: Score::addHairpins / addHairpin(type, cr1, cr2) (= addHairpinOfType) / addHairpin(type, ticks, track)
  (= addHairpinAtTicks), cmdAddOttava; EngravingItem::setInitialTrackAndVoiceAssignment (dynamicsApplyToAllVoices
  default); actions add-hairpin (Shift+,), add-hairpin-reverse (Shift+.), add-8va, add-8vb.
- More actions: grace notes (Score::setGraceNote/cmdAddGrace, Chord::setShowStemSlashInAdvance/requestShowStemSlash;
  acciaccatura, appoggiatura, grace4/16/32, grace8/16/32after), beams (cmdSetBeamMode: beam-auto/none/break-left/
  break-inner-8th/16th/join), intervals (addIntervalToSelectedNotes: interval2..10, interval-2..-10, Alt+digits),
  full-measure-rest (cmdFullMeasureRest), set-visible/unset-visible, articulations (add-staccato/tenuto/sforzato/
  marcato with Shift+S/N/V/O, add-up-bow/down-bow: Chord::updateArticulations is now complete incl. Remove mode and
  splitting combined articulations, splitArticulations/flipArticulations/updateArticulations (= updateArticulationIds)
  of articulation.cpp, NotationInteraction::toggleArticulationForSelection, NotationNoteInput::setArticulation),
  lv (laissez vibrer). Checked states of the note input toolbar: add-slur, the four articulations, lv.
- Shadow note: dom/shadownote.ts (ShadowNote), TLayout::layoutShadowNote, TDraw::draw(ShadowNote),
  Score.shadowNote(), NotationInteraction::showShadowNoteForPosition/doShowShadowNote/hideShadowNote/shadowNoteRect
  (color: EngravingConfiguration.highlightSelectionColor = QColor::lighter(135) of the voice color),
  NotationViewInputController hoverMove/hoverLeave and the right click in note input mode (removeNote). API:
  showShadowNote(score, page, x, y) -> bounds, hideShadowNote, drawShadowNote(score, page, ctx, {dpi, region}),
  rightClickAt. Editor: the shadow note is drawn on a small overlay canvas over the page at the mouse position;
  keyboard input hides it until the mouse moves (like MuseScore); a right click in note input removes the note.
- Editor: the note input method button shows the method in use; the new actions use MuseScore's shortcuts from the
  generated table (Ctrl+2..9, S, Shift+,/., Ctrl+Shift+I, Ctrl+I, Enter, Shift+S/N/V/O, Alt+1..9, ...).
- Checked against MuseScore: a score built with these commands (triplet, quintuplet, slurs, hairpins, 8va, grace
  note, interval, beams) saved with saveMscz and re-saved by mscore differs only in the order of two spanners starting
  at the same tick; its rendering matches MuseScore's at 1.6 % (stem positions of very high chords).
- Tests: test/noteinputmethods.test.ts (each feature with undo/redo restoring the SVG hash of all pages), e2e
  "enters a triplet and a slur by keyboard, re-pitches notes and enters notes with the mouse".
- Missing: regroupNotesAndRests (realtimeAdvance across bar lines), MIDI input, metronome, tuplet dialog,
  custom-tuplet, add-noteline, chord symbols/text (other agent), the shadow note popup (percussion), TAB shadow notes
  and string selection, the error message boxes (checkAndShowError), playback of entered notes.

## 2026-10-21 — Copy/paste, text and lyrics editing, dragging

- Copy/paste: Selection::mimeType/mimeData/staffMimeData/symbolListMimeData/canCopy (dom/select.ts), EngravingItem
  mimeData + readType/readMimeData (dom/paste.ts), Score::cmdPaste/cmdPasteSymbol/cmdPasteStaffList/cmdPasteSymbolList,
  pasteStaff/pasteChordRest/pasteSymbols, cmdRepeatListSelection (dom/paste.ts), Read460::pasteStaff/pasteSymbols/
  doReadItem, ConnectorInfoReader paste mode (spanners added through the undo stack, Score receiver), Score::makeGap1
  (cmd.ts section), Transpose::transposeChord, Measure::undoGetChordRestOrTimeTickSegment, Chord/ChordRest::removeMarkings,
  SelectionFilter element types (setFiltered/isFiltered/canSelect), Writer::writeSegments/doWriteItem with a filter.
  rw/rwregister.ts gives the DOM the reader/writer (and new XmlWriters) without import cycles.
  NotationInteraction: copySelection, pasteSelection(scale) (incl. pasting into an edited text / lyrics syllables),
  swapSelection, repeatSelection; actions action://notation/copy|cut|paste, notation-paste-half/-double/-special,
  notation-swap (Ctrl+Shift+X), repeat-sel (R). The clipboard is framework/global/clipboard.ts (in-memory MimeData);
  API clipboardContents/setClipboardContents/selectionMimeData.
  MuseScore's own tests reproduce exactly (staves of writeMscx vs the -ref files): copypaste01-12, 19, 22-27, 50,
  copypasteNote01-10 and the copypastesymbollist tests (articulation, ornament, chord names, lyrics, staff text,
  tremolo, rests, ranges) — test/copypaste.test.ts.
- Text editing: TextCursor movement/selection (movePosition, set, selectWord, cursorRect, selectedText, ...), TextBlock
  remove/removeRange/split/simplify/column/boundingRect, editing/textedit.ts (TextEditData, ChangeTextProperties,
  InsertText, RemoveText, SplitText, JoinText; TextBase startEdit/edit/isEditAllowed/endEdit (one undo step merged
  with adding the text, empty texts removed), insertText/insertSym/paste/deleteSelectedText/endHexState), Lyrics
  (isEditAllowed, endEdit, adjustPrevious, paste), Harmony (startEdit as plain text, edit, endEdit -> setHarmony),
  TextBase select/mousePress/dragTo/editCopy/editCut/nudge. UndoStack.undo respects TextEditData.startUndoIdx.
  NotationInteraction: startEditText, editText (input method commit/preedit), editElement/isEditAllowed (key events),
  doTextEdit (curly quotes), endEditText, selectText, addText/addTextToItem (Score::addText for staff/system text,
  expression, dynamics, rehearsal marks with createRehearsalMarkText, fingering, chord symbols, lyrics, tempo),
  lyrics navigation (navigateToLyrics, navigateToNextSyllable, addMelisma, addLyricsVerse, navigateToLyricsVerse,
  moveLyrics), chord symbol navigation (navigateToNearHarmony, navigateToHarmonyInNearMeasure), toggleBold/... ,
  nudge (arrows on a selected text). Actions: staff-text (Ctrl+T), system-text, tempo, rehearsalmark-text,
  chord-text (Ctrl+K), lyrics (Ctrl+L), title/subtitle/composer/poet/part/frame/expression/fingering texts,
  next-syllable (-), add-melisma (_), next-word (Space), next/prev-lyric-verse, add-lyric-verse, edit-element (F2),
  edit-text (Enter), text-b/i/u/s/sub/sup. EditModeRenderer draws the text cursor, selection (translucent instead of
  HardLight) and frame; drawPage(printing: false) paints it (and grips, lasso).
- Drag: EngravingItem startDrag/drag/endDrag (offset through undoPropertyChanged), getDragGroup/ElementGroup,
  startEdit/edit/isEditAllowed/endEdit, grips (startDragGrip/dragGrip/endDragGrip, gripsPositions, nextGrip/prevGrip),
  Note drag (vertical: pitch, horizontal: leading space), LineSegment grips and drag (hairpins, lines), SlurTieSegment/
  SlurSegment grips, Lasso (dom/lasso.ts) with Score::lassoSelect/lassoSelectEnd. NotationInteraction startDrag/drag/
  endDrag/doDragLasso/endLasso, grip edit (startEditGrip, isHitGrip, endEditGrip), handleKeyPress (arrow nudging of
  edited elements and grips), nudgeAnchors. NotationViewInputController: mousePressEvent/mouseMoveEvent/
  mouseReleaseEvent/mouseDoubleClickEvent (triple click selects the text), keyPressEvent, shortcutOverrideEvent,
  inputMethodEvent; API viewMousePress/Move/Release/DoubleClick, viewKeyPress, viewShortcutOverride, viewInputText,
  textEditingInfo, isDragging, isTextEditingAction.
- Editor: the view sends the pointer events to the library (drag, grips, lasso with Shift on empty space, double
  click edits a text, empty space moves the canvas); a hidden textarea at the text cursor gets the keys while a text
  is edited (input method compositions and dead keys work); actions.ts asks the view first (setShortcutOverride, like
  MuseScore's shortcutOverrideEvent) and chooses among actions with the same shortcut an enabled one of the higher
  context priority (text editing actions: "-" is next-syllable while editing lyrics, else flat). Copy/cut/paste are
  the browser's clipboard events with MuseScore's mime types as DataTransfer formats; the in-memory clipboard is the
  fallback (and the Edit menu's Paste). The menus show Ctrl+C/X/V for the notation's copy/cut/paste.
- cmd.ts endCmd: a rolled back command that changed something is laid out (removing an empty new text left a stale
  layout).
- Tests: test/copypaste.test.ts, textedit.test.ts, drag.test.ts (undo/redo restore the SVG of all pages); e2e: copy a
  measure and paste it, add a staff text and type, lyrics on two notes, drag the title, lasso.
- Known: after a command + undo, some real scores (Amazing Grace) paint slur/tie segments of a system in another
  order than after a full layout (same SVG content, other order; a full relayout restores it) — the e2e tests compare
  states, not pixels, for undo.
- Missing (TODO(port)): rebasing line anchors while dragging (MoveElementAnchors, time tick anchors), changing slur/line
  anchor notes by dragging grips, the slur shoulder grip, bar line/beam/bracket/box grips, dynamics grips (hairpin from
  a dynamic), anchor lines, outgoing drags of elements/ranges, Alt+click paste of a range, drag and drop of palette
  items onto the score, image paste, figured bass, sticking, instrument change text (dialog), partial lyrics dashes and
  melismas at repeats, FSymbol drops into texts, the text style popup and text toolbar, copyLyrics,
  TempoText::updateTempo (playback tempo), prev/next-element navigation into texts (navigateToNearText).

## 2026-10-21 — Time signature changes that rewrite measures

- Score::cmdAddTimeSig complete (deselectAll, local (ctrl) time signatures, measure repeat groups, errors unwind the
  command): Score::rewriteMeasures (both overloads as one TS overload: up to the next time signature/section break incl.
  frames and section break restore, and a measure range; the local variant only changes measure rest durations),
  Score::undoRemoveMeasures, the complete Score::undoInsertTime (also removing time), Measure::adjustToLen (measures
  with notes: removing/appending chords and rests, slurs, selection).
- dom/range.ts: TrackList and ScoreRange of range.cpp (read/write of segments with accumulated rests and tied chords,
  tuplets incl. splitting in the middle at a new barline (generated second half) and CANNOT_SPLIT_TUPLET,
  CORRUPTED_MEASURE, clefs, key signatures, other segment elements, annotations, spanners (voltas, slurs on grace notes,
  measure-anchored), incoming ties, barlines, layout breaks, repeats, spacers, jumps and markers; glissandi/bends via
  cloneAndRebuildSpanners). TODO(port): linked staves (Excerpt::cloneStaff2), EngravingItem::reset of a measure repeat copy.
- editmeasures.ts: InsertRemoveMeasures/RemoveMeasures/InsertMeasures (removeMeasures: beams, systems, empty systems and
  pages, unmanaged spanners), ChangeMeasureLen, InsertTime, InsertTimeUnmanagedSpanner (+ Spanner.insertTimeUnmanaged)
  are undo commands now; insertBox/insertMeasure/adjustToLen push them through the undo stack. edittremolo.ts:
  MoveTremolo. MeasureBaseList.removeRange (C++ remove(fm, lm)), Score.isSpannerStartEnd, Rest.hack_toRestType.
- C++ copy constructors (onCloned) of Chord (notes, grace notes, articulations, stem/hook/stem slash, arpeggio,
  tremolos, chord lines/brackets, note parentheses; members C++ does not copy reset), ChordRest (lyrics deep copy, no
  beam/el), Rest (dots, dead slapped), DurationElement (no tuplet), Tuplet (no elements/number), Lyrics (no separator):
  the generic clone was shallow (a cloned chord shared its notes with the original). Chord/ChordRest.removeMarkings.
- ChordRest.removeDeleteBeam removes empty beams/hooks through the undo stack (doUndoRemoveElement) like C++.
- Tests: test/timesig.test.ts (a text notation -> 4.x .mscx generator; 3/4 on 4/4 with ties/two staves, mid-score with
  incoming tie and voice 2, further changes, tuplet split + error rollback, barlines/repeats/breaks/clefs/key
  signatures/annotations, slurs, mm rests, pickup, local time signatures + errors, 13 vtest scores with the note attacks
  preserved; every change undo/redo compared with the SVG hash of all pages). MuseScore cannot apply a time signature
  from the command line (plugins/extensions need the user's plugin folder), so the results are checked structurally
  against the C++ algorithm.
- Sweep over ~350 vtest scores (5/8 dropped on measure 2): no exceptions; the remaining undo/redo differences are C++
  behavior: beams with user properties in the removed measures are lost on undo (removeDeleteBeam in removeMeasures),
  lyrics lines in the range (removeUnmanaged not restored), drawing order of equal annotations/spanners (re-added in
  reverse), a clef in the last rewritten measure lost on redo when its end barline segment is restored (InsertMeasures
  collects clefs before lm->last()), ties across cross-staff chords, the local time signature check only looks at
  staff 0 in the last measure (then CORRUPTED_MEASURE).

## 2026-10-21 — Partial layout == full layout

- Root causes of the differences between a partial layout (only the changed range) and a full layout: the port kept
  state that C++ drops with the RootItem tree. A full layout now resets the layout data of everything (measures, mm
  rests, spanners and their segments; rendering/score/passes.ts PassResetLayoutData) like C++ where
  ScorePageViewLayout::prepareScore deletes systems/pages; System.destroy detaches its remaining children (~System),
  ScoreLayout's layoutFinished destroys dropped systems; beams are reset in a full layout. Score.addSpanner/
  removeSpanner compute/clear the start/end elements (starting/ending spanners of chords), Spanner.setProperty
  triggers the layout, Score.removeElement leaves spanner segments in their systems like C++ (detached when the
  system is destroyed), Lyrics.removeFromScore (+ prevLyrics through dom/navigate.ts), LyricsLine.removeUnmanaged,
  TLayout.layoutBarLine lays out the barline fermata. ornament-7 (cue note mag) was the shared state of the shallow
  Chord clone (fixed by the Chord copy constructor); tie-9 is a non-idempotent layout in C++ as well.
- test/partiallayout.test.ts edits two instances of a score in parallel (one with partial, one with full layouts)
  and compares the sorted SVG lines; ~150 vtest scores x 3 edits by default (PL_COUNT, PL_ALL_EDITS, PL_SLICE env);
  the remaining C++-equivalent differences are listed with their reasons in KNOWN_EXCEPTIONS (the "rangeDone" restore
  of the next system's first measure, page fill with stale heights, unused slur segments, ...).

## 2026-10-21 — Editor: Save as, saving to the computer, autosave

- File > Save as (`file-save-as`, Ctrl+Shift+S) shows "Save score" (dialogs/SaveScoreDialog.tsx, after
  SaveToCloudDialog.qml: "Name", "Save to computer", "Cancel", "Save"); the name defaults to the title of a new score or
  the file name (ProjectConfiguration::defaultSavingFilePath). "Save" stores the score as a new entry in IndexedDB
  (`addScore(..., asNew)`, no reuse by hash) and the open score refers to it (the old entry keeps its last saved
  version); for a new score the entry of the new score becomes the saved score (MuseScore drops the temporary file).
  "Save to computer" also writes the .mscz: `showSaveFilePicker` when available (the handle is kept in the entry, so
  File > Save writes the file back after `requestPermission`), otherwise a download (`files.ts`).
- New scores are unsaved (NotationProject::markAsNewlyCreated: "*" in the tab, the close/leave questions) and File >
  Save on a score never saved goes through Save as (`CurrentScore.newlyCreated`: the entry's content is still the
  NewScoreOptions). Library: `markUnsaved(score)` (UndoStack.setUnclean, C++ m_hasNonUndoStackChanges) keeps the score
  modified until markSaved, also after undo.
- File > Open uses `showOpenFilePicker` when available (handle -> Save writes the file back; .mscz only), otherwise the
  file input. File > Save a copy saves "<name> - copy.mscz" (picker or download).
- Opening another score (file, URL, home screen, new score) first closes the open one like
  ProjectActionsController::closeOpenedProject (asks to save a modified score; Cancel keeps it).
  The questions (save changes, save as, restore session) are promises (`ask` / `answerDialog` in session.ts).
- Autosave (autosave.ts = ProjectAutoSaver): a single-shot timer (settings `project.autoSaveEnabled` /
  `autoSaveInterval`, defaults true / 5 min as in ProjectConfiguration::init of 4.7.5) saves the modified open score
  (needAutoSave: changed since the last autosave) to the `autosaves` table (Dexie version 2); `update()` removes the
  autosave when the score is saved, closed without saving, undone to the saved state or another score is opened.
  Web addition: also saved when the page becomes hidden. Preferences > "Save & publish" > "Auto save every … min".
- Recovery: at startup (without ?url) left-over autosaves ask "The previous session quit unexpectedly." / "Do you want
  to restore the session?" (StartupScenario::restoreLastSession): Yes opens the score with its autosave, No removes the
  autosaves. Opening a stored score with an autosave loads the autosave (ProjectActionsController::loadProject) and
  marks it unsaved; an autosave older than the saved score is dropped. Opening a file from the computer that is the same
  stored score drops its autosave.
- Tests: test/savefiles.test.ts (file names), api-edit (markUnsaved); e2e: Save as of a new score, reload, a second
  Save as, Save to computer (download fallback), Save a copy; autosave with a 1.2 s interval, restore Yes/No, removal on
  close/save/undo, the preference.
- Missing: saving a selection (`file-save-selection`), the cloud, Export, "Revert to last saved", backups, saving older
  file versions asks nothing (C++ warns for imported files); a Save to computer download cannot be written back later.
  Saving ends an edited text first (library `endTextEditing`, ProjectActionsController::saveProjectAt).
- In an agent worktree with a symlinked MuseScore submodule Vite's fs.allow blocks the templates (the template e2e test
  fails there); not an issue in the main checkout.

## 2026-10-21 — Palettes: bagpipe embellishments, custom palettes, drag and drop

- Bagpipe embellishments: dom/bagpembell.ts (BagpipeEmbellishment, BAGPIPE_NOTEINFO_LIST, resolveNoteList, mag 0.7),
  the EMBELLISHMENT_TYPES table generated by gen-typesconv.ts (214 entries, TConv userName/notes/toXml/fromXml/count;
  EmbellishmentType = number), TRead/TWrite (`<subtype>` = index), SingleLayout (heads, stems, flag or three beams,
  ledger line of high A), TDraw (SingleDraw delegates), Factory, Note::drop (setGraceNote 32nds in reverse order),
  PaletteCreator::newBagpipeEmbellishmentPalette (hidden by default, also in the master palette). The element is only a
  drag and drop dummy: no vtest/test score contains it (checked), so reading/rendering of scores is unaffected.
- Readers/writers needed by palette cells and mime data: ActionIcon (read/write, setActionIconTypeFromAction, Factory),
  PlayTechAnnotation (read/write, Factory), NoteHead (as Symbol); TRead::readItem dispatches ChordLine, Fingering,
  MeasureRepeat, Ornament, StaffTypeChange, the tremolos (TremoloCompat). Known C++-like gaps of the roundtrip of the
  default/master palettes (test/palettetree.test.ts): the play technique of an annotation equal to the default
  (C++ too), the instrument of the instrument change, hammer-on segments.
- Palette XML: PaletteCell read/write/toMimeData/fromMimeData/fromElementMimeData, Palette read/write/fromMimeData/
  guessType/contentType/isCustom, readFromData/writeToData (.mpal zip with META-INF/container.xml + palette.xml),
  isEquivalent with the mime data, PaletteTree read/write (`<PaletteBox version="4.70">`).
- User palette tree: src/palette/palettemodel.ts (PaletteTreeModel: indices are { palette, cell } instead of
  QModelIndex; data/setData roles as methods; dropMimeData, moveRows, removeRows, insertRows, findPaletteCell, the cell
  filters as predicates; treeChanged listeners), src/palette/paletteprovider.ts (PaletteProvider: user/master/default
  models, availableExtraPalettesModel, addPalette, doResetPalette, poolPalette ("More": master cells the palette lacks,
  by type or content type), customElementsPaletteCells (hidden custom cells), insertLoadedPalette, read/write;
  UserPaletteController: dropAction, insert, insertNewItem, move, queryRemove/remove (questions through an `ask`
  callback), editPaletteProperties/setPaletteConfig, editCellProperties/setCellConfig, canEdit). API (palette/api.ts):
  loadUserPalettes/userPalettesXml/onUserPalettesChanged, userPalettes (PaletteInfo now has a unique `id` and the
  `type`, custom/editable/expanded; cells custom/visible), extraPalettes/addExtraPalette, createCustomPalette,
  setPaletteExpanded/setAllPalettesExpanded/setPaletteEditable, removePalette, movePalette, morePaletteCells (pool +
  custom), paletteCellMimeData, insertPaletteCell/canInsertPaletteCell, addCellsToPalette, movePaletteCell,
  removePaletteCells, palette/cell properties, resetPalette (+ RESET_PALETTE_QUESTION), save/loadPaletteFile.
  Deviation: the stored XML is written in paste mode, so the expanded state of the palettes is kept as well.
- Drop onto the score: NotationInteraction startDropSingle (readType + Factory + reader, SingleLayout like C++'s
  ISingleRenderer), updateDropSingle (measure anchored / time anchored / standard elements; nearest accepting element
  of the page by a linear search instead of the BspTree), dropSingle (one undo command "Drop element: %1"; spanners via
  the new Score.cmdAddSpannerAtPos = C++ cmdAddSpanner(Spanner*, PointF, bool)), doDropStandard,
  doDropTextBaseAndSymbols, dropCanvas, dropTarget, setDropTarget, setDropRect, endDrop, drawDrop, anchor lines
  (drawAnchorLines, EngravingConfiguration.formattingColor). EditData.view (editing/mscoreview.ts, C++ MuseScoreView /
  ScoreCallbacks) lets Measure::acceptDrop set the drop rectangle; EngravingItem dropTarget flag (curColor:
  highlightSelectionColor). Measure acceptDrop/drop: drop rectangles, ACTION_ICON frames and "insert measure".
  Outgoing drag of an element (Shift+Ctrl+drag, NotationViewInputController mousePress_considerDragOutgoingElement,
  NotationInteraction isOutgoingDragElementAllowed/startOutgoingDragElement/endOutgoingDrag; the view carries out the
  drag). API: viewDragEnter/viewDragMove/viewDrop/viewDragLeave/viewDropTarget, viewMouseMove().outgoingDrag.
- Editor: the palette tree is the library's user tree, stored as XML in localStorage ("musescoreweb:palettes"; the
  old visible/expanded settings are migrated once; "Revert to factory settings" resets it). "Add palettes" lists the
  hidden and master palettes and "Create custom palette" (name popup); palette menu: Hide palette / Hide/Delete palette,
  Insert new palette, Enable editing, Reset palette (question), Save palette… (.mpal download), Load palette…,
  Palette properties…; cell context menu (and Delete key): Delete, Properties…; dialogs PaletteDialogs.tsx (palette
  properties, cell properties: live changes, Cancel restores; questions Hide / Delete permanently / Cancel, Yes/No).
  "More": the pool and the hidden custom cells with selection, "Add to %1", delete of custom cells. HTML drag and drop:
  cells onto the score (dragcontroller.ts keeps the mime data during the drag; the view repaints the drop target and
  anchor line), cells within a palette (reorder), from other palettes/"More" (insert), palettes in the tree (reorder);
  score elements with Shift+Ctrl onto a palette (pointer drag, ELEMENT_DROP_EVENT).
- Tests: test/bagpipe.test.ts, test/palettetree.test.ts, test/palettedragdrop.test.ts (drops with undo restoring the
  sorted SVG of all pages: articulation, bagpipe embellishment, key signature with drop rectangle, hairpin, dynamic,
  clef, frame; outgoing drag into a palette); e2e: custom palette, drag of a cell into it, Shift+Ctrl drag of the title
  into it, reload keeps it, cell properties, drop of an accent onto the score with undo, delete of the palette.
- Missing (TODO(port)): PaletteCompat (migrating palettes of older versions), images in .mpal, PaletteElementEditor
  (key/time signature editors of "More"), the drag pixmap of outgoing drags, drop of ranges (outgoing range drags,
  Alt+click paste) and of images, time tick anchors while dragging (EditTimeTickAnchors), STAFF_TYPE_CHANGE /
  SYSTEM_LOCK action icons on measures, instrument change drops (instrument dialog), fretboard diagram drops with the
  chord symbol, multi-selection of cells in the main palettes (the header's delete button).

## 2026-10-21 — Late element types, images, MIDI mapping

- Ported (DOM, read incl. 2.x/3.x where C++ reads them, write, layout, drawing): Sticking, Capo (Staff capo map,
  Score::updateCapo, editing/editcapo.ts, capo-aware StringData), StringTunings (Part string tunings,
  editpart ChangeStringData), HarpPedalDiagram (Part harp diagrams, editing/editharppedaldiagram.ts),
  PlayTechAnnotation compat (< 4.0 staff texts -> play technique, < 4.10 capo texts -> Capo), FiguredBass (MScoreBC
  font fonts/mscorebc, fonts/fonts_figuredbass.xml, item parsing/normalized text, regenerateText through
  figuredBassHooks -> startCmd/endCmd), ChordBracket, Tapping (+ half slurs, tapping text; rendering/score/
  tappinglayout.ts), SoundFlag (written and read, never drawn: the MuseScore icon font is not in the library),
  SystemDivider (score-level <SystemDividers> and per measure, PageLayout.layoutSystemDividers), old Bend (pre-4.2,
  PitchValue), Image (dom/image.ts + imagestore.ts with MD4 names in framework/global/cryptographichash.ts;
  Pictures/ of the .mscz read and written by MscLoader/MscSaver; Pixmap/ImageProvider/SvgRenderer/imagecache.ts decode
  asynchronously: drawPage redraws through onImageDecoded/imagesDecoded/setImageDecoder (node: @napi-rs/canvas)).
- MasterScore MIDI mapping (port of midimapping.cpp): rebuildMidiMapping after loading/part changes, checkMidiMapping
  before writing, midiPort/midiChannel like C++. NoteEvent: note play events read (also 2.x) and written (<Events>).
- Palettes: capo, string tunings, left/right-hand tapping, chord brackets (Keyboard and Lines), harp pedal (text)
  diagrams; SingleLayout/SingleDraw for these types. ChordRest::drop of palette harp diagrams takes the previous
  diagram's pedal state; rehearsal marks from the palette get the next mark text.
- Editing: `figured-bass` action (Score::addFiguredBass, NotationInteraction::addFiguredBass), `sticking-text`
  (Score::addText STICKING), paste of FiguredBass in pasteSymbols, paste of images (MimeData.imageData /
  `setClipboardImage`; the editor reads image files of the browser's paste event; C++ re-encodes as PNG, here the
  file is stored as is, named "<md4>." like C++'s "paste" name without suffix).
- Properties panel: ChordBracketSettingsModel, ImageSettingsModel, ArticulationSettingsModel for tapping.
- Tests: test/elements.test.ts (MD4 vectors; write/read back of every type; images from Pictures/ and pasted;
  figured bass and sticking actions with undo/redo; chord bracket inspector section).
- Metrics: compare:all improved 17 pages (harp-diagrams 64.0% -> 5.0%, system-divider-1 27.8% -> 2.4%,
  courtesy-jump-section-2 22.7% -> 2.3%, bend-1 14.1% -> 5.2%, capo 10.4% -> 1.2%, sticking-1/-2 9.7/7.1% -> 2.8/0.8%,
  chordBrackets 10.2% -> 4.4%, figured-bass-2 8.0% -> 2.3%, image-1 9.5% -> 5.8%, ...; baseline updated, worse
  values within the tolerance kept at their old baseline); compare:mscx 737 -> 774 of 839 main files identical to
  MuseScore's re-save; roundtrip 656 identical,
  172 within rounding, 11 differing (new: harp-diagrams, a 4.0 file that MuseScore also renders differently after its
  own re-save).
- TODO(port) / known differences: SoundFlag icon, the scaled image buffer (images are drawn directly; SVG images keep
  the document's preserveAspectRatio), ChordBracket/SystemDivider reset(), cmdFlipHorizontally, figured bass
  keyboard navigation while editing (ScoreView figured bass tab/space), StringTuningsSettingsModel and the harp pedal
  popup, part audio settings compat (mute/solo), PartChannelSettingsLink.

## 2026-10-22 — Editor: toolbar rows, full screen

- The top area below the tabs row holds any number of toolbar rows (docks `top`, `top1`, `top2`, ... in the layout
  settings, renumbered without empty rows; old settings still load). "Move to the row below" on the last row makes a
  new row (not for a toolbar alone in it); the bottom dock above the status bar is reached with the new "Move to the
  bottom" / "Move to the top" items of the handle menu. While a toolbar is dragged, an empty row below the last one
  takes it as a new row.
- Full screen: besides the menu bar and toolbars (top edge), the bottom toolbar dock with the status bar (bottom edge)
  and the panels (left edge, right in RTL) are collapsed and slide in while the pointer is at their edge or on them,
  or while they have the focus (scoreview.ts: one auto-hide logic per edge, `setChrome(el, edge)`).

## 2026-10-22 — Layout break icons, break actions

- Layout breaks are shown in the editor like in MuseScore: `LayoutBreak.font()` (MuseScore's UI icon font
  "MusescoreIcon", now also in `fonts/musescoreicon/` and registered by initEngravingFonts), TLayout.layoutLayoutBreak
  (icon bbox, only when `EngravingConfiguration.canLayoutIcons()`), TDraw for LayoutBreak and Spacer (formatting color,
  not when printing or with showUnprintable off). `setCanLayoutIcons(true)` is called by the editor; the default is
  false (C++: no UI configuration in the converter), so exports, renders and compare:all are unchanged.
- Actions "system-break" (Enter), "page-break", "section-break": NotationInteraction.toggleLayoutBreak /
  toggleLayoutBreakAvailable (Score.cmdToggleLayoutBreak was already ported). Test: test/layoutbreak.test.ts.
- TODO(port): IndicatorIcon / system lock indicators; EditSystemLocks::removeSystemLocksOnAddLayoutBreak.

## 2026-10-22 — Playback (MIDI renderer, SpessaSynth, playback toolbar)

- Library: port of the MIDI renderer `engraving/compat/midi` (CompatMidiRender, CompatMidiRendererInternal, EventMap /
  EventsHolder, NPlayEvent/midicoreevent, VelocityMap, PauseMap, PitchWheelRenderer, MidiInstrumentEffects, midipatch)
  with what it needs in the DOM: TempoMap (dom/tempo.ts) and Score::setUpTempoMap/rebuildTempoAndTimeSigMaps/
  fixAnacrusisTempo, RepeatList utick <-> utime and updateTempo, TempoText updateTempo/updateRelative, gradual tempo
  changes (easeInOut.ts, TConv.easingValueCurve), swing (swing.ts, Staff swing/channel maps, Score::updateSwing/
  updateChannel), RealizedHarmony + Part harmony channels, Instrument MIDI actions/articulations (template
  articulations regenerated), Note/Chord playback helpers (play events, playTicks, ties ignoring playback, grace notes),
  Volta/PalmMute channels, added()/removed() hooks, the loop boundaries of MasterScore (LoopBoundaryType).
- notation/internal/notationplayback.ts: NotationPlayback (C++ NotationPlayback + the parts of PlaybackController /
  PlaybackEventsRenderer the web needs): renderMidiEvents (the CompatMidiRender events with seconds, the channels),
  metronome and count-in events, preview notes (triggerEventsForItems, previewNotesForNoteVals), tick/second
  conversions with or without repeats, tempo multiplier, loop boundaries, beats. notationscene/playbackcursor.ts and
  loopmarker.ts; playback/iplaybackcontroller.ts (the notation scene calls it: seek on click, play the clicked/entered
  notes, chord symbols); playback/api.ts is the public API (re-exported from index.ts).
- Editor (musescoreweb/playback/): pluggable `Synthesizer` (synthesizer.ts; NullSynthesizer = no sound, counts the
  notes; used with `?synth=none`, without Web Audio and in automated browsers (navigator.webdriver;
  `?synth=spessasynth` forces the sound)), SpessaSynth (spessasynth_lib 4.3.14, Apache-2.0, AudioWorklet;
  spessasynth.ts) with MuseScore's "MS Basic.sf3" (51.3 MB, MIT) loaded on the first play/preview with progress in
  the toolbar ("Loading audio samples") and kept in the Cache API (soundfont.ts). vite-plugin-sound.ts serves the file
  from MuseScore/share/sound in dev and copies it with its license and readme to dist-musescoreweb/sound/. player.ts:
  lookahead scheduler on the audio clock (chasing of controllers, loop, end of playback); playbackcontroller.ts:
  MuseScore's playback actions (play, play-from-selection, pause-and-select, stop, rewind, loop, loop-in/out, repeat,
  play-chord-symbols, pan, metronome, countin, toggle-hear-playback-when-editing; own `playback-mute`), the
  IPlaybackController of the notation scene, range playback mutes the other parts; the events are rendered only for
  playing (previews and seeking use the channels and the tempo map); playbackview.ts: playback cursor, auto pan
  (AbstractNotationPaintView::adjustCanvasPosition, paused after the user moved the view), loop markers.
- Playback toolbar (toolbars/PlaybackToolBar.tsx, View > Toolbars > Playback controls = toggle-transport): rewind,
  play/pause, loop, metronome, mute (persisted), settings menu, time, measure/beat fields, tempo with the speed popup.
  Space = play (MuseScore's shortcut); the hand tool of the editor is the middle mouse button now. Preferences >
  Note input: note preview settings (play when editing, chords, chord symbols, duration, by duration in note input,
  score dynamics).
- Tests: test/midirenderer.test.ts (the 64 tests of MuseScore's midirenderer_tests.cpp), test/midiexport.test.ts (notes
  and tempos of 15 reference MIDI files of midiexport_tests.cpp), test/playback.test.ts (API: tempos, repeats,
  dynamics, ties, channels, metronome, loop, cursor, preview), e2e: playback toolbar, play/pause (button and Space),
  cursor, preview on click, mute (persisted), toolbar toggle.
- Not ported / known differences: MuseScore 4 plays with the MPE PlaybackModel and Muse Sounds; here the 3.x-style
  CompatMidiRender events (like MuseScore's MIDI export) are played, so e.g. hairpins in preview dynamics, playing
  technique annotations and articulation sounds of the MPE model differ. Playing sets the notes' play events like a
  MIDI export (the status bar then shows "(on ... off ...)" for shortened notes, as in MuseScore after a MIDI export).
  No mixer, MIDI input, playback setup dialog, ChangePart harmony channels; no
  WebAudioFont fallback (SpessaSynth works wherever AudioWorklet exists; without it there is no sound).
  Presets: MuseScore 4's Fluid sound mapping (tools/gen/gen-soundmapping.ts: framework/mpe/soundid.ts,
  engraving/playback/mapping/setupdatamaps.ts, framework/audio/fluidsynth/soundmappingdata.ts; PlaybackSetupDataResolver,
  findPrograms, articulationSounds): the instrument (id or soundId) -> sound -> bank/program of MS Basic; bank 128 =
  drum kit. The bank and program of the instrument channels are ignored like in MuseScore 4 (2.x pianos with the user
  bank MSB 2/LSB 5 played as drums before). The renderer's articulation channels (pizzicato, mute, tremolo, jazz,
  harmonics, slap, pop, ...) take the articulation presets; chord symbols guitar or piano; the metronome Block/Wooden.
  ChannelMap: each voice of an instrument channel (= articulation) has its own synthesizer channel
  (synthChannel(instrumentChannel, voice) = instrumentChannel * 4 + voice), so pitch bends/pedals/expression of a voice do
  not affect the others and equal pitches of two voices do not cut each other off. Done with the renderer's channel
  lookup (TS-only Context.eachVoiceHasChannel + LookupData.voice; the lookup channels are numbered after the instrument
  channels); spanners (pedal, vibrato) go to all voice channels of their instrument channel like in C++. Deviation:
  MuseScore 4 sends the expression controller of single note dynamics to all channels of the instrument, here only to
  the voice's channel. The MIDI actions and Aeolus stops of staff texts are not played (TS-only
  Context.renderMidiActions = false; MuseScore 4's playback ignores them, the MIDI export still renders them).
  Instrument::isPrimary with Score's markInstrumentsAsPrimary (append/insert/remove part, sortStaves): violin and flute
  sounds get the primary/secondary subcategory.

## 2026-10-22 — View modes (continuous views), fit to window, smooth panning, Space hand tool

- Library: rendering/score/scorehorizontalviewlayout.ts (ScoreHorizontalViewLayout: one page with one system of all
  measures, VBoxes left out; partial layout keeps the layout of the measures outside the range like C++) and
  scoreverticalviewlayout.ts (ScoreVerticalViewLayout: all systems on one page that grows; PassLayoutIndependentItems
  on layout all). ScoreLayout dispatches LINE/HORIZONTAL_FIXED/SYSTEM; System.topDistance/bottomDistance return 0 in
  LINE mode (EngravingConfiguration::minDistanceForPartialSkylineCalculated is false). API: setViewMode/viewMode
  ('page' | 'continuous-horizontal' | 'continuous-vertical' | 'fit-width'), pageFormatSize, drawContinuousPanel;
  tools/render.ts takes a view mode.
- Not in MuseScore: "Continuous view (fit to window)" = LayoutMode::SYSTEM with Score.reflowWidth (LayoutConfiguration
  loWidth()/pagePrintableWidth() use it); only section breaks start a new system (system/page breaks and system locks
  are ignored). The editor lays the score out again when the width of the view or the zoom changes (debounced).
- notationscene/continuouspanel.ts: port of ContinuousPanel (clefs, key/time signatures, measure number at the left
  edge of the horizontal view); the editor draws it on an overlay canvas that follows the scrolling. Own design (not
  like C++): the system's header (instrument names and brackets as at the beginning of the score) instead of the names
  above the staves, normal colors instead of grey, the background over the whole height of the page with a shadow at
  its right edge (CSS), the measure number smaller (8 pt) in FreeSerif.
- Editor: view mode control in the status bar (MuseScore's ViewModeControl; components/ViewModeControl.tsx), also in
  the page view toolbar and View > View mode; actions view-mode-page/-continuous/-single (MuseScore) and
  view-mode-fit-width; the mode is a view setting (persisted, for all scores, MuseScore keeps it per score). Continuous
  views: no page shadow, zoom fit modes fit the height (horizontal) or width (vertical), long pages are drawn as tiles
  (also above 16384 px per side), tiles follow while scrolling continuously; printing and the home thumbnails use the
  page view (printing switches temporarily, the thumbnail shows the beginning in the page format).
- In the continuous views the mouse wheel scrolls (a wheel notch zooms only in the page view; fast trackpad scrolling
  was taken for wheel notches and changed the zoom).
- Smooth panning (MuseScore's advanced setting application/playback/smoothPan): Playback settings > Smooth panning;
  in the continuous view (horizontal) the score moves under the cursor in the middle of the view
  (adjustCanvasPositionSmoothPan).
- "Center page" centers the selection (e.g. selected measures) if there is one.
- Preferences > Web version (also fixed: the Note input page was missing in the list): "Hold Space and drag to move the
  score" (default on): Space + drag is the hand tool, "play" gets Ctrl+Space (macOS Option+Space; that key was
  pause-and-select, which then has no shortcut); off: Space plays as in MuseScore. The middle mouse button always pans.
- Translations of the web version's own strings (no context in the action table, webtr()): musescoreweb/locales/
  webstrings.json for all of MuseScore's languages (view toolbar, view modes, mute, smooth panning, Web version page).
- Tests: test/viewmode.test.ts; e2e: view modes, smooth panning, fit to window on resize, Space/middle button hand
  tool, Ctrl/Option+Space playback, center on the selection.
- Known differences: in the horizontal view, autoplace of lines far from an edit can differ slightly between the
  partial layout after an edit and a full layout (partial skylines, like MuseScore); the auto pan does not leave room
  for the continuous panel (C++ adjusts the view rect by the panel width).


### Continuous panel: speed, measure number; GitHub Pages

- The continuous panel is sticky (CSS `position: sticky` in the page; `.page` has `overflow: clip` so it is not a scroll
  container): the browser keeps it at the left edge while scrolling, no lag behind the score. Its contents are painted
  only when they change (ContinuousPanel.key(): measure, widths, the staff of the number); the staff lines at its
  position come from the system's measures instead of scanning all items of the page (that made it judder).
- The measure number is a MeasureNumber (the score's measure number style: font, size, color, offset), above the topmost
  staff whose number is in the view (drawContinuousPanel takes the view's top). Softer, wider shadow.
- .github/workflows/pages.yml builds the viewer and the editor (with the submodule: templates, translations, soundfont)
  for https://pstaender.github.io/musescoreweb/ (viewer/, editor/, landing page .github/pages/index.html); README links.

### Viewer: continuous views, drop highlight

- The web viewer has MuseScore's view modes in the toolbar (Page view, Continuous view horizontal/vertical; stored in
  the view settings) with the sticky continuous panel of the editor; in the continuous views the page layout buttons
  and the two-page spread are disabled, "Page width"/"Whole page" fit the long page across, the wheel scrolls, and
  printing uses the page view.
- The drag-and-drop highlight (dashed frame) could stay after opening a dropped file: dragenter/dragleave counting does
  not pair up in every browser. It now lasts only while dragover keeps firing (and ends on drop or leaving the window).

### Editor: no reopening at startup, thumbnails of the page view

- The editor no longer opens the score that was open at the last start (a large score or one that crashes the editor
  would be opened every time); it starts with the home screen. Only "Yes" in the restore-session question (left-over
  autosaves) opens a score.
- The home screen's thumbnail and page count are those of the page view again, also when the editor shows a continuous
  view: taken when the score is loaded (before the view switches to its mode) and, when saving, with withPageView()
  (index.ts: lays the score out as pages for a callback and in its view mode again afterwards).

### Home thumbnails in the continuous views (fix), view switch indicator

- pageFormatSize() returned the size of the first laid out page, which in a continuous view is the long page: a score
  saved in a continuous view got the aspect of that page on the home screen (a thin strip instead of the thumbnail).
  It now returns the style's page format (pageWidth/pageHeight).
- Changing the view mode (editor and viewer) greys out the score with a spinner until the new layout is shown; the
  state is set at once and the layout starts after it was painted (two frames), since no animation runs while the
  layout blocks the page. Input to the view is blocked meanwhile (inert); a later switch replaces a pending one.

### Continuous panel: right-aligned measure number

- The panel's measure number is right-aligned at the panel's right edge (was left-aligned after the clef column, so
  numbers with several digits were cut off), and the panel is widened if the number would not fit.

### Drop highlight fixed in the visible area

- The dashed frame of a file drag was an absolute ::after of the scrolling `main`, so it scrolled away with a large
  score. It is now a fixed `body::after` over the box of the drop area (viewer: the viewport; editor: the home screen
  or the score view), measured when the drag enters. The editor uses the viewer's dragover timer instead of counting
  dragenter/dragleave.

### Migration of older scores (ProjectMigrator)

- project/internal/projectmigrator.ts, mdlmigrator.ts, project/types/projecttypes.ts: port of ProjectMigrator and
  MdlMigrator. For scores older than 4.0: Leland (migration-306-style-Leland.mss) and Edwin
  (migration-306-style-Edwin.mss, in fonts/styles, loaded as engraving resources: engravingStyleResource()), applied
  with Score.loadStyle(overlap) to the score and its parts; the new mapping of MDL percussion (repitched notes, the
  drumsets of share/templates/Marching_*.drm, given by the app as `templateFile`); positions reset for scores older
  than 3.0 (Score.setResetAutoplace -> resetAutoplace after the layout) and the cross staff beams of 1.x/2.x
  (setResetCrossBeams -> resetCrossBeams, Beam.reset); without the fonts the style settings of #10499 are reset; the
  meta tag mscVersion. All in one undoable command "Migrate project" (the score is modified, like in MuseScore).
- Library: layoutScore(score, { migration, templateFile }) migrates between the first layout and the compatibility
  conversions (NotationProject::doLoad); scoreMigrationType()/scoreAppVersion(); MigrationOptions/MigrationType.
  Without options nothing is migrated (like MuseScore's converter, which the reference renders come from); the viewer
  does not migrate.
- New in the engraving port: Score.setStyle(style, overlap) and ChangeStyle's overlap, ChangeMetaText,
  Score.resetStyleValue, Score.cmdResetAllPositions (no action yet), EngravingObject/EngravingItem.reset().
- Editor: MuseScore's migration dialog (dialogs/MigrationDialog.tsx: the variants for scores before 3.6.2 with the
  picture, the fonts and MDL percussion, and for 3.6.x with MDL percussion; "Don't ask again", OK). The answer is stored
  per migration type like ProjectConfiguration (settings project.migration); closing the dialog does not open the
  score. The e2e tests preset "Don't ask again" without migration (test/e2e/e2ehelpers.ts) except the dialog test.

### Playback keys with "Hold Space and drag to move the score"

- Ctrl+Space / Option+Space did not reach the page everywhere (input source switching, browser limits), so the "play"
  action has no extra key any more when Space is the hand tool: playback starts with MuseScore's Shift+Space (play from
  the selection) and stops with Escape (NotationActionController::resetState); pause-and-select keeps MuseScore's key.
  The Preferences hint names these keys with MuseScore's action titles.
- Concert pitch: Score::cmdConcertPitchChanged (score.ts; also from ChangeStyle::flip when a style with another
  concertPitch is applied), Transpose::transposeKeys / undoTransposeHarmony with the TransposeHarmony undo command
  (transpose.ts; the key signature is created through itemFactories, transpose.ts is imported by the DOM), ChangeKeySig
  (editing/editkeysig.ts; undoChangeKeySig uses it now, so key signature changes are undoable), Score::firstSegment.
  NotationActionController: "concert-pitch" (toggleConcertPitch: "Display concert pitch" / "Display transposed",
  checked = Sid::concertPitch). Editor: MuseScore's ConcertPitchControl in the status bar
  (components/ConcertPitchControl.tsx, check box + tuning fork + title, before the view mode control). Test: MuseScore's
  keysig_tests concertPitch with its reference files, chord symbols, undo/redo. Score::appendScore (which also matches
  the concert pitch states) is not ported at all.
- Editor: the page view toolbar is in the bottom dock (above the status bar) by default; saved layouts keep their place.

### Transpose

- transpose.ts: the rest of transpose.cpp: Transpose::transpose (to a key / by an interval / diatonically, list and
  range selections, key signatures, chord symbols), transposeSemitone, transposeDiatonicAlterations,
  transpositionChanged (both overloads; the second as transpositionChangedAt), keydiff2Interval,
  transposeTpcDiatonicByKey, transposeHarmony and the TransposeHarmonyDiatonic undo command. Interval::allIntervals,
  TransposeMode, utils isFirstSystemKeySig, Staff::primaryStaff. Note::transpose/transposeDiatonic go through
  undoChangePitch now (like C++).
- Score::undoChangeKeySig: updateInstrumentChangeTranspositions, links between the new key signatures of linked staves,
  transpositionChanged when the staff transposition changes. cmdDeleteSelection: deleting a key signature before an
  instrument change keeps the instrument change's key, deleting an instrument change removes its key signatures and
  clefs (InstrumentChange::keySigs/clefs) and transposes the notes back (transpositionChanged).
- NotationInteraction transpose/transposeSemitone/transposeDiatonicAlterations; actions transpose-up/-down,
  pitch-up/down-diatonic-alterations. Library: prepareTransposeSelection/transposeSelection (TransposeOptions).
- Editor: MuseScore's Transpose dialog (dialogs/TransposeDialog.tsx, Tools > Transpose…: the group boxes of
  transposedialog.ui with its translations, the last settings are kept while the app runs; nothing selected = the whole
  score, deselected afterwards). Deviation: MuseScore's restored state can check the disabled "To key" box for a list
  selection; here "By interval" is used then.
- Tests (test/transpose.test.ts): MuseScore's transpose_tests (undoTranspose, undoTransposeChordSymbols,
  undoDiatonicTranspose(ChordSymbols)), chordsymbol_tests testTranspose and keysig_tests preferSharpFlat with their
  reference files; the actions and the dialog API; e2e: the dialog with undo.
- Not ported (then): fretboard diagrams and the callers of transpositionChanged; done below.
- Known: after a layout change, a key signature segment with a key change in some staves keeps the generated system
  header key signatures of the other staves (removeSystemHeader keeps the segment because of the key change, the same
  code path as MuseScore); seen after undoing a transposition of Amazing_grace (measure 5) when the systems moved.

### Collapsible panel area

- Editor: the panel area left of the score (.side-chrome) can be collapsed to a 32 px strip (not in MuseScore): the
  chevron button at the end of the panel tab bar ("Collapse"/"Expand", MuseScore's global strings); the strip shows the
  expand button and the open panels as vertical tabs, which expand the area with that panel. Showing a panel (View menu,
  F9/F7/F8) expands it, too; the state is kept in the settings (panels.collapsed), "Restore the default layout" expands.
- e2e: the menu keyboard test moves the mouse away first (the pointer left over the Edit menu's first item made it the
  active one again after End).

### Fretboard diagrams (harmony to diagram data) and the callers of transpositionChanged

- fonts/harmony_to_diagram.xml (tools/gen/gen-harmonytodiagram.ts: MuseScore's data/harmony_to_diagram.xml without the
  whitespace, 1.3 MB / 48 KB gzipped), loaded by initEngravingFonts (FretDiagram.registerHarmonyToDiagramFile) and read
  on first use (rw/harmonytodiagramreader.ts). FretDiagram: createHarmonyMapKey, updateDiagram, applyDiagramPattern,
  patternFromDiagram, harmoniesFromPattern, patternsFromHarmony, isCustom, setHarmony, undoFretClear, undoSetFret*,
  linkedClone, makeFromHarmonyOrFretDiagram, harmonyDisplayText; a harmony without a name gets one from the pattern.
  The harmonies of one pattern are in file order (C++: unordered_map order). Harmony.displayText; EngravingItem.custom.
- editing/editfretboarddiagram.ts: FretUndoData, FretDataChange, FretDot, FretMarker, FretBarre, FretClear,
  Add/RemoveFretDiagramFromFretBox. FBox: init (the diagrams of the score's chord symbols), needsRebuild (laid out in
  BoxLayout.layoutFBox like C++), diagramsOrder/reorderElements (FRET_FRAME_DIAGRAMS_ORDER); Score.findFretBox/
  rebuildFretBox (Segment add/remove of harmonies and fret diagrams, Harmony TEXT changes also update the diagram);
  insertBox inits a new fret box. pitchspelling: enharmonicSpelling table, bestEnharmonicFit.
- Transpose: transposeFretDiagram (FretDataChange / harmony from the diagram, findBestEnharmonicFit,
  MsError::TRANSPOSE_NO_FRET_DIAGRAM), rebuildFretBox. Tests: transpose_tests undoTransposeFretDiagrams(ChordSymbols)
  and the diatonic variants.
- Palette: the fretboard diagrams C, Cm, C7 ... B7; the chord symbol of a diagram is not drawn in palette cells.
- InstrumentChange.setupInstrument (clefs, key signatures for the instrument change, ChangeInstrument in linked scores,
  transpositionChanged, "To %1"), keySigs/clefs; editing/editinstrumentchange.ts ChangeInstrument; ChordRest::drop of
  instrument changes; undoAddElement of an instrument change (the previous instrument, transpositionChanged).
- EditPart: ChangePart, ChangeDrumset, replacePartInstrument, replaceInstrumentAtTick, setPartSharpFlat; Part
  properties USE_DRUMSET, PREFER_SHARP_FLAT. NotationParts.setPartSharpFlat/replaceInstrument,
  MasterNotationParts.replaceInstrument (+ the part scores; the excerpt is not renamed: ChangeExcerptTitle not ported).
  notationtypes: InstrumentKey, isMainInstrumentForPart, formatInstrumentTitle.
- NotationInteraction.selectInstrument/cleanupDrumsetChanges: MuseScore opens its instrument dialog in the middle of
  the command (blocking); here the instrument comes from a provider (library setSelectInstrumentProvider). Used by the
  palette (apply, drop) and the action instrument-change-text (registered now). Library: replacePartInstrument,
  changeInstrumentChange/selectedInstrumentChange, setPartSharpFlat.
- Editor: MuseScore's "Select instrument" dialog (dialogs/SelectInstrumentDialog.tsx: InstrumentsDialog with
  canSelectMultipleInstruments = false; ChooseInstrumentsPage `single`), opened before the command
  (dialogs/instrumentchoice.ts withSelectedInstrument; a drop is replayed after the dialog); "Replace instrument" in the
  Layout panel's instrument settings popup; the action change-instrument (no context menu in the score view yet).
- Tests: test/instrumentchange.test.ts (MuseScore's instrumentchange_tests add/delete/change/copy with their reference
  files, setupInstrument through the action, replace instrument, sharp/flat), palette fret diagrams; e2e: replace
  instrument and an instrument change from the Text palette.
- Staff/Part properties port now edits values using createEditStaff, including transposition, pitch ranges, instrument replacement, string data, advanced staff type and previous/next staff navigation. Customize Kit now uses createCustomizeKitDialog, including drum rows, editing, example canvas, shortcut conflicts, .drm load/save and undoable apply/cancel. ChangePatch (instrumentchange_tests testMixer) remains unported.
- Full screen: the collapsed chrome stays shown only for an open menu or popup ([aria-haspopup][aria-expanded=true]);
  expanded sections (the panel collapse button, palette headers, inspector sections) kept the panels shown (webapps
  e2e "collapses the toolbar in full screen"). The tempo and "Customize toolbar" buttons got aria-haspopup="dialog".

### Staff/Part properties, Edit staff type, the score's context menu

- notationscene/editstaff.ts: the logic of MuseScore's EditStaff (Staff/Part properties): the staff of the hit element
  context (the context menu) or of the selection, its staff type and instrument as edited copies, the dialog's values,
  replaceInstrument (template, staff type preset, clef), setStringData (pitch ranges follow the strings), next/previous
  staff, apply() = setStaffConfig + replaceInstrument + setPartSharpFlat merged into one undo step (mergeCommands). Like
  C++ the config's cutaway is false. Library: createEditStaff(score).
- notationscene/editstafftype.ts: EditStaffType ("Advanced style properties"): the values of the controls from the
  staff type (setValues) and back (setFromDlg), the tablature compatibility rules, the instrument's templates,
  resetToTemplate, the preview (the staff type on the first staff of std_sample.mscx / tab_sample.mscx).
  StaffType.tabFontNames/tabFontData/equals/translatedGroupName; TConv names of staff groups and notehead schemes
  (gen-typesconv decodes \uXXXX now: "Solfège").
- NotationParts.setStaffConfig/staffConfig (all of StaffConfig; notationtypes StaffConfig, staffConfigEquals), ChangeStaff
  with reflectTranspositionInLinkedTab (Staff property, Part.stringData of TAB staves), TextBase.validateText (also
  StaffName), Instrument nameAsPlainText/abbreviatureAsPlainText/equals, Part.setProperty calls setLayoutAll.
- notationscene/notationcontextmenumodel.ts: NotationContextMenuModel (items per element type: measures, page, staff/
  system text, time signature, instrument name, harmony, fret diagram, instrument change, frames, hairpins, gradual tempo
  changes, play count text). Library: contextMenuItems(score). TODO(port): the edit-style arguments (style page).
- Editor: the right click on the score opens the context menu (components/ScoreContextMenu.tsx; the press sets the hit
  element context); EditStaffDialog.vue now calls createEditStaff, exposes staff/part values, Apply/OK and nested staff-type,
  string-data and pitch dialogs. EditStaffTypeDialog.vue has common, pitched, percussion, tablature and template controls
  using EditStaffType. Preview canvas uses bundled staff samples; instrument replacement, pitch-range selector and staff navigation are connected, but these workflows still need browser verification. EditPitchDialog.vue has MIDI note selection and pitchToString.
  Nested <dialog>s: React passes the close event of an inner dialog to the outer onClose, the handlers check the target.
  Many context menu items are disabled: their actions are not ported (the Style dialog, measure properties, insert
  measures dialogs, ...).
- MasterNotationParts.replaceInstrument renames the part's excerpt (ChangeExcerptTitle, formatUniqueExcerptName);
  ChangePatch (instrumentchange_tests testMixer).
- MasterScore.setExcerptsChanged/excerptsChanged (CmdState.excerptsChanged): set by addExcerpt/removeExcerpt,
  SwapExcerpt (new), ChangeExcerptTitle; cleared after loading (readMasterScore, loadScore = initExcerptNotations)
  and in setupNewScore. Nothing reads it yet: MasterNotation has no excerpt notations (updateExcerpts not ported).
  EditPart.replaceInstrument passes reflectTranspositionInLinkedTab to ChangeStaff.
- Tests: test/editstaff.test.ts; instrumentchange testMixer; notationparts excerpt rename; e2e: context menu of an
  instrument name -> Staff/Part properties -> Advanced style properties (preview) -> OK, undo.

### Select similar (context menu "Select")
- Score.selectSimilar, static collectMatch (all of ElementPattern: system, rest duration, measure, beat) and
  collectNoteMatch (NotePattern); ElementPattern/NotePattern in select.ts; EngravingItem.beat(); Score.crMeasure.
- notation/internal/notationelements.ts: NotationElements.elements(FilterElementsOptions | FilterNotesOptions)
  (notationtypes; -1 -> nidx), rehearsalMark/measure/page. TODO(port): search() (SearchCommandsParser).
- NotationActionController: select-similar, select-similar-staff, select-similar-range (the last element hit:
  NotationInteraction.lastElementHit, set by hitElement like C++ NotationSelection::onElementHit).
- notationscene/selectdialog.ts: SelectDialog / SelectNoteDialog (the logic of "More…": labels, enabled states, the
  options, apply with replace/add/subtract). Library: createSelectDialog(score) (the note dialog for a note).
- Editor: dialogs/SelectDialog.tsx (grid layout of the .ui files), action select-dialog.
- Tests: test/selectsimilar.test.ts; copypastesymbollist tests use selectSimilar like C++; e2e: Select > Similar and
  More… from the context menu.

### Add menu: measures, frames, fretboard diagrams, tuplet dialog; drag anchor lines
- MasterScore.insertMeasureInMaster before a measure (the whole C++ MasterScore::insertMeasure: mm rests, measure
  repeat groups, moving clefs/key/time signatures/end barlines and repeats to the new measure, deselectAll); MuseScore's
  measure_tests insert tests (test/measure.test.ts: middle, begin, end, at beginning, before clef/key changes with undo,
  spanners). TODO(port): scoreList() (excerpts).
- NotationInteraction.addBoxes(boxType, count, target) / addBoxesAt (BoxType, AddBoxesTarget in notationtypes) and
  addFretboardDiagram; Score.measure(idx). Actions insert-measure, append-measure, insert/append-hbox, -vbox, -textframe,
  -fretframe (fretboard diagram legend), add-fretboard-diagram. Library: addMeasures(score, count, target),
  addCustomTuplet / customTupletDefaults / canAddCustomTuplet (custom-tuplet of TupletDialog).
- Editor: dialogs/SelectMeasuresCountDialog.tsx (insert-measures, insert-measures-after-selection,
  insert-measures-at-start-of-score, append-measures), dialogs/TupletDialog.tsx (tuplet-dialog, "Create tuplet").
- Anchor lines while dragging (the formatting colored dotted lines with dots): NotationInteraction
  updateDragAnchorLines / updateGripAnchorLines (drag, startEditGrip, flip; reset at the end of the drag and edit),
  dragAnchorLines/gripAnchorLines of LineSegment (leftAnchorPosition/rightAnchorPosition), SlurTieSegment, Articulation,
  Fermata, BSymbol, FretDiagram, Marker, HammerOnPullOffText; GuitarBend segments have none.
  TODO(port): Arpeggio grip anchor lines (arpeggio grips are not ported).
- Tests: test/addmenu.test.ts, test/measure.test.ts, drag test of the anchor lines; e2e: Add > Measures > Insert at end
  of score… and Add > Tuplets > Other….

### Snapping while dragging, Ctrl+Shift drag copy, overlay sizes, closing the context menu
- MoveElementAnchors (anchors.ts): moveElementAnchorsOnDrag (TextBase and FretDiagram drag: chord symbols, staff/system
  text, dynamics, expressions, rehearsal marks, ... move to the segment under them; Ctrl/Cmd or Shift keeps the anchor),
  moveSegment (harmony/fret diagram, figured bass, snapped items), moveElementAnchors (keyboard; not wired to keys yet),
  rebaseOffsetOnMoveSegment. EditTimeTickAnchors.updateAnchors(item) / updateAnchorsInMeasure; ShowAnchors
  (showanchors.ts) with Score.showAnchors/setShowAnchors/hideAnchors; TimeTickAnchor drawRegion/voiceIdx and its
  drawing (TDraw, the alternating "darker" flag of MeasureLayout::layoutTimeTickAnchors). utils dragPositionToMeasure/
  dragPositionToSegment, Score.dragPosition, scoreRendererHooks.layoutItem.
- LineSegment.rebaseAnchors (hairpins, ottavas, ... dragged or their start/end grips dragged snap to segments; Ctrl
  keeps them): findSegmentForGrip, rebaseAnchor, rebaseOffsetsOnAnchorChanged, undoMoveStartEndAndSnappedItems,
  SLine.undoMoveStart/undoMoveEnd; the drag EditData gets the view callbacks (changeEditElement).
- The edit overlays (anchor lines, grips, range frame) are sized in view pixels: DrawPageOptions.pixelRatio (the app
  passes devicePixelRatio), before they were half as large on HiDPI screens.
- Editor: the Ctrl+Shift (Cmd+Shift) outgoing drag can be dropped onto the score (a copy, like MuseScore's QDrag onto
  the view), not only onto palettes. All popup menus (MenuPopup: the score's context menu, the menus of the side panels
  and toolbars) close on a click outside of them, Escape and window blur; a click on the menu's own button toggles it.
- Tests: drag tests (snapping of a chord symbol, Ctrl keeps the anchor, hairpin drag, Ctrl+Shift copy); e2e: closing
  the context menu.

### Moving anchors with the keyboard
- Shift+Left/Right (Alt: anchor to the end of the previous beat where allowed) moves a selected element that can be
  anchored to beats (texts, chord symbols, fret diagrams, dynamics, ...): NotationViewInputController
  isAnchorEditingEvent/shortcutOverrideEvent/keyPressEvent -> NotationInteraction.moveElementAnchors
  (MoveElementAnchors.moveElementAnchors, "Move element anchors"). Holding Shift shows the time tick anchors
  (updateTimeTickAnchors on Shift press/release; library viewKeyRelease, the app forwards Shift keydown/keyup).
- LineSegment.isEditAllowed/edit: Shift+arrows (Home/End, Ctrl: by measure) move the start or end of a line in edit
  mode (segment, note and measure anchored lines; MoveElementAnchors.findNewAnchorSegmentForLine, utils
  nextChordNote/prevChordNote); the key edits get the view callbacks (changeEditElement) like the drags.
- Tests: drag.test.ts keyboard tests (chord symbol Shift+Right/Left with undo, anchors shown while Shift is held,
  hairpin end moved with Shift+arrows).

### Tools menu
- All entries of MuseScore's Tools menu work (Transpose was already there): Explode/Implode (Score::cmdExplode/
  cmdImplode with the CloneVoice command and Score::cloneVoice), Realize chord symbols (cmdRealizeChordSymbols with
  setChord; dialogs/RealizeChordSymbolsDialog.tsx = RealizeHarmonyDialog with VoicingSelect; library
  realizableChordSymbols/realizeChordSymbols), Voices (swap: cmdExchangeVoice), Measures > Split/Join
  (editing/splitjoinmeasure.ts = SplitJoinMeasure; also the Ctrl drop of a barline on a chord/rest splits the measure),
  Remove selected range (cmdTimeDelete, doTimeDelete, checkTimeDelete, doTimeDeleteForMeasure; deleteMeasures and
  reconnectSlurs; deleteItem of a measure), Fill with slashes / Toggle rhythmic slash notation (cmdSlashFill,
  cmdSlashRhythm, Chord.setSlash, Rest.setAccent), Respell pitches with sharps/flats, enharmonic spelling
  (editing/spell.ts: spell, spellNotelist with the spelling window, spellWithSharpsOrFlats, changeEnharmonicSpelling,
  Note.undoSetTpc), Regroup rhythms (cmdResetNoteAndRestGroupings), Resequence rehearsal marks, Copy lyrics to clipboard
  (Score.lyrics/extractLyrics; the app writes the text to the system clipboard), Remove empty trailing measures
  (firstTrailingMeasure). Helpers: EngravingItem.elementAppliesToTrack, Spanner.startElementFromSpanner,
  StaffTypeList/Staff.staffTypeRange, Score.appendMeasures; Measure.measureRepeatCount(nidx) is 0 (nidx is -1 here).
  TODO(port): scoreList() (excerpts) in the measure/time commands, cmdTimeDelete in parts, setPlayChord.
- Tests: test/tools.test.ts (MuseScore's implodeexplode, tools, join, split, rhythmicgrouping and chord symbol realize
  tests with their reference files; actions), measure.test.ts (measure_tests spanner_A-D, deleteLast; spanners_tests
  09-12: deleting measures with lyrics lines, undo); e2e: Tools menu.

### Format menu
- All entries of MuseScore's Format menu work:
  - Style… (`edit-style`): src/notationscene/editstyle.ts = EditStyle (editstyle.cpp: styleWidgets table, button groups,
    combo fills, value conversions, text styles page, header/footer, resets, enabled states), editstyleui.ts generated
    from editstyle.ui by tools/gen/gen-editstyle.ts; the QML pages (styledialog/*.qml) are the models in
    src/notationscene/styledialog/ and the components in musescoreweb/dialogs/editstyle/qml/ (registry qmlpages.tsx by
    host widget objectName, images from the submodule). App: dialogs/EditStyleDialog.tsx; changes are applied live in
    one undo command (prepareChanges/commitChanges/rollbackChanges). The context menu's "Style…" opens the page of the
    element (editstyleutils.ts = EditStyleUtils; menu items carry action arguments).
  - Page settings…: notationscene/pagesettings.ts = PageSettings (pagesettings.cpp, widgets as values with QDoubleSpinBox
    rounding), framework/draw/qpagesize.ts (Qt's page size table, QPageSize::id/size/name), ChangePageNumberOffset;
    the mm/inch choice is the app setting ui.metricUnit. App: dialogs/PageSettingsDialog.tsx.
  - Measures per system… (BreaksDialog) and the system lock actions (apply-system-lock, toggle-system-lock,
    toggle-score-lock, make-into-system, move-measure-to-prev/next-system): editing/editsystemlocks.ts =
    EditSystemLocks with AddSystemLock/RemoveSystemLock (layout breaks remove locks, removing measures updates locks,
    createMultiMeasureRests off removes locks containing mmrests). System lock indicators (dom/indicatoricon.ts:
    IndicatorIcon, SystemLockIndicator; SystemLayout.layoutSystemLockIndicators, TLayout.layoutIndicatorIcon,
    TDraw.drawIndicatorIcon; selectable, deleting one removes its lock). System.isLocked/systemLock are real now.
  - Stretch (cmdAddStretch, resetUserStretch), Reset text style overrides, Reset beams, Reset shapes and positions,
    Reset to default layout (cmdResetMeasuresLayout, cmdResetAllStyles, Score.resetStyleValues).
  - Load style… / Save style… (musescoreweb/stylefiles.ts; .mss chosen/saved on the computer; NotationStyle.loadStyle/
    saveStyle/isValidStyleFile).
- notation/internal/notationstyle.ts = NotationStyle (INotationStyle). Score::spatiumChanged is ported
  (EngravingItem.spatiumChanged and the overrides scale user offsets, slur/tie and beam user positions, arpeggio
  lengths) for ChangeStyle and ChangeStyleValues.
- App: components/MessageBox.tsx (IInteractive error/warning), files.ts pickFile and typed saveToComputer.
- gen-uiactions: icon codes written "0X..." are read too (TIMESIG_STANDARD).
- Tests: test/format.test.ts (MuseScore's system_locks_tests, Measures per system, stretch, resets, load/save style,
  QPageSize, PageSettings, spatium change, lock indicators, EditStyleUtils), editstyle.test.ts, styledialog.test.ts;
  e2e: Page settings + Measures per system, Style dialog.
- TODO(port): StaffVisibilityIndicator; Style dialog: voicing select, chordsXmlFile, capoPosition widgets (commented out
  in C++ too); the last shown page is remembered per session only; text style fonts are the registered fonts.

### Find / Go to, Project properties
- Find / Go to (`find`, Ctrl+F): notation/internal/searchcommandsparser.ts = SearchCommandsParser, NotationElements.search,
  library searchNotation (SearchPopupModel::search); app components/SearchPopup.tsx below the score view.
- File > Project properties…: project/projectpropertiesmodel.ts (ProjectMeta tags, projectMetaInfo/setProjectMetaInfo =
  NotationProject::metaInfo/setMetaInfo, ProjectPropertiesModel; QDate ISO <-> TextDate), ChangeMetaTags,
  Score.setMetaTags; app dialogs/ProjectPropertiesDialog.tsx (no "open file location" in the browser).
- Tests: test/search.test.ts, test/projectproperties.test.ts; e2e: Find / Go to + Project properties.

### Parts (File > Parts…), stages 1 and 2
- Engraving: dom/excerpt.ts = all of excerpt.cpp (createExcerpt, cloneStaves/cloneMeasures/cloneStaff/cloneStaff2,
  cloneSpanner, createExcerptsFromParts, createLinkedTabs, tracks mapping, voice visibility, formatUniqueExcerptName,
  clone, setName); editing/editexcerpt.ts: MasterScore.initAndAddExcerpt/initExcerpt/initEmptyExcerpt, Score.clone(),
  AddExcerpt/RemoveExcerpt/SwapExcerpt/ChangeExcerptTitle/deleteExcerpt. Linked copies (Chord, Note, Rest, lyrics,
  parentheses, Trill.linkedClone, EngravingItem.linkedClone with an undoable Link). Score.scoreList(), staffById,
  linkMeasures; Staff.findLinkedInScore/initFromStaff, the Staff constructor calls initFromStaffType like C++; voice
  visibility; remapBracketsAndBarlines; manageExclusionFromParts / MeasureBase.getInScore (insertBox clones to all
  parts). Reading parts inside the main file (read460/read302), CompatUtils.assignInitialPartToExcerpts, the .mscz
  loader links the parts' measures. Score.update lays out all scores of scoreList(). sizeIsSpatiumDependent is reset
  only for 4.40+ files (read410 version guard): compare baseline updated for articulation-1/mmrest-6 (their first
  staff now matches MuseScore's SVG exactly) and mmrest-11.
- Notation/app: notation/internal/excerptnotation.ts, MasterNotation excerpt management (excerpts, potentialExcerpts,
  setExcerpts, createEmptyExcerpt, resetExcerpt, sortExcerpts), notationscene/partlistmodel.ts (PartListModel,
  NotationSwitchListModel). The library API takes `Score` (master or part) instead of MasterScore almost everywhere;
  the current notation is switchable (scoreview currentScore()/currentMasterScore()). App: dialogs/PartsDialog.tsx,
  components/NotationSwitchPanel.tsx (tabs for the score and the open parts), action "parts".
- Tests: test/parts.test.ts (MuseScore's parts_tests: creation, styles, spanners, ties, exclusion, remove/undo; 13
  skipped until stage 3), test/partsnotation.test.ts; e2e: opening and editing a part.
- TODO(port) (stage 3): linked editing — Staff.staffList() is only the staff itself, the scoreList()/linked staff
  TODOs in edit.ts/cmd.ts/splitjoinmeasure.ts etc. (adding elements, measures, time signatures... in the score is
  not yet done in the parts and vice versa); unlinkPropertyFromMaster; the tabs' context menu.

### Parts stage 3: linked editing
- Staff.staffList() returns the linked staves of all scores; Staff.getLinkedTrackInStaff (tracks mapping of the
  excerpts), trackHasLinksInVoiceZero; Score.uniqueStaves skips linked staves.
- edit.ts: undoAddElement fully ported (linked parents for notes/fingerings/texts/glissandos, section breaks in linked
  frames and all scores, clones in the linked staves with their linked tracks for articulations, chord lines, lyrics,
  segment annotations, spanners/slurs, ties, tremolos, arpeggios, instrument changes, breath; findLinkedChord);
  undoAddCR (linked staves, tuplets, lyrics); undoChangeParent (linked items in parts, recreated on another staff);
  undoExchangeVoice/cmdExchangeVoice (excerpts: CloneVoice); changeSelectedElementsVoice (isOperationValid, invisible
  voices of linked staves); cmdAddTimeSig (local time signatures of linked staves, links to the master's);
  insertMeasure, deleteMeasures, adjustToLen, time deletion, barlines, splitting/joining measures, the unmanaged
  spanners, insertTime of note entry: all scores of scoreList().
- Property linking: EngravingItem.propertyPropagation (text properties, UNLINK from parts),
  unlinkPropertyFromMaster, relinkPropertiesToMaster/relinkPropertyToMaster, isUnlinkedFromMaster (selection color),
  TextBase/SpannerSegment.isPropertyLinkedToMaster, POSITION/APPEARANCE/TEXT_LINKED_TO_MASTER relink the values;
  linkHooks.undoChangePropertyCommand (set by editing/addremoveelement.ts).
- ScoreRange.write clones the linked staves (Excerpt.cloneStaff2); pasted slurs get their linked start/end elements;
  linked note parentheses (read460); Harmony.endEdit transposes linked chord symbols of parts with another concert
  pitch setting; arpeggioHiddenInStdIfTab; staff texts excluded from parts in old files.
- Reading 2.x parts (read206 <Score> recursion, assignInitialPartToExcerpts).
- MasterNotationParts.appendStaff/appendLinkedStaff add the staff to the parts (NotationParts.appendStaffLinkedToMaster,
  appendLinkedStaff); AddPartToExcerpt; MasterNotation lays out all scores after creating a score.
- dom/mcursor.ts (MCursor, for tests), Part.initFromInstrTemplate.
- Tests: test/parts.test.ts (all of MuseScore's parts tests except createPartImage: image store), test/links.test.ts
  (links_tests), test/linkedediting.test.ts (note input in score/part, delete, transpose, measures, time signatures,
  property unlinking in parts, undo/redo); e2e: editing in a part changes the score and vice versa.
- TODO(port) after stage 3 (done in "Parts stage 4" below except replaceDrumset and the playback settings).

### Parts stage 4: Properties and Layout panels of parts, tab menu

- Properties panel: "Score and part synchronization" (inspector/parts/partssettingsmodel.ts = PartsSettingsModel,
  AbstractInspectorModel.showPartsSection, SECTION_PARTS): Position / Style/appearance / Text linked to the main score
  (toggles, relinking copies the master's values like C++, not undoable), "Exclude from parts"/"Exclude from score".
  EngravingItem.canBeExcludedFromOtherParts (Box, Clef (not header), Ottava, SystemText, SoundFlag). App: PropertyToggle
  (switch) in panels/inspector/common.tsx, PartsSettings.tsx.
- Layout panel of a part score: the items hold the master notation and the current notation (LayoutPanelNotation =
  score + LayoutPanelNotationParts); the master parts in the order of the excerpt (sortParts), instruments not in the
  part hidden and not expandable; no system markings layers in parts. Showing such an instrument inserts a clone of the
  master part (PartTreeItem::createAndAddPart, NotationParts.insertPart/doInsertPart with Part.clone, linked staves,
  Excerpt.cloneStaff2); "Reset all formatting" (NotationParts.replacePart); removing instruments/staves and adding staves
  go to the master score; the warning before removing instruments of a score with parts (removeWarning(), the app's
  message box); "Instrument ordering" only in the main score; new instruments and "Replace instrument" in the master.
- Staff settings popup (instrumentsscene/staffsettingsmodel.ts = StaffSettingsModel, createStaffSettingsModel): staff
  type, voices visible in a part (EditPart/NotationParts.setVoiceVisible), small staff, cutaway, hide empty staves,
  "If the entire system is empty, show this staff", "Create a linked staff" (MasterNotationParts.appendLinkedStaff).
  NotationParts.setStaffType (EditPart.setStaffType); system locks containing mm rests are removed when showing
  instruments/staves (EditSystemLocks.removeSystemLocksContainingMMRests).
- The notation tabs' context menu (Close tab / Close other tabs / Close all tabs).
- Score::cmdTimeDelete in a part deletes the time in the master score (and so in all parts).
- Parentheses of notes reach the linked notes of parts (tested; the parentheses are still added directly instead of
  with undoAddElement, the linked notes get HAS_PARENTHESES through the property propagation).
- Tests: test/layoutpanelparts.test.ts (part layout panel, insertPart, replacePart, removal warning, staff settings),
  linkedediting (parts section, time delete in a part, parentheses); e2e: the Layout panel of a part, the staff settings
  popup, the tabs' context menu.
- Instrument settings popup: InstrumentSettingsModel (instrumentsscene/instrumentsettingsmodel.ts): the names on the
  main/part score (NotationParts.setInstrumentName/setInstrumentAbbreviature, EditPart, ChangeInstrumentLong/Short,
  Part.setLongNames/setShortNames), hide empty staves (Auto/Always/Never, "Only hide staves on a system if the entire
  instrument is empty").
- System markings layer popup: SystemObjectsLayerSettingsModel (show/hide the groups of system objects of a layer,
  Staff.undoSetShowMeasureNumbers).
- Layout panel drag and drop: LayoutPanelTreeModel startActiveDrag/moveRows/endActiveDrag (rows move while dragging,
  the score changes on the drop); the app drags rows with the pointer.
- Customize kit (action "customize-kit", palette/customizekitdialog.ts = CustomizeKitDialog, app
  dialogs/CustomizeKitDialog.tsx): the drums of the instrument's drumset, name/notehead group/custom noteheads/voice/
  staff line/stem direction/shortcut (EditPercussionShortcutDialog with conflicts against the other drums and the
  application shortcuts), the example note (a palette cell), Load…/Save as… of .drm files, Apply/OK/Cancel.
  NotationParts/MasterNotationParts.replaceDrumset (also in the parts), EditPart.replaceDrumset, Drumset.translatedName.
  Smufl.smuflRanges with the generated table smuflranges.ts (tools/gen/gen-smuflranges.ts from fonts/smufl/ranges.json).
- Tests: test/customizekit.test.ts, layoutpanel (drag, system markings settings), layoutpanelparts (instrument names);
  e2e: renaming an instrument and dragging instruments in the Layout panel, Customize kit from the context menu.
- TODO(port): part playback settings (PartChannelSettingsLink, no mixer), Excerpt::nameChanged (notification),
  Tie::updatePossibleJumpPoints, the notehead icons in the Customize kit combos (names only), the drumset palette
  (DrumsetPanelView) and the percussion panel.

## 2026-10-23 — Renamed to MuseEncore

- The project is now MuseEncore (neither an official MuseScore project nor an official fork; README, landing page and
  About say so): MuseEncore Editor (`musescoreweb/` -> `editor/`) and MuseEncore Viewer (`webviewer/` -> `viewer/`);
  npm scripts `dev:editor`, `build:editor`, `build:viewer` (`dev` is still the viewer), build outputs dist-editor/,
  dist-viewer/; package name `museencore`; file headers "MuseEncore — port of MuseScore Studio"; the e2e test of the
  editor is test/e2e/editor.e2e.ts. Earlier entries of this file use the old paths.
- Kept: the browser storage keys and database names (`musescoreweb:*`, `musescoreweb-scores`, `musescore-web-viewer`,
  the soundfont cache) so the data of existing users stays, the repository name and the GitHub Pages URL. MuseScore
  (the original) keeps its name everywhere.

## 2026-10-23 — Viewer component, playback, fit to window, npm package museencore-viewer (renamed to muse-encore-viewer)

- The viewer is a component now (viewer/src/museencoreviewer.ts, class MuseEncoreViewer): its UI in a shadow root
  (viewer/src/viewer.css; ids are per shadow root, so several viewers fit on one page), options for the toolbar groups
  (file, pageNavigation, pageView, zoom, playback, print, fullScreen), keyboard shortcuts, toolbar, status bar, theme,
  fonts and soundfont URLs; the full screen element is the viewer; printing goes through a frame with the SVG pages.
  The app (viewer/main.ts) uses it with all groups, the stored file/view settings and the browser menu's printing.
- Playback in the viewer (viewer/src/playback.ts): the events of MuseScore's MIDI renderer on the editor's player and
  synthesizer, which moved to shared/playback (soundfont URL as parameter; the library build passes SpessaSynth's
  worklet as a blob: URL); play/pause (also Space when it was not used to move the view), rewind, position slider,
  time; the playback cursor and the view following it (smooth panning in the continuous view horizontal).
- The continuous view "fit to window" (fit-width, laid out again on resize/zoom) in the viewer, like the editor.
- npm package museencore-viewer (packages/viewer): `applyMuseEncoreViewer(target, source, options)` (viewer/src/index.ts,
  types in viewer/src/types.ts), built by `npm run build:viewer-package` into one minified ES module (+ the SpessaSynth
  chunk), declarations, fonts and license; the soundfont comes from MuseScore's repository by default (51 MB, over the
  per-file limits of the npm CDNs). Example page packages/viewer/example, dev page viewer/embed.html.
- `npm run dev:viewer`. e2e: the viewer tests look into the shadow root; new tests for the playback, fit to window and
  the embedding options.
- Not done: clicking into the score to start the playback there (it would need a hit test without changing the
  selection), loop, metronome, tempo and mixer in the viewer.

## 2026-10-23 — Export: PDF, PNG, SVG, MIDI, MusicXML, MuseScore files

- File > Export… (action "file-export"): ExportDialogModel (src/project/exportdialogmodel.ts) and the app's
  editor/dialogs/ExportDialog.tsx like MuseScore's ExportDialog.qml: the main score and the parts (also the potential
  parts of the instruments, initialized for the export), the formats with their settings pages, the unit types (each
  page / each part / all parts in one file), the export info kept per project. ExportProjectScenario
  (src/project/internal/exportprojectscenario.ts): MuseScore's file names ("-Score_and_Parts", "-Parts", "-<part>",
  "-<page>"), the page view during the export, the writers of NotationWritersRegister by suffix. The files are returned;
  the app saves one file like "Save to computer" and several as a ZIP archive. The settings are in the app settings
  (`export`), MuseScore's defaults (PNG/PDF 1200 DPI).
- PDF: PdfWriter on a vector PDF writer of our own (framework/draw/pdfdocument.ts: content streams, glyph outlines as
  form XObjects shared by all pages, JPEG/PNG images, soft masks, transparency; pdfpaintprovider.ts); per part or all
  parts in one PDF, transparent background, grayscale. Checked with qpdf; rasterized with pdftoppm at 300 DPI it equals
  the canvas drawing.
- PNG: PngWriter draws the page in strips (the canvas limits of the browsers) into a streaming PNG encoder
  (pngencoder.ts, pHYs with the resolution); transparent, grayscale; waits for the images of the score.
- SVG: SvgWriter with SvgPaintProvider (title, transparent background, clip rectangles as masks for Adobe Illustrator).
- MIDI (agent): ExportMidi, MidiFile writing, NotationMidiWriter; byte-identical to MuseScore for the C++ export tests
  and 845 of 852 vtest/demo scores. Fixed on the way: the link between the MIDI mapping's channels and the instrument
  channels (PartChannelSettingsLink: channels of parts with instrument changes were wrong, also in the playback), the
  playback-only capo in Note::ottaveCapoFret, System::add/Spanner::add call added(); layoutScore sets up the tempo map
  after the load layouts like Score::update().
- MusicXML (agent): the complete exportmusicxml.cpp (.musicxml, .xml, .mxl), 55 of the 56 C++ export tests without
  import pass; against MuseScore's export of 850 scores 50 are identical and 793 differ only in layout numbers.
  tools/compare-musicxml.ts (npm run compare:musicxml). Fixed on the way: apostrophes were dropped from texts
  (XmlReader escaping), readInt is strict like C++, time tick anchors of <location><timeTick>, old breath subtypes,
  arpeggio spans of files before 4.2, glissando texts of 4.1-4.4 files.
- MuseScore files (not in MuseScore 4): the main score as .mscz/.mscx with its parts; a part as a score of its own
  (its .mscx read as a new score), so single instruments can be exported.
- Tests: test/export.test.ts, test/musicxmlexport.test.ts, test/midiexport.test.ts; e2e: the Export dialog.
  compare:all unchanged (mean 3.77% over 867 pages, no regressions); roundtrip 655 identical, 172 within rounding, 12
  differing (new: gliss-5, whose glissandos lose their hidden text on a re-save in MuseScore too).
- TODO(port): audio (MP3/WAV/OGG/FLAC/AAC), MP4, Braille, MEI, MNX, LRC; tremolo bars in MusicXML; fallback text in
  PDFs; GIF/BMP/WebP/SVG images in PDFs; SvgWriter's concatenated staff lines and beat colors; trimming of PNG/SVG.

## 2026-10-23 — Import: MusicXML, MIDI, Capella, Guitar Pro (File > Open)

- NotationProject.doImport (src/project/internal/notationproject.ts) with the readers of NotationReadersRegister by
  suffix (src/project/inotationreader.ts, importexport/readers.ts): a new MasterScore, checkChordList, the reader,
  EngravingProject::setupMasterScore, the "originalFormat" meta tag. Library API: importScore(data, fileName),
  openScoreFile (MuseScore file or import), isMuseScoreFile, importSuffixes, openFileAccept, scoreBaseName,
  NotationReadError. Not ported: the import style setting (styleFileImportPath), unrolling repeats, the import error
  dialogs (the import goes on like MuseScore without GUI).
- Apps: the editor's File > Open (MuseScore's file type filters), dropping files and ?url= open the import formats; an
  imported score is "newly created" like in MuseScore (not modified, Save goes through Save as and makes a .mscz). The
  viewer opens them too (also the npm package's load()).
- MusicXML (agent): importmusicxml, pass1, pass2, note duration/pitch, part, tuplet state, voice desc, logger
  (.xml, .musicxml, .mxl); validation is a stub (no XSD). 294 of the 302 C++ tests (import -> .mscx, round trips)
  pass; skipped: the 5 disabled in C++, noteAttributes2 (TextCursor::changeSelectionFormat does not lay out the text
  like layoutText1), inferredCredits1/2 (title frame height, font metrics). getPlayingTechnique uses libstdc++'s
  unordered_map order (the references are made on Linux).
- MIDI (agent): the whole midiimport (quantization, tuplets, voices, meter, drums, lyrics, BeatRoot beat tracker in
  thirdparty/beatroot), MidiFile reading, NotationMidiReader with MuseScore's default operations; all 111 C++
  tests pass. Not ported: the import panel (TracksModel) and operations files.
- Capella (agent): .cap (binary) and .capx (zip, ISO-8859-1 XML); all 34 C++ tests pass. rtf2html is a simplified
  stand-in; .capx drawing objects are skipped like in C++.
- Guitar Pro / Power Tab (agent): GP1-5, GP6 (.gpx, BCFZ), GP7 (.gp, zip), .ptb, the GP DOM builders and converter,
  bend import, drumset, gp-style.mss (fonts/styles); 259 of the C++ tests pass (6 disabled in C++ too). New DOM
  elements: HarmonicMark, Rasgueado, PickScrape, DeadSlapped, TripletFeel (read/write/layout/draw).
- Engine changes on the way: Instrument() has C++'s default channel (readers clear it); Instrument.fromTemplate sets
  the user bank controller (drumsets write controller 32 like MuseScore); TDuration::toDurationList of 4.7.5;
  XmlReader drops whitespace-only text (pugixml), normalizes line ends, detects UTF-16/Latin-1; test mode of the
  writer like C++ (style in the score, no version/platform tags, beam l1/l2); Score::getCreateMeasure; framework
  helpers stdmap.ts/orderedmap.ts (C++ map/set iterators), xmldom.ts, io/buffer.ts; engravingerrors.ts (Err).
- Tests: test/musicxmlimport.test.ts, midiimport.test.ts, capellaimport.test.ts, guitarproimport.test.ts,
  guitarprodom.test.ts; e2e: both apps open the import formats, the editor saves an imported score as .mscz.

## 2026-10-23 — Viewer: dragging without Space, zoom entries of the continuous views

- The viewer moves the view with a plain mouse drag (Space + drag and the middle button as before; touch keeps the
  browser's scrolling); tapping Space plays/pauses.
- Zoom box (viewer and editor): the page view offers "Page width" and "Whole page"; the continuous views one entry
  "Fit to window height" (horizontal) / "Fit to window width" (vertical), which fits their long page across; "Fit to
  window" has none (the page is always as wide as the window). The new strings are in editor/locales/webstrings.json.

## 2026-10-23 — Import settings and dialogs; SpessaSynth channels

- Playback: SpessaSynth's "channelAdded" event adds a second channel to the main thread's list for each added channel,
  so channelCount ran ahead of the worklet: after channels had been added once (another score, a preview note), the
  channels of a score with more instruments were not added and nothing was played (the user heard only the bass of an
  imported MIDI file). SpessaSynthesizer counts the worklet's channels itself; e2e test with the real synthesizer.
- Preferences > Import (ImportPreferencesPage.qml): the style used for import (built-in or a style file, stored with
  its content in the settings; NotationProject::doImport loads it before reading), MusicXML (import layout, breaks,
  default typeface Edwin, infer text type) and MIDI (shortest note, round tempos). Overture charset, MEI and MNX are
  not ported. Library: importConfiguration/setImportConfiguration/defaultImportConfiguration, MidiConfiguration
  (midiconfiguration.ts) for io/midi/shortestNote and roundTempo, importScore options `style`.
- The dialogs of the import go through NotationReaderOptions.interactive (C++ IInteractive/MessageBox; without it the
  import goes on like MScore::noGui): MusicXML "%Ln error(s) found, import may be incomplete. Do you want to try to load
  this file anyway?" (asked by MusicXmlReader after the import; the count is the length of the error text like C++),
  "Import MIDI"/"Import Capella" "Import failed: %1". NotationReadError has the Err code. The editor shows them in its
  message box and ProjectActionsController::warnProjectCannotBeOpened ("Cannot read file %1") when a file cannot be
  opened (also MuseScore files). The viewer has no dialogs (no GUI behaviour).
- MuseScore 4.7.5 has no MIDI import panel (only MuseScore 3 had one): not ported.
- Tests: test/importsettings.test.ts; e2e: the MusicXML question, MIDI warning, Cannot read file, Import preferences.

## 2026-10-24 — Viewer: About dialog

- The keyboard shortcuts dialog (the "?" button) has an "About…" button that opens a separate About dialog: the logo
  (logo/muse-encore-logo.svg, inlined), "MuseEncore Viewer", the version of the npm package (packages/viewer/package.json)
  and the GitHub homepage with the GitHub mark. Keyboard shortcuts are off while it is open.

## 2026-10-30 — Editor: Playalong (not in MuseScore)
- Playalong button in the playback toolbar (microphone icon): listens to the microphone, detects the notes played and
  follows the score measure by measure in the played order (RepeatList unrolled: repeats, voltas, D.C./D.S., codas).
  Starts at the selected measure (and follows the parts of the selection, else all parts); selecting a measure while
  it is on continues there. While on: previous/next measure buttons, the measure number, "Playalong practice" (setting
  `playback.playalongPractice`), the notes heard. The measure is highlighted in the score view and the view follows it.
  Playback is paused when it starts (the microphone would hear it).
- Library: `src/playalong/api.ts` — `playalongMeasures(score, partIds)` (measures in the played order with the
  sounding pitches per chord/rest segment; tied notes and unplayed notes left out) and `playalongMeasureBounds`.
- Score following: `editor/playalong/follower.ts` (`PlayalongFollower`, `ChordGrouper`; pure, test/playalong.test.ts).
  Notes within 100 ms form a chord. Similarity: exact pitch 1, octave error 0.55, semitone off 0.45; partial chords
  count, notes not belonging to the event lower it. The next expected event accepts lenient matches, events up to 3
  ahead (missed notes) need the right pitches. Jumps (follow mode: up to 2 measures ahead; practice mode: 16 measures
  back or ahead) need several chords in a row (2, practice 3 or 2 from a measure start) while the current position
  missed some of them. A constant tuning offset of ±1–2 semitones is learned from the matches.
- Note detection behind `shared/notedetection/notedetector.ts` (`NoteDetector`, `createNoteDetector`, loaded with a
  dynamic import): the current implementation is Spotify's basic-pitch (Apache-2.0), vendored in
  `shared/notedetection/basicpitch/` from the local basic-pitch-ts checkout (its live demo's transcriber/audio input;
  the MIDI file writing removed) with the TensorFlow.js model (served/copied to `basic-pitch/` by
  vite-plugin-basicpitch.ts). New dependency `@tensorflow/tfjs` (only in the detector's lazy chunk, ~1 MB).
  To replace the detection, implement `NoteDetector` and change `createNoteDetector`; to remove it, delete
  shared/notedetection, editor/playalong, src/playalong and their few wiring lines (appactions.ts, PlaybackToolBar.tsx,
  vite.config.ts, settings.ts, style.css).
- `?playalong-input=test-melody`: a synthesized melody instead of the microphone (development).
- Follow-up (user: it moved on too early in songs with repeated parts): the current position only looks ahead within
  the current measure; the next measure is entered after its last event was played. Other positions are only kept
  while the current one misses (cleared when it matches), so a jump needs chords in a row the current position
  missed; leaving a measure whose last event was missed needs one more chord, more than that missed two more. A lone
  octave error no longer matches (it only supports chords). Follow mode jumps only to measure starts. Timing: the
  tempo (median seconds per tick of the recent matches, pauses left out) is estimated; skipping events and crossing
  the barline are refused when the chord comes much too early (late is always fine).
- Missing: following through measures without notes (rests) by tempo (the next played note jumps over them);
  a tuning/sensitivity UI; the viewer has no playalong yet.
- Follow-up 2 (still too early; practice mode jumped from measure 2 to 15; the measure cut off at the left in the
  continuous view): the next measure is only reachable when the measure was played to a degree (60 % of its events,
  its last event with a clear match; a lenient match is upgraded when the chord is played again). A chord fitting the
  event just played better than the next one is a repetition (or a double detection), it does not skip ahead.
  Practice mode looks only at 3 measures back and 2 ahead; jumps over more than one measure need one more chord per
  measure. The tuning offset is learned after 4 agreeing matches. View: `showRectInView` (scoreview.ts) keeps the
  measure fully visible right of the continuous panel (its last width is remembered: it appears only after the view
  moved; checked again after the panel was drawn), with the previous measure in practice mode if it fits.
- Follow-up 3 (practice mode did not move on): the greedy follower (one position + confirmed jumps) was replaced by a
  probabilistic alignment (Viterbi over the events near the current measure: next event, skips with a penalty, more
  for skipping the end of a measure, stays for extra/wrong notes or repeated chords, jumps to measure starts; the
  chord similarity and the timing fit are the scores; the measure shown changes when another measure is better by a
  margin). The window counts measures with events (rests are passed) and is anchored on the best position; it grows
  ahead when the best position does not move (lost). test/playalongsim.test.ts plays demo scores (piano both hands,
  a lead sheet) with simulated detection errors (25 % notes missed, octave errors, extra notes, jitter): it never runs
  ahead of the player in straight playing; with noise it is right after 60-97 % of the chords (the lead sheet with 2-3
  notes per measure is the hardest). The parts followed are those of the selection (a piano: both staves).
- Follow-up 4 (the detection fell behind with many notes): basic-pitch's melodia trick (notes without onsets: one
  scan of the whole history per remaining note, ~10 times a second) is off and the decoded history is 2.5 s: in
  Chrome ~35 ms per update (every 93 ms), notes reported 0.1-0.2 s after they start, not growing. The NoteDetector
  has stats() (processing time, latency; window.__museencorePlayalong, the tooltip of the notes heard). Notes reported
  after a later chord was processed are dropped (ChordGrouper). The follower uses the time since the last chord: once
  the tempo is known, skipping events, the end of a measure and jumps ahead are cheaper when the time fits, skips may
  go as far as the time reaches and the window grows with it (measures the detection missed are passed: simulated
  with every 5th measure undetected, 83-93 % right; without it two scores were lost).
- Follow-up 5: the detection runs in a Web Worker (shared/notedetection/basicpitch/worker.ts: resampling, TensorFlow.js,
  decoding, de-duplication; the recorder worklet gets a MessagePort and sends the audio directly to it; the editor's
  Vite config builds workers as ES modules; the worker chunk has TensorFlow.js, the main thread part is 5 kB). In
  Chrome ~30 ms per update in the worker, notes 0.1-0.2 s late. Note input from the microphone: in note input mode
  the playalong button enters the chords detected at the input position (like MIDI input): Score.noteVal/addMidiPitch
  (edit.cpp) and NotationMidiInput.onNoteOns (doProcessEvents/addNoteToScore/addNoteEventsToInputState for note-on
  events; the input by duration takes the pitches as the input notes; realtime auto advances on the first note) are
  ported; library API enterMidiNotes(score, pitches). Each detected chord is pressed and released (no note-offs:
  real-time modes do not extend notes by their duration). It stops with the note input. Not done: note durations from
  the played lengths (the input duration is used), MIDI devices (Web MIDI could use the same path).
- Follow-up 6: the notes heard are shown in the status bar (#status, a nested aria-live="off" span) instead of the
  toolbar. Level gate (shared/notedetection/basicpitch/levelgate.ts, test/levelgate.test.ts) in the worker: notes whose
  mean level over ~100 ms after their start is not 15 dB above the noise floor (the quietest ~93 ms block of the last
  60 s, at most -50 dBFS: music from the start is not the room's noise) or below -60 dBFS are not reported (keys
  pressed without sounding, clicks). The transcriber's updates report the sample their window ends at (endSample) to
  align the notes with the levels (the model output ends 15.3 hops before the window end). Stats: rejected, floorDb.
  The microphone is opened without automatic gain control, noise suppression and echo cancellation. Fixed: the close
  buttons of the score tab and of the instrument dialogs had lost their icon glyph (empty string): ICON_CODES.CLOSE_X_ROUNDED.
- Follow-up 7 (view panning, also for the playback): adjustViewToRect (C++ adjustCanvasPosition) now accounts for the
  continuous panel's width like C++ (the bar was placed under the panel after a page turn); the panel is drawn for the
  new position at once and the view corrects for its width in the same frame (no second jump at the first turn). Not in
  C++: the continuous views keep the position across their direction (alignToCurrentPageBorder no longer snaps the
  vertical position in the horizontal view, or the horizontal one in the vertical view) unless it had to move; without
  smooth panning, the playback in the horizontal view pans on the whole measure played (it moves when the measure
  starts and does not fit, not when the cursor reaches the edge). Playalong: showRectInView gets the measure played next
  (state.nextTick) and turns one measure early, and only moves in the direction of a continuous view.
- Follow-up 8: the notes heard are shown after the status text, before the concert pitch button (their changing
  length no longer moves the status text or the controls). While the playalong follows, the arrow keys move it: Left/Right the previous/next measure (playalong-prev/next),
  Up/Down (playalong-up/down, "Measure above"/"Measure below", not in the horizontal continuous view) the measure of the
  system above/below nearest to the current measure's horizontal center. The app's actions have shortcuts in
  APP_SHORTCUTS (actions.ts) and take precedence over MuseScore's (next-chord, pitch-up, ...) with priority 2 while
  enabled. Arrow keys on a button focused by a mouse click (not :focus-visible) now go to the score (e.g. after clicking
  the microphone button), like MuseScore's toolbar buttons that take no focus. The playalong mode follows the note input
  while the microphone is on (it was fixed at the start: started before N, it kept following and entered no notes):
  N switches to entering the notes played, leaving the note input follows again (started in note input: it stops).
- Follow-up 9: overtone filter of the note detection (shared/notedetection/basicpitch/overtonefilter.ts, in the worker):
  a weaker note at a harmonic distance above a low note starting at the same time is not reported (piano bass: octave,
  twelfth, ... were detected). Levels Off/Normal/Strong in the Playback settings menu (settings.playback.
  playalongOvertoneFilter, NoteDetector.configure, worker message 'settings'); stats.overtones; test/overtonefilter.test.ts.
  Ratios not verified with a real piano.
- Follow-up 10: calibration of the note detection ("Calibrate the note detection…" in the Playback settings menu):
  opens editor/playalong/calibration.mscx (made with MuseScore from MusicXML; "let ring" next to the dynamics) and starts the playalong in mode
  'calibration' (Calibrator in shared/notedetection/calibration.ts instead of the follower; the step's measure is
  highlighted; CalibrationBox.tsx guides: silence, loud low notes, bass octaves, soft notes; Skip/Cancel, at the end
  Repeat/Use these values; the menu item is at the end of the Overtone filter submenu). The worker reports the notes before filtering (DetectionUpdate.raw with the level); the
  result (overtone ratios, level gate threshold) is stored as settings.playback.playalongCalibration and the overtone
  filter level "Calibrated". Checked headless with the test melody (steps, skip, saving); not with a real piano.
  The calibration sheet is opened like a file, so it appears in the home screen's score list.


- Connected panel and palette styles; aligned tab/accordion markup, added palette header and expandable dock controls, restored variable panel width and keyboard resizing. Latest score diff 46,445/1,024,000; interactions and mobile remain unverified. Typecheck and editor build pass; inspector tests 2 passed, 5 fixture skips. Palette search/menu/grid still differ from React.

- Expanded palette grid now uses reference grid geometry, canvas DPR and icon glyphs; removed #app-root font shorthand overriding icon fonts. Desktop Clefs grid geometry matches reference (275×112 at 12,233; seven 39×55 cells); full screenshot diff 49,682 pixels. More button and palette interactions still incomplete. Typecheck/build passed; inspector tests 2 passed, 5 skipped.

- Palette search uses shared search state and master-palette filtering; search results expand like reference, Escape restores focus. `capture-palette-search.mjs` asserts seven treble results and focus behavior on both apps; full-screen diff 44,682 pixels. Typecheck/build passed; inspector 2 passed, 5 skipped. Remaining palette actions, glyph positioning and mobile unverified.

- Playback toolbar now uses reference action icons/order, mute, settings and tempo display; Parts label restored and excess flex removed. Desktop score diff 45,429/1,024,000 (prior 46,445); playback interactions and active playalong controls still require work. Typecheck/build passed; inspector tests 2 passed, 5 skipped.

- Playback speed popup uses reference native controls and CSS; desktop popup both 280×84 with 1px horizontal offset. `capture-speed.mjs` verifies Escape/focus restoration in both apps; full-screen diff 46,674 pixels. Active playalong status/navigation added, unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Added note-input Add menu and persisted customization controls; desktop customize popup matches 340×560 and 51 items, sits 27px left because toolbar differs. `capture-customise.mjs` verifies toggle and Escape/focus; full-screen diff 58,922 pixels. Add menu differs from reference and reorder/reset/mobile remain unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored React status-bar controls and fit-width view action. React status controls were 1px taller; Vue viewport and fit-to-page zoom therefore differed. Both viewport 980×590 and first page 383.21875×542 now match, full score diff reduced 45,429 to 10,600 pixels. Typecheck/build passed; inspector 2 passed, 5 skipped. Status menu interactions and mobile remain unverified.

- Restored view toolbar page navigation, view mode, zoom selector and action ordering. Desktop bar geometry matches (1280×41); page-next and 100% zoom pass `check-view-toolbar.mjs` on both apps. Full-screen diff 9,755 pixels. Typecheck/build passed; inspector 2 passed, 5 skipped. Other controls, menus and mobile unverified.

- Fixed note-input customization reactivity: settings snapshot now invalidates both toolbar and popup. `capture-customise.mjs` verifies hiding/restoring pad-note-64 in both apps, plus Escape/focus. Current full-screen customize diff 32,647 pixels (after prior status/toolbar fixes). Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored panel-tab menu and palette expand/collapse/settings actions. `check-panel-menu.mjs` verifies expand/collapse on both apps; desktop full-screen menu diff 16,189 pixels. Layout panel menu and popup styling still differ. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Layout panel now uses reference CSS, control/row structure, icons and system-text row; desktop panel geometry matches 299×587, full-screen diff 5,796 (before 5,997). Existing part controls retained; row settings, expansion and system-marking actions remain missing/unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Add palettes popup now keeps added confirmation, supports keyboard/Escape, outside dismissal and translated labels. `check-add-palettes.mjs` verifies adding and Escape/focus on both apps; popup geometry matches 275×480 at (12,191), full-screen diff 5,166 pixels. Custom creation, outside dismissal and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Added palette More grid and pool selection/add; desktop Clefs popup geometry and 25 cells match React; Escape/focus pass `check-palette-more.mjs`, full-screen diff 17,965 pixels. Custom cells section, selection/add, drag and mobile remain unverified/incomplete. Typecheck/build passed; inspector 2 passed, 5 skipped.

- More popup now refreshes pool when palette tree changes and supports Shift multi-selection. Attempted add verification blocked: reference Add remains disabled after attempted Enable editing; no parity claim. Escape/focus passes, full-screen diff 17,949 pixels. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Replaced fixed-height toolbar frames with reference wrapping layout. Mobile score diff 18,346 to 12,456 pixels; bottom chrome matches, top chrome 0.8125px shorter. Desktop score diff now 6,785 pixels. Page/zoom and customization toggle checks pass; typecheck/build pass; inspector 2 passed, 5 skipped. Mobile interactions and remaining toolbar gaps unverified.

- Connected inspector stylesheet and matched no-selection score display/appearance markup while retaining Vue hide-empty-staves behavior. Desktop inspector geometry matches, full-screen diff 6,563 to 3,172 pixels; collapse persistence passes on both apps. Display toggle disabled in both sessions, selected-element and mobile states unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Matched selected key-signature inspector General/notation markup and controls; desktop full-screen diff 7,289 to 3,311 pixels. Existing appearance controls retained inline rather than reference popup; property editing, other selection types and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored inspector appearance popup structure and control layout; desktop popup geometry 275×458 matches, full-screen diff 10,703 to 3,555 pixels. Escape/focus passes in both apps; edits, units, other selections and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Appearance numeric controls now match reference decimal input, bounds, steps and offset units/vertical availability. `capture-inspector-appearance.mjs` verifies comma input and arrow increment plus Escape/focus in both apps; full-screen diff remains 3,555 pixels. Other edits and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored Preferences native dialog shell and General page from React. Fixed global heading margin reset overriding reference CSS. Desktop General diff 2,830 to 0 pixels, identical 720×480 dialog; tab switch and OK close pass. Other pages retain Nuxt controls and need comparison; mobile and settings edits unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Replaced Preferences remaining Nuxt controls with React-matching native structure. Desktop diffs cloud/note/import/web 1,376/7,402/8,678/4,493 to 0/0/0/44 pixels; mobile 0/0/0/19. Autosave toggle and Escape pass both apps. Other setting changes, file picker and General mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored New score native dialog shell and Choose instruments three-column reference structure, retaining instrument selection, order and adding list actions. Desktop initial diff 286,283 to 0 pixels; add/remove/close pass both apps. Template, info, creation, alternate states and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored Create from template lists, default selection and rendered score preview from reference. Desktop diff 46,514 to 0 pixels; mobile 0 pixels; category selection, Next/Back and Cancel pass both apps. Other previews, errors, score info and creation remain unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored New score additional information layout, score options dropdowns and metadata controls from React. Desktop diff 16,636 to 0 pixels; mobile 0 pixels. Key/tempo changes, title persistence and Escape pass both apps; dropdown screenshots, time/pickup and creation unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Compared all four New score information dropdowns at desktop/mobile: 0 differing pixels and matching bounding boxes. Common time and pickup edits pass both apps. Alternate states and score creation unverified.

- Restored React-style main menubar/popup structure and keyboard navigation. File menu desktop diff 4,903 to 0 pixels; mobile 0; popup geometry matches. F10, arrows, Escape focus and Preferences action pass both apps. Other menus/submenus and score actions unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Compared all seven main menus with score loaded at desktop/mobile: popup bounds match; full-screen diffs desktop 4,417–6,359, mobile 6,733–10,494, mainly workspace. View > Toolbars submenu bounds match, Left/Escape pass; full-screen diff 5,402. Other submenu/action states unverified.

- Restored Layout Add menu and native instruments dialog. Menu diff 47,256 to 2,841 pixels, matching 314.375×71; dialog both 1040×700, diff 1,126. Escape/focus, instrument selection and Cancel pass. System markings action unimplemented; OK score edit and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Wired Layout system markings action to reference tree model and undoable editbridge commands. Single-piano fixture disables action in both apps; enabled path needs multi-part fixture verification. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Verified Layout instruments dialog OK adds Flute and enables System markings; action adds second System texts row in both React and Vue (`check-layout-system-multipart.mjs`). Undo and mobile unverified.

- Restored Layout part expansion and child staff rows, visibility and basic tree keyboard handling. Expanded Piano diff 36,320 to 6,612 pixels; both show Treble, Bass and Add staff. Settings buttons, keyboard/edits, persistence and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored Layout instrument/staff/system settings popups using undoable library models. Popup bounds match; full-screen diffs 2,686/2,843/2,844; name, small staff and Escape pass both apps. Expanded Piano diff now 2,816. Part-score reset formatting missing; other edits, undo, mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Layout tree Arrow navigation, staff selection and collapse pass React/Vue `check-layout-keyboard.mjs`. Added part-score reset formatting confirmation/command; part-score path unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored palette header/menu structure and core actions. Clefs menu diff 11,021 to 2,932 pixels, both 220×219; Enable editing opens. More Add disabled in both sessions. Palette properties and custom hide/delete confirmation unimplemented; reorder, other actions and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored palette properties and custom hide/delete question dialogs, plus empty palette grid placeholder. Custom palette properties bounds match; full-screen diff 7,277 to 2,622, Cancel restores name in both apps. Other fields, OK, hide/delete and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored palette header Arrow/Home/End navigation and expand/collapse; `check-palette-keyboard.mjs` passes both apps. Grid keyboard, drag and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored palette grid listbox/option semantics, roving focus, arrow/Home/End navigation and Escape to header. `check-palette-grid-keyboard.mjs` passes both apps. Drag/drop, selection application and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored palette header drag reorder and editable grid drop plumbing (reorder/move/copy and score element drops). Header reorder passes both apps via `check-palette-drag.mjs`; grid drops and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored custom section in palette More popup. Drag from More to editable custom palette passes both apps (`check-palette-cell-drop.mjs`); other drop paths and custom add/delete unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Palette grid keyboard column calculation now follows actual wrapped cells; canvas redraws on color-scheme changes. Grid keyboard and More-to-custom drag checks pass both apps. Typecheck/build passed; inspector 2 passed, 5 skipped.

- About dialog previously failed to open through Nuxt modal; restored native React structure and close behavior. Desktop/mobile bounds match, pixel diffs 5/4 (`capture-about.mjs`); Escape passes both. OK and links unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored Project properties native dialog and fixed new-row reactivity. Desktop/mobile bounds match; full-screen diffs 1,323/1,235; add row and Escape pass both (`capture-project-properties.mjs`). Save/delete/undo unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored Page settings native dialog, group layout and timed decimal spin behavior. Desktop/mobile bounds match, full-screen diffs 2,391/274; Landscape and Cancel pass both (`capture-page-settings.mjs`). Other edits, rollback and OK unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored Measures per system native dialog and inline translated interval layout. Bounds match desktop/mobile; full-screen diffs 2,349/6,368; radio and Cancel pass both (`capture-breaks.mjs`). OK/undo and mobile residual unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Page settings numeric edit and Cancel rollback pass both apps (`check-page-settings-rollback.mjs`). Restored Insert measures count native dialog; bounds match desktop/mobile, full-screen diffs 2,402/7,044; input and Cancel pass (`capture-measures-count.mjs`). Insert/undo and mobile residual unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Removed Vue-only main dock flex-basis override: mobile toolbar wraps like React, chrome/viewport bounds now match and score diff falls 10,832 to 2,635 pixels (`capture-score-mobile.mjs`). Measures per system mobile diff falls 6,368 to 2,307. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored note-input method, tuplet and cross-staff action menu arrows and menus. First menu and Escape pass both apps (`check-note-toolbar-menu.mjs`); mobile score diff falls 2,635 to 242 pixels (`capture-score-mobile.mjs`). Menu actions/other states unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored accessible toolbar grips, move menus, Alt-arrow movement and pointer drag plumbing. Grip menu and keyboard reorder pass both apps (`check-toolbar-grip.mjs`); pointer drag unverified. Mobile score diff 196 pixels, desktop 292 before grip change. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored Transpose native fieldsets and independent option states. Desktop/mobile bounds match; full-screen diffs 11,417/275 (desktop mainly selected score); diatonic radio and Cancel pass both (`capture-transpose.mjs`). Apply/undo unverified. Typecheck/build passed; inspector 2 passed, 5 skipped. Toolbar pointer drag attempt inconclusive in React; no pass claim.

- Restored Export dialog native reference layout while preserving export model/save path. Visual and interaction checks blocked: React server port 5180 refused connection; `capture-export.mjs` ready to rerun. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restarted React reference (bound IPv6 localhost). Export dialog desktop/mobile bounds match; full-screen diffs 251/158; select all, clear and Cancel pass both (`capture-export.mjs`). Format settings, actual export and busy state unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Verified PDF resolution, grayscale and PDF download in both apps (`check-export-formats.mjs`); other formats and busy/cancel behavior unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored Parts dialog native layout, title validation and row menus. Desktop/mobile bounds match; full-screen diffs 212/158; new part, Escape from edit and Close pass both (`capture-parts.mjs`). Other row operations/opening parts unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored Save score native dialog, input selection and validation. Desktop/mobile bounds match; full-screen diffs 233/169; blank-name validation and Escape pass both (`capture-save-score.mjs`). Browser/computer save unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored Select More native grid, enabled states and action radio semantics. Key-signature desktop bounds match, full-screen diff 389; Add to selection and Cancel pass both (`capture-select-dialog.mjs`). Note variant, apply and mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored Style dialog native shell and page-list structure. Outer bounds match; Score page still differs substantially (40,248 desktop / 11,995 mobile pixels), primarily widget/layout rendering. Clefs page selection and Escape pass both (`capture-style.mjs`); edits and rollback unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Matched Style widget wrappers, fieldsets, labels, spin and reset structures to React; Score page full-screen diff fell 40,248→298 desktop and 11,995→220 mobile (`capture-style.mjs`). Other pages/edits remain unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Audited Style Spacing, Sizes, Header & footer, Clefs/key/time desktop (`capture-style-pages.mjs`); fixed textarea structure, Header diff 24,638→301 pixels. Clefs QML page remains incomplete (16,136 pixels). Typecheck/build passed; inspector 2 passed, 5 skipped.

- Style numeric controls now commit typed edits on Enter/blur and discard pending text on Escape like reference. Staff-line spin commit and Cancel rollback pass both apps (`check-style-rollback.mjs`). Typecheck/build passed; inspector 2 passed, 5 skipped. Clefs QML page remains incomplete.

- Restored Create tuplet native fieldsets and radio controls. Desktop bounds match, full-screen diff 253; ratio edit, number format and Cancel pass both (`capture-tuplet.mjs`). Creation/undo/mobile unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Restored Realize chord symbols native structure from reference; chord-symbol fixture, visual comparison and apply remain unverified. Typecheck/build passed; inspector 2 passed, 5 skipped.

- Compared Realize chord symbols dialog at desktop/mobile: exact bounds, diff 338/266 pixels; Show more and Cancel tested. Corrected EditPitch dialog to native React-equivalent shell and focus/close flow; no usable staff-properties fixture path to capture it.

- Rebuilt Clefs/key/time Style page with working core selectors and numeric fields from ClefKeyTimeSigPageModel; style image assets could not resolve because MuseScore submodule is absent (only share present). Latest diff 22,304 pixels, so visual parity remains poor. Typecheck/build pass.

- Rechecked Style page screenshot: 22,304 full-screen pixels differ; metric includes backdrop. Current page has core controls but substantial visual divergence; image assets absent in both local and upstream submodule trees. Typecheck/build pass; inspector 2 pass, 5 fixture-skipped.

- Restored React QML page CSS and native spacing/image slots/radio grouping in Clefs-key-time Vue page; desktop full-screen pixel diff improved 18,405→7,367 since root structural comparison; image files unavailable in local/upstream submodule trees. Build/typecheck pass; inspector 2 pass, 5 fixture skips.

- Continued Style QML alignment: nested groups/radiogroups and MuseScore icon font mapped; latest capture unexpectedly regressed to 22,887 pixels and exposed missing source images. Retain regression explicitly. Build/typecheck pass; inspector 2 pass, 5 fixture skips.

- Latest Clefs page refinements: reproduced native radio-group nesting and replaced Unicode time-signature glyphs with MusescoreIcon codes. Current typecheck passes. Fresh screenshot run failed waiting for `.page canvas`; screenshot artifacts therefore stale and no new pixel count. Editor build attempt exited 1 with config-loader diagnostics only captured; needs rerun/diagnosis.

- Fresh Style page capture reduced Clefs diff 9,243→7,581 px (other pages 302-308). Source/DOM inspection found undefined `sd-hbox` stacking time-signature placement/illustration; changed to React-equivalent `.sd-row`, correcting structure. React QML image assets remain absent. Typecheck passes; editor build and focused Inspector run had passed immediately before this one-class layout fix.

- Style Glissandos & note-anchored lines: restored native columns/controls; desktop diff 17,707→633, mobile 220 (`capture-style-glissando*.mjs`). Typecheck/build pass; Inspector 3 pass, 5 skipped. Wavy, dashed, thickness, Show text and note-line dotted persist in both (`check-glissando-style.mjs`); numeric input styling and other interactions remain to verify.

- Style Notes flag selector restored; desktop diff 27,385→309, mobile 220. Typecheck/build pass; Straight persists and Cancel restores prior selection in both (`check-note-flags.mjs`); remaining controls unverified.

- Style Rests selector restored; desktop diff 25,173→265, mobile 220. Typecheck/build pass; two-space offset and Merge matching rests persist in both (`check-rests-style.mjs`); remaining controls unverified.

- Style Tuplets number-alignment selector restored; desktop diff 29,938→263, mobile 220. Typecheck/build pass; Rhythmic center persists and Cancel restores it in both (`check-tuplet-style.mjs`); remaining controls unverified.

- Style Barlines default captures: desktop diff 307, mobile 220; alternate states and interactions unverified.

- Style Arpeggios default captures: desktop diff 301, mobile 220; alternate states and interactions unverified.

- Style Chord brackets default captures: desktop diff 325, mobile 220; alternate states and interactions unverified.

- Style Dynamics & hairpins desktop diff 4,048→287, mobile 220; restored React OffsetSelect structure. Typecheck/build pass; horizontal offset persists and Cancel restores it in both (`check-dynamics-offset.mjs`); other offsets unverified.

- Style Ottavas default captures: desktop diff 299, mobile 220; alternate states and interactions unverified.

- Style Pedal lines default captures: desktop diff 298, mobile 220; alternate states and interactions unverified.

- Style Trill lines default captures: desktop diff 299, mobile 220; alternate states and interactions unverified.

- Style Vibrato lines default captures: desktop diff 300, mobile 220; alternate states and interactions unverified.

- Style Text lines default captures: desktop diff 293, mobile 220; alternate states and interactions unverified.

- Style System text lines default captures: desktop diff 271, mobile 220; alternate states and interactions unverified.

- Style Articulations & ornaments default captures: desktop diff 280, mobile 220; alternate states and interactions unverified.

- Style Fermatas default captures: desktop diff 285, mobile 220; alternate states and interactions unverified.

- Style Staff text default captures: desktop diff 281, mobile 220; alternate states and interactions unverified.

- Style Tempo text default captures: desktop diff 292, mobile 220; alternate states and interactions unverified.

- Style Lyrics default captures: desktop diff 285, mobile 220; alternate states and interactions unverified.

- Style Expression text default captures: desktop diff 288, mobile 220; alternate states and interactions unverified.

- Style Rehearsal marks default captures: desktop diff 315, mobile 220; alternate states and interactions unverified.

- Style Figured bass default captures: desktop diff 312, mobile 220; alternate states and interactions unverified.

- Style Tablature default captures: desktop diff 312, mobile 220; alternate states and interactions unverified.

- Style Text styles desktop diff 16,144→280, mobile 220 after restoring native input, alignment/font controls and color class. Typecheck/build pass; Bold and left alignment persist in both (`check-textstyles.mjs`); other interactions pending.

- Style Spacing default captures: desktop diff 299, mobile 220; alternate states and interactions unverified.

- Style Sizes default captures: desktop diff 304, mobile 220; alternate states and interactions unverified.

- Style System default captures: desktop diff 309, mobile 220; alternate states and interactions unverified.

- Clefs lower hierarchy and gaps restored; page height and lower scroll match React, lower diff 1,120→303 after matching checkbox wrapper. Typecheck/build and scale interaction pass; image assets and remaining controls unverified.

- Clefs mobile lower capture diff 220 at bottom; scale-lock fix restored matching scroll 3,332, clipped in both. Middle capture at 1,500 also diff 220.

- Fresh toolbar customization capture: diff 4,328; popup x 668.703 React vs 669 Vue, same dimensions. Toggle and Escape pass. Fractional position may explain text antialiasing; no cause established yet.

- Customize popup fractional offset experiment: matching anchor and item metrics; temporary correction reduced diff only 4,328→4,240, so no production patch. Remaining rendering difference unexplained.

- Customize popup temporary untransformed positioning reduced diff 4,298→899; Reka transform/compositing root cause. Production fix pending.

- Customize popup now uses React fixed placement instead of transformed Reka wrapper: desktop diff 4,298→272, mobile 681→30; bounds, toggle and Escape/focus match. Typecheck/build pass; outside click and remaining actions unverified.

- Customize popup outside click, toggle, Move up, Reset and Escape/focus pass React/Vue (`capture-customise.mjs`); latest desktop diff 249.

- Parts confirmation blocker narrowed: `ExcerptNotation.isEmpty()` tests excerpt.parts().length; opened/duplicated Piano did not populate it. Need custom excerpt with assigned instruments before testing confirmation.

- Attempted custom part plus Flute for Parts confirmation (`check-parts-nonempty.mjs`): React deleted without question; waiting for No timed out. Confirmation remains unverified.

- Customize popup keyboard Space and separator add/delete pass both apps; latest desktop diff 237.

- Toolbar drag inspection: React pointerup listener captures render-time `drag`; attempted reorder still unproven. Inspector focused test 3 passed/5 skipped.

- Select More mobile after opening on desktop selection then resize: bounds match, diff 158; Add to selection and Cancel pass. Direct mobile selection and Apply remain unverified.

- Select More mobile Add to selection + OK closes in both; actual selection result remains unverified.

- Select More mobile Add + OK: Key signature inspector appears in both; selection count remains unverified.

- Parts confirmation attempt lacked active-tab/Flute assertions; no claim that excerpt contained Flute. Need verify assignment before concluding.

- Confirmed Test part active and Flute visible, but reference Layout adds instrument to master score, not excerpt; custom-part confirmation fixture remains empty.

- Custom part Piano visibility activation confirmed in React, but Delete still has no confirmation; excerpt internal contents unverified.

- Fixed MessageBox native dialog parity; populated custom part Delete No/Yes passes React and Vue (`check-parts-nonempty.mjs`). Prior absent-confirmation conclusion was selector timing error. Typecheck and editor build pass; visual and other variants remain to verify.

- MessageBox form restores React margin: desktop confirmation diff 544 pixels, mobile dialog crop 66 (full 9,228); bounds and No/Yes match. Typecheck passes; other variants remain open.

- MessageBox Escape and populated-part Reset confirmation choices tested in both; reset effect remains unverified.

- MessageBox variant direct-import probe failed to reach Vue mounted host; use real UI trigger for future coverage.

- Invalid style MessageBox OK verified desktop/mobile in both; diffs 577/496 pixels and bounds match. Typecheck passes.

- MessageBox detail variant verified through failed style-file write on desktop/mobile; matching bounds and OK closes both.

- Found reproducible Customize kit fixture (Jazz Combo drum measure); desktop screenshot reveals major Vue/React dialog mismatch, still open.

- Customize kit native hierarchy and CSS port reduces desktop diff 825,518 to 1,421; canvas mount fixed. Typecheck passes; mobile and interactions remain open.

- Customize kit mobile diff 388; Name Cancel/OK persistence verified, old drumset warning Cancel verified in both. Editor build passes; shortcut and other controls open.

- Customize kit shortcut dialog port: matching desktop bounds, diff 1,421; Z assignment and Clear pass both. Typecheck/build pass; conflict and mobile open.

- Shortcut conflict Cancel/OK and Escape pass desktop/mobile in both; bounds match, screenshot diffs saved.

- Old drumset warning Ignore closes in both; mobile warning bounds match, diff 388. Imported contents unverified.

- Customize kit staff line/Down persistence verified in both; voice selection 2 immediately returns 1 in reference and Vue.

- Fixed New Score DataCloneError by copying nested reactive options into plain objects; Flute creation desktop/mobile passes both, diffs 704/436. Typecheck/build pass.

- Template creation with nondefault key, tempo and pickup completes desktop/mobile in both; visual diffs 539/436, exact score contents unverified.

- Template MusicXML content check blocked by React MasterScore.midiPort TypeError; Vue not tested by this script.

- Template-created saved .mscx confirms key, tempo and pickup in React/Vue desktop/mobile despite React MusicXML export blocker.

- Staff/Part properties desktop compared: major Nuxt vs native layout discrepancy, diff 793,268; repair remains open.

- Staff/Part properties native hierarchy reduces desktop diff to 436; mobile diff 388, bounds match. Typecheck/build pass; interactions remain open.

- Staff Lines Cancel/OK verified; Advanced style nested dialog major mismatch (878,301 pixels), not fixed; preview assets absent.

- Edit staff type percussion native shell reduces desktop diff to 436, mobile 388; typecheck/build pass. Tablature and preview remain open.

- Percussion nested Cancel/OK passes rerun; one Vue stale-value observation requires timing investigation. Standard preview dialog failed to open in React, likely absent sample resources.

- Nested staff dialog parent update follows native close asynchronously; 3 repeated checks pass after wait. Tablature/preview remain open.

- Tablature staff type controls ported from React hierarchy; typecheck/build and percussion check pass, tablature visual/interaction verification still blocked by missing preview assets.

- String data native dialog reduces desktop diff to 436, mobile 388; typecheck/build pass. Interactions remain open.

- String data Delete/Cancel and nested frets/Always open persistence pass both. Nested pitch desktop bounds match, diff 436; pitch edit remains open.

- String pitch D♯4, frets and Always open persist through parent OK/reopen in both.

- Select instrument native single-selection layout reduces desktop diff to 436, mobile 388; typecheck/build pass. Behavior checks pending.

- Select instrument Flute search/Cancel/OK/double-click pass both; new-score creation regression passes desktop/mobile.

- Replace instrument mobile dialog interaction and desktop Undo verified in both; direct mobile selection and traits open.

- Playalong loading layout fixed by removing extra badge and placing heard notes in statusbar; desktop diff 206,364 to 632. Typecheck/build pass; listening/mobile unverified.

- Playalong listening mobile captured after 30s; diff 2,979 with asynchronous measure/note state. Practice, Next and Stop pass both.

- Calibration box moved into score area like React; mobile diff 26,627 to 776, Cancel passes. Typecheck/build pass; remaining calibration states open.

- Calibration listening desktop bounds match; diff 2,753. Skip and Cancel pass both; results remain open.

- Calibration result/Repeat/Cancel verified in both after skipped steps; matching bounds. Use values remains open.

- Calibration Use values persists calibrated filter and calibration object in both; microphone measurements remain unverified.

- Calibration mobile result bounds match; Repeat/Cancel pass, full diff 11,765 includes dynamic background.

- Removed Vue workspace/main overflow clipping to match React; calibration mobile result diff 11,765→921, box crop exact. Typecheck/build pass. Other overflow states unverified.

- Overflow regression: score mobile diff 196; desktop score bounds match; expanded Clefs 257 and Layout 399.

- Post-overflow Style desktop diff 469; Inspector tests 3 pass, 5 skipped. Context-menu retest not run: attempted script absent.

- Post-overflow mobile context menu diff 943, matching prior capture; desktop selection then resize.

- Toolbar pointer drag probe: React order unchanged while Vue reorders for same gesture; cause unresolved.

- Toolbar drag active state missing Vue marker; screenshot diff 243,297. Port remains open.

- Toolbar drag marker/empty row restored; desktop active diff 243,297→2,547. Typecheck/build pass; post-drop discrepancy and other docks remain open.

- Toolbar marker target/geometry identical; moveToolBar source matches, React drop does not reorder for tested gesture. Cause unproven; retained Vue reorder.

- Toolbar drag mobile active diff 539, marker present both; Add submenu passes. Grip script failed stale React host.

- Toolbar grip menu and keyboard reorder regression passes both after correcting test host; Inspector 3 pass, 5 skipped.

- Toolbar bottom-dock drag diff 595; both drop playback before view. Same-row discrepancy remains.

- Synthetic toolbar pointercancel commits in React but cancels in Vue; kept Vue behavior, real touch unverified.

- Toolbar top-row drag diff 621; both drop playback before note-input.

- Toolbar empty-row drag diff 621; both create top1 with playback.

- Full test rerun timed out at 180s; log shows missing vtest fixtures. No completion result.

- Recovered MuseScore v4.7.5 vtest scores via official sparse checkout (commit 3654226); full test rerun pending.

- Full npm test with recovered fixtures exits 0: 34 files passed, 35 skipped; 184 tests passed, 1,430 skipped.

- Recovered v4.7.5 demos; editor e2e previously skipped all 46 due missing demos, rerun pending.

- Editor e2e now runs: 8 passed, 38 failed, including selector/assertion failures and missing fixtures. Recovered named fixture directories; investigation remains.

- E2E triage: initial body data-view and #title expectations conflict with current React source as well as Vue; remaining failures untriaged.

- Recovered pinned Style illustrations and staff preview sample files; visual verification and sample wiring remain open.

- Both running servers still return empty Style image URLs after asset recovery; restart needed before parity check.

- Style asset glob refreshed: Accidentals four PNGs and Beams SVG load in both; desktop diffs 288/270. Editor build passes.

- Style mobile Accidentals/Beams captures with recovered assets diff 220 each; image visibility not established.

- Staff type percussion after sample recovery diff 436; nested Lines Cancel/OK passes. Standard/tab preview still unverified.

- Standard staff type preview opens after asset recovery; canvas 644×76 both, desktop diff 436.

- Standard staff-type mobile resize capture diff 388; direct opening and preview edits unverified.

- Tablature staff-type preview opens using guitar tablature template; canvas 644×121 both. Controls/mobile open.

- Tablature Letters selected in both; desktop diff 436. Persistence and other controls open.

- Tablature Letters persists through child OK/reopen both; parent persistence and rollback open.

- Tablature Letters child Cancel rollback and parent OK persistence pass both; parent Cancel/undo unverified.

- Tablature staff type mobile resize diff 388; direct mobile interactions open.

- Demos enabled more library tests; full rerun encountered missing transpose fixture. Recovered pinned test directories; rerun pending.

- Full fixture-enabled npm test: 8 files failed, 58 passed, 3 skipped; 489 tests failed, 791 passed, 327 skipped. Causes untriaged.

- Recovered Capella fixtures; importsettings focused tests 4/4 pass. Newscore Unix find incompatibility and other suite failures remain.

- Newscore test bare find fails on Windows; explicit Git find works, PATH override attempt failed.

- Recovered reference fixtures had Windows CRLF conversion; normalized XML/MS​CX to repository LF. Links/parts focused run 75 passed, 1 skipped; full rerun pending.

- MIDI import after LF fixture normalization: 111/111 pass.

- Full test rerun after LF normalization exceeded 600s, log shows 60s test timeout, no summary.

- Made newscore test fixture enumeration portable via Node readdirSync; 49/49 pass.

- Typecheck passes; full tests with 2 workers: 1,362 passed, 1 failed (MDL snare migration), 293 skipped.

- MDL migration failure traced to CRLF vtest fixture; LF normalization restores 4/4 migration tests.

- Full fixture-enabled library tests pass: 1,363 passed, 293 skipped (2 workers). E2E and visual gaps remain.

- E2E selection status/font markup and note-entry selector failures require reference comparison.

- Confirmed Amazing Grace selection status discrepancy: Vue exposes font tag, React plain Soprano. Cause unproven.

- Selection status source matches React across accessibility/reader/compat; runtime discrepancy cause remains unproven.

- Ported React status plainText parsing; Amazing Grace selection text matches. Typecheck/build pass.

- Focused selection e2e passes after status fix (1 passed, 45 filtered).

- Fixed note-input button action reactivity; desktop/mobile N+C matches React. Typecheck/build pass; e2e now exposes stale Undo button.

- Fixed toolbar dock action reactivity; focused note-entry/undo e2e passes. Typecheck/build pass; audit other consumers.

- Fixed selected Properties Measures/multi-Notation layout; range desktop diff 5,750→610. Text and individual variants remain open.

- Individual note Head initial layout restored; desktop diff 10,129→347. Show more/Stem/Beam remain open.

- Note Stem remains broken: desktop diff 9,088; chord controls and native hierarchy missing.

- Note Stem initial view restored; desktop diff 9,088→347, typecheck/build pass. Show more and interactions remain open.

- Note Beam initial controls restored; desktop diff 6,266→24; advanced variants/edits open.

- Fixed note inspector model paths; Hide notehead and menu Undo pass both. Typecheck/build pass.

- Note Stemless change/Undo passes both; direction and Beam edits remain open.

- Note Beam type edit/Undo passes both; advanced variants open.

- Note Head Show more opened diff 529 but advanced content not captured; generic controls remain incomplete.

- Head Show more empty in Vue: advanced notehead properties lack showMore metadata; React scrollHeight 923 vs Vue 587.

- Restored note Head advanced controls; scrolled diff 22,857→71, duration edit/Undo passes both. Typecheck/build pass. Other controls/mobile unverified.

- Restored Stem advanced controls; scrolled diff 10,645→161, length edit/Undo passes both. Typecheck/build pass; remaining controls/mobile unverified.

- Added conditional Beam feathering controls; default regression passes, feathered/cross-staff unverified. Typecheck/build pass.

- Wired playback toolbar and MenuPopup action version into render; note Undo regression/typecheck/build pass. Live transitions unverified.

- E2e 36 pass/34 fail/4 skipped; fixed MenuPopup recursive updates from reactive ref array, menu check/typecheck/build pass. Remaining failures untriaged.

- Correction: MenuPopup recursion persisted after ref-array change; reverted new action dependency pending root-cause diagnosis. Full e2e remains failing; menu/typecheck/build pass.

- Focused panels/save e2e still timeout; no recursion reproduced after revert. Full suite remains unverified.

- Replaced panel tab Nuxt dropdown with React-equivalent MenuPopup; focused panels e2e/typecheck/build pass. Reference server unavailable for new screenshot.

- Panel menu React/Vue expand/collapse passes; desktop diff 84 after reference restart. Mobile unverified.

- Panel tab menu mobile expand/collapse passes both; diff 24.

- Restored master tab IDs and initial body view state; save/reload e2e advances to confirmation selector timeout. Typecheck/build pass.

- Restored React unsaved-close dialog; focused save/reload/close e2e, typecheck/build pass. Visual comparison open.

- Unsaved-close visual bounds match; desktop diff 24, mobile after resize diff 30.

- Match React by not mounting bottom toolbar dock on Home; focused home e2e/typecheck/build pass. Recapture pending.

- Empty Home recapture after dock change: desktop/mobile diff 0; stored-score state not captured.

- Restored palette/inspector metadata and notehead accessible labels; focused palette/Properties Undo e2e, typecheck/build pass.

- Selected-note Head recapture desktop/mobile-resize diffs 24/24; direct mobile selection unverified.

- Restored palette cell element metadata; focused palette rendering/search/keyboard e2e, typecheck/build pass.

- Restored layout tree data types; focused test exposes unresolved Select All row synchronization. Typecheck/build pass.

- Restored score-to-layout selection synchronization; focused e2e/typecheck/build pass. Row-selection retention remains open.

- Expanded Layout recapture after selection fix: matching rows, desktop diff 210.

- Layout Select All both select four rows; desktop/mobile-resize diffs 169/169.

- Focused instrument replacement/change and Staff/Part context/Undo e2e pass.

- Generic ConfirmDialog now matches React native structure; create/save/remove e2e/typecheck/build pass; visual and restore-session checks pending.

- Fixed Home reset overriding confirmation heading margin; remove dialog desktop/mobile diffs 0/16, bounds match, Cancel/typecheck/build pass. One desktop Vue 404 resource unidentified.

- Remove-confirm repeat diffs 2/0; generic Vue 404 not identified by response listener.

- Fixed mounted language rerenders; German translation and template-create e2e/typecheck/build pass. Other languages/visuals unverified.

- Current full tests: 1362 pass/1 timeout/293 skipped; focused copypaste retry 42 pass/42 skipped. Note screenshot/menu regressions pass.

- Full library suite passes single worker: 1363 passed, 293 skipped; two-worker runs had varying timeouts.

- Full e2e now 55 pass/15 fail/4 skipped; no MenuPopup recursion reported; missing Guitar Pro fixtures and other failures remain.

- Restored NoteSettings metadata; selected Properties values e2e/typecheck/build pass.

- Restored React SearchPopup structure/live search; focused Find/project properties e2e/typecheck/build pass; screenshots pending.

- Corrected SearchPopup score-area placement; desktop diff 41261→100, mobile 24; matching bounds and Find e2e/typecheck/build pass.

- ViewModeControl now React MenuPopup/full modes; e2e advances to playback settings menu failure, typecheck/build pass. Visual comparison pending.

- Restored playback settings MenuPopup; view-mode/smooth-panning focused e2e/typecheck/build pass; visual comparison pending.

- View mode popup desktop/mobile diffs 87/24; playback settings 110/0; bounds match. Submenu/touch open.

- Restored part tab context MenuPopup; focused part Layout/context and part edit e2e, typecheck/build pass. Visual comparison pending.

- Master tab context popup desktop/mobile diffs 78/21, bounds match; part popup screenshot open.

- Drum staff line now updates on input like React; focused Customize kit e2e/typecheck/build pass.

- Layout instrument drag/reorder missing; focused rename/reorder e2e fails on drag. Needs React-aligned implementation.

- Restored Layout row pointer drag; rename/reorder/Undo e2e/typecheck/build pass. Other drag variants and visuals open.

- Layout instrument drag desktop order matches React, diff 95; resize mid-drag transient order differs (diff 306), final order matches.

- Layout control metadata restored; hide/Undo/remove/add focused e2e/typecheck/build pass.

- Restored native restore-session dialog; autosave/restore e2e/typecheck/build pass. Visual and No/Escape checks pending.

- Restored inline custom palette creation; e2e advances to cell context menu failure, typecheck/build pass. Visual comparison pending.

- Custom palette popup desktop/mobile diffs 56/24, bounds match; cell context and keyboard checks open.

- Palette cell context menu/properties missing; React supports Delete and editable properties with Cancel rollback.

- Restored palette cell context/properties/rollback; custom palette full focused e2e/typecheck/build pass. Visual/edge cases open.

- Cell properties bounds match; desktop/mobile-resize diffs 152/67, name Cancel rollback passes both. Other controls open.

- Recovered pinned Guitar Pro fixtures; focused viewer/editor imports and editor import/save e2e pass.

- Await language catalog before startup, restore message button values; MusicXML error flow e2e/typecheck/build pass.

- Ported native migration dialog; recovered pinned image; focused older-score migration e2e, typecheck/build pass. React placeholder prevents genuine-image visual parity comparison.

- Full e2e rerun: 70 passed, 4 skipped (viewer-only cases under editor); visual parity still incomplete.

- Migration screenshots: matching desktop/mobile-resize bounds, diffs 6263/5243; React placeholder vs genuine Vue image remains.

- Migration 3.6.2 desktop/mobile-resize screenshots match exactly (0 differing pixels).

- Verified palette cell offset/scale/staff Cancel rollback against React.

- Cell properties OK/reopen retains offset, scale and staff changes in both apps.

- Cell properties immediate reload loses saved offsets/scale/staff in both reference and Vue; delayed persistence unverified.

- Cell properties delayed reload persists in both apps; immediate reload race remains shared.

- Direct mobile 3.6.2 migration screenshot matches React (0 diff).

- Pre-3.6 migration direct mobile bounds match; diff 5251 with reference placeholder image.

- Controlled same-asset pre-3.6 migration screenshots match exactly desktop/mobile-resize; deployed asset unverified.

- Deployed React pre-3.6 migration matches Vue exactly desktop/mobile-resize (0 pixels); genuine asset confirmed.

- Deployed React migration 3.6.2 matches Vue desktop/mobile-resize (0 pixels).

- Deployed React palette cell properties desktop bounds match, diff 200; name Cancel rollback passes.

- Deployed React cell properties mobile-resize bounds match, diff 150.

- Direct mobile viewport cell-properties comparison vs deployed: bounds match, diff 150; touch untested.

- Migration 3.6.2 option persistence and no-prompt reload pass against deployed React.

- Removed action registration side effects from recent menu provider; enabled MenuPopup action reactivity. Typecheck/build and focused menu e2e pass; full regression pending.

- Full e2e after menu reactivity: 70 passed, 4 conditional skips, no recursive update error.

- Saved-score Open recent submenu opens without recursive-update errors.

- Verified live MenuPopup action-version updates without recursive error using synthetic registration.

- Open submenu synthetic action disable updates aria-disabled correctly without recursive errors.

- Restore-session dialog now lists autosave score names; deployed comparison diffs 800 desktop/mobile, autosave e2e/typecheck/build pass.

- Restore-session name bold matches deployed React; diffs 600 desktop/mobile, typecheck/build pass.

- Began Properties-wide audit; replaced barline generic fallback with React-shaped controls; visual/behavior checks pending. Pedal/text/other models remain open.

- Barline selected-state desktop comparison: default/expanded diffs 24/71; type edit/Undo exercised, mobile and other controls open.

- Pedal selection comparison: React has TODO placeholder, Vue exposes functional generic controls; desktop diff 9073, text section also diverges. Preserve controls while improving styling.

- Began Text inspector native control port; font/style/size/show-more shell, resets; typecheck/build pass. Alignment/advanced and visual verification remain open.

- Native Text alignment controls reduce title Properties diff 4939→89; mobile-resize 89; typecheck/build pass.

- Partial Text advanced native controls; expanded diff still 19899, typecheck/build pass. Further work required.

- Text advanced script/frame native radio controls ported; expanded visual diff 21980, further work needed.

- Text advanced reordered/native style controls; diff 21980→9431; typecheck/build pass.

- Text advanced geometry corrected; scrollHeight 942 both, desktop diff 238, typecheck/build pass.

- Text Rectangle frame native controls: matching scroll height, diff 231, typecheck/build pass.

- Text Circle desktop diff 387; Rectangle mobile-resize diff 234.

- Text frame thickness edit/Undo verified against React.

- Text Bold edit/Undo verified against React.

- Text horizontal alignment edit/Undo verified against React.

- Text style edit/Undo verified against React.

- Text symbol-size edit/Undo verified against React.

- Text line-spacing edit/Undo verified against React.

- Text font-size edit/Undo verified against React.

- Added Text radio keyboard focus and selected tab stops; typecheck/build/alignment Undo pass.

- Text alignment keyboard focus behavior verified against React.

- Added Text radio mixed-value first-tab fallback; typecheck/build pass, mixed selection unverified.

- Mixed text alignment radio fallback verified against React.

- Pedal Text undefined frame details restored; expanded scrollHeight matches, diff 4872, further work pending.

- Pedal Text disabled/undefined styling restored; expanded diff 300, typecheck/build pass.

- Text advanced mobile-resize diff 241.

- Focused Properties e2e 2 passed; inspector test 8 passed/5 skipped; full regression pending.

- Barline mobile-resize diff 24; type change/Undo verified against React.

- Barline span-from edit/Undo verified against React.

- Barline span-to edit/Undo verified against React.

- Barline span-to-next-staff edit/Undo verified against React.

- Barline repeat default visual diff 24; winged behavior comparison inconclusive in reference.

- Winged repeat click observed same unchanged radio state in both apps; effect/undo unverified.

- Pedal line-width edit suspect (0.3 displayed 0); reference lacks control. Needs investigation.

- Fixed generic numeric rounding with InspectorSpin; pedal width edit/Undo, typecheck/build pass. Generic model regression pending.

- Hairpin coordinate selection unsuccessful; generic numeric regression remains open.

- Hairpin selected reliably; desktop diff 11600, custom Properties view needed.

- Ported Hairpin Properties hierarchy; desktop diff 11600→171. Typecheck/build pass; behavior/mobile checks pending.

- Hairpin thickness edit/Undo and dashed view checked against React; mobile and further interactions pending.

- Hairpin dashed mobile-after-resize diff 64; Dash edit/Undo passes both.

- Hairpin Niente circle toggle/Undo verified against React.

- Hairpin position click unchanged in both apps; effect remains unverified.

- Hairpin position unchanged in both; shared Pid.PLACEMENT behavior suspected, not established.

- Full e2e after latest Properties changes: 70 passed, 4 skipped; skips remain uncovered.

- Full library run: 1363 passed, 244 failed, 49 skipped; missing Guitar Pro fixtures after partial fixture recovery activated suite. Restore pinned data and rerun.

- Restored pinned Guitar Pro fixtures; full library run 1607 passed, 49 skipped.

- Hairpin Allow diagonal toggle/Undo verified against React.

- Hairpin Height edit/Undo verified against React.

- Hairpin Height (new system) edit/Undo verified against React.

- Hairpin dashed Gap edit/Undo verified against React.

- Hairpin dotted state desktop diff 171.

- Hairpin dotted selection/Undo verified against React.

- Hairpin line style keyboard focus matches React.

- Hairpin thickness reset verified against React.

- Hairpin property geometry/font-size/gaps match React exactly.

- Hairpin default mobile-after-resize diff 132.

- Hairpin Niente touch tap after resize passes both.

- Rest selection sweep unsuccessful; visual comparison remains open.

- Rest fixture coordinate sweep unsuccessful; comparison pending.

- Rest Properties valid desktop capture diff 2805; investigation pending.

- Rest Properties nested paths and tab hierarchy restored; desktop diff 2805→24. Typecheck/build pass; behavior checks pending.

- Rest tab desktop diff 24; Align toggle/Undo matches React.

- Rest Beam mode edit/Undo verified against React.

- Rest tab mobile-after-resize diff 24.

- Rest Align touch tap after resize matches React.

- Rest tab keyboard selection matches; focus differs (React Beam, Vue Rest).

- Rest Beam reset restores Auto in both apps.

- Rest mixed-state attempt selected one rest only; still unverified.

- Rest Shift-click did not produce mixed selection.

- Rest Align mixed-state binding restored from React; browser mixed selection unverified.

- Rest Select All mixed-state attempt inconclusive due to focus.

- Rest mixed Align indeterminate verified in both via keyboard range selection.

- Mixed Rest panel diff localized to Measures controls; Rest checkbox matches.

- Corrected Measures action icons from React; remaining insert/delete panel mismatch.

- Restored Measures popup wrapper; range diff 430→24 and bounds match. Typecheck/build pass.

- Measures insert popup opens; React is empty TODO, Vue retains functional actions.

- Measures popup Escape and first action dialog verified; Escape also clears selection.

- Measures popup Escape clears Vue range unlike React; attempted content handler ineffective, reverted.

- Fixed Measures popup Escape selection loss by keeping content in panel; action, typecheck/build pass.

- Measures popup outside dismissal matches React; mobile clipping unverified.

- Measures popup mobile clipping confirmed; attempted class-only fix failed and reverted.

- Ported Measures popup native hierarchy; mobile width fixed, actions retained; Escape/action/typecheck/build pass.

- Measures popup outside dismissal and mobile-after-resize touch action pass.

- Full e2e after Rest/Measures changes: 70 passed, 4 skipped.

- Clef Properties ported; desktop diff 3922→24, typecheck/build pass; interaction checks pending.

- Clef courtesy edit/Undo passes; position click unchanged in both, effect unverified.

- Clef mobile-after-resize diff 24.

- Key signature selection attempt unsuccessful; comparison pending.

- Zoomed key selection ambiguous list; model identification pending.

- Key signature zoomed selection confirmed; desktop diff 24.

- Key courtesy click differs (React unchanged, Vue unchecked) on list selection; cause unverified.

- Key signature mode Unknown visually matches; option value discrepancy and unchanged Minor selection need investigation.

- Key Mode DOM value discrepancy is React index vs Vue semantic value, not by itself a bug.

- Key signature mobile-after-resize diff 24.

- Time signature Properties ported; desktop diff 1950→59, typecheck/build pass.

- Time signature horizontal scale and courtesy edit/Undo verified against React.

- Time signature vertical scale edit/Undo passes; mobile-after-resize diff 59.

- Time signature input geometry and fonts match React.

- Time signature scale reset verified against React.

- Time signature courtesy touch after resize matches React.

- Time signature scale ArrowUp behavior matches React.

- Time signature focused edited panel diff 797 localized to scale controls; cause pending.

- InspectorSpin CSS specificity corrected; focused time-signature diff 821→24, typecheck/build pass.

- InspectorSpin regression: Hairpin/Stem edit-Undo pass both, pedal width passes Vue.

- InspectorSpin CSS recaptures: text advanced 170, frame 94, head advanced 24.

- Dynamics Properties valid capture diff ~3536; generic hierarchy needs port.

- Dynamics port must preserve Vue frame detail controls absent from React custom view.

- Dynamics custom hierarchy ported; default diff 58, typecheck/build pass; expanded/interaction checks pending.

- Dynamics expanded arrow corrected; desktop diff 24, typecheck/build pass.

- Dynamics scale and Avoid barlines edit/Undo verified against React.

- Dynamics Rectangle frame exposes Vue-only retained details; diff 4929, behavior pending.

- Vue Dynamics frame thickness edit/Undo verified; remaining details pending.

- Dynamics alignment edit/Undo verified against React.

- Dynamics Show more mobile-after-resize diff 24.

- Dynamics frame selection/Undo verified against React.

- Dynamics Avoid barlines touch after resize matches React.

- Vue Dynamics frame margin edit/Undo verified.

- Vue Dynamics frame corner radius edit/Undo verified.

- Vue Dynamics frame border color edit/Undo passes; alpha unverified.

- Vue Dynamics frame fill color edit/Undo passes; alpha remains unverified.

- Dynamics frame color path likely drops alpha; nonopaque fixture verification needed.

- Identified XML alpha fixture representation; roundtrip check pending.

- Nonopaque Dynamics fixture created; RGB edit/Undo observed, alpha roundtrip still unverified.

- Confirmed Dynamics frame RGB change drops alpha 128→255; fix pending.

- Dynamics frame color retains existing alpha prefix on RGB edit; export verification pending.

- Dynamics alpha export returned a=0, not expected 128; investigate selected element/fixture association.

- Verified Dynamics RGB edit preserves alpha 128 in exported MSCZ; earlier a=0 belonged to different selected element.

- Added passing assert to Dynamics alpha export regression check.

- Latest e2e 70 passed/4 skipped; library 2 setup timeouts (1,588 passed/68 skipped), focused retry with 60s hook timeout passed 20/18 skipped.

- Full library rerun with 60s hook timeout: 69 files passed, 1,607 passed/49 skipped.

- Key signature courtesy source maps same property and boolean in both; React unchanged click remains unexplained.

- Independent key signature fixture selection attempt missed element; no behavior conclusion.

- Single-staff custom key signature courtesy toggles identically in React/Vue; desktop diff 24.

- Single-staff key signature courtesy Undo passes both apps; post-Undo diff 24.

- Key signature courtesy mobile-after-resize toggle/Undo matches; diff 24.

- Inventoried remaining unreviewed React notation views; fixture-backed comparisons pending.

- Fermata generic fallback differs from React Position control; desktop diff 4,521.

- Fermata Position hierarchy matches React; desktop diff 24; typecheck/build pass. Edit/Undo pending.

- Fermata Below→Above→Undo→Below matches both; diff 24.

- Fermata mobile-after-resize edit/Undo matches; diff 24.

- Articulation generic fallback differs; desktop diff 3,105; fix pending.

- Articulation/Tapping Placement hierarchy restored; Articulation diff 24, typecheck/build pass; interactions pending.

- Articulation Above→Below→Undo→Above passes both; diff 24.

- Articulation mobile-after-resize edit/Undo matches; diff 24.

- Tapping fixture confirms desktop Placement diff 24; interactions pending.

- Tapping edit/Undo matches both; desktop diff 24.

- Tapping mobile-after-resize edit/Undo matches; diff 24.

- Articulation Auto edit/Undo matches both.

- Accidental Properties generic fallback differs; desktop diff 3,519; fix pending.

- Accidental reference controls restored; Vue-only stacking offset retained; diff 352; typecheck/build pass.

- Accidental bracket edit/Undo matches both; retained stacking offset accounts for visual difference.

- Accidental Small edit/Undo passes both.

- Vue accidental stacking offset edit/Undo passes.

- Accidental mobile-after-resize bracket edit/Undo matches; diff 352, extra Vue control retained.

- Tuplet Properties generic fallback differs; desktop diff 9,277; fix pending.

- Tuplet hierarchy restored; diff 222; typecheck/build pass, interactions pending.

- Corrected inspector radio icon class; Tuplet diff 24, Accidental 273; typecheck/build pass.

- Tuplet Number→Ratio→Undo matches both; diff 24.

- Tuplet bracket edit/Undo matches both.

- Tuplet direction edit/Undo matches both.

- Tuplet line thickness edit/Undo matches both.

- Tuplet mobile-after-resize Number edit/Undo matches; diff 24.

- Tuplet option translation disambiguation aligned with React; English diff 24, typecheck/build pass.

- German Tuplet labels match; desktop diff 462 concentrated outside inspector panel.

- German status-bar residual source audit inconclusive; geometry measurements needed.

- Fixed stale Concert pitch translated title; German capture diff 462→24; typecheck/build pass.

- Runtime language switch updates Concert pitch in both; Preferences-open diff 14,303 requires investigation.

- Runtime language switch leaves Vue inspector labels stale; subscription fix pending.

- Inspector language subscriptions fix runtime Tuplet labels; diff 3,291; typecheck/build pass.

- Runtime language residual includes computed translation caches; reactive invalidation pending.

- Reactive translation version fixes cached runtime labels; Preferences-open diff 25, typecheck/build pass.

- Runtime language switch-back matches both; diff 25.

- Runtime Arabic representative Preferences/Tuplet capture diff 44; RTL coverage limited.

- Slur generic fallback differs; desktop diff 5,564; fix pending.

- Slur/tie hierarchy restored; Slur desktop diff 24; typecheck/build pass; variants/interactions pending.

- Slur style edit/Undo matches both.

- Slur position edit/Undo matches both.

- Slur mobile-after-resize style edit/Undo matches; diff 24.

- Tie conditional placement desktop capture matches; diff 24.

- Tie placement edit/Undo matches both.

- Tie mobile-after-resize placement edit/Undo matches; diff 24.

- Laissez vibrer fixture selection not yet located; no parity claim.

- Laissez vibrer zoom attempt moved score offscreen; selection still pending.

- Laissez vibrer note located, tie selection still unresolved.

- Laissez vibrer selected-note zoom also moves score offscreen; comparison pending.

- Laissez vibrer non-SMuFL conditional view matches; desktop diff 24.
- Laissez vibrer non-SMuFL conditional view matches; desktop diff 24.
- Laissez vibrer Minimum length edit/Undo matches both.
- Laissez vibrer placement edit/Undo matches both.
- Laissez vibrer mobile-after-resize Undo sequence inconclusive; both show no checked option, diff 494.
- SMuFL Laissez vibrer conditional view matches; desktop diff 24.
- Section break generic controls differ; desktop diff 4,104; fix pending.
- Section break hierarchy restored; diff 24, typecheck/build pass; interactions pending.
- Section break courtesy inversion edit/Undo matches both.
- Section break Pause edit/Undo matches both.
- Section break mobile-after-resize courtesy edit/Undo matches; diff 24.
- Spacer generic control differs; desktop diff 416.
- Spacer Height hierarchy restored; diff 24, typecheck/build pass.
- Spacer Height edit/Undo matches both.
- Spacer mobile-after-resize Height edit/Undo matches; diff 24.
- Bare image fixture lacks embedded assets; Image Properties comparison blocked pending suitable MSCZ.
- Found embedded-image candidate `MuseScore/demos/Reunion.mscz`; Image comparison pending.
- Reunion embedded-image fixture loaded; initial selection missed.
- Reunion image belongs near measure 22; earlier zoom inspected wrong system.
- Reunion measure-22 zoom selected note, not Image; no Image parity claim.
- Reunion image zoom still inconclusive; defer to geometry-based selection.
- Post-i18n/inspector full e2e: 70 passed, 4 skipped.
- Library rerun: Goldberg 60s timeout; 1,606 passed/49 skipped. Focused rendering retry with 180s timeout passed 7 (7 skipped).
- Full library retry with 180s test timeout: 69 files passed, 1,607 passed, 49 skipped.
- Current typecheck and editor build passed.
- Identified four e2e skips via verbose reporter: editor variants of viewer drop target, playback cursor, continuous fit, and embedding.
- Library skipped-test inventory remains incomplete; source includes explicit Guitar Pro skips and fixture conditions.
- Full library verbose retry passed; 49 skip names recorded in `/tmp/parity-library-skips.log`.
- Accidental mobile-after-resize recheck: bracket edit/Undo matches, diff 273; Vue-only stacking offset retained.
- Direct mobile accidental attempt missed tiny fit-page score; zoom required.
- Mobile-start zoom selects accidental in both and bracket edit matches; Undo reselection inconclusive, touch untested.
- Mobile-start accidental selection/edit/Undo/reselection matches both (mouse, diff 273); touch open.
- Mobile accidental touch selection/edit/Undo/reselection matches both; zoom via Ctrl-wheel, pinch untested.
- Laissez vibrer mobile Undo clears selection; target offscreen at 1600%, property restoration remains unverified.
- Tempo source hierarchy differs; fixture-backed visual comparison pending.
- Tempo desktop baseline diff 13,756; generic checkbox hierarchy broken. Fix pending.
- Restored Tempo Inspector native controls; default desktop diff 13,756→24; typecheck passes. Interactions/mobile pending.
- Tempo override edit/Undo matches both, diff 24; editor build passes.
- Tempo mobile-after-resize override edit/Undo matches both, diff 24; direct touch open.
- Post-Tempo focused inspector tests: 8 passed, 5 skipped.
- Controlled A tempo fixture still reports Tempo in both; variant coverage unproven.
- A tempo subtype remains inconclusive after XML ordering change.
- Synthetic ChordBracket initial selection missed; fixture/geometry needs refinement.
- ChordBracket fixture baseline diff 7,519; Vue generic controls differ from React.
- ChordBracket native controls restored; default desktop diff 7,519→24; typecheck passes.
- ChordBracket Hooks edit/Undo matches both, diff 24; editor build passes.
- ChordBracket mobile-after-resize Hooks edit/Undo matches both, diff 24.
- ChordBracket Hook length edit/Undo matches both, diff 24.
- ChordBracket Placement edit/Undo matches both, diff 24.
- ChordBracket non-bracket state requires arpeggio selection; still open.
- Normal Arpeggio selection matches General-only view, diff 24.
- Lyrics selection revealed React TODO placeholder versus Vue empty notation; comparison pending.
- Lyrics empty notation hint restored; desktop diff 10,654→24; typecheck passes.
- Lyrics mobile-after-resize diff 24; editor build passes.
- Lyrics text size edit/Undo matches both, diff 24.
- Synthetic embedded image fixture still invisible in React; investigate archive image-store path.
- Embedded Image fixture now selectable using MD4 basename; baseline diff 3,334, Vue duplicate generic fields.
- Image native hierarchy restored; desktop diff 3,334→219; typecheck passes. Interaction/residual checks pending.
- Image disabled checkbox label class corrected; desktop diff 219→24.
- Image locked resize/Undo matches both, diff 24; typecheck/editor build pass.
- Image mobile-after-resize locked resize/Undo matches, diff 24.
- Image unlocked resize/Undo matches both, diff 24.
- Image unit conversion/Undo matches both, diff 24.
- Framed-image candidate created; initial click missed, geometry selection pending.
- Framed Image scale-to-frame toggle/Undo matches both, diff 24.
- Framed Image mobile-after-resize toggle/Undo matches both, diff 24.
- Post-Image full e2e: 70 passed, 4 skipped.
- Post-Image full library: 1,607 passed, 49 skipped (180s timeout).
- Hammer-on/pull-off line default desktop diff 24; interactions/mobile pending.
- Hammer-on/pull-off Position edit/Undo matches both, diff 24.
- Hammer-on/pull-off mobile-after-resize Position edit/Undo matches both, diff 24.
- Partial tie fixture loaded; selection requires zoom.
- Partial tie zoom selection missed; no parity claim.
- Partial tie candidate click selects Tie in both; subtype not established.
- Partial tie incoming selected in both; desktop default diff 24.
- Incoming partial tie Position edit/Undo matches both, diff 24.
- Partial tie mobile click matches; Undo reselection missed both, value unverified.
- Partial tie mobile Undo reselection fixed for pan; Auto restored in both, diff 24.
- Laissez vibrer mobile Undo target offscreen after resize; zoom out/recenter needed.
- Laissez vibrer post-Undo zoom-out recenters; target still requires rezoom/reselection.
- Laissez vibrer mobile Undo verified after recenter/rezoom; both Auto, diff 24.
- SMuFL Laissez vibrer mobile-after-resize placement/Undo matches both, diff 24.
- Reproduced multi-staff courtesy discrepancy; linked selection semantics still under investigation.
- Chopin React courtesy checkbox remains checked, not indeterminate/disabled; model semantics need tracing.
- Key signature model definitions/delegation match React; multi-staff divergence unresolved.
- Key signature export menu accessible; saved-model comparison pending.
- Chopin list courtesy click exports no showCourtesySig=0 in either app despite Vue checkbox change.
- Chopin courtesy Vue checkbox returns true on reselection, React stays true; transient UI discrepancy.
- Reverted ineffective courtesy checkbox nextTick synchronization; no behavior change.
- Courtesy root trace: PropertyItem computes changes; apply returns false on empty. Instrumentation needed.
- Courtesy click generates two changes; temporary debug removed.
- Courtesy change path uses linked undo propagation; runtime identities still needed.
- Courtesy trace: generated key signatures become non-generated but remain true after attempted false; debug removed.
- Generated KeySig rejects courtesy set; stale Inspector snapshot causes temporary mismatch.
- Inspector sections reload properties on update; timing/selection replacement remains to trace.
- Same-value Vue DOM reconciliation remains plausible; preserve focus in any fix.
- Refreshed Inspector value confirmed true; checkbox DOM reconciliation is discrepancy.
- Fixed stale courtesy checkbox after rejected generated-key change; desktop list and independent Undo comparisons diff 24; typecheck/build pass.
- Courtesy mobile-after-resize Undo and generated-key Space/focus comparisons pass, diff 24.
- Post-courtesy E2E: 70 passed, 4 skipped.
- Post-courtesy library suite: 1607 passed, 49 skipped.
- Direct mobile key signature capture needs pan/recenter; not yet verified.
- Direct mobile key-signature selection/toggle matches, diff 24; mouse pan/zoom and Undo caveats.
- Direct mobile courtesy touch Undo passes, diff 24.
- E2E skips confirmed viewer-only parameterization; editor playback/continuous fit need independent evidence.
- Continuous-fit attempt blocked by wrong Page view selector; retry with actual menu trigger.
- Continuous fit desktop visual diff 45; geometry/resize/mobile remain open.
- Continuous fit resize geometry matches; mobile diff 24.
- Direct mobile fit and touch return-to-page geometry match, fit diff 24.
- Mobile return-to-page screenshot diff 24.
- Editor E2E independently checks playback cursor advance; visual parity still open.
- Playback running cursor dimensions/color match; asynchronous x differs, synchronized capture open.
- Mobile playback cursor size/color match, running diff 57; async tick caveat.
- Mobile playback tap succeeds, running diff 24; timing asynchronous.
- Two-touch pinch remains unverified; Ctrl-wheel is not equivalent evidence.
- Mobile CDP two-touch pinch-out geometry matches, diff 24.
- Mobile two-touch pinch-in geometry matches, diff 24.
- Touch pan first run differed, repeat matched; timing/momentum needs controlled test.
- Controlled slow touch pan matches, diff 24; fast flick remains nondeterministic.
- Tempo variant reader tags identified; fixture/selection still need validation.
- A-tempo fixture nesting valid; generic selection label does not prove model subtype.
- A-tempo fixture version 2.07 uses legacy reader; 4.x fixture needed.
- A-tempo 4.x fixture built; selection coordinate missed.
- Valid 4.x A tempo Inspector matches desktop, diff 24.
- Valid 4.x Tempo primo Inspector desktop diff 24.
- A tempo/Tempo primo BPM edit and Undo match desktop, diffs 24.
- A tempo/Tempo primo mobile-after-resize BPM edit/Undo match, diffs 24.
- A tempo/Tempo primo Follow toggle and Undo match, diffs 24.
- A tempo/Tempo primo mobile-after-resize Follow toggle/Undo match, diffs 24.
- Direct mobile A tempo/Tempo primo selection and Follow touch Undo match, diffs 24.
- Tempo mixed state remains open; single-object fixtures do not cover it.
- Mixed A tempo indeterminate selection matches desktop, diff 24.
- Mixed A tempo checkbox edit/Undo matches, diff 24.
- Mixed A tempo mobile-after-resize edit/Undo matches, diff 24.
- Mixed tempo subtype collapsed rows match desktop, diff 24.
- Mixed tempo subtype expansion diff 1864; inspect popup portal/content before fix.
- Mixed notation popup root cause: Vue portaled UPopover vs React inline native popup.
- Restored native multi-notation popup; mixed subtype diff 1864→24; typecheck passes.
- Mixed popup Escape/focus and outside-click behavior match; screenshot state needs isolation.
- Popup outside handling scoped to active wrapper; diff 24, typecheck/build pass.
- Mixed notation popup mobile-after-resize diff 24.
- Mixed notation popup touch triggers match, diff 24.
- Post-popup E2E 70 passed, 4 skipped.
- Multi-notation popup Follow edit/Undo matches desktop, diff 24.
- Post-popup library suite 1607 passed, 49 skipped.
- Mixed popup mobile-after-resize Follow edit/Undo matches, diff 24.
- ChordBracket repository exact-type filter excludes ordinary Arpeggio; non-bracket flag branch appears unreachable.
- React shares ChordBracket exact filter and non-bracket flag logic; mixed UI still untested.
- Bracket/arpeggio candidate mixed list diff 24; individual identities need verification.
- Mixed bracket/arpeggio identities confirmed; desktop diff 24.
- Mixed bracket/arpeggio Hooks edit/Undo matches, diff 24.
- Mixed bracket/arpeggio mobile-after-resize edit/Undo matches, diff 24.
- Direct mobile Image selection and Lock touch Undo match, diff 24.
- Layout drag Escape retains reorder in both; pointercancel/touch open.
- Layout touch drag candidate no-op in both; alternate handle/successful reorder unverified.
- Layout touch title drag no-op in both; native scroll cancellation possible.
- Layout synthetic pointercancel retains reorder in both; real touch cancellation open.
- Layout synthetic pointercancel Undo restores order in both.
- Layout Piano staff drag order matches, diff 184.
- Piano staff drag Undo restores original order in both.
- Piano staff drag/Undo mobile mouse matches, diff 130.
- First system layer drag no-op in both; movable second layer still open.
- Second system layer drag/merge matches desktop, diff 184.
- System layer merge Undo restores second layer in both.
- System layer mobile mouse drag/Undo matches, diff 122.
- Toolbar same-row React still fails expected reorder; investigate target algorithm.
- React toolbar drag onUp closure captures render-time drag; stale state likely explains no-op.
- Corrected toolbar hypothesis: React drag is module-level, not stale React state.
- Toolbar same-row trace: identical marker/geometry, release behavior differs.
- Toolbar same-row release divergence remains open despite equivalent source algorithms.
- Toolbar final-pointermove retry retains same divergence.
- Toolbar same-row divergence: React loses grip pointer capture mid-drag; Vue retains it and reorders.
- Mixed tempo popup edit affects both selected subtypes in React and Vue.
- Hairpin Position mappings match React; effect still open.
- Hairpin Above click retains Below in both, selection remains Hairpin.
- React Hairpin fixture system flag false; system-below exception ruled out.
- React Hairpin spanner placement unchanged after Above click.
- Hairpin API generates placement change; browser spanner still unchanged.
- Hairpin direct Inspector API apply also leaves placement Below in React; below UI layer.
- React Clef position remains Auto at model level after Before click.
- Vue Hairpin model probe remains blocked by module URL mismatch.
- Vue Hairpin spanner also remains Below after click; live Vite module probe verified.
- Vue Clef model likewise remains Auto after Before click.
- Winged repeat setter is shared TODO/no-op in React and Vue.
- Header clef Position no-op follows setter guard; non-header case open.
- Non-header clef Auto→Before→Undo matches; desktop diff 556 needs isolation.
- Restored SECTION_PARTS native controls; non-header clef diff 556→24, typecheck passes; behavior/mobile/tests pending.
- Parts exclusion edit/Undo matches diff 24; build passes; focused tests 8 passed/5 skipped.
- Parts exclude mobile-after-resize matches diff 24; Undo verified after desktop reselection.
- Part linking switches baseline match, desktop diff 94; edits pending.
- Part Position link toggle/Undo matches, diff 47.
- Part Style/Text link toggle/Undo match, diffs 47.
- Part Position mobile-after-resize switch/Undo matches, diff 23.
- Part exclusion disables linking via inert and Undo matches, diff 47.
- Post-Parts E2E 70 passed/4 skipped.
- Post-Parts full library 1,607 passed/49 skipped.
- Part excluded/inert mobile-after-resize matches, diff 23.
- Parts exclude runnable check now asserts edit and Undo.
- Mixed clef list exclusion checkbox checked in both; actual values not yet established.
- Mixed clef exclusion true/false still checked in both; inspect model filtering.
- Mixed clef exclusion filters ineligible header; indeterminate still untested.
- Part mixed candidate second element ineligible; no indeterminate coverage.
- Mixed Parts needs fixture/model targeting; coordinate guesses failed.
- Controlled StaffText mixed fixture needs linked part for SECTION_PARTS.
- Controlled excerpt text lacks Exclude checkbox in React; mixed exclusion remains open.
- Controlled mixed Position links render unchecked in both, diff 93.
- Mixed Position link edit/Undo matches, diff 93.
- Mixed Position link mobile-after-resize edit/Undo matches diff 23.
- Glissando React TODO vs Vue functional controls, diff 2449; edit/mobile open.
- Vue Glissando thickness edit/Undo passes.
- Glissando mobile React TODO vs Vue controls diff 1709.
- Ottava React TODO vs retained Vue controls, diff 7730.
- Ottava mobile React TODO vs Vue controls diff 2984.
- Vue Ottava thickness edit/Undo passes.
- Volta React TODO vs retained Vue controls diff 9321.
- Volta Vue thickness edit/Undo passes; mobile TODO/control diff 3919.
- Volta generic advanced fields lack Show more wrapper; evaluate access gap.
- Volta advanced fields exposed via Show more; edit/Undo and tests pending.
- Volta endings edit/Undo passes; build and focused Inspector tests pass (5 skipped).
- Volta mobile advanced visible. E2E 69 passed/4 skipped/1 fullscreen failure; focused retry passed.
- Post-Volta library suite 1,607 passed, 49 skipped.
- Full E2E retry passes: 70 passed, 4 skipped.
- Marker React TODO vs Vue generic controls desktop diff 8926.
- Marker mobile TODO/control diff 3516.
- Marker Vue label edit/Undo passes.
- Marker type edit/Undo passes.
- Jump React TODO vs Vue controls desktop diff 7943.
- Jump mobile TODO/control diff 2712.
- Jump target edit/Undo passes.
- Jump mobile touch changes target; Undo reselection unverified.
- Jump mobile touch target edit/Undo passes; prior reselection failure was viewport page change.
- Text line React TODO vs Vue controls desktop diff 7984.
- Text line mobile TODO/control diff 3230; Vue begin text edit/Undo passes.
- Fretboard diagram React TODO vs Vue controls desktop diff 1338.
- Fretboard mobile TODO/control diff 884; Vue orientation edit/Undo passes.
- Fretboard mobile touch orientation edit/Undo passes.
- Chord symbol empty notation hint restored; desktop 10653→24, mobile 24; typecheck passes.
- Chord symbol fix build/focused tests pass; Lyrics diff 24.
- Chord symbol Text size edit/Undo matches both, diff 24.
- Instrument name empty notation hint restored; desktop diff 248→24, typecheck passes.
- Instrument name mobile diff 24; build and focused tests pass (5 skipped).
- Ambitus empty notation hint restored; desktop 248→24, mobile 24; typecheck/build/focused tests pass (5 skipped).
- Measure repeat React TODO vs Vue controls desktop/mobile diff 538.
- Measure repeat Vue measures edit/Undo passes.
- Measure repeat mobile touch edit/Undo passes.
- Multimeasure rest React TODO vs Vue controls diffs 626 desktop/629 mobile.
- Multimeasure rest Vue number visibility edit/Undo passes.
- Multimeasure rest mobile touch visibility/Undo passes.
- Two-note Tremolo React TODO vs empty Vue section diff 265; model eligibility needs investigation.
- Two-note Tremolo empty model due to exact single-chord repository query; mobile diff 265.
- Tremolo title matches React; desktop diff 265→248; build/typecheck/focused tests pass.
- Single-note Tremolo Vue controls present; React TODO diffs 754 desktop/726 mobile.
- Single-note Tremolo play edit/Undo passes.
- Single-note Tremolo mobile touch play/Undo passes.
- Trill React TODO vs Vue controls diffs 1020 desktop/1023 mobile.
- Trill placement changed; Undo reselection unverified.
- Trill Undo was disabled before reselection; actual property change unverified.
- Trill placement targets embedded ornament; no-command cause still unproven.
- Trill probe: Below radio changes but segment/trill/ornament placement unchanged, Undo disabled.
- Trill Above changes embedded ornament 1→0; Undo executes, exact restored value unverified.
- Trill embedded ornament placement edit/Undo 1→0→1 verified.
- Trill mobile touch Above/Undo direct model probe passes.
- Gradual tempo React TODO vs Vue controls diffs 9331 desktop/4193 mobile.
- Gradual tempo Vue begin text edit/Undo passes.
- Gradual tempo advanced fields currently inaccessible via generic renderer; assess scope.
- Bracket fixture candidate lacks visible brace; inspection remains open.
- Bracket empty notation hint restored; desktop 248→24, mobile 24; typecheck/build/focused tests pass.
- Post-Bracket full suites pass: library 1607/49 skipped; E2E 70/4 skipped.
- Lyrics line empty hint restored; desktop 248→24, mobile 24; typecheck/build/focused tests pass.
- Vertical frame empty hint restored; desktop 2254→24, mobile 24; typecheck/build/focused tests pass.
- Horizontal frame empty hint restored; desktop 2254→24, mobile 24; typecheck/build/focused tests pass.
- Text frame empty hint restored; desktop 2254→24, mobile 24; typecheck/build/focused tests pass.
- Expression empty hint restored; desktop 12614→24, mobile 24; typecheck/build/focused tests pass.
- Expression Text size edit/Undo matches both, diff 24.
- Symbol empty hint restored; desktop 248→24, mobile 24; typecheck/build/focused tests pass.
- Staff type change fixture found; selection still unverified.
- StaffTypeChange geometry located in layout source; selection pending.
- StaffTypeChange live bbox measured; screen mapping pending.
- Staff type change hint restored; desktop 248→24, mobile 24; typecheck/build/focused tests pass.
- Post-staff-type full suites pass: library 1607/49 skipped, E2E 70/4 skipped.
- Text frame RGB edit preserves existing alpha; controlled export confirms 128. Typecheck/build/focused tests pass.
- Text frame border alpha 128 export passes; Rectangle visual regression diff 94.
- Mixed Text frame alpha remains unverified; model applies one color to all selected items.
- Post-text-alpha library Goldberg timeout; focused retry passed, full first run not clean.
- Post-text-alpha E2E passes 70/4 skipped.
- Post-text-alpha full library retry passes 1607/49 skipped.
- Mixed exclusion eligible types narrowed; controlled pair still needed.
- Master StaffText candidate has no Parts section in React; mixed exclusion still open.
- Mixed part Position mobile regression passes; master StaffText eligibility requires direct probe.
- SystemText, not ordinary StaffText, eligible for exclusion; controlled pair fixture created.
- Mixed eligible SystemText exclusion indeterminate/edit/Undo matches React, desktop diff 24.
- Mixed SystemText exclusion mobile touch/Undo matches; direct mobile selection open.
- Exposed existing Gradual tempo advanced fields via existing show-more renderer; edit/Undo and mobile pending.
- Gradual tempo advanced factor edit/Undo passes; mobile visibility verified.
- Post-Gradual tempo E2E 70 passed/4 skipped.
- Post-Gradual tempo library 1607 passed/49 skipped.
- Gradual tempo snap After edit/Undo passes.
- Gradual tempo advanced alignment edit/Undo passes.
- Paused internal seek does not expose synchronized playback cursor; comparison remains open.
- Volta advanced endings Undo regression passes after shared renderer change.
- Tremolo mobile regression confirms functional controls retained.
- Two-note empty Tremolo hint matches React; single-note controls retained. Desktop/mobile diff 24; typecheck/build/focused tests pass.
- Post-Tremolo hint E2E 70 passed/4 skipped.
- Post-Tremolo hint library 1607 passed/49 skipped.
- Tremolo play edit/Undo regression passes after hint.
- Gradual tempo mobile baseline remains intentional React TODO vs Vue controls.
- Added runnable assertion for empty Tremolo hint; passes both apps.
- Restore-session Escape closes in both; persistence after Escape remains unverified.
- Restore Escape/reload prompt absent in local React and Vue; deployed retry timed out.
- Restore Escape removes autosave in local React and Vue; verified IndexedDB counts.
- Controlled two-autosave Escape clears both in local React/Vue; deployed multi-score visual and Yes path open.
- Controlled multi-autosave Yes behavior matches local React/Vue; deployed unverified.
- Deployed synthetic multi-autosave differs from local React/Vue; real two-score reproduction needed before changes.
- Real multi-score fixture blocked by native picker automation; synthetic discrepancy not used for changes.
- Picker-stub attempt did not create second autosave; real multi-score remains open.
- Sequential file-open cannot establish concurrent autosaves without handling close prompt; real multi-score path remains open.
- Real concurrent two-score autosaves confirm deployed React clears only one; Vue/local React clear both. Preserve Vue behavior.
- Concurrent two-score deployed restore visual/Yes differs: React amazing only, Vue both/reunion; preserve recovery behavior.
- Restore-session autofocus No matches deployed React; desktop/mobile diffs 0, build/typecheck/focused autosave pass.
- Post-focus E2E navigation timeout; focused retry passed, full retry pending.
- Post-focus full E2E retry passes 70/4 skipped.
- Post-focus library 1607 passed/49 skipped.
- Deployed restore Enter selects No; Vue check blocked by intermittent empty response.
- Restore Enter matches deployed React on Vue localhost.
- Layout held-touch drag no-op matches both; successful touch reorder still unverified.
- Layout touch trace shows matching browser pointercancel after moves in both.
- Layout mouse drag restart works in both after real touch cancellation.
- Layout touch cancellation/mouse restart/Undo matches both.
- Layout second touch drag also cancelled in both; no successful touch reorder proven.
- Custom palette Escape and Enter match React.
- Custom palette mobile touch + keyboard create/cancel and delayed reload match.
- Part-tab multi-item popup geometry matches desktop/mobile; touch context gesture open.
- Part-tab headless long-touch opens no popup in both.
- Part-tab Close tab action matches local React.
- Part-tab Close all confirmation/Cancel matches React.
- Part-tab Close all/discard matches React.
- Part-tab Close all/Save closes tabs in both; reopen persistence unverified.
- Close all/Save retains created part on reopen in both.
- Select More mobile Add result cardinality 2 matches React.
- Select More note candidate failed; geometry-backed selection needed.
- Select More note mobile dialog diff 0; Add selects 1253 notes in both.
- Select More note desktop diff 24, cardinality matches.
- Select More Same pitch + Add cardinality 38 matches.
- Select More checked Same pitch visual diff 24.
- Select More Same pitch/Subtract clears selected note in both.
- Select More Same pitch/Replace cardinality 38 matches.
- Select More Same pitch mobile result matches, 38 notes.
- Tuplet 5/2 content and Undo match both.
- Tuplet mobile-after-resize creation/content/Undo matches.
- Reset-formatting candidate empty part lacks Settings; populated excerpt needed.
- Populated excerpt Reset formatting confirmation/No matches, desktop diff 89.
- Reset formatting confirmation mobile diff 44; No matches.
- Reset formatting mobile touch confirmation/No matches.
- Reset formatting Yes restores edited part name in both.
- Reset formatting mobile touch Yes restores edited part name in both.
- Reproduced transient Layout resize-drag row reversal; root cause open.
- Resize drag patch reverted after it broke order; transient mismatch remains.
- Layout drag model held through resize; mismatch 306→24, typecheck/build pass.
- Layout drag cancel/restart regression and full E2E pass (70/4 skipped).
- Layout resize-drag regression now stable; diff 24.
- Corrected system-markings model: layers non-expandable, top nonselectable; second-layer regression pending.
- Second system layer drag/merge and Undo regression match React after active-model fix.
- Staff drag/Undo regression matches React after active-model fix.
- Resize-during-drag Undo restores original instrument order in both apps.
- Rest tab focus difference traced to React deferred event currentTarget null; retain working Vue focus.
- Mixed Text fill alpha probe: React/Vue both replace differing alpha values with opaque on RGB edit; single-item alpha preservation remains intact.
- Mixed Text fill Undo restores individual alpha values in both apps.
- Same-alpha mixed Text edit preserves alpha in Vue, unlike React; Undo verified both.
- Mixed Text alpha mobile-after-resize edit matches; Undo verified after desktop resize.
- Mixed Text border alpha edit/Undo matches React.
- Staff touch cancellation, mouse restart and Undo match React.
- System layer touch cancel and mouse restart/Undo match; full screenshot diff 11,071 needs diagnosis.
- Diagnosed system-layer screenshot diff: newly added layer selected in React but not Vue before touch; investigate model recreation and selection retention.
- Layout selection root cause: React preserves model keys on score changes and uses model toolbar commands; Vue part-only controls require coordinated fix.
- Selection-retention attempt failed and reverted; model callback lifecycle needs diagnosis.
- Typecheck passes after selection patch revert.
- Vue Layout model lacks onChanged subscription; nonreactive selection changes can remain stale.
- Second Layout selection attempt reverted: selection lost after touch cancellation.
- Selection retry reverted; typecheck clean.
- Layout selection retention and model toolbar restored; system touch diff 64. Further toolbar/selection regression pending.
- Layout keyboard and system-layer toolbar remove/up Undo regressions match React.
- Layout part removal warning, cancel, confirm and Undo match React.
- Layout score-selection/clear parity verified; editor build passes.
- Layout changes pass full library and E2E suites (1,607/49 skipped; 70/4 skipped).
- System layer touch sequence diff reduced 11,071→87 after selection retention.
- Fixed Layout remove selection to honor selected system layer; typecheck/build pass.
- Current Layout system-layer Move up regression identified; Remove and warning checks pass. Typecheck/build and full suites pass with skips.
- Fixed Layout system-layer Move up; React/Vue Undo match, typecheck/build pass.
- Fixed Layout multi-selection move by retaining model selection; focused regressions, typecheck/build pass.
- Layout multi-remove and Undo match React.
- Multi-remove warning and Undo match React.
- Mobile-after-resize multi-selection move/Undo matches React.
- Removed obsolete Layout toolbar helpers; typecheck/build and full suites pass with skips.
- E2E skips identified as viewer-only cases under editor parameterization.
- Mobile touch toolbar move after desktop multi-selection matches React.
- Restored Layout Shift+arrow selection; move/Undo and typecheck/build pass.
- Restored Layout Delete/Backspace keyboard removal; Delete/Undo verified, typecheck/build pass.
- Layout Backspace warning, cancel, remove, Undo match React; focused screenshot diff needs isolation.
- MessageBox No/Yes autofocus corrected to No; keyboard warning diff 87, typecheck/build pass.
- MessageBox No/Yes Enter/Escape safe in both; direct module variant probe blocked by Vue module instance.
- Invalid-style OK MessageBox autofocus/Enter match React desktop/mobile.
- Drumset Cancel/Ignore MessageBox autofocus/Enter match React.
- Restored Layout RTL arrow navigation; typecheck/build pass.
- Restored Layout Escape selection clearing; typecheck/build pass.
- Fixed Layout selected-row visibility parity; typecheck/build pass. Undo leaves visibility unchanged in both.
- Multi-row visibility toggles back in both; Undo behavior remains open.
- Visibility Undo no-op confirmed in score model for both apps.
- Multi-row visibility touch mobile-after-resize matches React.
- Post Layout keyboard/visibility and MessageBox changes full library/E2E pass with skips.
- Part reset formatting restores abbreviation in both apps.
- Part reset restores Hide empty staves in both apps.
- Part reset restores hide-empty instrument checkbox in both apps.
- Playback cursor synchronization still open; frame derives from player time and pause hides cursor.
- Playback cursor exact-tick geometry matches at five ticks; live screenshot synchronization remains open.
- Controlled frozen playback time gives matching tick/cursor bounds, diff 77.
- Controlled mobile playback cursor bounds match, diff 24.
- Controlled mobile playback touch activation matches.
- Direct mobile touch selects same note and creates matching tuplet; Undo baseline invalid after resize.
- Direct mobile touch tuplets apply/Undo verified after correcting viewport baseline.
- Part-tab mobile touch context menu activation/action still unverified.
- Select More direct touch selects same note, but submenu More is disabled in both mobile direct-touch state; tested apply results do not establish parity.
- Audit: broad parity objective still incomplete; checklist retains many open surface/state gaps. Latest typecheck and editor build pass; build warns on chunk size/dynamic import.
- Barline component probe hit wrong source widget; speculative edit reverted. No change retained; nested RepeatBarlinesSection comparison still open.
- View toolbar fresh screenshot diff 95; bounds and page navigation/zoom behavior match.
- View toolbar mobile diff 24; bounds, paging and zoom pass.
- View toolbar center, print dispatch, shortcuts dialog behavior match on mobile; print browser UI not visually comparable.
- Mobile score menus recaptured with matching bounds; full-screen diffs small (0-24); menu-only crop comparison still needed.
- Score main menu popup crops are pixel-identical across all seven menus at desktop and mobile.
- Individual Select-note filters remain unverified; generated probe failed from malformed menu label before filters.
- Select-note every individual filter applied; React/Vue resulting counts match across 12 cases.
- Mobile Add palettes and Clefs header menu popup crops match pixel-for-pixel with exact bounds.
- Playback cursor pixels match exactly on desktop/mobile at controlled tick 2400.
- Direct mobile touch note selection displays matching Inspector; Cue size toggle and shared Undo observation match React/Vue.
- Global CSS audit: shared tokens and core loaded-score computed styles match; documented Vue root structural overrides and 2 Inspector CSS exceptions. Full selector/widget/theme audit remains open.
- Clefs header menu mobile appearance exact; action click probe failed role lookup, actions remain open.
- View toolbar exact crop parity confirmed desktop/mobile; residual screenshot diffs outside toolbar.
- Layout multi-select Move down, warning-safe Remove No/Yes and Undo verified against React.
- New score create flow works in both viewports; post-create diff 109 desktop, 0 mobile.
- Combined part reset verified four formatting fields restore in React/Vue; mobile touch Yes resets part name.
- Latest focused tests pass, but full E2E has one autosave/home-card failure; full library run timed out. Build/typecheck pass.
- E2E Save/reload failure passed two isolated reruns; full-suite failure remains flaky/unresolved.
- Full library and E2E pass with maxWorkers=2: 1,607/49 skipped; 70/4 skipped. Prior E2E save issue transient.
- View > Toolbars submenu mobile geometry matches; verify crop diff.
- Dark-mode home screenshots are pixel-identical at desktop size.
- Dark-mode score menu popup crops are pixel-identical across all seven menus.
- Dark-mode score screenshot diff 80; main geometry matches.
- About dialog dark mode matches geometry; diffs 7 desktop/8 mobile, Escape closes.
- Preferences dark-mode desktop screenshot matches exactly.
- New Score dialog dark mode matches screenshot exactly; add/remove/close pass.
- Dark-mode Measures per system dialog matches bounds; desktop diff 25, mobile 0; checkbox/Cancel work.
- Transpose dialog dark-theme styling is pixel-identical in crop; prior full-screen diff came from different selection state behind modal.
- Project Properties dark mode compared desktop/mobile; exact bounds, diff 53/0; add property/Escape behavior passes.
- Re-ran typecheck/build after continuing screenshot audit; both pass.
- View > View mode submenu desktop geometry, crop pixels and keyboard dismissal match.
- View > View mode submenu mobile clipped visible area matches exactly; keyboard close passes.
- Dark-mode home mobile comparison pixel-identical.
- New Score chooser dark mode also pixel-identical on mobile.
- Palette tab popup crop pixel-identical; expand/collapse all actions pass.
- Palette tab menu dark popup crop exact; expand/collapse works.
- Custom palette Properties dialog dark mode pixel-identical; Cancel rollback and Escape pass.
- Dark mode layout remove warning crop exact; No/Yes/Undo behaviors match.
- Mobile palette header keyboard navigation matches React.
- Mobile Layout Add instruments dialog pixel-identical; menu, add, and Cancel behaviors pass.
- Layout settings instrument/staff/system dialogs now opened with native Playwright touch; bounds match.
- Page Settings direct-touch mobile dialog is pixel-identical; Landscape/Cancel pass.
- Layout mobile touch add-instrument/system-markings operations and Undo match React.
- Layout mobile native double-tap expansion yields same rows in React/Vue; screenshot diff 124.
- Native-touch toolbar Add/Measures submenu activation works in both; Escape outcome remains unverified.
- Native-touch Layout expansion and child selection pass in both apps.
- Palette header menu opens by touch on mobile; popup crop pixel-identical.
- View toolbar direct-touch page navigation and zoom pass; bounds match.
- Style dialog direct-touch mobile page navigation verified; screenshot exact.
- Export dialog mobile touch selection and cancel behavior pass; screenshot exact.
- Parts dialog direct-touch mobile create/close behavior pass; screenshot exact.
- Save Score direct-touch mobile validation/close pass; diff 11.
- Transpose dialog direct-touch mobile mode and Cancel pass; screenshot diff 120.
- Preferences mobile touch tab navigation and autosave toggle/Escape pass; screenshot diffs at most 19.
- Customize toolbar touch toggle and Escape pass; bounds match, diff 84.
- Re-ran library and E2E suites: 1,607/49 skipped and 70/4 skipped; no failures. Skip/coverage gaps remain.
- New Score details direct-touch mobile interactions and persistence pass; screenshots exact.
- New Score template category and navigation direct-touch mobile pass; screenshot exact.
- New Score instrument chooser direct-touch add/remove/cancel pass on mobile; exact screenshot.
- Playback Play/Pause native-touch mobile starts and stops in both; cursor x differs ~0.45px at sample.
- Inspector Cue size native-touch toggles consistently in both; Undo no-op shared; diff 24.
- Inspector Appearance leading-space edit and popup dismissal pass via mobile touch; screenshot diff 24.
- Deterministic Playalong mobile touch controls listen/practice/next/stop match.
- Note-input menu touch open and Escape dismissal pass mobile React/Vue.
- Insert measures count dialog direct-touch mobile verified; bounds match, diff 28.
- Palette search mobile touch query and Escape/focus pass; diff 24.
- Fresh home mobile compare pixel-identical after waiting for MuseScore icon font; old discrepancy was capture/font-readiness artifact.
- Home grid/list toggling touch verified in both on empty desktop state; screenshot exact.
- Home empty list comparison exact. Populated list row still unverified; test fixture seed unsuccessful.
- Fixed mobile palette action probe to use touch and custom Palette properties; Enable editing action parity confirmed React/Vue.
- Parts mobile Delete on duplicated default Piano produced no confirmation in either app; custom deletion flow still open.
- Fresh full suites pass: library 1,607/49 skipped; E2E 70/4 skipped. E2E skips are editor empty-state plus editor-only playback, continuous-layout, and embed cases.
- Home checklist baselines corrected: fresh font-ready mobile screenshots exact; empty-list state exact. Historical 304-pixel mismatch is not a current-state metric; populated scores remain untested.
- Verified mobile Replace instrument dialog direct touch and Cancel parity; exact screenshot match.
- Mobile Replace instrument apply now tested: both apps replace Piano with Flute; dialog pixel-identical; result diff 24.
- Home populated grid/list now seeded before React/Vue app boot; list row diff 41 pixels, remove/clear actions exercised. IndexedDB seed requires request interception because post-start mutation does not trigger the live query.
- Populated Home mobile list exact 0 diff; search/no-results and clear/remove behavior checked on React/Vue.
- Home populated grid desktop exact diff; mobile search state exact; Clear list confirmation mobile exact bounds/screenshot.
- Clefs More popup now direct-touch verified on mobile; both show identical disabled 25-cell selection and Add state.
- New-score created score screenshot: mobile exact; desktop sparse 109 pixels of ~1M, no structural difference visible.
- New-score desktop diff traced to live layout-duration value in status text, not layout; no arbitrary CSS tweak.
- Corrected Vue notation-tab close glyph to exact MuseScore rounded-X icon. New-score desktop diff 109→93 due glyph; remaining delta is dynamic layout-ms status, mobile 0; build/typecheck pass.
- Verified mobile delete confirmation for locally created score: React/Vue dialog exact; Cancel retains, Remove deletes.
- Fresh score workspace recapture supersedes old baseline: desktop diff 17 (was 228), same viewport/panel geometry; mobile diff 0 (was 196). `capture-score.mjs`, `capture-score-mobile.mjs`, `score-latest-diff.png`, `score-mobile-diff.png`.
- Custom palette Properties direct touch now exact on mobile; new custom palettes default editable in both.
- Custom palette delete confirmation touch now exact; Cancel and permanent-delete outcomes match. Hide branch still open.
- Custom palette hide action matches on mobile; palette remains recoverable through Add palettes.
- Palette tab menu mobile exact; settings toggle round-trips pass by touch in both apps.
- Palette tab menu Close now verified by mobile touch: removes Palettes and selects Layout in both.
- Inspector CSS audit: `npm run typecheck` passes; targeted editor E2E suites pass. Text-only radio groups use auto height with 30px minimum. Fixed title-label ellipsis: `.insp-property-title > :first-child` clipped “Symbol size” in Chord symbol at 170px; labels now wrap. Added text-width checks for labels, radios, and flat buttons. Those found Appearance/Playback labels can truncate in narrow panels, so `@container (max-width: 180px)` makes flat buttons wrap while keeping icons fixed; 22-fixture and 8-fixture test suites pass at default/170px, plus all-elements Note/Stem/Beam/Rest/Tuplet coverage.
- Audit remains incomplete for every model/property/state. Model mapping and fixtures show unverified or title-only cases (e.g. Breath, Arpeggio, Fingering, Figured Bass, Instrument Change); some ported items lack functional editing support. Existing checks do not constitute exhaustive per-property, per-state, per-language, or viewport coverage. No claim of full coverage. `npm run build:editor` emitted Vite diagnostics without reliable exit result; generated `editor/components.d.ts` restored. `git diff --check` clean.
