'use strict';
// Audit du moteur existant : aucune règle de simulation n'est modifiée.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const folder = path.resolve(__dirname, 'version2');
const A = require(path.join(folder, 'sources/structures-engine.js'));
const clone = x => JSON.parse(JSON.stringify(x));
const sha256 = x => crypto.createHash('sha256').update(x).digest('hex');
const checks = [];
function check(name, fn) { fn(); checks.push(name); }
const html = fs.readFileSync(path.join(folder, 'automate-3d.html'), 'utf8');
const hashes = {};
for (const name of ['structures-engine.js', 'automate-app.js']) {
  const content = fs.readFileSync(path.join(folder, 'sources', name), 'utf8');
  hashes[name] = sha256(content);
  check('Le HTML embarque exactement ' + name, () => assert(html.includes(content)));
}
hashes['automate-3d.html'] = sha256(html);

const zeroConfig = A.defaults(); zeroConfig.gravity.strength = 0;
const offConfig = clone(zeroConfig); offConfig.gravity.enabled = false;
const positiveConfig = A.defaults();
const configs = {intensite_zero: zeroConfig, gravite_desactivee: offConfig, intensite_trois: positiveConfig};
const worlds = Object.fromEntries(Object.entries(configs).map(([name,c]) => [name, new A.World(c)]));
const logs = Object.fromEntries(Object.keys(worlds).map(name => [name, {
  configuration: clone(configs[name]), premiere_sphere: null, naissances_cumulees: 0,
  snapshots: [clone(worlds[name].stats)]
}]));
const checkpoints = new Set([1,10,25,50,100]);
let firstSphere = null;
for (let generation = 1; generation <= 100; generation++) {
  for (const [name,w] of Object.entries(worlds)) {
    w.step(); const log = logs[name];
    log.naissances_cumulees += w.stats.births;
    if (w.stats.spheres && log.premiere_sphere === null) log.premiere_sphere = generation;
    if (checkpoints.has(generation)) log.snapshots.push(clone(w.stats));
  }
  const zero = worlds.intensite_zero, off = worlds.gravite_desactivee;
  const stripped = w => [...w.cells].map(([key,c]) => {const p=clone(c);delete p.source;return [key,p];});
  // Sous le déclencheur sphere, le statut condensed maintient aussi l'ancrage.
  assert.deepEqual(stripped(zero), stripped(off));
  assert.equal(zero.seed, off.seed);
  assert.equal(zero.stats.sources, zero.stats.spheres);
  assert.equal(off.stats.sources, 0);
  if (firstSphere === null) {
    assert.deepEqual([...zero.cells], [...worlds.intensite_trois.cells]);
    assert.equal(zero.seed, worlds.intensite_trois.seed);
    if (zero.stats.spheres) firstSphere = generation;
  }
}
checks.push('Même trajectoire à intensité zéro et gravité désactivée, hors étiquette source, sur 100 générations avec les autres défauts');
checks.push('À intensité zéro, foyers = sphères ; désactivation : foyers = 0');
check('Les intensités 0 et 3 produisent le même état jusqu’à la première sphère incluse', () => assert(firstSphere !== null));
check('Formation effective de sphères sans attraction', () => assert(worlds.intensite_zero.stats.spheres > 0));
check('Augmentation des unités constitutives sans attraction', () => assert(worlds.intensite_zero.stats.units > logs.intensite_zero.snapshots[0].units));

// Contre-épreuve isolée : perte de la structure d'un condensat préexistant.
const c = A.defaults(); c.initial.density=0; c.life.enabled=false;
c.gravity.strength=0; c.motion.diffusion=0; c.structures.bondProbability=0;
const isolated = new A.World(c), key=isolated.key(4,4,4);
isolated.cells.set(key, isolated.cell(key, [], {parts:[isolated.point(0)], condensed:true}));
isolated.refresh(); isolated.step();
const persistent = clone(isolated.stats);
check('Le drapeau persistant conserve une sphère avec un point et aucune boucle', () => {
  assert.equal(persistent.spheres,1); assert.equal(persistent.units,1); assert.equal(persistent.loops,0);
});
const noPersistence = clone(c); noPersistence.condensation.persistent=false;
isolated.configure(noPersistence); isolated.refresh();
check('Sans persistance, le même contenu perd immédiatement son statut sphère', () => assert.equal(isolated.stats.spheres,0));

const result = {
  protocole: 'Audit conditionnel des valeurs par défaut, graine 728931, 32 positions ; pas une reproduction du relevé utilisateur à 11060 générations.',
  source_sha256: hashes, controles: checks,
  premiere_sphere_identique_intensites_0_et_3: firstSphere,
  experiences: logs, contre_epreuve_persistance: {avec: persistent, sans: clone(isolated.stats)}
};
fs.writeFileSync(path.join(__dirname, 'verification.json'), JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({controles: checks.length, premiere_sphere: firstSphere,
  resultats: Object.fromEntries(Object.entries(worlds).map(([name,w])=>[name,w.stats]))},null,2));
