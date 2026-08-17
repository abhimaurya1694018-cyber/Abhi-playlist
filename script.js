const playlists=[
 {id:"party",name:"Bhojpuri Party",desc:"Desi party mode • nonstop energy",img:"images/bg-1.jpg",url:"https://youtube.com/playlist?list=RDCLAK5uy_n7VIYx-oWOJQanlpBG6GRyLZxpWYMltB8&playnext=1",yt:null},
 {id:"energy",name:"Bhojpuri Energy Booster",desc:"High-energy Bhojpuri picks",img:"images/bg-2.jpg",url:"https://youtube.com/playlist?list=RDCLAK5uy_ltBUnE76-ol1ufdgUWN4T7WtFljvu8gYM&playnext=1",yt:null},
 {id:"bhojpuri",name:"Bhojpuri Hits",desc:"Your Bhojpuri favourites",img:"images/bg-3.jpg",url:"https://youtube.com/playlist?list=PLXzuhrtrzRpEQAewoF4HvqjnoO8TPcSJk",yt:"PLXzuhrtrzRpEQAewoF4HvqjnoO8TPcSJk"},
 {id:"90s1",name:"90s Hindi Hits",desc:"Bollywood memories from the 90s",img:"images/bg-4.jpg",url:"https://youtube.com/playlist?list=PLMRKdK25AuPVjHl9Kdb-gkBy0Cm7Zi2xo",yt:"PLMRKdK25AuPVjHl9Kdb-gkBy0Cm7Zi2xo"},
 {id:"90s2",name:"90s Hindi Hits • 2",desc:"Another 90s collection",img:"images/bg-5.jpg",url:"https://youtube.com/playlist?list=PLAFjPVdERAkt7jNU1XW7EWXHLyYyf7Sux",yt:"PLAFjPVdERAkt7jNU1XW7EWXHLyYyf7Sux"},
 {id:"vevo1",name:"Vevo Playlist 1",desc:"Music videos • Vevo",img:"images/bg-1.jpg",url:"https://youtube.com/playlist?list=PLDIoUOhQQPlWt8OpaGG43OjNYuJ2q9jEN",yt:"PLDIoUOhQQPlWt8OpaGG43OjNYuJ2q9jEN"},
 {id:"vevo2",name:"Vevo Playlist 2",desc:"More Vevo favourites",img:"images/bg-2.jpg",url:"https://youtube.com/playlist?list=PLesm76O8GFZMRacpw0JaW8oBq7gzlyS7L",yt:"PLesm76O8GFZMRacpw0JaW8oBq7gzlyS7L"}
];

const bgPool=["images/bg-1.jpg","images/bg-2.jpg","images/bg-3.jpg","images/bg-4.jpg","images/bg-5.jpg"];
const $=s=>document.querySelector(s);
let current=2,player=null,ytReady=false,startY=0,shuffle=false,repeat=false,raf=null;

function randomBackground(force=false){
 const last=sessionStorage.getItem("abhiLastBg");
 const choices=bgPool.filter(x=>force||x!==last);
 const img=choices[Math.floor(Math.random()*choices.length)]||bgPool[0];
 sessionStorage.setItem("abhiLastBg",img);
 const b=$("#backdrop");
 b.classList.add("changing");
 setTimeout(()=>{b.style.backgroundImage=`url("${img}")`;b.classList.remove("changing")},120);
}
function cardHTML(p,i){return `<button class="card ${i===current?"selected":""}" data-id="${p.id}"><img src="${p.img}" alt=""><span class="cardShade"></span><span class="cardText"><small>PLAYLIST</small><strong>${p.name}</strong></span></button>`}
function render(){
 $("#playlistRail").innerHTML=playlists.slice(0,5).map(cardHTML).join("");
 $("#allGrid").innerHTML=playlists.map(cardHTML).join("");
 document.querySelectorAll(".card").forEach(el=>el.onclick=()=>openPlaylist(el.dataset.id));
 const p=playlists[current];$("#featuredImg").src=p.img;$("#featuredTitle").textContent=p.name;$("#featuredDesc").textContent=p.desc;
}
function openPlaylist(id){
 const p=playlists.find(x=>x.id===id);if(!p)return;
 current=playlists.indexOf(p);render();
 $("#listenPanel").classList.add("open");$("#listenPanel").setAttribute("aria-hidden","false");
 $("#listenImg").src=p.img;$("#playerTitle").textContent=p.name;$("#playerDesc").textContent=p.desc;
 $("#playerCategory").textContent=p.yt?"YOUTUBE PLAYLIST":"YOUTUBE MIX";
 $("#openYT").onclick=()=>window.open(p.url,"_blank","noopener,noreferrer");
 if(p.yt){
   $("#sourceHint").textContent="Playback is powered by the official YouTube player and remains inside this page.";
   loadYouTube(p.yt);
 }else{
   destroyPlayer();
   $("#sourceHint").textContent="This is a YouTube Mix. Use the YouTube button to open the mix; standard playlists play here.";
   $("#ytPlayer").innerHTML=`<div class="mixPlaceholder"><span>YOUTUBE MIX</span><strong>Open this mix on YouTube</strong><button id="mixOpen">Open ↗</button></div>`;
   $("#mixOpen").onclick=()=>window.open(p.url,"_blank","noopener,noreferrer");
 }
}
function closePlayer(){pause();$("#listenPanel").classList.remove("open");$("#listenPanel").setAttribute("aria-hidden","true")}
function openDrawer(){$("#drawer").classList.add("open");$("#drawer").setAttribute("aria-hidden","false")}
function closeDrawer(){$("#drawer").classList.remove("open");$("#drawer").setAttribute("aria-hidden","true")}
function destroyPlayer(){if(player){try{player.destroy()}catch(e){}player=null}}
function loadYouTube(list){
 destroyPlayer();$("#ytPlayer").innerHTML="";
 if(window.YT&&window.YT.Player){createPlayer(list)}else{window.pendingList=list}
}
function createPlayer(list){
 player=new YT.Player("ytPlayer",{width:"100%",height:"200",playerVars:{listType:"playlist",list:list,playsinline:1,rel:0,modestbranding:1,iv_load_policy:3,enablejsapi:1},events:{onReady:onPlayerReady,onStateChange:onStateChange,onError:onPlayerError}})
}
window.onYouTubeIframeAPIReady=()=>{ytReady=true;if(window.pendingList)createPlayer(window.pendingList)};
function onPlayerReady(){setVolume();updateUI();}
function onStateChange(e){
 const s=e.data;
 $("#playBtn").textContent=s===1?"❚❚":"▶";
 if(s===1){$("#listenPanel").classList.add("playing");startProgress()}else{$("#listenPanel").classList.remove("playing");stopProgress()}
 if(s===0 && repeat){try{player.playVideoAt(0)}catch(_) {}}
}
function onPlayerError(){toast("This video cannot play in the embedded player.")}
function play(){if(!player)return toast("Open a standard YouTube playlist first");try{player.playVideo()}catch(_) {}}
function pause(){if(player)try{player.pauseVideo()}catch(_) {}}
function toggle(){if(!player)return toast("Open a standard YouTube playlist first");const s=player.getPlayerState();s===1?pause():play()}
function next(){if(player)try{shuffle?player.setShuffle(true):player.setShuffle(false);player.nextVideo()}catch(_){} }
function prev(){if(player)try{player.previousVideo()}catch(_){} }
function seek(){if(!player)return;const d=player.getDuration();player.seekTo((+$("#seek").value/100)*d,true)}
function setVolume(){if(player)try{player.setVolume(+$("#volume").value)}catch(_) {}}
function updateUI(){if(!player)return;try{const d=player.getDuration(),t=player.getCurrentTime();$("#seek").value=d?(t/d)*100:0;$("#elapsed").textContent=fmt(t);$("#total").textContent=fmt(d)}catch(_) {}}
function startProgress(){stopProgress();const tick=()=>{updateUI();raf=requestAnimationFrame(tick)};tick()}
function stopProgress(){if(raf)cancelAnimationFrame(raf);raf=null;updateUI()}
function fmt(s){s=Number(s)||0;return Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0")}
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>x.classList.remove("show"),1600)}
function ripple(x,y){const r=document.createElement("span");r.className="ripple";r.style.left=x+"px";r.style.top=y+"px";$("#touchFx").appendChild(r);setTimeout(()=>r.remove(),700)}

$("#menuBtn").onclick=openDrawer;$("#seeAll").onclick=openDrawer;$("#closeBtn").onclick=closeDrawer;$("#closePlayer").onclick=closePlayer;$("#featuredPlay").onclick=()=>openPlaylist(playlists[current].id);$("#randomBtn").onclick=()=>randomBackground(true);$("#homeBtn").onclick=()=>window.scrollTo({top:0,behavior:"smooth"});
$("#playBtn").onclick=toggle;$("#nextBtn").onclick=next;$("#prevBtn").onclick=prev;$("#seek").onchange=seek;$("#volume").oninput=setVolume;
$("#shuffleBtn").onclick=()=>{shuffle=!shuffle;$("#shuffleBtn").classList.toggle("active",shuffle);if(player)try{player.setShuffle(shuffle)}catch(_){}toast(shuffle?"Shuffle on":"Shuffle off")};
$("#repeatBtn").onclick=()=>{repeat=!repeat;$("#repeatBtn").classList.toggle("active",repeat);toast(repeat?"Repeat on":"Repeat off")};
window.addEventListener("pointerdown",e=>ripple(e.clientX,e.clientY),{passive:true});
window.addEventListener("pointermove",e=>{const g=$("#cursorGlow");g.style.left=e.clientX+"px";g.style.top=e.clientY+"px";g.style.opacity=.7},{passive:true});
window.addEventListener("touchstart",e=>startY=e.touches[0].clientY,{passive:true});
window.addEventListener("touchend",e=>{const dy=e.changedTouches[0].clientY-startY;if(Math.abs(dy)>90){const nextIndex=dy<0?(current+1)%playlists.length:(current-1+playlists.length)%playlists.length;openPlaylist(playlists[nextIndex].id)}},{passive:true});

randomBackground();render();
const ytScript=document.createElement("script");ytScript.src="https://www.youtube.com/iframe_api";document.head.appendChild(ytScript);
