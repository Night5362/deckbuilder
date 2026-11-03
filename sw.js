var VER='rb-v2',IMG='rb-img-v1',SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(VER).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VER&&k!==IMG}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('message',function(e){if(e.data==='skip')self.skipWaiting()});
function net(r){return new Promise(function(ok,no){var t=setTimeout(no,5000);fetch(r.url,{cache:'no-cache'}).then(function(x){clearTimeout(t);ok(x)},function(e){clearTimeout(t);no(e)})})}
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
if(u.origin===location.origin){e.respondWith(net(r).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(VER).then(function(c){c.put(r,cp)})}return res}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('index.html')})}));return}
if(r.destination==='image'){e.respondWith(caches.open(IMG).then(function(c){return c.match(r).then(function(m){return m||fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res})})}))}});
