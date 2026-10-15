'use strict';
const A=require('./structures-engine.js'),assert=require('node:assert/strict');
let passed=0;const check=(name,f)=>{f();passed++;console.log('✓ '+name);};
function fixture(n=10,central=0){const c=A.defaults(n);c.initial.density=0;c.motion.diffusion=0;c.branes.centralBranes=central;return new A.World(c);}
function steps(w,n){for(let i=0;i<n;i++)w.step();}
for(let central=0;central<=3;central++)check('Fermeture à '+central+' cloisons : '+2**central+' cavités, capture partagée conservatrice',()=>{
 const w=fixture(10,central);w.forceEmergence();const total=w.stats.units;
 assert.equal(w.branes.diagnostic.closed,2**central);assert.equal(w.branes.diagnostic.score,0);
 steps(w,2);assert.equal(w.stats.domains,0);assert.equal(w.stats.captured,0);
 w.step();assert.equal(w.stats.domains,2**central);assert.equal(w.stats.captured,0);assert(w.branes.active().every(d=>w.generation-d.born===0));
 w.step();assert.equal(w.stats.captured,total/2);assert.equal(w.stats.units,total);
 steps(w,12);assert.equal(w.stats.captured,total/2);assert.equal(w.stats.stableDomains,2**central);assert.equal(w.stats.domainEmergences,0);assert.equal(w.stats.forcedDomains,2**central);
 assert(w.branes.active().every(d=>d.captureDone));assert.equal(w.stats.balanceError,0);
});
check('La couleur 32 participe à la fermeture ; absence de couleur interdit la naissance',()=>{
 const w=fixture(32);w.forceEmergence();assert(w.branes.diagnostic.coverage);
 for(const [k,p]of w.cells){p.parts=p.parts.filter(q=>!q.counts[31]);if(!p.parts.length)w.cells.delete(k);}w.refresh();steps(w,4);assert.equal(w.stats.domains,0);
});
check('Couleur manquante sur une coque fermée : fermeture ne suffit pas',()=>{
 const w=fixture();w.forceEmergence();for(const p of w.cells.values())p.parts=p.parts.map(()=>w.point(0));w.refresh();assert.equal(w.branes.diagnostic.closed,1);assert.equal(w.branes.diagnostic.coverage,false);steps(w,4);assert.equal(w.stats.domains,0);
});
check('Décalage : E autorise la naissance, S peut refuser la stabilité',()=>{
 const w=fixture(10,1),c=w.config;c.branes.asymmetry=.5;c.branes.emergenceTolerance=1;c.branes.stabilityTolerance=0;w.configure(c);w.forceEmergence();steps(w,16);assert.equal(w.stats.domains,2);assert(w.branes.diagnostic.score>0);assert.equal(w.stats.stableDomains,0);
 const before=w.stats.units,changed=structuredClone(w.config);changed.branes.emergenceTolerance=0;w.configure(changed);w.refresh();steps(w,4);assert.equal(w.stats.domains,0);assert.equal(w.stats.units,before);
});
check('Sans attraction, fermeture et horloge existent mais aucune capture',()=>{
 const w=fixture(),c=w.config;c.gravity.strength=0;w.configure(c);w.forceEmergence();steps(w,5);assert.equal(w.stats.domains,1);assert.equal(w.stats.sources,0);assert.equal(w.stats.captured,0);
});
check('Brèche : source retirée, enveloppe contractée, réserve conservée',()=>{
 const w=fixture();w.forceEmergence();steps(w,5);const total=w.stats.units,d=w.branes.active()[0],r=d.radius,captured=w.stats.captured;
 w.openBreach();w.step();assert.equal(w.stats.sources,0);assert.equal(w.stats.domains,0);assert(d.radius<r);assert.equal(w.stats.captured,captured);assert.equal(w.stats.units,total);assert.equal(w.stats.balanceError,0);
});
check('Forçage répété : budgets non doublés, injection tracée, aucun taux spontané',()=>{
 const w=fixture();w.forceEmergence();steps(w,5);const total=w.stats.units,cap=w.stats.captured,e=w.forceEmergence();assert.equal(w.stats.units,total+e.added);steps(w,5);assert.equal(w.stats.captured,cap);assert.equal(w.stats.domainEmergences,0);
});
check('Partage impair : reste discret sur les surfaces, bilan exact',()=>{
 const w=fixture();w.forceEmergence();for(const p of w.cells.values())p.parts.push(structuredClone(p.parts[0]));w.refresh();const total=w.stats.units;steps(w,4);assert.equal(w.stats.captured,total/3);assert.equal(w.stats.units,total);
});
check('Attraction seulement après naissance, pas de filtre RGB des domaines',()=>{
 const w=fixture();w.forceEmergence();steps(w,3);const c=w.config;c.gravity.radius=18;c.gravity.strength=30;c.structures.bondProbability=0;c.gravity.spectralTolerance=0;w.configure(c);w.refresh();const k=w.key(1,9,9);w.cells.set(k,w.cell(k,[],{parts:[w.point(5)]}));w.refresh();w.step();assert(w.stats.gravityMoves>0);assert.equal(w.stats.balanceError,0);
});
check('Validation, migration v4 et entrée numérique 2–32',()=>{
 for(const n of [2,7,10,11,26,32])assert.equal(A.validate(A.defaults(n)).positions,n);
 for(const n of [1,33,2.5])assert.throws(()=>A.validate(A.defaults(n)));
 const c=A.defaults();c.branes.stabilityTolerance=.9;assert.throws(()=>A.validate(c));
 const old=require('../audit-alignement/version4/regles-automate.json');assert.equal(A.validate(old).emergence.mode,'local-complete');
});
check('Reproductibilité et bilan avec population ambiante',()=>{
 const a=new A.World(),b=new A.World();a.forceEmergence();b.forceEmergence();steps(a,8);steps(b,8);assert.deepEqual(a.experiment(),b.experiment());assert(a.interventions[0].displaced.some(Boolean));assert.equal(a.stats.balanceError,0);
 a.reset();assert.equal(a.stats.captured,0);assert.equal(a.branes.domains.length,0);assert.equal(a.interventions.length,0);
});
console.log(passed+' scénarios des branes locales validés.');
