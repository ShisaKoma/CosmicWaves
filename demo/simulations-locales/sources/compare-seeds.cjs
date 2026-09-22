'use strict';
// node sources/compare-seeds.cjs [règles.json] [graines séparées par virgules] [générations] [résultat.json]
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const A=require('./structures-engine.js');
const [rulesFile,seedsText='728931,2,3',generationsText='40',output]=process.argv.slice(2);
try {
  const base=rulesFile?A.validate(JSON.parse(fs.readFileSync(rulesFile,'utf8'))):A.defaults();
  const seeds=seedsText.split(',').map(Number),generations=Number(generationsText);
  if(!seeds.length||seeds.length>100||new Set(seeds).size!==seeds.length||seeds.some(s=>!Number.isInteger(s)||s<1||s>4294967295))throw Error('Choisir 1 à 100 graines distinctes, entières de 1 à 4294967295.');
  if(!Number.isInteger(generations)||generations<1||generations>10000)throw Error('Choisir 1 à 10000 générations.');
  const runs=[];
  for(const seed of seeds){
    const config=JSON.parse(JSON.stringify(base));config.seed=seed;const world=new A.World(config);
    let firstX=null,maxX=0,firstDomain=null,maxDomains=0,totalBreakups=0,totalEmittedStructures=0;
    for(let i=0;i<generations;i++){
      const s=world.step();if(s.configurations&&firstX===null)firstX=s.generation;
      if(s.domains&&firstDomain===null)firstDomain=s.generation;maxDomains=Math.max(maxDomains,s.domains);maxX=Math.max(maxX,s.configurations);totalBreakups+=s.breakups;totalEmittedStructures+=s.emittedStructures;
    }
    runs.push({seed,firstDomain,maxDomains,branes:world.branes.export(),firstX,maxX,totalBreakups,totalEmittedStructures,final:world.stats,history:world.history,episodes:world.episodes});
    console.log(`Graine ${seed} : premier X ${firstX===null?'non observé':firstX}, maximum X ${maxX}, premier domaine ${firstDomain??"non observé"}, maximum domaines ${maxDomains}, bilan final ${world.stats.balanceError}.`);
  }
  const destination=output||path.join(__dirname,'../comparaison-graines.json');
  const report={format:'chromatic-seed-comparison-v2',sourceSHA256:Object.fromEntries(['structures-engine.js','local-branes.js','waves-geometry.js'].map(name=>[name,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,name))).digest('hex')])),engineSHA256:crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'structures-engine.js'))).digest('hex'),baseConfig:base,seeds,generations,runs,note:'Graines choisies pour comparaison, pas un échantillon cosmologique. null = aucun X / domaine observé pendant la fenêtre, pas impossibilité. Épisodes par site, sans identité d’objet. Temps en générations.'};
  fs.writeFileSync(destination,JSON.stringify(report,null,2)+'\n');console.log('Résultat : '+destination);
}catch(error){console.error(error.message);process.exitCode=1;}
