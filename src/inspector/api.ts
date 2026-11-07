/*
 * SPDX-License-Identifier: GPL-3.0-only
 * MuseEncore — port of MuseScore Studio (https://github.com/musescore/MuseScore)
 * Copyright (C) 2021-2026 MuseScore Limited and others
 *
 * Public library API of the properties panel (inspector; re-exported by src/index.ts): the sections of MuseScore's
 * Properties panel for the selection of a score (InspectorListModel) as plain data, and the score changes for a
 * new property value (to be applied by the editor in one undo command).
 */

import type { Score } from '../engraving/dom/score'
import {
    AbstractInspectorModel, InspectorModelType, InspectorSectionType, MeasurementUnits, type InspectorChange,
} from './abstractinspectormodel'
import { AbstractInspectorProxyModel } from './abstractinspectorproxymodel'
import { AppearanceSettingsModel } from './general/appearance/appearancesettingsmodel'
import { GeneralSettingsModel } from './general/generalsettingsmodel'
import { InspectorListModel } from './inspectorlistmodel'
import type { InspectorValue, PropertyItem } from './propertyitem'
import { qtrc } from '../framework/global/translation'
import { Pid } from '../engraving/dom/property'
const tr = (key: string, disambiguation = ''): string => qtrc('inspector', key, disambiguation)

export type { InspectorChange } from './abstractinspectormodel'
export type { InspectorValue } from './propertyitem'
export { inspectorSelectionProperties, type InspectorSelectionProperty } from './inspectorselectionproperties'

export interface InspectorPropertyInfo {
    /** the property id (Pid) */
    pid: number
    /** the value as the UI shows it; null if undefined (different values in the selection) */
    value: InspectorValue | null
    isUndefined: boolean
    isEnabled: boolean
    isVisible: boolean
    /** the property has a style value ("Set as style") */
    isStyled: boolean
    /** differs from the default (the reset button is shown) */
    isModified: boolean
    /** property-specific editor options supplied by model flags */
    options?: { value: number | boolean | string; text?: string; title?: string }[]
    optionsMode?: 'select' | 'radio'
    editor?: 'color'
    hidden?: boolean
    label?: string
    invert?: boolean
    min?: number
    max?: number
    step?: number
    decimals?: number
    unit?: string
    enabled?: boolean
    point?: boolean
    showIntervalType?: boolean
    showMore?: boolean
    numberFormat?: string
}

export interface InspectorModelInfo {
    /** identifies the model within its parent (for InspectorPropertyRef.path): the model type name, or "appearance" */
    key: string
    /** InspectorSectionType name, e.g. "SECTION_GENERAL" (sections only, else "") */
    sectionType: string
    /** InspectorModelType name, e.g. "TYPE_NOTE" ("TYPE_UNDEFINED" for sections) */
    modelType: string
    /** the translated title */
    title: string
    /** muse::ui::IconCode name, '' if none */
    icon: string
    isEmpty: boolean
    /** the model's property items by their C++ names (e.g. "isVisible", "offset") */
    properties: Record<string, InspectorPropertyInfo>
    /** further model state (availability flags, option lists, "measurementUnits": "sp" | "mm" | "") */
    flags: Record<string, unknown>
    /** sub models (proxy models: by type; General: "appearance") */
    models: InspectorModelInfo[]
    /** proxy models: the sub model to show first (InspectorModelType name) */
    defaultSubModelType: string
}

/** a property item: section type, the keys of the sub models, the property name */
export interface InspectorPropertyRef {
    section: string
    path: readonly string[]
    property: string
}

const s_listModels = new WeakMap<Score, InspectorListModel>()

function listModel(score: Score): InspectorListModel {
    let m = s_listModels.get(score)
    if (!m) {
        m = new InspectorListModel()
        s_listModels.set(score, m)
    }
    return m
}

function propertyInfo(p: PropertyItem): InspectorPropertyInfo {
    const v = p.value()
    return {
        pid: p.propertyId(), value: v === undefined ? null : v, isUndefined: p.isUndefined(), isEnabled: p.isEnabled(),
        isVisible: p.isVisible(), isStyled: p.isStyled(), isModified: p.isModified(),
    }
}

function units(u: unknown): unknown {
    return u === MeasurementUnits.UNITS_SPATIUM ? 'sp' : u === MeasurementUnits.UNITS_MM ? 'mm' : u === MeasurementUnits.UNITS_UNKNOWN ? '' : u
}

function subModels(model: AbstractInspectorModel): { key: string; model: AbstractInspectorModel }[] {
    if (model instanceof AbstractInspectorProxyModel) {
        return model.modelList().map(m => ({ key: InspectorModelType[m.modelType()], model: m }))
    }
    if (model instanceof GeneralSettingsModel) {
        return [{ key: 'appearance', model: model.appearanceSettingsModel() }]
    }
    return []
}

function modelInfo(key: string, model: AbstractInspectorModel, isSection: boolean): InspectorModelInfo {
    const properties: Record<string, InspectorPropertyInfo> = {}
    for (const [name, p] of Object.entries(model.properties())) {
        properties[name] = propertyInfo(p)
        if (p.propertyId() === Pid.OFFSET) properties[name].point = true
        properties[name].label = name.replace(/^is(?=[A-Z])/, '').replace(/([a-z])([A-Z])/g, '$1 $2')
    }
    const flags = { ...model.flags() }
    if (model.modelType() === InspectorModelType.TYPE_BARLINE) flags.__barlineTypeOptions = [
        { value: 0x1, text: tr('Single barline') }, { value: 0x2, text: tr('Double barline') },
        { value: 0x10, text: tr('Dashed barline') }, { value: 0x20, text: tr('Final barline') },
        { value: 0x80, text: tr('Dotted barline') }, { value: 0x100, text: tr('Reverse final barline') },
        { value: 0x200, text: tr('Heavy barline') }, { value: 0x400, text: tr('Heavy double barline') },
        { value: 0x4, text: tr('Left (start) repeat barline') }, { value: 0x8, text: tr('Right (end) repeat barline') },
        { value: 0x40, text: tr('Right and left (end/start) repeat barline') },
    ]
    if (model.properties().frameType) flags.__frameTypeOptions = [
        { value: 0, text: tr('None', 'text frame type') }, { value: 1, text: tr('Rectangle', 'text frame type') },
        { value: 2, text: tr('Circle', 'text frame type') },
    ]
    if ([InspectorModelType.TYPE_ARTICULATION, InspectorModelType.TYPE_TAPPING].includes(model.modelType())) {
        flags.__placementOptions = [
            { value: 2, text: tr('Auto') }, { value: 0, text: tr('Above') }, { value: 1, text: tr('Below') },
        ]
    }
    if ([InspectorModelType.TYPE_TEMPO, InspectorModelType.TYPE_A_TEMPO, InspectorModelType.TYPE_TEMPO_PRIMO].includes(model.modelType())) {
        properties.followText.label = tr('Follow written tempo')
        properties.tempo.hidden = model.properties().followText.value() !== false
        properties.tempo.isVisible = model.properties().followText.value() === false
    }
    if (model.modelType() === InspectorModelType.TYPE_FERMATA || [InspectorModelType.TYPE_SLUR, InspectorModelType.TYPE_TIE,
        InspectorModelType.TYPE_LAISSEZ_VIB, InspectorModelType.TYPE_PARTIAL_TIE, InspectorModelType.TYPE_HAMMER_ON_PULL_OFF].includes(model.modelType())) {
        flags.__verticalPlacementOptions = [
            { value: 0, text: tr('Auto') }, { value: 1, text: tr('Above') }, { value: 2, text: tr('Below') },
        ]
    }
    if (model.modelType() === InspectorModelType.TYPE_ACCIDENTAL) flags.__accidentalBracketOptions = [
        { value: 0, text: tr('None', 'bracket type') }, { value: 1, text: tr('Parentheses', 'bracket type') },
        { value: 2, text: tr('Brackets', 'bracket type') },
    ]
    for (const [name, p] of Object.entries(model.properties())) {
        const optionFlag = name === 'placement' ? '__placementOptions' : name === 'placementType' || name === 'direction' ? '__verticalPlacementOptions'
            : name === 'headGroup' ? 'noteheadGroups' : name === 'headSystem' ? 'possibleHeadSystemTypes'
            : name === 'lineStyle' ? 'possibleLineStyles' : name === 'numberType' ? 'possibleNumberTypes'
                : name === 'bracketType' ? (model.modelType() === InspectorModelType.TYPE_TUPLET ? 'possibleBracketTypes' : '')
                    : name === 'mode' && model.modelType() === InspectorModelType.TYPE_KEYSIGNATURE ? '__keySignatureModeOptions'
                        : name === 'frameType' ? '__frameTypeOptions'
                            : name === 'type' && model.modelType() === InspectorModelType.TYPE_BARLINE ? '__barlineTypeOptions'
                                : name === 'bracketType' && model.modelType() === InspectorModelType.TYPE_ACCIDENTAL ? '__accidentalBracketOptions'
                : model.modelType() === InspectorModelType.TYPE_GLISSANDO && name === 'subtype' ? 'glissandoTypes'
                    : model.modelType() === InspectorModelType.TYPE_GLISSANDO && name === 'glissandoStyle' ? 'glissandoStyles'
                        : model.modelType() === InspectorModelType.TYPE_GLISSANDO && name === 'lineStyle' ? 'possibleLineStyles'
                    : model.modelType() === InspectorModelType.TYPE_VOLTA && name === 'lineStyle' ? 'possibleLineStyles'
                        : model.modelType() === InspectorModelType.TYPE_VOLTA && ['beginHookType', 'endHookType'].includes(name) ? 'hookTypes'
                            : model.modelType() === InspectorModelType.TYPE_MARKER && name === 'markerType' ? 'markerTypes'
                                : model.modelType() === InspectorModelType.TYPE_JUMP && name === 'jumpTo' ? 'jumpToOptions'
                                    : model.modelType() === InspectorModelType.TYPE_JUMP && name === 'playUntil' ? 'playUntilOptions'
                                        : model.modelType() === InspectorModelType.TYPE_JUMP && name === 'continueAt' ? 'continueAtOptions'
                                    : model.modelType() === InspectorModelType.TYPE_BEND && name === 'bendType' ? 'bendTypes'
                                : model.modelType() === InspectorModelType.TYPE_BEND && name === 'bendCurveType' ? 'bendCurveTypes'
                                : model.modelType() === InspectorModelType.TYPE_BEND && name === 'showHoldLine' ? 'showHoldLineOptions'
                                    : model.modelType() === InspectorModelType.TYPE_OTTAVA && name === 'ottavaType' ? 'ottavaTypes'
                                : model.modelType() === InspectorModelType.TYPE_OTTAVA && name === 'lineStyle' ? 'possibleLineStyles'
                                    : model.modelType() === InspectorModelType.TYPE_VIBRATO && name === 'vibratoType' ? 'vibratoTypes'
                                : model.modelType() === InspectorModelType.TYPE_CHORD_BRACKET && name === 'bracketRightSide' ? 'bracketPlacementOptions'
                                : model.modelType() === InspectorModelType.TYPE_CHORD_BRACKET && name === 'hookPos' ? 'hookPositionOptions' : ''
        const options = optionFlag && flags[optionFlag]
        if (model.sectionType() === InspectorSectionType.SECTION_TEXT && name === 'textType') {
            properties[name].options = flags.textStyles as InspectorPropertyInfo['options']
            properties[name].optionsMode = 'select'
        }
        if (model.sectionType() === InspectorSectionType.SECTION_TEXT && !['fontFamily', 'fontStyle', 'fontSize', 'horizontalAlignment', 'verticalAlignment', 'horizontalPosition'].includes(name)) {
            properties[name].showMore = true
            if (name === 'textLineSpacing') properties[name].enabled = flags.isLineSpacingAvailable !== false
            if (name === 'textType') properties[name].optionsMode = 'select'
            if (name === 'textPlacement') {
                properties[name].options = [{ value: 0, text: tr('Above') }, { value: 1, text: tr('Below') }]
                properties[name].optionsMode = 'radio'
            }
            if (['frameBorderColor', 'frameFillColor', 'frameThickness', 'frameMargin', 'frameCornerRadius'].includes(name)) {
                properties[name].enabled = Number(model.properties().frameType?.value() ?? 0) !== 0
                if (name === 'frameCornerRadius') properties[name].enabled = Number(model.properties().frameType?.value() ?? 0) === 1
            }
        }
        if (model.modelType() === InspectorModelType.TYPE_TIME_SIGNATURE && ['horizontalScale', 'verticalScale'].includes(name)) {
            properties[name].min = 1
            properties[name].max = 100
            properties[name].step = 0.25
            properties[name].decimals = 2
            properties[name].unit = 'x'
        }
        if (model.modelType() === InspectorModelType.TYPE_STEM && name === 'stemDirection') {
            properties[name].options = [
                { value: 0, text: tr('Auto'), title: tr('Auto', 'direction') },
                { value: 2, text: tr('Down'), title: tr('Down', 'direction') },
                { value: 1, text: tr('Up'), title: tr('Up', 'direction') },
            ]
            properties[name].optionsMode = 'radio'
        }
        if ([InspectorModelType.TYPE_SLUR, InspectorModelType.TYPE_TIE, InspectorModelType.TYPE_LAISSEZ_VIB,
            InspectorModelType.TYPE_PARTIAL_TIE, InspectorModelType.TYPE_HAMMER_ON_PULL_OFF].includes(model.modelType()) && name === 'direction') {
            properties[name].options = [
                { value: 0, text: tr('Auto') }, { value: 1, text: tr('Above') }, { value: 2, text: tr('Below') },
            ]
            properties[name].optionsMode = 'radio'
        }
        if ([InspectorModelType.TYPE_TIE, InspectorModelType.TYPE_LAISSEZ_VIB, InspectorModelType.TYPE_PARTIAL_TIE,
            InspectorModelType.TYPE_HAMMER_ON_PULL_OFF].includes(model.modelType()) && name === 'tiePlacement') {
            properties[name].options = [
                { value: 0, text: tr('Auto') },
                { value: 1, text: tr('Inside') }, { value: 2, text: tr('Outside') },
            ]
            properties[name].optionsMode = 'radio'
        }
        if (model.modelType() === InspectorModelType.TYPE_ORNAMENT && name === 'placement') {
            properties[name].options = [
                { value: 2, text: tr('Auto') }, { value: 0, text: tr('Above') }, { value: 1, text: tr('Below') },
            ]
            properties[name].optionsMode = 'radio'
        }
        if (model.modelType() === InspectorModelType.TYPE_ORNAMENT && ['intervalAbove', 'intervalBelow'].includes(name)) {
            const steps = flags.intervalStepOptions as InspectorPropertyInfo['options'] ?? []
            const types = flags.intervalTypeOptions as InspectorPropertyInfo['options'] ?? []
            properties[name].options = steps
            properties[name].optionsMode = 'select'
            properties[name].label = name === 'intervalAbove' ? tr('Interval above') : tr('Interval below')
            properties[name].showIntervalType = !!flags[name === 'intervalAbove' ? 'isIntervalAboveTypeAvailable' : 'isIntervalBelowTypeAvailable']
            properties[name].hidden = !flags[name === 'intervalAbove' ? 'hasIntervalAbove' : 'hasIntervalBelow']
        }
        if (model.modelType() === InspectorModelType.TYPE_ORNAMENT && name === 'showAccidental') {
            properties[name].options = flags.showAccidentalOptions as InspectorPropertyInfo['options']
            properties[name].optionsMode = 'select'
        }
        if (model.modelType() === InspectorModelType.TYPE_ORNAMENT && name === 'showCueNote') {
            properties[name].options = flags.showCueNoteOptions as InspectorPropertyInfo['options']
            properties[name].optionsMode = 'select'
        }
        if (model.modelType() === InspectorModelType.TYPE_TUPLET && name === 'directionType') {
            properties[name].options = [
                { value: 0, text: tr('Auto'), title: tr('Auto', 'direction') },
                { value: 2, text: tr('Down'), title: tr('Down', 'direction') },
                { value: 1, text: tr('Up'), title: tr('Up', 'direction') },
            ]
            properties[name].optionsMode = 'radio'
        }
        if (model.modelType() === InspectorModelType.TYPE_TUPLET && name === 'bracketType') {
            properties[name].options = (flags.possibleBracketTypes as InspectorPropertyInfo['options'] ?? []).map(option => ({
                ...option,
                title: option.text,
                text: option.value === 1 ? undefined : option.text,
            }))
            properties[name].optionsMode = 'radio'
        }
        if (model.modelType() === InspectorModelType.TYPE_GLISSANDO && name === 'dashLineLength') properties[name].enabled = model.properties().lineStyle?.value() === 1
        if (model.modelType() === InspectorModelType.TYPE_GLISSANDO && name === 'dashGapLength') properties[name].enabled = model.properties().lineStyle?.value() === 1
        if (model.modelType() === InspectorModelType.TYPE_GLISSANDO && name === 'thickness') properties[name].unit = 'sp'
        if (model.modelType() === InspectorModelType.TYPE_VOLTA && ['thickness', 'beginHookHeight', 'endHookHeight'].includes(name)) properties[name].unit = 'sp'
        if (model.modelType() === InspectorModelType.TYPE_VOLTA && ['beginHookHeight', 'endHookHeight'].includes(name)) {
            properties[name].min = 0
            properties[name].max = 10
            properties[name].step = 0.1
            properties[name].hidden = !flags[name === 'beginHookHeight' ? 'isBeginHookHeightAvailable' : 'isEndHookHeightAvailable']
        }
        if (model.modelType() === InspectorModelType.TYPE_VOLTA && name === 'thickness') {
            properties[name].min = 0.01
            properties[name].max = 4
            properties[name].step = 0.01
        }
        if (model.modelType() === InspectorModelType.TYPE_VOLTA && ['endings', 'dashLineLength', 'dashGapLength', 'beginHookType', 'endHookType', 'beginHookHeight', 'endHookHeight'].includes(name)) {
            properties[name].showMore = true
        }
        if (model.modelType() === InspectorModelType.TYPE_TEXT_LINE || model.modelType() === InspectorModelType.TYPE_NOTELINE) {
            if (['lineStyle', 'beginHookType', 'endHookType'].includes(name)) properties[name].optionsMode = 'select'
            if (name === 'beginHookHeight') properties[name].hidden = !flags.isBeginHookHeightAvailable
            if (name === 'endHookHeight') properties[name].hidden = !flags.isEndHookHeightAvailable
            if (name === 'placement' && flags.isNoteAnchored) properties[name].hidden = true
        }
        if (model.modelType() === InspectorModelType.TYPE_GRADUAL_TEMPO_CHANGE) {
            if (name === 'tempoChangeType') { properties[name].options = flags.tempoChangeTypes as InspectorPropertyInfo['options']; properties[name].optionsMode = 'select' }
            if (name === 'easingMethod') { properties[name].options = flags.easingMethods as InspectorPropertyInfo['options']; properties[name].optionsMode = 'select' }
            if (name === 'changeFactor') { properties[name].min = 0.1; properties[name].max = 4; properties[name].step = 0.01 }
            if (name === 'changeFactor') properties[name].showMore = true
            if (name === 'snapAfter' || name === 'alignRightOfRehearsalMark') properties[name].showMore = true
        }
        if (model.modelType() === InspectorModelType.TYPE_FRET_DIAGRAM) {
            if (name === 'strings') { properties[name].min = Number(flags.minStrings); properties[name].max = Number(flags.maxStrings) }
            if (name === 'frets') { properties[name].min = Number(flags.minFrets); properties[name].max = Number(flags.maxFrets) }
            if (name === 'orientation') { properties[name].options = flags.orientations as InspectorPropertyInfo['options']; properties[name].optionsMode = 'radio' }
            if (name === 'fingeringVisible' || name === 'fingering') properties[name].hidden = !flags.isFingeringAvailable
            if (name === 'fingering') { properties[name].options = flags.fingerings as InspectorPropertyInfo['options']; properties[name].optionsMode = 'select' }
        }
        if (model.modelType() === InspectorModelType.TYPE_TREMOLO) {
            if (name === 'tremoloType') { properties[name].options = flags.tremoloTypes as InspectorPropertyInfo['options']; properties[name].optionsMode = 'select' }
            if (name === 'tremoloStyle') { properties[name].options = flags.tremoloStyles as InspectorPropertyInfo['options']; properties[name].optionsMode = 'select'; properties[name].hidden = !flags.isTremoloStyleAvailable }
        }
        if (model.modelType() === InspectorModelType.TYPE_MMREST && name === 'numberOffset') properties[name].hidden = !flags.isNumberVisibleByDefault
        if (model.modelType() === InspectorModelType.TYPE_MEASURE_REPEAT && name === 'measures') {
            properties[name].options = flags.measureCountOptions as InspectorPropertyInfo['options']
            properties[name].optionsMode = 'radio'
        }
        if (model.modelType() === InspectorModelType.TYPE_PEDAL && ['lineStyle', 'beginHookType', 'endHookType'].includes(name)) properties[name].optionsMode = 'select'
        if (model.modelType() === InspectorModelType.TYPE_PEDAL && name === 'beginHookHeight') properties[name].hidden = !flags.isBeginHookHeightAvailable
        if (model.modelType() === InspectorModelType.TYPE_PEDAL && name === 'endHookHeight') properties[name].hidden = !flags.isEndHookHeightAvailable
        if (model.modelType() === InspectorModelType.TYPE_VOLTA && name === 'lineStyle') properties[name].optionsMode = 'radio'
        if (model.modelType() === InspectorModelType.TYPE_MARKER && name === 'markerType') properties[name].optionsMode = 'select'
        if (model.modelType() === InspectorModelType.TYPE_MARKER && name === 'symbol') properties[name].hidden = !flags.isSymbolAvailable
        if (model.modelType() === InspectorModelType.TYPE_JUMP && ['jumpTo', 'playUntil', 'continueAt'].includes(name)) properties[name].optionsMode = 'select'
        if (model.modelType() === InspectorModelType.TYPE_BEND && ['bendType', 'bendCurveType', 'showHoldLine'].includes(name)) properties[name].optionsMode = 'select'
        if (model.modelType() === InspectorModelType.TYPE_BEND && name === 'bendCurve') properties[name].hidden = true
        if (model.modelType() === InspectorModelType.TYPE_BEND && name === 'bendAmount') {
            properties[name].min = Number(flags.bendAmountMin ?? 0)
            properties[name].max = Number(flags.bendAmountMax ?? 48)
            properties[name].step = 1
            properties[name].unit = '½ steps'
        }
        if (model.modelType() === InspectorModelType.TYPE_BEND) {
            if (['diveTabPos', 'isSlack'].includes(name)) properties[name].hidden = !flags.isDive
            if (name === 'vibratoType') properties[name].hidden = !flags.isVibratoAvailable
            if (name === 'targetTime') properties[name].hidden = !flags.isTargetTimeAvailable
        }
        if (model.modelType() === InspectorModelType.TYPE_OTTAVA && ['ottavaType', 'lineStyle'].includes(name)) properties[name].optionsMode = 'select'
        if (model.modelType() === InspectorModelType.TYPE_OTTAVA && name === 'placement') {
            properties[name].options = [{ value: 0, text: tr('Above') }, { value: 1, text: tr('Below') }]
            properties[name].optionsMode = 'radio'
        }
        if (model.modelType() === InspectorModelType.TYPE_OTTAVA && ['endHookHeight', 'thickness'].includes(name)) properties[name].unit = 'sp'
        if (model.modelType() === InspectorModelType.TYPE_OTTAVA && name === 'thickness') {
            properties[name].min = 0.01
            properties[name].max = 4
            properties[name].step = 0.01
        }
        if (model.modelType() === InspectorModelType.TYPE_OTTAVA && ['dashLineLength', 'dashGapLength'].includes(name)) {
            properties[name].min = 0.1
            properties[name].step = 0.1
        }
        if (model.modelType() === InspectorModelType.TYPE_VIBRATO && name === 'vibratoType') properties[name].optionsMode = 'select'
        if (model.modelType() === InspectorModelType.TYPE_VIBRATO && name === 'placement') {
            properties[name].options = [{ value: 0, text: tr('Above') }, { value: 1, text: tr('Below') }]
            properties[name].optionsMode = 'radio'
        }
        if (model.modelType() === InspectorModelType.TYPE_CHORD_BRACKET) {
            properties[name].hidden = flags.isBracket === false
            if (['bracketRightSide', 'hookPos'].includes(name)) properties[name].optionsMode = 'radio'
        }
        if (model.modelType() === InspectorModelType.TYPE_CHORD_BRACKET && name === 'hookLen') {
            properties[name].min = 0
            properties[name].max = 10
            properties[name].step = 0.1
            properties[name].unit = 'sp'
        }
        if (model.modelType() === InspectorModelType.TYPE_VOLTA && ['beginText', 'continueText', 'endText'].includes(name)) {
            properties[name].label = name === 'beginText' ? tr('Text at start') : name === 'continueText' ? tr('Continuation text') : tr('Text at end')
        }
        if (model.modelType() === InspectorModelType.TYPE_GLISSANDO && name === 'glissandoShift') properties[name].hidden = !flags.isGlissandoShiftAvailable
        if (model.modelType() === InspectorModelType.TYPE_TUPLET && name === 'numberType') properties[name].optionsMode = 'radio'
        if (model.modelType() === InspectorModelType.TYPE_DYNAMIC && name === 'centerOnNotehead') {
            properties[name].options = [
                { value: true, text: tr('Center on notehead') }, { value: false, text: tr('Use text centering') },
            ]
            properties[name].optionsMode = 'radio'
        }
        if ([InspectorModelType.TYPE_ARTICULATION, InspectorModelType.TYPE_TAPPING].includes(model.modelType()) && name === 'placement') {
            properties[name].options = [
                { value: 2, text: tr('Auto') }, { value: 0, text: tr('Above') }, { value: 1, text: tr('Below') },
            ]
            properties[name].optionsMode = 'radio'
        }
        if (model.modelType() === InspectorModelType.TYPE_CLEF && name === 'clefToBarlinePosition') {
            properties[name].options = flags.clefPositionOptions as InspectorPropertyInfo['options']
            properties[name].optionsMode = 'radio'
        }
        if (model.modelType() === InspectorModelType.TYPE_KEYSIGNATURE && name === 'mode') {
            properties[name].options = flags.keyModes as InspectorPropertyInfo['options']
            properties[name].optionsMode = 'select'
        }
        if (model.modelType() === InspectorModelType.TYPE_BARLINE && name === 'type') properties[name].optionsMode = 'select'
        if (model.modelType() === InspectorModelType.TYPE_BARLINE && name === 'hasToShowTips') {
            properties[name].options = [
                { value: false, text: tr('Unwinged') }, { value: true, text: tr('Winged') },
            ]
            properties[name].optionsMode = 'radio'
        }
        if (model.modelType() === InspectorModelType.TYPE_BARLINE && name === 'spanFrom') properties[name].showMore = true
        if (model.modelType() === InspectorModelType.TYPE_BARLINE && name === 'spanTo') properties[name].showMore = true
        if (model.modelType() === InspectorModelType.TYPE_BARLINE && name === 'isSpanToNextStaff') properties[name].showMore = true
        if (name === 'frameBorderColor' || name === 'frameFillColor') properties[name].editor = 'color'
        if (model.modelType() === InspectorModelType.TYPE_IMAGE && ['height', 'width'].includes(name)) {
            properties[name].hidden = true
            properties[name].unit = flags.measurementUnits === 'sp' ? 'sp' : 'mm'
        }
        if (model.modelType() === InspectorModelType.TYPE_IMAGE && name === 'shouldScaleToFrameSize') {
            properties[name].enabled = !!model.properties().isImageFramed?.value()
        }
        if (model.modelType() === InspectorModelType.TYPE_NOTEHEAD && name === 'isHeadHidden') {
            properties[name].label = tr('Hide notehead')
            properties[name].hidden = !!flags.isTrillCueNote
        }
        if (model.modelType() === InspectorModelType.TYPE_NOTEHEAD && ['headType', 'headSystem', 'headDirection', 'offset', 'dotPosition'].includes(name)) {
            properties[name].hidden = !!flags.isTrillCueNote
        }
        if (model.modelType() === InspectorModelType.TYPE_CHORD && name === 'combineVoice') properties[name].hidden = false
        if (model.modelType() === InspectorModelType.TYPE_SECTIONBREAK && name === 'showCourtesySignatures') {
            properties[name].label = tr('Hide courtesy clefs and signatures')
            properties[name].invert = true
        }
        const numeric = properties[name]
        const numericSettings: Record<string, Pick<InspectorPropertyInfo, 'min' | 'max' | 'step' | 'decimals' | 'unit'>> = {
            dynamicScale: { min: 0, max: 1000, step: 1, decimals: 0, unit: '%' },
            pauseDuration: { min: 0, max: 999, step: 0.5, unit: 's' },
            spacerHeight: { min: 0, max: 999, step: 0.5, unit: 'sp' },
            lineThickness: { min: 0.1, max: 1, step: 0.1, unit: 'sp' },
            horizontalScale: { min: 1, max: 100, step: 0.25, decimals: 2, unit: 'x' },
            verticalScale: { min: 1, max: 100, step: 0.25, decimals: 2, unit: 'x' },
            tempo: { min: 1, max: 999, step: 1, decimals: 1, unit: 'BPM' },
            featheringHeightLeft: { min: 0, max: 4, step: 0.1, unit: 'sp' },
            featheringHeightRight: { min: 0, max: 4, step: 0.1, unit: 'sp' },
            minLength: { min: 1, max: 10, step: 0.1, unit: 'sp' },
            spanFrom: { min: -4, max: 99, step: 1, decimals: 0 },
            spanTo: { min: -99, max: 99, step: 1, decimals: 0 },
            dashLineLength: { min: 0.1, max: 100, step: 0.1 }, dashGapLength: { min: 0.1, max: 100, step: 0.1 },
            thickness: model.modelType() === InspectorModelType.TYPE_HAIRPIN
                ? { min: 0.01, max: 10, step: 0.01, unit: 'sp' }
                : { min: 0.01, max: 4, step: 0.01, unit: 'sp' },
            height: model.modelType() === InspectorModelType.TYPE_IMAGE
                ? { min: 0, max: 9999, step: 0.5 }
                : model.modelType() === InspectorModelType.TYPE_HAIRPIN ? { min: 0.1, max: 10, step: 0.1, unit: 'sp' }
                    : { min: 0, max: 9999, step: 0.5 },
            continuousHeight: { min: 0.1, max: 10, step: 0.1, unit: 'sp' },
            hookLen: { min: 0, max: 10, step: 0.1, unit: 'sp' },
            width: { min: 0, max: 9999, step: 0.5 },
        }
        Object.assign(numeric, numericSettings[name] ?? {})
        if (model.sectionType() === InspectorSectionType.SECTION_TEXT && name === 'textLineSpacing') {
            numeric.decimals = 2
            numeric.unit = qtrc('global', 'li')
        }
        if (model.sectionType() === InspectorSectionType.SECTION_TEXT && name === 'symbolScale') {
            numeric.decimals = 0
            numeric.unit = '%'
        }
        if (model.sectionType() === InspectorSectionType.SECTION_TEXT && name === 'symbolSize') {
            numeric.min = 1
            numeric.max = 99
            numeric.step = 0.5
            numeric.unit = qtrc('global', 'pt')
        }
        if (Array.isArray(options) && properties[name]) {
            properties[name].options = options as InspectorPropertyInfo['options']
            properties[name].optionsMode = model.modelType() === InspectorModelType.TYPE_GLISSANDO
                ? 'select' : ['headGroup', 'headSystem', 'mode', 'type'].includes(name)
                && !(name === 'type' && model.modelType() === InspectorModelType.TYPE_DYNAMIC) ? 'select' : 'radio'
        }
    }
    if ('measurementUnits' in flags) {
        flags.measurementUnits = units(flags.measurementUnits)
    }
    return {
        key,
        sectionType: isSection ? InspectorSectionType[model.sectionType()] : '',
        modelType: InspectorModelType[model.modelType()],
        title: model.title(),
        icon: model.icon(),
        isEmpty: model.isEmpty(),
        properties,
        flags,
        models: subModels(model).map(s => modelInfo(s.key, s.model, false)),
        defaultSubModelType: model instanceof AbstractInspectorProxyModel ? InspectorModelType[model.defaultSubModelType()] : '',
    }
}

/**
 * The sections of the Properties panel for the score's current selection (without a selection: "Show" and
 * "Score appearance"), with the values of their property items. Call again after selection or score changes.
 */
export function inspectorSections(score: Score | null): InspectorModelInfo[] {
    if (!score) {
        return []
    }
    const lm = listModel(score)
    lm.updateElementList(score)
    return lm.modelList().map(m => modelInfo(InspectorSectionType[m.sectionType()], m, true))
}

function findModel(score: Score, ref: { section: string; path: readonly string[] }): AbstractInspectorModel | null {
    const lm = listModel(score)
    let model: AbstractInspectorModel | null = lm.modelList().find(m => InspectorSectionType[m.sectionType()] === ref.section) ?? null
    for (const key of ref.path) {
        model = model ? subModels(model).find(s => s.key === key)?.model ?? null : null
    }
    return model
}

function findItem(score: Score, ref: InspectorPropertyRef): PropertyItem | null {
    return findModel(score, ref)?.properties()[ref.property] ?? null
}

/**
 * The score changes for a new value of a property item (PropertyItem::setValue with the model's callback), e.g.
 * for the Visible checkbox of the General section: { section: "SECTION_GENERAL", path: [], property: "isVisible" }.
 * The values are converted to the elements' units (sp to absolute, % to factors, ...). Apply them with
 * EngravingItem.undoChangeProperty(pid, value, flags) in one undo command (see InspectorChange.command).
 * Uses the models of the last inspectorSections() call.
 */
export function inspectorPropertyChanges(score: Score, ref: InspectorPropertyRef, value: InspectorValue): InspectorChange[] {
    return findItem(score, ref)?.setValue(value) ?? []
}

/** the changes of "Reset" of a property item (EngravingItem.undoResetProperty for each change marked `reset`) */
export function inspectorPropertyResets(score: Score, ref: InspectorPropertyRef): InspectorChange[] {
    return findItem(score, ref)?.resetToDefault() ?? []
}

export type InspectorArrangeCommand = 'backwards' | 'forwards' | 'toBack' | 'toFront'

/** the changes of the "Arrange" buttons of the General > Appearance popup (stacking order, Pid.Z) */
export function inspectorArrangeChanges(score: Score, command: InspectorArrangeCommand): InspectorChange[] {
    const model = findModel(score, { section: 'SECTION_GENERAL', path: ['appearance'] })
    if (!(model instanceof AppearanceSettingsModel)) {
        return []
    }
    switch (command) {
    case 'backwards': return model.pushBackwardsInOrder()
    case 'forwards': return model.pushForwardsInOrder()
    case 'toBack': return model.pushToBackInOrder()
    case 'toFront': return model.pushToFrontInOrder()
    }
}
