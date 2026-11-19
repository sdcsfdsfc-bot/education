/* The free experiment advances by generation and keeps the population across forests. */
forestColor=function(f,index){
  const c=BARK[index],theme=f.theme||'natural';
  if(theme==='light')return c.map(v=>Math.round(clamp(v*.72+82,0,255)));
  if(theme==='dark')return c.map(v=>Math.round(v*.56));
  if(theme==='moss')return [Math.round(c[0]*.59),Math.round(clamp(c[1]*.78+37,0,255)),Math.round(c[2]*.67+18)];
  return c;
};
const makeBaseForest=makeForest;
makeForest=function(theme='natural',pattern='normal'){
  const forest=makeBaseForest(theme,pattern);
  forest.genes=makeForestGenome(theme,pattern).genes;
  forest.patches=[];
  return forest;
};
treeColor=function(x,y){
  const f=state.forest;
  return f.genes?forestPatternColor(f,x,y):forestColor(f,f.base);
};
const FOREST_TEXTURES=new WeakMap();
function forestTexture(f){
  if(FOREST_TEXTURES.has(f))return FOREST_TEXTURES.get(f);
  const canvas=document.createElement('canvas');canvas.width=220;canvas.height=140;
  const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(220,140),colors=geneColors(f);
  for(let y=0;y<140;y++)for(let x=0;x<220;x++){
    const c=patternColor(f,x/220*3,y/140*2.5,colors),i=(y*220+x)*4;
    pixels.data[i]=c[0];pixels.data[i+1]=c[1];pixels.data[i+2]=c[2];pixels.data[i+3]=255;
  }
  ctx.putImageData(pixels,0,0);FOREST_TEXTURES.set(f,canvas);return canvas;
}

drawForest=function(){
  const canvas=$('forest'),ctx=canvas.getContext('2d'),f=state.forest;
  ctx.clearRect(0,0,1100,700);
  const sky=ctx.createLinearGradient(0,0,0,700);sky.addColorStop(0,'#cedec1');sky.addColorStop(1,'#658667');ctx.fillStyle=sky;ctx.fillRect(0,0,1100,700);
  for(let i=0;i<18;i++){ctx.fillStyle=i%2?'#456d4b44':'#a4b98b66';ctx.fillRect(i*70-10,0,20+i%4*8,700);}
  ctx.fillStyle=rgb(forestColor(f,f.base));ctx.beginPath();ctx.moveTo(110,80);ctx.lineTo(990,80);ctx.lineTo(1090,700);ctx.lineTo(10,700);ctx.closePath();ctx.fill();
  ctx.save();ctx.beginPath();ctx.moveTo(110,80);ctx.lineTo(990,80);ctx.lineTo(1090,700);ctx.lineTo(10,700);ctx.closePath();ctx.clip();
  if(f.genes){ctx.imageSmoothingEnabled=false;ctx.drawImage(forestTexture(f),0,0,1100,700);}
  else for(const p of f.patches)ellipse(ctx,p.x,p.y,p.rx,p.ry,rgb(forestColor(f,p.color)));
  ctx.strokeStyle='#402e2240';ctx.lineWidth=3;
  for(let i=0;i<18;i++){const x=65+i*61;ctx.beginPath();ctx.moveTo(x,90);ctx.bezierCurveTo(x+15,300,x-15,480,x+25,700);ctx.stroke();}
  ctx.restore();
  for(const leaf of f.leaves)ellipse(ctx,leaf.x,leaf.y,leaf.rx,leaf.ry,rgb(LEAVES[leaf.color]));
  ctx.textAlign='center';
  state.moths.forEach((m,i)=>{const [x,y]=position(i);drawMoth(ctx,x,y,m,i,state.selected===i);});
};

drawChart=function(){
  const canvas=$('chart'),ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,l=55,r=w-22,t=24,b=h-42;
  ctx.clearRect(0,0,w,h);ctx.font='12px sans-serif';
  const count=state.best.length;
  if(!count){$('chart-summary').textContent='첫 세대를 평가하면 변화가 기록됩니다.';$('chart-scale').textContent='전체 세대 · 점수 범위';$('chart-exploration').textContent=`다음 세대 변이 확률 ${$('rate').value}% · 선택값과 동일`;return;}
  const values=[...state.best,...state.avg],minimum=Math.min(...values),maximum=Math.max(...values),padding=Math.max(5,(maximum-minimum)*.16);
  let lower=Math.max(0,Math.floor((minimum-padding)/5)*5),upper=Math.min(100,Math.ceil((maximum+padding)/5)*5);
  if(upper-lower<10){lower=Math.max(0,lower-5);upper=Math.min(100,upper+5);}
  const xAt=i=>l+(r-l)*i/Math.max(1,count-1),yAt=value=>b-(b-t)*(value-lower)/(upper-lower);
  ctx.textAlign='right';
  for(let i=0;i<=4;i++){
    const value=lower+(upper-lower)*i/4,y=yAt(value);
    ctx.strokeStyle='#e4ebe2';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(l,y);ctx.lineTo(r,y);ctx.stroke();
    ctx.fillStyle='#758a79';ctx.fillText(`${value.toFixed(value%1?1:0)}%`,l-9,y+4);
  }
  const labelCount=Math.min(8,count),labels=new Set();
  for(let i=0;i<labelCount;i++)labels.add(Math.round(i*(count-1)/Math.max(1,labelCount-1)));
  ctx.textAlign='center';
  for(const i of labels){const x=xAt(i);ctx.fillStyle='#758a79';ctx.fillText(String(i+1),x,h-16);}
  for(const [series,color] of [[state.avg,'#c9a86c'],[state.best,'#2e8054']]){
    ctx.strokeStyle=color;ctx.lineWidth=3;ctx.lineJoin='round';ctx.beginPath();
    series.forEach((value,i)=>{const x=xAt(i),y=yAt(value);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
    if(count<=65)series.forEach((value,i)=>ellipse(ctx,xAt(i),yAt(value),3.3,3.3,color));
  }
  const initial=state.best[0],latest=state.best.at(-1),gain=latest-initial,stalled=stalledGenerations(state.best),rate=Number($('rate').value);
  if(count>1&&stalled===0){
    const x=xAt(count-1),y=yAt(latest);
    ellipse(ctx,x,y,8,8,'#e8c76c');ellipse(ctx,x,y,4,4,'#2e8054');
    ctx.fillStyle='#2e8054';ctx.font='bold 13px sans-serif';ctx.textAlign='right';ctx.fillText('새 최고',r,Math.max(t+14,y-14));
  }
  $('chart-summary').textContent=`${count}세대 전체 기록 · 첫 최고 ${initial.toFixed(2)}% → 현재 최고 ${latest.toFixed(2)}% · 변화 ${gain>=0?'+':''}${gain.toFixed(2)}%p`;
  $('chart-scale').textContent=`세로축 ${lower}~${upper}%로 확대 · 가로축은 세대`;
  $('chart-exploration').textContent=state.phase==='finished'&&state.stopReason==='stagnation'
    ?`최고 점수 갱신 없이 ${STAGNATION_LIMIT}세대 · 실험 중지`
    :`다음 세대 변이 확률 ${$('rate').value}% · 선택값과 동일${stalled>=4&&rate>0?` · ${stalled}세대 정체로 변이 폭만 확대`:''}`;
};

function advanceGeneration(){
  if(state.phase==='finished'){stopAuto();return;}
  const start=state.generation;let guard=0;
  while(state.generation===start&&guard++<7)step();
}
function previousGeneration(){
  const target=state.generation-1;
  if(target<1)return;
  for(let i=cursor-1;i>=0;i--)if(history[i].generation===target&&['replaced','evaluated','initial'].includes(history[i].phase)){restore(i);return;}
}
function toggleGenerationAuto(){
  if(autoTimer){stopAuto();return;}
  if(state.phase==='finished')return;
  $('auto').textContent='일시정지 Ⅱ';
  autoTimer=setInterval(advanceGeneration,1100);
}
function resetExperiment(){
  stopAuto();$('bark-theme').value='natural';$('bark-pattern').value='normal';reset();step();
}
function changeBackground(){
  stopAuto();
  const survivors=state.moths.map(clone),round=(state.environmentRound||1)+1;
  state.forest=makeForest($('bark-theme').value,$('bark-pattern').value);
  state.moths=survivors;state.generation=1;state.environmentRound=round;
  state.parents=[];state.children=[];state.trace={};state.selected=null;state.focusChild=1;state.stopReason=null;
  state.best=[];state.avg=[];state.phase='evaluated';evaluate();
  history=[clone(state)];cursor=0;render();
}
const renderWithEnvironment=render;
render=function(){
  renderWithEnvironment();
  const count=state.best.length,latest=state.best.at(-1),previous=state.best.at(-2),stalled=stalledGenerations(state.best);
  const updated=count>1&&stalled===0;
  $('best-score').textContent=count?`${latest.toFixed(2)}%`:'—';
  $('best-record').classList.toggle('fresh',updated);
  $('best-record').classList.toggle('stopped',state.phase==='finished');
  $('best-update').textContent=state.phase==='finished'&&state.stopReason==='stagnation'
    ?`40세대 동안 갱신 없어 중지`
    :updated?`새 최고 기록! +${(latest-previous).toFixed(latest-previous<.01?3:2)}%p`
    :count===1?'첫 최고 점수 기록':count?`갱신 없이 ${stalled} / ${STAGNATION_LIMIT}세대`:'첫 세대 평가 전';
  $('scene-count').textContent=`환경 ${state.environmentRound||1} · ${state.generation}세대 · 최고 ${count?latest.toFixed(2)+'%':'평가 전'}`;
  $('previous').disabled=state.generation<=1;
  $('auto').disabled=state.phase==='finished';
  $('tip').textContent=state.phase==='finished'?'최고 점수가 40세대 연속 갱신되지 않아 실험을 멈췄습니다. 처음부터 또는 새 나무 배경에서 다시 시작할 수 있습니다.':state.environmentRound>1?'기존 나방 집단을 유지하고 새 나무 배경에서 점수를 다시 계산했습니다.':'다음 세대를 누르면 평가·선택·교차·변이를 한 번에 진행합니다.';
};
$('change-background').addEventListener('click',changeBackground);
$('rate').addEventListener('input',drawChart);
reset();
