(function(){
 'use strict';
 const $=id=>document.getElementById('w-'+id),canvas=$('canvas'),ctx=canvas.getContext('2d');
 const fields=['seed','colors','criterion','amplitude','waveSpeed','thickness','holdSteps','damping','gravityStrength','gravityEnabled'];
 let world=new WaveSurfaces.World(),running=false,timer=null,yaw=.65,pitch=.45,zoom=1,drag=null;
 function pause(){running=false;clearTimeout(timer);$('run').textContent='Démarrer';}
 function fail(e){pause();$('error').hidden=false;$('error').textContent=e.message;}
 function controls(){for(const k of fields){if(k==='gravityEnabled')$(k).checked=world.config[k];else $(k).value=world.config[k];}$('json').value=JSON.stringify(world.config,null,2);$('legend').innerHTML=world.surfaces.map((s,i)=>'<span><i class="w-dot" style="background:'+s.color+'"></i>Surface '+(i+1)+'</span>').join('');}
 function restart(c){try{const next=new WaveSurfaces.World(c);pause();world=next;$('error').hidden=true;controls();render();}catch(e){fail(e);}}
 function project(p){const a=p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw),b=-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw),y=p[1]*Math.cos(pitch)-b*Math.sin(pitch),z=p[1]*Math.sin(pitch)+b*Math.cos(pitch);return[480+a*112*zoom,280-y*112*zoom,z];}
 function path(points){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));}
 function cube(center,r,color,dashed=false){const p=[];for(let i=0;i<8;i++)p.push(project(center.map((x,d)=>x+((i>>d&1)?r:-r))));ctx.strokeStyle=color;ctx.lineWidth=1;ctx.setLineDash(dashed?[4,5]:[]);for(let i=0;i<8;i++)for(let d=0;d<3;d++)if(!(i>>d&1)){path([p[i],p[i|1<<d]]);ctx.stroke();}ctx.setLineDash([]);}
 function render(){
   ctx.fillStyle='#101923';ctx.fillRect(0,0,960,560);cube([0,0,0],1,'#7b899d66',true);
   const N=world.config.resolution,faces=[];
   for(const s of world.surfaces){const pts=[];for(let j=0;j<=N;j++)for(let i=0;i<=N;i++)pts.push(project(world.position(s,i,j,s.h[i%N+N*(j%N)])));
    for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=i+(N+1)*j,ps=[pts[k],pts[k+1],pts[k+N+2],pts[k+N+1]];faces.push({ps,z:ps.reduce((v,p)=>v+p[2],0)/4,color:s.color});}}
   faces.sort((a,b)=>a.z-b.z);for(const f of faces){path(f.ps);ctx.closePath();ctx.fillStyle=f.color+'12';ctx.fill();ctx.strokeStyle=f.color+'65';ctx.lineWidth=.65;ctx.stroke();}
   const D=world.config.detectorResolution,dx=2/D;
   for(let k=0;k<world.mask.length;k++)if(world.mask[k])cube([k%D,Math.floor(k/D)%D,Math.floor(k/D**2)].map(x=>-1+(x+.5)*dx),dx*.35,'#edf6ff88');
   for(const s of world.sources){const p=project(s.center);ctx.strokeStyle=world.stats.activeSources?'#FFD86A':'#f0f4ff';ctx.lineWidth=2;path([[p[0]-5,p[1]],[p[0]+5,p[1]]]);ctx.stroke();path([[p[0],p[1]-5],[p[0],p[1]+5]]);ctx.stroke();}
   ctx.font='14px system-ui';ctx.fillStyle='#b8c6d8';ctx.fillText('SURFACES 2D · ESPACE 3D FIXE',20,28);ctx.fillText('t = '+world.time.toFixed(2)+' · pas '+world.generation,20,538);
   const s=world.stats,items=[['Pas / temps',s.generation+' / '+s.time.toFixed(2)],['Voxels toutes couleurs',s.overlapVoxels],['Régions fermées',world.config.criterion==='enclosure'?s.enclosedRegions:'—'],['Voxels qualifiés',s.qualifiedVoxels],['Agrégats / foyers actifs',s.aggregates+' / '+s.activeSources],['Énergie des ondes',s.waveEnergy.toFixed(4)]];
   $('stats').innerHTML=items.map(([name,value])=>'<div><span class="text-small">'+name+'</span><strong>'+value+'</strong></div>').join('');
   $('status').textContent=(running?'En cours. ':'En pause. ')+(s.aggregates?'La condition persiste sur '+s.qualifiedVoxels+' voxel(s). '+(s.activeSources?'Ces foyers agiront sur les surfaces au prochain pas.':'Attraction désactivée ou nulle.'):(world.config.criterion==='enclosure'?'Aucun agrégat fermé persistant à ce pas. Les croisements seuls ne déclenchent pas l’attraction.':'Aucun croisement de toutes les couleurs assez persistant à ce pas.'));
 }
 function advance(){try{world.step();render();}catch(e){fail(e);}}
 function tick(){if(!running)return;advance();if(running)timer=setTimeout(tick,35);}
 $('run').onclick=()=>{if(running){pause();render();}else{running=true;$('run').textContent='Pause';tick();}};
 $('step').onclick=()=>{pause();advance();};$('reset').onclick=()=>restart(world.config);
 $('apply').onclick=()=>{const c={...world.config};for(const k of fields)c[k]=k==='gravityEnabled'?$(k).checked:k==='criterion'?$(k).value:Number($(k).value);restart(c);};
 $('json-apply').onclick=()=>{try{restart(JSON.parse($('json').value));}catch(e){fail(e);}};
 $('export').onclick=()=>{const blob=new Blob([JSON.stringify(world.experiment(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='ondes-'+world.config.seed+'-pas-'+world.generation+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 canvas.onpointerdown=e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);};canvas.onpointermove=e=>{if(!drag)return;yaw+=(e.clientX-drag[0])*.009;pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.clientY-drag[1])*.009));drag=[e.clientX,e.clientY];render();};canvas.onpointerup=canvas.onpointercancel=()=>{drag=null;};
 canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.5,Math.min(1.6,zoom*Math.exp(-e.deltaY*.001)));$('zoom').value=Math.round(zoom*100);render();},{passive:false});$('zoom').oninput=()=>{zoom=Number($('zoom').value)/100;render();};$('view').onclick=()=>{yaw=.65;pitch=.45;zoom=1;$('zoom').value=100;render();};
 controls();render();
})();
