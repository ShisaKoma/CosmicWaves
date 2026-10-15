'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),W=require('./waves-engine.js');
const destination=process.argv[2]||path.join(__dirname,'../comparaison-ondes.json');
const runs=[];
function run(patch,label){const config={...W.defaults(),...patch},w=new W.World(config);for(let i=0;i<100;i++)w.step();const first=w.history.find(x=>x.aggregates>0),summary={label,seed:config.seed,criterion:config.criterion,detectorResolution:config.detectorResolution,gravityEnabled:config.gravityEnabled,firstAggregateStep:first?.generation??null,maxAggregates:Math.max(...w.history.map(x=>x.aggregates)),maxQualifiedVoxels:Math.max(...w.history.map(x=>x.qualifiedVoxels))};runs.push({summary,config,history:w.history});console.log(JSON.stringify(summary));}
for(const criterion of ['enclosure','intersection'])for(const seed of [728931,2,3])run({criterion,seed},'Comparaison de critères et graines');
for(const detectorResolution of [12,16,24])run({seed:2,detectorResolution},'Sensibilité à la grille de détection');
run({seed:2,gravityEnabled:false},'Témoin sans attraction');
fs.writeFileSync(destination,JSON.stringify({format:'wave-comparison-v1',engineSHA256:crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'waves-engine.js'))).digest('hex'),duration:2,steps:100,note:'Essais exploratoires, sans sélection des seuls succès. La fermeture est discrète, sensible à l’épaisseur et à la grille. Aucun taux cosmologique estimé.',runs},null,2)+'\n');
