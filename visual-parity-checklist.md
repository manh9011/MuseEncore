# Visual parity checklist — React reference vs Vue app

Measure numbers: desktop diff 903 (`style-measure-numbers-current-{react,vue,diff}.png`), all four group heights now match (155.75/99.375/392.875/402.3125px) after correcting radio-group direction, group gaps and range toggle structure. Restored missing 12px inter-group spacing, fixed 30px alignment buttons and reset icon; prior diff 23,522. Alternate offset persistence, clamp, ArrowUp and range-control disabled/enabled states pass React/Vue (`node check-measure-offset.mjs`); typecheck/build pass; mobile diff 262 (`style-measure-numbers-mobile-{react,vue,diff}.png`); lower-scroll diff 1,903→1,210 after radio-button gaps (`style-measure-numbers-lower-{react,vue,diff}.png`); disabled measure-number state diff 4,223→780 after matching group opacity (`style-measure-numbers-disabled-{react,vue,diff}.png`); range-enabled lower state diff 1,083→702 after reusing React `sd-spinbox` structure for XY inputs (`style-measure-numbers-enabled-{react,vue,diff}.png`), scroll 431 in both; Every 4 measures, On all staves/Below and range Parentheses/Above persist in both; alternate-state diff 343 (`style-measure-numbers-all-staves-{react,vue,diff}.png`), Position bounds match. Remaining interactions open.

Reference: upstream React editor (`upstream/muse-encore/editor`), plus supplied URL `https://mlx-notation.vercel.app/`. Target: Vue editor at `http://localhost:5174/`.

| Surface/state | React capture | Vue capture | Compare/fix | Status |
|---|---|---|---|---|
| Home / scores page (desktop, 1440×900) | `parity-react-desktop.png` | `parity-vue-desktop.png` | historical pixelmatch 304 / 1,296,000; later empty-state comparisons at 1280×800 exact | Fresh home icon capture pair after `document.fonts.ready` exact at mobile; empty list toggle at 1280×800 exact; historic desktop/mobile captures predate font-ready recheck and are not current baselines. Populated score rows not verified.
| Home / scores page (mobile, 390×844) | `home-icon-react.png` | `home-icon-vue.png` | `home-icon-diff.png`: 0 pixels after `document.fonts.ready` | empty home structure and icon fonts match; populated grid/list, filtering and remove states still unverified.
| Main menu File (desktop/mobile) | `menu-file-react[-mobile].png` | `menu-file-vue[-mobile].png` | `menu-file-diff[-mobile].png`: 0 pixels, desktop down from 4,903; popup both (6,26), 220×332; F10, navigation, Escape focus and Preferences action pass `check-menu.mjs` | score menus measured separately; more submenu/actions remain unverified |
| Main menus in score (desktop/mobile) | `menu-{file,edit,view,add,format,tools,help}-score-react[-mobile].png` | corresponding `-vue` captures | popup bounds match for all seven; full-screen diffs desktop 4,417–6,359 and mobile 6,733–10,494, mostly workspace differences; `capture-menu-all.mjs`; `check-menu.mjs` keyboard F10/arrow navigation/Escape focus and Preferences action pass in React and Vue after fixing React URL to IPv6 | individual actions and other submenus unverified |
| View > Toolbars submenu (desktop) | `menu-submenu-react.png` | `menu-submenu-vue.png` | bounds both (300.25,348), 220×114; full-screen diff 5,402; Left and Escape pass `check-menu-submenu.mjs` | other submenu states and mobile unverified |
| Score workspace (desktop, 1280×800, Chopin nocturne fixture) | `score-react-latest.png` | `score-vue-latest.png` | fresh `capture-score.mjs`: pixelmatch 17 / 1,024,000 (`score-latest-diff.png`); viewport both 980×590 at (300,142), panel 300×622 at (0,110) | desktop score workspace geometrically aligned; 17-pixel residual. Fresh mobile re-capture after score-ready: diff 0 (`capture-score-mobile.mjs`, `score-mobile-diff.png`); earlier 196-diff baseline stale. Toolbar/panel states and alternate scores remain to audit |
| Score workspace (mobile, 390×844) | `score-mobile-react.png` | `score-mobile-vue.png` | `score-mobile-diff.png`: 196 pixels, down from 10,832; chrome, viewport and bottom geometry match after flex and note-toolbar menu fixes | toolbar wrapping improved; controls and interactions remain incomplete |
| Panel dock / palettes | `score-react-latest.png` | `score-vue-latest.png` | latest rect x=0, y=110, width=300, height=622 in both | dock and palette CSS connected; header, search, expand/collapse and resizing changed; interactive parity and mobile remain unverified |
| Score toolbar and bars | `score-react-latest.png` | `score-vue-latest.png` | main/top/bottom docks shown; note icons follow persisted `noteInputBarConfig`, measure/beat use native inputs like React | partial: playback controls use reference icons/order and Parts label; playalong active/status controls added but not verified; bottom view toolbar restored, note-input method/tuplet/cross-staff menu arrows restored; first menu and Escape pass `check-note-toolbar-menu.mjs`; grip menu and Alt-arrow reorder pass `check-toolbar-grip.mjs`; pointer drag attempt to reorder did not move React toolbar (`check-toolbar-drag.mjs`), valid target still needed; other menu actions unverified |
| Expanded Clefs palette (desktop, 1280×800) | `palette-expanded-react.png` | `palette-expanded-vue.png` | fresh `capture-palette.mjs`: full-screen diff 238 pixels; both grids at (12,233), 275×112, seven 39×55 cells per row (React host corrected to IPv6) | grid geometry matches; header/grid arrow navigation and Escape pass `check-palette-grid-keyboard.mjs`; More-to-custom grid drop passes `check-palette-cell-drop.mjs` in both apps; mobile expanded grid/cell bounds and columns match, diff 196 (`capture-palette-mobile.mjs`, `palette-expanded-mobile-{react,vue,diff}.png`); cell reorder, score-element drop, selection application and mobile actions unverified |
| Palette search: “treble” (desktop, 1280×800) | `palette-search-react.png` | `palette-search-vue.png` | fresh `capture-palette-search.mjs`: full-screen diff 245 (previous capture 44,682); both show seven results, search focus and Escape focus restoration pass. Script React host corrected to IPv6 | mobile search diff 196, seven results and Escape focus pass (`capture-palette-search-mobile.mjs`, `palette-search-mobile-{react,vue,diff}.png`); glyph placement and other keyboard/actions need audit |
| Playback speed popup (desktop, 1280×800) | `speed-react.png` | `speed-vue.png` | fresh `capture-speed.mjs`: popup bounds both (969,67), 280×84; full-screen diff 410 (was 1,480 immediately before fix); Escape/focus restoration pass. Vue Reka popper wrapper had `z-index:auto`, hiding top half under toolbar; raised wrapper to React popup z-index and prevented unwanted number-input autofocus | mobile captures `speed-{react,vue,diff}-mobile.png` diff 424 full-screen; bounds React (38.3125,158), Vue (38,158), both 280×84. Numeric 150% updates range to 1.5 and Escape closes in both; slider drag to 2.5 and reopen persistence pass in both; reload resets to 1 in both (`check-speed-slider.mjs`) |
| Note-input customize popup (desktop, 1280×800) | `customise-react.png` | `customise-vue.png` | `customise-diff.png`: 29,036 pixels full-screen; both 340×560 with 51 items; Vue 27px left due incomplete toolbar | fresh `capture-customise.mjs` (React URL fixed to IPv6): popup bounds React (668.70,108) and Vue (669,108), both 340×560 with 51 items; toggle and Escape/focus pass in both; full-screen diff 4,307, popup crop 4,063 dominated by icon/text antialiasing; fresh capture diff 4,328 with popup x=668.703 React vs 669 Vue, same 340×560 (`capture-customise.mjs`); fractional position may contribute; mobile popup bounds and 51 items match, diff 681; toggle/Escape focus pass (`capture-customise-mobile.mjs`, `customise-mobile-{react,vue,diff}.png`); Move up and Reset restore default order in both (`capture-customise.mjs`); Add menu now uses React-specific items and MenuPopup; desktop/mobile bounds match, diffs 235/172 and Escape/focus pass (`toolbar-add-{desktop,mobile}-{react,vue,diff}.png`); Measures submenu keyboard navigation and Escape/focus pass (`check-toolbar-add.mjs`); submenu actions and pointer reorder unverified |
| View toolbar (desktop/mobile) | `view-toolbar-{react,vue}.png`, `view-toolbar-mobile-{react,vue}.png` | corresponding Vue captures | exact bounds desktop (0,732,1280×41), mobile (0,745,390×72); pixel diffs 95 desktop/24 mobile; page-next, 100% zoom, center-page, Print dispatch, shortcuts-help dialog + Escape verified (`check-view-toolbar.mjs`, `check-view-toolbar-mobile.mjs`, `check-view-toolbar-controls.mjs`; `/tmp/view-toolbar-recheck2.log`, `/tmp/view-toolbar-mobile.log`, `/tmp/view-toolbar-controls.log`) | dialog/button appearance and other view modes remain unverified |
| Palette tab menu (desktop, 1280×800) | `panel-menu-react.png` | `panel-menu-vue.png` | `panel-menu-diff.png`: 16,189 pixels full-screen; expand/collapse all pass `check-panel-menu.mjs`; touch parity proven `check-panel-menu-touch.mjs` | popup styling differs; remaining checks tracked separately |
| Layout tab menu (mobile touch) | `layout-tab-menu-touch-react.png` | `layout-tab-menu-touch-vue.png` | `check-layout-tab-menu-touch.mjs`; matching actions/order/bounds, pixel diff 0; Close removes Layout and selects Palettes | Menu parity fixed; expand/collapse verified by touch (2→5→2 tree rows); ordering submenu lists 12 orders; selecting an order not yet verified |
| Layout panel (desktop, 1280×800) | `layout-react.png` | `layout-vue.png` | `layout-diff.png`: 5,796 pixels full-screen, down from 5,997; panel both (0,145), 299×587 | partial: row settings, expansion, system markings actions, keyboard, mobile unverified/missing |
| Layout expanded Piano (desktop) | `layout-expanded-react.png` | `layout-expanded-vue.png` | fresh `capture-layout-expanded.mjs` (React IPv6 host): full-screen diff 398 pixels, previously 6,612; both show Treble, Bass and Add staff | settings buttons restored; Arrow navigation, selection and collapse pass `check-layout-keyboard.mjs`; mobile expanded rows diff 341 (`capture-layout-expanded-mobile.mjs`, `layout-expanded-mobile-{react,vue,diff}.png`); expansion persistence and mobile actions unverified |
| Layout settings: instrument, staff, system (desktop) | `layout-settings-{instrument,staff,system}-react.png` | corresponding `-vue` captures | popup bounds match; full-screen diffs 2,686/2,843/2,844; instrument name, small staff, Escape pass `capture-layout-settings.mjs` | mobile instrument/staff/system bounds match, diffs 246/100/469; name edit, small staff toggle and Escape pass (`capture-layout-settings-mobile.mjs`, `layout-settings-mobile-{instrument,staff,system}-{react,vue,diff}.png`); part-score reset formatting, replace instrument, other edits and undo unverified |
| Layout Add menu and instruments dialog (desktop) | `layout-add-react.png`, `layout-instruments-react.png` | corresponding `-vue` captures | menu diff 47,256 to 2,841, both 314.375×71; dialog both 1040×700, full-screen diff 1,126; Escape/focus, add to list, Cancel pass `check-layout-add.mjs` | single-piano action disabled in both; adding Flute with OK then adding system markings succeeds in both (`check-layout-system-multipart.mjs`); mobile Add menu diff 196 (`capture-layout-add-mobile.mjs`, `layout-add-mobile-{react,vue,diff}.png`); mobile instruments dialog bounds match, diff 220; add Flute to list and Cancel pass (`check-layout-add-mobile.mjs`, `layout-instruments-mobile-{react,vue,diff}.png`); mobile OK adds Flute and System markings adds second row in both (`check-layout-system-mobile.mjs`); Edit > Undo removes added System markings and Flute in both (`check-layout-system-mobile.mjs`) |
| Add palettes popup (desktop, 1280×800) | `add-palettes-react.png` | `add-palettes-vue.png` | `add-palettes-diff.png`: 5,166 pixels full-screen; popup both (12,191), 275×480, 16 entries; add and Escape/focus pass `check-add-palettes.mjs` | custom creation, outside click and mobile still require verification |
| Palette header menu, Clefs (desktop) | `palette-header-menu-react.png` | `palette-header-menu-vue.png` | `palette-header-menu-diff.png`: 11,021 to 2,932 pixels; menu both (247,225), 220×219; Enable editing action opens | properties and custom hide/delete confirmation restored; header arrows/Home and expansion pass `check-palette-keyboard.mjs`; header reorder passes `check-palette-drag.mjs`; custom More section restored, delete/add unverified; other actions and mobile unverified; More Add disabled in initial sessions |
| Custom palette properties (desktop) | `palette-properties-react.png` | `palette-properties-vue.png` | dialog both (480,207.734375), 320×384.515625; full-screen diff 7,277 to 2,622 after empty-grid fix; Cancel restores name in both | other fields, OK, custom hide/delete, mobile unverified |
| Clefs More popup (desktop, 1280×800) | `palette-more-react.png` | `palette-more-vue.png` | `palette-more-diff.png`: 17,949 pixels full-screen; popup both (12,349), 275×319.59375, 25 cells; Escape/focus pass `check-palette-more.mjs` | selection/add blocked in reference test: Add remains disabled after attempted Enable editing; custom section restored but not visually verified; mobile unverified |
| Inspector, selected key signature (desktop, 1280×800) | `inspector-selection-react.png` | `inspector-selection-vue.png` | fresh `capture-inspector-selection.mjs` after IPv6 React host fix: full-screen diff 1,003 pixels, previously 3,311; both report List selection and show General and Key signature | key-signature mode labels corrected from uppercase enum names to React source strings; fixture-independent test in `test/inspector.test.ts`. Appearance popup layout restored; mobile selected-key-signature capture after desktop selection/resize shows same sections, diff 943 (`capture-inspector-selection-mobile.mjs`); direct mobile selection, property editing and other selections unverified |
| Inspector appearance popup, key signature (desktop, 1280×800) | `inspector-appearance-react.png` | `inspector-appearance-vue.png` | `inspector-appearance-diff.png`: 3,555 pixels full-screen, down from 10,703; popup both (12,297.390625), 275×458; Escape/focus passes | leading-space comma input and arrow increment pass in both apps; mobile after desktop selection/resize popup bounds match, diff 1,187 and Escape/focus pass (`capture-inspector-appearance-mobile.mjs`); other edits, units, alternate selections and direct mobile selection unverified |
| Inspector without selection (desktop, 1280×800) | `inspector-react.png` | `inspector-vue.png` | `inspector-diff.png`: 3,172 pixels full-screen, down from 6,563; panel both (0,145), 299×587; collapse persistence passes `check-inspector.mjs` | mobile no-selection panel bounds match, diff 666 (`capture-inspector-mobile.mjs`, `inspector-mobile-{react,vue,diff}.png`); display toggle disabled in both test sessions; selected elements and mobile actions remain unverified |
| New score dialog, initial Choose instruments (desktop 1280×800) | `newscore-choose-react.png` | `newscore-choose-vue.png` | `newscore-choose-diff.png`: 0 pixels, down from 286,283; both dialogs (120,50), 1040×700; add/remove/close pass `capture-newscore.mjs` | template, info, other selection states, creation and mobile unverified |
| New score additional information (desktop/mobile) | `newscore-info-react[-mobile].png` | `newscore-info-vue[-mobile].png` | `newscore-info-diff[-mobile].png`: 0 pixels both, desktop down from 16,636; key, tempo, title persistence and dropdown Escape pass `capture-newscore-info.mjs` | time/pickup changes pass; score creation and alternate dropdown states remain unverified |
| New score information dropdowns (desktop/mobile) | `newscore-{key,time,tempo,measures}-react[-mobile].png` | `newscore-{key,time,tempo,measures}-vue[-mobile].png` | `newscore-*-diff[-mobile].png`: 0 pixels for all four at both sizes; panel bounding boxes match | alternate option states and creation unverified |
| New score Create from template (desktop/mobile) | `newscore-template-react[-mobile].png` | `newscore-template-vue[-mobile].png` | `newscore-template-diff[-mobile].png`: 0 pixels both viewports, desktop down from 46,514; category, Next/Back, Cancel pass `capture-newscore-template.mjs` | other templates, preview error, creation and score info remain unverified |
| Preferences General (desktop, 1280×800) | `preferences-react.png` | `preferences-vue.png` | `preferences-diff.png`: 0 pixels; both dialogs (280,160), 720×480; tab navigation and OK close pass `capture-preferences.mjs` | mobile General diff 0; bounds/font/color/padding match (`preferences-general-mobile-{react,vue,diff}.png`); language changes and mobile interactions unverified |
| Preferences Save & publish, Note input, Import, Web (desktop/mobile) | `preferences-{cloud,note,import,web}-react[-mobile].png` | `preferences-{cloud,note,import,web}-vue[-mobile].png` | `preferences-*-diff[-mobile].png`: desktop 0/0/0/44 pixels, mobile 0/0/0/19; autosave toggle and Escape pass `capture-preferences-pages.mjs` | remaining setting edits, file picker, keyboard and General mobile unverified |
| About dialog (desktop/mobile) | `about-react[-mobile].png` | `about-vue[-mobile].png` | `about-diff[-mobile].png`: 5/4 pixels; bounds match; Escape closes both | native reference dialog restored; OK and links unverified |
| Project properties (desktop/mobile) | `project-properties-react[-mobile].png` | `project-properties-vue[-mobile].png` | bounds match; full-screen diffs 1,323/1,235; new property and Escape pass `capture-project-properties.mjs` | custom property save/delete persists in React/Vue (`node check-project-properties.mjs`); Edit > Undo restores deleted property in both (`node check-project-properties.mjs`); Ctrl+Z attempt with dialog focus did not |
| Page settings (desktop/mobile) | `page-settings-react[-mobile].png` | `page-settings-vue[-mobile].png` | bounds match; full-screen diffs 2,391/274; Landscape and Cancel pass `capture-page-settings.mjs` | fresh `capture-page-settings.mjs` (fixed IPv6 React URL) yields exact dialog bounds both desktop/mobile; full-screen diffs 255/220. Landscape and Cancel pass. `check-page-settings-rollback.mjs` verifies width edit Cancel, OK persistence and Edit > Undo in both; separate smoke confirms Staff space edit/OK. Remaining controls unverified |
| Measures per system (desktop/mobile) | `breaks-react[-mobile].png` | `breaks-vue[-mobile].png` | dialog bounds match; full-screen diffs 2,349/2,307 after mobile toolbar correction; radio and Cancel pass `capture-breaks.mjs` | fresh `capture-breaks.mjs` (fixed IPv6 React URL) yields exact dialog bounds desktop/mobile; full-screen diffs 217/190. System-lock checkbox and Cancel pass. 2 measures per system changes canvas; Edit > Undo and deselection restore first-page canvas in React/Vue (`check-breaks-undo.mjs`); selected-range behavior unverified |
| Insert measures count (desktop/mobile) | `measures-count-react[-mobile].png` | `measures-count-vue[-mobile].png` | fresh `capture-measures-count.mjs` after React IPv6 host correction: exact bounds desktop/mobile; full-screen diffs 227/186, down from 2,402/7,044; numeric input and Cancel pass | inserting 30 measures increases page count and Edit > Undo restores it in both (`check-insert-measures.mjs`); exact measure count/contents unverified |
| Transpose (desktop/mobile) | `transpose-react[-mobile].png` | `transpose-vue[-mobile].png` | fresh `capture-transpose.mjs` uses IPv6 React host; dialog bounds exact 460×618 desktop/mobile; desktop dialog-only crop `transpose-dialog-diff.png` has 3 differing pixels, while full-screen diff 11,417 is primarily React range selection behind modal vs no selection in Vue; mobile full-screen diff 275. Diatonic radio and Cancel pass; apply/undo and mobile backdrop state unverified | diatonic apply changes first-page canvas and Edit > Undo/deselect restores it in both (`check-transpose-undo.mjs`); persisted mode options and exact pitch changes unverified |
| Export dialog (desktop/mobile) | `export-react[-mobile].png` | `export-vue[-mobile].png` | fresh `capture-export.mjs`: exact bounds desktop (238,165,804×470), mobile (16,124.25,358×595.5); diffs 243/158; select all, clear and Cancel pass | `check-export-formats.mjs` run against React and Vue: both expose PDF/PNG/SVG/MIDI/MusicXML/MuseScore formats; PDF resolution 150, grayscale and PDF download pass in both. SVG settings desktop/mobile bounds match, diffs 254/158 (`capture-export-svg.mjs`, `export-svg-{react,vue,diff}[-mobile].png`); SVG Illustrator-compatibility toggle and ZIP download pass in both (`check-export-formats.mjs`); ZIP contains five SVG pages in both; MIDI settings desktop/mobile bounds match, diffs 260/158 (`capture-export-midi.mjs`, `export-midi-{react,vue,diff}[-mobile].png`); MIDI download and MThd header pass in both (`check-export-formats.mjs`); MusicXML settings desktop/mobile bounds match, diffs 258/158 (`capture-export-musicxml.mjs`, `export-musicxml-{react,vue,diff}[-mobile].png`); PNG settings desktop/mobile bounds match, diffs 224/158 (`capture-export-png.mjs`, `export-png-{react,vue,diff}[-mobile].png`); MusicXML download contains score-partwise in both (`check-export-formats.mjs`); PNG 32dpi download contains five PNG pages in both (`check-export-formats.mjs`); MuseScore settings desktop/mobile bounds match, diffs 228/158 (`capture-export-musescore.mjs`, `export-musescore-{react,vue,diff}[-mobile].png`); MuseScore download contains .mscx in both (`check-export-formats.mjs`); MuseScore roundtrip, PNG rendering, MusicXML roundtrip, MIDI playback, SVG rendering, other format-specific UI and busy/cancel behavior unverified |
| Parts dialog (desktop/mobile) | `parts-react[-mobile].png` | `parts-vue[-mobile].png` | fresh `capture-parts.mjs`: exact bounds desktop (308,121,664×558), mobile (16,143,358×558); full-screen diffs 198/158; new part, Escape from edit and Close pass | Escape from changed title edit cancels without committing, matching React (`node check-parts-actions.mjs`); fresh Parts capture passes after correction. create, title edit, duplicate, empty custom-part delete and Open selected/all pass `node check-parts-actions.mjs` in both; Open all verifies each listed title appears; initialized empty-part Reset action completes; first-row menu bounds match desktop/mobile, diffs 206/158 (`parts-menu-{desktop,mobile}-{react,vue,diff}.png`); reset effect and confirmed delete unverified; duplicating/opening default Piano produced no delete confirmation in React (`check-parts-confirm.mjs`), nonempty fixture needed |
| Save score dialog (desktop/mobile) | `save-score-react[-mobile].png` | `save-score-vue[-mobile].png` | bounds match; full-screen diffs 233/169; blank-name validation and Escape pass `capture-save-score.mjs` | computer download filename and browser IndexedDB save pass in both (`node check-save-score.mjs`); File System Access picker unverified |
| Select More, key signature (desktop) | `select-dialog-react.png` | `select-dialog-vue.png` | bounds match; full-screen diff 389; Add to selection and Cancel pass `capture-select-dialog.mjs` | desktop recheck diff 253 after context menu restored to reference MenuPopup; mobile context menu now stays onscreen, but selection differed after resize and Vue More remained disabled, so mobile dialog, note variant and apply unverified |
| Style dialog, Score page (desktop/mobile) | `style-react[-mobile].png` | `style-vue[-mobile].png` | outer bounds match; full-screen diffs 298/220, down from 40,248/11,995 after widget structure fix; Clefs page selection and Escape pass `capture-style.mjs` | Score staff-line spin commit and Cancel rollback pass `check-style-rollback.mjs`; other pages, edits and mobile interactions unverified |
| Style pages, desktop | `style-{Spacing,Sizes,Header-footer,Clefs-key-time-signatures}-react.png` | corresponding `-vue.png` | diffs 295/295/295/883 (`capture-style-pages.mjs`); Clefs diff previously 7,249/9,243. Restored React GroupBox column wrappers and 8px/12px spacing for Time signatures/Style and size; also fixed locked horizontal scale edit. Above-staves alternate state `style-above-{react,vue,diff}.png` improved 4,045→794 after restoring missing alignment buttons; across-staves capture `style-across-{react,vue,diff}.png` diff 805; both alignment buttons present and second selection sets aria-checked=true in React/Vue. Scale clamps 0.5→1; locked horizontal scale 1.5 persists; unlock permits vertical 2, relock restores both to 1.5, and reset restores defaults in React/Vue (`node check-clef-scale.mjs`); Above- and across-staves alignments persist after OK/reopen; Above-staves reset clears Inset barline in both (`node check-clef-scale.mjs`); mobile above/across captures diff 220 each (`style-clefs-{above,across}-mobile-{react,vue,diff}.png`); above scrolled-into-view capture also diff 220 with matching radio bounds (`style-clefs-above-visible-mobile-{react,vue,diff}.png`); other interactions unverified. Source and DOM inspection found undefined `sd-hbox` class stacked time-signature placement and illustration, instead of React Row. Replaced with `.sd-row`; section layout now matches source direction. mobile Clefs captures `style-clefs-mobile-{react,vue,diff}.png` diff 7,728→1,170 after adding React GroupBox's `minWidth={500}`; then 851 after matching React StyledImage's bordered wrapper. Vue had wrapped radio labels instead of clipped overflow, and omitted image border/height. QML images missing from submodule, so illustrations cannot load. Other QML pages unverified |
| Style Chord symbols (desktop) | `style-chords-react.png` | `style-chords-vue.png` | `style-chords-diff.png`: 18,943→19,646→1,227 pixels after restoring visible preset, spelling, capitalization and extension group hierarchy | added missing spelling/capitalization, polychord, alignment, positioning, playback and capo controls; `node check-chords-style.mjs` verifies Drop two voicing and 125% extension scale persistence in React/Vue; altered bass and polychord groups restored; alignment restored; middle scroll diff 7,088→903 (`style-chords-middle-{react,vue,diff}.png`), positioning/playback/capo groups restored; lower scroll diff 582 (`style-chords-lower-{react,vue,diff}.png`); mobile diff 496 (`style-chords-mobile-{react,vue,diff}.png`); capo clamp/persistence and custom-preset load-button/Jazz persistence pass React/Vue; custom XML file selection updates filename in React/Vue (`node check-chords-style.mjs`); custom-state diff 663 (`style-chords-custom-{react,vue,diff}.png`), load-button bounds match; rendering custom chords and remaining interactions open |
| Style Fretboard diagrams (desktop) | `style-fretboards-react.png` | `style-fretboards-vue.png` | `style-fretboards-diff.png`: 24,100→793 pixels after matching React group hierarchy and measured intrinsic radio widths; `node check-fretboards-style.mjs` verifies orientation, position and suffix persistence | mobile diff 220; lower diff 8,210→708 (`style-fretboards-lower-{react,vue,diff}.png`) after fixing selector order; check also verifies extended style, fingerings and spacing persistence; remaining interactions unverified |
| Style Bends & dives (desktop) | `style-bends-react.png` | `style-bends-vue.png` | `style-bends-diff.png`: 27,201→2,039 pixels after restoring nested groups and measured control widths; arrow width edit and dive radio/Cancel pass React/Vue | mobile diff 344 (`style-bends-mobile-{react,vue,diff}.png`); `node check-bends-style.mjs` verifies arrow width and dive placement persistence; scrolled lower diff 4,983→672 (`style-bends-lower-{react,vue,diff}.png`) after matching measured whammy label/control widths; `node check-bends-style.mjs` also verifies whammy text, dotted line and cue-size checkbox persistence in both; other interactions unverified |
| Style Voltas (desktop) | `style-voltas-react.png` | `style-voltas-vue.png` | `style-voltas-diff.png`: 14,167→801 pixels after matching fieldsets, icons and alignment; Dashed reveals Dash and alignment selection passes React/Vue | mobile diff 220 (`style-voltas-mobile-{react,vue,diff}.png`); `node check-voltas-style.mjs` verifies dashed, dash length and alignment persistence in both; remaining interactions unverified; image assets absent |
| Style Slurs & ties (desktop) | `style-slurs-react.png` | `style-slurs-vue.png` | `style-slurs-diff.png`: 19,718→1,135 pixels after matching grids and radio groups; numeric edit, slur-angle radio and Cancel pass React/Vue | mobile diff 421 (`style-slurs-mobile-{react,vue,diff}.png`); mobile radio passes; `node check-slurs-style.mjs` verifies numeric/radio persistence; remaining interactions unverified |
| Style Measure numbers | `style-measure-numbers-current-react.png` | `style-measure-numbers-current-vue.png` | desktop diff 20,133→903; mobile diff 262; lower enabled diff 702; disabled diff 780; On all staves diff 343, bounds match | `node check-measure-offset.mjs` verifies frequency, offsets, range and placement persistence in React/Vue; remaining interactions open. See current captures and details above |
| Style Repeats (desktop) | `style-repeats-react.png` | `style-repeats-vue.png` | `style-repeats-diff.png`: 14,839→959 pixels after restoring React groups and controls; Number consecutive checkbox and Cancel pass in both | mobile diff 250 (`style-repeats-mobile-{react,vue,diff}.png`); `node check-repeat-style.mjs`: Every edit and preset persist after OK/reopen in React/Vue; enabled-state diff 1,201 (`style-repeats-enabled-{react,vue,diff}.png`), fieldset bounds match; remaining interactions unverified |
| Style Beams (desktop) | `style-beams-react.png` | `style-beams-vue.png` | `style-beams-diff.png`: 16,945→623 pixels after matching `.sd-page` hierarchy; Wide radio and numeric edit/Cancel pass React/Vue | mobile diff 387 (`style-beams-mobile-{react,vue,diff}.png`); checkbox toggles and thickness/Wide persist after OK/reopen in React/Vue; remaining controls unverified; image asset absent |
| Style Accidentals (desktop) | `style-accidentals-react.png` | `style-accidentals-vue.png` | `style-accidentals-diff.png`: 14,280→933 pixels after replacing unstyled Nuxt controls with reference fieldsets, switches, and image wrappers; Pair accidentals toggle and Cancel pass in both | image files absent; numeric clamp/invalid input tested against React (99→10; invalid restores previous). ArrowUp/ArrowDown and reset to 0.175 pass in React/Vue; mobile diff 8,688→679 (`style-accidentals-mobile-{react,vue,diff}.png`) after matching nonshrinking label wrapper; edited padding persists after OK/reopen in React/Vue |
| Create tuplet (desktop) | `tuplet-react.png` | `tuplet-vue.png` | bounds match; full-screen diff 253; ratio edit, number format and Cancel pass `capture-tuplet.mjs` | mobile capture after desktop selection and resize: exact dialog bounds, diff 158; ratio edit and Cancel pass (`capture-tuplet-mobile.mjs`, `tuplet-mobile-{react,vue,diff}.png`); 5-tuplet apply changes first-page canvas, Edit > Undo/deselect restores it in both (`check-tuplet-undo.mjs`); exact tuplet content and direct mobile selection unverified |
| Realize chord symbols | `realize-react[-mobile].png` | `realize-vue[-mobile].png` | full-screen diff 338 desktop/266 mobile; bounds identical; Show more and Cancel pass `capture-realize.mjs` | exact structure/geometry match; small residuals remain, score fixture did not expose chord names; override options and Apply unverified |
| Score context menu, mobile | `context-mobile-react.png` | `context-mobile-vue.png` | bounds match (128.234,530,257.766×201); menu crop diff 0, full-screen diff 943 outside menu; Escape closes both (`context-mobile-diff.png`) | other selection states and actions unverified |
| Style Hammer-ons, pull-offs & tapping | `style-Hammer-ons-pull-offs-tapping-react.png` | `style-Hammer-ons-pull-offs-tapping-vue.png` | desktop diff 14,847→291 after restoring React six groups, controls, spacing and image wrapper (`capture-style-hammer.mjs`); mobile diff 220 (`capture-style-hammer-mobile.mjs`) | lower-case and consecutive display persist in both (`check-hammer-style.mjs`); lower scroll diff 25,468→261 after fixed-width icon buttons and matching disabled opacity (`capture-style-hammer-lower.mjs`); mobile lower diff 220 with matching scroll 321 (`capture-style-hammer-lower-mobile.mjs`); left-hand Both on both staves and slur checkbox persist; Symbol disables slur checkbox in both (`check-hammer-style.mjs`); other tapping interactions and absent illustration assets remain unverified |
| Other dialogs, menus, playback states | unavailable | unavailable | pending | pending |
| Global fonts, tokens, reset, responsive rules | source audit pending | source audit pending | pending | pending |

Initial captures were invalid because both URLs hit Vue dev server. React reference at port 5180 required local upstream clone data and a placeholder migration asset to start; these are test-only external working-copy changes. Home screenshot pairs at DPR 1: `parity-*.png`, diffs `parity-diff-*.png`. Desktop diff 304/1,296,000; mobile diff reduced 5,127→304/329,160 by matching React mobile grid breakpoint. Latest score screenshot follows status-control markup restoration: one-pixel status-bar height affected fit-to-page zoom and most score pixels. Preceding diff was 45,429 pixels; page/canvas geometry now matches. Palette search now uses React's master-palette filtering and tested focus restoration; popup, grid, menu and other keyboard behavior require verification. Score capture fixture: `mscz-test-files/Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mscz`; exact viewport bounds confirmed with Playwright, but score contents/controls still differ. Latest `npm run typecheck` and `npm run build:editor` pass. Focused Inspector: 2 pass/5 skip. Full `npm test` attempted; blocked with ENOENT for absent `MuseScore/vtest/scores` fixtures (`beams-24.mscz`). E2E suite previously skipped all 46 tests for same fixture gap. Major dialogs, menus, mobile score, palettes/inspector detail, playback and interaction states remain unverified.

- Style Glissandos & note-anchored lines: desktop diff 17,707→280 (`capture-style-glissando.mjs`), mobile 220 (`capture-style-glissando-mobile.mjs`); restored native QML columns and controls. Wavy, dashed, thickness, Show text and note-line dotted persist in both (`check-glissando-style.mjs`); numeric input border/padding and bounds match after fixing global input specificity (`measure-glissando.mjs`); remaining interactions need verification.

- Style Notes: desktop diff 27,385→309, mobile 220 (`capture-style-notes*.mjs`); flag selector now uses React radio layout, restoring downstream geometry. Straight persists and Cancel restores prior selection in both (`check-note-flags.mjs`); remaining Notes controls unverified.

- Style Rests: desktop diff 25,173→265, mobile 220 (`capture-style-rests*.mjs`); removed nested Nuxt card and restored React radio/checkbox column. Two-space offset and Merge matching rests persist in both (`check-rests-style.mjs`); other controls unverified.

- Style Tuplets: desktop diff 29,938→263, mobile 220 (`capture-style-tuplets*.mjs`); number-alignment selector now matches React geometry. Rhythmic center persists and Cancel restores it in both (`check-tuplet-style.mjs`); other controls unverified.

- Style Barlines default: desktop diff 307, mobile 220 (`capture-style-barlines*.mjs`); alternate states and interactions unverified.

- Style Arpeggios default: desktop diff 301, mobile 220 (`capture-style-arpeggios*.mjs`); alternate states and interactions unverified.

- Style Chord brackets default: desktop diff 325, mobile 220 (`capture-style-chord-brackets*.mjs`); alternate states and interactions unverified.

- Style Dynamics & hairpins: desktop diff 4,048→287, mobile 220 (`capture-style-dynamics*.mjs`); restored React OffsetSelect spinboxes and geometry. Horizontal offset persists and Cancel restores it in both (`check-dynamics-offset.mjs`); other offsets unverified.

- Style Ottavas default: desktop diff 299, mobile 220 (`capture-style-ottavas*.mjs`); alternate states and interactions unverified.

- Style Pedal lines default: desktop diff 298, mobile 220 (`capture-style-pedal*.mjs`); alternate states and interactions unverified.

- Style Trill lines default: desktop diff 299, mobile 220 (`capture-style-trill*.mjs`); alternate states and interactions unverified.

- Style Vibrato lines default: desktop diff 300, mobile 220 (`capture-style-vibrato*.mjs`); alternate states and interactions unverified.

- Style Text lines default: desktop diff 293, mobile 220 (`capture-style-textlines*.mjs`); alternate states and interactions unverified.

- Style System text lines default: desktop diff 271, mobile 220 (`capture-style-systemtextlines*.mjs`); alternate states and interactions unverified.

- Style Articulations & ornaments default: desktop diff 280, mobile 220 (`capture-style-articulations*.mjs`); alternate states and interactions unverified.

- Style Fermatas default: desktop diff 285, mobile 220 (`capture-style-fermatas*.mjs`); alternate states and interactions unverified.

- Style Staff text default: desktop diff 281, mobile 220 (`capture-style-stafftext*.mjs`); alternate states and interactions unverified.

- Style Tempo text default: desktop diff 292, mobile 220 (`capture-style-tempotext*.mjs`); alternate states and interactions unverified.

- Style Lyrics default: desktop diff 285, mobile 220 (`capture-style-lyrics*.mjs`); alternate states and interactions unverified.

- Style Expression text default: desktop diff 288, mobile 220 (`capture-style-expression*.mjs`); alternate states and interactions unverified.

- Style Rehearsal marks default: desktop diff 315, mobile 220 (`capture-style-rehearsal*.mjs`); alternate states and interactions unverified.

- Style Figured bass default: desktop diff 312, mobile 220 (`capture-style-figuredbass*.mjs`); alternate states and interactions unverified.

- Style Tablature default: desktop diff 312, mobile 220 (`capture-style-tablature*.mjs`); alternate states and interactions unverified.

- Style Text styles: desktop diff 16,144→280, mobile 220 (`capture-style-textstyles*.mjs`); restored text input, alignment/font icon controls and color class. Bold and left alignment persist in both (`check-textstyles.mjs`); other interactions pending.

- Style Spacing default: desktop diff 299, mobile 220 (`capture-style-spacing*.mjs`); alternate states and interactions unverified.

- Style Sizes default: desktop diff 304, mobile 220 (`capture-style-sizes*.mjs`); alternate states and interactions unverified.

- Style System default: desktop diff 309, mobile 220 (`capture-style-system*.mjs`); alternate states and interactions unverified.

- Clefs lower repeats/jumps hierarchy corrected: measured page height now matches 1,883.8125px, lower scroll 1,229 in both; lower diff 1,120→303 after restoring checkbox wrapper (`capture-style-clefs-lower.mjs`). Top diff 901; missing images and remaining controls unverified. Typecheck/build and scale check pass.

- Clefs mobile lower capture (`capture-style-clefs-lower-mobile.mjs`) diff 220 at respective bottom scroll; bottom scroll now 3,332 in both after scale lock sizing fix. At scroll 1,500 middle diff 8,455→220 after matching React 20px lock (`capture-style-clefs-middle-mobile.mjs`); content clipped in both.

- Customize popup diagnosis (`measure-customise-anchor.mjs`, `measure-customise-items.mjs`): anchor bounds and item fonts/sizes match; Reka rounds popup x to 669 vs React 668.703. Temporary -0.296875px wrapper translation only reduced full-screen diff 4,328→4,240 (`capture-customise-offset-test.mjs`); rounding alone not root cause. No production patch.

- Customize popup rendering diagnosis: temporary untransformed wrapper at React coordinates reduced full-screen diff 4,298→899 (`capture-customise-position-test.mjs`). Reka transform/compositing causes most residual, not item CSS. Replaced transformed popover with React-positioned popup: desktop diff 4,298→272, mobile 681→30, bounds match; toggle and Escape/focus pass (`capture-customise*.mjs`). Outside click, toggle, Move up, Reset and Escape/focus pass in both (`capture-customise.mjs`); remaining actions need verification.

- Parts confirmation fixture diagnosis: `ExcerptNotation.isEmpty()` checks excerpt.parts().length, not whether opened score has notes (`src/notation/internal/excerptnotation.ts:48`). Duplicated/opened Piano fixture still lacks excerpt parts; confirmation requires part containing assigned instruments. Existing failed exploratory script remains uncovered.

- Nonempty-part attempt (`check-parts-nonempty.mjs`) created custom part, opened it, added Flute, then Delete in React still showed no confirmation. Script times out waiting for No; do not treat as Vue regression or passing check.

- Customize popup keyboard Space toggle and separator add/delete also pass React/Vue (`capture-customise.mjs`); latest desktop diff 237.

- Toolbar pointer drag reference source (`upstream/muse-encore/editor/toolbars/ToolBars.tsx`): pointerup listener closes over render-time `drag`, while move calls `setDrag`; attempted React drag did not reorder. Need demonstrated reference setup before comparing; do not infer Vue failure.

- Select More mobile dialog: opening on desktop selection before resize yields matching bounds (16,219.265625), 358×405.453125 and diff 158 (`capture-select-mobile-open.mjs`); Add to selection and Cancel pass both. Direct mobile selection and Apply remain unverified.

- Select More mobile Add to selection + OK closes in both (`check-select-mobile-apply.mjs`); actual selection result and direct mobile selection unverified.

- Select More mobile Add + OK leaves Key signature inspector in both (`check-select-mobile-result.mjs`); exact selection cardinality remains unverified.

- Parts nonempty attempt needs stronger verification: script did not assert active part tab or Flute assignment before reopening Parts, so absence of confirmation cannot establish excerpt contents. `AddPartToExcerpt` should populate excerpt.parts() when editing actual part score; investigate active tab/setup.

- Parts fixture clarification: active Test part tab and Flute Layout row confirmed in React, but `upstream/muse-encore/editor/panels/layout/LayoutPanel.tsx:889` adds instruments to `score.masterScore()`, not excerpt. Thus custom excerpt remains empty; confirmation still unverified.

- Custom part test now activates hidden Piano via Layout visibility; Test part active and Piano visible, but React still deletes without confirmation (`check-parts-nonempty.mjs`, times out waiting for No). UI visibility does not prove excerpt.parts() populated; confirmation remains unverified.

- Correction to prior Parts notes: confirmation existed; exploratory selector chose last DOM dialog before message host. `check-parts-nonempty.mjs` now waits for message dialog and verifies No retains / Yes deletes populated part in both. Vue MessageBox replaced Nuxt modal with React native dialog markup; desktop/mobile visual captures and other message variants remain unverified. Typecheck and editor build pass.

- MessageBox Delete confirmation: native form restores inherited 16px margin; dialog bounds now match desktop 420×106.375 and mobile 358×106.375. `parts-confirm-{react,vue,diff}.png`: 544 full-screen differing pixels; mobile `parts-confirm-mobile-{react,vue,diff}.png`: 9,228 full-screen, 66 within dialog crop. `check-parts-nonempty.mjs` and `check-parts-confirm-mobile.mjs` pass No/Yes; other message variants and Escape remain open. Typecheck passes.

- MessageBox Escape cancels populated-part Delete in both; `check-message-escape.mjs` verifies row remains then No/Yes. `check-parts-reset-confirm.mjs` verifies Reset Escape/No retain row and Yes closes confirmation in both; actual formatting reset effect remains unverified. Reset confirmation screenshot diff recorded as `parts-reset-confirm-diff.png`.

- MessageBox variant probe `check-message-variants.mjs`: React OK/detail and Cancel/Ignore open; direct Vue dynamic import did not reach mounted host, so not valid parity evidence. Needs real UI trigger; do not count as pass.

- Invalid style file triggers real MessageBox OK variant: `check-message-invalid-style.mjs` passes in React/Vue desktop and mobile; bounds match, diffs `message-invalid-{1280,390}-diff.png` 577/496 pixels. Cancel/Ignore and detail variants remain unverified. Typecheck passes.

- MessageBox detail/OK verified via injected save write failure (`check-message-detail.mjs`): matching desktop/mobile bounds; `message-detail-{1280,390}-diff.png` evidence. Cancel/Ignore still unverified.

- Customize kit now reachable using Jazz Combo template and right-click measure at (750,613); `kit-{react,vue,diff}.png` exposes major native-dialog vs Nuxt structure mismatch. Not fixed; prioritize React `CustomizeKitDialog.tsx`/`customizekit.css` port and preserve model handlers. Cancel/Ignore can be exercised through old .drm load afterward.

- Customize kit native React hierarchy/CSS restored in `editor/dialogs/CustomizeKitDialog.vue`, `editor/dialogs/customizekit.css`; initial desktop diff 825,518 to 1,421 (`kit-after-diff.png`). Canvas now draws on mount. Typecheck passes. Mobile, shortcut subdialog, Cancel/Apply/OK rollback and all controls remain unverified; shortcut subdialog still Nuxt.

- Customize kit mobile capture after desktop measure selection: matching bounds 358×812, `kit-mobile-diff.png` 388 differing pixels. `check-kit-rollback.mjs` verifies Name Cancel rollback and OK persistence in both (reselect renamed row after sorting). `check-kit-warning.mjs` verifies old .drm Cancel/Ignore warning bounds and Cancel; desktop diff 1,421. Ignore action, direct mobile selection, other controls and shortcut dialog remain open. Editor build passes.

- Customize kit shortcut native dialog restored; desktop bounds 400×168.765625 match, `kit-shortcut-diff.png` 1,421 full-screen pixels. `check-kit-shortcut.mjs` verifies Z assignment and Clear/Save in both; conflict confirmation, Escape and mobile unverified. Typecheck/editor build pass.

- Shortcut conflict reassignment B: Cancel leaves dialog, OK assigns, Escape closes in both (`check-kit-conflict.mjs`, `check-kit-conflict-mobile.mjs`). Desktop conflict diff 1,421; mobile shortcut/conflict diffs in `kit-{shortcut,conflict}-mobile-diff.png`; matching bounds. Mobile uses desktop setup then resize.

- Old drumset warning Ignore closes in both (`check-kit-warning-ignore.mjs`); imported empty fixture content not independently verified. Mobile Cancel warning bounds match 358×142.75, diff 388 (`kit-warning-mobile-diff.png`), desktop setup then resize.

- Customize kit settings (`check-kit-settings.mjs`): staff line 3 and Down persist after OK/reopen in both. Selecting voice option value 2 immediately returns value 1 in both; reference behavior, not evidence of Vue-only regression. Other settings remain unverified.

- New score creation uncovered Vue DataCloneError: nested reactive objects survived shallow `toRaw` and broke `structuredClone`. `NewScoreDialog.vue` snapshots plain timesig/pickup/tempo objects; `check-newscore-create.mjs` now creates Flute score in both desktop/mobile, title and canvas verified. `newscore-created-{1280,390}-diff.png`: 704/436 pixels. Typecheck/build pass; template creation and nondefault settings unverified.

- Template score creation with G major, tempo 135 and pickup enabled completes desktop/mobile in both (`check-newscore-template-create.mjs`); title/canvas checked, visual diffs 539/436 (`newscore-template-created-{1280,390}-diff.png`). Exact score contents and other template choices unverified.

- Template content verification via MusicXML export blocked: React reference throws `TypeError: Cannot read properties of undefined (reading 'port')` in `MasterScore.midiPort` and produces no download (`check-newscore-template-content.mjs`). No Vue comparison established.

- Template score content verified via Save to computer instead of blocked MusicXML export: `check-newscore-template-save-content.mjs` asserts .mscx concertKey 1, tempo 2.25 and first measure length 1/4 in both apps desktop/mobile. Full score equivalence remains unverified.

- Staff/Part properties reached from Jazz Combo drum measure (`inspect-staff-props.mjs`): desktop Nuxt dialog diverges from React native hierarchy, diff 793,268 (`staff-props-{react,vue,diff}.png`). Not fixed; prioritize native layout, preserve staff model and nested dialogs.

- Staff/Part properties native hierarchy restored in `editor/dialogs/EditStaffDialog.vue`; desktop diff 793,268 to 436 (`staff-props-after-diff.png`), mobile bounds match 358×812 and diff 388 (`staff-props-mobile-diff.png`, desktop selection then resize). Typecheck/build pass; controls, nested dialogs and rollback remain unverified.

- Staff properties `check-staff-props.mjs`: Lines Cancel rollback and OK persistence pass both. Advanced style nested dialog remains Nuxt; desktop diff 878,301 (`staff-type-{react,vue,diff}.png`), Vue uses Reka dialog not native. Port pending; preview assets absent locally.

- Edit staff type percussion/standard shell and controls now native; percussion desktop diff 878,301 to 436, mobile bounds 358×371.515625 match and diff 388 (`staff-type-after-diff.png`, `staff-type-mobile-diff.png`). Tablature controls remain Nuxt and unverified; standard preview resources missing, interactions unverified. Typecheck/build pass.

- Percussion nested Lines Cancel/OK check (`check-staff-type.mjs`) passed both on rerun; first Vue run observed stale parent value (5) immediately after child close, so timing/race needs investigation rather than claiming stable parity. Standard advanced dialog attempt (`inspect-staff-standard.mjs`) could not open React dialog, likely missing preview assets; no screenshot comparison.

- Nested percussion check rerun 3 times with 300ms after native close: Cancel/OK passes both; immediate `hidden` observes close before parent handler runs, so test now waits for update (`check-staff-type.mjs`). Standard/tablature preview still blocked by missing sample assets; tablature native controls pending.

- Edit staff type tablature controls ported to React fieldsets/radio groups in `EditStaffTypeDialog.vue`; source-based only, browser comparison and interactions blocked by missing preview samples. Typecheck/build and percussion nested check pass; tablature remains unverified.

- Guitar String data dialog native structure restored in `EditStringDataDialog.vue`; desktop diff 905,819 to 436, mobile bounds 358×332.078125 match and diff 388 (`string-data-after-diff.png`, `string-data-mobile-diff.png`). Typecheck/build pass; edit, delete, pitch and rollback unverified.

- `check-string-data.mjs`: Delete then Cancel restores six strings; frets 20 and Always open persist within parent dialog after nested OK in both. Nested Edit pitch bounds match 640×434.328125, desktop diff 436 (`string-pitch-diff.png`); actual pitch edits and parent OK persistence remain unverified.

- `check-string-persist.mjs`: nested pitch ArrowLeft/Enter changes first string to D♯4; frets 20, Always open and pitch persist after parent OK/reopen in both. Other string operations and undo unverified.

- Select instrument now uses React single-selection ChooseInstrumentsPage and native dialog; desktop diff 671,720 to 436, mobile bounds 358×812 and diff 388 (`replace-instrument-after-diff.png`, `replace-instrument-mobile-diff.png`). Typecheck/build pass; selection, accept, trait change and cancel still need behavior checks.

- Select instrument search Flute, selection, Cancel, OK and double-click acceptance pass both (`check-replace-instrument*.mjs`); parent shows Flute. New score creation regression check passes desktop/mobile. Trait selection, undo and mobile direct interaction remain unverified.

- Replace instrument mobile after desktop setup: search, Cancel and Flute OK pass both (`check-replace-instrument-mobile.mjs`). Desktop parent OK then Edit > Undo restores Classical Guitar in both (`check-replace-instrument-undo.mjs`). Direct mobile score selection and traits remain unverified.

- Playalong active/loading desktop: removed extra Vue Listening badge above workspace; moved heard notes to React statusbar position. `playalong-active-after-diff.png` 206,364 to 632 pixels; test-melody stays loading during capture, listening/controls/mobile unverified. Typecheck/build pass. Measure properties context action disabled in React fixture (`inspect-measure-properties.mjs`), dialog not compared.

- Playalong mobile listening after 30s test-melody: `playalong-active-mobile-diff.png` 2,979 pixels, measures differ (React 4, Vue 5) due asynchronous test melody; status notes and selection differ, geometry matches visually. `check-playalong-controls.mjs` verifies practice toggle, Next increments and Stop removes measure controls in both; timing and microphone path unverified.

- Calibration loading box parent corrected to React score-area: mobile bounds now both (316,511.3125) 58×217.6875, full diff 26,627 to 776 (`calibration-mobile-after-diff.png`); desktop bounds 360×108.5625 and Cancel pass both (`check-calibration-cancel.mjs`). React itself renders very narrow mobile box; following reference, not asserting usability. Listening/results and direct mobile setup unverified. Typecheck/build pass.

- Calibration listening step desktop after test-melody load: bounds both 360×132.9375; diff 2,753 (`calibration-listening-diff.png`), includes score/status differences. Skip advances step 2 to 3 and Cancel closes in both (`check-calibration-skip.mjs`). Results, repeat/use values, mobile listening remain unverified.

- Calibration result by skipping remaining steps: bounds match 360×152.9375, diff recorded in `calibration-result-diff.png`; Repeat returns to step 1 and Cancel closes both (`check-calibration-result.mjs`). Use values and mobile results remain unverified.

- Calibration Use these values after skipped result closes and persists `playalongOvertoneFilter: calibrated` plus calibration object in both (`check-calibration-use.mjs`). Actual microphone measurements and mobile result remain unverified.

- Calibration result mobile after desktop setup: bounds both 58×629.25, full-screen diff 11,765 (`calibration-result-mobile-diff.png`); Repeat and Cancel pass. Narrow reference box causes wrapping; dynamic score/status may differ. Actual microphone input remains unverified.

- Calibration mobile result clipping fixed: Vue main/workspace overflow hidden clipped box above score area, unlike React notation row. Removed clipping; `calibration-result-mobile-after-diff.png` full diff 11,765→921, dialog crop 2,579→0; Repeat/Cancel pass. Typecheck/editor build pass. Other overflow-sensitive states need regression checks.

- Overflow regression checks after calibration fix: score mobile geometry matches, diff 196 (`capture-score-mobile.mjs`); desktop viewport/panel bounds match (`capture-score.mjs`); expanded Clefs desktop diff 257, expanded Layout diff 399. Other overflow-sensitive states remain open.

- Post-overflow Style dialog desktop regression capture diff 469 (`style-overflow-regression-diff.png`); Inspector unit tests 3 pass, 5 skipped. Context-menu capture script unavailable under attempted name; no new context-menu evidence.

- Post-overflow mobile score context menu capture (`capture-context-overflow.mjs`) diff 943, same as prior mobile context capture; menu content matches. Screenshot uses desktop selection then mobile resize.

- Toolbar pointer-drag investigation (`inspect-toolbar-drag.mjs`): same playback-grip drag toward notation leaves React main order unchanged but reorders Vue. Prior assertion assumed React reorder and was invalid. Cause and expected intended behavior unresolved; no Vue change made.

- Toolbar dragging state captured (`toolbar-drag-{react,vue,diff}.png`): 243,297 pixels differ; React shows one drop marker, Vue none (`capture-toolbar-drag.mjs`). Drag presentation and post-drop order need source-level port; not fixed.

- Toolbar drag active presentation ported: reactive drag marker, dragging class and empty target row match React. Desktop active-state diff 243,297→2,547 (`toolbar-drag-after-diff.png`), marker count 1 both; typecheck/build pass. Post-drop gesture still yields different order; mobile, other docks and cancellation unverified.

- Drag marker diagnosis: both markers target main dock immediately before notation, with identical bounds x=583.671875, y=28, 3×40 (`inspect-toolbar-marker.mjs`). `moveToolBar` implementations match; React post-drop remains unchanged while Vue performs indicated reorder. Cause unproven; preserve Vue functional reorder rather than emulate unverified reference failure.

- Toolbar drag mobile after desktop load/resize: active-state diff 539 (`toolbar-drag-mobile-diff.png`), one marker in each. Add submenu navigation passes both (`check-toolbar-add.mjs`). Grip regression script failed before test: stale React host 127.0.0.1:5180; no evidence from that run.

- Corrected React IPv6 host in `check-toolbar-grip.mjs`; Move left menu and Alt+ArrowRight restore order pass both after drag-state changes. Inspector suite 3 pass, 5 skipped; skips remain uncovered.

- Toolbar drag to bottom dock: desktop active diff 595 (`toolbar-drag-bottom-diff.png`), marker present both; after drop both place playback before view in bottom dock (`capture-toolbar-drag-bottom.mjs`). Same-row discrepancy remains.

- Synthetic pointercancel during same-row toolbar drag: React commits reorder; Vue cancels and preserves order (`check-toolbar-drag-cancel.mjs`). Explicit Vue cancellation behavior retained; reference difference documented. Real touch cancellation unverified.

- Toolbar drag to note-input row: desktop active diff 621 (`toolbar-drag-top-diff.png`); both drop playback before note-input (`capture-toolbar-drag-top.mjs`). Empty-row and direct touch remain open.

- Toolbar drag to empty new row: desktop active diff 621 (`toolbar-drag-empty-diff.png`); both create top1 with playback (`capture-toolbar-drag-empty.mjs`). Direct touch and same-row mismatch remain open.

- Full `npm test` rerun after toolbar changes did not complete within 180 seconds; log reports missing `MuseScore/vtest/scores` and `beams-24.mscz`. No pass count or green result; fixture blocker remains.

- Recovered missing vtest scores from official MuseScore tag v4.7.5, commit 3654226, using sparse checkout; copied into `MuseScore/vtest/scores`. Full test rerun pending. Git metadata absent in project, so submodule initialization unavailable.

- After recovering v4.7.5 fixtures, full `npm test` exits 0: 34 files passed, 35 skipped; 184 tests passed, 1,430 skipped (231.46s). Skipped coverage remains unverified, not a pass.

- Editor e2e remained 46 skipped because `hasSubmodule` also requires `MuseScore/demos`. Recovered demos from same official v4.7.5 sparse checkout; rerun pending.

- Editor e2e enabled after demos recovery: 8 passed, 38 failed; log `/tmp/parity-e2e-demos.log`. Failures include selector timeouts, assertions and missing MusicXML/parts/MIDI fixtures; not a green suite. Recovered named fixture directories from v4.7.5 for subsequent targeted investigation; other failures remain unexplained.

- E2E triage: initial home failure expects `body.dataset.view=home`, but both React and Vue session.ts set it only on `setState`; initial value is absent. Some failures rely on `#title`, absent from current React and Vue App source. These are stale-test indicators, not proof of Vue regressions; other failures remain untriaged.

- Recovered Style QML image assets and staff preview sample files from pinned official v4.7.5 into `MuseScore/src/notationscene/...`; previous missing-asset blocker lifted locally. Vite rebuild/restart and React/Vue asset parity checks pending; sample usage still requires investigation.

- Copied recovered QML assets into both local React and Vue trees, but existing Vite servers still expose empty image URLs on Accidentals (4 images each; `capture-style-assets.mjs`, diff 925). Servers need restart before asset comparison; current screenshot does not verify loaded illustrations.

- Touching `images.ts` invalidated Vite glob cache; recovered assets load in both apps. Accidentals four PNGs loaded, desktop diff 288; Beams SVG loaded, diff 270 (`capture-style-assets.mjs`, `capture-style-beam-assets.mjs`). Editor build passes. Other illustrated states/mobile unverified.

- Recovered-asset mobile captures: Accidentals and Beams each diff 220 (`style-mobile-assets-Accidentals-diff.png`, `style-mobile-assets-Beams-diff.png`); viewport may clip illustrations, so not proof of visible image parity.

- Recovered preview sample glob refreshed in both apps. Percussion Advanced staff type desktop diff 436 (`staff-type-assets-diff.png`); nested Lines Cancel/OK passes both (`check-staff-type.mjs`). Percussion has no standard/tab preview; those remain unverified.

- Standard guitar Advanced staff type now opens with recovered sample: preview canvas 644×76 in both, desktop diff 436 (`staff-type-standard-diff.png`, `capture-staff-type-standard.mjs`). Preview content/edits and mobile remain unverified.

- Standard staff-type mobile after desktop opening/resize diff 388 (`staff-type-standard-mobile-diff.png`); preview canvas backing size 644×76 both. Direct mobile opening/preview edits remain unverified.

- Tablature Advanced staff type reached with `03-Guitar_Tablature.mscx`; preview canvas 644×121 both, desktop screenshot `staff-type-tab-diff.png`. Tab controls and mobile remain unverified.

- Tablature fret marks Letters selection checks in both, updated desktop capture diff 436 (`staff-type-tab-letters-diff.png`); persistence/rollback and other controls unverified.

- Tablature Letters persists through child OK and reopening within parent in both (`check-staff-type-tab-persist.mjs`); parent OK/save, Cancel rollback and other controls remain open.

- Tablature Letters: child Cancel rolls back subsequent Numbers change; parent OK retains Letters on reopening in both (`check-staff-type-tab-save.mjs`). Parent Cancel, undo, other controls remain open.

- Tablature staff type mobile after desktop setup/resize diff 388 (`staff-type-tab-mobile-diff.png`), preview backing canvas 644×121 both. Direct mobile open and interactions unverified.

- Full npm test after demos enabled additional suites and failed/timed out with missing `src/engraving/tests/transpose_data/undoTranspose.mscx`; earlier 184-pass run predates demos and does not cover enabled suites. Recovered pinned engraving/MusicXML/MIDI test directories; rerun pending.

- Full library suite with demos and recovered test fixtures exits 1: 8 files failed, 58 passed, 3 skipped; 489 tests failed, 791 passed, 327 skipped. Failures include MIDI import and parts reference comparisons (`/tmp/parity-tests-complete-fixtures.log`); causes untriaged. Earlier green run skipped these suites and is superseded.

- Library failure triage: `importsettings.test.ts` missing Capella fixture; recovered pinned Capella tests and focused rerun passes 4/4. `newscore.test.ts` uses Unix `find` command incompatible with Windows PATH; not yet resolved. Other failures remain untriaged.

- `newscore.test.ts` executes bare `find` via Windows child process; Git find works when invoked explicitly on forward-slash path, but PATH override attempt still failed. No application change; portable test invocation remains unresolved.

- Fixture-enabled failures traced partly to Windows Git `core.autocrlf=true`: copied reference XML had CRLF while repository blobs use LF. Normalized recovered XML/MS​CX test fixtures to LF; focused `test/links.test.ts test/parts.test.ts` run now exits 0: 4 files, 75 passed, 1 skipped. Full suite and MIDI rerun pending; no application logic changed.

- MIDI import focused suite after LF fixture normalization: 111/111 pass (`test/midiimport.test.ts`); previous failures were fixture line endings. Full suite still pending.

- Full npm test after LF normalization exceeded 600s outer limit; log reports one 60s test timeout, no summary. Focused links/parts/MIDI results stand; full suite remains unverified.

- Replaced platform-dependent `find` in `test/newscore.test.ts` with Node recursive `readdirSync`; focused suite now 49/49 passes. Test enumeration remains recursive and sorted; full suite pending.

- Typecheck passes. Full `npm test -- --maxWorkers=2` completes: 66 files passed, 1 failed, 2 skipped; 1,362 tests passed, 1 failed, 293 skipped. Remaining failure `migration.test.ts` MDL snare repitch 38→40; cause untriaged. E2E failures remain separate.

- MDL migration failure caused by CRLF in recovered vtest fixture: test uses LF-exact string replacement. Normalized recovered vtest XML to repository LF; focused migration suite 4/4 passes. Full suite rerun pending.

- Full fixture-enabled `npm test -- --maxWorkers=2` exits 0: 67 files passed, 2 skipped; 1,363 tests passed, 293 skipped. Skips remain uncovered; editor e2e still failing and visual checklist incomplete.

- E2E failure triage: selection status expects plain Soprano but receives literal font markup; note-input test waits for toolbar selector. These require React/Vue comparison before classifying as regression; no fix inferred from tests alone.

- Amazing Grace selection reference check (`check-selection-status-reference.mjs`): React status ends `Staff 1 (Soprano)`; Vue emits literal `<font face="Times New Roman"/>Soprano`. Confirmed Vue-visible discrepancy, source cause still under investigation; no fix yet.

- Selection status investigation: accessibility, Part, reader, compatibility and migration source match local React; runtime output differs despite identical fixture. Settings/migration timing or dev-server state still suspected, not established. Avoid speculative tag stripping.

- Selection status root cause: React `StatusBar` parses accessibility rich text with DOMParser; Vue displayed raw selection. Ported same parsing in `editor/App.vue`; Amazing Grace rest status now exactly matches React (`check-selection-status-reference.mjs`). Typecheck/build pass. Other selection variants unverified.

- Focused editor e2e selection test now passes after status fix: 1 passed, 45 filtered/skipped (`-t selects elements with the mouse`). Includes keyboard/range selection assertions; other e2e failures remain.

- Note input action button failed to track external action version: `useActions()` ref was discarded. Bound version in `ActionToolButton.vue`; N now sets aria-pressed true and C enters C5 on desktop/mobile in both (`check-note-entry-reference.mjs`); typecheck/build pass. Focused e2e progresses but fails later: Undo button remains disabled; separate reactivity issue uncorrected.

- Undo/redo dock also discarded action version ref. Read ref in dock render and corrected `useActions` return inference; focused note-entry/undo/delete e2e now passes (1 passed, 45 filtered). Typecheck/build pass; desktop/mobile N+C reference probe still matches. Other action consumers may discard subscriptions and remain to audit.

- User-reported selected Properties break reproduced on range selection: Measures and multi-Notation used unstyled utility/Nuxt controls, unlike React inspector classes. Restored inspector layout/button styles while preserving handlers/popovers; desktop diff 5,750→610 (`inspector-note-diff.png`), typecheck/build pass. Text section and individual note variants still require inspection.

- Individual note Head view restored from React hierarchy/native inspector controls; desktop diff 10,129→347 (`inspector-single-diff.png`), typecheck/build pass. Show more currently generic, Stem/Beam and property persistence need verification; chord combine-voice control remains to port inside Show more.

- Individual note Stem capture exposes remaining broken generic controls: desktop diff 9,088 (`inspector-stem-diff.png`); React includes chord Stemless, direction, disabled flag style and Show more. Vue currently renders generic stem/hook and omits chord. Port remains open.

- Note Stem initial controls restored (chord Stemless, direction, disabled flag style); desktop diff 9,088→347 (`inspector-stem-diff.png`). Typecheck/build pass. Show more remains generic and hook offset unported; edits/undo/mobile unverified.

- Selected note Beam initial mode/direction controls restored; desktop diff 6,266→24 (`inspector-beam-diff.png`). Typecheck/build pass. Feathered/cross-staff variants and edits/undo remain unverified and incomplete.

- Note inspector edits used numeric enum strings instead of model keys; corrected paths to `TYPE_NOTEHEAD`/`TYPE_STEM`/`TYPE_BEAM`/`TYPE_CHORD`. Hide notehead and Edit > Undo now pass in both (`check-inspector-head-undo.mjs`), desktop diff 347; typecheck/build pass. Stem/Beam edits and advanced controls remain unverified.

- Selected note Stemless change and Edit > Undo pass both (`check-inspector-stem-undo.mjs`); desktop diff 347 after undo. Direction, Beam edits, advanced/mobile remain open.

- Note Beam type second option and Edit > Undo restore Auto in both (`check-inspector-beam-undo.mjs`), desktop diff 24 after undo. Feathered/cross-staff variants remain open.

- Note Head Show more opened desktop diff 529 (`inspector-head-more-diff.png`); lower content not visible in capture and attempted `.inspector` scroll did not expose it. Generic advanced controls and combine-voice remain incomplete; no parity claim.

- Note Head Show more diagnosis: React inspector scrollHeight 923; Vue 587 (no overflow). Vue filters advanced properties by `showMore`, but notehead metadata does not mark them; advanced section empty. Needs explicit React-equivalent controls, not scrolling fix.

- Restored Head advanced controls and chord combine voice with React hierarchy; scrolled desktop diff 22,857→71 (`inspector-head-scroll-diff.png`), both scrollHeight 923. Override visual duration change/Undo passes (`check-inspector-head-more-undo.mjs`); other controls/mobile remain unverified. Typecheck/build pass.

- Stem Show more restored thickness, length, stem/flag offsets using React hierarchy. Scrolled desktop diff 10,645→161 (`inspector-stem-more-diff.png`); length 2/Undo 0 passes both (`check-inspector-stem-more-undo.mjs`). Other controls and mobile remain unverified; typecheck/build pass.

- Added conditional feathering left/right controls to Beam using React flags and bounds. Default beam edit/Undo regression passes (diff 24); feathered fixture and cross-staff states remain unverified. Typecheck/build pass.

- Playback toolbar and open MenuPopup now consume actions version instead of discarding subscription; action-state changes invalidate rendering. Note edit/Undo regression passes both, diff 24; typecheck/build pass. Live popup/playback transitions and remaining discarded subscriptions need targeted tests.

- Full e2e rerun: 36 passed, 34 failed, 4 skipped (`/tmp/parity-e2e-current.log`), including missing `basic-bend.gpx`, stale selectors and MenuPopup recursive updates. Fixed reactive template-ref array triggering recursion after action subscription; menu keyboard check/typecheck/build pass. Full e2e needs rerun and remaining failures triage.

- Correction: full e2e after ref-array change still reports MenuPopup recursive updates (36 pass/34 fail/4 skipped; `/tmp/parity-e2e-after-menu.log`). Reverted new MenuPopup action-version dependency; live open-menu updates remain unverified. Keyboard menu/typecheck/build pass; recursion root cause and full rerun remain open.

- Focused e2e reruns for panels and save still fail selector timeouts but did not reproduce MenuPopup recursion after reverting action dependency (`/tmp/e2e-menu-{one,two}.log`). Full-suite recursion status remains unverified.

- Panel tab menu used Nuxt dropdown unlike React MenuPopup; replaced with native reference popup, preserving actions and focus. Focused panels e2e now passes (`/tmp/e2e-panel-fixed.log`), typecheck/build pass. Visual recompare blocked this turn: React server unavailable on 5180; mobile and popup live updates unverified.

- Restarted React reference on IPv6; panel menu expand/collapse passes both (`check-panel-menu-ipv6.mjs`), desktop diff 84. Mobile remains unverified.

- Panel tab menu mobile 390×844 expand/collapse passes both; diff 24 (`panel-menu-mobile-diff.png`, `check-panel-menu-mobile.mjs`).

- Save/reload e2e triage: restored React master-tab IDs `title`/`clear` and initialized `body.dataset.view` on initial Vue render (score keyboard handlers depend on it). Test advances through save/reload/edit but now times out on confirmation dialog selector; dialog needs comparison. Typecheck/build pass.

- Unsaved-close confirmation replaced Nuxt modal with React native dialog/form and matching button order/return values. Full focused save/reload/Cancel/Don’t save e2e now passes (`/tmp/e2e-save-dialog.log`); typecheck/build pass. Desktop/mobile screenshot comparison remains open.

- Unsaved-close screenshots: desktop bounds 420×163.15625 both, diff 24; mobile after desktop selection/resize bounds 358×163.15625 both, diff 30 (`unsaved-confirm{,-mobile}-diff.png`). Direct mobile selection unverified.

- Home retained hidden bottom ToolBarDock unlike React; conditionally mount on score view. Home/opened scores focused e2e now passes (`/tmp/e2e-home-fixed.log`); typecheck/build pass. Existing home screenshot baseline predates change; visual regression recapture pending.

- Fresh empty Home screenshots after dock change: desktop 1280×800 and mobile 390×844 both diff 0 (`home-current-{desktop,mobile}-diff.png`); no stored-score state in these captures.

- Restored React palette type/data-property attributes and accessible notehead radio labels. Focused palette + Properties edits/Undo e2e now passes (`/tmp/e2e-inspector-current4.log`); typecheck/build pass. Attributes do not change visible layout; fresh screenshot pending.

- Fresh selected-note Head capture after metadata changes: desktop diff 24 (`inspector-single-diff.png`), mobile after desktop selection/resize diff 24 (`inspector-single-current-mobile-diff.png`). Direct mobile selection still unverified.

- Restored React `data-element` on palette cells. Focused rendered cells/search/keyboard e2e now passes (`/tmp/e2e-palette-current2.log`); typecheck/build pass. No visual styling changed.

- Restored React layout tree `data-type` metadata. Focused layout e2e now finds parts/expands staff but times out waiting for score Select All to select four part rows (`/tmp/e2e-layout-current2.log`); selection synchronization requires diagnosis. Typecheck/build pass.

- Layout model now calls `updateSelectedRows()` after reload, restoring React score-selection synchronization. Focused Select All/Escape layout e2e passes (`/tmp/e2e-layout-current3.log`); typecheck/build pass. Row-selection retention after score edits still needs verification against React.

- Expanded Layout recapture after selection synchronization: matching row labels, desktop diff 210 (`layout-expanded-diff.png`). Score selection visual/mobile comparison still pending.

- Layout Select All screenshot: four selected rows in both; desktop diff 169, mobile after desktop selection/resize diff 169 (`layout-select-all{,-mobile}-diff.png`). Direct mobile selection and row retention after edits remain open.

- Focused e2e now passes instrument replacement/instrument change (`/tmp/e2e-replace-current.log`) and Staff/Part properties context action/Undo (`/tmp/e2e-staff-current.log`); these cover named paths, not every staff control.

- Replaced generic Nuxt ConfirmDialog with React native dialog/form, preserving boolean answers and Escape. Create/save/remove score focused e2e passes (`/tmp/e2e-newscore-fixed.log`); typecheck/build pass. Remove confirmation desktop/mobile visual and restore-session-specific behavior remain unverified.

- Remove confirmation capture exposed Home reset overriding dialog heading margin. Excluded dialog descendants from reset; bounds now match 420×158.953 desktop / 358×158.953 mobile, full-screen diffs 8781→0 / 8041→16 (`remove-confirm-{1280,390}-diff.png`). Cancel verified; typecheck/build pass. Vue console logged one 404 in desktop run; resource unidentified.

- Repeat remove-confirm capture: desktop/mobile diffs 2/0; Vue logs generic 404 once but Playwright response listener recorded no failing HTTP response, so resource remains unidentified.

- Language subscriptions previously discarded reactive ref, so mounted Vue components did not rerender. `useLanguage` now forces subscribed component updates and unsubscribes on unmount; focused German translation e2e passes (`/tmp/e2e-translation-fixed.log`), typecheck/build pass. Other languages and visual comparison remain open. Template-create focused e2e also passes (`/tmp/e2e-template-current.log`).

- Current full library test run: 66 files passed, 1 failed, 2 skipped; 1362 tests passed, 1 timeout, 293 skipped (`/tmp/parity-tests-current.log`). Focused copypaste retry passes 42 tests, 42 skipped (`/tmp/parity-copypaste-retry.log`); full suite still not green. Selected-note screenshot diff 24 and menu keyboard check pass after language change.

- Full library retry with two workers timed out on Goldberg render; single-worker run passes 67 files, 1363 tests, 2 files/293 tests skipped (`/tmp/parity-tests-single-worker.log`). Skips remain uncovered; two-worker timeouts indicate load sensitivity.

- Full e2e rerun: 55 passed, 15 failed, 4 skipped (`/tmp/parity-e2e-latest.log`), improved from 36/34/4. No MenuPopup recursion reported. Missing Guitar Pro fixtures cause three errors; remaining failures require triage, including Properties, parts, dialogs, autosave and view modes.

- Restored React NoteSettings `data-view` and notehead checkbox `data-property` metadata. Focused selected Properties values e2e now passes (`/tmp/e2e-properties-values.log`); typecheck/build pass. No visual layout change.

- SearchPopup replaced Nuxt floating controls with React native score bar, live search and Enter/Escape focus restoration. Find measure/project properties Undo e2e passes (`/tmp/e2e-find-fixed.log`); typecheck/build pass. Desktop/mobile screenshots pending.

- Search popup was outside score-area flex column: desktop bounds differed drastically. Moved into React-equivalent hierarchy; desktop bounds 300,682 980×50 both, diff 41261→100; mobile bounds 75,695 90×50 both, diff 24 (`find-popup{,-mobile}-diff.png`). Find e2e/typecheck/build pass.

- Replaced ViewModeControl Nuxt dropdown with React MenuPopup and full `VIEW_MODE_ACTIONS` list. Focused e2e now advances through view modes, then fails on separate playback settings Nuxt menu (`/tmp/e2e-viewmode-fixed.log`). Typecheck/build pass; view popup screenshots pending.

- Playback settings menu now uses React MenuPopup instead of Nuxt dropdown. Full focused view-mode/fit-to-window/smooth-panning e2e passes (`/tmp/e2e-viewmode-fixed2.log`); typecheck/build pass. View and playback popup screenshot comparisons pending.

- View mode popup bounds match desktop/mobile 220×114; diffs 87/24 (`viewmode-popup{,-mobile}-diff.png`). Playback settings bounds match 220×262; diffs 110/0 (`playback-menu-current{,-mobile}-diff.png`). Named view-mode/smooth-panning e2e previously passed; submenu/touch remain open.

- Part tab context menu replaced non-opening Nuxt dropdown with React MenuPopup. Focused part Layout/staff settings/tab context e2e passes (`/tmp/e2e-part-layout-fixed.log`); part edit e2e also passed on retry (`/tmp/e2e-part-current.log`). Typecheck/build pass; popup screenshots pending.

- Master notation tab context menu bounds match desktop/mobile 220×36, diffs 78/21 (`notation-tab-menu{,-mobile}-diff.png`). Part-tab multi-item popup screenshot and direct touch remain open; focused part context e2e passes.

- Drum kit staff line used native `change` (blur) while React onChange applies on input. Switched to input; focused Customize kit context/shortcut/undo e2e passes (`/tmp/e2e-drum-fixed.log`); typecheck/build pass. Existing visual captures unchanged by event timing.

- Focused instrument rename/reorder e2e reaches drag then times out (`/tmp/e2e-layout-rename.log`); LayoutPanel.vue currently has no drag/drop handlers. Actual reorder regression, not selector failure; React drag behavior needs port and visual comparison.

- Ported React Layout row pointer drag to existing `startActiveDrag`/`moveRows`/`endActiveDrag`; focused instrument rename/reorder/Undo e2e passes (`/tmp/e2e-layout-drag-fixed.log`); typecheck/build pass. Drag screenshots, staff/system-row variants, cancellation/touch remain unverified.

- Layout instrument drag Amazing Grace: desktop during/after order matches React, diff 95 (`layout-row-drag-diff.png`). After resizing during drag mobile screenshot diff 306; transient Vue order reverted at capture but final order matches, so resize-during-drag discrepancy remains. Direct touch and staff/system variants open.

- Restored React Layout control `data-control` attributes. Focused hide/Undo/remove/add instrument e2e passes (`/tmp/e2e-layout-edit-current2.log`); typecheck/build pass. No visual change.

- Restore-session question now matches React native dialog/No/Yes semantics instead of generic confirmation. Focused autosave/restore e2e passes (`/tmp/e2e-autosave-fixed.log`); typecheck/build pass. Desktop/mobile screenshots and No/Escape paths remain unverified.

- Custom palette creation restored inline React popup, autofocus and Enter/Escape; e2e advances through create/drag/reload to cell context menu failure (`/tmp/e2e-custom-palette-fixed.log`). Typecheck/build pass. Popup screenshot and cell context menu remain open.

- Custom palette inline creation popup bounds match 275×128.375 desktop/mobile; diffs 56/24 (`custom-palette-popup{,-mobile}-diff.png`). Creation/drag/reload passed up to cell context failure; Enter/Escape still need explicit checks.

- Cell context failure diagnosed: PaletteGridView has no context handler and no cell-properties dialog; React supports editable Delete/Properties with rollback. Requires full functional port, not selector change.

- Ported palette cell context Delete/Properties and native cell properties dialog with live edits/Cancel rollback. Full focused custom palette create/drag/reload/properties/delete/drop e2e passes (`/tmp/e2e-custom-palette-fixed2.log`); typecheck/build pass. Dialog/menu screenshots and detailed rollback/edge cases pending.

- Cell properties desktop bounds 320×384.515625 both, diff 152; mobile after desktop setup/resize same bounds, diff 67 (`cell-properties{,-mobile}-diff.png`). Name change/Cancel restores original label in both. Offset/scale/checkbox and direct mobile remain unverified.

- Recovered official v4.7.5 `basic-bend.gp5`, `basic-bend.gpx`, `accent.gp` from pinned commit via git blobs. Focused viewer/editor import formats e2e passes 2 tests (`/tmp/e2e-import-fixtures.log`); editor import/save e2e passes (`/tmp/e2e-import-save-fixtures2.log`). Other missing fixtures/skips remain.

- Startup now waits for language catalog before opening URL; fixed untranslated MusicXML plural race. Restored message button values; focused MusicXML errors/No/OK/import preferences e2e passes (`/tmp/e2e-import-errors-fixed2.log`); typecheck/build pass. Existing message visuals predate startup change.

- Migration dialog ported to React native hierarchy, controls and pinned genuine migration image. Older-score migration options/remember e2e passes (`/tmp/e2e-migration-fixed.log`); typecheck/build pass. Screenshot comparison pending: React reference currently has placeholder image.

- Full e2e rerun after fixes: 70 passed, 4 skipped (`/tmp/parity-e2e-current.log`, 600.75s). Four skips are viewer-only cases instantiated for editor via `it.runIf(app === "viewer")`; no claim of editor coverage for those cases. Visual gaps remain.

- Migration desktop/mobile-after-resize bounds match exactly (590×547.71875 / 358×602.28125); diffs 6263/5243 (`migration{,-mobile}-diff.png`). Reference local React uses placeholder image, Vue uses genuine pinned image; differences not eliminated. Direct mobile and 3.6 variant remain open.

- Migration 3.6.2 (`accidental-24.mscz`): desktop and mobile-after-resize dialog bounds identical; full-screen pixel diffs 0/0 (`migration-36{,-mobile}-diff.png`). Direct mobile and 3.6 option persistence remain open.

- Cell properties X=2, Y=-3, scale=1.5, draw staff off then Cancel and reopen restores 0/0/1/on in both React and Vue (`check-cell-properties-rollback.mjs`). OK persistence and direct mobile remain open.

- Cell properties X/Y/scale/staff changes persist after OK and reopen in React and Vue (`check-cell-properties-save.mjs`); reload persistence/direct mobile remain open.

- Cell properties saved offsets/scale/staff revert to defaults on immediate reload in both React and Vue (`check-cell-properties-reload.mjs`); matching observed behavior, persistence gap remains. Delayed reload untested.

- Cell properties persist after 5-second delay and reload in React and Vue (`check-cell-properties-delayed-reload.mjs`); immediate reload can lose pending changes in both.

- Direct 390×844 migration 3.6.2 capture matches React exactly (0 pixel diff, `migration-36-direct-mobile-diff.png`), matching dialog bounds.

- Pre-3.6 migration direct 390×844: bounds match; diff 5251 (`migration-direct-mobile-diff.png`), with local reference placeholder vs genuine Vue image.

- Pre-3.6 migration controlled image comparison: replaced local React placeholder image DOM src with identical pinned asset used by Vue; desktop and mobile-after-resize full screenshots diff 0/0 (`migration-real{,-mobile}-diff.png`). Original placeholder comparisons remain documented; deployed reference image not independently verified.

- Deployed React (`https://mlx-notation.vercel.app/`) vs Vue pre-3.6 migration: HTTPS routed same score, desktop/mobile-after-resize bounds equal and full screenshot diffs 0/0 (`migration-deployed{,-mobile}-diff.png`). Genuine asset confirmed visually by exact match.

- Deployed React vs Vue migration 3.6.2 desktop/mobile-after-resize: matching bounds, full-screen diffs 0/0 (`migration-36-deployed{,-mobile}-diff.png`).

- Deployed React vs Vue palette cell properties desktop bounds match; full-screen diff 200 (`cell-properties-deployed-diff.png`); name Cancel rollback passes. Mobile deployed comparison pending.

- Deployed React vs Vue palette cell properties mobile-after-desktop-resize bounds match; full-screen diff 150 (`cell-properties-deployed-mobile-diff.png`). Direct mobile touch remains open.

- Direct 390×844 deployed React vs Vue cell properties using mouse/drag: matching bounds, full-screen diff 150 (`cell-properties-deployed-direct-mobile-diff.png`); Cancel name rollback passes. Touch remains untested.

- Deployed React/Vue migration 3.6.2: disable remap, enable Don’t ask again, OK stores matching options and reload opens score without prompt (`check-migration-36-persist.mjs`).

- Menu action reactivity: recent-scores provider previously registered actions while being evaluated, triggering action updates during menu render. Registration moved to scores watcher; MenuPopup consumes action version. Typecheck/build and focused menu e2e pass (`/tmp/menu-reactivity-e2e.log`, 1 passed); full suite/live open-menu state regression still needed.

- Full e2e after menu action reactivity: 70 passed, 4 viewer-only/editor skips (`/tmp/menu-reactivity-full-e2e.log`); no recursive-update errors. Live open-menu action state change remains unverified.

- Saved score → File > Open recent submenu displays saved entry with MenuPopup action subscription active; no page errors (`check-recent-menu.mjs`). Live action-state update still unverified.

- Synthetic action registration while saved-score recent submenu open increments both MenuPopup action-version attributes without page errors (`check-recent-menu-update.mjs`); actual enabled/checked state transition remains unverified.

- Synthetic `clear-recent` enabled→disabled registration while submenu open updates `aria-disabled=true` with no page errors (`check-recent-menu-update.mjs`); real external action transitions remain untested.

- Restore-session deployed comparison exposed missing autosave score name (dialog 18.1875px too short). Vue now lists autosaved score base names; matching bounds, desktop/mobile-after-resize full-screen diffs 10131→800 / 9612→800 (`restore-session{,-mobile}-diff.png`). Autosave Yes/No focused e2e, typecheck/build pass; Escape, multi-score and remaining 800 pixels unverified.

- Restore-session name uses React strong element; measured font/color match. Desktop/mobile-after-resize diffs 800→600; typecheck/build pass. Remaining pixels likely background/home state but not yet isolated.

- User reports broad Properties CSS defects (barlines, pedals, text, others). Audit incomplete: generic Nuxt fallback in InspectorModel and TextSection diverges from React native layouts. Started barline React-specific control hierarchy; typecheck/build pass, screenshot/interaction verification pending. Pedal, text and all other models remain open.

- Barline Properties selected Chopin barline: desktop default diff 24 and expanded diff 71 vs local React (`inspector-barline{,-more}-diff.png`). Type edit + Edit > Undo exercised both; select option DOM values differ (React index, Vue enum); selection by label needed for equivalent test. Mobile/repeat and advanced controls remain open.

- Pedal selected Chopin (`capture-inspector-pedal.mjs`): desktop diff 9073; React notation shows `Notation: TODO(port)` while Vue exposes editable generic pedal controls. Preserve Vue functionality; cannot remove controls to imitate reference. Text section also diverges heavily and requires native React hierarchy. Mobile and pedal interactions unverified.

- Text inspector font/style/size controls and collapsed Show more moved to React native structure; restored reset controls. Pedal viewport diff remains 9073 because Vue pedal controls push Text below viewport vs React TODO placeholder. Text alignment/expanded settings still use Nuxt controls; isolated text selection screenshots and edit/undo pending. Typecheck/build pass.

- Text title selected: replaced alignment Nuxt buttons with native React radio hierarchy. Desktop and mobile-after-resize diffs 4939→89 / 89 (`inspector-text{,-mobile}-diff.png`); typecheck/build pass. Text advanced/edits/Undo and direct mobile remain open.

- Text advanced scale/staff-size/line-spacing migrated to native inspector controls; removed duplicate generic text fallback. Expanded title diff 19670→19899 (worse; frame, script, style/placement ordering still divergent). Typecheck/build pass; functionality and full parity remain unverified.

- Text advanced script/frame radio controls ported to native hierarchy; expanded screenshot diff 21980, still worse due to ordering/remaining controls. Typecheck/build pass; interaction and accessibility checks pending.

- Text advanced reordered frame/line spacing/text style to React; native style/placement controls. Expanded title diff 21980→9431; typecheck/build pass. Remaining geometry, frame details, interactions unverified.

- Text advanced untitled script reset and line-spacing separator/row corrected from measured geometry; scrollHeight matches 942, desktop diff 9431→238 (`inspector-text-more-diff.png`), typecheck/build pass. Frame-selected state, controls/Undo and mobile remain open.

- Text Rectangle frame controls converted to React rows/native spin/color/reset; scrollHeight matches 1152, desktop diff 11338→231 (`inspector-text-frame-diff.png`); typecheck/build pass. Color alpha, edit/Undo, Circle/mobile remain unverified.

- Text Circle frame desktop diff 387; Rectangle mobile-after-resize diff 234, matching pre-resize scrollHeight 1152 (`inspector-text-circle-diff.png`, `inspector-text-frame-mobile-diff.png`). Direct mobile/edit undo remain unverified.

- Text Rectangle thickness 0.2→0.4 and Edit > Undo→0.2 matches React/Vue (`check-text-frame-undo.mjs`). Other text controls/undo remain open.

- Text Bold toggle and Edit > Undo restore aria-pressed false in React and Vue (`check-text-bold-undo.mjs`); other text controls remain open.

- Text Align left and Edit > Undo restore selection in React/Vue (`check-text-align-undo.mjs`); other text controls remain open.

- Text style Title→Subtitle→Undo→Title works React/Vue (`check-text-style-undo.mjs`). Other text settings remain open.

- Text Symbol size 24→18→Undo→24 passes React/Vue (`check-text-symbol-undo.mjs`).

- Text line spacing 1→1.5→Undo→1 passes React/Vue (`check-text-spacing-undo.mjs`).

- Text font size 24→20→Undo→24 passes React/Vue (`check-text-size-undo.mjs`).

- Text radio groups now use arrow-key focus handling and selected-only tab stops like React. Typecheck/build and Align left/Undo pass; keyboard traversal and undefined-value tab fallback still need verification.

- Text horizontal alignment ArrowRight moves focus center→right without changing selection in React/Vue (`check-text-radio-keyboard.mjs`). Mixed-selection tabindex fallback still open.

- Text radio mixed-value tab fallback now selects first option when `isUndefined`, matching React source; typecheck/build and single-selection keyboard check pass. Actual mixed selection unverified.

- Mixed title/composer selection: horizontal alignment radios all unchecked, first tab stop 0 in both React/Vue; desktop diff 32 (`check-text-mixed-radio.mjs`). Other mixed properties unverified.

- Pedal Text collapsed-notation default diff 64; expanded diff 10545→4872 after preserving undefined frame details like React; scrollHeight matches 1134. Remaining differences include undefined text-style placeholder/color labels and controls; typecheck/build pass.

- Pedal Text expanded: corrected disabled property opacity, mixed style placeholder, border label. Matching scrollHeight; diff 4872→300 (`inspector-pedal-text-more-diff.png`). Typecheck/build pass; control interaction/mixed selection remains open.

- Text title advanced mobile-after-resize diff 241 (`inspector-text-more-mobile-diff.png`); desktop scroll heights 942 both. Direct mobile selection remains open.

- After Text/Barline changes focused Properties e2e 2 passed (`/tmp/properties-current-e2e.log`); inspector library test 8 passed/5 skipped (`/tmp/inspector-current-test.log`). Skips not coverage; full e2e pending after changes.

- Barline expanded mobile-after-resize diff 24 (`inspector-barline-more-mobile-diff.png`). Single→Double→Undo→Single verified by option label in React/Vue (`check-barline-type-undo.mjs`). Direct mobile, repeat style and advanced edits open.

- Barline Span from 0→1→Undo→0 after reselect passes React/Vue (`check-barline-span-undo.mjs`); span-to/repeat style remain open.

- Barline Span to 0→7→Undo→0 after reselect passes React/Vue (`check-barline-span-to-undo.mjs`); repeat style and span-to-next-staff remain open.

- Barline Span to next staff false→true→Undo→false passes React/Vue (`check-barline-span-check-undo.mjs`). Repeat style still open.

- Barline end-repeat selection: Repeat style enabled/default states match React, desktop diff 24 (`inspector-barline-repeat-diff.png`). Winged click did not show checked in React; Undo deselected element, so behavior/undo comparison inconclusive (`check-barline-repeat-undo.mjs`).

- Winged repeat click leaves unwinged selected in both React and Vue under tested fixture; desktop diff 24 (`inspector-barline-winged-diff.png`). Underlying action effect and undo remain unverified.

- Pedal line-width generic Nuxt control test: 0.15→attempted 0.3 displayed 0, Undo removed selection (`check-pedal-width-undo.mjs`); edit behavior suspect, requires investigation before styling. React pedal notation is TODO, so no reference control to compare.

- Generic numeric fallback now uses InspectorSpin instead of Nuxt UInputNumber (which rounded pedal width 0.3 to 0). Vue pedal line width 0.15→0.3→Undo→0.15 passes (`check-pedal-width-undo.mjs`); typecheck/build pass. Generic models require regression coverage, pedal reference has no controls.

- Hairpin selection attempt on Chopin via coordinate sweep failed in both apps (`capture-inspector-hairpin.mjs`); no valid comparison. Need known fixture/selection strategy before generic numeric regression claim.

- Hairpin selection found at (806,501) in Chopin both apps; desktop diff 11600 (`inspector-hairpin-diff.png`). Generic Nuxt fallback vs React custom hierarchy; needs port and numeric edit/Undo.

- Hairpin Properties hierarchy ported from React. Desktop diff 11600→171 (`inspector-hairpin-diff.png`); typecheck/build pass. Interactive edits, line style, mobile and Undo unverified.

- Hairpin Thickness 0.13→0.3→Undo→0.13 passes both (`check-hairpin-thickness-undo.mjs`). Dashed selection shows Dash=3 both; desktop diff 211 (`inspector-hairpin-dashed-diff.png`). Mobile, Dash/Gap edit/Undo and other states remain open.

- Hairpin dashed mobile-after-resize diff 64 (`inspector-hairpin-dashed-mobile-diff.png`); Dash 3→4.5→Undo→3 passes both (`check-hairpin-dash-undo.mjs`). Direct mobile/touch and other controls remain open.

- Hairpin Niente circle false→true→Undo→false passes both (`check-hairpin-niente-undo.mjs`).

- Hairpin Position Above click remains unchecked in both tested apps; Undo restores/retains Below (`check-hairpin-position-undo.mjs`). Effect not established; inspect model before claiming position edit works.

- Hairpin Position maps Pid.PLACEMENT and PlacementV ABOVE=0/BELOW=1; both apps keep Below after Above click (`capture-hairpin-above.mjs`, diff 171). Shared model behavior suspected, no CSS-only fix justified.

- Full e2e after Hairpin/generic numeric changes: 70 passed, 4 skipped (`npm run test:e2e -- --maxWorkers=1`, `/tmp/post-hairpin-e2e.log`). Skips remain uncovered; initial Playwright CLI and `--workers` attempts were invalid commands, not test runs.

- Current full library run FAILED: 67 files passed, 2 failed; 1363 tests passed, 244 failed, 49 skipped (`/tmp/post-hairpin-tests.log`). Failures report missing Guitar Pro fixtures under `MuseScore/src/importexport/guitarpro/tests/data`; prior run skipped these when directory absent, but three recovered fixtures now activate suite. Restore complete pinned fixture set before rerun; do not count earlier skip as pass.

- Restored complete Guitar Pro test data (478 files) from v4.7.5 commit `3654226c2e99289916916953a98e585a3d3b315a`; normalized XML text line endings to LF. Full library rerun: 69 files passed, 1607 tests passed, 49 skipped (`/tmp/post-gp-full-tests.log`). Skips remain uncovered.

- Hairpin Allow diagonal false→true→Undo→false passes both (`check-hairpin-diagonal-undo.mjs`).

- Hairpin Height 1.2→2→Undo→1.2 passes both (`check-hairpin-height-undo.mjs`).

- Hairpin Height (new system) 0.5→2→Undo→0.5 passes both (`check-hairpin-continuous-height-undo.mjs`).

- Hairpin dashed Gap 3→4.5→Undo→3 passes both (`check-hairpin-gap-undo.mjs`; script log labels still say dash).

- Hairpin Dotted desktop diff 171 (`inspector-hairpin-dotted-diff.png`); no Undo check in this capture.

- Hairpin Normal→Dotted→Undo→Normal passes both (`check-hairpin-dotted-undo.mjs`).

- Hairpin Line style ArrowRight moves focus Normal→Dashed without selecting in both (`check-hairpin-radio-keyboard.mjs`).

- Hairpin Thickness reset after edit restores 0.13 in both (`check-hairpin-reset.mjs`).

- Hairpin default property bounding boxes, font sizes and gaps match exactly (`measure-hairpin.mjs`); remaining 171 screenshot pixels not localized.

- Hairpin default mobile-after-resize diff 132 (`inspector-hairpin-mobile-diff.png`); direct mobile selection and touch remain unverified.

- Hairpin Niente checkbox touch tap after mobile resize checks in both (`check-hairpin-touch.mjs`), diff 132. Direct mobile score selection still unverified.

- Rest coordinate sweep failed to select Rest in Chopin (`capture-inspector-rest.mjs`); resulting barline diff is not Rest evidence. Use fixture with known rest location.

- Rest selection sweep on `barline-1.mscx` also failed; resulting `inspector-rest-*` screenshots are not valid Rest evidence. Need targeted rest fixture/location.

- Rest selected at (700,227) in `barline-1.mscx`; desktop diff 2805 (`inspector-rest-diff.png`). Inspect hierarchy and port before further comparisons.

- Rest nested model path and React Beam/Rest tabs restored (`NotationSection.vue`); desktop Beam diff 2805→24 (`inspector-rest-diff.png`). Typecheck/build pass. Rest tab, edits/Undo, mobile and mixed state pending.

- Rest tab desktop diff 24 (`inspector-rest-tab-diff.png`); Align true→false→Undo→true passes both (`check-rest-align-undo.mjs`). Beam mode, mobile and mixed states remain open.

- Rest Beam No beam→Auto→Undo→No beam passes both (`check-rest-beam-undo.mjs`). First attempt selected already-active No beam, leaving Undo disabled; revised check changes value.

- Rest tab mobile-after-resize diff 24 (`inspector-rest-tab-mobile-diff.png`); direct mobile selection/touch and mixed state remain open.

- Rest Align touch tap after mobile resize toggles true→false in both (`check-rest-touch.mjs`), diff 24. Direct mobile selection remains open.

- Rest tab ArrowRight selects Rest in both; React focus remains Beam while Vue focuses Rest (`check-rest-tab-keyboard.mjs`, diff 532 with focus). React schedules focus via event currentTarget; cause of observed difference unproven. Preserve accessible Vue focus pending decision.

- Rest Beam Break beam left→Reset→Auto passes both (`check-rest-beam-reset.mjs`). Auto is property default, although selected fixture initially shows No beam.

- Rest Ctrl-click attempt selected second rest alone in both (`capture-rest-multi.mjs`); not a mixed-state comparison. Mixed state remains open.

- Rest Shift-click after changing first rest also selected second alone (`capture-rest-mixed.mjs`); mixed state still unverified.

- Rest Align now binds native `indeterminate` for enabled undefined values, matching React source; mixed-selection browser verification still unavailable (Ctrl+Shift also selected only one). Align edit/Undo regression, typecheck/build pass.

- Rest Select All attempt while checkbox focused did not yield mixed selection (`capture-rest-selectall.mjs`); mixed binding still source-verified only.

- Rest mixed Align verified: change first rest, reselect, Shift+ArrowRight selects range; both apps show unchecked indeterminate (`capture-rest-range.mjs`). Full-screen diff 540 includes range/score; isolate panel before judging.

- Mixed Rest panel crop diff 516 (`rest-range-panel-diff.png`), concentrated in Measures controls, not Rest checkbox. Investigate Measures range UI separately.

- Measures action icons switched from hardcoded wrong glyphs to React PLUS/DELETE_TANK/ARROW_UP/ARROW_DOWN. Mixed range full diff 540→430, panel 516→406; remaining insert/delete geometry/style mismatch. Typecheck/build pass.

- Measures insert popup wrapper restored React flex sizing: insert/delete bounds now match (125.5/141.5 px vs Vue 133.5/133.5 before); mixed range full diff 430→24 (`measure-measures.mjs`). Typecheck/build pass; popup interaction regression pending.

- Measures Insert popup opens both; React popup content is null, Vue offers functional actions. Full diff 1774 (`capture-measures-popup.mjs`). Preserve Vue actions; visual match cannot replace them with empty reference. Action invocation/dismissal regression pending.

- Vue Measures popup Escape closes; reopen and first action opens Number of measures dialog (`check-measures-popup-action.mjs`). Escape also cleared range selection, requiring reselect; compare dismissal semantics separately.

- Measures popup Escape: React retains range; Vue clears it (`check-measures-escape.mjs`). Nuxt content `onEscapeKeyDown` stopPropagation attempt did not fix and was reverted. Portalled focus/document key handling needs root-cause fix.

- Measures popup portal disabled so focus remains inside panel; Escape now retains range like React (diff 24, `check-measures-escape.mjs`), and first action still opens count dialog. Typecheck/build pass. Popup content remains intentionally different because React is empty.

- Measures popup outside click closes in both (`check-measures-outside.mjs`); open popup full diff 1646 after inline change, expected functional Vue content vs empty React. Popup clipping/mobile remains unverified.

- Measures popup mobile-after-resize reveals severe clipping/horizontal unstyled actions (Vue dialog 535.5px wide on 390px viewport; React empty 275px). Attempted `insp-popup` on Reka content produced 26px width; reverted. Needs native React-style popup retaining actions.

- Measures popup now uses React native wrapper/CSS with functional Vue actions. Mobile-after-resize bounds x=12 width=275 match React; height 182 vs empty React 26, intentional content difference. Escape retains range and first action opens count dialog; typecheck/build pass. Outside click and direct mobile/touch need recheck.

- Native Measures popup outside click closes both; Vue mobile-after-resize touch opens popup and first action opens count dialog (`check-measures-mobile-touch.mjs`). Direct mobile score selection remains unverified.

- Full e2e after Rest/Measures changes: 70 passed, 4 skipped (`/tmp/post-rest-measures-e2e.log`). Skips remain uncovered.

- Clef Properties React hierarchy restored; desktop diff 3922→24 (`inspector-clef-diff.png`). Typecheck/build pass. Courtesy/position edits, Undo, mixed and mobile pending.

- Clef courtesy true→false→Undo→true passes both (`check-clef-courtesy-undo.mjs`). Position Before click leaves Auto selected in both (`check-clef-position-undo.mjs`); effect/undo not established.

- Clef mobile-after-resize diff 24 (`inspector-clef-mobile-diff.png`); direct mobile selection/touch and mixed state remain open.

- Key signature selection attempts in Chopin selected ranges, not signature (`capture-inspector-keysig.mjs`); screenshots invalid for key Properties. Need higher zoom/fixture.

- Zoomed click (461,313) selects List selection in both, not confirmed Key signature; diff 24 invalid until notation model identified (`capture-keysig-zoom.mjs`).

- Zoomed list selection confirmed Key signature via notation heading in both (`inspect-keysig-zoom.mjs`); desktop diff 24. Mode/courtesy interactions and mobile pending.

- Zoomed Key signature list courtesy click: React remains checked; Vue becomes unchecked (`check-keysig-courtesy-click.mjs`, diff 211). Cause unknown; preserve Vue functionality, investigate selection/model before parity change. React uncheck/Undo test cannot proceed.

- Key signature Mode shows Unknown in both; DOM option values differ React `0`, Vue `-1`, and selecting Minor leaves Unknown in both (`check-keysig-mode-undo.mjs`, `inspect-keysig-mode.mjs`). Semantic edit/undo unresolved; option index/value handling needs investigation.

- Key Mode DOM value difference explained: React dropdown uses option indices; Vue uses actual KeyMode values (`common.tsx`, `InspectorModel.vue`). Labels map equivalently; unchanged selection remains model behavior unresolved, not evidence of value mapping defect.

- Key signature mobile-after-resize diff 24 (`inspector-keysig-mobile-diff.png`); direct mobile/touch and action semantics remain open.

- Time signature selected at zoomed (496,180); React scale/courtesy hierarchy restored, desktop diff 1950→59 (`inspector-timesig-diff.png`). Typecheck/build pass; scale/courtesy edits, Undo and mobile pending.

- Time signature horizontal scale 1→1.5→Undo→1 and courtesy true→false→Undo→true pass both (`check-timesig-scale-undo.mjs`, `check-timesig-courtesy-undo.mjs`). Vertical scale/mobile/mixed state remain open.

- Time signature vertical scale 1→1.5→Undo→1 passes both (`check-timesig-vertical-undo.mjs`); mobile-after-resize diff 59 (`inspector-timesig-mobile-diff.png`). Direct mobile/touch and mixed state remain open.

- Time signature input bounds/font family/font size match React exactly (`measure-timesig.mjs`); remaining 59 screenshot pixels unlocalized.

- Time signature horizontal scale reset 1.5→1 passes both (`check-timesig-reset.mjs`).

- Time signature courtesy touch after mobile resize toggles true→false in both (`check-timesig-touch.mjs`), diff 59. Direct mobile selection remains unverified.

- Time signature Scale ArrowUp increments 1→1.25 in both (`check-timesig-arrow.mjs`); full-screen diff 821 after focus/edit not isolated.

- Time signature ArrowUp focused panel diff 797 (`timesig-arrow-panel-diff.png`), concentrated around focused input, reset and second input; both values/focus match. Investigate transient computed styles/selection before treating as rendering tolerance.

- Fixed global input specificity overriding InspectorSpin border/outline: `.insp-spinbox input[type="text"]` restores React inner input reset. ArrowUp full diff 821→24; computed border/outline match (`measure-timesig-arrow.mjs`). Typecheck/build pass; other InspectorSpin regressions need focused checks.

- InspectorSpin specificity regression: Hairpin thickness edit/Undo diff 24, Stem length edit/Undo diff 24; Vue pedal width edit/Undo still passes (React pedal notation TODO; diff 8737). Scripts `check-hairpin-thickness-undo.mjs`, `check-inspector-stem-more-undo.mjs`, `check-pedal-width-undo.mjs`.

- InspectorSpin CSS regression captures: Text advanced desktop diff 170, Rectangle frame 94, Head advanced 24 (`capture-inspector-text-more.mjs`, `capture-inspector-text-frame.mjs`, `capture-inspector-head-more.mjs`). No full-state claim; remaining controls still open.

- Dynamics selected at zoomed (506,584); desktop diff 3536/3553 (`inspector-dynamic-diff.png`), Vue generic controls vs React custom Show more hierarchy. Port needed; interaction/mobile unverified.

- React Dynamics Show more contains alignment and frame type only; Vue generic additionally exposes frame colors/thickness/margin/radius. Port must retain those functional fields rather than delete to mimic React.

- Dynamics default hierarchy restored; desktop diff ~3536→58 (`inspector-dynamic-diff.png`). Frame detail controls retained under non-None frame, absent in React. Typecheck/build pass. Expanded states, frame detail behavior, edits/Undo and mobile pending.

- Dynamics Show more arrow corrected to SMALL_ARROW_DOWN; expanded desktop diff 64→24 (`capture-dynamic-more.mjs`). Typecheck/build pass. Non-None frame differences and behavior pending.

- Dynamics Scale 100→120→Undo→100 and Avoid barlines true→false→Undo→true pass both (`check-dynamic-scale-undo.mjs`, `check-dynamic-avoid-undo.mjs`), desktop diff 24. Expanded frame/details and mobile pending.

- Dynamics Rectangle frame selected both; Vue retains extra frame details, React shows none; desktop diff 4929 (`inspector-dynamic-frame-diff.png`). Need verify Vue detail edits/Undo and color alpha; intentional functional difference, not parity completion.

- Vue Dynamics Rectangle frame thickness 0.1→0.3→Undo→0.1 passes (`check-dynamic-frame-thickness-undo.mjs`); React lacks detail control. Other frame details/color alpha remain unverified.

- Dynamics alignment Center on notehead→Use text centering→Undo→Center passes both (`check-dynamic-align-undo.mjs`), diff 24.

- Dynamics Show more mobile-after-resize diff 24 (`inspector-dynamic-more-mobile-diff.png`); direct mobile selection/touch and frame detail states remain open.

- Dynamics Frame None→Rectangle→Undo→None passes both (`check-dynamic-frame-undo.mjs`); default expanded diff 24 after Undo.

- Dynamics Avoid barlines touch after mobile resize toggles true→false in both (`check-dynamic-touch.mjs`), diff 24. Direct mobile score selection remains open.

- Vue Dynamics frame Margin 0.2→0.5→Undo→0.2 passes (`check-dynamic-frame-margin-undo.mjs`; log labels say thickness). Other details/color alpha remain open.

- Vue Dynamics frame Corner Radius 0→5→Undo→0 passes (`check-dynamic-frame-radius-undo.mjs`; log labels say thickness). Color/alpha remain open.

- Vue Dynamics frame border color #000000→#ff0000→Undo→#000000 passes (`check-dynamic-frame-color-undo.mjs`). Native color input lacks alpha; preservation of existing alpha on edit unverified.

- Vue Dynamics frame fill color #ffffff→#ff0000→Undo→#ffffff passes (`check-dynamic-frame-fill-undo.mjs`); native RGB field does not demonstrate alpha preservation.

- Inspector color model serializes nonopaque colors as #AARRGGBB, while Dynamics native color change sends #RRGGBB (`abstractinspectormodel.ts`, `InspectorModel.vue`); likely resets alpha. Need fixture with nonopaque frame and explicit roundtrip before fixing.

- Nonopaque Dynamics fixture can use `<frameBgColor r="255" g="255" b="255" a="128"/>` per `XmlReader.readColor`; create controlled score fixture and verify save roundtrip before alpha fix.

- Created `dynamic-alpha-fixture.mscx` with 128 alpha frame background; selected intended Dynamics and RGB edit/Undo succeeds (`check-dynamic-alpha.mjs`), but UI RGB field cannot reveal alpha. Need save/export XML or model-level verification.

- Nonopaque fixture model check confirms RGB edit creates alpha 255 from original 128 (`check-alpha-model.ts`). Vue Dynamics color handler loses alpha; fix and add regression.

- Dynamics frame RGB handler now carries existing #AA prefix when present; typecheck/build and RGB edit/Undo pass. Alpha persistence after UI edit still needs exported-score verification, not inferred from RGB input.

- Dynamics alpha UI export check (`check-dynamic-alpha-export.mjs`) produced red frameBgColor a=0, not expected 128. Selected score element/fixture association or pre-edit value must be inspected before claiming preservation; model-level fixture check found a separate #80ffffff.

- Corrected fixture to selected measure 6 Dynamics. `inspect-alpha-elements.ts` confirms selected model #80ffffff; `check-dynamic-alpha-export.mjs` confirms RGB edit exports `<frameBgColor r="255" g="0" b="0" a="128"/>`. Earlier a=0 was different, transparent Dynamics and also demonstrates alpha preservation.

- `check-dynamic-alpha-export.mjs` now asserts exported alpha 128; rerun passes.

- Latest full e2e `/tmp/latest-parity-e2e.log`: 70 passed, 4 skipped. Full library `/tmp/latest-parity-library.log`: 67 files passed, 2 failed on 10s setup timeouts, 1,588 passed/68 skipped. Retry `npx vitest run test/elements.test.ts test/layoutbreak.test.ts --maxWorkers=1 --hookTimeout=60000` passes 20 tests, 18 skipped (`/tmp/latest-parity-retry.log`); full suite remains not green.

- Full library rerun with longer setup timeout `npm test -- --maxWorkers=1 --hookTimeout=60000`: 69 files passed, 1,607 tests passed, 49 skipped (`/tmp/latest-parity-library-60.log`). Default timeout run remains flaky under load; skips remain uncovered.

- Key signature source audit: both models map courtesy to Pid.SHOW_COURTESY; React PropertyCheckBox dispatches edit via `set(p, e.target.checked)`, Vue dispatches same boolean. Unchanged React checkbox remains unexplained; no evidence supports disabling Vue edit. Need inspect action result/model refresh and independent single-element fixture.

- Independent custom-keysig-1 fixture attempt `check-keysig-independent.mjs` failed to select element at guessed coordinates; no behavior conclusion. Need locate key signature via rendered score.

- Independent single-staff `custom-keysig-1.mscx` selection at (665,221): courtesy true→false in both, desktop screenshot diff 24 (`check-keysig-independent.mjs`, `inspector-keysig-diff.png`). Chopin multi-staff list-selection discrepancy remains fixture/selection-specific; Undo/mobile not yet checked.

- Single-staff custom key signature courtesy Undo restores true in both (`check-keysig-independent-undo.mjs`); post-Undo desktop diff 24.

- Single-staff key signature courtesy toggle/Undo after desktop selection and mobile resize passes both; 390×844 diff 24 (`check-keysig-independent-mobile.mjs`, `inspector-keysig-independent-mobile-diff.png`). Direct mobile score selection remains unverified.

- Remaining explicit React notation views not yet individually compared include Articulation, Tapping, Chord bracket, Image, Fermata, Tempo variants, Tuplet, Accidental, Spacer, Section break, Slur/Tie variants. Vue currently uses generic fallback for several; prioritize fixture-backed captures before changes.

- Fermata fixture `articulation-1.mscx`, click (527,514): React Position Above/Below vs Vue generic placement Type Auto/Above/Below; desktop diff 4,521 (`fermata-{react,vue,diff}.png`, `check-articulation-fixture.mjs`). Root cause generic fallback; implement reference hierarchy while preserving model semantics.

- Fermata React Position hierarchy restored; desktop diff 4,521→24 (`fermata-diff.png`). `npm run typecheck` and `npm run build:editor` pass. Edit/Undo, mobile and Auto-value preservation require verification.

- Fermata Below→Above→Undo→Below passes both apps; post-Undo desktop diff 24 (`check-fermata-undo.mjs`). Mobile and mixed states remain open.

- Fermata Below→Above→Undo after desktop selection/mobile resize passes both; 390×844 diff 24 (`check-fermata-mobile.mjs`, `fermata-mobile-diff.png`). Direct mobile selection/touch remains open.

- Articulation accent fixture (`articulation-12.mscx`, click 704,202): React Placement reset and spaced radios vs Vue generic lowercase placement; desktop diff 3,105 (`articulation12-{react,vue,diff}.png`, `check-articulation12.mjs`). Fix hierarchy using React Auto=2, Above=0, Below=1.

- Articulation/Tapping Placement hierarchy now mirrors React; Articulation desktop diff 3,105→24 (`articulation12-diff.png`). Typecheck/build pass. Tapping fixture, edits/Undo, mobile remain unverified.

- Articulation Above→Below→Undo→Above passes both; desktop post-Undo diff 24 (`check-articulation-undo.mjs`). Auto, mobile, Tapping remain open.

- Articulation Above→Below→Undo after desktop selection/mobile resize passes both; 390×844 diff 24 (`check-articulation-mobile.mjs`, `articulation-mobile-diff.png`). Direct mobile touch remains open.

- Tapping fixture `MuseScore/src/importexport/guitarpro/tests/data/tap-slap-pop.gp5-ref.mscx`, click (669,212): matching Placement hierarchy; desktop diff 24 (`check-tapping.mjs`, `tapping-diff.png`). Interactions/mobile remain open.

- Tapping Above→Below→Undo→Above passes both; desktop diff 24 (`check-tapping-undo.mjs`). Mobile, Auto and reset remain unverified.

- Tapping edit/Undo after desktop selection/mobile resize passes both; 390×844 diff 24 (`check-tapping-mobile.mjs`, `tapping-mobile-diff.png`). Direct mobile selection/touch unverified.

- Articulation Above→Auto→Undo→Above passes both; desktop diff 24 (`check-articulation-auto.mjs`).

- Accidental fixture `accidental-1.mscx`, click (478,286): desktop diff 3,519 (`check-accidental.mjs`, `accidental-diff.png`); React uses bracket icons/reset and Small accidental checkbox, Vue generic fallback exposes extra stacking offset. Preserve Vue-only functionality while restoring reference controls.

- Accidental reference bracket/checkbox hierarchy restored, stacking offset retained; desktop diff 3,519→352 (`accidental-diff.png`). Typecheck/build pass; edit/Undo, stacking control and mobile pending.

- Accidental None→Parentheses→Undo→None passes both (`check-accidental-undo.mjs`), post-Undo diff 352 due retained extra control. Checkbox/stacking/mobile pending.

- Accidental Small false→true→Undo→false passes both (`check-accidental-small.mjs`); post-Undo diff 352. Vue-only stacking edit/Undo and mobile pending.

- Vue retained accidental stacking offset 0→2→Undo→0 passes (`check-accidental-stacking.mjs`). Mobile still open.

- Accidental bracket edit/Undo after desktop selection/mobile resize passes both; 390×844 diff 352 from retained extra control (`check-accidental-mobile.mjs`, `accidental-mobile-diff.png`). Direct mobile touch unverified.

- Tuplet Properties fixture `tuplets-1.mscx`, click (640,372): React native direction/number/bracket radios and reset vs generic Vue controls; desktop diff 9,277 (`check-tuplet-property.mjs`, `tuplet-property-diff.png`). Fix root hierarchy and verify edits.

- Tuplet reference radio/spin hierarchy restored; desktop diff 9,277→222 (`tuplet-property-diff.png`). Typecheck/build pass; inspect residual styles and verify interactions, mobile, translated contexts.

- Tuplet residual icon pixels caused missing React `insp-icon` radio class; corrected tuplets and accidentals. Tuplet diff 222→24, accidental 352→273 (retained extra control); typecheck/build pass.

- Tuplet Number→Ratio→Undo→Number passes both; desktop diff 24 (`check-tuplet-property-undo.mjs`). Other controls/mobile/translated contexts pending.

- Tuplet Auto→Bracket→Undo→Auto passes both; desktop diff 24 (`check-tuplet-bracket.mjs`).

- Tuplet Direction Auto→Down→Undo→Auto passes both; desktop diff 24 (`check-tuplet-direction.mjs`).

- Tuplet line thickness 0.1→0.3→Undo→0.1 passes both; desktop diff 24 (`check-tuplet-thickness.mjs`).

- Tuplet Number→Ratio→Undo after desktop selection/mobile resize passes both; 390×844 diff 24 (`check-tuplet-property-mobile.mjs`, `tuplet-mobile-diff.png`). Direct mobile touch and translated option contexts remain open.

- Tuplet option disambiguation now follows React model (`direction`, `tuplet number type`, `tuplet bracket type`); English desktop diff remains 24, typecheck/build pass. Actual translated browser capture remains open.

- German Tuplet desktop capture (`check-tuplet-german.mjs`): notation texts match; full-screen diff 462, concentrated in lower status bar and tab close, not Tuplet panel (`tuplet-german-diff.png`). Translated interaction and mobile remain open.

- German full-screen residual near status bar: ConcertPitchControl source structures match, but Vue enabled/checked calculation lacks React `v.hasScore` guard; current score loaded, so guard does not explain screenshot. Need geometry/computed-style measurements before changes.

- German status discrepancy: Vue cached translated action title in computed without reactive language dependency; React rendered title each update. `ConcertPitchControl.vue` now evaluates title during render. German Tuplet full-screen diff 462→24; typecheck/build pass. Runtime language switch still needs interaction check.

- Runtime English→German Preferences switch updates Concert pitch label in both (`check-language-switch.mjs`). Screenshot diff 14,303 with Preferences open; dialog differences require separate investigation and may include transient focus/state.

- Preferences-open switch diff traced to Vue inspector remaining English after runtime language change while React labels update (`check-language-switch.mjs`); InspectorModel and NotationSection do not subscribe to language. Other toolbar/panel labels also differ. Fix subscribers and verify model-generated labels separately.

- InspectorModel/NotationSection subscribe to language changes; runtime Tuplet labels now match React, full Preferences-open diff 14,303→3,291 (`check-language-switch.mjs`). Typecheck/build pass. Remaining toolbar/general/model title stale states need diagnosis.

- Runtime language residual traced partly to computed translation caches: `ViewToolBar.vue` fitOptions and `PanelDock.vue` tabItems depend on state but not language; `useLanguage()` force-update does not invalidate computed caches. Need reactive language dependency; inspect actual tab rendering and toolbar before changes.

- Language version now reactive inside editor `qtrc`/`webtr`, invalidating computed translation caches without changing library translator. Runtime English→German Preferences-open diff 3,291→25 (`check-language-switch.mjs`); typecheck/build pass. Other language/RTL and switch-back remain unverified.

- Runtime English→German→system English switch returns Concert pitch and Tuplet labels in both; Preferences-open diff 25 (`check-language-back.mjs`). RTL and other views remain open.

- Runtime English→Arabic Preferences-open capture matches representative Tuplet text in both; full-screen diff 44 (`check-language-arabic.mjs`, `language-arabic-diff.png`). This tests one RTL state only; interaction and other pages remain open.

- Slur fixture `slurs-1.mscx`, click (525,313): React Style icon radios/reset and Position vs Vue generic line Style/direction; desktop diff 5,564 (`check-slur-property.mjs`, `slur-property-diff.png`). Shared tie variants require fixture checks.

- Slur/tie family reference hierarchy restored with conditional placement/min length; Slur desktop diff 5,564→24. Typecheck/build pass. Style/position edits, tie variants, mobile remain unverified.

- Slur Normal→Dashed→Undo→Normal passes both; desktop diff 24 (`check-slur-style.mjs`).

- Slur Position Auto→Below→Undo→Auto passes both (`check-slur-position.mjs`); desktop diff 24.

- Slur style edit/Undo after desktop selection/mobile resize passes both; 390×844 diff 24 (`check-slur-mobile.mjs`, `slur-mobile-diff.png`). Direct mobile touch unverified.

- Tie fixture `tie-1.mscx`, click (584,323): conditional Tie placement hierarchy matches React, desktop diff 24 (`check-tie-property.mjs`, `tie-property-diff.png`). Edits/mobile/other variants remain open.

- Tie placement Auto→Inside→Undo→Auto passes both; desktop diff 24 (`check-tie-placement.mjs`).

- Tie placement edit/Undo after desktop selection/mobile resize passes both; 390×844 diff 24 (`check-tie-mobile.mjs`, `tie-mobile-diff.png`). Direct mobile touch remains open.

- Laissez vibrer fixture `importTie1_ref.mscx` loaded, but attempted selection missed element (`check-lv-property.mjs`). Need zoom/locate before asserting conditional controls.

- Laissez vibrer zoom attempt (`lv-zoom-react.png`) moved score outside viewport; no comparison. Locate via score coordinates/scroll or alternate fixture.

- Laissez vibrer fixture final note located at (925,263), but nearby (930,266) misses tie; zoom/pan or programmatic geometry needed. No parity claim.

- Selecting final note before toolbar zoom still moves score offscreen in React (`lv-zoom-selected-react.png`); fixture selection remains unresolved.

- Ctrl-wheel zoom centered on final note enables Laissez vibrer selection (960,355 at 1600- Ctrl-wheel zoom centered on final note enables Laissez vibrer selection (960,355 at 1600%); non-SMuFL conditional Style, placement and Minimum length match, desktop diff 24 (`check-lv-wheel.mjs`, `lv-property-diff.png`). Edit/Undo, SMuFL variant, mobile open.
- Laissez vibrer Minimum length 2→3→Undo→2 passes both; desktop diff 24 (`check-lv-length.mjs`).
- Laissez vibrer placement Auto→Inside→Undo→Auto passes both; desktop diff 24 (`check-lv-placement.mjs`).
- Laissez vibrer mobile-after-resize placement click selects Inside in both; after Undo/reselect both have no checked option (`check-lv-mobile.mjs`), full-screen diff 494. Reselection after resize/zoom may miss original element; Undo not established for this sequence. Desktop Undo verified separately.
- SMuFL Laissez vibrer controlled fixture (`lv-smufl-fixture.mscx`) hides Style/Minimum length in both; desktop diff 24 (`check-lv-smufl.mjs`, `lv-smufl-diff.png`). Edits/mobile remain unverified.
- Section break `mmrest-11.mscx` click (1108,339): generic Vue controls/order differ from React, desktop diff 4,104 (`check-sectionbreak.mjs`, `sectionbreak-diff.png`). Restore hierarchy and invert courtesy mapping as React.
- Section break reference hierarchy restored with courtesy inversion and indeterminate binding; desktop diff 4,104→24 (`sectionbreak-diff.png`). Typecheck/build pass; edits/Undo, mixed and mobile pending.
- Section break Hide courtesy true→false→Undo→true matches both; desktop diff 24 (`check-sectionbreak-courtesy.mjs`).
- Section break Pause 3→2→Undo→3 passes both; desktop diff 24 (`check-sectionbreak-pause.mjs`).
- Section break courtesy toggle/Undo after desktop selection/mobile resize passes both; 390×844 diff 24 (`check-sectionbreak-mobile.mjs`, `sectionbreak-mobile-diff.png`). Direct mobile touch unverified.
- Spacer fixture `system-4.mscx` click (569,245): React Height/reset vs generic Vue spacer Height; desktop diff 416 (`check-spacer.mjs`, `spacer-diff.png`). Fix hierarchy; edit/Undo pending.
- Spacer Height hierarchy restored; desktop diff 416→24 (`spacer-diff.png`). Typecheck/build pass; edit/Undo and mobile pending.
- Spacer Height 6.4→5→Undo→6.4 passes both; desktop diff 24 (`check-spacer-undo.mjs`).
- Spacer Height edit/Undo after desktop selection/mobile resize passes both; 390×844 diff 24 (`check-spacer-mobile.mjs`, `spacer-mobile-diff.png`). Direct mobile touch unverified.
- Image fixture `image-1.mscx` references external images not present in bare MSCX route; screenshot shows no visible image and selection attempt fails. Need MSCZ with embedded images or supply image store before Properties comparison.
- `MuseScore/demos/Reunion.mscz` contains two Image elements and embedded PNG (extensionless); candidate real fixture for Image Properties, locate images visually and compare.
- Reunion embedded images occur on notes near end of score; initial full-page click missed (`check-reunion-image.mjs`). Use score geometry/zoom to locate; no Image parity conclusion.
- Reunion image appears around measure 22, not final system; centered zoom at (840,600) inspected wrong system (`reunion-zoom-react.png`). Locate correct measure before Image comparison.
- Reunion measure-22 zoom produced note selection (not Image), diff 24 (`check-reunion-zoom.mjs`); image location still unresolved.
- Further Reunion zoom still selects notation, not embedded image (`reunion-imagezoom-react.png`); defer until image geometry can be derived reliably.
- Full e2e after language and recent inspector changes: 70 passed, 4 skipped (`/tmp/parity-post-i18n-e2e.log`). Skips remain uncovered; library rerun pending after latest changes.
- Post-i18n library run: 68 files passed, 1 failed; 1,606 passed, 49 skipped, Goldberg render exceeded 60s (`/tmp/parity-post-i18n-library.log`). Focused retry with 180s test timeout: 7 passed, 7 skipped (`/tmp/parity-rendering-retry.log`); full suite not green on that run.
- Post-i18n full library retry with 180s test timeout: 69 files passed, 1,607 passed, 49 skipped (`/tmp/parity-post-i18n-library-180.log`). Skips remain uncovered.
- Current `npm run typecheck` and `npm run build:editor` passed (`/tmp/parity-current-typecheck.log`, `/tmp/parity-current-build.log`).
- Verbose e2e confirms four skipped editor variants: viewer drop target, viewer playback cursor, continuous fit-to-window, and `applyMuseEncoreViewer` embedding (`/tmp/parity-e2e-verbose.log`). Corresponding editor-specific coverage must not be inferred from these skips.
- Library skips include explicit Guitar Pro import cases and fixture-conditional suites; exact 49-item breakdown not yet established. `vitest list --json` did not produce redirected output in this shell.
- Full library verbose rerun passed 1,607, skipped 49; exact skipped names saved in `/tmp/parity-library-skips.log` (including 10 MIDI reference exports, MusicXML, Guitar Pro, parts and other cases). Skips remain uncovered.
- Accidental mobile-after-resize after icon fix: bracket None→Parentheses→Undo→None matches React and Vue; diff 273 (`check-accidental-mobile.mjs`, `/tmp/parity-accidental-mobile-current.log`). Vue retains functional stacking offset absent in React. Direct mobile score selection still unverified.
- Direct 390×844 accidental selection attempt used desktop coordinates outside viewport and failed; screenshot `accidental-direct-before-react.png` shows score shrunk to ~66px. Need mobile zoom before touch selection; no direct-touch parity claim.
- Direct mobile viewport zoom and mouse selection at (350,522) selects accidental in both; bracket None→Parentheses matches, but existing desktop reselection step selects nothing after Undo in both, so direct-mobile Undo unverified (`check-accidental-direct.mjs`, diff 494). Mouse events, not touch.
- Mobile-start zoom/mouse accidental selection and mobile reselection after Undo now match: None→Parentheses→Undo→None, diff 273 (`check-accidental-direct.mjs`, `/tmp/accidental-direct-undo.log`). Touch remains unverified.
- Mobile-start accidental touch selection, Parentheses tap, Undo and touch reselection: None→Parentheses→None in both, diff 273 (`check-accidental-direct-touch.mjs`, `/tmp/accidental-direct-touch.log`). Zoom used Ctrl-wheel, not pinch.
- Laissez vibrer mobile Undo clears selection in both; screenshot `lv-mobile-undo-before-react.png` shows 1600% viewport no longer contains target. Previous empty checked state is selection loss, not evidence of property value; geometry-based reselection still needed (`check-lv-mobile-undo.mjs`).
- Source inspection identifies Tempo native React `insp-column`/checkbox/SpinBox hierarchy versus Vue generic path and `UInputNumber` (`NotationViews.tsx:385`, `InspectorModel.vue:236`); likely visual discrepancy, requires fixture-backed capture before correction. Candidate `system-1.mscx`.
- Tempo fixture `system-1.mscx` (660,272): both select Tempo; desktop diff 13,756 (`tempo-property-{react,vue,diff}.png`, `check-tempo-property.mjs`). Vue generic checkbox hierarchy visibly broken; compare disabled/enabled override and fix with native Inspector controls.
- Tempo native checkbox and conditional InspectorSpin hierarchy restored in `InspectorModel.vue`; desktop default diff 13,756→24 (`check-tempo-property.mjs`, `/tmp/tempo-property-after.log`). Typecheck passes. Override edit/Undo, mixed and mobile states still need verification.
- Tempo override: uncheck Follow, 80→100→Undo→80 matches both; desktop diff 24 (`check-tempo-override.mjs`, `/tmp/tempo-override-undo.log`). Editor build passes (`/tmp/tempo-build.log`). Mobile/mixed and other Tempo variants remain open.
- Tempo mobile-after-resize: Follow off, override 80→100→Undo→80 matches both; diff 24 (`check-tempo-override-mobile.mjs`, `/tmp/tempo-override-mobile.log`). Score selection/reselection at desktop; direct mobile touch still open.
- Post-Tempo focused inspector suite: 8 passed, 5 skipped (`/tmp/tempo-inspector-test.log`); full suite results predate Tempo change.
- Attempted controlled `<type>aTempo</type>` fixture (`tempo-atempo-fixture.mscx`); both still expose Tempo section, diff 24. Variant not proven: likely type reset during read; do not count as A tempo coverage.
- Moving `<type>aTempo</type>` after text still yields Tempo section in both (`/tmp/tempo-atempo-after.log`); subtype fixture remains inconclusive.
- ChordBracket synthetic fixture inserted in first chord of `system-1.mscx`; selected Tempo instead and bracket not visible in initial capture. Need multi-note chord fixture and correct geometry before comparison.
- Controlled multi-note ChordBracket fixture selected at (463,440): desktop baseline diff 7,519 (`chord-bracket-{react,vue,diff}.png`, `check-chord-bracket.mjs`). Generic Vue control hierarchy/labels differ; native React placement/hooks/spin hierarchy needed.
- ChordBracket native placement/hooks radio groups and Hook length InspectorSpin restored; desktop diff 7,519→24 (`check-chord-bracket.mjs`, `/tmp/chord-bracket-after.log`). Typecheck passes; edit/Undo, non-bracket variant and mobile pending.
- ChordBracket Hooks Both→Above→Undo→Both matches both; desktop diff 24 (`check-chord-bracket-undo.mjs`, `/tmp/chord-bracket-undo.log`). Editor build passes (`/tmp/chord-bracket-build.log`). Placement, length, mobile and non-bracket variant pending.
- ChordBracket mobile-after-resize Hooks Both→Above→Undo→Both matches both; diff 24 (`check-chord-bracket-mobile.mjs`, `/tmp/chord-bracket-mobile.log`). Score selection/reselection desktop; direct mobile touch pending.
- ChordBracket Hook length 0.7→2→Undo→0.7 matches both, desktop diff 24 (`check-chord-bracket-length.mjs`, `/tmp/chord-bracket-length.log`).
- ChordBracket Placement Left→Right→Undo→Left matches both, desktop diff 24 (`check-chord-bracket-placement.mjs`, `/tmp/chord-bracket-placement.log`).
- ChordBracket non-bracket flag arises from selected arpeggio type, not ordinary ChordBracket constructor; synthetic fixture does not cover it. Preserve as open.
- Normal Arpeggio `chord-layout-12.mscx` (463,550): both show only General, desktop diff 24 (`check-arpeggio-property.mjs`, `/tmp/arpeggio-property.log`). Mixed bracket/arpeggio selection remains unverified.
- Incidental Lyrics selection in `chord-layout-12.mscx` showed React `Notation: TODO(port)` vs Vue empty notation content, full-screen diff 10,654 (`/tmp/arpeggio-property.log` overwritten by later run; reproduce by (463,440)). React TODO is not functional parity; compare text and section geometry before deciding whether placeholder should appear.
- Lyrics empty-notation fallback now matches React `insp-hint` without hiding nonempty Vue properties; desktop diff 10,654→24 (`check-lyrics-property.mjs`, `/tmp/lyrics-property-after.log`). Typecheck passes; Text functionality and mobile need regression checks.
- Lyrics mobile-after-resize default diff 24 (`check-lyrics-mobile.mjs`, `/tmp/lyrics-mobile.log`); editor build passes (`/tmp/lyrics-build.log`). Direct mobile selection and text edits remain open.
- Lyrics Text Size 11→20→Undo→11 matches both, desktop diff 24 (`check-lyrics-size-undo.mjs`, `/tmp/lyrics-size-undo.log`).
- Synthetic embedded PNG MSCZ (`image-fixture.mscz`) still renders no visible image in React; first selection attempt misses. Container/image-store path or decoding needs investigation; no Image parity claim.
- Image fixture fixed: store lookup requires 32-char MD4 basename; embedded Reunion PNG hash `81b117335547a98751fd5bc61c677b86.png`. Selection (540,320) works in both; desktop baseline diff 3,334, Vue duplicates generic fields (`check-image-embedded.mjs`, `/tmp/image-embedded-hash.log`). Native hierarchy fix pending.
- Image native spin/checkbox hierarchy replaces duplicated generic controls; desktop diff 3,334→219 (`check-image-embedded.mjs`, `/tmp/image-embedded-after.log`). Typecheck passes. Verify residual pixels, image edits/Undo, frame and mobile before completion.
- Image residual 219 pixels localized to disabled Scale to frame size label; applying native disabled class reduces desktop diff to 24 (`/tmp/image-embedded-final.log`). Interactions/mobile still pending.
- Image locked height 3.9→5 adjusts width 7.65→9.81; Undo restores both in React and Vue, desktop diff 24 (`check-image-size-undo.mjs`, `/tmp/image-size-undo.log`). Typecheck and editor build pass (`/tmp/image-final-typecheck.log`, `/tmp/image-build.log`). Mobile, frame, units and unlocked state pending.
- Image mobile-after-resize locked resize/Undo matches both (height 3.9→5→3.9, width 7.65→9.81→7.65), diff 24 (`check-image-mobile.mjs`, `/tmp/image-mobile.log`). Score selection at desktop; direct touch unverified.
- Image unlocked resize: height 3.9→5→Undo→3.9 while width stays 7.65 in both; diff 24 (`check-image-unlocked.mjs`, `/tmp/image-unlocked.log`). Lock toggle Undo itself not checked.
- Image unit switch staff spaces→mm and Undo matches both (3.9→6.88→3.9), desktop diff 24 (`check-image-units.mjs`, `/tmp/image-units.log`).
- Framed-image fixture derived from `parts_data/part-image-parts.mscx` with valid embedded PNG (`image-frame-fixture.mscz`); initial (540,320) click missed. Frame spans x≈625–953 y≈193–317 in reference, image white on white; locate via selection before testing Scale to frame size.
- Framed image selection (650,220) matches, desktop diff 24; Scale to frame size enabled false→true→Undo→false in both (`check-image-frame-undo.mjs`, `/tmp/image-frame-undo.log`).
- Framed Image mobile-after-resize Scale to frame size false→true→Undo→false matches both, diff 24 (`check-image-frame-mobile.mjs`, `/tmp/image-frame-mobile.log`). Direct mobile selection not tested.
- Post-Tempo/ChordBracket/Lyrics/Image full e2e: 70 passed, 4 skipped (`/tmp/parity-post-image-e2e.log`); full library run predates these UI changes.
- Post-Image full library: 69 files passed, 1,607 passed, 49 skipped with 180s test timeout (`/tmp/parity-post-image-library.log`). Skips remain uncovered.
- Hammer-on/pull-off `midirenderer_data/hammer_on_pull_off.mscx` (700,234) selects line in both; desktop default diff 24 (`check-hammer-property.mjs`, `/tmp/hammer-property.log`). Style/Position edits and mobile remain open; (700,212) selects text instead.
- Hammer-on/pull-off Position Auto→Above→Undo→Auto matches both; desktop diff 24 (`check-hammer-undo.mjs`, `/tmp/hammer-undo.log`).
- Hammer-on/pull-off mobile-after-resize Position Auto→Above→Undo→Auto matches both, diff 24 (`check-hammer-mobile.mjs`, `/tmp/hammer-mobile.log`); direct touch unverified.
- Partial tie candidate `partialTieList-ref.mscx` loaded; initial click missed tiny score (`articulation-fixture-react.png`). Zoom and distinguish tie from volta before comparison.
- Partial tie zoom (588%) located long curve, but click (700,344) missed (`partialtie-zoom-react.png`, `/tmp/partialtie-zoom.log`); selection unresolved.
- Partial tie candidate zoom click (700,338) selects Tie in both, desktop diff 24 (`/tmp/partialtie-selected.log`); because fixture also contains ordinary ties, selected subtype is unproven. Need target incoming partial tie by measure geometry.
- Partial tie incoming in third measure selected at zoom (842,329): both report Partial tie and Tie (partial) controls; desktop diff 24 (`check-partialtie-property.mjs`, `/tmp/partialtie-third-selected.log`). Edit/Undo and mobile remain open.
- Incoming partial tie Position Auto→Above→Undo→Auto matches both, desktop diff 24 (`check-partialtie-undo.mjs`, `/tmp/partialtie-undo.log`).
- Partial tie mobile-after-resize Position click matches, but Undo clears selection and desktop-coordinate reselection misses in both; diff 494 (`check-partialtie-mobile.mjs`, `/tmp/partialtie-mobile.log`). Restored value unverified in mobile flow; desktop Undo passed.
- Partial tie after mobile resize pans on Undo; screenshot `partialtie-reselect-react.png` locates tie at (350,329). Reselection there confirms Auto→Above→Undo→Auto in both; mobile-after-resize diff 24 (`/tmp/partialtie-mobile-fixed.log`). Direct mobile touch remains open.
- Laissez vibrer after resize/Undo at 1600% pans target fully offscreen even after desktop resize (`lv-reselect-react.png`); unlike partial tie, no visible target for reselection. Need zoom out/recenter; mobile restoration remains unverified.
- Laissez vibrer post-Undo Ctrl-wheel zoom-out recenters page at 29% (`lv-zoomout-react.png`), but old click misses. Need rezoom target at visible last note; no restored-value claim.
- Laissez vibrer mobile-after-resize Undo verified by zoom-out/rezoom and reselection (692,394): Auto→Inside→Undo→Auto both; diff 24 (`check-lv-mobile-reselect.mjs`, `/tmp/lv-mobile-fixed.log`). Direct touch and SMuFL mobile remain open.
- SMuFL Laissez vibrer mobile-after-resize placement Auto→Inside→Undo→Auto matches both; diff 24 (`check-lv-smufl-mobile.mjs`, `/tmp/lv-smufl-mobile.log`). Selection/reselection desktop after recenter; direct mobile touch remains open.
- Chopin courtesy discrepancy reproduced: List selection, React true→true, Vue true→false, diff 211 (`/tmp/keysig-current.log`). Single-staff toggle/Undo already matches. Need determine linked multi-staff model semantics before altering Vue.
- Chopin list checkbox React remains checked, not indeterminate or disabled after click; both expose generic Undo menu (`check-keysig-list-menu.mjs`, `/tmp/keysig-list-menu.log`). React controlled checkbox source passes event checked to model; difference likely model/update semantics, not CSS. Do not disable working Vue behavior.
- Key signature `inspectorPropertyChanges` delegates to PropertyItem model in both ports; Vue and React KeySignature settings definitions agree. Linked-score edit application or refresh divergence still needs deeper trace; no CSS change warranted.
- Key signature export menu accessible after click (`check-keysig-export-menu.mjs`); next compare saved MSCX courtesy tags to distinguish React stale UI from actual model change. No semantic conclusion yet.
- Chopin after list courtesy click: exported React and Vue MSCX contain no `<showCourtesySig>0</showCourtesySig>` (`check-keysig-list-export.mjs`, `/tmp/keysig-list-export.log`). Vue checkbox changed but serialized model apparently unchanged; transient UI/model refresh divergence, not proof of actual score edit. Investigate linked elements/undo before modifying.
- Chopin multi-staff courtesy reselection resets Vue false→true, React remains true; post-reselection diff 24 (`check-keysig-list-reselect.mjs`, `/tmp/keysig-list-reselect.log`). Confirms transient Vue UI discrepancy in tested flow; no saved change observed. Investigate refresh on no-op changes.
- Tested nextTick checkbox synchronization; Chopin still false (diff 211), single-staff edit/Undo still passes. Reverted ineffective change; model refresh, not DOM-only synchronization, needs investigation (`/tmp/keysig-courtesy-fixed.log`, `/tmp/keysig-independent-fixed.log`).
- PropertyItem returns computed changes without mutating value; `applyInspectorChanges` returns false for empty changes. Need instrument returned changes for Chopin selection to establish whether scoreChanged fires and whether regenerated inspector model differs from score before modifying generic refresh.
- Temporary instrumentation showed Chopin courtesy click produces two InspectorChange entries in Vue (`/tmp/keysig-debug.log`); debug logging removed. Applied linked changes/selection refresh require deeper inspection; not an empty-change path.
- Courtesy change applies via `EngravingObject.undoChangeProperty` with early equality check and linked propagation; two inspector entries may interact with generated linked key signatures. Further runtime identity/value tracing needed; no speculative UI patch.
- Runtime trace: both selected key signatures initially generated=true, tracks 0/4, courtesy=true; after requested false both report generated=false but courtesy=true (`/tmp/keysig-values.log`). Temporary logs removed. Layout/generated key handling causes no-op despite UI transient false; compare reference before any DOM changes.
- Root cause: `KeySig.setProperty(SHOW_COURTESY)` rejects generated signatures (`src/engraving/dom/keysig.ts:198`), then undo machinery clears generated flag; Inspector snapshot briefly shows requested false though score remains true. Preserve core semantics; investigate refresh after rejected set, not forced visual value.
- Inspector `inspectorSections()` reloads properties on scoreVersion, but scoreChanged may occur before reactive rendering while underlying selected generated objects/layout replace; need inspect timing and selected elements after apply. Avoid generic refresh until evidenced.
- Vue virtual DOM may not rewrite native checkbox when model remains true across render (old/new prop equal), despite browser toggling it; prior nextTick attempt failed. Any fix must confirm actual refreshed model and preserve keyboard focus.
- Instrumented `inspectorSections`: refreshed `hasToShowCourtesy.value` remains true after click (`/tmp/keysig-sections.log`); native checkbox remains false because Vue sees unchanged bound prop. Debug removed. Earlier nextTick failed because closure held old props; synchronize with refreshed model or controlled checkbox after update.
- Fixed courtesy checkbox reconciliation in `InspectorModel.vue`: after score update and Vue nextTick read refreshed props, preserving focus. Chopin generated list click now true in both, diff 211→24 (`/tmp/keysig-courtesy-new.log`); single-staff toggle/Undo remains true→false→true, diff 24 (`/tmp/keysig-independent-new.log`). `npm run typecheck` and `npm run build:editor` pass (`/tmp/keysig-typecheck.log`, `/tmp/keysig-build.log`). Mobile and keyboard regression remain open.
- Courtesy regression: single-staff mobile-after-resize toggle/Undo matches both, diff 24 (`/tmp/keysig-mobile-new.log`); generated Chopin list keyboard Space retains focus and checked state in both, diff 24 (`check-keysig-keyboard.mjs`, `/tmp/keysig-keyboard.log`). Direct mobile score selection remains unverified.
- Post-courtesy `npm run test:e2e`: 70 passed, 4 skipped (`/tmp/keysig-e2e.log`); skips remain uncovered, as documented earlier.
- Post-courtesy full library: 69 files, 1607 passed, 49 skipped (`/tmp/keysig-library.log`); skips remain uncovered.
- Direct mobile selection for key signatures still needs fixture-specific hit coordinates; existing mobile check selects at desktop before resize and must not be treated as direct touch.
- Direct mobile key signature attempt captured `keysig-direct-start-{react,vue}.png`: narrow score viewport starts at whole-page fit; Ctrl-wheel -500 overshoots to 1234%, -200 gives 61% but key lies outside visible area. Requires pan/recenter before touch; no interaction parity claim.
- Direct mobile-start touch: after Ctrl-wheel zoom and two mouse pans, touch (329,504) selects custom key signature in both; touch courtesy true→false matches, diff 24 (`capture-keysig-direct.mjs`, `/tmp/keysig-direct.log`, `keysig-direct-selected-{react,vue,diff}.png`). Pan/zoom were mouse, not pinch/touch gestures; Undo direct touch still unverified.
- Direct mobile-start courtesy touch Undo via Edit menu and touch reselection: true→false→true in both, diff 24 (`/tmp/keysig-direct-undo.log`). Mouse zoom/pan caveat remains.
- Rechecked four E2E skips against `test/e2e/webapps.e2e.ts:136,366,385,402`: parameterized editor cases gated `it.runIf(app === "viewer")`; viewer cases ran, but equivalent editor behavior is not covered by these tests. Editor embedding/drop target are not necessarily applicable; playback and continuous fit need separate evidence.
- Continuous-fit comparison attempt `check-continuous-fit.mjs` did not open expected menu (`/tmp/continuous-fit.log`); selector hit wrong Page view control. No parity claim; inspect actual control before retry.
- Continuous fit desktop: correct menu uses non-menuitem text; selecting fit in both yields diff 45 (`check-continuous-fit.mjs`, `continuous-fit-{react,vue,diff}.png`, `/tmp/continuous-fit.log`). Screenshot only; width geometry, mobile, resize and return-to-page interactions remain unverified.
- Continuous fit after desktop→mobile resize: `.page` bounding box identical (desktop x324 y166 w932 h3129.640625; mobile x297 y361 w96 h8169.609375), mobile screenshot diff 24 (`/tmp/continuous-fit-mobile.log`, `continuous-fit-mobile-{react,vue,diff}.png`). Return-to-page and direct mobile-start still open.
- Continuous fit direct mobile start with touch-capable context: fit and return-to-page produce identical `.page` bounds and 5 pages in both; fit screenshot diff 24 (`check-continuous-fit-direct.mjs`, `/tmp/continuous-fit-direct.log`). Initial menu selection used click, return used tap; returned page screenshot not compared.
- Direct mobile return-to-page screenshot diff 24 (`continuous-return-{react,vue,diff}.png`, `/tmp/continuous-return.log`).
- Editor playback cursor functionality is independently covered by `test/e2e/editor.e2e.ts:1989` (toolbar play/pause, tick and cursor advance); latest E2E passed. This is functionality evidence, not React/Vue visual comparison of cursor geometry or mobile.
- Playback running desktop comparison (`check-playback-visual.mjs`, `/tmp/playback-visual.log`): cursor width 1.28125, height 78.46875, y 251.84375 and rgba(0,101,191,0.7) match; x differs 4.81px due to asynchronous tick sampling (threshold >1920), full diff 318. Tick-synchronized capture and mobile remain open.
- Playback direct mobile running screenshot diff 57; cursor dimensions 0.21875×13.5, y505.78125 and color match; x differs 0.0625px under asynchronous sampling (`check-playback-mobile.mjs`, `/tmp/playback-mobile.log`, `playback-mobile-{react,vue,diff}.png`). Play activated by click, not touch; synchronized tick still open.
- Mobile playback touch activation succeeds in both; running diff 24 on repeat (`/tmp/playback-mobile-touch.log`), cursor dimensions/color match. Timing remains asynchronous.
- Playback probe exposes player.seek but forcing time during live rendering would alter normal interaction and may not synchronize animation; compare at stable tick only with evidence of legitimate seek and cursor update.
- Score viewport implements native two-touch pinch (`editor/scoreview.ts:1285`); Ctrl-wheel probes are not pinch evidence. A CDP multi-touch gesture comparison is still needed.
- CDP two-touch pinch on mobile score (distance 50→80): both change zoom whole-page→custom and produce identical page bounds x292 y486 w105.546875 h149.28125; diff 24 (`check-pinch.mjs`, `/tmp/pinch.log`, `pinch-{react,vue,diff}.png`). Pinch-out only; pinch-in and touch pan remain open.
- Reverse two-touch pinch 80→50 after pinch-out returns identical page bounds x303 y491 w65.953125 h93.28125; diff 24 (`/tmp/pinch-in.log`). Touch pan remains open.
- CDP one-finger pan after pinch-in: first run React page y456 vs Vue y285 (diff 443), repeat both y456 (diff 24) (`/tmp/touch-pan.log`, `/tmp/touch-pan-repeat.log`). Gesture timing/momentum nondeterministic; do not claim reliable pan parity without controlled timing.
- Controlled slow CDP touch pan (10 moves, 80ms intervals, 200ms hold) matches page y456 and diff 24 (`/tmp/touch-pan-slow.log`); fast flick/momentum remains nondeterministic.
- Tempo variant reader accepts `<type>aTempo</type>` / `<type>tempoPrimo</type>` (`src/engraving/rw/read460/tread.ts:663`); previous fixture still selected normal Tempo, so inspect actual inserted tag placement and selected object before claiming variant coverage.
- Tempo fixture tag is correctly nested, and `makeKey` uses `tempoTextType`; original selected status “Tempo” may be generic accessible label rather than model type. Inspect notation `data-model`/controls before dismissing variant.
- A-tempo fixture is MSCX 2.07 and uses `read206.readTempoText`, not read460; `<type>` is not handled there. Previous generic Tempo result is expected. Create 4.x fixture or use palette rather than altering legacy reader.
- Built 4.x `tempo-atempo-4-fixture.mscx` with A tempo before first rest; attempted click (665,190) missed, no notation selected (`/tmp/atempo4.log`). Need screenshot/hit location before comparison.
- Valid 4.x A tempo fixture selected at (692,207): both Inspector sections show A tempo, Follow written tempo, Override written tempo/BPM; desktop diff 24 (`check-tempo-atempo-4.mjs`, `/tmp/atempo4-selected.log`, `tempo-atempo-4-{react,vue,diff}.png`). Edits/Undo, tempo primo, mobile remain open.
- Valid 4.x Tempo primo fixture selected at (696,207): both Inspector labels/controls match, desktop diff 24 (`check-tempo-primo-4.mjs`, `/tmp/tempo-primo4.log`, `tempo-primo-4-{react,vue,diff}.png`). Edits/Undo and mobile open.
- A tempo and Tempo primo 4.x desktop BPM 80→100→Undo→80 match both, diffs 24 (`check-tempo-atempo-edit.mjs`, `check-tempo-primo-edit.mjs`, `/tmp/atempo-edit.log`, `/tmp/primo-edit.log`). Follow toggle and mobile remain open.
- A tempo and Tempo primo mobile-after-desktop-selection BPM edit/Undo match 80→100→80, diffs 24 (`check-tempo-{atempo,primo}-mobile.mjs`, `/tmp/{atempo,primo}-mobile.log`). Direct touch selection and Follow toggle still open.
- Follow-toggle script generation failed before browser execution (`/tmp/atempo-follow.log`); no interaction result. Correct script slicing before retry.
- A tempo/Tempo primo Follow checkbox false→true hides override; Undo restores false in both, desktop diff 24 each (`check-tempo-{atempo,primo}-follow.mjs`, `/tmp/{atempo,primo}-follow.log`). Mobile follow and direct touch selection open.
- A tempo/Tempo primo Follow toggle/Undo after desktop selection and mobile resize match false→true→false, diffs 24 (`check-tempo-{atempo,primo}-follow-mobile.mjs`, `/tmp/{atempo,primo}-follow-mobile.log`); direct touch selection remains open.
- Direct mobile touch selection of A tempo and Tempo primo (350,490 after mouse zoom/pan), Follow touch toggle and touch Undo/reselection false→true→false match, diffs 24 (`check-{atempo,primo}-direct.mjs`, `/tmp/{atempo,primo}-direct.log`). Zoom/pan mouse caveat applies.
- Remaining Tempo mixed-selection state needs two selectable tempo objects with distinct Follow/BPM values; fixture variants above each contain one object and do not cover mixed state.
- Mixed A tempo 4.x fixture (two texts, Follow false/true) Ctrl-selects list in both; checkbox checked=false, indeterminate=true, override hidden; desktop diff 24 (`check-tempo-mixed.mjs`, `/tmp/tempo-mixed-state.log`, `tempo-mixed-4-{react,vue,diff}.png`). Mixed edit/Undo and mobile open.
- Mixed A tempo Follow indeterminate→checked→Undo→indeterminate matches both, desktop diff 24 (`check-tempo-mixed-edit.mjs`, `/tmp/tempo-mixed-edit.log`). Mobile-after-resize and mixed types remain open.
- Mixed A tempo Follow edit/Undo after desktop selection and mobile resize matches indeterminate→checked→indeterminate, diff 24 (`check-tempo-mixed-mobile.mjs`, `/tmp/tempo-mixed-mobile.log`). Mixed subtype selection still open.
- Mixed A tempo + Tempo primo list selection shows collapsed A tempo/Tempo primo rows in both; desktop diff 24 (`check-tempo-mixed-types.mjs`, `/tmp/tempo-mixed-types.log`). Expansion/edit and mobile remain open.
- Mixed subtype expansion uncovered diff 1864 (`check-tempo-mixed-expanded.mjs`, `/tmp/tempo-mixed-expanded.log`): React displays Tempo primo Follow inside expanded section, Vue text absent there. Vue uses `UPopover` for multiple models; React native popup structure must be inspected (content may be portaled, not absent) before fix.
- Root cause confirmed: React `PopupViewButton` renders inline `.insp-popup-button > .insp-popup`, closes on outside pointer/Escape and restores focus; Vue multiple-model branch uses portaled `UPopover` with extra sizing/padding. Replace with native equivalent while preserving model paths and interactions; test multi-model popup.
- Replaced multi-notation UPopover with inline React `.insp-popup-button/.insp-popup` hierarchy in `NotationSection.vue`; mixed subtype popup diff 1864→24 (`/tmp/tempo-mixed-popup-fixed.log`); typecheck passes (`/tmp/popup-typecheck.log`). Outside click, Escape/focus, edit/Undo, mobile and full build/tests still need verification.
- Multi-notation popup Escape closes and restores Tempo primo trigger focus; outside click closes A tempo in both (`check-notation-popup-events.mjs`, `/tmp/popup-events.log`). Initial outside click on score cleared selection, so changed to General header; final screenshot diff 686 includes toggled General/scroll state and is not clean parity evidence.
- Popup outside handler narrowed to currently open wrapper (other Inspector popup wrappers count as outside, like React). Mixed popup diff remains 24; typecheck and editor build pass (`/tmp/tempo-mixed-popup-final.log`, `/tmp/popup-final-typecheck.log`, `/tmp/popup-final-build.log`). Full E2E and mobile remain open.
- Mixed notation popup mobile-after-desktop-selection diff 24 (`check-notation-popup-mobile.mjs`, `/tmp/popup-mobile.log`). Touch trigger and popup edit/Undo remain open.
- Mixed notation popup triggers opened by touch after desktop selection/mobile resize; diff 24 (`check-notation-popup-touch.mjs`, `/tmp/popup-touch.log`). Popup edit/Undo still open.
- Post-multi-popup E2E: 70 passed, 4 viewer-only editor variants skipped (`/tmp/popup-e2e.log`). Library suite was last run before popup template change; skipped coverage remains documented.
- Multi-notation Tempo primo popup Follow false→true→Undo→false matches both after reselection, desktop diff 24 (`check-notation-popup-edit.mjs`, `/tmp/popup-edit.log`). Initial uncheck was no-op; corrected check creates Undo command. Popup applies to repository selection behavior, not yet verified per-element isolation.
- Post-popup full library suite: 69 files, 1607 passed, 49 skipped (`/tmp/popup-library.log`); skipped cases remain uncovered.
- Mixed notation popup Follow edit/Undo after desktop selection/mobile resize matches false→true→false, diff 24 (`check-notation-popup-edit-mobile.mjs`, `/tmp/popup-edit-mobile.log`).
- ChordBracket mixed arpeggio case remains fixture-dependent: model queries CHORD_BRACKET while isBracket inspects non-bracket Arpeggio; verify repository expansion and selected objects before assuming ordinary arpeggio exercises this branch.
- Repository `findElementsByTypeUnfiltered(CHORD_BRACKET)` defaults to exact type filter (`elementrepositoryservice.ts:113`); ordinary Arpeggio excluded from ChordBracket model list in current port. Non-bracket flag branch therefore appears unreachable through this repository; reference parity/coverage needs separate source audit, not synthetic UI claim.
- React source uses same exact CHORD_BRACKET repository filtering and same Arpeggio isBracket check (`upstream/muse-encore/src/inspector/internal/elementrepositoryservice.ts:109`, `notation/notationsettingsmodels.ts:166`); unreachable non-bracket branch is shared reference behavior, not evidence of Vue visual difference. Mixed selection remains untested.
- Created bracket+arpeggio mixed fixture `chord-bracket-mixed-fixture.mscx`; need screenshot and distinct selection coordinates before interpreting model.
- ChordBracket+ordinary Arpeggio fixture Ctrl-select at (463,440)/(513,420) produces List selection and same Chord bracket controls in both; desktop diff 24 (`check-bracket-mixed.mjs`, `/tmp/bracket-mixed-selected.log`). Confirm individual selection identities and edit/Undo before asserting mixed target coverage.
- Candidate (513,420) individually identifies Arpeggio in both (`check-arpeggio-identity.mjs`, `/tmp/arpeggio-identity.log`); (463,440) previously identifies Chord bracket. Thus mixed list truly contains both; same controls/diff 24. Mixed edit/Undo and mobile remain open.
- Mixed ChordBracket/Arpeggio Hooks Both→Above→Undo→Both matches both, desktop diff 24 (`check-bracket-mixed-undo.mjs`, `/tmp/bracket-mixed-undo.log`). Mobile remains open.
- Mixed ChordBracket/Arpeggio Hooks edit/Undo after desktop selection/mobile resize matches Both→Above→Both, diff 24 (`check-bracket-mixed-mobile.mjs`, `/tmp/bracket-mixed-mobile.log`). Direct mobile multi-selection unverified.
- Direct mobile Image initial (350,520) touch misses target (`/tmp/image-direct.log`); screenshot/recenter needed; no interaction claim.
- Image direct mobile screenshot `image-direct-start-react.png`: score content/image is offscreen after key-signature pan recipe; requires fixture-specific recenter, not coordinate reuse.
- Image direct recenter attempts overshot vertically in opposite directions (`image-direct-start-react.png`); no selection verified. Use smaller controlled pan and locate image, rather than claim touch coverage.
- Smaller Image pan shows staff/text but image still outside narrow viewport (`image-direct-start-react.png`); direct selection remains open.
- Image recenter horizontal mouse drag accidentally selected/moved Image (modified indicator in `image-direct-start-react.png`); discard capture as invalid. Direct touch verification still open.
- Direct mobile Image touch (350,600) after mouse zoom/pan selects Image in both; Lock true→false→touch Undo→true, diff 24 (`check-image-direct.mjs`, `/tmp/image-direct.log`, `image-direct-{react,vue,diff}.png`). Mouse pan/zoom caveat; prior accidental drag discarded.
- Layout drag open evidence: instrument pointer drag parity documented; staff/system row, touch, cancellation and resize-during-drag remain separate unverified requirements (later panel fixes do not establish them).
- Layout instrument drag Escape before release does not revert reordered rows in either React or Vue; both final Soprano/Tenor/Alto/Bass (`check-layout-drag-cancel.mjs`, `/tmp/layout-drag-cancel.log`). Capture before Escape diff 74; synthetic pointercancel and touch cancellation remain unverified.
- Layout instrument CDP touch drag from row x+5: neither React nor Vue reorders; during screenshot diff 72 (`check-layout-touch.mjs`, `/tmp/layout-touch.log`). This establishes matching observed no-op only, not successful touch reorder or alternate handle behavior.
- Layout touch drag from row title x+100 also leaves order unchanged in both (`/tmp/layout-touch-title.log`), diff 94. Native scroll may cancel pointer gesture; no successful touch reorder proven.
- Layout instrument synthetic window pointercancel followed by mouseup retains same reordered rows in both; pre-cancel screenshot diff 97 (`check-layout-pointercancel.mjs`, `/tmp/layout-pointercancel.log`). Real touch cancellation and post-cancel undo/drag restart unverified.
- After synthetic Layout pointercancel, Edit > Undo restores original row order in both (`check-layout-pointercancel-undo.mjs`, `/tmp/layout-pointercancel-undo.log`). Real touch cancellation/restart remain open.
- Staff drag attempt on Amazing Grace expanded one-staff Soprano; second staff absent (`/tmp/layout-staff-drag.log`). Use multi-staff piano fixture before comparison.
- Layout Chopin Piano staff pointer drag Treble below Bass reorders both identically, during diff 184 (`check-layout-staff-drag.mjs`, `/tmp/layout-staff-drag.log`, `layout-staff-drag-{react,vue,diff}.png`). Undo/mobile/touch still open.
- Piano staff reorder Edit > Undo restores Treble/Bass in both (`check-layout-staff-undo.mjs`, `/tmp/layout-staff-undo.log`); mobile/touch still open.
- Layout Piano staff pointer drag/Undo at 390×844 matches both orders; during diff 130 (`check-layout-staff-mobile.mjs`, `/tmp/layout-staff-mobile.log`). Mouse pointer, not touch.
- Initial System texts row drag candidate recorded only part rows, which remained unchanged; diff 53 (`/tmp/layout-system-drag.log`). Does not establish system row movement; capture all row types and positions before/after.
- First System markings layer drag candidate remains at top in both, full row sequence identical and diff 74 (`/tmp/layout-system-all.log`). First layer may be immovable; test second layer before claiming system reorder.
- Second System texts layer drag onto Piano: both show temporary two adjacent layers, then merge to one on release; desktop diff 184 (`check-layout-system-second.mjs`, `/tmp/layout-system-second.log`, `layout-system-second-{react,vue,diff}.png`). Undo/mobile still open.
- Second System texts layer merge Undo restores second layer in both (`check-layout-system-second-undo.mjs`, `/tmp/layout-system-second-undo.log`); mobile/touch open.
- Second System texts layer merge/Undo at 390×844 matches row sequences, during diff 122 (`check-layout-system-second-mobile.mjs`, `/tmp/layout-system-second-mobile.log`). Mouse input; touch unverified.
- Toolbar same-row drop and synthetic pointercancel remain documented observable behavior differences; preserve Vue functional cancellation until cause and real user gesture are established. Not resolved by Layout drag checks.
- Toolbar same-row recheck `check-toolbar-drag.mjs` still fails React expected reorder (`/tmp/toolbar-drag-recheck.log`); test aborts before Vue. This is React behavior, not proof Vue regression; investigate drag target algorithm separately.
- React toolbar onUp closes over render-time `drag` (`ToolBars.tsx:415`); pointer listeners installed before setDrag rerender may read stale drag, explaining same-row no-op. Vue ref-based drag preserves functional reorder; do not deliberately replicate stale closure without explicit mandate to break functionality.
- Correction: React `drag` is module-level mutable (`ToolBars.tsx:345`), not render-time closure; stale closure hypothesis invalid. Same-row discrepancy remains unexplained; retain functional Vue behavior pending actual target/state tracing.
- Same-row trace: both during-drag dock/child rectangles and marker position identical, yet React leaves order unchanged and Vue reorders (`trace-toolbar-same-row.mjs`, `/tmp/toolbar-trace-json.log`). Difference occurs at release, not measured geometry; cause remains unproven.
- React/Vue target calculations and `moveToolBar` source are structurally equivalent; same-row release divergence remains unverified at event/state level. No Vue change made.
- Extra final pointermove after marker stabilization does not change same-row result (`trace-toolbar-final-move.mjs`, `/tmp/toolbar-final-move.log`).
- Event trace identifies React grip loses pointer capture mid-drag before `pointerup`, while Vue grip retains capture and receives release (`trace-toolbar-events.mjs`, `/tmp/toolbar-events.log`). Marker insertion likely causes React DOM movement/capture loss; preserve Vue functional reorder, no visual fix warranted.
- Mixed A tempo/Tempo primo popup Follow edit affects both selected elements in React and Vue; single reselection reports true for each (`check-notation-popup-isolation.mjs`, `/tmp/popup-isolation.log`). Isolation is not reference behavior for this property; other model types unverified.
- Hairpin Position source mapping matches React `PlacementSection` (Above=0, Below=1); model maps `Pid.PLACEMENT`. Click/Undo effect still unverified for Chopin fixture.
- Hairpin parent `EngravingItem.setProperty(PLACEMENT)` calls `setPlacement`; model-level path exists. Does not establish browser click effect or Undo.
- Hairpin Above click detail confirms selection remains Hairpin and Below stays selected in both (`check-hairpin-position-detail.mjs`, `/tmp/hairpin-position-detail.log`); no claim of successful property change.
- React selected Hairpin segment/spanner are not system objects and report Below (`check-hairpin-object.mjs`, `/tmp/hairpin-object.log`); system-below exception ruled out for React fixture. Vue dynamic import `/scoreview.ts` created separate module instance, so Vue object inspection failed; no Vue conclusion.
- React Hairpin segment and spanner placement remain 1 after Above click (`check-hairpin-object-after.mjs`, `/tmp/hairpin-object-after.log`): actual model unchanged, not merely stale radio. Last diff in script uses old Vue image, not valid comparison.
- React Hairpin Inspector API reports enabled placement value 1 at path `SECTION_NOTATION/TYPE_HAIRPIN` and generates a change for value 0 (`check-hairpin-changes.mjs`, `/tmp/hairpin-changes.log`). Browser click still yields unchanged spanner; application path/layout must be traced.
- React API direct apply of generated Hairpin placement change still leaves spanner Below (`check-hairpin-api-apply.mjs`, `/tmp/hairpin-api-apply.log`); issue below UI event handling, outside CSS scope. No behavior change made.
- React Clef selected DOM `clefToBarlinePosition()` stays 0 after Before click (`check-clef-object.mjs`, `/tmp/clef-object.log`); actual model unchanged, not just stale radio. Vue model-level state unverified.
- Vue `/editor/scoreview.ts` dynamic probe also fails (404; `/tmp/hairpin-object-vue.log`); actual module URL remains unidentified. No Vue model-level claim.
- Vue live scoreview module uses Vite `?t=` URL. Actual selected Hairpin segment/spanner both remain Below after Above click, same as React (`check-vue-hairpin-after.mjs`, `/tmp/vue-hairpin-after.log`). Any generated diff in single-app script uses stale React image and is invalid.
- Vue Clef selected model stays Auto after Before click, matching React (`check-vue-clef-object.mjs`, `/tmp/vue-clef-object.log`). No successful edit established for this header clef fixture.
- Winged repeat no-op explained at source: both React reference and Vue `BarLine.setProperty(BARLINE_SHOW_TIPS)` have identical TODO/no-op; getter reads score style. Shared core behavior, no UI fix.
- Header clef Position no-op explained: `Clef.setProperty(CLEF_TO_BARLINE_POS)` ignores changes when `m_isHeader`; test selects header clef. Non-header fixture edit/Undo remains open.
- Non-header bass clef `mmrest-5.mscx` (750,340): Auto→Before→Undo→Auto matches React and Vue, desktop full-screen diff 556 (`check-clef-nonheader.mjs`, `/tmp/clef-nonheader.log`, `inspector-clef-{react,vue,diff}.png`). Diff may include selection/score state; isolate before claiming tolerance. Mobile open.
- Non-header clef exposed SECTION_PARTS generic fallback: Vue omitted checkbox and used generated label, accounting for 532 of 556 pixels. Restored React PartsSettings hierarchy, flags, native checkbox/switch, indeterminate and handlers in `InspectorModel.vue`; changed/Undo desktop diff 556→24 (`/tmp/clef-parts-fixed.log`), typecheck pass (`/tmp/clef-parts-typecheck.log`). Parts checkbox/switch behavior, mobile, build and tests pending.
- SECTION_PARTS Exclude from parts false→true→Undo→false matches both, desktop diff 24 (`check-parts-exclude.mjs`, `/tmp/parts-exclude.log`, `parts-exclude-{react,vue,diff}.png`). Editor build passes (`/tmp/parts-build.log`); inspector-focused Vitest 8 passed/5 skipped (`/tmp/parts-inspector-test.log`), skips uncovered. Part linking switches and mobile pending.
- SECTION_PARTS Exclude at mobile-after-desktop-selection: false→true, Undo then desktop resize/reselection→false in both; mobile checked-state diff 24 (`check-parts-exclude-mobile2.mjs`, `/tmp/parts-exclude-mobile2.log`). First attempt clicked desktop coordinates at mobile and timed out (`/tmp/parts-exclude-mobile.log`); direct mobile selection/touch open.
- Duplicated Piano part, range selection: SECTION_PARTS Position/Style/Text switches all checked/enabled in both; desktop diff 94 (`check-parts-link-states.mjs`, `/tmp/parts-link-states.log`, `parts-link-{react,vue,diff}.png`). Toggle/Undo and exclusion-disabled state still open. First attempt missed score selection (`/tmp/parts-link.log`).
- Part Position switch true→false→Undo→true matches both; desktop switched-state diff 47 (`check-parts-link-undo.mjs`, `/tmp/parts-link-undo.log`, `parts-link-{react,vue,diff}.png`). Style/Text, exclusion-disabled and mobile remain open.
- Part Style and Text switches each true→false→Undo→true match both; switched-state desktop diffs 47 (`check-parts-style-undo.mjs`, `check-parts-text-undo.mjs`, `/tmp/parts-{style,text}-undo.log`). Mixed/disabled and mobile open.
- Part Position switch mobile-after-desktop-selection true→false; Undo confirmed after desktop resize/reselection, both apps; mobile diff 23 (`check-parts-link-mobile.mjs`, `/tmp/parts-link-mobile.log`). Direct mobile selection/touch pending.
- Part system text Exclude from score false→true→Undo→false matches both; linking wrapper becomes inert in each, desktop diff 47 (`check-parts-link-exclude.mjs`, `/tmp/parts-link-exclude.log`, `parts-link-{react,vue,diff}.png`). Earlier text selection candidate missed (`/tmp/parts-link-text-select.log`). Mobile/direct touch open.
- Post-SECTION_PARTS full E2E: 70 passed, 4 skipped (`/tmp/parts-e2e.log`); skips remain uncovered. Full library suite after change still pending.
- Post-SECTION_PARTS full library suite: 69 files, 1,607 passed/49 skipped (`/tmp/parts-library.log`); skips remain uncovered. Typecheck, build, E2E and focused browser evidence recorded above.
- Part system-text exclusion mobile-after-desktop-selection: checked + inert match, diff 23; Undo verified after desktop resize/reselection (`check-parts-link-excluded-mobile.mjs`, `/tmp/parts-link-excluded-mobile.log`). Direct mobile selection/touch open.
- `check-parts-exclude.mjs` now asserts checkbox and Undo values; rerun passes both, diff 24 (`/tmp/parts-exclude-assert.log`).
- Mixed clef selection attempt after exclusion shows checked, not indeterminate, in both; diff 224 (`check-parts-mixed.mjs`, `/tmp/parts-mixed.log`). Selection list alone does not prove mixed exclusion values; inspect selected elements before claiming indeterminate coverage.
- Mixed clef list object probe confirms exclusion values true/false, yet both apps show checked/non-indeterminate (`check-parts-mixed-values.mjs`, `/tmp/parts-mixed-values.log`); repository/model semantics need inspection, not assumed native indeterminate.
- Mixed clef checkbox explained: excluded non-header clef eligible; header clef ineligible (`check-parts-mixed-eligible.mjs`, `/tmp/parts-mixed-eligible.log`). `PartsSettingsModel` filters ineligible elements before loading; true/false selection is not mixed property state. Find two eligible elements for indeterminate coverage.
- Mixed tempo fixture lacks SECTION_PARTS for selected tempo; candidate timed out before interaction (`/tmp/parts-tempo-mixed.log`), no mixed-exclusion evidence.
- Part text + second click candidate shows checked/non-indeterminate in both, diff 47 (`/tmp/parts-link-mixed.log`); second selected identity/eligibility unverified, not mixed-state evidence.
- Part mixed candidate second element type 43 is ineligible; text type 55 eligible/excluded in both (`/tmp/parts-link-mixed-values.log`). Indeterminate still untested.
- Second part mixed candidate (844,236) selects ineligible type 51; no indeterminate evidence (`/tmp/parts-link-mixed-values2.log`).
- Part mixed candidate (840,281) selects ineligible Hairpin segment; no indeterminate evidence (`/tmp/parts-link-mixed-values3.log`).
- Part mixed candidate (667,449) selects no second element (`/tmp/parts-link-mixed-values4.log`).
- Part mixed candidate (824,333) selects ineligible type 54 (`/tmp/parts-link-mixed-values5.log`).
- Part mixed candidate (846,332) also ineligible (`/tmp/parts-link-mixed-values6.log`); stop coordinate guesses and use fixture/model targeting.
- Controlled StaffText fixture selects first text but main score lacks SECTION_PARTS (no linked part); test timed out before change (`/tmp/parts-text-mixed-fixture.log`). Need fixture with excerpt/linked part.
- Created excerpt from controlled StaffText fixture; selected text exposes linking switches but no Exclude checkbox in React (`/tmp/parts-text-mixed-excerpt4.log`). Cannot establish mixed exclusion with this fixture; likely model eligibility differs for excerpt-generated text.
- Controlled excerpt StaffText pair: Position link false/true confirmed by model; mixed switch renders unchecked in both, desktop diff 93 (`check-parts-link-mixed-fixture.mjs`, `/tmp/parts-link-mixed-fixture.log`, `parts-mixed-{react,vue,diff}.png`). Mixed switch edit/Undo and mobile pending; exclusion indeterminate still open.
- Mixed Position link switch changes false/true→true/true→Undo→false/true in both, desktop diff 93 (`check-parts-link-mixed-undo.mjs`, `/tmp/parts-link-mixed-undo.log`). Mobile and mixed exclusion pending.
- Mixed Position link mobile-after-desktop-selection false/true→true/true→Undo→false/true matches; Undo verified after desktop resize/reselection, diff 23 (`check-parts-link-mixed-mobile.mjs`, `/tmp/parts-link-mixed-mobile.log`). Direct touch unverified.
- Glissando `gliss-1.mscx` selection: React notation TODO; Vue functional generic controls retained, desktop diff 2,449 (`check-gliss-inspector.mjs`, `/tmp/gliss-inspector.log`, `gliss-inspector-{react,vue,diff}.png`). Intentional functionality-preserving difference; edits/Undo/mobile unverified.
- Vue-only Glissando thickness 0.15→0.3→Undo→0.15 passes (`check-gliss-thickness-undo.mjs`, `/tmp/gliss-thickness-undo.log`); React TODO prevents equivalent edit comparison. Other controls/mobile pending.
- Glissando mobile-after-desktop-selection diff 1,709 reflects React TODO vs retained Vue controls (`check-gliss-inspector-mobile.mjs`, `/tmp/gliss-inspector-mobile.log`, `gliss-inspector-mobile-{react,vue,diff}.png`). Direct touch and remaining controls unverified.
- Ottava `ottava.mscx` (800,363): React notation TODO, Vue retains functional generic controls; desktop diff 7,730 (`check-ottava-inspector.mjs`, `/tmp/ottava-inspector.log`, `ottava-inspector-{react,vue,diff}.png`). Vue edits/Undo and mobile pending.
- Ottava mobile-after-desktop-selection diff 2,984 from React TODO vs retained Vue controls (`check-ottava-inspector-mobile.mjs`, `/tmp/ottava-inspector-mobile.log`). Direct touch/edit unverified.
- Vue-only Ottava thickness 0.1→0.3→Undo→0.1 passes (`check-ottava-thickness-undo.mjs`, `/tmp/ottava-thickness-undo.log`); React TODO, other controls/direct touch open.
- Volta `line-3.mscx` (650,230): React notation TODO, Vue generic controls retained; desktop diff 9,321 (`check-volta-inspector.mjs`, `/tmp/volta-inspector.log`, `volta-inspector-{react,vue,diff}.png`). Vue edit/Undo and mobile open.
- Vue-only Volta thickness 0.1→0.3→Undo→0.1 passes (`check-volta-thickness-undo.mjs`, `/tmp/volta-thickness-undo.log`). Mobile-after-desktop-selection React TODO vs Vue controls diff 3,919 (`check-volta-inspector-mobile.mjs`, `/tmp/volta-inspector-mobile.log`). Other controls/direct touch open.
- Correction: Volta endings/dash/hook fields marked `showMore` in `src/inspector/api.ts`; generic notation renderer has no Show more wrapper for them. They are not merely model-invisible; pre-existing Vue access gap needs separate evaluation, while React view is TODO. Preserve functionality requirement; do not hide further.
- Volta generic renderer now offers Show more for existing advanced fields; endings/dash/hook controls appear (`check-volta-advanced.mjs`, `/tmp/volta-advanced.log`), typecheck passes (`/tmp/volta-advanced-typecheck.log`). React remains TODO; editing/Undo, mobile, build/tests pending.
- Volta endings 1→1, 2→Undo→1 passes (`check-volta-endings-undo.mjs`, `/tmp/volta-endings-undo.log`). Post-change editor build passes (`/tmp/volta-advanced-build.log`); Inspector tests 8 passed, 5 skipped (`/tmp/volta-inspector-test.log`). Mobile advanced and full regression remain open.
- Volta advanced mobile-after-resize shows existing controls (`check-volta-advanced-mobile.mjs`, `volta-advanced-mobile-vue.png`); direct touch/edit open. Post-change E2E 69 passed, 4 skipped, fullscreen toolbar test failed (`/tmp/volta-e2e.log`); focused retry 2 passed, 26 skipped (`/tmp/volta-e2e-retry.log`). Full suite not clean on first run.
- Post-Volta full library suite: 69 files, 1,607 passed, 49 skipped (`/tmp/volta-library.log`); skipped coverage remains open.
- Post-Volta full E2E retry: 70 passed, 4 skipped (`/tmp/volta-e2e-full-retry.log`); prior fullscreen first-run failure remains noted.
- Marker `system-1.mscx` (892,260): React notation TODO, Vue generic controls retained; desktop diff 8,926 (`check-marker-inspector.mjs`, `/tmp/marker-inspector.log`, `marker-inspector-{react,vue,diff}.png`). Edits/Undo and mobile open.
- Marker mobile-after-desktop-selection React TODO vs Vue generic controls diff 3,516 (`check-marker-inspector-mobile.mjs`, `/tmp/marker-inspector-mobile.log`, `marker-inspector-mobile-{react,vue,diff}.png`); direct touch and edits unverified.
- Vue Marker label segno→custom-segno→Undo→segno passes (`check-marker-label-undo.mjs`, `/tmp/marker-label-undo.log`); React TODO, other marker controls/direct touch open.
- Vue Marker type Segno→Coda→Undo→Segno passes (`check-marker-type-undo.mjs`, `/tmp/marker-type-undo.log`); React TODO, remaining controls/direct touch open.
- Jump `mmrest-10.mscx` page 2 (917,255): React notation TODO vs retained Vue generic controls, desktop diff 7,943 (`check-jump-inspector.mjs`, `/tmp/jump-inspector.log`, `jump-inspector-{react,vue,diff}.png`). Mobile and edits/Undo open.
- Jump mobile-after-desktop-selection React TODO vs Vue generic controls diff 2,712 (`check-jump-inspector-mobile.mjs`, `/tmp/jump-inspector-mobile.log`, `jump-inspector-mobile-{react,vue,diff}.png`); direct touch and edits remain open.
- Vue Jump target segno→start→Undo→segno verified via `aria-checked` (`check-jump-target-undo.mjs`, `/tmp/jump-target-undo.log`); React TODO; other fields/direct touch open.
- Jump mobile-after-desktop-selection touch changes target segno→start (`check-jump-target-mobile.mjs`, `/tmp/jump-target-mobile.log`); Undo followed by desktop reselection failed to restore selection in this mobile-emulated run, so mobile Undo remains unverified. Desktop Undo passes.
- Jump mobile touch target segno→start→Undo→segno now verified (`check-jump-target-mobile.mjs`, `/tmp/jump-target-mobile.log`). Prior reselection failure was test error: resize returned viewport to page 1 while selected Jump remained on page 2; no reselection needed.
- Text line `line-1.mscx` (650,282): React notation TODO vs retained Vue generic controls, desktop diff 7,984 (`check-textline-inspector.mjs`, `/tmp/textline-inspector.log`, `textline-inspector-{react,vue,diff}.png`). Mobile and edits/Undo open.
- Text line mobile-after-desktop-selection React TODO vs Vue controls diff 3,230 (`check-textline-inspector-mobile.mjs`, `/tmp/textline-inspector-mobile.log`); Vue begin text VII→VIII→Undo→VII passes (`check-textline-text-undo.mjs`, `/tmp/textline-text-undo.log`). Direct touch and other controls open.
- Fretboard diagram `harmony-2.mscx` (875,287): React notation TODO vs retained Vue controls, desktop diff 1,338 (`check-fret-inspector.mjs`, `/tmp/fret-inspector.log`, `fret-inspector-{react,vue,diff}.png`). Mobile and edit/Undo open.
- Fretboard diagram mobile-after-desktop-selection TODO/control diff 884 (`check-fret-inspector-mobile.mjs`, `/tmp/fret-inspector-mobile.log`); Vue orientation Vertical→Horizontal→Undo→Vertical passes (`check-fret-orientation-undo.mjs`, `/tmp/fret-orientation-undo.log`). Direct touch and other fields open.
- Fretboard orientation mobile-after-desktop-selection touch Vertical→Horizontal→Undo→Vertical passes (`check-fret-orientation-mobile.mjs`, `/tmp/fret-orientation-mobile.log`); direct mobile score selection open.
- Chord symbol `harmony-2.mscx` (500,443): empty notation section lacked React TODO hint, shifting Text section; restored hint only for empty model. Desktop diff 10,653→24 (`check-harmony-inspector.mjs`, `/tmp/harmony-inspector-after.log`); mobile-after-resize diff 24 (`check-harmony-inspector-mobile.mjs`, `/tmp/harmony-inspector-mobile.log`). Typecheck passes (`/tmp/harmony-typecheck.log`); edits/direct touch/build/tests pending.
- Post-chord-symbol fix editor build passes (`/tmp/harmony-build.log`); Inspector tests 8 passed, 5 skipped (`/tmp/harmony-test.log`); Lyrics regression diff 24 (`check-lyrics-property.mjs`, `/tmp/harmony-lyrics-regression.log`). Full suites after this fix pending.
- Chord symbol Text size 12→20→Undo→12 matches both (`check-harmony-text-undo.mjs`, `/tmp/harmony-text-undo.log`, `harmony-text-edit-{react,vue,diff}.png`), diff 24. Direct mobile selection and remaining text states open.
- Instrument name `system-1.mscx` (431,351): empty notation lacked React TODO hint; restored conditional hint. Desktop diff 248→24 (`check-instrumentname-inspector.mjs`, `/tmp/instrumentname-inspector-after.log`), typecheck passes (`/tmp/instrumentname-typecheck.log`); mobile, interactions/build/tests pending.
- Instrument name mobile-after-desktop-selection diff 24 (`check-instrumentname-inspector-mobile.mjs`, `/tmp/instrumentname-inspector-mobile.log`). Post-fix build passes (`/tmp/instrumentname-build.log`), Inspector tests 8 passed/5 skipped (`/tmp/instrumentname-test.log`). Direct touch, interactions and full suites pending.
- Ambitus `small-1.mscx` (415,350): restored missing empty notation hint; desktop diff 248→24 and mobile-after-resize diff 24 (`check-ambitus-inspector*.mjs`, `/tmp/ambitus-inspector-after.log`, `/tmp/ambitus-inspector-mobile.log`). Typecheck/build pass; Inspector tests 8 passed/5 skipped (`/tmp/ambitus-{typecheck,build,test}.log`). Direct touch/full suites pending.
- Measure repeat `measure-repeat-3.mscx` (606,378): React TODO vs retained Vue controls; desktop/mobile-after-resize diffs 538 (`check-measurerepeat-inspector*.mjs`, `/tmp/measurerepeat-inspector*.log`, corresponding screenshots). Edit/Undo and direct touch open.
- Vue measure repeat measures 1→2→Undo→1 passes by radio state (`check-measurerepeat-edit-undo.mjs`, `/tmp/measurerepeat-edit-undo.log`); React notation TODO, direct touch/other fields open.
- Measure repeat mobile-after-desktop-selection touch 1→2→Undo→1 passes (`check-measurerepeat-mobile-touch.mjs`, `/tmp/measurerepeat-mobile-touch.log`); direct mobile score selection remains open.
- Multimeasure rest `mmrest-10.mscx` (580,335): React TODO vs retained Vue controls, desktop diff 626, mobile-after-resize 629 (`check-mmrest-inspector*.mjs`, `/tmp/mmrest-inspector*.log`, corresponding screenshots). Edit/Undo/direct touch open.
- Vue multimeasure rest number Visible true→false→Undo→true passes (`check-mmrest-visible-undo.mjs`, `/tmp/mmrest-visible-undo.log`); React TODO; offset/direct touch open.
- Multimeasure rest number visibility mobile-after-desktop-selection touch true→false→Undo→true passes (`check-mmrest-visible-mobile.mjs`, `/tmp/mmrest-visible-mobile.log`); direct mobile score selection open.
- Two-note Tremolo `disabled/tremolo-1.mscx` (620,306): React `Tremolos` TODO, Vue `Tremolo` empty, desktop diff 265 (`check-tremolo-inspector.mjs`, `/tmp/tremolo-inspector.log`). Vue model declares properties but none rendered for this selection; inspect repository eligibility before altering behavior. Mobile/edit/Undo open.
- Two-note Tremolo mobile-after-resize diff 265 (`check-tremolo-inspector-mobile.mjs`, `/tmp/tremolo-inspector-mobile.log`). Root cause of empty Vue model: `SimpleSettingsModel.requestElements()` queries only `TREMOLO_SINGLECHORD`; repository exact-type filter excludes selected `TREMOLO_TWOCHORD` before predicate. Fix requires functionality change beyond visual parity; retain current behavior pending separate scope.
- Tremolo title corrected to React `Tremolos` in `src/inspector/notation/notationsettingsmodels.ts`; desktop diff 265→248 (`/tmp/tremolo-title-after.log`). TODO hint remains absent because declared properties exist; do not hide potentially functional single-note controls. Typecheck/build pass, Inspector tests 8 passed/5 skipped (`/tmp/tremolo-title-{typecheck,build,test}.log`).
- Single-note Tremolo `disabled/tremolo-1.mscx` (701,277): React TODO vs Vue functional generic type/play controls; desktop diff 754, mobile-after-resize 726 (`check-tremolo-single-inspector*.mjs`, `/tmp/tremolo-single-inspector*.log`). Edit/Undo/direct touch open. Confirms unconditional TODO hint would hide Vue functionality.
- Vue single-note Tremolo play true→false→Undo→true passes after reselection (`check-tremolo-play-undo.mjs`, `/tmp/tremolo-play-undo.log`); React notation TODO. Type/direct touch open.
- Vue single-note Tremolo play mobile-after-desktop-selection touch true→false→Undo→true passes after desktop resize/reselection (`check-tremolo-play-mobile.mjs`, `/tmp/tremolo-play-mobile.log`); direct mobile score selection open.
- Trill/Ornament `small-1.mscx` (663,294): React TODO vs Vue generic controls; desktop diff 1,020, mobile-after-resize 1,023 (`check-trill-inspector*.mjs`, `/tmp/trill-inspector*.log`, corresponding screenshots). Edits/Undo/direct touch open.
- Vue trill placement click Below changes radio, but after Undo original coordinates no longer select moved trill (`check-trill-placement-undo.mjs`, `/tmp/trill-placement-undo.log`); Undo state unverified, not a pass. Need reliable reselection by geometry.
- Correction to prior trill note: failure occurs clicking disabled Edit > Undo, before reselection (`/tmp/trill-placement-undo.log`), not at reselection. Radio changed but no Undo command recorded; actual spanner property effect unverified. Inspect lower-layer behavior before claiming edit.
- Trill source trace: repository maps selected `TrillSegment` to embedded `Trill.ornament()`; OrnamentSettingsModel applies placement there. Disabled Undo after Below suggests no effective command, but cause (value conversion/property target) not established; preserve code pending direct property probe.
- Trill direct live DOM probe (`check-trill-placement-probe.mjs`, `/tmp/trill-placement-probe.log`): segment/trill placement 0, embedded ornament 1 both before/after clicking Below; radio shows Below but no score change or Undo. Likely selecting current ornament value; UI control lacks model reconciliation. React view TODO prevents visual behavior comparison; preserve current lower-layer semantics pending separate functionality scope.
- Trill Above probe (`check-trill-above-probe.mjs`, `/tmp/trill-above-probe.log`): embedded ornament placement 1→0, Undo enabled and executed; reselection returns Auto unchecked (initial Auto unchecked). Exact restored ornament value after Undo not probed. Below no-op corresponds to initial ornament value 1; generic Auto/Above/Below presentation differs from model state.
- Trill Above direct probe confirms embedded ornament placement 1→0→Undo→1 after reselection (`check-trill-above-probe.mjs`, `/tmp/trill-above-probe.log`). React TODO; mobile touch and other controls open.
- Trill mobile-after-desktop-selection touch Above changes embedded ornament 1→0→Undo→1, verified after desktop resize/reselection (`check-trill-above-mobile.mjs`, `/tmp/trill-above-mobile.log`); direct mobile score selection open.
- Gradual tempo change `gradual_tempo_change_rallentando.mscx` (909,243): React TODO vs retained Vue controls; desktop diff 9,331, mobile-after-resize 4,193 (`check-gradualtempo-inspector*.mjs`, `/tmp/gradualtempo-inspector*.log`, corresponding screenshots). Edit/Undo/direct touch open.
- Vue gradual tempo begin text rall.→rit.→Undo→rall. passes (`check-gradualtempo-text-undo.mjs`, `/tmp/gradualtempo-text-undo.log`); React TODO, other controls/direct touch open.
- Gradual tempo `changeFactor`/`snapAfter`/`alignRightOfRehearsalMark` marked `showMore` in `src/inspector/api.ts`, but generic notation renderer lacks wrapper for this type. Existing access gap like Volta; assess functional scope separately; do not claim controls covered.
- Bracket fixture search: `bracket-1.mscx` absent; `voice-1.mscx` has XML bracket tags but no selectable visible brace in initial render (`capture-bracket-fixture.mjs`, `bracket-fixture-react.png`). Bracket Properties still unverified; seek suitable score.
- Bracket `harmony-10.mscx` (328,402): empty notation hint restored; desktop diff 248→24, mobile-after-resize 24 (`check-bracket-inspector*.mjs`, `/tmp/bracket-inspector-after.log`, `/tmp/bracket-inspector-mobile.log`). Typecheck/build pass; Inspector 8 passed/5 skipped (`/tmp/bracket-{typecheck,build,test}.log`). Direct touch/full suites pending.
- Post-Bracket full suites: library 69 files, 1,607 passed/49 skipped (`/tmp/bracket-library.log`); E2E 70 passed/4 skipped (`/tmp/bracket-e2e.log`). Skipped coverage and remaining visual states open.
- Lyrics extension line `small-1.mscx` (586,390): empty notation hint restored; desktop diff 248→24, mobile-after-resize 24 (`check-lyricsline-inspector*.mjs`, `/tmp/lyricsline-inspector-after.log`, `/tmp/lyricsline-inspector-mobile.log`). Typecheck/build pass; Inspector 8 passed/5 skipped (`/tmp/lyricsline-{typecheck,build,test}.log`). Direct touch/full suites pending.
- Vertical frame `gradual_tempo_change_rallentando.mscx` (630,220): missing empty notation hint shifted following section; restored. Desktop diff 2,254→24, mobile-after-resize 24 (`check-frame-inspector*.mjs`, `/tmp/frame-inspector-after.log`, `/tmp/frame-inspector-mobile.log`). Typecheck/build pass, Inspector 8 passed/5 skipped (`/tmp/frame-{typecheck,build,test}.log`); direct touch/full suites pending.
- Horizontal frame `barline-2.mscx` (775,320): restored missing empty notation hint; desktop diff 2,254→24, mobile-after-resize 24 (`check-hframe-inspector*.mjs`, `/tmp/hframe-inspector-after.log`, `/tmp/hframe-inspector-mobile.log`). Typecheck/build pass; Inspector 8 passed/5 skipped (`/tmp/hframe-{typecheck,build,test}.log`). Direct touch/full suites pending.
- Text frame `testTboxWords1.mscx` (750,264): restored missing empty notation hint; desktop diff 2,254→24, mobile-after-resize 24 (`check-tframe-inspector*.mjs`, `/tmp/tframe-inspector-after.log`, `/tmp/tframe-inspector-mobile.log`). Typecheck/build pass; Inspector 8 passed/5 skipped (`/tmp/tframe-{typecheck,build,test}.log`). Direct touch/full suites pending.
- Expression `expression-1-ref.mscx` (680,235): restored missing empty notation hint; desktop diff 12,614→24, mobile-after-resize 24 (`check-expression-inspector*.mjs`, `/tmp/expression-inspector-after.log`, `/tmp/expression-inspector-mobile.log`). Typecheck/build pass; Inspector 8 passed/5 skipped (`/tmp/expression-{typecheck,build,test}.log`). Text edits/direct touch/full suites pending.
- Expression Text size 10→20→Undo→10 matches both; diff 24 (`check-expression-text-undo.mjs`, `/tmp/expression-text-undo.log`, `expression-text-edit-{react,vue,diff}.png`). Direct mobile selection and remaining states open.
- Symbol `symbol-1.mscx` (510,520): restored missing empty notation hint; desktop diff 248→24, mobile-after-resize 24 (`check-symbol-inspector*.mjs`, `/tmp/symbol-inspector-after.log`, `/tmp/symbol-inspector-mobile.log`). Typecheck/build pass; Inspector 8 passed/5 skipped (`/tmp/symbol-{typecheck,build,test}.log`). Direct touch/full suites pending.
- Staff type change candidate `layout_elements.mscx` renders densely at default zoom (`capture-all-elements-fixture.mjs`, `all-elements-fixture-react.png`); selection/Properties not yet established. Need zoom and geometry, not guessed coordinates.
- StaffTypeChange layout bbox is 2.5sp square above staff (`src/engraving/rendering/score/tlayout.ts:2705`), fixture object resides in later measure; default screenshot too small to resolve. Geometry-based selection still open.
- Live score scan locates StaffTypeChange bbox in engraving units x=7160.97 y=1399.76 w=h=206.89 (`probe-stafftype-geometry.mjs`, `/tmp/stafftype-geometry.log`); next map through page bounds and 1200 DPI for selection.
- Staff type change `layout_elements.mscx` (879,224), derived from live bbox/page scaling: empty hint restored; desktop diff 248→24, mobile-after-resize 24 (`check-stafftype-inspector*.mjs`, `/tmp/stafftype-inspector-after.log`, `/tmp/stafftype-inspector-mobile.log`). Typecheck/build pass; Inspector 8 passed/5 skipped (`/tmp/stafftype-inspector-{typecheck,build,test}.log`). Direct touch/full suites pending.
- Post-staff-type hint full suites: library 1,607 passed/49 skipped (`/tmp/stafftype-final-library.log`); E2E 70 passed/4 skipped (`/tmp/stafftype-final-e2e.log`). Skips and visual coverage remain open.
- Text frame RGB edits previously discarded #AARRGGBB alpha. `TextSection.vue` now retains alpha prefix like Dynamics; controlled `text-alpha-fixture.mscx` UI edit/export asserts red fill alpha 128 (`check-text-alpha-export.mjs`, `/tmp/text-alpha-export.log`). Typecheck/build pass; Inspector 8 passed/5 skipped (`/tmp/text-alpha-{typecheck,build,test}.log`). Border/mixed alpha and full suites pending.
- Text frame border controlled RGB edit/export also preserves alpha 128 (`text-border-alpha-fixture.mscx`, `check-text-border-alpha-export.mjs`, `/tmp/text-border-alpha-export.log`). Rectangle visual regression diff 94 (`capture-inspector-text-frame.mjs`, `/tmp/text-alpha-visual-regression.log`). Mixed alpha remains unverified.
- Mixed Text frame alpha: source `AbstractInspectorModel.setPropertyValue()` applies one supplied color to all selected items (`src/inspector/abstractinspectormodel.ts:461`); mixed alpha remains undefined and cannot be claimed preserved. Controlled single-item fill/border checks do not cover mixed selection.
- Post-text-alpha full library: 1,606 passed/49 skipped/1 Goldberg rendering timeout at explicit 60s (`/tmp/text-alpha-library.log`); focused Goldberg retry passed (`/tmp/text-alpha-goldberg-retry.log`). Full suite not clean on first run; E2E pending.
- Post-text-alpha E2E 70 passed/4 skipped (`/tmp/text-alpha-e2e.log`); skipped coverage remains open.
- Post-text-alpha full library retry passes: 1,607 passed/49 skipped (`/tmp/text-alpha-library-retry.log`); prior Goldberg 60s timeout remains documented.
- Mixed eligible exclusion fixture candidates narrowed by overrides: Box, non-header Clef, Ottava, StaffTextBase (`src/engraving/dom/{box,clef,ottava,stafftextbase}.ts`). Existing mixed StaffText fixture uses part-link switches but exclusion checkbox not shown in that excerpt; need master-score pair or explicitly eligible excerpt elements.
- Master `parts-mixed-text-fixture.mscx` first StaffText selects correctly (700,210), but React shows only General/Text, no Exclude checkbox (`check-parts-master-text-exclude.mjs`, `/tmp/parts-master-text-exclude.log`). Eligibility method alone does not ensure exposed SECTION_PARTS; mixed exclusion remains open.
- Mixed part Position mobile rerun confirms two type 54 StaffText elements false/true→true/true→Undo false/true in both, diff 23 (`/tmp/parts-mixed-mobile-rerun.log`). `showPartsSection` uses element eligibility; displayed master fixture behavior warrants direct object probe before exclusion conclusions.
- Corrected eligibility: override belongs to `SystemText`, not all `StaffTextBase`. Live master probes: StaffText type 54 ineligible; controlled SystemText type 55 eligible, Parts section visible in both (`check-parts-master-{text,systemtext}-probe.mjs`, `/tmp/parts-master-{text,systemtext}-probe.log`). `parts-mixed-systemtext-fixture.mscx` provides eligible pair for next mixed test.
- Controlled two SystemText master selection: exclusion true/false renders native indeterminate; check sets true/true; Undo restores true/false in both. Desktop diff 24 (`check-parts-system-mixed.mjs`, `parts-system-mixed-{react,vue,diff}.png`, `/tmp/parts-system-mixed.log`). Mobile/direct touch still open.
- Mixed SystemText exclusion mobile-after-desktop-selection: indeterminate screenshot diff 24; touch checkbox sets true/true; desktop resize/reselection Undo restores true/false in both (`check-parts-system-mixed-mobile.mjs`, `/tmp/parts-system-mixed-mobile.log`). Direct mobile score selection remains open.
- Gradual tempo previously hid all `showMore` properties. Reused Volta expansion in `InspectorModel.vue`; Vue advanced view exposes change Factor, snap After, align Right Of Rehearsal Mark (`check-gradualtempo-advanced.mjs`, `gradualtempo-advanced-vue.png`, `/tmp/gradualtempo-advanced.log`). React notation remains TODO; advanced edit/Undo and mobile remain unverified. Typecheck/build pass; focused Inspector 8 passed/5 skipped (`/tmp/gradualtempo-{typecheck,build,test}.log`).
- Gradual tempo advanced change Factor 0.75→0.5→Undo→0.75 passes Vue; advanced input visible after mobile resize (`check-gradualtempo-advanced-undo.mjs`, `/tmp/gradualtempo-advanced-undo.log`, `gradualtempo-advanced-mobile-vue.png`). React TODO, other advanced fields and direct mobile remain open.
- Post-Gradual tempo E2E: 70 passed/4 skipped (`/tmp/gradualtempo-e2e.log`). Skips remain uncovered.
- Post-Gradual tempo full library 1,607 passed/49 skipped (`/tmp/gradualtempo-library.log`); skipped coverage remains open.
- Gradual tempo advanced snap After true→false→Undo→true passes Vue (`check-gradualtempo-snap-undo.mjs`, `/tmp/gradualtempo-snap-undo.log`). Align Right Of Rehearsal Mark and direct mobile remain open.
- Gradual tempo advanced align Right Of Rehearsal Mark true→false→Undo→true passes Vue (`check-gradualtempo-align-undo.mjs`, `/tmp/gradualtempo-align-undo.log`). Direct mobile score selection/edit remains open.
- Paused internal `player.seek(5)` attempt does not yield synchronized cursor: cursor hidden and state ticks 2017/1949 (`check-playback-seek-paused.mjs`, `/tmp/playback-seek-paused.log`). Not visual evidence; use normal seek/cursor lifecycle for future comparison.
- Existing Volta advanced expansion regression: endings 1→1, 2→Undo→1 passes after shared gradual-tempo change (`/tmp/gradualtempo-volta-regression.log`).
- Single-note Tremolo mobile regression still retains Vue type/play controls while React TODO (diff 726, `/tmp/tremolo-single-mobile-regression.log`); empty two-note hint fix must not suppress these controls.
- Two-note Tremolo empty model now shows React TODO hint only when sole model `isEmpty`; desktop diff 248→24, mobile diff 24 (`/tmp/tremolo-empty-hint{,-mobile}.log`). Single-note Vue controls retained, mobile diff 726 (`/tmp/tremolo-hint-single.log`). Typecheck/build pass; Inspector 8 passed/5 skipped (`/tmp/tremolo-empty-{typecheck,build,test}.log`). Earlier direct API probe returned [] due to separate Vite module instance; not evidence about UI model.
- Post-Tremolo hint E2E 70 passed/4 skipped (`/tmp/tremolo-empty-e2e.log`); skips uncovered.
- Post-Tremolo hint full library: 1,607 passed/49 skipped (`/tmp/tremolo-empty-library.log`).
- Post-hint single-note Tremolo play true→false→Undo→true still passes (`/tmp/tremolo-hint-play-undo.log`).
- Gradual tempo mobile current baseline after advanced access: diff 4,193; React TODO, Vue retains controls (`/tmp/gradualtempo-current-mobile.log`). Direct mobile score selection remains open.
- `check-tremolo-inspector.mjs` now asserts hint presence in both apps; rerun passes diff 24 (`/tmp/tremolo-hint-assert.log`).
- Restore-session Escape closes dialog in deployed React and Vue after autosave (`check-restore-escape.mjs`, `/tmp/restore-escape.log`). Tabs differ in hidden mounted panel nodes; visible state and autosave retention after Escape not yet verified. Multi-score remains open.
- Restore-session Escape then reload: no restore prompt in local React or Vue (`check-restore-escape-reload-local.mjs`, `/tmp/restore-escape-reload-local.log`); deployed retry timed out (`/tmp/restore-escape-reload.log`). This checks prompt recurrence, not DB contents.
- Restore Escape DB probe: autosave count 1→0, remains 0 after reload in local React and Vue (`check-restore-escape-db.mjs`, `/tmp/restore-escape-db.log`). Deployed DB probe not run.
- Controlled two-autosave Escape removes both in local React/Vue (2→0, reload 0; `check-restore-multiple.mjs`, `/tmp/restore-multiple.log`). Local React dialog lists no names while Vue lists both; deployed React previously lists names for single autosave, so multi-score deployed visual behavior remains unverified. Synthetic DB fixture, not two real editing sessions; Yes path untested.
- Controlled two-autosave Yes opens modified amazing in local React/Vue; both autosaves remain and prompt returns on reload (`check-restore-multiple-yes.mjs`, `/tmp/restore-multiple-yes.log`; log labels say escape but action is Yes). Synthetic second score; deployed behavior unverified.
- Deployed React controlled synthetic two-autosave differs: only amazing named, Escape leaves one orphan autosave and prompts again; Vue lists both and clears both (`check-restore-multiple-deployed.mjs`, `/tmp/restore-multiple-deployed.log`). Local React clears both. Synthetic DB injection may not represent valid deployed schema/session; do not change Vue data handling without real two-score reproduction.
- Attempted real two-score autosave via File > Open; browser picker did not emit Playwright filechooser after overriding `showOpenFilePicker` (`check-restore-two-real.mjs`, `/tmp/restore-two-real.log`). Real multi-score deployed case remains open; no data-handling changes made.
- File picker stub attempt produced only one autosave in each app (`check-restore-two-picker.mjs`, `/tmp/restore-two-picker.log`); second open/edit not established, so not valid multi-score evidence.
- Real sequential two-score attempt was invalid: `openFileData()` first calls `closeOpenedScore()`, which prompts for modified score and notes closed-without-saving autosave removal (`editor/session.ts:364,639`). Need reproduce genuinely concurrent/crash autosaves, not assume sequential open retains both.
- Two real edited scores in concurrent tabs generate two autosaves. Local React/Vue Escape clears both; deployed React lists only amazing and leaves one autosave, Vue lists both and clears both (`check-restore-two-tabs{,-deployed}.mjs`, `/tmp/restore-two-tabs{,-deployed}.log`). Keep Vue all-autosave handling to avoid data-loss/stranded autosave changes; deployed behavioral difference documented. Screenshot/Yes/multi mobile remain open.
- Concurrent real two-score deployed restore dialog captures: desktop diff 11,154, mobile-after-resize 10,286 (`restore-two-{react,vue,diff}.png`, `restore-two-mobile-{react,vue,diff}.png`, `/tmp/restore-two-tabs-yes-retry.log`). React lists/restores amazing, Vue lists both/restores reunion; both retain autosaves and prompt on reload. Active-score selection differs; preserve Vue recovery pending policy. First deployed request timed out (`/tmp/restore-two-tabs-yes.log`).
- Single restore-session 600-pixel discrepancy isolated to initial focus: deployed React focuses No, Vue focused Yes. `editor/App.vue` autofocus now No; desktop/mobile-after-resize diff 600→0 (`capture-restore-session.mjs`, `/tmp/restore-focus-after.log`, `restore-session{,-mobile}-diff.png`). Typecheck/build pass; focused autosave E2E 1 passed (`/tmp/restore-focus-{typecheck,build,test}.log`). Local upstream React focuses Yes; deployed is authoritative. Multi-score recovery differences remain.
- Post-restore-focus full E2E 69 passed/4 skipped/1 navigation page-indicator timeout (`/tmp/restore-focus-e2e.log`); focused navigation retry passed (`/tmp/restore-focus-nav-retry.log`). Full run not clean; retry needed.
- Post-restore-focus full E2E retry 70 passed/4 skipped (`/tmp/restore-focus-e2e-retry.log`); earlier navigation timeout remains documented.
- Post-restore-focus library: 1,607 passed/49 skipped (`/tmp/restore-focus-library.log`).
- Deployed restore initial focus No; Enter removes autosave (1→0) and no reload prompt (`check-restore-enter.mjs`, `/tmp/restore-enter-retry.log`). Vue attempt received `ERR_EMPTY_RESPONSE` twice despite root curl 200; matching Enter behavior remains unverified.
- Vue restore Enter verification succeeds via localhost: focused No, autosave 1→0, no reload prompt (`check-restore-enter-vue.mjs`, `/tmp/restore-enter-vue.log`); matches deployed React. Earlier 127.0.0.1 empty responses were host/server issue.
- Layout instrument CDP touch drag with 800ms hold still leaves order unchanged in both; during diff 77 (`check-layout-touch-hold.mjs`, `/tmp/layout-touch-hold.log`). No successful touch reorder proven; first IPv6 host returned empty response, localhost retry succeeded.
- Held Layout touch trace: both receive same touch pointerdown, four moves, then browser pointercancel; no reorder (`trace-layout-touch.mjs`, `/tmp/layout-touch-trace.log`). Supports native gesture cancellation; not proof of successful touch drag or restart.
- After real browser touch pointercancel, mouse drag restart reorders Alto/Tenor in both (`check-layout-touch-restart.mjs`, `/tmp/layout-touch-restart.log`). Touch restart and Undo after this sequence remain open.
- After real touch cancellation and mouse drag restart, Undo restores original order in both (`check-layout-touch-restart-undo.mjs`, `/tmp/layout-touch-restart-undo.log`). Touch restart remains unverified.
- Layout touch restart after browser cancellation again receives pointercancel and leaves order unchanged in both (`check-layout-touch-touch-restart.mjs`, `/tmp/layout-touch-touch-restart.log`). No successful touch reorder demonstrated.
- Custom palette creation: Escape closes input without creating; Enter creates named palette in local React/Vue (`check-custom-palette-keys.mjs`, `/tmp/custom-palette-keys.log`). Mobile touch/keyboard and persistence after these exact paths remain open.
- Custom palette direct mobile viewport: touch opens popup; keyboard Escape cancels, Enter creates; delayed reload retains palette in both (`check-custom-palette-mobile-keys.mjs`, `/tmp/custom-palette-mobile-keys.log`). Hardware-emulated keyboard, not OS virtual keyboard.
- Created part-tab multi-item context popup bounds 220×62 match desktop/mobile direct viewport; diffs 104/40 (`capture-part-tab-menu{,-mobile}.mjs`, `part-tab-menu{,-mobile}-{react,vue,diff}.png`, `/tmp/part-tab-menu{,-mobile}.log`). Opened via right-click even on touch-enabled viewport; actual touch context gesture and actions remain open.
- Part-tab CDP 1s long-touch on 390×844 opens no context popup in either app (`check-part-tab-longtouch.mjs`, `/tmp/part-tab-longtouch.log`); Chrome headless gesture, not proof of native device long-press behavior.
- Part-tab context items match Close tab/Close all tabs; Close tab removes selected part and leaves master in both (`check-part-tab-close.mjs`, `/tmp/part-tab-close.log`). Close all and undo/state persistence open.
- Part-tab Close all on modified score opens same save-changes dialog; Cancel retains both tabs in React/Vue (`check-part-tab-close-all-cancel.mjs`, `/tmp/part-tab-close-all-cancel.log`). Save/Don’t save paths not checked here.
- Part-tab Close all → Don’t save closes all notation tabs in React/Vue (`check-part-tab-close-all-discard.mjs`, `/tmp/part-tab-close-all-discard.log`). Save path remains open.
- Part-tab Close all → Save closes both tabs in React/Vue (`check-part-tab-close-all-save.mjs`, `/tmp/part-tab-close-all-save.log`); score persistence after reopen not checked.
- Close all → Save → reopen recent score retains Test part in Parts dialog in React/Vue (`check-part-tab-save-reopen.mjs`, `/tmp/part-tab-save-reopen.log`). Other score modifications not checked.
- Select More mobile-after-desktop-selection Add + OK selects exactly two KeySig elements (type 30) in both (`check-select-mobile-count.mjs`, `/tmp/select-mobile-count.log`). Direct mobile score selection and alternate filters remain open.
- Select More note-variant candidate coordinates 806,501 and 707,319 did not reach enabled Select > More (`check-select-note-candidate.mjs`, `/tmp/select-note-candidate.log`); no comparison claimed. Use score geometry/known note fixture next.
- Select More note variant reached via Control+Home/ArrowRight and Shift+F10: mobile-after-desktop selection dialog diff 0; Add + OK selects 1,253 notes (type 28) in both (`check-select-note-keyboard.mjs`, `/tmp/select-note-keyboard.log`). Direct mobile selection and alternate filters open. Previous coordinate candidate failures superseded.
- Select More note desktop: dialog screenshot diff 24, Add selects 1,253 notes in both (`check-select-note-desktop.mjs`, `/tmp/select-note-desktop.log`, `select-note-desktop-{react,vue,diff}.png`).
- Select More note Same pitch + Add selects 38 notes in both (`check-select-note-pitch.mjs`, `/tmp/select-note-pitch.log`); desktop pre-filter screenshot diff 24. Other filters/direct mobile open.
- Select More Same pitch checked screenshot diff 24 (`capture-select-note-pitch.mjs`, `select-note-pitch-{react,vue,diff}.png`, `/tmp/select-note-pitch-visual.log`).
- Select More Same pitch + Subtract removes initially selected note in both (selection count 0; `check-select-note-subtract.mjs`, `/tmp/select-note-subtract.log`).
- Select More Same pitch + Replace selects 38 notes in both (`check-select-note-replace.mjs`, `/tmp/select-note-replace.log`).
- Select More Same pitch + Add mobile-after-resize selects 38 notes in both; pre-filter dialog diff 0 (`check-select-note-pitch-mobile.mjs`, `/tmp/select-note-pitch-mobile.log`).
- Create tuplet ratio 5 yields 5/2, five elements types [124,33,33,33,33] in both; canvas Undo restores baseline (`check-tuplet-content.mjs`, `/tmp/tuplet-content.log`). Direct mobile creation/content remains open.
- Tuplet dialog mobile-after-desktop-selection creates same 5/2 and five element types; desktop resize/Undo restores canvas in both (`check-tuplet-content-mobile.mjs`, `/tmp/tuplet-content-mobile.log`). Mouse/keyboard input, direct touch selection remains open.
- Part reset-formatting candidate created empty part; Layout row contains no Settings button (`capture-part-reset.mjs`, `/tmp/part-reset.log`). Need populated excerpt fixture before comparing confirmation/actions.
- Populated Piano excerpt Reset all formatting confirmation matches React; desktop diff 89; No closes without action (`capture-part-reset-populated.mjs`, `part-reset-{react,vue,diff}.png`, `/tmp/part-reset-populated.log`). Earlier empty-part blocker superseded. Yes effect/mobile unverified.
- Populated excerpt Reset formatting confirmation direct mobile viewport diff 44; No closes in both (`capture-part-reset-mobile.mjs`, `/tmp/part-reset-mobile.log`). Mouse input, actual touch and Yes remain open.
- Part Reset formatting mobile touch opens confirmation and No closes in both; diff 44 (`check-part-reset-mobile-touch.mjs`, `/tmp/part-reset-mobile-touch.log`). Yes effect unverified.
- Reset formatting Yes on controlled excerpt after part name edit restores Name on part score to Piano in both (`check-part-reset-yes-name.mjs`, `/tmp/part-reset-yes-name.log`). Other formatting and mobile Yes unverified; action explicitly non-undoable.
- Reset formatting mobile touch Yes restores edited part name to Piano in both; confirmation diff 44 (`check-part-reset-yes-mobile.mjs`, `/tmp/part-reset-yes-mobile.log`). Other formatting unverified.
- Layout resize-during-drag discrepancy reproduced: Vue transient row order reverts after resize then restores on mouseup; React retains reordered display; mobile diff 306 (`check-layout-resize-drag.mjs`, `/tmp/layout-resize-drag.log`). Final order matches. Root cause still open.
- Attempted transient-order stabilization failed: deriving reordered list from model’s visible order broke it on `scoreVersion` recompute; reverted. No intended behavior change retained. Typecheck after revert passes; resize diff remains 306 (`/tmp/layout-drag-revert-typecheck.log`, `/tmp/layout-resize-drag-revert.log`).
- Fixed Layout resize-during-drag: retain active `LayoutPanelTreeModel` until pointerup so view.scoreVersion changes cannot recreate it during gesture (`LayoutPanel.vue`). Resize screenshot now matches React, diff 24; final order matches (`check-layout-resize-drag.mjs`, `/tmp/layout-resize-drag-preserve.log`). Typecheck/build pass. Pointercancel path should end model correctly; regression suite pending.
- Post Layout drag-model change: touch pointercancel, subsequent mouse drag, and Undo regression passes (`/tmp/layout-drag-cancel-regression.log`). Full E2E 70 passed/4 skipped (`/tmp/layout-drag-e2e.log`); skips remain uncovered.
- Resize-drag exact trace after fix shows same pointer events and stable visible order in React/Vue; screenshot diff 24 (`trace-layout-resize-drag-exact.mjs`, `/tmp/layout-resize-exact.log`). Earlier test showed post-resize transient reorder; preserve-model change eliminates observed discrepancy.
- System markings are non-expandable layers, not child rows (`SystemObjectsLayerTreeItem`); prior child-row hypothesis incorrect. `system-3.mscx` has only top nonselectable layer; second-layer controlled fixture already covered (`check-layout-system-second-undo.mjs`, checklist 1040). Post-model-hold regression still needed for second-layer move.
- Post active-model fix, second System texts layer drag/merge and Undo reproduce React row sequences; during-drag screenshot diff 147 (`check-layout-system-second-undo-after.mjs`, `/tmp/layout-system-second-undo-after.log`, `layout-system-second-{react,vue,diff}.png`).
- Post active-model fix, Piano staff drag and Undo reproduce React order; during-drag diff 176 (`check-layout-staff-undo-after.mjs`, `/tmp/layout-staff-undo-after.log`, `layout-staff-drag-{react,vue,diff}.png`).
- Instrument drag while resizing desktop→mobile commits and Undo restores original order in React/Vue; resized diff 24 (`check-layout-resize-drag-undo.mjs`, `/tmp/layout-resize-drag-undo.log`).
- Rest tab keyboard discrepancy diagnosed: React deferred handler dereferences null `e.currentTarget` and emits `Cannot read properties of null (reading 'querySelector')`; focus remains Beam. Vue focuses selected Rest without error; preserve accessible behavior (`check-rest-tab-keyboard-delay.mjs`, `/tmp/rest-tab-keyboard-delay.log`). Focused diff 532 remains intentional.
- Mixed Text fill alpha controlled fixture: selection contains alpha 128/64; both React/Vue show mixed color #000000 and RGB edit sets both alpha 255 (`check-mixed-alpha-edit.mjs`, `/tmp/mixed-alpha-edit.log`; baseline diff 109, edited diff 170). This matches reference but does not preserve individual alpha. Undo and same-alpha mixed selection remain unverified.
- Mixed Text fill alpha edit Undo restores original 128/64 values in React/Vue after reselection (`check-mixed-alpha-undo.mjs`, `/tmp/mixed-alpha-undo.log`).
- Mixed Text fill with same alpha 128: RGB edit retains 128 in Vue but React changes both to 255; Undo restores 128 in both (`check-mixed-same-alpha-undo.mjs`, `/tmp/mixed-same-alpha-undo.log`, edited diff 570). Preserve Vue alpha to avoid data loss; visible difference intentional.
- Mixed Text fill alpha 128/64 mobile-after-desktop-selection RGB edit matches React; diff 50. Desktop resize and Undo restore each alpha in both (`check-mixed-alpha-mobile.mjs`, `/tmp/mixed-alpha-mobile.log`). Native mobile color picker/direct touch not covered.
- Mixed Text border alpha 128/64: RGB edit yields opaque red in React/Vue; Undo restores individual alphas; edited diff 170 (`check-mixed-border-alpha-undo.mjs`, `/tmp/mixed-border-alpha-undo.log`).
- Piano staff held-touch drag triggers same browser pointercancel and no reorder in React/Vue; subsequent mouse drag and Undo match (`check-layout-staff-touch-restart.mjs`, `/tmp/layout-staff-touch-restart.log`), touch screenshot diff 201. Successful touch reorder remains unproven.
- Second System texts layer held-touch produces matching pointercancel and unchanged rows; mouse restart merges layer and Undo restores it in both (`check-layout-system-touch.mjs`, `/tmp/layout-system-touch.log`). Full screenshot diff 11,071 needs isolation; touch scrolling/selection may differ. Successful touch drag remains unverified.
- System touch screenshot diff localized to second layer selection: React already selects newly added layer before touch; Vue does not (`check-layout-system-touch-selection.mjs`, `/tmp/layout-system-touch-selection.log`). Model recreates on scoreVersion, losing `m_systemStaffToSelect`/selection; toolbar enabled-state also differs. Fix requires preserving/reconciling model selection without disrupting score selection and drag.
- React retains model selection across score changes via `onChanged`, stable row keys and `s_keepSelection`, then uses model availability/commands for toolbar. Vue currently uses `selectedId` and part-only move/remove. Fix must port selection and commands together, including remove warning; naive selection-only patch risks enabling destructive wrong action.
- Attempted React-style selection retention and model toolbar port did not restore newly added system-layer selection (diff 11,073); reverted pending lifecycle diagnosis (`/tmp/layout-system-selection-fixed.log`). No unverified toolbar changes retained.
- Selection attempt reverted; typecheck passes (`/tmp/layout-selection-revert-typecheck.log`). Vue computed model invalidates synchronously when `scoreChanged()` publishes, unlike React render/effect cycle; further diagnosis needed before retention patch.
- Additional selection diagnosis: `LayoutPanel.vue` never subscribes to `LayoutPanelTreeModel.onChanged`; `selectRow` mutates nonreactive model. This also explains stale row selection and toolbar, independent of scoreVersion. Fix needs subscription plus stable-key reload and warning-safe commands; prior attempted combined patch failed new-layer case.
- Second selection attempt retained newly added layer before touch but lost it after pointercancel/model rebuild; diff still 11,071. Reverted (`/tmp/layout-selection-second.log`); selectionVersion/scoreVersion handling requires separate reconciliation.
- Typecheck passes after second selection attempt revert (`/tmp/layout-selection-final-revert.log`). Active drag model still resets on pointercancel; computed recreation on any view snapshot can lose selection. No selection fix claimed.
- Layout model selection retained across score-only rebuild and active drag; system layer before/after touch selection now matches React, diff 11,071→64 (`/tmp/layout-selection-third.log`). Toolbar now uses model availability and warning-safe removal. Typecheck, resize-drag/Undo, staff drag/Undo pass (`/tmp/layout-selection-third-typecheck.log`, `/tmp/layout-selection-{resize,staff}-regression.log`). Toolbar removal/move and score-selection regressions still need verification.
- Layout keyboard expand/select/collapse matches React (`/tmp/layout-selection-keyboard.log`). New system layer toolbar availability, Remove/Undo and Move up/Undo match (`check-layout-system-toolbar-{remove,up}.mjs`, `/tmp/layout-system-toolbar-{remove,up}.log`). Part removal warning and score-selection regressions remain.
- Part removal with excerpt: warning text/No/Yes/Undo match React; diff 64 (`check-layout-part-remove-warning.mjs`, `/tmp/layout-part-remove-warning.log`, `layout-remove-warning-{react,vue,diff}.png`). Empty excerpt-free score intentionally has no warning.
- Score note selection selects Piano row; clicking blank clears it in React/Vue, diff 24 (`check-layout-score-selection.mjs`, `/tmp/layout-score-selection.log`). Editor build passes (`/tmp/layout-selection-build.log`).
- After Layout selection/model changes: full library passes 1,607/49 skipped (`/tmp/layout-selection-library.log`); E2E passes 70/4 skipped (`/tmp/layout-selection-e2e.log`). Skipped tests remain uncovered.
- Post selection fix, full System layer touch-cancel→mouse restart→Undo sequence diff 11,071→87; pointercancel and row order match (`/tmp/layout-system-touch-after-selection.log`).
- Model toolbar regression audit exposed Vue remove deleting Flute rather than selected system layer; fixed remove to operate on selected model item and honor layer selection, not stale part-only path. System layer Remove/Undo now matches React (`/tmp/layout-model-toolbar-system2.log`). Part removal warning, score selection diff 24, system touch selection diff 93; typecheck/build pass (`/tmp/layout-model-toolbar-{typecheck2,build}.log`). Move up/down system-row semantics, multi-selection toolbar, current full suites after this latest small fix remain unverified.
- Current Layout toolbar regression: system-layer Move up is enabled but does nothing in Vue; React merges layer, Undo restores (`/tmp/layout-final-toolbar-up.log`). System Remove/Undo and part warning/No/Yes/Undo match (`/tmp/layout-final-toolbar-remove.log`, `/tmp/layout-final-part-remove.log`). Move handler currently limits selection to PART; fix needed, plus multi-selection.
- Current code: typecheck/build pass; library 1,607 passed/49 skipped, E2E 70 passed/4 skipped (`/tmp/layout-final-{typecheck,build,library,e2e}.log`). Skips uncovered.
- System-layer Move up regression fixed: removed part-only guard; model applies valid selected-row move. React/Vue layer merge and Undo match (`/tmp/layout-system-up-fixed.log`). Typecheck/build pass (`/tmp/layout-system-up-{typecheck,build}.log`); multi-selection remains unverified.
- Shift-select Alto/Tenor then Move down previously moved only Alto; removed single-item reselection. Both apps now move both and Undo restores; selected screenshot diff 75 (`check-layout-multiselect-move.mjs`, `/tmp/layout-multiselect-{move,fixed}.log`). System layer Move up/Remove and part warning/Undo regressions pass (`/tmp/layout-multiselect-{up,system,part}.log`); typecheck/build pass. Multi-remove remains unverified.
- Shift-select Alto/Tenor, Remove and Undo match React; selected-state diff 54 (`check-layout-multiselect-remove.mjs`, `/tmp/layout-multiremove.log`). No excerpts in fixture, so warning branch not exercised.
- Multi-remove with excerpt: plural warning, No, Yes and Undo match React; dialog diff 56 (`check-layout-multiremove-warning.mjs`, `/tmp/layout-multiremove-warning.log`).
- Multi-selected Alto/Tenor Move down and Undo match React after desktop→mobile resize; selection diff 24 (`check-layout-multiselect-mobile.mjs`, `/tmp/layout-multiselect-mobile.log`). Selection/move used mouse, not direct touch.
- Removed unused part-only toolbar helpers after model command port. Current typecheck/build pass; full library 1,607 passed/49 skipped and E2E 70 passed/4 skipped (`/tmp/layout-cleanup-{typecheck,build,library,e2e}.log`); skipped coverage remains open.
- E2E four skips are viewer-only `it.runIf(app === 'viewer')` cases in editor parameterization (`test/e2e/webapps.e2e.ts`: 136,366,385,402); they are not four missing editor tests. Library 49 skips remain separate port/fixture coverage gaps.
- Mobile-after-desktop Shift-selection: touch Move down and menu Undo match React; selection diff 24 (`check-layout-multiselect-mobile-touch.mjs`, `/tmp/layout-multiselect-mobile-touch.log`). Direct touch multi-selection unverified.
- Layout Shift+ArrowDown previously failed to extend selection (diff 9,684); restored React selection behavior. Alto/Tenor selection, Move down and Undo match; diff 105 (`check-layout-shift-arrow.mjs`, `/tmp/layout-shift-arrow{,-fixed}.log`). Typecheck/build pass. RTL/Delete keyboard paths still open.
- Layout Delete/Backspace now invokes existing warning-safe removal; Shift+Arrow selection and Delete/Undo match React (`check-layout-keyboard-delete.mjs`, `/tmp/layout-keyboard-delete{,-fixed}.log`, diff 86). Keyboard Enter/Space now pass modifiers. Typecheck/build pass; keyboard warning and Backspace unverified.
- Layout Backspace multi-remove with excerpt: plural warning, No, Yes and Undo match React (`check-layout-keyboard-backspace-warning.mjs`, `/tmp/layout-keyboard-backspace-warning.log`); focused dialog diff 684, likely focus appearance but not isolated.
- Keyboard removal warning diff 664 traced to focus: React focuses No, Vue Yes. `MessageBox.vue` now focuses No for No/Yes question, preserving safe default; diff 87 and focus matches (`/tmp/layout-keyboard-warning-focus-fixed.log`). Typecheck/build pass; other MessageBox variants and Enter/Escape need regression.
- No/Yes keyboard Enter and Escape both cancel removal in React/Vue; diff 48 (`check-layout-warning-enter-escape.mjs`, `/tmp/layout-warning-enter-escape.log`). Existing direct-module MessageBox variant script cannot open Vue dialog (Vite module-instance mismatch; `/tmp/message-focus-variants-after.log`); real UI variant regression remains open.
- Real invalid-style OK MessageBox desktop/mobile: geometry and OK autofocus match React; Enter closes both (`check-message-invalid-style-enter.mjs`, `/tmp/message-invalid-enter.log`). Cancel/Ignore real UI remains unverified.
- Real old-drumset Cancel/Ignore MessageBox: Cancel autofocus and Enter cancellation match React; bounds identical (`check-kit-warning-enter.mjs`, `/tmp/kit-warning-enter.log`). Existing Ignore click path previously checked.
- Layout RTL left/right expansion/navigation now mirrors React; controlled `document.dir=rtl` keyboard test passes (`check-layout-keyboard-rtl.mjs`, `/tmp/layout-keyboard-rtl-fixed.log`). Typecheck/build pass. Actual translated RTL capture remains separate.
- Layout Escape now clears multi-selection like React; diff 10,803→71 (`check-layout-escape.mjs`, `/tmp/layout-escape{,-fixed}.log`). Typecheck/build pass.
- Layout visibility on selected multi-row previously changed only clicked row; now uses model `changeVisibilityOfSelectedRows` like React. Alto/Tenor both hidden, diff 29,337→41 (`check-layout-multivisibility.mjs`, `/tmp/layout-multivisibility{,-fixed}.log`). Edit > Undo leaves visibility unchanged in both; underlying Undo semantics not established. Typecheck/build pass.
- Multi-row visibility toggles back to shown in both (`check-layout-multivisibility-toggle.mjs`, `/tmp/layout-multivisibility-toggle.log`); source calls separate `setPartVisible` commands per selected row, but observed Edit > Undo leaves icons unchanged in both. Cause still unverified; no lower-layer change made.
- Live score probe after multi-visibility Undo confirms `Part.show()` stays false for both Alto/Tenor in React/Vue, not merely stale icons (`check-layout-visibility-model.mjs`, `/tmp/layout-visibility-model.log`). Shared behavior outside visual scope; no data-model rewrite.
- Multi-row visibility touch after desktop selection/mobile resize matches React, diff 24 (`check-layout-multivisibility-mobile.mjs`, `/tmp/layout-multivisibility-mobile.log`). Undo no-op shared as documented.
- After keyboard, MessageBox focus, multi-visibility changes: full library 1,607 passed/49 skipped (`/tmp/layout-keyboard-library.log`); E2E 70 passed/4 viewer-only parameter skips (`/tmp/layout-keyboard-e2e.log`). Build/typecheck previously passed after last code change.
- Reset all formatting Yes after changing part abbreviation X. restores Pno. in React/Vue; confirmation diff 94 (`check-part-reset-yes-abbreviation.mjs`, `/tmp/part-reset-yes-abbreviation.log`). Other formatting remains unverified.
- Reset formatting Yes restores Hide empty staves Always hide→Auto in React/Vue; confirmation diff 104 (`check-part-reset-hide.mjs`, `/tmp/part-reset-hide.log`). Other formatting remains unverified.
- Reset formatting Yes restores Only hide staves if instrument empty checkbox false→true in React/Vue; confirmation diff 87 (`check-part-reset-checkbox.mjs`, `/tmp/part-reset-checkbox.log`).
- Playback tick-synchronized capture remains open: cursor updates on requestAnimationFrame from player position (`editor/playback/playbackcontroller.ts`); pausing hides cursor, so screenshot freeze must preserve rendered frame without claiming live synchronization.
- Exact playback cursor geometry at ticks 0, 480, 1920, 3840, 7680 matches React/Vue (`check-playback-exact-geometry.mjs`, `/tmp/playback-exact-geometry.log`); live screenshot still asynchronous (diff 312), so synchronized rendered capture remains open.
- Controlled playback comparison freezes `player.position()` at 5s while still playing, allowing normal frame/cursor updates. Both tick 2400, cursor bounds x780.296875 y251.84375 w1.28125 h78.46875; screenshot diff 77 (`check-playback-frozen-time.mjs`, `/tmp/playback-frozen-time.log`, `playback-frozen-{react,vue,diff}.png`). Synthetic clock override, not native timing evidence.
- Controlled 5s playback mobile direct viewport: both tick 2400, cursor bounds x343.390625 y505.78125 w0.21875 h13.5; screenshot diff 24 (`check-playback-frozen-mobile.mjs`, `/tmp/playback-frozen-mobile.log`). Synthetic player-time override; play activated by click.
- Controlled mobile 5s playback with touch activation: cursor tick/bounds match, diff 24 (`check-playback-frozen-mobile-touch.mjs`, `/tmp/playback-frozen-mobile-touch.log`). Player time remains synthetic.
- Direct 390×844 touch selects same G5 dotted quarter at (326,507) in both; mouse menu and ratio 5 create 5/2 with five types [124,33,33,33,33] (`check-tuplet-direct-attempt.mjs`, `/tmp/tuplet-direct-attempt4.log`). Canvas equality after desktop resize/Undo false in both because baseline captured at mobile size; Undo not established by this run. Script final "passes" log is misleading; rely on explicit output.
- Corrected direct-touch Tuplet regression: baseline and post-Undo canvas both captured at 390×844; direct touch selection, 5/2 content, and Undo restoration pass React/Vue (`check-tuplet-direct-undo.mjs`, `/tmp/tuplet-direct-undo.log`).
- Mobile part-tab follow-up exercised touch on tab then right-click capture; menu bounds still match (220×62) but popup opened via explicit right-click. Touch itself not shown to open popup; action behavior remains unverified (`check-part-tab-touch-menu.mjs`, `/tmp/part-tab-touch-menu.log`).
- Direct mobile touch Select More check: at 390×844 tap (326,507) selects same G5 dotted quarter in React/Vue. React context menu lacks enabled Select > More in this note-selection state; Vue likewise More disabled, so dialog cannot open by direct-touch path (`check-select-note-direct-touch.mjs`, `/tmp/select-note-direct-touch.log`). Selection counts differ after React dialog applied due differing dialog initial filters (React 52 notes; no Vue result); do not claim parity.
- Goal audit checkpoint: objective requires broad component/state coverage, both viewports, screenshot diffs, source/style diagnostics, preserved functionality, build/tests. `visual-parity-checklist.md` has artifact-backed comparisons for many surfaces, but numerous explicit rows remain partial/unverified; no completion claim. Latest `npm run typecheck` passes; `npm run build:editor` exits 0 (`build-parity-latest.log`), with chunk-size/dynamic-import warnings. Full tests have known skipped/missing fixture coverage; latest broad suite remains prior 1,607 passed/49 skipped, E2E 70 passed/4 skipped.
- Follow-up Style Barline source probe exposed unrelated widgets: `capture-style-barlines.mjs` selects top-level Barlines page, whereas Vue `RepeatBarlinesSection.vue` maps objectName `repeatBarlinesGroupBox` nested elsewhere. Initial speculative edit targeted wrong component and was fully reverted; no UI change retained. Existing top-level Barline screenshot diff is 46 (script rerun showed 78 during incomplete probe; use capture script output as authoritative). Do not infer nested parity from that capture.
- Fresh View toolbar recheck (React at IPv6, Vue IPv4): identical dock bounds (0,732,1280×41); next page reaches 2/5 and zoom to 100% passes in both; screenshot diff 95 (`check-view-toolbar.mjs`, `/tmp/view-toolbar-recheck2.log`, `view-toolbar-{react,vue,diff}.png`). Updates earlier full-screen diff 6,787.
- View toolbar mobile direct 390×844: bounds both (0,745,390×72); page-next/100% zoom pass; full-screen diff 24 (`check-view-toolbar-mobile.mjs`, `/tmp/view-toolbar-mobile.log`, `view-toolbar-mobile-{react,vue,diff}.png`).
- View toolbar mobile remaining controls: center-page click runs; Print triggers browser print path with no DOM dialog in either app; shortcuts-help opens one dialog in both, Escape closes (`check-view-toolbar-controls.mjs`, `/tmp/view-toolbar-controls.log`). Enabled controls geometry collected; visual diff remains 24 baseline.
- Score main menu mobile recapture (390×844, viewport/fixture identical): popup bounds exactly match for File/Edit/View/Add/Format/Tools/Help (`capture-menu-all.mjs --mobile`, `/tmp/menu-mobile-current.log`). Full-screen pixel diffs: 24/23/24/24/0/0/24; majority outside menu workspace; popup-crop pixel comparison not produced in this run. Updated React host to IPv6 to prevent incorrect reference.
- Main score menu popup crops now compared directly: all seven File/Edit/View/Add/Format/Tools/Help match pixel-for-pixel on desktop and 390×844 mobile; exact popup dimensions match (`capture-menu-popup-crops.mjs`, `/tmp/menu-crop-{desktop,mobile}.log`, `menu-*-crop-diff[-mobile].png`). Reconciles low full-screen diffs with exact menu parity.
- Select-note per-filter expansion attempt aborted at initial menu: script accidentally emitted malformed `More�` accessible name due source encoding while generating (`check-select-note-each-filter.mjs`, `/tmp/select-note-each-filter.log`). No filter evidence from this run. Existing tested Same pitch results and combined-filter test remain sole evidence; do not rely on combined intersection as individual-filter coverage.
- Select-note dialog independent filter coverage: each filter tested alone with Add in React/Vue; selected counts match: notehead 1,253; pitch 38; string 1,253; note type 1,238; duration type 923; duration 911; note name 175; staff 478; voice 1,253; system 63; beat 85; measure 1 (`check-select-note-each-filter.mjs`, `/tmp/select-note-each-filter.log`). Dialog visual baseline already exact within 24 desktop pixels; filters checked and applied without dedicated checked-state screenshots.
- Mobile palette popup recapture: Add palettes bounds match (12,379,275×506.39); Clefs header menu bounds match (166,413,220×219). Popup crop pixel diffs both 0 (`probe-palette-mobile-menus.mjs`, `/tmp/palette-mobile-menus.log`, `add-palettes-mobile-crop-diff.png`, `palette-header-menu-mobile-crop-diff.png`); background full screenshot diffs 24.
- Controlled playback cursor-only pixel crops now verified identical: desktop 16×90 and mobile 12×24 crops both 0 differing pixels; full-screen diffs 77/24 occur outside cursor (`playback-frozen-cursor-crop-diff.png`, `playback-frozen-mobile-cursor-crop-diff.png`; source captures from controlled tick 2400).
- Inspector direct mobile touch: tap (326,507) selects G5 dotted-quarter note in both; note inspector full-screen diff 24 (`check-inspector-note-direct-touch.mjs`, `/tmp/inspector-note-direct-touch.log`, `inspector-note-direct-touch-{react,vue,diff}.png`). Cue size false→true by checkbox in both; Edit > Undo leaves true in both, observed shared semantics, not fixed.
- Global style source/computed audit: React/Vue share `style.css`; palette/layout/EditStyle CSS byte-identical; Inspector CSS has only two intentional Vue differences (`.inspector-general-controls-disabled`, text input selector). React `#app-root{display:contents}` vs Vue flex host plus 56-line Vue structural/teleport adaptation in `editor/style.css`. At loaded score state computed values match for design tokens `--bg/--panel/--fg/--muted/--border/--hover/--active/--accent/--page-shadow/--radius/--page-gap/--backdrop/--danger/--selected`, and body/chrome/toolbar/panel/viewport typography/colors (`probe-global-style-parity.mjs`, `/tmp/global-style-score.log`). Home screenshot exact styling unaffected by this sample; remaining selectors/widgets/theme and token usage audit open.
- Clefs header menu mobile recapture: exact bounds (166,413,220×219), pixel-identical crop (0 diff); menu text/layout identical: Hide palette, Insert new palette, Enable editing, Reset palette, Save palette… (`check-palette-header-actions-mobile.mjs`, `/tmp/palette-header-actions-mobile2.log`, `palette-header-menu-mobile-crop-diff.png`). Attempted automated Enable editing action failed to resolve menu item role/name, so action regression not added.
- Isolated View toolbar crops are pixel-identical: desktop 1280×41 and mobile 390×72, zero diffs (`view-toolbar-crop-diff.png`, `view-toolbar-mobile-crop-diff.png`). Full-screen 95/24 diffs entirely outside toolbar.
- Layout multi-select regression rerun: Shift-select Alto/Tenor, Move down, Remove warning No/Yes and Undo all match React/Vue. Resulting order after Move down is Soprano/Bass/Alto/Tenor; Remove leaves Soprano/Bass; Undo restores original. Screenshot diffs 76 move, 85 warning, 103 remove-selected (`check-layout-multiselect-move.mjs`, `check-layout-multiselect-remove.mjs`, `check-layout-multiremove-warning.mjs`; `/tmp/layout-multiselect-move-now.log`, `/tmp/layout-multiselect-remove-now.log`, `/tmp/layout-multiremove-warning-now.log`). Supersedes prior open multi-remove status.
- New score creation interaction rerun: add Flute, enter title “Parity new score”, Done creates score/tab in React/Vue at desktop and mobile. Post-create screenshot diff 109 desktop/0 mobile (`check-newscore-create.mjs`, `/tmp/newscore-create-current.log`, `newscore-created-{1280,390}-{react,vue,diff}.png`). Vue logs one generic 404 resource, not identified; creation succeeded.
- Part Reset all formatting combined regression: part name Changed piano, abbreviation XX, Hide empty staves Always hide, individual-staff checkbox false; confirm Yes restores Name Piano, abbreviation Pno., Auto hide and checkbox true in both apps. Desktop confirmation diff 96 (`check-part-reset-combined.mjs`, `/tmp/part-reset-combined.log`). Mobile touch Yes separately restores Name Piano, diff 44 (`check-part-reset-yes-mobile.mjs`, `/tmp/part-reset-yes-mobile-current.log`).
- Current verification after ongoing parity work: `npm run typecheck` pass; `npm run build:editor` exit 0 (`/tmp/parity-final-build.log`). Focused library suites `inspector.test.ts`, `newscore.test.ts`: 63 passed, 6 skipped across 3 passed files/1 skipped (`/tmp/parity-focused-final.log`). Full library command twice timed out (5s wrapper then 60s runner; `/tmp/parity-final-library.log` lacks result). E2E: 69 passed, 4 skipped, 1 failed after 520s; save/reload/home card test expected `[My song]` but observed extra `Untitled score` (`/tmp/parity-final-e2e.log`, `test/e2e/editor.e2e.ts:1795`). This is a real unresolved failure; no broad pass claim.
- E2E save/reload test failure investigated: isolated rerun passed twice (1 passed/45 skipped each; `/tmp/save-e2e-rerun.log`, `/tmp/save-e2e-rerun2.log`). Full suite failure at same assertion (extra Untitled score) is nondeterministic persistence/IndexedDB state interference; keep full-suite failure documented pending deterministic root cause.
- Full library suite completed with constrained workers: 69 files passed; 1,607 passed/49 skipped (`npx vitest run --dir test --reporter=dot --maxWorkers=2`, `/tmp/parity-final-library2.log`, 296s). Full E2E rerun also passes: 2 files, 70 passed/4 skipped (`npm run test:e2e -- --reporter=dot --maxWorkers=2`, `/tmp/parity-final-e2e2.log`, 512s). This supersedes transient flaky full-E2E failure; skips remain uncovered viewer-only parameter cases per prior notes.
- View > Toolbars submenu mobile 390×844: same popup at (300.25,348), 220×114; crop comparison follows full-view diff 24.
- View > Toolbars submenu mobile crop is pixel-identical (0 diff); full-screen diff 24 outside popup (`check-menu-submenu-mobile.mjs`, `/tmp/menu-submenu-mobile.log`, `menu-submenu-mobile-crop-diff.png`). Escape/Left closes navigation in both.
- Dark-mode home comparison at 1440×900 via `prefers-color-scheme: dark`: React/Vue tokens and body background match; screenshot pixel diff 0 (`capture-home-dark.mjs`, `/tmp/home-dark.log`, `home-dark-{react,vue,diff}.png`).
- Dark-mode main score menu comparison: all seven menu popup crops (File/Edit/View/Add/Format/Tools/Help) match exactly, zero pixels across React/Vue (`capture-menu-dark.mjs --dark`, `/tmp/menu-dark.log`, `menu-*-dark-crop-diff.png`). Desktop score screenshots, CSS prefers-color-scheme dark.
- Dark-mode score workspace at 1280×800: viewport/panel bounds match (300,142,980×590; 0,110,300×622), full screenshot diff 80 (`capture-score-dark.mjs`, `/tmp/score-dark.log`, `score-{react,vue}-dark.png`, `score-dark-diff.png`).
- About dialog dark-mode test (prefers-color-scheme dark): desktop and mobile bounds exact; screenshot diffs 7/8 (`capture-about-dark.mjs`, `/tmp/about-dark.log`, `about-{react,vue}-dark.png`, `about-diff-dark.png`). Escape closes in both.
- Preferences General dark mode at 1280×800: dialog controls/actions pass and full screenshot diff 0 (`capture-preferences-dark.mjs`, `/tmp/preferences-dark.log`, `preferences-dark-{react,vue,diff}.png`).
- New Score instrument chooser dark mode at 1280×800: bounds (120,50,1040×700), add/remove/close interactions match; screenshot diff 0 (`capture-newscore-dark.mjs`, `/tmp/newscore-dark.log`, `newscore-choose-dark-{react,vue,diff}.png`).
- Measures per system dialog dark mode: exact bounds at desktop/mobile; diff 25 desktop and 0 mobile; checkbox and Cancel pass (`capture-breaks-dark.mjs`, `/tmp/breaks-dark.log`, `breaks-dark-{react,vue,diff}*.png`).
- Transpose dark-mode review correction: the apparent full-screen mismatch (11,215 desktop/111 mobile) comes from React’s active range selection behind dialog vs no selection in Vue, not theme styling. Dialog crop itself is pixel-identical (0 diff; `transpose-dark-dialog-diff.png`). Bounds match; diatonic selection and Cancel pass (`capture-transpose-dark.mjs`, `/tmp/transpose-dark.log`).
- Project Properties dark mode: desktop/mobile bounds exact; screenshot diff 53 desktop, 0 mobile. New-property row and Escape-close checks pass (`capture-project-properties-dark.mjs`, `/tmp/project-properties-dark.log`, `project-properties-dark-{react,vue,diff}*.png`).
- Continued checks: `npm run typecheck` and `npm run build:editor` pass (`/tmp/parity-cont-typecheck.log`, `/tmp/parity-cont-build.log`); build emits bundler timing notices.
- View > View mode submenu desktop: both popup bounds (300.25,409), 227.66×114; Left/Escape pass; crop differs 0 after integer crop (`check-viewmode-submenu.mjs`, `/tmp/viewmode-submenu.log`, `menu-submenu-viewmode-crop-diff.png`).
- View > View mode submenu mobile: same bounds (300.25,409), 227.66×114; browser clips popup at right edge identically; visible clipped crop diff 0; Left/Escape pass (`check-viewmode-submenu-mobile.mjs`, `/tmp/viewmode-submenu-mobile.log`).
- Dark-mode home mobile at 390×844: same tokens/body background; screenshots pixel-identical (diff 0, `capture-home-dark-mobile.mjs`, `/tmp/home-dark-mobile.log`, `home-dark-mobile-{react,vue,diff}.png`).
- New Score chooser dark mode mobile (390×844): exact bounds (16,16,358×812), add/remove/close pass, screenshot diff 0 (`capture-newscore-dark-mobile.mjs`, `/tmp/newscore-dark-mobile.log`, `newscore-choose-dark-mobile-{react,vue,diff}.png`).
- Palette tab menu desktop: visible popup crop pixel-identical (0 diff) at top-left crop; expand/collapse all actions pass in both apps (`check-panel-menu.mjs`, `/tmp` prior evidence; `panel-menu-crop-{react,vue,diff}.png`). Full-screen diffs reflect workspace state, not popup.
- Palette tab menu dark mode desktop: popup crop pixel-identical (0 diff); expand/collapse actions pass. Full-screen diff 62 lies outside crop (`check-panel-menu-dark.mjs`, `/tmp/panel-menu-dark.log`, `panel-menu-dark-crop-diff.png`).
- Custom palette Properties dialog dark mode desktop: exact bounds (480,207.73,320×384.52), dialog crop pixel-identical (0 diff), Cancel restores name and Escape closes; full-screen diff 56 outside dialog (`check-palette-properties-dark.mjs`, `/tmp/palette-properties-dark.log`, `palette-properties-dark-crop-diff.png`).
- Layout removal warning dark mode: No cancels, Yes removes selected rows, Undo restores rows in React/Vue. Confirmation dialog crop pixel-identical (0 diff; `layout-warning-dark-crop-diff.png`); full screenshots diff 56 outside dialog. Evidence `check-layout-warning-dark.mjs`, `/tmp/layout-warning-dark.log`.
- Palette header keyboard navigation on mobile 390×844: ArrowDown to Key signatures, Right expand, Left collapse, Home to Clefs pass in React/Vue (`check-palette-keyboard-mobile.mjs`, `/tmp/palette-keyboard-mobile.log`).
- Layout mobile Add instruments flow at 390×844: Add menu bounds (12,375,314.38×71), Instruments dialog (16,16,358×812); screenshot diff 0. Menu Escape focus restoration, select Flute/Add, Cancel pass in React/Vue (`check-layout-add-mobile.mjs`, `/tmp/layout-add-mobile.log`, `layout-instruments-mobile-{react,vue,diff}.png`).
- Layout settings direct-touch mobile probe: instrument/staff/system dialogs open by `.tap()` in both; bounds match. Instrument/staff full screenshots diff 24 each, system 318; crop diff pending. Evidence `check-layout-settings-touch.mjs`, `/tmp/layout-settings-touch.log`.
- Page Settings native-touch mobile: dialog bounds (16,16,358×812) match; Landscape tap, state check and Cancel pass; screenshot diff 0 (`check-page-settings-touch.mjs`, `/tmp/page-settings-touch.log`, `page-settings-touch-diff-mobile.png`).
- Layout native-touch mobile: add Flute via Instruments dialog, add System markings, then Undo markings and Undo Flute all pass in both React/Vue (`check-layout-system-touch.mjs`, `/tmp/layout-system-touch.log`).
- Layout expanded Piano native-touch mobile: two taps expand Piano; Treble clef, Bass clef, Add staff rows appear in both; full-screen diff 124 (`check-layout-expand-touch.mjs`, `/tmp/layout-expand-touch.log`, `layout-expanded-touch-{react,vue,diff}.png`).
- Score toolbar Add native-touch mobile: Add popup opens and tapping Measures opens submenu in React/Vue (`check-toolbar-add-touch.mjs`, `/tmp/toolbar-add-touch.log`). Escape dismissal not established: menu count remains 2; leave that behavior open.
- Layout tree native-touch mobile: double-tap Piano expands row; tap Treble clef selects it; React/Vue aria-expanded/aria-selected states match (`check-layout-touch-select.mjs`, `/tmp/layout-touch-select.log`).
- Clefs palette header menu native-touch mobile: opened by touch; bounds match (166,413,220×219), menu crop diff 0; full screenshot diff 24 outside popup (`check-palette-menu-touch.mjs`, `/tmp/palette-menu-touch.log`, `palette-header-touch-crop-diff.png`). Enable editing toggle not verified.
- View toolbar native-touch mobile: Page next tap advances to page 2/5; zoom select changes to 100%; toolbar bounds (0,745,390×72); screenshot diff 24 (`check-view-toolbar-touch.mjs`, `/tmp/view-toolbar-touch.log`, `view-toolbar-mobile-touch-{react,vue,diff}.png`).
- Style dialog native-touch mobile: bounds match (16,16,358×812); Clefs page selection and Escape pass, screenshot diff 0 (`check-style-touch.mjs`, `/tmp/style-touch.log`, `style-touch-diff-mobile.png`).
- Export dialog native-touch mobile: exact bounds (16,124.25,358×595.5), screenshot diff 0; Clear selection disables Export, Select all enables it, Cancel closes in React/Vue (`check-export-touch.mjs`, `/tmp/export-touch.log`, `export-touch-diff-mobile.png`).
- Parts dialog native-touch mobile: bounds (16,143,358×558) match; Create new part increments options, Escape edit then Close works; screenshot diff 0 (`check-parts-touch.mjs`, `/tmp/parts-touch.log`, `parts-touch-diff-mobile.png`).
- Save Score native-touch mobile: blank filename disables Save; Escape closes dialog. Bounds exact (16,312.52,358×218.97); screenshot diff 11 (`check-save-score-touch.mjs`, `/tmp/save-score-touch.log`, `save-score-touch-diff-mobile.png`).
- Transpose dialog native-touch mobile: bounds match (16,112.8,358×618.39); diatonic radio tap/check and Cancel pass; screenshot diff 120 (`check-transpose-touch.mjs`, `/tmp/transpose-touch.log`, `transpose-touch-diff-mobile.png`).
- Preferences native-touch mobile: Save & publish, Note input, Import, Web tabs compared; crops/screens diff 0/0/0/19. Autosave toggle and Escape close pass (`check-preferences-touch.mjs`, `/tmp/preferences-touch.log`).
- Customize toolbar direct-touch desktop (1280×800 with touch-enabled context): popup bounds match (668.70,108,340×560), 51 options; tap toggles pad-note-64 and adds/removes toolbar button; Escape closes/restores focus. Initial screenshot diff 84 (`check-customise-touch.mjs`, `/tmp/customise-touch.log`, `customise-touch-{react,vue,diff}.png`).
- Latest full regression rerun: `npm test -- --reporter=dot --maxWorkers=2` 1,607 passed/49 skipped, 69 files; E2E 70 passed/4 skipped, 2 files (`/tmp/parity-latest-library.log`, `/tmp/parity-latest-e2e.log`). E2E contains logged score-import resource errors; tests still pass; skip reasons require audit.
- New Score info native-touch mobile: key signature G, tempo marking/BPM 135, common time, pickup duration 2, title persistence through Back/Next, popover Escape and Cancel pass in React/Vue. Bounds (17,65,356×706.81); screenshot diff 0 (`check-newscore-info-touch.mjs`, `/tmp/newscore-info-touch.log`).
- New Score Create from template native-touch mobile: category selection, Next, Back, Cancel pass; outer bounds (16,16,358×812), template panel bounds match, screenshot diff 0 (`check-newscore-template-touch.mjs`, `/tmp/newscore-template-touch.log`, `newscore-template-touch-diff-mobile.png`).
- New Score instrument chooser native-touch mobile: add Flute, remove Flute, Cancel pass; bounds (16,16,358×812), screenshot diff 0 (`check-newscore-choose-touch.mjs`, `/tmp/newscore-choose-touch.log`).
- Playback toolbar native-touch mobile: Play/Pause taps start/stop playback in React/Vue; cursor appears at y=505.78, width .219; x differs .45px at sampled time (`check-playback-touch.mjs`, `/tmp/playback-touch.log`). Live clock alignment only spot-sampled.
- Inspector selected-note mobile direct-touch: Cue size toggles false→true; Edit > Undo leaves checked in both apps (shared behavior); score-page bounds match; screenshot diff 24 (`check-inspector-cue-touch.mjs`, `/tmp/inspector-cue-touch.log`, `inspector-note-cue-touch-diff.png`).
- Inspector Appearance popup native-touch mobile: direct-tap selected note, Appearance opens; Leading space accepts `1,5` as `1.5`, ArrowUp increments to 2; Escape closes/restores focus. Full screenshot diff 24 (`check-inspector-appearance-touch.mjs`, `/tmp/inspector-appearance-touch.log`).
- Playalong native-touch mobile with deterministic `?playalong-input=test-melody`: listen reaches measure 3, practice toggle toggles, Next advances to 4, stop hides status in both React/Vue (`check-playalong-touch.mjs`, `/tmp/playalong-touch.log`). Microphone path/timing and calibration remain unverified.
- Note-input toolbar menu native-touch mobile: arrow button opens menu with multiple menu items; Escape closes in React/Vue (`check-note-toolbar-touch.mjs`, `/tmp/note-toolbar-touch.log`).
- Add > Measures > Insert at end of score native-touch mobile: count input accepts 3; Cancel closes; dialog bounds match (16,352.91,358×138.19), screenshot diff 28 (`check-measures-count-touch.mjs`, `/tmp/measures-count-touch.log`).
- Palette search native-touch mobile: tap search, query `treble` yields seven results and focus; Escape clears/restores Add palettes focus in React/Vue; screenshot diff 24 (`check-palette-search-touch.mjs`, `/tmp/palette-search-touch.log`).
- Home mobile fresh recheck: both icon-font faces loaded after `document.fonts.ready`; React/Vue screenshot diff 0 at 390×844 (`check-home-icon-mobile.mjs`, `/tmp/home-icon-mobile.log`, `home-icon-{react,vue,diff}.png`). Supersedes stale mobile capture residual icon differences; ensure font readiness before future screenshots.
- Home empty list view direct-touch desktop: List radio switches grid→list, Grid returns; aria-checked states match; screenshot pixel-identical (0 diff) at 1280×800 (`check-home-list-view.mjs`, `/tmp/home-list-view.log`, `home-list-{react,vue,diff}.png`).
- Home empty list view: desktop click/tap parity verified, pixel diff 0. Stored-score row capture remains blocked: seeding IndexedDB did not update live score query before capture; no claim for populated grid/list row states.
- Clefs palette header direct touch now verified: Enable editing and Palette properties actions both dismiss/open identically (Properties uses custom section, not native dialog); menu bounds match desktop/mobile at 220×219; expanded-mobile full screenshot diff 24 (`check-palette-header-properties-mobile.mjs`, `/tmp/palette-edit-touch.log`, `palette-expanded-mobile-diff.png`). Test now uses native Playwright touch, not hover/mouse.
- Parts mobile-touch probe: duplicating/opening default Piano then selecting Delete yields no confirmation and leaves Parts dialog unchanged in React/Vue (`check-parts-confirm-touch.mjs`, `/tmp/parts-confirm-touch-recheck.log`). This only covers default part; custom-part deletion confirmation still unverified. Earlier assumed Yes/No dialog was wrong, test revised to report actual state.
- Validation rerun after probes: library 69 files, 1,607 pass/49 skipped; verbose skip names logged in `/tmp/parity-cont-final-library-verbose.log`. Skips are fixture-dependent imported/export vtests and PDF drawing tests, not UI parity. E2E rerun: 70 pass/4 skipped; exact skips logged in `/tmp/parity-cont-final-e2e.log` (editor empty-state, playback cursor, continuous layout, embed tests skipped by `webapps.e2e.ts` branches).
- Layout mobile multi-remove attempted with selected Soprano fixtures; toolbar Remove remained disabled, no dialog shown. Earlier successful desktop multi-remove covers action; touch warning/cancel remains unverified.
- Layout > Piano settings > Replace instrument mobile touch: identical Select instrument dialog in React/Vue, (16,16) 358×812, 32 options; Cancel closes; full screenshot diff 0 (`check-layout-replace-touch.mjs`, `/tmp/layout-replace-touch.log`, `layout-replace-touch-{react,vue,diff}.png`). Selection/apply remains untested.
- Replace instrument mobile touch complete: selecting Flute + OK replaces Piano in both apps; Layout rows match (`layout-replaced-touch-{react,vue}.png`), resulting full screenshot diff 24 outside UI state (`check-layout-replace-touch.mjs`, `/tmp/layout-replace-touch.log`). Dialog itself remains exact 0 diff.
- Populated Home grid/list seeded by intercepting Dexie DB open before app initialization. React/Vue show same New score + Parity demo row, title/composer, timestamp, 1.0 MB, remove action; list screenshot diff 41 pixels at 1280×800 (`check-home-populated-list.mjs`, `/tmp/home-populated-list.log`, `home-populated-{grid,list}-{react,vue}.png`). Clear-list Cancel preserves row; Remove from list removes file score directly in both. UI behavior tested; screenshot full-diff artifact includes backdrop because capture tested modal state? list captures were pre-modal.
- Home populated list mobile: 390×844 React/Vue screenshots exact (0 pixel diff); seeded Parity demo and New score rows align. Search “Parity” retains row; no-match shows “No results found”; Clear list Cancel preserves score; removing imported fixture deletes row without warning (`check-home-populated-list-mobile.mjs`, `/tmp/home-populated-list-mobile.log`, `home-populated-{grid,list}-mobile-{react,vue}.png`, `home-search-mobile-{react,vue}.png`).
- Home populated grid desktop 0-pixel diff (`check-home-populated-grid.mjs`, `home-populated-grid-{react,vue,diff}.png`). Home populated mobile list diff 0; search-result screenshot diff 0; empty search-result state matched text. Clear-list confirmation mobile bounds match (358×177.14 at 16,333.42), full screenshot diff 0 (`check-home-clear-confirm-mobile.mjs`).
- Clefs More popup direct mobile touch: React/Vue bounds both (12,537), 275×319.59, 25 cells; cells and Add disabled in both current score context; Escape closes; full mobile screenshot diff 24 (`check-palette-more-touch.mjs`, `/tmp/palette-more-touch.log`, `palette-more-touch-{react,vue,diff}.png`). Add selection remains blocked by identical disabled state.
- New Score creation rendering diff: after adding Flute and title, screenshot pixelmatch mobile 0/329,160; desktop 109/1,024,000 (`newscore-created-{390,1280}-{react,vue}.png`, diff artifacts via `check-newscore-created-diff.mjs`). Desktop delta sparse, no structural mismatch apparent; likely dynamic status/render timing, needs inspect if reproduced.
- Diagnosed 109-pixel desktop new-score diff: score-page/status geometry identical; status label includes nondeterministic layout duration (React 121 ms vs Vue 73 ms in inspection run), causing text-only variance. No CSS correction warranted; exact comparison requires normalizing dynamic timing text.
- New-score desktop diff root cause fixed: Vue notation tab used literal `×`, React uses `ICON_CODES.CLOSE_X_ROUNDED`; imported/reference glyph in `NotationSwitchPanel.vue`. Fresh create flow passed at desktop/mobile (`check-newscore-create.mjs`); mobile diff remains 0. Desktop pixelmatch diff now 93, localized only to status timing text (layout duration varies per run); tab close-glyph region matches. Typecheck/build pass (`/tmp/newscore-close-{typecheck,build}.log`).
- Home created-score removal confirmation mobile: identical text and bounds (16,342.52,358×158.95); dialog screenshot diff 0. Cancel retains score; Remove deletes it in both (`check-home-created-delete-mobile.mjs`, `/tmp/home-created-delete-mobile.log`, `home-created-delete-mobile-{react,vue,diff}.png`).
- Custom palette properties mobile touch: create Touch custom, open header menu, open Palette properties; bounds both (35,229.73,320×384.52), full screenshot diff 0; Cancel closes. New palette is editable by default in both, so this probe does not claim Enable editing toggle coverage (`check-custom-palette-properties-touch.mjs`, `/tmp/custom-palette-properties-touch.log`, `custom-palette-properties-touch-{react,vue,diff}.png`).
- Custom palette delete mobile touch: Hide/Delete confirmation both apps text identical, bounds (16,367.72,358×108.56), screenshot diff 0. Cancel preserves custom palette; Delete permanently removes it (`check-custom-palette-delete-touch.mjs`, `/tmp/custom-palette-delete-touch.log`, `custom-palette-delete-touch-{react,vue,diff}.png`). Hide action itself remains untested.
- Custom palette Hide mobile touch: palette leaves active tree and appears in Add palettes popup in React/Vue (`check-custom-palette-hide-touch.mjs`, `/tmp/custom-palette-hide-touch.log`).
- Palette tab menu direct mobile touch: both settings toggles (Single-click to open; Open only one at a time) toggle and restore in React/Vue; menu full screenshot diff 0, bounds 228.16×158 (`check-panel-menu-touch.mjs`, `/tmp/panel-menu-touch.log`). Expand/collapse already tested on desktop; Close action still open.
- Palette tab-menu Close action native mobile touch removes Palettes tab and selects Layout in React/Vue; dock remains (0,298,300×447), tab labels Layout/Properties match (`check-panel-menu-close-touch.mjs`, `/tmp/panel-menu-close-touch.log`).
