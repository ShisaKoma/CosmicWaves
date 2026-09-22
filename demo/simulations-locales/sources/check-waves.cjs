'use strict';
const assert=require('node:assert/strict'),W=require('./waves-engine.js');
let passed=0;const test=(name,f)=>{f();console.log('OK '+name);passed++;};
const config=patch=>({...W.defaults(),colors:4,domainEnabled:false,resolution:12,detectorResolution:8,...patch});
const state=w=>w.surfaces.map(s=>[Array.from(s.h),Array.from(s.velocity)]);
const steps=(w,n)=>{for(let i=0;i<n;i++)w.step();return w;};
test('Même graine, même trajectoire et détection',()=>{
 const a=steps(new W.World(config()),12),b=steps(new W.World(config()),12);assert.deepEqual(a.experiment(),b.experiment());
});
test('Attraction nulle équivalente à désactivation',()=>{
 const a=steps(new W.World(config({gravityStrength:0,criterion:'intersection',thickness:.5})),8),b=steps(new W.World(config({gravityEnabled:false,criterion:'intersection',thickness:.5})),8);assert.deepEqual(state(a),state(b));assert.equal(a.stats.activeSources,0);
});
test('Toutes les couleurs requises au croisement',()=>{
 const w=new W.World(config({criterion:'intersection',holdSteps:1,thickness:.5}));w.surfaces.at(-1).offset=100;w.detect();assert.equal(w.overlaps,0);assert.equal(w.sources.length,0);
});
test('Persistance et action au pas suivant seulement',()=>{
 const c=config({criterion:'intersection',amplitude:0,thickness:.6,holdSteps:3,damping:0}),a=new W.World(c),b=new W.World({...c,gravityEnabled:false});
 steps(a,2);steps(b,2);assert.equal(a.sources.length,0);a.step();b.step();assert(a.sources.length>0);assert.deepEqual(state(a),state(b));a.step();b.step();assert.notDeepEqual(state(a),state(b));
});
function shell(missing=false,gap=false){const N=7,a=new Uint8Array(N**3);for(let z=1;z<6;z++)for(let y=1;y<6;y++)for(let x=1;x<6;x++)if([x,y,z].some(t=>t===1||t===5))a[x+N*(y+N*z)]=missing?1:([x,y,z].includes(1)?1:2);if(gap)a[3+N*(3+N)]=0;return a;}
test('Enveloppe fermée multicolore : volume intérieur détecté',()=>{const r=W.enclosedMask(shell(),7,3);assert.equal(r.regions,1);assert.equal(r.mask.reduce((a,b)=>a+b),27);});
test('Ouverture de l’enveloppe : aucun volume fermé',()=>assert.equal(W.enclosedMask(shell(false,true),7,3).regions,0));
test('Couleur absente de l’enveloppe : aucun déclenchement',()=>assert.equal(W.enclosedMask(shell(true),7,3).regions,0));
test('Fuite diagonale : pas de fausse fermeture à six voisins',()=>{const a=shell();a[1+7*(1+7)]=0;assert.equal(W.enclosedMask(a,7,3).regions,0);});
test('La limite du domaine ne ferme pas une enveloppe',()=>{const a=new Uint8Array(7**3);for(let z=0;z<7;z++)for(let y=0;y<7;y++)a[3+7*(y+7*z)]=3;assert.equal(W.enclosedMask(a,7,3).regions,0);});
test('Un croisement de plans ne suffit pas à fermer',()=>{const a=new Uint8Array(7**3);for(let z=0;z<7;z++)for(let y=0;y<7;y++)for(let x=0;x<7;x++)a[x+7*(y+7*z)]=(x===3?1:0)|(y===3?2:0);assert.equal(W.enclosedMask(a,7,3).regions,0);});
test('Six surfaces planes ferment un volume dans le détecteur complet',()=>{
 const w=new W.World(config({colors:6,resolution:12,detectorResolution:24,amplitude:0,thickness:.09,holdSteps:2}));
 const normals=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 w.surfaces.forEach((s,i)=>{s.normal=normals[i];s.u=i<2?[0,1,0]:[1,0,0];s.v=i<4?[0,0,1]:[0,1,0];s.offset=.45;s.h.fill(0);s.velocity.fill(0);});
 w.detect();assert.equal(w.enclosedRegions,1);assert.equal(w.sources.length,0);w.detect();assert(w.sources.length>0);
 w.surfaces[0].offset=100;w.detect();assert.equal(w.enclosedRegions,0);assert.equal(w.sources.length,0);
});
test('Condition CFL et paramètres inconnus rejetés',()=>{assert.throws(()=>new W.World(config({waveSpeed:2,resolution:32,dt:.04})));assert.throws(()=>new W.World({...config(),inconnu:1}));});
test('Convergence temporelle vers le mode de Fourier discret',()=>{
 function error(dt){const w=new W.World(config({dt,gravityEnabled:false,damping:0})),h0=w.surfaces[0].h.slice(),v0=w.surfaces[0].velocity.slice(),dx=w.length/w.config.resolution,k=2*Math.PI/w.length,omega=2*w.config.waveSpeed/dx*Math.sin(k*dx/2);steps(w,Math.round(1/dt));return Math.sqrt(w.surfaces[0].h.reduce((e,h,i)=>e+(h-h0[i]*Math.cos(omega)-v0[i]/omega*Math.sin(omega))**2,0)/h0.length);}
 const coarse=error(.02),fine=error(.01);assert(coarse<.0001);assert(coarse/fine>3.8&&coarse/fine<4.2);console.log({coarse,fine});
});
test('Énergie des ondes sans couplage : faible erreur et dissipation',()=>{
 const a=new W.World(config({gravityEnabled:false,damping:0})),initial=a.energy();steps(a,100);assert(Math.abs(a.energy()/initial-1)<.001);
 const b=new W.World(config({gravityEnabled:false,damping:.5}));steps(b,100);assert(b.energy()<initial*.6);
});
test('Charge = volume qualifié, export complet',()=>{const w=steps(new W.World(config({criterion:'intersection',thickness:.5})),5);assert(w.sources.length>0);assert(Math.abs(w.sources.reduce((s,x)=>s+x.charge,0)-w.qualified*(2/w.config.detectorResolution)**3)<1e-12);assert.equal(w.experiment().history.length,6);assert.equal(w.experiment().surfaces[0].h.length,144);});
test('Palettes demandées : 10, 11, 26 et 32 surfaces distinctes',()=>{
 for(const colors of [10,11,26,32]){const w=new W.World(config({colors}));assert.equal(w.surfaces.length,colors);assert.equal(new Set(w.surfaces.map(s=>s.color)).size,colors);w.step();assert(Number.isFinite(w.energy()));}
});
test('Le bit 32 ne devient ni négatif ni un doublon du premier',()=>{
 assert.equal(W.colorMask(32),4294967295);const N=7,a=Uint32Array.from(shell(),x=>x?0xffffffff:0);assert.equal(W.enclosedMask(a,N,W.colorMask(32)).regions,1);
 const missing=Uint32Array.from(a,x=>x?0x7fffffff:0);assert.equal(W.enclosedMask(missing,N,W.colorMask(32)).regions,0);
 const w=new W.World(config({colors:32,criterion:'intersection',amplitude:0,thickness:.6,holdSteps:1}));w.surfaces.forEach(s=>{s.normal=[0,0,1];s.u=[1,0,0];s.v=[0,1,0];s.offset=0;});w.detect();assert(w.overlaps>0);w.surfaces[31].offset=10;w.detect();assert.equal(w.overlaps,0);
});
function born(){const w=new W.World(config({domainEnabled:true,criterion:'intersection',amplitude:0,thickness:.6,holdSteps:1,gravityStrength:2}));assert.equal(w.stats.internalTime,null);w.step();assert(w.domains.length);return w;}
test('Naissance centrale et horloge intérieure seulement après naissance',()=>{
 const w=born(),d=w.domains[0];assert.equal(d.internalTime,0);assert.equal(d.radius,w.config.minimumRadius);assert(d.captured.every(x=>x===0));assert.equal(w.events[0].type,'birth');assert.equal(w.stats.internalTime,0);w.step();assert.equal(d.internalTime,w.config.dt);
});
test('Capture égale, plafond local 50 % et bilan conservé',()=>{
 const w=born();steps(w,30);assert(w.contentBalance().captured>0);for(const d of w.domains)assert(d.captured.every(x=>Math.abs(x-d.captured[0])<1e-12));for(const surface of w.surfaces)assert(surface.content.every(x=>x>=.5-1e-12));assert(Math.abs(w.contentBalance().error)<1e-8);
});
test('Deux domaines concurrents ne recapturent pas la moitié restante',()=>{const w=born();w.createDomain(w.sources[0]);for(let i=0;i<600;i++)w.capture();for(const surface of w.surfaces)assert(surface.content.every(x=>x>=.5-1e-10));assert(Math.abs(w.contentBalance().error)<1e-8);});
test('Aucune capture ni déformation attractive à intensité zéro',()=>{
 const w=new W.World(config({domainEnabled:true,criterion:'intersection',amplitude:0,thickness:.6,holdSteps:1,gravityStrength:0}));steps(w,5);assert(w.domains.length);assert.equal(w.contentBalance().captured,0);assert.equal(w.stats.activeSources,0);assert(w.surfaces.every(s=>s.h.every(x=>x===0)));
});
test('Rupture : attraction coupée, contraction, contenu conservé',()=>{
 const w=born();w.step();for(const d of w.domains)w.breakDomain(d.id);const d=w.domains[0],r=d.radius,captured=w.contentBalance().captured;assert.equal(w.stats.activeSources,0);assert.equal(d.breakReason,'manual');w.step();assert(d.radius<r);assert.equal(w.contentBalance().captured,captured);assert(Math.abs(w.contentBalance().error)<1e-8);
});
test('La perte géométrique rompt les liaisons',()=>{const w=born();w.surfaces[0].offset=100;w.step();assert(w.domains.every(d=>d.phase==='broken'));assert(w.events.some(e=>e.reason==='loss-of-closure'));});
test('Rétrécissement terminé : résidu comptabilisé',()=>{const w=born();w.step();for(const d of w.domains)w.breakDomain(d.id);w.config.shrinkRate=10;for(let i=0;i<30;i++)w.domainEvolution();assert(w.domains.every(d=>d.phase==='remnant'&&d.radius===0));assert(w.contentBalance().captured>0);assert(Math.abs(w.contentBalance().error)<1e-8);});
test('Ancienne configuration v1 : migration sans ajout du cycle',()=>{const old=require('../audit-alignement/ondes-version1/sources/waves-engine.js').defaults(),w=new W.World(old);assert.equal(w.config.colors,4);assert.equal(w.config.version,2);assert.equal(w.config.domainEnabled,false);});
test('Export v2 : horloges, transferts et interventions conservés',()=>{const w=born();w.step();w.breakDomain(w.domains[0].id);const x=w.experiment();assert.equal(x.format,'wave-surfaces-v2');assert(x.events.some(e=>e.type==='break'));assert.equal(x.surfaces[0].content.length,144);assert(x.domains[0].internalTime>0);assert(Math.abs(x.contentBalance.error)<1e-8);});
console.log(passed+' scénarios validés.');
