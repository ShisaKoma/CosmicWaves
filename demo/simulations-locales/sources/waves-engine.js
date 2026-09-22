/* Surfaces ondulantes 2D plongées en 3D. Modèle effectif exploratoire. */
(function(global){
 'use strict';
 const Geometry=typeof module!=='undefined'&&module.exports?require('./waves-geometry.js'):global.WaveGeometry;
 const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const unit=a=>{const n=Math.hypot(...a);return a.map(x=>x/n);};
 const COLORS=['#69C9FF','#FF926E','#BD9AFF','#74DFA8','#FFD86A','#F793CE','#A8D578','#92A8FF'];
 const geometryDefaults=()=>({enabled:true,collective:true,centralBranes:1,asymmetry:.15,emergenceTolerance:.8,stabilityTolerance:.2,stabilitySteps:12,minRegionVoxels:4});
 const defaults=()=>({version:2,geometry:geometryDefaults(),seed:728931,colors:10,domainEnabled:true,captureFraction:.5,captureRadius:.35,minimumRadius:.05,shrinkRate:1.5,initialLayout:'random',resolution:20,detectorResolution:20,criterion:'enclosure',amplitude:.22,cycles:1,waveSpeed:.6,damping:.02,thickness:.08,holdSteps:3,gravityEnabled:true,gravityStrength:.6,softening:.25,dt:.02});
 function hexColor(h){const a=.65*.5,f=n=>{const k=(n+h/30)%12;return Math.round(255*(.65-a*Math.max(-1,Math.min(k-3,9-k,1)))).toString(16).padStart(2,'0');};return '#'+f(0)+f(8)+f(4);}
 for(let i=8;i<32;i++)COLORS.push(hexColor((i*137.507764)%360));
 const colorMask=count=>2**count-1;
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
         const k=q[0]+N*(q[1]+N*q[2]);if(occupied[k])boundaryColors=(boundaryColors|occupied[k])>>>0;else if(!seen[k]){seen[k]=1;queue.push(k);}
       }
     }
     if(!exterior&&boundaryColors===allColors){regions++;for(const k of queue)mask[k]=1;}
   }
   return{mask,regions};
 }
 function validate(c){
   if(c&&c.version===1)c={...defaults(),...c,version:2,domainEnabled:false,geometry:{...geometryDefaults(),enabled:false}};
   if(c&&c.version===2&&!Object.hasOwn(c,'geometry'))c={...c,geometry:{...geometryDefaults(),enabled:false}};
   const d=defaults();if(!c||typeof c!=='object'||Array.isArray(c))throw Error('Configuration requise.');
   for(const key of Object.keys(c))if(!Object.hasOwn(d,key))throw Error('Paramètre inconnu : '+key);
   for(const key of Object.keys(d))if(!Object.hasOwn(c,key))throw Error('Paramètre manquant : '+key);
   function n(key,lo,hi,int=false){const v=c[key];if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi||(int&&!Number.isInteger(v)))throw Error(key+' : valeur entre '+lo+' et '+hi+'.');}
   n('version',2,2,true);n('seed',1,4294967295,true);n('colors',2,32,true);n('resolution',12,32,true);n('detectorResolution',8,24,true);
   n('amplitude',0,.5);n('cycles',1,3,true);n('waveSpeed',.05,2);n('damping',0,2);n('thickness',.02,.6);n('holdSteps',1,100,true);
   n('gravityStrength',0,5);n('softening',.15,1);n('dt',.001,.04);if(typeof c.gravityEnabled!=='boolean')throw Error('gravityEnabled doit être booléen.');
   n('captureFraction',0,1);n('captureRadius',.1,.8);n('minimumRadius',.01,.2);n('shrinkRate',.1,10);
   if(typeof c.domainEnabled!=='boolean')throw Error('domainEnabled doit être booléen.');
   const g=c.geometry;if(!g||typeof g!=='object'||Array.isArray(g))throw Error('Objet geometry requis.');
   for(const key of Object.keys(g))if(!Object.hasOwn(geometryDefaults(),key))throw Error('Paramètre géométrique inconnu : '+key);
   for(const key of ['enabled','collective'])if(typeof g[key]!=='boolean')throw Error('Booléen geometry.'+key+' requis.');
   for(const [key,lo,hi,int] of [['centralBranes',0,3,true],['asymmetry',0,1,false],['emergenceTolerance',0,1,false],['stabilityTolerance',0,1,false],['stabilitySteps',2,200,true],['minRegionVoxels',1,1000,true]])if(!Number.isFinite(g[key])||g[key]<lo||g[key]>hi||(int&&!Number.isInteger(g[key])))throw Error('geometry.'+key+' : valeur entre '+lo+' et '+hi+'.');
   if(g.stabilityTolerance>g.emergenceTolerance)throw Error('Le seuil de stabilité doit être inférieur ou égal au seuil d’émergence.');
   if(c.initialLayout==='multiverse'&&c.colors-g.centralBranes<6)throw Error('Prévoir au moins 6 surfaces extérieures en plus des branes centrales.');
   if(!['random','prepared','multiverse'].includes(c.initialLayout))throw Error('Disposition inconnue.');
   if(!['enclosure','intersection'].includes(c.criterion))throw Error('Critère : enclosure ou intersection.');
   if(c.waveSpeed*c.dt/(3.2/c.resolution)>.5)throw Error('Pas temporel trop grand pour la résolution et la vitesse des ondes.');
   return JSON.parse(JSON.stringify(c));
 }
 class World{
   constructor(c=defaults()){
     c=validate(c);this.config=c;this.seed=c.seed;this.generation=0;this.time=0;this.length=3.2;this.surfaces=[];this.sources=[];this.history=[];this.domains=[];this.events=[];this.nextDomainId=1;this.geometryFrames=[];this.geometryReport=null;
     this.ages=new Uint32Array(c.detectorResolution**3);this.mask=new Uint8Array(this.ages.length);
     const N=c.resolution,dx=this.length/N,k=2*Math.PI*c.cycles/this.length;
     for(let color=0;color<c.colors;color++){
       const rz=2*this.random()-1,ra=2*Math.PI*this.random(),z=c.initialLayout==='prepared'?1-2*(color+.5)/c.colors:rz,a=c.initialLayout==='prepared'?color*Math.PI*(3-Math.sqrt(5)):ra,normal=[Math.sqrt(1-z*z)*Math.cos(a),Math.sqrt(1-z*z)*Math.sin(a),z];
       if(c.initialLayout==='multiverse'){const outer=c.colors-c.geometry.centralBranes;if(color>=outer){normal.fill(0);normal[color-outer]=1;}else{const axes=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],extra=[[Math.SQRT1_2,Math.SQRT1_2,0],[-Math.SQRT1_2,-Math.SQRT1_2,0]];const target=color<6?axes[color]:((color-6)%2===0&&color===outer-1?axes[0]:extra[(color-6)%2]);for(let d=0;d<3;d++)normal[d]=target[d];}}
       const u=unit(cross(normal,Math.abs(normal[2])<.9?[0,0,1]:[0,1,0])),v=cross(normal,u);
       const offset=(this.random()-.5)*.24;
       const s={color:COLORS[color],normal,u,v,offset:c.initialLayout==='prepared'?.55:offset,content:new Float64Array(N*N).fill(1),h:new Float64Array(N*N),velocity:new Float64Array(N*N)};
       const phase=2*Math.PI*this.random(),phase2=2*Math.PI*this.random();
       s.central=c.initialLayout==='multiverse'&&color>=c.colors-c.geometry.centralBranes;
       if(c.initialLayout==='multiverse')s.offset=(s.central?0:.6)+c.geometry.asymmetry*offset*3;
       for(let j=0;j<N;j++)for(let i=0;i<N;i++){
         const p=k*(-this.length/2+i*dx)+phase,q=k*(-this.length/2+j*dx)+phase2,index=i+N*j;
         s.h[index]=c.amplitude/Math.sqrt(2)*(Math.sin(p)+Math.sin(q));
         s.velocity[index]=-c.waveSpeed*k*c.amplitude/Math.sqrt(2)*(Math.cos(p)+Math.cos(q));
       }
       if(c.initialLayout==='multiverse'){const g=c.geometry,sharedPhase=(c.seed%997)/997*2*Math.PI;for(let j=0;j<N;j++)for(let i=0;i<N;i++){const index=i+N*j,shape=Math.cos(k*(-this.length/2+i*dx))*Math.cos(k*(-this.length/2+j*dx)),a=c.amplitude*(s.central?g.asymmetry:1),ph=sharedPhase+g.asymmetry*(phase-Math.PI);s.h[index]=a*shape*Math.cos(ph);s.velocity[index]=-c.waveSpeed*k*Math.SQRT2*a*shape*Math.sin(ph);}}
       this.surfaces.push(s);
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
     const c=this.config,N=c.detectorResolution,dx=2/N,allColors=colorMask(c.colors),occupied=new Uint32Array(N**3);let overlaps=0,qualified=0;
     for(let z=0;z<N;z++)for(let y=0;y<N;y++)for(let x=0;x<N;x++){
       const index=x+N*(y+N*z),p=[x,y,z].map(t=>-1+(t+.5)*dx);
       for(let i=0;i<this.surfaces.length;i++){const s=this.surfaces[i],h=this.heightAt(s,dot(p,s.u),dot(p,s.v));if(h!==null&&Math.abs(dot(p,s.normal)-s.offset-h)<=c.thickness)occupied[index]|=1<<i;}
       if(occupied[index]===allColors)overlaps++;
     }
     this.geometryReport=c.geometry.enabled&&c.criterion==='enclosure'?Geometry.analyse(occupied,N,allColors,c.geometry):null;
     const enclosed=this.geometryReport?{mask:this.geometryReport.mask,regions:this.geometryReport.regions.length}:c.criterion==='enclosure'?enclosedMask(occupied,N,allColors):{mask:Uint8Array.from(occupied,x=>x===allColors?1:0),regions:0};
     this.enclosedRegions=enclosed.regions;this.candidateVoxels=0;
     for(let index=0;index<occupied.length;index++){
       const candidate=enclosed.mask[index];this.candidateVoxels+=candidate;
       if(candidate){if(advance)this.ages[index]++;}else this.ages[index]=0;
       this.mask[index]=candidate&&this.ages[index]>=c.holdSteps?1:0;qualified+=this.mask[index];
     }
     const seen=new Uint8Array(this.mask.length),sources=[];
     if(this.geometryReport){
       if(this.geometryReport.accepted)for(const region of this.geometryReport.eligible){
         const cells=region.cells.filter(k=>this.mask[k]);
         if(cells.length<c.geometry.minRegionVoxels){for(const k of cells)this.mask[k]=0;qualified-=cells.length;continue;}
         const shape=Geometry.describe(region.cells,N);sources.push({geometry:shape,geometricCells:region.cells,key:region.cells[0],center:shape.center,voxels:cells.length,cells,charge:cells.length*dx**3});
       }
     }else for(let k=0;k<this.mask.length;k++)if(this.mask[k]&&!seen[k]){
       const queue=[k],sum=[0,0,0];seen[k]=1;
       for(let cursor=0;cursor<queue.length;cursor++){
         const a=queue[cursor],p=[a%N,Math.floor(a/N)%N,Math.floor(a/N**2)];
         for(let d=0;d<3;d++){sum[d]+=-1+(p[d]+.5)*dx;for(const direction of [-1,1]){const q=[...p];q[d]+=direction;if(q[d]<0||q[d]>=N)continue;const b=q[0]+N*(q[1]+N*q[2]);if(this.mask[b]&&!seen[b]){seen[b]=1;queue.push(b);}}}
       }
       if(c.geometry.enabled&&queue.length<c.geometry.minRegionVoxels){for(const cell of queue)this.mask[cell]=0;qualified-=queue.length;continue;}
       sources.push({geometry:c.geometry.enabled?Geometry.describe(queue,N):null,key:k,center:sum.map(x=>x/queue.length),voxels:queue.length,cells:queue,charge:queue.length*dx**3});
     }
     this.sources=sources;this.overlaps=overlaps;this.qualified=qualified;
   }
   activeAttractors(){
     if(!this.config.domainEnabled)return this.sources;
     return this.domains.filter(d=>d.phase==='linked').map(d=>({center:d.center,charge:d.initialCharge*(1+this.captureProgress(d))}));
   }
   captureProgress(d){return d.targetPerSurface>0?Math.min(1,d.captured.reduce((a,b)=>a+b,0)/(d.targetPerSurface*this.config.colors)):0;}
   createDomain(source){
     const c=this.config,N=c.resolution,dx=this.length/N,count=Math.min(N*N,Math.max(1,Math.round(Math.PI*c.captureRadius**2/dx**2)));
     const patches=this.surfaces.map(s=>Array.from({length:N*N},(_,k)=>({k,d:this.position(s,k%N,Math.floor(k/N)).reduce((a,x,i)=>a+(x-source.center[i])**2,0)})).sort((a,b)=>a.d-b.d||a.k-b.k).slice(0,count).map(p=>p.k));
     const anchors=patches.map((p,i)=>this.position(this.surfaces[i],p[0]%N,Math.floor(p[0]/N))),mean=[0,1,2].map(i=>anchors.reduce((a,p)=>a+p[i],0)/c.colors);
     const D=c.detectorResolution,point=k=>[k%D,Math.floor(k/D)%D,Math.floor(k/D**2)].map(x=>-1+(x+.5)*2/D);
     const center=point(source.cells.reduce((best,k)=>{const dist=a=>point(a).reduce((v,x,i)=>v+(x-mean[i])**2,0);return dist(k)<dist(best)?k:best;},source.cells[0]));
     const floor=1-c.captureFraction,targetPerSurface=Math.min(...patches.map((patch,i)=>patch.reduce((sum,k)=>sum+Math.max(0,this.surfaces[i].content[k]-floor),0)));
     const d={id:this.nextDomainId++,bornStep:this.generation,internalTime:0,phase:'linked',center,patches,anchors,cells:[...(source.geometricCells||source.cells)],radius:c.minimumRadius,initialCharge:source.charge,targetPerSurface,captured:Array(c.colors).fill(0),breakStep:null,breakReason:null,geometry:source.geometry||null,stableStreak:0,stability:'pending'};
     this.domains.push(d);this.events.push({step:this.generation,type:'birth',domainId:d.id,center:[...center]});return d;
   }
   syncDomains(){
     const previous=this.domains.filter(d=>d.cells.length),used=new Set();
     for(const source of this.sources){
       const cells=new Set(source.geometricCells||source.cells);let match=null,best=0;
       for(const d of previous)if(!used.has(d.id)){let shared=0;for(const k of d.cells)if(cells.has(k))shared++;if(shared>best){best=shared;match=d;}}
       if(match){used.add(match.id);match.cells=[...(source.geometricCells||source.cells)];match.geometry=source.geometry||null;}else this.createDomain(source);
     }
     for(const d of previous)if(!used.has(d.id)){d.cells=[];if(d.phase==='linked')this.breakDomain(d.id,'loss-of-closure',false);}
   }
   breakDomain(id,reason='manual',record=true){
     const d=this.domains.find(d=>d.id===id);if(!d||d.phase!=='linked')return false;
     d.phase='broken';d.stability='broken';d.stableStreak=0;d.breakStep=this.generation;d.breakReason=reason;
     this.events.push({step:this.generation,type:'break',domainId:id,reason});
     if(record){this.stats=this.summary();this.history.push({...this.stats});}return true;
   }
   capture(){
     const c=this.config;if(!c.gravityEnabled||c.gravityStrength===0)return;
     const floor=1-c.captureFraction,rate=1-Math.exp(-c.gravityStrength*c.dt);
     for(const d of this.domains)if(d.phase==='linked'){
       const available=d.patches.map((patch,i)=>patch.reduce((sum,k)=>sum+Math.max(0,this.surfaces[i].content[k]-floor),0));
       const common=Math.max(0,Math.min(d.targetPerSurface-d.captured[0],...available)),amount=common*rate;
       if(amount>0)for(let i=0;i<c.colors;i++){const s=this.surfaces[i];for(const k of d.patches[i])s.content[k]-=amount*Math.max(0,s.content[k]-floor)/available[i];d.captured[i]+=amount;}
       d.radius=c.minimumRadius*(1+this.captureProgress(d));
     }
   }
   domainEvolution(){
     for(const d of this.domains)if(d.phase==='broken'){
       d.radius*=Math.exp(-this.config.shrinkRate*this.config.dt);
       if(d.radius<this.config.minimumRadius*.01){d.radius=0;d.phase='remnant';this.events.push({step:this.generation,type:'remnant',domainId:d.id});}
     }
     const b=this.contentBalance();if(Math.abs(b.error)>1e-7)throw Error('Bilan de contenu incohérent.');
   }
   updateStability(){
     const g=this.config.geometry,score=this.geometryReport?.dissymmetry??null;
     for(const d of this.domains)if(d.phase==='linked'){
       const before=d.stability;
       if(g.enabled&&score!==null&&score<=g.stabilityTolerance)d.stableStreak++;else d.stableStreak=0;
       d.stability=!g.enabled?'unassessed':score===null?'pending':score>g.stabilityTolerance?'fragile':d.stableStreak>=g.stabilitySteps?'stable':'pending';
       if(before!==d.stability)this.events.push({type:'stability',step:this.generation,domainId:d.id,state:d.stability,score});
     }
     this.geometryFrames.push({step:this.generation,score,ids:this.domains.filter(d=>d.phase==='linked').map(d=>d.id)});
   }
   contentBalance(){const initial=this.config.colors*this.config.resolution**2,remaining=this.surfaces.reduce((a,s)=>a+s.content.reduce((u,v)=>u+v,0),0),captured=this.domains.reduce((a,d)=>a+d.captured.reduce((u,v)=>u+v,0),0);return{initial,remaining,captured,error:remaining+captured-initial};}
   energy(){
     const c=this.config,N=c.resolution,dx=this.length/N;let e=0;
     for(const s of this.surfaces)for(let j=0;j<N;j++)for(let i=0;i<N;i++){
       const k=i+N*j,du=(s.h[(i+1)%N+N*j]-s.h[k])/dx,dv=(s.h[i+N*((j+1)%N)]-s.h[k])/dx;
       e+=(s.velocity[k]**2+c.waveSpeed**2*(du*du+dv*dv))*dx*dx/2;
     }return e;
   }
   summary(){const b=this.contentBalance();return{geometryDissymmetry:this.geometryReport?.dissymmetry??null,closedComponents:this.geometryReport?.regions.length??null,volumeContrast:this.geometryReport?.volumeContrast??null,stableDomains:this.domains.filter(d=>d.phase==='linked'&&d.stability==='stable').length,fragileDomains:this.domains.filter(d=>d.phase==='linked'&&d.stability==='fragile').length,generation:this.generation,calculationParameter:this.time,internalTime:this.domains.length?Math.max(...this.domains.map(d=>d.internalTime)):null,overlapVoxels:this.overlaps,enclosedRegions:this.enclosedRegions,candidateVoxels:this.candidateVoxels,qualifiedVoxels:this.qualified,aggregates:this.sources.length,activeSources:this.config.gravityEnabled&&this.config.gravityStrength>0?this.activeAttractors().length:0,domainsBorn:this.domains.length,linkedDomains:this.domains.filter(d=>d.phase==='linked').length,brokenDomains:this.domains.filter(d=>d.phase==='broken').length,capturedContent:b.captured,remainingContent:b.remaining,contentBalanceError:b.error,waveEnergy:this.energy(),maxDisplacement:Math.max(...this.surfaces.map(s=>Math.max(...s.h.map(Math.abs))))};}
   step(){
     const c=this.config,dt=c.dt,damping=Math.exp(-c.damping*dt/2),sources=this.activeAttractors();
     // Velocity Verlet, exact damping half-steps. Sources frozen from the previous detection.
     for(const s of this.surfaces){
       const a=this.acceleration(s,sources);
       for(let k=0;k<s.h.length;k++){s.velocity[k]=s.velocity[k]*damping+a[k]*dt/2;s.h[k]+=s.velocity[k]*dt;}
       const b=this.acceleration(s,sources);
       for(let k=0;k<s.h.length;k++){s.velocity[k]=(s.velocity[k]+b[k]*dt/2)*damping;if(!Number.isFinite(s.h[k])||!Number.isFinite(s.velocity[k]))throw Error('Évolution non finie : réduire le pas ou le couplage.');}
     }
     this.generation++;this.time=this.generation*dt;
     if(c.domainEnabled){for(const d of this.domains)if(d.phase!=='remnant')d.internalTime+=dt;this.capture();}
     this.detect();if(c.domainEnabled){this.syncDomains();this.domainEvolution();}this.updateStability();this.stats=this.summary();this.history.push({...this.stats});return this.stats;
   }
   experiment(){return{format:'wave-surfaces-v2',geometryFrames:JSON.parse(JSON.stringify(this.geometryFrames)),geometrySettings:{...this.config.geometry},domains:JSON.parse(JSON.stringify(this.domains)),events:JSON.parse(JSON.stringify(this.events)),contentBalance:this.contentBalance(),config:{...this.config},history:this.history.map(s=>({...s})),sources:this.sources.map(s=>({...s,center:[...s.center]})),surfaces:this.surfaces.map(s=>({...s,normal:[...s.normal],u:[...s.u],v:[...s.v],content:Array.from(s.content),h:Array.from(s.h),velocity:Array.from(s.velocity)})),ages:Array.from(this.ages),note:'Surfaces 2D à déplacement normal dans un espace 3D fixé. Fermeture discrète : région libre sans chemin extérieur à 26 voisins, bordée par toutes les couleurs. Alternative : croisement sans fermeture. Persistance mesurée par site, non par objet suivi. Charge attractive fondée sur le volume qualifié et la capture, sans conversion d’énergie ni masse physique identifiée. Domaines v2 : sphère illustrative centrale, capture locale à parts égales, horloge conventionnelle démarrée à la naissance, rétrécissement après rupture des liaisons. Le paramètre numérique préalable ne démontre ni temps physique préalable ni absence de causalité. Stabilité géométrique : persistance sous un seuil conventionnel, sans garantie dynamique asymptotique. Aucun calcul de métrique ou de cosmologie.'};}
 }
 const api={World,defaults,validate,COLORS,enclosedMask,colorMask};if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.WaveSurfaces=api;
})(globalThis);
