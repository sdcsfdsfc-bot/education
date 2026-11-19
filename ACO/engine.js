/* Browser-local ACO model. Time: minutes; length: km; speed: km/h. */
(function(root){
'use strict';
const nodes=[{id:'H',x:60,y:340,name:'병원'},{id:'A1',x:255,y:160,name:'북문'},{id:'A2',x:570,y:120,name:'시청'},{id:'B1',x:320,y:320,name:'중앙역'},{id:'B2',x:610,y:300,name:'시장'},{id:'C1',x:180,y:470,name:'공원'},{id:'C2',x:650,y:480,name:'강변'},{id:'D1',x:165,y:65,name:'대학교'},{id:'D2',x:440,y:60,name:'과학관'},{id:'E1',x:360,y:535,name:'도서관'},{id:'E2',x:770,y:560,name:'체육관'},{id:'F1',x:100,y:610,name:'물류센터'},{id:'F2',x:510,y:620,name:'남문'},{id:'D',x:880,y:300,name:'사고 현장'}];
const baseRoutes={A:['H','A1','A2','D'],B:['H','B1','B2','D'],C:['H','C1','C2','D'],D:['H','D1','D2','D'],E:['H','E1','E2','D'],F:['H','F1','F2','D']};
// B now uses the university-side detour; Central Station–Market has no direct road.
const routes={...baseRoutes,B:['H','B1','D2','D']};
function defaults(){
 const main=Object.entries(baseRoutes).flatMap(([r,ns])=>ns.slice(0,-1).map((n,i)=>({id:r+(i+1),from:n,to:ns[i+1],route:r,length:({A:[.8,.8,.8],B:[1,1.1,1],C:[1.1,1.3,1.1],D:[1.3,1.4,1.3],E:[1.5,1.6,1.5],F:[1.6,1.8,1.6]})[r][i],speed:30,wait:({A:[144,144,144],B:[56,56,56],C:[80,80,80],D:[100,100,100],E:[96,96,96],F:[120,120,120]})[r][i],congestion:1,closed:false,tau:1,bend:({A:[-18,-12,-30],B:[-15,18,-12],C:[20,30,22],D:[-45,-12,-70],E:[45,35,35],F:[60,35,70]})[r][i]}))).filter(e=>e.id!=='B2');
 const links=[['D1','A1',.7,55],['D2','A2',.6,35],['D2','B1',.8,12],['A1','B1',.6,65],['A1','C1',1,95],['A2','B2',.7,70],['A2','C2',1.3,60],['B1','C1',.8,65],['B1','E1',1.1,80],['B2','C2',.6,70],['B2','E2',1.2,80],['C1','E1',.6,45],['C1','F1',.8,70],['C2','E1',.9,65],['C2','E2',.7,55],['E1','F2',.7,65],['E2','F2',1,65],['D2','B2',1.2,75],['A1','D2',.8,85],['E1','B2',1.2,75]].map(([from,to,length,wait],i)=>({id:'X'+String(i+1).padStart(2,'0'),from,to,route:null,length,speed:30,wait,congestion:1,closed:false,tau:1,bend:i%2?12:-12}));
 return [...main,...links];
}
const time=e=>e.length/(e.speed/e.congestion)*60+e.wait/60;
function evaluate(ids,edges){const es=ids.map(id=>edges.find(e=>e.id===id));return {ids:[...ids],time:es.some(e=>!e||e.closed)?Infinity:es.reduce((s,e)=>s+time(e),0),distance:es.reduce((s,e)=>s+(e?e.length:0),0)};}
function choices(node,visited,edges,alpha,beta){const es=edges.filter(e=>!e.closed&&(e.from===node||e.to===node)&&!visited.includes(e.from===node?e.to:e.from));const logs=es.map(e=>alpha*Math.log(Math.max(e.tau,1e-12))-beta*Math.log(time(e)));const max=Math.max(...logs);const weights=logs.map(v=>Math.exp(v-max));const sum=weights.reduce((a,b)=>a+b,0);return es.map((e,i)=>({id:e.id,next:e.from===node?e.to:e.from,p:weights[i]/sum,time:time(e),tau:e.tau}));}
function ant(edges,alpha,beta,rng=Math.random){let visited=['H'],ids=[],decisions=[];while(visited.at(-1)!=='D'){const node=visited.at(-1),cs=choices(node,visited,edges,alpha,beta);if(!cs.length)return {ids,nodes:visited,time:Infinity,distance:evaluate(ids,edges).distance,decisions,failed:true};let r=rng(),pick=cs.at(-1);for(const c of cs){r-=c.p;if(r<=0){pick=c;break;}}decisions.push({node,choices:cs,picked:pick.id});ids.push(pick.id);visited.push(pick.next);}return {...evaluate(ids,edges),nodes:visited,decisions,failed:false};}
function evaporate(edges,rho){edges.forEach(e=>e.tau=Math.max(1e-12,e.tau*(1-rho)));}
function reinforce(edges,ants){for(const a of ants)if(!a.failed)for(const id of a.ids)edges.find(e=>e.id===id).tau+=10/a.time;}
function iteration(edges,{count,alpha,beta,rho},rng=Math.random){const ants=Array.from({length:count},()=>ant(edges,alpha,beta,rng));evaporate(edges,rho);reinforce(edges,ants);return ants;}
function routeKey(p){return Object.entries(routes).find(([,ns])=>p?.nodes?.join(',')===ns.join(','))?.[0]??null;}
function dijkstra(edges,metric='time'){const dist={H:0},prev={},done=new Set();while(true){const u=nodes.filter(n=>!done.has(n.id)&&Number.isFinite(dist[n.id])).sort((a,b)=>dist[a.id]-dist[b.id])[0]?.id;if(!u)break;if(u==='D')break;done.add(u);for(const e of edges.filter(e=>!e.closed&&(e.from===u||e.to===u))){const v=e.from===u?e.to:e.from,alt=dist[u]+(metric==='time'?time(e):e.length);if(alt<(dist[v]??Infinity)){dist[v]=alt;prev[v]={u,id:e.id};}}}if(!Number.isFinite(dist.D))return null;let ns=['D'],ids=[],u='D';while(u!=='H'){ids.unshift(prev[u].id);u=prev[u].u;ns.unshift(u);}return {...evaluate(ids,edges),nodes:ns};}
root.ACO={nodes,routes,defaults,time,evaluate,choices,ant,iteration,evaporate,reinforce,routeKey,dijkstra};
})(typeof window==='undefined'?globalThis:window);
