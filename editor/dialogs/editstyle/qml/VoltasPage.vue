<!-- SPDX-License-Identifier: GPL-3.0-only -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { PointF } from '../../../../src/index'
import { qtrc, useLanguage } from '../../../i18n'
import { ICON_CODES } from '../../../actions/uiactiondata'
import { styleDialogImage } from './images'
import type { NotationStyleLike } from './controls.vue'
const props=defineProps<{style:NotationStyleLike}>()
useLanguage()
const tr=(s:string)=>qtrc('notation/editstyle/voltas',s)
const fields=[{id:'voltaPosAbove',label:'Vertical position:',step:0.25,min:-100,max:0},{id:'voltaHook',label:'Hook height:',step:0.01,min:0,max:99},{id:'voltaLineWidth',label:'Line thickness:',step:0.01,min:0,max:99},{id:'voltaDashLineLen',label:'Dash:',step:0.01,min:0,max:99},{id:'voltaDashGapLen',label:'Gap:',step:0.01,min:0,max:99}]
function value(id:string):number {return id==='voltaPosAbove' ? props.style.value(id).y() : Number(props.style.value(id))}
const text=ref(Object.fromEntries(fields.map(f=>[f.id,String(value(f.id))])))
watch(()=>fields.map(f=>value(f.id)),v=>fields.forEach((f,i)=>{text.value[f.id]=String(v[i])}))
function commit(id:string){const f=fields.find(f=>f.id===id)!,n=parseFloat(text.value[id].replace(',','.'));if(Number.isFinite(n)){const v=Number(Math.max(f.min,Math.min(f.max,n)).toFixed(2));props.style.setValue(id,id==='voltaPosAbove'?new PointF(props.style.value(id).x(),v):v)}text.value[id]=String(value(id))}
function step(id:string,d:number){text.value[id]=String((parseFloat(text.value[id].replace(',','.'))||0)+d);commit(id)}
</script>
<template>
<div class="sd-column" style="gap:12px">
  <fieldset class="sd-groupbox" style="min-width:500px"><legend>{{ tr('Voltas') }}</legend><div class="sd-column" style="gap:12px">
    <template v-for="f in fields" :key="f.id"><div v-if="!['voltaDashLineLen','voltaDashGapLen'].includes(f.id) || style.value('voltaLineStyle')===1" class="sd-row sd-control-row" style="gap:8px"><div class="sd-row-label" :style="f.id==='voltaPosAbove'?{}:{width:'160px'}"><span class="sd-label">{{ tr(f.label) }}</span></div><div class="sd-row-control" style="width:100px"><div class="sd-spinbox" style="width:100px"><input v-model="text[f.id]" type="text" inputmode="decimal" :aria-label="tr(f.label)" @blur="commit(f.id)" @keydown.enter.prevent="commit(f.id)" @keydown.up.prevent="step(f.id,f.step)" @keydown.down.prevent="step(f.id,-f.step)" @keydown.esc.stop="text[f.id]=String(value(f.id))"><span class="sd-unit">{{ qtrc('global','sp') }}</span><span class="sd-steppers"><button type="button" tabindex="-1" aria-label="+" @mousedown.prevent @click="step(f.id,f.step)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_UP) }}</button><button type="button" tabindex="-1" aria-label="-" @mousedown.prevent @click="step(f.id,-f.step)">{{ String.fromCodePoint(ICON_CODES.SMALL_ARROW_DOWN) }}</button></span></div></div><button type="button" class="sd-flat-button icon-only" :aria-label="qtrc('global','Reset')" @click="style.resetValue?.(f.id)"><span class="sd-icon">{{ String.fromCodePoint(ICON_CODES.UNDO) }}</span></button></div>
      <div v-if="f.id==='voltaLineWidth'" class="sd-row sd-control-row" style="gap:8px"><div class="sd-row-label" style="width:160px">{{ qtrc('notation','Line style:') }}</div><div class="sd-row-control" style="width:276px"><div class="sd-flat-radio-group" role="radiogroup" :aria-label="qtrc('notation','Line style:')" style="gap:4px"><button v-for="(icon,index) in [ICON_CODES.LINE_NORMAL,ICON_CODES.LINE_DASHED,ICON_CODES.LINE_DOTTED]" :key="index" type="button" role="radio" class="sd-flat-radio" :aria-label="qtrc('notation',['Normal','Dashed','Dotted'][index])" :title="qtrc('notation',['Normal','Dashed','Dotted'][index])" :aria-checked="style.value('voltaLineStyle')===index" @click="style.setValue('voltaLineStyle',index)"><span class="sd-icon" aria-hidden="true">{{ String.fromCodePoint(icon) }}</span></button></div></div><button type="button" class="sd-flat-button icon-only" :aria-label="qtrc('global','Reset')" @click="style.resetValue?.('voltaLineStyle')"><span class="sd-icon">{{ String.fromCodePoint(ICON_CODES.UNDO) }}</span></button></div></template>
  </div></fieldset>
  <fieldset class="sd-groupbox" style="min-width:500px"><legend>{{ tr('Alignment') }}</legend><div class="sd-column" style="gap:12px"><div v-for="item in [{id:'voltaAlignStartBeforeKeySig',label:'At start of system, start volta:',images:['voltaAfterKeySig.png','voltaBeforeKeySig.png'],options:['After key signature','On key signature']},{id:'voltaAlignEndLeftOfBarline',label:'Align start hook:',images:['voltaRightOfBarline.png','voltaLeftOfBarline.png'],options:['To right side of barlines','To left side of barlines']}]" :key="item.id" class="sd-row" style="gap:16px"><div class="sd-image" style="padding:0"><img :src="styleDialogImage('voltasImages/'+item.images[style.value(item.id)?1:0])" alt="" style="height:96px"></div><div class="sd-column" style="gap:8px"><span class="sd-label">{{ tr(item.label) }}</span><div class="sd-column" role="radiogroup" style="gap:8px"><label v-for="(label,index) in item.options" :key="label" class="sd-radio"><input type="radio" :name="item.id" :checked="style.value(item.id)===(index===1)" @change="style.setValue(item.id,index===1)"><span>{{ tr(label) }}</span></label></div></div></div></div></fieldset>
</div>
</template>
