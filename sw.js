const CACHE="my-expense-final-v2";
const ASSETS=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(url.origin!==location.origin)return;
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(r=>{let copy=r.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy));return r}).catch(()=>caches.match("./index.html")));
  }else{
    e.respondWith(fetch(e.request).then(r=>{let copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));
  }
});