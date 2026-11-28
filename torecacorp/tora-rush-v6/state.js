/* TORAMI RUSH v6：管理画面モック（admin.html）とプロト（index.html）で共有する設定・BOXの状態。
   同じブラウザの localStorage に保存するので、管理画面で作った・変えた内容がプロトにそのまま反映される（デモ用） */
(function(){
const ALLR=[500,1000,2000,3000,5000,10000,20000,30000,50000,100000,200000,300000,500000,750000,1000000];
const LS="toraRush.v6";
const NOTICE="表示している還元率は、BOX全体（1周分）の設計値です。BOXは販売開始時に全口をシャッフルしており、販売中のBOXでは上位の倍率がすでに排出されている場合があります。完売したBOXは同じ内容で自動的に再販されます。";
const f=(card,cond,pt,stock)=>({card,cond,name:card+" "+cond,pt,stock});
function defState(){return{v:1,
 tables:{t1000:[[30,1],[10,6],[5,15],[3,40],[2,90],[1,280],[0.5,298],[0.3,270]],t100:[[10,1],[5,1],[3,4],[2,8],[1,33],[0.5,28],[0.3,25]],t50:[[5,1],[3,2],[2,5],[1,18],[0.5,14],[0.3,10]]},
 bands:[{max:50000,t:"t1000"},{max:300000,t:"t100"},{max:null,t:"t50"}],
 tiers:[10000,20000,30000,50000,70000,100000,150000,200000,300000,500000,700000,1000000,1500000,2000000,3000000,5000000,10000000,30000000].map(v=>({v,card:(v>=1000000?"PSA10 ハイクラス（":"PSA10 相当（")+(v/10000).toLocaleString()+"万帯）",stock:v>=5000000?1:v>=1000000?2:v>=300000?5:v>=100000?10:30,alt:v>=1000000?1:v>=100000?5:20,warn:v>=1000000?1:v>=100000?3:10})),
 scnw:[10,10,10,10,10,10,10,10,10,10,6,6],revFake:12,freezeP:25,notice:NOTICE,newsMin:5,
 gachas:[{id:1073,name:"TORAMI RUSH",charge:false,pub:true,sell:ALLR.slice(),feat:[f("マリオピカチュウ","PSA10",1000000,1),f("リザードン SAR","PSA10",150000,1),f("ピカチュウ SAR","PSA10",50000,2),f("ミュウ AR","PSA10",15000,3)]},
         {id:1074,name:"TORAMI RUSH GOLD",charge:true,pub:false,sell:[5000],feat:[f("リザードン SAR","PSA10",150000,1)]}],
 boxes:{},rounds:[],hist:[],acc:{}}}
const OLDN="表示している還元率・最大倍率・倍率の表は、BOX全体（1周分）の設計値です。BOXは販売開始時に全口をシャッフルしており、販売中のBOXでは上位の倍率がすでに排出されている場合があります。完売したBOXは同じ内容で自動的に再販されます。";
function load(){try{const s=JSON.parse(localStorage.getItem(LS));if(s&&s.v===1&&s.gachas&&s.tables){if(s.notice===OLDN)s.notice=NOTICE;while(s.scnw.length<12)s.scnw.push(6);if(s.revFake==null)s.revFake=12;if(s.freezeP==null)s.freezeP=25;return s}}catch(e){}return defState()}
function save(s){try{localStorage.setItem(LS,JSON.stringify(s))}catch(e){}}
function reset(){try{localStorage.removeItem(LS)}catch(e){}}
window.RS={ALLR,LS,NOTICE,defState,load,save,reset};
})();
