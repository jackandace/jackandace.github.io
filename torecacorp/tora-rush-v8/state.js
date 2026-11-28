/* TORAMI RUSH v8（1オリパで全レート対応・既存の景品登録を再利用）
   ・景品はS〜その他の「通常景品」に「何かのPSA」を倍率で登録。当たったら「何かのPSA（キリのいいpt）」を発送するか、そのptに交換するかを選ぶ
   ・個数はレート帯ごとに3列（〜5万／10万〜30万／50万〜）。合計＝そのレートの口数。BOXはレートごとに自動で分かれる
   ・Sの「隠しキリ番景品」に実物カードを何個でも登録（対象レート・キリ番・倍率）。その番目の口と入れ替えて排出
   ・完売したら同じ内容で自動補充（再販） */
(function(){
const band=(g,r)=>r<=g.bands[0]?0:r<=g.bands[1]?1:2;
const ALLR=[500,1000,2000,3000,5000,10000,20000,30000,50000,100000,200000,300000,500000,750000,1000000];
const LS="toraRush.v8";
const NOTICE="表示している還元率は、BOX全体（1周分）の設計値です。BOXはレートごとに用意し、販売開始時に全口をシャッフルしています。販売中のBOXでは上位の景品がすでに排出されている場合があります。一部の景品は、キリ番（決まった順番）で排出されます。完売したBOXは同じ内容で自動的に補充（再販）されます。";
// 景品（倍率）と、レート帯ごとの個数 [〜5万, 10万〜30万, 50万〜]
const ROWS=[["S",30,[1,0,0]],["A",10,[6,1,0]],["A",5,[15,1,1]],["B",3,[40,4,2]],["B",2,[90,8,5]],["C",1,[280,33,18]],["D",0.5,[298,28,14]],["その他",0.3,[270,25,10]]];
function mkGacha(id,charge){return{id,name:charge?"TORAMI RUSH GOLD":"TORAMI RUSH",charge:!!charge,pub:true,
  rates:charge?[5000]:ALLR.slice(),bands:[50000,300000],
  prizes:ROWS.map(([rank,m,q])=>({rank,m,q:q.slice()})),
  kiri:charge?[{rate:5000,card:"リザードン SAR",cond:"PSA10",m:30,no:800,stock:1}]:[
    {rate:5000,card:"リザードン SAR",cond:"PSA10",m:30,no:800,stock:2},
    {rate:10000,card:"ブラッキー SAR",cond:"PSA10",m:30,no:700,stock:1},
    {rate:50000,card:"ルギア V SA",cond:"PSA10",m:30,no:900,stock:1},
    {rate:100000,card:"マリオピカチュウ",cond:"PSA10",m:10,no:80,stock:1},
    {rate:1000000,card:"ポケモンイラストレーター",cond:"PSA",m:5,no:40,stock:1}]}}
// レート→帯（0,1,2）
// 何かのPSA：交換pt（キリのいい数字）。SCOREを「上2桁が0か5」で切り上げ → 上振れが上限を超えるときだけ細かくする
function niceCeil(x,cap){if(x<=0)return 0;cap=cap==null?15:cap;const d=Math.pow(10,Math.floor(Math.log10(x))-1);
  for(const k of [d*5,d,d/10]){const v=Math.round(Math.ceil(x/k-1e-9)*k);if((v/x-1)*100<=cap+1e-9)return v}return x}
// 全RUSHオリパ・全販売レートで出うるSCORE（レート×倍率、個数>0のもの）
function allScores(gachas){const m=new Map();gachas.forEach(g=>g.rates.forEach(r=>{const bi=band(g,r);g.prizes.forEach(p=>{if((p.q[bi]||0)>0){const sc=Math.round(r*p.m);if(!m.has(sc))m.set(sc,[]);m.get(sc).push({g:g.id,r,m:p.m})}})}));return m}
function genLineup(gachas,cap,min){min=min||0;return[...allScores(gachas).keys()].filter(x=>x>=min).sort((a,b)=>a-b)}
// 全部pt交換したときの還元率（レートごと）
function exRet(vals,min,g,r){const bi=band(g,r);let N=0,E=0;g.prizes.forEach(p=>{const q=p.q[bi]||0;if(!q)return;const sc=Math.round(r*p.m),v=sc<min?sc:(vals.find(x=>x>=sc)||sc);N+=q;E+=q*v});return N?E/N/r:0}
// ラインナップ自動作成：キリのいい数字に切り上げ → 全部交換でも還元率が上限（初期99%）を超えるレートは、そのレートのSCOREをぴったりで追加
// v8.1：SCOREと交換ptは完全一致（切り上げ・上振れなし）。ラインナップ＝出うるSCOREそのもの
function genLineupOld(gachas,cap,min,maxRet){min=min||0;maxRet=maxRet||0.99;let vals=[...new Set([...allScores(gachas).keys()].filter(x=>x>=min).map(x=>niceCeil(x,cap)))].sort((a,b)=>a-b);
  gachas.forEach(g=>g.rates.forEach(r=>{if(exRet(vals,min,g,r)<=maxRet+1e-9)return;const bi=band(g,r);
    g.prizes.filter(p=>(p.q[bi]||0)>0).map(p=>Math.round(r*p.m)).filter(sc=>sc>=min).sort((a,b)=>b-a).forEach(sc=>{if(exRet(vals,min,g,r)>maxRet+1e-9&&!vals.includes(sc)){vals.push(sc);vals.sort((a,b)=>a-b)}})}));
  return vals}
// 景品の種類（交換ptの下限ごと）。名前が空＝ポイントのみ（自動付与）
const TIERS=[[0,"何かのR"],[1000,"何かのAR"],[3000,"何かのSR"],[5000,"何かのSAR"],[10000,"何かのPSA"]];
const tierMin=t=>{const x=t.find(r=>r[1]);return x?x[0]:Infinity};
function defState(){const gs=[mkGacha(1201),mkGacha(1202,true)];return{v:8,psa:{name:"何かのカード",cap:0,fixed:{},tiers:TIERS.map(r=>r.slice()),min:tierMin(TIERS),vals:genLineup(gs,0,tierMin(TIERS))},scnw:[10,10,10,10,10,10,10,10,10,10,6,6],revFake:12,freezeP:25,notice:NOTICE,gachas:gs,boxes:{},rounds:[],hist:[],acc:{}}}
function load(){try{const s=JSON.parse(localStorage.getItem(LS));if(s&&s.v===8&&s.gachas&&s.psa&&s.psa.tiers&&s.psa.fixed)return s}catch(e){}return defState()}
function save(s){try{localStorage.setItem(LS,JSON.stringify(s))}catch(e){}}
function reset(){try{localStorage.removeItem(LS)}catch(e){}}
// レート→帯（0,1,2）
// SCORE → 何かのPSAの交換pt（ラインナップのうちSCORE以上で一番小さいもの）
// 下限未満のSCOREはptで自動付与（何かのPSAにしない）
const psaFor=(st,score)=>score<(st.psa.min||0)?null:score;
// 交換pt → 景品名（何かのAR／SR／SAR／PSA）
const psaName=(st,v)=>{if(st.psa.fixed&&st.psa.fixed[v])return st.psa.fixed[v];let n="";st.psa.tiers.forEach(([f,nm])=>{if(v>=f)n=nm});return n};
window.RS={exRet,tierMin,psaName,ALLR,LS,NOTICE,defState,load,save,reset,mkGacha,ROWS,band,niceCeil,allScores,genLineup,psaFor};
})();
