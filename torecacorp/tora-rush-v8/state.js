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
function genLineup(gachas,cap){return[...new Set([...allScores(gachas).keys()].map(x=>niceCeil(x,cap)))].sort((a,b)=>a-b)}
function defState(){const gs=[mkGacha(1201),mkGacha(1202,true)];return{v:8,psa:{name:"何かのPSA",cap:15,vals:genLineup(gs,15)},scnw:[10,10,10,10,10,10,10,10,10,10,6,6],revFake:12,freezeP:25,notice:NOTICE,gachas:gs,boxes:{},rounds:[],hist:[],acc:{}}}
function load(){try{const s=JSON.parse(localStorage.getItem(LS));if(s&&s.v===8&&s.gachas&&s.psa)return s}catch(e){}return defState()}
function save(s){try{localStorage.setItem(LS,JSON.stringify(s))}catch(e){}}
function reset(){try{localStorage.removeItem(LS)}catch(e){}}
// レート→帯（0,1,2）
// SCORE → 何かのPSAの交換pt（ラインナップのうちSCORE以上で一番小さいもの）
const psaFor=(st,score)=>st.psa.vals.find(v=>v>=score)||null;
window.RS={ALLR,LS,NOTICE,defState,load,save,reset,mkGacha,ROWS,band,niceCeil,allScores,genLineup,psaFor};
})();
