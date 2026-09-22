/* Séquence imposée par l'utilisateur. Ne modifie jamais le solveur d'ondes. */
(function(global){
 'use strict';
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 class Sequence{
   constructor(world){
     this.elapsed=0;this.duration=12;this.sourceStep=world.generation;this.sourceConfig={...world.config};this.particles=[];this.patchKeys=new Set();
     const N=world.config.resolution,dx=world.length/N,K=Math.min(N*N,Math.max(1,Math.round(Math.PI*world.config.captureRadius**2/dx**2))),C=world.surfaces.length;
     const reference=world.domains.find(d=>d.phase==='linked')?.center||[0,0,0];
     const patches=world.surfaces.map(s=>Array.from({length:N*N},(_,k)=>({k,origin:world.position(s,k%N,Math.floor(k/N))})).sort((a,b)=>{const d=p=>p.reduce((sum,x,i)=>sum+(x-reference[i])**2,0);return d(a.origin)-d(b.origin)||a.k-b.k;}).slice(0,K));
     this.center=[0,1,2].map(axis=>patches.reduce((sum,p)=>sum+p[0].origin[axis],0)/C);
     this.localContent=0;this.capturedContent=0;
     for(let j=0;j<K;j++)for(let i=0;i<C;i++){
       const {k,origin}=patches[i][j],index=j*C+i,z=1-2*(index+.5)/(K*C),angle=index*Math.PI*(3-Math.sqrt(5)),r=Math.sqrt(1-z*z),content=world.surfaces[i].content[k];
       const captured=Math.max(0,content-(1-world.config.captureFraction));
       this.localContent+=content;this.capturedContent+=captured;this.patchKeys.add(i+':'+k);
       this.particles.push({surface:i,k,color:world.surfaces[i].color,origin:[...origin],direction:[r*Math.cos(angle),z,r*Math.sin(angle)],captured});
     }
     this.remainingContent=this.localContent-this.capturedContent;
   }
   get phase(){return this.elapsed<2?'fermeture':this.elapsed<5?'agregation':this.elapsed<12?'expansion':'terminee';}
   get radius(){return this.elapsed<2?.65:this.elapsed<5?.65+(.16-.65)*smooth((this.elapsed-2)/3):.16+(2.05-.16)*smooth((this.elapsed-5)/7);}
   get expansion(){return smooth((this.elapsed-5)/7);}
   get assembly(){return smooth(this.elapsed/2);}
   step(seconds){if(!Number.isFinite(seconds)||seconds<0)throw Error('Durée d’animation invalide.');this.elapsed=Math.min(this.duration,this.elapsed+seconds);return this.phase;}
   position(p){const target=this.center.map((x,i)=>x+this.radius*p.direction[i]),q=this.assembly;return p.origin.map((x,i)=>x+(target[i]-x)*q);}
   deform(position,surface,k){if(!this.patchKeys.has(surface+':'+k))return position;const q=.32*smooth(this.elapsed/5);return position.map((x,i)=>x+(this.center[i]-x)*q);}
   export(){return{kind:'forced-spherical-illustration-v1',forced:true,sourceStep:this.sourceStep,sourceConfig:{...this.sourceConfig},elapsed:this.elapsed,duration:this.duration,phase:this.phase,center:[...this.center],radius:this.radius,localContent:this.localContent,capturedContent:this.capturedContent,remainingContent:this.remainingContent,particles:this.particles.map(p=>({...p,origin:[...p.origin],direction:[...p.direction]})),note:'Fermeture sphérique imposée, agrégation puis expansion prescrites. Répartition illustrative du contenu transférable des patches présents ; aucune modification du monde source, aucun événement spontané ni calcul cosmologique.'};}
 }
 const api={Sequence};if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.WaveIllustration=api;
})(globalThis);
