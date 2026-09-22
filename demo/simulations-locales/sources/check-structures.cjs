'use strict';
const assert = require('node:assert/strict');
const A = require('./structures-engine.js');
let checked = 0;
function check(name, fn) { fn(); checked++; console.log('✓ ' + name); }
function empty(n = 32) {
  const c = A.defaults(n);
  c.initial.density = 0; c.life.enabled = false; c.motion.diffusion = 0;
  c.structures.bondProbability = 1; c.structures.loopProbability = 1;
  c.collisions.subtraction = 'never';
  return new A.World(c);
}
function add(w, xyz, parts, extra = {}) {
  const k = w.key(...xyz);
  w.cells.set(k, w.cell(k, [], {parts, ...extra})); w.refresh();
  return w.cells.get(k);
}
function loop(w, i) { const counts = w.vector(); counts[i] = 8; return {stage:3,counts}; }
check('Deux points voisins de même couleur forment une demi-corde', () => {
  const w=empty(); add(w,[4,4,4],[w.point(0)]); add(w,[5,4,4],[w.point(0)]);
  w.step(); assert.equal(w.stats.halves,1); assert.equal(w.stats.units,2); assert.equal(w.stats.strings,0);
});
check('Deux points de couleurs différentes ne forment pas une demi-corde', () => {
  const w=empty(); add(w,[4,4,4],[w.point(0)]); add(w,[5,4,4],[w.point(1)]);
  w.step(); assert.equal(w.stats.halves,0); assert.equal(w.cells.size,2);
});
check('Un seul niveau par génération, avec conservation des huit points', () => {
  const w=empty(); add(w,[4,4,4],Array.from({length:8},()=>w.point(0)));
  w.step(); assert.equal(w.stats.halves,4); assert.equal(w.stats.strings,0);
  w.step(); assert.equal(w.stats.strings,2); assert.equal(w.stats.loops,0);
  w.step(); assert.equal(w.stats.loops,1); assert.equal(w.stats.units,8);
});
for(const n of [10,11,26,32]) check(n+' positions : seules les boucles complètes condensent', () => {
  const w=empty(n), xyz=[4,4,4];const c=w.config;c.emergence.mode='palette';w.configure(c);
  let p=add(w,xyz,Array.from({length:n},(_,i)=>w.point(i))); assert.equal(p.condensed,false);
  p=add(w,xyz,Array.from({length:n-1},(_,i)=>loop(w,i))); assert.equal(p.condensed,false);
  p=add(w,xyz,Array.from({length:n},(_,i)=>loop(w,i))); assert.equal(p.condensed,true); assert.equal(p.source,true);
  assert.equal(p.loopCoverage,n);
});
check('Moyenne pondérée par les poids des structures', () => {
  const w=empty(); const c=w.config; c.palette[0].color='#FF0000';c.palette[1].color='#0000FF';w.configure(c);
  const p=add(w,[4,4,4],[w.point(0),loop(w,1)]);
  assert.deepEqual(p.rgb,[28,0,227]); assert.equal(p.mass,2.25);
});
check('Plusieurs sphères deviennent des sources indépendantes', () => {
  const w=empty(); const parts=Array.from({length:32},(_,i)=>loop(w,i));
  add(w,[3,3,3],parts);add(w,[12,12,12],parts);w.step();assert.equal(w.stats.sources,2);
});
check('La recette chromatique est facultative et respecte la position 32', () => {
  const w=empty();const c=w.config;c.gravity.trigger='color';c.gravity.requiredPositions=[32];c.gravity.tolerance=1;w.configure(c);
  let p=add(w,[4,4,4],[w.point(0)]);assert.equal(p.source,false);
  p=add(w,[4,4,4],[w.point(31)]);assert.equal(p.source,true);
  c.gravity.trigger='both';w.configure(c);w.refresh();assert.equal(p.source,false);
  c.gravity.trigger='either';w.configure(c);w.refresh();assert.equal(p.source,true);
  c.gravity.enabled=false;w.configure(c);w.refresh();assert.equal(p.source,false);
});
check('Attraction effective dans la portée et filtrage chromatique', () => {
  function scenario(spectralTolerance) {
    const w=empty();const c=w.config;c.gravity.trigger='color';c.gravity.tolerance=0;c.gravity.strength=30;
    c.gravity.spectralTolerance=spectralTolerance;c.palette[0].color='#000000';c.target='#000000';c.palette[1].color='#FFFFFF';w.configure(c);
    add(w,[4,4,4],[w.point(0)]);add(w,[6,4,4],[w.point(1)]);w.step();return w;
  }
  assert(scenario(1).cells.has(empty().key(5,4,4)));
  assert(scenario(.2).cells.has(empty().key(6,4,4)));
});
check('Addition conservatrice ; soustraction annule les positions communes et défait la boucle touchée', () => {
  const w=empty(),a=[loop(w,0)],b=[w.point(0),w.point(1)];
  assert.equal(w.counts(w.mergeParts(a,b,false)).reduce((a,b)=>a+b),10);
  const result=w.mergeParts(a,b,true),counts=w.counts(result);
  assert.equal(counts[0],7);assert.equal(counts[1],1);assert(result.every(p=>p.stage===0));
  assert.equal(w.mergeParts([w.point(0)],[w.point(0)],true).length,0);
});
check('Émission : transfert sans duplication et condensat persistant', () => {
  const w=empty();const c=w.config;c.condensation.requiredPositions=1;c.condensation.minimumLoops=1;c.condensation.persistent=true;c.emission.probability=1;w.configure(c);
  add(w,[4,4,4],[loop(w,0)]);w.step();assert.equal(w.stats.units,8);assert.equal(w.stats.emissions,1);assert.equal(w.stats.spheres,1);
});
check('Frontières fermées / périodiques et population vide', () => {
  const w=empty();assert.equal(w.neighbor(0,[-1,0,0]),null);w.step();assert.equal(w.stats.cells,0);
  const c=w.config;c.grid.boundary='wrap';w.configure(c);assert.equal(w.neighbor(0,[-1,0,0]),17);
});
check('Règles invalides refusées sans modifier la configuration active', () => {
  const w=empty(),before=JSON.stringify(w.config),c=JSON.parse(before);c.structures.pointsPerHalf=1;
  assert.throws(()=>w.configure(c));assert.equal(JSON.stringify(w.config),before);
  assert.throws(()=>A.validate({positions:1e9}));
  const unknown=JSON.parse(before);unknown.extra=1;assert.throws(()=>A.validate(unknown));
});
check('Graine reproductible et progression initiale des réglages par défaut', () => {
  const a=new A.World(),b=new A.World(); assert.equal(a.stats.halves,0);
  for(let i=0;i<3;i++){a.step();b.step();assert.deepEqual(a.stats,b.stats);assert.deepEqual([...a.cells],[...b.cells]);}
  assert(a.stats.halves>0);assert(a.stats.strings>0);assert(a.stats.loops>0);
});
check('X local : couleurs globales non exigées, voisins et frontières respectés', () => {
  const w=empty(), xyz=[0,4,4], k=w.key(...xyz);
  add(w,xyz,Array.from({length:4},()=>loop(w,0)));
  assert.equal(w.cells.get(k).configurationX,true);
  add(w,[1,4,4],[loop(w,1)]);assert.equal(w.cells.get(k).configurationX,false);
  w.cells.delete(w.key(1,4,4));add(w,[17,4,4],[loop(w,1)]);
  assert.equal(w.cells.get(k).configurationX,true);
  const c=w.config;c.grid.boundary='wrap';w.configure(c);w.refresh();
  assert.equal(w.cells.get(k).configurationX,false);
  c.emergence.mode='loop-count';w.configure(c);w.refresh();assert.equal(w.cells.get(k).configurationX,true);
});
check('Localité 6/26 : seule la présence de boucles chez les voisins compte', () => {
  const w=empty(),k=w.key(4,4,4);add(w,[4,4,4],Array.from({length:4},()=>loop(w,0)));
  add(w,[5,5,4],[loop(w,1)]);assert.equal(w.cells.get(k).configurationX,false);
  const c=w.config;c.grid.neighborhood=6;c.life.survival=[0,1,2,3,4,5,6];w.configure(c);w.refresh();
  assert.equal(w.cells.get(k).configurationX,true);
  add(w,[5,4,4],[w.point(1)]);assert.equal(w.cells.get(k).configurationX,true);
});
function precursor(strength=30) {
  const w=empty(),c=w.config;c.gravity.strength=strength;c.gravity.spectralTolerance=1;c.structures.bondProbability=0;c.condensation.minimumLoops=1;w.configure(c);
  const counts=w.vector();counts[0]=4;
  add(w,[4,4,4],[{stage:2,counts},{stage:2,counts}]);add(w,[6,4,4],[w.point(1)]);
  return w;
}
check('La gravité ne déplace le voisin qu’au pas suivant l’émergence de X', () => {
  const w=precursor();w.step();assert.equal(w.stats.configurations,1);assert.equal(w.stats.gravityMoves,0);
  assert(w.cells.has(w.key(6,4,4)));assert.equal(w.stats.newConfigurations,1);
  w.step();assert.equal(w.stats.gravityMoves,1);assert(w.cells.has(w.key(5,4,4)));
});
check('Intensité nulle : X apparaît, aucune source active ni déplacement gravitationnel', () => {
  const w=precursor(0);for(let i=0;i<5;i++){w.step();assert.equal(w.stats.sources,0);assert.equal(w.stats.gravityMoves,0);}
  assert.equal(w.stats.configurations,1);assert.equal(w.stats.eligible,1);assert(w.cells.has(w.key(6,4,4)));
  const c=w.config;c.gravity.strength=30;c.gravity.enabled=false;w.configure(c);w.refresh();w.step();
  assert.equal(w.stats.sources,0);assert.equal(w.stats.gravityMoves,0);
});
check('Multiplicateur nul : source admissible sans attraction active', () => {
  const w=precursor();const c=w.config;c.condensation.gravityMultiplier=0;w.configure(c);w.step();
  assert.equal(w.stats.configurations,1);assert.equal(w.stats.sources,0);w.step();assert.equal(w.stats.gravityMoves,0);
});
check('Perte de X : retrait du condensat et de sa gravité, sans verrou par défaut', () => {
  const w=precursor(0);w.step();const p=w.cells.get(w.key(4,4,4));
  p.parts=[w.point(0)];w.step();assert.equal(w.stats.configurations,0);assert.equal(w.stats.spheres,0);
  assert.equal(w.stats.lostConfigurations,1);assert.equal(w.stats.totalEmergences,1);
});
check('La mémoire optionnelle ne prolonge pas la source du déclencheur X', () => {
  const w=precursor(0);const c=w.config;c.condensation.persistent=true;c.gravity.strength=30;w.configure(c);w.step();
  w.cells.get(w.key(4,4,4)).parts=[w.point(0)];w.refresh();
  assert.equal(w.stats.spheres,1);assert.equal(w.stats.configurations,0);assert.equal(w.stats.sources,0);
});
check('Rayon : croissance, rappel après perturbation et contraction après perte de X', () => {
  const w=precursor(0);w.step();const key=w.key(4,4,4),first=w.cells.get(key);
  assert(first.envelopeRadius>0&&first.envelopeRadius<first.targetRadius);
  for(let i=0;i<60;i++)w.step();let p=w.cells.get(key);assert(Math.abs(p.envelopeRadius-p.targetRadius)<1e-5);
  p.envelopeRadius*=2;const enlarged=p.envelopeRadius;w.step();p=w.cells.get(key);assert(p.envelopeRadius<enlarged&&p.envelopeRadius>p.targetRadius);
  p.parts=[w.point(0)];const before=p.envelopeRadius;w.step();p=w.cells.get(key);assert.equal(p.targetRadius,0);assert(p.envelopeRadius<before);
});
check('Historique : apparitions, changements de règles et état aléatoire exportés', () => {
  const w=precursor(0);w.step();w.step();const c=JSON.parse(JSON.stringify(w.config));c.gravity.strength=3;w.configure(c);w.refresh();
  const e=w.experiment();assert.equal(e.history.length,3);assert.equal(e.current.totalEmergences,1);
  assert.equal(e.ruleHistory.at(-1).generation,2);assert.equal(e.ruleHistory.at(-1).config.gravity.strength,3);assert.equal(e.rngState,w.seed);
  e.config.gravity.strength=9;assert.equal(w.config.gravity.strength,3);
  w.reset();assert.equal(w.history.length,1);assert.equal(w.totalEmergences,0);assert.equal(w.ruleHistory.length,1);
});
check('Migration de règles v2 et validation stricte v4', () => {
  const old=require('../audit-alignement/version2/regles-automate.json'),c=A.validate(old);
  assert.equal(c.version,4);assert.equal(c.emergence.mode,'palette');assert.equal(c.condensation.persistent,true);assert.equal(c.radial.enabled,false);assert.equal(c.display.condensateStyle,'envelope');
  const bad=A.defaults();bad.emergence.mode='inventé';assert.throws(()=>A.validate(bad));
  const zero=A.defaults();zero.radial.rate=0;assert.throws(()=>A.validate(zero));
  const w=empty(),before=JSON.stringify(w.config),grid=JSON.parse(before);grid.grid.size=9;assert.throws(()=>w.configure(grid));assert.equal(JSON.stringify(w.config),before);
});
check('Une rupture contrôlée conserve le contenu, retire X et laisse une trace distincte',()=>{
  const w=precursor(0);w.step();const key=w.key(4,4,4),before=w.stats.units,rng=w.seed;
  w.perturb(key);assert.equal(w.stats.units,before);assert.equal(w.stats.configurations,0);assert.equal(w.seed,rng);
  assert.equal(w.interventions.length,1);assert.equal(w.generation,1);assert.equal(w.stats.totalEmergences,1);
  assert.equal(w.episodes[0].endReason,'intervention');assert.equal(w.episodes[0].rightCensored,true);
  assert.throws(()=>w.perturb(key));assert.equal(w.interventions.length,1);
});
check('Rupture puis réassemblage : X peut revenir sans naissances ni apport',()=>{
  const w=precursor(0);w.step();const key=w.key(4,4,4),units=w.stats.units;w.perturb(key);
  for(let i=0;i<3;i++)w.step();assert.equal(w.stats.configurations,1);assert.equal(w.stats.units,units);
  assert.equal(w.stats.totalEmergences,2);assert.equal(w.stats.balanceError,0);
});
check('Rupture stochastique : les boucles deviennent des points sans perte',()=>{
  const w=empty(),c=w.config;c.breakup.probability=1;c.structures.bondProbability=0;w.configure(c);
  add(w,[4,4,4],[loop(w,0),loop(w,1)]);w.step();assert.equal(w.stats.units,16);
  assert.equal(w.stats.points,16);assert.equal(w.stats.loops,0);assert.equal(w.stats.breakups,2);assert.equal(w.stats.balanceError,0);
});
check('Émission de structure : boucle transférée intacte et réserve respectée',()=>{
  const w=empty(),c=w.config;c.condensation.minimumLoops=1;c.emission.probability=1;c.emission.mode='structure';c.structures.bondProbability=0;w.configure(c);
  add(w,[4,4,4],[loop(w,0),loop(w,0)]);w.step();assert.equal(w.stats.units,16);assert.equal(w.stats.loops,2);
  assert.equal(w.stats.emittedStructures,1);assert.equal(w.stats.cells,2);assert.equal(w.stats.balanceError,0);
  const lone=empty(),d=lone.config;d.condensation.minimumLoops=1;d.emission.probability=1;d.emission.mode='structure';lone.configure(d);
  add(lone,[4,4,4],[loop(lone,0)]);lone.step();assert.equal(lone.stats.emissions,0);assert.equal(lone.stats.units,8);
});
check('Émission entière sans réserve : une cellule peut se vider sans perdre sa boucle',()=>{
  const w=empty(),c=w.config;c.condensation.minimumLoops=1;c.emission.probability=1;c.emission.mode='structure';c.emission.reserveEachPosition=false;w.configure(c);
  add(w,[4,4,4],[loop(w,0)]);w.step();assert.equal(w.stats.units,8);assert.equal(w.stats.loops,1);
  assert(!w.cells.has(w.key(4,4,4)));assert.equal(w.stats.balanceError,0);
});
check('Le bilan explique les naissances et les disparitions',()=>{
  const w=empty(),c=w.config;c.life.enabled=true;c.life.birth=[1];c.life.survival=[];c.structures.bondProbability=0;w.configure(c);
  add(w,[4,4,4],[loop(w,0)]);w.step();assert.equal(w.stats.unitsBorn,26);assert.equal(w.stats.unitsDied,8);
  assert.equal(w.stats.units,26);assert.equal(w.stats.balanceError,0);
});
check('Le bilan explique les annulations et plafonnements en collision',()=>{
  for(const subtraction of ['any','never']){
    const w=empty(),c=w.config;c.colors.amplitudeLimit=10;c.collisions.subtraction=subtraction;c.collisions.probability=1;w.configure(c);
    add(w,[4,4,4],[loop(w,0)]);add(w,[5,4,4],[loop(w,0)]);w.step();
    assert.equal(w.stats.balanceError,0);assert.equal(w.stats.units,subtraction==='any'?0:10);
    assert.equal(w.stats.unitsCancelled,subtraction==='any'?16:0);assert.equal(w.stats.unitsClipped,subtraction==='never'?6:0);
  }
});
check('Les épisodes distinguent disparition, observation incomplète et réglage',()=>{
  const w=precursor(0);w.step();w.step();assert.equal(w.stats.longestXAge,1);
  const c=JSON.parse(JSON.stringify(w.config));c.breakup.probability=1;w.configure(c);w.refresh();
  assert.equal(w.episodes[0].endReason,'rules');assert.equal(w.episodes[0].rightCensored,true);
  assert.equal(w.episodes[1].leftCensored,true);w.step();assert.equal(w.episodes[1].endReason,'lost');
  assert.equal(w.episodes[1].rightCensored,false);assert.equal(w.episodes[1].duration,1);
  assert.equal(w.experiment().scope.photonPropagation,false);
});
check('L’affichage des constituants ou de l’enveloppe ne change pas la trajectoire',()=>{
  const ca=A.defaults(10),cb=JSON.parse(JSON.stringify(ca));cb.display.condensateStyle='envelope';
  ca.grid.size=cb.grid.size=8;ca.gravity.radius=cb.gravity.radius=4;
  const a=new A.World(ca),b=new A.World(cb);for(let i=0;i<12;i++){a.step();b.step();assert.deepEqual([...a.cells],[...b.cells]);assert.equal(a.seed,b.seed);}
});
check('Migration v3 : trajectoire historique conservée, règles nouvelles inactives',()=>{
  const oldA=require('../audit-alignement/version3/sources/structures-engine.js');
  const c=oldA.defaults(10);c.grid.size=8;c.gravity.radius=4;
  const old=new oldA.World(c),current=new A.World(c);
  for(let i=0;i<20;i++){old.step();current.step();assert.deepEqual([...current.cells],[...old.cells]);assert.equal(current.seed,old.seed);}
  assert.equal(current.config.initial.shape,'sphere');assert.equal(current.config.breakup.probability,0);
});
check('Bilan nul avec naissances, pertes, émissions et ruptures sur plusieurs graines',()=>{
  for(const seed of [1,2,728931]){
    const c=A.defaults(10);c.seed=seed;c.grid.size=8;c.gravity.radius=4;c.condensation.minimumLoops=1;c.emergence.mode='loop-count';
    c.breakup.probability=.05;c.emission.probability=.5;c.emission.mode='structure';c.emission.reserveEachPosition=false;c.colors.amplitudeLimit=12;
    const w=new A.World(c);for(let i=0;i<40;i++){w.step();assert.equal(w.stats.balanceError,0);}
  }
});
console.log(checked+' scénarios validés.');
