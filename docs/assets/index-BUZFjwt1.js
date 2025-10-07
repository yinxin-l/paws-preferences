(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}})();const d=document.getElementById("app");let u=[],l=0,o=[];async function p(s,e){try{const r=await fetch(`https://cataas.com/api/cats?limit=${s}&tags=${e}`);if(!r.ok)throw new Error(`Fetch failed: ${r.status}`);return(await r.json()).map(t=>({id:t.id,url:`https://cataas.com/cat/${t.id}`,tags:t.tags??[]}))}catch(r){return console.error("Error fetching cats",r),[]}}function h(s){return new Promise((e,r)=>{const i=new Image;i.src=s,i.onload=()=>e(i),i.onerror=r})}async function m(){if(l>=u.length){g();return}const s=u[l];d.innerHTML=`
    <h1 class="title">Paws & Preferences</h1>
    <p class="note">
        &#x1F448; Swipe left to <span class="dislike-text">Dislike</span> <br>
        Swipe right to <span class="like-text">Like</span> &#x1F449;
    </p>
    <div class="cat-container">
      <div class="spinner"></div>
    </div>
    <div class="buttons">
      <button id="dislikeBtn">&#x1F44E;</button>
      <button id="likeBtn">&#x2764;&#xFE0F;</button>
    </div>
  `;const e=document.querySelector(".cat-container"),r=document.getElementById("likeBtn"),i=document.getElementById("dislikeBtn"),t=await h(s.url);e.innerHTML="",e.appendChild(t),r.addEventListener("click",()=>a("right")),i.addEventListener("click",()=>a("left"));let n=0;e.addEventListener("touchstart",c=>n=c.touches[0].clientX),e.addEventListener("touchend",c=>{const f=c.changedTouches[0].clientX;f-n>50?a("right"):n-f>50&&a("left")});function a(c){t.style.transition="transform 0.5s ease, opacity 0.5s ease",t.style.transform=c==="right"?"translateX(100vw) rotate(20deg)":"translateX(-100vw) rotate(-20deg)",t.style.opacity="0",setTimeout(()=>{c==="right"&&o.push(s),l++,m()},500)}}function g(){if(!o.length){d.innerHTML="<h1>You didn't like any cat.</h1>";return}d.innerHTML=`
    <h1>You liked ${o.length} cats!</h1>
    <div class="cat-gallery">
      ${o.map(e=>`<img class="summary-cat" src="${e.url}" alt="cat ${e.id}" />`).join("")}
    </div>
  `,document.querySelectorAll(".summary-cat").forEach(e=>{e.addEventListener("click",()=>y(e.src))})}function y(s){const e=document.createElement("div");e.className="overlay",e.innerHTML=`<img src="${s}" class="enlarged-cat" />`,document.body.appendChild(e),e.addEventListener("click",r=>{r.target===e&&e.remove()})}async function v(){if(u=await p(10,"cute"),!u.length){d.innerHTML="<p>Sorry, no cats available.</p>";return}l=0,o=[],m()}v();
