/*
 * SPDX-License-Identifier: GPL-3.0-only
 * MuseEncore — port of MuseScore Studio (https://github.com/musescore/MuseScore)
 * Copyright (C) 2021-2026 MuseScore Limited and others
 *
 * Port of the Inspector score display and appearance sections.
 */

import { Pid } from '../../engraving/dom/property'
import { DefaultStyle } from '../../engraving/style/defaultstyle'
import { Sid } from '../../engraving/style/styledef'
import { AbstractInspectorModel, InspectorSectionType, type IElementRepositoryService } from '../abstractinspectormodel'
import { PropertyItem } from '../propertyitem'

export class ScoreDisplaySettingsModel extends AbstractInspectorModel {
    constructor(repository: IElementRepositoryService) {
        super(repository)
        this.setSectionType(InspectorSectionType.SECTION_SCORE_DISPLAY)
        this.setTitle(AbstractInspectorModel.tr('Show'))
    }

    override properties(): Record<string, PropertyItem> { return {} }
    override isEmpty(): boolean { return false }
    override requestElements(): void {}
    override loadProperties(): void {}
}

export class ScoreAppearanceSettingsModel extends AbstractInspectorModel {
    private readonly m_hideEmptyStaves: PropertyItem

    constructor(repository: IElementRepositoryService) {
        super(repository)
        this.setSectionType(InspectorSectionType.SECTION_SCORE_APPEARANCE)
        this.setTitle(AbstractInspectorModel.tr('Score appearance'))
        this.m_hideEmptyStaves = new PropertyItem(Pid.VISIBLE)
        this.updateHideEmptyStaves()
        this.m_hideEmptyStaves.onReset = () => {
            const score = this.m_repository.score()
            if (!score) return []
            return [{ item: score as unknown as import('../../engraving/dom/engravingitem').EngravingItem, pid: Pid.VISIBLE,
                value: { sid: Sid.hideEmptyStaves, value: DefaultStyle.defaultStyle().styleB(Sid.hideEmptyStaves), reset: true } as unknown as import('../../engraving/types/propertyvalue').PropertyValue,
                command: 'changeStyle' }]
        }
        this.m_hideEmptyStaves.onModified = value => {
            const score = this.m_repository.score()
            if (!score) return []
            const hideEmptyStaves = value === true
            if (score.style().styleB(Sid.hideEmptyStaves) === hideEmptyStaves) return []
            return [{ item: score as unknown as import('../../engraving/dom/engravingitem').EngravingItem, pid: Pid.VISIBLE,
                value: { sid: Sid.hideEmptyStaves, value: hideEmptyStaves } as unknown as import('../../engraving/types/propertyvalue').PropertyValue,
                command: 'changeStyle' }]
        }
    }

    override properties(): Record<string, PropertyItem> { return { hideEmptyStaves: this.m_hideEmptyStaves } }
    override isEmpty(): boolean { return false }
    override requestElements(): void {}
    override loadProperties(): void { this.updateHideEmptyStaves() }

    private updateHideEmptyStaves(): void {
        const score = this.m_repository.score()
        this.m_hideEmptyStaves.updateCurrentValue(score?.style().styleB(Sid.hideEmptyStaves))
        this.m_hideEmptyStaves.setStyleId(Sid.hideEmptyStaves)
        this.m_hideEmptyStaves.setIsModified(!!score && !score.style().isDefault(Sid.hideEmptyStaves))
        this.m_hideEmptyStaves.setIsEnabled(!!score)
    }
}
