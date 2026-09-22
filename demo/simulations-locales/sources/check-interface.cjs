'use strict';
// Tests hors navigateur : faux DOM minimal, aucun rendu ni ouverture d'URL.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const A=require('./structures-engine.js');
const html=fs.readFileSync(__dirname+'/automate.html','utf8');
const elements=new Map(),downloads=[];
class Element {
  set value(v){this._value=String(v);} get value(){return this._value;}
  constructor(tag='div'){this.tagName=tag;this.value='';this.children=[];this.dataset={};this.listeners={};this.hidden=false;this.checked=false;this.clientWidth=960;this.isConnected=true;this.style={};}
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.children=[...children];}
  setAttribute(name,value){this[name]=value;}
  addEventListener(name,fn){this.listeners[name]=fn;}
  click(){return this.listeners.click?.({target:this});}
  querySelector(selector){
    if(selector.startsWith('#')){const element=elements.get(selector.slice(1));assert(element,'ID manquant : '+selector);return element;}
    const m=selector.match(/^\[data-position-(color|required)="(\d+)"\]$/);assert(m,'Sélecteur inattendu : '+selector);
    const key=m[1]==='color'?'positionColor':'positionRequired';
    const visit=e=>e?.dataset&&String(e.dataset[key])===m[2]?e:e?.children?.map(visit).find(Boolean);
    return visit(this);
  }
}
for(const m of html.matchAll(/<([a-z]+)\b[^>]*\bid="([^"]+)"[^>]*>/g)){
  assert(!elements.has(m[2]),'ID dupliqué : '+m[2]);elements.set(m[2],new Element(m[1]));
}
const root=elements.get('vie-chromatique');root.children=[...elements.values()].filter(e=>e!==root);
const ctx=new Proxy({}, {get(target,key){return key==='createRadialGradient'?()=>({addColorStop(){}}):()=>{};},set(){return true;}});
elements.get('v-canvas').getContext=()=>ctx;
const document={hidden:false,documentElement:new Element(),getElementById:id=>elements.get(id),createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text})};
const sandbox={ChromaticLife:A,document,performance:{now:()=>0},matchMedia:()=>({matches:false}),
  ResizeObserver:class{observe(){}},MutationObserver:class{observe(){}},requestAnimationFrame(){},
  getComputedStyle:()=>({color:'#ffffff'}),devicePixelRatio:1,Blob,
  URL:{createObjectURL(blob){downloads.push(blob);return 'test-export';},revokeObjectURL(){}},setTimeout(){}};
vm.runInNewContext(fs.readFileSync(__dirname+'/automate-app.js','utf8'),sandbox);
const get=id=>elements.get('v-'+id);
let checked=0;
function check(name,fn){fn();checked++;console.log('✓ '+name);}
check('Initialisation : tous les contrôles référencés existent et les défauts sont visibles',()=>{
  assert.equal(get('mode').value,'geometry');assert.equal(get('persistent').checked,false);
  assert.equal(get('protect').checked,false);assert.equal(get('condensation').disabled,true);
  assert.match(get('stats').textContent,/0 foyers actifs/);assert.match(get('applied').textContent,/intensité 3/);
  assert.equal(get('condensate-style').value,'strands');assert.equal(get('initial-shape').value,'cube');assert.match(get('balance').textContent,/Écart inexpliqué : 0/);
});
check('Forçage, capture, expansion séparée, retour et brèche',()=>{
  get('force').click();assert.equal(get('error').hidden,true);
  for(let i=0;i<4;i++)get('step').click();assert.match(get('domains').textContent,/2 domaines nés/);assert.equal(get('expansion').disabled,false);
  const before=get('stats').textContent;get('expansion').click();assert.equal(get('return').hidden,false);assert.equal(get('stats').textContent,before);
  get('return').click();assert.equal(get('return').hidden,true);assert.equal(get('stats').textContent,before);
  get('breach').click();get('step').click();assert.equal(get('error').hidden,true);assert.match(get('balance').textContent,/Écart inexpliqué : 0/);
});
check('Une nouvelle graine exige une nouvelle population ; les nouveaux réglages sont appliqués',()=>{
  const before=root.dataset.generation;get('seed').value='123';get('apply').click();assert.equal(root.dataset.generation,before);assert.equal(get('error').hidden,false);
  get('breakup').value='0.1';get('emission-mode').value='structure';get('new-population').click();
  assert.equal(root.dataset.generation,0);assert.equal(get('error').hidden,true);
  const c=JSON.parse(get('json').value);assert.equal(c.seed,123);assert.equal(c.breakup.probability,.1);assert.equal(c.emission.mode,'structure');
});
check('Une perturbation sans sélection ne modifie pas la population',()=>{
  const before=root.dataset.generation;get('perturb').click();assert.equal(root.dataset.generation,before);assert.equal(get('error').hidden,false);
});
check('Appliquer zéro conserve la population et met à jour les valeurs appliquées',()=>{
  get('step').click();const generation=root.dataset.generation;
  get('strength').value='0';get('apply').click();assert.equal(root.dataset.generation,generation);
  assert.match(get('applied').textContent,/intensité 0/);
  for(let i=0;i<5;i++)get('step').click();assert.equal(root.dataset.sources,0);assert.equal(root.dataset.gravityMoves,0);
});
check('Mode historique : activation du seuil de couverture et reclassification',()=>{
  get('mode').value='palette';get('mode').listeners.change();assert.equal(get('condensation').disabled,false);
  get('apply').click();assert.equal(JSON.parse(get('json').value).emergence.mode,'palette');
});
check('JSON invalide : erreur visible sans réinitialiser la population',()=>{
  const generation=root.dataset.generation;get('json').value='{"version":3}';get('json-apply').click();
  assert.equal(get('error').hidden,false);assert.equal(root.dataset.generation,generation);
});
check('Import JSON v2 et changement de palette : nouvelle population sans erreur',()=>{
  get('json').value=fs.readFileSync(__dirname+'/../audit-alignement/version2/regles-automate.json','utf8');get('json-apply').click();
  assert.equal(get('error').hidden,true);assert.equal(root.dataset.generation,0);assert.equal(get('mode').value,'palette');
  get('positions').value='10';get('positions').listeners.change();assert.equal(get('error').hidden,true);
  assert.equal(JSON.parse(get('json').value).positions,10);assert.equal(root.dataset.generation,0);
});
(async()=>{
  get('step').click();get('experiment').click();const data=JSON.parse(await downloads.at(-1).text());
  assert.equal(data.format,'chromatic-experiment-v5');assert.equal(data.history.length,2);assert.equal(data.config.positions,10);assert(Array.isArray(data.episodes));assert.equal(data.scope.bosonDynamics,false);
  checked++;console.log('✓ Export de l’expérience : contenu et historique présents');
  console.log(checked+' scénarios d’interface hors navigateur validés (aucune vérification visuelle).');
})().catch(e=>{console.error(e);process.exitCode=1;});
