(function(global){
 'use strict';
 const W=typeof module!=='undefined'&&module.exports?require('./waves-engine.js'):global.WaveSurfaces;
 const G=typeof module!=='undefined'&&module.exports?require('./waves-geometry.js'):global.WaveGeometry;
 class Study{
   constructor(config,{seeds=3,steps=40,levels=[0,.25,.5,.75,1]}={}){
     if(!Number.isInteger(seeds)||seeds<1||seeds>12||!Number.isInteger(steps)||steps<10||steps>300)throw Error('Étude : 1 à 12 graines, 10 à 300 pas.');
     if(steps<config.geometry.stabilitySteps+config.holdSteps)throw Error('Durée trop courte pour observer la fenêtre de stabilité.');
     this.base=W.validate(config);this.steps=steps;this.runs=[];this.jobs=[];this.current=null;this.cancelled=false;
     const seedValues=[];let seedState=config.seed;for(let i=0;i<seeds;i++){seedValues.push(seedState);seedState^=seedState<<13;seedState^=seedState>>>17;seedState^=seedState<<5;seedState>>>=0;}
     const centralCounts=[...new Set([0,config.geometry.centralBranes])];
     for(const centralBranes of centralCounts)for(const asymmetry of levels)for(let i=0;i<seeds;i++){
       const seed=seedValues[i];
       const c=W.validate({...config,seed,initialLayout:'multiverse',criterion:'enclosure',domainEnabled:true,geometry:{...config.geometry,enabled:true,centralBranes,asymmetry}});
       this.jobs.push(c);
     }
     this.total=this.jobs.length;
   }
   get done(){return this.cancelled||this.runs.length===this.total;}
   advance(){
     if(this.done)return;
     if(!this.current){const world=new W.World(this.jobs[this.runs.length]);this.current={world,initialWaveEnergy:world.energy()};}
     const {world}=this.current;world.step();
     if(world.generation===this.steps){
       const frames=world.geometryFrames,e=frames.some(f=>f.ids.length>0),multi=frames.some(f=>f.ids.length>1),single=frames.some(f=>f.ids.length===1),singleResult=G.stability(frames.map(f=>f.ids.length===1?f:{...f,ids:[],score:null}),world.config.geometry.stabilityTolerance,world.config.geometry.stabilitySteps,1),s=G.stability(frames,world.config.geometry.stabilityTolerance,world.config.geometry.stabilitySteps);
       this.runs.push({config:world.config,initialWaveEnergy:this.current.initialWaveEnergy,emerged:e,singleEmerged:single,singleStableObserved:singleResult.observed,singleRequiredTolerance:singleResult.requiredTolerance,multiEmerged:multi,multiStableObserved:s.observed,requiredTolerance:s.requiredTolerance,openDomainsAtEnd:world.domains.filter(d=>d.phase==='linked').map(d=>({id:d.id,age:d.internalTime,stability:d.stability})),history:world.history,geometryFrames:frames,events:world.events,contentBalance:world.contentBalance()});this.current=null;
     }
   }
   table(){
     const groups=new Map();for(const r of this.runs){const g=r.config.geometry,key=g.centralBranes+':'+g.asymmetry;if(!groups.has(key))groups.set(key,{centralBranes:g.centralBranes,asymmetry:g.asymmetry,n:0,emerged:0,single:0,stableSingle:0,multi:0,stableMulti:0,required:[]});const row=groups.get(key);row.n++;row.emerged+=Number(r.emerged);row.single+=Number(r.singleEmerged);row.stableSingle+=Number(r.singleStableObserved);row.multi+=Number(r.multiEmerged);row.stableMulti+=Number(r.multiStableObserved);if(r.requiredTolerance!==null)row.required.push(r.requiredTolerance);}
     return [...groups.values()].map(r=>({...r,stableGivenSingle:r.single?r.stableSingle/r.single:null,emergenceFrequency:r.emerged/r.n,multiFrequency:r.multi/r.n,stableGivenMulti:r.multi?r.stableMulti/r.multi:null,requiredRange:r.required.length?[Math.min(...r.required),Math.max(...r.required)]:null}));
   }
   export(){return{format:'wave-geometry-study-v1',complete:this.runs.length===this.total,cancelled:this.cancelled,plannedTrials:this.total,completedTrials:this.runs.length,steps:this.steps,baseConfig:this.base,table:this.table(),runs:this.runs,note:'Graines déterministes dispersées par xorshift32 à partir de la graine de base. Fréquences empiriques sur une fenêtre finie dans des configurations préparées. Stable = au moins deux mêmes identifiants présents pendant la fenêtre réglée, avec dissymétrie sous seuil à chaque pas. Tolérance requise = meilleur maximum observé dans ces fenêtres, non seuil physique. Les domaines encore présents ont une durée de vie incomplète. Aucun taux cosmologique, aucune pénalité de stabilité imposée en fonction du nombre de domaines.'};}
 }
 const api={Study};if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.WaveStudy=api;
})(globalThis);
