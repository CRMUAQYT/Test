const App = (() => {
  const CONFIG = {
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    memories: [
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1520975743940-0b7d8e2a7c39?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1520975695144-0f2b4c3b1d6e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80"
    ],
    musicUrl: "https://cdn.pixabay.com/download/audio/2022/11/03/audio_5a3eb3c2b5.mp3?filename=lofi-study-112191.mp3",
    clickSfxUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_4b5f8c3c06.mp3?filename=click-124467.mp3",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Kok%20Tobe%2C%20Almaty"
  };

  const $ = (sel) => document.querySelector(sel);

  function safePlay(audioEl){
    if(!audioEl || !audioEl.src) return;
    try{ audioEl.play(); }catch(e){}
  }

  function setAudioDot(on){
    const dot = $("#audioDot");
    if(!dot) return;
    dot.classList.toggle("on", !!on);
  }

  function playClick(){
    const sfx = $("#sfxClick");
    if(!sfx || !sfx.src) return;
    try{ sfx.currentTime = 0; safePlay(sfx); }catch(e){}
  }

  function initAudioCommon(){
    const bgm = $("#bgm");
    const sfx = $("#sfxClick");
    if(bgm) bgm.src = CONFIG.musicUrl;
    if(sfx) sfx.src = CONFIG.clickSfxUrl;

    const shouldPlay = sessionStorage.getItem("music_on") === "1";
    if(shouldPlay && bgm){
      bgm.volume = 0.85;
      safePlay(bgm);
      setAudioDot(true);
    } else {
      setAudioDot(false);
    }
  }

  // Flowers
  function spawnFlowers(){
    const wrap = $("#flowers");
    if(!wrap) return;
    wrap.innerHTML = "";
    const icons = ["🌸","🌺","🌹","💐"];
    const count = 12;
    for(let i=0;i<count;i++){
      const el = document.createElement("div");
      el.className = "flower";
      el.textContent = icons[Math.floor(Math.random()*icons.length)];
      const left = Math.random()*100;
      const dur = 7 + Math.random()*7;
      const delay = Math.random()*6;
      const size = 0.65 + Math.random()*0.75;
      const dx = (Math.random()*60 - 30);
      el.style.left = left + "vw";
      el.style.animationDuration = dur + "s";
      el.style.animationDelay = delay + "s";
      el.style.setProperty("--s", size);
      el.style.setProperty("--x", (Math.random()*20-10) + "px");
      el.style.setProperty("--dx", dx + "px");
      wrap.appendChild(el);
    }
  }

  // Slideshow
  let slideTimer = null;
  let slideIndex = 0;

  function buildSlideshow(){
    const ss = $("#slideshow");
    if(!ss) return;
    ss.innerHTML = "";
    CONFIG.memories.forEach((url, i) => {
      const d = document.createElement("div");
      d.className = "slide" + (i===0 ? " active" : "");
      d.style.backgroundImage = `url('${url}')`;
      ss.appendChild(d);
    });
  }

  function startSlideshow(){
    const slides = Array.from(document.querySelectorAll(".slide"));
    if(!slides.length || slideTimer) return;
    slideTimer = setInterval(() => {
      slides[slideIndex].classList.remove("active");
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].classList.add("active");
    }, 5200);
  }

  // Particles
  function burstHearts(){
    const layer = $("#particles");
    const app = $("#app");
    if(!layer || !app) return;
    const rect = app.getBoundingClientRect();
    const count = 18;
    const emojis = ["💛","💕","💖","💘"];
    for(let i=0;i<count;i++){
      const p = document.createElement("div");
      p.className = "particle";
      p.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const tx = (Math.random()*180 - 90);
      const ty = -(90 + Math.random()*160);
      p.style.left = x + "px";
      p.style.top  = y + "px";
      p.style.setProperty("--tx", tx + "px");
      p.style.setProperty("--ty", ty + "px");
      layer.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
    playClick();
  }

  // Trap
  function placeNoButtonRandom(){
    const area = $("#trapArea");
    const no = $("#noBtn");
    if(!area || !no) return;
    const ar = area.getBoundingClientRect();
    const padding = 14;
    const w = no.offsetWidth || 118;
    const h = no.offsetHeight || 40;

    let x, y;
    for(let tries=0; tries<20; tries++){
      x = padding + Math.random()*(ar.width - w - padding*2);
      y = 70 + Math.random()*(ar.height - h - 140);
      const cx = ar.width/2;
      const safeZone = Math.abs((x + w/2) - cx) < 110 && (y > ar.height - 170);
      if(!safeZone) break;
    }
    no.style.left = x + "px";
    no.style.top  = y + "px";
    no.style.transform = `rotate(${(Math.random()*10-5).toFixed(2)}deg)`;
  }

  function initTrap(){
    const area = $("#trapArea");
    const no = $("#noBtn");
    if(!area || !no) return;

    placeNoButtonRandom();

    const dodge = (ev) => {
      const nr = no.getBoundingClientRect();
      const px = (ev.touches ? ev.touches[0].clientX : ev.clientX);
      const py = (ev.touches ? ev.touches[0].clientY : ev.clientY);
      const nx = nr.left + nr.width/2;
      const ny = nr.top + nr.height/2;
      const dist = Math.hypot(px - nx, py - ny);
      if(dist < 90) placeNoButtonRandom();
    };

    area.addEventListener("mousemove", dodge);
    area.addEventListener("touchstart", dodge, {passive:true});
    area.addEventListener("touchmove", dodge, {passive:true});

    no.addEventListener("click", (e) => {
      e.preventDefault();
      placeNoButtonRandom();
    });
  }

  // Scanner
  let scanning = false;
  let scanDoneTimer = null;

  function resetScannerUI(){
    scanning = false;
    const zone = $("#scanZone");
    const result = $("#scanResult");
    if(zone) zone.classList.remove("scanning");
    if(result) result.innerHTML = `<span style="color:rgba(255,255,255,.70)">Күтіп тұрмын…</span>`;
    if(scanDoneTimer){ clearTimeout(scanDoneTimer); scanDoneTimer = null; }
  }

  function startScan(){
    const zone = $("#scanZone");
    const result = $("#scanResult");
    if(!zone || !result || scanning) return;
    scanning = true;
    zone.classList.add("scanning");
    result.innerHTML = `<span style="color:rgba(255,255,255,.78)">Өлшеп жатырмын…</span>`;
    playClick();

    scanDoneTimer = setTimeout(() => {
      zone.classList.remove("scanning");
      result.innerHTML = `
        <span class="badge" style="border-color:rgba(255,211,182,.22)">
          <span style="color:rgba(255,211,182,.95);font-weight:900">Қателік!</span>
          <span style="opacity:.85">Сұлулық деңгейі шектен асып кетті —</span>
          <span style="color:rgba(232,196,106,.95);font-weight:900">Infinity %</span>
        </span>`;
      scanning = false;
    }, 1400 + Math.random()*600);
  }

  function stopScan(){
    const zone = $("#scanZone");
    const result = $("#scanResult");
    if(!zone || !result) return;
    if(!zone.classList.contains("scanning")) return;

    setTimeout(() => {
      if(zone.classList.contains("scanning")){
        zone.classList.remove("scanning");
        result.innerHTML = `<span style="color:rgba(255,255,255,.70)">Тағы да басып тұр 🙂</span>`;
        scanning = false;
      }
    }, 160);
  }

  function initScanner(){
    const zone = $("#scanZone");
    if(!zone) return;
    resetScannerUI();

    zone.addEventListener("pointerdown", (e) => { e.preventDefault(); startScan(); });
    zone.addEventListener("pointerup",   (e) => { e.preventDefault(); stopScan(); });
    zone.addEventListener("pointerleave",() => { stopScan(); });

    zone.addEventListener("touchstart", () => { startScan(); }, {passive:true});
    zone.addEventListener("touchend",   () => { stopScan(); }, {passive:true});
    zone.addEventListener("touchcancel",() => { stopScan(); }, {passive:true});
  }

  // Page inits
  function initHeroPage(){
    initAudioCommon();
    const avatar = $("#avatar");
    if(avatar) avatar.src = CONFIG.avatarUrl;
    spawnFlowers();

    const startBtn = $("#startBtn");
    const bgm = $("#bgm");

    if(startBtn){
      startBtn.addEventListener("click", () => {
        playClick();

        if(bgm){
          bgm.volume = 0.85;
          safePlay(bgm);
        }
        sessionStorage.setItem("music_on", "1");
        setAudioDot(true);

        window.location.href = "story.html";
      });
    }
  }

  function initStoryPage(){
    initAudioCommon();
    buildSlideshow();
    startSlideshow();
    const heart = $("#bigHeart");
    if(heart) heart.addEventListener("click", burstHearts);
  }

  function initTrapPage(){
    initAudioCommon();
    initTrap();
  }

  function initScannerPage(){
    initAudioCommon();
    initScanner();
  }

  function initMapPage(){
    initAudioCommon();
    const btn = $("#mapsBtn");
    if(btn) btn.href = CONFIG.mapsLink;
  }

  return { initHeroPage, initStoryPage, initTrapPage, initScannerPage, initMapPage };
})();