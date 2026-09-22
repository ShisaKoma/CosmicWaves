'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),W=require('./waves-engine.js');
const destination=process.argv[2]||path.join(__dirname,'../comparaison-ondes-v2.json');
const runs=[];
for(const colors of [10,11,26,32])for(const initialLayout of ['random','prepared']){
 const config={...W.defaults(),colors,initialLayout,...(initialLayout==='prepared'?{amplitude:.02,detectorResolution:24}:{})},w=new W.World(config);
 for(let i=0;i<60;i++)w.step();
 const first=w.history.find(x=>x.domainsBorn>0),summary={colors,initialLayout,firstBirth:first?.generation??null,domainsBorn:w.domains.length,capturedContent:w.stats.capturedContent,maxBalanceError:Math.max(...w.history.map(x=>Math.abs(x.contentBalanceError)))};
 runs.push({summary,config,history:w.history,events:w.events,domains:w.domains,contentBalance:w.contentBalance()});console.log(JSON.stringify(summary));
}
fs.writeFileSync(destination,JSON.stringify({format:'wave-comparison-v2',engineSHA256:crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'waves-engine.js'))).digest('hex'),steps:60,calculationInterval:1.2,note:'Disposition préparée = témoin construit pour faciliter une fermeture, pas un succès spontané. Horloges intérieures conventionnelles, non métriques. Bilan de contenu abstrait, non énergétique.',runs},null,2)+'\n');
