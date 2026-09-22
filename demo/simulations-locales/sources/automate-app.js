(function(){
 'use strict';
 const A=globalThis.ChromaticLife,root=document.getElementById('vie-chromatique'),get=id=>root.querySelector('#v-'+id);
 let world=new A.World(),running=false,selectedKey=null,dirty=true,last=performance.now(),accumulator=0;
 let yaw=-25*Math.PI/180,pitch=18*Math.PI/180,zoom=1,drag=null,projected=[],visualTime=0,lastDraw=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const canvas=get('canvas'),ctx=canvas.getContext('2d'),TAU=Math.PI*2;
 const fmt=n=>n.toLocaleString('fr-FR'),copy=x=>JSON.parse(JSON.stringify(x));
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const message=s=>{get('message').textContent=s;};
 function error(e){get('error').textContent=e.message||String(e);get('error').hidden=false;}
 function clearError(){get('error').hidden=true;get('error').textContent='';}
 const controls={seed:c=>c.seed,'initial-shape':c=>c.initial.shape,'condensate-style':c=>c.display.condensateStyle,breakup:c=>c.breakup.probability,'emission-mode':c=>c.emission.mode,mode:c=>c.emergence.mode,'radial-rate':c=>c.radial.rate,'radial-scale':c=>c.radial.unitRadius,addition:c=>c.colors.addition,tolerance:c=>c.gravity.tolerance,minimum:c=>c.gravity.minimumPositions,
   condensation:c=>c.condensation.requiredPositions,strength:c=>c.gravity.strength,radius:c=>c.gravity.radius,
   spectrum:c=>c.gravity.spectralTolerance,subtraction:c=>c.collisions.subtraction,probability:c=>c.collisions.probability,
   birth:c=>c.life.birth.join(','),survival:c=>c.life.survival.join(','),inheritance:c=>c.life.inheritance,emission:c=>c.emission.probability,
   trigger:c=>c.gravity.trigger,'min-loops':c=>c.condensation.minimumLoops,half:c=>c.structures.pointsPerHalf,string:c=>c.structures.halvesPerString,loop:c=>c.structures.stringsPerLoop};
 function fillControls(){
   const c=world.config;get('positions').value=c.positions;get('target').value=c.target;get('rate').value=c.ticksPerSecond;
   for(const [id,value]of Object.entries(controls))get(id).value=value(c);
   get('minimum').max=get('condensation').max=c.positions;get('radius').max=c.grid.size;
   get('persistent').checked=c.condensation.persistent;get('protect').checked=c.life.protectCondensates;get('radial').checked=c.radial.enabled;get('condensation').disabled=c.emergence.mode!=='palette';get('applied').textContent='Appliqué : intensité '+c.gravity.strength+' · gravité '+(c.gravity.enabled?'activée':'désactivée')+' · condition '+c.emergence.mode;get('life').checked=c.life.enabled;get('gravity').checked=c.gravity.enabled;
   get('point-weight').value=c.weights.point;get('half-weight').value=c.weights['demi-corde'];get('string-weight').value=c.weights.corde;get('loop-weight').value=c.weights.boucle;
   const body=get('palette-table');body.replaceChildren();
   c.palette.forEach((entry,index)=>{
     const row=document.createElement('tr'),id=document.createElement('th'),colorCell=document.createElement('td'),requiredCell=document.createElement('td');
     id.scope='row';id.textContent=String(index+1).padStart(2,'0');
     const color=document.createElement('input');color.type='color';color.value=entry.color;color.className='form-control form-control-color';color.dataset.positionColor=index;color.setAttribute('aria-label','Couleur de la position '+(index+1));colorCell.append(color);
     const required=document.createElement('input');required.type='checkbox';required.className='form-check-input';required.checked=c.gravity.requiredPositions.includes(index+1);required.dataset.positionRequired=index;required.setAttribute('aria-label','Position '+(index+1)+' indispensable pour la gravité');requiredCell.append(required);
     row.append(id,colorCell,requiredCell);body.append(row);
   });
   get('json').value=JSON.stringify(c,null,2);
 }
 function normalizedHex(s){s=s.trim().replace(/^#/,'');if(/^[0-9a-f]{3}$/i.test(s))s=s.split('').map(c=>c+c).join('');if(!/^[0-9a-f]{6}$/i.test(s))throw Error('Couleur cible invalide : utilisez #RRGGBB.');return '#'+s.toUpperCase();}
 function number(id){const s=get(id).value.trim();if(!s)throw Error('Valeur manquante : '+id);const n=Number(s);if(!Number.isFinite(n))throw Error('Nombre invalide : '+id);return n;}
 function list(id){const text=get(id).value.trim();if(!text)return[];const items=text.split(',').map(s=>s.trim());if(items.some(s=>!/^\d+$/.test(s)))throw Error(id+' : liste d’entiers séparés par des virgules.');return items.map(Number);}
 function readControls(){
   const c=copy(world.config);c.target=normalizedHex(get('target').value);c.ticksPerSecond=number('rate');
   c.seed=number('seed');c.initial.shape=get('initial-shape').value;c.display.condensateStyle=get('condensate-style').value;c.breakup.probability=number('breakup');c.emission.mode=get('emission-mode').value;
   c.colors.addition=get('addition').value;c.gravity.tolerance=number('tolerance');c.gravity.minimumPositions=number('minimum');c.condensation.requiredPositions=number('condensation');
   c.gravity.strength=number('strength');c.gravity.radius=number('radius');c.gravity.spectralTolerance=number('spectrum');c.collisions.subtraction=get('subtraction').value;c.collisions.probability=number('probability');
   c.life.birth=list('birth');c.life.survival=list('survival');c.life.inheritance=get('inheritance').value;c.life.enabled=get('life').checked;c.gravity.enabled=get('gravity').checked;c.emission.probability=number('emission');
   c.weights={point:number('point-weight'),'demi-corde':number('half-weight'),corde:number('string-weight'),boucle:number('loop-weight')};
   c.gravity.trigger=get('trigger').value;c.condensation.minimumLoops=number('min-loops');c.structures.pointsPerHalf=number('half');c.structures.halvesPerString=number('string');c.structures.stringsPerLoop=number('loop');
   c.emergence.mode=get('mode').value;c.condensation.persistent=get('persistent').checked;c.life.protectCondensates=get('protect').checked;c.radial={enabled:get('radial').checked,rate:number('radial-rate'),unitRadius:number('radial-scale')};
   c.gravity.requiredPositions=[];
   c.palette.forEach((p,i)=>{p.color=root.querySelector('[data-position-color="'+i+'"]').value.toUpperCase();if(root.querySelector('[data-position-required="'+i+'"]').checked)c.gravity.requiredPositions.push(i+1);});
   return A.validate(c);
 }
 get('mode').addEventListener('change',()=>{get('condensation').disabled=get('mode').value!=='palette';});
 root.addEventListener('input',e=>{if(e.target.closest('details')&&!['v-json','v-yaw','v-pitch'].includes(e.target.id))message('Réglages modifiés : cliquer sur Appliquer les réglages.');});
 function refreshUi(){
   const s=world.stats;
   get('stats').textContent='Génération '+fmt(s.generation)+' · '+fmt(s.cells)+' cellules · '+fmt(s.sources)+' foyers actifs · '+fmt(s.configurations)+' configurations X · '+fmt(s.spheres)+' condensats';
   get('events').textContent=fmt(s.points)+' points libres · '+fmt(s.halves)+' demi-cordes · '+fmt(s.strings)+' cordes · '+fmt(s.loops)+' boucles. Dernier pas : '+fmt(s.additions)+' collisions + / '+fmt(s.subtractions)+' collisions − · '+fmt(s.gravityMoves)+' pas gravitationnels. Apparitions de X : '+fmt(s.totalEmergences)+' cumulées (récidives incluses), +'+s.newConfigurations+' / −'+s.lostConfigurations+' au dernier pas. Constituant(s) : '+fmt(s.units);
   get('balance').textContent='Bilan du dernier pas : +'+fmt(s.unitsBorn)+' créés · −'+fmt(s.unitsDied)+' disparus · −'+fmt(s.unitsCancelled)+' annulés · −'+fmt(s.unitsClipped)+' plafonnés. Écart inexpliqué : '+fmt(s.balanceError)+'. '+fmt(s.breakups)+' ruptures · '+fmt(s.emittedStructures)+' structures émises.';
   get('lifetime').textContent='Plus long épisode X en cours : '+fmt(s.longestXAge)+' génération(s). Suivi par site ; une durée ne prouve pas la stabilité physique.';
   root.dataset.configurations=s.configurations;root.dataset.eligible=s.eligible;root.dataset.gravityMoves=s.gravityMoves;root.dataset.generation=s.generation;root.dataset.sources=s.sources;root.dataset.spheres=s.spheres;root.dataset.halves=s.halves;root.dataset.strings=s.strings;root.dataset.loops=s.loops;
   get('run').textContent=running?'Pause':'Démarrer';get('run').setAttribute('aria-pressed',String(running));inspect();
 }
 function inspect(){
   const box=get('inspector');box.replaceChildren();
   if(selectedKey===null){box.textContent='Cliquez sur une cellule : sa couleur, ses positions et sa gravité seront affichées ici.';return;}
   const cell=world.cells.get(selectedKey),xyz=world.coordinates(selectedKey);
   if(!cell){box.textContent='Cellule ('+xyz.join(', ')+') actuellement vide.';return;}
   const summary=document.createElement('p');summary.textContent='('+xyz.join(', ')+') · '+cell.color+' · '+cell.coverage+'/'+world.config.positions+' positions, dont '+cell.loopCoverage+' dans des boucles · masse '+fmt(cell.mass)+' · '+(cell.configurationX?'configuration X présente':cell.condensed?'condensat mémorisé':'configuration X absente');box.append(summary);
   const state=document.createElement('p');state.textContent='Boucles chez les voisins immédiats : '+cell.neighborLoops+' · source admissible : '+(cell.eligible?'oui':'non')+' · attraction activée : '+(cell.source?'oui':'non')+' · rayon d’enveloppe : '+cell.envelopeRadius.toFixed(3)+' → cible '+cell.targetRadius.toFixed(3)+' (cellules).';box.append(state);
   const episode=world.activeEpisodes.get(selectedKey);if(episode){const age=document.createElement('p');age.textContent='Épisode X n° '+episode.id+' · suivi depuis la génération '+episode.start+' · durée observée '+(world.generation-episode.start)+'.';box.append(age);}
   const shapes=document.createElement('p');shapes.textContent=cell.shapeCounts.map((n,i)=>n+' '+A.TYPES[i]+'(s)').join(' · ');box.append(shapes);
   const recipe=document.createElement('p');recipe.textContent='Écart à la cible : '+A.distance(cell.rgb,world.target).toFixed(3)+' / tolérance '+world.config.gravity.tolerance+'. '+(cell.matches?'Recette de couleur satisfaite.':'Recette de couleur non satisfaite.')+' Déclencheur actif : '+({configuration:'configuration X actuelle',sphere:'condensat (mémoire incluse)',color:'couleur cible',both:'X ET couleur cible',either:'X OU couleur cible'})[world.config.gravity.trigger]+'.';box.append(recipe);
   const inventory=document.createElement('div');inventory.className='v-inventory';
   cell.counts.forEach((v,i)=>{if(!v)return;const span=document.createElement('span'),chip=document.createElement('span');chip.className='v-chip';chip.style.background=world.config.palette[i].color;span.append(chip,document.createTextNode(String(i+1).padStart(2,'0')+' : '+v+' point(s) constitutif(s)'));inventory.append(span);});box.append(inventory);
 }
 function applyRules(c,restart){
   const valid=A.validate(c);clearError();
   if(!restart&&(valid.seed!==world.config.seed||valid.initial.shape!==world.config.initial.shape))throw Error('La graine ou la forme initiale a changé : utilisez « Nouvelle population avec ces réglages ».');
   if(restart){world=new A.World(valid);running=false;selectedKey=null;accumulator=0;}else{world.configure(valid);world.refresh();}
   fillControls();refreshUi();dirty=true;message(restart?'Règles appliquées ; nouvelle population en pause.':'Règles appliquées à la population actuelle.');
 }
 get('apply').addEventListener('click',()=>{try{applyRules(readControls(),false);}catch(e){error(e);}});
 get('new-population').addEventListener('click',()=>{try{applyRules(readControls(),true);}catch(e){error(e);}});
 get('perturb').addEventListener('click',()=>{try{running=false;accumulator=0;const result=world.perturb(selectedKey);clearError();refreshUi();dirty=true;message('Structure rompue en '+result.counts.reduce((a,b)=>a+b,0)+' points libres, sans perte de constituants. Intervention enregistrée à la génération '+world.generation+'.');}catch(e){error(e);refreshUi();}});
 get('positions').addEventListener('change',()=>{
   try{const c=readControls(),n=Number(get('positions').value),old=c.positions;c.positions=n;c.palette=n<old?c.palette.slice(0,n):c.palette.concat(A.palette(n,c.target).slice(old));
     c.gravity.minimumPositions=Math.min(c.gravity.minimumPositions,n);c.gravity.requiredPositions=c.gravity.requiredPositions.filter(p=>p<=n);c.condensation.requiredPositions=c.condensation.requiredPositions===old?n:Math.min(c.condensation.requiredPositions,n);applyRules(c,true);
   }catch(e){get('positions').value=world.config.positions;error(e);}
 });
 get('rate').addEventListener('change',()=>{try{const c=copy(world.config);c.ticksPerSecond=number('rate');world.configure(c);get('json').value=JSON.stringify(world.config,null,2);clearError();}catch(e){error(e);}});
 get('run').addEventListener('click',()=>{running=!running;accumulator=0;refreshUi();message(running?'Évolution par générations. Les règles peuvent être ajustées pendant le calcul.':'Simulation en pause.');});
 function generation(){world.step();refreshUi();dirty=true;}
 get('step').addEventListener('click',()=>{running=false;accumulator=0;generation();message('Une génération calculée.');});
 get('reset').addEventListener('click',()=>{world.reset();running=false;selectedKey=null;accumulator=0;refreshUi();dirty=true;message('Population initiale restaurée avec la même graine.');});
 function parseRules(text){if(text.length>200000)throw Error('Fichier de règles trop volumineux (200 Ko maximum).');return A.validate(JSON.parse(text));}
 get('json-apply').addEventListener('click',()=>{try{applyRules(parseRules(get('json').value),true);}catch(e){error(e);}});
 get('import').addEventListener('change',async()=>{try{const file=get('import').files[0];if(!file)return;if(file.size>200000)throw Error('Fichier de règles trop volumineux (200 Ko maximum).');applyRules(parseRules(await file.text()),true);}catch(e){error(e);}finally{get('import').value='';}});
 get('export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(world.config,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='regles-automate-chromatique.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Export des règles actuellement appliquées.');});
 get('experiment').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(world.experiment(),null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='experience-cordes-generation-'+world.generation+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Expérience exportée : historique, changements de règles et état courant.');});
 function draw(){
   const W=960,H=600,scale=canvas.width/W,n=world.n,unit=300/n,center=(n-1)/2;
   const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
   function project(v){const [x,y,z]=v.map(q=>(q-center)*unit),xx=cy*x+sy*z,zz=-sy*x+cy*z,yy=cp*y-sp*zz,depth=780-(sp*y+cp*zz),k=850/depth*zoom;return{x:W/2+xx*k,y:H/2+yy*k,k,depth};}
   ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.setTransform(scale,0,0,scale,0,0);
   const foreground=getComputedStyle(canvas).color;
   ctx.strokeStyle=foreground;ctx.globalAlpha=.16;ctx.lineWidth=1;
   for(let corner=0;corner<8;corner++)for(let axis=0;axis<3;axis++)if(!(corner&(1<<axis))){const a=[0,1,2].map(i=>(corner&(1<<i))?n-.5:-.5),b=[...a];b[axis]=n-.5;const p=project(a),q=project(b);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
   ctx.globalAlpha=1;
   projected=[...world.cells.values()].map(cell=>({cell,...project(world.coordinates(cell.key))})).sort((a,b)=>b.depth-a.depth);
   const wave=visualTime*TAU*world.config.display.waveFrequency,amplitude=reduced.matches?0:world.config.display.waveAmplitude;
   for(const q of projected){
     const cell=q.cell,envelope=world.config.display.condensateStyle==='envelope',r=(envelope?(world.config.radial.enabled&&cell.envelopeRadius>0?Math.max(2,unit*cell.envelopeRadius):cell.condensed?9:5):unit*.4)*q.k,origin=world.coordinates(cell.key);
     ctx.fillStyle=cell.color;ctx.strokeStyle=cell.color;ctx.lineWidth=Math.max(1,1.3*q.k);
     if(envelope&&(cell.condensed||(world.config.radial.enabled&&cell.envelopeRadius>.005))){
       const g=ctx.createRadialGradient(q.x-r*.3,q.y-r*.3,.3,q.x,q.y,r);g.addColorStop(0,cell.color);g.addColorStop(1,'rgba('+cell.rgb.join(',')+',0.28)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,r,0,TAU);ctx.fill();
       const loops=cell.parts.filter(p=>p.stage===3);
       for(let j=0;j<3;j++){ctx.strokeStyle=A.hex(world.partColor(loops[j%Math.max(1,loops.length)]||cell.parts[0]));ctx.beginPath();ctx.ellipse(q.x,q.y,r,r*.4,j*Math.PI/3,0,TAU);ctx.stroke();}
     }else{
       // All components remain in the model; up to eight representative strands are drawn per occupied cell.
       const parts=cell.parts.slice(0,8);
       for(let j=0;j<parts.length;j++){
         const part=parts[j],theta=cell.key*.73+j*2.4,phi=cell.key*.37+j*.6;
         const axis=[Math.cos(theta),Math.sin(theta),0],side=[-Math.sin(theta)*Math.cos(phi),Math.cos(theta)*Math.cos(phi),Math.sin(phi)];
         const center=origin.map((v,i)=>v+(parts.length>1?axis[i]*.09*Math.sin(j*2.4):0));
         const at=(u,v)=>project(center.map((x,i)=>x+axis[i]*u+side[i]*v));
         const color=A.hex(world.partColor(part));ctx.strokeStyle=color;ctx.fillStyle=color;
         if(part.stage===0){const p=at(0,0);ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.4,2*q.k),0,TAU);ctx.fill();continue;}
         const length=part.stage===1?.19:part.stage===2?.34:.24;
         const count=part.stage===3?36:16;let first=null,lastPoint=null;ctx.beginPath();
         for(let t=0;t<=count;t++){
           let u,v;if(part.stage===3){const a=t/count*TAU,k=1+amplitude*.2*Math.sin(a*3+wave);u=Math.cos(a)*length*k;v=Math.sin(a)*length*k;}
           else{u=(t/count*2-1)*length;v=Math.sin(t/count*Math.PI*(part.stage===1?2:4)+wave)*length*amplitude;}
           const p=at(u,v);if(!first){first=p;ctx.moveTo(p.x,p.y);}else ctx.lineTo(p.x,p.y);lastPoint=p;
         }ctx.stroke();
         if(part.stage===1){for(const p of [first,lastPoint]){ctx.beginPath();ctx.arc(p.x,p.y,1.4*q.k,0,TAU);ctx.fill();}}
       }
     }
     if(cell.configurationX){ctx.strokeStyle=foreground;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(q.x-3,q.y-r-4);ctx.lineTo(q.x+3,q.y-r+2);ctx.moveTo(q.x+3,q.y-r-4);ctx.lineTo(q.x-3,q.y-r+2);ctx.stroke();}
     if(cell.source){ctx.globalAlpha=.7;ctx.strokeStyle=foreground;ctx.lineWidth=.9;ctx.beginPath();ctx.arc(q.x,q.y,r+3,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
     if(cell.key===selectedKey){ctx.strokeStyle=foreground;ctx.lineWidth=2;ctx.strokeRect(q.x-r-6,q.y-r-6,2*r+12,2*r+12);}
     q.hit=Math.max(9,r+4);
   }
   ctx.setTransform(1,0,0,1,0,0);
 }
 function resize(){canvas.width=Math.max(1,Math.round(canvas.clientWidth*Math.min(devicePixelRatio||1,2)));canvas.height=Math.round(canvas.width*600/960);dirty=true;}
 function camera(){get('yaw').value=Math.round(yaw*180/Math.PI);get('pitch').value=Math.round(pitch*180/Math.PI);get('zoom').value=Math.round(zoom*100);dirty=true;}
 canvas.addEventListener('pointerdown',e=>{if(!e.isPrimary)return;drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!drag||!e.isPrimary)return;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>4)drag.moved=true;if(drag.moved){yaw=((yaw+(e.clientX-drag.x)*.008+Math.PI)%TAU+TAU)%TAU-Math.PI;pitch=clamp(pitch+(e.clientY-drag.y)*.008,-85*Math.PI/180,85*Math.PI/180);camera();}drag.x=e.clientX;drag.y=e.clientY;});
 canvas.addEventListener('pointerup',e=>{if(!drag)return;if(!drag.moved){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*960,y=(e.clientY-r.top)/r.height*600;const hit=[...projected].reverse().find(q=>Math.hypot(q.x-x,q.y-y)<=q.hit);selectedKey=hit?hit.cell.key:null;inspect();dirty=true;}drag=null;});
 canvas.addEventListener('pointercancel',()=>{drag=null;});
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=clamp(zoom*Math.exp(-e.deltaY*(e.deltaMode===1?16:1)*.001),.5,2.3);camera();},{passive:false});
 get('zoom').addEventListener('input',()=>{zoom=Number(get('zoom').value)/100;camera();});
 get('yaw').addEventListener('input',()=>{yaw=Number(get('yaw').value)*Math.PI/180;camera();});
 get('pitch').addEventListener('input',()=>{pitch=Number(get('pitch').value)*Math.PI/180;camera();});
 new ResizeObserver(resize).observe(canvas);new MutationObserver(()=>{dirty=true;}).observe(document.documentElement,{attributes:true,attributeFilter:['class','style','data-theme']});
 function frame(now){
   if(!root.isConnected)return;const dt=Math.min((now-last)/1000,.15);last=now;
   if(running&&!document.hidden){visualTime+=dt;accumulator+=dt;const interval=1/world.config.ticksPerSecond;if(accumulator>=interval){accumulator-=interval;try{generation();}catch(e){running=false;error(e);refreshUi();}}if(!reduced.matches&&now-lastDraw>66&&(world.stats.halves||world.stats.strings||world.stats.loops))dirty=true;}
   if(dirty&&!document.hidden){draw();dirty=false;lastDraw=now;}requestAnimationFrame(frame);
 }
 fillControls();refreshUi();resize();draw();requestAnimationFrame(frame);
})();
