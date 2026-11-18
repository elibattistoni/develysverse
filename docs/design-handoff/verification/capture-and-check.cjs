const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const server=require('http').createServer((req,res)=>{
 const name=path.join(root,decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
 const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.ttf':'font/ttf','.webp':'image/webp'};
 fs.readFile(name,(error,bytes)=>{if(error){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(name)]||'application/octet-stream');res.end(bytes);});
});
(async()=>{
 await new Promise(resolve=>server.listen(8765,'127.0.0.1',resolve));
 const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),ignoreDefaultArgs:['--hide-scrollbars'],args:['--disable-gpu']});
 const references=[], report=[];
 for(const width of [1440,900,390,320]){
  const ctx=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1,reducedMotion:width<801?'reduce':'no-preference',permissions:['clipboard-read','clipboard-write']});
  const p=await ctx.newPage();const errors=[],external=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/*',route=>{if(!route.request().url().startsWith('http://127.0.0.1:8765/')){external.push(route.request().url());return route.abort();}return route.continue();});
  await p.goto('http://127.0.0.1:8765/');
  await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(im=>{im.loading='eager';return im.decode();}));});
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),await p.evaluate(()=>document.documentElement.clientWidth));
  assert.equal(external.length,0);
  assert.equal(await p.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').length)>0,true);
  const settle=()=>p.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished)));
  async function shot(name,selector,full=false){
   await settle(); await p.mouse.move(0,0);
   const file=width+'-'+name+'.png';
   if(full)await p.screenshot({path:path.join(root,'visual-references',file),fullPage:true});
   else await p.locator(selector).screenshot({path:path.join(root,'visual-references',file)});
   references.push({file,viewport:width+'×1000',dpr:1,state:name,selector:selector||'document',reducedMotion:width<801});
  }
  if([1440,390].includes(width)){
   await shot('page-initial',null,true);
   await shot('hero-initial','.hero');
   for(let i=1;i<3;i++){await p.locator('.fragment').nth(i).focus();await p.keyboard.press('Enter');await shot('hero-selected-'+i,'.hero');}
   await shot('projects','#projects');
   if(width<801){await p.locator('#railNext').click();await shot('projects-second','#projects');}
   else {await p.locator('.project-links a').first().focus();await shot('project-link-focus','#projects');}
   await shot('expertise-front','.expertise-grid');
   for(const trigger of await p.locator('.expertise-open').all())await trigger.click();
   await shot('expertise-back','.expertise-grid');
   assert.equal(await p.locator('.publications-list a').count(),4);
   if(width>800){await p.locator('.neuroscience-content').evaluate(el=>el.scrollTop=el.scrollHeight);await shot('publications-bottom','.expertise-grid');}
   await p.locator('.expertise-back-button').last().click();assert.equal(await p.locator('.expertise-open').last().evaluate(e=>e===document.activeElement),true);
   await shot('constellation-all','.skills-map');
   await p.getByRole('button',{name:'Cognitive Neuroscience',exact:true}).click();await shot('constellation-neuroscience','.skills-map');
   await p.locator('[data-map-action="rotate-right"]').click();await p.locator('[data-map-action="zoom-in"]').click();await shot('constellation-rotated','.skills-map');
   await shot('journey-present','#journey');
   await p.locator('.journey-item summary').first().click();assert.equal(await p.locator('.journey-item[open]').count(),2);await shot('journey-multiple-open','#journey');
   await shot('contact-default','#contact');
   await p.locator('.contact-copy').click();await p.waitForFunction(()=>document.querySelector('.contact-copy').textContent==='Email copied');
   assert.equal(await p.evaluate(()=>navigator.clipboard.readText()),'elisa.battistoni.dev@gmail.com');
   await shot('contact-copied','#contact');
   await p.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{value:async()=>{throw Error('Simulated denied clipboard');}}));
   await p.locator('.contact-copy').click();assert.equal(await p.locator('.contact-fallback').isVisible(),true);await shot('contact-fallback','#contact');
  }
  report.push({width,errors,externalRequests:external,loadedFonts:await p.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight))});
  assert.deepEqual(errors,[]);
  await ctx.close();
 }
 // Reduced-motion desktop and no-JS fallbacks.
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const p=await ctx.newPage();await p.goto('http://127.0.0.1:8765/');await p.locator('.expertise-open').first().click();
 assert.equal(await p.locator('.expertise-back').first().evaluate(e=>getComputedStyle(e).transform),'none');await ctx.close();
 const nojs=await browser.newContext({javaScriptEnabled:false});const n=await nojs.newPage();await n.goto('http://127.0.0.1:8765/');
 assert.equal(await n.locator('.contact-fallback').isVisible(),true);assert.equal(await n.locator('.expertise-back').last().isVisible(),true);await nojs.close();
 fs.writeFileSync(path.join(root,'visual-references/index.json'),JSON.stringify(references,null,2));
 fs.writeFileSync(path.join(root,'verification/browser-results.json'),JSON.stringify({browser:browser.version(),date:'2026-11-17',report,reducedMotionDesktop:true,noJsFallback:true},null,2));
 await browser.close();server.close();console.log('Saved',references.length,'references. All checks passed.');
})().catch(e=>{console.error(e);process.exit(1)});
