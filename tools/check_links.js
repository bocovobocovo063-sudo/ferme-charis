const fs = require('fs');
const path = require('path');
const root = process.cwd();
const files = fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const hrefs = new Set();
files.forEach(f=>{
  try{
    const s = fs.readFileSync(path.join(root,f),'utf8');
    const m = s.match(/href="[^\"]+\.html"/g) || [];
    m.forEach(item=>{
      let p = item.slice(6,-1);
      if(!p.startsWith('http') && !p.startsWith('mailto:') && !p.startsWith('#')) hrefs.add(p);
    });
  }catch(e){console.error('err',f,e.message)}
});
const missing = [];
hrefs.forEach(h=>{
  const clean = h.split('?')[0].split('#')[0];
  const target = path.join(root, clean);
  if(!fs.existsSync(target)) missing.push(h);
});
console.log('checked files:', files.length);
if(missing.length===0) console.log('No missing internal .html targets');
else{ console.log('Missing targets:'); missing.forEach(m=>console.log(m)); }
