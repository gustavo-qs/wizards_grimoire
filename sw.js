if(!self.define){let e,n={};const s=(s,i)=>(s=new URL(s+".js",i).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(n[o])return;let d={};const t=e=>s(e,o),c={module:{uri:o},exports:d,require:t};n[o]=Promise.all(i.map((e=>c[e]||t(e)))).then((e=>(r(...e),d)))}}define(["./workbox-32a34f02"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-B3kOS8VM.css",revision:null},{url:"assets/index-BTp74jOr.js",revision:null},{url:"icons8-dungeons-and-dragons-240.png",revision:"e00de7f05cc760c38c37c7c9afe85f7f"},{url:"icons8-dungeons-and-dragons-480.png",revision:"ded00a8b63854a574d170387a0f73524"},{url:"icons8-dungeons-and-dragons-color-16.ico",revision:"9ad1c37ef1d5af03da6d122d4ba16626"},{url:"index.html",revision:"7b3368878af4deb7952006efe8b31c0a"},{url:"registerSW.js",revision:"9dace1ae11db86cd64d4595e54f48afb"},{url:"robots.txt",revision:"cd9cd94aaa699e0a16e692b6bb16f672"},{url:"manifest.webmanifest",revision:"450239b7f47c6df7423107af9a3b226e"}],{}),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
