/* A fixed, reproducible walk through the same pattern genome used in the lab. */
const GUIDE_FOREST={base:3,patches:[],theme:'natural',pattern:'normal',genes:makeForestGenome('natural','normal',()=>.5).genes};
let guideSeed=20261103;
function guideRandom(){guideSeed=(Math.imul(1664525,guideSeed)+1013904223)>>>0;return guideSeed/4294967296;}
function guideEvaluate(m){const result=patternScore(m,GUIDE_FOREST);m.score=result.score;m.error=result.mean;return m;}
function guideClone(m){return JSON.parse(JSON.stringify(m));}
function makeGuideRounds(){
  let population=Array.from({length:12},()=>guideEvaluate(patternGenome(guideRandom))),rounds=[];
  for(let r=0;r<1;r++){
    const before=population.map(guideClone);
    const weights=before.map(m=>m.score+1),total=weights.reduce((a,b)=>a+b,0);
    function choose(){const draw=guideRandom()*total;let accumulated=0;for(let i=0;i<12;i++){const low=accumulated;accumulated+=weights[i];if(draw<accumulated)return {index:i,draw,low,high:accumulated};}return {index:11,draw,low:accumulated-weights[11],high:accumulated};}
    const firstDraws=[choose(),choose()];
    const eliteIndex=before.reduce((best,m,i)=>m.score>before[best].score?i:best,0);
    const childrenBefore=[guideClone(before[eliteIndex])],sources=[Array(GENE_COUNT).fill(null)],childDraws=[null],childParents=[null];
    for(let i=1;i<12;i++){
      const draws=i===1?firstDraws:[choose(),choose()],parents=draws.map(d=>d.index);
      childDraws.push(draws);childParents.push(parents);
      const mix=Array.from({length:GENE_COUNT},()=>.15+guideRandom()*.7);
      const genes=mix.map((w,j)=>clamp(before[parents[0]].genes[j]*w+before[parents[1]].genes[j]*(1-w),PATTERN_GENES[j].min,PATTERN_GENES[j].max));
      childrenBefore.push(guideEvaluate({genes,mutations:[]}));sources.push(mix);
    }
    const childrenAfter=childrenBefore.map(guideClone),mutations=[];
    for(let i=1;i<12;i++)for(let j=0;j<GENE_COUNT;j++)if(guideRandom()<.05){
      const spec=PATTERN_GENES[j],old=childrenAfter[i].genes[j],span=spec.max-spec.min,delta=(guideRandom()+guideRandom()+guideRandom()-1.5)*span*.26;
      const reroll=guideRandom()<.08;
      childrenAfter[i].genes[j]=reroll?spec.min+guideRandom()*span:clamp(old+delta,spec.min,spec.max);childrenAfter[i].mutations.push(j);mutations.push({child:i,gene:j,old,next:childrenAfter[i].genes[j],reroll});
    }
    if(!mutations.length){const i=1,j=7,old=childrenAfter[i].genes[j];childrenAfter[i].genes[j]=clamp(old+.18,PATTERN_GENES[j].min,PATTERN_GENES[j].max);childrenAfter[i].mutations.push(j);mutations.push({child:i,gene:j,old,next:childrenAfter[i].genes[j],reroll:false});}
    childrenAfter.forEach(guideEvaluate);
    const focus=mutations[0].child;
    rounds.push({before,weights,total,draws:childDraws[focus],parents:childParents[focus],eliteIndex,childrenBefore,childrenAfter,sources,mutations,focus});
    population=childrenAfter.map(guideClone);
  }
  return rounds;
}
const GUIDE_ROUNDS=makeGuideRounds();
const guidePart1=[
  {kind:'intro',round:0,tag:'문제 소개',title:'어떤 나방이 나무껍질에 잘 숨을까요?',coach:'같은 나무 위에 무늬가 다른 나방 12마리가 있습니다. 이 중 배경에 잘 섞이는 무늬를 찾는 것이 목표입니다. 먼저 점수를 보지 않고 예상해 보세요.',hint:'실제 새의 공격은 일어나지 않습니다. 날개와 배경의 색 차이로 위장 점수를 계산합니다.'},
  {kind:'genome',round:0,tag:'무엇을 바꾸나요?',title:'날개 그림을 만드는 숫자 12개를 바꿉니다',coach:'바탕색 3개, 무늬색 3개, 무늬 형태를 정하는 숫자 6개가 한 나방의 유전자입니다. 알고리즘은 이 숫자 조합을 바꿔 더 잘 숨는 무늬를 찾습니다.',hint:'유전자는 완성된 그림이 아니라 그림을 다시 만드는 설계도입니다.'},
  {kind:'make',round:0,tag:'해 만들기',title:'나무와 나방의 무늬를 같은 원리로 만듭니다',coach:'나무와 나방 모두 반응·확산 흑백 무늬를 고르고, 기준값으로 두 영역을 나눈 뒤 각각 두 색을 입힙니다. 나무 무늬는 환경으로 고정하고 나방의 숫자만 진화시킵니다.',hint:'두 무늬의 생성 과정은 같지만, 나무의 숫자는 부모에게 전달되지 않습니다.'},
  {kind:'evaluate',round:0,tag:'① 평가',title:'12마리를 같은 기준으로 평가합니다',coach:'날개 여러 지점의 RGB 색을 같은 위치의 나무 무늬와 비교합니다. 평균 차이가 작을수록 위장 점수가 큽니다.',hint:'모든 나방을 동일한 나무 무늬와 표본 위치에서 비교합니다.'}
];
for(let r=0;r<1;r++){
  guidePart1.push({kind:'probability',round:r,tag:'03 부모 선택 · 1/2',title:'점수를 부모 선택 확률로 바꿉니다',coach:'나방마다 점수 + 1만큼 추첨 구간을 배정합니다. 구간이 넓을수록 부모가 될 가능성이 높지만, 낮은 점수에도 기회가 남습니다.',hint:'표의 점수와 선택 확률을 비교해 보세요.'});
  guidePart1.push({kind:'draw',round:r,tag:'03 부모 선택 · 2/2',title:'난수 두 개로 부모를 뽑습니다',coach:'전체 추첨 구간에서 난수를 두 번 뽑습니다. 각 난수가 들어간 구간의 나방이 이 자손의 부모 A와 B가 됩니다.',hint:'노란색으로 표시된 나방과 실제 난수 구간을 확인하세요.'});
  guidePart1.push({kind:'crossColor',round:r,tag:'04 유전자 교차 · 1/2',title:'부모의 바탕색·무늬색 숫자를 섞습니다',coach:'L*a*b* 색 좌표 여섯 개를 대응하는 부모 값끼리 가중평균합니다. 자손의 색은 두 부모 사이의 새로운 값이 됩니다.',hint:'표에서 부모 A 비율을 곱해 자손 색 좌표를 확인하세요.'});
  guidePart1.push({kind:'crossShape',round:r,tag:'04 유전자 교차 · 2/2',title:'무늬 종류와 크기도 섞습니다',coach:'무늬 종류·크기·기준값·늘이기·경계·작은 점의 숫자도 같은 방법으로 교차합니다. 그래서 색뿐 아니라 무늬 모양도 바뀝니다.',hint:'부모와 교차 직후 자손의 날개 모양을 비교하세요.'});
  guidePart1.push({kind:'mutation',round:r,tag:'05 돌연변이',title:'일부 숫자가 무작위로 달라집니다',coach:'교차가 끝난 자손의 일부 숫자에 작은 변화를 줍니다. 드물게 새 값을 뽑기도 합니다. 새 무늬의 점수는 오를 수도, 내릴 수도 있습니다.',hint:'표의 표시된 유전자와 변이 전후의 날개를 비교하세요.'});
  guidePart1.push({kind:'replace',round:r,tag:'06 세대 교체',title:'자손을 평가해 다음 세대로 넘깁니다',coach:'자손 11마리와 이전 세대 최고 나방 한 마리가 다음 집단이 됩니다. 최고 나방은 교차·변이 없이 보존합니다.',hint:'이 과정을 여러 세대 반복합니다. 다음 화면에서 새 숲과 새 나방 집단으로 직접 실행해 보세요.'});
}
let guidePart=1,guideFrame=0;
function guideFrames(){return guidePart1;}
function guidePopulation(pop,emphasis=[],reveal=true){
  return `<div class="pattern-guide-pop">${pop.map((m,i)=>`<div class="pattern-guide-moth ${emphasis.includes(i)?'emphasis':''}"><span>나방 ${i+1}</span><canvas width="150" height="100" data-guide-moth="${i}"></canvas><strong>${reveal?m.score.toFixed(1)+'%':'점수 ?'}</strong></div>`).join('')}</div>`;
}
function guideWorkedExample(round,kind,a,b,before,after){
  if(kind==='mutation'){
    const change=round.mutations.find(m=>m.child===round.focus),precision=change.gene<6?1:2;
    const old=change.old.toFixed(precision),next=change.next.toFixed(precision),delta=change.next-change.old;
    return `<div class="guide-worked"><span>한 유전자의 변화</span><h4>${PATTERN_GENES[change.gene].name}</h4><div class="guide-worked-flow"><div><small>교차 직후</small><strong>${old}</strong></div><b>→</b><div><small>${change.reroll?'새 숫자 뽑기':`변이 ${delta>=0?'+':''}${delta.toFixed(precision)}`}</small><strong>${next}</strong></div></div><p>바뀐 숫자로 날개 전체를 다시 그린 뒤 위장 점수를 다시 계산합니다.</p></div>`;
  }
  const j=kind==='crossColor'?0:7,w=round.sources[round.focus][j],digits=j<6?1:2;
  const av=a.genes[j].toFixed(digits),bv=b.genes[j].toFixed(digits),cv=before.genes[j].toFixed(digits);
  return `<div class="guide-worked"><span>한 유전자 계산 예시</span><h4>${PATTERN_GENES[j].name}</h4><div class="guide-worked-flow"><div><small>부모 A</small><strong>${av}</strong></div><b>× ${(w*100).toFixed(1)}% +</b><div><small>부모 B</small><strong>${bv}</strong></div><b>× ${((1-w)*100).toFixed(1)}% =</b><div class="result"><small>자손</small><strong>${cv}</strong></div></div><p>부모의 같은 유전자끼리 계산합니다. 나머지 유전자도 각자의 비율로 계산합니다.</p></div>`;
}
const GUIDE_GENE_INFO=[
  {short:'날개 바탕의 밝기',detail:'L*는 밝기를 나타냅니다. 값이 작으면 바탕이 어두워지고, 크면 밝아집니다.',low:'어두운 바탕',high:'밝은 바탕'},
  {short:'바탕의 초록 ↔ 빨강',detail:'a*는 색의 방향입니다. 음수 쪽은 초록, 양수 쪽은 빨강에 가까워집니다.',low:'초록 쪽',high:'빨강 쪽'},
  {short:'바탕의 파랑 ↔ 노랑',detail:'b*는 색의 방향입니다. 음수 쪽은 파랑, 양수 쪽은 노랑에 가까워집니다.',low:'파랑 쪽',high:'노랑 쪽'},
  {short:'무늬 부분의 밝기',detail:'날개 위에 덧입히는 무늬색의 밝기입니다. 바탕색 밝기와는 별도로 바뀝니다.',low:'어두운 무늬',high:'밝은 무늬'},
  {short:'무늬의 초록 ↔ 빨강',detail:'무늬색의 a* 값입니다. 음수 쪽은 초록, 양수 쪽은 빨강에 가까워집니다.',low:'초록 쪽',high:'빨강 쪽'},
  {short:'무늬의 파랑 ↔ 노랑',detail:'무늬색의 b* 값입니다. 음수 쪽은 파랑, 양수 쪽은 노랑에 가까워집니다.',low:'파랑 쪽',high:'노랑 쪽'},
  {short:'A~D 무늬를 섞는 위치',detail:'0은 A 무늬, 1은 B, 2는 C, 3은 D 무늬입니다. 소수점 값은 이웃한 두 무늬를 섞는 비율입니다. 예를 들어 1.70은 B 30%와 C 70%를 섞습니다. 숫자가 클수록 무조건 복잡해지는 것은 아닙니다.',low:'A 무늬',high:'D 무늬'},
  {short:'무늬가 반복되는 간격',detail:'값이 작으면 무늬의 일부를 크게 확대해 보고, 값이 크면 넓은 범위를 날개에 넣어 무늬가 더 촘촘해집니다.',low:'크고 넓은 무늬',high:'작고 촘촘한 무늬'},
  {short:'무늬색이 칠해질 범위',detail:'흑백 무늬에서 이 기준보다 밝은 곳을 무늬색으로 칠합니다. 기준값이 높을수록 무늬색 영역이 줄어듭니다.',low:'무늬색 영역이 넓음',high:'무늬색 영역이 좁음'},
  {short:'무늬의 세로 길이',detail:'값이 클수록 흑백 무늬를 세로 방향으로 늘여 긴 줄처럼 보이게 합니다.',low:'짧고 납작함',high:'세로로 길어짐'},
  {short:'색 경계의 대비',detail:'바탕색과 무늬색이 만나는 경계 근처의 밝기를 바꿉니다. 값이 클수록 경계가 더 또렷해집니다.',low:'부드러운 경계',high:'또렷한 경계'},
  {short:'작은 점의 양',detail:'큰 무늬와 별도로 작은 점을 추가하는 양입니다. 값이 클수록 작은 점이 더 자주 나타납니다.',low:'작은 점이 적음',high:'작은 점이 많음'}
];
const GUIDE_GENE_GROUPS=[
  {title:'바탕색',intro:'날개의 기본 색 · L*, a*, b*',indices:[0,1,2],className:'color'},
  {title:'무늬색',intro:'무늬가 칠해진 부분의 색 · L*, a*, b*',indices:[3,4,5],className:'color'},
  {title:'무늬의 큰 모양',intro:'어떤 무늬를 쓰고 어디까지 칠할지',indices:[6,7,8,9],className:'shape'},
  {title:'무늬의 세부 질감',intro:'경계와 작은 점을 다듬기',indices:[10,11],className:'texture'}
];
function guideGeneExplorer(m){
  const [base,mark]=geneColors(m);
  return `<div class="guide-gene-explorer"><div class="pattern-color-pair"><span><i style="background:${rgb(base)}"></i>바탕색 ${rgb(base)}</span><span><i style="background:${rgb(mark)}"></i>무늬색 ${rgb(mark)}</span></div><p class="guide-gene-invite">카드를 누르면 숫자의 뜻과 날개가 어떻게 바뀌는지 볼 수 있어요.</p>${GUIDE_GENE_GROUPS.map(group=>`<section class="guide-gene-group"><div class="guide-gene-group-title"><h4>${group.title}</h4><span>${group.intro}</span></div><div class="guide-gene-cards ${group.className}">${group.indices.map(j=>`<button type="button" data-guide-gene="${j}" aria-pressed="false"><span>${PATTERN_GENES[j].name}</span><strong>${geneDisplay(m,j)}</strong><small>${GUIDE_GENE_INFO[j].short}</small></button>`).join('')}</div></section>`).join('')}<div id="guide-gene-detail" class="guide-gene-detail" aria-live="polite"></div></div>`;
}
function guideGeneMeaning(m,j){
  if(j!==6)return '';
  const value=m.genes[j],low=Math.floor(value),high=Math.min(3,low+1),mix=Math.round((value-low)*100),names=['A','B','C','D'];
  return low===high?`${names[low]} 무늬`:`${names[low]} 무늬 ${100-mix}% + ${names[high]} 무늬 ${mix}%`;
}
function drawGuideGeneDetail(m,j){
  const root=$('guide-gene-detail');if(!root)return;
  document.querySelectorAll('[data-guide-gene]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.guideGene)===j)));
  const spec=PATTERN_GENES[j],info=GUIDE_GENE_INFO[j],meaning=guideGeneMeaning(m,j);
  root.innerHTML=`<div class="guide-gene-detail-head"><span>선택한 유전자</span><h4>${spec.name} <strong>${geneDisplay(m,j)}</strong></h4><p>${info.detail}</p>${meaning?`<p class="guide-gene-meaning">현재 값 ${geneDisplay(m,j)} = ${meaning}</p>`:''}</div><div class="guide-gene-variants">${[{name:'낮은 값',value:spec.min,caption:info.low},{name:'현재 값',value:m.genes[j],caption:'현재 나방'},{name:'높은 값',value:spec.max,caption:info.high}].map((item,i)=>`<div class="${i===1?'current':''}"><span>${item.name} <b>${j<6?item.value.toFixed(1):item.value.toFixed(2)}</b></span><canvas width="150" height="100" data-gene-variant="${i}" aria-label="${item.caption}일 때 나방 무늬"></canvas><small>${item.caption}</small></div>`).join('')}</div><p class="guide-gene-footnote">한 번에 이 숫자 하나만 바꾸고 나머지 유전자는 그대로 둔 모습입니다.</p>`;
  root.querySelectorAll('[data-gene-variant]').forEach(canvas=>{
    const variant=Number(canvas.dataset.geneVariant),copy={genes:[...m.genes]};
    if(variant===0)copy.genes[j]=spec.min;
    if(variant===2)copy.genes[j]=spec.max;
    paintPatternMoth(canvas.getContext('2d'),75,49,copy,.7,false,null);
  });
}
function guideVisual(frame){
  const round=GUIDE_ROUNDS[frame.round],kind=frame.kind,showAfter=kind==='replace',pop=showAfter?round.childrenAfter:round.before;
  const selected=kind==='draw'?round.parents:[],focus=round.focus,chosen=kind==='genome'||kind==='make'||kind==='evaluate'?round.before.reduce((best,m,i)=>m.score>round.before[best].score?i:best,0):focus;
  let extra='';
  if(kind==='genome'||kind==='make'||kind==='evaluate'){
    const m=round.before[chosen];
    const process=kind==='make'?`<div class="guide-dual-process"><div><h4>고정된 나무 무늬</h4>${patternStagesMarkup('forest-pattern-stages')}</div><div><h4>진화하는 나방 무늬</h4>${patternStagesMarkup('moth-pattern-stages')}</div></div>`:guideGeneExplorer(m);
    extra=`<div class="pattern-guide-detail"><div><h3>나방 ${chosen+1}의 설계도</h3><canvas id="guide-focus" width="250" height="140"></canvas>${kind==='evaluate'?`<p>평균 RGB 차이 <strong>${m.error.toFixed(2)}</strong> → 위장 점수 <strong>${m.score.toFixed(1)}%</strong></p>`:''}</div><div>${process}</div></div>`;
  }else if(kind==='probability'||kind==='draw'){
    extra=`<div class="guide-evidence"><h3>${kind==='draw'?'난수가 들어간 구간의 나방을 부모로 선택':'점수를 추첨 구간의 넓이로 변환'}</h3><div class="guide-probability">${round.before.map((m,i)=>`<div class="guide-prob-row ${selected.includes(i)?'chosen':''}"><span>나방 ${i+1}</span><strong>${m.score.toFixed(1)}%</strong><div><i style="width:${Math.min(100,round.weights[i]/round.total*380)}%"></i></div><b>${(round.weights[i]/round.total*100).toFixed(1)}%</b></div>`).join('')}</div>${kind==='draw'?`<div class="guide-draws">${round.draws.map((d,j)=>`<p>부모 ${j?'B':'A'}: 난수 ${d.draw.toFixed(1)} ∈ [${d.low.toFixed(1)}, ${d.high.toFixed(1)}) → <strong>나방 ${d.index+1}</strong></p>`).join('')}</div>`:''}</div>`;
  }else if(kind==='crossColor'||kind==='crossShape'||kind==='mutation'){
    const [a,b]=round.parents.map(i=>round.before[i]),before=round.childrenBefore[focus],after=round.childrenAfter[focus];
    const indices=kind==='crossColor'?[0,1,2,3,4,5]:kind==='crossShape'?[6,7,8,9,10,11]:after.mutations;
    const worked=guideWorkedExample(round,kind,a,b,before,after);
    const compare=kind==='mutation'
      ?'<div class="pattern-compare guide-mutation-compare"><div><span>교차 직후</span><canvas width="190" height="100" data-guide-compare="before"></canvas></div><div><span>변이 후</span><canvas width="190" height="100" data-guide-compare="after"></canvas></div></div>'
      :'<div class="pattern-compare"><div><span>부모 A</span><canvas width="190" height="100" data-guide-compare="a"></canvas></div><div><span>부모 B</span><canvas width="190" height="100" data-guide-compare="b"></canvas></div><div><span>교차 직후 자손</span><canvas width="190" height="100" data-guide-compare="before"></canvas></div></div>';
    extra=`<div class="guide-evidence"><h3>${kind==='mutation'? `자손 ${focus+1}: 교차 직후 → 변이 후`:`부모 A(${round.parents[0]+1}) + B(${round.parents[1]+1}) → 자손 ${focus+1}`}</h3>${worked}${compare}${kind==='mutation'?`<p class="guide-score-change">위장 점수 <strong>${before.score.toFixed(1)}%</strong> → <strong>${after.score.toFixed(1)}%</strong></p>`:''}${patternInheritance(a,b,before,round.sources[focus],kind==='mutation'?after:null,indices)}</div>`;
  }else if(kind==='replace'){
    extra=`<div class="guide-evidence"><h3>세대 변화</h3><div class="guide-result-metrics"><span>이전 최고 <strong>${Math.max(...round.before.map(m=>m.score)).toFixed(1)}%</strong></span><b>→</b><span>새 세대 최고 <strong>${Math.max(...round.childrenAfter.map(m=>m.score)).toFixed(1)}%</strong></span></div><p>이전 세대 최고였던 나방 ${round.eliteIndex+1}번을 변이 없이 보존했습니다.</p></div>`;
  }
  return `<div class="guide-scene"><div class="guide-scene-head"><div><span class="guide-kicker">PATTERN EVOLUTION</span><h2>같은 나무 무늬 · 다른 나방</h2></div><div class="guide-target"><span>고정된 나무 무늬</span><canvas id="guide-bark-preview" width="120" height="48" aria-label="반응·확산 원리로 만든 나무 무늬"></canvas></div></div>${guidePopulation(pop,selected,kind!=='intro'&&kind!=='genome'&&kind!=='make')}${extra}</div>`;
}
function drawGuideBark(){
  const canvas=$('guide-bark-preview');if(!canvas)return;
  const ctx=canvas.getContext('2d'),colors=geneColors(GUIDE_FOREST);
  for(let y=0;y<48;y+=2)for(let x=0;x<120;x+=2){
    ctx.fillStyle=rgb(forestPatternColor(GUIDE_FOREST,250+x*5,180+y*5,colors));ctx.fillRect(x,y,2,2);
  }
}
const GUIDE_SECTIONS=[
  {start:0,labels:['문제 살펴보기','유전자 12개','나무와 나방 무늬']},
  {start:3,labels:['위장 점수 계산']},
  {start:4,labels:['선택 확률','부모 추첨']},
  {start:6,labels:['색 유전자 교차','무늬 유전자 교차']},
  {start:8,labels:['변이 전후 비교']},
  {start:9,labels:['자손 평가와 교체']}
];
function sectionForFrame(index){
  for(let i=GUIDE_SECTIONS.length-1;i>=0;i--)if(index>=GUIDE_SECTIONS[i].start)return i+1;
  return 1;
}
function renderGuide(){
  const frames=guideFrames(),frame=frames[guideFrame];
  guidePart=sectionForFrame(guideFrame);
  const section=GUIDE_SECTIONS[guidePart-1],local=guideFrame-section.start;
  $('course-part-label').textContent=`STEP ${String(guidePart).padStart(2,'0')} / 07`;
  $('tutorial-count').textContent=`${guidePart}단계 · 소단계 ${local+1} / ${section.labels.length}`;
  for(let i=1;i<=7;i++)$('course-part-'+i).classList.toggle('active',i===guidePart);
  $('guide-step-strip').innerHTML=section.labels.map((label,i)=>`<span class="${i===local?'active':''}">${label}</span>`).join('');
  const strip=$('guide-step-strip'),active=strip.querySelector('.active');
  strip.scrollLeft=active.offsetLeft-strip.offsetLeft-strip.clientWidth/2+active.clientWidth/2;
  $('tutorial-visual').innerHTML=guideVisual(frame);
  drawGuideBark();
  $('tutorial-coach').innerHTML=`<div class="guide-coach"><span>${frame.tag}</span><h2>${frame.title}</h2><p>${frame.coach}</p><div>${frame.hint}</div></div>`;
  $('tutorial-prev').disabled=guideFrame===0;
  $('tutorial-next').textContent=guideFrame===frames.length-1?'직접 실험하기 →':'다음 →';
  const pop=frame.kind==='replace'?GUIDE_ROUNDS[frame.round].childrenAfter:GUIDE_ROUNDS[frame.round].before;
  document.querySelectorAll('[data-guide-moth]').forEach(canvas=>paintPatternMoth(canvas.getContext('2d'),75,49,pop[Number(canvas.dataset.guideMoth)],.7,false,null));
  const focus=$('guide-focus');if(focus){const chosen=pop.reduce((best,m,i)=>m.score>pop[best].score?i:best,0);paintPatternMoth(focus.getContext('2d'),125,69,pop[chosen],1.2,false,null);}
  if(frame.kind==='genome'||frame.kind==='evaluate'){
    const chosen=pop.reduce((best,m,i)=>m.score>pop[best].score?i:best,0);
    drawGuideGeneDetail(pop[chosen],6);
  }
  if(frame.kind==='make'){
    const chosen=pop.reduce((best,m,i)=>m.score>pop[best].score?i:best,0);
    drawPatternStages(GUIDE_FOREST,$('forest-pattern-stages'),true);
    drawPatternStages(pop[chosen],$('moth-pattern-stages'));
  }
  if(['crossColor','crossShape','mutation'].includes(frame.kind)){
    const round=GUIDE_ROUNDS[frame.round],models={a:round.before[round.parents[0]],b:round.before[round.parents[1]],before:round.childrenBefore[round.focus],after:round.childrenAfter[round.focus]};
    document.querySelectorAll('[data-guide-compare]').forEach(canvas=>paintPatternMoth(canvas.getContext('2d'),95,49,models[canvas.dataset.guideCompare],.95,false,null));
  }
}
function showCoursePart(part){
  stopAuto();
  guidePart=part;$('tutorial-page').classList.toggle('hidden',part===7);$('lab-pages').classList.toggle('hidden',part!==7);
  for(let i=1;i<=7;i++)$('course-part-'+i).classList.toggle('active',i===part);
  $('course-part-label').textContent=`STEP ${String(part).padStart(2,'0')} / 07`;
  if(part<7){guideFrame=GUIDE_SECTIONS[part-1].start;renderGuide();}
  else{showPage('experiment');if(state.phase==='initial')step();}
}
for(let i=1;i<=7;i++)$('course-part-'+i).addEventListener('click',()=>showCoursePart(i));
$('tutorial-visual').addEventListener('click',event=>{
  const button=event.target.closest('[data-guide-gene]');if(!button)return;
  const pop=GUIDE_ROUNDS[guideFrames()[guideFrame].round].before;
  const chosen=pop.reduce((best,m,i)=>m.score>pop[best].score?i:best,0);
  drawGuideGeneDetail(pop[chosen],Number(button.dataset.guideGene));
});
$('tutorial-prev').addEventListener('click',()=>{if(guideFrame>0){guideFrame--;renderGuide();}});
$('tutorial-next').addEventListener('click',()=>{if(guideFrame<guideFrames().length-1){guideFrame++;renderGuide();}else showCoursePart(7);});
$('tutorial-reset').addEventListener('click',()=>showCoursePart(1));
renderGuide();
