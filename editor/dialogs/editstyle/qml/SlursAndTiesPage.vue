<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { qtrc, useLanguage } from '../../../i18n'
import { ICON_CODES } from '../../../actions/uiactiondata'
import type { NotationStyleLike } from './controls.vue'
const props = defineProps<{style: NotationStyleLike}>()
useLanguage()
const tr = (s:string) => qtrc('notation/editstyle/slursandties',s)
const sections: {title:string; fields:[string,string,number][]}[] = [
  {title:'Slurs', fields:[['slurEndWidth','Line thickness at end:',0.05],['slurMidWidth','Line thickness middle:',0.05],['slurDottedWidth','Dotted line thickness:',0.05],['slurMinDistance','Autoplace min. distance:',0.5]]},
  {title:'Ties', fields:[['tieEndWidth','Line thickness at end:',0.05],['tieMidWidth','Line thickness middle:',0.05],['tieDottedWidth','Dotted line thickness:',0.05],['tieMinDistance','Autoplace min. distance:',0.5],['minTieLength','Minimum tie length:',0.1],['minHangingTieLength','Minimum hanging tie length:',0.1]]},
  {title:'Laissez vibrer', fields:[['minLaissezVibLength','Minimum laissez vibrer length:',0.1]]},
]
const fields=sections.flatMap(section=>section.fields)
const values=ref<Record<string,string>>(Object.fromEntries(fields.map(([id])=>[id,String(props.style.value(id) ?? 0)])))
watch(()=>fields.map(([id])=>props.style.value(id)), v=>{ fields.forEach(([id],i)=>{values.value[id]=String(v[i] ?? 0)}) })
function commit(id:string) { const value=parseFloat(values.value[id].replace(',','.')); if(Number.isFinite(value)) props.style.setValue(id,Number(Math.max(0,Math.min(99.99,value)).toFixed(2))); values.value[id]=String(props.style.value(id) ?? 0) }
function step(id:string, amount:number) { values.value[id]=String((parseFloat(values.value[id].replace(',','.')) || 0)+amount); commit(id) }
</script>
<template>
<div class="sd-column" style="gap:18px">
  <fieldset v-for="section in sections" :key="section.title" class="sd-groupbox"><legend>{{ tr(section.title) }}</legend><div class="sd-column" style="gap:12px">
    <div class="sd-grid" style="grid-template-columns:repeat(3,auto);gap:8px"><template v-for="[id,label,increment] in section.fields" :key="id"><span class="sd-label">{{ tr(label) }}</span><div class="sd-spinbox" style="width:80px"><input v-model="values[id]" type="text" inputmode="decimal" :aria-label="tr(label)" @blur="commit(id)" @keydown.enter.prevent="commit(id)" @keydown.up.prevent="step(id,increment)" @keydown.down.prevent="step(id,-increment)" @keydown.esc.stop="values[id]=String(style.value(id) ?? 0)"><span class="sd-unit">{{ qtrc('global','sp') }}</span><span class="sd-steppers"><button type="button" tabindex="-1" aria-label="+" @mousedown.prevent @click="step(id,increment)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_UP) }}</button><button type="button" tabindex="-1" aria-label="-" @mousedown.prevent @click="step(id,-increment)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_DOWN) }}</button></span></div><button type="button" class="sd-flat-button icon-only" :aria-label="qtrc('global','Reset')" @click="style.resetValue?.(id)"><span class="sd-icon">{{ String.fromCodePoint(ICON_CODES.UNDO) }}</span></button></template></div>
    <div v-if="section.title==='Slurs'" class="sd-column" style="gap:8px"><span class="sd-label">{{ tr('Partial slurs across repeats and breaks:') }}</span><div class="sd-column" role="radiogroup" style="gap:8px"><label v-for="option in [{value:false,label:'Follow contour of notes'},{value:true,label:'Angle away from staff'}]" :key="String(option.value)" class="sd-radio"><input type="radio" name="slur-angle" :checked="style.value('angleHangingSlursAwayFromStaff') === option.value" @change="style.setValue('angleHangingSlursAwayFromStaff',option.value)"><span>{{ tr(option.label) }}</span></label></div></div>
    <template v-if="section.title==='Ties'"><div v-for="item in [{id:'tiePlacementSingleNote',label:'Placement on single notes:',icons:[ICON_CODES.TIE_INSIDE,ICON_CODES.TIE_OUTSIDE]},{id:'tiePlacementChord',label:'Placement on chords:',icons:[ICON_CODES.TIE_CHORD_INSIDE,ICON_CODES.TIE_CHORD_OUTSIDE]}]" :key="item.id" class="sd-column" style="gap:8px"><span class="sd-label">{{ qtrc('notation',item.label) }}</span><div class="sd-flat-radio-group" role="radiogroup" style="gap:4px"><button v-for="(icon,index) in item.icons" :key="index" type="button" role="radio" class="sd-flat-radio" style="width:106px;flex:0 0 auto" :title="qtrc('inspector',index===0?'Inside':'Outside')" :aria-label="qtrc('inspector',index===0?'Inside':'Outside')" :aria-checked="style.value(item.id)===index+1" @click="style.setValue(item.id,index+1)"><span class="sd-icon" aria-hidden="true">{{ String.fromCodePoint(icon) }}</span></button></div></div><div class="sd-column" style="gap:8px"><span class="sd-label">{{ qtrc('notation','Placement of inner ties with respect to augmentation dots:') }}</span><div class="sd-column" role="radiogroup" style="gap:8px"><label v-for="(label,index) in ['Auto','Always before dots','Always after dots']" :key="label" class="sd-radio"><input type="radio" name="tie-dots" :checked="style.value('tieDotsPlacement')===index" @change="style.setValue('tieDotsPlacement',index)"><span>{{ qtrc('notation',label) }}</span></label></div></div></template>
    <label v-if="section.title==='Laissez vibrer'" class="sd-checkbox"><input type="checkbox" :checked="style.value('laissezVibUseSmuflSym')===true" @change="style.setValue('laissezVibUseSmuflSym',!style.value('laissezVibUseSmuflSym'))"><span>{{ tr('Use SMuFL symbols') }}</span></label>
  </div></fieldset>
</div>
</template>
