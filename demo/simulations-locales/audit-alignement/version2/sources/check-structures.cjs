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
  const w=empty(n), xyz=[4,4,4];
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
  const w=empty();const c=w.config;c.condensation.requiredPositions=1;c.condensation.minimumLoops=1;c.emission.probability=1;w.configure(c);
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
console.log(checked+' scénarios validés.');
