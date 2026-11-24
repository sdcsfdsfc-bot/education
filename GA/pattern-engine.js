/* CamoEvo-inspired teaching model. This is a compact procedural model, not CamoEvo's code. */
const PATTERN_GENES = [
  {name:'바탕 밝기 L*',min:22,max:82,group:'바탕색'},
  {name:'바탕 초록↔빨강 a*',min:-32,max:32,group:'바탕색'},
  {name:'바탕 파랑↔노랑 b*',min:-8,max:48,group:'바탕색'},
  {name:'무늬 밝기 L*',min:14,max:86,group:'무늬색'},
  {name:'무늬 초록↔빨강 a*',min:-38,max:38,group:'무늬색'},
  {name:'무늬 파랑↔노랑 b*',min:-12,max:54,group:'무늬색'},
  {name:'무늬 종류',min:0,max:3,group:'형태'},
  {name:'무늬 크기',min:.6,max:2.1,group:'형태'},
  {name:'무늬 기준값',min:.28,max:.72,group:'형태'},
  {name:'줄무늬 늘이기',min:.55,max:1.9,group:'형태'},
  {name:'경계 강조',min:0,max:.7,group:'세부'},
  {name:'작은 점 밀도',min:0,max:.38,group:'세부'}
];
const GENE_COUNT=PATTERN_GENES.length;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const sigmoid=x=>100*Math.exp(-x/28);
function labToRgb(lab){
  const [L,a,b]=lab,fy=(L+16)/116,fx=fy+a/500,fz=fy-b/200;
  const inv=t=>t**3>.008856?t**3:(t-16/116)/7.787;
  const X=95.047*inv(fx)/100,Y=100*inv(fy)/100,Z=108.883*inv(fz)/100;
  const linear=[3.2406*X-1.5372*Y-.4986*Z,-.9689*X+1.8758*Y+.0415*Z,.0557*X-.204*Y+1.057*Z];
  return linear.map(v=>Math.round(clamp((v>.0031308?1.055*v**(1/2.4)-.055:12.92*v)*255,0,255)));
}
function geneColors(m){return [labToRgb(m.genes.slice(0,3)),labToRgb(m.genes.slice(3,6))];}
function rgba(color,alpha){return `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;}
function makeGrayScott(feed,kill,seed){
  const w=48,h=36,n=w*h;let U=new Float32Array(n).fill(1),V=new Float32Array(n);
  for(let k=0;k<8;k++){
    const cx=5+((k*13+seed*7)%38),cy=5+((k*11+seed*3)%26);
    for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(dx*dx+dy*dy<=5){const x=(cx+dx+w)%w,y=(cy+dy+h)%h,i=y*w+x;V[i]=.8;U[i]=.2;}
  }
  for(let t=0;t<210;t++){
    const nextU=new Float32Array(n),nextV=new Float32Array(n);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const i=y*w+x,left=y*w+(x+w-1)%w,right=y*w+(x+1)%w,up=((y+h-1)%h)*w+x,down=((y+1)%h)*w+x;
      const u=U[i],v=V[i],reaction=u*v*v;
      nextU[i]=clamp(u+.18*(U[left]+U[right]+U[up]+U[down]-4*u)-reaction+feed*(1-u),0,1);
      nextV[i]=clamp(v+.09*(V[left]+V[right]+V[up]+V[down]-4*v)+reaction-(feed+kill)*v,0,1);
    }
    U=nextU;V=nextV;
  }
  let lo=Infinity,hi=-Infinity;for(const value of V){lo=Math.min(lo,value);hi=Math.max(hi,value);}
  if(hi-lo<.001)return Array.from({length:n},(_,i)=>.5+.4*Math.sin((i%w)*.4+seed)*Math.sin(Math.floor(i/w)*.45));
  return Array.from(V,v=>(v-lo)/(hi-lo));
}
const PATTERN_ATLAS=[
  makeGrayScott(.025,.055,1),makeGrayScott(.033,.061,2),
  makeGrayScott(.041,.063,3),makeGrayScott(.028,.058,4)
];
function atlasSample(index,u,v){const w=48,h=36,x=((Math.floor(u*w)%w)+w)%w,y=((Math.floor(v*h)%h)+h)%h;return PATTERN_ATLAS[index][y*w+x];}
function patternValue(m,u,v){
  const g=m.genes,scale=g[7],stretch=g[9],x=(u-.5)*scale+.5,y=(v-.5)*scale/stretch+.5;
  const kind=clamp(g[6],0,3),low=Math.floor(kind),high=Math.min(3,low+1),mix=kind-low;
  return atlasSample(low,x,y)*(1-mix)+atlasSample(high,x,y)*mix;
}
function patternColor(m,u,v,colors=geneColors(m)){
  const value=patternValue(m,u,v),g=m.genes;
  const speckle=(Math.sin((u*1049+v*677)*73.17)*43758.5453)%1;
  const mark=value>=g[8] || Math.abs(speckle)<g[11]*.11;
  const source=colors[mark?1:0];
  const edge=Math.abs(value-g[8])<.06?g[10]:0;
  return source.map(channel=>Math.round(clamp(channel+(mark?-1:1)*edge*36,0,255)));
}
function patternGenome(random=Math.random){return {genes:PATTERN_GENES.map(spec=>spec.min+random()*(spec.max-spec.min)),score:null,mutations:[]};}
function makeForestGenome(theme='natural',pattern='normal',random=Math.random){
  const palette={
    natural:[[39,13,24],[55,11,32]],
    light:[[69,6,18],[79,4,14]],
    dark:[[27,10,14],[41,9,23]],
    moss:[[43,-19,21],[57,-8,30]]
  }[theme]||[[39,13,24],[55,11,32]];
  const g=patternGenome(random).genes;
  for(let j=0;j<6;j++){const value=palette[Math.floor(j/3)][j%3]+(random()-.5)*(j%3===0?5:4);g[j]=clamp(value,PATTERN_GENES[j].min,PATTERN_GENES[j].max);}
  const settings={smooth:[.5,.7,.58,1.3,.10,.01],normal:[1.5,1.18,.49,1.05,.23,.08],rough:[2.5,1.85,.43,.75,.42,.25]}[pattern]||[1.5,1.18,.49,1.05,.23,.08];
  for(let j=6;j<12;j++)g[j]=clamp(settings[j-6]+(random()-.5)*(j===6?.25:.08),PATTERN_GENES[j].min,PATTERN_GENES[j].max);
  return {genes:g};
}
function forestPatternColor(f,x,y,colors=geneColors(f)){
  const tx=clamp(Math.floor(x/5),0,219),ty=clamp(Math.floor(y/5),0,139);
  return patternColor(f,tx/220*3,ty/140*2.5,colors);
}
const PATTERN_SAMPLES=new WeakMap();
function forestSamples(forest){
  if(PATTERN_SAMPLES.has(forest))return PATTERN_SAMPLES.get(forest);
  const samples=[],forestColors=forest.genes?geneColors(forest):null;
  for(let slot=0;slot<POP_SIZE;slot++){
    const [cx,cy]=position(slot);
    for(const side of [-1,1])for(let gx=0;gx<9;gx++)for(let gy=0;gy<6;gy++){
      const u=(gx+.5)/9,v=(gy+.5)/6;
      if(v>1-.5*u+.12)continue;
      const px=cx+side*(7+u*62),py=cy-25+v*50;
      let background=forest.genes?forestPatternColor(forest,px,py,forestColors):forestColor(forest,forest.base);
      if(!forest.genes)for(let i=forest.patches.length-1;i>=0;i--){const p=forest.patches[i];if(((px-p.x)/p.rx)**2+((py-p.y)/p.ry)**2<=1){background=forestColor(forest,p.color);break;}}
      samples.push({u,v,background});
    }
  }
  PATTERN_SAMPLES.set(forest,samples);return samples;
}
function patternScore(m,forest=state.forest){
  const colors=geneColors(m),samples=forestSamples(forest);let difference=0;
  for(const {u,v,background} of samples){
    const wing=patternColor(m,u,v,colors);
    for(let channel=0;channel<3;channel++)difference+=Math.abs(background[channel]-wing[channel]);
  }
  const mean=difference/(samples.length*3);
  return {mean,score:sigmoid(mean)};
}
const STAGNATION_LIMIT=window.GAStagnation.limit;
function stalledGenerations(scores){
  return window.GAStagnation.count(scores);
}
function geneDisplay(m,j){
  const value=m.genes[j];return j<6?value.toFixed(1):value.toFixed(2);
}
function patternGeneRows(m){
  const [base,mark]=geneColors(m);
  return `<div class="pattern-color-pair"><span><i style="background:${rgb(base)}"></i>바탕색 ${rgb(base)}</span><span><i style="background:${rgb(mark)}"></i>무늬색 ${rgb(mark)}</span></div><div class="trace-gene-list">${PATTERN_GENES.map((spec,j)=>`<div class="trace-gene-row"><span>${spec.name}</span><strong>${geneDisplay(m,j)}</strong></div>`).join('')}</div>`;
}
function patternInheritance(a,b,before,weights,after=null,indices=null){
  const shown=indices||PATTERN_GENES.map((_,j)=>j);
  return `<div class="pattern-inheritance"><p><strong>${after?'교차 직후 값과 변이 후 값을 비교합니다.':'같은 종류의 숫자끼리 교차합니다.'}</strong> 자손 = A × A의 비율 + B × B의 비율</p><div class="trace-table-wrap"><table class="trace-table"><thead><tr><th>유전자</th><th>부모 A</th><th>부모 B</th><th>A 비율</th><th>교차 직후</th>${after?'<th>변이 후</th>':''}</tr></thead><tbody>${shown.map(j=>{const spec=PATTERN_GENES[j];return `<tr class="${after?.mutations?.includes(j)?'chosen':''}"><td>${spec.name}</td><td>${geneDisplay(a,j)}</td><td>${geneDisplay(b,j)}</td><td>${weights[j]===null?'보존':`${Math.round(weights[j]*100)}%`}</td><td>${geneDisplay(before,j)}</td>${after?`<td>${geneDisplay(after,j)}${after.mutations.includes(j)?' ●':''}</td>`:''}</tr>`;}).join('')}</tbody></table></div></div>`;
}
function paintWing(ctx,m,colors){
  ctx.save();mothWingPath(ctx);ctx.clip();
  for(let x=0;x<76;x+=4)for(let y=-39;y<40;y+=4){
    const c=patternColor(m,(x+2)/76,(y+39)/79,colors);
    ctx.fillStyle=rgb(c);ctx.fillRect(x,y,4.2,4.2);
  }
  ctx.restore();mothWingPath(ctx);ctx.strokeStyle='#273f31aa';ctx.lineWidth=2;ctx.stroke();
}
function paintPatternMoth(ctx,x,y,m,scale=1,selected=false,badge=null){
  const colors=geneColors(m);ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  for(const side of [-1,1]){ctx.save();ctx.scale(side,1);paintWing(ctx,m,colors);ctx.restore();}
  ellipse(ctx,0,3,7,28,'#ece7cc');ctx.strokeStyle='#d8d3b7';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(-3,-20);ctx.lineTo(-14,-38);ctx.moveTo(3,-20);ctx.lineTo(14,-38);ctx.stroke();
  if(selected){ctx.strokeStyle='#ffe7a1';ctx.lineWidth=3;ctx.setLineDash([5,4]);ctx.beginPath();ctx.ellipse(0,0,80,51,0,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
  if(badge!==null){ctx.fillStyle='#173b32dd';ctx.beginPath();ctx.roundRect(x-28*scale,y+43*scale,56*scale,22*scale,7*scale);ctx.fill();ctx.fillStyle='white';ctx.font=`700 ${11*scale}px sans-serif`;ctx.textAlign='center';ctx.fillText(badge,x,y+58*scale);}
}
function drawPatternStages(m,root=document,forest=false){
  const canvases=root.querySelectorAll('[data-pattern-stage]');
  canvases.forEach(canvas=>{
    const ctx=canvas.getContext('2d'),stage=canvas.dataset.patternStage,w=canvas.width,h=canvas.height,colors=geneColors(m);
    ctx.clearRect(0,0,w,h);
    for(let x=0;x<w;x+=4)for(let y=0;y<h;y+=4){
      const u=(x+2)/w*(forest?3:1),v=(y+2)/h*(forest?2.5:1),value=patternValue(m,u,v);
      if(stage==='texture'){const gray=Math.round(value*255);ctx.fillStyle=rgb([gray,gray,gray]);}
      else if(stage==='mask'){ctx.fillStyle=value>=m.genes[8]?'#fff':'#1f3029';}
      else ctx.fillStyle=rgb(patternColor(m,u,v,colors));
      ctx.fillRect(x,y,4,4);
    }
  });
}
function patternStagesMarkup(id=''){return `<div ${id?`id="${id}"`:''} class="pattern-stages"><div><span>① 반응·확산 무늬</span><canvas width="150" height="90" data-pattern-stage="texture"></canvas><small>밝고 어두운 연속값</small></div><div><span>② 기준값으로 분리</span><canvas width="150" height="90" data-pattern-stage="mask"></canvas><small>무늬 / 바탕 영역</small></div><div><span>③ 두 색 입히기</span><canvas width="150" height="90" data-pattern-stage="colored"></canvas><small>완성된 색 무늬</small></div></div>`;}

moth=()=>patternGenome();
candidateScore=m=>patternScore(m).score;
sampleDetails=m=>{const result=patternScore(m);return {mean:result.mean,samples:forestSamples(state.forest).length,groups:[]};};
drawMoth=(ctx,x,y,m,i,selected,scale=1)=>paintPatternMoth(ctx,x,y,m,scale,selected,m.score===null?String(i+1).padStart(2,'0'):`${m.score.toFixed(1)}%`);

step=function(){
  if(cursor<history.length-1){restore(cursor+1);return;}
  switch(state.phase){
    case 'initial':evaluate();state.phase='evaluated';break;
    case 'evaluated':case 'replaced':{
      const draws=[selectParent(),selectParent()];state.parents=draws.map(d=>d.index);
      state.trace={draws,parentWeights:state.moths.map(m=>m.score+1),parentMoths:state.parents.map(i=>clone(state.moths[i]))};state.phase='selected';break;
    }
    case 'selected':{
      const eliteIndex=state.moths.findIndex(m=>m.score===Math.max(...state.moths.map(x=>x.score)));
      state.children=[clone(state.moths[eliteIndex])];state.children[0].mutations=[];
      state.trace.eliteIndex=eliteIndex;state.trace.crossSources=[Array(GENE_COUNT).fill(null)];state.trace.childParents=[null];state.trace.childParentIndexes=[null];
      for(let i=1;i<POP_SIZE;i++){
        const picked=i===1?state.parents:[selectParent().index,selectParent().index],pair=picked.map(index=>clone(state.moths[index]));
        state.trace.childParents.push(pair);state.trace.childParentIndexes.push(picked);
        const weights=Array.from({length:GENE_COUNT},()=>.15+Math.random()*.7);
        const genes=weights.map((weight,j)=>clamp(pair[0].genes[j]*weight+pair[1].genes[j]*(1-weight),PATTERN_GENES[j].min,PATTERN_GENES[j].max));
        state.children.push({genes,score:null,mutations:[]});state.trace.crossSources.push(weights);
      }
      state.phase='crossed';break;
    }
    case 'crossed':{
      const rate=Number($('rate').value)/100,stalled=stalledGenerations(state.best);
      const spread=.26+(rate>0&&stalled>=4?Math.min(.16,.04*Math.floor(stalled/4)):0);
      state.trace.beforeMutation=clone(state.children);state.trace.mutationRate=rate;state.trace.stalled=stalled;state.trace.mutationSpread=spread;
      for(const child of state.children.slice(1))for(let j=0;j<GENE_COUNT;j++)if(Math.random()<rate){
        const spec=PATTERN_GENES[j],span=spec.max-spec.min;
        const delta=(Math.random()+Math.random()+Math.random()-1.5)*span*spread;
        child.genes[j]=Math.random()<.08?spec.min+Math.random()*span:clamp(child.genes[j]+delta,spec.min,spec.max);child.mutations.push(j);
      }
      state.phase='mutated';break;
    }
    case 'mutated':{
      state.trace.previousBest=state.best.at(-1);
      state.moths=state.children;state.children=[];state.parents=[];state.generation++;evaluate();
      const stalled=stalledGenerations(state.best);
      state.phase=stalled>=STAGNATION_LIMIT?'finished':'replaced';
      state.stopReason=state.phase==='finished'?'stagnation':null;
      if(state.phase==='finished')stopAuto();
      break;
    }
    default:stopAuto();return;
  }
  save();
};

render=function(){
  const copy={initial:['초기 개체군','바탕색·무늬색·형태를 정하는 숫자 유전자를 가진 나방 24마리입니다.'],evaluated:['적합도 평가','무늬 전체의 색을 나무껍질과 비교해 점수를 계산했습니다.'],selected:['부모 선택','위장 점수로 부모 두 마리를 선택했습니다.'],crossed:['유전자 교차','부모의 대응하는 숫자 유전자를 가중평균해 자손을 만들었습니다.'],mutated:['돌연변이','일부 숫자 유전자를 조금 바꿔 무늬를 다시 그렸습니다.'],replaced:['세대 교체','자손을 평가하고 다음 세대로 넘어왔습니다.'],finished:['실험 완료','무늬 진화를 살펴보세요.']}[state.phase];
  $('generation').textContent=String(state.generation).padStart(2,'0');$('phase-title').textContent=copy[0];$('phase-description').textContent=copy[1];$('tip').textContent='색과 무늬의 위치가 함께 위장 점수에 영향을 줍니다.';
  $('previous').disabled=cursor===0;$('next').disabled=state.phase==='finished'&&cursor===history.length-1;$('scene-count').textContent=`장면 ${cursor+1} / ${history.length}`;$('scene-range').max=Math.max(0,history.length-1);$('scene-range').value=cursor;
  const stages=['평가','선택','교차','변이','교체'],active={initial:-1,evaluated:0,selected:1,crossed:2,mutated:3,replaced:4,finished:4}[state.phase];$('stage-steps').innerHTML=stages.map((s,i)=>`<span class="${i===active?'current':''}">${s}</span>`).join('');
  if(state.selected===null){$('moth-heading').textContent='나방을 선택하세요';$('moth-info').textContent='나방을 누르면 바탕색·무늬색·형태 유전자를 볼 수 있습니다.';$('genes').replaceChildren();}
  else{const m=state.moths[state.selected],colors=geneColors(m);$('moth-heading').textContent=`나방 ${String(state.selected+1).padStart(2,'0')}`;$('moth-info').textContent=`위장 점수 ${m.score===null?'평가 전':m.score.toFixed(1)+'%'} · 숫자 유전자 ${GENE_COUNT}개`;$('genes').innerHTML=colors.map((c,j)=>`<div class="gene"><i class="swatch" style="background:${rgb(c)}"></i>${j?'무늬색':'바탕색'}<strong>${rgb(c)}</strong></div>`).join('')+`<div class="gene">무늬 크기 <strong>${geneDisplay(m,7)}</strong></div><div class="gene">무늬 기준값 <strong>${geneDisplay(m,8)}</strong></div>`;}
  drawForest();drawChart();renderTrace();
};

renderTrace=function(){
  const phase=state.phase,stage=phase==='finished'?5:traceOrder.indexOf(phase),titles=['초기 개체군','적합도 평가','부모 선택','유전자 교차','돌연변이','세대 교체'];
  $('trace-step-number').textContent=`STEP ${String(stage+1).padStart(2,'0')}`;$('trace-title').textContent=titles[stage];$('trace-description').textContent=$('phase-description').textContent;
  $('trace-question').textContent={initial:'어느 무늬가 나무껍질에 가장 가까울까요?',evaluated:'바탕색과 무늬색이 각각 점수에 어떻게 작용할까요?',selected:'어느 나방의 숫자 유전자가 자손에게 전달될까요?',crossed:'부모의 숫자 사이에서 자손의 값은 얼마일까요?',mutated:'어떤 숫자가 바뀌어 무늬가 달라졌을까요?',replaced:'최고 점수가 높아졌을까요?',finished:'무늬와 색은 어떻게 변했을까요?'}[phase];
  $('trace-generation').textContent=`${String(state.generation).padStart(2,'0')}세대`;$('detail-previous').disabled=cursor===0;$('detail-next').disabled=phase==='finished'&&cursor===history.length-1;$('detail-scene-count').textContent=`장면 ${cursor+1} / ${history.length}`;$('detail-scene-range').max=Math.max(0,history.length-1);$('detail-scene-range').value=cursor;
  $('trace-phases').innerHTML=traceNames.map((name,i)=>`<span class="${i===stage?'current':i<stage?'passed':''}"><b>${String(i+1).padStart(2,'0')}</b>${name}</span>`).join('');
  const bestIndex=state.moths.reduce((best,m,i)=>m.score!==null&&(best<0||m.score>state.moths[best].score)?i:best,-1),picked=state.selected===null?(bestIndex<0?0:bestIndex):state.selected;
  $('trace-best').textContent=bestIndex<0?'—':`${state.moths[bestIndex].score.toFixed(1)}%`;$('trace-best-caption').textContent=bestIndex<0?'아직 평가 전입니다':`${state.generation}세대 · 나방 ${bestIndex+1}번`;$('trace-picker-hint').textContent='한 마리를 눌러 숫자 유전자와 무늬를 보세요';
  $('trace-population').innerHTML=state.moths.map((m,i)=>`<button type="button" data-moth="${i}" class="trace-moth-option ${i===picked?'active':''}"><span>${String(i+1).padStart(2,'0')}</span><i style="background:${rgb(geneColors(m)[0])}"></i><strong>${m.score===null?'—':m.score.toFixed(1)+'%'}</strong></button>`).join('');
  const content=$('trace-content');
  if(phase==='initial'||phase==='evaluated'){
    const m=state.moths[picked],result=patternScore(m);
    content.innerHTML=`<div class="trace-observe"><canvas id="focus-canvas" width="500" height="250" aria-label="바탕색과 무늬색을 가진 나방"></canvas><div class="trace-observe-copy"><span class="trace-tag">GENOME ${String(picked+1).padStart(2,'0')}</span><h3>그림을 만드는 ${GENE_COUNT}개 숫자</h3><p>무늬의 각 픽셀이 유전되는 것이 아니라, 바탕색·무늬색·무늬 종류·크기·기준값·경계·작은 점을 만드는 숫자가 유전됩니다.</p>${patternGeneRows(m)}</div></div><h3 class="trace-subtitle">숫자에서 무늬까지</h3>${patternStagesMarkup()}${phase==='evaluated'?`<div class="trace-math"><div><span>평균 RGB 차이</span><strong>${result.mean.toFixed(2)}</strong></div><div><span>위장 점수</span><strong>${m.score.toFixed(1)}%</strong></div></div>`:'<p class="trace-explain">나방을 고른 뒤 다음 장면에서 색 차이와 점수를 확인하세요.</p>'}`;
    drawFocus(picked,m);drawPatternStages(m);
  }else if(phase==='selected'){
    const weights=state.trace.parentWeights,total=weights.reduce((a,b)=>a+b,0);
    content.innerHTML=`<div class="trace-callout"><span class="trace-tag">SELECTION</span><h3>발견되기 어려운 무늬의 유전자가 더 자주 선택됩니다</h3><p>점수 + 1을 추첨 가중치로 사용합니다. 아래는 첫 자손의 부모이며, 다른 자손의 부모는 각자 다시 뽑습니다.</p><div class="trace-parent-pair"><span>부모 A <strong>나방 ${state.parents[0]+1}</strong></span><span>부모 B <strong>나방 ${state.parents[1]+1}</strong></span></div></div><div class="trace-table-wrap"><table class="trace-table"><thead><tr><th>나방</th><th>점수</th><th>부모 선택 확률</th></tr></thead><tbody>${state.moths.map((m,i)=>`<tr class="${state.parents.includes(i)?'chosen':''}"><td>${i+1}</td><td>${m.score.toFixed(1)}%</td><td>${(100*weights[i]/total).toFixed(1)}%</td></tr>`).join('')}</tbody></table></div>`;
  }else if(phase==='crossed'||phase==='mutated'){
    const index=Math.min(Math.max(state.focusChild,0),POP_SIZE-1),child=state.children[index],before=state.trace.beforeMutation?.[index]||child,[a,b]=state.trace.childParents?.[index]||state.trace.parentMoths,weights=state.trace.crossSources[index];
    if(index===0){
      content.innerHTML=`<div class="trace-callout"><span class="trace-tag">ELITE</span><h3>최고 점수 나방을 그대로 보존합니다</h3><p>이전 세대의 나방 ${state.trace.eliteIndex+1}번은 교차와 변이를 거치지 않습니다. 이 한 마리가 발견한 최고 해를 지킵니다.</p></div><div class="pattern-compare"><div><span>보존된 나방 · ${child.score.toFixed(1)}%</span><canvas data-elite width="190" height="100"></canvas></div></div>`;
      paintPatternMoth(content.querySelector('[data-elite]').getContext('2d'),95,49,child,.95,false,null);
      return;
    }
    content.innerHTML=`<div class="trace-callout"><span class="trace-tag">${phase==='crossed'?'CROSSOVER':'MUTATION'}</span><h3>${phase==='crossed'?'부모의 숫자를 섞어 새 그림을 만듭니다':'일부 숫자를 바꿔 다시 그립니다'}</h3><p>${phase==='crossed'?'각 유전자는 부모 A와 B의 대응하는 숫자를 가중평균합니다.':'변이는 선택된 숫자에 작은 값을 더하거나 빼며, 색과 무늬 모두 달라질 수 있습니다.'}</p></div><div class="trace-child-picker">${state.children.map((m,i)=>`<button type="button" data-child="${i}" class="${i===index?'active':''}">${i===0?'★ 보존':`자손 ${i+1}`}${phase==='mutated'&&m.mutations.length?' <i>●</i>':''}</button>`).join('')}</div>${patternInheritance(a,b,before,weights,phase==='mutated'?child:null)}<div class="pattern-compare"><div><span>부모 A</span><canvas data-compare="a" width="190" height="100"></canvas></div><div><span>부모 B</span><canvas data-compare="b" width="190" height="100"></canvas></div><div><span>교차 직후</span><canvas data-compare="before" width="190" height="100"></canvas></div>${phase==='mutated'?'<div><span>변이 후</span><canvas data-compare="after" width="190" height="100"></canvas></div>':''}</div>${phase==='mutated'?`<p class="trace-score-note">예상 점수 ${candidateScore(before).toFixed(1)}% → ${candidateScore(child).toFixed(1)}%</p>`:''}`;
    const models={a,b,before,after:child};content.querySelectorAll('[data-compare]').forEach(canvas=>{const ctx=canvas.getContext('2d');paintPatternMoth(ctx,95,49,models[canvas.dataset.compare],.95,false,null);});
    const pair=state.trace.childParentIndexes?.[index];if(pair)content.querySelector('.trace-callout p').textContent=`자손 ${index+1}번: 부모 A는 나방 ${pair[0]+1}번, 부모 B는 나방 ${pair[1]+1}번입니다. ${phase==='crossed'?'각 숫자를 가중평균했습니다.':'변이된 숫자로 무늬를 다시 그렸습니다.'}`;
  }else{
    const previous=state.trace.previousBest,current=state.best.at(-1);content.innerHTML=`<div class="trace-callout"><span class="trace-tag">NEXT GENERATION</span><h3>${phase==='finished'?'최고 점수가 40세대 동안 갱신되지 않아 멈췄습니다':'새로운 세대가 시작됐습니다'}</h3><p>가장 높은 점수의 나방 한 마리를 보존합니다. 무늬와 색이 함께 바뀐 자손을 다시 평가했습니다.</p></div><div class="trace-result"><div><span>이전 최고</span><strong>${previous===undefined?'—':previous.toFixed(1)+'%'}</strong></div><b>→</b><div><span>현재 최고</span><strong>${current.toFixed(1)}%</strong></div></div><div class="pattern-compare">${state.moths.map((m,i)=>({m,i})).sort((a,b)=>b.m.score-a.m.score).slice(0,3).map(({m,i})=>`<div><span>나방 ${i+1} · ${m.score.toFixed(1)}%</span><canvas data-result="${i}" width="190" height="100"></canvas></div>`).join('')}</div>`;content.querySelectorAll('[data-result]').forEach(canvas=>paintPatternMoth(canvas.getContext('2d'),95,49,state.moths[Number(canvas.dataset.result)],.95,false,null));
  }
};

LESSONS.splice(0,LESSONS.length,
  ['숫자 유전자','한 나방은 색과 무늬를 정하는 숫자들을 가집니다.','바탕색과 무늬색의 L*a*b* 값, 무늬 종류·크기·기준값, 경계 강조·작은 점 밀도가 유전자입니다.'],
  ['무늬 생성','숫자에서 흑백 무늬를 만들고 두 색을 입힙니다.','반응·확산 패턴을 선택·크기 조절하고 기준값으로 바탕과 무늬를 나눕니다. 이 교육용 구현은 CamoEvo의 개념을 단순화했습니다.'],
  ['적합도 평가','나무껍질과 무늬 전체를 비교합니다.','모든 나방을 같은 숲의 표본 위치에서 비교합니다. 평균 RGB 차이가 작을수록 점수가 높습니다. 실제 포식자 실험을 대신하는 교육용 점수입니다.'],
  ['부모 선택','높은 점수의 나방이 부모로 뽑힐 확률이 큽니다.','점수 + 1을 가중치로 사용합니다.'],
  ['유전자 교차','부모의 숫자 사이에서 자손의 값을 만듭니다.','각 유전자를 부모 A와 B의 무작위 가중평균으로 만듭니다. 바탕색·무늬색과 무늬 형태의 중간값이 나올 수 있습니다.'],
  ['변이와 세대 교체','숫자가 조금 바뀌고 가장 좋은 나방은 보존됩니다.','각 유전자에 설정한 확률로 작은 변이를 적용합니다. 최고 해 한 마리는 그대로 다음 세대에 남깁니다.']);
$('lesson-cards').replaceChildren();setupLessons();reset();
