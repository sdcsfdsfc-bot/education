/* The numerical timeline is generated with the bundled offline WebM. */
(function(root){
'use strict';
const model=root.ACO_LESSON_VIDEO;
const $=id=>document.getElementById(id), video=$('lessonVideo');
function stateAt(seconds){
 const time=Math.max(0,Math.min(model.duration,Number(seconds)||0));
 const completed=model.steps.filter(step=>step.arrival<=time+1e-8).length;
 const active=Math.min(model.steps.length-1,Math.floor(time/model.antSeconds));
 return {time,completed,active,snapshot:model.snapshots[completed]};
}
function render(){
 const state=stateAt(video.currentTime),previous=model.snapshots[Math.max(0,state.completed-1)];
 $('movieProgress').textContent=`완주 ${state.completed} / ${model.steps.length}마리`;
 model.routes.forEach((route,i)=>{
  $('movieCount'+route.id).textContent=state.snapshot.counts[i]+'회';
  $('movieTau'+route.id).textContent=state.snapshot.tau[i].toFixed(3);
  const old=previous.probabilities[i]*100,now=state.snapshot.probabilities[i]*100;
  $('movieProb'+route.id).textContent=state.completed?`${old.toFixed(1)}% → ${now.toFixed(1)}%`:`${now.toFixed(1)}%`;
 });
 const next=model.steps[state.active],route=model.routes[next.route];
 $('movieStatus').textContent=state.completed===model.steps.length?'12마리 완주 · 탐색 예시가 끝났습니다.':state.time>=next.arrival?`개미 ${state.active+1}번 · ${route.id} 경로 완주`:`개미 ${state.active+1}번 · ${route.id} 경로 이동 중`;
 if(state.completed){
  const step=model.steps[state.completed-1],finished=model.routes[step.route];
  const after=model.snapshots[state.completed].probabilities[step.route]*100;
  $('movieUpdate').textContent=`최근 완주 ${finished.id}: τ ${step.beforeTau.toFixed(3)} × 0.8 + 10/${finished.time} = ${step.afterTau.toFixed(3)} · 다음 선택 확률 ${(step.beforeProbability*100).toFixed(1)}% → ${after.toFixed(1)}%`;
 }else $('movieUpdate').textContent='초기 상태: 모든 τ=1.000 · A 21.7%, B 38.6%, C 25.8%, D 13.9%';
 $('movieNext').disabled=state.completed>=model.steps.length;
 $('moviePlay').textContent=video.paused?(video.ended?'▶ 다시 재생':'▶ 영상 재생'):'Ⅱ 영상 일시정지';
}
function reset(){video.pause();video.currentTime=0;render();}
$('moviePlay').onclick=async()=>{
 if(!video.paused){video.pause();return;}
 if(video.ended)video.currentTime=0;
 try{await video.play();}catch{
  $('movieStatus').textContent='영상을 열지 못했습니다. media 폴더와 영상 파일이 함께 있는지 확인하세요.';
 }
};
$('movieReset').onclick=reset;
$('movieNext').onclick=()=>{
 const state=stateAt(video.currentTime);
 if(state.completed>=model.steps.length)return;
 video.pause();video.currentTime=model.steps[state.completed].arrival+.05;render();
};
$('movieSpeed').onchange=()=>{video.playbackRate=Number($('movieSpeed').value);};
for(const event of ['loadedmetadata','timeupdate','seeked','play','pause','ended'])video.addEventListener(event,render);
video.addEventListener('error',()=>{
 $('movieStatus').textContent='영상 파일을 열지 못했습니다. media/aco-step6.webm이 함께 있는지 확인하세요.';
});
root.LessonVideo={stateAt,reset,onLessonChange(index){if(index!==5)video.pause();render();}};
render();
})(typeof window==='undefined'?globalThis:window);
