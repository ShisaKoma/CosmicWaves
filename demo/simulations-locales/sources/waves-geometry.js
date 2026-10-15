/* Diagnostics géométriques discrets, sans loi cosmologique supposée. */
(function(global){
 'use strict';
 const point=(k,N)=>[k%N,Math.floor(k/N)%N,Math.floor(k/N**2)].map(x=>-1+(x+.5)*2/N);
 function describe(cells,N){
   const center=[0,0,0],covariance=Array.from({length:3},()=>[0,0,0]),bounds=[[Infinity,-Infinity],[Infinity,-Infinity],[Infinity,-Infinity]];
   for(const k of cells){const p=point(k,N);for(let d=0;d<3;d++){center[d]+=p[d]/cells.length;bounds[d][0]=Math.min(bounds[d][0],p[d]);bounds[d][1]=Math.max(bounds[d][1],p[d]);}}
   for(const k of cells){const p=point(k,N).map((x,d)=>x-center[d]);for(let i=0;i<3;i++)for(let j=0;j<3;j++)covariance[i][j]+=p[i]*p[j]/cells.length;}
   // Add variance within one voxel: this avoids singular one-voxel axes.
   for(let i=0;i<3;i++)covariance[i][i]+=(2/N)**2/12;
   const set=new Set(cells);let missed=0;
   for(const k of cells){const p=point(k,N),q=p.map((x,d)=>Math.round(((2*center[d]-x)+1)*N/2-.5));if(q.some(x=>x<0||x>=N)||!set.has(q[0]+N*(q[1]+N*q[2])))missed++;}
   const widths=bounds.map(([a,b])=>b-a+2/N);
   return{center,covariance,bounds,widths,inversionMismatch:cells.length?missed/cells.length:1,volume:cells.length*(2/N)**3};
 }
 function analyse(occupied,N,allColors,settings){
   const seen=new Uint8Array(occupied.length),regions=[];
   for(let start=0;start<occupied.length;start++)if(!occupied[start]&&!seen[start]){
     const queue=[start];seen[start]=1;let exterior=false,boundaryColors=0;
     for(let cursor=0;cursor<queue.length;cursor++){
       const k=queue[cursor],p=[k%N,Math.floor(k/N)%N,Math.floor(k/N**2)];if(p.some(x=>x===0||x===N-1))exterior=true;
       for(let z=-1;z<=1;z++)for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++){
         if(!x&&!y&&!z)continue;const q=[p[0]+x,p[1]+y,p[2]+z];if(q.some(v=>v<0||v>=N))continue;
         const j=q[0]+N*(q[1]+N*q[2]);if(occupied[j])boundaryColors=(boundaryColors|occupied[j])>>>0;else if(!seen[j]){seen[j]=1;queue.push(j);}
       }
     }
     if(!exterior&&queue.length>=settings.minRegionVoxels)regions.push({cells:queue,boundaryColors,...describe(queue,N)});
   }
   let union=0;for(const r of regions)union=(union|r.boundaryColors)>>>0;
   const eligible=settings.collective?(union===allColors?regions:[]):regions.filter(r=>r.boundaryColors===allColors);
   const cells=eligible.flatMap(r=>r.cells),ensemble=cells.length?describe(cells,N):null;
   const sizes=eligible.map(r=>r.cells.length),volumeContrast=sizes.length>1?(Math.max(...sizes)-Math.min(...sizes))/(Math.max(...sizes)+Math.min(...sizes)):0;
   const scale=ensemble?Math.max(...ensemble.widths)/2:1;
   const pairingMismatch=ensemble?Math.max(...eligible.map(r=>Math.min(...eligible.map(q=>Math.max(Math.min(1,Math.hypot(...r.center.map((x,d)=>2*ensemble.center[d]-x-q.center[d]))/scale),Math.abs(r.volume-q.volume)/(r.volume+q.volume)))))):null;
   const raw=ensemble?Math.max(ensemble.inversionMismatch,pairingMismatch):null;
   const dissymmetry=raw!==null&&raw<1e-12?0:raw;
   const accepted=dissymmetry!==null&&dissymmetry<=settings.emergenceTolerance;
   const mask=new Uint8Array(occupied.length);if(accepted)for(const k of cells)mask[k]=1;
   return{mask,regions,eligible,ensemble,volumeContrast,pairingMismatch,dissymmetry,accepted,coverageComplete:union===allColors};
 }
 function stability(states,tolerance,window,minDomains=2){
   // Best required tolerance for a window with >=2 identical domain identities throughout.
   let required=null;
   for(let end=window-1;end<states.length;end++){
     let ids=new Set(states[end].ids),worst=0;
     for(let j=end-window+1;j<=end;j++){const s=states[j];ids=new Set([...ids].filter(id=>s.ids.includes(id)));if(s.score===null){ids.clear();break;}worst=Math.max(worst,s.score);}
     if(ids.size>=minDomains)required=required===null?worst:Math.min(required,worst);
   }
   return{requiredTolerance:required,observed:required!==null&&required<=tolerance};
 }
 const api={analyse,describe,point,stability};if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.WaveGeometry=api;
})(globalThis);
