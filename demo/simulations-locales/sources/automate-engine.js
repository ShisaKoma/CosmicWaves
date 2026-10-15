/* Automate chromatique 3D. Modèle visuel, sans calibration physique. */
(function (global) {
  'use strict';
  const TYPES = ['demi-corde','corde','boucle'];
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const clone=x=>JSON.parse(JSON.stringify(x));
  const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
  const hex=channels=>'#'+channels.map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('').toUpperCase();
  const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])/(255*Math.sqrt(3));
  function palette(n,target='#8B5CF6') {
    const values=[{color:target,type:TYPES[0]}];
    for(let i=1;i<n;i++) {
      const h=i/n*6,k=Math.floor(h),f=h-k,a=48,b=224,t=Math.round(a+(b-a)*f),q=272-t;
      const colors=[[b,t,a],[q,b,a],[a,b,t],[a,q,b],[t,a,b],[b,a,q]];
      values.push({color:hex(colors[k%6]),type:TYPES[i%3]});
    }
    return values;
  }
  function defaults(n=32) {
    return {version:1,positions:n,target:'#8B5CF6',seed:728931,
      grid:{size:18,boundary:'closed',neighborhood:26},
      initial:{density:0.12,shape:'sphere'},ticksPerSecond:2,
      palette:palette(n),weights:{'demi-corde':0.5,corde:1,boucle:2},
      life:{enabled:true,birth:[3,4],survival:[1,2,3,4,5,6,7,8],inheritance:'union',protectCondensates:true},
      colors:{addition:'average',amplitudeLimit:32},
      collisions:{subtraction:'opposed',probability:0.25},
      gravity:{enabled:true,tolerance:0.09,minimumPositions:1,requiredPositions:[],strength:3,radius:6,softening:1,spectralTolerance:0.45},
      motion:{diffusion:0.12},condensation:{requiredPositions:n,persistent:true,gravityMultiplier:2},
      emission:{probability:0,reserveEachPosition:true,freeSteps:5}};
  }
  function validate(input) {
    if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Les règles doivent être un objet JSON.');
    if(![26,32].includes(input.positions))throw Error('positions doit valoir 26 ou 32.');
    const c=clone(input),base=defaults(c.positions);
    function sameKeys(a,b,path){
      if(!a||typeof a!=='object'||Array.isArray(a))throw Error(path+' doit être un objet.');
      for(const key of Object.keys(a))if(!Object.prototype.hasOwnProperty.call(b,key))throw Error('Règle inconnue : '+path+'.'+key);
      for(const key of Object.keys(b))if(!Object.prototype.hasOwnProperty.call(a,key))throw Error('Règle manquante : '+path+'.'+key);
    }
    sameKeys(c,base,'règles');
    const number=(v,a,b,name,integer=false)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<a||v>b||(integer&&!Number.isInteger(v)))throw Error(name+' : valeur attendue entre '+a+' et '+b+(integer?' (entier).':'.'));};
    const choice=(v,choices,name)=>{if(!choices.includes(v))throw Error(name+' : choisir '+choices.join(', ')+'.');};
    const boolean=(v,name)=>{if(typeof v!=='boolean')throw Error(name+' doit être true ou false.');};
    choice(c.version,[1],'version');choice(c.positions,[26,32],'positions');
    if(typeof c.target!=='string'||!/^#[0-9a-f]{6}$/i.test(c.target))throw Error('target : utiliser #RRGGBB.');
    c.target=c.target.toUpperCase();number(c.seed,1,4294967295,'seed',true);number(c.ticksPerSecond,.1,12,'ticksPerSecond');
    for(const section of ['grid','initial','weights','life','colors','collisions','gravity','motion','condensation','emission'])sameKeys(c[section],base[section],section);
    number(c.grid.size,8,24,'grid.size',true);choice(c.grid.boundary,['closed','wrap'],'grid.boundary');choice(c.grid.neighborhood,[6,26],'grid.neighborhood');
    number(c.initial.density,0,.5,'initial.density');choice(c.initial.shape,['sphere','cube'],'initial.shape');
    if(!Array.isArray(c.palette)||c.palette.length!==c.positions)throw Error('palette : une entrée par position est requise.');
    c.palette.forEach((p,i)=>{sameKeys(p,{color:0,type:0},'palette['+i+']');if(!/^#[0-9a-f]{6}$/i.test(p.color))throw Error('Couleur invalide en position '+(i+1));p.color=p.color.toUpperCase();choice(p.type,TYPES,'palette['+i+'].type');});
    for(const type of TYPES)number(c.weights[type],.01,100,'weights.'+type);
    boolean(c.life.enabled,'life.enabled');boolean(c.life.protectCondensates,'life.protectCondensates');
    for(const name of ['birth','survival']){
      if(!Array.isArray(c.life[name]))throw Error('life.'+name+' doit être une liste.');
      c.life[name].forEach(n=>number(n,0,c.grid.neighborhood,'life.'+name,true));
      if(new Set(c.life[name]).size!==c.life[name].length)throw Error('life.'+name+' contient des doublons.');
    }
    choice(c.life.inheritance,['union','parent','addition'],'life.inheritance');
    choice(c.colors.addition,['modulo','average','clamp'],'colors.addition');number(c.colors.amplitudeLimit,1,1000,'colors.amplitudeLimit',true);
    choice(c.collisions.subtraction,['never','opposed','any'],'collisions.subtraction');number(c.collisions.probability,0,1,'collisions.probability');
    boolean(c.gravity.enabled,'gravity.enabled');number(c.gravity.tolerance,0,1,'gravity.tolerance');number(c.gravity.minimumPositions,1,c.positions,'gravity.minimumPositions',true);
    if(!Array.isArray(c.gravity.requiredPositions)||new Set(c.gravity.requiredPositions).size!==c.gravity.requiredPositions.length)throw Error('gravity.requiredPositions : liste sans doublons requise.');
    c.gravity.requiredPositions.forEach(n=>number(n,1,c.positions,'gravity.requiredPositions',true));
    number(c.gravity.strength,0,30,'gravity.strength');number(c.gravity.radius,1,c.grid.size,'gravity.radius');number(c.gravity.softening,.1,10,'gravity.softening');number(c.gravity.spectralTolerance,0,1,'gravity.spectralTolerance');
    number(c.motion.diffusion,0,1,'motion.diffusion');number(c.condensation.requiredPositions,1,c.positions,'condensation.requiredPositions',true);
    boolean(c.condensation.persistent,'condensation.persistent');number(c.condensation.gravityMultiplier,0,20,'condensation.gravityMultiplier');
    number(c.emission.probability,0,1,'emission.probability');boolean(c.emission.reserveEachPosition,'emission.reserveEachPosition');number(c.emission.freeSteps,0,100,'emission.freeSteps',true);
    return c;
  }
  class World {
    constructor(config=defaults()){this.configure(config);this.reset();}
    configure(config){this.config=validate(config);this.n=this.config.grid.size;this.colors=this.config.palette.map(p=>rgb(p.color));this.target=rgb(this.config.target);this.offsets=[];
      for(let z=-1;z<=1;z++)for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)if((x||y||z)&&(this.config.grid.neighborhood===26||Math.abs(x)+Math.abs(y)+Math.abs(z)===1))this.offsets.push([x,y,z]);
    }
    random(){let s=this.seed;s^=s<<13;s^=s>>>17;s^=s<<5;this.seed=s>>>0;return this.seed/4294967296;}
    key(x,y,z){return x+this.n*(y+this.n*z);}
    coordinates(k){return [k%this.n,Math.floor(k/this.n)%this.n,Math.floor(k/(this.n*this.n))];}
    neighbor(k,d){const p=this.coordinates(k).map((v,i)=>v+d[i]);if(this.config.grid.boundary==='wrap')return this.key(...p.map(v=>(v+this.n)%this.n));return p.some(v=>v<0||v>=this.n)?null:this.key(...p);}
    delta(a,b){const d=b-a;if(this.config.grid.boundary!=='wrap')return d;return d>this.n/2?d-this.n:d<-this.n/2?d+this.n:d;}
    cell(k,counts,extra={}){return Object.assign({key:k,counts:Array.from(counts),condensed:false,flight:0,direction:[0,0,0]},extra);}
    describe(cell){
      const c=this.config,sums=[0,0,0];let units=0,mass=0,coverage=0;
      for(let i=0;i<c.positions;i++){
        const v=cell.counts[i];if(!v)continue;coverage++;units+=Math.abs(v);mass+=Math.abs(v)*c.weights[c.palette[i].type];
        for(let j=0;j<3;j++)sums[j]+=v*this.colors[i][j]*(c.colors.addition==='average'?c.weights[c.palette[i].type]:1);
      }
      const channels=sums.map(v=>c.colors.addition==='modulo'?((v%256)+256)%256:c.colors.addition==='average'?clamp(Math.round(v/Math.max(.000001,mass)),0,255):clamp(v,0,255));
      const condensed=coverage>=c.condensation.requiredPositions||(c.condensation.persistent&&cell.condensed&&coverage>0);
      const matches=coverage>=c.gravity.minimumPositions&&c.gravity.requiredPositions.every(i=>cell.counts[i-1]!==0)&&distance(channels,this.target)<=c.gravity.tolerance;
      return {rgb:channels,color:hex(channels),coverage,units,mass,condensed,matches,source:c.gravity.enabled&&(condensed||matches)};
    }
    refresh(){for(const cell of this.cells.values()){Object.assign(cell,this.describe(cell));}this.stats=this.summary();}
    summary(){let sources=0,spheres=0,units=0;for(const c of this.cells.values()){sources+=Number(c.source);spheres+=Number(c.condensed);units+=c.units;}return{generation:this.generation,cells:this.cells.size,sources,spheres,units,...this.events};}
    reset(){this.seed=this.config.seed;this.generation=0;this.cells=new Map();this.events={births:0,deaths:0,additions:0,subtractions:0,annihilations:0,emissions:0};
      const center=(this.n-1)/2;
      for(let z=0;z<this.n;z++)for(let y=0;y<this.n;y++)for(let x=0;x<this.n;x++){
        if(this.config.initial.shape==='sphere'&&Math.hypot(x-center,y-center,z-center)>this.n*.46)continue;
        if(this.random()>=this.config.initial.density)continue;
        const counts=Array(this.config.positions).fill(0);counts[Math.floor(this.random()*counts.length)]=1;
        const k=this.key(x,y,z);this.cells.set(k,this.cell(k,counts));
      }this.refresh();
    }
    inherit(parents){
      const c=this.config,counts=Array(c.positions).fill(0);
      if(c.life.inheritance==='parent')return [...parents[0].counts];
      for(const p of parents)for(let i=0;i<counts.length;i++)counts[i]+=p.counts[i];
      return counts.map(v=>c.life.inheritance==='union'?Math.sign(v):clamp(v,-c.colors.amplitudeLimit,c.colors.amplitudeLimit));
    }
    combine(a,b,subtract){return a.map((v,i)=>clamp(v+(subtract?-b[i]:b[i]),-this.config.colors.amplitudeLimit,this.config.colors.amplitudeLimit));}
    step(){
      const c=this.config;this.events={births:0,deaths:0,additions:0,subtractions:0,annihilations:0,emissions:0};
      const old=[...this.cells.values()].sort((a,b)=>a.key-b.key),sources=old.filter(p=>p.source),neighbors=new Map();
      for(const cell of old)for(const d of this.offsets){const k=this.neighbor(cell.key,d);if(k===null)continue;if(!neighbors.has(k))neighbors.set(k,[]);neighbors.get(k).push(cell);}
      let candidates=[];
      for(const cell of old){const count=(neighbors.get(cell.key)||[]).length;
        if(!c.life.enabled||(cell.condensed&&c.life.protectCondensates)||c.life.survival.includes(count))candidates.push(this.cell(cell.key,cell.counts,{condensed:cell.condensed,flight:cell.flight,direction:[...cell.direction]}));
        else this.events.deaths++;
      }
      if(c.life.enabled){
        const empties=c.life.birth.includes(0)?Array.from({length:this.n**3},(_,k)=>k):[...neighbors.keys()];
        for(const k of empties.sort((a,b)=>a-b)){
          if(this.cells.has(k))continue;const parents=neighbors.get(k)||[];
          if(!c.life.birth.includes(parents.length))continue;
          const counts=parents.length?this.inherit(parents):Array(c.positions).fill(0);
          if(!parents.length)counts[Math.floor(this.random()*counts.length)]=1;
          if(counts.some(Boolean)){candidates.push(this.cell(k,counts));this.events.births++;}
        }
      }
      // Emission transfers one signed unit; no duplicated material is introduced here.
      const emitted=[];
      for(const p of candidates)if(p.condensed&&c.emission.probability>0&&this.random()<c.emission.probability){
        const possible=p.counts.map((v,i)=>Math.abs(v)>(c.emission.reserveEachPosition?1:0)?i:-1).filter(i=>i>=0);
        if(!possible.length)continue;
        const direction=this.offsets[Math.floor(this.random()*this.offsets.length)],k=this.neighbor(p.key,direction);if(k===null)continue;
        const index=possible[Math.floor(this.random()*possible.length)],counts=Array(c.positions).fill(0),sign=Math.sign(p.counts[index]);
        counts[index]=sign;p.counts[index]-=sign;emitted.push(this.cell(k,counts,{flight:c.emission.freeSteps,direction}));this.events.emissions++;
      }
      const proposals=[];
      for(const p of candidates.sort((a,b)=>a.key-b.key)){
        if(!p.counts.some(Boolean))continue;
        const info=this.describe(p),position=this.coordinates(p.key);let d=[0,0,0];
        if(!info.condensed&&p.flight>0){d=p.direction;p.flight--;}
        else if(!info.source&&!info.condensed){
          let best=0,direction=null;
          for(const source of sources){
            if(source.key===p.key)continue;
            const q=this.coordinates(source.key),delta=q.map((v,i)=>this.delta(position[i],v)),r2=delta.reduce((s,v)=>s+v*v,0);
            if(!r2||r2>c.gravity.radius**2||distance(info.rgb,source.rgb)>c.gravity.spectralTolerance)continue;
            const pull=c.gravity.strength*Math.sqrt(source.mass)*(source.condensed?c.condensation.gravityMultiplier:1)/(r2+c.gravity.softening**2);
            if(pull>best){best=pull;direction=delta.map(Math.sign);}
          }
          if(direction&&this.random()<Math.min(1,best))d=direction;
          else if(this.random()<c.motion.diffusion)d=this.offsets[Math.floor(this.random()*this.offsets.length)];
        }
        const destination=this.neighbor(p.key,d);proposals.push({cell:p,d,destination:destination===null?p.key:destination});
      }
      for(const p of emitted)proposals.push({cell:p,d:p.direction,destination:p.key});
      const next=new Map();
      for(const {cell:p,d,destination:k} of proposals){
        if(!next.has(k)){next.set(k,this.cell(k,p.counts,{condensed:p.condensed,flight:p.flight,direction:[...d]}));continue;}
        const a=next.get(k),opposed=a.direction.reduce((s,v,i)=>s+v*d[i],0)<0;
        const subtract=(c.collisions.subtraction==='any'||(c.collisions.subtraction==='opposed'&&opposed))&&this.random()<c.collisions.probability;
        a.counts=this.combine(a.counts,p.counts,subtract);a.condensed=a.condensed||p.condensed;a.flight=0;a.direction=[0,0,0];
        this.events[subtract?'subtractions':'additions']++;
        if(!a.counts.some(Boolean)){next.delete(k);this.events.annihilations++;}
      }
      this.cells=next;this.generation++;this.refresh();return this.stats;
    }
  }
  const api={World,defaults,validate,palette,rgb,hex,distance,TYPES};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.ChromaticLife=api;
})(typeof globalThis!=='undefined'?globalThis:this);
