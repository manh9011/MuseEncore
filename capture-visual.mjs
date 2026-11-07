import { chromium } from 'playwright-core';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
for (const [name,url] of [['vue','http://localhost:5174/'],['ref','https://mlx-notation.vercel.app/']]) {
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 await page.goto(url,{waitUntil:'networkidle',timeout:60000}); await page.waitForTimeout(1500);
 await page.screenshot({path:`${name}-home.png`,fullPage:true});
 console.log(name, await page.title(), (await page.locator('body').innerText()).slice(0,250));
 await page.close();
}
await browser.close();
