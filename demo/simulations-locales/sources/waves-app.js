(function(){
 'use strict';
 const $=id=>document.getElementById('w-'+id),canvas=$('canvas'),ctx=canvas.getContext('2d');
 const fields=['seed','colors','criterion','amplitude','waveSpeed','thickness','holdSteps','damping','gravityStrength','gravityEnabled'];
 let world=new WaveSurfaces.World(),running=false,timer=null,yaw=.65,pitch=.45,zoom=1,drag=null,illustration=null,illustrations=[],lastFrame=0;
 function pause(){running=false;clearTimeout(timer);$('run').textContent='Démarrer';}
 function fail(e){pause();$('error').hidden=false;$('error').textContent=e.message;}
 function controls(){if(!Array.from($('colors').options).some(o=>Number(o.value)===world.config.colors)){const o=document.createElement('option');o.value=world.config.colors;o.textContent=world.config.colors+' (ancien réglage)';$('colors').append(o);}$('focus').innerHTML='<option value="all">Toutes les surfaces</option>'+world.surfaces.map((s,i)=>'<option value="'+i+'">Surface '+(i+1)+'</option>').join('');$('layout-note').textContent=world.config.initialLayout==='prepared'?'Disposition préparée : surfaces autour du centre, faible amplitude. Ce témoin facilite une fermeture ; il ne mesure pas sa fréquence spontanée.':'Disposition aléatoire. Le bouton d’essai prépare une enveloppe avec les surfaces choisies, puis recommence en pause.';for(const k of fields){if(k==='gravityEnabled')$(k).checked=world.config[k];else $(k).value=world.config[k];}$('json').value=JSON.stringify(world.config,null,2);$('legend').innerHTML=world.surfaces.map((s,i)=>'<span><i class="w-dot" style="background:'+s.color+'"></i>Surface '+(i+1)+'</span>').join('');}
 function restart(c){try{const next=new WaveSurfaces.World(c);pause();illustration=null;illustrations=[];world=next;$('error').hidden=true;controls();render();}catch(e){fail(e);}}
 function displayZoom(){return zoom/(1+(illustration?.expansion||0)*.6);}
 function project(p){const a=p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw),b=-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw),y=p[1]*Math.cos(pitch)-b*Math.sin(pitch),z=p[1]*Math.sin(pitch)+b*Math.cos(pitch);return[480+a*112*displayZoom(),280-y*112*displayZoom(),z];}
 function path(points){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));}
 function cube(center,r,color,dashed=false){const p=[];for(let i=0;i<8;i++)p.push(project(center.map((x,d)=>x+((i>>d&1)?r:-r))));ctx.strokeStyle=color;ctx.lineWidth=1;ctx.setLineDash(dashed?[4,5]:[]);for(let i=0;i<8;i++)for(let d=0;d<3;d++)if(!(i>>d&1)){path([p[i],p[i|1<<d]]);ctx.stroke();}ctx.setLineDash([]);}
 function render(){
   ctx.fillStyle='#101923';ctx.fillRect(0,0,960,560);cube([0,0,0],1,'#7b899d66',true);
   const N=world.config.resolution,faces=[];
   for(let si=0;si<world.surfaces.length;si++){const s=world.surfaces[si];if($('focus').value!=='all'&&Number($('focus').value)!==si)continue;const pts=[];for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const k=i%N+N*(j%N),position=world.position(s,i,j,s.h[k]);pts.push(project(illustration?illustration.deform(position,si,k):position));};
    for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=i+(N+1)*j,ps=[pts[k],pts[k+1],pts[k+N+2],pts[k+N+1]];faces.push({ps,z:ps.reduce((v,p)=>v+p[2],0)/4,color:s.color,content:s.content[i+N*j]});}}
   faces.sort((a,b)=>a.z-b.z);const opacity=($('focus').value==='all'?Math.sqrt(4/world.config.colors):1)*(illustration?1-.8*illustration.expansion:1);for(const f of faces){path(f.ps);ctx.closePath();ctx.fillStyle=f.color;ctx.globalAlpha=.08*opacity*f.content;ctx.fill();ctx.strokeStyle=f.color;ctx.globalAlpha=.5*opacity*f.content;ctx.lineWidth=.65;ctx.stroke();}ctx.globalAlpha=1;
   const D=world.config.detectorResolution,dx=2/D;
   for(let k=0;k<world.mask.length;k++)if(!illustration&&world.mask[k]&&$('voxels').checked)cube([k%D,Math.floor(k/D)%D,Math.floor(k/D**2)].map(x=>-1+(x+.5)*dx),dx*.35,'#edf6ff88');
   for(const s of (illustration?[]:world.activeAttractors())){const p=project(s.center);ctx.strokeStyle=world.stats.activeSources?'#FFD86A':'#f0f4ff';ctx.lineWidth=2;path([[p[0]-5,p[1]],[p[0]+5,p[1]]]);ctx.stroke();path([[p[0],p[1]-5],[p[0],p[1]+5]]);ctx.stroke();}
   for(const d of world.domains)if(!illustration&&d.radius>0){
     const p=project(d.center),r=Math.max(1,d.radius*112*displayZoom()),color=d.phase==='linked'?'#fff0ac':'#ff9b67';
     ctx.fillStyle=color+'35';ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(p[0],p[1],r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(p[0],p[1],r,r*.35,0,0,Math.PI*2);ctx.stroke();ctx.font='12px system-ui';ctx.fillStyle=color;ctx.fillText('D'+d.id,p[0]+r+4,p[1]-r-4);
     if(d.phase==='linked')for(let i=0;i<d.patches.length;i++){const k=d.patches[i][0],anchor=project(world.position(world.surfaces[i],k%N,Math.floor(k/N)));ctx.strokeStyle=world.surfaces[i].color+'99';ctx.lineWidth=.7;path([anchor,p]);ctx.stroke();}
   }
   if(illustration)drawIllustration();
   ctx.font='14px system-ui';ctx.fillStyle='#b8c6d8';ctx.fillText(illustration?'SÉQUENCE FORCÉE · EXPANSION ILLUSTRATIVE':'SURFACES 2D · ESPACE 3D FIXE',20,28);ctx.fillText('Pas '+world.generation+' · paramètre numérique '+world.time.toFixed(2),20,538);
   const s=world.stats,items=[['Pas de calcul',s.generation],['Horloge intérieure (max.)',s.internalTime===null?'Pas encore née':s.internalTime.toFixed(2)],['Voxels toutes couleurs',s.overlapVoxels],['Régions fermées',world.config.criterion==='enclosure'?s.enclosedRegions:'—'],['Voxels qualifiés',s.qualifiedVoxels],['Agrégats / foyers actifs',s.aggregates+' / '+s.activeSources],['Contenu capté',s.capturedContent.toFixed(3)],['Écart du bilan',Math.abs(s.contentBalanceError).toExponential(1)],['Énergie des ondes seules',s.waveEnergy.toFixed(4)]];
   $('stats').innerHTML=items.map(([name,value])=>'<div><span class="text-small">'+name+'</span><strong>'+value+'</strong></div>').join('');
   const selected=$('domain').value,signature=world.domains.map(d=>d.id+':'+d.phase).join(',');
   if($('domain').dataset.signature!==signature){$('domain').dataset.signature=signature;$('domain').innerHTML=world.domains.length?world.domains.map(d=>'<option value="'+d.id+'">Domaine '+d.id+' · '+({linked:'lié',broken:'rompu',remnant:'résidu'})[d.phase]+'</option>').join(''):'<option value="">Aucun domaine né</option>';if(world.domains.some(d=>String(d.id)===selected))$('domain').value=selected;}
   domainInfo();
   $('force').hidden=world.generation===0;$('force').disabled=!!illustration&&illustration.phase!=='terminee';$('force').textContent=illustration?'Rejouer la sphère → Big Bang':'Forcer la sphère → Big Bang';
   $('return').hidden=!illustration;$('cycle').hidden=!illustration;
   $('run').disabled=!!illustration&&illustration.phase==='terminee';$('step').disabled=!!illustration&&illustration.phase==='terminee';
   $('step').textContent=illustration?'Un pas d’animation':'Un pas';
   if(illustration){const a=illustration;$('cycle-phase').textContent=({fermeture:'1 / 3 · Fermeture sphérique parfaite',agregation:'2 / 3 · Agrégation centrale',expansion:'3 / 3 · Expansion « Big Bang »',terminee:'Séquence terminée · Expansion illustrative'})[a.phase];$('cycle-progress').value=a.elapsed;$('cycle-info').textContent='Animation '+a.elapsed.toFixed(1)+' / 12 s · contenu local '+a.localContent.toFixed(2)+' = part agrégée '+a.capturedContent.toFixed(2)+' + part restante '+a.remainingContent.toFixed(2)+'. Monde source suspendu au pas '+a.sourceStep+'.';}

   $('status').textContent=illustration?'Les compteurs ci-dessus restent ceux du calcul suspendu. La fermeture et l’expansion affichées sont forcées.':(running?'En cours. ':'En pause. ')+(s.aggregates?'La condition persiste sur '+s.qualifiedVoxels+' voxel(s). '+(s.activeSources?'Ces foyers agiront sur les surfaces au prochain pas.':'Aucun foyer actif : intensité nulle, attraction désactivée ou liaisons rompues.'):(world.config.criterion==='enclosure'?'Aucun agrégat fermé persistant à ce pas. Les croisements seuls ne déclenchent pas l’attraction.':'Aucun croisement de toutes les couleurs assez persistant à ce pas.'));
 }
 function drawIllustration(){
   const a=illustration,center=project(a.center),radius=a.radius*112*displayZoom();
   const glow=ctx.createRadialGradient(center[0],center[1],0,center[0],center[1],Math.max(6,radius*1.5));glow.addColorStop(0,'#fff5ce55');glow.addColorStop(.4,'#aabbff22');glow.addColorStop(1,'#9bcaff00');ctx.fillStyle=glow;ctx.fillRect(center[0]-radius*1.5,center[1]-radius*1.5,radius*3,radius*3);
   if(a.assembly>.01){ctx.strokeStyle='#e3ecff'+Math.round(110*a.assembly).toString(16).padStart(2,'0');ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(center[0],center[1],radius,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(center[0],center[1],radius,radius*.3,0,0,Math.PI*2);ctx.stroke();}
   const points=a.particles.filter(p=>p.captured>0).map(p=>({p,q:project(a.position(p))})).sort((x,y)=>x.q[2]-y.q[2]);
   for(const {p,q} of points){ctx.fillStyle=p.color;ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(q[0],q[1],Math.max(1.7,3.3*zoom),0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 }
 function domainInfo(){const d=world.domains.find(d=>String(d.id)===$('domain').value);$('break').disabled=!!illustration||!d||d.phase!=='linked';$('domain-info').textContent=d?'Naissance au pas '+d.bornStep+' · horloge '+d.internalTime.toFixed(2)+' · rayon '+d.radius.toFixed(4)+' · cible captée '+(100*world.captureProgress(d)).toFixed(1)+' % · '+d.captured[0].toFixed(4)+' unité(s) par surface.':'La sphère apparaîtra si le seuil est franchi. Aucune naissance n’est garantie.';}
 function advance(){try{if(illustration){illustration.step(.1);if(illustration.phase==='terminee')pause();}else world.step();render();}catch(e){fail(e);}}
 function tick(){if(!running)return;if(illustration){const now=performance.now();illustration.step(Math.min(.1,(now-lastFrame)/1000));lastFrame=now;if(illustration.phase==='terminee')pause();render();}else advance();if(running)timer=setTimeout(tick,illustration?16:35);}
 $('run').onclick=()=>{if(running){pause();render();}else{if(illustration&&illustration.phase==='terminee'){render();return;}running=true;lastFrame=performance.now();$('run').textContent='Pause';tick();}};
 $('step').onclick=()=>{pause();advance();};$('reset').onclick=()=>restart(world.config);
 $('apply').onclick=()=>{const c={...world.config};for(const k of fields)c[k]=k==='gravityEnabled'?$(k).checked:k==='criterion'?$(k).value:Number($(k).value);restart(c);};
 $('json-apply').onclick=()=>{try{restart(JSON.parse($('json').value));}catch(e){fail(e);}};
 $('voxels').onchange=render;$('focus').onchange=render;$('domain').onchange=domainInfo;
 $('break').onclick=()=>{pause();world.breakDomain(Number($('domain').value));render();};
 $('prepared').onclick=()=>{const c={...world.config,colors:Number($('colors').value),seed:Number($('seed').value),domainEnabled:true,criterion:'enclosure',initialLayout:'prepared',amplitude:.02,thickness:.08,detectorResolution:24};restart(c);};
 $('force').onclick=()=>{if(world.generation===0)return;pause();illustration=new WaveIllustration.Sequence(world);illustrations.push(illustration);world.events.push({type:'forced-illustration',step:world.generation,sequence:illustrations.length});$('focus').value='all';running=true;lastFrame=performance.now();$('run').textContent='Pause';tick();};
 $('return').onclick=()=>{pause();illustration=null;render();};
 $('export').onclick=()=>{const blob=new Blob([JSON.stringify({...world.experiment(),illustrativeSequences:illustrations.map(a=>a.export())},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='ondes-'+world.config.seed+'-pas-'+world.generation+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 canvas.onpointerdown=e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);};canvas.onpointermove=e=>{if(!drag)return;yaw+=(e.clientX-drag[0])*.009;pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.clientY-drag[1])*.009));drag=[e.clientX,e.clientY];render();};canvas.onpointerup=canvas.onpointercancel=()=>{drag=null;};
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.5,Math.min(1.6,zoom*Math.exp(-e.deltaY*.001)));$('zoom').value=Math.round(zoom*100);render();},{passive:false});$('zoom').oninput=()=>{zoom=Number($('zoom').value)/100;render();};$('view').onclick=()=>{yaw=.65;pitch=.45;zoom=1;$('zoom').value=100;render();};
 controls();render();
})();
