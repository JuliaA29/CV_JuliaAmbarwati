// Animasi: tirai halaman, kursor bintang, ketik, geser masuk, progress, parallax
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>[...r.querySelectorAll(s)];
// 1. Tirai buka/tutup saat pindah halaman
const cur=$('.curtain')[0];
const open=()=>setTimeout(()=>cur.classList.add('open'),150);
if(cur&&!reduce){addEventListener('load',open);addEventListener('pageshow',e=>e.persisted&&open());
 $('a[href$=".html"]').forEach(a=>a.addEventListener('click',e=>{
  if(a.target||e.ctrlKey||e.metaKey||a.href===location.href)return;
  e.preventDefault();cur.classList.remove('open');setTimeout(()=>location.href=a.href,700)}))}
// 2. Judul hero jatuh huruf per huruf
const h=$('.hero h1')[0];
if(h&&!reduce){const t=h.textContent;h.setAttribute('aria-label',t);h.innerHTML=[...t].map((c,i)=>`<span aria-hidden="true" style="animation-delay:${.9+i*.05}s">${c===' '?'&nbsp;':c}</span>`).join('')}
// 3. Efek mengetik
const ty=$('.typing')[0];
if(ty){const w=ty.dataset.words.split('|');let i=0,j=0,d=false;
 if(reduce)ty.textContent=w[0];else(function tick(){const s=w[i];ty.textContent=s.slice(0,j);
  if(!d&&j===s.length){d=true;return setTimeout(tick,1600)}
  if(d&&j===0){d=false;i=(i+1)%w.length}j+=d?-1:1;setTimeout(tick,d?35:70)})()}
// 4. Muncul dari kiri/kanan/bawah, progress bar + hitung angka
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;el.classList.add('show');
 if(el.classList.contains('progress')){const b=el.firstElementChild,n=el.previousElementSibling.lastElementChild,to=parseInt(el.dataset.w);
  b.style.width=el.dataset.w;let v=0;const st=setInterval(()=>{v+=2;n.textContent=Math.min(v,to)+'%';v>=to&&clearInterval(st)},25)}
 io.unobserve(el)}),{threshold:.15});
if(!reduce)$('.panel,.card,.tl-item,.progress').forEach((el,k)=>{
 const p=el.closest('[class*=col-]'),row=p&&p.parentElement;
 el.classList.add('reveal');if(p&&row.children.length>1&&!el.closest('.card')&&!el.matches('.tl-item,.progress')){const d=p===row.firstElementChild?'from-l':p===row.lastElementChild?'from-r':'';if(d)el.classList.add(d)};
 el.style.transitionDelay=(k%4)*90+'ms';
 if(el.matches('.progress')){const b=el.firstElementChild;el.dataset.w=b.style.width;b.style.width='0'}
 io.observe(el)});
// 5. Scroll: bar atas, navbar, tombol ke atas, parallax banner
const nav=$('.navbar')[0],up=document.getElementById('up'),bar=document.createElement('div');bar.id='bar';document.body.prepend(bar);
const hero=$('.hero')[0]||$('.page-head')[0];
const onS=()=>{const y=scrollY,m=document.documentElement.scrollHeight-innerHeight;
 bar.style.width=(m>0?y/m*100:0)+'%';nav.classList.toggle('scrolled',y>60);up.classList.toggle('on',y>400);
 if(hero&&!reduce)hero.style.backgroundPositionY=`calc(50% + ${y*.25}px)`};
addEventListener('scroll',onS,{passive:true});onS();up.onclick=()=>scrollTo({top:0,behavior:'smooth'});
// 6. Ripple pada tombol
$('.btn').forEach(b=>b.addEventListener('click',e=>{const r=b.getBoundingClientRect(),s=document.createElement('span'),z=Math.max(r.width,r.height);
 s.className='ripple';s.style.cssText=`width:${z}px;height:${z}px;left:${e.clientX-r.left-z/2}px;top:${e.clientY-r.top-z/2}px`;b.append(s);setTimeout(()=>s.remove(),600)}));
// 7. Kursor: cincin pengikut, jejak bintang, ledakan saat klik, parallax ornamen
if(matchMedia('(pointer:fine)').matches&&!reduce){
 const ring=document.createElement('div');ring.className='cur';document.body.append(ring);
 let mx=-99,my=-99,x=-99,y=-99,last=0,big=false;const C=['#c9a45c','#f7a8b8','#9fc3e8','#f4c95d'];
 const star=(px,py,dx,dy)=>{const s=document.createElement('span');s.className='star';s.textContent='✦';
  s.style.cssText=`left:${px}px;top:${py}px;color:${C[Math.random()*4|0]};--dx:${dx}px;--dy:${dy}px`;document.body.append(s);setTimeout(()=>s.remove(),900)};
 addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;const n=Date.now();
  if(n-last>55){last=n;star(mx,my,(Math.random()-.5)*30,25+Math.random()*30)}
  $('.orn').forEach((o,i)=>{o.style.translate=`${(innerWidth/2-mx)*.02*(i%3+1)}px ${(innerHeight/2-my)*.02*(i%3+1)}px`})});
 addEventListener('mouseover',e=>big=!!e.target.closest('a,button,input,textarea'));
 addEventListener('click',e=>{for(let i=0;i<12;i++){const a=i/12*6.283;star(e.clientX,e.clientY,Math.cos(a)*70,Math.sin(a)*70)}});
 (function f(){x+=(mx-x)*.18;y+=(my-y)*.18;ring.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%) scale(${big?1.7:1})`;ring.classList.toggle('big',big);requestAnimationFrame(f)})()}
// 8. Gelembung pastel melayang, hitung angka, sticker lompat saat diklik
if(!reduce){const C=['#9fc3e8','#f7a8b8','#f4c95d','#b9d6a8','#c9b6e8'];
 for(let i=0;i<12;i++){const b=document.createElement('i');b.className='bub';const z=24+Math.random()*60;
  b.style.cssText=`width:${z}px;height:${z}px;left:${Math.random()*100}%;--c:${C[i%5]};--t:${16+Math.random()*16}s;--x:${(Math.random()-.5)*120}px;animation-delay:${-Math.random()*20}s`;document.body.append(b)}}
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,to=+el.dataset.to;let v=0;
 const t=setInterval(()=>{el.textContent=++v;v>=to&&clearInterval(t)},reduce?1:160);co.unobserve(el)}));
$('.count').forEach(c=>co.observe(c));
const pk=$('.peek')[0];if(pk)pk.onclick=()=>{pk.classList.remove('jump');void pk.offsetWidth;pk.classList.add('jump')};
