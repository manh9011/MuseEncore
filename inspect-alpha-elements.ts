import { openScore } from './test/helpers'
import { inspectorSections, inspectorPropertyChanges } from './src/index'
import { SegmentType } from './src/engraving/dom/segment'
const score = await openScore('dynamic-alpha-fixture.mscx')
for(let m=score.firstMeasure();m;m=m.nextMeasure()) for(let s=m.first(SegmentType.ChordRest);s;s=s.next(SegmentType.ChordRest)) for(const e of s.annotations()) if(e.isDynamic()) {score.select(e);const n=inspectorSections(score).find(x=>x.sectionType==='SECTION_NOTATION')?.models.find(x=>x.modelType==='TYPE_DYNAMIC');if(n?.properties.frameFillColor){console.log(m.no(),n.properties.frameFillColor.value)}}

