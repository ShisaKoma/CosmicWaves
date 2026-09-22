/* Projection discrète des branes : fermeture, réservoirs et horloges locales. */
(function(global){
 'use strict';
 const G=typeof module!=='undefined'&&module.exports?require('./waves-geometry.js'):global.WaveGeometry;
 const defaults=()=>({collective:true,centralBranes:1,asymmetry:0,emergenceTolerance:.8,stabilityTolerance:.2,stabilitySteps:12,holdSteps:3,minRegionVoxels:4,captureFraction:.5,minimumRadius:.35,shrinkRate:.2});
 class Model{
   constructor(){this.domains=[];this.nextId=1;this.budgets=new Map();this.diagnostic=null;this.lastGeneration=-1;this.frames=[];}
   get captured(){return this.domains.reduce((sum,d)=>sum+d.captured.reduce((a,b)=>a+b,0),0);}
   active(){return this.domains.filter(d=>d.born!==null&&d.ended===null);}
   sources(w){return w.config.emergence.mode==='geometry'&&w.config.gravity.enabled&&w.config.gravity.strength>0&&w.config.condensation.gravityMultiplier>0?this.active().map(d=>({p:{key:-d.id,mass:d.cells.length+d.captured.reduce((a,b)=>a+b,0)*w.config.weights.point,condensed:true,domain:true},xyz:d.center})):[];}
   update(w,advance=false){
     const c=w.config.branes,enabled=w.config.emergence.mode==='geometry';
     if(!enabled){for(const d of this.domains)if(d.ended===null){d.ended=w.generation;d.status='interrompu';}this.diagnostic=null;return;}
     const occupied=new Uint32Array(w.n**3);
     for(const p of w.cells.values()){let mask=0;w.counts(p.parts).forEach((v,i)=>{if(v)mask=(mask|(1<<i))>>>0;});occupied[p.key]=mask;}
     const all=w.config.positions===32?0xffffffff:(2**w.config.positions-1)>>>0;
     const g=G.analyse(occupied,w.n,all,c);this.diagnostic={score:g.dissymmetry,closed:g.regions.length,eligible:g.eligible.length,coverage:g.coverageComplete,accepted:g.accepted};
     if(!advance||this.lastGeneration===w.generation)return;
     this.lastGeneration=w.generation;
     const previous=this.domains.filter(d=>d.ended===null),regions=g.accepted?g.eligible:[];
     // A split or merge starts new identities; only an unambiguous overlap survives.
     const links=regions.map(r=>previous.filter(d=>{const set=new Set(d.cells);const overlap=r.cells.filter(k=>set.has(k)).length;return overlap>0&&overlap/Math.min(r.cells.length,d.cells.length)>=.5;}));
     const used=new Set();
     regions.forEach((r,i)=>{
       let d=links[i].length===1&&links.filter(a=>a.includes(links[i][0])).length===1?links[i][0]:null;
       if(!d){d={id:this.nextId++,first:w.generation,born:null,ended:null,hold:0,stableSteps:0,captured:Array(w.config.positions).fill(0),captureDone:false,radius:0,forced:w.interventions.some(e=>e.type==='force-closure'),cells:[],status:'en attente'};this.domains.push(d);}
       used.add(d);d.cells=[...r.cells];d.center=r.center.map(x=>(x+1)*w.n/2-.5);d.widths=r.widths.map(x=>x*w.n/2);d.score=g.dissymmetry;d.hold++;
       if(d.born===null&&d.hold>=c.holdSteps){d.born=w.generation;d.radius=c.minimumRadius;}
       if(d.born!==null){d.stableSteps=g.dissymmetry<=c.stabilityTolerance?d.stableSteps+1:0;d.status=d.stableSteps>=c.stabilitySteps?'stable sur la fenêtre':g.dissymmetry>c.stabilityTolerance?'fragile':'stabilité en attente';}
     });
     for(const d of previous)if(!used.has(d)){d.ended=w.generation;d.status=d.born===null?'fermeture non persistante':'rompu';}
     // Capture once, one generation AFTER birth, only while closure remains valid.
     const donors=new Map(),ready=this.active().filter(d=>!d.captureDone&&d.born<w.generation&&w.config.gravity.enabled&&w.config.gravity.strength>0&&w.config.condensation.gravityMultiplier>0);
     for(const d of ready){const boundary=new Set();for(const k of d.cells){const p=w.coordinates(k);for(let z=-1;z<=1;z++)for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++){const q=[p[0]+x,p[1]+y,p[2]+z];if(q.some(v=>v<0||v>=w.n))continue;const j=w.key(...q);if(occupied[j])boundary.add(j);}}for(const k of boundary){if(!donors.has(k))donors.set(k,[]);donors.get(k).push(d);}}
     for(const [k,owners]of donors){const cell=w.cells.get(k),counts=w.counts(cell.parts),take=counts.map((v,i)=>{const key=k+':'+i;if(!this.budgets.has(key))this.budgets.set(key,Math.floor(v*c.captureFraction));const amount=Math.min(Math.floor(v*c.captureFraction),this.budgets.get(key));this.budgets.set(key,this.budgets.get(key)-amount);for(let n=0;n<amount;n++)owners[(n+i+k)%owners.length].captured[i]++;return amount;});cell.parts=w.remove(cell.parts,take);}
     for(const d of ready)d.captureDone=true;
     for(const d of this.domains){if(d.born===null)continue;const target=d.ended===null?c.minimumRadius+.12*Math.cbrt(d.captured.reduce((a,b)=>a+b,0)):0;d.radius+=(target-d.radius)*(1-Math.exp(-c.shrinkRate));}
     this.frames.push({generation:w.generation,...this.diagnostic,ids:this.active().map(d=>d.id),captured:this.captured});
   }
   force(w){
     if(w.config.emergence.mode!=='geometry')throw Error('Choisissez la fermeture géométrique avant de forcer une émergence.');
     if(w.config.grid.boundary!=='closed')throw Error('La fermeture géométrique exige une grille à bords fermés.');
     for(const d of this.domains)if(d.ended===null){d.ended=w.generation;d.status='nouveau forçage';}
     const c=w.config.branes,center=Math.floor(w.n/2),r=Math.max(2,Math.floor((w.n-4)/2)),lo=center-r,hi=center+r;
     // Local cubical shell; the interior planes create 1 / 2 / 4 / 8 cavities at A=0.
     const shift=Math.round(c.asymmetry*Math.max(1,r-2)),planes=[center+shift,center-shift,center+shift];
     const unitsBefore=w.summary().units,patches=[];let added=0;
     for(let z=lo;z<=hi;z++)for(let y=lo;y<=hi;y++)for(let x=lo;x<=hi;x++){
       const p=[x,y,z],outer=p.some(v=>v===lo||v===hi),inner=p.some((v,a)=>a<c.centralBranes&&v===planes[a]);if(!outer&&!inner)continue;
       const key=w.key(x,y,z),cell=w.cells.get(key)||w.cell(key,[]),i=patches.length%w.config.positions,counts=w.counts(cell.parts);
       for(let j=counts[i];j<2;j++){cell.parts.push(w.point(i));added++;}cell.brane=true;w.cells.set(key,cell);patches.push(key);
     }
     // Clear the interior into a documented external preparation reserve, not deletion.
     const displaced=Array(w.config.positions).fill(0),patchSet=new Set(patches);
     for(const [key,p]of w.cells){const xyz=w.coordinates(key);if(xyz.every(v=>v>lo&&v<hi)&&!patchSet.has(key)){w.counts(p.parts).forEach((v,i)=>displaced[i]+=v);w.cells.delete(key);}}
     w.preparationReserve=w.preparationReserve.map((v,i)=>v+displaced[i]);
     w.interventions.push({type:'force-closure',generation:w.generation,added,displaced,patches,centralBranes:c.centralBranes,asymmetry:c.asymmetry,unitsBefore,unitsAfter:unitsBefore+added,note:'Coque cubique discrète préparée ; constituants ajoutés et intérieur déplacé dans la réserve de préparation. Pas une émergence spontanée.'});
     w.refresh();return w.interventions.at(-1);
   }
   export(){return{diagnostic:this.diagnostic,domains:this.domains,frames:this.frames,captureBudgets:[...this.budgets],note:'Rayons illustratifs. Horloges en générations depuis la naissance. Stabilité géométrique sur fenêtre, sans stabilité cosmologique.'};}
 }
 const api={Model,defaults};if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.LocalBranes=api;
})(globalThis);
