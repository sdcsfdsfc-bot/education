'use strict';
const $=id=>document.getElementById(id), M=ACO;
let edges=M.defaults(), iteration=0, best=null, history=[], records=[], running=false;
let pending=null, progress=0, previous=null, selected='X03', lastFrame=0, phase=0;
let lessonIndex=0;
let activeView='learn';
const phaseNames=['환경 준비','확률로 탐색','이동시간 평가','페로몬 증발','페로몬 보강','반복·비교'];
const phaseDurations=[0,9000,1100,1000,1100,1000];
const f=(n,d=1)=>Number.isFinite(n)?n.toFixed(d):'통행 불가';
const formatTau=(n,d=2)=>n>0&&n<.01?n.toExponential(1):n.toFixed(d);
const name=id=>M.nodes.find(n=>n.id===id).name;
const path=p=>p?.nodes?.map(name).join(' → ')||'아직 발견하지 못함';
const routeName=p=>!p?.ids?.length?'경로 없음':M.routeKey(p)?`경로 ${M.routeKey(p)}`:'조합 경로';
const config=()=>Object.fromEntries(['count','limit','alpha','beta','rho'].map(id=>[id,Number($(id).value)]));
const samePath=(a,b)=>!!a&&!!b&&a.ids.join(',')===b.ids.join(',');
function normalize(el){
 let v=Number(el.value);
 if(!Number.isFinite(v)||el.value==='')v=Number(el.min);
 v=Math.max(Number(el.min),Math.min(Number(el.max),v));
 if(['count','limit'].includes(el.id))v=Math.round(v);
 el.value=v;return v;
}
function setStatus(){
 $('play').textContent=running?'Ⅱ 일시정지':'▶ 탐색 재생';
 $('status').textContent=`${iteration} / ${config().limit} 반복 완료 · ${phaseNames[phase]}${running?' · 진행 중':pending?' · 일시정지':''}`;
}
function showView(view,focus=false){
 activeView=view==='simulation'?'simulation':'learn';
 for(const [key,tab,panel] of [['learn','learnViewTab','learnViewPanel'],['simulation','simulationViewTab','simulationViewPanel']]){
  const active=activeView===key;
  $(tab).classList.toggle('active',active);
  $(tab).setAttribute('aria-selected',String(active));
  $(tab).tabIndex=active?0:-1;
  $(panel).hidden=!active;
 }
 if(activeView==='learn'){running=false;setStatus();}
 globalThis.LessonVideo?.onLessonChange(activeView==='learn'?lessonIndex:-1);
 if(focus)$(activeView==='learn'?'learnViewTab':'simulationViewTab').focus();
}
function showLesson(index){
 lessonIndex=Math.max(0,Math.min(5,index));
 $('phaseStatus').textContent=`설명 ${lessonIndex+1} / 6 · ${phaseNames[lessonIndex]}`;
 $('lessonProgress').style.width=`${(lessonIndex+1)/6*100}%`;
 $('lessonPrev').disabled=lessonIndex===0;
 $('lessonNext').textContent=lessonIndex===5?'시뮬레이션으로 →':'다음 단계 →';
 $('lessonNext').setAttribute('aria-label',lessonIndex===5?'학습을 마치고 시뮬레이션으로 이동':`${lessonIndex+2}단계 설명 보기`);
 for(let i=0;i<6;i++){
  const active=lessonIndex===i;
  $('phase'+i).hidden=!active;
  $('phase'+i).classList.toggle('active',active);
  $('phase'+i).setAttribute('aria-hidden',String(!active));
  $('phase'+i).setAttribute('aria-current',active?'step':'false');
  $('lessonTab'+i).classList.toggle('active',active);
  $('lessonTab'+i).setAttribute('aria-current',active?'step':'false');
 }
 globalThis.LessonVideo?.onLessonChange(activeView==='learn'?lessonIndex:-1);
}
function clearSearch(){
 running=false;pending=null;progress=0;phase=0;iteration=0;best=null;history=[];records=[];
 edges.forEach(e=>e.tau=1);showLesson(0);render();
}
function snapshot(){
 const p=best||M.dijkstra(edges);
 return p?{...p,ids:[...p.ids],nodes:[...p.nodes],source:best?'ACO 추천':'다익스트라 기준 (ACO 탐색 전)'}:{source:'도달 가능한 경로 없음',ids:[],nodes:[],time:Infinity};
}
function roadChange(change){previous=snapshot();change();clearSearch();fillEditor();}
function begin(){
 if(iteration>=config().limit)return;
 const c=config();pending=Array.from({length:c.count},()=>M.ant(edges,c.alpha,c.beta));
 phase=1;progress=0;showLesson(phase);render();showProb(pending[0]);
}
function advance(){
 if(!pending){begin();return;}
 progress=0;
 if(phase===1){
  phase=2;
  pending.forEach((a,i)=>{
   records.push({...a,round:iteration+1,number:i+1});
   if(!a.failed&&(!best||a.time<best.time))best=a;
  });
  records=records.slice(-500);
 }else if(phase===2){phase=3;M.evaporate(edges,config().rho);}
 else if(phase===3){phase=4;M.reinforce(edges,pending);}
 else if(phase===4){
  phase=5;iteration++;history.push(best?.time??null);pending=null;
  if(iteration>=config().limit)running=false;
 }
 showLesson(phase);render();if(pending)showProb(pending[0]);
}
function curve(e){
 const a=M.nodes.find(n=>n.id===e.from),b=M.nodes.find(n=>n.id===e.to);
 const length=Math.hypot(b.x-a.x,b.y-a.y)||1,bend=e.bend||0;
 return {a,b,c:{x:(a.x+b.x)/2-(b.y-a.y)/length*bend,y:(a.y+b.y)/2+(b.x-a.x)/length*bend}};
}
function point(e,t){const {a,b,c}=curve(e),u=1-t;return {x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y};}
function drawMap(t=0){
 const max=Math.max(1,...edges.map(e=>e.tau));
 const roadWidth=e=>9+5*Math.log1p(e.tau)/Math.log1p(max);
 const roadPath=e=>{const {a,b,c}=curve(e);return `M${a.x},${a.y} Q${c.x},${c.y} ${b.x},${b.y}`;};
 const masks=edges.map(e=>`<mask id="roadCut${e.id}" maskUnits="userSpaceOnUse" x="0" y="0" width="940" height="690" style="mask-type:luminance"><rect width="940" height="690" fill="white"/><path d="${roadPath(e)}" fill="none" stroke="black" stroke-width="${roadWidth(e)-3}" stroke-linecap="round"/></mask>`).join('');
 let s=`<defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 H 0 V 40" fill="none" stroke="#e8edef"/></pattern>${masks}</defs><rect width="940" height="690" fill="url(#grid)"/>`;
 s+='<path d="M0 666 Q200 651 400 670 T940 663" fill="none" stroke="#daebf1" stroke-width="20"/><text x="740" y="682" fill="#89a9b7" font-size="11">가상의 도심 하천</text>';
 const sorted=edges.slice().sort((a,b)=>(a.id===selected)-(b.id===selected));
 const labels=[],trails=[];
 for(const e of sorted){
  const color=e.closed?'#a6acb0':e.congestion>=2?'#d76455':e.congestion>1?'#dc983b':e.route?'#389e8d':'#57958f';
  const w=roadWidth(e),recommended=best?.ids.includes(e.id),chosen=e.id===selected,d=roadPath(e);
  const dash=e.closed?'stroke-dasharray="7 6"':'';
  s+=`<g data-edge="${e.id}" tabindex="0" role="button" aria-label="${e.id} ${name(e.from)}에서 ${name(e.to)}, ${e.closed?'통제':f(M.time(e))+'분'}, 편집"><title>${e.id} · ${name(e.from)} ↔ ${name(e.to)}: ${f(M.time(e),2)}분, 페로몬 ${formatTau(e.tau,3)}</title><g mask="url(#roadCut${e.id})" pointer-events="none">${chosen||recommended?`<path d="${d}" fill="none" stroke="${chosen?'#d6a639':'#7bafd0'}" stroke-width="${w+5}" ${dash}/>`:''}<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" ${dash}/></g><path d="${d}" fill="none" stroke="transparent" stroke-width="${w+8}" pointer-events="stroke"/></g>`;
  const {a,b}=curve(e),level=Math.log2(1+e.tau);
  const count=Math.min(64,Math.max(0,Math.round(Math.hypot(b.x-a.x,b.y-a.y)/38*Math.min(4,level))));
  let beads='';
  for(let k=0;k<count;k++){
   const p=point(e,.08+.84*(k+.5)/count);
   beads+=`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(1.3+Math.min(1.4,level*.6)).toFixed(2)}"/>`;
  }
  trails.push(`<g class="pheromone-trail" data-pheromone-road="${e.id}" data-tau="${e.tau}" fill="#8056bb" opacity="${e.closed?.2:Math.min(.94,.18+level*.43)}" pointer-events="none">${beads}</g>`);
  const times=$('showTimes').checked||chosen,pheromone=$('showPheromone').checked||chosen;
  if(times||pheromone){
   const p=point(e,.52),height=times&&pheromone?34:21,width=pheromone?92:78;
   const upper=times?`${e.id} · ${e.closed?'통제':f(M.time(e))+'분'}`:`${e.id} · τ ${formatTau(e.tau)}`;
   labels.push(`<g data-edge="${e.id}" data-pheromone-label="${pheromone}" style="cursor:pointer"><rect x="${p.x-width/2}" y="${p.y-height/2}" width="${width}" height="${height}" rx="5" fill="${chosen?'#fff5d5':'white'}" fill-opacity=".94" stroke="${chosen?'#e2bb55':'#ddcfe9'}"/><text x="${p.x}" y="${p.y+(times&&pheromone?-3:4)}" text-anchor="middle" font-size="10" fill="${times?'#41545e':'#7248a9'}">${upper}</text>${times&&pheromone?`<text x="${p.x}" y="${p.y+11}" text-anchor="middle" font-size="10" fill="#7248a9">페로몬 τ ${formatTau(e.tau)}</text>`:''}</g>`);
  }
 }
 s+=trails.join('')+labels.join('');
 for(const n of M.nodes){
  const terminal=['H','D'].includes(n.id);
  s+=`<circle cx="${n.x}" cy="${n.y}" r="${terminal?23:12}" fill="${terminal?(n.id==='H'?'#087e83':'#dd735b'):'white'}" stroke="${terminal?'white':'#6d8590'}" stroke-width="3"/>${terminal?`<text x="${n.x}" y="${n.y+7}" fill="white" font-size="22" text-anchor="middle">${n.id==='H'?'+':'!'}</text>`:''}<text x="${n.x}" y="${n.y+(terminal?43:29)}" text-anchor="middle" font-size="12" font-weight="600" fill="#28434e" stroke="#f4f7f8" stroke-width="4" paint-order="stroke">${n.name}</text>`;
 }
 if(pending&&phase>=1){
  pending.forEach((a,i)=>{
   const local=phase===1?Math.max(0,Math.min(1,(t-i/pending.length*.2)/.8)):1;
   const seg=local*a.ids.length,k=Math.min(Math.floor(seg),a.ids.length-1);
   let p=M.nodes.find(n=>n.id===a.nodes[0]);
   if(k>=0){const e=edges.find(e=>e.id===a.ids[k]),q=local===1?1:seg-k;p=point(e,e.from===a.nodes[k]?q:1-q);}
   s+=`<circle cx="${p.x}" cy="${p.y+(i%5-2)*2}" r="3.5" fill="${a.failed&&local===1?'#e59999':'#ffe08a'}" stroke="#69502a" stroke-width="1"/>`;
  });
 }
 $('map').innerHTML=s;
}
function showProb(a){
 const decisions=a?.decisions||[{node:'H',choices:M.choices('H',['H'],edges,config().alpha,config().beta)}];
 $('probabilities').innerHTML=`<p class="sub">${a?'현재 관찰 중인 개미가 각 갈림길에서 실제로 사용한 확률입니다. ✓는 선택한 도로입니다. 당시 τ는 추첨할 때의 값이며 지도에는 지금 남은 값이 표시됩니다.':'다음 개미가 병원에서 출발할 때의 선택 확률입니다.'}</p><div class="junction-grid">`+decisions.map(d=>`<section class="junction"><div class="junction-heading"><b>${name(d.node)}</b><span>${d.picked?'선택 '+d.picked:'출발 준비'}</span></div>`+(d.choices.length?d.choices.map(c=>`<div class="prob-option ${c.id===d.picked?'picked':''}"><div class="prob-meta"><span>${c.id} → ${name(c.next)}${c.id===d.picked?' ✓':''}</span><b>${(c.p*100).toFixed(1)}%</b></div><div class="bar"><i style="width:${c.p*100}%"></i></div><span class="prob-time">해당 도로 ${f(c.time)}분 · 당시 τ ${formatTau(c.tau)}</span></div>`).join(''):'<p class="sub">이동 가능한 도로 없음</p>')+'</section>').join('')+'</div>';
}
function chart(){
 const vals=history.filter(v=>v!==null),exact=M.dijkstra(edges)?.time,upper=Math.max(15,...vals,exact||0)*1.1;
 const x=i=>40+i/Math.max(history.length-1,1)*340,y=v=>130-v/upper*110;let s='';
 for(let i=0;i<4;i++){const v=upper*i/3;s+=`<line x1="40" y1="${y(v)}" x2="385" y2="${y(v)}" stroke="#e6ebed"/><text x="33" y="${y(v)+4}" text-anchor="end" font-size="10" fill="#819099">${v.toFixed(0)}</text>`;}
 if(Number.isFinite(exact))s+=`<line x1="40" y1="${y(exact)}" x2="385" y2="${y(exact)}" stroke="#a98655" stroke-dasharray="5 4"/>`;
 const pts=history.map((v,i)=>v===null?null:`${x(i)},${y(v)}`).filter(Boolean);
 if(pts.length)s+=`<polyline points="${pts.join(' ')}" fill="none" stroke="#087e83" stroke-width="2.5"/>`+history.map((v,i)=>v===null?'':`<circle cx="${x(i)}" cy="${y(v)}" r="2.5" fill="#087e83"/>`).join('');
 else s+='<text x="210" y="70" text-anchor="middle" font-size="12" fill="#819099">반복을 완료하면 기록됩니다</text>';
 s+=`<text x="4" y="12" font-size="10" fill="#819099">분</text><text x="40" y="151" font-size="10" fill="#819099">1회</text><text x="365" y="151" font-size="10" fill="#819099">${history.length||0}회</text>`;$('chart').innerHTML=s;
}
function render(){
 setStatus();drawMap(phase===1?progress:1);
 const exact=M.dijkstra(edges),shortest=M.dijkstra(edges,'distance');
 $('networkInfo').textContent=`${M.nodes.length}개 장소 · ${edges.length}개 도로 · 연결 도로 ${edges.filter(e=>!e.route).length}개. 개미는 중간 장소에서 자유롭게 길을 바꾸며 탐색합니다.`;
 const values=edges.map(e=>e.tau);
 $('pheromoneSummary').textContent=`${phaseNames[phase]} · 남은 페로몬: 최소 τ ${formatTau(Math.min(...values))} / 최대 τ ${formatTau(Math.max(...values))} · 초기값 τ 1.00`;
 $('edgePheromone').textContent=`선택 도로 ${selected} · 현재 페로몬 τ ${formatTau(edges.find(e=>e.id===selected).tau)}`;
 $('recommend').innerHTML=best?`<div class="value">${routeName(best)} · ${f(best.time)}분</div><div class="routepath">${path(best)}</div><span class="sub">도로 ${best.ids.join(' → ')}<br>총 ${f(best.distance)} km · 출발 후 약 ${f(best.time)}분 도착</span>`:'<div class="value" style="font-size:19px">탐색을 시작하세요</div><p class="sub">재생 또는 다음 단계로 개미를 출발시킵니다.</p>';
 $('exact').innerHTML=exact?`<b>다익스트라: ${routeName(exact)} · ${f(exact.time)}분</b><br>${path(exact)}<br>${best?(samePath(best,exact)?'ACO와 경로 일치 · 시간 차이 0.0분':`ACO와 경로 다름 · 시간 차이 ${f(best.time-exact.time)}분`):'ACO 결과 대기 중'}`:'현재 통제 조건에서는 목적지에 도달할 수 없습니다.';
 if(shortest)$('exact').innerHTML+=`<br><span class="sub">거리만 최소화하면 ${f(shortest.distance)} km · ${f(shortest.time)}분</span>`;
 if(previous){
  const old=previous.ids.length?M.evaluate(previous.ids,edges):null;
  $('comparison').innerHTML=`<b>변경 전</b> ${routeName(previous)} · ${f(previous.time)}${Number.isFinite(previous.time)?'분':''} <span class="sub">(${previous.source})</span><br><span class="sub">${path(previous)}</span><br><b>기존 경로를 그대로 이용하면</b> ${old?f(old.time)+(Number.isFinite(old.time)?'분':''):'경로 없음'}<br><b>변경 후 ACO</b> ${best?`${routeName(best)} · ${f(best.time)}분`:'재탐색 대기'}<br><b>변경 후 정확한 기준</b> ${exact?`${routeName(exact)} · ${f(exact.time)}분`:'도달 불가'}${exact?`<br><span class="sub">${path(exact)}</span>`:''}`;
 }
 $('records').innerHTML=records.slice().reverse().map((a,i)=>`<tr><td><button data-record="${records.length-1-i}" style="padding:3px 7px">${a.round}회 / ${a.number}번</button></td><td>${routeName(a)} · ${path(a)}</td><td>${f(a.distance)} km</td><td>${a.failed?'도달 실패':f(a.time)+'분'}</td></tr>`).join('');
 $('recordCount').textContent=`평가 ${iteration*config().count+(pending&&phase>=2?pending.length:0)}마리 · 최근 ${records.length}개 표시`;
 $('roads').innerHTML=edges.map(e=>`<tr><td>${e.id}${e.route?'':' (연결)'} · ${name(e.from)} ↔ ${name(e.to)}</td><td>${f(e.length)} km</td><td>${f(e.speed/e.congestion)} km/h</td><td>${f(e.wait,0)}초</td><td>${e.closed?'통제':f(M.time(e))+'분'}</td><td>${formatTau(e.tau,3)}</td></tr>`).join('');
 showProb();chart();
}
function fillEditor(){
 const e=edges.find(e=>e.id===selected);$('edgeSelect').value=selected;
 ['length','speed','wait','congestion'].forEach(k=>$(k).value=e[k]);$('closed').checked=e.closed;
 $('edgeTime').textContent=e.closed?'통제 중 · 경로 탐색에서 제외':`유효속도 ${f(e.speed/e.congestion)} km/h · 도로 시간 ${f(M.time(e),2)}분`;
 $('edgePheromone').textContent=`선택 도로 ${selected} · 현재 페로몬 τ ${formatTau(e.tau)}`;
}
function selectEdge(id){selected=id;fillEditor();drawMap(phase===1?progress:1);}
function frame(now){
 const delta=Math.min(now-lastFrame,100);lastFrame=now;
 if(running){
  if(phase===0)begin();
  else{
   progress+=delta/phaseDurations[phase]*Number($('playSpeed').value);
   if(progress>=1)advance();else if(phase===1)drawMap(progress);
  }
  setStatus();
 }
 requestAnimationFrame(frame);
}
$('edgeSelect').innerHTML=edges.map(e=>`<option value="${e.id}">${e.id}${e.route?'':' (연결)'} · ${name(e.from)} ↔ ${name(e.to)}</option>`).join('');
$('edgeSelect').onchange=e=>selectEdge(e.target.value);
$('map').addEventListener('click',e=>{const g=e.target.closest('[data-edge]');if(g)selectEdge(g.dataset.edge);});
$('map').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const g=e.target.closest('[data-edge]');if(g){e.preventDefault();selectEdge(g.dataset.edge);}}});
$('showTimes').onchange=()=>drawMap(phase===1?progress:1);
$('showPheromone').onchange=()=>drawMap(phase===1?progress:1);
['length','speed','wait','congestion'].forEach(k=>{
 $(k).addEventListener('input',()=>{if($(k).value===''||!$(k).validity.valid)return;roadChange(()=>edges.find(e=>e.id===selected)[k]=Number($(k).value));});
 $(k).addEventListener('change',()=>{const v=normalize($(k));if(edges.find(e=>e.id===selected)[k]!==v)roadChange(()=>edges.find(e=>e.id===selected)[k]=v);});
});
$('closed').onchange=()=>roadChange(()=>edges.find(e=>e.id===selected).closed=$('closed').checked);
['count','limit','alpha','beta','rho'].forEach(k=>$(k).onchange=()=>{normalize($(k));clearSearch();});
$('play').onclick=()=>{if(iteration>=config().limit)clearSearch();running=!running;setStatus();};
$('step').onclick=()=>{running=false;if(iteration>=config().limit)clearSearch();advance();};
$('incident').onclick=()=>roadChange(()=>{edges=M.defaults();const road=edges.find(e=>e.id==='X03');road.congestion=1+8/(road.length/road.speed*60);selected='X03';});
$('reset').onclick=()=>{
 edges=M.defaults();previous=null;selected='X03';
 for(const [k,v] of Object.entries({count:20,limit:40,alpha:1,beta:2,rho:.3,playSpeed:1}))$(k).value=v;
 $('showTimes').checked=false;
 $('showPheromone').checked=true;
 globalThis.LessonVideo?.reset();
 $('comparison').textContent='도로를 편집하거나 ‘중앙역 우회로 혼잡 예시’를 눌러 비교하세요.';
 clearSearch();fillEditor();
};
$('records').onclick=e=>{const btn=e.target.closest('[data-record]');if(btn)showProb(records[Number(btn.dataset.record)]);};
$('lessonPrev').onclick=()=>showLesson(lessonIndex-1);
$('lessonNext').onclick=()=>{
 if(lessonIndex<5)showLesson(lessonIndex+1);
 else{
  showView('simulation');
  $('simulationControls').scrollIntoView({behavior:'smooth',block:'start'});
  $('simulationControls').focus({preventScroll:true});
 }
};
for(let i=0;i<6;i++)$('lessonTab'+i).onclick=()=>showLesson(i);
$('lessonSection').addEventListener('keydown',e=>{
 if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,select,textarea,video,[data-movie-control],[contenteditable="true"]'))return;
 let next=lessonIndex;
 if(e.key==='ArrowRight'||e.key==='PageDown')next++;
 else if(e.key==='ArrowLeft'||e.key==='PageUp')next--;
 else if(e.key==='Home')next=0;
 else if(e.key==='End')next=5;
 else return;
 e.preventDefault();showLesson(next);
});
$('lessonVideo').addEventListener('play',()=>{running=false;setStatus();});
$('learnViewTab').onclick=()=>showView('learn');
$('simulationViewTab').onclick=()=>showView('simulation');
$('viewTabs').addEventListener('keydown',e=>{
 if(e.altKey||e.ctrlKey||e.metaKey)return;
 let view;
 if(e.key==='ArrowLeft'||e.key==='ArrowRight')view=activeView==='learn'?'simulation':'learn';
 else if(e.key==='Home')view='learn';
 else if(e.key==='End')view='simulation';
 else return;
 e.preventDefault();showView(view,true);
});
showLesson(0);showView('learn');render();fillEditor();requestAnimationFrame(frame);
