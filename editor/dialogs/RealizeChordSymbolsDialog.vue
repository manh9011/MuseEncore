<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script lang="ts">
import { shallowRef } from 'vue'
import { currentScore } from '../scoreview'
import type { Score } from '../../src/index'
const pending = shallowRef<Score | null>(null)
export function openRealizeChordSymbolsDialog(): void { pending.value = currentScore() }
</script>
<script setup lang="ts">
import { computed, nextTick, ref, shallowRef as modelRef, watch } from 'vue'
import { HDuration, Voicing, realizableChordSymbols, realizeChordSymbols } from '../../src/index'
import { qtrc, useLanguage } from '../i18n'
import { scoreChanged } from '../scoreview'
useLanguage()
const chords = modelRef<ReturnType<typeof realizableChordSymbols>>([])
const override = ref(false), literal = ref(true), voicing = ref(Voicing.AUTO), duration = ref(HDuration.UNTIL_NEXT_CHORD_SYMBOL), showTable = ref(false), dialog=ref<HTMLDialogElement|null>(null)
const tr=(s:string)=>qtrc('RealizeHarmonyDialogBase',s), trv=(s:string)=>qtrc('VoicingSelect',s)
watch(pending,async score=>{chords.value=score?realizableChordSymbols(score):[];override.value=false;literal.value=true;voicing.value=Voicing.AUTO;duration.value=HDuration.UNTIL_NEXT_CHORD_SYMBOL;showTable.value=false;if(score){await nextTick();dialog.value?.showModal()}})
const names=computed(()=>chords.value.map(c=>c.name).join(' '))
function apply(){if(pending.value&&realizeChordSymbols(pending.value,override.value?{literal:literal.value,voicing:voicing.value,duration:duration.value}:null))scoreChanged();dialog.value?.close()}
</script>
<template>
 <dialog v-if="pending" ref="dialog" class="realize-dialog" aria-labelledby="realize-dialog-title" :title="tr('Convert chord symbols into notes')" @close.self="pending=null"><h2 id="realize-dialog-title">{{tr('Realize chord symbols')}}</h2><form @submit.prevent="apply"><div class="chord-list"><span>{{tr('Chord symbols to be realized:')}}</span><span class="chord-names">{{names}}</span></div><fieldset class="groupbox"><legend><label class="check"><input v-model="override" type="checkbox" />{{tr('Override with custom options')}}</label></legend><label class="field-row"><span>{{trv('Interpretation:')}}</span><select v-model="literal" :disabled="!override"><option :value="false">{{trv('Jazz')}}</option><option :value="true">{{trv('Literal')}}</option></select></label><label class="field-row"><span>{{trv('Voicing:')}}</span><select v-model.number="voicing" :disabled="!override"><option v-for="(label,i) in ['Auto','Root only','Close','Drop two','Six note','Four note','Three note']" :key="i" :value="i">{{trv(label)}}</option></select></label><label class="field-row"><span>{{trv('Duration:')}}</span><select v-model.number="duration" :disabled="!override"><option v-for="(label,i) in ['Until next chord symbol','Until measure end','Chord/rest duration']" :key="i" :value="i">{{trv(label)}}</option></select></label></fieldset><table v-if="showTable" class="chord-table"><thead><tr><th>ID</th><th>Name</th><th>Intervals</th><th>Notes</th></tr></thead><tbody><tr v-for="(chord,i) in chords" :key="i"><td>{{chord.id}}</td><td>{{chord.name}}</td><td>{{chord.intervals}}</td><td>{{chord.noteNames}}</td></tr></tbody></table><div class="dialog-buttons"><button type="button" class="secondary" @click="showTable=!showTable">{{showTable?qtrc('global','Show less…'):tr('Show more…')}}</button><span class="spacer" /><button type="button" class="secondary" @click="dialog?.close()">{{qtrc('global','Cancel')}}</button><button type="submit" class="primary">{{qtrc('global','OK')}}</button></div></form></dialog>
</template>
