'use strict';
const assert=require('node:assert/strict'),W=require('./waves-engine.js'),I=require('./waves-illustration.js');
let passed=0;function test(name,f){f();console.log('OK '+name);passed++;}
const world=()=>new W.World({...W.defaults(),resolution:12,detectorResolution:8});
test('Le cycle ne modifie ni les ondes ni leur bilan',()=>{const w=world(),before=JSON.stringify(w.experiment()),a=new I.Sequence(w);a.step(12);assert.equal(JSON.stringify(w.experiment()),before);});
test('Fermeture parfaite puis agrégation et expansion',()=>{const a=new I.Sequence(world());assert.equal(a.phase,'fermeture');a.step(2);assert.equal(a.phase,'agregation');for(const p of a.particles)assert(Math.abs(Math.hypot(...a.position(p).map((x,i)=>x-a.center[i]))-.65)<1e-12);a.step(3);assert.equal(a.phase,'expansion');assert(Math.abs(a.radius-.16)<1e-12);a.step(7);assert.equal(a.phase,'terminee');assert(Math.abs(a.radius-2.05)<1e-12);});
test('Conservation du partage local et respect du plancher 50 %',()=>{const w=world();for(const s of w.surfaces)s.content.fill(.7);const a=new I.Sequence(w);assert(Math.abs(a.localContent-a.capturedContent-a.remainingContent)<1e-12);assert(a.particles.every(p=>Math.abs(p.captured-.2)<1e-12));});
test('Quatre palettes, même nombre de points par surface',()=>{for(const colors of [10,11,26,32]){const a=new I.Sequence(new W.World({...W.defaults(),colors,resolution:12,detectorResolution:8})),counts=Array(colors).fill(0);a.particles.forEach(p=>counts[p.surface]++);assert(counts.every(c=>c===counts[0]));assert.equal(new Set(a.particles.map(p=>p.color)).size,colors);}});
test('Durée bornée et export explicitement forcé',()=>{const a=new I.Sequence(world());assert.throws(()=>a.step(-1));assert.throws(()=>a.step(NaN));a.step(100);assert.equal(a.elapsed,12);const e=a.export();assert(e.forced);assert.equal(e.phase,'terminee');assert(e.particles.length);});
test('Déformation réservée aux portions sélectionnées',()=>{const a=new I.Sequence(world()),p=[1,2,3];a.step(5);assert.deepEqual(a.deform(p,-1,0),p);assert.notDeepEqual(a.deform(p,a.particles[0].surface,a.particles[0].k),p);});
console.log(passed+' contrôles de la séquence forcée validés.');
