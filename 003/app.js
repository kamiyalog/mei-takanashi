"use strict";
(function(){
  const app=document.getElementById("app"),data=window.MEI_DATA;
  const TOTAL=22, KEY="mei-disappearance.viewed.v1";
  const postMap=new Map(data.posts.map(x=>[x.no,x])),recordMap=new Map(data.records.map(x=>[x.no,x]));
  let viewed=readViewed(); let sequenceToken=0;
  function readViewed(){try{const x=JSON.parse(localStorage.getItem(KEY)||"[1]");return Array.isArray(x)?[...new Set([1,...x.map(Number).filter(Number.isFinite)])]:[1]}catch{return[1]}}
  function saveViewed(){try{localStorage.setItem(KEY,JSON.stringify(viewed))}catch{}}
  function visit(no){if(!viewed.includes(no)&&no!==21&&no!==22){viewed.push(no);saveViewed()}}
  function norm(v){return v.normalize("NFKC").replace(/[\s　]+/g,"").toLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60))}
  function route(){const h=location.hash.replace(/^#\/?/,"");if(!h)return{type:"blogTop",no:1};if(h==="research")return{type:"researchTop",no:15};if(h==="end/1")return{type:"end1",no:21};if(h==="end/2")return{type:"end2",no:22};let m=h.match(/^(post|record)\/(\d+)$/);if(m)return{type:m[1],no:Number(m[2])};if(h==="ex")return{type:"ex"};return{type:"blogTop",no:1}}
  function go(hash){if(location.hash===hash){render()}else location.hash=hash}
  function escape(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  function share(text){const q=new URLSearchParams({text:`${text}\n${data.shareUrl}\n#ARG #高無メイ消失事件`});return `https://twitter.com/intent/tweet?${q}`}
  function header(research=false){const home=research?"#research":"#";return `<header class="header"><div class="header-inner"><a class="brand-link" href="${home}"><span class="brand">${research?"観測ページ":"今までとこれから"}</span><span class="subtitle">${research?"OBSERVATION LOG":"TAKANASHI MEI / ARCHIVE"}</span></a><form class="search" data-search="${research?"research":"blog"}"><input aria-label="検索ワード" placeholder="検索ワードを入力" autocomplete="off"><button>検索</button></form></div></header>`}
  function footer(no){return `<footer class="footer"><div class="page-count">${no} / ${TOTAL}</div><div>このサイトはフィクションです</div></footer>`}
  function shell(main,no,research=false){return `<div class="site ${research?"research":""}">${header(research)}<main class="content">${main}</main>${footer(no)}</div>${historyButton()}`}
  function historyButton(){return `<button class="history-toggle" aria-label="閲覧したページ" title="閲覧したページ">☷</button><aside class="history" hidden><h2>閲覧したページ</h2>${viewed.slice().sort((a,b)=>a-b).map(historyLink).join("")}<button class="history-reset">閲覧履歴をリセット</button></aside>`}
  function historyLink(no){if(no===1)return`<a href="#"><b>1/22</b><span>高無メイの今までとこれから</span></a>`;if(no===15)return`<a href="#research"><b>15/22</b><span>怪異観測実験記録ページ</span></a>`;const p=postMap.get(no);if(p)return`<a href="#post/${no}"><b>${no}/22</b><span>${escape(p.title)}</span></a>`;const r=recordMap.get(no);if(r)return`<a href="#record/${no}"><b>${no}/22</b><span>${escape(r.title)}</span></a>`;return""}
  function blogTop(){const cards=data.posts.filter(x=>x.no<=13).map(p=>`<a class="post-card" href="#post/${p.no}"><time>${p.date}</time><h3>${escape(p.title)}</h3><span class="read-more">続きを読む</span></a>`).join("");const locked=`<button class="post-card locked-card" data-locked><time>2026.09.13</time><h3><span aria-hidden="true">🔒</span> 本当のこと。</h3><span class="read-more">パスワードを入力して読む</span></button>`;return shell(`<div class="blog-layout"><section class="blog-main"><div class="top-heading"><p>ARTICLE ARCHIVE</p><h2>記事一覧</h2></div><div class="post-list">${cards}${locked}</div></section><aside class="profile-card"><img src="./assets/mei-blog.jpg" alt="高無メイ"><h2>高無メイ</h2><p>今まで作ってきたものと、<br>これからのことを残す場所。</p><div class="profile-rule"></div><small>ゲーム制作 / ARG / 記録</small></aside></div>`,1)}
  function applyClues(p){let body=p.body;if(p.clues)for(const value of p.clues)body=body.replace(String(value),`<span class="clue">${value}</span>`);return body.replace("[[SHARE_FAKE]]\n\n\n\n",`<a class="share" href="${share("それじゃ、ばいばい。")}" target="_blank" rel="noopener">𝕏　報告する</a><span class="long-reveal-gap" aria-hidden="true"></span>`).replace("[[SHARE_FAKE]]",`<a class="share" href="${share("それじゃ、ばいばい。")}" target="_blank" rel="noopener">𝕏　報告する</a>`)}
  function articleNav(no,research=false){const min=research?16:2,max=research?19:14,home=research?"#research":"#";const item=n=>research?recordMap.get(n):postMap.get(n);const link=(n,label)=>{if(n<min||n>max)return`<span class="article-nav-item disabled">${label}</span>`;if(!research&&n===14)return`<button class="article-nav-item" data-locked>${label}<small>${escape(item(n).title)}</small></button>`;if(research&&!viewed.includes(n))return`<span class="article-nav-item disabled">${label}<small>未確認</small></span>`;return`<a class="article-nav-item" href="#${research?"record":"post"}/${n}">${label}<small>${escape(item(n).title)}</small></a>`};return `<nav class="article-nav">${link(no-1,"← 前の記事")}<a class="article-nav-home" href="${home}">TOPへ</a>${link(no+1,"次の記事 →")}</nav>`}
  function article(p,research=false){return shell(`<article class="article fade-in"><time class="post-date">${p.date||"????/??/??"}</time><h2 class="article-title">${escape(p.title)}</h2><div class="article-body">${applyClues(p)}</div>${articleNav(p.no,research)}</article>`,p.no,research)}
  function researchTop(){const rows=data.records.filter(r=>r.no===16||viewed.includes(r.no)).map(r=>`<a class="record-row" href="#record/${r.no}"><b>FILE ${String(r.no).padStart(2,"0")}</b><span>${escape(r.title)}</span></a>`).join("");return shell(`<section class="research-index"><div class="top-heading"><p>OBSERVATION ARCHIVE</p><h2>観測記録</h2></div><div class="record-index">${rows}</div></section>`,15,true)}
  function showNotice(message,research){app.innerHTML=shell(`<div class="notice error">${escape(message)}</div>`,research?15:1,research);bind()}
  function requestPassword(){const modal=document.createElement("div");modal.className="modal";modal.innerHTML=`<div class="modal-box"><div class="lock-symbol">🔒</div><h2>この記事は保護されています</h2><p>何回目で、何番目？</p><input type="text" aria-label="パスワード" autocomplete="off" placeholder="パスワードを入力"><div class="notice error" hidden></div><div class="modal-actions"><button data-close>戻る</button><button class="primary" data-enter>記事を開く</button></div></div>`;document.body.append(modal);const input=modal.querySelector("input"),err=modal.querySelector(".notice");const check=()=>{const n=norm(input.value);if(n==="かいいかんそくじっけん"||n==="怪異観測実験"){modal.remove();go("#post/14")}else{err.textContent="パスワードが違います。";err.hidden=false}};modal.querySelector("[data-close]").onclick=()=>modal.remove();modal.querySelector("[data-enter]").onclick=check;input.onkeydown=e=>{if(e.key==="Enter")check()};input.focus()}
  function doSearch(scope,value){const n=norm(value);if(!n)return;
    if(scope==="blog"){
      if(n==="怪異観測実験記録ぺーじ"||n==="かいいかんそくじっけんきろくぺーじ"){go("#research");return}
      showNotice("該当する記事は見つかりませんでした。",false);return;
    }
    const rec=data.records.find(r=>r.key&&norm(r.key)===n);
    if(rec){go(`#record/${rec.no}`);return}
    if(n===norm("高無メイ")&&viewed.includes(19)){startFinal();return}
    if(data.ex.key.some(k=>norm(k)===n)){go("#ex");return}
    showNotice("該当する観測記録はありません。",true)
  }
  function bind(){document.querySelectorAll("form[data-search]").forEach(f=>f.onsubmit=e=>{e.preventDefault();doSearch(f.dataset.search,f.querySelector("input").value)});document.querySelectorAll("[data-locked]").forEach(x=>x.onclick=requestPassword);const t=document.querySelector(".history-toggle"),h=document.querySelector(".history");if(t&&h)t.onclick=()=>h.hidden=!h.hidden;const reset=document.querySelector(".history-reset");if(reset)reset.onclick=()=>{if(confirm("閲覧履歴をリセットしますか？")){viewed=[1];saveViewed();go("")}}}
  function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
  async function typeLine(box,text,red=false,speed=46,token){const line=document.createElement("div");if(red)line.className="red";box.append(line);for(const ch of text){if(token!==sequenceToken)return false;line.textContent+=ch;await sleep(speed)}box.append(document.createElement("br"));return true}
  async function startFinal(){visit(20);history.replaceState(null,"","#record/20");const token=++sequenceToken;document.title="これを見ている貴方へ。";app.innerHTML=shell(`<article class="article final-article fade-in"><time class="post-date">????/??/??</time><h2 class="article-title">これを見ている貴方へ。</h2><div class="article-body terminal"></div></article>`,20,true);bind();const box=app.querySelector(".terminal");const normal=["ここまで見てくれてありがとう。","一人歩きを始めた高無メイはもう止められない。","きっとこのチャンスを逃したら、高無メイは本当の怪異となって、","無限に増え続ける。","だからこれを押して終わらせてくれる？"];
    for(const x of normal){if(!await typeLine(box,x,false,145,token))return;await sleep(850)}
    const btn=document.createElement("button");btn.className="end-button";btn.textContent="終わらせる";btn.onclick=()=>{sequenceToken++;go("#end/1")};box.append(btn);
    for(const x of ["きっと、もうチャンスはない。","お願い。","早く。"]){if(!await typeLine(box,x,false,145,token))return;await sleep(850)}
    await sleep(6000);if(token!==sequenceToken)return;
    for(const x of ["……あれ？","まだ消してないんだ。","消さないの？","そんなに私と一緒にいたかった？","なんてね？","でも、そっか。","そっかそっか。","じゃあボタン消しちゃうね？","えいっ！"]){if(!await typeLine(box,x,true,82,token))return;await sleep(360)}
    btn.remove();
    for(const x of ["嬉しいな。","私が存在することを認めてくれるんだ。","じゃあ、ずっと一緒にいてね？","あ、こんな画面、もういらないね？","えーっと……","えいっ！"]){if(!await typeLine(box,x,true,82,token))return;app.querySelector(".site").classList.add("crumble");await sleep(420)}
    await sleep(900);if(token===sequenceToken)go("#end/2")
  }
  function endScreen(type){const is1=type===1;document.title=is1?"高無メイは消去されました。":"ずーっと、一緒だよ？";return `<div class="end-screen ${is1?"":"red"}"><div><div class="page-count">${is1?21:22} / 22</div><h1>${is1?"高無メイは消去されました。":"ずーっと、一緒だよ？"}</h1><a class="share" target="_blank" rel="noopener" href="${share(is1?"高無メイは消去されました。":"ずっと一緒。")}">𝕏　結果を共有する</a></div></div>`}
  function render(){sequenceToken++;const r=route();if(r.no)visit(r.no);scrollTo(0,0);
    if(r.type==="blogTop")app.innerHTML=blogTop();else if(r.type==="researchTop")app.innerHTML=researchTop();else if(r.type==="post"&&postMap.has(r.no))app.innerHTML=article(postMap.get(r.no));else if(r.type==="record"&&r.no===20){startFinal();return}else if(r.type==="record"&&recordMap.has(r.no))app.innerHTML=article(recordMap.get(r.no),true);else if(r.type==="ex")app.innerHTML=shell(`<article class="article warning"><time class="post-date">????/??/??</time><h2 class="article-title">${data.ex.title}</h2><div class="article-body">${data.ex.body}</div></article>`,15,true);else if(r.type==="end1")app.innerHTML=endScreen(1);else if(r.type==="end2")app.innerHTML=endScreen(2);else app.innerHTML=blogTop();bind()}
  addEventListener("hashchange",render);render();
})();
