/* TORAMI RUSH v7（既存ガチャ登録型）：管理画面モック（admin.html）とプロト（index.html）で共有する設定・BOXの状態。
   v7は「通常のガチャ登録と同じ」形：1オリパ＝1レート。景品をS〜その他にPTで賞分けし、個数＝口数。
   S＝最大倍率の排出カード（実物・キリ番設定可）／A〜その他＝PTカード（オート補充・ポイント付与）。完売で同じ内容を自動補充（再販）。 */
(function(){
const ALLR=[500,1000,2000,3000,5000,10000,20000,30000,50000,100000,200000,300000,500000,750000,1000000];
const LS="toraRush.v7";
const NOTICE="表示している還元率は、BOX全体（1周分）の設計値です。BOXは販売開始時に全口をシャッフルしており、販売中のBOXでは上位の景品がすでに排出されている場合があります。最上位の景品は、キリ番（決まった順番）で排出される場合があります。完売したBOXは同じ内容で自動的に補充（再販）されます。";
// 倍率の表（還元率97.5%）をランクに振り分けた初期値
const T1000=[["S",30,1],["A",10,6],["A",5,15],["B",3,40],["B",2,90],["C",1,280],["D",0.5,298],["その他",0.3,270]];
const T100=[["S",10,1],["A",5,1],["B",3,4],["B",2,8],["C",1,33],["D",0.5,28],["その他",0.3,25]];
const T50=[["S",5,1],["A",3,2],["B",2,5],["C",1,18],["D",0.5,14],["その他",0.3,10]];
const SCARD={500:"ピカチュウ AR",1000:"イーブイ SAR",5000:"リザードン SAR",10000:"ブラッキー SAR",50000:"ルギア V SA",100000:"マリオピカチュウ",1000000:"ポケモンイラストレーター"};
function mkBox(id,rate,charge){const T=rate>=500000?T50:rate>=100000?T100:T1000;const N=T.reduce((a,b)=>a+b[2],0);
  return{id,name:(charge?"TORAMI RUSH GOLD":"TORAMI RUSH")+"（"+rate.toLocaleString()+"）",rate,charge:!!charge,pub:true,
    prizes:T.map(([rank,m,q])=>rank==="S"?{rank,card:SCARD[rate]||"PSA10 目玉カード",cond:"PSA10",pt:Math.round(m*rate),qty:q,kiri:Math.round(N*0.8),stock:2}:{rank,card:"PTカード",cond:"",pt:Math.round(m*rate),qty:q,auto:true})}}
function defState(){return{v:7,
 scnw:[10,10,10,10,10,10,10,10,10,10,6,6],revFake:12,freezeP:25,notice:NOTICE,
 gachas:[mkBox(1101,500),mkBox(1102,1000),mkBox(1103,5000),mkBox(1104,10000),mkBox(1105,50000),mkBox(1106,100000),mkBox(1107,1000000),mkBox(1110,5000,true)],
 boxes:{},rounds:[],hist:[],acc:{}}}
function load(){try{const s=JSON.parse(localStorage.getItem(LS));if(s&&s.v===7&&s.gachas)return s}catch(e){}return defState()}
function save(s){try{localStorage.setItem(LS,JSON.stringify(s))}catch(e){}}
function reset(){try{localStorage.removeItem(LS)}catch(e){}}
window.RS={ALLR,LS,NOTICE,defState,load,save,reset,mkBox,T1000,T100,T50};
})();
