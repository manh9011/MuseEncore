/*
 * SPDX-License-Identifier: GPL-3.0-only
 * MuseEncore — port of MuseScore Studio (https://github.com/musescore/MuseScore)
 * Copyright (C) 2021-2026 MuseScore Limited and others
 *
 * Port of notation property models from src/inspector/qml/MuseScore/Inspector/notation.
 */

import type { EngravingItem } from '../../engraving/dom/engravingitem'
import type { InspectorValue } from '../propertyitem'
import { HairpinType, type Hairpin } from '../../engraving/dom/hairpin'
import type { Ornament } from '../../engraving/dom/ornament'
import { Marker } from '../../engraving/dom/marker'
import { FretDiagram } from '../../engraving/dom/fret'
import type { MMRest } from '../../engraving/dom/mmrest'
import { TextLine } from '../../engraving/dom/textline'
import { SpannerAnchor } from '../../engraving/dom/spanner'
import { Jump, jumpTypeTable } from '../../engraving/dom/jump'
import { TConv } from '../../engraving/types/typesconv'
import { JUMP_TYPES, MARKER_TYPES } from '../../engraving/types/typesconvdata'
import { ottavaDefault } from '../../engraving/dom/ottava'
import type { GuitarBend } from '../../engraving/dom/guitarbend'
import type { Arpeggio } from '../../engraving/dom/arpeggio'
import type { Tapping, TappingHalfSlur, TappingHalfSlurSegment } from '../../engraving/dom/tapping'
import { Pid } from '../../engraving/dom/property'
import { Sid } from '../../engraving/style/styledef'
import { ArpeggioType, AutoOnOff, ChangeMethod, ClefToBarlinePosition, ElementType, GlissandoStyle, GlissandoType, GradualTempoChangeType, GuitarBendShowHoldLine, GuitarBendType, IntervalStep, IntervalType, KeyMode, OrnamentShowAccidental, SlurStyleType, TremoloStyle, TremoloType, VibratoType } from '../../engraving/types/types'
import { qtrc } from '../../framework/global/translation'
import {
    AbstractInspectorModel, formatDoubleFunc, InspectorModelType, roundDouble, type ConvertPropertyValueFunc,
    type IElementRepositoryService,
} from '../abstractinspectormodel'
import { AbstractInspectorProxyModel } from '../abstractinspectorproxymodel'
import type { PropertyItem } from '../propertyitem'
import { BeamModesModel } from './notes/notesettingsproxymodel'

const tr = (key: string, disambiguation = ''): string => AbstractInspectorModel['tr'](key, disambiguation)

type ItemSpec = Record<string, [Pid, ConvertPropertyValueFunc?]>

abstract class SimpleSettingsModel extends AbstractInspectorModel {
    protected readonly m_items: Record<string, PropertyItem> = {}
    private readonly m_converters: Record<string, ConvertPropertyValueFunc | undefined> = {}

    constructor(repository: IElementRepositoryService, modelType: InspectorModelType, title: string, icon: string,
        private readonly m_type: ElementType, items: ItemSpec, private readonly m_filter?: (e: EngravingItem) => boolean) {
        super(repository)
        this.setModelType(modelType)
        this.setTitle(title)
        this.setIcon(icon)
        for (const [name, [pid, convert]] of Object.entries(items)) {
            this.m_items[name] = this.buildPropertyItem(pid)
            this.m_converters[name] = convert
        }
    }

    override properties(): Record<string, PropertyItem> { return this.m_items }
    override requestElements(): void { this.m_elementList = this.m_repository.findElementsByType(this.m_type, this.m_filter) }
    override loadProperties(): void {
        for (const [name, item] of Object.entries(this.m_items)) this.loadPropertyItem(item, this.m_converters[name])
        this.updatemeasurementUnits()
        this.updateIsSystemObjectBelowBottomStaff()
    }
    override flags(): Record<string, unknown> {
        return { measurementUnits: this.m_measurementUnits, isSystemObjectBelowBottomStaff: this.m_isSystemObjectBelowBottomStaff }
    }
}

export class ClefSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_CLEF, tr('Clef'), 'CLEF_BASS', ElementType.CLEF, {
            shouldShowCourtesy: [Pid.SHOW_COURTESY], clefToBarlinePosition: [Pid.CLEF_TO_BARLINE_POS],
        })
    }
    override flags(): Record<string, unknown> { return { ...super.flags(), clefPositionOptions: [
        { value: ClefToBarlinePosition.AUTO, text: tr('Auto') }, { value: ClefToBarlinePosition.BEFORE, text: tr('Before') },
        { value: ClefToBarlinePosition.AFTER, text: tr('After') },
    ] } }
}

export class KeySignatureSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_KEYSIGNATURE, tr('Key signature'), 'KEY_SIGNATURE', ElementType.KEYSIG, {
            hasToShowCourtesy: [Pid.SHOW_COURTESY], mode: [Pid.KEYSIG_MODE],
        })
    }
    override flags(): Record<string, unknown> { return { ...super.flags(), keyModes: Object.values(KeyMode).filter((v): v is KeyMode => typeof v === 'number').map(value => ({
        value, text: tr(value === KeyMode.UNKNOWN ? 'Unknown' : KeyMode[value][0] + KeyMode[value].slice(1).toLowerCase(), 'key signature mode'),
    })) } }
}

export class TimeSignatureSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_TIME_SIGNATURE, tr('Time signature'), 'TIME_SIGNATURE', ElementType.TIMESIG, {
            horizontalScale: [Pid.SCALE, v => Array.isArray(v) ? roundDouble(v[0]) : undefined],
            verticalScale: [Pid.SCALE, v => Array.isArray(v) ? roundDouble(v[1]) : undefined], shouldShowCourtesy: [Pid.SHOW_COURTESY],
        })
        this.m_items.horizontalScale.onModified = v => this.onPropertyValueChanged(Pid.SCALE, [Number(v), Number(this.m_items.verticalScale.value() ?? 1)])
        this.m_items.verticalScale.onModified = v => this.onPropertyValueChanged(Pid.SCALE, [Number(this.m_items.horizontalScale.value() ?? 1), Number(v)])
    }
}

export class BarlineSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_BARLINE, tr('Barline'), 'SECTION_BREAK', ElementType.BAR_LINE, {
            type: [Pid.BARLINE_TYPE, v => Number(v)], playCount: [Pid.REPEAT_COUNT, v => Number(v)],
            isSpanToNextStaff: [Pid.BARLINE_SPAN, v => !!v], spanFrom: [Pid.BARLINE_SPAN_FROM, v => Number(v)],
            spanTo: [Pid.BARLINE_SPAN_TO, v => Number(v)], hasToShowTips: [Pid.BARLINE_SHOW_TIPS],
        })
        // TODO(port): play count text settings (PlayCountText), span presets, "Set as staff default"
    }
}

export class DynamicsSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_DYNAMIC, tr('Dynamics'), 'DYNAMIC_FORTE', ElementType.DYNAMIC, {
            avoidBarLines: [Pid.AVOID_BARLINES], dynamicScale: [Pid.MUSICAL_SYMBOLS_SCALE, v => roundDouble(Number(v)) * 100],
            centerOnNotehead: [Pid.CENTER_ON_NOTEHEAD], frameType: [Pid.FRAME_TYPE], frameBorderColor: [Pid.FRAME_FG_COLOR],
            frameFillColor: [Pid.FRAME_BG_COLOR], frameThickness: [Pid.FRAME_WIDTH, formatDoubleFunc],
            frameMargin: [Pid.FRAME_PADDING, formatDoubleFunc], frameCornerRadius: [Pid.FRAME_ROUND, formatDoubleFunc],
        })
        this.setTitle(qtrc('inspector ', 'Dynamics'))
        this.m_items.dynamicScale.onModified = v => this.onPropertyValueChanged(Pid.MUSICAL_SYMBOLS_SCALE, Number(v) / 100)
    }
}

export class ArticulationSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService, type: InspectorModelType = InspectorModelType.TYPE_ARTICULATION) {
        super(repository, type, type === InspectorModelType.TYPE_ARTICULATION ? tr('Articulation') : tr('Tapping'), 'ARTICULATION', ElementType.ARTICULATION, {
            placement: [Pid.ARTICULATION_ANCHOR],
        })
    }
    override requestElements(): void {
        this.m_elementList = this.m_repository.findElementsByType(ElementType.ARTICULATION)
        this.m_elementList.push(...this.m_repository.findElementsByType(ElementType.TAPPING))
        for (const segment of this.m_repository.findElementsByType(ElementType.TAPPING_HALF_SLUR_SEGMENT)) {
            const spanner = (segment as unknown as TappingHalfSlurSegment).spanner() as TappingHalfSlur
            this.m_elementList.push(spanner.parentItem() as unknown as Tapping)
        }
    }
}

export class ChordBracketSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_CHORD_BRACKET, qtrc('inspector', 'Chord bracket'), '', ElementType.CHORD_BRACKET, {
            bracketRightSide: [Pid.BRACKET_RIGHT_SIDE], hookPos: [Pid.BRACKET_HOOK_POS], hookLen: [Pid.BRACKET_HOOK_LEN, formatDoubleFunc],
        })
    }
    override flags(): Record<string, unknown> {
        const isBracket = !this.m_elementList.some(item => item.isArpeggio() && (item as unknown as Arpeggio).arpeggioType() !== ArpeggioType.BRACKET)
        return { ...super.flags(), isBracket, bracketPlacementOptions: [{ value: false, text: tr('Left') }, { value: true, text: tr('Right') }],
            hookPositionOptions: [{ value: 0, text: tr('Both') }, { value: 1, text: tr('Above') }, { value: 2, text: tr('Below') }] }
    }
}

export class ImageSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_IMAGE, tr('Image'), 'IMAGE_MOUNTAINS', ElementType.IMAGE, {
            isAspectRatioLocked: [Pid.LOCK_ASPECT_RATIO], shouldScaleToFrameSize: [Pid.AUTOSCALE], height: [Pid.IMAGE_HEIGHT, formatDoubleFunc],
            width: [Pid.IMAGE_WIDTH, formatDoubleFunc], isSizeInSpatiums: [Pid.SIZE_IS_SPATIUM], isImageFramed: [Pid.IMAGE_FRAMED],
        })
    }
    override loadProperties(): void { super.loadProperties(); this.m_items.shouldScaleToFrameSize.setIsEnabled(!!this.m_items.isImageFramed.value()) }
}

export class BendSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_BEND, tr('Bend/dive'), 'BEND', ElementType.GUITAR_BEND, {
            bendAmount: [Pid.GUITAR_BEND_AMOUNT, value => Number(value)], showHoldLine: [Pid.BEND_SHOW_HOLD_LINE, value => Number(value)],
            startTime: [Pid.BEND_START_TIME_FACTOR, formatDoubleFunc], targetTime: [Pid.BEND_TARGET_TIME_FACTOR, formatDoubleFunc],
            endTime: [Pid.BEND_END_TIME_FACTOR, formatDoubleFunc], diveTabPos: [Pid.GUITAR_DIVE_TAB_POS],
            vibratoType: [Pid.VIBRATO_LINE_TYPE, value => Number(value)], isSlack: [Pid.GUITAR_DIVE_IS_SLACK],

        })
    }
    override flags(): Record<string, unknown> {
        const bends = this.m_elementList as GuitarBend[]
        const types = new Set(bends.map(b => b.bendType()))
        return { ...super.flags(), bendTypes: Object.values(GuitarBendType).filter((v): v is GuitarBendType => typeof v === 'number').map(value => ({ value, text: tr(GuitarBendType[value]) })),
            bendAmountMin: bends.length && bends.every(b => b.isDive()) ? -48 : 0, bendAmountMax: 48,
            isDive: bends.length > 0 && bends.every(b => b.isDive()), isDip: bends.length > 0 && bends.every(b => b.bendType() === GuitarBendType.DIP),
            isSlackAvailable: bends.length > 0 && bends.every(b => b.isDive()), isVibratoAvailable: bends.length > 0 && bends.every(b => b.bendType() === GuitarBendType.DIP),
            isTargetTimeAvailable: bends.some(b => b.targetTimeFactor() !== null), hasMixedBendTypes: types.size > 1,
            showHoldLineOptions: Object.values(GuitarBendShowHoldLine).filter((v): v is GuitarBendShowHoldLine => typeof v === 'number').map(value => ({ value, text: tr(GuitarBendShowHoldLine[value]) })) }
    }
}

export class MarkerSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_MARKER, tr('Marker'), 'SEGNO', ElementType.MARKER, {
            markerType: [Pid.MARKER_TYPE, value => Number(value)], label: [Pid.LABEL], symbol: [Pid.MARKER_CENTER_ON_SYMBOL],
            placement: [Pid.PLACEMENT],
        })
    }
    override flags(): Record<string, unknown> {
        const markers = this.m_elementList.filter(e => e.isMarker()) as Marker[]
        return { ...super.flags(), markerTypes: MARKER_TYPES.map(entry => ({ value: entry.type, text: TConv.userNameMarkerType(entry.type).translated() })),
            isSymbolAvailable: markers.length > 0 && markers.every(marker => marker.isSegno() || marker.isCoda()) }
    }
}

export class JumpSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_JUMP, tr('Jump'), 'JUMP', ElementType.JUMP, {
            jumpTo: [Pid.JUMP_TO], playUntil: [Pid.PLAY_UNTIL], continueAt: [Pid.CONTINUE_AT], playRepeats: [Pid.PLAY_REPEATS],
        })
    }
    override flags(): Record<string, unknown> {
        const options = (values: string[]) => [...new Set(values)].map(value => ({ value, text: value || tr('None') }))
        const fields = { jumpTo: new Set<string>(), playUntil: new Set<string>(), continueAt: new Set<string>() }
        for (const jump of JUMP_TYPES) {
            const definition = jumpTypeTable.find(entry => entry.type === jump.type)
            if (!definition) continue
            fields.jumpTo.add(definition.jumpTo)
            fields.playUntil.add(definition.playUntil)
            fields.continueAt.add(definition.continueAt)
        }
        return { ...super.flags(), jumpToOptions: options([...fields.jumpTo]),
            playUntilOptions: options([...fields.playUntil]), continueAtOptions: options([...fields.continueAt]) }
    }
}

export class MMRestSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_MMREST, tr('Multimeasure rest'), 'REST_MULTIMEASURE', ElementType.MMREST, {
            numberVisible: [Pid.MMREST_NUMBER_VISIBLE], numberOffset: [Pid.MMREST_NUMBER_OFFSET, formatDoubleFunc],
        })
    }
    override flags(): Record<string, unknown> {
        const rests = this.m_elementList as MMRest[]
        return { ...super.flags(), isNumberVisibleByDefault: rests.length > 0 && rests.every(rest => rest.shouldShowNumberByDefault()) }
    }
}

export class TextLineSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService, modelType: InspectorModelType = InspectorModelType.TYPE_TEXT_LINE) {
        super(repository, modelType, modelType === InspectorModelType.TYPE_NOTELINE ? tr('Note-anchored line') : tr('Text line'), 'TEXTLINE', ElementType.TEXTLINE,
            { beginText: [Pid.BEGIN_TEXT], continueText: [Pid.CONTINUE_TEXT], endText: [Pid.END_TEXT], lineVisible: [Pid.LINE_VISIBLE],
                lineStyle: [Pid.LINE_STYLE], lineWidth: [Pid.LINE_WIDTH, formatDoubleFunc], placement: [Pid.PLACEMENT],
                beginHookType: [Pid.BEGIN_HOOK_TYPE], endHookType: [Pid.END_HOOK_TYPE], beginHookHeight: [Pid.BEGIN_HOOK_HEIGHT, formatDoubleFunc],
                endHookHeight: [Pid.END_HOOK_HEIGHT, formatDoubleFunc], dashLineLen: [Pid.DASH_LINE_LEN, formatDoubleFunc], dashGapLen: [Pid.DASH_GAP_LEN, formatDoubleFunc] },
            item => item.type() === ElementType.TEXTLINE || item.type() === ElementType.TEXTLINE_SEGMENT
                || item.type() === ElementType.NOTELINE || item.type() === ElementType.NOTELINE_SEGMENT
                || item.type() === ElementType.PALM_MUTE || item.type() === ElementType.PALM_MUTE_SEGMENT
                || item.type() === ElementType.LET_RING || item.type() === ElementType.LET_RING_SEGMENT
                || item.type() === ElementType.WHAMMY_BAR || item.type() === ElementType.WHAMMY_BAR_SEGMENT)
    }
    override flags(): Record<string, unknown> {
        const lines = this.m_elementList.filter(item => item.isTextLineBase()).map(item => item as TextLine)
        return { ...super.flags(), isBeginHookHeightAvailable: lines.some(line => line.beginHookType() !== 0),
            isEndHookHeightAvailable: lines.some(line => line.endHookType() !== 0),
            isNoteAnchored: lines.length > 0 && lines.every(line => line.anchor() === SpannerAnchor.NOTE) }
    }
}

export class GradualTempoChangeSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_GRADUAL_TEMPO_CHANGE, tr('Tempo change'), 'TEMPO_CHANGE', ElementType.GRADUAL_TEMPO_CHANGE, {
            tempoChangeType: [Pid.TEMPO_CHANGE_TYPE], easingMethod: [Pid.TEMPO_EASING_METHOD], changeFactor: [Pid.TEMPO_CHANGE_FACTOR, formatDoubleFunc],
            snapAfter: [Pid.SNAP_AFTER], alignRightOfRehearsalMark: [Pid.TEMPO_ALIGN_RIGHT_OF_REHEARSAL_MARK],
            beginText: [Pid.BEGIN_TEXT], continueText: [Pid.CONTINUE_TEXT], endText: [Pid.END_TEXT], lineVisible: [Pid.LINE_VISIBLE],
            lineStyle: [Pid.LINE_STYLE], lineWidth: [Pid.LINE_WIDTH, formatDoubleFunc], placement: [Pid.PLACEMENT],
        })
    }
    override flags(): Record<string, unknown> {
        const tempoTypes = Object.values(GradualTempoChangeType).filter((v): v is GradualTempoChangeType => typeof v === 'number' && v >= 0)
        const easing = Object.values(ChangeMethod).filter((v): v is ChangeMethod => typeof v === 'number')
        return { ...super.flags(), tempoChangeTypes: tempoTypes.map(value => ({ value, text: GradualTempoChangeType[value] })),
            easingMethods: easing.map(value => ({ value, text: ChangeMethod[value] })) }
    }
}

export class FretDiagramSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_FRET_DIAGRAM, tr('Fretboard diagram'), 'FRETBOARD_DIAGRAM', ElementType.FRET_DIAGRAM, {
            strings: [Pid.FRET_STRINGS], frets: [Pid.FRET_FRETS], showNut: [Pid.FRET_NUT], fretOffset: [Pid.FRET_OFFSET],
            orientation: [Pid.ORIENTATION], fingeringVisible: [Pid.FRET_SHOW_FINGERINGS],
            magnification: [Pid.MAG, formatDoubleFunc],
        })
    }
    override flags(): Record<string, unknown> {
        const diagrams = this.m_elementList as FretDiagram[]
        return { ...super.flags(), minStrings: 1, maxStrings: 12, minFrets: 1, maxFrets: 24,
            orientations: [{ value: 0, text: tr('Vertical') }, { value: 1, text: tr('Horizontal') }],
            isFingeringAvailable: diagrams.length > 0 && diagrams.every(diagram => diagram.orientation() === 0) }
    }
}

export class TremoloSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_TREMOLO, tr('Tremolos'), 'TREMOLO', ElementType.TREMOLO_SINGLECHORD, {
            tremoloType: [Pid.TREMOLO_TYPE], play: [Pid.PLAY], tremoloStyle: [Pid.TREMOLO_STYLE],
        }, item => item.type() === ElementType.TREMOLO_SINGLECHORD || item.type() === ElementType.TREMOLO_TWOCHORD)
    }
    override flags(): Record<string, unknown> {
        const hasSingle = this.m_elementList.some(item => item.type() === ElementType.TREMOLO_SINGLECHORD)
        const types = Object.values(TremoloType).filter((value): value is TremoloType => typeof value === 'number'
            && value >= 0 && (hasSingle ? value <= TremoloType.BUZZ_ROLL : value >= TremoloType.C8))
        const twoChord = this.m_elementList.filter(item => item.type() === ElementType.TREMOLO_TWOCHORD)
        return { ...super.flags(), tremoloTypes: types.map(value => ({ value, text: TConv.userNameTremoloType(value).translated() })),
            tremoloStyles: [0, 1, 2].map(value => ({ value, text: [tr('Default'), tr('Traditional'), tr('Traditional alternate')][value] })),
            isTremoloStyleAvailable: twoChord.length > 0 && twoChord.every(item => item.getProperty(Pid.TREMOLO_TYPE) === TremoloType.C8) }
    }
}

export class MeasureRepeatSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_MEASURE_REPEAT, tr('Measure repeat'), 'MEASURE_REPEAT', ElementType.MEASURE_REPEAT, {
            measures: [Pid.SUBTYPE, value => Number(value)], numberPos: [Pid.MEASURE_REPEAT_NUMBER_POS, formatDoubleFunc],
        })
    }
    override flags(): Record<string, unknown> {
        return { ...super.flags(), measureCountOptions: [1, 2, 3, 4].map(value => ({ value, text: String(value) })) }
    }
}

export class PedalSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_PEDAL, tr('Pedal'), 'PEDAL', ElementType.PEDAL, {
            beginText: [Pid.BEGIN_TEXT], continueText: [Pid.CONTINUE_TEXT], endText: [Pid.END_TEXT], lineVisible: [Pid.LINE_VISIBLE],
            placement: [Pid.PLACEMENT], lineStyle: [Pid.LINE_STYLE], lineWidth: [Pid.LINE_WIDTH, formatDoubleFunc],
            beginHookType: [Pid.BEGIN_HOOK_TYPE], endHookType: [Pid.END_HOOK_TYPE], beginHookHeight: [Pid.BEGIN_HOOK_HEIGHT, formatDoubleFunc],
            endHookHeight: [Pid.END_HOOK_HEIGHT, formatDoubleFunc], dashLineLen: [Pid.DASH_LINE_LEN, formatDoubleFunc],
            dashGapLen: [Pid.DASH_GAP_LEN, formatDoubleFunc],
        })
    }
    override flags(): Record<string, unknown> {
        return { ...super.flags(), isBeginHookHeightAvailable: this.m_elementList.some(e => e.getProperty(Pid.BEGIN_HOOK_TYPE) !== 0),
            isEndHookHeightAvailable: this.m_elementList.some(e => e.getProperty(Pid.END_HOOK_TYPE) !== 0) }
    }
}

export class FermataSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) { super(repository, InspectorModelType.TYPE_FERMATA, tr('Fermata'), 'FERMATA', ElementType.FERMATA, { placementType: [Pid.PLACEMENT] }) }
}

export class TempoSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService, modelType: InspectorModelType) {
        super(repository, modelType, modelType === InspectorModelType.TYPE_A_TEMPO ? tr('A tempo') : modelType === InspectorModelType.TYPE_TEMPO_PRIMO ? tr('Tempo primo') : tr('Tempo'),
            'METRONOME', ElementType.TEMPO_TEXT, { followText: [Pid.TEMPO_FOLLOW_TEXT], tempo: [Pid.TEMPO, formatDoubleFunc] })
    }
}

export class TupletSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_TUPLET, tr('Tuplet'), 'TUPLET_NUMBER_WITH_BRACKETS', ElementType.TUPLET, {
            directionType: [Pid.DIRECTION], numberType: [Pid.NUMBER_TYPE], bracketType: [Pid.BRACKET_TYPE], lineThickness: [Pid.LINE_WIDTH, formatDoubleFunc],
        })
    }
    override flags(): Record<string, unknown> { return { ...super.flags(),
        possibleNumberTypes: [{ value: 0, text: tr('Number', 'tuplet number type') }, { value: 1, text: tr('Ratio', 'tuplet number type') }, { value: 2, text: tr('None', 'tuplet number type') }],
        possibleBracketTypes: [{ value: 0, text: tr('Auto', 'tuplet bracket type') },
            { value: 1, text: tr('Bracket', 'tuplet bracket type'), icon: 'TUPLET_NUMBER_WITH_BRACKETS' },
            { value: 2, text: tr('None', 'tuplet bracket type'), icon: 'TUPLET_NUMBER_ONLY' }] }
    }
}

export class AccidentalSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) { super(repository, InspectorModelType.TYPE_ACCIDENTAL, tr('Accidental'), 'ACCIDENTAL_SHARP', ElementType.ACCIDENTAL, {
        bracketType: [Pid.ACCIDENTAL_BRACKET], isSmall: [Pid.SMALL], stackingOrderOffset: [Pid.ACCIDENTAL_STACKING_ORDER_OFFSET],
    }) }
}

export class SpacerSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) { super(repository, InspectorModelType.TYPE_SPACER, tr('Spacer'), 'SPACER', ElementType.SPACER, { spacerHeight: [Pid.SPACE, formatDoubleFunc] }) }
}

export class SectionBreakSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) { super(repository, InspectorModelType.TYPE_SECTIONBREAK, tr('Section break'), 'SECTION_BREAK', ElementType.LAYOUT_BREAK, {
        shouldStartWithLongInstrNames: [Pid.START_WITH_LONG_NAMES], shouldResetBarNums: [Pid.START_WITH_MEASURE_ONE], pauseDuration: [Pid.PAUSE, formatDoubleFunc],
        firstSystemIndent: [Pid.FIRST_SYSTEM_INDENTATION], showCourtesySignatures: [Pid.SHOW_COURTESY],
    }) }
}

export class RestSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) { super(repository, InspectorModelType.TYPE_REST_REST, tr('Rest'), 'REST_8TH', ElementType.REST, { alignWithOtherRests: [Pid.ALIGN_WITH_OTHER_RESTS] }) }
}

export class RestBeamSettingsModel extends AbstractInspectorModel {
    private readonly m_beamModesModel: BeamModesModel
    constructor(repository: IElementRepositoryService) {
        super(repository, ElementType.REST)
        this.setModelType(InspectorModelType.TYPE_REST_BEAM); this.setTitle(tr('Beam')); this.m_beamModesModel = new BeamModesModel(repository)
    }
    override properties(): Record<string, PropertyItem> { return { mode: this.m_beamModesModel.properties().mode } }
    override updateProperties(): void { super.updateProperties(); this.m_beamModesModel.updateProperties() }
    override loadProperties(): void {}
}

export class RestSettingsProxyModel extends AbstractInspectorProxyModel {
    constructor(repository: IElementRepositoryService) {
        super(repository); this.setModelType(InspectorModelType.TYPE_REST); this.setTitle(tr('Rest')); this.setIcon('REST_8TH')
        this.setModels([new RestBeamSettingsModel(repository), new RestSettingsModel(repository)])
    }
}

export class SlurAndTieSettingsModel extends SimpleSettingsModel {
    private readonly m_isLaissezVib: boolean
    constructor(repository: IElementRepositoryService, modelType: InspectorModelType) {
        const [type, title] = modelType === InspectorModelType.TYPE_TIE ? [ElementType.TIE, tr('Tie')]
            : modelType === InspectorModelType.TYPE_LAISSEZ_VIB ? [ElementType.LAISSEZ_VIB, tr('Laissez vibrer')]
                : modelType === InspectorModelType.TYPE_PARTIAL_TIE ? [ElementType.PARTIAL_TIE, tr('Tie (partial)')]
                    : modelType === InspectorModelType.TYPE_HAMMER_ON_PULL_OFF ? [ElementType.HAMMER_ON_PULL_OFF, tr('Hammer-on/pull-off')]
                        : [ElementType.SLUR, tr('Slur')]
        super(repository, modelType, title, '', type, { lineStyle: [Pid.SLUR_STYLE_TYPE], direction: [Pid.SLUR_DIRECTION], tiePlacement: [Pid.TIE_PLACEMENT], minLength: [Pid.MIN_LENGTH] })
        this.m_isLaissezVib = modelType === InspectorModelType.TYPE_LAISSEZ_VIB
    }
    override flags(): Record<string, unknown> {
        const smuflLv = (e: EngravingItem): boolean => e.isLaissezVib() && e.style().styleB(Sid.laissezVibUseSmuflSym)
        return { ...super.flags(), isLaissezVib: this.m_isLaissezVib, isTiePlacementAvailable: this.m_elementList.some(e => e.isTie()),
            isMinLengthAvailable: this.m_elementList.some(e => e.isLaissezVib() && !smuflLv(e)), isLineStyleAvailable: !this.m_elementList.some(smuflLv),
            possibleLineStyles: [{ value: SlurStyleType.Solid, text: tr('Normal', 'slur style'), icon: 'LINE_NORMAL' },
                { value: SlurStyleType.WideDashed, text: tr('Wide dashed', 'slur style'), icon: 'LINE_WIDE_DASHED' },
                { value: SlurStyleType.Dashed, text: tr('Dashed', 'slur style'), icon: 'LINE_DASHED' }, { value: SlurStyleType.Dotted, text: tr('Dotted', 'slur style'), icon: 'LINE_DOTTED' }] }
    }
}

export class OrnamentSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) { super(repository, InspectorModelType.TYPE_ORNAMENT, tr('Ornament'), 'ORNAMENT', ElementType.ORNAMENT, {
        placement: [Pid.PLACEMENT], intervalAbove: [Pid.INTERVAL_ABOVE], intervalBelow: [Pid.INTERVAL_BELOW], showAccidental: [Pid.ORNAMENT_SHOW_ACCIDENTAL], showCueNote: [Pid.ORNAMENT_SHOW_CUE_NOTE],
    }) }
    override flags(): Record<string, unknown> { return { ...super.flags(), intervalStepOptions: Object.values(IntervalStep).filter((v): v is IntervalStep => typeof v === 'number').map(value => ({ value, text: tr(IntervalStep[value]) })),
        intervalTypeOptions: Object.values(IntervalType).filter((v): v is IntervalType => typeof v === 'number').map(value => ({ value, text: tr(IntervalType[value]) })),
        showAccidentalOptions: Object.values(OrnamentShowAccidental).filter((v): v is OrnamentShowAccidental => typeof v === 'number').map(value => ({ value, text: tr(OrnamentShowAccidental[value]) })) } }
}

export class GlissandoSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) { super(repository, InspectorModelType.TYPE_GLISSANDO, tr('Glissando'), 'GLISSANDO', ElementType.GLISSANDO, {
        subtype: [Pid.GLISS_TYPE, v => Number(v)], text: [Pid.GLISS_TEXT], glissandoShowText: [Pid.GLISS_SHOW_TEXT], glissandoStyle: [Pid.GLISS_STYLE, v => Number(v)],
        glissandoShift: [Pid.GLISS_SHIFT], easeInSpin: [Pid.GLISS_EASEIN], easeOutSpin: [Pid.GLISS_EASEOUT], lineStyle: [Pid.LINE_STYLE, v => Number(v)],
        thickness: [Pid.LINE_WIDTH, formatDoubleFunc], dashLineLength: [Pid.DASH_LINE_LEN, formatDoubleFunc], dashGapLength: [Pid.DASH_GAP_LEN, formatDoubleFunc],
    }) }
    override flags(): Record<string, unknown> {
        const harpGliss = this.elementList().some(e => e.isGlissando() && (e as import('../../engraving/dom/glissando').Glissando).isHarpGliss())
        return { ...super.flags(), isGlissandoShiftAvailable: !harpGliss, possibleLineStyles: [{ value: 0, text: tr('Normal', 'line type') }, { value: 1, text: tr('Dashed', 'line type') }, { value: 2, text: tr('Dotted', 'line type') }],
            glissandoTypes: [{ value: GlissandoType.STRAIGHT, text: tr('Straight') }, { value: GlissandoType.WAVY, text: tr('Wavy') }],
            glissandoStyles: [{ value: GlissandoStyle.CHROMATIC, text: tr('Chromatic') }, { value: GlissandoStyle.WHITE_KEYS, text: tr('White keys') },
                { value: GlissandoStyle.BLACK_KEYS, text: tr('Black keys') }, { value: GlissandoStyle.DIATONIC, text: tr('Diatonic') }, { value: GlissandoStyle.PORTAMENTO, text: tr('Portamento') }]
                .filter(o => !harpGliss || o.value === GlissandoStyle.CHROMATIC || o.value === GlissandoStyle.DIATONIC) }
    }
}

export class OttavaSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) {
        super(repository, InspectorModelType.TYPE_OTTAVA, tr('Ottava'), 'OTTAVA', ElementType.OTTAVA, {
            ottavaType: [Pid.OTTAVA_TYPE, value => Number(value)], numbersOnly: [Pid.NUMBERS_ONLY], play: [Pid.PLAY], placement: [Pid.PLACEMENT],
            lineStyle: [Pid.LINE_STYLE, value => Number(value)], thickness: [Pid.LINE_WIDTH, formatDoubleFunc],
            dashLineLength: [Pid.DASH_LINE_LEN, formatDoubleFunc], dashGapLength: [Pid.DASH_GAP_LEN, formatDoubleFunc],
            endHookHeight: [Pid.END_HOOK_HEIGHT, formatDoubleFunc], beginText: [Pid.BEGIN_TEXT], continueText: [Pid.CONTINUE_TEXT],
        })
    }

    override flags(): Record<string, unknown> {
        return { ...super.flags(), ottavaTypes: ottavaDefault.map(({ type, name }) => ({ value: type, text: name })), possibleLineStyles: [
            { value: 0, text: tr('Normal', 'line type') }, { value: 1, text: tr('Dashed', 'line type') },
            { value: 2, text: tr('Dotted', 'line type') },
        ] }
    }
}

export class VibratoSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) { super(repository, InspectorModelType.TYPE_VIBRATO, tr('Vibrato'), 'VIBRATO', ElementType.VIBRATO, {
        vibratoType: [Pid.VIBRATO_TYPE, v => Number(v)], placement: [Pid.PLACEMENT],
    }) }
    override flags(): Record<string, unknown> { return { ...super.flags(), vibratoTypes: [{ value: VibratoType.GUITAR_VIBRATO, text: tr('Guitar vibrato') },
        { value: VibratoType.GUITAR_VIBRATO_WIDE, text: tr('Wide guitar vibrato') }, { value: VibratoType.VIBRATO_SAWTOOTH, text: tr('Sawtooth vibrato') },
        { value: VibratoType.VIBRATO_SAWTOOTH_WIDE, text: tr('Wide sawtooth vibrato') }] } }
}

export class VoltaSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService) { super(repository, InspectorModelType.TYPE_VOLTA, tr('Volta'), 'VOLTA', ElementType.VOLTA, {
        endings: [Pid.VOLTA_ENDING, v => Array.isArray(v) ? v.join(', ') : String(v)], beginText: [Pid.BEGIN_TEXT], continueText: [Pid.CONTINUE_TEXT], endText: [Pid.END_TEXT],
        lineStyle: [Pid.LINE_STYLE, v => Number(v)], thickness: [Pid.LINE_WIDTH, formatDoubleFunc], dashLineLength: [Pid.DASH_LINE_LEN, formatDoubleFunc],
        dashGapLength: [Pid.DASH_GAP_LEN, formatDoubleFunc], beginHookHeight: [Pid.BEGIN_HOOK_HEIGHT, formatDoubleFunc], endHookHeight: [Pid.END_HOOK_HEIGHT, formatDoubleFunc],
    }, e => e.isVolta()) }
    override loadProperties(): void {
        super.loadProperties()
        const values = this.m_elementList.filter(e => e.isVolta()).map(e => (e as unknown as { endings(): number[] }).endings())
        this.m_items.endings.updateCurrentValue(values.length && values.every(v => v.length === values[0].length && v.every((n, i) => n === values[0][i])) ? values[0].join(', ') : undefined)
        for (const [name, method] of [['beginText', 'beginText'], ['continueText', 'continueText'], ['endText', 'endText']] as const) {
            const texts = this.m_elementList.filter(e => e.isVolta()).map(e => String((e as unknown as Record<typeof method, () => string>)[method]()))
            this.m_items[name].updateCurrentValue(texts.length && texts.every(t => t === texts[0]) ? texts[0] : undefined)
        }
    }
    override valueToElementUnits(pid: Pid, value: InspectorValue, element: EngravingItem): import('../../engraving/types/propertyvalue').PropertyValue {
        if (pid === Pid.VOLTA_ENDING) return typeof value === 'string' ? value.split(',').map(t => Number(t.trim())) : value as number[]
        if (pid === Pid.BEGIN_TEXT || pid === Pid.CONTINUE_TEXT || pid === Pid.END_TEXT) {
            const key = pid === Pid.BEGIN_TEXT ? 'beginText' : pid === Pid.CONTINUE_TEXT ? 'continueText' : 'endText'
            const target = (element as unknown as Record<typeof key, () => string>)[key]()
            return target === value ? target : String(value)
        }
        return super.valueToElementUnits(pid, value, element)
    }
    override flags(): Record<string, unknown> { return { ...super.flags(), possibleLineStyles: [{ value: 0, text: tr('Normal', 'line type') },
        { value: 1, text: tr('Dashed', 'line type') }, { value: 2, text: tr('Dotted', 'line type') }], hookTypes: [{ value: 0, text: tr('None') },
        { value: 1, text: tr('90° hook') }, { value: 2, text: tr('45° hook') }, { value: 3, text: tr('90° hook with straight end') }],
        isBeginHookHeightAvailable: this.m_elementList.some(e => e.isVolta() && (e as unknown as { beginHookType(): number }).beginHookType() !== 0),
        isEndHookHeightAvailable: this.m_elementList.some(e => e.isVolta() && (e as unknown as { endHookType(): number }).endHookType() !== 0) } }
}

export class HairpinSettingsModel extends SimpleSettingsModel {
    constructor(repository: IElementRepositoryService, modelType = InspectorModelType.TYPE_HAIRPIN) { super(repository, modelType,
        modelType === InspectorModelType.TYPE_CRESCENDO ? tr('Crescendo') : modelType === InspectorModelType.TYPE_DIMINUENDO ? tr('Diminuendo') : tr('Hairpin'), 'HAIRPIN', ElementType.HAIRPIN, {
            isNienteCircleVisible: [Pid.HAIRPIN_CIRCLEDTIP], height: [Pid.HAIRPIN_HEIGHT, formatDoubleFunc], continuousHeight: [Pid.HAIRPIN_CONT_HEIGHT, formatDoubleFunc],
            allowDiagonal: [Pid.DIAGONAL], lineStyle: [Pid.LINE_STYLE], thickness: [Pid.LINE_WIDTH, formatDoubleFunc], dashLineLength: [Pid.DASH_LINE_LEN, formatDoubleFunc],
            dashGapLength: [Pid.DASH_GAP_LEN, formatDoubleFunc], placement: [Pid.PLACEMENT],
        }, e => { const t = (e as Hairpin).hairpinType(); return modelType === InspectorModelType.TYPE_CRESCENDO ? t === HairpinType.CRESC_LINE
            : modelType === InspectorModelType.TYPE_DIMINUENDO ? t === HairpinType.DIM_LINE : t === HairpinType.CRESC_HAIRPIN || t === HairpinType.DIM_HAIRPIN }) }
    override flags(): Record<string, unknown> { return { ...super.flags(), isLineType: this.m_elementList.some(e => (e as Hairpin).isLineType()) } }
}
