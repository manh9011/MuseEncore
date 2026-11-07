import {chromium} from 'playwright-core'
import {PNG} from 'pngjs'
import pixelmatch from 'pixelmatch'
import {readFileSync,writeFileSync} from 'node:fs'
const mobile=process.argv.includes('--mobile'),suffix=mobile?'-mobile':''
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
for(const [name,port] of [['react',5180],['vue',5174]]) {
 const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1280,height:800},deviceScaleFactor:1})
 await page.goto(`http://127.0.0.1:${port}/`); await page.getByText('File',{exact:true}).first().click(); await page.waitForTimeout(200)
 console.log(name,await page.getByRole('menu').first().boundingBox()); await page.screenshot({path:`menu-file-${name}${suffix}.png`}); await page.close()
}
await browser.close(); const a=PNG.sync.read(readFileSync(`menu-file-react${suffix}.png`)),b=PNG.sync.read(readFileSync(`menu-file-vue${suffix}.png`)),d=new PNG({width:a.width,height:a.height});console.log('different pixels',pixelmatch(a.data,b.data,d.data,a.width,a.height,{threshold:0.1}));writeFileSync(`menu-file-diff${suffix}.png`,PNG.sync.write(d))
