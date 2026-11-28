/* TORAMI RUSH v8（1オリパで全レート対応・既存の景品登録を再利用）
   ・景品はS〜その他の「通常景品」に PTカード を倍率で登録（交換ポイント＝レート×倍率を自動計算）
   ・個数はレート帯ごとに3列（〜5万／10万〜30万／50万〜）。合計＝そのレートの口数。BOXはレートごとに自動で分かれる
   ・Sの「隠しキリ番景品」に実物カードを何個でも登録（対象レート・キリ番・倍率）。その番目の口と入れ替えて排出
   ・完売したら同じ内容で自動補充（再販） */
(function(){
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
function defState(){return{v:8,scnw:[10,10,10,10,10,10,10,10,10,10,6,6],revFake:12,freezeP:25,notice:NOTICE,gachas:[mkGacha(1201),mkGacha(1202,true)],boxes:{},rounds:[],hist:[],acc:{}}}
function load(){try{const s=JSON.parse(localStorage.getItem(LS));if(s&&s.v===8&&s.gachas)return s}catch(e){}return defState()}
function save(s){try{localStorage.setItem(LS,JSON.stringify(s))}catch(e){}}
function reset(){try{localStorage.removeItem(LS)}catch(e){}}
// レート→帯（0,1,2）
const band=(g,r)=>r<=g.bands[0]?0:r<=g.bands[1]?1:2;
window.RS={ALLR,LS,NOTICE,defState,load,save,reset,mkGacha,ROWS,band};
})();
