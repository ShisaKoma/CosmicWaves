/* Formation locale de points, demi-cordes, cordes, boucles et condensats. */
(function(global){
 'use strict';
 const TYPES=['point','demi-corde','corde','boucle'],clone=x=>JSON.parse(JSON.stringify(x)),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const rgb=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));
 const hex=a=>'#'+a.map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('').toUpperCase();
 const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]))/(255*Math.sqrt(3));
 function palette(n,target='#8B5CF6'){const result=[{color:target}];for(let i=1;i<n;i++){const h=i/n*6,k=Math.floor(h),t=Math.round(48+176*(h-k)),q=272-t;result.push({color:hex([[224,t,48],[q,224,48],[48,224,t],[48,q,224],[t,48,224],[224,48,q]][k%6])});}return result;}
 function defaults(n=32){return{version:4,positions:n,target:'#8B5CF6',seed:728931,
   grid:{size:18,boundary:'closed',neighborhood:26},initial:{density:.14,shape:'cube',pairedPoints:true},ticksPerSecond:3,
   palette:palette(n),weights:{point:.25,'demi-corde':.5,corde:1,boucle:2},
   life:{enabled:true,birth:[3,4],survival:Array.from({length:27},(_,i)=>i),inheritance:'point',protectCondensates:false},
   structures:{pointsPerHalf:2,halvesPerString:2,stringsPerLoop:2,halfProbability:1,stringProbability:1,loopProbability:.8,bondProbability:.75},
   colors:{addition:'average',amplitudeLimit:64},collisions:{subtraction:'opposed',probability:.25},
   gravity:{enabled:true,trigger:'configuration',tolerance:.09,minimumPositions:1,requiredPositions:[],strength:3,radius:6,softening:1,spectralTolerance:.45},
   emergence:{mode:'local-complete'},radial:{enabled:true,rate:.2,unitRadius:.18},
   motion:{diffusion:.12},condensation:{requiredPositions:n,minimumLoops:4,persistent:false,gravityMultiplier:2},
   breakup:{probability:0},
   emission:{probability:0,reserveEachPosition:true,freeSteps:5,mode:'point'},display:{waveAmplitude:.2,waveFrequency:1.2,condensateStyle:'strands'}};}
 function validate(input){
   if(!input||typeof input!=='object'||Array.isArray(input)||![10,11,26,32].includes(input.positions))throw Error('Un objet de règles avec 10, 11, 26 ou 32 positions est requis.');
   const c=clone(input),base=defaults(c.positions);
   // Old complete configurations retain their assembly recipe and persistence.
   if(c.version===2){if(Object.hasOwn(c,'emergence')||Object.hasOwn(c,'radial'))throw Error('Champs version 3 dans un fichier version 2.');c.version=3;c.emergence={mode:'palette'};c.radial={enabled:false,rate:.2,unitRadius:.18};}
   if(c.version===3){if(Object.hasOwn(c,'breakup')||Object.hasOwn(c.emission||{},'mode')||Object.hasOwn(c.display||{},'condensateStyle'))throw Error('Champs version 4 dans un fichier ancien.');c.version=4;c.breakup={probability:0};if(c.emission)c.emission.mode='point';if(c.display)c.display.condensateStyle='envelope';}
   function keys(a,b,path){if(!a||typeof a!=='object'||Array.isArray(a))throw Error(path+' doit être un objet.');for(const k of Object.keys(a))if(!Object.hasOwn(b,k))throw Error('Règle inconnue : '+path+'.'+k);for(const k of Object.keys(b))if(!Object.hasOwn(a,k))throw Error('Règle manquante : '+path+'.'+k);}
   const num=(v,a,b,name,int=false)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<a||v>b||(int&&!Number.isInteger(v)))throw Error(name+' doit être '+(int?'un entier ':'un nombre ')+'entre '+a+' et '+b+'.');};
   const choice=(v,values,name)=>{if(!values.includes(v))throw Error(name+' : choisir '+values.join(', '));};
   const bool=(v,name)=>{if(typeof v!=='boolean')throw Error(name+' doit être true ou false.');};
   keys(c,base,'règles');choice(c.version,[4],'version');if(!/^#[0-9a-f]{6}$/i.test(c.target))throw Error('target : couleur #RRGGBB requise.');c.target=c.target.toUpperCase();num(c.seed,1,4294967295,'seed',true);num(c.ticksPerSecond,.1,12,'ticksPerSecond');
   for(const key of ['grid','initial','weights','life','structures','colors','collisions','gravity','motion','condensation','emission','display','emergence','radial','breakup'])keys(c[key],base[key],key);
   num(c.breakup.probability,0,1,'breakup.probability');choice(c.emission.mode,['point','structure'],'emission.mode');choice(c.display.condensateStyle,['strands','envelope'],'display.condensateStyle');
   choice(c.emergence.mode,['local-complete','loop-count','palette'],'emergence.mode');bool(c.radial.enabled,'radial.enabled');num(c.radial.rate,.001,1,'radial.rate');num(c.radial.unitRadius,.01,1,'radial.unitRadius');
   num(c.grid.size,8,24,'grid.size',true);choice(c.grid.boundary,['closed','wrap'],'grid.boundary');choice(c.grid.neighborhood,[6,26],'grid.neighborhood');
   num(c.initial.density,0,.5,'initial.density');choice(c.initial.shape,['sphere','cube'],'initial.shape');bool(c.initial.pairedPoints,'initial.pairedPoints');
   if(!Array.isArray(c.palette)||c.palette.length!==c.positions)throw Error('Une couleur est requise par position.');
   c.palette.forEach((p,i)=>{keys(p,{color:0},'palette['+i+']');if(!/^#[0-9a-f]{6}$/i.test(p.color))throw Error('Couleur invalide en position '+(i+1));p.color=p.color.toUpperCase();});
   for(const type of TYPES)num(c.weights[type],.01,100,'weights.'+type);
   bool(c.life.enabled,'life.enabled');bool(c.life.protectCondensates,'life.protectCondensates');choice(c.life.inheritance,['point','parent','union','addition'],'life.inheritance');
   for(const k of ['birth','survival']){if(!Array.isArray(c.life[k])||new Set(c.life[k]).size!==c.life[k].length)throw Error('life.'+k+' : liste sans doublons requise.');c.life[k].forEach(v=>num(v,0,c.grid.neighborhood,'life.'+k,true));}
   for(const k of ['pointsPerHalf','halvesPerString','stringsPerLoop'])num(c.structures[k],2,4,'structures.'+k,true);
   for(const k of ['halfProbability','stringProbability','loopProbability','bondProbability'])num(c.structures[k],0,1,'structures.'+k);
   choice(c.colors.addition,['average','modulo','clamp'],'colors.addition');num(c.colors.amplitudeLimit,1,1000,'colors.amplitudeLimit',true);
   choice(c.collisions.subtraction,['never','opposed','any'],'collisions.subtraction');num(c.collisions.probability,0,1,'collisions.probability');
   bool(c.gravity.enabled,'gravity.enabled');choice(c.gravity.trigger,['configuration','sphere','color','either','both'],'gravity.trigger');num(c.gravity.tolerance,0,1,'gravity.tolerance');num(c.gravity.minimumPositions,1,c.positions,'gravity.minimumPositions',true);
   if(!Array.isArray(c.gravity.requiredPositions)||new Set(c.gravity.requiredPositions).size!==c.gravity.requiredPositions.length)throw Error('gravity.requiredPositions : liste sans doublons requise.');c.gravity.requiredPositions.forEach(v=>num(v,1,c.positions,'gravity.requiredPositions',true));
   num(c.gravity.strength,0,30,'gravity.strength');num(c.gravity.radius,1,c.grid.size,'gravity.radius');num(c.gravity.softening,.1,10,'gravity.softening');num(c.gravity.spectralTolerance,0,1,'gravity.spectralTolerance');num(c.motion.diffusion,0,1,'motion.diffusion');
   num(c.condensation.requiredPositions,1,c.positions,'condensation.requiredPositions',true);num(c.condensation.minimumLoops,1,100,'condensation.minimumLoops',true);bool(c.condensation.persistent,'condensation.persistent');num(c.condensation.gravityMultiplier,0,20,'condensation.gravityMultiplier');
   num(c.emission.probability,0,1,'emission.probability');bool(c.emission.reserveEachPosition,'emission.reserveEachPosition');num(c.emission.freeSteps,0,100,'emission.freeSteps',true);num(c.display.waveAmplitude,0,1,'display.waveAmplitude');num(c.display.waveFrequency,0,5,'display.waveFrequency');return c;
 }
 class World{
   constructor(c=defaults()){this.configure(c);this.reset();}
   configure(c){const valid=validate(c);if(this.cells&&(valid.grid.size!==this.n||valid.positions!==this.config.positions))throw Error('Changer la grille ou la palette demande une nouvelle population.');if(this.activeEpisodes){this.closeEpisodes('rules');this.pendingReclassification='rules';}this.config=valid;this.n=this.config.grid.size;this.colors=this.config.palette.map(p=>rgb(p.color));this.target=rgb(this.config.target);this.offsets=[];for(let z=-1;z<=1;z++)for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)if((x||y||z)&&(this.config.grid.neighborhood===26||Math.abs(x)+Math.abs(y)+Math.abs(z)===1))this.offsets.push([x,y,z]);if(this.ruleHistory)this.ruleHistory.push({generation:this.generation,config:clone(this.config)});}
   random(){let s=this.seed;s^=s<<13;s^=s>>>17;s^=s<<5;this.seed=s>>>0;return this.seed/4294967296;}
   key(x,y,z){return x+this.n*(y+this.n*z);}
   coordinates(k){return[k%this.n,Math.floor(k/this.n)%this.n,Math.floor(k/this.n**2)];}
   neighbor(k,d){const p=this.coordinates(k).map((v,i)=>v+d[i]);if(this.config.grid.boundary==='wrap')return this.key(...p.map(v=>(v+this.n)%this.n));return p.some(v=>v<0||v>=this.n)?null:this.key(...p);}
   delta(a,b){const d=b-a;return this.config.grid.boundary!=='wrap'?d:d>this.n/2?d-this.n:d<-this.n/2?d+this.n:d;}
   vector(){return Array(this.config.positions).fill(0);}
   point(i){const counts=this.vector();counts[i]=1;return{stage:0,counts};}
   points(counts){const parts=[];counts.forEach((v,i)=>{for(let j=0;j<v;j++)parts.push(this.point(i));});return parts;}
   counts(parts){const out=this.vector();for(const p of parts)for(let i=0;i<out.length;i++)out[i]+=p.counts[i];return out;}
   cell(key,counts,extra={}){const parts=extra.parts?extra.parts.map(p=>({stage:p.stage,counts:[...p.counts]})):this.points(counts);return{key,counts:this.counts(parts),condensed:false,envelopeRadius:0,flight:0,direction:[0,0,0],...extra,parts};}
   partColor(part){const total=part.counts.reduce((a,b)=>a+b,0);return[0,1,2].map(j=>part.counts.reduce((sum,v,i)=>sum+v*this.colors[i][j],0)/Math.max(1,total));}
   describe(cell){
     const c=this.config,counts=this.counts(cell.parts),shapeCounts=[0,0,0,0],loopPositions=new Set(),sums=[0,0,0];let mass=0;
     for(const p of cell.parts){shapeCounts[p.stage]++;const weight=c.weights[TYPES[p.stage]],color=this.partColor(p);mass+=weight;for(let j=0;j<3;j++)sums[j]+=color[j]*weight;if(p.stage===3)p.counts.forEach((v,i)=>{if(v)loopPositions.add(i);});}
     const raw=[0,1,2].map(j=>counts.reduce((sum,v,i)=>sum+v*this.colors[i][j],0));
     const channels=c.colors.addition==='average'?sums.map(v=>Math.round(v/Math.max(.000001,mass))):raw.map(v=>c.colors.addition==='modulo'?v%256:Math.min(255,v));
     const coverage=counts.filter(Boolean).length,units=counts.reduce((a,b)=>a+b,0);
     let neighborLoops=0;
     for(const d of this.offsets){const other=this.cells?.get(this.neighbor(cell.key,d));if(other)for(const p of other.parts)if(p.stage===3)neighborLoops++;}
     const assembled=shapeCounts[3]>=c.condensation.minimumLoops&&(c.emergence.mode==='local-complete'?neighborLoops===0:c.emergence.mode==='palette'?loopPositions.size>=c.condensation.requiredPositions:true);
     const condensed=assembled||(c.condensation.persistent&&cell.condensed&&units>0);
     const matches=coverage>=c.gravity.minimumPositions&&c.gravity.requiredPositions.every(i=>counts[i-1]>0)&&distance(channels,this.target)<=c.gravity.tolerance;
     const trigger=c.gravity.trigger,eligible=trigger==='configuration'?assembled:trigger==='sphere'?condensed:trigger==='color'?matches:trigger==='both'?assembled&&matches:assembled||matches;
     const source=eligible&&c.gravity.enabled&&c.gravity.strength>0&&(!condensed||c.condensation.gravityMultiplier>0);
     const loopUnits=cell.parts.filter(p=>p.stage===3).reduce((sum,p)=>sum+p.counts.reduce((a,b)=>a+b,0),0);
     const targetRadius=condensed?c.radial.unitRadius*Math.cbrt(loopUnits):0;
     return{counts,rgb:channels,color:hex(channels),mass,units,coverage,loopCoverage:loopPositions.size,shapeCounts,neighborLoops,configurationX:assembled,condensed,matches,eligible,source,targetRadius};
   }
   refresh(){for(const p of this.cells.values())Object.assign(p,this.describe(p));if(this.pendingReclassification){this.syncEpisodes(this.pendingReclassification);this.pendingReclassification=null;}this.stats=this.summary();}
   summary(){let sources=0,eligible=0,configurations=0,spheres=0,units=0;const shapes=[0,0,0,0];for(const p of this.cells.values()){sources+=+p.source;eligible+=+p.eligible;configurations+=+p.configurationX;spheres+=+p.condensed;units+=p.units;for(let i=0;i<4;i++)shapes[i]+=p.shapeCounts[i];}const longestXAge=Math.max(0,...[...(this.activeEpisodes?.values()||[])].map(e=>this.generation-e.start));return{generation:this.generation,cells:this.cells.size,sources,eligible,configurations,spheres,units,longestXAge,totalEmergences:this.totalEmergences,points:shapes[0],halves:shapes[1],strings:shapes[2],loops:shapes[3],...this.events};}
   clearEvents(){this.events={births:0,deaths:0,additions:0,subtractions:0,annihilations:0,emissions:0,emittedStructures:0,breakups:0,unitsBorn:0,unitsDied:0,unitsCancelled:0,unitsClipped:0,balanceError:0,newHalves:0,newStrings:0,newLoops:0,newConfigurations:0,lostConfigurations:0,gravityMoves:0};}
   closeEpisodes(reason){for(const e of this.activeEpisodes.values()){e.end=this.generation;e.duration=e.end-e.start;e.endReason=reason;e.rightCensored=reason!=='lost';}this.activeEpisodes.clear();}
   syncEpisodes(reason){
     for(const [key,e]of this.activeEpisodes)if(!this.cells.get(key)?.configurationX){e.end=this.generation;e.duration=e.end-e.start;e.endReason='lost';e.rightCensored=false;this.activeEpisodes.delete(key);}
     for(const p of this.cells.values())if(p.configurationX&&!this.activeEpisodes.has(p.key)){const e={id:this.nextEpisodeId++,key:p.key,start:this.generation,end:null,startReason:reason,leftCensored:reason!=='dynamics',rightCensored:true};this.activeEpisodes.set(p.key,e);this.episodes.push(e);}
   }
   perturb(key){
     const cell=this.cells.get(key);if(!cell)throw Error('Sélectionnez une cellule occupée.');
     const index=cell.parts.reduce((best,p,i)=>p.stage>0&&(best<0||p.stage>cell.parts[best].stage)?i:best,-1);
     if(index<0)throw Error('Cette cellule ne contient aucune structure à rompre.');
     const part=cell.parts[index],units=this.counts(cell.parts).reduce((a,b)=>a+b,0);
     this.closeEpisodes('intervention');this.pendingReclassification='intervention';
     cell.parts.splice(index,1,...this.points(part.counts));
     this.interventions.push({generation:this.generation,key,type:'break-one-structure',stage:part.stage,counts:[...part.counts],unitsBefore:units,unitsAfter:this.counts(cell.parts).reduce((a,b)=>a+b,0)});
     this.refresh();return this.interventions.at(-1);
   }
   experiment(){return clone({format:'chromatic-experiment-v4',config:this.config,ruleHistory:this.ruleHistory,interventions:this.interventions,episodes:this.episodes,history:this.history,current:this.stats,rngState:this.seed,cells:[...this.cells.values()],scope:{spatialDimensions:3,bosonDynamics:false,photonPropagation:false,thermalCosmology:false},note:'Épisodes de X par site, pas identités d’objets. Épisodes ouverts censurés à droite ; réglages et interventions censurent les durées. Bilan de constituants, pas énergie. Aucun taux physique. Export documentaire, non importable comme règles.'});}
   reset(){this.seed=this.config.seed;this.generation=0;this.totalEmergences=0;this.episodes=[];this.activeEpisodes=new Map();this.nextEpisodeId=1;this.interventions=[];this.pendingReclassification=null;this.history=[];this.ruleHistory=[{generation:0,config:clone(this.config)}];this.cells=new Map();this.clearEvents();const center=(this.n-1)/2;
     for(let z=0;z<this.n;z++)for(let y=0;y<this.n;y++)for(let x=0;x<this.n;x++){
       const k=this.key(x,y,z);if(this.cells.has(k)||(this.config.initial.shape==='sphere'&&Math.hypot(x-center,y-center,z-center)>this.n*.46)||this.random()>=this.config.initial.density)continue;
       const i=Math.floor(this.random()*this.config.positions),v=this.vector();v[i]=1;this.cells.set(k,this.cell(k,v));
       if(this.config.initial.pairedPoints){const d=this.offsets[Math.floor(this.random()*this.offsets.length)],q=this.neighbor(k,d);if(q!==null&&!this.cells.has(q))this.cells.set(q,this.cell(q,v));}
     }this.refresh();this.syncEpisodes('initial');this.history.push(clone(this.stats));
   }
   assemble(parts){
     const c=this.config,groups=new Map(),out=[];
     for(const p of parts){const key=p.stage===0?'p'+this.config.palette[p.counts.findIndex(Boolean)].color:'s'+p.stage;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(p);}
     for(const pool of groups.values()){
       const stage=pool[0].stage;if(stage===3){out.push(...pool);continue;}
       const amount=[c.structures.pointsPerHalf,c.structures.halvesPerString,c.structures.stringsPerLoop][stage],probability=[c.structures.halfProbability,c.structures.stringProbability,c.structures.loopProbability][stage];
       let i=0;for(;i+amount<=pool.length;i+=amount){const group=pool.slice(i,i+amount);if(this.random()<probability){out.push({stage:stage+1,counts:this.counts(group)});this.events[['newHalves','newStrings','newLoops'][stage]]++;}else out.push(...group);}out.push(...pool.slice(i));
     }return out;
   }
   remove(parts,needed){const rest=[...needed],out=[];for(const p of parts){const counts=[...p.counts];let changed=false;for(let i=0;i<counts.length;i++){const take=Math.min(counts[i],rest[i]);counts[i]-=take;rest[i]-=take;changed=changed||take>0;}if(changed)out.push(...this.points(counts));else out.push(p);}return out;}
   mergeParts(a,b,subtract){let parts;if(subtract){const ac=this.counts(a),bc=this.counts(b),cancel=ac.map((v,i)=>Math.min(v,bc[i]));this.events.unitsCancelled+=2*cancel.reduce((s,v)=>s+v,0);parts=this.remove(a,cancel).concat(this.remove(b,cancel));}else parts=a.concat(b);const counts=this.counts(parts),excess=counts.map(v=>Math.max(0,v-this.config.colors.amplitudeLimit));this.events.unitsClipped+=excess.reduce((s,v)=>s+v,0);return excess.some(Boolean)?this.remove(parts,excess):parts;}
   inherit(parents){
     const mode=this.config.life.inheritance;if(!parents.length)return[this.point(Math.floor(this.random()*this.config.positions))];
     if(mode==='point'){const parent=parents[Math.floor(this.random()*parents.length)],present=parent.counts.map((v,i)=>v?i:-1).filter(i=>i>=0);return[this.point(present[Math.floor(this.random()*present.length)])];}
     if(mode==='parent')return parents[0].parts.map(p=>({stage:p.stage,counts:[...p.counts]}));
     const counts=this.counts(parents.flatMap(p=>p.parts)).map(v=>mode==='union'?Math.min(1,v):Math.min(v,this.config.colors.amplitudeLimit));return this.points(counts);
   }
   canBond(a,b){
     const formedA=a.parts.some(p=>p.stage>0),formedB=b.parts.some(p=>p.stage>0);if(formedA&&formedB)return true;
     const colors=new Set(a.parts.filter(p=>p.stage===0).map(p=>this.config.palette[p.counts.findIndex(Boolean)].color));
     return b.parts.some(p=>p.stage===0&&colors.has(this.config.palette[p.counts.findIndex(Boolean)].color));
   }
   step(){
     if(this.pendingReclassification)this.refresh();
     const c=this.config;this.syncEpisodes('observed');this.clearEvents();const old=[...this.cells.values()].sort((a,b)=>a.key-b.key),unitsBefore=old.reduce((s,p)=>s+this.counts(p.parts).reduce((a,b)=>a+b,0),0),oldX=new Set(old.filter(p=>p.configurationX).map(p=>p.key)),sources=old.filter(p=>p.source).map(p=>({p,xyz:this.coordinates(p.key)})),neighbors=new Map();
     for(const p of old)for(const d of this.offsets){const k=this.neighbor(p.key,d);if(k===null)continue;if(!neighbors.has(k))neighbors.set(k,[]);neighbors.get(k).push(p);}
     const candidates=[];for(const p of old){const count=(neighbors.get(p.key)||[]).length;if(!c.life.enabled||(p.condensed&&c.life.protectCondensates)||c.life.survival.includes(count))candidates.push(this.cell(p.key,p.counts,{parts:p.parts,condensed:p.condensed,envelopeRadius:p.envelopeRadius,flight:p.flight,direction:[...p.direction]}));else{this.events.deaths++;this.events.unitsDied+=this.counts(p.parts).reduce((a,b)=>a+b,0);}}
     if(c.life.enabled){const keys=c.life.birth.includes(0)?Array.from({length:this.n**3},(_,k)=>k):[...neighbors.keys()];for(const k of keys.sort((a,b)=>a-b)){if(this.cells.has(k))continue;const parents=neighbors.get(k)||[];if(!c.life.birth.includes(parents.length))continue;const parts=this.inherit(parents);if(parts.length){candidates.push(this.cell(k,[],{parts}));this.events.births++;this.events.unitsBorn+=this.counts(parts).reduce((a,b)=>a+b,0);}}}
     const sorted=candidates.sort((a,b)=>a.key-b.key),byKey=new Map(sorted.map(p=>[p.key,p])),bonds=new Map(),held=new Set();
     // Matching neighbors bind once per generation; the destination stays in place.
     for(const a of sorted){if(held.has(a.key)||a.flight>0||this.random()>=c.structures.bondProbability)continue;for(const d of this.offsets){const k=this.neighbor(a.key,d),b=byKey.get(k);if(!b||held.has(k)||b.flight>0||!this.canBond(a,b))continue;const ai=this.describe(a),bi=this.describe(b);if((ai.source||ai.condensed)&&(bi.source||bi.condensed))continue;const anchor=ai.source||ai.condensed?a:b,mover=anchor===a?b:a;bonds.set(mover.key,anchor.key);held.add(a.key);held.add(b.key);break;}}
     const emitted=[];for(const p of sorted)if(p.condensed&&c.emission.probability>0&&this.random()<c.emission.probability){
       const counts=this.counts(p.parts),whole=c.emission.mode==='structure';
       const choices=whole?p.parts.map((part,i)=>!c.emission.reserveEachPosition||part.counts.every((v,j)=>!v||counts[j]-v>=1)?i:-1).filter(i=>i>=0):counts.map((v,i)=>v>(c.emission.reserveEachPosition?1:0)?i:-1).filter(i=>i>=0);
       if(!choices.length)continue;const d=this.offsets[Math.floor(this.random()*this.offsets.length)],k=this.neighbor(p.key,d);if(k===null)continue;const i=choices[Math.floor(this.random()*choices.length)];let parts;
       if(whole){parts=p.parts.splice(i,1);if(parts[0].stage>0)this.events.emittedStructures++;}else{const v=this.vector();v[i]=1;p.parts=this.remove(p.parts,v);parts=this.points(v);}
       emitted.push(this.cell(k,[],{parts,flight:c.emission.freeSteps,direction:d}));this.events.emissions++;
     }
     const proposals=[];for(const p of sorted){if(!p.parts.length)continue;const info=this.describe(p),xyz=this.coordinates(p.key);let d=[0,0,0],destination=p.key;
       if(bonds.has(p.key)){destination=bonds.get(p.key);const q=this.coordinates(destination);d=q.map((v,i)=>Math.sign(this.delta(xyz[i],v)));}
       else if(!held.has(p.key)&&!info.source&&!info.condensed){
         if(p.flight>0){d=p.direction;p.flight--;}
         else{let best=0,direction=null;for(const {p:source,xyz:q}of sources){if(source.key===p.key)continue;const delta=q.map((v,i)=>this.delta(xyz[i],v)),r2=delta.reduce((s,v)=>s+v*v,0);if(!r2||r2>c.gravity.radius**2||distance(info.rgb,source.rgb)>c.gravity.spectralTolerance)continue;const pull=c.gravity.strength*Math.sqrt(source.mass)*(source.condensed?c.condensation.gravityMultiplier:1)/(r2+c.gravity.softening**2);if(pull>best){best=pull;direction=delta.map(Math.sign);}}
           if(direction&&this.random()<Math.min(1,best)){d=direction;this.events.gravityMoves++;}else if(this.random()<c.motion.diffusion)d=this.offsets[Math.floor(this.random()*this.offsets.length)];}
         const k=this.neighbor(p.key,d);if(k!==null)destination=k;
       }proposals.push({p,d,k:destination});
     }
     for(const p of emitted)proposals.push({p,d:p.direction,k:p.key});const next=new Map();
     for(const {p,d,k}of proposals){if(!next.has(k)){next.set(k,this.cell(k,[],{parts:p.parts,condensed:p.condensed,envelopeRadius:p.envelopeRadius,flight:p.flight,direction:[...d]}));continue;}const a=next.get(k),opposed=a.direction.reduce((s,v,i)=>s+v*d[i],0)<0;const subtract=(c.collisions.subtraction==='any'||(c.collisions.subtraction==='opposed'&&opposed))&&this.random()<c.collisions.probability;a.parts=this.mergeParts(a.parts,p.parts,subtract);a.condensed=a.condensed||p.condensed;a.envelopeRadius=Math.cbrt(a.envelopeRadius**3+p.envelopeRadius**3);a.flight=0;a.direction=[0,0,0];this.events[subtract?'subtractions':'additions']++;if(!a.parts.length){next.delete(k);this.events.annihilations++;}}
     for(const p of next.values()){
       p.parts=this.assemble(p.parts);
       if(c.breakup.probability>0)p.parts=p.parts.flatMap(part=>{if(part.stage>0&&this.random()<c.breakup.probability){this.events.breakups++;return this.points(part.counts);}return[part];});
     }
     this.cells=next;this.generation++;this.refresh();
     for(const p of this.cells.values()){
       if(p.configurationX&&!oldX.has(p.key))this.events.newConfigurations++;
       if(c.radial.enabled)p.envelopeRadius+=(p.targetRadius-p.envelopeRadius)*(1-Math.exp(-c.radial.rate));
       else p.envelopeRadius=0;
     }
     for(const k of oldX)if(!this.cells.get(k)?.configurationX)this.events.lostConfigurations++;
     this.totalEmergences+=this.events.newConfigurations;this.syncEpisodes('dynamics');
     const unitsAfter=[...this.cells.values()].reduce((s,p)=>s+p.units,0);
     this.events.balanceError=unitsAfter-unitsBefore-this.events.unitsBorn+this.events.unitsDied+this.events.unitsCancelled+this.events.unitsClipped;
     if(this.events.balanceError!==0)throw Error('Bilan de constituants incohérent : '+this.events.balanceError);
     this.stats=this.summary();this.history.push(clone(this.stats));return this.stats;
   }
 }
 const api={World,defaults,validate,palette,rgb,hex,distance,TYPES};if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.ChromaticLife=api;
})(globalThis);
