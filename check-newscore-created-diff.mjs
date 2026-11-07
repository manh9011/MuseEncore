import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { readFileSync, writeFileSync } from 'node:fs'
for (const width of [1280,390]) {
  const a=PNG.sync.read(readFileSync(`newscore-created-${width}-react.png`)), b=PNG.sync.read(readFileSync(`newscore-created-${width}-vue.png`))
  const diff=new PNG({width:a.width,height:a.height})
  console.log(width, 'dimensions',a.width,a.height,b.width,b.height,'diff',pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:.1}))
  writeFileSync(`newscore-created-${width}-diff.png`,PNG.sync.write(diff))
}
