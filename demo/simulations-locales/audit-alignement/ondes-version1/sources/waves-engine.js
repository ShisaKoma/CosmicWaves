/* Surfaces ondulantes 2D plongées en 3D. Modèle effectif exploratoire. */
(function(global){
 'use strict';
 const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const unit=a=>{const n=Math.hypot(...a);return a.map(x=>x/n);};
 const COLORS=['#69C9FF','#FF926E','#BD9AFF','#74DFA8','#FFD86A','#F793CE','#A8D578','#92A8FF'];
 const defaults=()=>({version:1,seed:728931,colors:4,resolution:20,detectorResolution:20,criterion:'enclosure',amplitude:.22,cycles:1,waveSpeed:.6,damping:.02,thickness:.08,holdSteps:3,gravityEnabled:true,gravityStrength:.6,softening:.25,dt:.02});
 // A free region is enclosed only if even diagonal paths cannot reach the box boundary.
 function enclosedMask(occupied,N,allColors){
   const seen=new Uint8Array(occupied.length),mask=new Uint8Array(occupied.length);let regions=0;
   for(let start=0;start<occupied.length;start++)if(!occupied[start]&&!seen[start]){
     const queue=[start];seen[start]=1;let exterior=false,boundaryColors=0;
     for(let cursor=0;cursor<queue.length;cursor++){
       const index=queue[cursor],p=[index%N,Math.floor(index/N)%N,Math.floor(index/N**2)];
       if(p.some(x=>x===0||x===N-1))exterior=true;
       for(let z=-1;z<=1;z++)for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++){
         if(!x&&!y&&!z)continue;const q=[p[0]+x,p[1]+y,p[2]+z];if(q.some(v=>v<0||v>=N))continue;
         const k=q[0]+N*(q[1]+N*q[2]);if(occupied[k])boundaryColors|=occupied[k];else if(!seen[k]){seen[k]=1;queue.push(k);}
       }
     }
     if(!exterior&&boundaryColors===allColors){regions++;for(const k of queue)mask[k]=1;}
   }
   return{mask,regions};
 }
 function validate(c){
   const d=defaults();if(!c||typeof c!=='object'||Array.isArray(c))throw Error('Configuration requise.');
   for(const key of Object.keys(c))if(!Object.hasOwn(d,key))throw Error('Paramètre inconnu : '+key);
   for(const key of Object.keys(d))if(!Object.hasOwn(c,key))throw Error('Paramètre manquant : '+key);
   function n(key,lo,hi,int=false){const v=c[key];if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi||(int&&!Number.isInteger(v)))throw Error(key+' : valeur entre '+lo+' et '+hi+'.');}
   n('version',1,1,true);n('seed',1,4294967295,true);n('colors',2,8,true);n('resolution',12,32,true);n('detectorResolution',8,24,true);
   n('amplitude',0,.5);n('cycles',1,3,true);n('waveSpeed',.05,2);n('damping',0,2);n('thickness',.02,.6);n('holdSteps',1,100,true);
   n('gravityStrength',0,5);n('softening',.15,1);n('dt',.001,.04);if(typeof c.gravityEnabled!=='boolean')throw Error('gravityEnabled doit être booléen.');
   if(!['enclosure','intersection'].includes(c.criterion))throw Error('Critère : enclosure ou intersection.');
   if(c.waveSpeed*c.dt/(3.2/c.resolution)>.5)throw Error('Pas temporel trop grand pour la résolution et la vitesse des ondes.');
   return JSON.parse(JSON.stringify(c));
 }
 class World{
   constructor(c=defaults()){
     this.config=validate(c);this.seed=c.seed;this.generation=0;this.time=0;this.length=3.2;this.surfaces=[];this.sources=[];this.history=[];
     this.ages=new Uint32Array(c.detectorResolution**3);this.mask=new Uint8Array(this.ages.length);
     const N=c.resolution,dx=this.length/N,k=2*Math.PI*c.cycles/this.length;
     for(let color=0;color<c.colors;color++){
       const z=2*this.random()-1,a=2*Math.PI*this.random(),normal=[Math.sqrt(1-z*z)*Math.cos(a),Math.sqrt(1-z*z)*Math.sin(a),z];
       const u=unit(cross(normal,Math.abs(normal[2])<.9?[0,0,1]:[0,1,0])),v=cross(normal,u);
       const s={color:COLORS[color],normal,u,v,offset:(this.random()-.5)*.24,h:new Float64Array(N*N),velocity:new Float64Array(N*N)};
       const phase=2*Math.PI*this.random(),phase2=2*Math.PI*this.random();
       for(let j=0;j<N;j++)for(let i=0;i<N;i++){
         const p=k*(-this.length/2+i*dx)+phase,q=k*(-this.length/2+j*dx)+phase2,index=i+N*j;
         s.h[index]=c.amplitude/Math.sqrt(2)*(Math.sin(p)+Math.sin(q));
         s.velocity[index]=-c.waveSpeed*k*c.amplitude/Math.sqrt(2)*(Math.cos(p)+Math.cos(q));
       }this.surfaces.push(s);
     }
     this.detect(false);this.stats=this.summary();this.history.push({...this.stats});
   }
   random(){let s=this.seed;s^=s<<13;s^=s>>>17;s^=s<<5;this.seed=s>>>0;return this.seed/4294967296;}
   position(s,i,j,h=s.h[i+this.config.resolution*j]){
     const dx=this.length/this.config.resolution,u=-this.length/2+i*dx,v=-this.length/2+j*dx;
     return s.normal.map((n,k)=>n*(s.offset+h)+s.u[k]*u+s.v[k]*v);
   }
   heightAt(s,u,v){
     const N=this.config.resolution,L=this.length;if(Math.abs(u)>L/2||Math.abs(v)>L/2)return null;
     const x=(u+L/2)*N/L,y=(v+L/2)*N/L,i=Math.floor(x),j=Math.floor(y),a=x-i,b=y-j;
     const h=(p,q)=>s.h[(p%N)+N*(q%N)];
     return(1-a)*(1-b)*h(i,j)+a*(1-b)*h(i+1,j)+(1-a)*b*h(i,j+1)+a*b*h(i+1,j+1);
   }
   acceleration(s,sources){
     const c=this.config,N=c.resolution,dx=this.length/N,result=new Float64Array(N*N);
     for(let j=0;j<N;j++)for(let i=0;i<N;i++){
       const k=i+N*j,h=s.h[k];
       result[k]=c.waveSpeed**2*(s.h[(i+1)%N+N*j]+s.h[(i+N-1)%N+N*j]+s.h[i+N*((j+1)%N)]+s.h[i+N*((j+N-1)%N)]-4*h)/(dx*dx);
       if(c.gravityEnabled&&c.gravityStrength>0&&sources.length){
         const p=this.position(s,i,j);
         for(const source of sources){const delta=source.center.map((x,d)=>x-p[d]),r2=dot(delta,delta)+c.softening**2;result[k]+=c.gravityStrength*source.charge*dot(delta,s.normal)/r2**1.5;}
       }
     }return result;
   }
   detect(advance=true){
     const c=this.config,N=c.detectorResolution,dx=2/N,allColors=(1<<c.colors)-1,occupied=new Uint8Array(N**3);let overlaps=0,qualified=0;
     for(let z=0;z<N;z++)for(let y=0;y<N;y++)for(let x=0;x<N;x++){
       const index=x+N*(y+N*z),p=[x,y,z].map(t=>-1+(t+.5)*dx);
       for(let i=0;i<this.surfaces.length;i++){const s=this.surfaces[i],h=this.heightAt(s,dot(p,s.u),dot(p,s.v));if(h!==null&&Math.abs(dot(p,s.normal)-s.offset-h)<=c.thickness)occupied[index]|=1<<i;}
       if(occupied[index]===allColors)overlaps++;
     }
     const enclosed=c.criterion==='enclosure'?enclosedMask(occupied,N,allColors):{mask:Uint8Array.from(occupied,x=>x===allColors?1:0),regions:0};
     this.enclosedRegions=enclosed.regions;this.candidateVoxels=0;
     for(let index=0;index<occupied.length;index++){
       const candidate=enclosed.mask[index];this.candidateVoxels+=candidate;
       if(candidate){if(advance)this.ages[index]++;}else this.ages[index]=0;
       this.mask[index]=candidate&&this.ages[index]>=c.holdSteps?1:0;qualified+=this.mask[index];
     }
     const seen=new Uint8Array(this.mask.length),sources=[];
     for(let k=0;k<this.mask.length;k++)if(this.mask[k]&&!seen[k]){
       const queue=[k],sum=[0,0,0];seen[k]=1;
       for(let cursor=0;cursor<queue.length;cursor++){
         const a=queue[cursor],p=[a%N,Math.floor(a/N)%N,Math.floor(a/N**2)];
         for(let d=0;d<3;d++){sum[d]+=-1+(p[d]+.5)*dx;for(const direction of [-1,1]){const q=[...p];q[d]+=direction;if(q[d]<0||q[d]>=N)continue;const b=q[0]+N*(q[1]+N*q[2]);if(this.mask[b]&&!seen[b]){seen[b]=1;queue.push(b);}}}
       }
       sources.push({key:k,center:sum.map(x=>x/queue.length),voxels:queue.length,charge:queue.length*dx**3});
     }
     this.sources=sources;this.overlaps=overlaps;this.qualified=qualified;
   }
   energy(){
     const c=this.config,N=c.resolution,dx=this.length/N;let e=0;
     for(const s of this.surfaces)for(let j=0;j<N;j++)for(let i=0;i<N;i++){
       const k=i+N*j,du=(s.h[(i+1)%N+N*j]-s.h[k])/dx,dv=(s.h[i+N*((j+1)%N)]-s.h[k])/dx;
       e+=(s.velocity[k]**2+c.waveSpeed**2*(du*du+dv*dv))*dx*dx/2;
     }return e;
   }
   summary(){return{generation:this.generation,time:this.time,overlapVoxels:this.overlaps,enclosedRegions:this.enclosedRegions,candidateVoxels:this.candidateVoxels,qualifiedVoxels:this.qualified,aggregates:this.sources.length,activeSources:this.config.gravityEnabled&&this.config.gravityStrength>0?this.sources.length:0,waveEnergy:this.energy(),maxDisplacement:Math.max(...this.surfaces.map(s=>Math.max(...s.h.map(Math.abs))))};}
   step(){
     const c=this.config,dt=c.dt,damping=Math.exp(-c.damping*dt/2),sources=this.sources;
     // Velocity Verlet, exact damping half-steps. Sources frozen from the previous detection.
     for(const s of this.surfaces){
       const a=this.acceleration(s,sources);
       for(let k=0;k<s.h.length;k++){s.velocity[k]=s.velocity[k]*damping+a[k]*dt/2;s.h[k]+=s.velocity[k]*dt;}
       const b=this.acceleration(s,sources);
       for(let k=0;k<s.h.length;k++){s.velocity[k]=(s.velocity[k]+b[k]*dt/2)*damping;if(!Number.isFinite(s.h[k])||!Number.isFinite(s.velocity[k]))throw Error('Évolution non finie : réduire le pas ou le couplage.');}
     }
     this.generation++;this.time=this.generation*dt;this.detect();this.stats=this.summary();this.history.push({...this.stats});return this.stats;
   }
   experiment(){return{format:'wave-surfaces-v1',config:{...this.config},history:this.history.map(s=>({...s})),sources:this.sources.map(s=>({...s,center:[...s.center]})),surfaces:this.surfaces.map(s=>({...s,normal:[...s.normal],u:[...s.u],v:[...s.v],h:Array.from(s.h),velocity:Array.from(s.velocity)})),ages:Array.from(this.ages),note:'Surfaces 2D à déplacement normal dans un espace 3D fixé. Fermeture discrète : région libre sans chemin extérieur à 26 voisins, bordée par toutes les couleurs. Alternative : croisement sans fermeture. Persistance mesurée par site, non par objet suivi. Charge attractive = volume qualifié, sans conversion d’énergie ni masse physique identifiée. Aucune sphéricité, dimension émergente ni cosmologie imposée.'};}
 }
 const api={World,defaults,validate,COLORS,enclosedMask};if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.WaveSurfaces=api;
})(globalThis);
